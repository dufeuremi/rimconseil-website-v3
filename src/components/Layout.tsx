import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import PageContainer from './PageContainer';
import textureWaves from '../assets/texturewaves.jpg';

const LayoutContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
`;

const Background = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url(${textureWaves});
  background-size: cover;
  background-position: center;
  z-index: -1;
  opacity: 0.08; /* Slightly increased opacity */
`;

const MainContent = styled.main`
  flex: 1;
  /* Add padding top to account for fixed header if needed, 
     but spec says header is transparent/overlay on home. 
     For other pages we might need padding. 
     Let's handle this dynamically or just let content flow under for now 
     and handle spacing in specific pages if needed. 
     Actually, standard practice for fixed header is to add padding to body or main.
     But for Home it's transparent.
  */
  padding-top: 0; 
  padding-bottom: 4rem; /* Ensure spacing before footer */
`;

export default function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <LayoutContainer>
      <Background />
      <Header onMenuClick={() => setIsSidebarOpen(true)} />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <MainContent>
        {isHome ? (
          <Outlet />
        ) : (
          <PageContainer>
            <Outlet />
          </PageContainer>
        )}
      </MainContent>

      <Footer />
    </LayoutContainer>
  );
}
