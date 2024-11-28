import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from './UserContext';  // Import useUser từ context
import './Login.scss'

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { login, user } = useUser(); // Sử dụng login từ context
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const success = await login(username, password); // Gọi hàm login từ context
            if (success) {
                // Kiểm tra role và điều hướng
                if (user?.role === 'teacher') {
                    navigate('/teacher-dashboard');
                } else if (user?.role === 'student') {
                    navigate('/student-dashboard');
                }

            } else {
                alert('Tên đăng nhập hoặc mật khẩu không đúng!');
            }
        } catch (error) {
            console.error('Error during login:', error);
        }
    };

    return (
        <div>
            <form onSubmit={handleLogin}>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Tên đăng nhập"
                    required
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mật khẩu"
                    required
                />
                <button type="submit">Đăng nhập</button>
            </form>
        </div>
    );
};

export default Login;
