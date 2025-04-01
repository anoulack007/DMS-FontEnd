import { Box, Button, Typography } from "@mui/material";
import { styled, keyframes } from "@mui/material/styles";
import { useEffect, useState } from "react";
import Bg_Image from "../assets/logo/404.svg";
import { PRIMARY_COLOR } from "../theme/colors";

// Define keyframe animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

// Styled components with animations
const PageContainer = styled(Box)(({ theme }) => ({
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  backgroundImage: "radial-gradient(#e0e0e0 1px, transparent 1px)",
  backgroundSize: "20px 20px",
  padding: theme.spacing(3),
  borderRadius: "30px",
  position: "relative",
  overflow: "hidden",
  animation: `${fadeIn} 0.8s ease-out forwards`,
}));

const ContentWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
  maxWidth: "600px",
  padding: theme.spacing(4),
}));

const ImageContainer = styled(Box)(({ theme }) => ({
  position: "relative",
  cursor: "pointer",
  transition: "transform 0.3s ease",
  marginBottom: theme.spacing(4),
  "&:hover": {
    transform: "scale(1.03)",
  },
  "&:hover .character": {
    animation: `${float} 2s ease-in-out infinite`,
  },
}));

const RoundedButton = styled(Button)(() => ({
  backgroundColor: "#ff7a45",
  color: "#fff",
  textTransform: "none",
  borderRadius: "50px",
  padding: "10px 30px",
  fontWeight: "bold",
  boxShadow: "0px 4px 10px rgba(255, 122, 69, 0.3)",
  transition: "all 0.3s ease",
  animation: `${fadeIn} 1.2s ease-out forwards`,
  "&:hover": {
    backgroundColor: PRIMARY_COLOR,
    transform: "translateY(-3px)",
    boxShadow: "0px 6px 15px rgba(255, 122, 69, 0.4)",
  },
}));

// Fixed AnimatedTypography to properly handle the delay prop
const AnimatedTypography = styled(Typography, {
  shouldForwardProp: (prop) => prop !== "delay",
})(() => ({
  animation: `${fadeIn} 1s ease-out forwards`,
}));

const NotFoundPage = () => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true);
  }, []);

  return (
    <PageContainer>
      <ContentWrapper>
        <ImageContainer>
          <Box
            component="img"
            src={Bg_Image}
            alt="404 Illustration"
            className="main-image"
            sx={{
              width: "100%",
              maxWidth: "600px",
              height: "auto",
              position: "relative",
              zIndex: 1,
            }}
          />

          {/* This represents the animated characters */}
          <Box
            className="character"
            sx={{
              position: "absolute",
              width: "100%",
              height: "100%",
              top: 0,
              left: 0,
              pointerEvents: "none",
            }}
          />
        </ImageContainer>

        <AnimatedTypography
          variant="h5"
          sx={{
            letterSpacing: 1,
            fontWeight: 500,
            color: "#5f6368",
            mb: 4,
            animation: animate ? `${pulse} 3s ease-in-out infinite` : "none",
            animationDelay: "0.5s",
          }}
        >
          OPPS! ບໍ່ພົບໜ້ານີ້
        </AnimatedTypography>

        <RoundedButton variant="contained" href="/">
          ກັບໄປໜ້າຫຼັກ
        </RoundedButton>
      </ContentWrapper>
    </PageContainer>
  );
};

export default NotFoundPage;
