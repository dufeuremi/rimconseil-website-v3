import { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Trash, TextT, TextAa, Image as ImageIcon, ListBullets, Link as LinkIcon, Note, CaretUp, CaretDown, TextB, TextItalic } from '@phosphor-icons/react';
import pb from '../../lib/pocketbase';

// Types based on user prompt
export type BlockType = 'title' | 'subtitle' | 'paragraph' | 'image' | 'list' | 'note' | 'link';

export interface ContentBlock {
  type: BlockType;
  value?: string;
  url?: string;
  caption?: string;
  items?: string[];
  id: string; // Internal ID for React keys
}

const EditorContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const BlockList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const BlockWrapper = styled.div`
  background: #f8fafc;
  border: 1px solid var(--color-quaternary);
  border-radius: 4px;
  padding: 1rem;
  position: relative;
  transition: box-shadow 0.2s;

  &:hover {
    box-shadow: var(--shadow-sm);
  }
`;

const BlockHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  color: var(--color-text-light);
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
`;

const BlockControls = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const IconButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-text-light);
  padding: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s;

  &:hover {
    color: var(--color-primary);
  }

  &.delete:hover {
    color: #e53e3e;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid var(--color-quaternary);
  border-radius: 4px;
  font-family: inherit;
  margin-bottom: 0.5rem;

  &:focus {
    outline: none;
    border-color: var(--color-primary);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid var(--color-quaternary);
  border-radius: 4px;
  font-family: inherit;
  min-height: 100px;
  resize: vertical;
  margin-bottom: 0.5rem;

  &:focus {
    outline: none;
    border-color: var(--color-primary);
  }
`;

const Toolbar = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  padding: 1rem;
  background: white;
  border: 1px solid var(--color-quaternary);
  border-radius: 4px;
  position: sticky;
  top: 0;
  z-index: 10;
`;

const ToolButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: white;
  border: 1px solid var(--color-quaternary);
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--color-text);
  transition: all 0.2s;

  &:hover {
    background: #f1f5f9;
    color: var(--color-primary);
    border-color: var(--color-primary);
  }
`;

const ActionButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--color-quaternary);
`;

const Button = styled.button<{ variant?: 'primary' | 'outline' }>`
  padding: 0.5rem 1.5rem;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  ${props => props.variant === 'primary' ? `
    background-color: var(--color-primary);
    color: white;
    border: none;
    &:hover { background-color: var(--color-secondary); }
  ` : `
    background-color: transparent;
    color: var(--color-text);
    border: 1px solid var(--color-quaternary);
    &:hover { background-color: #f8fafc; }
  `}
