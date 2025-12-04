import styled from 'styled-components';

const DemoContainer = styled.div`
  padding: 2rem;
  background-color: var(--color-background);
  border: 1px solid var(--color-quaternary);
  margin-top: 2rem;
`;

const SectionTitle = styled.h3`
  color: var(--color-secondary);
  border-bottom: 2px solid var(--color-primary);
  padding-bottom: 0.5rem;
  margin-bottom: 1.5rem;
`;

const ColorGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const ColorBox = styled.div<{ $color: string }>`
  background-color: ${props => props.$color};
  height: 80px;
  border-radius: var(--border-radius);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.8rem;
  text-shadow: 0 1px 2px rgba(0,0,0,0.3);
  box-shadow: var(--shadow-sm);
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

const Button = styled.button<{ $variant?: 'primary' | 'secondary' | 'outline' }>`
  padding: 0.75rem 1.5rem;
  border-radius: var(--border-radius);
  font-weight: 600;
  transition: all 0.2s;
  
  ${props => props.$variant === 'primary' && `
    background-color: var(--color-primary);
    color: white;
    &:hover { background-color: var(--color-primary-light); }
  `}

  ${props => props.$variant === 'secondary' && `
    background-color: var(--color-secondary);
    color: white;
    &:hover { opacity: 0.9; }
  `}

  ${props => props.$variant === 'outline' && `
    background-color: transparent;
    border: 2px solid var(--color-primary);
    color: var(--color-primary);
    &:hover { background-color: var(--color-primary); color: white; }
  `}
`;

export default function DemoElements() {
  return (
    <DemoContainer>
      <SectionTitle>Design System Demo</SectionTitle>

      <h4>Colors</h4>
      <ColorGrid>
        <ColorBox $color="var(--color-primary)">Primary</ColorBox>
        <ColorBox $color="var(--color-secondary)">Secondary</ColorBox>
        <ColorBox $color="var(--color-tertiary)">Tertiary</ColorBox>
        <ColorBox $color="var(--color-quaternary)">Quaternary</ColorBox>
        <ColorBox $color="var(--color-green)">Green</ColorBox>
        <ColorBox $color="var(--color-mint)">Mint</ColorBox>
        <ColorBox $color="var(--color-olive)">Olive</ColorBox>
        <ColorBox $color="var(--color-taupe)">Taupe</ColorBox>
      </ColorGrid>

      <h4>Typography</h4>
      <div style={{ marginBottom: '2rem' }}>
        <h1>Heading 1 - Work Sans</h1>
        <h2>Heading 2 - Work Sans</h2>
        <h3>Heading 3 - Work Sans</h3>
        <p>Body text. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
        <small>Small text / Caption</small>
      </div>

      <h4>Buttons</h4>
      <ButtonGroup>
        <Button $variant="primary">Primary Button</Button>
        <Button $variant="secondary">Secondary Button</Button>
        <Button $variant="outline">Outline Button</Button>
      </ButtonGroup>

      <h4>Form Elements</h4>
      <div style={{ maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <input type="text" placeholder="Text Input" />
        <select>
          <option>Option 1</option>
          <option>Option 2</option>
        </select>
        <textarea placeholder="Textarea" rows={3}></textarea>
      </div>
    </DemoContainer>
  );
}
