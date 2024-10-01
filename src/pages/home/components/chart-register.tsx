import { Box, Typography, useTheme } from "@mui/material";
import {
  BarChart,
  Bar,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const data = [
  { month: "January", "2023": 40, "2024": 65 },
  { month: "February", "2023": 68, "2024": 78 },
  { month: "March", "2023": 86, "2024": 56 },
  { month: "April", "2023": 73, "2024": 44 },
  { month: "May", "2023": 56, "2024": 55 },
  { month: "June", "2023": 60, "2024": 70 },
  { month: "July", "2023": 86, "2024": 75 },
];

const ChartTotalRegister = () => {
    const theme = useTheme();

    return (
      <Box
        sx={{
          color: "white",
          bgcolor: "white",
          p: 2,
          borderRadius: 1,
          boxShadow: 1,
          width: '100%',
          height: 400,
        }}
      >
        <Typography gutterBottom sx={{ color: "black", fontSize: 13, ml: 2 }}>
          Total Registers
        </Typography>
        <Typography
          gutterBottom
          sx={{ color: "white", fontWeight: "bold", fontSize: 15, ml: 2 }}
        >
          Total orders
        </Typography>
        <ResponsiveContainer width="100%" height="80%">
          <BarChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid vertical={false} horizontal={true} strokeDasharray="3 3" stroke="gray" />
            <YAxis stroke={"gray"} />   
            <Tooltip />
            <Legend />
            <Bar
              dataKey="2023"
              fill={theme.palette.secondary.main}
              name="2023"
            />
            <Bar
              dataKey="2024"
              fill={theme.palette.primary.main}
              name="2024"
            />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    )
};

export default ChartTotalRegister;
