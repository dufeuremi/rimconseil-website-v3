import { useState, useEffect } from 'react';
import styled from 'styled-components';
import PageContainer from '../components/PageContainer';
import { UsersThree, Leaf, Lightbulb } from '@phosphor-icons/react';
import pb from '../lib/pocketbase';

import socialImg from '../assets/images/social.jpg';
import agileImg from '../assets/images/agile.jpg';
import ecologiqueImg from '../assets/images/ecologique.jpg';

const imageMap: Record<string, string> = {
  "Valeurs Sociales": socialImg,
  "Valeurs écologiques": ecologiqueImg,
  "Innovation et pratiques agiles": agileImg
};

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

const ValuesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 3rem;
  margin-bottom: 4rem;
`;

const ValueCard = styled.div`
  background: white;
  border-radius: var(--border-radius);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--color-quaternary);
  display: flex;
  flex-direction: column;
  height: 100%;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-md);
  }
`;

const ImageContainer = styled.div`
  height: 240px;
  background-color: var(--color-quaternary);
  position: relative;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const CardContent = styled.div`
  padding: 2rem;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const IconBox = styled.div`
  width: 48px;
  height: 48px;
  background-color: rgba(44, 119, 227, 0.1);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-primary);
  flex-shrink: 0;
`;

const CardTitle = styled.h3`
  font-family: var(--font-secondary);
  font-size: 1.5rem;
  color: var(--color-secondary);
  margin: 0;
  line-height: 1.2;
`;

const CardDescription = styled.div`
  color: var(--color-text);
  font-size: 0.95rem;
  line-height: 1.6;
  
  p {
    margin-bottom: 0.5rem;
  }
`;

const defaultValuesData = {
  title: "Nos valeurs",
  description: "L'objectif, c'est de fournir du conseil pour des solutions IT responsables qui allient :",
  items: [
    {
      title: "Valeurs Sociales",
      icon: "UsersThree",
      image: "https://placehold.co/600x400?text=Valeurs+Sociales",
      content: "Placer l'humain au cœur du processus de transformation : (écoute, implication, co-construction, acteurs du changement). Protéger des données individuelles."
    },
    {
      title: "Valeurs écologiques",
      icon: "Leaf",
      image: "https://placehold.co/600x400?text=Valeurs+Ecologiques",
      content: "Infrastructures et équipements responsables (longévité, réparabilité, évolutivité). Gestion sobre des données (collecte optimisée, conservation raisonnée). Optimisation des flux pour réduire l'empreinte énergétique. Conformité réglementaire sur la durée de vie des données."
    },
    {
      title: "Innovation et pratiques agiles",
      icon: "Lightbulb",
      image: "https://placehold.co/600x400?text=Innovation",
      content: "Des architectures IT évolutives. Approches Data centric. Approches agiles et collaboratives."
    }
  ]
};

const iconMap: Record<string, React.ElementType> = {
  "UsersThree": UsersThree,
  "Leaf": Leaf,
  "Lightbulb": Lightbulb
};

export default function Valeurs() {
  const [data, setData] = useState(defaultValuesData);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const record = await pb.collection('pages').getFirstListItem('url="valeurs"');
        if (record && record.content) {
          setData(typeof record.content === 'string' ? JSON.parse(record.content) : record.content);
        }
      } catch (err) {
        console.error("Error fetching valeurs data:", err);
      }
    };
    fetchData();
  }, []);

  return (
    <PageContainer>
      <PageTitle>{data.title}</PageTitle>
      <PageSubtitle>{data.description}</PageSubtitle>

      <ValuesGrid>
        {data.items.map((value, index) => {
          const Icon = iconMap[value.icon as string] || Lightbulb;
          const imageSrc = imageMap[value.title] || value.image;
          return (
            <ValueCard key={index}>
              <ImageContainer>
                <img src={imageSrc} alt={value.title} />
              </ImageContainer>
              <CardContent>
                <CardHeader>
                  <IconBox><Icon size={28} weight="fill" /></IconBox>
                  <CardTitle>{value.title}</CardTitle>
                </CardHeader>
                <CardDescription>
                  {value.content}
                </CardDescription>
              </CardContent>
            </ValueCard>
          );
        })}
      </ValuesGrid>
    </PageContainer>
  );
}
