import { FormEvent, useState } from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
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
  { value: 1, label: 'Laki-laki' },
  { value: 2, label: 'Perempuan' },
];

const paylaterOptions = [
  { value: 1, label: 'Bukan pengguna paylater' },
  { value: 2, label: 'Pengguna paylater' },
];

const educationOptions = [
  { value: 1, label: 'SD' },
  { value: 2, label: 'SMP' },
  { value: 3, label: 'SMA/SMK' },
  { value: 4, label: 'Perguruan tinggi' },
];

const jobOptions = [
  { value: 1, label: 'Pelajar/Mahasiswa' },
  { value: 2, label: 'Karyawan swasta' },
  { value: 3, label: 'Wiraswasta' },
  { value: 4, label: 'Lainnya' },
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

  const handleNumberChange = (field: keyof PredictionRequest) => (event: { target: { value: string } }) => {
    setForm((current) => ({
      ...current,
      [field]: Number(event.target.value),
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

              {!result && !error ? (
                <Alert severity="info">Belum ada hasil prediksi. Silakan isi formulir terlebih dahulu.</Alert>
              ) : null}

              {result ? (
                <>
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    <Chip
                      color={result.data.kesimpulan === 'Impulsive Buyer' ? 'error' : 'success'}
                      label={result.data.kesimpulan}
                    />
                    <Chip label={`${result.data.persentase_kecenderungan}% confidence`} />
                  </Stack>
                  <Box
                    component="pre"
                    sx={{
                      whiteSpace: 'pre-wrap',
                      p: 2,
                      borderRadius: 2,
                      bgcolor: 'action.hover',
                    }}
                  >
                    {result.data.pesan}
                  </Box>
                  <Typography color="text.secondary" variant="body2">
                    ID riwayat: {result.data.id_riwayat}
                  </Typography>
                </>
              ) : null}
            </Stack>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default Prediction;
