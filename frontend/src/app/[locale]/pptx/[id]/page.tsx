'use client';

import dynamic from 'next/dynamic';
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { useTranslations } from 'next-intl';
import { WhatsappShareButton, TelegramShareButton, WhatsappIcon, TelegramIcon } from 'react-share';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaArrowLeft, FaBars } from 'react-icons/fa';
import { AiOutlineSetting, AiOutlineDownload, AiOutlineLink, AiOutlineFilePdf, AiOutlineFilePpt } from 'react-icons/ai';

const RevealSlideShow = dynamic(() => import('../../../components/RevealSlideShow'), {
  ssr: false,
});

const PresentationPage: React.FC = () => {
  const t = useTranslations('PresentationPage');
  const params = useParams();
  const router = useRouter();
  const presentationId = params.id as string;

  const [showOptions, setShowOptions] = useState(false);
  const [selectedAnimation, setSelectedAnimation] = useState('default');
  const [selectedTheme, setSelectedTheme] = useState('sky');
  const [isUpdatingTheme, setIsUpdatingTheme] = useState(false);
  const [isUpdatingAnimation, setIsUpdatingAnimation] = useState(false);
  const [showAnimationDropdown, setShowAnimationDropdown] = useState(false);
  const [showThemeDropdown, setShowThemeDropdown] = useState(false);
  const [presentationData, setPresentationData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/pptx/${presentationId}`);
        setPresentationData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching presentation data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [presentationId]);

  useEffect(() => {
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const handleBackClick = () => {
    toast.info(
      <div>
        {t('info')}
        <div>
          <button
            onClick={handleCopyLink}
            className="bg-blue-500 text-white py-1 px-3 rounded mt-2 mr-2"
          >
            {t('save')}
          </button>
          <button
            onClick={() => {
              toast.dismiss();
              document.body.style.overflow = 'auto';
              router.back();
            }}
            className="bg-gray-500 text-white py-1 px-3 rounded mt-2"
          >
            {t('leave')}
          </button>
        </div>
      </div>,
      {
        position: 'top-center',
        autoClose: false,
        closeOnClick: false,
        draggable: false,
        closeButton: false,
      }
    );
  };

  const toggleOptions = () => {
    setShowOptions(!showOptions);
  };

  const toggleAnimationDropdown = () => {
    setShowAnimationDropdown(!showAnimationDropdown);
  };

  const toggleThemeDropdown = () => {
    setShowThemeDropdown(!showThemeDropdown);
  };

  const handleAnimationChange = (animation: string) => {
    setSelectedAnimation(animation);
    setShowAnimationDropdown(false);
  };

  const handleThemeChange = (theme: string) => {
    setSelectedTheme(theme);
    setShowThemeDropdown(false);
  };

  const handleUpdateTheme = () => {
    setIsUpdatingTheme(true);
    axios.put(`http://localhost:5000/api/pptx/${presentationId}`, {
      theme: selectedTheme,
    })
      .then(response => {
        console.log(response.data);
        setIsUpdatingTheme(false);
        window.location.reload();
      })
      .catch(error => {
        console.error('Error:', error);
        setIsUpdatingTheme(false);
        alert('Error updating theme');
      });
  };

  const handleUpdateAnimation = () => {
    setIsUpdatingAnimation(true);
    axios.put(`http://localhost:5000/api/pptx/${presentationId}`, {
      transition: selectedAnimation,
    })
      .then(response => {
        console.log(response.data);
        setIsUpdatingAnimation(false);
        window.location.reload();
      })
      .catch(error => {
        console.error('Error:', error);
        setIsUpdatingAnimation(false);
        alert('Error updating animation');
      });
  };

  const handleCopyLink = () => {
    const link = window.location.href;
    navigator.clipboard.writeText(link).then(() => {
      toast.success('Link copied to clipboard!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }).catch(err => {
      console.error('Error copying link:', err);
    });
  };

  const downloadPptx = async () => {
    try {
      toast.info(`${t('downloadStarted')}...`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      const response = await axios.get(`http://localhost:5000/api/pptx/${presentationId}/generate`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${presentationId}.pptx`);
      document.body.appendChild(link);
      link.click();

      toast.success(`${t('downloadCompleted')}`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      console.error('Error downloading PPTX', error);
      toast.error(`${t('downloadError')}`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const exportToPdf = async () => {
    try {
      toast.info(`${t('downloadStarted')}...`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      const response = await axios.get(`http://localhost:5000/api/pptx/${presentationId}/pdf`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${presentationId}.pdf`);
      document.body.appendChild(link);
      link.click();

      toast.success(`${t('downloadCompleted')}`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      console.error('Error downloading PDF', error);
      toast.error(`${t('downloadError')}`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  if (!presentationData) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="loader">
          <div className="flex flex-row gap-2">
            <div className="w-4 h-4 rounded-full bg-blue-700 animate-bounce [animation-delay:.7s]"></div>
            <div className="w-4 h-4 rounded-full bg-blue-700 animate-bounce [animation-delay:.3s]"></div>
            <div className="w-4 h-4 rounded-full bg-blue-700 animate-bounce [animation-delay:.7s]"></div>
          </div>
        </div>
      </div>
    );
  }

  const shareUrl = window.location.href;

  return (
    <div className="relative h-screen w-screen bg-white text-black">
      <ToastContainer />
      <button
        onClick={handleBackClick}
        className="absolute top-4 left-4 bg-white text-blue-700 p-3 rounded-full border border-blue-700 hover:bg-blue-400 hover:text-white transition z-50"
      >
        <FaArrowLeft />
      </button>
      <button
        onClick={toggleOptions}
        className="absolute top-16 left-4 bg-white text-blue-700 p-3 rounded-full border border-blue-700 hover:bg-blue-400 hover:text-white transition z-50"
      >
        <FaBars />
      </button>
      {showOptions && (
        <div className="absolute top-28 left-4 bg-white text-black py-6 px-6 rounded-lg shadow-lg border border-gray-300 z-50 w-72 animate-slide-down space-y-6">
          <div className="border-b pb-4 mb-4">
            <h3 className="mb-2 text-lg font-semibold flex items-center"><AiOutlineSetting className="mr-2" />Animations</h3>
            <div className="relative mb-4">
              <button
                onClick={toggleAnimationDropdown}
                className="w-full bg-gray-200 text-black py-2 px-4 rounded border border-gray-400 hover:bg-gray-300 transition"
              >
                {selectedAnimation} ▼
              </button>
              {showAnimationDropdown && (
                <ul className="absolute w-full bg-white text-black border border-gray-400 mt-1 rounded shadow-lg z-10">
                  {['default', 'fade', 'zoom', 'concave', 'linear', 'none'].map(animation => (
                    <li
                      key={animation}
                      onClick={() => handleAnimationChange(animation)}
                      className={`py-2 px-4 cursor-pointer hover:bg-gray-200 ${selectedAnimation === animation ? 'font-bold text-blue-600' : ''}`}
                    >
                      {animation} {selectedAnimation === animation && '✔️'}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <button
              onClick={handleUpdateAnimation}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
              disabled={isUpdatingAnimation}
            >
              {isUpdatingAnimation ? '...' : `${t('upgrade')}`}
            </button>
          </div>
          <div className="border-b pb-4 mb-4">
            <h3 className="mb-2 text-lg font-semibold flex items-center"><AiOutlineSetting className="mr-2" />Themes</h3>
            <div className="relative mb-4">
              <button
                onClick={toggleThemeDropdown}
                className="w-full bg-gray-200 text-black py-2 px-4 rounded border border-gray-400 hover:bg-gray-300 transition"
              >
                {selectedTheme} ▼
              </button>
              {showThemeDropdown && (
                <ul className="absolute w-full bg-white text-black border border-gray-400 mt-1 rounded shadow-lg z-10">
                  {['sky', 'beige', 'simple', 'serif', 'night', 'moon', 'solarized'].map(theme => (
                    <li
                      key={theme}
                      onClick={() => handleThemeChange(theme)}
                      className={`py-2 px-4 cursor-pointer hover:bg-gray-200 ${selectedTheme === theme ? 'font-bold text-blue-600' : ''}`}
                    >
                      {theme} {selectedTheme === theme && '✔️'}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <button
              onClick={handleUpdateTheme}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
              disabled={isUpdatingTheme}
            >
              {isUpdatingTheme ? '...' : `${t('upgrade')}`}
            </button>
          </div>
          <div>
            <h3 className="mb-2 text-lg font-semibold flex items-center"><AiOutlineDownload className="mr-2" />{t('share')}</h3>
            <div className="flex space-x-2">
              <div className="relative group">
                <WhatsappShareButton url={shareUrl}>
                  <WhatsappIcon size={40} round />
                </WhatsappShareButton>
                <span className="absolute bottom-0 left-0 mb-12 hidden w-max p-1 text-sm text-white bg-gray-700 rounded group-hover:block">{t('wp')}</span>
              </div>
              <div className="relative group">
                <TelegramShareButton url={shareUrl}>
                  <TelegramIcon size={40} round />
                </TelegramShareButton>
                <span className="absolute bottom-0 left-0 mb-12 hidden w-max p-1 text-sm text-white bg-gray-700 rounded group-hover:block">{t('tg')}</span>
              </div>
              <div className="relative group">
                <button
                  onClick={handleCopyLink}
                  className="w-11 p-1 rounded-full border border-gray-400 hover:bg-gray-200 transition"
                >
                  <AiOutlineLink size={30} />
                </button>
                <span className="absolute bottom-0 left-0 mb-12 hidden w-max p-1 text-sm text-white bg-gray-700 rounded group-hover:block">{t('link')}</span>
              </div>
              <div className="relative group">
                <button
                  onClick={exportToPdf}
                  className="w-11 p-1 rounded-full border border-gray-400 hover:bg-gray-200 transition"
                >
                  <AiOutlineFilePdf size={30} />
                </button>
                <span className="absolute bottom-0 left-0 mb-12 hidden w-max p-1 text-sm text-white bg-gray-700 rounded group-hover:block">{t('pdf')}</span>
              </div>
              <div className="relative group">
                <button
                  onClick={downloadPptx}
                  className="w-11 p-1 rounded-full border border-gray-400 hover:bg-gray-200 transition"
                >
                  <AiOutlineFilePpt size={32} />
                </button>
                <span className="absolute bottom-0 left-0 mb-12 hidden w-max p-1 text-sm text-white bg-gray-700 rounded group-hover:block">{t('pptx')}</span>
              </div>
            </div>
          </div>
        </div>
      )}
      <RevealSlideShow presentationId={presentationId} />
      <style jsx>{`
        .animate-slide-down {
          animation: slide-down 0.3s ease-out;
        }

        @keyframes slide-down {
          0% {
            transform: translateY(-20%);
            opacity: 0;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .loader {
          border: 16px solid #f3f3f3;
          border-radius: 50%;
          border-top: 16px solid blue;
          width: 120px;
          height: 120px;
          animation: spin 2s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
           100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default PresentationPage;
