import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { adminApi } from 'api/client';
import { isAuthenticated } from 'auth/auth';
import paths from 'routes/paths';
import type { DatasetInfo, TrainModelResponse } from 'types/predibuy';

const formatDate = (value: string) =>
  new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));

const Admin = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [datasets, setDatasets] = useState<DatasetInfo[]>([]);
  const [health, setHealth] = useState('');
  const [trainResult, setTrainResult] = useState<TrainModelResponse | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const loadAdmin = useCallback(async () => {
    if (!isAuthenticated()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const [healthResponse, datasetResponse] = await Promise.all([
        adminApi.health(),
        adminApi.datasets(),
      ]);
      setHealth(healthResponse.message);
      setDatasets(datasetResponse.datasets);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal memuat data admin');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAdmin();
  }, [loadAdmin]);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await adminApi.uploadDataset(file);
      setDatasets((current) => [response.dataset, ...current]);
      event.target.value = '';
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload dataset gagal');
    } finally {
      setLoading(false);
    }
  };

  const handleDatasetInfo = async (filename: string) => {
    setError('');
    setLoading(true);

    try {
      const response = await adminApi.datasetInfo(filename);
      setDatasets((current) =>
        current.map((dataset) => (dataset.filename === response.filename ? response : dataset)),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Info dataset gagal');
    } finally {
      setLoading(false);
    }
  };

  const handleTrainModel = async () => {
    setError('');
    setLoading(true);

    try {
      const response = await adminApi.trainModel();
      setTrainResult(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Training model gagal');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated()) {
    return (
      <Card>
        <CardContent>
          <Stack spacing={2}>
            <Typography variant="h5" fontWeight={700}>
              Admin Panel
            </Typography>
            <Alert severity="warning">Silakan masuk sebagai admin untuk mengelola dataset dan model.</Alert>
            <Button variant="contained" href={paths.signin}>
              Masuk
            </Button>
          </Stack>
        </CardContent>
      </Card>
    );
  }

  return (
    <Grid container spacing={{ xs: 2.5, sm: 3, lg: 3.75 }}>
      <Grid size={{ xs: 12, xl: 5 }}>
        <Card>
          <CardContent>
            <Stack spacing={2.5}>
              <Stack spacing={1}>
                <Typography variant="h5" fontWeight={700}>
                  Dataset
                </Typography>
                <Typography color="text.secondary">
                  Upload, validasi, dan latih model menggunakan dataset Predibuy.
                </Typography>
              </Stack>

              {error ? <Alert severity="error">{error}</Alert> : null}
              {health ? <Alert severity="success">{health}</Alert> : null}

              <Stack direction="row" spacing={1} useFlexGap>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  hidden
                  onChange={handleFileChange}
                />
                <Button variant="contained" onClick={() => fileInputRef.current?.click()} disabled={loading}>
                  Upload Dataset
                </Button>
                <Button variant="outlined" onClick={loadAdmin} disabled={loading}>
                  {loading ? 'Memuat...' : 'Refresh'}
                </Button>
              </Stack>

              <Button variant="outlined" color="secondary" onClick={handleTrainModel} disabled={loading || datasets.length === 0}>
                Train Model
              </Button>

              {trainResult ? (
                <Box sx={{ p: 2, borderRadius: 2, bgcolor: 'action.hover' }}>
                  <Stack spacing={1}>
                    <Typography fontWeight={700}>Training selesai</Typography>
                    <Typography color="text.secondary">Dataset: {trainResult.dataset}</Typography>
                    <Typography color="text.secondary">Trained at: {trainResult.trained_at}</Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                      <Chip label={`Accuracy: ${trainResult.metrics.accuracy ?? '-'}`} />
                      <Chip label={`F1: ${trainResult.metrics.f1 ?? '-'}`} />
                      <Chip label={`ROC AUC: ${trainResult.metrics.roc_auc ?? '-'}`} />
                    </Stack>
                  </Stack>
                </Box>
              ) : null}
            </Stack>
          </CardContent>
        </Card>
      </Grid>

      <Grid size={{ xs: 12, xl: 7 }}>
        <Card>
          <CardContent>
            <Stack spacing={2}>
              <Typography variant="h5" fontWeight={700}>
                Daftar Dataset
              </Typography>

              {datasets.length === 0 ? <Alert severity="info">Belum ada dataset yang diupload.</Alert> : null}

              {datasets.length > 0 ? (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>File</TableCell>
                        <TableCell>Uploaded</TableCell>
                        <TableCell>Rows</TableCell>
                        <TableCell>Columns</TableCell>
                        <TableCell>Size</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {datasets.map((dataset) => (
                        <TableRow key={dataset.filename} hover>
                          <TableCell>{dataset.filename}</TableCell>
                          <TableCell>{formatDate(dataset.uploaded_at)}</TableCell>
                          <TableCell>{dataset.rows ?? '-'}</TableCell>
                          <TableCell>{dataset.columns ?? '-'}</TableCell>
                          <TableCell>{adminApi.formatBytes(dataset.size_bytes)}</TableCell>
                          <TableCell>
                            <Chip
                              color={dataset.valid ? 'success' : 'error'}
                              label={dataset.valid ? 'Valid' : 'Invalid'}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <Button size="small" onClick={() => handleDatasetInfo(dataset.filename)}>
                              Info
                            </Button>
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
      </Grid>
    </Grid>
  );
};

export default Admin;
