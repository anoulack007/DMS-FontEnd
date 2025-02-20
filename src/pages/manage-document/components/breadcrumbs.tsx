import { Breadcrumbs, Link, Typography } from "@mui/material";
import { useSearchParams } from "react-router-dom";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { decode, encode } from "../../../utils/functions/HashString";
import { useMemo } from "react";

const BreadcrumbCustom = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const breadcrumbData = useMemo(() => {
    const folderParam = searchParams.get("folderId");

    if (!folderParam) {
      return [
        { label: "root", path: "", isLast: true },
      ];
    }

    // Decode the path correctly
    const decodedPath = decode(folderParam) || "root";
    const pathSegments = decodedPath.split("/").filter(Boolean);

    // Always include 'root' as the first segment
    if (pathSegments[0] !== "root") {
      pathSegments.unshift("root");
    }

    return pathSegments.map((segment, index) => {
      const isLast = index === pathSegments.length - 1;
      const path = encode(pathSegments.slice(0, index + 1).join("/"));

      return {
        label: segment,
        path: isLast ? "" : `folderId=${path}`,
        isLast,
      };
    });
  }, [searchParams]);

  const handleClick = (path: string) => {
    if (path) {
      setSearchParams(path);
    } else {
      setSearchParams({}); // Go back to root
    }
  };

  return (
    <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
      {breadcrumbData.map((item, index) =>
        item.isLast ? (
          <Typography key={index} color="primary" sx={{ fontWeight: "bold", fontSize: 20 }}>
            {item.label}
          </Typography>
        ) : (
          <Link
            key={index}
            color="inherit"
            sx={{ cursor: "pointer", textDecoration: "none", fontWeight: "bold", fontSize: 20, "&:hover": { textDecoration: "underline" } }}
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
