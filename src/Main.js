import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {
  checkpoints,
  ToneReproductionResults as fetches,
  AdvancedCheckpointOSLResults as advanced,
  AdvancedCheckpointOSLCaptions as captions,
} from './Constants';

const SideSection = styled.section`
  height: calc(100vh - 50px);
  width: calc(30% - 50px);
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
  flex-direction: column;

  height: 100vh;
  width: 100%;

  img {
    height: 512px;
    width: 512px;
    margin-bottom: 16px;

    border: 1px solid whitesmoke;

    background-repeat: no-repeat;
    background-position: center center;
    background-size: contain;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-row-gap: 16px;
  grid-column-gap: 16px;
  grid-template-columns: repeat(2, 1fr);

  margin: 8px 0 4px 0;

  text-align: center;
  color: #ffffff;

  overflow: auto;
`;

const RightArrow = () => {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='#ffffff'>
      <path d='M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-1.218 19l-1.782-1.75 5.25-5.25-5.25-5.25 1.782-1.75 6.968 7-6.968 7z' />
    </svg>
  );
};

const Image = ({ src, altText }) => {
  const [image, setImage] = useState([]);

  useEffect(() => {
    if (src === 'Checkpoint 7') {
      (async function getImage() {
        const images = await Promise.all(
          new Array(fetches.length)
            .fill(0)
            .map((_, i) => fetches[i])
            .map((v) => import(`./Checkpoints/${v}.png`))
        );
        setImage(() => images.map(({ default: content }) => content));
      })();
    } else if (src === 'Advanced Checkpoint - OSL') {
      (async function getImage() {
        const images = await Promise.all(
          advanced.map((v) => import(`./Checkpoints/${v}`))
        );
        setImage(() => images.map(({ default: content }) => content));
      })();
    } else if (src === 'Advanced Checkpoint - KD-Tree') {
      (async function getImage() {
        const { default: content } = await import(`./Checkpoints/kd-tree.png`);
        setImage(() => [content]);
      })();
    } else {
      (async function getImage() {
        const { default: content } = await import(`./Checkpoints/${src}.png`);
        setImage(() => [content]);
      })();
    }
  }, [src]);

  if (image.length > 0) {
    if (image.length > 1) {
      return image.length > 2 ? (
        <Grid>
          {image.map((im, i) => {
            const key = i;
            return (
              <div>
                <img key={key} src={im} alt={fetches[i]} color='#ffffff' />
                <div style={{ fontSize: '12px' }}>{fetches[i]}</div>
              </div>
            );
          })}
        </Grid>
      ) : (
        <Grid>
          {image.map((im, i) => {
            const key = i;
            return (
              <div>
                <img key={key} src={im} alt={captions[i]} color='#ffffff' />
                <div style={{ fontSize: '12px' }}>{captions[i]}</div>
              </div>
            );
          })}
        </Grid>
      );
    }

    return (
      <>
        <img src={image[0]} alt={altText} color='#ffffff' />
        <div style={{ fontSize: '12px' }}>{altText}</div>
      </>
    );
  }

  return <>Loading...</>;
};

function Main() {
  const [currentImage, setCurrentImage] = useState('Checkpoint 1');

  function loadImage(e) {
    e.persist();
    const curr = e.target.innerText;
    if (e.type === 'click' || e.keyCode === 13) setCurrentImage(() => curr);
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
              tabIndex={0}
              style={{ fontSize: '14px' }}>
              {c}
              <RightArrow />
            </div>
          );
        })}
      </SideSection>
      <MainSection>
        <Image
          src={currentImage}
          altText={
            currentImage !== 'Advanced Checkpoint - KD-Tree'
              ? currentImage
              : 'KD-Tree implementation'
          }
        />
      </MainSection>
    </div>
  );
}

Image.propTypes = {
  src: PropTypes.string.isRequired,
  altText: PropTypes.string.isRequired,
};

export default Main;
