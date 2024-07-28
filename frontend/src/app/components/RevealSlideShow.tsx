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
        Reveal.initialize({
          transition: 'concave',
          pdfSeparateFragments: false,
          pdfMaxPagesPerSlide: 1,
          pdfPageHeightOffset: 2,
        });

        document.querySelector('.reveal')?.classList.add(`theme-${theme}`);
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
            <div className={`loader-container ${theme}`}>
              <div className="flex flex-row gap-2">
                <div className="w-4 h-4 rounded-full bg-blue-700 animate-bounce [animation-delay:.7s]"></div>
                <div className="w-4 h-4 rounded-full bg-blue-700 animate-bounce [animation-delay:.3s]"></div>
                <div className="w-4 h-4 rounded-full bg-blue-700 animate-bounce [animation-delay:.7s]"></div>
              </div>
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
          .loader-container {
            display: flex;
            justify-content: center;
            align-items: center;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 1000;
          }
          .white .loader-container {
            background-color: white;
          }
          .black .loader-container {
            background-color: black;
          }
          .sky .loader-container {
            background-color: skyblue;
          }
        `}</style>
        {error && <p>{error}</p>}
      </div>
    </>
  );
};

export default RevealSlideShow;
