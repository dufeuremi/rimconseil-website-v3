import styled from 'styled-components';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
}

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
`;

const Label = styled.label`
  font-weight: 500;
  font-size: 0.9rem;
  color: var(--color-secondary);
  text-align: left;
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid var(--color-quaternary);
  border-radius: var(--border-radius);
  font-family: var(--font-primary);
  font-size: 1rem;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px rgba(44, 119, 227, 0.1);
  }
`;

const Input: React.FC<InputProps> = ({ label, id, ...props }) => {
    const inputId = id || props.name;

    return (
        <InputContainer>
            {label && <Label htmlFor={inputId}>{label}</Label>}
            <StyledInput id={inputId} {...props} />
        </InputContainer>
    );
};

export default Input;
