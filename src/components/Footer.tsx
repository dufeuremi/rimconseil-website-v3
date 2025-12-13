import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Leaf } from '@phosphor-icons/react';
import logoNormal from '../assets/logo.svg';

const LogoImg = styled.img`
  height: 60px;
  width: auto;
  margin-bottom: 0.5rem;

  @media (max-width: 768px) {
    height: 40px;
  }
`;

const FooterContainer = styled.footer`
  background-color: transparent;
  border-top: 1px solid var(--color-quaternary);
  padding: 4rem 0 2rem;
  margin-top: auto;
`;

const FooterContent = styled.div`
  max-width: 1664px;
  margin: 0 auto;
  padding: 0 5rem;

  @media (max-width: 768px) {
    padding: 0 2rem;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr 1fr;
  gap: 3rem;
  margin-bottom: 4rem;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr 1fr;
    gap: 2rem 1rem;
    
    /* Make Brand section span full width on mobile */
    & > div:first-child {
      grid-column: 1 / -1;
      text-align: center;
      align-items: center;
    }
    
    /* Make Contact section span full width on mobile */
    & > div:last-child {
      grid-column: 1 / -1;
      text-align: left;
    }
  }
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const BrandSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;

  @media (max-width: 640px) {
    align-items: center;
  }
`;



const Slogan = styled.p`
  font-style: italic;
  color: var(--color-text-light);
  font-size: 0.95rem;
`;

const EcoBlock = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  background-color: rgba(46, 139, 87, 0.05);
  padding: 1rem;
  border-radius: var(--border-radius);
  border: 1px solid rgba(46, 139, 87, 0.1);
`;

const EcoText = styled.p`
  font-size: 0.85rem;
  color: var(--color-green);
  line-height: 1.4;
`;

const ColumnTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-secondary);
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const FooterLink = styled(Link)`
  color: var(--color-text-light);
  font-size: 0.95rem;
  transition: color 0.2s;

  &:hover {
    color: var(--color-primary);
    text-decoration: none;
  }
`;

const ContactInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-size: 0.95rem;
  color: var(--color-text-light);

  @media (max-width: 640px) {
    align-items: flex-start;
  }
`;

const MailLink = styled.a`
  color: var(--color-primary);
  font-weight: 500;
  
  &:hover {
    text-decoration: underline;
  }
`;

const BottomBar = styled.div`
  border-top: 1px solid var(--color-quaternary);
  padding-top: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  font-size: 0.85rem;
  color: var(--color-text-light);

  @media (max-width: 640px) {
    flex-direction: column;
    text-align: center;
  }
`;

const LegalLinks = styled.div`
  display: flex;
  gap: 1.5rem;
`;

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <FooterContainer>
      <FooterContent>
        <Grid>
          {/* Column 1: Brand & Eco */}
          <Column>
            <BrandSection>
              <LogoImg src={logoNormal} alt="RIM CONSEIL" />
              <Slogan>Piloter l'IT avec sens.</Slogan>
            </BrandSection>
            <EcoBlock>
              <Leaf size={24} color="var(--color-green)" weight="fill" />
              <EcoText>
                Site éco-conçu et hébergé en France.<br />
                Site réalisé par Rémi Dufeu
              </EcoText>
            </EcoBlock>
          </Column>

          {/* Column 2: Navigation 1 */}
          <Column>
            <ColumnTitle>Navigation</ColumnTitle>
            <FooterLink to="/">Accueil</FooterLink>
            <FooterLink to="/expertises">Nos expertises</FooterLink>
            <FooterLink to="/services">Nos services</FooterLink>
            <FooterLink to="/valeurs">Nos valeurs</FooterLink>
            <FooterLink to="/equipe">Notre équipe</FooterLink>
          </Column>

          {/* Column 3: Navigation 2 */}
          <Column>
            <ColumnTitle style={{ opacity: 0 }}>Suite</ColumnTitle> {/* Spacer for alignment */}
            <FooterLink to="/reseau">Notre réseau</FooterLink>
            <FooterLink to="/articles">Articles</FooterLink>
            <FooterLink to="/actualites">Actualités</FooterLink>
            <FooterLink to="/contact">Contact</FooterLink>
            <FooterLink to="/dashboard">Espace Admin</FooterLink>
          </Column>

          {/* Column 4: Contact */}
          <Column>
            <ColumnTitle>Contact</ColumnTitle>
            <ContactInfo>
              <p><strong>RIM'CONSEIL</strong></p>
              <p>7 rue Gounod, 35000 Rennes</p>
              <MailLink href="mailto:info@rimconseil.fr">Email : info@rimconseil.fr</MailLink>
            </ContactInfo>
          </Column>
        </Grid>

        <BottomBar>
          <p>© {currentYear} Rim Conseil. Tous droits réservés.</p>
          <LegalLinks>
            <FooterLink to="/mentions-legales">Mentions légales</FooterLink>
            <FooterLink to="/politique-confidentialite">Politique de confidentialité</FooterLink>
          </LegalLinks>
        </BottomBar>
      </FooterContent>
    </FooterContainer>
  );
}
