'use client';

import { FC } from 'react';
import { UploadDropzone } from '@/lib/uploadthing';
import '@uploadthing/react/styles.css';

interface FileUploadProps {
  endpoint: 'messageFile' | 'serverImage';
  value: string;
  onChange: (url?: string) => void;
}

export const FileUpload: FC<FileUploadProps> = ({ endpoint, value, onChange }) => {
  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={res => {
        onChange(res?.[0].fileUrl);
      }}
      onUploadError={(err: Error) => console.log(err)}
    />
  );
};
