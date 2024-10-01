import { ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { LIST_PADDING_X, MENU_ITEM_LISTS_PROPS } from '../config';
import { useNavigate } from 'react-router-dom';
import { PRIMARY_COLOR } from '../../theme/colors';

interface Props {
    item: MENU_ITEM_LISTS_PROPS;
    active: boolean;
    open: boolean;
    onClick?: () => void;
}

const NavItem = ({ item, active, open, onClick }: Props) => {
    const navigate = useNavigate();

    return (
        <ListItem
            onClick={() => (onClick ? onClick() : navigate(item.path))}
            key={item.path}
            disablePadding
            sx={{
                display: 'block',
                color: 'grey',
                borderRadius: active ? '8px' : 'none',
                width: 'auto',
                bgcolor: open ? (active ? PRIMARY_COLOR + 40 : 'none') : 'none',
                m: 1
            }}

        >
            <ListItemButton
                sx={{
                    minHeight: 48,
                    justifyContent: open ? 'initial' : 'center',
                    // bgcolor: open ? (active ? PRIMARY_COLOR + 40 : 'none') : 'none',
                    px: LIST_PADDING_X,
                    py: 0,
                    borderRadius: '12px',
                }}
            >
                <ListItemIcon
                    sx={{
                        minWidth: 0,
                        mr: 1,
                        justifyContent: 'center',
                        color: active ? PRIMARY_COLOR : 'inherit',
                        bgcolor: !open ? (active ? PRIMARY_COLOR + 40 : 'none') : 'none',
                        p: 1,
                    }}
                >
                    {item.icon}
                </ListItemIcon>
                <ListItemText
                    sx={{ opacity: 1, fontWeight: active ? 'bold' : 'normal', color: active ? PRIMARY_COLOR : "inherit" }}
                    primary={item.label}
                />
            </ListItemButton>
        </ListItem >
    );
};

export default NavItem;
