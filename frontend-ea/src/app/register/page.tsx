// src/app/register/page.tsx
import Register from '@/components/auth/Register';
import ClientWrapper from '../../components/ClientWrapper';

export default function RegisterPage() {
  return (
    <ClientWrapper>
      <Register />
    </ClientWrapper>
  );
}