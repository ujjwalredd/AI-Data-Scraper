import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="text-center mb-8">
      <h1 className="text-4xl sm:text-5xl font-bold text-black">
        AI Data Scraper
      </h1>
      <p className="mt-2 text-lg text-gray-600">
        Ethically gather and preprocess web data for your AI projects.
      </p>
    </header>
  );
};