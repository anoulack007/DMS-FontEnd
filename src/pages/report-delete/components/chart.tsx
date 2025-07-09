import React from "react";
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
} from "@mui/material";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

export interface ChartData {
  id: number;
  title: string;
  type: number;
  color: string;
  amount: number;
  category: string;
}

interface ExpensesChartProps {
  data: ChartData[];
  sortBy: string;
  onSortByChange: (value: string) => void;
  loading?: boolean;
}

const ExpensesChart: React.FC<ExpensesChartProps> = ({
  data,
  loading = false,
}) => {
  return (
    <Paper sx={{ p: 2, height: "100%", borderRadius: "12px" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h5">
          Chart ຍອດລວມເອກະສານ (Event Deletes)
        </Typography>
      </Box>

      <Box sx={{ height: 300, width: "100%" }}>
        {loading ? (
          // Loading state
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <CircularProgress size={40} />
            <Typography color="text.secondary">ກຳລັງໂຫຼດຂໍ້ມູນ...</Typography>
          </Box>
        ) : data.length === 0 ? (
          // Empty state
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <Typography color="text.secondary">ບໍ່ມີຂໍ້ມູນ</Typography>
          </Box>
        ) : (
          // Data available state
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="type"
                nameKey="title"
                label={({ title, type, amount }) => {
                  const displayTitle = title === "Unknown" ? "Folder" : title;
                  return `${displayTitle}: ${type} (${amount}%)`;
                }}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(_value, name, props) => {
                  const displayTitle = props.payload.title === "Unknown" ? "Folder" : props.payload.title;
                  return [
                    `${props.payload.type} documents (${props.payload.amount}%)`, 
                    displayTitle
                  ];
                }} 
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </Box>
    </Paper>
  );
};

export default ExpensesChart;