// src/components/Chat.js
import React, { useEffect, useState } from 'react';
import { db, auth } from '../firebaseConfig';
import { collection, addDoc, query, onSnapshot, orderBy } from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import './Chat.css';

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            if (!currentUser) {
                navigate('/login'); // Redirect to login if not authenticated
            }
        });

        const messagesQuery = query(collection(db, 'messages'), orderBy('timestamp'));
        const unsubscribeMessages = onSnapshot(messagesQuery, (querySnapshot) => {
            setMessages(querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
        });

        return () => {
            unsubscribeAuth();
            unsubscribeMessages();
        };
    }, [navigate]);

    const sendMessage = async (e) => {
        e.preventDefault();
        if (input.trim()) {
            await addDoc(collection(db, 'messages'), {
                text: input,
                timestamp: new Date(),
                user: user?.displayName || 'Anonymous',
            });
            setInput('');
        }
    };

    const formatTime = (timestamp) => {
        return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const handleLogout = async () => {
        await signOut(auth);
    };

    return (
        <div className="chat-window">
            <div className="chat-header">
                <strong>Welcome, {user?.displayName || 'Anonymous'}</strong>
                <button onClick={handleLogout} className="logout-btn">Logout</button>
            </div>
            <div className="messages">
                {messages.map(message => (
                    <div key={message.id} className={message.user === user?.displayName ? 'message sent' : 'message received'}>
                        <strong>{message.user}</strong>: {message.text}
                        <span className="timestamp">({formatTime(message.timestamp.toDate())})</span>
                    </div>
                ))}
            </div>
            <form onSubmit={sendMessage}>
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type a message..."
                />
                <button type="submit">Send</button>
            </form>
        </div>
    );
};

export default Chat;
