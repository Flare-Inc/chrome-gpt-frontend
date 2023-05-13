interface ChatRequestProps {
    prompt: string;
}

const ChatRequest = ( { prompt }: ChatRequestProps ) => {
    return (
        <div className="flex justify-end">
            <div className="chat-bubble bg-blue-800">{prompt}</div>
        </div>
    );
};

export default ChatRequest;
