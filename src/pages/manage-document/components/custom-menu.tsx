import { useState } from "react";
import { Box, Button, Divider } from "@mui/material";

// Import the new MoveDialog component

//icons
import DetailI_ic from "../../../assets/Image/Detail_ic.svg";

// Icons
import DeleteIcon from "@mui/icons-material/Delete";
import MoveToInboxIcon from "@mui/icons-material/MoveToInbox";
import DownloadIcon from "@mui/icons-material/Download";
import EditIcon from "@mui/icons-material/Edit";
import MoveDialog from "./moveto";

interface Props {
  selectedCount: number;
  onDetailsClick: () => void;
  hanldeFolderRename: () => void;
  handleDownload: () => void;
  handleDelete: (e: React.FormEvent) => void;
}

const CustomMenu = ({
  selectedCount,
  onDetailsClick,
  hanldeFolderRename,
  handleDelete,
  handleDownload,
}: Props) => {
  // State for managing the move dialog
  const [moveDialogOpen, setMoveDialogOpen] = useState(false);

  // Function to handle opening the move dialog
  const handleMoveToClick = () => {
    setMoveDialogOpen(true);
  };

  // Function to handle closing the move dialog
  const handleCloseDialog = () => {
    setMoveDialogOpen(false);
  };

  // Function to handle the "Move here" button
  const handleMoveHere = () => {
    setMoveDialogOpen(false);
  };

  const ListMenu = [
    {
      label: "Delete",
      icon: <DeleteIcon />,
      onclick: handleDelete,
    },
    {
      label: "Move to",
      icon: <MoveToInboxIcon />,
      onclick: handleMoveToClick,
    },
    {
      label: "Download",
      icon: <DownloadIcon />,
      onclick: handleDownload,
    },
    {
      label: "Rename",
      icon: <EditIcon />,
      onclick: hanldeFolderRename,
    },
  ];

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          padding: "10px 20px",
          bgcolor: "white",
          borderRadius: 1,
          gap: 5,
          boxShadow: 2,
          mb: 3,
        }}
      >
        {ListMenu.map((item, index) => (
          <Button
            key={index}
            onClick={item?.onclick}
            startIcon={item.icon}
            sx={{
              textTransform: "none",
              color: "#021016",
              padding: "6px 12px",
              fontSize: "14px",
            }}
          >
            {item.label}
          </Button>
        ))}

        {/* Right-aligned buttons */}
        <Box sx={{ ml: "auto", display: "flex", alignItems: "center" }}>
          {/* "selectedCount" button */}
          <Button
            sx={{
              border: "1px solid #ccc",
              textTransform: "none",
              padding: "6px 12px",
              color: "#021016",
              borderRadius: 5,
            }}
          >
            {selectedCount} selected
          </Button>

          {/* Vertical Divider */}
          <Divider
            orientation="vertical"
            flexItem
            sx={{
              mx: 2,
              height: "24px",
              alignSelf: "center",
              backgroundColor: "#ccc",
            }}
          />

          {/* "Details" button */}
          <Button
            onClick={onDetailsClick}
            sx={{
              textTransform: "none",
              color: "#021016",
              gap: 1,
            }}
          >
            <img src={DetailI_ic} alt="Detail" />
            Details
          </Button>
        </Box>
      </Box>

      {/* Use the MoveDialog component */}
      <MoveDialog
        open={moveDialogOpen}
        onClose={handleCloseDialog}
        onMove={handleMoveHere}
        selectedCount={selectedCount}
      />
    </>
  );
};

export default CustomMenu;
