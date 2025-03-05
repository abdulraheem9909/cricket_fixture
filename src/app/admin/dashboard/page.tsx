"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  Box,
  Button,
  Typography,
  ListItemButton,
  ListItemIcon,
  CircularProgress,
} from "@mui/material";
import CreateIcon from "@mui/icons-material/Create";
import TableChartIcon from "@mui/icons-material/TableChart";
import CreateFixture from "../../../components/createFixture";
import ShowFixture from "../../../components/showFixture";
import Image from "next/image";
import LogoutIcon from '@mui/icons-material/Logout';

const drawerWidth = 260;

export default function Dashboard() {
  const router = useRouter();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const token = localStorage?.getItem("token");
    if (!token) {
      // setIsAuthenticated(false);
      router.push("/admin/login");
    } else {
      setIsAuthenticated(true);
    }
  }, []);

  const handleListItemClick = (index: number) => {
    setSelectedIndex(index);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/admin/login");
  };

  if (isAuthenticated === null) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          height: "100vh",
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            background: "#D83030",
            borderRadius: "0px 4px 4px 0px",
            boxShadow:
              "rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px",
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Box>
          <Typography variant="h6" sx={{ my: 2, textAlign: "center" }}>
            <Image
              style={{ background: "white" }}
              alt="logo"
              src="/fixture.png"
              width={180}
              height={50}
            />
          </Typography>
          <List>
            {["Create Fixture", "Show Fixture"].map((text, index) => (
              <ListItem
                disablePadding
                key={text}
                onClick={() => handleListItemClick(index)}
              >
                <ListItemButton
                  selected={selectedIndex === index}
                  sx={{
                    "&.Mui-selected": {
                      backgroundColor: "white",
                      color: "black",
                      margin: 1,
                      borderRadius: 1.5,

                      "&:hover": {
                        backgroundColor: "white",
                      },
                    },
                    color: "white",
                    margin: 1,
                    borderRadius: 1.5,
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: selectedIndex === index ? "#D83030" : "inherit",
                      transition: "background-color 0.3s ease",
                      minWidth:"40px"
                    }}
                  >
                    {index === 0 ? <CreateIcon /> : <TableChartIcon />}
                  </ListItemIcon>

                  <ListItemText
                    primary={
                      <Typography
                        variant="body1"
                        sx={{
                          fontWeight: "bold",
                          fontSize: "16px",
                          color:
                            selectedIndex === index ? "#D83030" : "inherit",
                          display: "block",
                          transition: "color 0.3s ease",
                        }}
                      >
                        {text}
                      </Typography>
                    }
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>

        <Button
          variant="contained"
          sx={{
            background: "white",
            margin: "10px",
            paddingY: 1,
            color: "#D83030",
            fontWeight: "bold",
            fontSize: "16px",
          }}
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
        >
          Logout
        </Button>
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: "background.default",
          p: 3,
          height: "100vh", // Full height to match the drawer
          overflowY: "auto", // Prevents main content from causing overflow
        }}
      >
        {selectedIndex === 0 ? <CreateFixture /> : <ShowFixture />}
      </Box>
    </Box>
  );
}
