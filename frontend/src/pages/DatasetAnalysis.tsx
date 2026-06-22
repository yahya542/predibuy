import { useCallback, useEffect, useMemo, useState } from 'react';
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
import type { DatasetAnalysisResponse } from 'types/predibuy';

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

const scoreLabelMap: Record<string, string> = {
  skor_ibb: 'IBB (Impulsive Buying Behavior)',
  skor_promosi: 'Promosi / Diskon',
  skor_social_influence: 'Pengaruh Sosial',
  skor_hedonic: 'Hedonis',
  skor_self_control: 'Self-Control',
  skor_negative_emotion: 'Emosi Negatif',
};

const categoryValueLabels: Record<string, Record<number, string>> = {
  gender: { 1: 'Pria', 2: 'Wanita' },
  paylater_status: { 1: 'Menggunakan', 2: 'Tidak Menggunakan' },
  education: { 1: 'SD', 2: 'SMP', 3: 'SMA', 4: 'Kuliah' },
  job_status: { 1: 'Pelajar', 2: 'Mahasiswa', 3: 'Pekerja', 4: 'Wirausaha' },
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value);

const DatasetAnalysis = () => {
  const theme = useTheme();
  const [analysis, setAnalysis] = useState<DatasetAnalysisResponse | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const loadAnalysis = useCallback(async () => {
    if (!isAuthenticated()) return;
    setLoading(true);
    setError('');
    try {
      const response = await adminApi.analyzeDataset();
      setAnalysis(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal menganalisis dataset');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAnalysis();
  }, [loadAnalysis]);

  // --- Chart options ---

  const classDistOption = useMemo(() => {
    if (!analysis) return {};
    const cd = analysis.class_distribution;
    return {
      tooltip: { trigger: 'item' },
      series: [
        {
          type: 'pie',
          radius: ['40%', '70%'],
          label: {
            show: true,
            color: theme.palette.text.primary,
            fontSize: 12,
            formatter: '{b}\n{c} ({d}%)',
          },
          data: [
            { value: cd.impulsive, name: 'Impulsive', itemStyle: { color: theme.palette.error.main } },
            { value: cd.wise, name: 'Wise', itemStyle: { color: theme.palette.success.main } },
          ],
        },
      ],
    };
  }, [analysis, theme]);

  const scoreChartOptions = useMemo(() => {
    if (!analysis) return {} as Record<string, object>;
    const sd = analysis.score_distributions;
    const charts: Record<string, object> = {};
    for (const [key, counts] of Object.entries(sd)) {
      const labels = [1, 2, 3, 4, 5];
      const values = labels.map((v) => counts[v] ?? 0);
      charts[key] = {
        tooltip: { trigger: 'axis' },
        grid: { top: 10, bottom: 28, left: 36, right: 10 },
        xAxis: {
          type: 'category',
          data: labels.map(String),
          axisLabel: { color: theme.palette.text.secondary, fontSize: 10 },
          axisLine: { show: false },
          axisTick: { show: false },
        },
        yAxis: {
          type: 'value',
          axisLabel: { color: theme.palette.text.secondary, fontSize: 10 },
          splitLine: { lineStyle: { color: 'rgba(255,255,255,0.06)' } },
        },
        series: [
          {
            type: 'bar',
            data: values,
            itemStyle: { color: theme.palette.secondary.main, borderRadius: [4, 4, 0, 0] },
            barWidth: 24,
          },
        ],
      };
    }
    return charts;
  }, [analysis, theme]);

  const categoryChartOptions = useMemo(() => {
    if (!analysis) return {} as Record<string, object>;
    const cd = analysis.category_distributions;
    const charts: Record<string, object> = {};
    for (const [catKey, dist] of Object.entries(cd)) {
      const valueLabels = categoryValueLabels[catKey] ?? {};
      const entries = Object.entries(dist).sort((a, b) => Number(a[0]) - Number(b[0]));
      charts[catKey] = {
        tooltip: { trigger: 'item' },
        series: [
          {
            type: 'pie',
            radius: ['35%', '65%'],
            label: { show: true, color: theme.palette.text.primary, fontSize: 10, formatter: '{b}\n{c}' },
            data: entries.map(([val, count]) => ({ value: count, name: valueLabels[Number(val)] ?? val })),
          },
        ],
      };
    }
    return charts;
  }, [analysis, theme]);

  // --- Auth guard ---

  if (!isAuthenticated()) {
    return (
      <Card>
        <CardContent>
          <Stack spacing={2}>
            <Typography variant="h5" fontWeight={700}>
              Analisis Dataset
            </Typography>
            <Alert severity="warning">Silakan masuk sebagai admin untuk mengakses analisis dataset.</Alert>
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
      {/* Header */}
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" gap={2}>
        <Stack spacing={0.5}>
          <Typography variant="h5" fontWeight={700}>
            Analisis Dataset Terbaru
          </Typography>
          <Typography color="text.secondary">
            Statistik deskriptif dan distribusi dari dataset yang terakhir diupload.
          </Typography>
        </Stack>
        <Button variant="outlined" onClick={loadAnalysis} disabled={loading}>
          {loading ? 'Menganalisis...' : 'Refresh'}
        </Button>
      </Stack>

      {error ? <Alert severity="error">Terjadi kesalahan: {error}</Alert> : null}

      {/* Loading */}
      {loading && !analysis ? (
        <Card>
          <CardContent>
            <Stack spacing={2.5} alignItems="center" sx={{ py: 6 }}>
              <CircularProgress size={56} thickness={4} />
              <Stack spacing={0.5} alignItems="center">
                <Typography variant="subtitle1" fontWeight={600}>
                  Menganalisis dataset...
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Membaca dataset, menghitung statistik dan distribusi
                </Typography>
              </Stack>
              <Box sx={{ width: '100%', maxWidth: 320 }}>
                <LinearProgress />
              </Box>
            </Stack>
          </CardContent>
        </Card>
      ) : null}

      {analysis ? (
        <>
          {/* Row 1: Info + Class Distribution + Income */}
          <Grid container spacing={{ xs: 2.5, sm: 3 }}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Stack spacing={2}>
                    <Typography variant="h6" fontWeight={700}>
                      Info Dataset
                    </Typography>
                    <Stack spacing={1}>
                      <Stack direction="row" justifyContent="space-between">
                        <Typography color="text.secondary" variant="body2">File</Typography>
                        <Typography variant="body2" fontWeight={600} noWrap sx={{ maxWidth: 180 }}>
                          {analysis.dataset.filename}
                        </Typography>
                      </Stack>
                      <Stack direction="row" justifyContent="space-between">
                        <Typography color="text.secondary" variant="body2">Baris</Typography>
                        <Typography variant="body2" fontWeight={600}>{analysis.dataset.rows}</Typography>
                      </Stack>
                      <Stack direction="row" justifyContent="space-between">
                        <Typography color="text.secondary" variant="body2">Kolom</Typography>
                        <Typography variant="body2" fontWeight={600}>{analysis.dataset.columns}</Typography>
                      </Stack>
                      <Stack direction="row" justifyContent="space-between">
                        <Typography color="text.secondary" variant="body2">Ukuran</Typography>
                        <Typography variant="body2" fontWeight={600}>{adminApi.formatBytes(analysis.dataset.size_bytes)}</Typography>
                      </Stack>
                      <Stack direction="row" justifyContent="space-between">
                        <Typography color="text.secondary" variant="body2">Status</Typography>
                        <Chip color={analysis.dataset.valid ? 'success' : 'error'} label={analysis.dataset.valid ? 'Valid' : 'Invalid'} size="small" />
                      </Stack>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Stack spacing={2}>
                    <Typography variant="h6" fontWeight={700}>
                      Distribusi Kelas
                    </Typography>
                    <Typography color="text.secondary" variant="body2">
                      Total: {analysis.class_distribution.total} sampel
                    </Typography>
                    <ReactEchart echarts={echarts} option={classDistOption} sx={{ height: 200 }} />
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Stack spacing={2}>
                    <Typography variant="h6" fontWeight={700}>
                      Statistik Pendapatan
                    </Typography>
                    <Stack spacing={1}>
                      <Stack direction="row" justifyContent="space-between">
                        <Typography color="text.secondary" variant="body2">Rata-rata</Typography>
                        <Typography variant="body2" fontWeight={600}>{formatCurrency(analysis.income_stats.mean)}</Typography>
                      </Stack>
                      <Stack direction="row" justifyContent="space-between">
                        <Typography color="text.secondary" variant="body2">Median</Typography>
                        <Typography variant="body2" fontWeight={600}>{formatCurrency(analysis.income_stats.median)}</Typography>
                      </Stack>
                      <Stack direction="row" justifyContent="space-between">
                        <Typography color="text.secondary" variant="body2">Minimum</Typography>
                        <Typography variant="body2" fontWeight={600}>{formatCurrency(analysis.income_stats.min)}</Typography>
                      </Stack>
                      <Stack direction="row" justifyContent="space-between">
                        <Typography color="text.secondary" variant="body2">Maksimum</Typography>
                        <Typography variant="body2" fontWeight={600}>{formatCurrency(analysis.income_stats.max)}</Typography>
                      </Stack>
                      <Stack direction="row" justifyContent="space-between">
                        <Typography color="text.secondary" variant="body2">Std Deviasi</Typography>
                        <Typography variant="body2" fontWeight={600}>{formatCurrency(analysis.income_stats.std)}</Typography>
                      </Stack>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Row 2: Score Distributions (Likert 1-5) */}
          <Card>
            <CardContent>
              <Stack spacing={2}>
                <Typography variant="h6" fontWeight={700}>
                  Distribusi Skor Likert (1–5)
                </Typography>
                <Typography color="text.secondary" variant="body2">
                  Jumlah responden per nilai skor untuk setiap dimensi psikologis
                </Typography>
                <Grid container spacing={2}>
                  {Object.keys(scoreLabelMap).map((key) => (
                    <Grid key={key} size={{ xs: 12, sm: 6, md: 4 }}>
                      <Stack spacing={1}>
                        <Typography variant="subtitle2" fontWeight={600} align="center">
                          {scoreLabelMap[key]}
                        </Typography>
                        <ReactEchart echarts={echarts} option={scoreChartOptions[key] ?? {}} sx={{ height: 160 }} />
                      </Stack>
                    </Grid>
                  ))}
                </Grid>
              </Stack>
            </CardContent>
          </Card>

          {/* Row 3: Category Distributions (pies) */}
          <Card>
            <CardContent>
              <Stack spacing={2}>
                <Typography variant="h6" fontWeight={700}>
                  Distribusi Kategori Demografis
                </Typography>
                <Grid container spacing={2}>
                  {Object.keys(categoryValueLabels).map((catKey) => (
                    <Grid key={catKey} size={{ xs: 12, sm: 6, md: 3 }}>
                      <Stack spacing={1}>
                        <Typography variant="subtitle2" fontWeight={600} align="center">
                          {featureLabelMap[catKey] ?? catKey}
                        </Typography>
                        <ReactEchart echarts={echarts} option={categoryChartOptions[catKey] ?? {}} sx={{ height: 180 }} />
                      </Stack>
                    </Grid>
                  ))}
                </Grid>
              </Stack>
            </CardContent>
          </Card>

          {/* Row 4: Feature Statistics Table */}
          <Card>
            <CardContent>
              <Stack spacing={2}>
                <Typography variant="h6" fontWeight={700}>
                  Statistik Deskriptif Seluruh Fitur
                </Typography>
                <Typography color="text.secondary" variant="body2">
                  Mean, standar deviasi, minimum, maksimum, dan median setiap fitur model
                </Typography>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Fitur</TableCell>
                        <TableCell align="right">Mean</TableCell>
                        <TableCell align="right">Std Dev</TableCell>
                        <TableCell align="right">Min</TableCell>
                        <TableCell align="right">Median</TableCell>
                        <TableCell align="right">Max</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {Object.entries(analysis.feature_stats).map(([key, stat]) => (
                        <TableRow key={key} hover>
                          <TableCell>{featureLabelMap[key] ?? key}</TableCell>
                          <TableCell align="right">{stat.mean}</TableCell>
                          <TableCell align="right">{stat.std}</TableCell>
                          <TableCell align="right">{stat.min}</TableCell>
                          <TableCell align="right">{stat.median}</TableCell>
                          <TableCell align="right">{stat.max}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Stack>
            </CardContent>
          </Card>
        </>
      ) : null}
    </Stack>
  );
};

export default DatasetAnalysis;
