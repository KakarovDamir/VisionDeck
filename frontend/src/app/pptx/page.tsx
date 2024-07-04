'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import Navbar from '../components/navbar';

const RevealSlideShow = dynamic(() => import('../components/RevealSlideShow'), {
  ssr: false,
});

const Pptx: React.FC = () => {
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
      const response = await axios.post('http://localhost:5000/api/pptx', { userPrompt: topic });
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

  const handleViewPresentation = () => {
    if (presentationId) {
      router.push(`/pptx/${presentationId}`);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-white text-blue-700">
      <Navbar />
      <main className="flex-1 flex items-center justify-center">
        <section className="w-full max-w-md p-8 bg-blue-200 rounded-lg shadow-lg text-black">
          <h1 className="text-3xl font-bold mb-4 text-blue-900 text-center">Create Your Presentation</h1>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Enter presentation topic"
              className="w-full px-4 py-2 mb-4 border border-blue-300 rounded-lg"
            />
            <button
              type="submit"
              className="w-full px-4 py-2 bg-blue-700 text-white font-semibold rounded-lg hover:bg-blue-500 transition duration-300"
              disabled={loading}
            >
              {loading ? (
                <svg
                  className="animate-spin h-5 w-5 mr-3 text-white inline-block"
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
                'Generate Presentation'
              )}
            </button>
          </form>
          {error && <p className="text-red-500 mt-4">{error}</p>}
          {success && <p className="text-green-500 mt-4">{success}</p>}
          {presentationId && (
            <div className="mt-4">
              <button
                onClick={handleViewPresentation}
                className="w-full px-4 py-2 bg-green-700 text-white font-semibold rounded-lg hover:bg-green-500 transition duration-300"
              >
                View Presentation
              </button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Pptx;
