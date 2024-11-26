import {
  FOLLOW_DOCUMENT_PATH,
  MANAGE_DOC_PATH,
  MANAGE_USER_PATH,
  RECYCLE_PATH,
  REPORT_RECYCLE_PATH,
  REPORT_SHARE_PATH,
  SEARCH_DOC_PATH,
} from "../routes/paths";

//icons
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import SearchIcon from "@mui/icons-material/Search";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import RecyclingOutlinedIcon from "@mui/icons-material/RecyclingOutlined";
import ScreenShareOutlinedIcon from "@mui/icons-material/ScreenShareOutlined";
import PlagiarismIcon from "@mui/icons-material/Plagiarism";

export interface MENU_ITEM_LISTS_PROPS {
  label: string;
  path: string;
  icon: JSX.Element;
}

export const DRAWER_WIDTH: number = 270;
export const COLLAPSED_SPACE: number = 6;
export const LIST_PADDING_X: number = 1;

export const DRAWER_TITLE: string = "Test";

export const MENU_ITEM_LISTS: MENU_ITEM_LISTS_PROPS[] = [
  {
    label: "ຈັດການເອກະສານ",
    path: MANAGE_DOC_PATH,
    icon: <ArticleOutlinedIcon />,
  },
  {
    label: "ຄົ້ນຫາເອກະສານ",
    path: SEARCH_DOC_PATH,
    icon: <SearchIcon />,
  },
  {
    label: "ຈັດການຜູ້ໃຊ້",
    path: MANAGE_USER_PATH,
    icon: <BadgeOutlinedIcon />,
  },
  {
    label: "ຕິດຕາມເອກະສານ",
    path: FOLLOW_DOCUMENT_PATH,
    icon: <PlagiarismIcon />,
  },
  {
    label: "ຖັງຊີ້ເຫຍື້ອ",
    path: RECYCLE_PATH,
    icon: <DeleteForeverOutlinedIcon />,
  },
  {
    label: "ລາຍງານການລົບ - ກູ້ຄືນເອກະສານ",
    path: REPORT_RECYCLE_PATH,
    icon: <RecyclingOutlinedIcon />,
  },
  {
    label: "ລາຍງານການແຊຮ໌ເອກະສານ",
    path: REPORT_SHARE_PATH,
    icon: <ScreenShareOutlinedIcon />,
  },
];
