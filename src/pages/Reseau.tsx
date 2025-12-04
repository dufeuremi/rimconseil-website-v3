import styled from 'styled-components';
import PageContainer from '../components/PageContainer';

import bevoak from '../assets/partenaires/bevoak.png';
import blocnet from '../assets/partenaires/blocnet.png';
import colibee from '../assets/partenaires/colibee.png';
import parteam from '../assets/partenaires/parteam.avif';
import polynom from '../assets/partenaires/polynom.png';
import excelcio from '../assets/partenaires/excelcio.png';
import client1 from '../assets/partenaires/client1.png';
import client2 from '../assets/partenaires/client2.png';

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

const PartnersSection = styled.div`
  margin-top: 4rem;
  text-align: center;
`;

const PartnersTitle = styled.h2`
  font-family: var(--font-secondary);
  font-size: 2rem;
  color: var(--color-secondary);
  margin-bottom: 3rem;
`;

const LogosGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 4rem;
  align-items: center;
`;

const PartnerLogo = styled.img`
  max-height: 80px;
  max-width: 200px;
  object-fit: contain;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

export default function Reseau() {
  return (
    <PageContainer>
      <PageTitle>Notre Réseau</PageTitle>
      <PageSubtitle>
        Nous collaborons avec un écosystème de partenaires de confiance pour vous apporter les meilleures solutions.
      </PageSubtitle>

      <PartnersSection>
        <PartnersTitle>Nos partenaires</PartnersTitle>
        <LogosGrid>
          <PartnerLogo src={bevoak} alt="Bevoak" />
          <PartnerLogo src={blocnet} alt="Blocnet" />
          <PartnerLogo src={colibee} alt="Colibee" />
          <PartnerLogo src={parteam} alt="Parteam" />
          <PartnerLogo src={polynom} alt="Polynom" />
          <PartnerLogo src={excelcio} alt="Excelcio" />
        </LogosGrid>
      </PartnersSection>

      <PartnersSection>
        <PartnersTitle>Ils nous font confiance</PartnersTitle>
        <LogosGrid>
          <PartnerLogo src={client1} alt="Client 1" />
          <PartnerLogo src={client2} alt="Client 2" />
        </LogosGrid>
      </PartnersSection>
    </PageContainer>
  );
}
