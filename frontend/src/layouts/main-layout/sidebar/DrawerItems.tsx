import { topListData, bottomListData, profileListData, adminListData } from 'data/sidebarListData';
import { isAdmin } from 'auth/auth';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import List from '@mui/material/List';
import Stack from '@mui/material/Stack';
import ButtonBase from '@mui/material/ButtonBase';
import Typography from '@mui/material/Typography';
import Image from 'components/base/Image';
import CollapseListItem from './list-items/CollapseListItem';
import ProfileListItem from './list-items/ProfileListItem';
import ListItem from './list-items/ListItem';
import Logo from 'assets/images/Logo.png';

const DrawerItems = () => {
  return (
    <>
      <Stack
        pt={5}
        pb={4}
        px={3.5}
        position="sticky"
        top={0}
        bgcolor="info.darker"
        alignItems="center"
        justifyContent="flex-start"
        zIndex={1000}
      >
        <ButtonBase component={Link} href="/" disableRipple>
          <Image src={Logo} alt="logo" height={24} width={24} sx={{ mr: 1 }} />
          <Typography variant="h5" color="text.primary" fontWeight={600} letterSpacing={1}>
            PadiBuy
          </Typography>
        </ButtonBase>
      </Stack>

      <Box px={3.5} pb={3} pt={1}>
        <Typography color="text.secondary" variant="caption" fontWeight={700}>
          PREDIBUY WEB
        </Typography>
      </Box>

      <List component="nav" sx={{ px: 2.5 }}>
        {topListData.map((route, index) => {
          return <ListItem key={index} {...route} />;
        })}
      </List>

      {isAdmin() ? (
        <>
          <Box px={3.5} pb={1} pt={2}>
            <Typography color="text.secondary" variant="caption" fontWeight={700}>
              ADMIN
            </Typography>
          </Box>
          <List component="nav" sx={{ px: 2.5 }}>
            {adminListData.map((route) => (
              <ListItem key={route.id} {...route} />
            ))}
          </List>
        </>
      ) : null}

      <List component="nav" sx={{ px: 2.5 }}>
        {bottomListData.map((route) => {
          if (route.items) {
            return <CollapseListItem key={route.id} {...route} />;
          }
          return <ListItem key={route.id} {...route} />;
        })}
      </List>

      <List component="nav" sx={{ px: 2.5 }}>
        {profileListData ? <ProfileListItem {...profileListData} /> : null}
      </List>
    </>
  );
};

export default DrawerItems;
