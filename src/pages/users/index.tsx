import DataTable from "./components/tableList"
import Header from "./components/header";
import { Box } from '@mui/material';


function UserPage() {
    return (
        <div>
            <Header />
            <div style={{marginTop: 100}}>name</div>
            
            <Box sx={{ display: 'flex' }}>
                <Box sx={{ flexGrow: 1 }}>
                    
                    <DataTable />
                </Box>
            </Box>
        </div>
    );
}

export default UserPage