// src/app/page.tsx
import { redirect } from 'next/navigation';
import ClientWrapper from '../components/ClientWrapper';

export default function Home() {
  return (
    <ClientWrapper>
      {redirect('/login')}
    </ClientWrapper>
  );
}