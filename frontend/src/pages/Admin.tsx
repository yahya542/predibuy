import { ChangeEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import LinearProgress from '@mui/material/LinearProgress';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import * as echarts from 'echarts/core';
import ReactEchart from 'components/base/ReactEchart';
import { adminApi } from 'api/client';
import { isAuthenticated } from 'auth/auth';
import paths from 'routes/paths';
import type { DatasetInfo, TrainModelResponse } from 'types/predibuy';

const formatDate = (value: string) =>
  new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));

const featureLabelMap: Record<string, string> = {
  gender: 'Jenis Kelamin',
  paylater_status: 'Status Paylater',
  education: 'Pendidikan',
  umur: 'Umur',
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

const Admin = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [datasets, setDatasets] = useState<DatasetInfo[]>([]);
  const [health, setHealth] = useState('');
  const [trainResult, setTrainResult] = useState<TrainModelResponse | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const theme = useTheme();

  const metricsOption = useMemo(() => {
    if (!trainResult) return {};
    const m = trainResult.metrics;
    const labels = ['Accuracy', 'Precision', 'Recall', 'F1 Score', 'ROC AUC', 'Log Loss'];
    const values = [m.accuracy, m.precision, m.recall, m.f1, m.roc_auc, m.log_loss];
    return {
      tooltip: { trigger: 'axis' },
      grid: { top: 20, bottom: 40, left: 80, right: 20 },
      xAxis: {
        type: 'value',
        max: 1,
        axisLabel: { color: theme.palette.text.secondary, fontSize: 11 },
        splitLine: { lineStyle: { color: 'rgba(255,255,255,0.06)' } },
      },
      yAxis: {
        type: 'category',
        data: labels,
        axisLabel: { color: theme.palette.text.primary, fontSize: 11 },
        axisLine: { show: false },
        axisTick: { show: false },
      },
      series: [
        {
          type: 'bar',
          data: values.map((v) => (v !== null ? Number(v.toFixed(4)) : 0)),
          itemStyle: {
            color: (params: { dataIndex: number }) =>
              params.dataIndex === 5 ? theme.palette.error.main : theme.palette.secondary.main,
            borderRadius: [0, 4, 4, 0],
          },
          barWidth: 18,
          label: {
            show: true,
            position: 'right',
            color: theme.palette.text.primary,
            fontSize: 11,
            formatter: (p: { value: number }) => p.value?.toFixed(4) ?? '-',
          },
        },
      ],
    };
  }, [trainResult, theme]);

  const featureImportanceOption = useMemo(() => {
    if (!trainResult) return {};
    const fi = trainResult.feature_importance;
    const sorted = Object.entries(fi).sort((a, b) => a[1] - b[1]);
    return {
      tooltip: { trigger: 'axis' },
      grid: { top: 10, bottom: 30, left: 130, right: 40 },
      xAxis: {
        type: 'value',
        axisLabel: { color: theme.palette.text.secondary, fontSize: 10 },
        splitLine: { lineStyle: { color: 'rgba(255,255,255,0.06)' } },
      },
      yAxis: {
        type: 'category',
        data: sorted.map(([k]) => featureLabelMap[k] ?? k),
        axisLabel: { color: theme.palette.text.primary, fontSize: 11 },
        axisLine: { show: false },
        axisTick: { show: false },
      },
      series: [
        {
          type: 'bar',
          data: sorted.map(([, v]) => Number(v.toFixed(4))),
          itemStyle: {
            color: theme.palette.primary.main,
            borderRadius: [0, 4, 4, 0],
          },
          barWidth: 14,
          label: {
            show: true,
            position: 'right',
            color: theme.palette.text.secondary,
            fontSize: 10,
            formatter: (p: { value: number }) => `${(p.value * 100).toFixed(1)}%`,
          },
        },
      ],
    };
  }, [trainResult, theme]);

  const classDistOption = useMemo(() => {
    if (!trainResult) return {};
    const cd = trainResult.class_distribution;
    return {
      tooltip: { trigger: 'item' },
      legend: { show: false },
      series: [
        {
          type: 'pie',
          radius: ['45%', '70%'],
          avoidLabelOverlap: false,
          label: {
            show: true,
            color: theme.palette.text.primary,
            fontSize: 11,
            formatter: '{b}: {c}',
          },
          data: [
            { value: cd.impulsive, name: 'Impulsive', itemStyle: { color: theme.palette.error.main } },
            { value: cd.wise, name: 'Wise', itemStyle: { color: theme.palette.success.main } },
          ],
        },
      ],
    };
  }, [trainResult, theme]);

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

              {loading ? (
                <Stack spacing={2} alignItems="center" sx={{ py: 3 }}>
                  <CircularProgress size={48} thickness={4} />
                  <Typography variant="subtitle1" fontWeight={600}>
                    Melatih model Random Forest...
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Validasi dataset, ekstraksi fitur, GridSearchCV, evaluasi
                  </Typography>
                  <Box sx={{ width: '100%', maxWidth: 320 }}>
                    <LinearProgress />
                  </Box>
                </Stack>
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

      {/* Training Results Visualizations */}
      {trainResult ? (
        <>
          {/* Row 1: Training Info + Class Distribution + Split Info */}
          <Grid size={12}>
            <Card>
              <CardContent>
                <Stack spacing={2}>
                  <Typography variant="h5" fontWeight={700}>
                    Hasil Training Model
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <Stack spacing={1}>
                        <Typography color="text.secondary" variant="body2">Dataset</Typography>
                        <Typography variant="body2" fontWeight={600} noWrap>{trainResult.dataset.split('/').pop()}</Typography>
                        <Typography color="text.secondary" variant="caption">Trained: {formatDate(trainResult.trained_at)}</Typography>
                      </Stack>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <Stack spacing={1}>
                        <Typography color="text.secondary" variant="body2">Distribusi Kelas</Typography>
                        <ReactEchart echarts={echarts} option={classDistOption} sx={{ height: 160 }} />
                      </Stack>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <Stack spacing={1}>
                        <Typography color="text.secondary" variant="body2">Pembagian Data</Typography>
                        <Stack spacing={0.5}>
                          <Stack direction="row" justifyContent="space-between">
                            <Typography variant="body2">Train</Typography>
                            <Chip label={`${trainResult.split_info.train_size} sampel`} size="small" color="primary" />
                          </Stack>
                          <Stack direction="row" justifyContent="space-between">
                            <Typography variant="body2">Test</Typography>
                            <Chip label={`${trainResult.split_info.test_size} sampel`} size="small" />
                          </Stack>
                          <Stack direction="row" justifyContent="space-between">
                            <Typography variant="body2">Test Ratio</Typography>
                            <Typography variant="body2" fontWeight={600}>{trainResult.split_info.test_ratio * 100}%</Typography>
                          </Stack>
                        </Stack>
                      </Stack>
                    </Grid>
                  </Grid>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Row 2: Best Parameters */}
          <Grid size={12}>
            <Card>
              <CardContent>
                <Stack spacing={2}>
                  <Typography variant="h6" fontWeight={700}>Parameter Terbaik (GridSearchCV)</Typography>
                  <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap>
                    {Object.entries(trainResult.best_params).map(([key, value]) => (
                      <Chip
                        key={key}
                        label={`${key.replace('model__', '')}: ${String(value)}`}
                        variant="outlined"
                        color="secondary"
                      />
                    ))}
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Row 3: Metrics + Feature Importance */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Card>
              <CardContent>
                <Stack spacing={2}>
                  <Typography variant="h6" fontWeight={700}>Metrik Evaluasi Model</Typography>
                  <Typography color="text.secondary" variant="body2">
                    Hasil evaluasi pada data test ({trainResult.split_info.test_size} sampel)
                  </Typography>
                  <ReactEchart echarts={echarts} option={metricsOption} sx={{ height: 260 }} />
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 7 }}>
            <Card>
              <CardContent>
                <Stack spacing={2}>
                  <Typography variant="h6" fontWeight={700}>Kepentingan Fitur (Feature Importance)</Typography>
                  <Typography color="text.secondary" variant="body2">
                    Seberapa besar pengaruh setiap fitur terhadap prediksi model
                  </Typography>
                  <ReactEchart echarts={echarts} option={featureImportanceOption} sx={{ height: 380 }} />
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </>
      ) : null}
    </Grid>
  );
};

export default Admin;
