import { useState, useEffect } from 'react';
import styled from 'styled-components';
import PageContainer from '../components/PageContainer';
import franceMap from '../assets/france_map.svg';
import heroBg from '../assets/background.png';
import pb from '../lib/pocketbase';

const PageTitle = styled.h1`
  font-family: var(--font-secondary);
  font-size: 3rem;
  color: var(--color-primary);
  margin-bottom: 3rem;
  text-align: center;
`;

const IntroSection = styled.div`
  max-width: 900px;
  margin: 0 auto 4rem;
  text-align: center;
`;



const IntroText = styled.p`
  color: var(--color-text);
  font-size: 1.125rem;
  line-height: 1.8;
`;



const StepsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6rem;
  margin-bottom: 6rem;
`;

const StepItem = styled.div<{ $isReversed: boolean }>`
  display: flex;
  align-items: flex-start;
  gap: 4rem;
  flex-direction: ${props => props.$isReversed ? 'row-reverse' : 'row'};

  @media (max-width: 900px) {
    flex-direction: column;
    gap: 2rem;
  }
`;

const NumberBox = styled.div`
  font-family: var(--font-secondary);
  font-size: 6rem;
  font-weight: 700;
  color: var(--color-primary-light);
  line-height: 1;
  flex-shrink: 0;
  width: 150px;
  text-align: center;
  opacity: 0.8;
  
  @media (max-width: 900px) {
    width: 100%;
    text-align: left;
    font-size: 4rem;
    margin-bottom: -1rem;
  }
`;

const ContentBox = styled.div<{ $isReversed: boolean }>`
  flex: 1;
  background: #f8f9fa;
  padding: 3rem;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--color-quaternary);
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    ${props => props.$isReversed ? 'right: 0;' : 'left: 0;'}
    width: 4px;
    height: 100%;
    background: var(--color-primary);
    border-radius: ${props => props.$isReversed ? '0 4px 4px 0' : '4px 0 0 4px'};
  }
`;

const StepTitle = styled.h3`
  font-family: var(--font-secondary);
  font-size: 1.75rem;
  color: var(--color-secondary);
  margin-bottom: 1.5rem;
`;

const StepText = styled.div`
  color: var(--color-text);
  line-height: 1.7;
  font-size: 1rem;
  white-space: pre-line;
`;



const ZoneSection = styled.div`
  position: relative;
  overflow: hidden;
  color: white;
  padding: 4rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: url(${heroBg});
    background-size: cover;
    background-position: center;
    filter: blur(20px) brightness(0.6);
    z-index: 0;
    transform: scale(1.1); /* Prevent blur edges from showing */
  }

  & > * {
    position: relative;
    z-index: 1;
  }
`;

const ZoneTitle = styled.h2`
  font-family: var(--font-secondary);
  font-size: 2rem;
  margin: 0;
  color: white;
`;

const ZoneText = styled.p`
  font-size: 1.125rem;
  line-height: 1.6;
  max-width: 800px;
  color: white;
  opacity: 0.9;
`;

const MapImage = styled.img`
  height: 400px;
  width: auto;
  margin-bottom: 1rem;
  filter: brightness(0) invert(1);
  opacity: 0.7;
`;

const ZoneContent = styled.div`
  position: relative;
  z-index: 1;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
`;

const defaultServicesData = {
  pageTitle: "Comment allons-nous procéder ?",
  intro: {
    text: "Les technologies sont des moyens, des facilitateurs et des déclencheurs de transformations et de puissants leviers de développement et d'innovations. Elles nécessitent d'être analysées à l'aune de vos enjeux et de votre stratégie afin d'être pleinement appropriée. Leur adoption et leur intégration doivent se faire dans un cadre d'architecture permettant de maîtriser les impacts techniques, organisationnels, humains et financiers."
  },

  steps: [
    {
      id: "1",
      title: "Cadrage du projet et du besoin",
      content: "Cadrage des objectifs et du périmètre du projet. Identification résultats attendus du changement. Choix des parties prenantes du projet. Budget prévisionnel du projet. Planification du projet."
    },
    {
      id: "2",
      title: "Vision globale et état des lieux du SI",
      content: "Etat des lieux de l'architecture SI et audit du SI et les applicatifs DATA existants. Stratégie et culture actuelle du SI. Diagnostic et audit organisationnel de la DSI. Diagnostic organisationnel, des processus et des méthodes. Evaluation de la dette SI."
    },
    {
      id: "3",
      title: "Evolution du SI Projet cible",
      content: "Définition du projet cible DATA/ BI (Stratégie, Métier, Applicatif et Infrastructures IT). Accompagnement à l'expression des besoins utilisateurs. Accompagnement à l'évolution des usages, processus et des pratiques. Choix et mise en place d'outils « référentiels d'architecture » et les standards de modélisation. Accompagnement au changement."
    },
    {
      id: "4",
      title: "Plan de transformation SI",
      content: "Définition de la trajectoire et de la feuille de route (étapes, livrables, ressources, Planning, Budget). Mise en place des indicateurs de pilotage de la transformation. Pilotage des risques liés à la transformation. Mise en place de la gouvernance. Maîtrise du Run."
    }
  ],
  zone: {
    title: "Zone d'intervention",
    text: "RIM Conseil intervient sur l'ensemble du territoire français et au Maroc. Nous proposons nos services de conseil en systèmes d'information aux entreprises et organismes publics dans ces zones géographiques."
  }
};

export default function Services() {
  const [data, setData] = useState(defaultServicesData);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const record = await pb.collection('pages').getFirstListItem('url="services"');
        if (record && record.content) {
          setData(typeof record.content === 'string' ? JSON.parse(record.content) : record.content);
        }
      } catch (err) {
        console.error("Error fetching services data:", err);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <PageContainer>
        <PageTitle>{data.pageTitle}</PageTitle>

        <IntroSection>
          <IntroText>{data.intro.text}</IntroText>
        </IntroSection>



        <StepsList>
          {data.steps.map((step, index) => (
            <StepItem key={index} $isReversed={index % 2 !== 0}>
              <NumberBox>{step.id}</NumberBox>
              <ContentBox $isReversed={index % 2 !== 0}>
                <StepTitle>{step.title}</StepTitle>
                <StepText>{step.content}</StepText>
              </ContentBox>
            </StepItem>
          ))}
        </StepsList>
      </PageContainer>

      <ZoneSection>
        <ZoneContent>
          <MapImage src={franceMap} alt="France Map" />
          <ZoneTitle>{data.zone.title}</ZoneTitle>
          <ZoneText>{data.zone.text}</ZoneText>
        </ZoneContent>
      </ZoneSection>
    </>
  );
}
