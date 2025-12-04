import { useState, useEffect } from 'react';
import styled from 'styled-components';
import pb from '../../lib/pocketbase';
import { Pencil, Trash, CalendarBlank, Tag, Plus, X, ArrowSquareOut } from '@phosphor-icons/react';
import ArticleBlockEditor from '../../components/dashboard/ArticleBlockEditor';

// Types
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
  is_online: boolean;
}

const Container = styled.div`
  background: white;
  border: 1px solid var(--color-quaternary);
  height: 100%;
  display: flex;
  flex-direction: column;
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

const AddButton = styled.button`
  background-color: var(--color-primary);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: background-color 0.2s;

  &:hover {
    background-color: var(--color-secondary);
  }
`;

const Content = styled.div`
  padding: 2rem;
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const NewsCard = styled.div`
  background: white;
  border: 1px solid var(--color-quaternary);
  display: grid;
  grid-template-columns: 200px 1fr auto;
  min-height: 160px;
  transition: box-shadow 0.2s;

  &:hover {
    box-shadow: var(--shadow-sm);
  }
`;

const ImageContainer = styled.div`
  height: 100%;
  overflow: hidden;
  position: relative;
  background-color: #f1f5f9;
`;

const NewsImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const CardContent = styled.div`
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
`;

const DateWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: var(--color-text-light);
  margin-bottom: 0.5rem;
`;

const CardTitle = styled.h3`
  font-family: var(--font-secondary);
  font-size: 1.25rem;
  color: var(--color-primary);
  margin: 0 0 0.5rem 0;
  line-height: 1.3;
`;

const CardSubtitle = styled.p`
  font-size: 0.95rem;
  color: var(--color-text);
  margin: 0 0 1rem 0;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const TagsWrapper = styled.div`
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

const ActionsColumn = styled.div`
  display: flex;
  flex-direction: column;
  border-left: 1px solid var(--color-quaternary);
  width: 160px;
  background-color: #f8fafc;
`;

const ActionButton = styled.button`
  flex: 1;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0 1.5rem;
  color: var(--color-text-light);
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.9rem;
  font-weight: 500;
  text-align: left;
  border-bottom: 1px solid var(--color-quaternary);

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: white;
    color: var(--color-primary);
  }

  &.delete:hover {
    color: #e53e3e;
    background-color: #fff5f5;
  }
`;

const ToggleSwitch = styled.button<{ active: boolean }>`
  width: 36px;
  height: 20px;
  background-color: ${props => props.active ? 'var(--color-primary)' : '#cbd5e1'};
  border-radius: 10px;
  border: none;
  cursor: pointer;
  position: relative;
  transition: background-color 0.2s;
  padding: 0;
  flex-shrink: 0;

  &::after {
    content: '';
    position: absolute;
    top: 2px;
    left: ${props => props.active ? '18px' : '2px'};
    width: 16px;
    height: 16px;
    background-color: white;
    border-radius: 50%;
    transition: left 0.2s;
    box-shadow: 0 1px 2px rgba(0,0,0,0.1);
  }
`;

const StatusRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--color-quaternary);
  font-size: 0.9rem;
  color: var(--color-text);
  font-weight: 500;
  background-color: white;
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
`;

const ModalContent = styled.div`
  background: white;
  padding: 2rem;
  width: 100%;
  max-width: 400px;
  box-shadow: var(--shadow-lg);
  border: 1px solid var(--color-quaternary);
`;

const ModalTitle = styled.h3`
  margin-top: 0;
  color: var(--color-primary);
  font-family: var(--font-secondary);
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
`;

