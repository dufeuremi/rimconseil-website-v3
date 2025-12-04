import { useState, useEffect } from 'react';
import styled from 'styled-components';
import pb from '../../lib/pocketbase';
import { Pencil, Trash, CalendarBlank, Tag, Plus, X, ArrowSquareOut } from '@phosphor-icons/react';
import ArticleBlockEditor from '../../components/dashboard/ArticleBlockEditor';

// Types
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

const ArticleCard = styled.div`
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

const ArticleImage = styled.img`
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

export default function DashboardArticles() {
  const [articles, setArticles] = useState<ArticleRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<ArticleRecord | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newArticle, setNewArticle] = useState({
    title: '',
    subtitle: '',
    content: '',
    tags: '',
    date: new Date().toISOString().split('T')[0],
    is_online: true,
    preview: null as File | null
  });

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const records = await pb.collection('articles').getFullList<ArticleRecord>({
        sort: '-date',
      });
      // Ensure is_online field exists (mock if missing for now)
      const recordsWithPublished = records.map(r => ({
        ...r,
        is_online: r.is_online ?? false // Default to false if missing
      }));
      setArticles(recordsWithPublished);
    } catch (err) {
      console.error("Error fetching articles:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await pb.collection('articles').delete(deleteId);
      setArticles(articles.filter(item => item.id !== deleteId));
      setDeleteId(null);
    } catch (err) {
      console.error("Error deleting article:", err);
      alert("Erreur lors de la suppression");
    }
  };

  const handleToggleOnline = async (id: string, currentStatus: boolean) => {
    try {
      // Optimistic update
      setArticles(articles.map(item =>
        item.id === id ? { ...item, is_online: !currentStatus } : item
      ));

      await pb.collection('articles').update(id, {
        is_online: !currentStatus
      });
    } catch (err: any) {
      console.error("Error updating status:", err);
      // Revert on error
      setArticles(articles.map(item =>
        item.id === id ? { ...item, is_online: currentStatus } : item
      ));

      // More detailed error message
      const errorMessage = err?.message || "Erreur lors de la mise à jour du statut";
      alert(`Erreur: ${errorMessage}`);
    }
  };

  const handleEdit = (id: string) => {
    const article = articles.find(a => a.id === id);
    if (article) {
      setEditingArticle(article);
      setIsEditModalOpen(true);
    }
  };

  const handleSaveEdit = async (contentJSON: string) => {
    if (!editingArticle) return;

    try {
      const formData = new FormData();
      formData.append('title', editingArticle.title);
      formData.append('subtitle', editingArticle.subtitle);
      formData.append('content', contentJSON);

      if ((editingArticle as any).newPreview) {
        formData.append('preview', (editingArticle as any).newPreview);
      }

      const updatedRecord = await pb.collection('articles').update(editingArticle.id, formData);

      // Update local state
      setArticles(articles.map(a =>
        a.id === editingArticle.id ? updatedRecord : a
      ));

      setIsEditModalOpen(false);
      setEditingArticle(null);
    } catch (err) {
      console.error("Error updating article:", err);
      alert("Erreur lors de la mise à jour de l'article");
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('title', newArticle.title);
      formData.append('subtitle', newArticle.subtitle);
      formData.append('content', newArticle.content);
      formData.append('tags', newArticle.tags);
      formData.append('date', new Date(newArticle.date).toISOString());
      formData.append('is_online', newArticle.is_online.toString());

      if (newArticle.preview) {
        formData.append('preview', newArticle.preview);
      }

      const record = await pb.collection('articles').create<ArticleRecord>(formData);

      setArticles([record, ...articles]);
      setIsAddModalOpen(false);
      setNewArticle({
        title: '',
        subtitle: '',
        content: '',
        tags: '',
        date: new Date().toISOString().split('T')[0],
        is_online: true,
        preview: null
      });

    } catch (err) {
      console.error("Error creating article:", err);
      alert("Erreur lors de la création de l'article");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewArticle({ ...newArticle, preview: e.target.files[0] });
    }
  };

  const getImageUrl = (record: ArticleRecord) => {
    if (!record.preview) return 'https://placehold.co/600x400?text=No+Image';
    return pb.files.getURL(record, record.preview);
  };

  return (
    <Container>
      <Header>
        <Title>Édition Articles</Title>
        <AddButton onClick={() => setIsAddModalOpen(true)}>
          <Plus size={16} weight="bold" />
          Nouvel article
        </AddButton>
      </Header>
      <Content>
        {loading ? (
          <LoadingMessage>Chargement...</LoadingMessage>
        ) : (
          <>
            {articles.map((item) => (
              <ArticleCard key={item.id}>
                <ImageContainer>
                  <ArticleImage src={getImageUrl(item)} alt={item.title} />
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
                  <ActionButton onClick={() => window.open(`/articles/${item.id}`, '_blank')}>
                    <ArrowSquareOut size={18} />
                    Voir
                  </ActionButton>
                  <ActionButton className="delete" onClick={() => setDeleteId(item.id)}>
                    <Trash size={18} />
                    Supprimer
                  </ActionButton>
                </ActionsColumn>
              </ArticleCard>
            ))}

            {articles.length === 0 && (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-light)' }}>
                Aucun article trouvé
              </div>
            )}
          </>
        )}
      </Content>

      {deleteId && (
        <ModalOverlay onClick={() => setDeleteId(null)}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <ModalTitle>Confirmer la suppression</ModalTitle>
            <p>Êtes-vous sûr de vouloir supprimer cet article ? Cette action est irréversible.</p>
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
              <ModalTitle>Nouvel article</ModalTitle>
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
                  value={newArticle.title}
                  onChange={e => setNewArticle({ ...newArticle, title: e.target.value })}
                  placeholder="Titre de l'article"
                />
              </FormGroup>

              <FormGroup>
                <Label>Sous-titre</Label>
                <Input
                  type="text"
                  value={newArticle.subtitle}
                  onChange={e => setNewArticle({ ...newArticle, subtitle: e.target.value })}
                  placeholder="Court résumé..."
                />
              </FormGroup>

              <FormGroup>
                <Label>Date</Label>
                <Input
                  type="date"
                  required
                  value={newArticle.date}
                  onChange={e => setNewArticle({ ...newArticle, date: e.target.value })}
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
                  value={newArticle.tags}
                  onChange={e => setNewArticle({ ...newArticle, tags: e.target.value })}
                  placeholder="Ex: Innovation, Tech, RSE"
                />
              </FormGroup>

              <FormGroup>
                <Label>Contenu</Label>
                <TextArea
                  required
                  value={newArticle.content}
                  onChange={e => setNewArticle({ ...newArticle, content: e.target.value })}
                  placeholder="Contenu de l'article..."
                />
              </FormGroup>

              <FormGroup>
                <CheckboxLabel>
                  <input
                    type="checkbox"
                    checked={newArticle.is_online}
                    onChange={e => setNewArticle({ ...newArticle, is_online: e.target.checked })}
                  />
                  Publier immédiatement
                </CheckboxLabel>
              </FormGroup>

              <ModalActions>
                <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>
                  Annuler
                </Button>
                <Button type="submit" variant="primary" style={{ backgroundColor: 'var(--color-primary)', color: 'white' }} disabled={isSubmitting}>
                  {isSubmitting ? 'Création...' : 'Créer l\'article'}
                </Button>
              </ModalActions>
            </form>
          </ModalContent>
        </ModalOverlay>
      )}
      {isEditModalOpen && editingArticle && (
        <ModalOverlay onClick={() => setIsEditModalOpen(false)}>
          <ModalContent onClick={e => e.stopPropagation()} style={{ maxWidth: '1000px', width: '90%', maxHeight: '90vh', overflowY: 'auto' }}>
            <ModalHeader>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <ModalTitle>Éditer l'article : {editingArticle.title}</ModalTitle>
                <a href={`/articles/${editingArticle.id}`} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-primary)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500 }}>
                  <ArrowSquareOut size={18} />
                  Voir l'article public
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
                  value={editingArticle.title}
                  onChange={e => setEditingArticle({ ...editingArticle, title: e.target.value })}
                />
              </FormGroup>
              <FormGroup>
                <Label>Sous-titre</Label>
                <Input
                  type="text"
                  value={editingArticle.subtitle}
                  onChange={e => setEditingArticle({ ...editingArticle, subtitle: e.target.value })}
                />
              </FormGroup>
              <FormGroup>
                <Label>Image de couverture</Label>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  {editingArticle.preview && typeof editingArticle.preview === 'string' && (
                    <img src={pb.files.getURL(editingArticle, editingArticle.preview)} alt="Preview" style={{ width: '60px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                  )}
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={e => {
                      if (e.target.files && e.target.files[0]) {
                        // Store the file object in a temporary property
                        setEditingArticle({ ...editingArticle, newPreview: e.target.files[0] } as any);
                      }
                    }}
                  />
                </div>
              </FormGroup>
            </div>

            <ArticleBlockEditor
              initialContent={editingArticle.content}
              onSave={handleSaveEdit}
              onCancel={() => setIsEditModalOpen(false)}
            />
          </ModalContent>
        </ModalOverlay>
      )}
    </Container>
  );
}
