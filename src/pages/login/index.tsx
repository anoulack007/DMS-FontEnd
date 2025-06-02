import {
  Box,
  Button,
  CircularProgress,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";

import UseMainController from "./controller";


// icons
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import Login_BG from "../../assets/Image/login/icons.webp";
import FadePaper from "./components/FadePaper";
// import { BackgroundParticles } from "./components/BackgroundAnimation";

const LoginPage = () => {
  const ctrl = UseMainController();

  return (
    <>
      {/* <BackgroundParticles /> */}

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
        <FadePaper
          elevation={3}
          sx={{
            maxWidth: 1000,
            width: "90%",
            borderRadius: 2,
          }}
        >
          <Grid container>
            {/* Left column */}
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <Typography
                  mt={3}
                  textAlign="center"
                  variant="h4"
                  fontWeight={700}
                  sx={{
                    color: "#2C3E50",
                    fontFamily: "Noto Sans Lao, sans-serif",
                  }}
                >
                  ເຂົ້າສູ່ລະບົບ
                </Typography>

                <Typography
                  mt={3}
                  textAlign="center"
                  variant="subtitle1"
                  fontWeight={700}
                  color="#838383"
                  sx={{
                    fontFamily: "Noto Sans Lao, sans-serif",
                  }}
                >
                  ລະບົບຈົດການເອກະສານຂອງບໍລິສັດ iQURi Tech
                </Typography>

                <form onSubmit={ctrl.handleLogin}>
                  <Box sx={{ p: 5 }}>
                    <TextField
                      inputRef={ctrl?.email}
                      slotProps={{
                        input: {
                          style: { height: "70px" },
                          startAdornment: (
                            <InputAdornment position="start">
                              <EmailIcon />
                            </InputAdornment>
                          ),
                        },
                      }}
                      placeholder="ປ້ອນຊື່ ຫຼື ອີເມວ"
                      margin="normal"
                      fullWidth
                    />

                    <TextField
                      inputRef={ctrl?.password}
                      type={ctrl.showPassword ? "text" : "password"}
                      slotProps={{
                        input: {
                          style: { height: "70px" },
                          startAdornment: (
                            <InputAdornment position="start">
                              <LockIcon />
                            </InputAdornment>
                          ),
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={ctrl.handleClickShowPassword}
                                edge="end"
                              >
                                {ctrl.showPassword ? (
                                  <VisibilityOff />
                                ) : (
                                  <Visibility />
                                )}
                              </IconButton>
                            </InputAdornment>
                          ),
                        },
                      }}
                      placeholder="ລະຫັດຜ່ານ"
                      margin="normal"
                      fullWidth
                    />

                    <Box mt={3}>
                      <Button
                        type="submit"
                        fullWidth
                        variant="contained"
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
                      </Button>
                    </Box>
                  </Box>
                </form>
              </Box>
            </Grid>

            {/* Right column */}
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img
                  src={Login_BG}
                  alt="Login illustration"
                  style={{
                    maxWidth: "100%",
                    height: "auto",
                    borderRadius: "0 12px 12px 0",
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </FadePaper>
      </Box>
    </>
  );
};

export default LoginPage;
