import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { DOCUMENT_DETAIL_PATH } from "../../../routes/paths";
import axiosInstance from "../../../configs/axios";
import Swal from "sweetalert2";
import { STATUS_ENUMS } from "../../../enums/status-enum";
import { DELETE_FOLDER_END_POINT, RESTORE_FOLDER_END_POINT } from "../../../configs/endPoint/folder-endpoint";
import { IconType } from "../../../enums/icon-enums";
import { GET_ALL_RECYCLE_BIN_END_POINT } from "../../../configs/endPoint/recycle-bin-endpoint";
import { RecycleBinDocument } from "../../../models/recycle-bin-model"; 
import { DELETE_FILE_END_POINT, RESTORE_FILE_END_POINT } from "../../../configs/endPoint/files-endpoint";
import { ErrorResponse } from "../../../utils/functions/Error";
import { ErrorModel } from "../../../models/Error";

type SortField = "name" | "modified" | "size" | "status";

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
  const [filterAnchorEl, setFilterAnchorEl] = useState<{
    [key in SortField]?: HTMLElement | null;
  }>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [documents, setDocuments] = useState<RecycleBinDocument[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<RecycleBinDocument | null>(null);
  console.log(selectedDocument)
  const [collapeOpen, setCollapseOpen] = useState<boolean>(false);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [renameDialogOpen, setRenameDialogOpen] = useState<boolean>(false);
  const [inviteDialogOpen, setInviteDialogOpen] = useState<boolean>(false);
  const [shareDialogOpen, setShareDialogOpen] = useState<boolean>(false);

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
      const res = await axiosInstance.get(GET_ALL_RECYCLE_BIN_END_POINT);
  
      // Restructure the data
      const documents = [
        ...(res?.data?.data?.deletedFile
          ? Object.values(res?.data?.data?.deletedFile).map((file: any) => ({
              id: file?.id,
              name: file?.name,
              documentId: file?.id,
              owner: { name: file?.owner?.name || "N/A",
                company: file?.owner?.company,
                email: file?.owner?.email
               },
              updatedAt: file?.updatedAt,
              type: file?.type,
              size: file?.size || null,
            }))
          : []),
        ...(res?.data?.data?.deletedFolders
          ? res?.data?.data?.deletedFolders.map((folder: any) => ({
              id: folder?.id,
              name: folder?.name,
              documentId: folder?.documentId,
              owner: { name: folder?.owner?.name || "N/A",
                company: folder?.owner?.company,
                email: folder?.owner?.email
               },
              updatedAt: folder?.updatedAt,
              type: "folder",
              size: null,
            }))
          : []),
      ];
  
      setDocuments(documents);
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


  const handleFilterClick = (
    event: React.MouseEvent<HTMLElement>,
    field: SortField
  ) => {
    setFilterAnchorEl({ ...filterAnchorEl, [field]: event.currentTarget });
  };

  const handleFilterClose = (field: SortField) => {
    setFilterAnchorEl({ ...filterAnchorEl, [field]: null });
  };


  useEffect(() => {
    const action = searchParams.get('action');
    setCollapseOpen(action === 'collapse');
  }, [searchParams]);

  const handleDelete = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault(); // Prevent the default form submission behavior
  
    // Confirm deletion
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This action will permanently delete the item.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
    });
  
    if (result.isConfirmed) {
      try {
        let endpoint;
        if (selectedDocument?.type === 'folder') {
          endpoint = `${DELETE_FOLDER_END_POINT}/${selectedDocument?.id}`;
        } else {
          endpoint = `${DELETE_FILE_END_POINT}/${selectedDocument?.id}`;
        }
  
        const res = await axiosInstance.delete(endpoint);
        console.log(res?.data.data)
  
        // Show success alert
        await Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'The item has been deleted successfully.',
        });
  
        handleGetData();
      } catch (error) {
        console.error(error);
        // Show error alert
        await Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Failed to delete item. Please try again.',
        });
      }
    }
  };

  const handleRestore = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault(); // Prevent the default form submission behavior
  
    // Confirm restoration
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This action will restore the file.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Restore',
      cancelButtonText: 'Cancel',
    });
  
    if (result.isConfirmed) {
      try {
        let endpoint;
        let data;
        if (selectedDocument?.type === 'folder') {
          endpoint = RESTORE_FOLDER_END_POINT;
          data = { folderId: selectedDocument?.id };
        } else {
          endpoint = RESTORE_FILE_END_POINT;
          data = { fileId: selectedDocument?.id };
        }
  
        const res = await axiosInstance.post(endpoint, data);
        console.log(res?.data?.data)
  
        // Show success alert
        await Swal.fire({
          icon: 'success',
          title: 'Restored!',
          text: 'The file has been restored successfully.',
        });
  
        handleGetData();
      } catch (error) {
        ErrorResponse(error as ErrorModel);
      }
    }
  };
  return {
    shareDialogOpen,
    setShareDialogOpen,
    inviteDialogOpen,
    setInviteDialogOpen,
    setIsSubmitting,
    isSubmitting,
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
    // handleDocumentClick,
    handleFolderClick,
    handleDetailsClick,
    handleDelete,
    handleRestore
  };
};

export default UseMainController;
