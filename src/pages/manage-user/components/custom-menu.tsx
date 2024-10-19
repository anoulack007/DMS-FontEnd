import { Box, Button, Divider } from "@mui/material";

//icons

// Icons
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

interface Props {
  selectedCount: number; // Update the prop to accept a document
}

const CustomMenu = ({ selectedCount }: Props) => {
  const ListMenu = [
    {
      label: "Edit",
      icon: <EditIcon />,
    },
    {
      label: "Delete",
      icon: <DeleteIcon />,
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
      </Box>
    </Box>
  );
};

export default CustomMenu;
