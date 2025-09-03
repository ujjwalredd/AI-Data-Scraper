import React, { useState, useCallback, ChangeEvent } from 'react';
import { UrlInput } from './components/UrlInput';
import { ResultsPanel } from './components/ResultsPanel';
import { processUrl } from './services/geminiService';
import { UrlResult, ProcessingStatus, ProcessingMode } from './types';
import { Header } from './components/Header';

const App: React.FC = () => {
  const [urls, setUrls] = useState<string>('');
  const [results, setResults] = useState<UrlResult[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [mode, setMode] = useState<ProcessingMode>(ProcessingMode.TEXT);
  const [jsonPrompt, setJsonPrompt] = useState<string>('Extract the article title, author, and publication date.');

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      setUrls(text);
    };
    reader.readAsText(file);
    // Reset file input to allow uploading the same file again
    event.target.value = '';
  };

  const handleProcessUrls = useCallback(async () => {
    const urlList = urls.split('\n').map(u => u.trim()).filter(u => u.length > 0);
    if (urlList.length === 0) {
      return;
    }

    setIsLoading(true);
    const initialResults: UrlResult[] = urlList.map(url => ({
      url,
      status: ProcessingStatus.CHECKING,
    }));
    setResults(initialResults);

    const processingPromises = urlList.map(url => {
      return processUrl(url, mode, jsonPrompt)
        .then(result => {
          setResults(prevResults =>
            prevResults.map(r => (r.url === url ? result : r))
          );
        })
        .catch(error => {
          console.error(`Error processing ${url}:`, error);
          setResults(prevResults =>
            prevResults.map(r =>
              r.url === url
                ? {
                    url,
                    status: ProcessingStatus.ERROR,
                    error:
                      error instanceof Error
                        ? error.message
                        : 'An unknown error occurred.',
                  }
                : r
            )
          );
        });
    });

    await Promise.all(processingPromises);

    setIsLoading(false);
  }, [urls, mode, jsonPrompt]);

  return (
    <div className="min-h-screen bg-white text-black font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <Header />
        <main>
          <div className="bg-gray-50 rounded-lg shadow-lg p-6 border border-gray-200">
            <UrlInput
              urls={urls}
              setUrls={setUrls}
              onSubmit={handleProcessUrls}
              isLoading={isLoading}
              mode={mode}
              setMode={setMode}
              jsonPrompt={jsonPrompt}
              setJsonPrompt={setJsonPrompt}
              onFileChange={handleFileChange}
            />
          </div>
          {results.length > 0 && (
            <div className="mt-8">
              <ResultsPanel results={results} />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default App;