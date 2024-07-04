'use client';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Reveal from 'reveal.js';
import 'reveal.js/dist/reveal.css';
import 'reveal.js/dist/theme/white.css';

interface PositionProps {
  x: number | string;
  y: number | string;
  w: number | string;
  h: number | string;
}

interface TextPropsOptions {
  align?: string;
  autoFit?: boolean;
  baseline?: number;
  bold?: boolean;
  breakLine?: boolean;
  bullet?: boolean | object;
  charSpacing?: number;
  color?: string;
  fill?: string;
  fit?: string;
  fontFace?: string;
  fontSize?: number;
  glow?: object;
  highlight?: string;
  hyperlink?: string;
  indentLevel?: number;
  inset?: number;
  isTextBox?: boolean;
  italic?: boolean;
  lang?: string;
  line?: object;
  lineSpacing?: number;
  lineSpacingMultiple?: number;
  margin?: number;
  outline?: object;
  paraSpaceAfter?: number;
  paraSpaceBefore?: number;
  rectRadius?: number;
  rotate?: number;
  rtlMode?: boolean;
  shadow?: object;
  softBreakBefore?: boolean;
  strike?: string;
  subscript?: boolean;
  superscript?: boolean;
  transparency?: number;
  underline?: object;
  valign?: string;
  vert?: string;
  wrap?: boolean;
}

interface Element {
  type: string;
  text?: string;
  path?: string;
  shapeType?: string;
  options: PositionProps & TextPropsOptions;
}

interface Slide {
  title: string;
  background: {
    color: string;
  };
  elements: Element[];
}

const RevealSlideShow: React.FC<{ presentationId: string }> = ({ presentationId }) => {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [backgroundColor, setBackgroundColor] = useState<string>('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPresentation = async () => {
      try {
        const response = await axios.get(`https://day-y-1.onrender.com/api/pptx/${presentationId}`);
        console.log('Presentation fetched:', response.data);
        setSlides(response.data.slides);
        if (response.data.slides.length > 0) {
          setBackgroundColor(response.data.slides[0].background.color);
        }
      } catch (error) {
        console.error('Error fetching presentation', error);
        setError('Error fetching presentation');
      }
    };
    fetchPresentation();
  }, [presentationId]);

  useEffect(() => {
    if (slides.length > 0) {
      Reveal.initialize({
        transition: 'concave', // Apply the rotating transition effect
      });
    }
  }, [slides]);

  return (
    <div className="reveal" style={{ backgroundColor }}>
      <div className="slides">
        {slides.length === 0 ? (
          <p>Loading slides...</p>
        ) : (
          slides.map((slide, index) => (
            <section key={index} data-transition="concave" className="slide">
              <h3 className="slide-title">{slide.title}</h3>
              {slide.elements.map((element, idx) => {
                if (element.type === 'text') {
                  return (
                    <p key={idx} className="slide-text" style={{ color: element.options.color }} data-animation="fade-in">
                      {element.text}
                    </p>
                  );
                } else if (element.type === 'image') {
                  return (
                    <div key={idx} className="image-container">
                      <img src={element.path} alt={`Slide ${index + 1}`} className="slide-image" />
                    </div>
                  );
                }
                return null;
              })}
            </section>
          ))
        )}
      </div>
      <style jsx>{`
        .slide-image {
          max-width: 25%;
          max-height: 100%;
          object-fit: contain; // Change to 'cover' if you prefer the image to fill the entire container while maintaining aspect ratio
        }
        .image-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100%;
        }
        .slide {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
      `}</style>
    </div>
  );
};

export default RevealSlideShow;
