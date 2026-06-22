import { PropsWithChildren } from 'react';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { isAuthenticated } from 'auth/auth';
import paths from 'routes/paths';

const RequireAuth = ({ children }: PropsWithChildren) => {
  if (isAuthenticated()) {
    return <>{children}</>;
  }

  return (
    <Card>
      <CardContent>
        <Stack spacing={2}>
          <Typography variant="h5" fontWeight={700}>
            Login Required
          </Typography>
          <Alert severity="warning">Silakan masuk untuk mengakses halaman ini.</Alert>
          <Button variant="contained" href={paths.signin}>
            Masuk
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default RequireAuth;
