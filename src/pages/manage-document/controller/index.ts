import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axiosInstance from "../../../configs/axios";
import Swal from "sweetalert2";
import { STATUS_ENUMS } from "../../../enums/status-enum";
import { SelectChangeEvent } from "@mui/material";
import { ErrorResponse } from "../../../utils/functions/Error";
import { ErrorModel } from "../../../models/Error";
import {
  GET_ONE_FOLDER_HISTORT_END_POINT,
  UPDATE_FOLDER_END_POINT,
} from "../../../configs/endPoint/folder-endpoint";
import {
  DELETE_FILE_END_POINT,
  DELETE_FOLDER_END_POINT,
  GET_ONE_FILE_HISTORT_END_POINT,
  GET_VERSION_FILE_END_POINT,
  UPDATE_FILE_END_POINT,
} from "../../../configs/endPoint/files-endpoint";
import { Version } from "../../../models/file-model";
import { GET_OWNER_DOC_END_POINT } from "../../../configs/endPoint/file&folder";
import {
  Document,
  fileMember,
  FileModel,
  folderMember,
  Subfolder,
} from "../../../models/Document";
import { getFileTypeFromName } from "../../../utils/functions/typefile";
import eventBus from "../../../utils/functions/eventBus";

type SortField = "name" | "modified" | "size" | "status";
type SortOrder = "asc" | "desc";

