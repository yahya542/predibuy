import type { Theme, Components } from '@mui/material/styles';

const Drawer: Components<Omit<Theme, 'components'>>['MuiDrawer'] = {
  styleOverrides: {
    root: {
      '&:hover, &:focus': {
        '*::-webkit-scrollbar, *::-webkit-scrollbar-thumb': {
          visibility: 'visible',
        },
      },
    },
    paper: () => ({
      padding: 0,
      width: '300px',
      height: '100vh',
      borderRadius: 0,
      border: 0,
      borderRight: '1px solid rgba(255, 255, 255, 0.06)',
      backgroundColor: 'rgba(8, 16, 40, 0.7)',
      backdropFilter: 'blur(24px)',
      boxShadow: '4px 0 24px 0 rgba(0, 0, 0, 0.3)',
      boxSizing: 'border-box',
    }),
  },
};

export default Drawer;
