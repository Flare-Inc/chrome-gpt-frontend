import { useEffect, useState } from 'react';
import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons'
import Chat from './Chat';

const App = () => {
  const [pageProcessed, setPageProcessed] = useState<boolean | null>(null);

  const DOMtoString = (selector: any) => {
    if (selector) {
      selector = document.querySelector(selector);
      if (!selector) return "ERROR: querySelector failed to find node"
    } else {
      selector = document.documentElement;
    }
    return selector.outerHTML;
  };

  const processPage = async () => {
    let tabs = await chrome.tabs.query({ active: true, currentWindow: true });

    let activeTab = tabs[0];
    let activeTabId = activeTab.id;

    if (activeTabId && sessionStorage.getItem(activeTabId.toString())) {
      setPageProcessed(true);
      return;
    }

    let results = await chrome.scripting.executeScript({
      target: { tabId: activeTabId as number },
      func: DOMtoString,
      args: ['body']
    });

    let response = await fetch("http://localhost:5000/process_page",
      {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          "body": results[0].result
        }),
      })

    const embeddings = await response.json();
    console.log(embeddings)

    if (activeTabId) {
      sessionStorage.setItem(activeTabId.toString(), JSON.stringify(embeddings));
    }

    setPageProcessed(true)
  };

  useEffect(() => { processPage() }, []);

  return (
    <div className="app">
      <div className="flex justify-start items-center mt-2 mb-4 mx-1">
        <img className="w-8" src="chromelogo.ico" />
        <h1 className="text-left mx-1 align-middle">Chrome-GPT</h1>
      </div>
      <div className="container h-400">
        {pageProcessed ? (
          <Chat/>
        ) : (
          <div className="h-full flex flex-col items-center justify-center">
            {pageProcessed === null ? (
              <>
                <FontAwesomeIcon icon={faCircleNotch} spin />
                <p onClick={() => setPageProcessed(true)}>Processing Page...</p>
              </>
            ) : (
              <p>Error Occurred</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
