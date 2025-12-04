import { useState } from 'react';
import styled from 'styled-components';
import { EnvelopeSimple, MapPin } from '@phosphor-icons/react';
import PageContainer from '../components/PageContainer';
import pb from '../lib/pocketbase';

const ContactHeader = styled.div`
  text-align: left;
  margin-bottom: 3rem;
`;

const PageTitle = styled.h1`
  font-family: var(--font-secondary);
  font-size: 3rem;
  color: var(--color-primary);
  margin-bottom: 1rem;
`;

const ContactSubtitle = styled.p`
  font-size: 1.125rem;
  max-width: 600px;
  color: var(--color-text-light);
`;

const ContactGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  margin-bottom: 3rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ContactInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const InfoCard = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1.5rem;
  background: white;
  border: 1px solid var(--color-quaternary);
  border-radius: var(--border-radius);
  text-align: left;

  svg {
    font-size: 1.5rem;
    color: var(--color-primary);
  }
`;

const InfoContent = styled.div`
  text-align: left;

  h3 {
    color: var(--color-secondary);
    margin-bottom: 0.5rem;
    text-align: left;
    font-size: 1.1rem;
    font-weight: 600;
  }
  
  p, a {
    color: var(--color-text);
    font-size: 0.95rem;
    line-height: 1.5;
  }
`;

const ContactForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 2rem;
  background: white;
  border: 1px solid var(--color-quaternary);
  border-radius: var(--border-radius);
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormActions = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-top: 1rem;
  text-align: left;
`;

const ErrorMessage = styled.div`
  background-color: rgba(229, 62, 62, 0.1);
  color: #e53e3e;
  padding: 1rem;
  margin-bottom: 1rem;
  border-left: 3px solid #e53e3e;
  font-size: 0.9rem;
`;

const SuccessMessage = styled.div`
  background-color: rgba(46, 139, 87, 0.1);
  color: var(--color-green);
  padding: 1rem;
  margin-bottom: 1rem;
  border-left: 3px solid var(--color-green);
  font-size: 0.9rem;
`;

// Styled Form Elements
const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 500;
  font-size: 0.9rem;
  color: var(--color-secondary);
`;

const StyledInput = styled.input`
  /* Styles are inherited from index.css mostly, but we can enforce here */
  width: 100%;
`;

const StyledTextarea = styled.textarea`
  width: 100%;
  min-height: 150px;
  resize: vertical;
