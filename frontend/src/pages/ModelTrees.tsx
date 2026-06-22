import { useCallback, useEffect, useMemo, useState } from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import LinearProgress from '@mui/material/LinearProgress';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import * as echarts from 'echarts/core';
import { TreeChart } from 'echarts/charts'; // 1. IMPORT TREECHART
import ReactEchart from 'components/base/ReactEchart';
import { adminApi } from 'api/client';
import { isAuthenticated } from 'auth/auth';
import paths from 'routes/paths';
import type { ModelTreesResponse, TreeNode } from 'types/predibuy';

// 2. REGISTER TREECHART AGAR BISA DIGUNAKAN OLEH ECHARTS
echarts.use([TreeChart]);

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

const toEchartsTree = (node: TreeNode): object => {
  const isLeaf = !node.children || node.children.length === 0;
  const label = isLeaf
    ? `【 ${node.class} 】\nGini: ${node.gini}\nSampel: ${node.samples}\nNilai: [${node.value.join(', ')}]`
    : `${featureLabelMap[node.feature ?? ''] ?? node.feature} <= ${node.threshold}\nGini: ${node.gini}\nSampel: ${node.samples}\nNilai: [${node.value.join(', ')}]\nKelas: ${node.class}`;

  const itemStyle: Record<string, string> = {};
  if (isLeaf) {
    itemStyle.color = node.class === 'Impulsif' ? '#ef5350' : '#66bb6a';
  }

  return {
    name: label,
    itemStyle,
    children: node.children ? node.children.map(toEchartsTree) : [],
  };
};

const ModelTrees = () => {
  const theme = useTheme();
  const [data, setData] = useState<ModelTreesResponse | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [treeLimit, setTreeLimit] = useState(3);
  const [maxDepth, setMaxDepth] = useState(4);

  const loadTrees = useCallback(async () => {
    if (!isAuthenticated()) return;
    setLoading(true);
    setError('');
    try {
      const response = await adminApi.getModelTrees(treeLimit, maxDepth);
      setData(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal memuat struktur pohon');
    } finally {
      setLoading(false);
    }
  }, [treeLimit, maxDepth]);

  useEffect(() => {
    loadTrees();
  }, [loadTrees]);

  const treeChartOptions = useMemo(() => {
    if (!data) return [] as object[];
    return data.trees.map((tree) => ({
      tooltip: { trigger: 'item', triggerOn: 'mousemove' },
      series: [
        {
          type: 'tree',
          data: [toEchartsTree(tree.root)],
          top: '8%',
          left: '8%',
          bottom: '22%', 
          right: '8%',
          symbolSize: 12,
          orient: 'TB', 
          label: {
            position: 'top', 
            verticalAlign: 'bottom',
            align: 'center',
            fontSize: 9,
            lineHeight: 13,
            color: theme.palette.text.primary,
            backgroundColor: theme.palette.background.paper,
            borderRadius: 4,
            padding: [4, 6],
            borderWidth: 1,
            borderColor: theme.palette.divider
          },
          leaves: {
            label: {
              position: 'bottom',
              verticalAlign: 'top',
              align: 'center',
              fontSize: 9,
              lineHeight: 13,
            },
          },
          expandAndCollapse: true,
          initialTreeDepth: maxDepth,
          animationDuration: 550,
          animationDurationUpdate: 750,
        },
      ],
    }));
  }, [data, theme, maxDepth]);


  if (!isAuthenticated()) {
    return (
      <Card>
        <CardContent>
          <Stack spacing={2}>
            <Typography variant="h5" fontWeight={700}>
              Struktur Pohon Keputusan
            </Typography>
            <Alert severity="warning">Silakan masuk sebagai admin untuk melihat struktur pohon model.</Alert>
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
      {/* Header + Controls */}
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" gap={2} alignItems={{ sm: 'center' }}>
        <Stack spacing={0.5}>
          <Typography variant="h5" fontWeight={700}>
            Visualisasi Struktur Pohon Keputusan
          </Typography>
          <Typography color="text.secondary">
            Menampilkan pohon individual dari model Random Forest untuk bahan hitungan manual.
          </Typography>
        </Stack>
        <Button variant="outlined" onClick={loadTrees} disabled={loading}>
          {loading ? 'Memuat...' : 'Refresh'}
        </Button>
      </Stack>

      {error ? <Alert severity="error">Terjadi kesalahan: {error}</Alert> : null}

      {/* Controls */}
      <Stack direction="row" spacing={2} useFlexGap>
        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel>Jumlah Pohon</InputLabel>
          <Select value={treeLimit} label="Jumlah Pohon" onChange={(e) => setTreeLimit(Number(e.target.value))}>
            {[1, 2, 3, 5].map((v) => (
              <MenuItem key={v} value={v}>{v} pohon</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel>Kedalaman Maks</InputLabel>
          <Select value={maxDepth} label="Kedalaman Maks" onChange={(e) => setMaxDepth(Number(e.target.value))}>
            {[2, 3, 4, 5, 6].map((v) => (
              <MenuItem key={v} value={v}>{v} level</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>

      {/* Loading */}
      {loading && !data ? (
        <Card>
          <CardContent>
            <Stack spacing={2.5} alignItems="center" sx={{ py: 6 }}>
              <CircularProgress size={56} thickness={4} />
              <Stack spacing={0.5} alignItems="center">
                <Typography variant="subtitle1" fontWeight={600}>
                  Memuat struktur pohon...
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Mengekstrak pohon dari model Random Forest
                </Typography>
              </Stack>
              <Box sx={{ width: '100%', maxWidth: 320 }}>
                <LinearProgress />
              </Box>
            </Stack>
          </CardContent>
        </Card>
      ) : null}

      {data ? (
        <>
          {/* Model Info */}
          <Card>
            <CardContent>
              <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap alignItems="center">
                <Chip label={`Total pohon: ${data.total_trees}`} />
                <Chip label={`Ditampilkan: ${data.shown_trees}`} color="primary" />
                <Chip label={`Kedalaman maks: ${data.max_depth}`} />
                <Typography color="text.secondary" variant="body2">
                  Dilatih: {new Date(data.trained_at).toLocaleString('id-ID')}
                </Typography>
              </Stack>
            </CardContent>
          </Card>

          {/* Tree Visualizations */}
          {data.trees.map((tree, idx) => (
            <Card key={tree.tree_index}>
              <CardContent>
                <Stack spacing={2}>
                  <Typography variant="h6" fontWeight={700}>
                    Pohon ke-{tree.tree_index + 1}
                  </Typography>
                  <Typography color="text.secondary" variant="body2">
                    Menampilkan rincian aturan pemisahan data berdasarkan kriteria Gini Impurity.
                  </Typography>
                  
                  {/* Container ECharts untuk menampilkan pohon */}
                  <Box sx={{ width: '100%', height: 500, overflow: 'auto', mt: 1 }}>
                    <ReactEchart
                      echarts={echarts}
                      option={treeChartOptions[idx] || {}}
                      style={{ width: '100%', height: '100%', minWidth: 800 }}
                    />
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </>
      ) : null}
    </Stack>
  );
};

export default ModelTrees;
