import React, { useEffect, useState } from 'react';
import './Header.scss';
import Logo from '../../assets/images/logo.png';
import User from '../../assets/images/user.png';
import { NavLink, useNavigate } from 'react-router-dom';
import Login from './Login/Login';
import { useUser } from './Login/UserContext'; // Import useUser từ context

const Header = () => {
    const [showLogin, setShowLogin] = useState(false);
    const { user, logout } = useUser(); // Lấy thông tin từ context
    const navigate = useNavigate();

    const toggleLogin = () => {
        setShowLogin(prevState => !prevState);
    };

    const handleLogout = () => {
        logout(); // Xóa user trong context
        navigate('/'); // Chuyển hướng về trang chủ
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
                        {user && <div className='display_username'>{user.username}</div>}
                    </div>
                    <button onClick={user ? handleLogout : toggleLogin} className='header_login'>
                        {user ? 'ĐĂNG XUẤT' : 'ĐĂNG NHẬP'}
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

            {showLogin && <Login onClose={() => setShowLogin(false)} />}
        </nav>
    );
};

export default Header;
