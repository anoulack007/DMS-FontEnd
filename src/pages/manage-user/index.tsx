import {
  Avatar,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  IconButton,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import UseMainController from "./controllers";
import SearchIcon from "@mui/icons-material/Search";

//icons
import CustomMenu from "./components/custom-menu";
import NoData from "../../assets/logo/NotData.svg";

import PanoramaFishEyeIcon from "@mui/icons-material/PanoramaFishEye";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { CREATE_USER_PATH } from "../../routes/paths";

const ManageUserPage = () => {
  const ctrl = UseMainController();

  return (
    <Box>
      <Box sx={{ mb: 5, display: "flex", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography color="#838383" variant="h5" fontWeight={700}>
            ຈັດການຜູ້ໃຊ້
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 3 }}>
          <TextField
            sx={{
              fontFamily: "NotoSansLao-Regular",
              borderRadius: 24,
              bgcolor: "#F6F6F6",
              "& .MuiOutlinedInput-root": {
                border: "none",
              },
              "& .MuiOutlinedInput-notchedOutline": {
                border: "none",
              },
            }}
            placeholder="ຄົ້ນຫາຜູ້ໃຊ້..."
            value={ctrl.searchQuery}
            onChange={ctrl.handleSearchChange}
            slotProps={{
              input: {
                style: {
                  borderRadius: 24,
                },
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton>
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />

          <Button
            sx={{ width: 200, borderRadius: "12px", fontSize: 16 }}
            onClick={() => ctrl?.hanleNavigate(CREATE_USER_PATH)}
            variant="contained"
          >
            ເພິ່ມຜູ້ໃຊ້
          </Button>
        </Box>
      </Box>

      {ctrl?.selectedItems.length > 0 && (
        <CustomMenu
          selectedCount={ctrl.selectedItems.length}
          handleDelete={ctrl?.handleDelete}
          handleEditUser={ctrl?.handleEditUser}
        />
      )}

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "row",
          gap: 2,
          width: "100%",
        }}
      >
        <Box sx={{ flexGrow: 1 }}>
          <TableContainer
            sx={{
              boxShadow: 3,
              borderRadius: 3,
            }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">{""}</TableCell>
                  <TableCell>ຊື່ຜູ້ໃຊ້</TableCell>
                  <TableCell>ຊື່ບັນຊີຜູ້ໃຊ້</TableCell>
                  <TableCell>ເບີໂທລະສັບ</TableCell>
                  <TableCell>ອີເມວ</TableCell>
                  <TableCell>ຕຳແໜ່ງ</TableCell>
                  <TableCell>ບໍລິສັດ</TableCell>
                </TableRow>
              </TableHead>
              <TableBody sx={{ borderBottom: "1px solid #919EAB3D" }}>
                {ctrl?.loading ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : ctrl?.error ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      <Box
                        sx={{
                          minHeight: 500,
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <img src={NoData} alt="data" />
                      </Box>
                    </TableCell>
                  </TableRow>
                ) : ctrl.getPaginatedData().length > 0 ? (
                  ctrl.getPaginatedData().map((user) => (
                    <TableRow
                      key={user?.userId}
                      selected={ctrl?.isSelected(user.userId)}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                        "&:hover": {
                          backgroundColor: "rgba(0, 0, 0, 0.04)",
                          transition: "background-color 0.2s ease",
                          "& .checkbox-cell": {
                            opacity: 1,
                            visibility: "visible",
                          },
                        },
                        cursor: "pointer",
                      }}
                      onClick={() => ctrl?.handleSelectUser(user?.userId)}
                    >
                      <TableCell
                        padding="checkbox"
                        sx={{
                          borderBottom: "none",
                          "& .MuiCheckbox-root": {
                            transition: "opacity 0.2s, visibility 0.2s",
                            opacity: ctrl?.isSelected(user?.userId) ? 1 : 0,
                            visibility: ctrl?.isSelected(user?.userId)
                              ? "visible"
                              : "hidden",
                          },
                        }}
                        className="checkbox-cell"
                      >
                        <Checkbox
                          icon={<PanoramaFishEyeIcon sx={{ color: "gray" }} />}
                          checked={ctrl?.isSelected(user?.userId)}
                          checkedIcon={
                            <CheckCircleIcon sx={{ color: "blue" }} />
                          }
                          onClick={(e) => e.stopPropagation()}
                        />
                      </TableCell>
                      <TableCell sx={{ borderBottom: "none" }}>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 2 }}
                        >
                          <Avatar
                            src={user?.image?.url || ""}
                            alt={user?.name}
                          />
                          <Box>
                            <Typography>{`${user?.name} ${user?.surname}`}</Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ borderBottom: "none" }}>
                        {user?.username}
                      </TableCell>
                      <TableCell sx={{ borderBottom: "none" }}>
                        {user?.phoneNumber}
                      </TableCell>
                      <TableCell sx={{ borderBottom: "none" }}>
                        {user?.email}
                      </TableCell>
                      <TableCell sx={{ borderBottom: "none" }}>
                        {user?.role}
                      </TableCell>
                      <TableCell sx={{ borderBottom: "none" }}>
                        {user?.company}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      <Box
                        sx={{
                          minHeight: 500,
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          flexDirection: "column",
                          gap: 2, 
                        }}
                      >
                        <img src={NoData} alt="data" />
                        <Typography color="#838383" variant="h5" fontWeight={700}>ບໍ່ມີຂໍ້ມູນ</Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={7} align="right">
                    <TablePagination
                      component="div"
                      count={ctrl?.users?.length || 0}
                      page={ctrl.page}
                      onPageChange={ctrl.handleChangePage}
                      rowsPerPage={ctrl.rowsPerPage}
                      onRowsPerPageChange={ctrl.handleChangeRowsPerPage}
                      rowsPerPageOptions={[5, 10, 25]}
                    />
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </Box>
  );
};

export default ManageUserPage;
