import { AppBar, IconButton, Toolbar } from "@mui/material"
import { DRAWER_WIDTH } from "../config"
import MenuIcon from '@mui/icons-material/Menu';

interface Props {
    onDrawerToggle: () => void
}

const Header = ({ onDrawerToggle }: Props) => {
    return (
        <AppBar
            position="fixed"
            sx={{
                width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
                ml: { sm: `${DRAWER_WIDTH}px` },
            }}
        >
            <Toolbar>
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    edge="start"
                    onClick={onDrawerToggle}
                    sx={{ mr: 2, display: { sm: 'none' } }}
                >
                    <MenuIcon />
                </IconButton>
                {/* <Typography sx={{backgroundColor:'red'}} variant="h6" noWrap component="div">
                    Responsive drawer
                </Typography> */}
            </Toolbar>
        </AppBar>
    )
}

export default Header