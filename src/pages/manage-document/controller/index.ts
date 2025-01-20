import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axiosInstance from "../../../configs/axios";
import Swal from "sweetalert2";
import { STATUS_ENUMS } from "../../../enums/status-enum";
import { SelectChangeEvent } from "@mui/material";
import { ErrorResponse } from "../../../utils/functions/Error";
import { ErrorModel } from "../../../models/Error";
import {
  GET_ALL_FOLDER_END_POINT,
  GET_ONE_FOLDER_HISTORT_END_POINT,
  INVITE_MEMBER_FOLDER_END_POINT,
  UPDATE_FOLDER_END_POINT,
} from "../../../configs/endPoint/folder-endpoint";
import { IconType } from "../../../enums/icon-enums";
import {
  DELETE_FILE_END_POINT,
  DELETE_FOLDER_END_POINT,
  GET_ALL_ROOT_FILE_END_POINT,
  GET_MEMBER_FILE_END_POINT,
  GET_ONE_FILE_HISTORT_END_POINT,
  INVITE_MEMBER_FILE_END_POINT,
  UPDATE_FILE_END_POINT,
} from "../../../configs/endPoint/files-endpoint";
import { MemberModel } from "../../../models/member-model";
import { useFolderNavigation } from "../components/custom-folder-navigate";
import { Version } from "../../../models/file-model";

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
  version: string;
  status: STATUS_ENUMS;
  owner: {
    company: string;
    email: string;
    name: string;
    username: string;
  };
  url: string;
  isFolder: boolean;
  parentId: string;
  isPinned: boolean;
  isDelete: boolean;
  createdAt: string;
  updatedAt: string;
}

