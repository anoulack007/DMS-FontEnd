import {
  Box,
  Typography,
  Button,
  Backdrop,
  CircularProgress,
  IconButton,
  InputAdornment,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import useResetPasswordController from "../controllers/page/resetPassword";
import { USER_DETAIL_PATH } from "../../../routes/paths";
import CloseIcon from "@mui/icons-material/Close";
import { useParams } from "react-router-dom";
import { Input } from "../../../components/Input";
import { GRAY1_COLOR } from "../../../theme/colors";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const ResetPasswordPage = () => {
  const { id } = useParams();
  const ctrl = useResetPasswordController();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        paddingTop: "80px",
      }}
    >
      <Grid
        container
        spacing={2}
        maxWidth={400}
        sx={{
          p: 3,
          boxShadow: 3,
          borderRadius: 2,
          bgcolor: "background.paper",
        }}
      >
        <Grid size={{ xs: 12 }}>
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <IconButton
              sx={{ bgcolor: GRAY1_COLOR }}
              onClick={() => ctrl?.navigate(`${USER_DETAIL_PATH}/${id}`)}
            >
              <CloseIcon />
            </IconButton>
            <Typography
              sx={{ mt: 0.5 }}
              variant="subtitle1"
              align="center"
              fontWeight={700}
              gutterBottom
            >
              ປ່ຽນລະຫັດຜ່ານ
            </Typography>
          </Box>
        </Grid>
        <Grid size={{ xs: 12 }}>
          <Input
            margin="normal"
            fullWidth
            type={ctrl?.showPassword ? "text" : "password"}
            inputRef={ctrl?.passwordRef}
            placeholder="ລະຫັດຜ່ານໃໝ່"
            required
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={ctrl?.handleTogglePassword} edge="end">
                      {ctrl?.showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <Button
            onClick={ctrl?.handleResetPassword}
            sx={{ p: 2 }}
            fullWidth
            variant="contained"
            color="primary"
          >
            ປ່ຽນລະຫັດຜ່ານ
          </Button>
        </Grid>
      </Grid>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={ctrl?.openBackdrop}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </Box>
  );
};

export default ResetPasswordPage;
