import paths from './paths';

export interface SubMenuItem {
  name: string;
  pathName: string;
  path: string;
  active?: boolean;
  items?: SubMenuItem[];
}

export interface MenuItem {
  id: string;
  subheader: string;
  path?: string;
  icon?: string;
  avatar?: string;
  active?: boolean;
  items?: SubMenuItem[];
}

const sitemap: MenuItem[] = [
  {
    id: 'dashboard',
    subheader: 'Dashboard',
    path: '/',
    icon: 'mingcute:home-1-fill',
    active: true,
  },
  {
    id: 'prediction',
    subheader: 'Prediksi',
    path: paths.prediction,
    icon: 'mingcute:brain-fill',
  },
  {
    id: 'history',
    subheader: 'Riwayat',
    path: paths.history,
    icon: 'mingcute:history-fill',
  },
  {
    id: 'admin',
    subheader: 'Admin',
    path: paths.admin,
    icon: 'mingcute:database-fill',
  },
  {
    id: 'dataset-analysis',
    subheader: 'Analisis Dataset',
    path: paths.datasetAnalysis,
    icon: 'mingcute:chart-bar-fill',
  },
  {
    id: 'model-trees',
    subheader: 'Struktur Pohon',
    path: paths.modelTrees,
    icon: 'mingcute:tree-fill',
  },
  {
    id: 'authentication',
    subheader: 'Authentication',
    icon: 'mingcute:safe-lock-fill',
    items: [
      {
        name: 'Signin',
        pathName: 'signin',
        path: paths.signin,
      },
      {
        name: 'Signup',
        pathName: 'signup',
        path: paths.signup,
      },
    ],
  },
];

export default sitemap;
