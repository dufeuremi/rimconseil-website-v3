import styled, { css } from 'styled-components';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline';
    fullWidth?: boolean;
}

const StyledButton = styled.button<ButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  border-radius: var(--border-radius);
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.2s ease-in-out;
  cursor: pointer;
  border: 2px solid transparent;
  gap: 0.5rem;

  ${props => props.fullWidth && css`
    width: 100%;
  `}

  ${props => props.variant === 'primary' && css`
    background-color: var(--color-primary);
    color: white;
    &:hover {
      background-color: var(--color-primary-light);
    }
    &:disabled {
      background-color: var(--color-tertiary);
      cursor: not-allowed;
    }
  `}

  ${props => props.variant === 'secondary' && css`
    background-color: var(--color-secondary);
    color: white;
    &:hover {
      opacity: 0.9;
    }
  `}

  ${props => props.variant === 'outline' && css`
    background-color: transparent;
    border-color: var(--color-primary);
    color: var(--color-primary);
    &:hover {
      background-color: var(--color-primary);
      color: white;
    }
  `}
`;

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', ...props }) => {
    return (
        <StyledButton variant={variant} {...props}>
            {children}
        </StyledButton>
    );
};

export default Button;
