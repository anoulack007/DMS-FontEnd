import { Paper, PaperProps, keyframes } from "@mui/material";

const fadeZoom = keyframes`
  0% {
    opacity: 0;
    transform: scale(0.95) translateY(40px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
`;

const FadePaper = ({ children, ...props }: PaperProps) => {
  return (
    <Paper
      {...props}
      sx={{
        animation: `${fadeZoom} 0.9s ease-out`,
        ...props.sx,
      }}
    >
      {children}
    </Paper>
  );
};

export default FadePaper;
