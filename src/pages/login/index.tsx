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
import Login_BG from "../../assets/Image/login/icons.webp";
import { AnimatedFadePaper } from "./components/paperFade";
import { AnimatedBackground } from "./components/BackgroundAnimation";

const LoginPage = () => {
  const ctrl = UseMainController();
  const [showSubtitle, setShowSubtitle] = useState(false);

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
        }}
      >
        <AnimatedFadePaper
          elevation={3}
          sx={{
            maxWidth: 1000,
            width: "100%",
            borderRadius: 10,
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
                    text="ລະບົບຈົດການເອກະສານຂອງບໍລິສັດ iQURi Tech"
                    speed={80}
                    delay={200}
                    mt={3}
                    textAlign="center"
                    variant="subtitle1"
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
                          bgcolor: "#2C3E50",
                          fontFamily: "Noto Sans Lao, sans-serif",
                          "&:hover": {
                            bgcolor: "#1A252F",
                          },
                        }}
                        disabled={ctrl?.email && ctrl?.password ? false : true}
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
                }}
              >
                <img
                  onClick={() =>
                    window.open("https://iquritech.com/", "_blank")
                  }
                  src={Login_BG}
                  alt="Login illustration"
                  style={{
                    maxWidth: "100%",
                    height: "auto",
                    borderRadius: "0 40px 40px 0",
                    animation: "fadeInRight 1s ease-out 0.5s both",
                  }}
                />
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
                `}
                </style>
              </Box>
            </Grid2>
          </Grid2>
        </AnimatedFadePaper>
      </Box>
    </>
  );
};

export default LoginPage;
