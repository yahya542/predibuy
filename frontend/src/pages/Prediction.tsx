import { FormEvent, useState } from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import LinearProgress from '@mui/material/LinearProgress';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { predictionApi } from 'api/client';
import type { PredictionRequest, PredictionResponse } from 'types/predibuy';

const initialForm: PredictionRequest = {
  gender: 1,
  paylater_status: 1,
  education: 1,
  year_of_birth: 2000,
  job_status: 1,
  monthly_income: 5000000,
  avg_expenditure_ratio: 3,
  skor_ibb: 3,
  skor_promosi: 3,
  skor_social_influence: 3,
  skor_hedonic: 3,
  skor_self_control: 3,
  skor_negative_emotion: 3,
};

const numberOptions = [1, 2, 3, 4, 5, 6].map((value) => ({
  value,
  label: String(value),
}));

const scoreOptions = [1, 2, 3, 4, 5].map((value) => ({
  value,
  label: String(value),
}));

const genderOptions = [
  { value: 1, label: 'Pria' },
  { value: 2, label: 'Wanita' },
];

const paylaterOptions = [
  { value: 1, label: 'Menggunakan' },
  { value: 2, label: 'Tidak Menggunakan' },
];

const educationOptions = [
  { value: 1, label: 'SD' },
  { value: 2, label: 'SMP' },
  { value: 3, label: 'SMA' },
  { value: 4, label: 'Kuliah' },
];

const jobOptions = [
  { value: 1, label: 'Pelajar' },
  { value: 2, label: 'Mahasiswa' },
  { value: 3, label: 'Pekerja' },
  { value: 4, label: 'Wirausaha' },
];

const fieldLabel: Record<keyof PredictionRequest, string> = {
  gender: 'Jenis kelamin',
  paylater_status: 'Status paylater',
  education: 'Pendidikan terakhir',
  year_of_birth: 'Tahun lahir',
  job_status: 'Status pekerjaan',
  monthly_income: 'Pendapatan bulanan',
  avg_expenditure_ratio: 'Rasio belanja online terhadap pendapatan',
  skor_ibb: 'Skor IBB',
  skor_promosi: 'Skor promosi/diskon',
  skor_social_influence: 'Skor pengaruh sosial',
  skor_hedonic: 'Skor hedonis',
  skor_self_control: 'Skor self-control',
  skor_negative_emotion: 'Skor emosi negatif',
};

