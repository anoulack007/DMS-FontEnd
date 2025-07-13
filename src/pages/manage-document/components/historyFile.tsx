import { Box, Typography, Button, Skeleton } from "@mui/material";
import { useState } from "react";
import { Version } from "../../../models/file-model";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";

interface FileHistoryProps {
  fileHistory: Version[] | null;
  isLoading?: boolean;
}

export const FileHistory = ({ fileHistory, isLoading = false }: FileHistoryProps) => {
  const [showAll, setShowAll] = useState(false);
  const initialLimit = 3;

  const formatDate = (date?: string) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString();
  };

  // Show loading skeletons when data is loading
  if (isLoading) {
    return (
      <Box>
        {[...Array(3)].map((_, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              p: 1,
            }}
          >
            <Skeleton width="60%" height={24} />
            <Skeleton width="20%" height={24} />
          </Box>
        ))}
      </Box>
    );
  }

  if (!fileHistory || fileHistory.length === 0) {
    return (
      <Typography
        sx={{ py: 2, textAlign: "center" }}
        variant="body2"
        color="text.secondary"
      >
        ບໍ່ມີປະຫວັດ
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
            {history?.event ?? history?.folderEvent}
          </Typography>
          <Typography color="text.secondary">
            {formatDate(history?.createdAt ?? history?.folder?.createdAt)}
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