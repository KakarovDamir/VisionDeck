'use client';
import Image from "next/image";
import Navbar from "./components/navbar";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-blue-700">
      <Navbar />
      <main className="flex-1 pt-16">
        <section className="container mx-auto px-4 py-12 sm:px-6 lg:px-8 lg:py-24">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 mt-10">
            <div className="space-y-4">
              <h1 className="text-3xl font-bold tracking-tight sm:text-5xl lg:text-6xl font-serif text-blue-800">
                Create Your Presentations in 30 Seconds
              </h1>
              <p className="text-lg sm:text-xl lg:text-2xl font-light text-black font-bold">
                Turn your ideas into visually appealing presentations effortlessly with our AI tool. Experience a new level of creativity and professionalism.
              </p>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Link href="/pptx">
                  <button className="px-8 py-2.5 bg-blue-700 text-white font-semibold rounded-md shadow-md hover:bg-blue-500 hover:scale-105 transition duration-300 ease-in-out text-xl">
                    Dive In 
                  </button>
                </Link>
              </div>
            </div>
            <div>
              <Image
                src="/main.jpeg"
                width={800}
                height={600}
                alt="AI Presentations"
                className="mx-auto rounded-lg object-cover"
              />
            </div>
          </div>
        </section>
        <section className="container mx-auto px-4 py-12 sm:px-6 lg:px-8 lg:py-24">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-2">
              <MagnetIcon />
              <h3 className="text-xl sm:text-2xl font-bold font-serif text-blue-900">AI Presentation Assistant</h3>
              <p className="font-light text-black text-lg">
                Our AI presentation generator creates visually stunning slides with just a few clicks.
              </p>
            </div>
            <div className="space-y-2">
              <PaletteIcon />
              <h3 className="text-xl sm:text-2xl font-bold font-serif text-blue-900">Stunning Designs</h3>
              <p className="font-light text-black text-lg">
                Choose from a multitude of professional templates and designs to make your presentations stand out.
              </p>
            </div>
            <div className="space-y-2">
              <BoltIcon />
              <h3 className="text-xl sm:text-2xl font-bold font-serif text-blue-900">Seamless Workflow</h3>
              <p className="font-light text-black text-lg">
                Optimize your presentation creation process with our intuitive and user-friendly interface.
              </p>
            </div>
          </div>
        </section>
        <section className="container mx-auto px-4 py-12 sm:px-6 lg:px-8 lg:py-24">
          <div className="space-y-4 text-center">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight font-serif text-blue-900">Examples of Presentations Created by Our AI</h2>
            <p className="font-light text-black text-lg">Check out examples of stunning presentations created by our AI.</p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {['668701edc7b0adb4dc71e695', '668703b63da6c24c32daf059', '668704813da6c24c32daf072'].map((example, index) => (
                <Link key={index} href={`/pptx/${example}`} passHref className="group relative overflow-hidden rounded-lg">
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
      </main>
    </div>
  );
}

const MagnetIcon = () => (
  <svg className="h-12 w-12 text-blue-700" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2a5 5 0 0 1 5 5v4a5 5 0 0 1-10 0V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v4a3 3 0 0 0 6 0V7a3 3 0 0 0-3-3zM5 13v3a7 7 0 1 0 14 0v-3h-2v3a5 5 0 1 1-10 0v-3H5z"></path>
  </svg>
);

const PaletteIcon = () => (
  <svg className="h-12 w-12 text-blue-700" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10a1 1 0 0 0 1-1c0-.703-.183-1.368-.513-1.974a5.992 5.992 0 0 0 3.396-1.188 1.001 1.001 0 0 0-.664-1.811A4.002 4.002 0 0 1 10 14a1 1 0 0 0-1-1c-.551 0-1 .449-1 1a6.002 6.002 0 0 0 6 6h.062c-.132-.314-.2-.648-.2-1a2 2 0 0 1 2-2c.404 0 .787.099 1.128.273.053-.182.088-.37.108-.563C17.356 16.695 17 14.888 17 13c0-4.41-3.59-8-8-8zm4 8a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-8 2a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm2-6a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm4 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zM7 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-2 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"></path>
  </svg>
);

const BoltIcon = () => (
  <svg className="h-12 w-12 text-blue-700" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2L8 14h4l-2 8 8-12h-4l2-8h-4z"></path>
  </svg>
);
