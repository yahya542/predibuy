import { useCallback, useEffect, useState } from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
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
import type { HistoryItem } from 'types/predibuy';

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

const History = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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

          {history.length === 0 && !error ? (
            <Alert severity="info">Belum ada riwayat prediksi.</Alert>
          ) : null}

          {history.length > 0 ? (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
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
                    <TableRow key={item.id} hover>
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
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : null}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default History;
