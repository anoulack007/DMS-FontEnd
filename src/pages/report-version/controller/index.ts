import { useEffect, useState, useCallback } from "react";
import axiosInstance from "../../../configs/axios";
import * as XLSX from "xlsx";
import Swal from "sweetalert2";
import { debounce } from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import { GET_OWNER_DOC_END_POINT } from "../../../configs/endPoint/file&folder";

interface DateFilterType {
  startDate: Dayjs | null;
  endDate: Dayjs | null;
}

// Define type for the document API response
interface DocumentApiResponse {
  message: string;
  data: {
    folders: any[];
    files: any[];
    folderMembers: any[];
    fileMembers: any[];
  };
  duration: string;
  statusCode: number;
}

// Interface for processed data with version info
export interface FileWithVersionInfo {
  id: string;
  name: string;
  nameVersion: string;
  type: string;
  size: number;
  status: string;
  ownerId: string;
  ownerName?: string;
  version: string;
  event: string;
  createdAt: string;
  updatedAt: string;
}

const UseMainController = () => {
  const [documents, setDocuments] = useState<FileWithVersionInfo[]>([]);
  const [filteredDocuments, setFilteredDocuments] = useState<
    FileWithVersionInfo[]
  >([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [dateFilter, setDateFilter] = useState<DateFilterType>({
    startDate: dayjs().subtract(30, "day"),
    endDate: dayjs(),
  });
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleGetDocuments = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get<DocumentApiResponse>(
        GET_OWNER_DOC_END_POINT
      );

      // Process files to extract version information
      const processedFiles: FileWithVersionInfo[] = [];

      // Only process files (not folders)
      const files = res?.data?.data?.files || [];

      files.forEach((file) => {
        // Extract version number from the version field
        const versionNum = file.version || "v0";

        // Helper function to extract numeric version
        const getVersionNumber = (version: string): number => {
          const match = version.match(/v(\d+)/);
          return match ? parseInt(match[1]) : 0;
        };

        const numericVersion = getVersionNumber(versionNum);

        // Include ALL files regardless of version - show all versions of each file
        processedFiles.push({
          id: file.id,
          name: file.name,
          nameVersion: file.nameVersion,
          type: file.type,
          size: file.size,
          status: file.status,
          ownerId: file.ownerId,
          ownerName: file.ownerName || "Unknown",
          version: versionNum,
          event: numericVersion >= 1 ? "Update" : "Create",
          createdAt: file.createdAt,
          updatedAt: file.updatedAt,
        });
      });

      // Sort by createdAt (latest first)
      const sortedData = processedFiles.sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return dateB - dateA; // Latest first (descending order)
      });

      setDocuments(sortedData);

      // Apply initial date filter
      applyFilters(sortedData, searchQuery, dateFilter);
    } catch (error) {
      console.error("Error fetching documents:", error);
    } finally {
      setLoading(false);
    }
  };

  // Combined filter function that applies both search and date filters
  const applyFilters = useCallback(
    (docs: FileWithVersionInfo[], query: string, dates: DateFilterType) => {
      let filtered = [...docs];

      // Apply date filter
      if (dates.startDate && dates.endDate) {
        filtered = filtered.filter((doc) => {
          const docDate = dayjs(doc.updatedAt); // Using updatedAt for filtering
          return (
            (docDate.isAfter(dates.startDate, "day") ||
              docDate.isSame(dates.startDate, "day")) &&
            (docDate.isBefore(dates.endDate, "day") ||
              docDate.isSame(dates.endDate, "day"))
          );
        });
      }

      // Apply search filter
      if (query) {
        filtered = filtered.filter(
          (doc) =>
            doc.name.toLowerCase().includes(query.toLowerCase()) ||
            doc.ownerName?.toLowerCase().includes(query.toLowerCase())
        );
      }

      setFilteredDocuments(filtered);
    },
    []
  );

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((query: string) => {
      setSearchQuery(query);
      setPage(0); // Reset page when search changes
      applyFilters(documents, query, dateFilter);
    }, 500),
    [documents, dateFilter, applyFilters]
  );

  const handleSearch = (query: string) => {
    debouncedSearch(query);
    setPage(0);
  };

  // Date filter function
  const handleDateFilterChange = useCallback(
    (newDateFilter: DateFilterType) => {
      setDateFilter(newDateFilter);
      setPage(0); // Reset page when date filter changes
      applyFilters(documents, searchQuery, newDateFilter);
    },
    [documents, searchQuery, applyFilters]
  );

  // Reset filters function
  const resetFilters = useCallback(() => {
    const defaultDateFilter = {
      startDate: dayjs().subtract(30, "day"),
      endDate: dayjs(),
    };
    setDateFilter(defaultDateFilter);
    setSearchQuery("");
    setPage(0); // Reset page when filters are reset
    applyFilters(documents, "", defaultDateFilter);
  }, [documents, applyFilters]);

  const handleExportToExcel = () => {
    Swal.fire({
      title: "ທ່ານແນ່ໃຈບໍ່?",
      text: "ທ່ານຕ້ອງການ Export ເອກະສານໄປຍັງ Excel ບໍ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ຕົກລົງ",
      cancelButtonText: "ຍົກເລີກ",
    }).then((result) => {
      if (result.isConfirmed) {
        // Format data for Excel export
        const exportData = filteredDocuments.map((doc) => ({
          ຊື່ເອກະສານ: doc.name,
          ເວີຊັ່ນ: doc.version,
          ປະເພດ: doc.type,
          ຂະໜາດ: `${(doc.size / 1024).toFixed(2)} KB`,
          ວັນທີປັບປຸງ: dayjs(doc.updatedAt).format("DD/MM/YYYY HH:mm"),
          ສະຖານະ: doc.status,
        }));

        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Documents");

        XLSX.writeFile(workbook, "ລາຍງານເອກະສານເວີຊັນເອກະສານ.xlsx");

        Swal.fire(
          "ສົ່ງອອກແລ້ວ!",
          "ລາຍການເອກະສານຂອງທ່ານໄດ້ຖືກສົ່ງອອກແລ້ວ.",
          "success"
        );
      }
    });
  };

  useEffect(() => {
    handleGetDocuments();
  }, []);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const handleRowsPerPageChange = useCallback((newRowsPerPage: number) => {
    setRowsPerPage(newRowsPerPage);
    setPage(0);
  }, []);

  return {
    loading,
    documents: filteredDocuments,
    handleSearch,
    handleExportToExcel,
    dateFilter,
    handleDateFilterChange,
    resetFilters,
    page,
    rowsPerPage,
    handlePageChange,
    handleRowsPerPageChange,
  };
};

export default UseMainController;