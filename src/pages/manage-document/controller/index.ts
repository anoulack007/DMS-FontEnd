import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { DOCUMENT_DETAIL_PATH } from "../../../routes/paths";

type SortField = "name" | "modified" | "fileSize" | "status";
type SortOrder = "asc" | "desc";

interface Document {
  id: string;
  name: string;
  idDocument: string;
  modified: string;
  fileSize: string;
  status: string;
  isFolder: boolean;
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

  // const handleDocumentClick = (e: React.MouseEvent, doc: Document) => {
  //   e.preventDefault();
  //   setSelectedDocument(doc);
  //   setCollapseOpen(true);
  //   // Update URL with document ID without navigating
  //   setSearchParams({ docId: doc.id, action: 'collapse' });
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
      // Simulating API call with mock data
      const mockData: Document[] = [
        {
          id: "1",
          name: "Test document 1",
          idDocument: "4886AFL",
          modified: "1/03/2023",
          fileSize: "35.56 Mb",
          status: "Confidential",
          isFolder: false,
        },
        {
          id: "2",
          name: "Test document 2",
          idDocument: "4886AFL",
          modified: "1/03/2023",
          fileSize: "35.56 Mb",
          status: "Highly Confidential",
          isFolder: true,
        },
        {
          id: "3",
          name: "Test document 3",
          idDocument: "4886AFL",
          modified: "1/03/2023",
          fileSize: "35.56 Mb",
          status: "Public",
          isFolder: false,
        },
        {
          id: "4",
          name: "Test document 4",
          idDocument: "4886AFL",
          modified: "1/03/2023",
          fileSize: "35.56 Mb",
          status: "Public",
          isFolder: true,
        },
        {
          id: "5",
          name: "Test document 5",
          idDocument: "4886AFL",
          modified: "1/03/2023",
          fileSize: "35.56 Mb",
          status: "Public",
          isFolder: false,
        },
        {
          id: "6",
          name: "Test document 6",
          idDocument: "4886AFL",
          modified: "1/03/2023",
          fileSize: "35.56 Mb",
          status: "Internal",
          isFolder: true,
        },
        {
          id: "7",
          name: "Test document 7",
          idDocument: "4886AFL",
          modified: "1/03/2023",
          fileSize: "35.56 Mb",
          status: "Internal",
          isFolder: true,
        },
        {
          id: "8",
          name: "Test document 8",
          idDocument: "4886AFL",
          modified: "1/03/2023",
          fileSize: "35.56 Mb",
          status: "Internal",
          isFolder: true,
        },
        {
          id: "9",
          name: "Test document 9",
          idDocument: "4886AFL",
          modified: "1/03/2023",
          fileSize: "35.56 Mb",
          status: "Internal",
          isFolder: true,
        },
        {
          id: "10",
          name: "Test document 10",
          idDocument: "4886AFL",
          modified: "1/03/2023",
          fileSize: "35.56 Mb",
          status: "Internal",
          isFolder: true,
        },
      ];
      setDocuments(mockData);
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
      case "fileSize":
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
    handleDetailsClick

  };
};

export default UseMainController;
