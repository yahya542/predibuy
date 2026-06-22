import { useCallback, useEffect, useState } from 'react';
/* import Alert from '@mui/material/Alert'; */
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
/* import Link from '@mui/material/Link'; */
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { apiRequest } from 'api/client';
import { getCurrentUser, isAuthenticated } from 'auth/auth';
import paths from 'routes/paths';

interface HealthStatus {
  status: string;
  service: string;
}

const Dashboard = () => {
  const [health, setHealth] = useState<HealthStatus | null>(null);
  /* const [error, setError] = useState(''); */
  const [loading, setLoading] = useState(false);
  const user = getCurrentUser();

  const loadHealth = useCallback(async () => {
    setLoading(true);
    /* setError(''); */

    try {
      const response = await apiRequest<HealthStatus>('/health');
      setHealth(response);
    } catch (err) {
 /*      setError(err instanceof Error ? err.message : 'Gagal membaca status API'); */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadHealth();
  }, [loadHealth]);

  return (
    <Grid container spacing={{ xs: 2.5, sm: 3, lg: 3.75 }}>
      <Grid size={{ xs: 12, md: 4 }}>
        <Card>
          <CardContent>
            <Stack spacing={2}>
              <Typography color="text.secondary" variant="body2">
                API Status
              </Typography>
              <Stack direction="row" justifyContent="space-between" alignItems="center" gap={2}>
                <Typography variant="h4" fontWeight={800}>
                  {health ? health.status : '-'}
                </Typography>
                <Chip color={health ? 'success' : 'default'} label={health ? 'Online' : 'Checking'} />
              </Stack>
              <Typography color="text.secondary">{health?.service ?? 'PadiBuy API'}</Typography>
              <Button variant="outlined" onClick={loadHealth} disabled={loading}>
                {loading ? 'Memuat...' : 'Cek API'}
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Grid>

      <Grid size={{ xs: 12, md: 4 }}>
        <Card>
          <CardContent>
            <Stack spacing={2}>
              <Typography color="text.secondary" variant="body2">
                Akun
              </Typography>
              <Typography variant="h5" fontWeight={800}>
                {user ? user.username : 'Belum masuk'}
              </Typography>
              <Typography color="text.secondary">{user ? user.email : 'Login untuk prediksi'}</Typography>
              <Button variant="contained" href={isAuthenticated() ? paths.prediction : paths.signin}>
                {isAuthenticated() ? 'Buat Prediksi' : 'Masuk'}
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Grid>

      <Grid size={{ xs: 12, md: 4 }}>
        <Card>
          <CardContent>
            <Stack spacing={2}>
              <Typography color="text.secondary" variant="body2">
                Endpoint
              </Typography>
              <Typography variant="h5" fontWeight={800}>
                FastAPI
              </Typography>
              <Typography color="text.secondary">
                Frontend terhubung ke API Predibuy untuk auth, prediksi, riwayat, dan admin.
              </Typography>
              <Button variant="outlined" href={paths.history}>
                Lihat Riwayat
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Grid>

      <Grid size={12}>
       {/*  <Card>
          <CardContent>
            <Stack spacing={2}>
              <Typography variant="h5" fontWeight={700}>
                Menu Utama
              </Typography>
              <Typography color="text.secondary">
                Gunakan sidebar untuk mengakses prediksi, riwayat, dan panel admin.
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} useFlexGap>
                <Button variant="contained" href={paths.prediction}>
                  Prediksi Perilaku
                </Button>
                <Button variant="outlined" href={paths.history}>
                  Riwayat User
                </Button>
                <Button variant="outlined" href={paths.admin}>
                  Admin Dataset
                </Button>
              </Stack>
              {error ? <Alert severity="error">{error}</Alert> : null}
              <Typography color="text.secondary" variant="body2">
                Dokumentasi API tersedia di <Link href="/">/</Link> melalui Swagger FastAPI.
              </Typography>
            </Stack>
          </CardContent>
        </Card> */}
      </Grid>
    </Grid>
  );
};

export default Dashboard;
