import { useCallback, useEffect, useMemo, useState } from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Collapse from '@mui/material/Collapse';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { predictionApi } from 'api/client';
import { isAuthenticated } from 'auth/auth';
import paths from 'routes/paths';
import type { HistoryItem, PredictionRequest } from 'types/predibuy';

const formatDate = (value: string) =>
  new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value);

const inputFieldLabels: Record<keyof PredictionRequest, string> = {
  gender: 'Jenis Kelamin',
  paylater_status: 'Status Paylater',
  education: 'Pendidikan',
  year_of_birth: 'Tahun Lahir',
  job_status: 'Status Pekerjaan',
  monthly_income: 'Pendapatan Bulanan',
  avg_expenditure_ratio: 'Rasio Belanja',
  skor_ibb: 'Skor IBB',
  skor_promosi: 'Skor Promosi',
  skor_social_influence: 'Skor Pengaruh Sosial',
  skor_hedonic: 'Skor Hedonis',
  skor_self_control: 'Skor Self-Control',
  skor_negative_emotion: 'Skor Emosi Negatif',
};

const formatInputValue = (key: keyof PredictionRequest, value: number): string => {
  if (key === 'gender') return value === 1 ? 'Pria' : 'Wanita';
  if (key === 'paylater_status') return value === 1 ? 'Menggunakan' : 'Tidak Menggunakan';
  if (key === 'education') {
    const map: Record<number, string> = { 1: 'SD', 2: 'SMP', 3: 'SMA', 4: 'Kuliah' };
    return map[value] ?? String(value);
  }
  if (key === 'job_status') {
    const map: Record<number, string> = { 1: 'Pelajar', 2: 'Mahasiswa', 3: 'Pekerja', 4: 'Wirausaha' };
    return map[value] ?? String(value);
  }
  if (key === 'monthly_income') return formatCurrency(value);
  return String(value);
};

