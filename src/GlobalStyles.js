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

  .content {
    position: absolute;
    right: 0;
    top: 0;
    padding: 32px;
    color: white;
    font-size: 12px;
  }
`;

export const Canvas = styled(C)`
  display: inline-block;
  height: 100vh !important;
  width: 50% !important;
`;

export const RayTracedCanvas = styled.div`
  position: relative;
  left: 50%;
  top: 50%;
  transform: translateX(-50%) translateY(-50%);
  /* height: 256px;
  width: 256px; */
  /* height: 512px;
  width: 512px; */

  border: 1px solid white;
  /* background-color: red; */
`;
