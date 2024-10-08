import { HOME_PATH, MAIL_PATH, REPORT_PATH, USER_PATH } from '../routes/paths';

//icons
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard';
import ReportIcon from '@mui/icons-material/Report';
import EmailIcon from '@mui/icons-material/Email';
import PersonIcon from '@mui/icons-material/Person';

export interface MENU_ITEM_LISTS_PROPS {
  label: string;
  path: string;
  icon: JSX.Element;
}

export const DRAWER_WIDTH: number = 270;
export const COLLAPSED_SPACE: number = 6;
export const LIST_PADDING_X: number = 1;

export const DRAWER_TITLE: string = 'Test';

export const MENU_ITEM_LISTS: MENU_ITEM_LISTS_PROPS[] = [
  {

    label: 'Dashboard',
    path: HOME_PATH,
    icon: <SpaceDashboardIcon />,
  },
  {
    label: 'Report',
    path: REPORT_PATH,
    icon: <ReportIcon />

  },
  {
    label: 'Mail',
    path: MAIL_PATH,
    icon: <EmailIcon />
  },
  {
    label: 'User',
    path: USER_PATH,
    icon: <PersonIcon />
  }
];
