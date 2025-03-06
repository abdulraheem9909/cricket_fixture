"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
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
import Image from "next/image";
import LogoutIcon from '@mui/icons-material/Logout';
import Link from "next/link";
import useAuth from "@/hooks/useAuth";

const drawerWidth = 260;



export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem("token");
    }
    router.push("/auth/login");
  };

  if (!mounted || isAuthenticated === null) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <CircularProgress />
      </Box>
    );
  }

  const getSelectedIndex = () => {
    if (pathname?.startsWith("/admin/create")) return 0;
    if (pathname?.startsWith("/admin/show")) return 1;
    return -1;
  };

  const selectedIndex = getSelectedIndex();

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            background: '#D83030',
            borderRadius: '0px 4px 4px 0px',
            boxShadow: 'rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px',
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Box>
          <Typography variant="h6" sx={{ my: 2, textAlign: 'center' }}>
            <Image
              style={{ background: 'white' }}
              alt="logo"
              src="/fixture.png"
              width={180}
              height={50}
              priority // Add priority for above-the-fold images
            />
          </Typography>
          <List>
            {['Create Fixture', 'Show Fixture'].map((text, index) => (
              <ListItem disablePadding key={text}>
                <Link
                  href={index === 0 ? '/admin/create' : '/admin/show'}
                  passHref
                  legacyBehavior
                >
                  <ListItemButton
                    component="a"
                    selected={selectedIndex === index}
                    sx={{
                      '&.Mui-selected': {
                        backgroundColor: 'white',
                        color: 'black',
                        margin: 1,
                        borderRadius: 1.5,
                        '&:hover': { backgroundColor: 'white' },
                      },
                      color: 'white',
                      margin: 1,
                      borderRadius: 1.5,
                    }}
                  >
                    <ListItemIcon sx={{
                      color: selectedIndex === index ? '#D83030' : 'inherit',
                      transition: 'background-color 0.3s ease',
                      minWidth: '40px'
                    }}>
                      {index === 0 ? <CreateIcon /> : <TableChartIcon />}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography
                          variant="body1"
                          sx={{
                            fontWeight: 'bold',
                            fontSize: '16px',
                            color: selectedIndex === index ? '#D83030' : 'inherit',
                            display: 'block',
                            transition: 'color 0.3s ease',
                          }}
                        >
                          {text}
                        </Typography>
                      }
                    />
                  </ListItemButton>
                </Link>
              </ListItem>
            ))}
          </List>
        </Box>

        <Button
          variant="contained"
          sx={{
            background: 'white',
            margin: '10px',
            py: 1,
            color: '#D83030',
            fontWeight: 'bold',
            fontSize: '16px',
            '&:hover': {
              backgroundColor: '#f5f5f5'
            }
          }}
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
        >
          Logout
        </Button>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: 'background.default',
          p: 3,
          height: '100vh',
          overflowY: 'auto',
          position: 'relative'
        }}
      >
        {children}
      </Box>
    </Box>
  );
}