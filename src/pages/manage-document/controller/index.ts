import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { DOCUMENT_DETAIL_PATH } from "../../../routes/paths";
import axiosInstance from "../../../configs/axios";
import Swal from "sweetalert2";
import { STATUS_ENUMS } from "../../../enums/status-enum";
import { SelectChangeEvent } from "@mui/material";
import { ErrorResponse } from "../../../utils/functions/Error";
import { ErrorModel } from "../../../models/Error";
import { CREATE_FOLDER_END_POINT, GET_ALL_FOLDER_END_POINT } from "../../../configs/endPoint/folder-endpoint";
import { IconType } from "../../../enums/icon-enums";
import { GET_ALL_ROOT_FILE_END_POINT } from "../../../configs/endPoint/files-endpoint";

type SortField = "name" | "modified" | "size" | "status";
type SortOrder = "asc" | "desc";

interface Document {
  id: string;
  name: string;
  path: string
  documentId: string;
  modified: string;
  size: string;
  type: IconType;
  status: STATUS_ENUMS;
  isFolder: boolean;
  parentId: string
  isPinned: boolean
  isDelete: boolean
  createdAt: string
  updatedAt: string
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
  const [error, setError] = useState<string | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [collapeOpen, setCollapseOpen] = useState<boolean>(false);

  // const [status, setStatus] = useState<STATUS_ENUMS>()
  const [newName, setNewName] = useState<string>(null!);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [renameDialogOpen, setRenameDialogOpen] = useState<boolean>(false);

  const handleChangeStatus = async (event: SelectChangeEvent<STATUS_ENUMS>) => {
    const newStatus = event.target.value as STATUS_ENUMS;
    
    if (!selectedDocument) {
      await Swal.fire({
        icon: 'warning',
        title: 'No Document Selected',
        text: 'Please select a document to change the status.',
      });
      return;
    }

    try {
      const res = await axiosInstance.patch(`${CREATE_FOLDER_END_POINT}/${selectedDocument.id}`, {
        status: newStatus
      });

      // Update selected document
      setSelectedDocument({ ...selectedDocument, status: newStatus });
      
      // Update documents list
      setDocuments(prevDocs => 
        prevDocs.map(doc => 
          doc.id === selectedDocument.id 
            ? { ...doc, status: newStatus }
            : doc
        )
      );

      await Swal.fire({
        icon: 'success',
        title: 'Status Updated!',
        text: `The document status has been updated to "${newStatus}" successfully.`,
      });
    } catch (error) {
      console.error('Error updating status:', error);
      
      await Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Failed to update status. Please try again.',
      });
    }
  };


  const handleDetailsClick = () => {
    if (selectedDocument) {
      setCollapseOpen(true); // Open the collapse
      setSearchParams({ docId: selectedDocument.id, action: 'collapse' });
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

  const handleGetData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch folders
      const foldersRes = await axiosInstance.get(GET_ALL_FOLDER_END_POINT);
      const folders = foldersRes?.data?.data?.map((folder: any) => ({
        ...folder,
        itemType: 'folder'  // Add type identifier
      }));
      
      // Fetch files
      const filesRes = await axiosInstance.get(GET_ALL_ROOT_FILE_END_POINT);
      const files = filesRes?.data?.data?.map((file: any) => ({
        ...file,
        itemType: 'file'  // Add type identifier
      }));
      
      // Combine and set both files and folders
      const combinedItems = [...folders, ...files];
      setDocuments(combinedItems);
      
    } catch (error) {
      console.error("API error:", error);
      setError("An error occurred while fetching data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetData();
  }, []);

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedItems(documents.map((doc) => doc.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (id: string) => {
    const doc = documents.find((document) => document.id === id);
    if (doc) {
      setSelectedDocument(doc);
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


  useEffect(() => {
    const action = searchParams.get('action');
    setCollapseOpen(action === 'collapse');
  }, [searchParams]);

  const handleDeleteFolder = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault(); // Prevent the default form submission behavior
  
    // Confirm deletion
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This action will permanently delete the folder.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
    });
  
    if (result.isConfirmed) {
      try {
        const res = await axiosInstance.delete(`${CREATE_FOLDER_END_POINT}/${selectedDocument?.id}`);
  
        // Show success alert
        await Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'The folder has been deleted successfully.',
        });

        handleGetData();
      } catch (error) {
        console.error(error);
        // Show error alert
        await Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Failed to delete folder. Please try again.',
        });
      }
    }
  };

  const handleRenameFolder = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    setRenameDialogOpen(false);
  
    if (!selectedDocument) {
      await Swal.fire({
        icon: 'warning',
        title: 'No Document Selected',
        text: 'Please select a document to rename the folder.',
      });
      return;
    }
  
    if (!newName || newName.trim() === '') {
      await Swal.fire({
        icon: 'warning',
        title: 'Invalid Name',
        text: 'Please enter a valid name for the folder.',
      });
      return;
    }
  
    // Show confirmation dialog first
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `Do you really want to rename the folder to "${newName}"?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, rename it!',
      cancelButtonText: 'No, keep it',
    });
  
    // If the user cancels, do nothing
    if (!result.isConfirmed) {
      return;
    }
  
    try {
      setIsSubmitting(true);
  
      // Proceed with the rename only if the user confirmed
      const res = await axiosInstance.patch(`${CREATE_FOLDER_END_POINT}/${selectedDocument.id}`, {
        name: newName,
      });
  
      // Update the selected document with the new data from the API response
      setSelectedDocument(res.data);
  
      await Swal.fire({
        icon: 'success',
        title: 'Folder Renamed!',
        text: `The folder has been renamed to "${newName}" successfully.`,
      });
  
      handleGetData();
    } catch (error) {
      console.error(error);
      ErrorResponse(error as ErrorModel)
    } finally {
      setIsSubmitting(false);
    }
  };
  

  const handleChangeName = (value: string) => {
    setNewName(value);
  };



  
  return {
    setIsSubmitting,
    isSubmitting,
    newName,
    // handleChangeName: (value: string) => setNewName(value),
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
    handleFolderClick,
    handleDetailsClick,
    handleRenameFolder,
    handleChangeName,
    handleDeleteFolder,
    handleChangeStatus
    

  };
};

export default UseMainController;
