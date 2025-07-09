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

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884D8",
  "#82ca9d",
  "#ffc658",
];

const ReportDeletePage = () => {
  const ctrl = UseMainController();
  const [sortBy, setSortBy] = useState("ລາຍປີ");

  const topExpensesData = useMemo(() => {
    if (!ctrl?.uploadDocument || ctrl?.uploadDocument.length === 0) {
      return [];
    }

    const typeGroups: Record<string, number> = {};

    ctrl?.uploadDocument.forEach((doc) => {
      const type = doc.type || "Unknown";
      typeGroups[type] = (typeGroups[type] || 0) + 1;
    });

    return Object.entries(typeGroups)
      .map(([type, count], index) => ({
        id: index + 1,
        type,
        title: count,
        color: COLORS[index % COLORS.length],
      }))
      .sort((a, b) => b.title - a.title)
      .slice(0, 5);
  }, [ctrl?.uploadDocument]);

  const chartData = useMemo(() => {
    if (!ctrl?.uploadDocument || ctrl?.uploadDocument.length === 0) {
      return [];
    }

    const typeGroups: Record<string, number> = {};
    ctrl?.uploadDocument.forEach((doc) => {
      const type = doc.type || "Unknown";
      if (!typeGroups[type]) {
        typeGroups[type] = 0;
      }
      typeGroups[type] += 1;
    });

    const total = ctrl?.uploadDocument.length;

    return Object.entries(typeGroups).map(([type, count], index) => ({
      id: index + 1,
      title: type,
      type: count,
      color: COLORS[index % COLORS.length],
      amount: Math.round((count / total) * 100),
      category: type,
    }));
  }, [ctrl?.uploadDocument]);

  return (
    <Box sx={{ p: 3, bgcolor: "#f5f5f5", minHeight: "100vh" }}>
      <Typography mb={5} color="#838383" variant="h5" fontWeight={700}>
        ລາຍງານການລຶບເອກະສານ
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
        ref={ctrl.tableRef} // Pass the ref to the table
        documents={ctrl?.uploadDocument}
        loading={ctrl?.loading}
        onSearch={ctrl?.handleSearch}
        onExport={ctrl?.handleExportToExcel}
      />
    </Box>
  );
};

export default ReportDeletePage;