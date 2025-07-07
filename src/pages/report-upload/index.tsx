import { useState, useMemo } from "react";
import { Box, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import DateRangeHeader from "./components/header";
import TopExpensesPanel from "./components/topExpensePane";
import ExpensesChart from "./components/chart";
import UseMainController from "./controller";
import DocumentTable from "./components/table";

export interface FollowDocumentModel {
  id: string;
  docName: string;
  ownerName: string;
  categories: string;
  type: string;
  company: string;
  event: string;
  updateBy: string;
  createdAt: string;
}

export interface ChartData {
  id: number;
  title: string;
  type: number;
  color: string;
  amount: number;
}

// Array of colors for chart
const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884D8",
  "#82ca9d",
  "#ffc658",
];

const ReportUploadPage = () => {
  const ctrl = UseMainController({ event: "Upload" });
  const [sortBy, setSortBy] = useState<string>("ລາຍປີ");

  // Use FILTERED documents for TopExpenses (same as table)
  const topExpensesData = useMemo(() => {
    if (!ctrl?.uploadDocument || ctrl?.uploadDocument.length === 0) {
      return [];
    }

    // Group FILTERED Upload events by document type
    const typeGroups: Record<string, number> = {};

    ctrl?.uploadDocument.forEach((doc: FollowDocumentModel) => {
      const type: string = doc.type || "Unknown";
      typeGroups[type] = (typeGroups[type] || 0) + 1;
    });

    console.log("Filtered Upload events grouped by type:", typeGroups);

    // Convert to array and sort from highest to lowest count
    return Object.entries(typeGroups)
      .map(([type, count], index) => ({
        id: index + 1,
        type,
        title: count, // Count of FILTERED Upload events for this type
        color: COLORS[index % COLORS.length],
      }))
      .sort((a, b) => b.title - a.title)
      .slice(0, 5); // Show top 5 types
  }, [ctrl?.uploadDocument]); // Changed dependency to filtered data

  // Chart data - Use FILTERED Upload events
  const chartData = useMemo(() => {
    if (!ctrl?.uploadDocument || ctrl?.uploadDocument.length === 0) {
      return [];
    }

    // Group FILTERED Upload events by document type
    const typeGroups: Record<string, number> = {};
    ctrl?.uploadDocument.forEach((doc: FollowDocumentModel) => {
      const type: string = doc.type || "Unknown";
      typeGroups[type] = (typeGroups[type] || 0) + 1;
    });

    const total: number = ctrl?.uploadDocument.length; // Total filtered documents

    return Object.entries(typeGroups).map(([type, count], index) => ({
      id: index + 1,
      title: type,
      type: count,
      color: COLORS[index % COLORS.length],
      amount: Math.round((count / total) * 100), // Percentage of filtered uploads
      category: type,
    }));
  }, [ctrl?.uploadDocument]); // Changed dependency to filtered data

  return (
    <Box sx={{ p: 3, bgcolor: "#f5f5f5", minHeight: "100vh" }}>
      <Typography mb={5} color="#838383" variant="h5" fontWeight={700}>
        ລາຍງານການອັບໂຫຼດເອກະສານ
      </Typography>

      <DateRangeHeader
        dateFilter={ctrl.dateFilter}
        onDateFilterChange={ctrl.handleDateFilterChange}
        resetFilters={ctrl.resetFilters}
      />

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <TopExpensesPanel
            data={topExpensesData}
            loading={ctrl?.loading}
            totalDocuments={ctrl?.uploadDocument?.length || 0} // Use filtered count
          />
        </Grid>

        <Grid size={{ xs: 12, md: 8 }}>
          <ExpensesChart
            data={chartData}
            sortBy={sortBy}
            onSortByChange={(value: string) => setSortBy(value)}
            loading={ctrl?.loading}
          />
        </Grid>
      </Grid>

      <DocumentTable
        documents={ctrl?.uploadDocument} // This is filtered data
        loading={ctrl?.loading}
        onSearch={ctrl?.handleSearch}
        onExport={ctrl?.handleExportToExcel}
      />
    </Box>
  );
};

export default ReportUploadPage;