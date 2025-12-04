import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import Layout from './components/Layout';
import RequireAuth from './components/RequireAuth';
import DashboardLayout from './components/dashboard/DashboardLayout';
import Home from './pages/Home';
import Expertises from './pages/Expertises';
import Services from './pages/Services';
import Secteurs from './pages/Secteurs';
import Valeurs from './pages/Valeurs';
import Equipe from './pages/Equipe';
import Reseau from './pages/Reseau';
import Actualites from './pages/Actualites';
import ActualiteDetail from './pages/ActualiteDetail';
import Articles from './pages/Articles';
import ArticleDetail from './pages/ArticleDetail';
import Contact from './pages/Contact';
import RendezVous from './pages/RendezVous';
import Connexion from './pages/Connexion';
import MentionsLegales from './pages/MentionsLegales';
import PolitiqueConfidentialite from './pages/PolitiqueConfidentialite';
import Maintenance from './pages/Maintenance';
import NotFound from './pages/NotFound';
import DashboardHome from './pages/dashboard/DashboardHome';
import DashboardPages from './pages/dashboard/DashboardPages';
import DashboardArticles from './pages/dashboard/DashboardArticles';
import DashboardActus from './pages/dashboard/DashboardActus';
import DashboardExpertises from './pages/dashboard/DashboardExpertises';
import DashboardServices from './pages/dashboard/DashboardServices';
import DashboardMessages from './pages/dashboard/DashboardMessages';

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Admin Interface */}
        <Route path="/connexion" element={<Connexion />} />

        <Route path="/dashboard" element={
          <RequireAuth>
            <DashboardLayout />
          </RequireAuth>
        }>
          <Route index element={<Navigate to="/dashboard/pages" replace />} />
          <Route path="home" element={<DashboardHome />} />
          <Route path="pages" element={<DashboardPages />} />
          <Route path="articles" element={<DashboardArticles />} />
          <Route path="actualites" element={<DashboardActus />} />
          <Route path="expertises" element={<DashboardExpertises />} />
          <Route path="services" element={<DashboardServices />} />
          <Route path="messages" element={<DashboardMessages />} />
        </Route>

        {/* Public Website with Layout */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/expertises" element={<Expertises />} />
          <Route path="/services" element={<Services />} />
          <Route path="/secteurs" element={<Secteurs />} />
          <Route path="/valeurs" element={<Valeurs />} />
          <Route path="/equipe" element={<Equipe />} />
          <Route path="/reseau" element={<Reseau />} />
          <Route path="/actualites" element={<Actualites />} />
          <Route path="/actualites/:id" element={<ActualiteDetail />} />
          <Route path="/articles" element={<Articles />} />
          <Route path="/articles/:id" element={<ArticleDetail />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/rendez-vous" element={<RendezVous />} />
          <Route path="/mentions-legales" element={<MentionsLegales />} />
          <Route path="/politique-confidentialite" element={<PolitiqueConfidentialite />} />
          <Route path="/maintenance" element={<Maintenance />} />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
