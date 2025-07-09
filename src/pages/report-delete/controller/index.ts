import { useEffect, useState, useCallback, useRef } from "react";
import axiosInstance from "../../../configs/axios";
import { GET_ALL_FOLLOW_DOCUMENT_END_POINT } from "../../../configs/endPoint/follow-documnet-endpoint";
import { FollowDocumentModel } from "..";
import * as XLSX from "xlsx";
import Swal from "sweetalert2";
import { debounce } from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import { DocumentTableRef } from "../components/table";

interface DateFilterType {
  startDate: Dayjs | null;
  endDate: Dayjs | null;
}

const UseMainController = () => {
  const [uploadDocument, setUploadDocument] = useState<FollowDocumentModel[]>([]);
  const [filteredDocuments, setFilteredDocuments] = useState<FollowDocumentModel[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [dateFilter, setDateFilter] = useState<DateFilterType>({
    startDate: null,
    endDate: null,
  });
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  // Create ref for table component
  const tableRef = useRef<DocumentTableRef>(null);

  const handleGetReportUploadDocument = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get<{ data: FollowDocumentModel[] }>(
        GET_ALL_FOLLOW_DOCUMENT_END_POINT,
        {
          params: {
            event: "Delete"
          }
        }
      );

      const uploadedDocs = res?.data?.data || [];
      setUploadDocument(uploadedDocs);
      
      // Apply initial filters
      applyFilters(uploadedDocs, searchQuery, dateFilter);
    } catch (error) {
      console.error("Error fetching documents:", error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = useCallback(
    (docs: FollowDocumentModel[], query: string, dates: DateFilterType) => {
      let filtered = [...docs];

      // Apply date filter
      if (dates.startDate && dates.endDate) {
        filtered = filtered.filter((doc) => {
          const docDate = dayjs(doc.createdAt);
          return (
            (docDate.isAfter(dates.startDate, "day") || docDate.isSame(dates.startDate, "day")) &&
            (docDate.isBefore(dates.endDate, "day") || docDate.isSame(dates.endDate, "day"))
          );
        });
      }

      // Apply search filter
      if (query.trim()) {
        filtered = filtered.filter(
          (doc) =>
            doc.docName.toLowerCase().includes(query.toLowerCase()) ||
            doc.ownerName.toLowerCase().includes(query.toLowerCase())
        );
      }

      setFilteredDocuments(filtered);
    },
    []
  );

  const debouncedSearch = useCallback(
    debounce((query: string) => {
      setSearchQuery(query);
      applyFilters(uploadDocument, query, dateFilter);
    }, 500),
    [uploadDocument, dateFilter, applyFilters]
  );

  const handleSearch = (query: string) => {
    debouncedSearch(query);
  };

  // Updated date filter function that resets pagination
  const handleDateFilterChange = useCallback(
    (newDateFilter: DateFilterType) => {
      setDateFilter(newDateFilter);
      applyFilters(uploadDocument, searchQuery, newDateFilter);
      
      // Reset table pagination when date filter changes
      if (tableRef.current) {
        tableRef.current.resetPage();
      }
    },
    [uploadDocument, searchQuery, applyFilters]
  );

  // Updated reset filters function
  const resetFilters = useCallback(() => {
    const defaultDateFilter = {
      startDate: null,
      endDate: null,
    };
    setDateFilter(defaultDateFilter);
    setSearchQuery("");
    applyFilters(uploadDocument, "", defaultDateFilter);
    
    // Reset table pagination when filters are reset
    if (tableRef.current) {
      tableRef.current.resetPage();
    }
  }, [uploadDocument, applyFilters]);

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
        const worksheet = XLSX.utils.json_to_sheet(filteredDocuments);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Documents");

        XLSX.writeFile(workbook, "ລາຍງານເອກະສານການລົບເອກະສານ.xlsx");

        Swal.fire(
          "ສົ່ງອອກແລ້ວ!",
          "ລາຍການເອກະສານຂອງທ່ານໄດ້ຖືກສົ່ງອອກແລ້ວ.",
          "success"
        );
      }
    });
  };

  useEffect(() => {
    handleGetReportUploadDocument();
  }, []);

  return {
    loading,
    uploadDocument: filteredDocuments,
    handleSearch,
    handleExportToExcel,
    dateFilter,
    handleDateFilterChange,
    resetFilters,
    tableRef, // Return the ref so it can be passed to the table
  };
};

export default UseMainController;