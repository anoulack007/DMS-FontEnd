import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { DOCUMENT_DETAIL_PATH } from "../../../routes/paths";
import axiosInstance from "../../../configs/axios";
import Swal from "sweetalert2";
import { STATUS_ENUMS } from "../../../enums/status-enum";
import { IconType } from "../../../enums/icon-enums";
import { FollowDocumentModel } from "../../../models/follow-document";
import { GET_ALL_FOLLOW_DOCUMENT_END_POINT } from "../../../configs/endPoint/follow-documnet-endpoint";
import { DELETE_FOLLOW_DOC } from "../../../configs/endPoint/files-endpoint";

type SortField = "name" | "modified" | "size" | "status";
type SortOrder = "asc" | "desc";

interface Document {
  id: string;
  name: string;
  path: string;
  documentId: string;
  modified: string;
  size: string;
  type: IconType;
  itemType: string;
  status: STATUS_ENUMS;
  url: string;
  isFolder: boolean;
  parentId: string;
  isPinned: boolean;
  isDelete: boolean;
  createdAt: string;
  updatedAt: string;
  event: string;
  followDocument: FollowDocumentModel;
  docName: string;
  ownerName: string;
  company: string;
}
interface RootState {
  auth: {
    data: {
      name?: string;
    } | null;
    loggedIn: boolean;
  };
}

