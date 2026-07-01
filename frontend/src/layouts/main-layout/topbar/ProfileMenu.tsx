import { useState } from 'react';
import Box from '@mui/material/Box';
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
      <Tooltip title="Profil Akun">
        <ButtonBase
          onClick={handleProfileClick}
          disableRipple
          aria-controls={open ? 'account-menu' : undefined}
          aria-expanded={open ? 'true' : undefined}
          aria-haspopup="true"
          sx={{
            borderRadius: 3,
            p: 0.5,
            transition: 'all 0.2s ease',
            '&:hover': { bgcolor: 'rgba(255,255,255,0.06)' },
          }}
        >
          <Stack direction="row" spacing={1.5} alignItems="center" px={1}>
            {/* Gradient ring avatar */}
            <Box
              sx={{
                p: '2px',
                borderRadius: '50%',
                background: open
                  ? 'linear-gradient(135deg, #cb3cff 0%, #00c2ff 100%)'
                  : 'linear-gradient(135deg, rgba(203,60,255,0.5) 0%, rgba(0,194,255,0.5) 100%)',
                width: 38,
                height: 38,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.25s ease',
                boxShadow: open ? '0 0 16px rgba(203,60,255,0.3)' : 'none',
              }}
            >
              <Avatar
                sx={{
                  width: '100%',
                  height: '100%',
                  bgcolor: '#0a1330',
                  fontSize: 13,
                  fontWeight: 800,
                  color: '#fff',
                }}
              >
                {user ? user.username.slice(0, 2).toUpperCase() : 'U'}
              </Avatar>
            </Box>
            <Stack spacing={0} sx={{ display: { xs: 'none', sm: 'flex' } }}>
              <Typography variant="subtitle2" fontWeight={700} lineHeight={1.2}>
                {user ? user.username : 'User'}
              </Typography>
              <Typography variant="caption" color="text.secondary" fontWeight={400} lineHeight={1.2}>
                {user ? 'Pengguna Aktif' : 'Belum masuk'}
              </Typography>
            </Stack>
            <IconifyIcon
              icon="mingcute:down-small-fill"
              sx={{
                fontSize: 16,
                color: 'text.secondary',
                transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.25s ease',
                display: { xs: 'none', sm: 'block' },
              }}
            />
          </Stack>
        </ButtonBase>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleProfileMenuClose}
        onClick={handleProfileMenuClose}
        sx={{ mt: 1.5 }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        slotProps={{
          paper: {
            sx: {
              minWidth: 240,
              bgcolor: '#0a1130',
              border: '1px solid rgba(255,255,255,0.08)',
              backdropFilter: 'blur(20px)',
              '&:hover': { transform: 'none', boxShadow: 'none' },
            },
          },
        }}
      >
        {user ? (
          <>
            <Box px={2} py={1.5}>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Box
                  sx={{
                    p: '2px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #cb3cff 0%, #00c2ff 100%)',
                    width: 40,
                    height: 40,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Avatar sx={{ width: '100%', height: '100%', bgcolor: '#0a1130', fontSize: 13, fontWeight: 800 }}>
                    {user.username.slice(0, 2).toUpperCase()}
                  </Avatar>
                </Box>
                <Stack spacing={0} overflow="hidden">
                  <Typography variant="subtitle2" fontWeight={700} noWrap>{user.username}</Typography>
                  <Typography variant="caption" color="text.secondary" fontWeight={400} noWrap>{user.email}</Typography>
                </Stack>
              </Stack>
            </Box>
            <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)', mb: 0.5 }} />
          </>
        ) : null}

        <MenuItem
          onClick={() => { window.location.href = paths.history; }}
          sx={{ py: 1.25, '&:hover': { bgcolor: 'rgba(255,255,255,0.04)' } }}
        >
          <ListItemIcon sx={{ mr: 1.5 }}>
            <IconifyIcon icon="solar:history-bold-duotone" sx={{ fontSize: 20, color: '#00c2ff' }} />
          </ListItemIcon>
          <Typography variant="body2">Riwayat Prediksi</Typography>
        </MenuItem>

        <MenuItem
          onClick={() => { window.location.href = paths.prediction; }}
          sx={{ py: 1.25, '&:hover': { bgcolor: 'rgba(255,255,255,0.04)' } }}
        >
          <ListItemIcon sx={{ mr: 1.5 }}>
            <IconifyIcon icon="solar:magic-stick-3-bold-duotone" sx={{ fontSize: 20, color: '#cb3cff' }} />
          </ListItemIcon>
          <Typography variant="body2">Buat Prediksi</Typography>
        </MenuItem>

        <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)', my: 0.5 }} />

        <MenuItem
          onClick={handleLogout}
          sx={{
            py: 1.25,
            '&:hover': { bgcolor: 'rgba(255,90,101,0.08)' },
          }}
        >
          <ListItemIcon sx={{ mr: 1.5 }}>
            <IconifyIcon icon="solar:logout-3-bold-duotone" sx={{ fontSize: 20, color: '#ff5a65' }} />
          </ListItemIcon>
          <Typography variant="body2" color="error.main">Keluar Akun</Typography>
        </MenuItem>
      </Menu>
    </>
  );
};

export default ProfileMenu;
