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
}

const TopExpensesPanel: React.FC<TopExpensesPanelProps> = ({
  data,
  loading = false,
}) => {
  // Calculate total number of documents
  const totalDocuments = data.reduce((sum, item) => sum + item.title, 0);

  return (
    <Paper sx={{ p: 2, height: "100%", borderRadius: "12px" }}>
      <Typography variant="h5" mb={2} textAlign="center">
        ເອກະສານທີ່ຖືກລຶບທັງໝົດ
      </Typography>

      {loading ? (
        // Loading state
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "calc(100% - 40px)", // Account for the heading
            flexDirection: "column",
            gap: 2,
          }}
        >
          <CircularProgress size={40} />
          <Typography color="text.secondary">
            <CircularProgress />
          </Typography>
        </Box>
      ) : data.length === 0 ? (
        // Empty state
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "calc(100% - 40px)", // Account for the heading
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
                {totalDocuments}
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={100} // Always 100% as it represents the total
              sx={{
                height: 10,
                borderRadius: 1,
                backgroundColor: "#f5f5f5",
                "& .MuiLinearProgress-bar": {
                  backgroundColor: "#1976d2", // Use a different color for the total
                },
              }}
            />
          </Box>

          <Divider sx={{ mb: 2 }} />

          <Typography variant="body2" fontWeight="medium" mb={1}>
            ແຍກຕາມປະເພດ
          </Typography>

          <List sx={{ width: "100%" }}>
            {data.map((item) => (
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
                      {item.type === "Unknown" ? "Folder" : item.type}
                    </Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {item.title}
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={(item.title / totalDocuments) * 100} // Calculate percentage of total
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
        </>
      )}
    </Paper>
  );
};

export default TopExpensesPanel;