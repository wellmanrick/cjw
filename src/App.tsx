import { useEffect, useState } from 'react';
import { activities } from './activities/registry';
import { HomeScreen } from './components/HomeScreen';

function activityFromHash(): string | null {
  const id = window.location.hash.replace(/^#\/?/, '');
  return activities.some((a) => a.id === id) ? id : null;
}

/** Hash-based navigation so the browser/phone back button works. */
export default function App() {
  const [activeId, setActiveId] = useState<string | null>(activityFromHash);

  useEffect(() => {
    const onHashChange = () => setActiveId(activityFromHash());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const open = (id: string) => {
    window.location.hash = `/${id}`;
  };
  const goHome = () => {
    window.location.hash = '';
  };

  const active = activities.find((a) => a.id === activeId);
  if (active) {
    return <active.Component onExit={goHome} />;
  }
  return <HomeScreen onOpenActivity={open} />;
}
