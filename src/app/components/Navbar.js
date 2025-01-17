// components/Navbar.js

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Badge,
  Box,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,

} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

export default function Navbar({ login, logout, newProductAlert, newProductName }) {
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("UserMeltyMagic");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogIn = async () => {
    try {
      const res = await fetch("/api/log-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginForm),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem("UserMeltyMagic", JSON.stringify(loginForm));
        setUser(loginForm);
        login(loginForm);
        setLoginDialogOpen(false);
      } else {
        alert("Invalid credentials. Please try again.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("An error occurred. Please try again.");
    }
  };
  
  const handleLogOut = () => {
    localStorage.removeItem("UserMeltyMagic");
    setUser(null);
    logout();
  };

  return (
    <>
      <AppBar position="static"
      sx={{ backgroundColor: "#0d1117" }}
      >
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, cursor: "pointer" }}
          >
            <Link href="/" style={{ color: "inherit", textDecoration: "none" }}>
              Melty Magic
            </Link>
          </Typography>

          {user ? (
            <Box display="flex" alignItems="center" gap={2}>
              <Typography variant="body1">{`Welcome, ${user.email}`}</Typography>
              <IconButton
                color="inherit"
                component={Link}
                href="/cart"
                aria-label="Cart"
              >
                <Badge badgeContent={0} color="secondary">
                  <ShoppingCartIcon />
                </Badge>
              </IconButton>
              <Button 
              variant="contained"
              color="error" onClick={handleLogOut}>
                Log Out
              </Button>
            </Box>
          ) : (
            <Button
              variant="contained"
              color="primary"
              onClick={() => setLoginDialogOpen(true)}
            >
              Log In
            </Button>
          )}
        </Toolbar>
        {newProductAlert && (
          <Box textAlign="center" bgcolor="success.main" p={1}>
            <Typography color="white">{`New Product Added: ${newProductName}`}</Typography>
          </Box>
        )}
      </AppBar>
      {/* Login Dialog */}
      <Dialog open={loginDialogOpen} onClose={() => setLoginDialogOpen(false)}>
        <DialogTitle>Log In</DialogTitle>
        <DialogContent>
          <TextField
            label="Email"
            value={loginForm.email}
            onChange={(e) =>
              setLoginForm({ ...loginForm, email: e.target.value })
            }
            fullWidth
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Password"
            type="password"
            value={loginForm.password}
            onChange={(e) =>
              setLoginForm({ ...loginForm, password: e.target.value })
            }
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleLogIn}
            variant="contained"
            color="primary"
            sx={{
              color: "#fff",
              fontWeight: "bold",
              "&:hover": {
                backgroundColor: "#e68a00",
              },
            }}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