const History = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const stats = useMemo(() => {
    if (history.length === 0) return null;
    const total = history.length;
    const impulsive = history.filter((h) => h.is_impulsive === 1).length;
    const wise = total - impulsive;
    const avgConfidence = history.reduce((sum, h) => sum + h.confidence_rate, 0) / total;
    return {
      total,
      impulsive,
      wise,
      impulsivePercent: Math.round((impulsive / total) * 100),
      wisePercent: Math.round((wise / total) * 100),
      avgConfidence: avgConfidence.toFixed(1),
    };
  }, [history]);

  const loadHistory = useCallback(async () => {
    if (!isAuthenticated()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await predictionApi.history();
      setHistory(response.riwayat_user);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal memuat riwayat');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  if (!isAuthenticated()) {
    return (
      <Card>
        <CardContent>
          <Stack spacing={2}>
            <Typography variant="h5" fontWeight={700}>
              Riwayat Prediksi
            </Typography>
            <Alert severity="warning">Silakan masuk untuk melihat riwayat prediksi.</Alert>
            <Button variant="contained" href={paths.signin}>
              Masuk
            </Button>
          </Stack>
        </CardContent>
      </Card>
    );
  }

  return (
    <Stack spacing={{ xs: 2.5, sm: 3, lg: 3.75 }}>
      {/* Summary Statistics */}
      {loading && history.length === 0 ? (
        <Grid container spacing={2}>
          {[1, 2, 3, 4].map((i) => (
            <Grid key={i} size={{ xs: 6, md: 3 }}>
              <Card>
                <CardContent>
                  <Skeleton variant="text" width="60%" height={20} />
                  <Skeleton variant="rectangular" width="40%" height={36} sx={{ mt: 1 }} />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : null}

      {stats ? (
        <Grid container spacing={2}>
          <Grid size={{ xs: 6, md: 3 }}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" variant="body2">
                  Total Prediksi
                </Typography>
                <Typography variant="h4" fontWeight={800}>
                  {stats.total}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" variant="body2">
                  Impulsive Buyer
                </Typography>
                <Stack direction="row" spacing={1} alignItems="baseline">
                  <Typography variant="h4" fontWeight={800} color="error.main">
                    {stats.impulsive}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    ({stats.impulsivePercent}%)
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" variant="body2">
                  Wise Buyer
                </Typography>
                <Stack direction="row" spacing={1} alignItems="baseline">
                  <Typography variant="h4" fontWeight={800} color="success.main">
                    {stats.wise}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    ({stats.wisePercent}%)
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" variant="body2">
                  Rata-rata Kepercayaan
                </Typography>
                <Typography variant="h4" fontWeight={800}>
                  {stats.avgConfidence}%
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      ) : null}
      {/* History Table */}
      <Card>
        <CardContent>
          <Stack spacing={2.5}>
            <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" gap={2}>
              <Stack spacing={1}>
                <Typography variant="h5" fontWeight={700}>
                  Riwayat Prediksi
                </Typography>
                <Typography color="text.secondary">
                  Data diambil dari endpoint GET /predict/history.
                </Typography>
              </Stack>
              <Button variant="outlined" onClick={loadHistory} disabled={loading}>
                {loading ? 'Memuat...' : 'Refresh'}
              </Button>
            </Stack>

            {error ? <Alert severity="error">{error}</Alert> : null}

            {loading && history.length === 0 ? (
              <Stack spacing={1}>
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} variant="rectangular" height={48} />
                ))}
              </Stack>
            ) : null}

            {history.length === 0 && !error && !loading ? (
              <Alert severity="info">Belum ada riwayat prediksi.</Alert>
            ) : null}

            {history.length > 0 ? (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell width={48}></TableCell>
                      <TableCell>Tanggal</TableCell>
                      <TableCell>Kesimpulan</TableCell>
                      <TableCell>Confidence</TableCell>
                      <TableCell>Umur</TableCell>
                      <TableCell>Pendapatan</TableCell>
                      <TableCell>Skor Diskon</TableCell>
                      <TableCell>Skor Emosi</TableCell>
                      <TableCell>Model</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {history.map((item) => (
                      <>
                        <TableRow
                          key={item.id}
                          hover
                          sx={{ cursor: item.input_json ? 'pointer' : 'default' }}
                          onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                        >
                          <TableCell>
                            {item.input_json ? (
                              <IconButton size="small">
                                <Typography variant="caption" color="text.secondary">
                                  {expandedId === item.id ? '−' : '+'}
                                </Typography>
                              </IconButton>
                            ) : null}
                          </TableCell>
                          <TableCell>{formatDate(item.created_at)}</TableCell>
                          <TableCell>
                            <Chip
                              color={item.is_impulsive === 1 ? 'error' : 'success'}
                              label={item.is_impulsive === 1 ? 'Impulsive' : 'Wise'}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>{item.confidence_rate}%</TableCell>
                          <TableCell>{item.umur}</TableCell>
                          <TableCell>{formatCurrency(item.pendapatan)}</TableCell>
                          <TableCell>{item.skor_diskon}</TableCell>
                          <TableCell>{item.skor_emosi}</TableCell>
                          <TableCell>
                            <Box component="span" color="text.secondary" fontSize="body2.fontSize">
                              {item.model_version ?? '-'}
                            </Box>
                          </TableCell>
                        </TableRow>
                        {item.input_json ? (
                          <TableRow>
                            <TableCell colSpan={9} sx={{ py: 0, borderBottom: expandedId === item.id ? undefined : 'none' }}>
                              <Collapse in={expandedId === item.id} timeout="auto" unmountOnExit>
                                <Stack spacing={2} sx={{ py: 2 }}>
                                  <Typography variant="subtitle2" fontWeight={700}>
                                    Detail Input Prediksi
                                  </Typography>
                                  <Grid container spacing={1.5}>
                                    {(Object.keys(inputFieldLabels) as (keyof PredictionRequest)[]).map((key) => (
                                      <Grid key={key} size={{ xs: 6, sm: 4, md: 3 }}>
                                        <Box
                                          sx={{
                                            p: 1.5,
                                            borderRadius: 1,
                                            bgcolor: 'action.hover',
                                          }}
                                        >
                                          <Typography variant="caption" color="text.secondary">
                                            {inputFieldLabels[key]}
                                          </Typography>
                                          <Typography variant="body2" fontWeight={600}>
                                            {formatInputValue(key, (item.input_json as PredictionRequest)?.[key])}
                                          </Typography>
                                        </Box>
                                      </Grid>
                                    ))}
                                  </Grid>
                                  <Divider />
                                  <Typography variant="caption" color="text.secondary">
                                    Model: {item.model_version ?? '-'}
                                  </Typography>
                                </Stack>
                              </Collapse>
                            </TableCell>
                          </TableRow>
                        ) : null}
                      </>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : null}
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
};

export default History;
