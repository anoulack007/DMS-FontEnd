import { Box, Button, Divider } from "@mui/material";

// Icons
import DetailI_ic from "../../../assets/Image/Detail_ic.svg";
import DeleteIcon from "@mui/icons-material/Delete";

interface Props {
  selectedCount: number;
  onDetailsClick: () => void;
  handleDelete: (e: React.FormEvent) => void;
}

const CustomMenu = ({
  selectedCount,
  onDetailsClick,
  handleDelete,
}: Props) => {
  // State for managing the move dialog

  const ListMenu = [
    {
      label: "ລຶບ",
      icon: <DeleteIcon />,
      onclick: handleDelete,
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
          height: "60px", // Fixed height to prevent layout shift
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
            {selectedCount} ລາຍການ
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
            ລາຍລະອຽດ
          </Button>
        </Box>
      </Box>

    </>
  );
};

export default CustomMenu;