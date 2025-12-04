import styled from 'styled-components';
import PageContainer from '../components/PageContainer';
import { Bank, ShoppingCart, Buildings, Factory, Briefcase } from '@phosphor-icons/react';

const PageTitle = styled.h1`
  font-family: var(--font-secondary);
  font-size: 3rem;
  color: var(--color-primary);
  margin-bottom: 1rem;
  text-align: center;
`;

const PageSubtitle = styled.p`
  text-align: center;
  max-width: 800px;
  margin: 0 auto 4rem;
  font-size: 1.125rem;
  color: var(--color-text-light);
  line-height: 1.6;
`;

const SectorsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 4rem;
`;

const SectorCard = styled.div`
  position: relative;
  height: 250px;
  border-radius: var(--border-radius);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  transition: transform 0.3s ease;
  cursor: default;

  &:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-md);
  }
`;

const SectorBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: var(--color-secondary);
  /* Placeholder gradient */
  background-image: linear-gradient(135deg, var(--color-secondary) 0%, var(--color-tertiary) 100%);
  z-index: 1;
`;

const SectorContent = styled.div`
  position: relative;
  z-index: 2;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;
  color: white;
  gap: 1rem;
`;

const IconWrapper = styled.div`
  font-size: 3rem;
  opacity: 0.9;
`;

const SectorTitle = styled.h3`
  font-family: var(--font-secondary);
  font-size: 1.5rem;
  margin: 0;
  font-weight: 600;
`;

const sectors = [
    {
        icon: <Bank weight="duotone" />,
        title: "Banque & Assurance"
    },
    {
        icon: <ShoppingCart weight="duotone" />,
        title: "Retail & E-commerce"
    },
    {
        icon: <Buildings weight="duotone" />,
        title: "Secteur Public"
    },
    {
        icon: <Factory weight="duotone" />,
        title: "Industrie"
    },
    {
        icon: <Briefcase weight="duotone" />,
        title: "Services"
    }
];

export default function Secteurs() {
    return (
        <PageContainer>
            <PageTitle>Secteurs d'Activité</PageTitle>
            <PageSubtitle>
                Nous intervenons auprès d'acteurs majeurs de différents secteurs, en adaptant nos méthodes à leurs spécificités.
            </PageSubtitle>

            <SectorsGrid>
                {sectors.map((sector, index) => (
                    <SectorCard key={index}>
                        <SectorBackground />
                        <SectorContent>
                            <IconWrapper>{sector.icon}</IconWrapper>
                            <SectorTitle>{sector.title}</SectorTitle>
                        </SectorContent>
                    </SectorCard>
                ))}
            </SectorsGrid>
        </PageContainer>
    );
}
