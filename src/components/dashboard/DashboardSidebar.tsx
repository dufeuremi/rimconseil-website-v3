import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Warning } from '@phosphor-icons/react';
import pb from '../../lib/pocketbase';
import logoSrc from '../../assets/logo.svg';

const SidebarContainer = styled.div<{ isOpen: boolean }>`
  width: ${props => props.isOpen ? '260px' : '80px'};
  background: white;
  height: 100vh;
  border-right: 1px solid var(--color-quaternary);
  display: flex;
  flex-direction: column;
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 50;
  flex-shrink: 0;
`;

const LogoSection = styled.div<{ isOpen: boolean }>`
  padding: ${props => props.isOpen ? '0 1.5rem' : '0'};
  display: flex;
  align-items: center;
  justify-content: ${props => props.isOpen ? 'space-between' : 'center'};
  height: 80px;
  border-bottom: 1px solid var(--color-quaternary);
`;

const Logo = styled.img<{ isOpen: boolean }>`
  height: 28px;
  display: ${props => props.isOpen ? 'block' : 'none'};
`;

const ToggleButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-text-light);
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s;
  
  &:hover {
    color: var(--color-primary);
  }
`;

const Nav = styled.nav`
  flex: 1;
  padding: 0;
  display: flex;
  flex-direction: column;
  margin-top: 1rem;
`;

const NavItem = styled(NavLink) <{ isOpen: boolean }>`
  display: flex;
  align-items: center;
  padding: 1rem 1.5rem;
  text-decoration: none;
  color: var(--color-text-light);
  transition: all 0.2s ease;
  font-weight: 500;
  justify-content: ${props => props.isOpen ? 'flex-start' : 'center'};
  white-space: nowrap;
  overflow: hidden;
  position: relative;
  font-size: 0.95rem;

  &:hover {
    color: var(--color-primary);
    background-color: #f8fafc;
  }

  &.active {
    color: var(--color-primary);
    background-color: rgba(var(--color-primary-rgb), 0.05);
    
    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 3px;
      background-color: var(--color-primary);
    }
  }

  svg {
    width: 20px;
    height: 20px;
    margin-right: ${props => props.isOpen ? '16px' : '0'};
    flex-shrink: 0;
    transition: margin 0.3s;
  }
`;

const Footer = styled.div`
  padding: 1rem 0;
  border-top: 1px solid var(--color-quaternary);
`;

const LogoutButton = styled.button<{ isOpen: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: ${props => props.isOpen ? 'flex-start' : 'center'};
  background: none;
  border: none;
  padding: 1rem 1.5rem;
  color: var(--color-text-light);
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
  white-space: nowrap;
  overflow: hidden;
  font-size: 0.95rem;

  &:hover {
    color: #e53e3e;
    background-color: #fff5f5;
  }

  svg {
    width: 20px;
    height: 20px;
    margin-right: ${props => props.isOpen ? '16px' : '0'};
    flex-shrink: 0;
  }
`;

const HomeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const PageIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const ArticleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
  </svg>
);

const NewsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
  </svg>
);

const LogoutIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
);

const MenuIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ width: 20, height: 20, margin: 0 }}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

