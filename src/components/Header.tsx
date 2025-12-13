import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { List } from '@phosphor-icons/react';
import logoNormal from '../assets/logo.svg';
import logoWhite from '../assets/logoWhite.svg';

const HeaderContainer = styled.header<{ $isScrolled: boolean; $isHidden: boolean; $isHome: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 100;
  transition: all 0.3s ease-in-out;
  
  ${props => props.$isHidden && css`
    transform: translateY(-100%);
  `}

  ${props => (props.$isScrolled || !props.$isHome) ? css`
    background-color: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid var(--color-quaternary);
    /* box-shadow: var(--shadow-sm); Removed as requested */
  ` : css`
    background-color: transparent;
    border-bottom: 1px solid transparent;
  `}
`;

const NavContent = styled.div`
  max-width: 1664px;
  margin: 0 auto;
  padding: 0 5rem;
  height: 100px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 768px) {
    padding: 0 2rem;
    height: 80px;
  }
`;

const LogoLink = styled(Link)`
  display: flex;
  align-items: center;
  text-decoration: none;
`;

const LogoImg = styled.img`
  height: 40px;
  width: auto;
  transition: opacity 0.3s ease;
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
`;

const SocialLink = styled.a<{ $isScrolled: boolean; $isHome: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => (props.$isHome && !props.$isScrolled) ? 'var(--color-white)' : 'var(--color-primary)'};
  transition: color 0.3s ease;
  margin-top: -3px;

  &:hover {
    color: #0077b5; /* LinkedIn Blue */
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

const MenuButton = styled.button<{ $isScrolled: boolean; $isHome: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => (props.$isHome && !props.$isScrolled) ? 'var(--color-white)' : 'var(--color-secondary)'};
  transition: color 0.3s ease;
  padding: 0.5rem;
  margin-right: -0.5rem;

  &:hover {
    color: var(--color-primary);
  }
`;

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Show/Hide logic
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsHidden(true);
      } else {
        setIsHidden(false);
      }

      // Background logic
      if (currentScrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <HeaderContainer $isScrolled={isScrolled} $isHidden={isHidden} $isHome={isHome}>
      <NavContent>
        <LogoLink to="/">
          <LogoImg
            src={(isHome && !isScrolled) ? logoWhite : logoNormal}
            alt="RIM CONSEIL"
          />
        </LogoLink>

        <Actions>
          <SocialLink
            href="https://www.linkedin.com/company/rimconseil/"
            target="_blank"
            rel="noopener noreferrer"
            $isScrolled={isScrolled}
            $isHome={isHome}
            aria-label="LinkedIn"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="26" height="26">
              <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" />
            </svg>
          </SocialLink>

          <MenuButton
            onClick={onMenuClick}
            $isScrolled={isScrolled}
            $isHome={isHome}
            aria-label="Menu"
          >
            <List size={32} weight="bold" />
          </MenuButton>
        </Actions>
      </NavContent>
    </HeaderContainer>
  );
}
