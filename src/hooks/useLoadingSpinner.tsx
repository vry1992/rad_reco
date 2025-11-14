import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useLoginSelectors } from '../features/Login/store/slice';
import { StateStatus } from '../store/types';
import { FullScreenSpinner } from '../ui/FullScreenSpinner';

export const useLoadingSpinner = () => {
  const { status: loginStatus } = useLoginSelectors();
  const [showSpinner, setShowSpinner] = useState(false);

  const statuses = [loginStatus];

  useEffect(() => {
    const root = document.querySelector('#root');
    root?.classList.add('show-spinner');

    if (statuses.some((s) => s === StateStatus.LOADING)) {
      setShowSpinner(true);
    } else {
      root?.classList.remove('show-spinner');
      setShowSpinner(false);
    }
  }, [statuses]);

  return {
    showSpinner,
    Spinner: createPortal(
      <FullScreenSpinner />,
      document.querySelector('#spinner') as Element
    ),
  };
};
