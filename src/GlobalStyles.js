import { Canvas as C } from 'react-three-fiber';
import styled, { createGlobalStyle } from 'styled-components';

export default createGlobalStyle`
  body {
    height: 100vh;
    width: 100vw;
    margin: 0;
    padding: 0;
    background-color: black;
    overflow:hidden !important;
  }
`;

export const Canvas = styled(C)`
  height: 100vh !important;
  width: 100vw !important;
`;