const Button = styled.button<{ variant?: 'primary' | 'danger' | 'outline' }>`
  padding: 0.5rem 1rem;
  border-radius: 0;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  
  ${props => props.variant === 'danger' && `
    background-color: #e53e3e;
    color: white;
    border: none;
    &:hover { background-color: #c53030; }
  `}

  ${props => props.variant === 'outline' && `
    background-color: transparent;
    color: var(--color-text);
    border: 1px solid var(--color-quaternary);
    &:hover { background-color: #f8fafc; }
  `}
`;

const LoadingMessage = styled.div`
  padding: 2rem;
  text-align: center;
  color: var(--color-text-light);
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--color-primary);
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--color-quaternary);
  border-radius: 4px;
  font-family: inherit;
  
  &:focus {
    outline: none;
    border-color: var(--color-primary);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--color-quaternary);
  border-radius: 4px;
  font-family: inherit;
  min-height: 150px;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: var(--color-primary);
  }
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  user-select: none;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-text-light);
  padding: 0.5rem;
  
  &:hover {
    color: var(--color-primary);
  }
`;

export default function DashboardActus() {
  const [news, setNews] = useState<NewsRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingNews, setEditingNews] = useState<NewsRecord | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newNews, setNewNews] = useState({
    title: '',
    subtitle: '',
    content: '',
    tags: '',
    date: new Date().toISOString().split('T')[0],
    is_online: true,
    preview: null as File | null
  });

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const records = await pb.collection('news').getFullList<NewsRecord>({
        sort: '-date',
      });
      // Ensure is_online field exists (mock if missing for now)
      const recordsWithPublished = records.map(r => ({
        ...r,
        is_online: r.is_online ?? false // Default to false if missing
      }));
      setNews(recordsWithPublished);
    } catch (err) {
      console.error("Error fetching news:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await pb.collection('news').delete(deleteId);
      setNews(news.filter(item => item.id !== deleteId));
      setDeleteId(null);
    } catch (err) {
      console.error("Error deleting news:", err);
      alert("Erreur lors de la suppression");
    }
  };

  const handleToggleOnline = async (id: string, currentStatus: boolean) => {
    try {
      // Optimistic update
      setNews(news.map(item =>
        item.id === id ? { ...item, is_online: !currentStatus } : item
      ));

      await pb.collection('news').update(id, {
        is_online: !currentStatus
      });
    } catch (err: any) {
      console.error("Error updating status:", err);
      // Revert on error
      setNews(news.map(item =>
        item.id === id ? { ...item, is_online: currentStatus } : item
      ));

      const errorMessage = err?.message || "Erreur lors de la mise à jour du statut";
      alert(`Erreur: ${errorMessage}`);
    }
  };

  const handleEdit = (id: string) => {
    const item = news.find(n => n.id === id);
    if (item) {
      setEditingNews(item);
      setIsEditModalOpen(true);
    }
  };

  const handleSaveEdit = async (contentJSON: string) => {
    if (!editingNews) return;

    try {
      const formData = new FormData();
      formData.append('title', editingNews.title);
      formData.append('subtitle', editingNews.subtitle);
      formData.append('content', contentJSON);

      if ((editingNews as any).newPreview) {
        formData.append('preview', (editingNews as any).newPreview);
      }

      const updatedRecord = await pb.collection('news').update(editingNews.id, formData);

      // Update local state
      setNews(news.map(n =>
        n.id === editingNews.id ? updatedRecord : n
      ));

      setIsEditModalOpen(false);
      setEditingNews(null);
    } catch (err) {
      console.error("Error updating news:", err);
      alert("Erreur lors de la mise à jour de l'actualité");
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('title', newNews.title);
      formData.append('subtitle', newNews.subtitle);
      formData.append('content', newNews.content);
      formData.append('tags', newNews.tags);
      formData.append('date', new Date(newNews.date).toISOString());
      formData.append('is_online', newNews.is_online.toString());

      if (newNews.preview) {
        formData.append('preview', newNews.preview);
      }

      const record = await pb.collection('news').create<NewsRecord>(formData);

      setNews([record, ...news]);
      setIsAddModalOpen(false);
      setNewNews({
        title: '',
        subtitle: '',
        content: '',
        tags: '',
        date: new Date().toISOString().split('T')[0],
        is_online: true,
        preview: null
      });

    } catch (err) {
      console.error("Error creating news:", err);
      alert("Erreur lors de la création de l'actualité");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewNews({ ...newNews, preview: e.target.files[0] });
    }
  };

  const getImageUrl = (record: NewsRecord) => {
    if (!record.preview) return 'https://placehold.co/600x400?text=No+Image';
    return pb.files.getURL(record, record.preview);
  };

  return (
    <Container>
      <Header>
        <Title>Édition Actualités</Title>
        <AddButton onClick={() => setIsAddModalOpen(true)}>
          <Plus size={16} weight="bold" />
          Nouvelle actualité
        </AddButton>
      </Header>
      <Content>
        {loading ? (
          <LoadingMessage>Chargement...</LoadingMessage>
        ) : (
          <>
            {news.map((item) => (
              <NewsCard key={item.id}>
                <ImageContainer>
                  <NewsImage src={getImageUrl(item)} alt={item.title} />
                </ImageContainer>

                <CardContent>
                  <DateWrapper>
                    <CalendarBlank size={16} />
                    {new Date(item.date).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </DateWrapper>
                  <CardTitle>{item.title}</CardTitle>
                  <CardSubtitle>{item.subtitle}</CardSubtitle>

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
                </CardContent>

                <ActionsColumn>
                  <StatusRow>
                    <span>{item.is_online ? 'En ligne' : 'Hors ligne'}</span>
                    <ToggleSwitch
                      active={item.is_online}
                      onClick={() => handleToggleOnline(item.id, item.is_online)}
                    />
                  </StatusRow>
                  <ActionButton onClick={() => handleEdit(item.id)}>
                    <Pencil size={18} />
                    Éditer
                  </ActionButton>
                  <ActionButton onClick={() => window.open(`/actualites/${item.id}`, '_blank')}>
                    <ArrowSquareOut size={18} />
                    Voir
                  </ActionButton>
                  <ActionButton className="delete" onClick={() => setDeleteId(item.id)}>
                    <Trash size={18} />
                    Supprimer
                  </ActionButton>
                </ActionsColumn>
              </NewsCard>
            ))}

            {news.length === 0 && (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-light)' }}>
                Aucune actualité trouvée
              </div>
            )}
          </>
        )}
      </Content>

      {deleteId && (
        <ModalOverlay onClick={() => setDeleteId(null)}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <ModalTitle>Confirmer la suppression</ModalTitle>
            <p>Êtes-vous sûr de vouloir supprimer cette actualité ? Cette action est irréversible.</p>
            <ModalActions>
              <Button variant="outline" onClick={() => setDeleteId(null)}>Annuler</Button>
              <Button variant="danger" onClick={handleDelete}>Supprimer</Button>
            </ModalActions>
          </ModalContent>
        </ModalOverlay>
      )}

      {isAddModalOpen && (
        <ModalOverlay onClick={() => setIsAddModalOpen(false)}>
          <ModalContent onClick={e => e.stopPropagation()} style={{ maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
            <ModalHeader>
              <ModalTitle>Nouvelle actualité</ModalTitle>
              <CloseButton onClick={() => setIsAddModalOpen(false)}>
                <X size={24} />
              </CloseButton>
            </ModalHeader>

            <form onSubmit={handleCreate}>
              <FormGroup>
                <Label>Titre</Label>
                <Input
                  type="text"
                  required
                  value={newNews.title}
                  onChange={e => setNewNews({ ...newNews, title: e.target.value })}
                  placeholder="Titre de l'actualité"
                />
              </FormGroup>

              <FormGroup>
                <Label>Sous-titre</Label>
                <Input
                  type="text"
                  value={newNews.subtitle}
                  onChange={e => setNewNews({ ...newNews, subtitle: e.target.value })}
                  placeholder="Court résumé..."
                />
              </FormGroup>

              <FormGroup>
                <Label>Date</Label>
                <Input
                  type="date"
                  required
                  value={newNews.date}
                  onChange={e => setNewNews({ ...newNews, date: e.target.value })}
                />
              </FormGroup>

              <FormGroup>
                <Label>Image de couverture</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </FormGroup>

              <FormGroup>
                <Label>Tags (séparés par des virgules)</Label>
                <Input
                  type="text"
                  value={newNews.tags}
                  onChange={e => setNewNews({ ...newNews, tags: e.target.value })}
                  placeholder="Ex: Innovation, Tech, RSE"
                />
              </FormGroup>

              <FormGroup>
                <Label>Contenu</Label>
                <TextArea
                  required
                  value={newNews.content}
                  onChange={e => setNewNews({ ...newNews, content: e.target.value })}
                  placeholder="Contenu de l'actualité..."
                />
              </FormGroup>

              <FormGroup>
                <CheckboxLabel>
                  <input
                    type="checkbox"
                    checked={newNews.is_online}
                    onChange={e => setNewNews({ ...newNews, is_online: e.target.checked })}
                  />
                  Publier immédiatement
                </CheckboxLabel>
              </FormGroup>

              <ModalActions>
                <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>
                  Annuler
                </Button>
                <Button type="submit" variant="primary" style={{ backgroundColor: 'var(--color-primary)', color: 'white' }} disabled={isSubmitting}>
                  {isSubmitting ? 'Création...' : 'Créer l\'actualité'}
                </Button>
              </ModalActions>
            </form>
          </ModalContent>
        </ModalOverlay>
      )}
      {isEditModalOpen && editingNews && (
        <ModalOverlay onClick={() => setIsEditModalOpen(false)}>
          <ModalContent onClick={e => e.stopPropagation()} style={{ maxWidth: '1000px', width: '90%', maxHeight: '90vh', overflowY: 'auto' }}>
            <ModalHeader>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <ModalTitle>Éditer l'actualité : {editingNews.title}</ModalTitle>
                <a href={`/actualites/${editingNews.id}`} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-primary)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500 }}>
                  <ArrowSquareOut size={18} />
                  Voir l'actualité publique
                </a>
              </div>
              <CloseButton onClick={() => setIsEditModalOpen(false)}>
                <X size={24} />
              </CloseButton>
            </ModalHeader>

            <div style={{ marginBottom: '2rem', display: 'grid', gap: '1rem' }}>
              <FormGroup>
                <Label>Titre</Label>
                <Input
                  type="text"
                  value={editingNews.title}
                  onChange={e => setEditingNews({ ...editingNews, title: e.target.value })}
                />
              </FormGroup>
              <FormGroup>
                <Label>Sous-titre</Label>
                <Input
                  type="text"
                  value={editingNews.subtitle}
                  onChange={e => setEditingNews({ ...editingNews, subtitle: e.target.value })}
                />
              </FormGroup>
              <FormGroup>
                <Label>Image de couverture</Label>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  {editingNews.preview && typeof editingNews.preview === 'string' && (
                    <img src={pb.files.getURL(editingNews, editingNews.preview)} alt="Preview" style={{ width: '60px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                  )}
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={e => {
                      if (e.target.files && e.target.files[0]) {
                        // Store the file object in a temporary property or handle it directly
                        // For simplicity, we'll attach it to the editingNews object but we need to handle it in save
                        setEditingNews({ ...editingNews, newPreview: e.target.files[0] } as any);
                      }
                    }}
                  />
                </div>
              </FormGroup>
            </div>

            <ArticleBlockEditor
              initialContent={editingNews.content}
              onSave={handleSaveEdit}
              onCancel={() => setIsEditModalOpen(false)}
            />
          </ModalContent>
        </ModalOverlay>
      )}
    </Container>
  );
}
