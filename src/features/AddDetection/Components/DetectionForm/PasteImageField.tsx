import { Image, Upload, type UploadFile } from 'antd';
import type { RcFile } from 'antd/es/upload';
import React, { useCallback, useEffect, useRef, useState } from 'react';

export const PasteImageField: React.FC<{
  onChange: (files: UploadFile[]) => void;
  title: string;
  limit?: number;
}> = (props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const handlePaste = useCallback(async (e: ClipboardEvent) => {
    if (!containerRef.current) return;

    if (!containerRef.current.contains(document.activeElement)) return;

    const item = [...e.clipboardData!.items].find((i) =>
      i.type.startsWith('image')
    );
    if (!item) return;

    const file = item.getAsFile();
    if (!file) return;

    const uid = String(Date.now());

    setFileList((prev) => {
      return [
        ...prev,
        {
          uid,
          name: file.name || 'pasted.png',
          status: 'done',
          originFileObj: file as RcFile,
          url: URL.createObjectURL(file),
        },
      ];
    });
  }, []);

  useEffect(() => {
    document.addEventListener('paste', handlePaste);
    if (props.limit && fileList?.length === props.limit) {
      document.removeEventListener('paste', handlePaste);
    }
    return () => document.removeEventListener('paste', handlePaste);
  }, [handlePaste, props.limit, fileList]);

  useEffect(() => {
    props.onChange(fileList);
  }, [fileList]);

  return (
    <div ref={containerRef} tabIndex={0}>
      <Upload
        style={{
          width: '100%',
        }}
        multiple={false}
        openFileDialogOnClick={false}
        accept=".png,.jpg"
        listType="picture-card"
        fileList={fileList}
        onPreview={(file) => {
          setPreviewImage(file.url!);
          setPreviewOpen(true);
        }}
        onChange={({ file }) => {
          if (file.status === 'removed') {
            setFileList((prev) => prev.filter(({ uid }) => uid !== file.uid));
          }
        }}>
        {!fileList?.length ||
        (props.limit && fileList?.length < props.limit) ? (
          <button style={{ border: 0, background: 'none' }} type="button">
            {props.title}
          </button>
        ) : null}
      </Upload>

      <Image
        width={0}
        height={0}
        style={{ opacity: 0 }}
        preview={{
          visible: previewOpen,
          onVisibleChange: (v) => setPreviewOpen(v),
        }}
        src={previewImage}
      />
    </div>
  );
};
