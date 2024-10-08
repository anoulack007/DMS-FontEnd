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
import { Link } from "react-router-dom";

//images
import Image from "../../assets/Image/2762372.jpg";
// import Logo from "../../assets/logo/JOB_LOGO.png";
import UseMainController from "./controller";

//icons
import EmailIcon from "@mui/icons-material/Email";
import PasswordIcon from "@mui/icons-material/Password";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

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
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img
                src={Image}
                alt="Login illustration"
                style={{ maxWidth: "100%", height: "auto" }}
              />
            </Box>
          </Grid>
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
                fontWeight={600}
                color="primary"
              >
                Login Account
              </Typography>

              <form onSubmit={ctrl.handleSubmit}>
                <Box sx={{ p: 5 }}>
                  <TextField
                    value={ctrl?.email ?? ""}
                    onChange={ctrl.handleChangeEmail}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon />
                        </InputAdornment>
                      ),
                    }}
                    placeholder="Email Id"
                    margin="normal"
                    fullWidth
                  />

                  <TextField
                    onChange={ctrl?.handleChangePassword}
                    value={ctrl?.password ?? ""}
                    type={ctrl.showPassword ? "text" : "password"}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PasswordIcon />
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
                    }}
                    placeholder="Password"
                    margin="normal"
                    fullWidth
                  />


                  <Typography fontSize={13} textAlign={"right"}>
                    <Link to="#">Forgot Password?</Link>
                  </Typography>

                  <Box mt={3} sx={{ maxHeight: 50 }}>
                    <Button
                      type="submit"
                      sx={{ borderRadius: 5, height: "100%", textTransform: 'none' }}
                      fullWidth
                      variant="contained"
                      disabled={ctrl?.email && ctrl?.password ? false : true}
                    >
                      {ctrl.loading ? (
                        <CircularProgress size={20} color="inherit" />
                      ) : (
                        "Login"
                      )}
                    </Button>
                  </Box>
                </Box>
              </form>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default LoginPage;
