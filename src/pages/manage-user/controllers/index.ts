import { useCallback, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { DOCUMENT_DETAIL_PATH } from "../../../routes/paths";
import axiosInstance from "../../../configs/axios";
import Swal from "sweetalert2";
import { STATUS_ENUMS } from "../../../enums/status-enum";
import { IconType } from "../../../enums/icon-enums";
import { UserModel } from "../../../models/user";
import { GET_ALL_USER } from "../../../configs/endPoint/login";
import { debounce } from "@mui/material";

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

const UseMainController = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Pagination states
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredUsers, setFilteredUsers] = useState<UserModel[]>([]);

  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [filterAnchorEl, setFilterAnchorEl] = useState<{
    [key in SortField]?: HTMLElement | null;
  }>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [users, setUsers] = useState<UserModel[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserModel | null>(null);
  const [collapeOpen, setCollapseOpen] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [renameDialogOpen, setRenameDialogOpen] = useState<boolean>(false);
  const [inviteDialogOpen, setInviteDialogOpen] = useState<boolean>(false);
  const [shareDialogOpen, setShareDialogOpen] = useState<boolean>(false);

  const hanleNavigate = (path: string) => {
    navigate(path);
  };

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

    // Make sure filteredUsers is an array before calling slice
    if (!filteredUsers || !Array.isArray(filteredUsers)) {
      return [];
    }

    return filteredUsers.slice(startIndex, endIndex);
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
      const res = await axiosInstance.get(GET_ALL_USER);
      setUsers(res?.data?.data || []);
    } catch (error) {
      console.error("API error:", error);
      setError("An error occurred while fetching data");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectUser = (userId: string) => {
    const user = users.find((user) => user.userId === userId);

    setSelectedItems((prev) => {
      const newSelection = prev.includes(userId)
        ? prev.filter((item) => item !== userId)
        : [...prev, userId];

      // Update selected document based on selection
      if (user) {
        if (!prev.includes(userId)) {
          setSelectedUser(user);
        } else if (newSelection.length > 0) {
          const nextUser = users.find((u) => u.userId === newSelection[0]);
          setSelectedUser(nextUser || null);
        } else {
          setSelectedUser(null);
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

  useEffect(() => {
    const action = searchParams.get("action");
    setCollapseOpen(action === "collapse");
  }, [searchParams]);

  const handleDelete = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    const result = await Swal.fire({
      title: "ທ່ານແນ່ໃຈບໍ່?",
      text:
        selectedItems.length > 1
          ? `ຄຳສັ່ງນີ້ຈະລົບຜູ້ໃຊ້ນີ້ອອກຖາວອນ ${selectedItems.length}`
          : "ຄຳສັ່ງນີ້ຈະລົບຜູ້ໃຊ້ນີ້ອອກຖາວອນ.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "ລົບ",
      cancelButtonText: "ຍົກເລີກ",
    });

    if (result.isConfirmed) {
      try {
        // Show loading state
        Swal.fire({
          title: "ກຳລັງລົບ...",
          text: "ກະລຸນາລໍຖ້າໃນຂະນະທີ່ຜູ້ໃຊ້ກຳລັງຖືກລົບ.",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });

        await axiosInstance.delete(`/user/delete/${selectedUser?.id}`);

        setSelectedItems([]);
        setSelectedUser(null);

        Swal.fire({
          title: "ລົບສຳເລັດ!",
          text:
            selectedItems.length > 1
              ? "ຜູ້​ໃຊ້​ໄດ້​ຖືກ​ລົບສຳເລັດ​."
              : "ຜູ້ໃຊ້ໄດ້ຖືກລຶບຖິ້ມແລ້ວ.",
          icon: "success",
          showConfirmButton: false,
          timer: 1500,
        });

        await handleGetData();
      } catch (error: any) {
        console.error("Error deleting users:", error);
        Swal.fire({
          title: "Error!",
          text: `ເກີດຂໍ້ຜິດຜາດໃນການລົບຜູ້ໃຊ້: ${
            error.response?.data?.message || error.message
          }`,
          icon: "error",
        });
      }
    }
  };

  const handleEditUser = () => {
    // Check if a user is selected
    if (!selectedUser) {
      Swal.fire({
        title: "ບໍ່ໄດ້ເລືອກຜູ້ໃຊ້",
        text: "ກະລຸເລືອກຜູ້ໃຊ້້ເພື່ອໄປແກ້ໄຂ.",
        icon: "warning",
      });
      return;
    }

    // Navigate to the user detail page with the userId
    navigate(`/user-detail/${selectedUser.id}`);
  };

  const debouncedSearch = useCallback(
    debounce((query: string) => {
      if (!users || !Array.isArray(users)) {
        setFilteredUsers([]);
        return;
      }

      if (!query.trim()) {
        setFilteredUsers(users);
        return;
      }

      const lowerCaseQuery = query.toLowerCase();
      const filtered = users.filter(
        (user) =>
          user.name?.toLowerCase().includes(lowerCaseQuery) ||
          user.surname?.toLowerCase().includes(lowerCaseQuery) ||
          user.company?.toLowerCase().includes(lowerCaseQuery)
      );

      setFilteredUsers(filtered);
    }, 500), // 500ms delay
    [users]
  );

  // Handle search input changes
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPage(0);
    const query = event.target.value;
    setSearchQuery(query);
    debouncedSearch(query);
  };

  useEffect(() => {
    setFilteredUsers(users);
  }, [users]);

  useEffect(() => {
    handleGetData();
  }, []);

  return {
    // Pagination
    page,
    rowsPerPage,
    handleChangePage,
    handleChangeRowsPerPage,
    getPaginatedData,

    // Existing returns
    searchQuery,
    filteredUsers,
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
    selectedUser,
    loading,
    error,
    users,
    selectedItems,
    setUsers,
    filterAnchorEl,
    isSelected,
    handleSelectUser,
    handleFilterClick,
    handleFilterClose,
    handleDrawerClose,
    handleFolderClick,
    handleDelete,
    handleEditUser,
    handleSearchChange,
    hanleNavigate,
  };
};

export default UseMainController;
