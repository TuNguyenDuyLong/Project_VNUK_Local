import React, { useEffect, useState } from 'react';
import './Header.scss';
import Logo from '../../assets/images/logo.png';
import User from '../../assets/images/user.png';
import { NavLink, useNavigate } from 'react-router-dom';
import Login from './Login/Login';

const Header = ({ setRole }) => {
    const [showLogin, setShowLogin] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState('');
    const navigate = useNavigate();

    const toggleLogin = () => {
        setShowLogin(prevState => !prevState);
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        const savedUsername = localStorage.getItem('username'); // Lấy username từ localStorage
        if (token && savedUsername) {
            setIsLoggedIn(true);
            setUsername(savedUsername);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('username');
        setIsLoggedIn(false);
        setUsername('');
        setRole(null);
        navigate('/');
    };

    return (
        <nav className='header'>
            <div className="header_top">
                <div className="header_logo-container">
                    <img src={Logo} alt="Logo" className="header_logo" />
                    <div className="header_name">
                        <h1 className='university-name'>ĐẠI HỌC ĐÀ NẴNG</h1>
                        <h1 className='institute-name'>VIỆN NGHIÊN CỨU ĐÀO TẠO VIỆT - ANH</h1>
                    </div>
                </div>
                <div className="header_user">
                    <div className="header_user-avatar">
                        <img src={User} alt="User Avatar" className="avatar" />
                    </div>
                    <div className="username">
                        {isLoggedIn && username && <div className='display_username'>{username}</div>}
                    </div>
                    <button onClick={isLoggedIn ? handleLogout : toggleLogin} className='header_login'>
                        {isLoggedIn ? 'ĐĂNG XUẤT' : 'ĐĂNG NHẬP'}
                    </button>
                </div>
            </div>

            <div className="header_bottom">
                <div className="header_menu">
                    <NavLink to="/" className={({ isActive }) => (isActive ? "header-link active" : "header-link")}>
                        TRANG CHỦ
                    </NavLink>
                    <NavLink to="/introduce" className={({ isActive }) => (isActive ? "header-link active" : "header-link")}>
                        GIỚI THIỆU
                    </NavLink>
                    <NavLink to="/news" className={({ isActive }) => (isActive ? "header-link active" : "header-link")}>
                        TIN TỨC
                    </NavLink>
                    <NavLink to="/admissions" className={({ isActive }) => (isActive ? "header-link active" : "header-link")}>
                        TUYỂN SINH
                    </NavLink>
                </div>
            </div>

            {showLogin && <Login onClose={() => setShowLogin(false)} onLoginSuccess={(username) => {
                setIsLoggedIn(true);
                setUsername(username);
                localStorage.setItem('username', username);
            }} />}
        </nav>
    );
};

export default Header;
