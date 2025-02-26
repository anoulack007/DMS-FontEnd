import { Avatar, Box, styled } from "@mui/material";
import React, { useRef, useState } from "react";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";

const UploadAvatar = styled(Avatar)(() => ({
  width: 180,
  height: 180,
  cursor: "pointer",
  position: "relative",
  "&:hover": {
    "&::after": {
      content: '""',
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.3)",
      borderRadius: "50%",
    },
    "& .MuiSvgIcon-root": {
      opacity: 1,
    },
  },
}));

const CameraIcon = styled(PhotoCameraIcon)(() => ({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  color: "white",
  opacity: 0,
  transition: "opacity 0.2s",
  zIndex: 1,
  width: 32,
  height: 32,
}));

interface Props {
  defaultImage?: string;
  onChange?: (file: File) => void;
}

const AvatarUpload = ({ defaultImage, onChange }: Props) => {
  const [preview, setPreview] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Call onChange handler if provided
      onChange?.(file);
    }
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", py: "48px" }}>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        style={{ display: "none" }}
      />

      <UploadAvatar
        sx={{ border: "1px dashed #ccc", p: 1 }}
        src={preview ? preview : defaultImage}
        onClick={() => inputRef.current?.click()}
      >
        <CameraIcon />
      </UploadAvatar>
    </Box>
  );
};

export default AvatarUpload;
