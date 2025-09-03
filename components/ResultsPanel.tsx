import React from 'react';
import { UrlResult } from '../types';
import { ResultItem } from './ResultItem';

interface ResultsPanelProps {
  results: UrlResult[];
}

export const ResultsPanel: React.FC<ResultsPanelProps> = ({ results }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold text-black border-b border-gray-200 pb-2">Results</h2>
      {results.map((result, index) => (
        <ResultItem key={`${result.url}-${index}`} result={result} />
      ))}
    </div>
  );
};