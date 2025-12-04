import { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { X, CaretRight, CaretDown, ArrowRight } from '@phosphor-icons/react';

const Overlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 101;
  opacity: ${props => (props.$isOpen ? 1 : 0)};
  visibility: ${props => (props.$isOpen ? 'visible' : 'hidden')};
  transition: opacity 0.3s ease, visibility 0.3s ease;
`;

const Panel = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  right: 0;
  width: 320px;
  height: 100%;
  background-color: var(--color-background);
  z-index: 102;
  transform: translateX(${props => (props.$isOpen ? '0' : '100%')});
  transition: transform 0.3s ease-in-out;
  box-shadow: -4px 0 15px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  padding: 1.5rem;
  display: flex;
  justify-content: flex-end;
`;

const CloseButton = styled.button`
  color: var(--color-secondary);
  transition: color 0.2s;
  padding: 0.5rem;
  
  &:hover {
    color: var(--color-primary);
  }
`;

const Nav = styled.nav`
  flex: 1;
  padding: 0 1.5rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const NavItem = styled.div`
  display: flex;
  flex-direction: column;
`;

const NavLink = styled(Link)`
  font-family: var(--font-primary);
  font-weight: 600;
  font-size: 1.1rem;
  color: var(--color-secondary);
  padding: 0.5rem 0;
  
  &:hover {
    color: var(--color-primary);
    text-decoration: none;
  }
`;

const DropdownToggle = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  font-family: var(--font-primary);
  font-weight: 600;
  font-size: 1.1rem;
  color: var(--color-secondary);
  padding: 0.5rem 0;
  text-align: left;
  
  &:hover {
    color: var(--color-primary);
  }
`;

const SubNav = styled.div<{ $isOpen: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding-left: 1rem;
  margin-top: ${props => (props.$isOpen ? '0.5rem' : '0')};
  overflow: hidden;
  max-height: ${props => (props.$isOpen ? '500px' : '0')};
  opacity: ${props => (props.$isOpen ? 1 : 0)};
  transition: all 0.3s ease;
`;

const SubNavLink = styled(Link)`
  font-size: 0.95rem;
  color: var(--color-text-light);
  padding: 0.25rem 0;
  
  &:hover {
    color: var(--color-primary);
    text-decoration: none;
  }
`;

const ContactButtonWrapper = styled.div`
  padding: 1.5rem;
  border-top: 1px solid var(--color-quaternary);
`;

const ContactButton = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 1rem 1.5rem;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-light) 100%);
  color: white;
  font-weight: 600;
  border-radius: var(--border-radius);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(44, 119, 227, 0.3);
    color: white;
    text-decoration: none;
  }
`;

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [expertisesOpen, setExpertisesOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);

  return (
    <>
      <Overlay $isOpen={isOpen} onClick={onClose} />
      <Panel $isOpen={isOpen}>
        <Header>
          <CloseButton onClick={onClose} aria-label="Close Menu">
            <X size={24} weight="bold" />
          </CloseButton>
        </Header>

        <Nav>
          <NavItem>
            <NavLink to="/" onClick={onClose}>Accueil</NavLink>
          </NavItem>

          <NavItem>
            <DropdownToggle onClick={() => setExpertisesOpen(!expertisesOpen)}>
              Nos savoir-faire
              {expertisesOpen ? <CaretDown size={16} /> : <CaretRight size={16} />}
            </DropdownToggle>
            <SubNav $isOpen={expertisesOpen}>
              <SubNavLink to="/expertises" onClick={onClose}>Nos expertises</SubNavLink>
              <SubNavLink to="/services" onClick={onClose}>Nos services</SubNavLink>
            </SubNav>
          </NavItem>

          <NavItem>
            <DropdownToggle onClick={() => setAboutOpen(!aboutOpen)}>
              Qui sommes nous?
              {aboutOpen ? <CaretDown size={16} /> : <CaretRight size={16} />}
            </DropdownToggle>
            <SubNav $isOpen={aboutOpen}>
              <SubNavLink to="/valeurs" onClick={onClose}>Nos valeurs</SubNavLink>
              <SubNavLink to="/equipe" onClick={onClose}>Notre équipe</SubNavLink>
              <SubNavLink to="/reseau" onClick={onClose}>Notre réseau</SubNavLink>
            </SubNav>
          </NavItem>

          <NavItem>
            <NavLink to="/articles" onClick={onClose}>Articles</NavLink>
          </NavItem>

          <NavItem>
            <NavLink to="/actualites" onClick={onClose}>Actualités</NavLink>
          </NavItem>
        </Nav>

        <ContactButtonWrapper>
          <ContactButton to="/contact" onClick={onClose}>
            Contactez-nous
            <ArrowRight size={20} weight="bold" />
          </ContactButton>
        </ContactButtonWrapper>
      </Panel>
    </>
  );
}
