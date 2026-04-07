import React from 'react';

export interface Room {
  id: number;
  name: string;
  description?: string;
}

interface Props {
  rooms: Room[];
  selectedRoom: Room | null;
  onSelectRoom: (room: Room) => void;
}

export default function RoomList({ rooms, selectedRoom, onSelectRoom }: Props) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      {rooms.map((room) => (
        <button
          key={room.id}
          onClick={() => onSelectRoom(room)}
          style={{
            textAlign: 'left',
            padding: '8px',
            border: '1px solid #ddd',
            background: selectedRoom?.id === room.id ? '#e8f0fe' : '#fff',
            cursor: 'pointer',
            borderRadius: '4px',
          }}
        >
          <div style={{ fontWeight: 600 }}>{room.name}</div>
          {room.description && (
            <div style={{ fontSize: '12px', color: '#666', marginTop: '2px' }}>
              {room.description}
            </div>
          )}
        </button>
      ))}
    </div>
  );
}