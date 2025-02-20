// components/VersionList.tsx
import { useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import {
  OpenInNew,
  KeyboardArrowDown,
  KeyboardArrowUp,
} from "@mui/icons-material";
import { Version } from "../../../models/file-model";

interface VersionListProps {
  version: Version;
  index: number;
}

const ITEMS_TO_SHOW = 3;

export const VersionList = ({ version }: VersionListProps) => {
  const formatDate = (date?: string) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString();
  };

  const handleFileOpen = (url?: string) => {
    if (!url) return;
    window.open(url, "_blank");
  };

  return (
    <Box
      onClick={() => handleFileOpen(version.url)}
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mb: 0.5,
        padding: 1,
        cursor: version.url ? "pointer" : "default",
        "&:hover": {
          backgroundColor: "action.hover",
          borderRadius: 1,
        },
        transition: "background-color 0.2s",
      }}
    >
      <Box sx={{ display: "flex", gap: 2 }}>
        <Typography color="text.secondary">{version?.version}</Typography>
        <Typography color="text.secondary">
          By: {version?.owner?.name}
        </Typography>
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Typography color="text.secondary">
          {formatDate(version?.createdAt)}
        </Typography>
        {version.url && (
          <OpenInNew fontSize="small" sx={{ color: "text.secondary" }} />
        )}
      </Box>
    </Box>
  );
};

// Create a new container component to handle the list and show more/less logic
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

  const toggleShowAll = () => {
    setShowAll(!showAll);
  };

  return (
    <Box sx={{ mt: 2 }}>
      {versions.length === 0 ? (
        <Box sx={{ py: 2, textAlign: "center" }}>
          <Typography color="text.secondary">
            No versions available yet
          </Typography>
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
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Button
                onClick={toggleShowAll}
                startIcon={
                  showAll ? <KeyboardArrowUp /> : <KeyboardArrowDown />
                }
                sx={{ mt: 1, textTransform: "none", color: "text.secondary" }}
                size="small"
                
              >
                {showAll ? "Show Less" : `See All (${versions.length})`}
              </Button>
            </Box>
          )}
        </>
      )}
    </Box>
  );
};
