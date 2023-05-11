import { useEffect, useState } from 'react';
import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons'

function App() {
  const [pageProcessed, setPageProcessed] = useState<boolean | null>(null);
  const [userInput, setUserInput] = useState('');
  const [message, setMessage] = useState('');

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
    var message = document.querySelector('#message');

    chrome.tabs.query({ active: true, currentWindow: true }).then(function (tabs) {
        var activeTab = tabs[0];
        var activeTabId = activeTab.id;

        return chrome.scripting.executeScript({
            target: { tabId: activeTabId as number },
            func: DOMtoString,
            args: ['body']
        });

    }).then(function (results) {
      console.log(results[0].result);
      fetch("http://localhost:5000/process_page", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          "body": results[0].result
        }),
      }).then(() => setPageProcessed(true));
    }).catch(function (error) {
      console.error('There was an error injecting script : \n' + error.message);
      setPageProcessed(false);
    });
  };

  const testFunction = async () => {
    const response = await fetch("http://localhost:5000/complete_chat", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "user_input": userInput
      }),
    });

    const data = await response.json();
    console.log(data)

    setMessage(data.message)
  }

  useEffect(() => {processPage()}, []);

  return (
    <div className="app">
      <div className="flex justify-start items-center mt-2 mb-4 mx-1">
        <img className="w-8" src="chromelogo.ico"/>
        <h1 className="text-left mx-1 align-middle">Chrome-GPT</h1>
      </div>
      <div className="container h-400">
        {pageProcessed ? (
          <div className="h-full flex flex-col-reverse">
            <input value={userInput} onChange={(e) => setUserInput(e.target.value)} />
            <button onClick={() => testFunction()}>Send Prompt</button>
            {message !== '' && (
              <p>{message}</p>
            )}
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center">
            <FontAwesomeIcon icon={faCircleNotch} spin />
            <p onClick={() => setPageProcessed(true)}>Processing Page...</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
