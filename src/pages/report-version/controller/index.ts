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
  versionNum: string;
  event: string;
  createdAt: string;
  updatedAt: string;
}

const UseMainController = () => {
  const [documents, setDocuments] = useState<FileWithVersionInfo[]>([]);
  const [filteredDocuments, setFilteredDocuments] = useState<FileWithVersionInfo[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [dateFilter, setDateFilter] = useState<DateFilterType>({
    startDate: dayjs().subtract(30, "day"),
    endDate: dayjs(),
  });
  const [searchQuery, setSearchQuery] = useState<string>("");

  const handleGetDocuments = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get<DocumentApiResponse>(GET_OWNER_DOC_END_POINT);

      // Process files to extract version information
      const processedFiles: FileWithVersionInfo[] = [];
      
      // Only process files (not folders)
      const files = res?.data?.data?.files || [];
      
      files.forEach(file => {
        // Extract version number from the version field
        const versionNum = file.version || "v0";
        
        processedFiles.push({
          id: file.id,
          name: file.name,
          nameVersion: file.nameVersion,
          type: file.type,
          size: file.size,
          status: file.status,
          ownerId: file.ownerId,
          ownerName: file.ownerName || "Unknown", // You might need to fetch owner info if not included
          versionNum: versionNum,
          event: "Update", // Since we're focusing on files with versions
          createdAt: file.createdAt,
          updatedAt: file.updatedAt
        });
      });

      const sortedData = processedFiles.sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return dateB - dateA;
      });
      
      setDocuments(sortedData);
      
      // Apply initial date filter
      applyFilters(processedFiles, searchQuery, dateFilter);
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
            docDate.isAfter(dates.startDate, "day") || docDate.isSame(dates.startDate, "day")) &&
            (docDate.isBefore(dates.endDate, "day") || docDate.isSame(dates.endDate, "day")
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
      applyFilters(documents, query, dateFilter);
    }, 500),
    [documents, dateFilter, applyFilters]
  );

  const handleSearch = (query: string) => {
    debouncedSearch(query);
  };

  // Date filter function
  const handleDateFilterChange = useCallback(
    (newDateFilter: DateFilterType) => {
      setDateFilter(newDateFilter);
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
        const exportData = filteredDocuments.map(doc => ({
          "ຊື່ເອກະສານ": doc.name,
          "ເວີຊັ່ນ": doc.versionNum,
          "ປະເພດ": doc.type,
          "ຂະໜາດ": `${(doc.size / 1024).toFixed(2)} KB`,
          "ວັນທີປັບປຸງ": dayjs(doc.updatedAt).format("DD/MM/YYYY HH:mm"),
          "ສະຖານະ": doc.status
        }));

        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Documents");

        XLSX.writeFile(workbook, "ລາຍງານເອກະສານ.xlsx");

        Swal.fire(
          "ສົ່ງອອກແລ້ວ!",
          "ລາຍການເອກະສານຂອງທ່ານໄດ້ຖືກສົ່ງອອກແລ້ວ.",
          "success",
        );
      }
    });
  };

  useEffect(() => {
    handleGetDocuments();
  }, []);

  return {
    loading,
    documents: filteredDocuments,
    handleSearch,
    handleExportToExcel,
    dateFilter,
    handleDateFilterChange,
    resetFilters,
  };
};

export default UseMainController;