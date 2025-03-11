import {
  FOLLOW_DOCUMENT_PATH,
  MANAGE_DOC_PATH,
  MANAGE_USER_PATH,
  RECYCLE_PATH,
  // REPORT_RECYCLE_PATH,
  // REPORT_SHARE_PATH,
} from "../routes/paths";

//icons
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
// import RecyclingOutlinedIcon from "@mui/icons-material/RecyclingOutlined";
// import ScreenShareOutlinedIcon from "@mui/icons-material/ScreenShareOutlined";
import SvgColor from "./components/SvgColor";
import DOC_MANAGE_IC from '../assets/logo/mange_doc.svg'
import USER_MANAGE_IC from '../assets/logo/user_manage.svg'
import FOLLOW_DOC_IC from '../assets/logo/follow_doc.svg'

export interface MENU_ITEM_LISTS_PROPS {
  label: string;
  path: string;
  icon: JSX.Element;
}

export const DRAWER_WIDTH: number = 270;
export const COLLAPSED_SPACE: number = 6;
export const LIST_PADDING_X: number = 1;

export const DRAWER_TITLE: string = "Test";

export const FOLLOW_DOCUMENT_LISTS: MENU_ITEM_LISTS_PROPS[] = [
  {
    label: "ຕິດຕາມເອກະສານ",
    path: FOLLOW_DOCUMENT_PATH,
    icon: <SvgColor src={FOLLOW_DOC_IC} />,
  },
];

export const USER_MANAGE_LISTS: MENU_ITEM_LISTS_PROPS[] = [
  {
    label: "ຈັດການຜູ້ໃຊ້",
    path: MANAGE_USER_PATH,
    icon: <SvgColor src={USER_MANAGE_IC} />,
  },
];

export const MENU_ITEM_LISTS: MENU_ITEM_LISTS_PROPS[] = [
  {
    label: "ຈັດການເອກະສານ",
    path: MANAGE_DOC_PATH,
    icon: <SvgColor src={DOC_MANAGE_IC} />,
  },
  {
    label: "ຖັງຂີ້ເຫຍື້ອ",
    path: RECYCLE_PATH,
    icon: <DeleteForeverOutlinedIcon />,
  },
];
