import styled from 'styled-components';
import { Outlet } from 'react-router-dom';
import DashboardSidebar from './DashboardSidebar';
import textureWaves from '../../assets/texturewaves.jpg';

const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #f8fafc;
  position: relative;
`;

const Background = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url(${textureWaves});
  background-size: cover;
  background-position: center;
  z-index: 0;
  opacity: 0.05;
  pointer-events: none;
`;

const MainContent = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  z-index: 1;
  height: 100vh;
  overflow: hidden;
`;

const ScrollableContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem; /* Reduced padding for wider look */
`;

/* 
   Re-evaluating Sidebar styling:
   If I change Sidebar to be relative (flex item), I need to update DashboardSidebar.tsx to remove position: fixed.
   Let's update DashboardSidebar.tsx in the next step to be compatible with this layout.
   For now, I'll assume I will update it.
*/

export default function DashboardLayout() {
  return (
    <LayoutContainer>
      <Background />
      <DashboardSidebar />
      <MainContent>
        <ScrollableContent>
          <Outlet />
        </ScrollableContent>
      </MainContent>
    </LayoutContainer>
  );
}
