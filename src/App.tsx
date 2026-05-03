import { useState } from 'react';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import AnalyzePage from './pages/AnalyzePage';
import HistoryPage from './pages/HistoryPage';
import AboutPage from './pages/AboutPage';
import type { AppView } from './types';

export default function App() {
  const [view, setView] = useState<AppView>('home');

  const renderView = () => {
    switch (view) {
      case 'home': return <HomePage onNavigate={setView} />;
      case 'analyze': return <AnalyzePage />;
      case 'history': return <HistoryPage />;
      case 'about': return <AboutPage />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar currentView={view} onNavigate={setView} />
      <main>
        {renderView()}
      </main>
      <footer className="border-t border-gray-800/60 py-8 text-center text-gray-600 text-sm">
        <p>Gorkreal — Digital Image Processing Project &copy; {new Date().getFullYear()}</p>
        <p className="text-xs mt-1 text-gray-700">CNN + Transfer Learning on FaceForensics++</p>
      </footer>
    </div>
  );
}
