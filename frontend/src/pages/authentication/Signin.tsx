import { useState, ChangeEvent, FormEvent } from 'react';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
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
      <Typography align="center" variant="h3" fontWeight={600}>
        Masuk PadiBuy
      </Typography>
      <Typography mt={1} color="text.secondary" align="center">
        Gunakan akun untuk prediksi perilaku belanja impulsif.
      </Typography>

      {error ? (
        <Alert severity="error" sx={{ mt: 3 }}>
          {error}
        </Alert>
      ) : null}

      <Stack onSubmit={handleSubmit} component="form" direction="column" gap={2} mt={3}>
        <TextField
          id="email"
          name="email"
          type="email"
          value={email}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
          variant="filled"
          placeholder="Email"
          autoComplete="email"
          fullWidth
          autoFocus
          required
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
              endAdornment: (
                <InputAdornment position="end" sx={{ opacity: password ? 1 : 0 }}>
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    <IconifyIcon icon={showPassword ? 'ion:eye' : 'ion:eye-off'} />
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />
        <Button type="submit" variant="contained" size="medium" fullWidth disabled={loading}>
          {loading ? 'Memuat...' : 'Masuk'}
        </Button>
        <Typography
          my={3}
          color="text.secondary"
          variant="body2"
          align="center"
          letterSpacing={0.5}
        >
          Belum punya akun?{' '}
          <Link href={paths.signup} fontWeight={600}>
            Daftar
          </Link>
        </Typography>
      </Stack>
    </>
  );
};

export default SignIn;
