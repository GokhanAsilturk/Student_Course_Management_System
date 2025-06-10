import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { AuthProvider } from './contexts';
import { ConfirmDialogProvider } from './contexts/ConfirmDialogContext';
import { AppRoutes } from './routes/AppRoutes';
import theme from './theme/theme';

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <ConfirmDialogProvider>
          <Router>
            <AppRoutes />
          </Router>
        </ConfirmDialogProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
