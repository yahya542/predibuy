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
import { saveAuth } from 'auth/auth';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const token = await authApi.login(email, password);
      localStorage.setItem('predibuy_access_token', token.access_token);
      const user = await authApi.me();
      saveAuth(token, {
        id: user.id,
        email: user.email,
        username: user.username,
        is_admin: user.is_admin,
      });
      window.location.href = '/';
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login gagal');
    } finally {
      setLoading(false);
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
            background: 'linear-gradient(135deg, #cb3cff22 0%, #7f25fb22 100%)',
            border: '1px solid rgba(203,60,255,0.25)',
            mb: 2,
          }}
        >
          <IconifyIcon icon="solar:login-3-bold-duotone" sx={{ fontSize: 26, color: '#cb3cff' }} />
        </Box>
        <Typography variant="h4" fontWeight={850} letterSpacing={-0.5}>
          Masuk ke Akun Anda
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Gunakan kredensial Anda untuk mengakses fitur prediksi perilaku belanja.
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
          id="password"
          name="password"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
          variant="filled"
          placeholder="Password"
          autoComplete="current-password"
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

        <Button
          id="signin-submit"
          type="submit"
          variant="contained"
          size="large"
          fullWidth
          disabled={loading}
          sx={{
            mt: 1,
            py: 1.5,
            borderRadius: 3,
            fontWeight: 700,
            fontSize: '1rem',
            background: loading
              ? undefined
              : 'linear-gradient(135deg, #cb3cff 0%, #7f25fb 100%)',
            boxShadow: '0 8px 24px rgba(203, 60, 255, 0.3)',
            '&:hover': {
              background: 'linear-gradient(135deg, #d854ff 0%, #8d3ffb 100%)',
              boxShadow: '0 12px 32px rgba(203, 60, 255, 0.5)',
              transform: 'translateY(-1px)',
            },
            transition: 'all 0.25s ease',
          }}
        >
          {loading ? 'Memverifikasi...' : 'Masuk Sekarang'}
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
        Belum punya akun?{' '}
        <Link
          href={paths.signup}
          fontWeight={700}
          sx={{ color: '#cb3cff', textDecorationColor: 'rgba(203,60,255,0.4)', '&:hover': { color: '#d854ff' } }}
        >
          Daftar Gratis →
        </Link>
      </Typography>
    </>
  );
};

export default SignIn;
