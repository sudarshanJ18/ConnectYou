// src/components/SignIn.js
import React, { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

const SignIn = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const history = useHistory();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/auth/signin', { email, password });
            localStorage.setItem('token', response.data.token); // Store the token
            history.push('/dashboard'); // Redirect to dashboard
        } catch (error) {
            console.error('Error signing in', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button type="submit">Sign In</button>
        </form>
    );
};

export default SignIn;
