import React from "react";
import {
  Box,
  Typography,
  Paper,
  FormControl,
  Select,
  MenuItem,
  SelectChangeEvent,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { AccessTime, KeyboardArrowDown } from "@mui/icons-material";

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
  loading?: boolean; // Add loading prop
}

const ExpensesChart: React.FC<ExpensesChartProps> = ({
  data,
  sortBy,
  onSortByChange,
  loading = false, // Default to false
}) => {
  const handleSortByChange = (event: SelectChangeEvent) => {
    onSortByChange(event.target.value);
  };

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
          Chart ຍອດລວມເອກະສານ (Event Restores)
        </Typography>
        <FormControl variant="outlined" size="small" sx={{ width: 120 }}>
          <Select
            value={sortBy}
            onChange={handleSortByChange}
            startAdornment={
              <InputAdornment position="start">
                <AccessTime fontSize="small" />
              </InputAdornment>
            }
            IconComponent={KeyboardArrowDown}
            disabled={loading} // Disable during loading
          >
            <MenuItem value="ລາຍປີ">ລາຍປີ</MenuItem>
            <MenuItem value="ລາຍເດືອນ">ລາຍເດືອນ</MenuItem>
            <MenuItem value="ລາຍວັນ">ລາຍວັນ</MenuItem>
          </Select>
        </FormControl>
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
                dataKey="amount"
                nameKey="title"
                label={({ title, amount }) => `${title}: ${amount}%`}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value, name) => [`${value}%`, name]} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </Box>
    </Paper>
  );
};

export default ExpensesChart;
