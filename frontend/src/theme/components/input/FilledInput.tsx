import type { Theme, Components } from '@mui/material/styles';

const FilledInput: Components<Omit<Theme, 'components'>>['MuiFilledInput'] = {
  defaultProps: {
    disableUnderline: true,
  },
  styleOverrides: {
    root: {
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      borderRadius: '12px !important',
      backdropFilter: 'blur(10px)',
      transition: 'all 0.25s ease',

      '&:hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.07)',
        borderColor: 'rgba(203, 60, 255, 0.25)',
      },
      '&.Mui-focused': {
        backgroundColor: 'rgba(203, 60, 255, 0.06)',
        borderColor: 'rgba(203, 60, 255, 0.5)',
        boxShadow: '0 0 0 3px rgba(203, 60, 255, 0.1)',
      },
      '&.Mui-error': {
        borderColor: 'rgba(255, 90, 101, 0.5)',
        boxShadow: '0 0 0 3px rgba(255, 90, 101, 0.1)',
      },
    },
    input: {
      padding: '14px 16px',
      fontSize: '0.9375rem',
      color: '#ffffff',
      '&::placeholder': {
        color: 'rgba(255, 255, 255, 0.35)',
        opacity: 1,
      },
    },
    sizeSmall: ({ theme }) => ({
      paddingLeft: theme.spacing(1.25),
    }),
  },
};

export default FilledInput;