export default function DashboardSidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();

  const [isOutageModalOpen, setIsOutageModalOpen] = useState(false);
  const [outageMessage, setOutageMessage] = useState('');
  const [isSendingOutage, setIsSendingOutage] = useState(false);

  const handleLogout = () => {
    pb.authStore.clear();
    navigate('/connexion');
  };

  const handleReportOutage = async () => {
    if (!outageMessage.trim()) return;
    setIsSendingOutage(true);

    try {
      const htmlBody = `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #334155; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);">
          <div style="background-color: #ef4444; padding: 30px 20px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 600;">ALERTE PANNE</h1>
            <p style="color: #fee2e2; margin: 10px 0 0 0; font-size: 14px;">Signalement depuis le Dashboard RIM Conseil</p>
          </div>
          
          <div style="padding: 30px;">
            <div style="background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 20px; border-radius: 4px; margin-bottom: 20px;">
              <p style="margin: 0; font-size: 16px; color: #991b1b; font-weight: 600;">Une panne a été signalée par un administrateur.</p>
              <p style="margin: 10px 0 0 0; color: #b91c1c;">Merci d'intervenir rapidement.</p>
            </div>

            <div style="margin-bottom: 20px;">
              <p style="margin: 0; font-size: 12px; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600;">Message de l'utilisateur</p>
              <div style="margin: 5px 0 0 0; font-size: 15px; color: #0f172a; background: #fff; padding: 10px; border: 1px solid #e2e8f0; border-radius: 4px;">
                ${outageMessage.replace(/\n/g, '<br>')}
              </div>
            </div>

            <div style="margin-bottom: 20px;">
              <p style="margin: 0; font-size: 12px; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600;">Date du signalement</p>
              <p style="margin: 5px 0 0 0; font-size: 16px; color: #0f172a;">${new Date().toLocaleString('fr-FR')}</p>
            </div>
            
            <div>
               <p style="margin: 0; font-size: 12px; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600;">Utilisateur</p>
               <p style="margin: 5px 0 0 0; font-size: 14px; color: #0f172a;">${pb.authStore.model?.email || 'Inconnu'}</p>
            </div>
          </div>

          <div style="background-color: #f8fafc; padding: 15px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0;">
            Système d'alerte RIM Conseil
          </div>
        </div>
      `;

      await fetch('https://host.taskalys.app/webhook/rimconseil2', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          html: htmlBody,
          subject: `ALERTE PANNE - Dashboard RIM Conseil`,
          type: 'outage_report',
          date: new Date().toISOString(),
          user: pb.authStore.model?.email,
          message: outageMessage
        }),
      });

      alert("Signalement de panne envoyé avec succès.");
      setIsOutageModalOpen(false);
      setOutageMessage('');
    } catch (err) {
      console.error("Erreur signalement panne:", err);
      alert("Erreur lors de l'envoi du signalement.");
    } finally {
      setIsSendingOutage(false);
    }
  };

  return (
    <>
      <SidebarContainer isOpen={isOpen}>
        <LogoSection isOpen={isOpen}>
          <Logo src={logoSrc} alt="Logo" isOpen={isOpen} />
          <ToggleButton onClick={() => setIsOpen(!isOpen)}>
            <MenuIcon />
          </ToggleButton>
        </LogoSection>

        <Nav>
          <NavItem to="/dashboard/pages" isOpen={isOpen}>
            <PageIcon />
            {isOpen && <span>Édition Pages</span>}
          </NavItem>
          <NavItem to="/dashboard/articles" isOpen={isOpen}>
            <ArticleIcon />
            {isOpen && <span>Édition Articles</span>}
          </NavItem>
          <NavItem to="/dashboard/actualites" isOpen={isOpen}>
            <NewsIcon />
            {isOpen && <span>Édition Actualités</span>}
          </NavItem>
        </Nav>

        <Footer>
          <LogoutButton onClick={() => setIsOutageModalOpen(true)} isOpen={isOpen} style={{ color: '#ef4444', marginBottom: '0.5rem' }} title="Signaler une panne">
            <Warning size={20} weight="fill" />
            {isOpen && <span>Signaler une panne</span>}
          </LogoutButton>

          <NavItem as="a" href="/" target="_blank" isOpen={isOpen} style={{ marginBottom: '0.5rem' }}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            {isOpen && <span>Voir le site</span>}
          </NavItem>
          <LogoutButton onClick={handleLogout} isOpen={isOpen}>
            <LogoutIcon />
            {isOpen && <span>Se déconnecter</span>}
          </LogoutButton>
        </Footer>
      </SidebarContainer>

      {isOutageModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }} onClick={() => setIsOutageModalOpen(false)}>
          <div style={{
            background: 'white',
            padding: '2rem',
            borderRadius: '8px',
            width: '90%',
            maxWidth: '500px',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
          }} onClick={e => e.stopPropagation()}>
            <h3 style={{ marginTop: 0, color: '#ef4444', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Warning size={24} weight="fill" />
              Signaler une panne
            </h3>
            <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>
              Décrivez le problème rencontré. Une alerte sera envoyée immédiatement à l'équipe technique.
            </p>
            <textarea
              value={outageMessage}
              onChange={e => setOutageMessage(e.target.value)}
              placeholder="Décrivez la panne ici..."
              style={{
                width: '100%',
                minHeight: '120px',
                padding: '0.75rem',
                border: '1px solid #e2e8f0',
                borderRadius: '4px',
                marginBottom: '1.5rem',
                fontFamily: 'inherit',
                resize: 'vertical'
              }}
              autoFocus
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
              <button
                onClick={() => setIsOutageModalOpen(false)}
                style={{
                  padding: '0.5rem 1rem',
                  background: 'transparent',
                  border: '1px solid #e2e8f0',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: 500
                }}
              >
                Annuler
              </button>
              <button
                onClick={handleReportOutage}
                disabled={!outageMessage.trim() || isSendingOutage}
                style={{
                  padding: '0.5rem 1rem',
                  background: '#ef4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: 500,
                  opacity: (!outageMessage.trim() || isSendingOutage) ? 0.7 : 1
                }}
              >
                {isSendingOutage ? 'Envoi...' : 'Envoyer l\'alerte'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
