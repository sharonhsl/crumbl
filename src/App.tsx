import React, { useEffect, useState } from 'react';
import _, {debounce} from 'lodash';
import './App.css';

function App() {

  const [count, setCount] = useState(0);
  const [currCount, setCurrCount] = useState(0);

  const updateJarCount = debounce(() => chrome.cookies.getAll({}, (cookies: any) => {
    setCount(cookies.length);
  }), 100);

  const checkTabCookies = debounce((tabId: number) => {
    chrome.storage.local.get(tabId.toString(), (result) => {
      let total = 0;
      result[tabId].forEach((domain: string) => {
          chrome.cookies.getAll({domain: domain}, (cookies: any) => {
            if (cookies.length > 0) {
              total += cookies.length;
              setCurrCount(total);
            }
          });
      });
    });
}, 80);

  const getTabId = () => chrome.tabs.query({active: true, currentWindow: true}, (result) => {
    console.log(result);
    if (result.length > 0 && result[0].id !== undefined) {
        const tabId = result[0].id
        checkTabCookies(tabId);
        console.log(tabId);
        chrome.cookies.onChanged.addListener(() => checkTabCookies(tabId));
    }
  });

  useEffect(() => {
    updateJarCount();
    chrome.cookies.onChanged.addListener(updateJarCount);
    getTabId();
  }, []);

  // chrome.runtime.onMessage.addListener(
  //   function(request, sender, sendResponse) {
  //     console.log(sender.tab ?
  //                 "from a content script:" + sender.tab.url :
  //                 "from the extension");
  //     if (request.greeting === "hello")
  //       sendResponse({farewell: "goodbye"});
  //   }
  // );


  return (
    <div className="App">
      <header className="App-header">
        <p>You got {count} cookies in your jar.</p>
        <p>This website stores {currCount} cookies.</p>
        <p>Flavors: Advertisement x1</p>
      </header>
    </div>
  );
}

export default App;