`;

// Link Selector Modal Component
const LinkSelector = ({
  onSelect,
  onClose
}: {
  onSelect: (url: string) => void;
  onClose: () => void;
}) => {
  const [activeTab, setActiveTab] = useState<'pages' | 'articles' | 'custom'>('pages');
  const [customUrl, setCustomUrl] = useState('');
  const [articles, setArticles] = useState<any[]>([]);
  const [news, setNews] = useState<any[]>([]);

  // Static pages list
  const staticPages = [
    { name: 'Accueil', url: '/' },
    { name: 'Expertises', url: '/expertises' },
    { name: 'Secteurs', url: '/secteurs' },
    { name: 'Equipe', url: '/equipe' },
    { name: 'RSE', url: '/rse' },
    { name: 'Carrières', url: '/carrieres' },
    { name: 'Contact', url: '/contact' },
    { name: 'Articles', url: '/articles' },
    { name: 'Actualités', url: '/actualites' },
  ];

  useEffect(() => {
    // Fetch articles and news for the list
    const fetchData = async () => {
      try {
        const articlesList = await pb.collection('articles').getFullList({ sort: '-created' });
        setArticles(articlesList);

        // Assuming 'news' collection exists, if not handle gracefully
        try {
          const newsList = await pb.collection('news').getFullList({ sort: '-created' });
          setNews(newsList);
        } catch (e) {
          console.log("News collection might not exist yet");
        }
      } catch (e) {
        console.error("Error fetching content for link selector", e);
      }
    };
    fetchData();
  }, []);

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.5)',
      zIndex: 2000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }} onClick={onClose}>
      <div style={{
        background: 'white',
        padding: '1.5rem',
        borderRadius: '8px',
        width: '400px',
        maxWidth: '90%',
        maxHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
      }} onClick={e => e.stopPropagation()}>
        <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--color-primary)' }}>Insérer un lien</h3>

        <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>
          <button
            onClick={() => setActiveTab('pages')}
            style={{
              padding: '0.5rem',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'pages' ? '2px solid var(--color-primary)' : 'none',
              fontWeight: activeTab === 'pages' ? 600 : 400,
              cursor: 'pointer'
            }}
          >Pages</button>
          <button
            onClick={() => setActiveTab('articles')}
            style={{
              padding: '0.5rem',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'articles' ? '2px solid var(--color-primary)' : 'none',
              fontWeight: activeTab === 'articles' ? 600 : 400,
              cursor: 'pointer'
            }}
          >Contenu</button>
          <button
            onClick={() => setActiveTab('custom')}
            style={{
              padding: '0.5rem',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'custom' ? '2px solid var(--color-primary)' : 'none',
              fontWeight: activeTab === 'custom' ? 600 : 400,
              cursor: 'pointer'
            }}
          >Personnalisé</button>
        </div>

        <div style={{ overflowY: 'auto', flex: 1, minHeight: '200px' }}>
          {activeTab === 'pages' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {staticPages.map(page => (
                <button
                  key={page.url}
                  onClick={() => onSelect(page.url)}
                  style={{
                    textAlign: 'left',
                    padding: '0.75rem',
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '0.9rem'
                  }}
                >
                  {page.name} <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>({page.url})</span>
                </button>
              ))}
            </div>
          )}

          {activeTab === 'articles' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <h4 style={{ fontSize: '0.9rem', color: '#64748b', margin: '0 0 0.5rem 0' }}>Articles</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {articles.map(article => (
                    <button
                      key={article.id}
                      onClick={() => onSelect(`/articles/${article.id}`)}
                      style={{
                        textAlign: 'left',
                        padding: '0.75rem',
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '0.9rem'
                      }}
                    >
                      {article.title}
                    </button>
                  ))}
                </div>
              </div>
              {news.length > 0 && (
                <div>
                  <h4 style={{ fontSize: '0.9rem', color: '#64748b', margin: '0 0 0.5rem 0' }}>Actualités</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {news.map(item => (
                      <button
                        key={item.id}
                        onClick={() => onSelect(`/actualites/${item.id}`)}
                        style={{
                          textAlign: 'left',
                          padding: '0.75rem',
                          background: '#f8fafc',
                          border: '1px solid #e2e8f0',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '0.9rem'
                        }}
                      >
                        {item.title}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'custom' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <Input
                value={customUrl}
                onChange={e => setCustomUrl(e.target.value)}
                placeholder="https://..."
                autoFocus
              />
              <Button variant="primary" onClick={() => onSelect(customUrl)}>Insérer le lien</Button>
            </div>
          )}
        </div>

        <Button variant="outline" onClick={onClose}>Annuler</Button>
      </div>
    </div>
  );
};

// WYSIWYG Editable Block
const EditableBlock = ({
  tagName: Tag,
  value,
  onChange,
  placeholder,
  className
}: {
  tagName: 'h2' | 'h3' | 'p' | 'div';
  value: string;
  onChange: (val: string) => void;
  placeholder: string;
  className?: string;
}) => {
  const [menuPosition, setMenuPosition] = useState<{ top: number; left: number } | null>(null);
  const [showLinkSelector, setShowLinkSelector] = useState(false);
  const contentRef = useRef<HTMLElement>(null);
  const savedSelection = useRef<Range | null>(null);

  // Initialize content only once to prevent cursor jumping
  useEffect(() => {
    if (contentRef.current && contentRef.current.innerHTML !== value) {
      contentRef.current.innerHTML = value;
    }
  }, []);

  const handleInput = () => {
    if (contentRef.current) {
      onChange(contentRef.current.innerHTML);
    }
  };

  const handleMouseUp = () => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) {
      setMenuPosition(null);
      return;
    }

    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();

    // Only show menu if selection is inside this component
    if (contentRef.current && contentRef.current.contains(selection.anchorNode)) {
      setMenuPosition({
        top: rect.top - 50,
        left: rect.left + (rect.width / 2)
      });
    } else {
      setMenuPosition(null);
    }
  };

  const applyFormat = (command: string, value?: string) => {
    // Restore selection if we have one saved (for link insertion)
    if (savedSelection.current) {
      const selection = window.getSelection();
      if (selection) {
        selection.removeAllRanges();
        selection.addRange(savedSelection.current);
      }
      savedSelection.current = null;
    }

    document.execCommand(command, false, value);
    if (contentRef.current) {
      onChange(contentRef.current.innerHTML);
    }
    setMenuPosition(null);
  };

  const handleLinkClick = () => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      savedSelection.current = selection.getRangeAt(0).cloneRange();
      setShowLinkSelector(true);
    }
  };

  return (
    <>
      <Tag
        ref={contentRef as any}
        className={className}
        contentEditable
        onInput={handleInput}
        onMouseUp={handleMouseUp}
        onBlur={handleInput}
        style={{
          outline: 'none',
          minHeight: '1.5em',
          emptyCells: 'show',
          padding: '0.5rem',
          border: '1px solid var(--color-quaternary)',
          borderRadius: '4px',
          background: 'white'
        }}
        data-placeholder={placeholder}
      />
      {menuPosition && (
        <div style={{
          position: 'fixed',
          top: menuPosition.top,
          left: menuPosition.left,
          background: '#1e293b',
          padding: '0.25rem',
          borderRadius: '6px',
          display: 'flex',
          gap: '0.25rem',
          zIndex: 1000,
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          transform: 'translateX(-50%)'
        }} onMouseDown={e => e.preventDefault()}>
          <IconButton onClick={() => applyFormat('bold')} style={{ color: 'white' }} title="Gras">
            <TextB size={20} weight="bold" />
          </IconButton>
          <IconButton onClick={() => applyFormat('italic')} style={{ color: 'white' }} title="Italique">
            <TextItalic size={20} />
          </IconButton>
          <IconButton onClick={handleLinkClick} style={{ color: 'white' }} title="Lien">
            <LinkIcon size={20} />
          </IconButton>
        </div>
      )}

      {showLinkSelector && (
        <LinkSelector
          onSelect={(url) => {
            applyFormat('createLink', url);
            setShowLinkSelector(false);
          }}
          onClose={() => setShowLinkSelector(false)}
        />
      )}

      <style>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #94a3b8;
          cursor: text;
        }
      `}</style>
    </>
  );
};

