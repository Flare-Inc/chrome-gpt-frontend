import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons'
import ChatRequest from './ChatRequest';
import ChatResponse from './ChatResponse';

const Chat = () => {
    const [userInput, setUserInput] = useState('');
    const [prompts, setPrompts] = useState<string[]>([]);

    const sendPrompt = () => {
      setPrompts((prompts) => {
        const newPrompts = prompts.map((p) => p.slice());
        newPrompts.push(userInput);
        return newPrompts;
      });
    };

    return (
    <div className="h-full flex flex-col-reverse p-2 gap-2">
        <div className="flex gap-2">
            <input className="grow" value={userInput} onChange={(e) => setUserInput(e.target.value)} />
            <button className="rounded-full w-8 h-8" onClick={sendPrompt}><FontAwesomeIcon icon={faPaperPlane} /></button>
        </div>
        <div className="chat-window overflow-y-auto">
          {prompts.map((prompt, index) => (
            <div key={index}>
              <ChatRequest prompt={prompt}/>
              <ChatResponse prompt={prompt}/>
            </div>
          ))}
        </div>
    </div>
    );
};

export default Chat;