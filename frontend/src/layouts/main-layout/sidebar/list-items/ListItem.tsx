import { useState } from 'react';
import { MenuItem } from 'routes/sitemap';
import Link from '@mui/material/Link';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText, { listItemTextClasses } from '@mui/material/ListItemText';
import Box from '@mui/material/Box';
import IconifyIcon from 'components/base/IconifyIcon';

const ListItem = ({ subheader, icon, path, active }: MenuItem) => {
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <ListItemButton
      component={Link}
      href={path}
      onClick={handleClick}
      sx={{
        position: 'relative',
        py: 1.5,
        px: 2.5,
        mb: 1,
        borderRadius: 2,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        opacity: active ? 1 : 0.6,
        background: active
          ? 'linear-gradient(90deg, rgba(203, 60, 255, 0.15) 0%, rgba(127, 37, 251, 0.03) 100%)'
          : 'transparent',
        border: '1px solid',
        borderColor: active ? 'rgba(203, 60, 255, 0.2)' : 'transparent',
        boxShadow: active ? '0 4px 20px 0 rgba(203, 60, 255, 0.1)' : 'none',
        '&:hover': {
          opacity: 1,
          background: active
            ? 'linear-gradient(90deg, rgba(203, 60, 255, 0.2) 0%, rgba(127, 37, 251, 0.05) 100%)'
            : 'rgba(255, 255, 255, 0.04)',
          transform: 'translateX(4px)',
          borderColor: active ? 'rgba(203, 60, 255, 0.35)' : 'rgba(255, 255, 255, 0.05)',
        },
      }}
    >
      {/* Left indicator glow bar for active step */}
      {active && (
        <Box
          sx={{
            position: 'absolute',
            left: 0,
            top: '15%',
            height: '70%',
            width: 4,
            borderRadius: '0 4px 4px 0',
            background: 'linear-gradient(180deg, #cb3cff 0%, #7f25fb 100%)',
            boxShadow: '0 0 10px #cb3cff',
          }}
        />
      )}
      <ListItemIcon
        sx={{
          minWidth: 40,
          color: active ? '#cb3cff' : 'text.secondary',
          transition: 'color 0.3s ease',
        }}
      >
        {icon && <IconifyIcon icon={icon} />}
      </ListItemIcon>
      <ListItemText
        primary={subheader}
        sx={{
          [`& .${listItemTextClasses.primary}`]: {
            color: active ? '#ffffff' : 'text.secondary',
            fontWeight: active ? 700 : 500,
            letterSpacing: active ? 0.3 : 0,
            transition: 'all 0.3s ease',
          },
        }}
      />
    </ListItemButton>
  );
};

export default ListItem;
