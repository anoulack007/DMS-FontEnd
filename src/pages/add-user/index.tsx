import { Avatar, Box, Button, IconButton, MenuItem, Paper, styled, TextField, Typography } from "@mui/material";
import UseMainController from "./controllers";
import image from '../../assets/avatar.svg';
import Grid from '@mui/material/Grid2';

import { MANAGE_USER_PATH } from "../../routes/paths";

// icon
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';


const AvatarUpload = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column',
  width: 250,
  height: 250,
  borderRadius: '50%',
  border: '1px dashed #ccc',
  padding: '20px',
  backgroundColor: '#fafafa',
  marginBottom: '20px',
});

const Item = styled(Paper)({
  padding: '30px',
  textAlign: 'center',
  borderRadius: '15px',
  boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
  backgroundColor: '#fff',
});

const AddUserPage = () => {
  const ctrl = UseMainController();



  return (
    <Box>

      {/* Box 1 */}
      <Box sx={{
        display: "flex",
        gap: 2,
        mb: 4,
        flexWrap: "wrap",
        alignItems: "center",
      }}>
        <Typography variant="h5" component="div" sx={{ flexGrow: 1, color: '#838383', marginTop: 1 }}>
          Add User Page
          <p style={{ fontSize: 16 }}>
            <IconButton onClick={() => ctrl?.handleSwitchPageClick(MANAGE_USER_PATH)}>
              <ArrowBackIosNewIcon />
            </IconButton>
            User Management /
            <span style={{ color: 'red' }}> Add User Page</span> </p>
        </Typography>

        <Button
          variant="contained"
          startIcon={<ArrowBackIosNewIcon />}
          onClick={() => ctrl?.handleSwitchPageClick(MANAGE_USER_PATH)}
          sx={{ height: 50 }}
        >
          Back
        </Button>

      </Box>



      {/* Upload Avatar */}
      <Grid container spacing={2}>
        <Grid>
          <Item>
            <AvatarUpload>
              <Avatar
                sx={{ width: '100%', height: '100%' }}
                src={ctrl?.previewProfile || image}
                alt="avatar"
              />
            </AvatarUpload>
            <Typography variant="body2" sx={{ mt: 2, color: '#999' }}>
              Allowed *.jpeg, *.jpg, *.png, *.gif <br />
              Max size of 3.1 MB
            </Typography>
            <Button variant="outlined" component="label" sx={{ mt: 2 }}>
              Upload Image
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={ctrl?.handleImageUpload}  // use controller for file upload
              />
            </Button>
          </Item>
        </Grid>

        {/* Form */}
        <Grid size={6}>
          <Item>
            <form onSubmit={ctrl?.handleSubmit}>
              <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                <Grid size={6}>
                  <TextField
                    fullWidth
                    label="Name"
                    variant="outlined"
                    name="name"
                    value={ctrl?.name}
                    onChange={(e) => ctrl?.setName(e.target.value)}
                  />
                </Grid>
                <Grid size={6}>
                  <TextField
                    fullWidth
                    label="Surname"
                    variant="outlined"
                    name="surname"
                    value={ctrl?.surname}
                    onChange={(e) => ctrl.setSurname(e.target.value)}
                  />
                </Grid>
                <Grid size={6}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    variant="outlined"
                    name="phoneNumber"
                    value={ctrl.phoneNumber}
                    onChange={(e) => ctrl.setPhonenumber(e.target.value)}
                  />
                </Grid>
                <Grid size={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    variant="outlined"
                    name="email"
                    type="email"
                    value={ctrl.email}
                    onChange={(e) => ctrl.setEmail(e.target.value)}
                    required
                  />
                </Grid>
                <Grid size={6}>
                  <TextField
                    fullWidth
                    label="Username"
                    variant="outlined"
                    name="username"
                    value={ctrl.username}
                    onChange={(e) => ctrl.setUsername(e.target.value)}
                    required
                  />
                </Grid>
                <Grid size={6}>
                  <TextField
                    fullWidth
                    label="Password"
                    variant="outlined"
                    type="password"
                    name="password"
                    value={ctrl.password}
                    onChange={(e) => ctrl.setPassword(e.target.value)}
                    required
                  />
                </Grid>
                <Grid size={6}>
                  <TextField
                    fullWidth
                    label="Company"
                    variant="outlined"
                    name="company"
                    value={ctrl.company}
                    onChange={(e) => ctrl.setCompany(e.target.value)}
                  />
                </Grid>
                <Grid size={6}>
                  <TextField
                    select
                    fullWidth
                    label="Role"
                    variant="outlined"
                    name="role"
                    value={ctrl.role}
                    onChange={(e) => ctrl.setRole(e.target.value)}
                  >
                    {Object.values(ctrl.roles).map((roleOption) => (
                      <MenuItem key={roleOption} value={roleOption}>
                        {roleOption}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              </Grid>

              {/* ปุ่มบันทึก */}
              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{ mt: 3 }}
              // disabled={ctrl?.loading}  // disable submit when loading

              >
                ບັນທຶກ
                {/* {ctrl?.loading ? "ກຳລັງບັນທຶກ..." : "ບັນທຶກ"} */}
              </Button>
            </form>
          </Item>
        </Grid>
      </Grid>


    </Box>
  )
}

export default AddUserPage