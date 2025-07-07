import { useState } from "react";
import {
  Box,
  InputAdornment,
  IconButton,
  CircularProgress,
  Grid2,
} from "@mui/material";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import { TypewriterText } from "./components/Typerwriting";
import UseMainController from "./controller";
import { AnimatedFormField } from "./components/FormFieldAnimated";
import { AnimatedButton } from "./components/ButtonAnimated";
import Login_BG from "../../assets/Document Management Icons.png";
import { AnimatedFadePaper } from "./components/paperFade";
import { AnimatedBackground } from "./components/BackgroundAnimation";

const LoginPage = () => {
  const ctrl = UseMainController();
  const [showSubtitle, setShowSubtitle] = useState<boolean>(false);

  return (
    <>
      <AnimatedBackground />
      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          p: 2,
        }}
      >
        <AnimatedFadePaper
          elevation={3}
          sx={{
            maxWidth: 1000,
            width: "100%",
            borderRadius: 10,
            overflow: "hidden", // Important for the wave effect
          }}
        >
          <Grid2 container>
            {/* Left column */}
            <Grid2 size={{ xs: 12, md: 6 }}>
              <Box
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <TypewriterText
                  text="ເຂົ້າສູ່ລະບົບ"
                  speed={150}
                  delay={300}
                  mt={3}
                  textAlign="center"
                  variant="h4"
                  fontWeight={700}
                  sx={{
                    color: "#2C3E50",
                    fontFamily: "Noto Sans Lao, sans-serif",
                  }}
                  onComplete={() => setShowSubtitle(true)}
                />

                {showSubtitle && (
                  <TypewriterText
                    text="ລະບົບຈັດເກັບເອກະສານຂອງບໍລິສັດ iQURi Tech"
                    speed={80}
                    delay={200}
                    mt={3}
                    textAlign="center"
                    fontWeight={700}
                    color="#838383"
                    sx={{
                      fontFamily: "Noto Sans Lao, sans-serif",
                    }}
                  />
                )}

                <form onSubmit={ctrl.handleLogin}>
                  <Box sx={{ p: 5 }}>
                    <AnimatedFormField
                      inputRef={ctrl?.email}
                      animationDelay="1.5s"
                      direction="left"
                      slotProps={{
                        input: {
                          style: { height: "70px", borderRadius: 8 },
                          startAdornment: (
                            <InputAdornment position="start">
                              <EmailOutlinedIcon />
                            </InputAdornment>
                          ),
                        },
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": {
                            border: "none",
                          },
                          "&:hover fieldset": {
                            border: "none",
                          },
                          "&.Mui-focused fieldset": {
                            border: "none",
                          },
                          backgroundColor: "#f5f5f5",
                          borderRadius: 8,
                        },
                      }}
                      placeholder="ປ້ອນຊື່ ຫຼື ອີເມວ"
                      margin="normal"
                      fullWidth
                    />

                    <AnimatedFormField
                      inputRef={ctrl?.password}
                      animationDelay="1.8s"
                      direction="right"
                      type={ctrl.showPassword ? "text" : "password"}
                      slotProps={{
                        input: {
                          style: { height: "70px", borderRadius: 8 },
                          startAdornment: (
                            <InputAdornment position="start">
                              <LockOutlinedIcon />
                            </InputAdornment>
                          ),
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={ctrl.handleClickShowPassword}
                                edge="end"
                              >
                                {ctrl.showPassword ? (
                                  <RemoveRedEyeOutlinedIcon />
                                ) : (
                                  <VisibilityOffOutlinedIcon />
                                )}
                              </IconButton>
                            </InputAdornment>
                          ),
                        },
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": {
                            border: "none",
                          },
                          "&:hover fieldset": {
                            border: "none",
                          },
                          "&.Mui-focused fieldset": {
                            border: "none",
                          },
                          backgroundColor: "#f5f5f5",
                          borderRadius: 8,
                        },
                      }}
                      placeholder="ລະຫັດຜ່ານ"
                      margin="normal"
                      fullWidth
                    />

                    <Box mt={3}>
                      <AnimatedButton
                        type="submit"
                        fullWidth
                        variant="contained"
                        animationDelay="2.1s"
                        sx={{
                          borderRadius: 5,
                          height: "50px",
                          textTransform: "none",
                          bgcolor: "#1E2B3A",
                          fontFamily: "Noto Sans Lao, sans-serif",
                          "&:hover": {
                            bgcolor: "#1A252F",
                          },
                        }}
                      >
                        {ctrl.loading ? (
                          <CircularProgress size={20} color="inherit" />
                        ) : (
                          "ເຂົ້າສູ່ລະບົບ"
                        )}
                      </AnimatedButton>
                    </Box>
                  </Box>
                </form>
              </Box>
            </Grid2>

            <Grid2 size={{ xs: 12, md: 6 }}>
              <Box
                sx={{
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  position: "relative",
                  background: `
                    linear-gradient(135deg, 
                      #00D4FF 0%, 
                      #00BFFF 20%, 
                      #1E90FF 40%, 
                      #4169E1 60%, 
                      #9932CC 80%, 
                      #FF1493 100%
                    )
                  `,
                  backgroundSize: "400% 400%",
                  animation: "smoothWaveGradient 12s ease-in-out infinite, fadeInRight 1s ease-out 0.5s both",
                  borderRadius: { xs: 0, md: "0 40px 40px 0" },
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: `
                      radial-gradient(circle at 20% 50%, rgba(255,255,255,0.3) 0%, transparent 70%),
                      radial-gradient(circle at 80% 20%, rgba(255,255,255,0.2) 0%, transparent 50%),
                      radial-gradient(circle at 40% 80%, rgba(255,255,255,0.1) 0%, transparent 60%)
                    `,
                    borderRadius: "0 40px 40px 0",
                    animation: "smoothWaveOverlay 10s ease-in-out infinite",
                  },
                }}
              >
                <img
                  onClick={() =>
                    window.open("https://iquritech.com/", "_blank")
                  }
                  src={Login_BG}
                  alt="Login illustration"
                  style={{
                    maxWidth: "80%",
                    height: "auto",
                    borderRadius: "15px",
                    zIndex: 1,
                    position: "relative",
                    filter: "drop-shadow(0 20px 20px rgba(0,0,0,0.1))",
                  }}
                />
              </Box>
            </Grid2>
          </Grid2>
        </AnimatedFadePaper>
      </Box>

      <style>
        {`
          @keyframes fadeInRight {
            from {
              opacity: 0;
              transform: translateX(30px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }

          @keyframes smoothWaveGradient {
            0% {
              background-position: 100% 50%;
            }
            50% {
              background-position: 0% 50%;
            }
            100% {
              background-position: 100% 50%;
            }
          }

          @keyframes smoothWaveOverlay {
            0%, 100% {
              opacity: 0.2;
              transform: scale(1);
            }
            50% {
              opacity: 0.4;
              transform: scale(1.01);
            }
          }
        `}
      </style>
    </>
  );
};

export default LoginPage;