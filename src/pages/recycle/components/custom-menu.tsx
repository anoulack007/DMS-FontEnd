import { Box, Button, Divider } from "@mui/material";

//icons
import DetailI_ic from "../../../assets/Image/Detail_ic.svg";

// Icons
import DeleteIcon from "@mui/icons-material/Delete";
import RestoreOutlinedIcon from "@mui/icons-material/RestoreOutlined";

interface Props {
  selectedCount: number;
  onDetailsClick: () => void;
  handleDelete: (e: React.FormEvent) => void;
  handleRestore: (e: React.FormEvent) => void;
}

const CustomMenu = ({
  selectedCount,
  onDetailsClick,
  handleDelete,
  handleRestore,
}: Props) => {
  const ListMenu = [
    {
      label: "ກູ້ຄືນ",
      icon: <RestoreOutlinedIcon />,
      onclick: handleRestore,
    },
    {
      label: "ລຶບ",
      icon: <DeleteIcon />,
      onclick: handleDelete,
    },
  ];

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        padding: "10px 20px",
        bgcolor: "white",
        borderRadius: 1,
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

      <Box sx={{ ml: "auto", display: "flex", alignItems: "center" }}>
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
  );
};

export default CustomMenu;
