import React, { useMemo } from "react";
import { Breadcrumbs, Link, Typography } from "@mui/material";
import { useSearchParams } from "react-router-dom";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { Document } from "../../../models/Document";

interface BreadcrumbItem {
  label: string;
  path: string;
  isLast: boolean;
}

const BreadcrumbCustom: React.FC<{ folders: Document[] }> = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const breadcrumbData = useMemo<BreadcrumbItem[]>(() => {
    // Default to "root" when no folder path param or folders are available
    const defaultRootBreadcrumb: BreadcrumbItem[] = [
      { label: "root", path: "root", isLast: true },
    ];

    const folderPath = searchParams.get("folderPath");

    // Early return with default if no folder path
    if (!folderPath) {
      return defaultRootBreadcrumb;
    }

    // Split the path into segments
    const pathSegments = folderPath.split('/');
    
    // Generate breadcrumb items
    const hierarchy: BreadcrumbItem[] = pathSegments.map((segment, index) => {
      // Reconstruct the path up to this segment
      const fullPath = pathSegments.slice(0, index + 1).join('/');
      
      return {
        label: segment || 'root',
        path: fullPath,
        isLast: index === pathSegments.length - 1
      };
    });

    // Prepend "root" if not already present
    if (hierarchy[0].label !== 'root') {
      hierarchy.unshift({ label: 'root', path: 'root', isLast: false });
    }

    return hierarchy;
  }, [searchParams]);

  const handleClick = (path: string) => {
    if (path && path !== 'root') {
      setSearchParams({ folderPath: path });
    } else {
      setSearchParams({}); // Go back to root
    }
  };

  return (
    <Breadcrumbs
      separator={<NavigateNextIcon fontSize="small" />}
      aria-label="breadcrumb"
    >
      {breadcrumbData.map((item, index) =>
        item.isLast ? (
          <Typography
            key={index}
            color="primary"
            sx={{ fontWeight: "bold", fontSize: 20 }}
          >
            {item.label}
          </Typography>
        ) : (
          <Link
            key={index}
            color="inherit"
            sx={{
              cursor: "pointer",
              textDecoration: "none",
              fontWeight: "bold",
              fontSize: 20,
              "&:hover": { textDecoration: "underline" },
            }}
            onClick={() => handleClick(item.path)}
          >
            {item.label}
          </Link>
        )
      )}
    </Breadcrumbs>
  );
};

export default BreadcrumbCustom;