import React from "react";
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  Divider,
  LinearProgress,
  CircularProgress,
} from "@mui/material";

interface TopExpensesData {
  id: number;
  type: string;
  title: number;
  color: string;
}

interface TopExpensesPanelProps {
  data: TopExpensesData[];
  loading?: boolean;
  totalDocuments?: number; // Add this prop to ensure correct total
}

const TopExpensesPanel: React.FC<TopExpensesPanelProps> = ({
  data,
  loading = false,
  totalDocuments, // Use this instead of calculating from data
}) => {
  // Use the passed totalDocuments or calculate from data as fallback
  const actualTotal = totalDocuments || data.reduce((sum, item) => sum + item.title, 0);
  
  // Show only top 5 types but calculate percentages based on actual total
  const displayData = data.slice(0, 5);

  return (
    <Paper sx={{ p: 2, height: "100%", borderRadius: "12px" }}>
      <Typography variant="h5" mb={2} textAlign="center">
        ເອກະສານທີ່ມີເວີຊັນທັງໝົດ
      </Typography>

      {loading ? (
        // Loading state
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "calc(100% - 40px)",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <CircularProgress size={40} />
          <Typography color="text.secondary">ກຳລັງໂຫຼດຂໍ້ມູນ...</Typography>
        </Box>
      ) : actualTotal === 0 ? (
        // Empty state
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "calc(100% - 40px)",
          }}
        >
          <Typography color="text.secondary">ບໍ່ມີຂໍ້ມູນ</Typography>
        </Box>
      ) : (
        // Data available state
        <>
          {/* Total documents section */}
          <Box sx={{ mb: 3 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mb: 0.5,
              }}
            >
              <Typography variant="body1" fontWeight="bold">
                ເອກະສານທັງໝົດ
              </Typography>
              <Typography variant="body1" fontWeight="bold">
                {actualTotal}
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={100}
              sx={{
                height: 10,
                borderRadius: 1,
                backgroundColor: "#f5f5f5",
                "& .MuiLinearProgress-bar": {
                  backgroundColor: "#1976d2",
                },
              }}
            />
          </Box>

          <Divider sx={{ mb: 2 }} />

          {/* Document types breakdown */}
          <Typography variant="body2" fontWeight="medium" mb={1}>
            ແຍກຕາມປະເພດ
          </Typography>

          <List sx={{ width: "100%" }}>
            {displayData.map((item) => (
              <ListItem key={item.id} disablePadding sx={{ mb: 2 }}>
                <Box sx={{ width: "100%" }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 0.5,
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      {item.type}
                    </Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {item.title}
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={(item.title / actualTotal) * 100}
                    sx={{
                      height: 8,
                      borderRadius: 1,
                      backgroundColor: "#f5f5f5",
                      "& .MuiLinearProgress-bar": {
                        backgroundColor: item.color,
                      },
                    }}
                  />
                </Box>
              </ListItem>
            ))}
          </List>

          {/* Show remaining count if there are more than 5 types */}
          {data.length > 5 && (
            <Box sx={{ mt: 2, p: 1, bgcolor: "#f5f5f5", borderRadius: 1 }}>
              <Typography variant="body2" color="text.secondary" align="center">
                ແລະອີກ {data.length - 5} ປະເພດ ({actualTotal - displayData.reduce((sum, item) => sum + item.title, 0)} ເອກະສານ)
              </Typography>
            </Box>
          )}
        </>
      )}
    </Paper>
  );
};

export default TopExpensesPanel;