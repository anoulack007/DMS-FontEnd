import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { DOCUMENT_DETAIL_PATH } from "../../../routes/paths";
import axiosInstance from "../../../configs/axios";
import Swal from "sweetalert2";
import { STATUS_ENUMS } from "../../../enums/status-enum";
import {
  DELETE_FOLDER_END_POINT,
  RESTORE_FOLDER_END_POINT,
} from "../../../configs/endPoint/folder-endpoint";
import { IconType } from "../../../enums/icon-enums";
import { GET_ALL_RECYCLE_BIN_END_POINT } from "../../../configs/endPoint/recycle-bin-endpoint";
import { RecycleBinDocument } from "../../../models/recycle-bin-model";
import {
  DELETE_FILE_PERMANENT_END_POINT,
  RESTORE_FILE_END_POINT,
} from "../../../configs/endPoint/files-endpoint";
import { ErrorResponse } from "../../../utils/functions/Error";
import { ErrorModel } from "../../../models/Error";

type SortField = "name" | "modified" | "size" | "status";

interface Document {
  id: string;
  name: string;
  path: string;
  documentId: string;
  modified: string;
  size: string;
  type: IconType;
  status: STATUS_ENUMS;
  isFolder: boolean;
  parentId: string;
  isPinned: boolean;
  isDelete: boolean;
  createdAt: string;
  updatedAt: string;
}

interface DateRangeFilter {
  startDate: Date | null;
  endDate: Date | null;
}

