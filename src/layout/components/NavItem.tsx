import React, { useState } from "react";
import {
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  List,
  Typography,
  Tooltip,
  Box,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
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
  collapsed?: boolean;
}

// Function to clear specific localStorage keys
const clearDocumentStorageKeys = () => {
  const keysToRemove = [
    'selectedDocumentId',
    'selectedDocumentNumber',
    'selectedDocumentType',
    'currentFolderId',
    'currentFolderPath'
  ];
  
  keysToRemove.forEach(key => {
    localStorage.removeItem(key);
  });
};

const NavItem: React.FC<NavItemProps> = ({ 
  item, 
  active = false, 
  display, 
  collapsed = false 
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const hasChildren = item.children && item.children.length > 0;
  
  if (!display) return null;

  // Check if parent item is active
  const isParentActive =
    active || (item.path !== "#" && location.pathname === item.path);

  // Check if this item should be expanded by default (if a child is active)
  React.useEffect(() => {
    if (hasChildren && item.children && !collapsed) {
      const hasActiveChild = item.children.some(
        (child) => location.pathname === child.path
      );
      if (hasActiveChild) {
        setDropdownOpen(true);
      }
    }
  }, [location.pathname, hasChildren, item.children, collapsed]);

  const handleClick = () => {
    if (hasChildren && !collapsed) {
      setDropdownOpen(!dropdownOpen);
    } else if (item.path !== "#") {
      // Clear localStorage keys before navigation
      clearDocumentStorageKeys();
      navigate(item.path);
    }
  };

  const handleChildClick = (childPath: string) => {
    // Clear localStorage keys before navigation
    clearDocumentStorageKeys();
    navigate(childPath);
  };

  const listItemContent = (
    <ListItemButton
      onClick={handleClick}
      sx={{
        borderRadius: "8px",
        backgroundColor: isParentActive ? PRIMARY_COLOR + 10 : "transparent",
        mb: 1,
        justifyContent: collapsed ? "center" : "initial",
        px: collapsed ? 1 : 2,
        "&:hover": {
          backgroundColor: PRIMARY_COLOR + 10,
        },
      }}
    >
      <ListItemIcon 
        sx={{ 
          color: active ? PRIMARY_COLOR : "black",
          minWidth: collapsed ? 0 : 56,
          mr: collapsed ? 0 : 0,
          justifyContent: "center",
        }}
      >
        {item.icon}
      </ListItemIcon>
      
      {!collapsed && (
        <>
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
        </>
      )}
    </ListItemButton>
  );

  return (
    <Box>
      {collapsed ? (
        <Tooltip title={item.label} placement="right" arrow>
          {listItemContent}
        </Tooltip>
      ) : (
        listItemContent
      )}

      {!collapsed && hasChildren && item.children && (
        <Collapse in={dropdownOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {item.children.map((child) => {
              // Check if this child is active
              const isChildActive = location.pathname === child.path;

              return (
                <ListItemButton
                  key={child.path}
                  onClick={() => handleChildClick(child.path)}
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
    </Box>
  );
};

export default NavItem;