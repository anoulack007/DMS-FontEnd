import { useEffect, useState, useCallback } from "react";
import axiosInstance from "../../../configs/axios";
import { GET_ALL_FOLLOW_DOCUMENT_END_POINT } from "../../../configs/endPoint/follow-documnet-endpoint";
import { FollowDocumentModel } from "..";
import * as XLSX from "xlsx";
import Swal from "sweetalert2";
import { debounce } from "@mui/material";
import dayjs, { Dayjs } from "dayjs";

interface DateFilterType {
  startDate: Dayjs | null;
  endDate: Dayjs | null;
}

interface UseMainControllerProps {
  event?: string; // Optional event parameter
}

const UseMainController = (props?: UseMainControllerProps) => {
  const [uploadDocument, setUploadDocument] = useState<FollowDocumentModel[]>(
    []
  );
  const [filteredDocuments, setFilteredDocuments] = useState<
    FollowDocumentModel[]
  >([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [dateFilter, setDateFilter] = useState<DateFilterType>({
    startDate: dayjs().subtract(30, "day"),
    endDate: dayjs(),
  });
  const [searchQuery, setSearchQuery] = useState<string>("");

  const handleGetReportUploadDocument = async (eventType?: string) => {
    try {
      setLoading(true);

      let url = GET_ALL_FOLLOW_DOCUMENT_END_POINT;
      if (eventType) {
        url += `?event=${eventType}`;
      }

      const res = await axiosInstance.get<{ data: FollowDocumentModel[] }>(url);

      let documents = res?.data?.data || [];
      const uploadDocuments = documents.filter((doc) => doc.event === "Upload");

      setUploadDocument(uploadDocuments);

      applyFilters(uploadDocuments, searchQuery, dateFilter);
    } catch (error) {
      console.error("Error fetching documents:", error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = useCallback(
    (docs: FollowDocumentModel[], query: string, dates: DateFilterType) => {
      let filtered = [...docs];

      if (dates.startDate && dates.endDate) {
        filtered = filtered.filter((doc) => {
          const docDate = dayjs(doc.createdAt);
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

  const handleDateFilterChange = useCallback(
    (newDateFilter: DateFilterType) => {
      setDateFilter(newDateFilter);
      applyFilters(uploadDocument, searchQuery, newDateFilter);
    },
    [uploadDocument, searchQuery, applyFilters]
  );

  const resetFilters = useCallback(() => {
    const defaultDateFilter = {
      startDate: dayjs().subtract(30, "day"),
      endDate: dayjs(),
    };
    setDateFilter(defaultDateFilter);
    setSearchQuery("");
    applyFilters(uploadDocument, "", defaultDateFilter);
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

        XLSX.writeFile(workbook, "ລາຍງານການອັບໂຫລດເອກະສານ.xlsx");

        Swal.fire(
          "ສົ່ງອອກແລ້ວ!",
          "ລາຍການເອກະສານຂອງທ່ານໄດ້ຖືກສົ່ງອອກແລ້ວ.",
          "success"
        );
      }
    });
  };

  useEffect(() => {
    handleGetReportUploadDocument(props?.event);
  }, [props?.event]);

  return {
    loading,
    uploadDocument: filteredDocuments, // Filtered documents for display (still Upload events)
    allUploadDocument: uploadDocument, // All Upload events (before date/search filtering)
    totalUploadCount: uploadDocument.length, // Total count of Upload events
    handleSearch,
    handleExportToExcel,
    dateFilter,
    handleDateFilterChange,
    resetFilters,
  };
};

export default UseMainController;
