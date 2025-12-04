import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import PageContainer from '../components/PageContainer';
import pb from '../lib/pocketbase';
import { CalendarBlank, ArrowLeft, Tag } from '@phosphor-icons/react';

interface ArticleRecord {
  id: string;
  collectionId: string;
  collectionName: string;
  title: string;
  subtitle: string;
  content: string;
  tags: string;
  date: string;
  preview: string;
  is_online: boolean;
}

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--color-secondary);
  font-weight: 600;
  margin-bottom: 2rem;
  transition: color 0.2s;

  &:hover {
    color: var(--color-primary);
    text-decoration: none;
  }
`;

const ArticleHeader = styled.header`
  margin-bottom: 3rem;
  text-align: center;
`;

const ArticleTitle = styled.h1`
  font-family: var(--font-secondary);
  font-size: 3rem;
  color: var(--color-primary);
  margin-bottom: 1rem;
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const ArticleMeta = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  color: var(--color-text-light);
  font-size: 0.9rem;
  margin-bottom: 2rem;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ArticleContent = styled.div`
  max-width: 800px;
  margin: 0 auto;
  font-size: 1.1rem;
  line-height: 1.8;
  color: var(--color-text);

  p {
    margin-bottom: 1.5rem;
  }

  h2 {
    font-family: var(--font-secondary);
    color: var(--color-primary);
    margin-top: 3rem;
    margin-bottom: 1rem;
  }

  h3 {
    color: var(--color-secondary);
    margin-top: 2rem;
    margin-bottom: 1rem;
  }

  ul, ol {
    margin-bottom: 1.5rem;
    padding-left: 1.5rem;
  }

  li {
    margin-bottom: 0.5rem;
  }
`;

const TagsContainer = styled.div`
  max-width: 800px;
  margin: 3rem auto 0;
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const TagPill = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  background-color: var(--color-background);
  color: var(--color-secondary);
  font-size: 0.85rem;
  font-weight: 600;
  padding: 0.4rem 1rem;
  border-radius: 9999px;
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 4rem;
  font-size: 1.2rem;
  color: var(--color-text-light);
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 4rem;
  color: var(--color-secondary);
  white-space: pre-wrap;
`;

export default function ArticleDetail() {
  const { id } = useParams();
  const [article, setArticle] = useState<ArticleRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      if (!id) return;
      try {
        const record = await pb.collection('articles').getOne<ArticleRecord>(id, {
          requestKey: null,
        });

        if (!record.is_online) {
          setError("Cet article n'est plus disponible.");
          setArticle(null);
        } else {
          setArticle(record);
        }
      } catch (err: any) {
        console.error("Error fetching article:", err);
        setError(`Impossible de charger l'article.\n${err.message || ''}`);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  if (loading) return <PageContainer><LoadingMessage>Chargement...</LoadingMessage></PageContainer>;
  if (error || !article) return <PageContainer><ErrorMessage>{error || "Article non trouvé"}</ErrorMessage></PageContainer>;

  return (
    <PageContainer>
      <BackLink to="/articles">
        <ArrowLeft weight="bold" />
        Retour aux articles
      </BackLink>

      <article>
        <ArticleHeader>
          <ArticleTitle>{article.title}</ArticleTitle>
          <ArticleMeta>
            <MetaItem>
              <CalendarBlank size={18} />
              {formatDate(article.date)}
            </MetaItem>
          </ArticleMeta>
        </ArticleHeader>

        {(() => {
          try {
            let content = article.content;
            if (typeof content === 'string') {
              try {
                content = JSON.parse(content);
              } catch (e) {
                // If parse fails, it might be plain text/HTML
                return <ArticleContent dangerouslySetInnerHTML={{ __html: article.content }} />;
              }
            }

            if (Array.isArray(content)) {
              return (
                <ArticleContent>
                  {content.map((block: any, index: number) => {
                    switch (block.type) {
                      case 'title':
                        return <h2 key={index} dangerouslySetInnerHTML={{ __html: block.value || '' }} />;
                      case 'subtitle':
                        return <h3 key={index} dangerouslySetInnerHTML={{ __html: block.value || '' }} />;
                      case 'paragraph':
                        return <p key={index} dangerouslySetInnerHTML={{ __html: block.value || '' }} />;
                      case 'image':
                        return (
                          <figure key={index} style={{ margin: '2rem 0' }}>
                            <img src={block.url} alt={block.caption || ''} style={{ width: '100%', borderRadius: '8px' }} />
                            {block.caption && <figcaption style={{ textAlign: 'center', color: 'var(--color-text-light)', marginTop: '0.5rem', fontSize: '0.9rem' }}>{block.caption}</figcaption>}
                          </figure>
                        );
                      case 'list':
                        return (
                          <ul key={index}>
                            {block.items?.map((item: string, i: number) => (
                              <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
                            ))}
                          </ul>
                        );
                      case 'note':
                        return (
                          <div key={index} style={{ background: '#f8fafc', padding: '1.5rem', borderLeft: '4px solid var(--color-primary)', margin: '1.5rem 0', fontStyle: 'italic' }} dangerouslySetInnerHTML={{ __html: block.value || '' }} />
                        );
                      case 'link':
                        return (
                          <div key={index} style={{ margin: '1rem 0' }}>
                            <a href={block.url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                              {block.value || block.url}
                            </a>
                          </div>
                        );
                      default:
                        return null;
                    }
                  })}
                </ArticleContent>
              );
            }
            // Fallback for non-array JSON (shouldn't happen with our editor but good for safety)
            return <ArticleContent dangerouslySetInnerHTML={{ __html: article.content }} />;
          } catch (e) {
            // Fallback for plain text/HTML (legacy content)
            return <ArticleContent dangerouslySetInnerHTML={{ __html: article.content }} />;
          }
        })()}

        {article.tags && (
          <TagsContainer>
            {article.tags.split(',').map((tag, index) => (
              <TagPill key={index}>
                <Tag size={14} weight="fill" />
                {tag.trim()}
              </TagPill>
            ))}
          </TagsContainer>
        )}
      </article>
    </PageContainer>
  );
}
