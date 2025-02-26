import {
  Autocomplete,
  Box,
  Button,
  Card,
  IconButton,
  Paper,
  styled,
  TextField,
  Typography,
} from "@mui/material";
import image from "../../assets/avatar.svg";
import Grid from "@mui/material/Grid2";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { Visibility, VisibilityOff } from "@mui/icons-material";

import { MANAGE_USER_PATH } from "../../routes/paths";

// icon
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { Input } from "../../components/Input";
import { GRAY1_COLOR } from "../../theme/colors";
import UseCreateController from "./controllers/create";
import AvatarUpload from "../user-detail/components/UploadAvatar";

const Item = styled(Paper)({
  padding: "30px",
  textAlign: "center",
  borderRadius: "15px",
  boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
  backgroundColor: "#fff", // Ensure white background as in your example
});

const FormCreateUserPage = () => {
  const ctrl = UseCreateController();

  return (
    <Box>
      <Box sx={{ flexGrow: 1, width: "100%", height: 89 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <IconButton
            onClick={() => ctrl?.handleSwitchPageClick(MANAGE_USER_PATH)}
          >
            <ArrowBackIosNewIcon />
          </IconButton>
          <Typography variant="h4">ເພິ່ມຜູ້ໃຊ້</Typography>
        </Box>
      </Box>

      <form onSubmit={ctrl?.handleSubmit}>
        <Grid container spacing={2}>
          <Grid>
            <Card
              sx={{
                width: "344px",
                height: "364px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: "15px",
                flexDirection: "column",
              }}
            >
              <AvatarUpload
                defaultImage={image}
                onChange={ctrl?.handleAvatarChange}
              />

              <Typography fontWeight={600} variant="body1">
                ອັບໂຫລດຮູບໂປຟາຍ
              </Typography>
            </Card>
          </Grid>

          {/* Form */}
          <Grid size={6}>
            <Item>
              <Grid
                container
                rowSpacing={1}
                columnSpacing={{ xs: 1, sm: 2, md: 3 }}
              >
                <Grid size={6}>
                  <Typography
                    textAlign="left"
                    fontWeight={700}
                    variant="subtitle1"
                  >
                    ຊື່
                  </Typography>
                  <Input
                    type="text"
                    margin="normal"
                    fullWidth
                    inputRef={ctrl?.nameRef}
                    required
                  />
                </Grid>
                <Grid size={6}>
                  <Typography
                    textAlign="left"
                    fontWeight={700}
                    variant="subtitle1"
                  >
                    ນາມສະກຸນ
                  </Typography>
                  <Input
                    type="text"
                    margin="normal"
                    fullWidth
                    inputRef={ctrl?.surnameRef}
                    required
                  />
                </Grid>
                <Grid size={6}>
                  <Typography
                    textAlign="left"
                    fontWeight={700}
                    variant="subtitle1"
                  >
                    ເບີໂທລະສັບ
                  </Typography>
                  <Input
                    type="number"
                    margin="normal"
                    fullWidth
                    inputRef={ctrl?.phoneNumberRef}
                    required
                  />
                </Grid>
                <Grid size={6}>
                  <Typography
                    textAlign="left"
                    fontWeight={700}
                    variant="subtitle1"
                  >
                    ອີເມວ
                  </Typography>
                  <Input
                    type="email"
                    margin="normal"
                    fullWidth
                    inputRef={ctrl?.emailRef}
                    required
                  />
                </Grid>
                <Grid size={6}>
                  <Typography
                    textAlign="left"
                    fontWeight={700}
                    variant="subtitle1"
                  >
                    ຊື່ຜູ້ໃຊ້
                  </Typography>
                  <Input
                    margin="normal"
                    fullWidth
                    inputRef={ctrl?.usernameRef}
                    required
                  />
                </Grid>
                <Grid size={6}>
                  <Typography
                    textAlign="left"    
                    fontWeight={700}
                    variant="subtitle1"
                  >
                    ລະຫັດຜ່ານ
                  </Typography>
                  <Box position="relative" width="100%">
                    <Input
                      type={ctrl?.showPassword ? "text" : "password"}
                      margin="normal"
                      fullWidth
                      inputRef={ctrl?.passwordRef}
                      required
                    />
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => ctrl?.setShowPassword(!ctrl?.showPassword)}
                      style={{
                        position: "absolute",
                        right: "10px",
                        top: "50%",
                        transform: "translateY(-50%)",
                      }}
                    >
                      {ctrl?.showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </Box>
                </Grid>
                <Grid size={6}>
                  <Typography
                    textAlign="left"
                    fontWeight={700}
                    variant="subtitle1"
                  >
                    ບໍລິສັດ
                  </Typography>
                  <Input
                    type="text"
                    margin="normal"
                    fullWidth
                    inputRef={ctrl?.companyRef}
                    required
                  />
                </Grid>
                <Grid size={6}>
                  <Typography
                    textAlign="left"
                    fontWeight={700}
                    variant="subtitle1"
                  >
                    ຕຳແໜ່ງ
                  </Typography>
                  <Autocomplete
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "12px",
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
                    }}
                    fullWidth
                    options={Array.isArray(ctrl?.roles) ? ctrl?.roles : []}
                    onChange={(_event, newValue) => {
                      if (ctrl?.roleRef?.current) {
                        ctrl.roleRef.current.value = newValue;
                      }
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        margin="normal"
                        required
                        fullWidth
                        inputRef={ctrl?.roleRef}
                      />
                    )}
                    disableClearable
                  />
                </Grid>
              </Grid>

              <Box sx={{ display: "flex", justifyContent: "end" }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  sx={{ mt: 3 }}
                >
                  ບັນທຶກ
                </Button>
              </Box>
            </Item>
          </Grid>
        </Grid>
      </form>

      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={ctrl?.openBackdrop}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </Box>
  );
};

export default FormCreateUserPage;
