import { Box, Button, Divider } from "@mui/material";

//icons
import DetailI_ic from '../../../assets/Image/Detail_ic.svg'

// Icons
import ShareIcon from "@mui/icons-material/Share";
import DeleteIcon from "@mui/icons-material/Delete";
import MoveToInboxIcon from "@mui/icons-material/MoveToInbox";
import DownloadIcon from "@mui/icons-material/Download";
import EditIcon from "@mui/icons-material/Edit";

interface Props {
  selectedCount: number;
  onDetailsClick: () => void; // Update the prop to accept a document
  hanldeFolderRename: () => void;
  handleDelete: (e: React.FormEvent) => void;
}

const CustomMenu = ({ selectedCount, onDetailsClick, hanldeFolderRename, handleDelete }: Props) => {
  const ListMenu = [
    {
      label: "Share",
      icon: <ShareIcon />,
    },
    {
      label: "Delete",
      icon: <DeleteIcon />,
      onclick: handleDelete
    },
    {
      label: "Move to",
      icon: <MoveToInboxIcon />,
    },
    {
      label: "Download",
      icon: <DownloadIcon />,
    },
    {
      label: "Rename",
      icon: <EditIcon />,
      onclick: hanldeFolderRename
    },
  ];

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        padding: "10px 20px",
        bgcolor: "white", // Background color similar to the image
        borderRadius: 1, // For slightly rounded corners
        gap: 5,
        boxShadow: "0 1px 4px rgba(0, 0, 0, 0.1)",
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
            borderRadius: 5
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
            gap: 1
          }}
        >
          <img src={DetailI_ic} alt="Detail" />Details
        </Button>
      </Box>
    </Box>
  );
};

export default CustomMenu;
