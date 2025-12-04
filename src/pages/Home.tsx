import { useState, useEffect } from 'react';
import styled from 'styled-components';
import heroBg from '../assets/background.png';
import { ArrowRight, UsersThree, Leaf, Lightbulb, CalendarBlank, Tag, CaretLeft, CaretRight } from '@phosphor-icons/react';
import { Link } from 'react-router-dom';
import PageContainer from '../components/PageContainer';
import pb from '../lib/pocketbase';

// Partner Images
import bevoak from '../assets/partenaires/bevoak.png';
import blocnet from '../assets/partenaires/blocnet.png';
import colibee from '../assets/partenaires/colibee.png';
import parteam from '../assets/partenaires/parteam.avif';
import polynom from '../assets/partenaires/polynom.png';
import excelcio from '../assets/partenaires/excelcio.png';
import client1 from '../assets/partenaires/client1.png';
import client2 from '../assets/partenaires/client2.png';

// Value Images
import socialImg from '../assets/images/social.jpg';
import agileImg from '../assets/images/agile.jpg';
import ecologiqueImg from '../assets/images/ecologique.jpg';

const imageMap: Record<string, string> = {
  "Valeurs Sociales": socialImg,
  "Valeurs écologiques": ecologiqueImg,
  "Innovation et pratiques agiles": agileImg
};

const HeroSection = styled.section`
  height: 100vh;
  width: 100%;
  background-image: linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), url(${heroBg});
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  color: white;
  text-align: left;
  padding: 0;
  margin-top: -100px;
  padding-top: 200px;

  @media (max-width: 768px) {
    margin-top: -80px;
    padding-top: 150px;
  }
`;

const HeroContent = styled.div`
  max-width: 1664px;
  width: 100%;
  margin: 0 auto;
  padding: 0 5rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1.5rem;

  @media (max-width: 768px) {
    padding: 0 2rem;
  }
`;

const PreTitle = styled.span`
  font-family: var(--font-primary);
  font-size: 1.1rem;
  font-weight: 600;
  color: #ffffff;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  text-shadow: 0 1px 2px rgb(0 0 0 / 30%);
  background-color: rgb(255 255 255 / 21%);
  padding: 0.2rem 0.4rem;
  backdrop-filter: blur(4px);
`;

const HeroTitle = styled.h1`
  font-family: var(--font-secondary);
  font-size: 4rem;
  font-weight: 700;
  color: white;
  margin-bottom: 0;
  text-shadow: 0 2px 4px rgba(0,0,0,0.3);
  max-width: 800px;

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.25rem;
  line-height: 1.6;
  max-width: 700px;
  text-shadow: 0 1px 2px rgba(0,0,0,0.3);
  margin-bottom: 1rem;
`;

const CTAButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  background-color: var(--color-primary);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: var(--border-radius);
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.2s;
  box-shadow: var(--shadow-sm);
  text-decoration: none;

  &:hover {
    background-color: var(--color-primary-light);
    color: white;
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
  }
`;

const Section = styled.section`
  padding: 6rem 0;
`;

const SectionTitle = styled.h2`
  font-family: var(--font-secondary);
  font-size: 2.5rem;
  color: var(--color-primary);
  margin-bottom: 3rem;
  text-align: center;
`;

// Values Styles
const ValuesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 3rem;
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
  height: 200px;
  background-color: var(--color-quaternary);
  
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
  margin-bottom: 1rem;
`;

const IconBox = styled.div`
  width: 40px;
  height: 40px;
  background-color: rgba(44, 119, 227, 0.1);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-primary);
  flex-shrink: 0;
`;

const CardTitle = styled.h3`
  font-family: var(--font-secondary);
  font-size: 1.25rem;
  color: var(--color-secondary);
  margin: 0;
  line-height: 1.2;
`;

const CardDescription = styled.div`
  color: var(--color-text);
  font-size: 0.95rem;
  line-height: 1.6;
`;

// Enjeux Styles
const EnjeuxSection = styled.div`
  position: relative;
  padding: 6rem 0;
  overflow: hidden;
  color: white;
  text-align: center;
`;

const EnjeuxBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url(${heroBg});
  background-size: cover;
  background-position: center;
  filter: blur(20px) brightness(0.6);
  transform: scale(1.1);
  z-index: 0;
`;

const EnjeuxContent = styled.div`
  position: relative;
  z-index: 1;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
`;

const EnjeuxTitle = styled.h2`
  font-family: var(--font-secondary);
  font-size: 2.5rem;
  color: white;
  margin-bottom: 4rem;
`;

const CarouselContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
`;

const CarouselButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.4);
  color: white;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  backdrop-filter: blur(4px);

  &:hover {
    background: rgba(255, 255, 255, 0.4);
    transform: scale(1.1);
  }
`;

const CarouselTrack = styled.div`
  display: flex;
  gap: 2rem;
  width: 100%;
  max-width: 900px;
`;

const EnjeuCard = styled.div`
  flex: 1;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: var(--border-radius);
  padding: 2.5rem;
  text-align: left;
  color: white;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  min-height: 300px;
`;

const EnjeuCardTitle = styled.h3`
  font-family: var(--font-secondary);
  font-size: 1.5rem;
  margin: 0;
  color: white;
`;

const EnjeuCardDesc = styled.p`
  font-size: 1rem;
  line-height: 1.6;
  opacity: 0.9;
  flex: 1;
`;

const EnjeuButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: white;
  font-weight: 600;
  text-decoration: none;
  border-bottom: 2px solid var(--color-primary);
  padding-bottom: 0.25rem;
  align-self: flex-start;
  transition: all 0.2s;

  &:hover {
    color: var(--color-primary-light);
    border-color: var(--color-primary-light);
  }
`;

// Partners Styles
const PartnersContainer = styled.div`
  position: relative;
  padding: 6rem 0;
  overflow: hidden;
  color: white;
  text-align: center;
`;

const PartnersBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url(${heroBg});
  background-size: cover;
  background-position: center;
  filter: blur(20px) brightness(0.4);
  transform: scale(1.1);
  z-index: 0;
`;

const PartnersContent = styled.div`
  position: relative;
  z-index: 1;
  max-width: 1664px;
  margin: 0 auto;
  padding: 0 2rem;
`;

const PartnersTitle = styled.h2`
  font-family: var(--font-secondary);
  font-size: 2.5rem;
  color: white;
  margin-bottom: 4rem;
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
  filter: brightness(0) invert(1);
  opacity: 0.8;
  transition: all 0.3s ease;

  &:hover {
    opacity: 1;
    transform: scale(1.05);
  }
`;

// News Styles
const NewsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
`;

const NewsCard = styled(Link)`
  background: white;
  border-radius: var(--border-radius);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--color-quaternary);
  text-decoration: none;
  color: inherit;
  transition: all 0.2s;
  display: flex;
  flex-direction: column;
  height: 100%;

  &:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-md);
  }
`;

const NewsImage = styled.div`
  height: 200px;
  background-color: #f1f5f9;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const NewsContent = styled.div`
  padding: 1.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const NewsDate = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: var(--color-text-light);
  margin-bottom: 0.75rem;
`;

const NewsTitle = styled.h3`
  font-family: var(--font-secondary);
  font-size: 1.25rem;
  color: var(--color-secondary);
  margin: 0 0 0.75rem 0;
  line-height: 1.3;
`;

const NewsSubtitle = styled.p`
  font-size: 0.95rem;
  color: var(--color-text);
  margin: 0 0 1.5rem 0;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex: 1;
`;

const NewsTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: auto;
`;

