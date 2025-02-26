import { styled, TextField } from "@mui/material";
import { GRAY1_COLOR } from "../theme/colors";

export const Input = styled(TextField)({
  // backgroundColor: GRAY4_COLOR, border: 'none', padding: '24px', borderRadius: '12px', height: 46,
  width: "100%",
  "& .MuiOutlinedInput-root": {
    borderRadius: "12px", // Adjust the border radius as needed
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
  },
});
