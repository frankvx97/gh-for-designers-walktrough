import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import ScanlinesOverlay from './components/ScanlinesOverlay';

export default function App() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [location.pathname]);

  return (
    <>
      <Outlet />
      <ScanlinesOverlay />
    </>
  );
}
