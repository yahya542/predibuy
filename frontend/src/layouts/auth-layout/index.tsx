import { PropsWithChildren } from 'react';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ButtonBase from '@mui/material/ButtonBase';
import LogoImg from 'assets/images/Logo.png';
import Image from 'components/base/Image';
import IconifyIcon from 'components/base/IconifyIcon';

const features = [
  {
    icon: 'solar:cpu-bolt-bold-duotone',
    color: '#cb3cff',
    title: 'Random Forest AI',
    desc: 'Model prediksi mutakhir dengan 100+ pohon keputusan terlatih.'
  },
  {
    icon: 'solar:chart-2-bold-duotone',
    color: '#00c2ff',
    title: 'Analitik Real-time',
    desc: 'Dashboard interaktif dengan visualisasi data psikologis konsumen.'
  },
  {
    icon: 'solar:lock-password-bold-duotone',
    color: '#14ca74',
    title: 'Keamanan Data',
    desc: 'Autentikasi JWT-based dan enkripsi end-to-end untuk privasi Anda.'
  },
];

const AuthLayout = ({ children }: PropsWithChildren) => {
  return (
    <Stack
      component="main"
      direction={{ xs: 'column', md: 'row' }}
      width={1}
      minHeight="100vh"
      sx={{ bgcolor: '#020617' }}
    >
      {/* ───── Left Panel: Branding ───── */}
      <Box
        sx={{
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          justifyContent: 'space-between',
          width: '50%',
          minHeight: '100vh',
          position: 'relative',
          p: 6,
          overflow: 'hidden',
          background: 'linear-gradient(145deg, #0d1b4b 0%, #060a1f 60%, #0d0820 100%)',
          '&::before': {
            content: '""',
            position: 'absolute',
            inset: 0,
            backgroundImage: `
              radial-gradient(ellipse at 20% 30%, rgba(203,60,255,0.18) 0%, transparent 55%),
              radial-gradient(ellipse at 80% 70%, rgba(0,194,255,0.14) 0%, transparent 55%)
            `,
            pointerEvents: 'none',
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: -80,
            right: -80,
            width: 420,
            height: 420,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)',
            filter: 'blur(40px)',
            pointerEvents: 'none',
          },
        }}
      >
        {/* Logo */}
        
          <Image src={LogoImg} alt="logo" height={380} width={700} />
        

        {/* Hero copy */}
        <Box sx={{ zIndex: 1 }}>
          <Typography
            variant="h2"
            fontWeight={900}
            letterSpacing={-1}
            sx={{
              lineHeight: 1.15,
              background: 'linear-gradient(135deg, #ffffff 30%, rgba(203,60,255,0.8) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 2.5,
            }}
          >
            Prediksi Perilaku Pembelian Impulsif
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 430, lineHeight: 1.8 }}>
            Platform kecerdasan buatan berbasis <strong style={{ color: '#ffffff' }}>Random Forest Classifier</strong> untuk
            mengidentifikasi kecenderungan belanja konsumen secara akurat dan real-time.
          </Typography>

          {/* Feature pills */}
          <Stack spacing={2.5} mt={5}>
            {features.map((f) => (
              <Stack key={f.title} direction="row" spacing={2} alignItems="flex-start">
                <Box
                  sx={{
                    p: 1.25,
                    borderRadius: 2,
                    bgcolor: `${f.color}18`,
                    border: `1px solid ${f.color}30`,
                    flexShrink: 0,
                    display: 'flex',
                  }}
                >
                  <IconifyIcon icon={f.icon} sx={{ fontSize: 22, color: f.color }} />
                </Box>
                <Box>
                  <Typography variant="subtitle2" fontWeight={700} mb={0.3}>
                    {f.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {f.desc}
                  </Typography>
                </Box>
              </Stack>
            ))}
          </Stack>
        </Box>

        {/* Bottom footnote */}
        <Typography variant="caption" color="text.secondary" sx={{ opacity: 0.5, zIndex: 1 }}>
          © 2026 PadiBuy Intellect · All rights reserved
        </Typography>
      </Box>

      {/* ───── Right Panel: Auth Form ───── */}
      <Stack
        alignItems="center"
        justifyContent="center"
        sx={{
          flex: 1,
          minHeight: '100vh',
          px: { xs: 2, sm: 4, md: 6 },
          py: 5,
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            inset: 0,
            backgroundImage: `radial-gradient(ellipse at 50% 0%, rgba(203,60,255,0.07) 0%, transparent 60%)`,
            pointerEvents: 'none',
          },
        }}
      >
        {/* Mobile-only logo */}
        <ButtonBase
          component={Link}
          href="/"
          disableRipple
          sx={{ display: { xs: 'flex', md: 'none' }, mb: 4, alignItems: 'center' }}
        >
          <Image src={LogoImg} alt="logo" height={180} width={180} sx={{ mr: 1 }} />
          <Typography variant="h5" fontWeight={800}>PadiBuy</Typography>
        </ButtonBase>

        {/* The actual card from Signin/Signup */}
        <Box
          sx={{
            width: '100%',
            maxWidth: 460,
            background: 'rgba(8, 16, 40, 0.65)',
            backdropFilter: 'blur(24px)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 5,
            p: { xs: 3.5, sm: 5 },
            boxShadow: '0 24px 60px 0 rgba(0,0,0,0.5)',
          }}
        >
          {children}
        </Box>
      </Stack>
    </Stack>
  );
};

export default AuthLayout;
