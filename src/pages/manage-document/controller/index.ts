import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { DOCUMENT_DETAIL_PATH } from "../../../routes/paths";
import axiosInstance from "../../../configs/axios";
import { GET_ALL_FOLDER_END_POINT } from "../../../configs/endPoint/crud";

type SortField = "name" | "modified" | "size" | "status";
type SortOrder = "asc" | "desc";

interface Document {
  id: string;
  name: string;
  path: string
  documentId: string;
  modified: string;
  size: string;
  status: string;
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
  const [newName, setNewName] = useState<string>(null!)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [renameDialogOpen, setRenameDialogOpen] = useState<boolean>(false);

 

  // const handleChangeStatus = async (newStatus: string) => {
  //   if (!selectedDocument) return;
  
  //   try {
  //     setIsUpdating(true);
  
  //     // Optimistic update
  //     setSelectedDocument((prev) => ({
  //       ...prev,
  //       status: newStatus,
  //     }));
  
  //     // Make API call to update status
  //     const response = await axiosInstance.patch(`/${selectedDocument.documentId}`, {
  //       status: newStatus,
  //     });
  
  //     // Optional: Update with server response
  //     setSelectedDocument(response.data);
  
  //     // You might want to trigger a refresh of the documents list
  //     // refreshDocumentsList();
  
  //   } catch (error) {
  //     console.error('Error updating document status:', error);
  
  //   } finally {
  //     setIsUpdating(false);
  //   }
  // };


  const handleDetailsClick = () => {
    if (selectedDocument) {
      console.log("Opening details for:", selectedDocument);
      setCollapseOpen(true); // Open the collapse
      setSearchParams({ docId: selectedDocument.id, action: 'collapse' });
    } else {
      console.log("No document selected.");
    }
  };
  
  // Check if collapseOpen is changing
  useEffect(() => {
    console.log("Collapse Open:", collapeOpen);
  }, [collapeOpen]);

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
      
      const res = await axiosInstance.get(GET_ALL_FOLDER_END_POINT);
      setDocuments(res?.data?.data);
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
    // Implement sorting logic here
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

  
  return {
    setIsSubmitting,
    isSubmitting,
    newName,
    handleReName: (value: string) => setNewName(value),
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

  };
};

export default UseMainController;
