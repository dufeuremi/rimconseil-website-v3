import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import Input from '../components/Input';
import Button from '../components/Button';
import logoSrc from '../assets/logo.svg';
import textureWaves from '../assets/texturewaves.jpg';
import pb from '../lib/pocketbase';

const LoginContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  position: relative;
  overflow: hidden;
`;

const Background = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url(${textureWaves});
  background-size: cover;
  background-position: center;
  z-index: -1;
  opacity: 0.08;
`;

const LoginCard = styled.div`
  width: 100%;
  max-width: 400px;
  padding: 2.5rem 2rem;
  /* background-color: white; Removed as requested */
  /* box-shadow: var(--shadow-md); Removed as requested */
  /* border-radius: var(--border-radius); */
  /* border: 1px solid var(--color-quaternary); Removed as requested */
  text-align: center;
`;

const Logo = styled.img`
  height: 40px;
  margin-bottom: 2rem;
  
  &.error {
    display: none;
  }
`;

const LogoFallback = styled.div`
  display: none;
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-primary);
  margin-bottom: 2rem;
  
  &.visible {
    display: block;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const ErrorMessage = styled.div`
  color: #e53e3e;
  font-size: 0.875rem;
  margin-top: 1rem;
  margin-bottom: 1rem;
  padding: 0.5rem;
  background-color: rgba(229, 62, 62, 0.1);
  border-radius: 4px;
  text-align: center;
`;

const SuccessMessage = styled.div`
  color: #38a169;
  font-size: 0.875rem;
  margin-top: 1rem;
  margin-bottom: 1rem;
  padding: 0.5rem;
  background-color: rgba(56, 161, 105, 0.1);
  border-radius: 4px;
  text-align: center;
`;

const Connexion = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [imageError, setImageError] = useState(false);

    // Check auth state on mount
    useEffect(() => {
        if (pb.authStore.isValid) {
            const from = location.state?.from?.pathname || '/dashboard/pages';
            navigate(from, { replace: true });
        }
    }, [navigate, location]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!formData.email || !formData.password) {
            setError('Veuillez remplir tous les champs');
            return;
        }

        try {
            setLoading(true);

            // PocketBase authentication
            await pb.collection('users').authWithPassword(
                formData.email,
                formData.password
            );

            if (pb.authStore.isValid) {
                setSuccess('Connexion réussie');
                // Small delay to show success message
                setTimeout(() => {
                    const from = location.state?.from?.pathname || '/dashboard/pages';
                    navigate(from, { replace: true });
                }, 500);
            } else {
                setError('Identifiants incorrects');
            }

        } catch (err: any) {
            console.error('Erreur d\'authentification:', err);
            // PocketBase throws 400 for invalid credentials
            if (err.status === 400) {
                setError('Email ou mot de passe incorrect');
            } else {
                setError('Une erreur est survenue lors de la connexion');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleImageError = () => {
        setImageError(true);
    };

    return (
        <LoginContainer>
            <Background />
            <LoginCard>
                <Logo
                    src={logoSrc}
                    alt="rim'conseil logo"
                    className={imageError ? 'error' : ''}
                    onError={handleImageError}
                />
                <LogoFallback className={imageError ? 'visible' : ''}>
                    RIM CONSEIL
                </LogoFallback>

                {error && <ErrorMessage>{error}</ErrorMessage>}
                {success && <SuccessMessage>{success}</SuccessMessage>}

                <Form onSubmit={handleSubmit}>
                    <Input
                        label="Email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />

                    <Input
                        label="Mot de passe"
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />

                    <Button
                        type="submit"
                        fullWidth
                        disabled={loading}
                    >
                        {loading ? 'Connexion en cours...' : 'Se connecter'}
                    </Button>
                </Form>
            </LoginCard>
        </LoginContainer>
    );
};

export default Connexion;
