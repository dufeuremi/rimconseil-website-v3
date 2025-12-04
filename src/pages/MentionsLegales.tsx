import styled from 'styled-components';

const Container = styled.div`
  padding-top: 2rem;
  padding-bottom: 4rem;
`;

const StyledHeader = styled.div`
  height: 2rem;
`;

const ContentSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3rem;
`;

const Title = styled.h1<{ align?: string; level?: number }>`
  font-family: var(--font-secondary);
  color: var(--color-primary);
  font-size: 2.5rem;
  margin-bottom: 2rem;
  text-align: ${props => props.align || 'left'};

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const SectionTitle = styled.h2`
  font-family: var(--font-secondary);
  color: var(--color-secondary);
  font-size: 1.5rem;
  border-bottom: 2px solid var(--color-quaternary);
  padding-bottom: 0.5rem;
  margin-bottom: 1rem;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const CompanyInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
  padding: 1.5rem;
  background-color: var(--color-background-alt);
  border-radius: var(--border-radius);
  border-left: 4px solid var(--color-primary);
`;

const Text = styled.p<{ variant?: string; align?: string }>`
  font-family: var(--font-primary);
  color: var(--color-text);
  line-height: 1.6;
  text-align: ${props => props.align || 'left'};
  font-size: ${props => props.variant === 'small' ? '0.875rem' : '1rem'};

  strong {
    font-weight: 600;
    color: var(--color-secondary);
  }
`;

export default function MentionsLegales() {
  return (
    <Container>
      <StyledHeader />
      <ContentSection>
        <Title level={1} align="left">Mentions Légales</Title>

        <Section>
          <SectionTitle>Conception et réalisation</SectionTitle>
          <Content>
            <CompanyInfo>
              <Text variant="body" align="left"><strong>Site réalisé par :</strong> Remi DUFEU</Text>
              <Text variant="body" align="left">Forme juridique : SAS, société par actions simplifiée</Text>
              <Text variant="body" align="left">SIREN : 992 303 412</Text>
              <Text variant="body" align="left">SIRET (siège) : 992 303 412 00017</Text>
              <Text variant="body" align="left">Capital social : 500,00 €</Text>
              <Text variant="body" align="left">Numéro de TVA : FR36992303412</Text>
              <Text variant="body" align="left">RCS : 992 303 412 R.C.S. Nantes</Text>
              <Text variant="body" align="left">Inscription au RCS : INSCRIT (au greffe de NANTES , le 08/10/2025)</Text>
              <Text variant="body" align="left">Inscription au RNE : INSCRIT</Text>
            </CompanyInfo>
          </Content>
        </Section>

        <Section>
          <SectionTitle>1. Présentation du site</SectionTitle>
          <Content>
            <CompanyInfo>
              <Text variant="body" align="left"><strong>Le site RIM'CONSEIL est édité par :</strong></Text>
              <Text variant="body" align="left">RIM'CONSEIL, SAS</Text>
              <Text variant="body" align="left">RCS : 919 204 305</Text>
              <Text variant="body" align="left">Siège social : 7 rue Gounod, 35000 Rennes</Text>
              <Text variant="body" align="left">SIRET : 919 204 305 00016</Text>
              <Text variant="body" align="left">N° TVA Intracommunautaire : FR24 919 204 305</Text>
              <Text variant="body" align="left">Code NAF/APE : 70.22Z (Conseil pour les affaires et autres conseils de gestion)</Text>
            </CompanyInfo>
            <Text variant="body" align="left"><strong>Responsable de publication :</strong> Jean-Philippe Robin</Text>
            <Text variant="body" align="left"><strong>Contact :</strong> info@rimconseil.fr</Text>
            <Text variant="body" align="left"><strong>Hébergeur :</strong> OVH (2 rue Kellermann, 59100 Roubaix, France)</Text>
          </Content>
        </Section>

        <Section>
          <SectionTitle>2. Propriété intellectuelle</SectionTitle>
          <Content>
            <Text variant="body" align="left">Le contenu du site (textes, images, graphismes, logos, icônes) est la propriété exclusive de RIM'CONSEIL, sauf mentions contraires. Toute reproduction, distribution, modification, adaptation est interdite sans autorisation préalable.</Text>
          </Content>
        </Section>

        <Section>
          <SectionTitle>3. Responsabilités</SectionTitle>
          <Content>
            <Text variant="body" align="left">RIM'CONSEIL s'efforce de fournir des informations exactes et mises à jour. Toutefois, la société ne saurait être tenue responsable des erreurs ou omissions, ni des dommages résultant de l'utilisation du site.</Text>
          </Content>
        </Section>

        <Section>
          <SectionTitle>4. Liens hypertextes</SectionTitle>
          <Content>
            <Text variant="body" align="left">Le site peut contenir des liens vers d'autres sites. RIM'CONSEIL n'est pas responsable du contenu de ces sites externes.</Text>
          </Content>
        </Section>

        <Section>
          <SectionTitle>5. Droit applicable</SectionTitle>
          <Content>
            <Text variant="body" align="left">Les présentes mentions légales sont régies par le droit français. En cas de litige, les tribunaux de Rennes seront compétents.</Text>
          </Content>
        </Section>
      </ContentSection>
    </Container>
  );
}
