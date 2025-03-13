import React from "react";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

interface BackdropLoaderProps {
  open: boolean;
}

const BackdropLoader: React.FC<BackdropLoaderProps> = ({ open }) => {
  return (
    <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={open} suppressHydrationWarning>
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};

export default BackdropLoader;
