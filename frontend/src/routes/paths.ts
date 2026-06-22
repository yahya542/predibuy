export const rootPaths = {
  root: '/',
  authRoot: 'auth',
};

export default {
  dashboard: '/',
  prediction: '/prediction',
  history: '/history',
  admin: '/admin',
  datasetAnalysis: '/admin/dataset',
  modelTrees: '/admin/model-trees',

  signin: `/${rootPaths.authRoot}/signin`,
  signup: `/${rootPaths.authRoot}/signup`,

  404: '/404',
};
