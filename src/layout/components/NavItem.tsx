import React, { useState } from "react";
import {
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  List,
  Typography,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom"; // Add useLocation
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import { MENU_ITEM_LISTS_PROPS } from "../config";
import { PRIMARY_COLOR } from "../../theme/colors";

interface NavItemProps {
  item: MENU_ITEM_LISTS_PROPS;
  open?: boolean;
  active?: boolean;
  display: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ item, active = false, display }) => {
  const navigate = useNavigate();
  const location = useLocation(); // Get current location
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const hasChildren = item.children && item.children.length > 0;
  
  if (!display) return null;

  // Check if parent item is active
  const isParentActive =
    active || (item.path !== "#" && location.pathname === item.path);

  // Check if this item should be expanded by default (if a child is active)
  React.useEffect(() => {
    if (hasChildren && item.children) {
      const hasActiveChild = item.children.some(
        (child) => location.pathname === child.path
      );
      if (hasActiveChild) {
        setDropdownOpen(true);
      }
    }
  }, [location.pathname, hasChildren, item.children]);

  const handleClick = () => {
    if (hasChildren) {
      setDropdownOpen(!dropdownOpen);
    } else if (item.path !== "#") {
      navigate(item.path);
    }
  };

  return (
    <>
      <ListItemButton
        onClick={handleClick}
        sx={{
          borderRadius: "8px",
          backgroundColor: isParentActive ? PRIMARY_COLOR + 10 : "transparent",
          mb: 1,
          "&:hover": {
            backgroundColor: PRIMARY_COLOR + 10,
          },
        }}
      >
        <ListItemIcon sx={{ color: active ? PRIMARY_COLOR : "black" }}>
          {item.icon}
        </ListItemIcon>
        <ListItemText
          primary={
            <Typography
              variant="body2"
              sx={{
                fontWeight: isParentActive ? 700 : 500,
                color: active ? PRIMARY_COLOR : "black",
              }}
            >
              {item.label}
            </Typography>
          }
        />
        {hasChildren &&
          (dropdownOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />)}
      </ListItemButton>

      {hasChildren && item.children && (
        <Collapse in={dropdownOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {item.children.map((child) => {
              // Check if this child is active
              const isChildActive = location.pathname === child.path;

              return (
                <ListItemButton
                  key={child.path}
                  onClick={() => navigate(child.path)}
                  sx={{
                    pl: 4,
                    borderRadius: "8px",
                    mb: 1,
                    color: isChildActive ? PRIMARY_COLOR : "black",
                    backgroundColor: isChildActive
                      ? PRIMARY_COLOR + 10
                      : "transparent",
                    "&:hover": {
                      backgroundColor: PRIMARY_COLOR + 10,
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: "30px" }}>
                    <FiberManualRecordIcon sx={{ fontSize: 8 }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: isChildActive ? 700 : 500,
                        }}
                      >
                        {child.label}
                      </Typography>
                    }
                  />
                </ListItemButton>
              );
            })}
          </List>
        </Collapse>
      )}
    </>
  );
};

export default NavItem;
