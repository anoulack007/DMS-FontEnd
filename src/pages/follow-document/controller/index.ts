import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { DOCUMENT_DETAIL_PATH } from "../../../routes/paths";
import axiosInstance from "../../../configs/axios";
import Swal from "sweetalert2";
import { STATUS_ENUMS } from "../../../enums/status-enum";
import { ErrorResponse } from "../../../utils/functions/Error";
import { ErrorModel } from "../../../models/Error";
import {
  INVITE_MEMBER_FOLDER_END_POINT,
  UPDATE_FOLDER_END_POINT,
} from "../../../configs/endPoint/folder-endpoint";
import { IconType } from "../../../enums/icon-enums";
import {
  DELETE_FILE_END_POINT,
  DELETE_FOLDER_END_POINT,
  INVITE_MEMBER_FILE_END_POINT,
  UPDATE_FILE_END_POINT,
} from "../../../configs/endPoint/files-endpoint";
import { FollowDocumentModel } from "../../../models/follow-document";
import { GET_ALL_FOLLOW_DOCUMENT_END_POINT } from "../../../configs/endPoint/follow-documnet-endpoint";

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

const UseMainController = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [filterAnchorEl, setFilterAnchorEl] = useState<{
    [key in SortField]?: HTMLElement | null;
  }>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [error, _setError] = useState<string | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(
    null
  );
  const [collapeOpen, setCollapseOpen] = useState<boolean>(false);

  // const [status, setStatus] = useState<STATUS_ENUMS>()
  const [newName, setNewName] = useState<string>(null!);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [renameDialogOpen, setRenameDialogOpen] = useState<boolean>(false);
  const [inviteDialogOpen, setInviteDialogOpen] = useState<boolean>(false);
  const [shareDialogOpen, setShareDialogOpen] = useState<boolean>(false);
  const [email, setEmail] = useState<string>(null!);

  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [totalDocuments, setTotalDocuments] = useState<number>(0);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0); // Reset to first page when changing rows per page
  };

  const handleGetData = async () => {
    try {
      setLoading(true);
      // Calculate skip based on current page and rows per page
      const skip = page * rowsPerPage;
      
      const response = await axiosInstance.get(
        GET_ALL_FOLLOW_DOCUMENT_END_POINT,
        {
          params: {
            skip: skip,
            take: rowsPerPage
          }
        }
      );

      if (response?.data) {
        // Update documents array with new data
        setDocuments(response.data.data || []);
        // Update total count from backend
        setTotalDocuments(response.data.total || 0);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDetailsClick = () => {
    if (selectedItems) {
      setCollapseOpen(true); // Open the collapse
      setSearchParams({ docId: selectedItems[0], action: "collapse" });
    } else {
      console.log("No document selected.");
    }
  };

  const handleFolderClick = (e: React.MouseEvent, doc: Document) => {
    e.preventDefault();
    // Navigate to new page with document ID
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
        : [id]; // Change to single selection

      // Update selected document based on selection
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

    const sortedDocuments = [...documents].sort((a, b) => {
      if (a[field] < b[field]) return sortOrder === "asc" ? -1 : 1;
      if (a[field] > b[field]) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
    setDocuments(sortedDocuments);
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
    let filteredDocuments = [...documents];

    switch (field) {
      case "modified":
        // Implement date filtering logic
        break;
      case "size":
        // Implement file size filtering logic
        break;
      case "status":
        filteredDocuments = documents.filter((doc) => doc.status === value);
        break;
    }

    setDocuments(filteredDocuments);
    handleFilterClose(field);
  };

  const handleDeleteFolder = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action will permanently delete the item.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        const isFolder = selectedDocument?.type === "folder";

        let endPoint;
        let payload;

        if (isFolder) {
          endPoint = DELETE_FOLDER_END_POINT;
          payload = { folderId: selectedDocument?.id };
        } else {
          endPoint = DELETE_FILE_END_POINT;
          payload = { fileId: selectedDocument?.id };
        }

        // Send POST request with payload
        const res = await axiosInstance.post(endPoint, payload);
        console.log(res?.data?.data);

        await Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: `The ${
            isFolder ? "folder" : "file"
          } has been deleted successfully.`,
        });
      } catch (error) {
        console.error("Delete error:", error);
        await Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Failed to delete item. Please try again.",
        });
      }
    }
  };

  const handleRenameFolder = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    setRenameDialogOpen(false);

    if (!selectedDocument) {
      await Swal.fire({
        icon: "warning",
        title: "No Document Selected",
        text: "Please select a document to rename the folder.",
      });
      return;
    }

    if (!newName || newName.trim() === "") {
      await Swal.fire({
        icon: "warning",
        title: "Invalid Name",
        text: "Please enter a valid name for the folder.",
      });
      return;
    }

    // Show confirmation dialog first
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Do you really want to rename the folder to "${newName}"?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, rename it!",
      cancelButtonText: "No, keep it",
    });

    // If the user cancels, do nothing
    if (!result.isConfirmed) {
      return;
    }

    try {
      setIsSubmitting(true);

      let endPoint;

      if (selectedDocument.itemType === "folder") {
        endPoint = `${UPDATE_FOLDER_END_POINT}/${selectedDocument.id}`;
      } else {
        endPoint = `${UPDATE_FILE_END_POINT}/${selectedDocument.id}`;
      }

      const res = await axiosInstance.patch(endPoint, {
        name: newName,
      });

      // Update the selected document with the new data from the API response
      setSelectedDocument(res.data);

      await Swal.fire({
        icon: "success",
        title: "Folder Renamed!",
        text: `The folder has been renamed to "${newName}" successfully.`,
      });
    } catch (error) {
      console.error(error);
      ErrorResponse(error as ErrorModel);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChangeName = (value: string) => {
    setNewName(value);
  };

  const handleShare = async () => {
    try {
      // const res = await axiosInstance.post(`${CREATE_FOLDER_END_POINT}/${selectedDocument?.id}/share`, {
      // })
    } catch (error) {}
  };

  const handleIviteMember = async () => {
    setInviteDialogOpen(false);

    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "Do you want to invite this member?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, invite!",
        cancelButtonText: "Cancel",
      });

      if (result.isConfirmed) {
        Swal.fire({
          title: "Sending Invite...",
          text: "Please wait while the invite is being sent.",
          icon: "info",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });

        let endpoint;
        let payload;

        if (selectedDocument?.type === "folder") {
          endpoint = INVITE_MEMBER_FOLDER_END_POINT;
          payload = {
            folderId: selectedDocument?.id,
            email: email,
          };
        } else {
          endpoint = INVITE_MEMBER_FILE_END_POINT;
          payload = {
            fileId: selectedDocument?.id,
            email: email,
          };
        }

        // Simulating API call with axios
        await axiosInstance.post(endpoint, payload);

        Swal.fire({
          title: "Success!",
          text: "Member has been successfully invited.",
          icon: "success",
        });
      }
    } catch (error) {
      ErrorResponse(error as ErrorModel);
    }
  };

  const handleCloseShareDialog = () => {
    setShareDialogOpen(false); // Close the dialog
  };

  const handleDownload = async () => {
    try {
      if (!selectedDocument || !selectedDocument.url) {
        Swal.fire({
          title: "Warning!",
          text: "Cannot download folders. Please select a file.",
          icon: "warning",
          timer: 2000,
          showConfirmButton: false,
        });
        return;
      }

      const result = await Swal.fire({
        title: "Are you sure?",
        text: `Do you want to download ${selectedDocument.name}?`,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes, download it!",
        cancelButtonText: "Cancel",
      });

      if (result.isConfirmed) {
        Swal.fire({
          title: "Downloading...",
          text: `Downloading ${selectedDocument.name}`,
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });

        const response = await fetch(selectedDocument.url);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", selectedDocument.name);
        document.body.appendChild(link);
        link.click();

        window.URL.revokeObjectURL(url);
        document.body.removeChild(link);

        Swal.fire({
          title: "Success!",
          text: "File downloaded successfully",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "Something went wrong while downloading the file",
        icon: "error",
        timer: 2000,
        showConfirmButton: false,
      });
      console.error("Download error:", error);
    }
  };

  useEffect(() => {
    handleGetData();
  }, [page, rowsPerPage]);

  useEffect(() => {
    const action = searchParams.get("action");
    setCollapseOpen(action === "collapse");
  }, [searchParams]);

  return {
    totalDocuments,
    rowsPerPage,
    handleChangePage,
    handleChangeRowsPerPage,
    page,
    setPage,
    email,
    handleChangeEmail: (value: string) => setEmail(value),
    shareDialogOpen,
    setShareDialogOpen,
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
    // handleDocumentClick,
    handleFolderClick,
    handleDetailsClick,
    handleRenameFolder,
    handleChangeName,
    handleDeleteFolder,
    handleShare,
    handleCloseShareDialog,
    handleIviteMember,
    handleDownload,
  };
};

export default UseMainController;
