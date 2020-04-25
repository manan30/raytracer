import React, { useState } from 'react';
import styled from 'styled-components';
import { checkpoints } from './Constants';

const SideSection = styled.section`
  height: calc(100vh - 50px);
  width: calc(20% - 50px);
  padding: 25px;

  background: #263238;

  color: #ffffff;

  overflow: auto;

  div {
    display: flex;
    align-items: center;

    margin-bottom: 15px;

    cursor: pointer;
    transition: all 0.5s ease;

    svg {
      height: 16px;
      width: 16px;
      margin-left: auto;
    }
  }
`;

const MainSection = styled.section`
  display: flex;
  align-items: center;
  justify-content: center;

  height: 100vh;
  width: 80%;
`;

const RightArrow = () => {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='#ffffff'>
      <path d='M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-1.218 19l-1.782-1.75 5.25-5.25-5.25-5.25 1.782-1.75 6.968 7-6.968 7z' />
    </svg>
  );
};

const Image = ({ src, altText }) => {
  return <img src={src} alt={altText} color='#ffffff' />;
};

function Main() {
  const [currentImage, setCurrentImage] = useState('checkpoint1');
  function loadImage(e) {
    e.persist();
    const curr = e.target.innerText.split(' ').join('').toLowerCase();
    setCurrentImage(() => curr);
  }

  return (
    <div style={{ display: 'flex' }}>
      <SideSection>
        {checkpoints.map((c, i) => {
          const key = i;
          return (
            <div
              key={key}
              role='button'
              onClick={loadImage}
              onKeyUp={loadImage}
              tabIndex={0}>
              {c}
              <RightArrow />
            </div>
          );
        })}
      </SideSection>
      <MainSection>
        <Image src={currentImage} altText={currentImage} />
      </MainSection>
    </div>
  );
}

export default Main;
