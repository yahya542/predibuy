import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';
import ButtonBase from '@mui/material/ButtonBase';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import IconifyIcon from 'components/base/IconifyIcon';
import Image from 'components/base/Image';
import ProfileMenu from './ProfileMenu';
import Logo from 'assets/images/Logo.png';

interface TopbarProps {
  isClosing: boolean;
  mobileOpen: boolean;
  setMobileOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Topbar = ({ isClosing, mobileOpen, setMobileOpen }: TopbarProps) => {
  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      sx={{
        mb: { xs: 1, lg: 2 },
        py: 1.5,
        px: { xs: 0, lg: 0 },
      }}
    >
      {/* Left: Mobile menu toggle + logo */}
      <Stack direction="row" spacing={1.5} alignItems="center">
        <Toolbar sx={{ display: { xs: 'flex', lg: 'none' }, p: '0 !important', minHeight: 'auto !important' }}>
          <IconButton
            size="medium"
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={handleDrawerToggle}
            sx={{
              bgcolor: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 2,
              '&:hover': { bgcolor: 'rgba(255,255,255,0.08)' },
            }}
          >
            <IconifyIcon icon="mingcute:menu-line" />
          </IconButton>
        </Toolbar>

        <ButtonBase
          component={Link}
          href="/"
          disableRipple
          sx={{ display: { xs: 'flex', lg: 'none' }, alignItems: 'center', gap: 1 }}
        >
          <Image src={Logo} alt="logo" height={22} width={22} />
          <Typography variant="h6" fontWeight={800} letterSpacing={0.5}>PadiBuy</Typography>
        </ButtonBase>

        {/* Desktop page breadcrumb / title indicator */}
        <Box
          sx={{
            display: { xs: 'none', lg: 'flex' },
            alignItems: 'center',
            gap: 1,
            px: 2,
            py: 0.75,
            borderRadius: 2.5,
            bgcolor: 'rgba(255,255,255,0.035)',
            border: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              bgcolor: '#14ca74',
              boxShadow: '0 0 8px #14ca74',
            }}
          />
          <Typography variant="caption" color="text.secondary" fontWeight={600} letterSpacing={0.8}>
            PREDIBUY INTELLECT — AKTIF
          </Typography>
        </Box>
      </Stack>

      {/* Right: Profile area */}
      <Stack direction="row" spacing={1.5} alignItems="center">
        <ProfileMenu />
      </Stack>
    </Stack>
  );
};

export default Topbar;
