import { useState, useMemo } from "react";
import { Box, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import DateRangeHeader from "./components/header";
import TopExpensesPanel from "./components/topExpensePane";
import DocumentTable from "./components/table";
import UseMainController from "./controller";
import ExpensesChart from "./components/chart";

export interface ChartData {
  id: number;
  title: string;
  type: number;
  color: string;
  amount: number;
  category?: string;
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

const ReportVersionPage = () => {
  const ctrl = UseMainController();
  const [sortBy, setSortBy] = useState("ລາຍປີ");

  // Get the current filtered documents count for verification
  const currentDocumentsCount = ctrl?.documents?.length || 0;

  // Transform data for top expenses panel
  const topExpensesData = useMemo(() => {
    if (!ctrl?.documents || ctrl?.documents.length === 0) {
      return [];
    }

    // Group data by document type
    const typeGroups: Record<string, number> = {};

    ctrl?.documents.forEach((doc) => {
      const type = doc.type || "Unknown";
      typeGroups[type] = (typeGroups[type] || 0) + 1;
    });

    // Convert to array and sort from highest to lowest count
    return Object.entries(typeGroups)
      .map(([type, count], index) => ({
        id: index + 1,
        type,
        title: count,
        color: COLORS[index % COLORS.length],
      }))
      .sort((a, b) => b.title - a.title)
      .slice(0, 5);
  }, [ctrl?.documents]);

  const chartData = useMemo(() => {
    if (!ctrl?.documents || ctrl?.documents.length === 0) {
      return [];
    }

    // Group by document type
    const typeGroups: Record<string, number> = {};
    ctrl?.documents.forEach((doc) => {
      const type = doc.type || "Unknown";
      typeGroups[type] = (typeGroups[type] || 0) + 1;
    });

    // Calculate percentages
    const total = ctrl?.documents.length;

    // Convert to array format for chart
    return Object.entries(typeGroups).map(([type, count], index) => ({
      id: index + 1,
      title: type,
      type: count,
      color: COLORS[index % COLORS.length],
      amount: Math.round((count / total) * 100),
      category: type,
    }));
  }, [ctrl?.documents]);

  return (
    <Box sx={{ p: 3, bgcolor: "#f5f5f5", minHeight: "100vh" }}>
      <Typography mb={5} color="#838383" variant="h5" fontWeight={700}>
        ລາຍງານເວີຊັນເອກະສານ
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
            totalDocuments={currentDocumentsCount}
          />
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
        documents={ctrl?.documents}
        loading={ctrl?.loading}
        onSearch={ctrl?.handleSearch}
        onExport={ctrl?.handleExportToExcel}
        totalCount={currentDocumentsCount}
        // Add these new props
        page={ctrl?.page}
        rowsPerPage={ctrl?.rowsPerPage}
        onPageChange={ctrl?.handlePageChange}
        onRowsPerPageChange={ctrl?.handleRowsPerPageChange}
      />
    </Box>
  );
};

export default ReportVersionPage;
