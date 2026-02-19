import React, { useState } from 'react';
import {
    Drawer as MuiDrawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Divider,
    Box,
    Typography,
    IconButton,
    AppBar,
    useMediaQuery,
    useTheme,
    styled
} from '@mui/material';
import { 
    People, 
    Inventory, 
    Dashboard, 
    Menu as MenuIcon, 
    ChevronLeft, 
    ChevronRight, 
    Brightness4, 
    Brightness7 
} from '@mui/icons-material';
import { Link, useLocation } from 'react-router-dom';

const drawerWidth = 240;

const openedMixin = (theme) => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

const closedMixin = (theme) => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
});

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        ...(open && {
            ...openedMixin(theme),
            '& .MuiDrawer-paper': openedMixin(theme),
        }),
        ...(!open && {
            ...closedMixin(theme),
            '& .MuiDrawer-paper': closedMixin(theme),
        }),
    }),
);

const LeftSideBar = ({ isSidebarOpen, setIsSidebarOpen, mode, toggleColorMode }) => {
    const location = useLocation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleDesktopDrawerToggle = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const menuItems = [
        { text: 'User List', icon: <People />, path: '/' },
        { text: 'Product List', icon: <Inventory />, path: '/products' },
    ];

    const drawerContent = (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Toolbar sx={{ display: 'flex', alignItems: 'center', justifyContent: isSidebarOpen ? 'space-between' : 'center', px: [1] }}>
                {isSidebarOpen && (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                         <Dashboard sx={{ mr: 1, color: 'primary.main' }} />
                        <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 'bold' }}>
                            Demo App
                        </Typography>
                    </Box>
                )}
                {!isSidebarOpen && <Dashboard sx={{ color: 'primary.main' }} />}
            </Toolbar>
            <Divider />
            <Box sx={{ overflow: 'auto', flexGrow: 1, mt: 2 }}>
                <List>
                    {menuItems.map((item) => (
                        <ListItem key={item.text} disablePadding sx={{ display: 'block' }}>
                            <ListItemButton
                                component={Link}
                                to={item.path}
                                selected={location.pathname === item.path}
                                onClick={() => isMobile && setMobileOpen(false)}
                                sx={{
                                    minHeight: 48,
                                    justifyContent: isSidebarOpen ? 'initial' : 'center',
                                    px: 2.5,
                                    '&.Mui-selected': {
                                        backgroundColor: 'primary.light', // Adjust for dark mode if needed
                                        color: 'primary.main',
                                        '& .MuiListItemIcon-root': {
                                            color: 'primary.main',
                                        },
                                        fontWeight: 'bold',
                                    },
                                    '&:hover': {
                                        backgroundColor: 'action.hover',
                                    },
                                    borderRadius: isSidebarOpen ? '0 24px 24px 0' : '0',
                                    mr: isSidebarOpen ? 2 : 0,
                                    mb: 1,
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        minWidth: 0,
                                        mr: isSidebarOpen ? 3 : 'auto',
                                        justifyContent: 'center',
                                    }}
                                >
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText 
                                    primary={item.text} 
                                    sx={{ opacity: isSidebarOpen ? 1 : 0 }} 
                                    primaryTypographyProps={{ 
                                        fontWeight: location.pathname === item.path ? 700 : 500,
                                        fontSize: '0.9rem'
                                    }} 
                                />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Box>
            
            <Divider />
            <Box sx={{ p: 2, display: 'flex', flexDirection: isSidebarOpen ? 'row' : 'column', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                 <IconButton onClick={toggleColorMode} color="inherit">
                    {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
                </IconButton>
                {isSidebarOpen && (
                    <IconButton onClick={handleDesktopDrawerToggle}>
                        <ChevronLeft />
                    </IconButton>
                )}
                 {!isSidebarOpen && (
                    <IconButton onClick={handleDesktopDrawerToggle}>
                        <ChevronRight />
                    </IconButton>
                )}
            </Box>
        </Box>
    );

    return (
        <>
            {isMobile && (
                <AppBar position="fixed" sx={{ zIndex: theme.zIndex.drawer + 1 }}>
                    <Toolbar>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            edge="start"
                            onClick={handleDrawerToggle}
                            sx={{ mr: 2 }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                            Demo App
                        </Typography>
                        <IconButton onClick={toggleColorMode} color="inherit">
                            {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
                        </IconButton>
                    </Toolbar>
                </AppBar>
            )}
            <Box
                component="nav"
                sx={{ width: { md: isSidebarOpen ? drawerWidth : 65 }, flexShrink: { md: 0 } }}
                aria-label="mailbox folders"
            >
                {/* Mobile Drawer */}
                <MuiDrawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                    sx={{
                        display: { xs: 'block', md: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                >
                    {/* Re-using drawerContent but with 'isSidebarOpen' forced to true logic-wise for mobile usually, 
                        but here we pass the desktop state. For mobile, we probably want full width content always.
                        Let's tweak drawerContent to accept a 'forceOpen' prop or just use a separate render for mobile.
                        Actually, simplest is to wrap drawerContent in a provider or just modify how we render it.
                        
                        For now, let's just render the content. If sidebar is "closed" on desktop, 
                        re-using that state on mobile might look weird (icons only in a drawer).
                        
                        Fix: We should force "open" styles for the mobile drawer content.
                    */}
                    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                         <Toolbar sx={{ display: 'flex', alignItems: 'center', px: 2 }}>
                            <Dashboard sx={{ mr: 1, color: 'primary.main' }} />
                            <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 'bold' }}>
                                Demo App
                            </Typography>
                        </Toolbar>
                        <Divider />
                        <List sx={{ flexGrow: 1 }}>
                            {menuItems.map((item) => (
                                <ListItem key={item.text} disablePadding>
                                    <ListItemButton
                                        component={Link}
                                        to={item.path}
                                        selected={location.pathname === item.path}
                                        onClick={() => setMobileOpen(false)}
                                        sx={{
                                            '&.Mui-selected': {
                                                backgroundColor: 'primary.light',
                                                color: 'primary.main',
                                                '& .MuiListItemIcon-root': { color: 'primary.main' },
                                                fontWeight: 'bold',
                                            },
                                            borderRadius: '0 24px 24px 0',
                                            mr: 2,
                                            mb: 1,
                                        }}
                                    >
                                        <ListItemIcon>{item.icon}</ListItemIcon>
                                        <ListItemText primary={item.text} />
                                    </ListItemButton>
                                </ListItem>
                            ))}
                        </List>
                         <Divider />
                         <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
                             <Typography variant="caption" color="text.secondary">v1.0.0</Typography>
                         </Box>
                    </Box>
                </MuiDrawer>

                {/* Desktop Drawer */}
                <Drawer
                    variant="permanent"
                    open={isSidebarOpen}
                    sx={{
                        display: { xs: 'none', md: 'block' },
                    }}
                >
                    {drawerContent}
                </Drawer>
            </Box>
        </>
    );
};

export default LeftSideBar;