const TagPill = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  background-color: #f1f5f9;
  color: var(--color-text);
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  text-transform: uppercase;
`;

const iconMap: Record<string, React.ElementType> = {
  "UsersThree": UsersThree,
  "Leaf": Leaf,
  "Lightbulb": Lightbulb,
  "Strategy": Lightbulb,
  "TreeStructure": Lightbulb,
  "MagnifyingGlass": Lightbulb
};

export default function Home() {
  const [valuesData, setValuesData] = useState<any>(null);
  const [homeExpertisesData, setHomeExpertisesData] = useState<any>(null);
  const [enjeuxData, setEnjeuxData] = useState<any>(null);
  const [currentEnjeuIndex, setCurrentEnjeuIndex] = useState(0);
  const [newsData, setNewsData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Values
        const valuesRecord = await pb.collection('pages').getFirstListItem('url="valeurs"');
        if (valuesRecord && valuesRecord.content) {
          setValuesData(typeof valuesRecord.content === 'string' ? JSON.parse(valuesRecord.content) : valuesRecord.content);
        }

        // Fetch Home Expertises
        try {
          const expertisesRecord = await pb.collection('pages').getFirstListItem('url="home_expertises"');
          if (expertisesRecord && expertisesRecord.content) {
            setHomeExpertisesData(typeof expertisesRecord.content === 'string' ? JSON.parse(expertisesRecord.content) : expertisesRecord.content);
          }
        } catch (e) {
          console.log("Home expertises not found yet");
        }

        // Fetch Enjeux
        try {
          const enjeuxRecord = await pb.collection('pages').getFirstListItem('url="enjeux"');
          if (enjeuxRecord && enjeuxRecord.content) {
            setEnjeuxData(typeof enjeuxRecord.content === 'string' ? JSON.parse(enjeuxRecord.content) : enjeuxRecord.content);
          }
        } catch (e) {
          console.log("Enjeux not found yet");
        }

        // Fetch News & Articles
        const [newsRecords, articlesRecords] = await Promise.all([
          pb.collection('news').getList(1, 3, { sort: '-date', filter: 'is_online=true' }),
          pb.collection('articles').getList(1, 3, { sort: '-date', filter: 'is_online=true' })
        ]);

        const combined = [
          ...newsRecords.items.map(item => ({ ...item, type: 'news' })),
          ...articlesRecords.items.map(item => ({ ...item, type: 'article' }))
        ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, 3);

        setNewsData(combined);

      } catch (err) {
        console.error("Error fetching home data:", err);
      }
    };
    fetchData();
  }, []);

  const nextEnjeux = () => {
    if (enjeuxData && enjeuxData.items) {
      setCurrentEnjeuIndex((prev) => (prev + 2) % enjeuxData.items.length);
    }
  };

  const prevEnjeux = () => {
    if (enjeuxData && enjeuxData.items) {
      setCurrentEnjeuIndex((prev) => (prev - 2 + enjeuxData.items.length) % enjeuxData.items.length);
    }
  };

  return (
    <>
      <HeroSection>
        <HeroContent>
          <PreTitle>Conseil et accompagnement d'entreprise</PreTitle>
          <HeroTitle>Piloter l'IT avec sens.</HeroTitle>
          <HeroSubtitle>
            Votre partenaire pour co-construire vos solutions IT responsables qui allient innovation et respect des valeurs écologiques et sociales
          </HeroSubtitle>
          <CTAButton to="/services">
            Voir les services
            <ArrowRight weight="bold" />
          </CTAButton>
        </HeroContent>
      </HeroSection>

      {homeExpertisesData && (
        <PageContainer>
          <Section>
            <SectionTitle>{homeExpertisesData.title}</SectionTitle>
            <p style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 3rem', color: 'var(--color-text-light)', fontSize: '1.125rem' }}>
              {homeExpertisesData.description}
            </p>
            <ValuesGrid>
              {homeExpertisesData.items.map((item: any, index: number) => {
                const Icon = iconMap[item.icon as string] || Lightbulb;
                return (
                  <ValueCard key={index}>
                    <CardContent>
                      <CardHeader>
                        <IconBox><Icon size={24} weight="fill" /></IconBox>
                        <CardTitle>{item.title}</CardTitle>
                      </CardHeader>
                      <CardDescription>
                        {item.content}
                      </CardDescription>
                    </CardContent>
                  </ValueCard>
                );
              })}
            </ValuesGrid>
            <div style={{ textAlign: 'center', marginTop: '3rem' }}>
              <CTAButton to="/expertises">
                En savoir plus
                <ArrowRight weight="bold" />
              </CTAButton>
            </div>
          </Section>
        </PageContainer>
      )}

      {enjeuxData && (
        <EnjeuxSection>
          <EnjeuxBackground />
          <EnjeuxContent>
            <EnjeuxTitle>{enjeuxData.title}</EnjeuxTitle>
            <CarouselContainer>
              <CarouselButton onClick={prevEnjeux}>
                <CaretLeft size={24} weight="bold" />
              </CarouselButton>
              <CarouselTrack>
                {enjeuxData.items.slice(currentEnjeuIndex, currentEnjeuIndex + 2).map((item: any, index: number) => (
                  <EnjeuCard key={index}>
                    <EnjeuCardTitle>{item.title}</EnjeuCardTitle>
                    <EnjeuCardDesc>{item.description}</EnjeuCardDesc>
                    <EnjeuButton to={item.buttonLink || "/enjeux"}>
                      {item.buttonText || "En savoir plus"}
                      <ArrowRight weight="bold" />
                    </EnjeuButton>
                  </EnjeuCard>
                ))}
              </CarouselTrack>
              <CarouselButton onClick={nextEnjeux}>
                <CaretRight size={24} weight="bold" />
              </CarouselButton>
            </CarouselContainer>
          </EnjeuxContent>
        </EnjeuxSection>
      )}

      {valuesData && (
        <PageContainer>
          <Section>
            <SectionTitle>Nos Valeurs</SectionTitle>
            <ValuesGrid>
              {valuesData.items.map((value: any, index: number) => {
                const Icon = iconMap[value.icon as string] || Lightbulb;
                const imageSrc = imageMap[value.title] || value.image;
                return (
                  <ValueCard key={index}>
                    <ImageContainer>
                      <img src={imageSrc} alt={value.title} />
                    </ImageContainer>
                    <CardContent>
                      <CardHeader>
                        <IconBox><Icon size={24} weight="fill" /></IconBox>
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
          </Section>
        </PageContainer>
      )}

      <PartnersContainer>
        <PartnersBackground />
        <PartnersContent>
          <PartnersTitle>Nos partenaires</PartnersTitle>
          <LogosGrid>
            <PartnerLogo src={bevoak} alt="Bevoak" />
            <PartnerLogo src={blocnet} alt="Blocnet" />
            <PartnerLogo src={colibee} alt="Colibee" />
            <PartnerLogo src={parteam} alt="Parteam" />
            <PartnerLogo src={polynom} alt="Polynom" />
            <PartnerLogo src={excelcio} alt="Excelcio" />
          </LogosGrid>

          <PartnersTitle style={{ marginTop: '6rem' }}>Ils nous font confiance</PartnersTitle>
          <LogosGrid>
            <PartnerLogo src={client1} alt="Client 1" />
            <PartnerLogo src={client2} alt="Client 2" />
          </LogosGrid>
        </PartnersContent>
      </PartnersContainer>

      <PageContainer>
        <Section>
          <SectionTitle>Actualités & Articles</SectionTitle>
          <NewsGrid>
            {newsData.map((item) => (
              <NewsCard key={item.id} to={item.type === 'news' ? `/actualites/${item.id}` : `/articles/${item.id}`}>
                <NewsImage>
                  <img
                    src={item.preview ? pb.files.getURL(item, item.preview) : 'https://placehold.co/600x400?text=No+Image'}
                    alt={item.title}
                  />
                </NewsImage>
                <NewsContent>
                  <NewsDate>
                    <CalendarBlank size={16} />
                    {new Date(item.date).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                    <span style={{ margin: '0 0.5rem' }}>•</span>
                    <span style={{ textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-primary)' }}>
                      {item.type === 'news' ? 'Actualité' : 'Article'}
                    </span>
                  </NewsDate>
                  <NewsTitle>{item.title}</NewsTitle>
                  <NewsSubtitle>{item.subtitle}</NewsSubtitle>
                  {item.tags && (
                    <NewsTags>
                      {item.tags.split(',').slice(0, 2).map((tag: string, i: number) => (
                        <TagPill key={i}>
                          <Tag size={12} weight="fill" />
                          {tag.trim()}
                        </TagPill>
                      ))}
                    </NewsTags>
                  )}
                </NewsContent>
              </NewsCard>
            ))}
          </NewsGrid>
        </Section>
      </PageContainer>
    </>
  );
}
