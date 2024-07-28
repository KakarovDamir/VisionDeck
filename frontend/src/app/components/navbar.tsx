'use client';
import React, { ChangeEvent, useTransition } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';

const Navbar: React.FC = () => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const localeActive = useLocale();

  const onSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const nextLocale = e.target.value;
    startTransition(() => {
      router.replace(`/${nextLocale}`);
    });
  };

  return (
    <nav className="bg-white shadow-md fixed top-0 z-50 w-full">
      <div className="container flex items-center justify-between mx-auto px-4 py-2 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-4 sm:space-x-6">
          <Image src="/icon.ico" alt="VisionDeck Icon" width={40} height={40} className="rounded-full sm:w-12 sm:h-12" />
          <Link href="/" className="text-blue-800 hover:text-blue-600 text-xl sm:text-2xl lg:text-3xl font-bold">VisionDeck</Link>
        </div>
        <div className="flex-grow"></div>
        <div className="flex items-center space-x-4 sm:space-x-6">
          <label className="relative flex items-center space-x-2 rounded-lg px-2 py-1 sm:px-3 sm:py-2 bg-white shadow-sm transition duration-300 ease-in-out transform hover:scale-105 w-24 sm:w-auto">
            <p className="sr-only">Change language</p>
            <select
              defaultValue={localeActive}
              className="bg-transparent py-1 sm:py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md w-full"
              onChange={onSelectChange}
              disabled={isPending}
            >
              <option value="en">🇬🇧 EN</option>
              <option value="ru">🇷🇺 RU</option>
              <option value="kz">🇰🇿 KZ</option>
            </select>
          </label>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;
