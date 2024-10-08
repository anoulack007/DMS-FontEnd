import { Box } from "@mui/material";
import { useParams } from "react-router-dom";

const DocumentDetailPage = () => {
  const {id} = useParams();
  return (
    <Box>
      Document Id: {id}
    </Box>
  )
}

export default DocumentDetailPage