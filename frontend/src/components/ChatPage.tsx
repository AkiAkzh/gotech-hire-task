import React, { useState, useEffect } from 'react';
import { Socket } from 'socket.io-client';
import RoomList, { Room } from './RoomList';
import MessageItem, { Message } from './MessageItem';
import Header from './Header';
import { SOCKET_EVENTS } from '../config';

interface Props {
  token: string;
  userId: number;
  socket: Socket;
  apiUrl: string;
  onLogout: () => void;
}

export default function ChatPage({ token, userId, socket, apiUrl, onLogout }: Props) {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [newRoomName, setNewRoomName] = useState('');
  const [newRoomDesc, setNewRoomDesc] = useState('');
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [username, setUsername] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);

  useEffect(() => {
    fetchRooms();
    fetchCurrentUser();

    const handleConnect = () => {
      setIsConnected(true);
    };

    const handleDisconnect = () => {
      setIsConnected(false);
    };

    const handleNewMessage = (message: Message) => {
      setMessages((prev) => {
        if (prev.some((msg) => msg.id === message.id)) {
          return prev;
        }
        return [...prev, message];
      });
    };

    socket.on(SOCKET_EVENTS.connect, handleConnect);
    socket.on(SOCKET_EVENTS.disconnect, handleDisconnect);
    socket.on(SOCKET_EVENTS.newMessage, handleNewMessage);

    return () => {
      socket.off(SOCKET_EVENTS.connect, handleConnect);
      socket.off(SOCKET_EVENTS.disconnect, handleDisconnect);
      socket.off(SOCKET_EVENTS.newMessage, handleNewMessage);
    };
  }, [socket]);

  const fetchCurrentUser = async () => {
    const res = await fetch(`${apiUrl}/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      return;
    }

    const currentUser: { id: number; username: string } = await res.json();
    setUsername(currentUser.username);
  };

  const fetchRooms = async () => {
    const res = await fetch(`${apiUrl}/chat/rooms`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setRooms(data);
  };

  const fetchMessages = async (roomId: number) => {
    setLoadingMessages(true);
    const res = await fetch(`${apiUrl}/chat/rooms/${roomId}/messages?limit=25&offset=0`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setMessages(data);
    setLoadingMessages(false);
  };

  const handleRoomSelect = (room: Room) => {
    if (selectedRoom) {
      socket.emit(SOCKET_EVENTS.leaveRoom, { roomId: selectedRoom.id });
    }
    setSelectedRoom(room);
    socket.emit(SOCKET_EVENTS.joinRoom, { roomId: room.id });
    fetchMessages(room.id);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedRoom) return;

    socket.emit(SOCKET_EVENTS.sendMessage, {
      roomId: selectedRoom.id,
      content: newMessage,
    });

    setNewMessage('');
  };

  const handleCreateRoom = async () => {
    if (!newRoomName.trim()) return;

    await fetch(`${apiUrl}/chat/rooms`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name: newRoomName, description: newRoomDesc }),
    });

    setNewRoomName('');
    setNewRoomDesc('');
    setShowCreateRoom(false);
    fetchRooms();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    height: '100vh',
    fontFamily: 'Arial, sans-serif',
  };

  const sidebarStyle: React.CSSProperties = {
    width: '250px',
    borderRight: '1px solid #ddd',
    display: 'flex',
    flexDirection: 'column',
    padding: '10px',
    backgroundColor: '#f5f5f5',
  };

  const mainStyle: React.CSSProperties = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  };

  const messagesStyle: React.CSSProperties = {
    flex: 1,
    overflowY: 'auto',
    padding: '10px',
  };

  const inputAreaStyle: React.CSSProperties = {
    display: 'flex',
    padding: '10px',
    borderTop: '1px solid #ddd',
    gap: '10px',
  };

  return (
    <div style={containerStyle}>
      <div style={sidebarStyle}>
        <Header username={username} isConnected={isConnected} onLogout={onLogout} />

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '10px',
          }}
        >
          <h3 style={{ margin: 0 }}>Rooms</h3>
          <button
            onClick={() => setShowCreateRoom(!showCreateRoom)}
            style={{ fontSize: '20px', cursor: 'pointer', border: 'none', background: 'none' }}
          >
            +
          </button>
        </div>

        {showCreateRoom && (
          <div style={{ marginBottom: '10px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <input
              placeholder="Room name"
              value={newRoomName}
              onChange={(e) => setNewRoomName(e.target.value)}
              style={{ padding: '5px' }}
            />
            <input
              placeholder="Description (optional)"
              value={newRoomDesc}
              onChange={(e) => setNewRoomDesc(e.target.value)}
              style={{ padding: '5px' }}
            />
            <button onClick={handleCreateRoom} style={{ padding: '5px', cursor: 'pointer' }}>
              Create
            </button>
          </div>
        )}

        <RoomList
          rooms={rooms}
          selectedRoom={selectedRoom}
          onSelectRoom={handleRoomSelect}
        />
      </div>

      <div style={mainStyle}>
        {selectedRoom ? (
          <>
            <div style={{ padding: '10px', borderBottom: '1px solid #ddd', backgroundColor: '#f9f9f9' }}>
              <h3 style={{ margin: 0 }}>#{selectedRoom.name}</h3>
              {selectedRoom.description && (
                <p style={{ margin: '5px 0 0', color: '#666', fontSize: '14px' }}>
                  {selectedRoom.description}
                </p>
              )}
            </div>

            <div style={messagesStyle}>
              {loadingMessages ? (
                <p>Loading messages...</p>
              ) : (
                messages.map((msg) => (
                  <MessageItem
                    key={msg.id}
                    message={msg}
                    isOwn={msg.userId === userId}
                  />
                ))
              )}
            </div>

            <div style={inputAreaStyle}>
              <input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a message..."
                style={{ flex: 1, padding: '8px', fontSize: '16px' }}
              />
              <button
                onClick={handleSendMessage}
                style={{ padding: '8px 16px', fontSize: '16px', cursor: 'pointer' }}
              >
                Send
              </button>
            </div>
          </>
        ) : (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
            <p style={{ color: '#666' }}>Select a room to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
}