const Prediction = () => {
  const [form, setForm] = useState<PredictionRequest>(initialForm);
  const [result, setResult] = useState<PredictionResponse | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleNumberChange = (field: keyof PredictionRequest) => (event: unknown) => {
    const target = event as { target: { value: string | number } };
    setForm((current) => ({
      ...current,
      [field]: Number(target.target.value),
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await predictionApi.predict(form);
      setResult(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Prediksi gagal');
    } finally {
      setLoading(false);
    }
  };

  const renderSelect = (field: keyof PredictionRequest, options: { value: number; label: string }[]) => (
    <FormControl fullWidth>
      <InputLabel id={`${field}-label`}>{fieldLabel[field]}</InputLabel>
      <Select
        labelId={`${field}-label`}
        value={form[field]}
        label={fieldLabel[field]}
        onChange={handleNumberChange(field)}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );

  return (
    <Grid container spacing={{ xs: 2.5, sm: 3, lg: 3.75 }}>
      <Grid size={{ xs: 12, xl: 7 }}>
        <Card>
          <CardContent>
            <Stack spacing={2} component="form" onSubmit={handleSubmit}>
              <Stack spacing={1}>
                <Typography variant="h5" fontWeight={700}>
                  Prediksi Pembelian Impulsif
                </Typography>
                <Typography color="text.secondary">
                  Isi profil dan skor psikologis untuk mendapatkan hasil prediksi dari model PadiBuy.
                </Typography>
              </Stack>

              {error ? <Alert severity="error">{error}</Alert> : null}

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>{renderSelect('gender', genderOptions)}</Grid>
                <Grid size={{ xs: 12, sm: 6 }}>{renderSelect('paylater_status', paylaterOptions)}</Grid>
                <Grid size={{ xs: 12, sm: 6 }}>{renderSelect('education', educationOptions)}</Grid>
                <Grid size={{ xs: 12, sm: 6 }}>{renderSelect('job_status', jobOptions)}</Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label={fieldLabel.year_of_birth}
                    type="number"
                    value={form.year_of_birth}
                    onChange={handleNumberChange('year_of_birth')}
                    InputProps={{ inputMode: 'numeric' }}
                    fullWidth
                    required
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label={fieldLabel.monthly_income}
                    type="number"
                    value={form.monthly_income}
                    onChange={handleNumberChange('monthly_income')}
                    InputProps={{ inputMode: 'numeric' }}
                    fullWidth
                    required
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>{renderSelect('avg_expenditure_ratio', numberOptions)}</Grid>
                <Grid size={{ xs: 12, sm: 6 }}>{renderSelect('skor_ibb', scoreOptions)}</Grid>
                <Grid size={{ xs: 12, sm: 6 }}>{renderSelect('skor_promosi', scoreOptions)}</Grid>
                <Grid size={{ xs: 12, sm: 6 }}>{renderSelect('skor_social_influence', scoreOptions)}</Grid>
                <Grid size={{ xs: 12, sm: 6 }}>{renderSelect('skor_hedonic', scoreOptions)}</Grid>
                <Grid size={{ xs: 12, sm: 6 }}>{renderSelect('skor_self_control', scoreOptions)}</Grid>
                <Grid size={{ xs: 12, sm: 6 }}>{renderSelect('skor_negative_emotion', scoreOptions)}</Grid>
              </Grid>

              <Button type="submit" variant="contained" size="large" disabled={loading}>
                {loading ? 'Mengirim prediksi...' : 'Prediksi Sekarang'}
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Grid>

      <Grid size={{ xs: 12, xl: 5 }}>
        <Card>
          <CardContent>
            <Stack spacing={2.5}>
              <Stack spacing={1}>
                <Typography variant="h5" fontWeight={700}>
                  Hasil Prediksi
                </Typography>
                <Typography color="text.secondary">
                  Hasil akan muncul setelah request dikirim ke endpoint PadiBuy API.
                </Typography>
              </Stack>

              {loading ? (
                <Stack spacing={2.5} alignItems="center" sx={{ py: 4 }}>
                  <CircularProgress size={56} thickness={4} />
                  <Stack spacing={0.5} alignItems="center">
                    <Typography variant="subtitle1" fontWeight={600}>
                      Memproses prediksi...
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Model PadiBuy sedang menganalisis data Anda
                    </Typography>
                  </Stack>
                  <Box sx={{ width: '100%', maxWidth: 280 }}>
                    <LinearProgress />
                  </Box>
                </Stack>
              ) : null}

              {!result && !error && !loading ? (
                <Alert severity="info">Belum ada hasil prediksi. Silakan isi formulir terlebih dahulu.</Alert>
              ) : null}

              {error ? <Alert severity="error">Terjadi kesalahan: {error}</Alert> : null}

              {result ? (
                <Stack spacing={2.5}>
                  {/* Result Header */}
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="flex-start"
                    flexWrap="wrap"
                    gap={1.5}
                  >
                    <Stack spacing={0.5}>
                      <Typography variant="body2" color="text.secondary">
                        Status
                      </Typography>
                      <Chip
                        color={result.data.kesimpulan === 'Impulsive Buyer' ? 'error' : 'success'}
                        label={result.data.kesimpulan}
                        sx={{ fontWeight: 700, fontSize: '0.95rem', px: 1.5, py: 2.5 }}
                      />
                    </Stack>
                    <Stack alignItems="flex-end" spacing={0.5}>
                      <Typography variant="body2" color="text.secondary">
                        ID Riwayat
                      </Typography>
                      <Chip label={`#${result.data.id_riwayat}`} variant="outlined" size="small" />
                    </Stack>
                  </Stack>

                  <Divider />

                  {/* Confidence Gauge */}
                  <Stack direction="row" spacing={2.5} alignItems="center">
                    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                      <CircularProgress
                        variant="determinate"
                        value={result.data.persentase_kecenderungan}
                        size={90}
                        thickness={5}
                        color={result.data.kesimpulan === 'Impulsive Buyer' ? 'error' : 'success'}
                      />
                      <Box
                        sx={{
                          position: 'absolute',
                          inset: 0,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Typography variant="h6" fontWeight={800}>
                          {result.data.persentase_kecenderungan.toFixed(1)}%
                        </Typography>
                      </Box>
                    </Box>
                    <Stack spacing={0.5}>
                      <Typography variant="subtitle2" fontWeight={700}>
                        Tingkat Kepercayaan
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Probabilitas model terhadap kesimpulan yang dihasilkan.
                      </Typography>
                    </Stack>
                  </Stack>

                  <Divider />

                  {/* Pesan */}
                  <Stack spacing={1}>
                    <Typography variant="subtitle2" fontWeight={700}>
                      Pesan Model
                    </Typography>
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        bgcolor:
                          result.data.kesimpulan === 'Impulsive Buyer'
                            ? 'error.50'
                            : 'success.50',
                        border: '1px solid',
                        borderColor:
                          result.data.kesimpulan === 'Impulsive Buyer'
                            ? 'error.200'
                            : 'success.200',
                      }}
                    >
                      <Typography variant="body2">{result.data.pesan}</Typography>
                    </Box>
                  </Stack>

                  {/* App Info */}
                  <Typography variant="caption" color="text.secondary">
                    {result.aplikasi} · {result.status}
                  </Typography>
                </Stack>
              ) : null}
            </Stack>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default Prediction;
