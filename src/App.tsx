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

  const { isLoading, data } = useQuery<number | null, Error>('tabId', getTabId);

  if (isLoading) return <p>...Loading</p>;

  return (
    <div className="App">
      {data && <Overview tabId={data} />}
      {data && <Flavors tabId={data} />}
    </div>
  );
}

export default App;
