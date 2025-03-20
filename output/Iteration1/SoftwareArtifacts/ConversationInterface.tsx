import React, { useState } from 'react';
import styled from 'styled-components';
import { Message } from '../types';

interface ConversationInterfaceProps {
  messages: Message[];
  onSendMessage: (content: string) => void;
  onShowProcessingDetails: (messageId: string) => void;
}

const ConversationInterface: React.FC<ConversationInterfaceProps> = ({
  messages,
  onSendMessage,
  onShowProcessingDetails
}) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSendMessage(inputValue);
      setInputValue('');
    }
  };

  return (
    <ConversationContainer>
      <MessageList>
        {messages.map(message => (
          <MessageItem key={message.id} sender={message.sender}>
            <MessageSender>{message.sender === 'user' ? 'You' : 'AI'}</MessageSender>
            <MessageContent>{message.content}</MessageContent>
            {message.sender === 'system' && message.processingPath.length > 0 && (
              <ProcessingDetailsButton 
                onClick={() => onShowProcessingDetails(message.id)}
              >
                [Show Processing Details]
              </ProcessingDetailsButton>
            )}
          </MessageItem>
        ))}
      </MessageList>
      <InputForm onSubmit={handleSubmit}>
        <MessageInput
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type your message..."
        />
        <SendButton type="submit">SEND</SendButton>
      </InputForm>
    </ConversationContainer>
  );
};

const ConversationContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  border: var(--border-width) solid var(--color-border);
  box-shadow: var(--shadow-default);
  background-color: var(--color-background);
`;

const MessageList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const MessageItem = styled.div<{ sender: 'user' | 'system' }>`
  border: var(--border-width) solid var(--color-border);
  padding: 1rem;
  box-shadow: var(--shadow-default);
  max-width: 80%;
  align-self: ${props => props.sender === 'user' ? 'flex-end' : 'flex-start'};
  background-color: ${props => props.sender === 'user' 
    ? 'var(--color-accent-primary)' 
    : 'var(--color-accent-secondary)'};
  color: ${props => props.sender === 'user' ? 'white' : 'var(--color-text-primary)'};
  position: relative;
  transform: ${props => props.sender === 'user' 
    ? 'rotate(1deg)' 
    : 'rotate(-1deg)'};
`;

const MessageSender = styled.div`
  font-weight: 700;
  margin-bottom: 0.5rem;
  font-family: var(--font-heading);
`;

const MessageContent = styled.div`
  white-space: pre-wrap;
`;

const ProcessingDetailsButton = styled.button`
  background: none;
  border: none;
  box-shadow: none;
  text-decoration: underline;
  color: var(--color-text-primary);
  padding: 0.5rem 0 0 0;
  font-size: 0.9rem;
  text-align: left;
  
  &:hover {
    color: var(--color-accent-primary);
  }
`;

const InputForm = styled.form`
  display: flex;
  padding: 1rem;
  border-top: var(--border-width) solid var(--color-border);
  background-color: var(--color-background-secondary);
`;

const MessageInput = styled.input`
  flex: 1;
  padding: 0.75rem;
  border: var(--border-width) solid var(--color-border);
  box-shadow: var(--shadow-default);
  font-size: 1rem;
`;

const SendButton = styled.button`
  margin-left: 0.5rem;
  background-color: var(--color-accent-primary);
  color: white;
  font-weight: 700;
  padding: 0.75rem 1.5rem;
  transform: translate(-2px, -2px);
  box-shadow: calc(var(--border-offset) + 2px) calc(var(--border-offset) + 2px) 0 0 var(--color-border);
  
  &:hover {
    transform: translate(-3px, -3px);
    box-shadow: calc(var(--border-offset) + 3px) calc(var(--border-offset) + 3px) 0 0 var(--color-border);
  }
  
  &:active {
    transform: translate(0, 0);
    box-shadow: var(--shadow-default);
  }
`;

export default ConversationInterface;
