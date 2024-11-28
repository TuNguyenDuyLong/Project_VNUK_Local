import React, { createContext, useContext, useState, useEffect } from 'react';
import { decode } from 'jwt-decode';  // Sử dụng decode thay vì jwtDecode

const UserContext = createContext();

const UserProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        // Lấy thông tin người dùng từ localStorage nếu đã có
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    useEffect(() => {
        // Kiểm tra nếu có thông tin người dùng trong localStorage khi tải lại trang
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));  // Cập nhật trạng thái người dùng từ localStorage
        }
    }, []);

    const login = async (username, password) => {
        try {
            const response = await fetch('http://192.168.1.80:5000/api/Account/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }), // Gửi username và password
            });

            if (!response.ok) {
                return false; // Nếu không thành công thì trả về false
            }

            const data = await response.json();

            if (data.token) {
                // Giải mã token để lấy thông tin người dùng
                const decodedToken = decode(data.token); // Giải mã token

                // Tạo đối tượng người dùng với thông tin từ token
                const userInfo = {
                    username: decodedToken.sub,
                    role: decodedToken.role, // Ví dụ: role có thể là 'teacher' hoặc 'student'
                    token: data.token,
                };

                // Lưu thông tin người dùng vào localStorage
                localStorage.setItem('user', JSON.stringify(userInfo));
                setUser(userInfo); // Cập nhật trạng thái người dùng
                return true; // Trả về true khi đăng nhập thành công
            }

            return false; // Nếu không có token trong phản hồi thì trả về false
        } catch (error) {
            console.error('Error during login:', error);
            return false; // Trả về false nếu có lỗi trong quá trình đăng nhập
        }
    };

    // Hàm đăng xuất
    const logout = () => {
        setUser(null); // Xóa thông tin người dùng khỏi state
        localStorage.removeItem('user'); // Xóa thông tin người dùng khỏi localStorage
    };

    return (
        <UserContext.Provider value={{ user, login, logout }}>
            {children} {/* Cung cấp thông tin user cho các component con */}
        </UserContext.Provider>
    );
};

// Hook để lấy thông tin người dùng
const useUser = () => useContext(UserContext);

export { UserProvider, useUser };
