
export enum ProcessingStatus {
  IDLE = 'idle',
  CHECKING = 'checking',
  COPYRIGHT_FOUND = 'copyright_found',
  SCRAPING = 'scraping',
  READY = 'ready',
  ERROR = 'error',
}

export enum ProcessingMode {
    TEXT = 'text',
    JSON = 'json',
}

export interface UrlResult {
  url: string;
  status: ProcessingStatus;
  data?: string;
  dataType?: ProcessingMode;
  error?: string;
  reason?: string;
}