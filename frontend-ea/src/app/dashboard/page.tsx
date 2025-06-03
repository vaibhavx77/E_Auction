// src/app/dashboard/page.tsx
import ClientWrapper from '../../components/ClientWrapper';

export default function Dashboard() {
  return (
    <ClientWrapper>
      <div className="p-4">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p>Welcome to the EP E-Auction Platform Dashboard!</p>
      </div>
    </ClientWrapper>
  );
}