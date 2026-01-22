import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/sections/Footer';
import { ComingSoonModal } from '@/components/ComingSoonModal';

export default function DashboardRedirect() {
  const [modalOpen, setModalOpen] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setModalOpen(true);
  }, []);

  const handleModalClose = (open: boolean) => {
    setModalOpen(open);
    if (!open) {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="container mx-auto px-4 py-20 min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
          <p className="text-muted-foreground">Coming soon...</p>
        </div>
      </main>
      <Footer />
      <ComingSoonModal open={modalOpen} onOpenChange={handleModalClose} />
    </div>
  );
}
