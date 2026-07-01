import { PaletteColorOptions, PaletteOptions } from '@mui/material/styles';
import {
  grey,
  blue,
  cyan,
  yellow,
  transparentRed,
  transparentGreen,
  transparentYellow,
} from './colors';

declare module '@mui/material/styles' {
  interface PaletteOptions {
    neutral?: PaletteColorOptions;
    transparent?: {
      success: PaletteColorOptions;
      warning: PaletteColorOptions;
      error: PaletteColorOptions;
    };
    gradients?: {
      primary: PaletteColorOptions;
    };
  }
  interface SimplePaletteColorOptions {
    lighter?: string;
    darker?: string;
    state?: string;
  }
  interface Palette {
    neutral: PaletteColor;
    gradients: {
      primary: PaletteColor;
    };
    transparent: {
      success: PaletteColor;
      warning: PaletteColor;
      error: PaletteColor;
    };
  }
  interface PaletteColor {
    lighter: string;
    darker: string;
    state: string;
  }
}

const palette: PaletteOptions = {
  neutral: {
    lighter: grey[100],
    light: grey[200],
    main: grey[300],
    dark: grey[400],
    darker: grey[600],
  },
  primary: {
    main: '#cb3cff',
    dark: '#7f25fb',
    darker: '#4a009e',
    lighter: '#e896ff',
  },
  secondary: {
    lighter: blue[200],
    light: cyan[400],
    main: cyan[500],
    dark: cyan[900],
    darker: blue[500],
  },
  info: {
    main: blue[700],
    dark: blue[800],
    darker: blue[900],
  },
  success: {
    main: '#14ca74',
    light: '#60edaa',
  },
  warning: {
    main: yellow[500],
  },
  error: {
    main: '#ff5a65',
    light: '#ff8a92',
  },
  text: {
    primary: '#f0f4ff',
    secondary: '#8899bb',
    disabled: '#445577',
  },
  gradients: {
    primary: {
      main: '#cb3cff',
      state: '#7f25fb',
    },
  },
  transparent: {
    success: {
      main: transparentGreen[500],
    },
    warning: {
      main: transparentYellow[500],
    },
    error: {
      main: transparentRed[500],
    },
  },
};

export default palette;
