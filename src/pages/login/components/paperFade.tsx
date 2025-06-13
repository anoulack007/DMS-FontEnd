import React from "react";
import { Paper, PaperProps, styled, keyframes } from "@mui/material";

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const AnimatedPaperWrapper = styled(Paper)<PaperProps>`
  animation: ${fadeIn} 0.8s ease-out;
`;

interface AnimatedFadePaperProps extends PaperProps {
  children: React.ReactNode;
}

export const AnimatedFadePaper: React.FC<AnimatedFadePaperProps> = ({
  children,
  ...props
}) => {
  return <AnimatedPaperWrapper {...props}>{children}</AnimatedPaperWrapper>;
};
