import { useState, useEffect } from 'react';
import styled from 'styled-components';
import PageContainer from '../components/PageContainer';
import { LinkedinLogo, EnvelopeSimple, Phone } from '@phosphor-icons/react';
import intervenant1 from '../assets/intervenant1.png';
import pb from '../lib/pocketbase';

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

const TeamGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 3rem;
  margin-bottom: 4rem;
`;

const TeamCard = styled.div`
  background: white;
  border-radius: var(--border-radius);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: 1px solid var(--color-quaternary);
  text-align: left;
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-md);
  }
`;

const MemberImage = styled.div`
  height: 250px;
  background-color: var(--color-quaternary);
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: linear-gradient(to bottom, rgba(44, 119, 227, 0.05), rgba(44, 119, 227, 0.1));
  padding: 2rem;
  
  img {
    width: 180px;
    height: 180px;
    object-fit: cover;
    border-radius: 50%;
    box-shadow: var(--shadow-md);
    border: 4px solid white;
  }
`;

const MemberInfo = styled.div`
  padding: 2rem;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const MemberName = styled.h3`
  font-family: var(--font-secondary);
  font-size: 1.5rem;
  color: var(--color-secondary);
  margin-bottom: 0.5rem;
`;

const MemberRole = styled.p`
  color: var(--color-primary);
  font-weight: 600;
  font-size: 1rem;
  margin-bottom: 1.5rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const MemberBio = styled.div`
  color: var(--color-text);
  font-size: 0.95rem;
  line-height: 1.6;
  margin-bottom: 2rem;
  flex: 1;

  p {
    margin-bottom: 1rem;
  }
`;

const ContactInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--color-quaternary);
`;

const ContactItem = styled.a`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: var(--color-text-light);
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.2s;

  &:hover {
    color: var(--color-primary);
  }

  svg {
    color: var(--color-primary);
  }
`;

const defaultTeamData = {
  title: "Notre équipe",
  description: "Rim'conseil évolue avec Jean-Philippe Robin, intervenant au service de votre entreprise et Loubna Berrado-Robin, Consultante en organisation et en transformation numérique.",
  members: [
    {
      name: "Jean-Philippe Robin",
      role: "Consultant en organisation et en transformation numérique",
      bio: [
        "Mes expériences passées, à la fois en tant que consultant et manager d'un Département Data et Digital au sein d'une direction de la transformation, me permettent de savoir bien connecter Business, Data et Digital.",
        "En comprenant le business model de mes clients, leur stratégie, leur organisation et leur écosystème, je suis en mesure de mettre en place des stratégies applicatives qui permettent d'allier ce qu'il est utile de faire avec ce qu'il est possible de faire (humainement et techniquement) et d'accompagner et mobiliser les personnes."
      ],
      email: "info@rimconseil.fr",
      phone: "(FR) 06 11 70 90 16",
      linkedin: "#",
      image: "intervenant1"
    },
    {
      name: "Loubna Berrado-Robin",
      role: "Consultante en organisation et en transformation numérique",
      bio: [
        "Études et méthodologies : analyse des projets et proposition de méthodes d'accompagnement adaptées.",
        "Audit organisationnel et SI : diagnostic des points faibles et des leviers, évaluation des outils et usages SI, analyse des processus métiers.",
        "Transformation numérique : définition du SI cible (stratégie, métier, applicatif), recueil des besoins utilisateurs, modélisation des processus cibles, accompagnement au changement.",
        "Plan de transformation SI : élaboration de la feuille de route, rédaction de cahiers des charges et de spécifications fonctionnelles.",
        "Mise en œuvre de solutions IT : aide au choix des outils, réalisation des plans de tests, accompagnement à la recette et à la formation des utilisateurs."
      ],
      email: "loubna@rimconseil.fr",
      phone: "(FR) 06 01 02 03 04",
      linkedin: "#",
      image: "intervenant1"
    }
  ]
};

const imageMap: Record<string, string> = {
  "intervenant1": intervenant1,
};

export default function Equipe() {
  const [data, setData] = useState(defaultTeamData);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const record = await pb.collection('pages').getFirstListItem('url="equipe"');
        if (record && record.content) {
          setData(typeof record.content === 'string' ? JSON.parse(record.content) : record.content);
        }
      } catch (err) {
        console.error("Error fetching equipe data:", err);
      }
    };
    fetchData();
  }, []);

  return (
    <PageContainer>
      <PageTitle>{data.title}</PageTitle>
      <PageSubtitle>{data.description}</PageSubtitle>

      <TeamGrid>
        {data.members.map((member, index) => (
          <TeamCard key={index}>
            <MemberImage>
              <img src={imageMap[member.image] || member.image} alt={member.name} />
            </MemberImage>
            <MemberInfo>
              <MemberName>{member.name}</MemberName>
              <MemberRole>{member.role}</MemberRole>
              <MemberBio>
                {member.bio.map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </MemberBio>

              <ContactInfo>
                <ContactItem href={`mailto:${member.email}`}>
                  <EnvelopeSimple size={18} weight="fill" />
                  {member.email}
                </ContactItem>
                <ContactItem href={`tel:${member.phone.replace(/[^0-9+]/g, '')}`}>
                  <Phone size={18} weight="fill" />
                  {member.phone}
                </ContactItem>
                <ContactItem href={member.linkedin} target="_blank" rel="noopener noreferrer">
                  <LinkedinLogo size={18} weight="fill" />
                  Linkedin
                </ContactItem>
              </ContactInfo>
            </MemberInfo>
          </TeamCard>
        ))}
      </TeamGrid>
    </PageContainer>
  );
}
