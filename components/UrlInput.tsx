import React, { useRef, ChangeEvent } from 'react';
import { SparklesIcon, SpinnerIcon, DocumentArrowUpIcon } from './icons';
import { ProcessingMode } from '../types';

interface UrlInputProps {
  urls: string;
  setUrls: (urls: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  mode: ProcessingMode;
  setMode: (mode: ProcessingMode) => void;
  jsonPrompt: string;
  setJsonPrompt: (prompt: string) => void;
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

export const UrlInput: React.FC<UrlInputProps> = ({ 
    urls, setUrls, onSubmit, isLoading, 
    mode, setMode, jsonPrompt, setJsonPrompt, onFileChange 
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Processing Mode</label>
        <div className="flex items-center space-x-4">
            <label className="flex items-center">
                <input 
                    type="radio" 
                    name="mode" 
                    value={ProcessingMode.TEXT} 
                    checked={mode === ProcessingMode.TEXT} 
                    onChange={() => setMode(ProcessingMode.TEXT)}
                    disabled={isLoading}
                    className="h-4 w-4 text-black border-gray-300 focus:ring-black"
                />
                <span className="ml-2 text-sm text-gray-800">Scrape Text</span>
            </label>
            <label className="flex items-center">
                <input 
                    type="radio" 
                    name="mode" 
                    value={ProcessingMode.JSON} 
                    checked={mode === ProcessingMode.JSON} 
                    onChange={() => setMode(ProcessingMode.JSON)}
                    disabled={isLoading}
                    className="h-4 w-4 text-black border-gray-300 focus:ring-black"
                />
                <span className="ml-2 text-sm text-gray-800">Extract JSON</span>
            </label>
        </div>
      </div>
      
      {mode === ProcessingMode.JSON && (
        <div className="mb-4 transition-all duration-300 ease-in-out">
            <label htmlFor="json-prompt-input" className="block text-sm font-medium text-gray-700 mb-2">
                JSON Extraction Prompt
            </label>
            <textarea
                id="json-prompt-input"
                rows={2}
                value={jsonPrompt}
                onChange={(e) => setJsonPrompt(e.target.value)}
                disabled={isLoading}
                placeholder="e.g., Extract product name, price, and features"
                className="w-full bg-white border border-gray-300 rounded-md p-3 text-black focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition duration-200 resize-y disabled:opacity-50"
            />
        </div>
      )}

      <div>
        <label htmlFor="url-input" className="block text-sm font-medium text-gray-700 mb-2">
          Enter Website URLs (one per line)
        </label>
        <textarea
          id="url-input"
          rows={6}
          value={urls}
          onChange={(e) => setUrls(e.target.value)}
          disabled={isLoading}
          placeholder="https://example.com/about&#10;https://another-example.org/blog/post-1"
          className="w-full bg-white border border-gray-300 rounded-md p-3 text-black focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition duration-200 resize-y disabled:opacity-50"
        />
      </div>

      <div className="mt-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
            <input
                type="file"
                ref={fileInputRef}
                onChange={onFileChange}
                className="hidden"
                accept=".txt"
                disabled={isLoading}
            />
            <button
                onClick={handleUploadClick}
                disabled={isLoading}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50"
            >
                <DocumentArrowUpIcon className="-ml-1 mr-2 h-5 w-5 text-gray-500" />
                Upload .txt File
            </button>
        </div>
        <button
          onClick={onSubmit}
          disabled={isLoading || !urls.trim()}
          className="inline-flex items-center px-6 py-2.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-black disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 w-full sm:w-auto"
        >
          {isLoading ? (
            <>
              <SpinnerIcon className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
              Processing...
            </>
          ) : (
            <>
              <SparklesIcon className="-ml-1 mr-2 h-5 w-5" />
              Process URLs
            </>
          )}
        </button>
      </div>
    </div>
  );
};