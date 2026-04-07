import React from 'react';

export interface Message {
  id: number;
  content: string;
  username: string;
  senderName?: string | null;
  createdAt: string;
  userId: number;
}

interface Props {
  message: Message;
  isOwn: boolean;
}

export default function MessageItem({ message, isOwn }: Props) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: isOwn ? 'flex-end' : 'flex-start',
        marginBottom: '10px',
      }}
    >
      <div
        style={{
          maxWidth: '70%',
          padding: '8px 12px',
          borderRadius: '12px',
          backgroundColor: isOwn ? '#dcf8c6' : '#f1f1f1',
          border: '1px solid #ddd',
        }}
      >
        <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>
          {message.senderName || message.username}
        </div>
        <div>{message.content}</div>
        <div style={{ fontSize: '11px', color: '#999', marginTop: '4px' }}>
          {new Date(message.createdAt).toLocaleString()}
        </div>
      </div>
    </div>
  );
}