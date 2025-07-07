import { createTheme } from "@mui/material";

const theme = createTheme();

const typography = {
  fontFamily: [
    '"Noto Sans Lao"',
    '-apple-system',
    'BlinkMacSystemFont',
    '"Segoe UI"',
    'Roboto',
    '"Helvetica Neue"',
    'Arial',
    'sans-serif',
  ].join(','),
  h1: {
    fontFamily: '"Noto Sans Lao", sans-serif',
    fontSize: "32px",
    fontWeight: "bold",
    [theme.breakpoints.up("md")]: {
      fontSize: "40px",
    },
  },
  h2: {
    fontFamily: '"Noto Sans Lao", sans-serif',
    fontSize: "28px",
    fontWeight: "bold",
    [theme.breakpoints.up("md")]: {
      fontSize: "36px",
    },
  },
  h3: {
    fontFamily: '"Noto Sans Lao", sans-serif',
    fontSize: "24px",
    fontWeight: "bold",
    [theme.breakpoints.up("md")]: {
      fontSize: "32px",
    },
  },
  h4: {
    fontFamily: '"Noto Sans Lao", sans-serif',
    fontSize: "20px",
    fontWeight: "bold",
    [theme.breakpoints.up("md")]: {
      fontSize: "28px",
    },
  },
  h5: {
    fontFamily: '"Noto Sans Lao", sans-serif',
    fontSize: "16px",
    fontWeight: "bold",
    [theme.breakpoints.up("md")]: {
      fontSize: "24px",
    },
  },
  h6: {
    fontFamily: '"Noto Sans Lao", sans-serif',
    fontSize: "14px",
    fontWeight: "bold",
    [theme.breakpoints.up("md")]: {
      fontSize: "20px",
    },
  },
  body1: {
    fontFamily: '"Noto Sans Lao", sans-serif',
    fontSize: "14px",
    [theme.breakpoints.up("md")]: {
      fontSize: "16px",
    },
  },
  body2: {
    fontFamily: '"Noto Sans Lao", sans-serif',
    fontSize: "12px",
    color: "#9796A1", // Fixed: changed from fontColor to color
    [theme.breakpoints.up("md")]: {
      fontSize: "14px",
    },
  },
  subtitle1: {
    fontFamily: '"Noto Sans Lao", sans-serif',
    fontSize: "18px",
    fontWeight: "bold",
    color: "#4B4B4B",
    [theme.breakpoints.up("md")]: {
      fontSize: "28px",
    },
  },
  subtitle2: {
    fontFamily: '"Noto Sans Lao", sans-serif',
    fontSize: "16px",
    fontWeight: "bold",
    color: "#4B4B4B",
    [theme.breakpoints.up("md")]: {
      fontSize: "24px",
    },
  },
};

export default typography;