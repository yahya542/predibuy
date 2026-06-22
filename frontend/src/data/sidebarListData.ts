import sitemap from 'routes/sitemap';

const HIDDEN_FOR_ALL = ['template-pages', 'settings', 'account-settings', 'authentication'];
const ADMIN_ONLY = ['admin', 'dataset-analysis', 'model-trees'];

export const topListData = sitemap.filter((item) => {
  if (HIDDEN_FOR_ALL.includes(item.id) || ADMIN_ONLY.includes(item.id)) return false;
  return true;
});

export const adminListData = sitemap.filter((item) => ADMIN_ONLY.includes(item.id));

export const bottomListData = sitemap.filter((item) => {
  if (item.id === 'template-pages' || item.id === 'settings' || item.id === 'authentication') {
    return item;
  }
  return null;
});

export const profileListData = sitemap.find((item) => item.id === 'account-settings');
