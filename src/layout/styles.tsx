// @mui
import { styled } from '@mui/material/styles';
import { ListItemIcon, ListItemButton } from '@mui/material';

// ----------------------------------------------------------------------

export const StyledNavItem = styled((props: any) => <ListItemButton disableGutters {...props} />)(({ theme }) => ({
    ...theme.typography.body2,
    height: 48,
    position: 'relative',
    textTransform: 'capitalize',
    color: theme.palette.text.secondary,
    borderRadius: '8px',
}));

export const StyledNavItemIcon = styled(ListItemIcon)({
    width: 22,
    height: 22,
    color: '#438EF2',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
});