const UseMainController = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const folderNavigation = useFolderNavigation();

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
  const [fileHistory, setFileHistory] = useState<Version[]>([]);

  // const [status, setStatus] = useState<STATUS_ENUMS>()
  const [newName, setNewName] = useState<string>(null!);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [renameDialogOpen, setRenameDialogOpen] = useState<boolean>(false);
  const [inviteDialogOpen, setInviteDialogOpen] = useState<boolean>(false);
  const [shareDialogOpen, setShareDialogOpen] = useState<boolean>(false);
  const [email, setEmail] = useState<string>(null!);

  const [member, setMember] = useState<MemberModel[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<MemberModel[]>([]);
  const [currentFileId, _setCurrentFileId] = useState<string | null>(null);

  const [allDocuments, setAllDocuments] = useState<Document[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>(null!);

  const handleGetHistory = async () => {
    if (!selectedDocument?.id) return; // Guard clause
    
    try {
      setLoading(true);
      setError(null);
      
      const endpoint = selectedDocument.itemType === 'folder'
        ? `${GET_ONE_FOLDER_HISTORT_END_POINT}/${selectedDocument.id}`
        : `${GET_ONE_FILE_HISTORT_END_POINT}/${selectedDocument.id}`;
    
      const res = await axiosInstance.get(endpoint);
      setFileHistory(res.data.data);
    } catch (err) {
      setError('Failed to fetch history');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGetFileMember = async () => {
    try {
      const res = await axiosInstance.get(GET_MEMBER_FILE_END_POINT);
      setMember(res?.data?.data);
    } catch (error) {
      ErrorResponse(error as ErrorModel);
    }
  };

  const handleChangeStatus = async (event: SelectChangeEvent<STATUS_ENUMS>) => {
    const newStatus = event.target.value as STATUS_ENUMS;

    if (!selectedDocument) {
      await Swal.fire({
        icon: "warning",
        title: "No Document Selected",
        text: "Please select a document to change the status.",
      });
      return;
    }

    try {
      let endpoint;
      let payload;

      if (selectedDocument?.itemType === "folder") {
        endpoint = `${UPDATE_FOLDER_END_POINT}/${selectedDocument?.id}`;
        payload = { status: newStatus };
      } else {
        endpoint = `${UPDATE_FILE_END_POINT}/${selectedDocument?.id}`;
        payload = { status: newStatus };
      }

      const res = await axiosInstance.patch(endpoint, payload);
      console.log(res?.data?.data);

      // Update selected document
      setSelectedDocument({ ...selectedDocument, status: newStatus });

      // Update documents list
      setDocuments((prevDocs) =>
        prevDocs.map((doc) =>
          doc.id === selectedDocument.id ? { ...doc, status: newStatus } : doc
        )
      );

      await Swal.fire({
        icon: "success",
        title: "Status Updated!",
        text: `The document status has been updated to "${newStatus}" successfully.`,
      });
    } catch (error) {
      console.error("Error updating status:", error);

      await Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Failed to update status. Please try again.",
      });
    }
  };

  const handleDetailsClick = () => {
    if (selectedDocument) {
      setCollapseOpen(true); // Open the collapse
      setSearchParams({ docId: selectedDocument.id, action: "collapse" });
    } else {
      console.log("No document selected.");
    }
  };

  const handleFolderDoubleClick = (item: any) => {
    if (item.itemType === "folder") {
      // Navigate to the selected folder
      const currentFolder = folderNavigation.getCurrentFolder();
      const newFolderPath = `${currentFolder}/${item.name}`;
      folderNavigation.navigateToFolder(newFolderPath);
    }
  };

  const handleDrawerClose = () => {
    setCollapseOpen(false);
  };

  const handleGetData = async () => {
    try {
      setLoading(true);
      setError(null);
  
      // Fetch folders
      const foldersRes = await axiosInstance.get(GET_ALL_FOLDER_END_POINT);
      const folders = foldersRes?.data?.data?.map((folder: any) => ({
        ...folder,
        itemType: "folder",
      }));
  
      // Fetch files with latest versions only
      const filesRes = await axiosInstance.get(GET_ALL_ROOT_FILE_END_POINT);
      const files = filesRes?.data?.data
        .reduce((acc: any[], file: any) => {
          // Find if we already have a file with the same name
          const existingFile = acc.find(f => f.name === file.name);
          
          // If file exists, update it only if current version is newer
          if (existingFile) {
            if (new Date(file.updatedAt) > new Date(existingFile.updatedAt)) {
              const index = acc.findIndex(f => f.name === file.name);
              acc[index] = { ...file, itemType: "file" };
            }
          } else {
            // If file doesn't exist, add it
            acc.push({ ...file, itemType: "file" });
          }
          return acc;
        }, []);
  
      const combinedItems = [...folders, ...files];
      setDocuments(combinedItems);
      setAllDocuments(combinedItems);
    } catch (error) {
      console.error("API error:", error);
      setError("An error occurred while fetching data");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedItems(documents.map((doc) => doc.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = async (id: string) => {
    const doc = documents.find((document) => document.id === id); 
    if (doc) {
      setSelectedDocument(doc);
      await handleGetHistory();
    }   
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
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
        const isFolder = selectedDocument?.itemType === "folder";

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

        handleGetData();
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

      handleGetData();
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

        if (selectedDocument?.itemType === "folder") {
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

  const handleSearch = (searchValue: string) => {
    setSearchTerm(searchValue);

    if (!searchValue.trim()) {
      setDocuments(allDocuments);
      return;
    }

    const searchTermLower = searchValue.toLowerCase();
    const filteredDocuments = allDocuments.filter((doc) => {
      return (
        doc.name.toLowerCase().includes(searchTermLower) ||
        doc.status.toLowerCase().includes(searchTermLower) ||
        new Date(doc.createdAt)
          .toLocaleDateString()
          .toLowerCase()
          .includes(searchTermLower)
      );
    });

    setDocuments(filteredDocuments);
  };

  useEffect(() => {
    const action = searchParams.get("action");
    setCollapseOpen(action === "collapse");
  }, [searchParams]);

  useEffect(() => {
    handleGetData();
    handleGetFileMember();  
  }, [searchParams]);

  useEffect(() => {
    if (currentFileId) {
      const filteredMembers = member.filter((m) => m.fileId === currentFileId);
      setFilteredMembers(filteredMembers);
    }
  }, [member, currentFileId]);

  return {
    fileHistory,
    allDocuments,
    searchTerm,
    filteredMembers,
    member,
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
    status,
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
    handleFolderDoubleClick,
    handleDetailsClick,
    handleRenameFolder,
    handleChangeName,
    handleDeleteFolder,
    handleChangeStatus,
    handleShare,
    handleCloseShareDialog,
    handleIviteMember,
    handleDownload,
    handleSearch,
  };
};

export default UseMainController;
