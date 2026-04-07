import React from 'react';

interface Props {
  username: string;
  isConnected: boolean;
  onLogout: () => void;
}

export default function Header({ username, isConnected, onLogout }: Props) {
  const connectionLabel = isConnected ? 'Connected' : 'Disconnected';
  const connectionColor = isConnected ? 'green' : 'gray';

  return (
    <div style={{ marginBottom: '15px', paddingBottom: '10px', borderBottom: '1px solid #ddd' }}>
      <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
        {username || 'Loading...'}
      </div>

      <div style={{ fontSize: '12px', color: connectionColor, marginBottom: '8px' }}>
        {connectionLabel}
      </div>

      <button
        onClick={onLogout}
        style={{ fontSize: '12px', padding: '4px 8px', cursor: 'pointer', width: '100%' }}
      >
        Logout
      </button>
    </div>
  );
}