interface ArticleBlockEditorProps {
  initialContent: any;
  onSave: (contentJSON: string) => void;
  onCancel: () => void;
}

export default function ArticleBlockEditor({ initialContent, onSave, onCancel }: ArticleBlockEditorProps) {
  const [blocks, setBlocks] = useState<ContentBlock[]>([]);

  useEffect(() => {
    try {
      if (initialContent) {
        let parsed = initialContent;

        // If it's a string, try to parse it
        if (typeof initialContent === 'string') {
          try {
            parsed = JSON.parse(initialContent);
          } catch (e) {
            // Not JSON, treat as string
            parsed = initialContent;
          }
        }

        if (Array.isArray(parsed)) {
          setBlocks(parsed.map((b: any) => ({ ...b, id: crypto.randomUUID() })));
        } else if (typeof parsed === 'string') {
          // Fallback if it's a string (legacy content)
          setBlocks([{ type: 'paragraph', value: parsed, id: crypto.randomUUID() }]);
        } else {
          // Fallback for unknown object
          console.warn("Unknown content format:", parsed);
          setBlocks([]);
        }
      }
    } catch (e) {
      console.error("Error initializing editor:", e);
      if (typeof initialContent === 'string') {
        setBlocks([{ type: 'paragraph', value: initialContent, id: crypto.randomUUID() }]);
      }
    }
  }, [initialContent]);

  const addBlock = (type: BlockType) => {
    setBlocks([...blocks, { type, value: '', id: crypto.randomUUID(), items: type === 'list' ? [''] : undefined }]);
  };

  const updateBlock = (id: string, updates: Partial<ContentBlock>) => {
    setBlocks(blocks.map(b => b.id === id ? { ...b, ...updates } : b));
  };

  const removeBlock = (id: string) => {
    setBlocks(blocks.filter(b => b.id !== id));
  };

  const moveBlock = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === blocks.length - 1) return;

    const newBlocks = [...blocks];
    const temp = newBlocks[index];
    newBlocks[index] = newBlocks[index + (direction === 'up' ? -1 : 1)];
    newBlocks[index + (direction === 'up' ? -1 : 1)] = temp;
    setBlocks(newBlocks);
  };

  const handleSave = () => {
    // Remove internal IDs before saving
    const cleanBlocks = blocks.map(({ id, ...rest }) => rest);
    onSave(JSON.stringify(cleanBlocks));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, blockId: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // TODO: Implement actual upload logic here. 
    // For now, we'll use a placeholder or object URL to show it works in UI.
    // In a real app, you'd upload to PB and get the URL.
    // const formData = new FormData();
    // formData.append('file', file);
    // const record = await pb.collection('media').create(formData);
    // const url = pb.files.getURL(record, record.file);

    // Temporary: Create local object URL
    const url = URL.createObjectURL(file);
    updateBlock(blockId, { url });
  };

  const renderBlockInput = (block: ContentBlock) => {
    switch (block.type) {
      case 'title':
        return (
          <EditableBlock
            tagName="h2"
            value={block.value || ''}
            onChange={val => updateBlock(block.id, { value: val })}
            placeholder="Titre..."
            className="editor-title"
          />
        );
      case 'subtitle':
        return (
          <EditableBlock
            tagName="h3"
            value={block.value || ''}
            onChange={val => updateBlock(block.id, { value: val })}
            placeholder="Sous-titre..."
            className="editor-subtitle"
          />
        );
      case 'paragraph':
        return (
          <EditableBlock
            tagName="p"
            value={block.value || ''}
            onChange={val => updateBlock(block.id, { value: val })}
            placeholder="Écrivez votre paragraphe..."
            className="editor-paragraph"
          />
        );
      case 'note':
        return (
          <div style={{ background: '#f8fafc', padding: '1rem', borderLeft: '4px solid var(--color-primary)' }}>
            <EditableBlock
              tagName="div"
              value={block.value || ''}
              onChange={val => updateBlock(block.id, { value: val })}
              placeholder="Note importante..."
              className="editor-note"
            />
          </div>
        );
      case 'image':
        return (
          <>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <Input
                value={block.url || ''}
                onChange={e => updateBlock(block.id, { url: e.target.value })}
                placeholder="URL de l'image..."
                style={{ marginBottom: 0 }}
              />
              <label style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0 1rem',
                background: '#f1f5f9',
                border: '1px solid var(--color-quaternary)',
                borderRadius: '4px',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                fontSize: '0.85rem',
                fontWeight: 500
              }}>
                Importer
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={(e) => handleImageUpload(e, block.id)}
                />
              </label>
            </div>
            {block.url && (
              <img src={block.url} alt="Preview" style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'contain', borderRadius: '4px', border: '1px solid var(--color-quaternary)' }} />
            )}
          </>
        );
      case 'link':
        return (
          <>
            <Input
              value={block.url || ''}
              onChange={e => updateBlock(block.id, { url: e.target.value })}
              placeholder="URL du lien..."
            />
            <Input
              value={block.value || ''}
              onChange={e => updateBlock(block.id, { value: e.target.value })}
              placeholder="Texte du lien..."
            />
          </>
        );
      case 'list':
        return (
          <div>
            {(block.items || []).map((item, itemIndex) => (
              <div key={itemIndex} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <EditableBlock
                    tagName="div"
                    value={item}
                    onChange={val => {
                      const newItems = [...(block.items || [])];
                      newItems[itemIndex] = val;
                      updateBlock(block.id, { items: newItems });
                    }}
                    placeholder={`Élément ${itemIndex + 1}`}
                    className="editor-list-item"
                  />
                </div>
                <IconButton onClick={() => {
                  const newItems = (block.items || []).filter((_, i) => i !== itemIndex);
                  updateBlock(block.id, { items: newItems });
                }} className="delete" style={{ marginTop: '0.5rem' }}>
                  <Trash size={16} />
                </IconButton>
              </div>
            ))}
            <Button type="button" variant="outline" onClick={() => {
              const newItems = [...(block.items || []), ''];
              updateBlock(block.id, { items: newItems });
            }} style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem' }}>
              + Ajouter un élément
            </Button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <EditorContainer>
      <Toolbar>
        <ToolButton onClick={() => addBlock('title')}><TextT size={18} /> Titre</ToolButton>
        <ToolButton onClick={() => addBlock('subtitle')}><TextAa size={18} /> Sous-titre</ToolButton>
        <ToolButton onClick={() => addBlock('paragraph')}><TextAa size={18} /> Paragraphe</ToolButton>
        <ToolButton onClick={() => addBlock('image')}><ImageIcon size={18} /> Image</ToolButton>
        <ToolButton onClick={() => addBlock('list')}><ListBullets size={18} /> Liste</ToolButton>
        <ToolButton onClick={() => addBlock('note')}><Note size={18} /> Note</ToolButton>
        <ToolButton onClick={() => addBlock('link')}><LinkIcon size={18} /> Lien</ToolButton>
      </Toolbar>

      <BlockList>
        {blocks.map((block, index) => (
          <BlockWrapper key={block.id}>
            <BlockHeader>
              <span>{block.type}</span>
              <BlockControls>
                <IconButton onClick={() => moveBlock(index, 'up')} disabled={index === 0} title="Monter">
                  <CaretUp size={16} weight="bold" />
                </IconButton>
                <IconButton onClick={() => moveBlock(index, 'down')} disabled={index === blocks.length - 1} title="Descendre">
                  <CaretDown size={16} weight="bold" />
                </IconButton>
                <IconButton onClick={() => removeBlock(block.id)} className="delete" title="Supprimer">
                  <Trash size={16} />
                </IconButton>
              </BlockControls>
            </BlockHeader>
            {renderBlockInput(block)}
          </BlockWrapper>
        ))}
      </BlockList>

      <ActionButtons>
        <Button variant="outline" onClick={onCancel}>Annuler</Button>
        <Button variant="primary" onClick={handleSave}>Enregistrer les modifications</Button>
      </ActionButtons>
    </EditorContainer>
  );
}