const UseMainController = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Pagination states
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [dateFilter, setDateFilter] = useState<DateRangeFilter>({
    startDate: null,
    endDate: null,
  });

  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [filterAnchorEl, setFilterAnchorEl] = useState<{
    [key in SortField]?: HTMLElement | null;
  }>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [documents, setDocuments] = useState<RecycleBinDocument[]>([]);
  const [filteredDocuments, setFilteredDocuments] = useState<
    RecycleBinDocument[]
  >([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedDocument, setSelectedDocument] =
    useState<RecycleBinDocument | null>(null);
  const [collapeOpen, setCollapseOpen] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [renameDialogOpen, setRenameDialogOpen] = useState<boolean>(false);
  const [inviteDialogOpen, setInviteDialogOpen] = useState<boolean>(false);
  const [shareDialogOpen, setShareDialogOpen] = useState<boolean>(false);

  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const searchDelay = 500; // 500ms delay

  // Pagination handlers
  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Get paginated data
  const getPaginatedData = () => {
    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return filteredDocuments.slice(startIndex, endIndex);
  };

  const handleDetailsClick = () => {
    if (selectedDocument) {
      setCollapseOpen(true);
      setSearchParams({ docId: selectedDocument.id, action: "collapse" });
    }
  };

  const handleFolderClick = (e: React.MouseEvent, doc: Document) => {
    e.preventDefault();
    navigate(`${DOCUMENT_DETAIL_PATH}/${doc.id}`);
  };

  const handleDrawerClose = () => {
    setCollapseOpen(false);
  };

  const handleGetData = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await axiosInstance.get(GET_ALL_RECYCLE_BIN_END_POINT);

      const documents = [
        ...(res?.data?.data?.deletedFile
          ? Object.values(res?.data?.data?.deletedFile).map((file: any) => ({
              id: file?.id,
              name: file?.name,
              documentId: file?.id,
              owner: {
                name: file?.owner?.name || "N/A",
                company: file?.owner?.company,
                email: file?.owner?.email,
              },
              updatedAt: file?.updatedAt,
              createdAt: file?.createdAt,
              type: file?.type,
              size: file?.size || null,
            }))
          : []),
        ...(res?.data?.data?.deletedFolders
          ? res?.data?.data?.deletedFolders.map((folder: any) => ({
              id: folder?.id,
              name: folder?.name,
              documentId: folder?.documentId,
              owner: {
                name: folder?.owner?.name || "N/A",
                company: folder?.owner?.company,
                email: folder?.owner?.email,
              },
              updatedAt: folder?.updatedAt,
              createdAt: folder?.createdAt,
              type: "folder",
              size: null,
            }))
          : []),
      ];

      // Sort by createdAt in descending order (newest first)
      const sortedDocuments = documents.sort((a, b) => {
        // Make sure to handle possible undefined createdAt values
        const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0);
        const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
        return dateB.getTime() - dateA.getTime(); // Descending order (newest to oldest)
      });

      setDocuments(sortedDocuments);
      setFilteredDocuments(sortedDocuments);
    } catch (error) {
      console.error("API error:", error);
      setError("An error occurred while fetching data");
    } finally {
      setLoading(false);
    }
  };

  // Search function to filter documents by name or documentId
  const handleSearch = (searchValue: any) => {
    setSearchTerm(searchValue);
    // We'll apply the search filter in the effect hook below
  };

  // Date filter handler
  const handleDateFilterChange = (newDateFilter: DateRangeFilter) => {
    setDateFilter(newDateFilter);
    applyFilters(searchTerm, newDateFilter);
  };

  // Apply all filters (search term and date range)
  const applyFilters = (search: string, dates: DateRangeFilter) => {
    let filtered = [...documents];

    // Apply search filter
    if (search.trim() !== "") {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(
        (doc) =>
          doc.name.toLowerCase().includes(searchLower) ||
          doc.documentId.toLowerCase().includes(searchLower)
      );
    }

    // Apply date filter
    if (dates.startDate || dates.endDate) {
      filtered = filtered.filter((doc) => {
        const docDate = doc.createdAt ? new Date(doc.createdAt) : null;

        if (!docDate) return false;

        if (dates.startDate && dates.endDate) {
          // Set end date to end of day for inclusive range
          const endDateAdjusted = new Date(dates.endDate);
          endDateAdjusted.setHours(23, 59, 59, 999);
          return docDate >= dates.startDate && docDate <= endDateAdjusted;
        } else if (dates.startDate) {
          return docDate >= dates.startDate;
        } else if (dates.endDate) {
          // Set end date to end of day for inclusive range
          const endDateAdjusted = new Date(dates.endDate);
          endDateAdjusted.setHours(23, 59, 59, 999);
          return docDate <= endDateAdjusted;
        }

        return true;
      });
    }

    setFilteredDocuments(filtered);
    setPage(0); // Reset to first page when filters change
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchTerm("");
    setDateFilter({ startDate: null, endDate: null });
    setFilteredDocuments(documents);
    setPage(0);
  };

  // Enhanced selection handlers
  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    const currentPageItems = getPaginatedData();
    if (event.target.checked) {
      setSelectedItems(currentPageItems.map((doc) => doc.id));
      setSelectedDocument(currentPageItems[0]); // Select first document of current page
    } else {
      setSelectedItems([]);
      setSelectedDocument(null);
    }
  };

  const handleSelectItem = (id: string) => {
    const doc = documents.find((document) => document.id === id);

    setSelectedItems((prev) => {
      const newSelection = prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id];

      // Update selected document based on selection
      if (doc) {
        if (!prev.includes(id)) {
          setSelectedDocument(doc);
        } else if (newSelection.length > 0) {
          const nextDoc = documents.find((d) => d.id === newSelection[0]);
          setSelectedDocument(nextDoc || null);
        } else {
          setSelectedDocument(null);
        }
      }

      return newSelection;
    });
  };

  const isSelected = (id: string) => selectedItems.includes(id);

  const handleFilterClick = (
    event: React.MouseEvent<HTMLElement>,
    field: SortField
  ) => {
    setFilterAnchorEl({ ...filterAnchorEl, [field]: event.currentTarget });
  };

  const handleFilterClose = (field: SortField) => {
    setFilterAnchorEl({ ...filterAnchorEl, [field]: null });
  };

  const handleDelete = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    const result = await Swal.fire({
      title: "ທ່ານແນ່ໃຈບໍ່?",
      text: "ຄຳສັ່ງນີ້ຈະລຶບລາຍການດັ່ງກ່າວອອກຖາວອນ.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "ລຶບ",
      cancelButtonText: "ຍົກເລີກ",
    });

    if (result.isConfirmed) {
      try {
        const endpoint =
          selectedDocument?.type === "folder"
            ? `${DELETE_FOLDER_END_POINT}/${selectedDocument?.id}`
            : `${DELETE_FILE_PERMANENT_END_POINT}/${selectedDocument?.id}`;

        await axiosInstance.delete(endpoint);

        await Swal.fire({
          icon: "success",
          title: "ລຶບແລ້ວ!",
          text: "ລາຍການດັ່ງກ່າວໄດ້ຖືກລຶບຖິ້ມແລ້ວ.",
        });

        handleGetData();
        setSelectedDocument(null);
        setSelectedItems([]);
      } catch (error) {
        console.error(error);
        await Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "ລຶບລາຍການບໍ່ສຳເລັດ. ກະລຸນາລອງອີກຄັ້ງ.",
        });
      }
    }
  };

  const handleRestore = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    const result = await Swal.fire({
      title: "ທ່ານແນ່ໃຈບໍ່?",
      text: "ການປະຕິບັດນີ້ຈະກູ້ຄືນໄຟລ໌.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "ກູ້ຄືນ",
      cancelButtonText: "ຍົກເລີກ",
    });

    if (result.isConfirmed) {
      try {
        const endpoint =
          selectedDocument?.type === "folder"
            ? RESTORE_FOLDER_END_POINT
            : RESTORE_FILE_END_POINT;

        const data =
          selectedDocument?.type === "folder"
            ? { folderId: selectedDocument?.id }
            : { fileId: selectedDocument?.id };

        await axiosInstance.post(endpoint, data);

        await Swal.fire({
          icon: "success",
          title: "ກູ້ຄືນແລ້ວ!",
          text: "ໄຟລ໌ໄດ້ຖືກກູ້ຄືນຢ່າງສໍາເລັດແລ້ວ.",
        });

        handleGetData();
        setSelectedDocument(null);
        setSelectedItems([]);
      } catch (error) {
        ErrorResponse(error as ErrorModel);
      }
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, searchDelay);

    return () => clearTimeout(timer);
  }, [searchTerm, searchDelay]);

  // Update the filter effect
  useEffect(() => {
    applyFilters(debouncedSearchTerm, dateFilter);
  }, [debouncedSearchTerm, dateFilter, documents]);

  useEffect(() => {
    handleGetData();
  }, []);

  useEffect(() => {
    const action = searchParams.get("action");
    setCollapseOpen(action === "collapse");
  }, [searchParams]);

  return {
    // Pagination
    page,
    rowsPerPage,
    handleChangePage,
    handleChangeRowsPerPage,
    getPaginatedData,

    // Search and filter
    searchTerm,
    setSearchTerm,
    handleSearch,
    dateFilter,
    setDateFilter,
    handleDateFilterChange,
    resetFilters,
    filteredDocuments,

    // Existing returns
    shareDialogOpen,
    setShareDialogOpen,
    inviteDialogOpen,
    setInviteDialogOpen,
    setIsSubmitting,
    isSubmitting,
    setRenameDialogOpen,
    renameDialogOpen,
    collapeOpen,
    setCollapseOpen,
    searchParams,
    setSearchParams,
    selectedDocument,
    loading,
    error,
    documents,
    selectedItems,
    setDocuments,
    filterAnchorEl,
    isSelected,
    handleSelectAll,
    handleSelectItem,
    handleFilterClick,
    handleFilterClose,
    handleDrawerClose,
    handleFolderClick,
    handleDetailsClick,
    handleDelete,
    handleRestore,
  };
};

export default UseMainController;
