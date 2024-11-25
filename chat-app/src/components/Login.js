// src/components/Login.js
import React, { useState } from 'react';
import { auth } from '../firebaseConfig';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import '../Auth.css'; // Import CSS for styling

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const provider = new GoogleAuthProvider();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate('/'); // Redirect to Chat page after login
        } catch (error) {
            console.error("Error logging in:", error);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            await signInWithPopup(auth, provider);
            navigate('/'); // Redirect to Chat page after login
        } catch (error) {
            console.error("Error signing in with Google:", error);
        }
    };

    return (
        <div className="auth-container">
            <h2>Login</h2>
            <p>Welcome back!</p>
            <form onSubmit={handleLogin}>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter Your Username / Email"
                    required
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter Your Password"
                    required
                />
                <button type="submit" className="auth-btn">Login</button>
            </form>
            <p className="forgot-password">Forgot Password?</p>
            <p>
                Don't have an account? <button onClick={() => navigate('/signup')} className="link-btn">Signup</button>
            </p>
            <div className="separator">Or</div>
            <button onClick={handleGoogleLogin} className="social-login-btn google-btn">Login with Google</button>
        </div>
    );
};

export default Login;
