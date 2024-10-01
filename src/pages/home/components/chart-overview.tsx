import React, { useEffect } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const data = [
  { month: "January", "2023": 40, "2024": 65 },
  { month: "February", "2023": 68, "2024": 78 },
  { month: "March", "2023": 85, "2024": 68 },
  { month: "April", "2023": 73, "2024": 44 },
  { month: "May", "2023": 56, "2024": 55 },
  { month: "June", "2023": 60, "2024": 70 },
  { month: "July", "2023": 86, "2024": 75 },
];

const SalesValueChart: React.FC = () => {
  const theme = useTheme();

  useEffect(() => {
    console.log("SalesValueChart re-rendered");
  }, []);

  return (
    <Box
      sx={{
        color: "white",
        bgcolor: "#26205b",
        p: 2,
        borderRadius: 1,
        boxShadow: 1,
        width: '100%',
        height: 400,
      }}
    >
      <Typography gutterBottom sx={{ color: "white", fontSize: 13, ml: 2 }}>
        OVERVIEW
      </Typography>
      <ResponsiveContainer width="100%" height="80%">
        <LineChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid
            horizontal={true}
            vertical={false}
            stroke="gray"
            strokeDasharray={"3 3"}
          />
          <XAxis dataKey="month" stroke={"gray"} />
          <YAxis stroke={"gray"} domain={[0, "dataMax"]} />{" "}
          {/* Adjusted here */}
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="2024"
            stroke={theme.palette.primary.main}
            activeDot={{ r: 8 }}
          />
          <Line
            type="monotone"
            dataKey="2023"
            stroke={theme.palette.secondary.main}
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default SalesValueChart;
