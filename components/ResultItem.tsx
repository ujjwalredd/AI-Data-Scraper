import React, { useState } from 'react';
import { UrlResult, ProcessingStatus, ProcessingMode } from '../types';
import { CheckCircleIcon, DocumentTextIcon, ExclamationTriangleIcon, LockClosedIcon, SpinnerIcon, ChevronDownIcon, ChevronUpIcon, ClipboardIcon, ArrowDownTrayIcon } from './icons';

interface ResultItemProps {
  result: UrlResult;
}

const StatusBadge: React.FC<{ status: ProcessingStatus }> = ({ status }) => {
  const statusConfig = {
    [ProcessingStatus.CHECKING]: { text: 'Checking', color: 'bg-blue-100 text-blue-800', icon: <SpinnerIcon className="h-4 w-4 animate-spin" /> },
    [ProcessingStatus.COPYRIGHT_FOUND]: { text: 'Copyright Found', color: 'bg-yellow-100 text-yellow-800', icon: <LockClosedIcon className="h-4 w-4" /> },
    [ProcessingStatus.SCRAPING]: { text: 'Processing', color: 'bg-blue-100 text-blue-800', icon: <SpinnerIcon className="h-4 w-4 animate-spin" /> },
    [ProcessingStatus.READY]: { text: 'Ready', color: 'bg-green-100 text-green-800', icon: <CheckCircleIcon className="h-4 w-4" /> },
    [ProcessingStatus.ERROR]: { text: 'Error', color: 'bg-red-100 text-red-800', icon: <ExclamationTriangleIcon className="h-4 w-4" /> },
    [ProcessingStatus.IDLE]: { text: 'Idle', color: 'bg-gray-100 text-gray-800', icon: <DocumentTextIcon className="h-4 w-4" /> },
  };

  const config = statusConfig[status] || statusConfig[ProcessingStatus.IDLE];

  return (
    <span className={`inline-flex items-center gap-x-1.5 rounded-full px-2 py-1 text-xs font-medium ${config.color}`}>
      {config.icon}
      {config.text}
    </span>
  );
};

export const ResultItem: React.FC<ResultItemProps> = ({ result }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const toggleExpansion = () => {
    if (result.data) {
      setIsExpanded(!isExpanded);
    }
  };
  
  const handleCopy = () => {
    if (!result.data) return;
    navigator.clipboard.writeText(result.data).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }).catch(err => console.error('Failed to copy text: ', err));
  };

  const handleDownload = () => {
    if (!result.data) return;
    
    const isJson = result.dataType === ProcessingMode.JSON;
    const fileExtension = isJson ? 'json' : 'txt';
    const mimeType = isJson ? 'application/json' : 'text/plain';

    const blob = new Blob([result.data], { type: `${mimeType};charset=utf-8` });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const safeUrl = result.url.replace(/^https?:\/\//, '').replace(/[^a-zA-Z0-9.-]/g, '_');
    a.download = `${safeUrl}_data.${fileExtension}`;
    a.href = url;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const canExpand = !!result.data;

  let displayData = result.data;
  if (result.dataType === ProcessingMode.JSON && result.data) {
    try {
      const parsed = JSON.parse(result.data);
      displayData = JSON.stringify(parsed, null, 2);
    } catch (e) {
      // Not valid JSON, display as is
      displayData = result.data;
    }
  }


  return (
    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 transition-all duration-300">
      <div className="flex justify-between items-center">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-black truncate">{result.url}</p>
        </div>
        <div className="flex items-center ml-4 space-x-2">
            <StatusBadge status={result.status} />
             {canExpand && (
                <button onClick={toggleExpansion} className="text-gray-500 hover:text-black">
                    {isExpanded ? <ChevronUpIcon className="h-5 w-5" /> : <ChevronDownIcon className="h-5 w-5" />}
                </button>
            )}
        </div>
      </div>
      
      {(result.reason || result.error) && (
         <p className={`mt-2 text-sm ${result.error ? 'text-red-600' : 'text-gray-500'}`}>
           {result.reason || result.error}
         </p>
      )}

      {isExpanded && result.data && (
        <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex justify-between items-center mb-2">
                <h4 className="text-sm font-semibold text-gray-700">Processed Dataset:</h4>
                <div className="flex items-center gap-2">
                    <button onClick={handleCopy} className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-black transition-colors disabled:opacity-50" disabled={copied}>
                        {copied ? <CheckCircleIcon className="h-4 w-4 text-green-600" /> : <ClipboardIcon className="h-4 w-4" />}
                        {copied ? 'Copied!' : 'Copy'}
                    </button>
                    <button onClick={handleDownload} className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-black transition-colors">
                        <ArrowDownTrayIcon className="h-4 w-4" />
                        Download
                    </button>
                </div>
            </div>
          <pre className="text-sm bg-gray-100 rounded-md p-3 text-gray-800 whitespace-pre-wrap font-mono max-h-60 overflow-y-auto">
            {displayData}
          </pre>
        </div>
      )}
    </div>
  );
};