const UseMainController = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Get user data from Redux
  const userData = useSelector((state: RootState) => state.auth.data);
  const currentUserName = userData?.name;

  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [filterAnchorEl, setFilterAnchorEl] = useState<{
    [key in SortField]?: HTMLElement | null;
  }>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(
    null
  );
  const [collapeOpen, setCollapseOpen] = useState<boolean>(false);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [allDocuments, setAllDocuments] = useState<Document[]>([]);

  const [newName, setNewName] = useState<string>(null!);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [renameDialogOpen, setRenameDialogOpen] = useState<boolean>(false);
  const [inviteDialogOpen, setInviteDialogOpen] = useState<boolean>(false);
  const [email, setEmail] = useState<string>(null!);
  const [eventFilter, setEventFilter] = useState<string>("");

  // Tab state
  const [activeTab, setActiveTab] = useState<string>("all");

  const handleTabChange = (_event: React.SyntheticEvent, newValue: string) => {
    setActiveTab(newValue);
    setPage(0);
    setSelectedItems([]); 
    setCollapseOpen(false); 
    setSearchParams({}); 
  };

  const handleEventFilterChange = (value: string) => {
    setEventFilter(value);
    setPage(0);

    // Get the base documents based on active tab
    const baseDocuments = getFilteredDocumentsByTab();
    
    const filtered = value
      ? baseDocuments.filter((doc) => doc.event === value)
      : baseDocuments;

    setTotalCount(filtered.length);

    const paginatedDocs = filtered.slice(0, rowsPerPage);
    setDocuments(paginatedDocs);
  };

  const getFilteredDocumentsByTab = () => {
    if (activeTab === "my" && currentUserName) {
      return allDocuments.filter((doc) => doc.ownerName === currentUserName);
    }
    return allDocuments;
  };

  const handleGetData = async () => {
    try {
      setLoading(true);

      let endpoint = GET_ALL_FOLLOW_DOCUMENT_END_POINT;
      
      if (activeTab === "my" && currentUserName) {
        endpoint = `/Follow-docs/${encodeURIComponent(currentUserName)}`;
      }

      const response = await axiosInstance.get(endpoint);

      if (response?.data) {
        const allDocs = response.data.data || [];
        
        if (activeTab === "all") {
          setAllDocuments(allDocs);
        }
        
        const filteredDocs = getFilteredDocumentsByTab();
        setTotalCount(filteredDocs.length);

        const paginatedDocs = filteredDocs.slice(
          page * rowsPerPage,
          page * rowsPerPage + rowsPerPage
        );
        setDocuments(paginatedDocs);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to fetch documents");
    } finally {
      setLoading(false);
    }
  };

  // Handle page change
  const handleChangePage = (
    _event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); 
  };

  const handleDetailsClick = () => {
    if (selectedItems) {
      setCollapseOpen(true);
      setSearchParams({ docId: selectedItems[0], action: "collapse" });
    } else {
      console.log("No document selected.");
    }
  };

  const handleFolderClick = (e: React.MouseEvent, doc: Document) => {
    e.preventDefault();
    navigate(`${DOCUMENT_DETAIL_PATH}/${doc.id}`);
  };

  const handleDrawerClose = () => {
    setCollapseOpen(false);
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedItems(documents.map((doc) => doc.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (id: string) => {
    const doc = documents.find((document) => document.id === id);

    setSelectedItems((prev) => {
      const newSelection = prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [id];

      if (doc) {
        setSelectedDocument(newSelection.length > 0 ? doc : null);
      }

      return newSelection;
    });
  };

  const isSelected = (id: string) => selectedItems.includes(id);

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }

    const baseDocuments = getFilteredDocumentsByTab();
    
    const sortedDocuments = [...baseDocuments].sort((a, b) => {
      if (a[field] < b[field]) return sortOrder === "asc" ? -1 : 1;
      if (a[field] > b[field]) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    const paginatedDocs = sortedDocuments.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    );
    setDocuments(paginatedDocs);
  };

  const handleFilterClick = (
    event: React.MouseEvent<HTMLElement>,
    field: SortField
  ) => {
    setFilterAnchorEl({ ...filterAnchorEl, [field]: event.currentTarget });
  };

  const handleFilterClose = (field: SortField) => {
    setFilterAnchorEl({ ...filterAnchorEl, [field]: null });
  };

  const handleFilter = (field: SortField, value: string) => {
    let filteredDocuments = getFilteredDocumentsByTab();

    switch (field) {
      case "modified":
        break;
      case "size":
        break;
      case "status":
        filteredDocuments = filteredDocuments.filter((doc) => doc.status === value);
        break;
    }

    setTotalCount(filteredDocuments.length);

    setPage(0);

    const paginatedDocs = filteredDocuments.slice(0, rowsPerPage);
    setDocuments(paginatedDocs);

    handleFilterClose(field);
  };

  const handleDeleteFolder = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    const result = await Swal.fire({
      title: "ທ່ານແນ່ໃຈບໍ່?",
      text: "ຄຳສັ່ງນີ້ຈະລຶບລາຍການດັ່ງກ່າວອອກຖາວອນ.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "ຕົກລົງ",
      cancelButtonText: "ຍົກເລີກ",
    });

    if (result.isConfirmed) {
      try {
        await axiosInstance.delete(
          `${DELETE_FOLLOW_DOC}/${selectedDocument?.id}`
        );

        await Swal.fire({
          icon: "success",
          title: "ລົບສຳເລັດ!",
          text: `ເອກະສານຖືກລົບສຳເລັດ.`,
        });

        handleGetData();
      } catch (error) {
        console.error("Delete error:", error);
        await Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "ລົບເອກະສານບໍ່ສຳເລັດ, ກະລຸນາລອງໃໝ່ອີກຄັ້ງ",
        });
      }
    }
  };

  const handleChangeName = (value: string) => {
    setNewName(value);
  };

  useEffect(() => {
    if (currentUserName || activeTab === "all") {
      handleGetData();
    }
  }, [activeTab, currentUserName]);

  useEffect(() => {
    const action = searchParams.get("action");
    setCollapseOpen(action === "collapse");

    if (selectedItems.length === 0) {
      setCollapseOpen(false);
      const newParams = new URLSearchParams(searchParams);
      newParams.delete("action");
      newParams.delete("docId");
      setSearchParams(newParams);
    }
  }, [searchParams, selectedItems]);

  useEffect(() => {
    if (allDocuments.length > 0) {
      let baseDocuments = getFilteredDocumentsByTab();
      
      const filtered = eventFilter
        ? baseDocuments.filter((doc) => doc.event === eventFilter)
        : baseDocuments;

      setTotalCount(filtered.length);

      const paginatedDocs = filtered.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      );
      setDocuments(paginatedDocs);
    }
  }, [page, rowsPerPage, allDocuments, eventFilter, activeTab]);

  return {
    page,
    rowsPerPage,
    totalCount,
    handleChangePage,
    handleChangeRowsPerPage,
    email,
    handleChangeEmail: (value: string) => setEmail(value),
    inviteDialogOpen,
    setInviteDialogOpen,
    setIsSubmitting,
    isSubmitting,
    newName,
    setRenameDialogOpen,
    renameDialogOpen,
    collapeOpen,
    setCollapseOpen,
    searchParams,
    setSearchParams,
    selectedDocument,
    loading,
    error,
    sortOrder,
    sortField,
    documents,
    selectedItems,
    setDocuments,
    filterAnchorEl,
    isSelected,
    handleSelectAll,
    handleSelectItem,
    handleSort,
    handleFilterClick,
    handleFilterClose,
    handleFilter,
    handleDrawerClose,
    handleFolderClick,
    handleDetailsClick,
    handleChangeName,
    handleDeleteFolder,
    eventFilter,
    handleEventFilterChange,
    // New tab-related exports
    activeTab,
    handleTabChange,
  };
};

export default UseMainController;