import { topListData, bottomListData, profileListData, adminListData } from 'data/sidebarListData';
import { isAdmin, getCurrentUser } from 'auth/auth';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import List from '@mui/material/List';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import ButtonBase from '@mui/material/ButtonBase';
import Image from 'components/base/Image';
import CollapseListItem from './list-items/CollapseListItem';
import ListItem from './list-items/ListItem';
import Logo from 'assets/images/Logo.png';

const DrawerItems = () => {
  const user = getCurrentUser();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* ── Logo / Brand ── */}
      <Box
        sx={{
          px: 3,
          pt: 3.5,
          pb: 2.5,
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        }}
      >
        <ButtonBase component={Link} href="/" disableRipple>
          <Box
            sx={{
              p: 1,
              borderRadius: 2,
              bgcolor: 'rgba(203,60,255,0.12)',
              border: '1px solid rgba(203,60,255,0.22)',
              mr: 1.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Image src={Logo} alt="logo" height={20} width={20} />
          </Box>
          <Stack spacing={0}>
            <Typography variant="h6" fontWeight={800} letterSpacing={0.5} lineHeight={1.1}>
              PadiBuy
            </Typography>
            <Typography variant="caption" color="rgba(203,60,255,0.7)" fontWeight={700} letterSpacing={1.5}>
              INTELLECT v1.2
            </Typography>
          </Stack>
        </ButtonBase>
      </Box>

      {/* ── Main nav group ── */}
      <Box px={2} pt={2}>
        <Typography
          color="text.secondary"
          variant="caption"
          fontWeight={700}
          letterSpacing={1.5}
          px={1.5}
          sx={{ opacity: 0.5 }}
        >
          MENU UTAMA
        </Typography>
        <List component="nav" disablePadding sx={{ mt: 1 }}>
          {topListData.map((route, index) => (
            <ListItem key={index} {...route} />
          ))}
        </List>
      </Box>

      {/* ── Admin group (only shown to admins) ── */}
      {isAdmin() ? (
        <Box px={2} pt={2}>
          <Typography
            color="text.secondary"
            variant="caption"
            fontWeight={700}
            letterSpacing={1.5}
            px={1.5}
            sx={{ opacity: 0.5 }}
          >
            ADMIN PANEL
          </Typography>
          <List component="nav" disablePadding sx={{ mt: 1 }}>
            {adminListData.map((route) => (
              <ListItem key={route.id} {...route} />
            ))}
          </List>
        </Box>
      ) : null}

      {/* ── Settings / Auth group ── */}
      <Box px={2} pt={2}>
        <List component="nav" disablePadding>
          {bottomListData.map((route) => {
            if (route.items) {
              return <CollapseListItem key={route.id} {...route} />;
            }
            return <ListItem key={route.id} {...route} />;
          })}
        </List>
      </Box>

      {/* ── Spacer ── */}
      <Box flexGrow={1} />

      {/* ── Profile card at bottom ── */}
      {profileListData ? (
        <>
          <Divider sx={{ borderColor: 'rgba(255,255,255,0.05)', mx: 2 }} />
          <Box
            sx={{
              p: 2.5,
              mx: 2,
              my: 2,
              borderRadius: 3,
              background: 'linear-gradient(135deg, rgba(203,60,255,0.08) 0%, rgba(127,37,251,0.04) 100%)',
              border: '1px solid rgba(203,60,255,0.12)',
              cursor: 'pointer',
              transition: 'all 0.25s ease',
              '&:hover': {
                borderColor: 'rgba(203,60,255,0.25)',
                background: 'linear-gradient(135deg, rgba(203,60,255,0.12) 0%, rgba(127,37,251,0.07) 100%)',
              },
            }}
            component={Link}
            href={profileListData.path}
          >
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Box
                sx={{
                  p: '2px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #cb3cff 0%, #00c2ff 100%)',
                  flexShrink: 0,
                  width: 44,
                  height: 44,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Avatar
                  sx={{
                    width: '100%',
                    height: '100%',
                    bgcolor: '#081028',
                    fontSize: 14,
                    fontWeight: 800,
                    color: '#ffffff',
                  }}
                >
                  {user ? user.username.slice(0, 2).toUpperCase() : 'U'}
                </Avatar>
              </Box>
              <Stack spacing={0} overflow="hidden">
                <Typography variant="subtitle2" fontWeight={700} noWrap>
                  {user ? user.username : profileListData.subheader}
                </Typography>
                <Typography variant="caption" color="text.secondary" fontWeight={400} noWrap>
                  {user ? user.email : 'Account Settings'}
                </Typography>
              </Stack>
            </Stack>
          </Box>
        </>
      ) : null}
    </Box>
  );
};

export default DrawerItems;
