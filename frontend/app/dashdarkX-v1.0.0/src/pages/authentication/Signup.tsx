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
      setSuccess('Akun berhasil dibuat. Silakan masuk.');
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
      <Typography align="center" variant="h3" fontWeight={600}>
        Daftar PadiBuy
      </Typography>
      <Typography mt={1} color="text.secondary" align="center">
        Buat akun untuk menyimpan hasil prediksi.
      </Typography>

      {error ? (
        <Alert severity="error" sx={{ mt: 3 }}>
          {error}
        </Alert>
      ) : null}

      {success ? (
        <Alert severity="success" sx={{ mt: 3 }}>
          {success}
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
        />
        <Button type="submit" variant="contained" size="medium" fullWidth>
          Daftar
        </Button>
        <Typography
          my={3}
          color="text.secondary"
          variant="body2"
          align="center"
          letterSpacing={0.5}
        >
          Sudah punya akun?{' '}
          <Link href={paths.signin} fontWeight={600}>
            Masuk
          </Link>
        </Typography>
      </Stack>
    </>
  );
};

export default Signup;