`;

const SubmitButton = styled.button`
  background-color: var(--color-primary);
  color: white;
  padding: 0.75rem 2rem;
  border-radius: var(--border-radius);
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.2s;
  box-shadow: var(--shadow-sm);

  &:hover {
    background-color: var(--color-primary-light);
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }
`;

export default function Contact() {
  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    email: '',
    telephone: '',
    sujet: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const messageData = {
        ...formData,
        date: new Date().toISOString(),
        status: 0 // 0 = non traité
      };

      // Save to PocketBase - Commented out as collection might not exist
      // await pb.collection('messages').create(messageData);

      // Prepare HTML email content
      const htmlBody = `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #334155; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);">
          <div style="background-color: #1e293b; padding: 30px 20px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 600;">Nouveau Message</h1>
            <p style="color: #94a3b8; margin: 10px 0 0 0; font-size: 14px;">Reçu via le formulaire de contact RIM Conseil</p>
          </div>
          
          <div style="padding: 30px;">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
              <div>
                <p style="margin: 0; font-size: 12px; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600;">Expéditeur</p>
                <p style="margin: 5px 0 0 0; font-size: 16px; color: #0f172a; font-weight: 500;">${formData.prenom} ${formData.nom}</p>
              </div>
              <div>
                <p style="margin: 0; font-size: 12px; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600;">Contact</p>
                <p style="margin: 5px 0 0 0; font-size: 14px; color: #0f172a;"><a href="mailto:${formData.email}" style="color: #2563eb; text-decoration: none;">${formData.email}</a></p>
                ${formData.telephone ? `<p style="margin: 5px 0 0 0; font-size: 14px; color: #0f172a;">${formData.telephone}</p>` : ''}
              </div>
            </div>

            <div style="margin-bottom: 25px;">
              <p style="margin: 0; font-size: 12px; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600;">Sujet</p>
              <p style="margin: 5px 0 0 0; font-size: 16px; color: #0f172a; font-weight: 500;">${formData.sujet}</p>
            </div>

            <div style="background-color: #f8fafc; border-left: 4px solid #2563eb; padding: 20px; border-radius: 4px;">
              <p style="margin: 0; font-size: 12px; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600; margin-bottom: 10px;">Message</p>
              <div style="color: #334155; line-height: 1.6; white-space: pre-wrap;">${formData.message}</div>
            </div>
          </div>

          <div style="background-color: #f1f5f9; padding: 15px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0;">
            © ${new Date().getFullYear()} RIM Conseil. Tous droits réservés.
          </div>
        </div>
      `;

      // Send to webhook
      await fetch('https://host.taskalys.app/webhook/rimconseil', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          html: htmlBody,
          subject: `Nouveau contact : ${formData.sujet}`,
          ...formData
        }),
      });

      setSuccess('Votre message a été envoyé avec succès. Nous vous répondrons dans les plus brefs délais.');

      setFormData({
        prenom: '',
        nom: '',
        email: '',
        telephone: '',
        sujet: '',
        message: ''
      });

    } catch (err: any) {
      console.error('Erreur lors de l\'envoi du message:', err);
      setError('Une erreur est survenue lors de l\'envoi de votre message. Veuillez réessayer ultérieurement.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <ContactHeader>
        <PageTitle>Contactez-nous</PageTitle>
        <ContactSubtitle>
          Nous vous répondrons dans les plus brefs délais.
        </ContactSubtitle>
      </ContactHeader>

      <ContactGrid>
        <ContactForm onSubmit={handleSubmit}>
          {error && <ErrorMessage>{error}</ErrorMessage>}
          {success && <SuccessMessage>{success}</SuccessMessage>}

          <FormRow>
            <FormGroup>
              <Label htmlFor="prenom">Prénom *</Label>
              <StyledInput
                id="prenom"
                type="text"
                name="prenom"
                value={formData.prenom}
                onChange={handleChange}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="nom">Nom *</Label>
              <StyledInput
                id="nom"
                type="text"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                required
              />
            </FormGroup>
          </FormRow>

          <FormRow>
            <FormGroup>
              <Label htmlFor="email">Email *</Label>
              <StyledInput
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="telephone">Téléphone</Label>
              <StyledInput
                id="telephone"
                type="tel"
                name="telephone"
                value={formData.telephone}
                onChange={handleChange}
              />
            </FormGroup>
          </FormRow>

          <FormGroup>
            <Label htmlFor="sujet">Sujet *</Label>
            <StyledInput
              id="sujet"
              type="text"
              name="sujet"
              value={formData.sujet}
              onChange={handleChange}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="message">Message *</Label>
            <StyledTextarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
            />
          </FormGroup>

          <FormActions>
            <SubmitButton
              type="submit"
              disabled={loading}
            >
              {loading ? 'Envoi en cours...' : 'Envoyer'}
            </SubmitButton>
          </FormActions>
        </ContactForm>

        <ContactInfo>
          <InfoCard>
            <MapPin weight="fill" />
            <InfoContent>
              <h3>Adresse</h3>
              <p>7 RUE GOUNOD<br />35000 RENNES</p>
            </InfoContent>
          </InfoCard>

          <InfoCard>
            <EnvelopeSimple weight="fill" />
            <InfoContent>
              <h3>Email</h3>
              <a href="mailto:info@rimconseil.fr" style={{ textDecoration: 'none' }}>
                info@rimconseil.fr
              </a>
            </InfoContent>
          </InfoCard>
        </ContactInfo>
      </ContactGrid>
    </PageContainer>
  );
}
