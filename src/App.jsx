import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Box, CssBaseline, Toolbar, ThemeProvider, createTheme } from '@mui/material';
import { useState, useMemo } from 'react';
import LeftSideBar from './components/LeftSideBar';
import UserList from './components/UserList';
import ProductList from './components/ProductList';
import { ColorModeContext } from './context/ColorModeContext';
import './App.css';

function App() {
  const [mode, setMode] = useState('light');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
    }),
    [],
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...(mode === 'light'
            ? {
                primary: { main: '#1976d2' },
                background: { default: '#f9fafb', paper: '#fff' },
                text: { primary: 'rgba(0, 0, 0, 0.87)', secondary: 'rgba(0, 0, 0, 0.6)' },
              }
            : {
                primary: { main: '#90caf9' },
                background: { default: '#121212', paper: '#1e1e1e' },
                text: { primary: '#fff', secondary: 'rgba(255, 255, 255, 0.7)' },
              }),
        },
      }),
    [mode],
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <Router>
          <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <LeftSideBar 
                isSidebarOpen={isSidebarOpen} 
                setIsSidebarOpen={setIsSidebarOpen} 
                mode={mode}
                toggleColorMode={colorMode.toggleColorMode}
            />
            <Box
              component="main"
              sx={{
                flexGrow: 1,
                p: { xs: 2, md: 3 },
                width: { md: `calc(100% - ${isSidebarOpen ? 240 : 65}px)` },
                ml: { md: `${isSidebarOpen ? 0 : 0}px` }, 
                minHeight: '100vh',
                backgroundColor: 'background.default',
                transition: theme.transitions.create(['width', 'margin'], {
                  easing: theme.transitions.easing.sharp,
                  duration: theme.transitions.duration.leavingScreen,
                }),
              }}
            >
              <Box sx={{ display: { xs: 'block', md: 'none' } }}>
                <Toolbar />
              </Box>
              
              <Routes>
                <Route path="/" element={<UserList />} />
                <Route path="/products" element={<ProductList />} />
              </Routes>
            </Box>
          </Box>
        </Router>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
