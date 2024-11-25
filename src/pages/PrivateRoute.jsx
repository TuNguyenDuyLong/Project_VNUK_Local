import React from 'react';
import { Route, Navigate } from 'react-router-dom';

const PrivateRoute = ({ element, ...rest }) => {
    const token = localStorage.getItem('token');  // Kiểm tra token trong localStorage

    // Nếu không có token, chuyển hướng về trang chủ
    return (
        <Route
            {...rest}
            element={token ? element : <Navigate to="/" />}
        />
    );
};

export default PrivateRoute;
