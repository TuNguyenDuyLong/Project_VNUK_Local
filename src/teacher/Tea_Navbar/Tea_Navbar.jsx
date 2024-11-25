import React from 'react'
import './Tea_Navbar.scss'
import { NavLink } from 'react-router-dom'
const Tea_Navbar = () => {
    return (
        <div>
            <div className="navbar">
                <NavLink to="/tea_timetable" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>TRA CỨU TKB</NavLink>
                <NavLink to="/tea_examschedule" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>LỊCH COI THI</NavLink>
                <NavLink to="/tea_viewnoteti" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>THÔNG BÁO</NavLink>
            </div>
        </div>
    )
}

export default Tea_Navbar