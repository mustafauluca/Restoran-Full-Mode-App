import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { TopBar } from './components/navigation/TopBar';
import { QrMenuApp } from './components/qr/QrMenuApp';
import { PosApp } from './components/pos/PosApp';
import { VenuePanelApp } from './components/panel/VenuePanelApp';
import { SuperManagerApp } from './components/manager/SuperManagerApp';
import { VenueRadioApp } from './components/media/VenueRadioApp';
import { MenuBoardTvApp } from './components/media/MenuBoardTvApp';

const MainRouter: React.FC = () => {
  const { currentRoute } = useApp();

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans selection:bg-amber-500 selection:text-neutral-950">
      <TopBar />
      <main className="flex-1">
        {currentRoute === 'qr' && <QrMenuApp />}
        {currentRoute === 'pos' && <PosApp />}
        {currentRoute === 'panel' && <VenuePanelApp />}
        {currentRoute === 'manager' && <SuperManagerApp />}
        {currentRoute === 'radio' && <VenueRadioApp />}
        {(currentRoute === 'tv' || currentRoute === 'vid') && <MenuBoardTvApp />}
      </main>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainRouter />
    </AppProvider>
  );
}
