import { useState, ChangeEvent, FormEvent } from 'react';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Alert from '@mui/material/Alert';
import IconifyIcon from 'components/base/IconifyIcon';
import paths from 'routes/paths';
import { authApi } from 'api/client';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError('Konfirmasi password tidak sama');
      return;
    }

    try {
      await authApi.register(email, username, password);
      setSuccess('Akun berhasil dibuat! Silakan masuk dengan kredensial Anda.');
      setEmail('');
      setUsername('');
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Pendaftaran gagal');
    }
  };

  return (
    <>
      {/* Header */}
      <Stack spacing={0.75} mb={4}>
        <Box
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 48,
            height: 48,
            borderRadius: 2.5,
            background: 'linear-gradient(135deg, #00c2ff22 0%, #0825e522 100%)',
            border: '1px solid rgba(0,194,255,0.25)',
            mb: 2,
          }}
        >
          <IconifyIcon icon="solar:user-plus-bold-duotone" sx={{ fontSize: 26, color: '#00c2ff' }} />
        </Box>
        <Typography variant="h4" fontWeight={850} letterSpacing={-0.5}>
          Buat Akun Baru
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Daftarkan diri untuk menyimpan riwayat prediksi perilaku belanja Anda.
        </Typography>
      </Stack>

      {error ? (
        <Alert
          severity="error"
          sx={{
            mb: 3,
            bgcolor: 'rgba(255,90,101,0.1)',
            border: '1px solid rgba(255,90,101,0.25)',
            color: '#ff8a92',
            '& .MuiAlert-icon': { color: '#ff5a65' },
          }}
        >
          {error}
        </Alert>
      ) : null}

      {success ? (
        <Alert
          severity="success"
          sx={{
            mb: 3,
            bgcolor: 'rgba(20,202,116,0.1)',
            border: '1px solid rgba(20,202,116,0.25)',
            color: '#60edaa',
            '& .MuiAlert-icon': { color: '#14ca74' },
          }}
        >
          {success}
        </Alert>
      ) : null}

      <Stack onSubmit={handleSubmit} component="form" direction="column" gap={2}>
        <TextField
          id="email"
          name="email"
          type="email"
          value={email}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
          variant="filled"
          placeholder="Alamat Email"
          autoComplete="email"
          fullWidth
          autoFocus
          required
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <IconifyIcon icon="solar:letter-bold-duotone" sx={{ fontSize: 18, color: 'text.secondary' }} />
                </InputAdornment>
              ),
            },
          }}
        />
        <TextField
          id="username"
          name="username"
          type="text"
          value={username}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
          variant="filled"
          placeholder="Username"
          autoComplete="username"
          fullWidth
          required
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <IconifyIcon icon="solar:user-bold-duotone" sx={{ fontSize: 18, color: 'text.secondary' }} />
                </InputAdornment>
              ),
            },
          }}
        />
        <TextField
          id="password"
          name="password"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
          variant="filled"
          placeholder="Password"
          autoComplete="new-password"
          fullWidth
          required
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <IconifyIcon icon="solar:lock-bold-duotone" sx={{ fontSize: 18, color: 'text.secondary' }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end" sx={{ opacity: password ? 1 : 0, transition: 'opacity 0.2s' }}>
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                    size="small"
                  >
                    <IconifyIcon icon={showPassword ? 'ion:eye' : 'ion:eye-off'} sx={{ fontSize: 18 }} />
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />
        <TextField
          id="confirmPassword"
          name="confirmPassword"
          type={showPassword ? 'text' : 'password'}
          value={confirmPassword}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
          variant="filled"
          placeholder="Konfirmasi Password"
          autoComplete="new-password"
          fullWidth
          required
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <IconifyIcon icon="solar:lock-keyhole-bold-duotone" sx={{ fontSize: 18, color: 'text.secondary' }} />
                </InputAdornment>
              ),
            },
          }}
        />

        <Button
          id="signup-submit"
          type="submit"
          variant="contained"
          size="large"
          fullWidth
          sx={{
            mt: 1,
            py: 1.5,
            borderRadius: 3,
            fontWeight: 700,
            fontSize: '1rem',
            background: 'linear-gradient(135deg, #00c2ff 0%, #0825e5 100%)',
            boxShadow: '0 8px 24px rgba(0, 194, 255, 0.25)',
            '&:hover': {
              background: 'linear-gradient(135deg, #33cffd 0%, #1532e8 100%)',
              boxShadow: '0 12px 32px rgba(0, 194, 255, 0.45)',
              transform: 'translateY(-1px)',
            },
            transition: 'all 0.25s ease',
          }}
        >
          Buat Akun Sekarang
        </Button>
      </Stack>

      <Divider sx={{ my: 3, borderColor: 'rgba(255,255,255,0.06)' }}>
        <Typography variant="caption" color="text.secondary" px={1}>ATAU</Typography>
      </Divider>

      <Typography
        color="text.secondary"
        variant="body2"
        align="center"
        letterSpacing={0.3}
      >
        Sudah punya akun?{' '}
        <Link
          href={paths.signin}
          fontWeight={700}
          sx={{ color: '#00c2ff', textDecorationColor: 'rgba(0,194,255,0.4)', '&:hover': { color: '#33cffd' } }}
        >
          Masuk Sekarang →
        </Link>
      </Typography>
    </>
  );
};

export default Signup;
