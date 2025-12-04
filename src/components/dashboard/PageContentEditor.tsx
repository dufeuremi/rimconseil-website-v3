import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { CaretDown, CaretUp, Trash, Plus } from '@phosphor-icons/react';

const EditorContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem;
  background: #f8fafc;
  border: 1px solid var(--color-quaternary);
  border-radius: 4px;
`;

const Label = styled.label`
  font-weight: 600;
  color: var(--color-primary);
  font-size: 0.9rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.5rem;
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
  padding: 0.5rem;
  border: 1px solid var(--color-quaternary);
  border-radius: 4px;
  font-family: inherit;
  min-height: 100px;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: var(--color-primary);
  }
`;

const Button = styled.button<{ variant?: 'primary' | 'danger' | 'outline' }>`
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;

  ${props => props.variant === 'primary' ? `
    background-color: var(--color-primary);
    color: white;
    border: none;
    &:hover { background-color: var(--color-secondary); }
  ` : props.variant === 'danger' ? `
    background-color: #fee2e2;
    color: #ef4444;
    border: 1px solid #fecaca;
    &:hover { background-color: #fecaca; }
  ` : `
    background-color: white;
    color: var(--color-text);
    border: 1px solid var(--color-quaternary);
    &:hover { background-color: #f8fafc; }
  `}
`;

const ArrayItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  background: white;
  border: 1px solid var(--color-quaternary);
  border-radius: 4px;
  position: relative;
`;

const ArrayControls = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
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

// Helper to determine field type
const getFieldType = (value: any): 'string' | 'number' | 'boolean' | 'array' | 'object' | 'longString' => {
    if (Array.isArray(value)) return 'array';
    if (typeof value === 'object' && value !== null) return 'object';
    if (typeof value === 'string' && value.length > 100) return 'longString';
    return typeof value as any;
};

// Recursive Field Component
const RecursiveField = ({
    label,
    value,
    onChange,
    path = ''
}: {
    label: string;
    value: any;
    onChange: (val: any) => void;
    path?: string;
}) => {
    const type = getFieldType(value);

    if (type === 'object') {
        return (
            <FieldGroup>
                <Label>{label}</Label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', paddingLeft: '1rem', borderLeft: '2px solid #e2e8f0' }}>
                    {Object.entries(value).map(([key, val]) => (
                        <RecursiveField
                            key={key}
                            label={key}
                            value={val}
                            onChange={(newVal) => onChange({ ...value, [key]: newVal })}
                            path={`${path}.${key}`}
                        />
                    ))}
                </div>
            </FieldGroup>
        );
    }

    if (type === 'array') {
        return (
            <FieldGroup>
                <Label>
                    {label} ({value.length} items)
                    <Button variant="outline" onClick={() => {
                        // Try to guess the structure of a new item based on existing items
                        const template = value.length > 0 ? JSON.parse(JSON.stringify(value[0])) : {};
                        // Clear values in template
                        const clearValues = (obj: any): any => {
                            if (typeof obj === 'string') return '';
                            if (typeof obj === 'number') return 0;
                            if (typeof obj === 'boolean') return false;
                            if (Array.isArray(obj)) return [];
                            if (typeof obj === 'object' && obj !== null) {
                                const newObj: any = {};
                                for (const k in obj) newObj[k] = clearValues(obj[k]);
                                return newObj;
                            }
                            return null;
                        };
                        onChange([...value, value.length > 0 ? clearValues(template) : ""]);
                    }}>
                        <Plus size={14} weight="bold" /> Ajouter
                    </Button>
                </Label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {value.map((item: any, index: number) => (
                        <ArrayItem key={index}>
                            <ArrayControls>
                                <span style={{ marginRight: 'auto', fontWeight: 600, fontSize: '0.8rem', color: '#94a3b8' }}>Item {index + 1}</span>
                                <IconButton onClick={() => {
                                    if (index === 0) return;
                                    const newArr = [...value];
                                    [newArr[index - 1], newArr[index]] = [newArr[index], newArr[index - 1]];
                                    onChange(newArr);
                                }} disabled={index === 0}>
                                    <CaretUp size={16} />
                                </IconButton>
                                <IconButton onClick={() => {
                                    if (index === value.length - 1) return;
                                    const newArr = [...value];
                                    [newArr[index + 1], newArr[index]] = [newArr[index], newArr[index + 1]];
                                    onChange(newArr);
                                }} disabled={index === value.length - 1}>
                                    <CaretDown size={16} />
                                </IconButton>
                                <IconButton className="delete" onClick={() => {
                                    onChange(value.filter((_: any, i: number) => i !== index));
                                }}>
                                    <Trash size={16} />
                                </IconButton>
                            </ArrayControls>
                            <RecursiveField
                                label={`Item ${index + 1}`}
                                value={item}
                                onChange={(newVal) => {
                                    const newArr = [...value];
                                    newArr[index] = newVal;
                                    onChange(newArr);
                                }}
                                path={`${path}[${index}]`}
                            />
                        </ArrayItem>
                    ))}
                </div>
            </FieldGroup>
        );
    }

    if (type === 'longString') {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <Label>{label}</Label>
                <TextArea value={value} onChange={(e) => onChange(e.target.value)} />
            </div>
        );
    }

    // Handle Image fields specifically if key contains 'image' or 'icon'
    if (typeof value === 'string' && (label.toLowerCase().includes('image') || label.toLowerCase().includes('icon'))) {
        return null;
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <Label>{label}</Label>
            <Input
                type={type === 'number' ? 'number' : 'text'}
                value={value}
                onChange={(e) => onChange(type === 'number' ? Number(e.target.value) : e.target.value)}
            />
        </div>
    );
};

interface PageContentEditorProps {
    initialContent: any;
    onSave: (contentJSON: string) => void;
    onCancel: () => void;
}

export default function PageContentEditor({ initialContent, onSave, onCancel }: PageContentEditorProps) {
    const [content, setContent] = useState<any>(null);

    useEffect(() => {
        if (initialContent) {
            try {
                const parsed = typeof initialContent === 'string' ? JSON.parse(initialContent) : initialContent;
                setContent(parsed);
            } catch (e) {
                console.error("Error parsing content:", e);
                setContent({});
            }
        } else {
            setContent({});
        }
    }, [initialContent]);

    if (!content) return <div>Chargement...</div>;

    return (
        <EditorContainer>
            <div style={{ maxHeight: '70vh', overflowY: 'auto', padding: '1rem' }}>
                {Object.entries(content).map(([key, value]) => (
                    <div key={key} style={{ marginBottom: '1.5rem' }}>
                        <RecursiveField
                            label={key}
                            value={value}
                            onChange={(newVal) => setContent({ ...content, [key]: newVal })}
                        />
                    </div>
                ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0' }}>
                <Button variant="outline" onClick={onCancel}>Annuler</Button>
                <Button variant="primary" onClick={() => onSave(JSON.stringify(content))}>Enregistrer</Button>
            </div>
        </EditorContainer>
    );
}
