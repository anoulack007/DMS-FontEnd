import { Box, Grid } from "@mui/material";
import CardCustom from "./components/card-custom";
import SalesValueChart from "./components/chart-overview";
import ChartTotalRegister from "./components/chart-register";

const HomePage = () => {
  return (
    <Box sx={{ minHeight: "100vh", height: "100%" }}>
      <Box>
        <CardCustom />
      </Box>

      <Box mt={5}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <SalesValueChart />
          </Grid>
          <Grid item xs={12} md={4}>
            <ChartTotalRegister />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default HomePage;
