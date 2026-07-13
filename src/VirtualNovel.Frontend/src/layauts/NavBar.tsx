import {
    AppBar,
    Avatar,
    Badge,
    Box,
    IconButton,
    Menu,
    MenuItem,
    Toolbar,
    Tooltip,
    Typography,
} from "@mui/material";
import {
    AccountCircle,
    NotificationsNone,
} from "@mui/icons-material";
import EmailIcon from '@mui/icons-material/Email';

import { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";

const loggedInMenu = [
    { path: "/profile", label: "Profile" },
    { path: "/bookmarks", label: "Bookmarks" },
    { path: "/settings", label: "Settings" },
];

const anonymousMenu = [
    { path: "/login", label: "Login" },
    { path: "/register", label: "Register" },
];

export default function NavBar() {
    const navigate = useNavigate();

    const [anchorElUser, setAnchorElUser] =
        useState<HTMLElement | null>(null);

    // Tymczasowo. Później z AuthContext/Firebase.
    const [isAuthenticated] = useState(false);

    const handleOpenUserMenu = (
        event: React.MouseEvent<HTMLElement>,
    ) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handleMenuClick = (path: string) => {
        handleCloseUserMenu();
        navigate(path);
    };

    const handleLogout = async () => {
        handleCloseUserMenu();

        // Później:
        // await signOut(auth);
        // navigate("/");
    };

    const menuItems = isAuthenticated
        ? loggedInMenu
        : anonymousMenu;

    return (
        <AppBar
            position="sticky"
            elevation={0}
            sx={{
                borderBottom: 1,
                borderColor: "divider",
            }}
        >
            <Toolbar
                sx={{
                    minHeight: 64,
                    px: { xs: 2, md: 4 },
                    gap: 2,
                }}
            >
                {/* Lewa strona: logo */}
                <Box
                    component={RouterLink}
                    to="/"
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.25,
                        color: "inherit",
                        textDecoration: "none",
                    }}
                >
                    <Box
                        component="img"
                        src="/logo.png"
                        alt="VirtualNovel"
                        sx={{
                            width: 42,
                            height: 42,
                            objectFit: "contain",
                        }}
                    />

                    <Typography
                        variant="h6"
                        component="span"
                        sx={{
                            display: { xs: "none", sm: "block" },
                            fontWeight: 700,
                            letterSpacing: 0.3,
                        }}
                    >
                        VirtualNovel
                    </Typography>
                </Box>

                {/* Wszystko za tym elementem leci na prawo */}
                <Box sx={{ flexGrow: 1 }} />

                {isAuthenticated && (
                    <>
                        <Tooltip title="Messages">
                            <IconButton color="inherit">
                                <Badge
                                    badgeContent={3}
                                    color="secondary"
                                >
                                    <EmailIcon />
                                </Badge>
                            </IconButton>
                        </Tooltip>

                        <Tooltip title="Notifications">
                            <IconButton color="inherit">
                                <Badge
                                    badgeContent={5}
                                    color="secondary"
                                >
                                    <NotificationsNone />
                                </Badge>
                            </IconButton>
                        </Tooltip>
                    </>
                )}

                <Tooltip
                    title={
                        isAuthenticated
                            ? "Open profile menu"
                            : "Open account menu"
                    }
                >
                    <IconButton
                        onClick={handleOpenUserMenu}
                        sx={{ p: 0.5 }}
                    >
                        {isAuthenticated ? (
                            <Avatar
                                src=""
                                alt="User avatar"
                                sx={{
                                    width: 38,
                                    height: 38,
                                }}
                            />
                        ) : (
                            <AccountCircle
                                sx={{
                                    fontSize: 38,
                                    color: "primary.contrastText",
                                }}
                            />
                        )}
                    </IconButton>
                </Tooltip>

                <Menu
                    anchorEl={anchorElUser}
                    open={Boolean(anchorElUser)}
                    onClose={handleCloseUserMenu}
                    anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "right",
                    }}
                    transformOrigin={{
                        vertical: "top",
                        horizontal: "right",
                    }}
                    slotProps={{
                        paper: {
                            sx: {
                                mt: 1,
                                minWidth: 180,
                            },
                        },
                    }}
                >
                    {menuItems.map((item) => (
                        <MenuItem
                            key={item.path}
                            onClick={() =>
                                handleMenuClick(item.path)
                            }
                        >
                            {item.label}
                        </MenuItem>
                    ))}

                    {isAuthenticated && (
                        <MenuItem onClick={handleLogout}>
                            Logout
                        </MenuItem>
                    )}
                </Menu>
            </Toolbar>
        </AppBar>
    );
}