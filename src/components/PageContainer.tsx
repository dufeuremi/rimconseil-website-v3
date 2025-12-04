import styled from 'styled-components';

const PageContainer = styled.div`
  width: 100%;
  max-width: 1664px;
  margin: 0 auto;
  padding: 0 5rem;
  padding-top: 130px; /* Reduced spacing */

  @media (max-width: 768px) {
    padding: 120px 2rem 0;
  }
`;

export default PageContainer;
