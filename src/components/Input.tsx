import { styled, TextField } from "@mui/material";
import { GRAY1_COLOR } from "../theme/colors";

export const Input = styled(TextField)({
  width: "100%",
  "& .MuiOutlinedInput-root": {
    borderRadius: "12px",
    backgroundColor: GRAY1_COLOR,
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: GRAY1_COLOR,
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: GRAY1_COLOR,
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: GRAY1_COLOR,
    },
    // Add disabled state styling
    "&.Mui-disabled": {
      backgroundColor: "#f5f5f5", // Light gray background for disabled
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: "#e0e0e0", // Light border for disabled
      },
    },
  },
});
