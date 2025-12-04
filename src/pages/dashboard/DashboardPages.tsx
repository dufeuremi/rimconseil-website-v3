import { useState, useEffect } from 'react';
import styled from 'styled-components';
import pb from '../../lib/pocketbase';
import { Pencil, ArrowSquareOut, X } from '@phosphor-icons/react';
import PageContentEditor from '../../components/dashboard/PageContentEditor';

interface PageRecord {
  id: string;
  url: string;
  content: any;
  updated: string;
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

const Content = styled.div`
  padding: 2rem;
  flex: 1;
  overflow-y: auto;
`;

const PagesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const PageCard = styled.div`
  background: white;
  border: 1px solid var(--color-quaternary);
  border-radius: 4px;
  padding: 1.5rem;
  transition: box-shadow 0.2s;
  display: flex;
  flex-direction: column;
  gap: 1rem;

  &:hover {
    box-shadow: var(--shadow-sm);
  }
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const PageTitle = styled.h3`
  margin: 0;
  font-size: 1.1rem;
  color: var(--color-secondary);
  font-family: var(--font-secondary);
`;

const PageUrl = styled.code`
  font-size: 0.85rem;
  color: var(--color-text-light);
  background: #f1f5f9;
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
`;

const ActionButton = styled.button`
  background: white;
  border: 1px solid var(--color-quaternary);
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--color-text);
  font-weight: 500;
  transition: all 0.2s;
  width: 100%;
  justify-content: center;

  &:hover {
    background: #f8fafc;
    color: var(--color-primary);
    border-color: var(--color-primary);
  }
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
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: var(--shadow-lg);
  border-radius: 8px;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--color-quaternary);
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

export default function DashboardPages() {
  const [pages, setPages] = useState<PageRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPage, setEditingPage] = useState<PageRecord | null>(null);

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      const records = await pb.collection('pages').getFullList<PageRecord>({
        sort: 'url',
      });
      setPages(records);
    } catch (err) {
      console.error("Error fetching pages:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (contentJSON: string) => {
    if (!editingPage) return;

    try {
      const updatedRecord = await pb.collection('pages').update(editingPage.id, {
        content: JSON.parse(contentJSON)
      });

      setPages(pages.map(p => p.id === editingPage.id ? updatedRecord : p));
      setEditingPage(null);
    } catch (err) {
      console.error("Error updating page:", err);
      alert("Erreur lors de la mise à jour de la page");
    }
  };

  return (
    <Container>
      <Header>
        <Title>Édition des Pages Dynamiques</Title>
      </Header>
      <Content>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-light)' }}>Chargement...</div>
        ) : (
          <PagesGrid>
            {pages.map(page => (
              <PageCard key={page.id}>
                <PageHeader>
                  <PageTitle>{page.url}</PageTitle>
                  <ArrowSquareOut size={20} color="var(--color-text-light)" />
                </PageHeader>
                <div style={{ flex: 1 }}>
                  <PageUrl>Dernière modif: {new Date(page.updated).toLocaleDateString()}</PageUrl>
                </div>
                <ActionButton onClick={() => setEditingPage(page)}>
                  <Pencil size={18} />
                  Modifier le contenu
                </ActionButton>
              </PageCard>
            ))}
          </PagesGrid>
        )}
      </Content>

      {editingPage && (
        <ModalOverlay onClick={() => setEditingPage(null)}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <ModalHeader>
              <Title>Édition : {editingPage.url}</Title>
              <CloseButton onClick={() => setEditingPage(null)}>
                <X size={24} />
              </CloseButton>
            </ModalHeader>

            <PageContentEditor
              initialContent={editingPage.content}
              onSave={handleSave}
              onCancel={() => setEditingPage(null)}
            />
          </ModalContent>
        </ModalOverlay>
      )}
    </Container>
  );
}
