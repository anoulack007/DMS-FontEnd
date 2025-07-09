import { useState, useMemo } from "react";
import { Box, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import DateRangeHeader from "./components/header";
import TopExpensesPanel from "./components/topExpensePane";
import ExpensesChart from "./components/chart";
import DocumentTable from "./components/table";
import UseMainController from "./controller";

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

const ReportRecycleBinPage = () => {
  const ctrl = UseMainController();
  const [sortBy, setSortBy] = useState("ລາຍປີ");

  // Transform data for top expenses panel
  const topExpensesData = useMemo(() => {
    if (!ctrl?.uploadDocument || ctrl?.uploadDocument.length === 0) {
      return [];
    }

    // Group data by document type
    const typeGroups: Record<string, number> = {};

    ctrl?.uploadDocument.forEach((doc) => {
      const type = doc.type || "Unknown"; // Default if missing
      typeGroups[type] = (typeGroups[type] || 0) + 1;
    });

    // Convert to array and sort from highest to lowest count
    return Object.entries(typeGroups)
      .map(([type, count], index) => ({
        id: index + 1,
        type,
        title: count, // Count of documents for that type
        color: COLORS[index % COLORS.length], // Assign colors
      }))
      .sort((a, b) => b.title - a.title) // Sort from big to small
      .slice(0, 5); // Show only top 5 types
  }, [ctrl?.uploadDocument]);

  const chartData = useMemo(() => {
    if (!ctrl?.uploadDocument || ctrl?.uploadDocument.length === 0) {
      return [];
    }

    // Group by document type instead of categories
    const typeGroups: Record<string, number> = {};
    ctrl?.uploadDocument.forEach((doc) => {
      const type = doc.type || "Unknown"; // Default if missing
      if (!typeGroups[type]) {
        typeGroups[type] = 0;
      }
      typeGroups[type] += 1;
    });

    // Calculate percentages
    const total = ctrl?.uploadDocument.length;

    // Convert to array format for chart
    return Object.entries(typeGroups).map(([type, count], index) => ({
      id: index + 1,
      title: type,
      type: count,
      color: COLORS[index % COLORS.length],
      amount: Math.round((count / total) * 100), // Percentage
      category: type, // Adding for tooltip display
    }));
  }, [ctrl?.uploadDocument]);

  return (
    <Box sx={{ p: 3, bgcolor: "#f5f5f5", minHeight: "100vh" }}>
      <Typography mb={5} color="#838383" variant="h5" fontWeight={700}>
        ລາຍງານການກູ້ຄືນເອກະສານ
      </Typography>

      <DateRangeHeader
        dateFilter={ctrl.dateFilter}
        onDateFilterChange={ctrl.handleDateFilterChange}
        resetFilters={ctrl.resetFilters}
      />

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <TopExpensesPanel data={topExpensesData} loading={ctrl?.loading} />
        </Grid>

        <Grid size={{ xs: 12, md: 8 }}>
          <ExpensesChart
            data={chartData}
            sortBy={sortBy}
            onSortByChange={(value) => setSortBy(value)}
            loading={ctrl?.loading}
          />
        </Grid>
      </Grid>

      <DocumentTable
        documents={ctrl?.uploadDocument}
        loading={ctrl?.loading}
        onSearch={ctrl?.handleSearch}
        onExport={ctrl?.handleExportToExcel}
        page={ctrl.page}
        rowsPerPage={ctrl.rowsPerPage}
        onPageChange={ctrl.handleChangePage}
        onRowsPerPageChange={ctrl.handleChangeRowsPerPage}
      />
    </Box>
  );
};

export default ReportRecycleBinPage;