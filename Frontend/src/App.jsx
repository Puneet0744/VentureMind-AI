import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import IdeaGeneratorDashboard from './pages/IdeaGeneratorDashboard';
import IdeaValidatorDashboard from './pages/IdeaValidatorDashboard';

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/generate" element={<IdeaGeneratorDashboard />} />
        <Route path="/validate" element={<IdeaValidatorDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

