import React from 'react';
import { useQuery } from 'react-query';
import './App.css';
import Flavors from './components/Flavors';
import Overview from './components/Overview';

function App() {
  const getTabId = async () => {
    const result = await chrome.tabs.query({ active: true, currentWindow: true });
    if (result.length > 0 && result[0].id !== undefined) {
      return result[0].id;
    }
    return null;
  }

  const query = useQuery<number | null, Error>('tabId', getTabId);

  if (query.isLoading) return <p>...Loading</p>;

  return (
    <div className="App">
      {query.data && <Overview tabId={query.data} />}
      {query.data && <Flavors tabId={query.data} />}
    </div>
  );
}

export default App;
