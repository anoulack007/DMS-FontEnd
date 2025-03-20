import {
  Box,
  Button,
  CircularProgress,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from "@mui/material";

//images
// import Image from "../../assets/Image/2762372.jpg";
// import Logo from "../../assets/logo/JOB_LOGO.png";
import UseMainController from "./controller";

//icons
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Login_BG from "../../assets/Image/login/icons.webp";

const LoginPage = () => {
  const ctrl = UseMainController();

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        bgcolor: "background.default",
        borderRadius: "12px",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          maxWidth: 800,
          width: "90%",
          borderRadius: 2,
        }}
      >
        <Grid container>
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              {/* <Box sx={{ display: "flex", justifyContent: "center", m: 3 }}>
                <img width={180} src={Logo} alt="Logo" />
              </Box> */}

              <Typography
                mt={3}
                textAlign={"center"}
                variant="h5"
                fontWeight={700}
                sx={{
                  color: "#2C3E50",
                  fontFamily: "Noto Sans Lao, sans-serif",
                }}
              >
                ເຂົ້າສູ່ລະບົບ
              </Typography>

              <form onSubmit={ctrl.handleLogin}>
                <Box sx={{ p: 5 }}>
                  <TextField
                    inputRef={ctrl?.email}
                    slotProps={{
                      input: {
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
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockIcon />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
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

                  <Box mt={3} sx={{ maxHeight: 50 }}>
                    <Button
                      type="submit"
                      sx={{
                        borderRadius: 5,
                        height: "100%",
                        textTransform: "none",
                        bgcolor: "#2C3E50",
                        fontFamily: "Noto Sans Lao, sans-serif",
                      }}
                      fullWidth
                      variant="contained"
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
          <Grid item xs={12} md={6} sx={{ borderRadius: "12px" }}>
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
      </Paper>
    </Box>
  );
};

export default LoginPage;
