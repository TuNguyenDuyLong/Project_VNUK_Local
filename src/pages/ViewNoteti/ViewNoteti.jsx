import React, { useState, useEffect } from 'react';
import './ViewNoteti.scss';
import { Link } from 'react-router-dom';

const ViewNoteti = () => {
    const [studentInfo, setStudentInfo] = useState(null); // Thông tin sinh viên
    const [notifications, setNotifications] = useState([]); // Thông báo nghỉ
    const [makeupNotifications, setMakeupNotifications] = useState([]); // Thông báo bù
    const [selectedNotificationType, setSelectedNotificationType] = useState('nghỉ'); // Loại thông báo được chọn

    // Lấy thông tin sinh viên
    useEffect(() => {
        fetch('http://localhost:5000/info_students')
            .then((response) => response.json())
            .then((data) => {
                // Nếu dữ liệu là mảng, lấy phần tử đầu tiên
                const studentData = Array.isArray(data) ? data[0] : data;
                console.log('Student Info:', studentData); // Kiểm tra lại thông tin sinh viên
                setStudentInfo(studentData);
            })
            .catch((error) => console.error('Error fetching student info:', error));
    }, []);


    // Lấy thông báo nghỉ
    useEffect(() => {
        if (studentInfo) {
            console.log('Fetching Notifications for class:', studentInfo.class, 'and subjects:', studentInfo.enrolledSubjects); // Kiểm tra lớp và môn học
            fetch('http://localhost:5000/notifications')
                .then((response) => response.json())
                .then((data) => {
                    console.log('Notifications Data:', data); // Kiểm tra dữ liệu thông báo trả về từ API
                    // Lọc thông báo nghỉ theo lớp và môn học của sinh viên
                    const filteredData = data.filter(
                        (notif) =>
                            notif.class === studentInfo.class &&
                            studentInfo.enrolledSubjects.includes(notif.course)
                    );
                    console.log('Filtered Notifications:', filteredData); // Kiểm tra kết quả lọc
                    setNotifications(filteredData);
                })
                .catch((error) => console.error('Error fetching notifications:', error));
        }
    }, [studentInfo]);

    // Lấy thông báo bù
    useEffect(() => {
        if (studentInfo) {
            console.log('Fetching Makeup Notifications for class:', studentInfo.class, 'and subjects:', studentInfo.enrolledSubjects); // Kiểm tra lớp và môn học
            fetch('http://localhost:5000/notifications_com')
                .then((response) => response.json())
                .then((data) => {
                    console.log('Makeup Notifications Data:', data); // Kiểm tra dữ liệu thông báo bù
                    // Lọc thông báo bù theo lớp và môn học của sinh viên
                    const filteredData = data.filter(
                        (notif) =>
                            notif.class === studentInfo.class &&
                            studentInfo.enrolledSubjects.includes(notif.course)
                    );
                    console.log('Filtered Makeup Notifications:', filteredData); // Kiểm tra kết quả lọc
                    setMakeupNotifications(filteredData);
                })
                .catch((error) => console.error('Error fetching makeup notifications:', error));
        }
    }, [studentInfo]);

    if (!studentInfo) {
        return <div>Đang tải thông tin sinh viên...</div>;
    }

    return (
        <div className="ViewNoteti">
            {/* Left Section: Danh sách thông báo */}
            <div className="grid__column-2-3">
                <div className="notification">

                    <h1>THÔNG BÁO TỪ GIẢNG VIÊN BỘ MÔN</h1>

                    {/* Tiêu đề chọn loại thông báo */}
                    <div className="notification-types">
                        <h2
                            className={`section-title ${selectedNotificationType === 'nghỉ' ? 'active' : ''}`}
                            onClick={() => setSelectedNotificationType('nghỉ')}
                        >
                            THÔNG BÁO NGHỈ
                        </h2>
                        <h2
                            className={`section-title ${selectedNotificationType === 'bù' ? 'active' : ''}`}
                            onClick={() => setSelectedNotificationType('bù')}
                        >
                            THÔNG BÁO BÙ
                        </h2>
                    </div>

                    {/* Hiển thị thông báo dựa trên loại được chọn */}
                    <div className="notifications-list">
                        {selectedNotificationType === 'nghỉ' &&
                            (notifications.length > 0 ? (
                                notifications.map((notif, index) => (
                                    <div key={index} className="notification-block">
                                        <div className="notification-info-date">
                                            <span className='note_dateTime'>{new Date(notif.createdAt).toLocaleString()}</span>
                                            <h2 className="notification-title">THÔNG BÁO NGHỈ {index + 1}</h2>
                                        </div>
                                        <div className="notification-info">
                                            <div><strong>Môn Học:</strong> {notif.course}</div>
                                            <div><strong>Lớp:</strong> {notif.class}</div>
                                            <div><strong>Phòng:</strong> {notif.room}</div>
                                            <div><strong>Tuần:</strong> {notif.week}</div>
                                            <div><strong>Thứ:</strong> {notif.dayOfWeek}</div>
                                            <div><strong>Tiết:</strong> {notif.classPeriod}</div>
                                            <div><strong>Ghi Chú:</strong> {notif.note}</div>
                                        </div>

                                    </div>
                                ))
                            ) : (
                                <p>Không có thông báo nghỉ nào.</p>
                            ))}

                        {selectedNotificationType === 'bù' &&
                            (makeupNotifications.length > 0 ? (
                                makeupNotifications.map((notif, index) => (
                                    <div key={index} className="notification-block">
                                        <div className="notification-info-date">
                                            <strong className='note_dateTime'>{new Date(notif.createdAt).toLocaleString()}</strong>
                                            <h2 className="notification-title">THÔNG BÁO BÙ {index + 1}</h2>
                                        </div>
                                        <div className="notification-info">
                                            <div><strong>Môn Học:</strong> {notif.course}</div>
                                            <div><strong>Lớp:</strong> {notif.class}</div>
                                            <div><strong>Phòng:</strong> {notif.room}</div>
                                            <div><strong>Tuần:</strong> {notif.week}</div>
                                            <div><strong>Thứ:</strong> {notif.dayOfWeek}</div>
                                            <div><strong>Tiết:</strong> {notif.classPeriod}</div>
                                            <div><strong>Ghi Chú:</strong> {notif.note}</div>
                                        </div>

                                    </div>
                                ))
                            ) : (
                                <p>Không có thông báo bù nào.</p>
                            ))}
                    </div>
                </div>
            </div>

            {/* Right Section: Menu thông báo khác */}
            <div className="grid__column-1-3">
                <div className="Menu_Manage_Notetication_student">
                    <h1 className="Notetie_title_menu">THÔNG BÁO SINH VIÊN</h1>
                    <div className="menu_table">
                        <Link to="/viewnoteti#">Thông báo từ giảng viên bộ môn</Link>
                        <Link to="/noteti">Thông báo từ khoa</Link>
                        <Link to="/noteti">Thông báo từ phòng đào tạo</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewNoteti;
