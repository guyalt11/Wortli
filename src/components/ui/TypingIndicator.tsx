import React from 'react';

const TypingIndicator = () => {
    return (
        <div className="flex items-center space-x-1 px-1 h-5">
            <div className="w-1 h-1 bg-light rounded-full animate-bounce-high-scale [animation-delay:-0.3s]"></div>
            <div className="w-1 h-1 bg-light rounded-full animate-bounce-high-scale [animation-delay:-0.15s]"></div>
            <div className="w-1 h-1 bg-light rounded-full animate-bounce-high-scale"></div>

        </div>
    );
};

export default TypingIndicator;
