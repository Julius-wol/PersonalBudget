import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BudgetContext } from '../contexts/BudgetContext';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { dispatch } = useContext(BudgetContext);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        const res = await axios.get('http://localhost:9999/users');
        const user = res.data.find(u => u.username === username && u.password === password);
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
            dispatch({ type: 'LOGIN', payload: user });
            navigate('/dashboard');
        } else {
            alert("Sai tài khoản hoặc mật khẩu!");
        }
    };

    return (
        <div className="container mt-5" style={{ maxWidth: '400px' }}>
            <h2 className="text-center">Login</h2>
            <form onSubmit={handleLogin} className="card p-4 shadow">
                <input className="form-control mb-3" placeholder="Username" onChange={e => setUsername(e.target.value)} required />
                <input className="form-control mb-3" type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} required />
                <button className="btn btn-primary w-100">Login</button>
            </form>
        </div>
    );
};
export default Login;