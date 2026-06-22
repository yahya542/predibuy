import { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import ButtonBase from '@mui/material/ButtonBase';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Menu from '@mui/material/Menu';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import IconifyIcon from 'components/base/IconifyIcon';
import { getCurrentUser, clearAuth } from 'auth/auth';
import paths from 'routes/paths';

interface MenuItems {
  id: number;
  title: string;
  icon: string;
  href?: string;
}

const menuItems: MenuItems[] = [
 /*  {
    id: 1,
    title: 'Riwayat',
    icon: 'mingcute:history-fill',
    href: paths.history,
  }, */
 /*  {
    id: 2,
    title: 'Admin',
    icon: 'mingcute:database-fill',
    href: paths.admin,
  }, */
  {
    id: 3,
    title: 'Logout',
    icon: 'material-symbols:logout',
  },
];

const ProfileMenu = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const user = getCurrentUser();
  const open = Boolean(anchorEl);

  const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    clearAuth();
    window.location.href = paths.signin;
  };

  return (
    <>
      <Tooltip title="Profile">
        <ButtonBase onClick={handleProfileClick} disableRipple>
          <Stack
            spacing={1}
            alignItems="center"
            aria-controls={open ? 'account-menu' : undefined}
            aria-expanded={open ? 'true' : undefined}
            aria-haspopup="true"
          >
            <Avatar sx={{ bgcolor: 'primary.main' }}>{user ? user.username.slice(0, 2).toUpperCase() : 'U'}</Avatar>
            <Typography variant="subtitle2">{user ? user.username : 'User'}</Typography>
          </Stack>
        </ButtonBase>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleProfileMenuClose}
        onClick={handleProfileMenuClose}
        sx={{
          mt: 1.5,
          minWidth: 220,
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {user ? (
          <>
            <MenuItem onClick={handleProfileMenuClose}>
              <ListItemIcon sx={{ mr: 2, fontSize: 'button.fontSize' }}>
                <IconifyIcon icon="mingcute:user-2-fill" />
              </ListItemIcon>
              <Stack direction="column">
                <Typography variant="body2" fontWeight={500}>
                  {user.username}
                </Typography>
                <Typography variant="caption" fontWeight={400} color="text.secondary">
                  {user.email}
                </Typography>
              </Stack>
            </MenuItem>
            <Divider />
          </>
        ) : null}

        {menuItems.map((item) => {
          const href = item.href;
          const handleItemClick = href
            ? () => {
                window.location.href = href;
              }
            : handleLogout;

          return (
            <MenuItem key={item.id} onClick={handleItemClick} sx={{ py: 1 }}>
              <ListItemIcon sx={{ mr: 2, fontSize: 'button.fontSize' }}>
                <IconifyIcon icon={item.icon} />
              </ListItemIcon>
              <Typography variant="body2" color="text.secondary">
                {item.title}
              </Typography>
            </MenuItem>
          );
        })}
      </Menu>
    </>
  );
};

export default ProfileMenu;
