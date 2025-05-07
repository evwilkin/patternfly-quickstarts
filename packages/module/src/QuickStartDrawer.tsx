import { FC, useContext, useEffect, useState } from 'react';
import { Drawer, DrawerContent, DrawerContentBody } from '@patternfly/react-core';
import QuickStartCloseModal from './QuickStartCloseModal';
import QuickStartDrawerContent from './QuickStartDrawerContent';
import {
  getDefaultQuickStartState,
  QuickStartContext,
  QuickStartContextValues,
} from './utils/quick-start-context';
import { QUICKSTART_ID_FILTER_KEY } from './utils/const';
import { QuickStart, QuickStartStatus } from './utils/quick-start-types';
import { getQuickStartByName } from './utils/quick-start-utils';
export interface QuickStartDrawerProps extends React.HTMLProps<HTMLDivElement> {
  quickStarts?: QuickStart[];
  children?: React.ReactNode;
  appendTo?: HTMLElement | (() => HTMLElement);
  fullWidth?: boolean;
  onCloseInProgress?: any;
  onCloseNotInProgress?: any;
}

export const QuickStartDrawer: FC<QuickStartDrawerProps> = ({
  quickStarts = [],
  children,
  appendTo,
  fullWidth,
  onCloseInProgress,
  onCloseNotInProgress,
  ...props
}) => {
  const {
    activeQuickStartID,
    setActiveQuickStart,
    allQuickStarts = [],
    allQuickStartStates,
    setAllQuickStartStates,
  } = useContext<QuickStartContextValues>(QuickStartContext);
  const combinedQuickStarts = allQuickStarts.concat(quickStarts);
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    // if there is a quick start param, but the quick start is not active, set it
    // this can happen if a new browser session is opened or an incognito window for example
    const quickStartIdFromParam = params.get(QUICKSTART_ID_FILTER_KEY) || '';
    if (quickStartIdFromParam && activeQuickStartID !== quickStartIdFromParam) {
      const activeQuickStart = getQuickStartByName(quickStartIdFromParam, combinedQuickStarts);
      // don't try to load a quick start that is actually just an external resource (spec.link)
      if (combinedQuickStarts.length > 0 && activeQuickStart && !activeQuickStart.spec.link) {
        setActiveQuickStart(quickStartIdFromParam);
      }
    }
  }, [activeQuickStartID, combinedQuickStarts, setActiveQuickStart]);

  useEffect(() => {
    // If activeQuickStartID was changed through prop from QuickStartContainer, need to init the state if it does not exist yet
    if (activeQuickStartID && !allQuickStartStates[activeQuickStartID]) {
      setAllQuickStartStates({
        ...allQuickStartStates,
        [activeQuickStartID]: getDefaultQuickStartState(),
      });
    }
  }, [activeQuickStartID, allQuickStartStates, setAllQuickStartStates]);

  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const onClose = () => setActiveQuickStart('');
  const handleClose = (activeQuickStartStatus: string | number) => {
    if (activeQuickStartStatus === QuickStartStatus.IN_PROGRESS) {
      if (onCloseInProgress) {
        onCloseInProgress();
      } else {
        setModalOpen(true);
      }
    } else if (onCloseNotInProgress) {
      onCloseNotInProgress();
    } else {
      onClose();
    }
  };

  const onModalConfirm = () => {
    setModalOpen(false);
    onClose();
  };

  const onModalCancel = () => setModalOpen(false);

  const fullWidthBodyStyle = fullWidth
    ? {
        style: {
          display: activeQuickStartID ? 'none' : 'flex',
        },
      }
    : {};

  return (
    <>
      <Drawer isExpanded={!!activeQuickStartID} isInline {...props}>
        <DrawerContent
          panelContent={
            <QuickStartDrawerContent
              quickStarts={combinedQuickStarts}
              handleDrawerClose={handleClose}
              appendTo={appendTo}
              fullWidth={fullWidth}
            />
          }
          {...fullWidthBodyStyle}
        >
          <DrawerContentBody>{children}</DrawerContentBody>
        </DrawerContent>
      </Drawer>
      <QuickStartCloseModal
        isOpen={modalOpen}
        onConfirm={onModalConfirm}
        onCancel={onModalCancel}
      />
    </>
  );
};

export default QuickStartDrawer;
