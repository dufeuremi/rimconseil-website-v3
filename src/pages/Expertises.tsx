import { useState, useEffect } from 'react';
import styled from 'styled-components';
import PageContainer from '../components/PageContainer';
import procederIllu from '../assets/proceder.svg';
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
  margin: 0 auto 6rem;
  text-align: center;
`;

const IntroTitle = styled.h2`
  font-family: var(--font-secondary);
  font-size: 2rem;
  color: var(--color-secondary);
  margin-bottom: 1.5rem;
`;

const IntroText = styled.p`
  color: var(--color-text);
  font-size: 1.125rem;
  line-height: 1.8;
`;

const IllustrationContainer = styled.div`
  max-width: 800px;
  margin: 0 auto 6rem;
  border-radius: var(--border-radius);
  overflow: hidden;
  
  img {
    width: 100%;
    height: auto;
    display: block;
  }
`;

const DomainsTitle = styled.h2`
  font-family: var(--font-secondary);
  font-size: 2.5rem;
  color: var(--color-primary);
  margin-bottom: 4rem;
  text-align: center;
`;

const ExpertiseList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6rem;
  margin-bottom: 4rem;
`;

const ExpertiseItem = styled.div<{ $isReversed: boolean }>`
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

const ItemTitle = styled.h3`
  font-family: var(--font-secondary);
  font-size: 1.75rem;
  color: var(--color-secondary);
  margin-bottom: 1.5rem;
`;

const ItemText = styled.div`
  color: var(--color-text);
  line-height: 1.7;
  font-size: 1rem;
  white-space: pre-line;
`;

const defaultExpertisesData = {
  pageTitle: "Nos savoir-faire",
  intro: {
    title: "Notre approche",
    text: "Les technologies sont des moyens, des facilitateurs et des déclencheurs de transformations et de puissants leviers de développement et d'innovations. Elles nécessitent d'être analysées à l'aune de vos enjeux et de votre stratégie afin d'être pleinement appropriée. Leur adoption et leur intégration doivent se faire dans un cadre d'architecture permettant de maîtriser les impacts techniques, organisationnels, humains et financiers."
  },
  domainsTitle: "Nos domaines d'expertise",
  items: [
    {
      id: "1",
      title: "Stratégie IT",
      content: "Alignement de vos stratégies IT (DATA, ERP, ...) avec les perspectives d'évolutions de l'activité de votre structure et de son écosystème. Nous analysons votre contexte métier pour garantir que vos systèmes d'information soutiennent efficacement vos objectifs stratégiques et votre croissance.\n\nDéfinition des référentiels structurants et leurs modes de gouvernance. Nous élaborons des cadres de référence solides qui standardisent vos processus IT et établissons des règles claires pour la prise de décision et la gestion des systèmes.\n\nTransformation organisationnelle. Nous vous accompagnons dans la refonte de vos structures organisationnelles pour les adapter aux nouveaux enjeux digitaux, en tenant compte de l'aspect humain et des résistances au changement."
    },
    {
      id: "2",
      title: "Architecture IT",
      content: "Architecture d'entreprise, applicative et de données. Nous concevons des architectures robustes qui alignent systèmes informatiques, processus métiers et stratégie globale, garantissant cohérence et performance de votre écosystème IT.\n\nOnprem / Cloud / Hybrid. Nous vous guidons dans le choix et l'implémentation de solutions adaptées à vos besoins, qu'elles soient sur site, dans le cloud ou hybrides, en tenant compte des contraintes de sécurité, performance et coût.\n\nMove to Cloud. Nous orchestrons votre migration vers le cloud en minimisant les risques et perturbations, tout en maximisant les bénéfices liés à la flexibilité, l'évolutivité et l'optimisation des coûts."
    },
    {
      id: "3",
      title: "Analyse de donnée",
      content: "Audit applicatif. Nous évaluons en profondeur vos applications existantes pour identifier les forces, faiblesses et opportunités d'amélioration, vous aidant à prendre des décisions éclairées sur l'évolution de votre patrimoine applicatif.\n\nAnalyse des flux. Nous cartographions et optimisons les flux de données entre vos systèmes pour éliminer les redondances, réduire les latences et améliorer la fiabilité de vos échanges d'information.\n\nDéfinition de Référentiel MDM. Nous établissons une gestion centralisée de vos données de référence (Master Data Management) pour garantir leur unicité, cohérence et fiabilité à travers tous vos systèmes.\n\nModélisation Data. Nous concevons des modèles de données adaptés à vos besoins métiers, facilitant l'exploitation et l'analyse de vos données, tout en préparant le terrain pour l'intelligence artificielle et le machine learning.\n\nAnalyse des Pain Points. Nous identifions et adressons les points de friction dans vos processus et systèmes pour améliorer l'expérience utilisateur et l'efficacité opérationnelle."
    }
  ]
};

export default function Expertises() {
  const [data, setData] = useState(defaultExpertisesData);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const record = await pb.collection('pages').getFirstListItem('url="expertises"');
        if (record && record.content) {
          setData(typeof record.content === 'string' ? JSON.parse(record.content) : record.content);
        }
      } catch (err) {
        console.error("Error fetching expertises data:", err);
      }
    };
    fetchData();
  }, []);

  return (
    <PageContainer>
      <PageTitle>{data.pageTitle}</PageTitle>

      <IntroSection>
        <IntroTitle>{data.intro.title}</IntroTitle>
        <IntroText>{data.intro.text}</IntroText>
      </IntroSection>

      <IllustrationContainer>
        <img src={procederIllu} alt="Illustration Procéder" />
      </IllustrationContainer>

      <DomainsTitle>{data.domainsTitle}</DomainsTitle>

      <ExpertiseList>
        {data.items.map((item, index) => (
          <ExpertiseItem key={index} $isReversed={index % 2 !== 0}>
            <NumberBox>{item.id}</NumberBox>
            <ContentBox $isReversed={index % 2 !== 0}>
              <ItemTitle>{item.title}</ItemTitle>
              <ItemText>{item.content}</ItemText>
            </ContentBox>
          </ExpertiseItem>
        ))}
      </ExpertiseList>
    </PageContainer>
  );
}
