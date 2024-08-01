import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SignupPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:4000/signup', { username, password });
            navigate(`/setinfo/${response.data.userId}`);
        } 
        catch (error) {
            console.error('Error signing up:', error);
            alert('Error signing up');
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <h1>Signup</h1>
                <div>
                    <label>Username:</label>
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
                </div>
                <div>
                    <label>Password:</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <button type="submit" class="btn btn-outline-primary">Signup</button>
            </form>
            <button onClick={() => navigate('/')} class="btn btn-outline-primary" >Already have account? Go to Login</button>
        </div>
    );
};

export default SignupPage;
