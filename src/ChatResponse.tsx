import { useEffect, useState } from 'react';

interface ChatResponseProps {
    prompt: string;
}

const ChatResponse = ( { prompt }: ChatResponseProps ) => {
    const [response, setResponse] = useState('...');

    const completeChatWithInjection = async () => {
        let tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    
        let activeTab = tabs[0];
        let activeTabId = activeTab.id;
    
        let embeddings = '[]'
        if (activeTabId) {
          embeddings = sessionStorage.getItem(activeTabId.toString()) || '[]';
        }
    
        const response = await fetch("http://localhost:5000/complete_chat", {
          method: "post",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            "user_input": prompt,
            "embeddings": embeddings,
          }),
        });
    
        const data = await response.json();
        setResponse(data.message)
    }

    useEffect(() => {completeChatWithInjection()}, []);

    return (
        <div className="flex justify-start">
            <div className="chat-bubble bg-zinc-600">{response}</div>
        </div>
    );
};

export default ChatResponse;
