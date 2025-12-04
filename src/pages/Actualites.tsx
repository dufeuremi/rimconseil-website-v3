import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import PageContainer from '../components/PageContainer';
import pb from '../lib/pocketbase';
import { CalendarBlank, Tag, ArrowRight } from '@phosphor-icons/react';

// Types based on the user provided JSON response
interface NewsRecord {
  id: string;
  collectionId: string;
  collectionName: string;
  title: string;
  subtitle: string;
  content: string;
  tags: string;
  date: string;
  preview: string;
  expand?: any;
  is_online: boolean;
}

const PageTitle = styled.h1`
  font-family: var(--font-secondary);
  font-size: 3rem;
  color: var(--color-primary);
  margin-bottom: 3rem;
  text-align: center;
`;

const NewsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3rem;
  max-width: 1000px;
  margin: 0 auto;
`;

const NewsCard = styled(Link)`
  background: white;
  border-radius: var(--border-radius);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: grid;
  grid-template-columns: 350px 1fr;
  text-decoration: none;
  color: inherit;
  min-height: 250px;

  &:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-md);
    color: inherit;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    min-height: auto;
  }
`;

const ImageContainer = styled.div`
  height: 100%;
  overflow: hidden;
  position: relative;

  @media (max-width: 768px) {
    height: 200px;
  }
`;

const NewsImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;

  ${NewsCard}:hover & {
    transform: scale(1.05);
  }
`;

const CardContent = styled.div`
  padding: 2rem;
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const DateWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: var(--color-green);
  line-height: 1.8;
  vertical-align: middle;
  margin-bottom: 1rem;
`;

const CardTitle = styled.h2`
  font-family: var(--font-secondary);
  font-size: 1.75rem;
  color: var(--color-primary);
  margin-bottom: 0.75rem;
  line-height: 1.3;
  transition: color 0.2s;

  ${NewsCard}:hover & {
    color: var(--color-secondary);
  }
`;

const CardSubtitle = styled.p`
  font-size: 1.1rem;
  color: var(--color-text);
  margin-bottom: 1.5rem;
  flex: 1;
  line-height: 1.6;
`;

const CardFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
`;

const TagsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const TagPill = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  background-color: var(--color-background);
  color: var(--color-secondary);
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  text-transform: uppercase;
`;

const ReadMore = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--color-primary);
  font-weight: 600;
  font-size: 0.9rem;
  
  ${NewsCard}:hover & {
    color: var(--color-secondary);
  }
`;

const LoadingMessage = styled.p`
  text-align: center;
  font-size: 1.2rem;
  color: var(--color-text-light);
  margin-top: 4rem;
`;

const ErrorMessage = styled.p`
  text-align: center;
  color: var(--color-secondary);
  margin-top: 4rem;
`;

export default function Actualites() {
  const [news, setNews] = useState<NewsRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const records = await pb.collection('news').getFullList<NewsRecord>({
          sort: '-date',
          filter: 'is_online = true',
          requestKey: null,
        });
        setNews(records);
      } catch (err: any) {
        console.error("Error fetching news:", err);
        setError("Impossible de charger les actualités pour le moment.");
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  // Helper to get image URL
  const getImageUrl = (record: NewsRecord) => {
    if (!record.preview) return 'https://placehold.co/600x400?text=No+Image';
    return pb.files.getURL(record, record.preview);
  };

  return (
    <PageContainer>
      <PageTitle>Actualités</PageTitle>

      {loading && <LoadingMessage>Chargement des actualités...</LoadingMessage>}

      {error && <ErrorMessage>{error}</ErrorMessage>}

      {!loading && !error && (
        <NewsList>
          {news.map((item) => (
            <NewsCard key={item.id} to={`/actualites/${item.id}`}>
              <ImageContainer>
                <NewsImage src={getImageUrl(item)} alt={item.title} />
              </ImageContainer>
              <CardContent>
                <DateWrapper>
                  <CalendarBlank size={16} />
                  {formatDate(item.date)}
                </DateWrapper>
                <CardTitle>{item.title}</CardTitle>
                <CardSubtitle>{item.subtitle}</CardSubtitle>

                <CardFooter>
                  {item.tags && (
                    <TagsWrapper>
                      {item.tags.split(',').map((tag, index) => (
                        <TagPill key={index}>
                          <Tag size={12} weight="fill" />
                          {tag.trim()}
                        </TagPill>
                      ))}
                    </TagsWrapper>
                  )}
                  <ReadMore>
                    Lire l'article
                    <ArrowRight weight="bold" />
                  </ReadMore>
                </CardFooter>
              </CardContent>
            </NewsCard>
          ))}
        </NewsList>
      )}
    </PageContainer>
  );
}
