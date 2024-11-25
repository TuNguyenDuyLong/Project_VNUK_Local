import React, { useState, useEffect } from 'react';
import './Tea_View_CreateNoteti.scss';
import { Link } from 'react-router-dom';

const Tea_View_CreateNoteti = () => {
    const [notifications, setNotifications] = useState([]); // Lưu thông báo nghỉ
    const [makeupNotifications, setMakeupNotifications] = useState([]); // Lưu thông báo bù
    const [selectedNotificationType, setSelectedNotificationType] = useState('nghỉ'); // Loại thông báo được chọn

    useEffect(() => {
        // Lấy thông báo nghỉ
        const fetchNotifications = async () => {
            try {
                const response = await fetch('http://localhost:5000/notifications');
                const data = await response.json();
                setNotifications(data); // Lưu thông báo nghỉ
            } catch (error) {
                console.error('Error fetching notifications:', error);
            }
        };

        // Lấy thông báo bù
        const fetchMakeupNotifications = async () => {
            try {
                const response = await fetch('http://localhost:5000/notifications_com');
                const data = await response.json();
                setMakeupNotifications(data); // Lưu thông báo bù
            } catch (error) {
                console.error('Error fetching makeup notifications:', error);
            }
        };

        fetchNotifications();
        fetchMakeupNotifications();
    }, []);

    return (
        <div className="Notetication">
            <div className="grid__column-2-3">
                <div className="View_Notetication">
                    <h1 className="Noteti_title">LỊCH SỬ ĐĂNG KÝ</h1>

                    {/* Selector for notification types (nghỉ, bù) */}
                    <div className="notification-types">
                        <h2
                            className={`section-title ${selectedNotificationType === 'nghỉ' ? 'active' : ''}`}
                            onClick={() => setSelectedNotificationType('nghỉ')}
                        >
                            ĐĂNG KÝ BÁO NGHỈ
                        </h2>
                        <h2
                            className={`section-title ${selectedNotificationType === 'bù' ? 'active' : ''}`}
                            onClick={() => setSelectedNotificationType('bù')}
                        >
                            ĐĂNG KÝ BÁO BÙ
                        </h2>
                    </div>

                    {/* Displaying notifications based on the selected type */}
                    <div className="Noteti_Content">
                        {selectedNotificationType === 'nghỉ' ? (
                            notifications.length > 0 ? (
                                <div className="notification-list">
                                    {notifications.map((notification) => (
                                        <div key={notification.id}>
                                            <div className="NotificationDetail-block">
                                                <div><strong>Ngày tạo:</strong> {new Date(notification.createdAt).toLocaleString()}</div>
                                                <div><h3>{notification.course} - {notification.class}</h3></div>
                                                <div><strong>Môn học:</strong> {notification.course}</div>
                                                <div><strong>Lớp:</strong> {notification.class}</div>
                                                <div><strong>Phòng học:</strong> {notification.room}</div>
                                                <div><strong>Tuần học:</strong> {notification.week}</div>
                                                <div><strong>Thứ:</strong> {notification.dayOfWeek}</div>
                                                <div><strong>Tiết học:</strong> {notification.classPeriod}</div>
                                                <div><strong>Thông báo:</strong> {notification.note}</div>

                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p>Chưa có đăng ký báo nghỉ nào.</p>
                            )
                        ) : selectedNotificationType === 'bù' ? (
                            makeupNotifications.length > 0 ? (
                                <div className="notification-list">
                                    {makeupNotifications.map((notification) => (
                                        <div key={notification.id}>
                                            <div className="NotificationDetail-block">
                                                <div><strong>Ngày tạo:</strong> {new Date(notification.createdAt).toLocaleString()}</div>
                                                <div><h3>{notification.course} - {notification.class}</h3></div>
                                                <div><strong>Môn học:</strong> {notification.course}</div>
                                                <div><strong>Lớp:</strong> {notification.class}</div>
                                                <div><strong>Phòng học:</strong> {notification.room}</div>
                                                <div><strong>Tuần học:</strong> {notification.week}</div>
                                                <div>
                                                    <strong>Thứ:</strong> {notification.dayOfWeek}
                                                </div>
                                                <div>
                                                    <strong>Tiết học:</strong>
                                                    {notification.classPeriods.map((period, index) => (
                                                        <span key={index}>{period}{index < notification.classPeriods.length - 1 ? ', ' : ''}</span>
                                                    ))}
                                                </div>

                                                <div><strong>Tiết học:</strong> {notification.classPeriod}</div>
                                                <div><strong>Thông báo:</strong> {notification.note}</div>

                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p>Chưa có đăng ký báo bù nào.</p>
                            )
                        ) : null}
                    </div>
                </div>
            </div>

            <div className="grid__column-1-3">
                <div className="Menu_Notetication">
                    <h1 className="Notetie_title_menu">THÔNG BÁO DÀNH CHO GIẢNG VIÊN</h1>
                    <div className="menu_table">
                        <a href="#">Hội thảo, tập huấn và buổi họp</a>
                        <a href="#">Nghiên cứu và học bổng</a>
                        <a href="#">Thủ tục hành chính</a>
                        <a href="#">Chính sách và quy định mới</a>
                        <a href="#">Biểu mẫu</a>
                        <a href="#">Lịch giảng dạy</a>
                        <a href="#">Lịch coi thi và chấm thi</a>
                    </div>
                </div>
                <div className="Menu_Manage_Notetication">
                    <h1 className="Notetie_title_menu">QUẢN LÝ THÔNG BÁO GIẢNG VIÊN</h1>
                    <div className="menu_table">
                        <Link to="/tea_off_createnoteti">Đăng ký báo nghỉ</Link>
                        <Link to="/tea_on_createnoteti">Đăng ký báo bù</Link>
                        <Link to="/tea_createnoteti_session">Tạo thông báo môn học</Link>
                        <Link to="/tea_view_createnoteti">Xem thông tin đăng kí</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Tea_View_CreateNoteti;
