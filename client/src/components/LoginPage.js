import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:4000/login', { username, password });
            navigate(`/dashboard/${response.data.userId}`);
        } 
        catch (error) {
            console.error('Error logging in:', error);
            alert('Error logging in');
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <h1>Login</h1>
                <div>
                    <label>Username:</label>
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
                </div>
                <div>
                    <label>Password:</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <button type="submit">Login</button>
            </form>
            <button onClick={() => navigate('/signup')}>No Account? Go to Signup</button>
        </div>
    );
};

export default LoginPage;
