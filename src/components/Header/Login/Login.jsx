import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.scss';

const Login = ({ onClose, onLoginSuccess }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            // Gọi API để kiểm tra tài khoản từ json-server
            const response = await fetch('http://localhost:5000/users');
            const users = await response.json();

            // Tìm tài khoản trong danh sách người dùng
            const foundAccount = users.find(
                (account) => account.username === username && account.password === password
            );

            if (foundAccount) {
                // Lưu thông tin đăng nhập vào localStorage
                localStorage.setItem('token', 'mockToken123'); // Token giả
                localStorage.setItem('role', foundAccount.role); // Lưu vai trò người dùng

                onLoginSuccess(foundAccount.username); // Truyền username lên Header (nếu cần)

                // Điều hướng dựa trên vai trò
                if (foundAccount.role === 'teacher') {
                    navigate('/tea_viewnoteti');
                } else if (foundAccount.role === 'student') {
                    navigate('/viewnoteti');
                }

                onClose();
            } else {
                alert('Tên đăng nhập hoặc mật khẩu không chính xác.');
            }
        } catch (error) {
            alert('Đã xảy ra lỗi khi đăng nhập. Vui lòng thử lại.');
            console.error(error);
        }
    };

    return (
        <div className="login-form-overlay">
            <div className="login-form">
                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <p className="username">Nhập tên đăng nhập:</p>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <p className="password">Mật khẩu:</p>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="Login">
                        <button type="submit" className="login-button">Đăng nhập</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
