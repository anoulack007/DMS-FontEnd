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
import { useSelector } from "react-redux";
import { RootState } from "../../../store";

type SortField = "name" | "modified" | "size" | "status";

const UseMainController = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const currentUser = useSelector((state: RootState) => state.auth.data);

  const [selectedItems, setSelectedItems] = useState<string[]>([]);
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
  const [versionUploadOpen, setVersionUploadOpen] = useState(false);
  const [selectedDocumentNumber, setSelectedDocumentNumber] = useState("");

  const handleUploadVersion = (documentNumber: string) => {
    setSelectedDocumentNumber(documentNumber);
    setVersionUploadOpen(true);
  };

  const validateDocumentAccess = (document: any): Document => {
    if (!currentUser) {
      return {
        ...document,
        hasAccess: false,
        canView: false,
        canSelect: false,
        canModify: false,
        canNavigate: false,
        isOwner: false,
        isMember: false,
        isDisabled: true,
        showLockIcon: true,
        accessLevel: "no-access",
      };
    }

    const currentUserId = currentUser.id;

    // Check ownership - handle multiple possible owner field structures
    const isOwner =
      document.owner?.id === currentUserId ||
      document.ownerId === currentUserId ||
      document.owner === currentUserId ||
      document.ownerid === currentUserId;

    let isMember = false;

    // Enhanced member checking logic to handle both data structures
    if (document.itemType === "file" || document.type !== "folder") {
      // File member checking - handle multiple possible structures
      isMember =
        // Check fileMember array
        (Array.isArray(document.fileMember) &&
          document.fileMember.some(
            (member: any) =>
              member.user?.id === currentUserId ||
              member.userId === currentUserId ||
              member.id === currentUserId
          )) ||
        // Check single fileMember object
        (!Array.isArray(document.fileMember) &&
          document.fileMember &&
          (document.fileMember.user?.id === currentUserId ||
            document.fileMember.userId === currentUserId ||
            document.fileMember.id === currentUserId)) ||
        // Check fileMembers array (alternative naming)
        (Array.isArray(document.fileMembers) &&
          document.fileMembers.some(
            (member: any) =>
              member.user?.id === currentUserId ||
              member.userId === currentUserId ||
              member.id === currentUserId
          )) ||
        // Check single fileMembers object
        (!Array.isArray(document.fileMembers) &&
          document.fileMembers &&
          (document.fileMembers.user?.id === currentUserId ||
            document.fileMembers.userId === currentUserId ||
            document.fileMembers.id === currentUserId)) ||
        // Check general members array for files
        (Array.isArray(document.members) &&
          document.members.some(
            (member: any) =>
              member.user?.id === currentUserId ||
              member.userId === currentUserId ||
              member.id === currentUserId
          )) ||
        // Check direct member IDs
        document.memberId === currentUserId ||
        document.userId === currentUserId;
    } else if (document.itemType === "folder" || document.type === "folder") {
      // Folder member checking - handle multiple possible structures
      isMember =
        // Check members array
        (Array.isArray(document.members) &&
          document.members.some(
            (member: any) =>
              member.user?.id === currentUserId ||
              member.userId === currentUserId ||
              member.id === currentUserId ||
              member === currentUserId // Direct ID in array
          )) ||
        // Check single members object
        (!Array.isArray(document.members) &&
          document.members &&
          (document.members.user?.id === currentUserId ||
            document.members.userId === currentUserId ||
            document.members.id === currentUserId ||
            document.members === currentUserId)) ||
        // Check folderMembers (single object)
        (document.folderMembers &&
          (document.folderMembers.user?.id === currentUserId ||
            document.folderMembers.userId === currentUserId ||
            document.folderMembers.id === currentUserId)) ||
        // Check folderMember (alternative naming)
        (document.folderMember &&
          (document.folderMember.user?.id === currentUserId ||
            document.folderMember.userId === currentUserId ||
            document.folderMember.id === currentUserId)) ||
        // Check direct member IDs for folders
        document.memberId === currentUserId ||
        document.userId === currentUserId;
    }

    // FIXED: Check subfolder access - Check both 'subFolders' (camelCase) and 'subfolders' (lowercase)
    let hasSubfolderAccess = false;

    // Primary check: 'subFolders' (camelCase) as shown in your API response
    if (document.subFolders) {
      if (Array.isArray(document.subFolders)) {
        hasSubfolderAccess = document.subFolders.some((subfolder: any) => {
          // Check if user is owner of any subfolder
          const isSubfolderOwner =
            subfolder.ownerId === currentUserId ||
            subfolder.owner?.id === currentUserId ||
            subfolder.owner === currentUserId ||
            subfolder.ownerid === currentUserId; // Added ownerid field

          // Check if user is member of any subfolder
          const isSubfolderMember =
            // Check subfolder members array
            (Array.isArray(subfolder.members) &&
              subfolder.members.some(
                (member: any) =>
                  member.user?.id === currentUserId ||
                  member.userId === currentUserId ||
                  member.id === currentUserId ||
                  member === currentUserId
              )) ||
            // Check single subfolder member object
            (!Array.isArray(subfolder.members) &&
              subfolder.members &&
              (subfolder.members.user?.id === currentUserId ||
                subfolder.members.userId === currentUserId ||
                subfolder.members.id === currentUserId)) ||
            // Check folderMembers in subfolder
            (subfolder.folderMembers &&
              (subfolder.folderMembers.user?.id === currentUserId ||
                subfolder.folderMembers.userId === currentUserId ||
                subfolder.folderMembers.id === currentUserId)) ||
            // Check direct member IDs for subfolders
            subfolder.memberId === currentUserId ||
            subfolder.userId === currentUserId;

          return isSubfolderOwner || isSubfolderMember;
        });
      } else {
        // Single subFolders object
        const subfolder = document.subFolders;
        const isSubfolderOwner =
          subfolder.ownerId === currentUserId ||
          subfolder.owner?.id === currentUserId ||
          subfolder.owner === currentUserId ||
          subfolder.ownerid === currentUserId; // Added ownerid field

        const isSubfolderMember =
          (Array.isArray(subfolder.members) &&
            subfolder.members.some(
              (member: any) =>
                member.user?.id === currentUserId ||
                member.userId === currentUserId ||
                member.id === currentUserId ||
                member === currentUserId
            )) ||
          (!Array.isArray(subfolder.members) &&
            subfolder.members &&
            (subfolder.members.user?.id === currentUserId ||
              subfolder.members.userId === currentUserId ||
              subfolder.members.id === currentUserId)) ||
          (subfolder.folderMembers &&
            (subfolder.folderMembers.user?.id === currentUserId ||
              subfolder.folderMembers.userId === currentUserId ||
              subfolder.folderMembers.id === currentUserId)) ||
          subfolder.memberId === currentUserId ||
          subfolder.userId === currentUserId;

        hasSubfolderAccess = isSubfolderOwner || isSubfolderMember;
      }
    }

    // Fallback check: 'subfolders' (lowercase) - in case your API sometimes uses this
    if (
      !hasSubfolderAccess &&
      document.subfolders &&
      Array.isArray(document.subfolders)
    ) {
      hasSubfolderAccess = document.subfolders.some((subfolder: any) => {
        const isSubfolderOwner =
          subfolder.ownerId === currentUserId ||
          subfolder.owner?.id === currentUserId ||
          subfolder.owner === currentUserId ||
          subfolder.ownerid === currentUserId;

        const isSubfolderMember =
          (Array.isArray(subfolder.members) &&
            subfolder.members.some(
              (member: any) =>
                member.user?.id === currentUserId ||
                member.userId === currentUserId ||
                member.id === currentUserId ||
                member === currentUserId
            )) ||
          (!Array.isArray(subfolder.members) &&
            subfolder.members &&
            (subfolder.members.user?.id === currentUserId ||
              subfolder.members.userId === currentUserId ||
              subfolder.members.id === currentUserId)) ||
          (subfolder.folderMembers &&
            (subfolder.folderMembers.user?.id === currentUserId ||
              subfolder.folderMembers.userId === currentUserId ||
              subfolder.folderMembers.id === currentUserId)) ||
          subfolder.memberId === currentUserId ||
          subfolder.userId === currentUserId;

        return isSubfolderOwner || isSubfolderMember;
      });
    }

    // Apply access logic - now including subfolder access
    let hasAccess = false;
    let canView = false;
    let canSelect = false;
    let canModify = false;
    let canNavigate = false;
    let showLockIcon = false;
    let accessLevel: "owner" | "member" | "public-readonly" | "no-access" =
      "no-access";

    if (isOwner) {
      // Owner has full access
      hasAccess = true;
      canView = true;
      canSelect = true;
      canModify = true;
      canNavigate = true;
      showLockIcon = false;
      accessLevel = "owner";
    } else if (isMember || hasSubfolderAccess) {
      // Member or has subfolder access has full access
      hasAccess = true;
      canView = true;
      canSelect = true;
      canModify = true;
      canNavigate = true;
      showLockIcon = false;
      accessLevel = "member";
    } else {
      // Non-owner, non-member access based on status
      if (document.status === "PUBLIC") {
        hasAccess = true;
        canView = true;
        canSelect = false;
        canModify = false;
        canNavigate = false;
        showLockIcon = true;
        accessLevel = "public-readonly";
      } else if (document.status === "PRIVATE") {
        // PRIVATE: No access for non-members
        hasAccess = false;
        canView = false;
        canSelect = false;
        canModify = false;
        canNavigate = false;
        showLockIcon = true;
        accessLevel = "no-access";
      } else {
        // Default: No access
        hasAccess = false;
        canView = false;
        canSelect = false;
        canModify = false;
        canNavigate = false;
        showLockIcon = true;
        accessLevel = "no-access";
      }
    }

    return {
      ...document,
      hasAccess,
      canView,
      canSelect,
      canModify,
      canNavigate,
      isOwner,
      isMember: isMember || hasSubfolderAccess, // Include subfolder access in member check
      isDisabled: !canSelect,
      showLockIcon,
      accessLevel,
      hasSubfolderAccess, // Optional: add this field to track subfolder access specifically
    };
  };

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
        // Group files by their base name (without version)
        const fileGroups = new Map();

        responseData.files.forEach((file: FileModel) => {
          // Extract the base name (without version info)
          const baseFileName = file.name.replace(/_v\d+(\.\w+)?$/, "$1");

          // Use the base name and documentId as the key to group versions of the same file
          const fileKey = `${baseFileName}_${file.documentId}`;

          if (!fileGroups.has(fileKey)) {
            fileGroups.set(fileKey, []);
          }

          fileGroups.get(fileKey).push(file);
        });

        // For each group, find the latest version based on version number and updatedAt date
        fileGroups.forEach((versions, fileKey) => {
          // Sort versions by numeric version and then by updatedAt date as a tiebreaker
          versions.sort((a: any, b: any) => {
            // Extract version numbers (defaulting to 0 if not found)
            const versionA = parseFloat(a.version || "0") || 0;
            const versionB = parseFloat(b.version || "0") || 0;

            if (versionB !== versionA) {
              return versionB - versionA; // Higher version wins
            }

            // If versions are same, use latest updatedAt
            return (
              new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
            );
          });

          // Get the latest version (first after sorting)
          const latestFile = versions[0];

          const fileData = {
            id: latestFile.id,
            name: latestFile.name,
            nameVersion: latestFile.nameVersion,
            folderId: latestFile.folderId,
            type: latestFile.type || getFileTypeFromName(latestFile.name),
            url: latestFile.url,
            documentNumber: latestFile.documentNumber,
            fileMember: latestFile.fileMember,
            owner: latestFile.owner,
            ownerId: latestFile.ownerId,
            documentId: latestFile.documentId,
            createdAt: latestFile.createdAt,
            updatedAt: latestFile.updatedAt,
            size: latestFile.size,
            status: latestFile.status || "PUBLIC",
            itemType: "file",
            isFolder: false,
            version: latestFile.version || "1.0",
            sOwned: true,
            isShared: false,
          };

          // Apply validation
          const validatedFile = validateDocumentAccess(fileData);
          filesMap.set(fileKey, validatedFile);
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
            const folderData = {
              id: subfolder.id,
              name: subfolder.name,
              folderId: subfolder.folderId,
              documentId: subfolder.documentId,
              owner: subfolder.owner,
              ownerId: subfolder.ownerId,
              path: subfolder.path,
              parentId: subfolder.parentId,
              members: subfolder.members,
              createdAt: subfolder.createdAt,
              updatedAt: subfolder.updatedAt,
              size: subfolder.size,
              type: subfolder.type || "folder",
              itemType: subfolder.type || "folder",
              status: subfolder.status,
              isFolder: true,
              isDeleted: subfolder.isDeleted,
              isPinned: subfolder.isPinned,
            };

            // Apply validation
            const validatedFolder = validateDocumentAccess(folderData);
            subfoldersMap.set(folderName, validatedFolder);
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
    if (!selectedDocument?.id) return;

    try {
      // Use a local loading state for just this section
      const localLoading = true;
      console.log(localLoading);
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
    }
  };

  const handleChangeStatus = async (event: SelectChangeEvent<STATUS_ENUMS>) => {
    const newStatus = event.target.value as STATUS_ENUMS;
    const folderPath = searchParams.get("folderPath");

    if (!selectedDocument) {
      await Swal.fire({
        icon: "warning",
        title: "ບໍ່ໄດ້ເລືອກເອກະສານ",
        text: "ກະລນາເລືອກເອກະສານເພື່ອປ່ຽນສະຖານະ.",
      });
      return;
    }

    try {
      let endpoint;
      let payload: { status: STATUS_ENUMS; folderId?: string | number };

      setLoading(true);

      payload = { status: newStatus };

      if (selectedDocument) {
        payload.folderId = selectedDocument.folderId;
      }

      if (selectedDocument?.itemType === "folder") {
        endpoint = `${UPDATE_FOLDER_END_POINT}/${selectedDocument?.id}`;
      } else {
        endpoint = `${UPDATE_FILE_END_POINT}/${selectedDocument?.id}`;
      }

      const res = await axiosInstance.patch(endpoint, payload);
      console.log(res?.data?.data);

      setSelectedDocument({ ...selectedDocument, status: newStatus });

      setDocuments((prevDocs) =>
        prevDocs.map((doc) =>
          doc.id === selectedDocument.id ? { ...doc, status: newStatus } : doc
        )
      );

      await Swal.fire({
        icon: "success",
        title: "ອັບເດດສຳເລັດ!",
        text: `ສະຖານະເອກະສານໄດ້ຖືກປ່ຽນເປັນ "${newStatus}" ສຳເລັດແລ້ວ.`,
        showConfirmButton: false,
        timer: 2000,
      });

      setCollapseOpen(false);
      setSelectedItems([]);

      await handleGetData();
      if (folderPath) {
        await handleGetDocumentsByPath(folderPath);
      }
    } catch (error) {
      console.error("Error updating status:", error);

      await Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Failed to update status. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDetailsClick = async () => {
    if (selectedDocument) {
      setCollapseOpen(true);

      if (fileHistory.length === 0) {
        await handleGetHistory();
      }

      if (versionDocument.length === 0) {
        await handleGetDocumentVersion();
      }
    }
  };

  const handleDrawerClose = () => {
    setCollapseOpen(false);
  };

  const handleGetData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axiosInstance.get(GET_OWNER_DOC_END_POINT);

      const responseData = response?.data?.data;
      const processedData = [];

      const filesMap = new Map();
      const documentVersionsMap = new Map();

      // Process owned files
      if (responseData.files && Array.isArray(responseData.files)) {
        responseData.files.forEach((file: FileModel) => {
          if (file.folderId) {
            return;
          }

          const documentId = file.documentId;

          // Group files by documentId to handle versions
          if (!documentVersionsMap.has(documentId)) {
            documentVersionsMap.set(documentId, []);
          }

          documentVersionsMap.get(documentId).push({
            id: file.id,
            name: file.name,
            nameVersion: file.nameVersion,
            type: file.type || getFileTypeFromName(file.name),
            owner: file.owner,
            ownerId: file.ownerId,
            documentNumber: file.documentNumber,
            documentId: file.documentId,
            createdAt: file.createdAt,
            updatedAt: file.updatedAt,
            fileMember: file.fileMember,
            folderId: file.folderId,
            url: file?.url,
            size: file.size,
            status: file.status || "PUBLIC",
            itemType: "file",
            isFolder: false,
            version: file.version || "1.0",
            isOwned: true,
            isShared: false,
          });
        });
      }

      if (responseData.fileMembers && Array.isArray(responseData.fileMembers)) {
        responseData.fileMembers.forEach((fileMember: fileMember) => {
          if (fileMember.file && fileMember.file.folderId) {
            return;
          }

          if (fileMember.file) {
            const documentId = fileMember.file.documentId;

            // Group files by documentId to handle versions
            if (!documentVersionsMap.has(documentId)) {
              documentVersionsMap.set(documentId, []);
            }

            documentVersionsMap.get(documentId).push({
              id: fileMember.file.id,
              owner: fileMember.file.owner,
              ownerId: fileMember.file.ownerId,
              name: fileMember.file.name,
              nameVersion: fileMember.file.nameVersion,
              fileMember: fileMember,
              folderId: fileMember.file.folderId,
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
            });
          }
        });
      }

      documentVersionsMap.forEach((versions, documentId) => {
        versions.sort((a: any, b: any) => {
          const versionAMatch = a.name.match(/_v(\d+)/);
          const versionBMatch = b.name.match(/_v(\d+)/);

          const versionA = versionAMatch ? parseInt(versionAMatch[1], 10) : 0;
          const versionB = versionBMatch ? parseInt(versionBMatch[1], 10) : 0;

          if (versionB !== versionA) {
            return versionB - versionA; // Higher version wins
          }

          const numVersionA = parseFloat(a.version || "0") || 0;
          const numVersionB = parseFloat(b.version || "0") || 0;

          if (numVersionB !== numVersionA) {
            return numVersionB - numVersionA;
          }

          return (
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          );
        });

        const latestVersion = versions[0];
        const validatedFile = validateDocumentAccess(latestVersion);
        filesMap.set(documentId, validatedFile);
      });

      processedData.push(...Array.from(filesMap.values()));

      const folderKeys = ["folders", "folder"];
      let normalFoldersFound = false;

      for (const key of folderKeys) {
        if (responseData[key] && Array.isArray(responseData[key])) {
          normalFoldersFound = true;
          responseData[key].forEach((folder) => {
            if (folder.parentId) {
              return;
            }

            const folderData = {
              id: folder.id,
              owner: folder.owner,
              ownerId: folder.ownerId,
              name: folder.name,
              type: "folder",
              documentNumber: folder.documentId,
              folderId: folder.folderId,
              members: folder.members,
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
            };

            // Apply validation
            const validatedFolder = validateDocumentAccess(folderData);
            processedData.push(validatedFolder);
          });
          break;
        }
      }

      if (
        !normalFoldersFound &&
        responseData.folder &&
        !Array.isArray(responseData.folder)
      ) {
        // Single folder object
        const folder = responseData.folder;
        // Skip if folder has a parentId
        if (!folder.parentId) {
          const folderData = {
            id: folder.id,
            name: folder.name,
            type: "folder",
            folderId: folder.folderId,
            documentNumber: folder.documentId,
            members: folder.members,
            documentId: folder.documentId,
            createdAt: folder.createdAt,
            updatedAt: folder.updatedAt,
            owner: folder.owner,
            ownerId: folder.ownerId,
            size: folder.size || 0,
            status: folder.status || "PUBLIC",
            itemType: "folder",
            isFolder: true,
            path: folder.path,
            isOwned: true,
            isShared: false,
          };

          // Apply validation
          const validatedFolder = validateDocumentAccess(folderData);
          processedData.push(validatedFolder);
        }
      }

      // Process folderMembers (shared folders)
      if (
        responseData.folderMembers &&
        Array.isArray(responseData.folderMembers)
      ) {
        responseData.folderMembers.forEach((folderMember: folderMember) => {
          if (folderMember.folder && !folderMember.folder.parentId) {
            const folderData = {
              id: folderMember.folder.id,
              name: folderMember.folder.name,
              folderId: folderMember.folderId,
              owner: folderMember.owner,
              ownerId: folderMember.folder.ownerId,
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
              path: folderMember?.folder?.path,
              folderMembers: folderMember,
            };

            // Apply validation
            const validatedFolder = validateDocumentAccess(folderData);
            processedData.push(validatedFolder);
          }
        });
      }

      const sortedData = processedData.sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return dateB - dateA;
      });

      setDocuments(sortedData);
      setAllDocuments(sortedData);
    } catch (error) {
      console.error("API error:", error);
      setError("An error occurred while fetching data");
    } finally {
      setLoading(false);
    }
  };

  const handleFolderDoubleClick = useCallback(
    (item: Document) => {
      if (item.type === "folder" || item.itemType === "folder") {
        // Apply validation to get access permissions
        const validatedFolder = validateDocumentAccess(item);

        // Check if user can navigate into this folder
        if (!validatedFolder.canNavigate) {
          let title = "ບໍ່ມີສິດເຂົ້າເຖິງ";
          let text = "ທ່ານບໍ່ມີສິດເຂົ້າເຖິງໂຟນເດີນີ້.";

          if (validatedFolder.accessLevel === "public-readonly") {
            title = "ການເຂົ້າເຖິງແບບຈຳກັດ";
            text =
              "ໂຟນເດີສາທາລະນະນີ້ສາມາດເບິ່ງໄດ້ແຕ່ບໍ່ສາມາດເຂົ້າໄປໃນໂຟນເດີໄດ້. ພຽງແຕ່ເຈົ້າຂອງແລະສະມາຊິກເທົ່ານັ້ນທີ່ສາມາດເຂົ້າໄປໃນໂຟນເດີໄດ້.";
          } else if (validatedFolder.accessLevel === "no-access") {
            text = "ທ່ານບໍ່ມີສິດເຂົ້າເຖິງໂຟນເດີນີ້.";
          }

          Swal.fire({
            icon: "warning",
            title: title,
            text: text,
            timer: 3000,
            showConfirmButton: false,
          });
          return;
        }

        // If user can view the folder, proceed with navigation
        setLoading(true);
        setPage(0);

        const newFolderPath = item.path;

        const isRootFolder =
          !newFolderPath ||
          newFolderPath === "/" ||
          newFolderPath === "" ||
          newFolderPath === "root";

        if (isRootFolder) {
          localStorage.removeItem("currentFolderPath");
          localStorage.removeItem("currentFolderId");
          setSearchParams({});
        } else {
          localStorage.setItem("currentFolderPath", newFolderPath);
          localStorage.setItem("currentFolderId", item.id);
          setSearchParams({ folderPath: newFolderPath });
        }

        setSelectedDocument(validatedFolder); // Use validated folder with access info

        const refetchData = async () => {
          try {
            if (isRootFolder) {
              await handleGetData();
            } else {
              await handleGetDocumentsByPath(newFolderPath);
            }
          } catch (error) {
            console.error("Error during data refetch:", error);
          } finally {
            setLoading(false);
          }
        };

        setSelectedItems([]);

        // Execute the refetch
        refetchData();
      }
    },
    [setSearchParams, handleGetDocumentsByPath, handleGetData, setLoading]
  );

  const handleSelectAll = () => {
    const selectableDocuments = documents.filter((doc) => {
      const validatedDoc = validateDocumentAccess(doc);
      return validatedDoc.canSelect;
    });

    if (selectedItems.length === selectableDocuments.length) {
      // Deselect all
      setSelectedItems([]);
    } else {
      // Select all selectable documents
      setSelectedItems(selectableDocuments.map((doc) => doc.id));
    }
  };

 const handleSelectItem = (id: string) => {
  const currentFolderPath =
    searchParams.get("folderPath") ||
    localStorage.getItem("currentFolderPath");

  const doc = documents.find((document) => document.id === id);

  if (doc) {
    // Apply validation to get access permissions
    const validatedDoc = validateDocumentAccess(doc);

    // Check if user can select this document
    if (!validatedDoc.canSelect) {
      let title = "ບໍ່ມີສິດເຂົ້າເຖິງ";
      let text = "ທ່ານບໍ່ມີສິດເລືອກເອກະສານນີ້.";

      if (validatedDoc.accessLevel === "public-readonly") {
        title = "ການເຂົ້າເຖິງແບບຈຳກັດ";
        text =
          "ເອກະສານສາທາລະນະນີ້ສາມາດເບິ່ງໄດ້ແຕ່ບໍ່ສາມາດເລືອກໄດ້. ພຽງແຕ່ເຈົ້າຂອງແລະສະມາຊິກເທົ່ານັ້ນທີ່ສາມາດເລືອກເອກະສານໄດ້.";
      } else if (validatedDoc.accessLevel === "no-access") {
        text = "ທ່ານບໍ່ມີສິດເຂົ້າເຖິງເອກະສານນີ້.";
      }

      Swal.fire({
        icon: "warning",
        title: title,
        text: text,
        timer: 3000,
        showConfirmButton: false,
      });
      return;
    }

    // Check if the item is already selected
    const isCurrentlySelected = selectedItems.includes(id);
    
    if (isCurrentlySelected) {
      // If clicking on already selected item, deselect it
      setSelectedDocument(null);
      setSelectedItems([]);
      localStorage.removeItem("selectedDocumentId");
      localStorage.removeItem("selectedDocumentNumber");
      localStorage.removeItem("selectedDocumentType");
    } else {
      // If selecting a new item, replace the current selection (single selection)
      setSelectedDocument(validatedDoc);
      setSelectedItems([id]); // Only store the current selected item
      localStorage.setItem("selectedDocumentId", id);
      localStorage.setItem("selectedDocumentNumber", validatedDoc?.documentId);
      localStorage.setItem("selectedDocumentType", validatedDoc.type);
    }
  }

  setCollapseOpen(false);
  setVersionDocument([]);
  setFileHistory([]);

  if (currentFolderPath) {
    setSearchParams({ folderPath: currentFolderPath });
  }
};

  // Filter out PRIVATE documents that user cannot access in the main data processing
  const filterAccessibleDocuments = (documents: Document[]): Document[] => {
    if (!currentUser?.id) {
      // If no user, only show public documents but mark them as non-selectable
      return documents
        .filter((doc) => doc.status === "PUBLIC")
        .map((doc) => validateDocumentAccess(doc));
    }

    // Return all documents with proper access validation
    return documents.map((doc) => validateDocumentAccess(doc));
  };

  // Optional: Add helper function to show access denied message
  const showAccessDeniedMessage = (accessLevel: string) => {
    let title = "ບໍ່ມີສິດເຂົ້າເຖິງ";
    let text = "ທ່ານບໍ່ມີສິດເລືອກລາຍການນີ້.";

    if (accessLevel === "public-readonly") {
      title = "ການເຂົ້າເຖິງແບບຈຳກັດ";
      text =
        "ເອກະສານສາທາລະນະນີ້ສາມາດເບິ່ງໄດ້ແຕ່ບໍ່ສາມາດເລືອກໄດ້. ພຽງແຕ່ເຈົ້າຂອງແລະສະມາຊິກເທົ່ານັ້ນທີ່ສາມາດເລືອກໄດ້.";
    } else if (accessLevel === "no-access") {
      text = "ທ່ານບໍ່ມີສິດເຂົ້າເຖິງລາຍການນີ້.";
    }

    Swal.fire({
      icon: "warning",
      title: title,
      text: text,
      timer: 3000,
      showConfirmButton: false,
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
      text: "ການດຳເນີນການນີ້ຈະຍ້າຍເອກະສານນີ້ໄປຖັງຂີ້ເຫຍື້ອ.",
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
            text: `${isFolder ? "folder" : "file"} ຖືກລົບສຳເລັດແລ້ວ.`,
            showConfirmButton: false,
            timer: 2000,
          });
        }

        setSelectedItems([]);

        await handleGetData();
        if (folderPath) {
          await handleGetDocumentsByPath(folderPath);
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

    const itemType = selectedDocument.itemType === "folder" ? "ໂຟເດີ້" : "ໄຟລ໌";

    const result = await Swal.fire({
      title: "ທ່ານແນ່ໃຈບໍ່ ?",
      text: `ທ່ານຕ້ອງການປ່ຽນຊື່${itemType}ເປັນ "${newName}"?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "ຕົກລົງ",
      cancelButtonText: "ຍົກເລີກ",
    });

    if (!result.isConfirmed) return;

    try {
      setIsSubmitting(true);
      setLoading(true);

      const endPoint =
        selectedDocument.itemType === "folder"
          ? `${UPDATE_FOLDER_END_POINT}/${selectedDocument.id}`
          : `${UPDATE_FILE_END_POINT}/${selectedDocument.id}`;

      const payload: { name: string; folderId?: string | number } = {
        name: newName,
      };

      if (selectedDocument.folderId) {
        payload.folderId = selectedDocument.folderId;
      }

      const res = await axiosInstance.patch(endPoint, payload);

      if (res?.status === 200) {
        setSelectedDocument({ ...res.data });

        await Swal.fire({
          icon: "success",
          title: `${itemType}ຖືກປ່ຽນຊື່ສຳເລັດ!`,
          text: `${itemType}ຖືກປ່ຽນຊື່ເປັນ "${newName}" ສຳເລັດແລ້ວ.`,
          showConfirmButton: false,
          timer: 2000,
        });

        await handleGetData();

        // ✅ Fix: Pass folderPath explicitly if needed
        if (folderPath) {
          await handleGetDocumentsByPath(folderPath);
        }

        setSelectedItems([]);
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

        const response = await fetch(selectedDocument?.url);
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
    setPage(0);
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
    if (!selectedDocument?.documentId) return;

    try {
      // Don't set global loading state here
      const res = await axiosInstance.get(
        `${GET_VERSION_FILE_END_POINT}/${selectedDocument.documentId}`
      );
      setVersionDocument(res?.data?.data || []);
    } catch (error) {
      console.error("Error fetching file history:", error);
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
    } else {
      setVersionDocument([]);
      setFileHistory([]);
    }
  }, [searchParams]);

  useEffect(() => {
    const folderPath = searchParams.get("folderPath");

    if (folderPath) {
      handleGetDocumentsByPath(folderPath);
    } else {
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

    const moveDocuments = eventBus.subscribe("DOCUMNETS_UPDATED", () => {
      if (folderPath) {
        handleGetDocumentsByPath(folderPath);
      } else {
        handleGetData();
      }
    });

    return () => {
      unsubscribeFiles();
      unsubscribeFolders();
      moveDocuments();
    };
  }, [searchParams]);
  return {
    filterAccessibleDocuments,
    setVersionUploadOpen,
    versionUploadOpen,
    selectedDocumentNumber,
    handleUploadVersion,
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
    documents,
    selectedItems,
    setDocuments,
    filterAnchorEl,
    isSelected,
    handleSelectAll,
    handleSelectItem,
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
    showAccessDeniedMessage,
  };
};

export default UseMainController;
