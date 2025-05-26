// src/app/login/page.tsx
import Login from '../../components/auth/Login';
import ClientWrapper from '../../components/ClientWrapper';

export default function LoginPage() {
  return (
    <ClientWrapper>
      <Login />
    </ClientWrapper>
  );
}