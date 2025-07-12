import { useState } from "react";
import { Box, Typography, Button, CircularProgress } from "@mui/material";
import {
  OpenInNew,
  KeyboardArrowDown,
  KeyboardArrowUp,
} from "@mui/icons-material";
import { Version } from "../../../models/file-model";
import Swal from "sweetalert2";

interface VersionListProps {
  version: Version;
  index: number;
}

const ITEMS_TO_SHOW = 3;

export const VersionList = ({ version }: VersionListProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const formatDate = (date?: string) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-GB");
  };

  const handleFileOpen = async (event: React.MouseEvent, url?: string) => {
    // Prevent event bubbling
    event.preventDefault();
    event.stopPropagation();

    if (!url) return;

    // Show loading state
    setIsLoading(true);

    try {
      // Ensure the URL has a protocol
      let fullUrl = url;
      if (!url.startsWith("http://") && !url.startsWith("https://")) {
        fullUrl = `https://${url}`;
      }

      // Show SweetAlert2 confirmation dialog
      const result = await Swal.fire({
        title: "ເປີດເອກະສານ",
        text: "ທ່ານຕ້ອງການດາວໂຫລດເອກະສານນີ້ບໍ່?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "ດາວໂຫລດ",
        cancelButtonText: "ຍົກເລີກ",
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#808080",
        reverseButtons: true,
      });

      // If user canceled, do nothing
      if (result.dismiss === Swal.DismissReason.cancel || !result.isConfirmed) {
        setIsLoading(false);
        return;
      }

      // User confirmed download - open in new tab AND download
      if (result.isConfirmed) {
        // First open in a new tab
        window.open(fullUrl, "_blank", "noopener,noreferrer");

        // Then trigger download
        const link = document.createElement("a");
        link.href = fullUrl;
        link.download = version.version || "document"; // Use version number as filename or default to 'document'
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error("Error handling file:", error);
      Swal.fire({
        icon: "error",
        title: "ຂໍອະໄພ",
        text: "ເກີດຂໍ້ຜິດພາດໃນການເປີດເອກະສານ",
        confirmButtonText: "ຕົກລົງ",
      });
    } finally {
      // Hide loading state after a short delay to show the indicator
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    }
  };

  return (
    <Box
      onClick={(e) => !isLoading && handleFileOpen(e, version.url)}
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mb: 0.5,
        padding: 1,
        cursor: version.url && !isLoading ? "pointer" : "default",
        "&:hover": {
          backgroundColor:
            version.url && !isLoading ? "action.hover" : "transparent",
          borderRadius: 1,
        },
        transition: "background-color 0.2s",
        opacity: isLoading ? 0.7 : 1,
      }}
    >
      <Box sx={{ display: "flex", gap: 2 }}>
        <Typography color="text.secondary">{version?.version}</Typography>
        <Typography color="text.secondary">
          By: {version?.owner?.name || "Unknown"}
        </Typography>
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Typography color="text.secondary">
          {formatDate(version?.createdAt)}
        </Typography>
        {version.url &&
          (isLoading ? (
            <CircularProgress size={18} thickness={4} />
          ) : (
            <OpenInNew
              fontSize="small"
              sx={{ color: "text.secondary" }}
              onClick={(e) => handleFileOpen(e, version.url)}
            />
          ))}
      </Box>
    </Box>
  );
};

interface VersionListContainerProps {
  versions: Version[];
}

export const VersionListComponent = ({
  versions,
}: VersionListContainerProps) => {
  const [showAll, setShowAll] = useState<boolean>(false);

  const displayedVersions = showAll
    ? versions
    : versions.slice(0, ITEMS_TO_SHOW);
  const hasMore = versions.length > ITEMS_TO_SHOW;

  const toggleShowAll = (event: React.MouseEvent) => {
    // Prevent the click from triggering file download
    event.stopPropagation();
    setShowAll(!showAll);
  };

  return (
    <Box sx={{ mt: 2 }}>
      {versions.length === 0 ? (
        <Box sx={{ py: 2, textAlign: "center" }}>
          <Typography color="text.secondary">ຍັງບໍ່ມີເວີຊັນເທື່ອ</Typography>
        </Box>
      ) : (
        <>
          {displayedVersions.map((version, index) => (
            <VersionList
              key={version.id || index}
              version={version}
              index={index}
            />
          ))}

          {hasMore && (
            <Box
              sx={{ display: "flex", justifyContent: "center" }}
              onClick={(e) => e.stopPropagation()} // Prevent click from triggering parent handler
            >
              <Button
                onClick={toggleShowAll}
                startIcon={
                  showAll ? <KeyboardArrowUp /> : <KeyboardArrowDown />
                }
                sx={{ mt: 1, textTransform: "none", color: "text.secondary" }}
                size="small"
              >
                {showAll ? "ໜ້ອຍລົງ" : `ທັງໝົດ (${versions.length})`}
              </Button>
            </Box>
          )}
        </>
      )}
    </Box>
  );
};
