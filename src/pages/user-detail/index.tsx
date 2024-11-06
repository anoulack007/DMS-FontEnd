import { Avatar, Box, Button, IconButton, MenuItem, Paper, styled, TextField, Toolbar, Typography } from "@mui/material";
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
  width: 250,           // Fixed width and height for avatar box
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
  backgroundColor: '#fff',  // Ensure white background as in your example
});


const UserDetailPage = () => {

  const ctrl = UseMainController();
  return (
    <Box>
      
      {/* Box 1 */}
      <Box sx={{ flexGrow: 1, width: '100%', height: 89 }}>
        <Toolbar>
          <Typography variant="h5" component="div" sx={{ flexGrow: 1, color: '#838383', marginTop: 1 }}>
            User Detail
            <p style={{ fontSize: 16 }}>
              <IconButton onClick={() => ctrl?.handleSwitchPageClick(MANAGE_USER_PATH)}>
                <ArrowBackIosNewIcon />
              </IconButton>
              User management /
              <span style={{ color: 'red' }}> User Detail</span> </p>
          </Typography>
        </Toolbar>
      </Box>

      {/* Box 3 */}
      {/* Upload Avatar */}
      <Grid container spacing={2}>
        <Grid>
          <Item>
            <AvatarUpload>
              <Avatar
                sx={{ width: '100%', height: '100%' }}
                src={image}
                alt="avatar"
              />
            </AvatarUpload>
            <Typography variant="body2" sx={{ mt: 2, color: '#999' }}>
              Allowed *.jpeg, *.jpg, *.png, *.gif <br />
              Max size of 3.1 MB
            </Typography>
          </Item>
        </Grid>

        {/* Form */}
        <Grid size={6}>
          <Item>
            <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
              <Grid size={6}>
                <TextField
                  fullWidth
                  label="Name"
                  variant="outlined"
                  name="name"
                  value={ctrl?.formDataUser.name}
                  onChange={ctrl?.handleChange}
                  required
                />
              </Grid>
              <Grid size={6}>
                <TextField
                  fullWidth
                  label="Surname"
                  variant="outlined"
                  name="surname"
                  value={ctrl?.formDataUser.surname}
                  onChange={ctrl?.handleChange}
                  required
                />
              </Grid>
              <Grid size={6}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  variant="outlined"
                  name="phoneNumber"
                  value={ctrl?.formDataUser.phoneNumber}
                  onChange={ctrl?.handleChange}
                  required
                />
              </Grid>
              <Grid size={6}>
                <TextField
                  fullWidth
                  label="Email"
                  variant="outlined"
                  name="email"
                  type="email"
                  value={ctrl?.formDataUser.email}
                  onChange={ctrl?.handleChange}
                  required
                />
              </Grid>
              <Grid size={6}>
                <TextField
                  fullWidth
                  label="Username"
                  variant="outlined"
                  name="username"
                  value={ctrl?.formDataUser.username}
                  onChange={ctrl?.handleChange}
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
                  value={ctrl?.formDataUser.password}
                  onChange={ctrl?.handleChange}
                  required
                />
              </Grid>
              <Grid size={6}>
                <TextField
                  fullWidth
                  label="Company"
                  variant="outlined"
                  name="company"
                  value={ctrl?.formDataUser.company}
                  onChange={ctrl?.handleChange}
                  required
                />
              </Grid>
              <Grid size={6}>
                <TextField
                  select
                  fullWidth
                  label="Role"
                  variant="outlined"
                  name="role"
                  value={ctrl?.formDataUser.role}
                  onChange={ctrl?.handleRoleChange}
                  required
                >
                  {ctrl?.roles.map((role) => (
                    <MenuItem key={role} value={role}>
                      {role}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>
            <form onSubmit={ctrl?.handleSubmit}>

              {/* ปุ่มบันทึก */}
              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{ mt: 3 }}
              >
                ບັນທຶກ
              </Button>
            </form>
          </Item>
        </Grid>
      </Grid>


    </Box>
  )
}

export default UserDetailPage