const UseMainController = () => {
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

  const [allDocuments, setAllDocuments] = useState<Document[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [versionDocument, setVersionDocument] = useState<Version[]>([]);

  const handleGetDocumentsByPath = async (path?: string) => {
    try {
      setLoading(true);
      setError(null);

      const encodedPath = encodeURIComponent(
        path || selectedDocument?.path || "root"
      );

      // Updated endpoint with full URL
      const response = await axiosInstance.get(`/folders/path/${encodedPath}`);

      const responseData = response.data.data || response.data;

      const processedData = [];

      // Process files
      const filesMap = new Map();
      const subfoldersMap = new Map();

      // Safely check and process files
      if (responseData.files && Array.isArray(responseData.files)) {
        responseData.files.forEach((file: FileModel) => {
          const fileName = file.name;

          if (
            !filesMap.has(fileName) ||
            new Date(file.updatedAt) >
              new Date(filesMap.get(fileName).updatedAt)
          ) {
            filesMap.set(fileName, {
              id: file.id,
              name: file.name,
              nameVersion: file.nameVersion,
              type: file.type || getFileTypeFromName(file.name),
              url: file.url,
              documentNumber: file.documentNumber,
              documentId: file.documentId,
              createdAt: file.createdAt,
              updatedAt: file.updatedAt,
              size: file.size,
              status: file.status || "PUBLIC",
              itemType: "file",
              isFolder: false,
              version: file.version || "1.0",
            });
          }
        });
      } else {
        console.warn("No files found in the response");
      }

      // Process subfolders
      if (responseData.subFolders && Array.isArray(responseData.subFolders)) {
        responseData.subFolders.forEach((subfolder: Subfolder) => {
          const folderName = subfolder.name;

          if (
            !subfoldersMap.has(folderName) ||
            new Date(subfolder.updatedAt) >
              new Date(subfoldersMap.get(folderName).updatedAt)
          ) {
            subfoldersMap.set(folderName, {
              id: subfolder.id,
              name: subfolder.name,
              documentId: subfolder.documentId,
              path: subfolder.path,
              parentId: subfolder.parentId,
              createdAt: subfolder.createdAt,
              updatedAt: subfolder.updatedAt,
              size: subfolder.size,
              type: subfolder.type || "folder",
              itemType: subfolder.type || "folder",
              status: subfolder.status,
              isFolder: true,
              isDeleted: subfolder.isDeleted,
              isPinned: subfolder.isPinned,
            });
          }
        });
      } else {
        console.warn("No subfolders found in the response");
      }

      // Add all latest files and subfolders to the processed data
      processedData.push(
        ...Array.from(filesMap.values()),
        ...Array.from(subfoldersMap.values())
      );

      // If no data was processed, set an empty array
      if (processedData.length === 0) {
        console.warn("No documents or subfolders found in the response");
        setError("No documents or subfolders found in the selected folder");
      }

      setDocuments(processedData);
      setAllDocuments(processedData);
    } catch (error) {
      console.error("API error:", error);
      setError("An error occurred while fetching data by path");
      setDocuments([]);
      setAllDocuments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleGetHistory = async () => {
    if (!selectedDocument?.id) return; // Guard clause

    try {
      setLoading(true);
      setError(null);

      const endpoint =
        selectedDocument.itemType === "folder"
          ? `${GET_ONE_FOLDER_HISTORT_END_POINT}/${selectedDocument.id}`
          : `${GET_ONE_FILE_HISTORT_END_POINT}/${selectedDocument.id}`;

      const res = await axiosInstance.get(endpoint);
      setFileHistory(res.data.data);
    } catch (err) {
      setError("Failed to fetch history");
      console.error(err);
    } finally {
      setLoading(false);
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
        showConfirmButton: false,
        timer: 2000,
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

  const handleDetailsClick = async () => {
    if (selectedDocument) {
      setCollapseOpen(true);
      setSearchParams({ docId: selectedDocument.id, action: "collapse" });
      // Only fetch these when details are opened
      await handleGetDocumentVersion();
      await handleGetHistory();
    }
  };

  const handleFolderDoubleClick = useCallback(
    (item: Document) => {
      if (item.type === "folder") {
        // Use the item's path directly
        const newFolderPath = item.path;

        // Set folder information in local storage
        localStorage.setItem("currentFolderPath", newFolderPath);
        localStorage.setItem("currentFolderId", item.id);

        // Set search params with the new path
        setSearchParams({ folderPath: newFolderPath });

        setSelectedDocument(item);
        handleGetDocumentsByPath(newFolderPath);
      }
    },
    [setSearchParams, handleGetDocumentsByPath]
  );

  const handleDrawerClose = () => {
    setCollapseOpen(false);
  };

  //

  const handleGetData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all documents with the new endpoint
      const response = await axiosInstance.get(GET_OWNER_DOC_END_POINT);

      // Get the response data
      const responseData = response?.data?.data;
      const processedData = [];

      // Process all files (both regular files and fileMembers) - keep only latest versions
      const filesMap = new Map();

      // Process regular files
      if (responseData.files && Array.isArray(responseData.files)) {
        responseData.files.forEach((file: FileModel) => {
          const fileName = file.name;

          if (
            !filesMap.has(fileName) ||
            new Date(file.updatedAt) >
              new Date(filesMap.get(fileName).updatedAt)
          ) {
            filesMap.set(fileName, {
              id: file.id,
              name: file.name,
              nameVersion: file.nameVersion,
              type: file.type || getFileTypeFromName(file.name),
              documentNumber: file.documentNumber,
              documentId: file.documentId,
              createdAt: file.createdAt,
              updatedAt: file.updatedAt,
              url: file?.url,
              size: file.size,
              status: file.status || "PUBLIC",
              itemType: "file",
              isFolder: false,
              version: file.version || "1.0",
              isOwned: true,
              isShared: false,
            });
          }
        });
      }

      // Process fileMembers
      if (responseData.fileMembers && Array.isArray(responseData.fileMembers)) {
        responseData.fileMembers.forEach((fileMember: fileMember) => {
          let fileData;

          // Check if fileMember has a file property
          if (fileMember.file) {
            fileData = {
              id: fileMember.file.id,
              name: fileMember.file.name,
              nameVersion: fileMember.file.nameVersion,
              type:
                fileMember.file.type ||
                getFileTypeFromName(fileMember.file.name),
              documentNumber: fileMember.file.documentNumber,
              documentId: fileMember.file.documentId,
              url: fileMember.file.url,
              createdAt: fileMember.file.createdAt,
              updatedAt: fileMember.file.updatedAt,
              size: fileMember.file.size,
              status: fileMember.file.status || "PUBLIC",
              itemType: "file",
              isFolder: false,
              version: fileMember.file.version || "1.0",
              isShared: true,
              isOwned: false,
            };

            const fileName = fileData.name;

            if (
              !filesMap.has(fileName) ||
              new Date(fileData.updatedAt) >
                new Date(filesMap.get(fileName).updatedAt)
            ) {
              filesMap.set(fileName, fileData);
            }
          }
        });
      }

      // Add all latest files to the processed data
      processedData.push(...Array.from(filesMap.values()));

      // Check for normal folders - try multiple possible properties
      const folderKeys = ["folders", "folder"];
      let normalFoldersFound = false;

      for (const key of folderKeys) {
        if (responseData[key] && Array.isArray(responseData[key])) {
          normalFoldersFound = true;
          responseData[key].forEach((folder) => {
            processedData.push({
              id: folder.id,
              name: folder.name,
              type: "folder",
              documentNumber: folder.documentId,
              documentId: folder.documentId,
              createdAt: folder.createdAt,
              updatedAt: folder.updatedAt,
              size: folder.size || 0,
              status: folder.status || "PUBLIC",
              itemType: "folder",
              isFolder: true,
              path: folder.path,
            });
          });
          break; // We found and processed normal folders, no need to check other keys
        }
      }

      // If we didn't find normal folders using common keys, check if there's a 'folder' object
      if (
        !normalFoldersFound &&
        responseData.folder &&
        !Array.isArray(responseData.folder)
      ) {
        // Single folder object
        const folder = responseData.folder;
        processedData.push({
          id: folder.id,
          name: folder.name,
          type: "folder",
          documentNumber: folder.documentId,
          documentId: folder.documentId,
          createdAt: folder.createdAt,
          updatedAt: folder.updatedAt,
          size: folder.size || 0,
          status: folder.status || "PUBLIC",
          itemType: "folder",
          isFolder: true,
          path: folder.path,
          isOwned: true,
          isShared: false,
        });
      }

      // Process folderMembers (shared folders)
      if (
        responseData.folderMembers &&
        Array.isArray(responseData.folderMembers)
      ) {
        responseData.folderMembers.forEach((folderMember: folderMember) => {
          if (folderMember.folder) {
            processedData.push({
              id: folderMember.folder.id,
              name: folderMember.folder.name,
              type: "folder",
              documentNumber: folderMember.folder.documentId,
              documentId: folderMember.folder.documentId,
              createdAt: folderMember.folder.createdAt,
              updatedAt: folderMember.folder.updatedAt,
              size: folderMember.folder.size || 0,
              status: folderMember.folder.status || "PUBLIC",
              itemType: "folder",
              isFolder: true,
              isOwned: false,
              isShared: true,
            });
          }
        });
      }

      setDocuments(processedData);
      setAllDocuments(processedData);
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

  const handleSelectItem = (id: string) => {
    const doc = documents.find((document) => document.id === id);
    if (doc) {
      setSelectedDocument(doc);
    }
    setCollapseOpen(false);
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
    const folderPath = searchParams.get("folderPath");

    const result = await Swal.fire({
      title: "ທ່ານແນ່ໃຈບໍ່ ?",
      text: "ການດຳເນີນການນີ້ຈະລົບອອກຢ່າງຖາວອນ.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "ລົບ",
      cancelButtonText: "ຍົກເລີກ",
    });

    if (result.isConfirmed) {
      try {
        setLoading(true);
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

        if (res?.status === 201) {
          setLoading(false);
          await Swal.fire({
            icon: "success",
            title: "ລົບສຳເລັດ!",
            text: `The ${isFolder ? "folder" : "file"} ຖືກລົບສຳເລັດແລ້ວ.`,
            showConfirmButton: false,
            timer: 2000,
          });
        }

        handleGetData();
        if (folderPath) {
          handleGetDocumentsByPath();
        }
      } catch (error) {
        console.error("Delete error:", error);
        await Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "ເກີດຂໍ້ຜິດຜາດໃນການລົບ. ກະລຸນາລອງໃໝ່ອີກຄັ້ງ.",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleRenameFolder = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    const folderPath = searchParams.get("folderPath");

    setRenameDialogOpen(false);

    if (!selectedDocument) {
      await Swal.fire({
        icon: "warning",
        title: "ບໍ່ມີເອກະສານທີ່ເລືອກ",
        text: "ກະລຸນາເລືອກເອກະສານເພື່ອປ່ຽນຊື່.",
      });
      return;
    }

    if (!newName || newName.trim() === "") {
      await Swal.fire({
        icon: "warning",
        title: "ຊື່ບໍ່ຖືກຕ້ອງ",
        text: "ກະລຸນາປ້ອນຊື່ໂຟເດີ້ໃຫ້ຖືກຕ້ອງ.",
      });
      return;
    }

    // Show confirmation dialog first
    const result = await Swal.fire({
      title: "ທ່ານແນ່ໃຈບໍ່ ?",
      text: `ທ່ານຕ້ອງການປ່ຽນຊື່ໂຟເດີ້ເປັນ "${newName}"?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "ຕົກລົງ",
      cancelButtonText: "ຍົກເລີກ",
    });

    // If the user cancels, do nothing
    if (!result.isConfirmed) {
      return;
    }

    try {
      setIsSubmitting(true);
      setLoading(true);

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

      if (res?.status === 200) {
        setLoading(false);
        await Swal.fire({
          icon: "success",
          title: "ໂຟເດີ້ຖືກປ່ຽນຊື່ສຳເລັດ!",
          text: `ໂຟເດີ້ຖືກປ່ຽນຊື່ເປັນ "${newName}" ສຳເລັດແລ້ວ.`,
          showConfirmButton: false,
          timer: 2000,
        });
      }

      handleGetData();
      if (folderPath) {
        handleGetDocumentsByPath();
      }
    } catch (error) {
      console.error(error);
      ErrorResponse(error as ErrorModel);
    } finally {
      setIsSubmitting(false);
      setLoading(false);
    }
  };

  const handleChangeName = (value: string) => {
    setNewName(value);
  };

  const handleDownload = async () => {
    try {
      if (!selectedDocument || !selectedDocument.url) {
        Swal.fire({
          title: "ຄຳເຕືອນ!",
          text: "ບໍ່ສາມາດດາວໂຫລດໂຟເດີ້ໄດ້. ກະລຸນາເລືອກຟາຍ.",
          icon: "warning",
          timer: 2000,
          showConfirmButton: false,
        });
        return;
      }

      const result = await Swal.fire({
        title: "ທ່ານແນ່ໃຈບໍ່?",
        text: `ທ່ານຕ້ອງການດາວໂຫລດນີ້ບໍ່ ${selectedDocument.name}?`,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "ຕົກລົງ!",
        cancelButtonText: "ຍົກເລີກ",
      });

      if (result.isConfirmed) {
        Swal.fire({
          title: "ກຳລັງດາວໂຫລດ...",
          text: `ກຳລັງດາວໂຫລດ ${selectedDocument.name}`,
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
          title: "ສຳເລັດ!",
          text: "ຟາຍຖືກດາວໂຫລດສຳເລັດແລ້ວ",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      Swal.fire({
        title: "ຜິດຜາດ!",
        text: "ເກີດຂໍ້ຜິດຜາດໃນການດາວໂຫລດຟາຍ",
        icon: "error",
        timer: 2000,
        showConfirmButton: false,
      });
      console.error("Download error:", error);
    }
  };

  const handleSearch = useCallback((searchValue: string) => {
    setSearchTerm(searchValue);
  }, []);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleGetDocumentVersion = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(
        `${GET_VERSION_FILE_END_POINT}/${selectedDocument?.documentNumber}`
      );
      setVersionDocument(res?.data?.data || []);
    } catch (error) {
      console.error("Error fetching file history:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    if (!debouncedSearchTerm.trim()) {
      setDocuments(allDocuments);
      return;
    }

    const searchTermLower = debouncedSearchTerm.toLowerCase();
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
  }, [debouncedSearchTerm, allDocuments]);

  useEffect(() => {
    const action = searchParams.get("action");
    if (action === "collapse") {
      handleGetHistory();
      handleGetDocumentVersion();
    }
  }, [searchParams]);

  useEffect(() => {
    const folderPath = searchParams.get("folderPath");

    if (folderPath) {
      handleGetDocumentsByPath(folderPath);
    } else {
      // If no folder path, fetch default documents
      handleGetData();
    }

    const unsubscribeFiles = eventBus.subscribe("FILES_UPDATED", () => {
      if (folderPath) {
        handleGetDocumentsByPath(folderPath);
      } else {
        handleGetData();
      }
    });

    const unsubscribeFolders = eventBus.subscribe("FOLDERS_UPDATED", () => {
      if (folderPath) {
        handleGetDocumentsByPath(folderPath);
      } else {
        handleGetData();
      }
    });

    // Cleanup both subscriptions on component unmount
    return () => {
      unsubscribeFiles();
      unsubscribeFolders();
    };
  }, [searchParams]);
  return {
    versionDocument,
    handleChangePage,
    handleChangeRowsPerPage,
    page,
    rowsPerPage,
    fileHistory,
    allDocuments,
    searchTerm,
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
    handleFolderDoubleClick,
    handleDetailsClick,
    handleRenameFolder,
    handleChangeName,
    handleDeleteFolder,
    handleChangeStatus,
    handleDownload,
    handleSearch,
  };
};

export default UseMainController;
