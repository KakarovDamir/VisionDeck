import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Reveal from 'reveal.js';
import 'reveal.js/dist/reveal.css';
import Head from 'next/head';

interface Element {
  type: string;
  text?: string;
  path?: string;
  shapeType?: string;
}

interface Slide {
  title: string;
  background: {
    color: string;
    transition: string;
    theme: string;
  };
  elements: Element[];
}

const RevealSlideShow: React.FC<{ presentationId: string }> = ({ presentationId }) => {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [theme, setTheme] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [revealInstance, setRevealInstance] = useState<any>(null);

  useEffect(() => {
    const fetchPresentation = async () => {
      try {
        const response = await axios.get(`https://day-y-1.onrender.com/api/pptx/${presentationId}`);
        console.log('Presentation fetched:', response.data);
        setSlides(response.data.slides);
        if (response.data.slides.length > 0) {
          setTheme(response.data.slides[0].background.theme);
        }
      } catch (error) {
        console.error('Error fetching presentation', error);
        setError('Error fetching presentation');
      }
    };
    fetchPresentation();
  }, [presentationId]);

  useEffect(() => {
    if (theme) {
      import(`reveal.js/dist/theme/${theme}.css`).then(() => {
        const reveal = new Reveal({
          transition: 'concave',
          pdfSeparateFragments: false,
          pdfMaxPagesPerSlide: 1,
          pdfPageHeightOffset: 2,
        });

        reveal.initialize();
        setRevealInstance(reveal);

        return () => {
          reveal.destroy();
        };
      });
    }
  }, [theme]);

  const getBackgroundColor = (theme: string) => {
    switch (theme) {
      case 'moon':
        return '#002b36';
      case 'night':
        return '#111';
      case 'sky':
        return 'radial-gradient(#f7fbfc,#add9e4)';
      case 'solarized':
        return '#fdf6e3';
      case 'serif':
        return '#f0f1eb';
      case 'simple':
        return '#fff';
      case 'beige':
        return '#f7f3de';
      default:
        return '#fff';
    }
  };

  const isImageSlide = (slide: Slide) => {
    return slide.elements.some((element) => element.type === 'image');
  };

  return (
    <>
      <Head>
        <link rel="stylesheet" href={`dist/theme/${theme}.css`} />
      </Head>
      <div className="reveal" data-theme={theme}>
        <div className="slides">
          {slides.length === 0 ? (
            <div className="flex justify-center items-center h-full">
              <div className="loader"></div>
            </div>
          ) : (
            slides.map((slide, index) => (
              <section
                key={index}
                data-transition={slide.background.transition}
                className="slide"
                data-background={getBackgroundColor(theme)}
              >
                {isImageSlide(slide) ? (
                  <div className="image-container">
                    <img src={slide.elements.find((element) => element.type === 'image')?.path} alt={`Slide ${index + 1}`} className="slide-image-full" />
                  </div>
                ) : (
                  <>
                    <h3 className="slide-title">{slide.title}</h3>
                    {slide.elements.map((element, idx) => {
                      if (element.type === 'text') {
                        return (
                          <p key={idx} className="slide-text" data-animation="fade-in">
                            {element.text}
                          </p>
                        );
                      }
                      return null;
                    })}
                  </>
                )}
              </section>
            ))
          )}
        </div>
        <style jsx>{`
          .slide-image {
            max-width: 25%;
            max-height: 100%;
            object-fit: contain;
          }
          .slide-image-full {
            width: 100%;
            height: auto;
            max-height: 70vh;
            object-fit: contain;
          }
          .image-container {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            height: 100%;
          }
          .slide {
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            align-items: center;
          }
          .loader {
            border: 16px solid #f3f3f3;
            border-radius: 50%;
            border-top: 16px solid blue;
            width: 120px;
            height: 120px;
            animation: spin 2s linear infinite;
            display: flex;
            justify-content: center;
            align-items: center;
            margin: auto;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          .flex {
            display: flex;
          }
          .justify-center {
            justify-content: center;
          }
          .items-center {
            align-items: center;
          }
          .h-full {
            height: 100vh;
          }
        `}</style>
        {error && <p>{error}</p>}
      </div>
    </>
  );
};

export default RevealSlideShow;
