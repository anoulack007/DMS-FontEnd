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

const BreadcrumbCustom: React.FC<{ folders: Document[] }> = ({ folders }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const breadcrumbData = useMemo<BreadcrumbItem[]>(() => {
    const folderPath = searchParams.get("folderPath");

    // If no folder path, return just the root breadcrumb
    if (
      !folderPath ||
      folderPath === "root" ||
      folderPath === "/" ||
      folderPath === ""
    ) {
      return [
        {
          label: "ໜ້າຫຼັກ",
          path: "root",
          isLast: true,
        },
      ];
    }

    // Split the path into segments and filter out empty segments and "root"
    const pathSegments = folderPath
      .split("/")
      .filter((segment) => segment.trim() !== "" && segment !== "root");

    // If no valid segments after filtering, return just root
    if (pathSegments.length === 0) {
      return [
        {
          label: "ໜ້າຫຼັກ",
          path: "root",
          isLast: true,
        },
      ];
    }

    // Start with root breadcrumb (not last anymore)
    const hierarchy: BreadcrumbItem[] = [
      {
        label: "ໜ້າຫຼັກ",
        path: "root",
        isLast: false,
      },
    ];

    // Helper function to find folder name by path segment
    const findFolderName = (
      pathSegment: string,
      currentPath: string
    ): string => {
      // First try to find by the exact path
      let folder = folders.find((f) => f.path === currentPath);

      // If not found, try to find by name matching the path segment
      if (!folder) {
        folder = folders.find((f) => f.name === pathSegment);
      }

      // If still not found, try to find by ID
      if (!folder) {
        folder = folders.find((f) => f.id === pathSegment);
      }

      return folder ? folder.name : pathSegment;
    };

    // Generate breadcrumb items for each path segment
    pathSegments.forEach((segment, index) => {
      // Reconstruct the path up to this segment WITH root prefix
      const fullPath = "root/" + pathSegments.slice(0, index + 1).join("/");

      // Get the actual folder name
      const folderName = findFolderName(segment, fullPath);

      hierarchy.push({
        label: folderName,
        path: fullPath,
        isLast: index === pathSegments.length - 1,
      });
    });

    return hierarchy;
  }, [searchParams, folders]);

  const handleClick = (path: string) => {
    if (path && path !== "root") {
      setSearchParams({ folderPath: path });
    } else {
      setSearchParams({}); // Go back to root
      localStorage.removeItem("currentFolderPath");
      localStorage.removeItem("selectedDocumentId");
      localStorage.removeItem("selectedDocumentNumber");
      localStorage.removeItem("selectedDocumentType");
      localStorage.removeItem("currentFolderId");
    }
  };

  return (
    <Breadcrumbs
      separator={<NavigateNextIcon fontSize="small" />}
      aria-label="breadcrumb"
    >
      {breadcrumbData.map((item, index) =>
        item.isLast ? (
          <Typography key={index} variant="subtitle1" color="primary">
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
              fontSize: 30,
              "&:hover": {
                textDecoration: "underline",
              },
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
