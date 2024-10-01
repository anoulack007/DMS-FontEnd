// MainLayout.tsx
import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import MiniDrawer from './MiniDrawer';

export default function MainLayout() {
    return (
        <Box
            sx={{
                display: 'flex',
                minHeight: '100vh',
                position: 'relative',
                p: 2
            }}
        >
            <MiniDrawer />
            <Box sx={{ flexGrow: 1, p: 2, zIndex: 1, borderRadius: 5, bgcolor: '#eef2f6' }}>
                <Outlet />
            </Box>
        </Box>
    );
}
