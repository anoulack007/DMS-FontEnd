// components/FileHistory.tsx
import { Box, Typography, Button } from "@mui/material";
import { useState } from "react";
import { Version } from "../../../models/file-model";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";

interface FileHistoryProps {
  fileHistory: Version[];
}

export const FileHistory = ({ fileHistory }: FileHistoryProps) => {
  const [showAll, setShowAll] = useState(false);
  const initialLimit = 3;

  const formatDate = (date?: string) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString();
  };

  if (!fileHistory || fileHistory.length === 0) {
    return (
      <Typography
        sx={{ py: 2, textAlign: "center" }}
        variant="body2"
        color="text.secondary"
      >
        No history available
      </Typography>
    );
  }

  const displayedHistory = showAll
    ? fileHistory
    : fileHistory.slice(0, initialLimit);

  return (
    <Box>
      {displayedHistory.map((history, index) => (
        <Box
          key={index}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            p: 1,
          }}
        >
          <Typography color="text.secondary" mb={1}>
            {history?.event}
          </Typography>
          <Typography color="text.secondary">
            {formatDate(history?.createdAt)}
          </Typography>
        </Box>
      ))}

      {fileHistory.length > initialLimit && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 1 }}>
          <Button
            onClick={() => setShowAll(!showAll)}
            startIcon={showAll ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
            size="small"
            sx={{
              textTransform: "none",
              color: "text.secondary",
              "&:hover": {
                backgroundColor: "action.hover",
              },
            }}
          >
            {showAll ? "ໜ້ອຍລົງ" : `ທັງໝົດ (${fileHistory.length})`}
          </Button>
        </Box>
      )}
    </Box>
  );
};
