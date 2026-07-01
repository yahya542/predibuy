import type { Theme, Components } from '@mui/material/styles';

const Stack: Components<Omit<Theme, 'components'>>['MuiStack'] = {
  defaultProps: {
    useFlexGap: true,
  },
};

export default Stack;
