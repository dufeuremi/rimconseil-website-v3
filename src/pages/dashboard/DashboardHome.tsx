import styled from 'styled-components';

const Container = styled.div`
  background: white;
  border: 1px solid var(--color-quaternary);
  height: 100%;
`;

const Header = styled.div`
  padding: 1.5rem 2rem;
  border-bottom: 1px solid var(--color-quaternary);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: white;
`;

const Title = styled.h2`
  font-family: var(--font-secondary);
  color: var(--color-primary);
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  letter-spacing: -0.01em;
`;

const Content = styled.div`
  padding: 2rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const StatCard = styled.div`
  padding: 1.5rem;
  border: 1px solid var(--color-quaternary);
  background: #f8fafc;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const StatLabel = styled.span`
  color: var(--color-text-light);
  font-size: 0.875rem;
  font-weight: 500;
`;

const StatValue = styled.span`
  color: var(--color-primary);
  font-size: 2rem;
  font-weight: 700;
  font-family: var(--font-secondary);
`;

export default function DashboardHome() {
    return (
        <Container>
            <Header>
                <Title>Vue d'ensemble</Title>
            </Header>
            <Content>
                <StatCard>
                    <StatLabel>Pages publiées</StatLabel>
                    <StatValue>12</StatValue>
                </StatCard>
                <StatCard>
                    <StatLabel>Articles en ligne</StatLabel>
                    <StatValue>8</StatValue>
                </StatCard>
                <StatCard>
                    <StatLabel>Actualités récentes</StatLabel>
                    <StatValue>3</StatValue>
                </StatCard>
                <StatCard>
                    <StatLabel>Messages non lus</StatLabel>
                    <StatValue>5</StatValue>
                </StatCard>
            </Content>
        </Container>
    );
}
