import { useCallback, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { apiRequest } from 'api/client';
import { getCurrentUser, isAuthenticated, clearAuth } from 'auth/auth';
import paths from 'routes/paths';
import IconifyIcon from 'components/base/IconifyIcon';

interface HealthStatus {
  status: string;
  service: string;
}

const Dashboard = () => {
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const user = getCurrentUser();

  const loadHealth = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiRequest<HealthStatus>('/health');
      setHealth(response);
    } catch {
      setHealth({ status: 'Offline', service: 'Predibuy API (Trouble)' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadHealth();
  }, [loadHealth]);

  // Dynamic greeting based on current local hours
  const getGreeting = () => {
    const hr = new Date().getHours();
    const name = user ? user.username : 'User';
    if (hr >= 4 && hr < 11) {
      return { text: `Selamat Pagi, ${name}! 🌅`, desc: 'Semoga hari Anda produktif dan penuh berkah.' };
    } else if (hr >= 11 && hr < 15) {
      return { text: `Selamat Siang, ${name}! ☀️`, desc: 'Tetap semangat beraktivitas di siang hari ini.' };
    } else if (hr >= 15 && hr < 18) {
      return { text: `Selamat Sore, ${name}! 🌆`, desc: 'Waktu yang tepat untuk meninjau data Anda.' };
    } else {
      return { text: `Selamat Malam, ${name}! 🌌`, desc: 'Siap menganalisis pola pembelian malam ini?' };
    }
  };

  const currentGreeting = getGreeting();

  const handleLogout = () => {
    clearAuth();
    window.location.href = paths.signin;
  };

  return (
    <Grid container spacing={{ xs: 2.5, sm: 3, lg: 3.75 }}>
      {/* Hero Welcome Banner */}
      <Grid size={12}>
        <Card
          sx={{
            background: 'linear-gradient(135deg, rgba(203, 60, 255, 0.12) 0%, rgba(6, 182, 212, 0.08) 50%, rgba(8, 16, 40, 0.5) 100%)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            boxShadow: '0 8px 32px 0 rgba(139, 92, 246, 0.1)',
            position: 'relative',
            overflow: 'hidden',
            p: { xs: 3, sm: 4, md: 5 },
            '&::after': {
              content: '""',
              position: 'absolute',
              top: '-30%',
              right: '-10%',
              width: '300px',
              height: '300px',
              background: 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)',
              filter: 'blur(30px)',
              pointerEvents: 'none',
            }
          }}
        >
          <CardContent sx={{ p: 0 }}>
            <Stack spacing={2} maxWidth={650}>
              <Stack direction="row" alignItems="center" spacing={1.5}>
                <Box
                  sx={{
                    p: 1,
                    borderRadius: 2,
                    bgcolor: 'rgba(203, 60, 255, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 0 15px rgba(203, 60, 255, 0.3)',
                  }}
                >
                  <IconifyIcon icon="solar:magic-stick-3-bold-duotone" sx={{ fontSize: 28, color: '#cb3cff' }} />
                </Box>
                <Typography variant="body2" color="rgba(203, 60, 255, 0.9)" fontWeight={700} letterSpacing={1.5}>
                  PREDIBUY INTELLECT v1.2
                </Typography>
              </Stack>
              <Typography variant="h3" fontWeight={850} letterSpacing={-0.5} sx={{ lineHeight: 1.2 }}>
                {currentGreeting.text}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary" sx={{ opacity: 0.85 }}>
                {currentGreeting.desc} Dashboard analitik cerdas berbasis model <b>Random Forest Classifier</b> untuk memprediksi
                kecenderungan perilaku pembelian impulsif (Impulsive Buying Behavior).
              </Typography>
              <Stack direction="row" spacing={2} pt={1.5}>
                {isAuthenticated() ? (
                  <Button
                    variant="contained"
                    href={paths.prediction}
                    className="glowing-btn-primary"
                    sx={{
                      background: 'linear-gradient(135deg, #cb3cff 0%, #7f25fb 100%)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #d854ff 0%, #8d3ffb 100%)',
                      },
                      px: 3.5,
                      py: 1.25,
                      fontWeight: 700,
                      borderRadius: 3,
                    }}
                  >
                    Mulai Prediksi
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    href={paths.signin}
                    sx={{
                      background: 'linear-gradient(135deg, #00c2ff 0%, #0825e5 100%)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #33cffd 0%, #1532e8 100%)',
                      },
                      px: 3.5,
                      py: 1.25,
                      fontWeight: 700,
                      borderRadius: 3,
                    }}
                  >
                    Masuk Sekarang
                  </Button>
                )}
                <Button
                  variant="outlined"
                  href={paths.history}
                  sx={{
                    borderColor: 'rgba(255, 255, 255, 0.15)',
                    color: '#ffffff',
                    px: 3,
                    borderRadius: 3,
                    background: 'rgba(255,255,255,0.03)',
                    '&:hover': {
                      borderColor: '#cb3cff',
                      background: 'rgba(203,60,255,0.05)',
                    }
                  }}
                >
                  Lihat Riwayat
                </Button>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      </Grid>

      {/* Grid Columns */}
      {/* 1. API status */}
      <Grid size={{ xs: 12, md: 4 }}>
        <Card sx={{ height: '100%', position: 'relative', overflow: 'hidden' }}>
          <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <Stack spacing={3.5}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography color="text.secondary" variant="caption" fontWeight={750} letterSpacing={1}>
                  SISTEM API
                </Typography>
                <IconifyIcon icon="solar:server-square-bold-duotone" sx={{ fontSize: 24, color: '#00c2ff' }} />
              </Stack>

              <Stack direction="row" alignItems="center" spacing={2.5}>
                {/* Glowing green bulb */}
                <Box
                  sx={{
                    width: 14,
                    height: 14,
                    borderRadius: '50%',
                    bgcolor: health && health.status === 'OK' ? '#14ca74' : '#ff5a65',
                    boxShadow: health && health.status === 'OK'
                      ? '0 0 15px #14ca74, 0 0 25px rgba(20,202,116,0.5)'
                      : '0 0 15px #ff5a65, 0 0 25px rgba(255,90,101,0.5)',
                  }}
                />
                <Stack spacing={0.2}>
                  <Typography variant="h4" fontWeight={850}>
                    {health ? (health.status === 'OK' ? 'ONLINE' : 'TROUBLE') : 'CHECKING'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {health?.service ?? 'Menghubungkan ke server...'}
                  </Typography>
                </Stack>
              </Stack>

              <Typography color="text.secondary" variant="body2" sx={{ opacity: 0.8 }}>
                Menyediakan koneksi realtime ke platform FastAPI untuk pemrosesan dataset dan kalkulasi inferensi model.
              </Typography>
            </Stack>

            <Button
              variant="outlined"
              onClick={loadHealth}
              disabled={loading}
              fullWidth
              sx={{
                mt: 3,
                py: 1,
                borderRadius: 2.5,
                borderColor: 'rgba(255, 255, 255, 0.08)',
                color: 'text.secondary',
                '&:hover': {
                  borderColor: '#00c2ff',
                  color: '#ffffff',
                  background: 'rgba(0, 194, 255, 0.05)',
                }
              }}
            >
              {loading ? 'Memvalidasi...' : 'Cek Latency API'}
            </Button>
          </CardContent>
        </Card>
      </Grid>

      {/* 2. User account */}
      <Grid size={{ xs: 12, md: 4 }}>
        <Card sx={{ height: '100%', position: 'relative', overflow: 'hidden' }}>
          <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <Stack spacing={3.5}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography color="text.secondary" variant="caption" fontWeight={750} letterSpacing={1}>
                  STATUS AKUN
                </Typography>
                <IconifyIcon icon="solar:user-rounded-bold-duotone" sx={{ fontSize: 24, color: '#cb3cff' }} />
              </Stack>

              <Stack direction="row" alignItems="center" spacing={2}>
                <Box
                  sx={{
                    position: 'relative',
                    p: '2px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #cb3cff 0%, #00c2ff 100%)',
                    width: 54,
                    height: 54,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 0 15px rgba(203,60,255,0.2)',
                  }}
                >
                  <Box
                    sx={{
                      width: '100%',
                      height: '100%',
                      borderRadius: '50%',
                      bgcolor: '#081028',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 18,
                      fontWeight: 800,
                      color: '#ffffff',
                    }}
                  >
                    {user ? user.username.slice(0, 2).toUpperCase() : '?'}
                  </Box>
                </Box>
                <Stack spacing={0.1} overflow="hidden">
                  <Typography variant="h5" fontWeight={850} noWrap>
                    {user ? user.username : 'Tamu (Guest)'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" noWrap>
                    {user ? user.email : 'Belum masuk ke aplikasi'}
                  </Typography>
                </Stack>
              </Stack>

              <Typography color="text.secondary" variant="body2" sx={{ opacity: 0.8 }}>
                {user
                  ? 'Anda berhasil terkonfigurasi dengan status keanggotaan terverifikasi untuk fitur tak terbatas.'
                  : 'Masuk dengan kredensial Anda untuk menyimpan riwayat prediksi dan meninjau model Random Forest.'}
              </Typography>
            </Stack>

            {isAuthenticated() ? (
              <Button
                variant="outlined"
                color="error"
                onClick={handleLogout}
                fullWidth
                sx={{
                  mt: 3,
                  py: 1,
                  borderRadius: 2.5,
                  borderColor: 'rgba(255, 90, 101, 0.15)',
                  '&:hover': {
                    borderColor: '#ff5a65',
                    background: 'rgba(255, 90, 101, 0.05)',
                  }
                }}
              >
                Keluar Akun
              </Button>
            ) : (
              <Button
                variant="contained"
                href={paths.signin}
                fullWidth
                sx={{
                  mt: 3,
                  py: 1.2,
                  borderRadius: 2.5,
                  background: 'linear-gradient(135deg, #cb3cff 0%, #7f25fb 100%)',
                }}
              >
                Masuk / Buat Akun
              </Button>
            )}
          </CardContent>
        </Card>
      </Grid>

      {/* 3. Model info */}
      <Grid size={{ xs: 12, md: 4 }}>
        <Card sx={{ height: '100%', position: 'relative', overflow: 'hidden' }}>
          <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <Stack spacing={3.5}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography color="text.secondary" variant="caption" fontWeight={750} letterSpacing={1}>
                  INTEL MODEL AI
                </Typography>
                <IconifyIcon icon="solar:cpu-bolt-bold-duotone" sx={{ fontSize: 24, color: '#cb3cff' }} />
              </Stack>

              <Stack direction="row" alignItems="center" spacing={2.5}>
                <Box
                  sx={{
                    width: 38,
                    height: 38,
                    borderRadius: 2.5,
                    bgcolor: 'rgba(20,202,116,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <IconifyIcon icon="solar:diagram-up-bold-duotone" sx={{ fontSize: 22, color: '#14ca74' }} />
                </Box>
                <Stack spacing={0.2}>
                  <Typography variant="h5" fontWeight={850}>
                    RANDOM FOREST
                  </Typography>
                  <Typography variant="body2" color="success.main" fontWeight={750}>
                    Trained & Active
                  </Typography>
                </Stack>
              </Stack>

              <Typography color="text.secondary" variant="body2" sx={{ opacity: 0.8 }}>
                Mengevaluasi 13 variabel masukan, termasuk pengaruh sosial, emosi negatif, self-control, paylater, & tingkat belanja.
              </Typography>
            </Stack>

            <Button
              variant="outlined"
              href={paths.history}
              fullWidth
              sx={{
                mt: 3,
                py: 1,
                borderRadius: 2.5,
                borderColor: 'rgba(255, 255, 255, 0.08)',
                color: 'text.secondary',
                '&:hover': {
                  borderColor: '#cb3cff',
                  color: '#ffffff',
                  background: 'rgba(203, 60, 255, 0.05)',
                }
              }}
            >
              Lihat Parameter Riwayat
            </Button>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default Dashboard;
