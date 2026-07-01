import type { Theme, Components } from '@mui/material/styles';
import { menuClasses } from '@mui/material';

const Paper: Components<Omit<Theme, 'components'>>['MuiPaper'] = {
  styleOverrides: {
    root: ({ theme }) => ({
      padding: theme.spacing(3.5),
      backgroundColor: 'rgba(11, 23, 57, 0.5)',
      backdropFilter: 'blur(20px)',
      boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.35)',
      border: '1px solid rgba(255, 255, 255, 0.05)',
      borderRadius: Number(theme.shape.borderRadius) * 4, // 16px radius
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      backgroundImage: 'none',

      '&:hover': {
        borderColor: 'rgba(139, 92, 246, 0.25)',
        boxShadow: '0 12px 40px 0 rgba(139, 92, 246, 0.15)',
        transform: 'translateY(-2px)',
      },

      [`&.${menuClasses.paper}`]: {
        padding: theme.spacing(0),
        backgroundColor: '#0f172a',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        backdropFilter: 'none',
        backgroundImage: 'none',
        '&:hover': {
          transform: 'none',
          boxShadow: 'none',
        }
      },
    }),
  },
};

export default Paper;
