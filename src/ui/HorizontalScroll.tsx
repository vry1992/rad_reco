import type { FC, PropsWithChildren } from 'react';

export const HorizontalScroll: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div
      style={{
        overflowX: 'auto',
        whiteSpace: 'nowrap',
        paddingBottom: '12px',
      }}>
      {children}
    </div>
  );
};
