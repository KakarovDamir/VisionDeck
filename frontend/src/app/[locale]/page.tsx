'use client';

import React, { useState } from 'react';
import Image from "next/image";
import axios from 'axios';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import Navbar from '../components/navbar';
import Link from "next/link";
import { useTranslations } from 'next-intl';
import { FaInstagram, FaLinkedin, FaTelegram } from 'react-icons/fa';

type Props = {
  params: { locale: string };
};

const RevealSlideShow = dynamic(() => import('../components/RevealSlideShow'), {
  ssr: false,
});

export default function Home({ params: { locale } }: Props) {
  const t = useTranslations('Index');

  const [topic, setTopic] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [presentationId, setPresentationId] = useState<string | null>(null);
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const response = await axios.post('https://day-y-1.onrender.com/api/pptx', { userPrompt: topic });
      if (response.status === 201) {
        console.log('Presentation created:', response.data);
        setPresentationId(response.data._id);
        setSlides(response.data.slides);
        setSuccess('Presentation created successfully!');
      }
    } catch (error) {
      console.error('Error creating presentation', error);
      setError('Error creating presentation');
    }
    setLoading(false);
  };

  const handleViewPresentation = async () => {
    if (presentationId) {
      await router.push(`${locale}/pptx/${presentationId}`);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-white text-blue-700">
      <Navbar />
      <main className="flex-1 pt-8">
        <section className="relative container mx-auto px-4 py-12 sm:px-6 lg:px-6 lg:py-24">
          <div className="relative grid grid-cols-1 gap-8 lg:grid-cols-2 mt-12">
            <div className="space-y-8">
              <h1 className="text-3xl font-bold tracking-tight sm:text-5xl lg:text-6xl font-serif text-blue-800">
                {t('create_presentation')}
              </h1>
              <p className="text-lg sm:text-xl lg:text-2xl font-light text-black font-bold">
                {t('turn_ideas')}
              </p>
              <div className="flex flex-col gap-4">
                <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:flex-row sm:gap-4 items-stretch">
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder={t('enter_topic')}
                    className="flex-1 px-4 py-2 h-14 border border-blue-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-blue-900 text-xl sm:text-2xl md:text-2xl"
                  />
                  {success ? (
                    <button
                      type="button"
                      onClick={handleViewPresentation}
                      className="h-14 w-full sm:w-auto px-4 py-2 bg-green-700 text-white text-2xl font-semibold rounded-lg hover:bg-green-500 transition duration-300"
                    >
                      {t('view_presentation')}
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className={`h-14 px-1 py-2 bg-blue-700 text-white text-xl sm:text-2xl md:text-2xl font-semibold rounded-lg hover:bg-blue-500 transition duration-300 ${loading ? 'cursor-not-allowed' : ''}`}
                      disabled={loading}
                      style={{ minWidth: '250px' }}
                    >
                      {loading ? (
                        <svg
                          className="animate-spin h-5 w-5 text-white mx-auto"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                      ) : (
                        `${t('generate_presentation')}`
                      )}
                    </button>
                  )}
                </form>
                {error && <p className="text-red-500 mt-4">{error}</p>}
              </div>
            </div>
            <div>
              <Image
                src="/main.png"
                width={800}
                height={600}
                alt="AI Presentations"
                className="mx-auto rounded-lg object-cover"
              />
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-12 sm:px-6 lg:px-6 lg:py-24">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-2">
              <img src="https://img.icons8.com/?size=50&id=WDI63NQbh3cO&format=png&color=000000" alt="AI" />
              <h3 className="text-xl sm:text-2xl font-bold font-serif text-blue-900">{t('ai_presentation_assistant')}</h3>
              <p className="font-light text-black text-lg">
                {t('p1')}
              </p>
            </div>
            <div className="space-y-2">
              <img src="https://img.icons8.com/?size=50&id=48161&format=png&color=000000" alt="palette" />
              <h3 className="text-xl sm:text-2xl font-bold font-serif text-blue-900">{t('stunning_designs')}</h3>
              <p className="font-light text-black text-lg">
                {t('p2')}
              </p>
            </div>
            <div className="space-y-2">
              <BoltIcon />
              <h3 className="text-xl sm:text-2xl font-bold font-serif text-blue-900">{t('seamless_workflow')}</h3>
              <p className="font-light text-black text-lg">
                {t('p3')}
              </p>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-12 sm:px-6 lg:px-8 lg:py-24">
          <div className="space-y-4 text-center">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight font-serif text-blue-900">{t('examples')}</h2>
            <p className="font-light text-black text-lg">{t('p4')}</p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {['66a64efa92f05fa987418424', '66a64d0c92f05fa9874182cf', '66a64e0c92f05fa987418363'].map((example, index) => (
                <Link key={index} href={`${locale}/pptx/${example}`} passHref className="group relative overflow-hidden rounded-lg">
                  <Image
                    src={`/example${index + 1}.png`}
                    width={400}
                    height={300}
                    alt={example}
                    className="h-full w-full object-cover transition-all duration-300 group-hover:scale-105"
                  />
                </Link>
              ))}
            </div>
          </div>
        </section>
        <footer className="bg-gray-100 text-black py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">{t('aboutUs')}</h3>
            <p className="text-black text-opacity-80">
              {t('p5')}
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">{t('follow')}</h3>
            <div className="flex space-x-4">
              <a href="https://www.instagram.com/visiondeck_ai?igsh=cDkxYzhlYnAzbzc5&utm_source=qr" target="_blank" rel="noopener noreferrer" className="text-black text-opacity-80 hover:text-black">
                <FaInstagram className="h-6 w-6" />
              </a>
              <a href="https://www.linkedin.com/in/damir-kakarov-6b35792a1?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app" target="_blank" rel="noopener noreferrer" className="text-black text-opacity-80 hover:text-black">
                <FaLinkedin className="h-6 w-6" />
              </a>
              <a href="https://t.me/kakarovv" target="_blank" rel="noopener noreferrer" className="text-black text-opacity-80 hover:text-black">
                <FaTelegram className="h-6 w-6" />
              </a>
            </div>
          </div>
          
        </div>
      </div>
    </footer>
      </main>
    </div>
  );
}

const BoltIcon = () => (
  <svg className="h-12 w-12 text-blue-700" viewBox="0 0 24 24" fill="currentColor">
    <path d="M11 21v-8H6.5L13 3v8h4l-6.5 10z"></path>
  </svg>
);
