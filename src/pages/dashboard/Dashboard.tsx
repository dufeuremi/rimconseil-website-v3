import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import textureWaves from '../../assets/texturewaves.jpg';
import pb from '../../lib/pocketbase';

const DashboardContainer = styled.div`
  padding: 2rem;
  min-height: 100vh;
  position: relative;
  overflow: hidden;
`;

const Background = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url(${textureWaves});
  background-size: cover;
  background-position: center;
  z-index: -1;
  opacity: 0.08;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--color-quaternary);
`;

const Title = styled.h1`
  font-family: var(--font-secondary);
  color: var(--color-primary);
  margin: 0;
`;

const Content = styled.div`
  background: white;
  padding: 2rem;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--color-quaternary);
  text-align: center;
  color: var(--color-text-light);
`;

export default function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    pb.authStore.clear();
    navigate('/connexion');
  };

  return (
    <DashboardContainer>
      <Background />
      <Header>
        <Title>Espace Admin</Title>
        <Button variant="outline" onClick={handleLogout}>Déconnexion</Button>
      </Header>
      <Content>
        <h2>Bienvenue dans votre espace d'administration</h2>
        <p>Sélectionnez une rubrique dans le menu (à venir) pour gérer votre contenu.</p>
      </Content>
    </DashboardContainer>
  );
}
