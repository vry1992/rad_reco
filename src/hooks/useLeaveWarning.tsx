import { Modal } from 'antd';
import { useCallback, type FC, type JSX } from 'react';
import { useBlocker, type Blocker, type BlockerFunction } from 'react-router';

export const useLeaveWarning = (
  isFormTouchedCb: () => boolean
): {
  blocker: Blocker;
  showLeaveModal: () => JSX.Element;
} => {
  const shouldBlock = useCallback<BlockerFunction>(
    ({ currentLocation, nextLocation }) => {
      const shouldBlock =
        currentLocation.pathname !== nextLocation.pathname && isFormTouchedCb();

      return shouldBlock;
    },
    []
  );

  const blocker = useBlocker(shouldBlock);

  const LeaveModal: FC<{ state: string }> = ({ state }) => {
    return (
      <Modal
        title="Ахтунг!"
        closable={{ 'aria-label': 'Custom Close Button' }}
        open={state === 'blocked'}
        onOk={blocker.proceed}
        onCancel={blocker.reset}>
        Введені дані видаляться! Продовжити?
      </Modal>
    );
  };

  return {
    blocker,
    showLeaveModal: () => <LeaveModal state={blocker.state} />,
  };
};
