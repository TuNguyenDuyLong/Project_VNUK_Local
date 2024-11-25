import React, { useState, useEffect } from 'react';
import './Tea_CreateNoteti.scss';
import { Link } from 'react-router-dom';

const Tea_CreateNoteti = () => {
    const [semesters, setSemesters] = useState([]); // Danh sách học kỳ
    const [selectedSemester, setSelectedSemester] = useState(''); // Học kỳ đã chọn
    const [courses, setCourses] = useState([]); // Danh sách tất cả môn học
    const [filteredCourses, setFilteredCourses] = useState([]); // Môn học lọc theo học kỳ và giảng viên
    const [selectedCourse, setSelectedCourse] = useState(''); // Môn học đã chọn
    const [classes, setClasses] = useState([]); // Lớp học của môn đã chọn
    const [selectedClass, setSelectedClass] = useState(''); // Lớp học đã chọn

    const [room, setRoom] = useState(''); // Phòng học
    const [week, setWeek] = useState(''); // Tuần
    const [dayOfWeek, setDayOfWeek] = useState(''); // Thứ
    const [classPeriod, setClassPeriod] = useState(''); // Tiết học
    const [note, setNote] = useState(''); // Ghi chú
    const [notifications, setNotifications] = useState([]); // Danh sách thông báo

    // Lấy tên giảng viên từ localStorage
    const username = localStorage.getItem('username');
    const currentTeacher = username; // Giảng viên hiện tại từ localStorage

    useEffect(() => {
        fetchSemesters(); // Fetch học kỳ
        fetchCourses(); // Fetch môn học
        fetchNotifications(); // Lấy danh sách thông báo đã tạo
    }, []);

    const fetchSemesters = async () => {
        const response = await fetch('http://localhost:5000/semesters');
        const data = await response.json();
        setSemesters(data);
    };

    const fetchCourses = async () => {
        const response = await fetch('http://localhost:5000/Tea_list_course_semeter');
        const data = await response.json();
        setCourses(data);
    };

    const fetchNotifications = async () => {
        const response = await fetch('http://localhost:5000/notifications');
        const data = await response.json();
        setNotifications(data); // Cập nhật danh sách thông báo
    };

    // Lọc học kỳ mà giảng viên dạy
    const getTeacherSemesters = () => {
        return semesters.filter(semester =>
            courses.some(course => course.teachers.includes(currentTeacher) && course.semestersName === semester.semestersName)
        );
    };

    // Lọc môn học của giảng viên theo học kỳ
    const handleSemesterChange = (e) => {
        const selectedSemester = e.target.value;
        setSelectedSemester(selectedSemester);

        // Reset môn học và lớp học khi học kỳ thay đổi
        setSelectedCourse('');
        setFilteredCourses([]);
        setClasses([]);
        setSelectedClass('');

        // Lọc môn học của giảng viên theo học kỳ
        const filtered = courses.filter(course =>
            course.teachers.includes(currentTeacher) && course.semestersName === selectedSemester
        );
        setFilteredCourses(filtered);
    };

    // Lọc lớp học theo môn học đã chọn
    const handleCourseChange = (e) => {
        const selectedCourseID = e.target.value;
        setSelectedCourse(selectedCourseID);

        // Reset lớp học khi môn học thay đổi
        setClasses([]);
        setSelectedClass('');

        // Lọc lớp học theo môn học đã chọn
        const selectedCourseData = courses.find(course => course.subjectsID === selectedCourseID);
        setClasses(selectedCourseData ? selectedCourseData.classes : []);
    };

    // Xử lý khi lớp học thay đổi
    const handleClassChange = (e) => {
        const selectedClassName = e.target.value;
        setSelectedClass(selectedClassName);

        // Tìm lịch học của lớp đã chọn
        const selectedClassData = filteredCourses.find(course =>
            course.classes.some(cls => cls.className === selectedClassName)
        )?.classes.find(cls => cls.className === selectedClassName);

        if (selectedClassData && selectedClassData.schedule.length > 0) {
            const schedule = selectedClassData.schedule[0];
            setDayOfWeek(schedule.dayOfWeek || '');
            setClassPeriod(schedule.classPeriod || '');
            setRoom(schedule.room || '');
        } else {
            setDayOfWeek('');
            setClassPeriod('');
            setRoom('');
        }
    };

    // Gửi thông báo đến server (lưu thông báo vào cơ sở dữ liệu)
    const saveNotification = async (newNotification) => {
        const response = await fetch('http://localhost:5000/notifications', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newNotification),
        });
        const data = await response.json();
        setNotifications(prevNotifications => [...prevNotifications, data]); // Cập nhật danh sách thông báo sau khi lưu
    };

    // Xử lý khi tạo thông báo
    const handleSubmit = (e) => {
        e.preventDefault();

        // Tìm tên môn học từ filteredCourses
        const selectedCourseName = filteredCourses.find(course => course.subjectsID === selectedCourse)?.subjectsName;

        const newNotification = {
            course: selectedCourseName, // Lưu tên môn học thay vì mã môn học
            class: selectedClass,
            room,
            week,
            dayOfWeek,
            classPeriod,
            note,
            createdAt: new Date().toISOString() // Thêm ngày tạo thông báo
        };

        // Lưu thông báo vào server
        saveNotification(newNotification).then(() => {
            alert("Thông báo đã được tạo thành công!");
            setSelectedSemester('');
            setSelectedCourse('');
            setSelectedClass('');
            setRoom('');
            setWeek('');
            setDayOfWeek('');
            setClassPeriod('');
            setNote('');
        }).catch(() => {
            alert("Có lỗi xảy ra khi tạo thông báo. Vui lòng thử lại!");
        });
    };

    return (
        <div className="CreateNotification">
            <div className="grid__column-2-3">
                <div className="View_Created_Notetication">
                    <p className='CreateNotification_title'>ĐĂNG KÝ NGHỈ</p>
                    <form onSubmit={handleSubmit}>
                        <div className="Dropdownlist">
                            <div className="form-group">
                                <label htmlFor="semester">Học kỳ:</label>
                                <select
                                    id="semester"
                                    value={selectedSemester}
                                    onChange={handleSemesterChange}
                                    required
                                >
                                    <option value="" disabled>Chọn học kỳ</option>
                                    {getTeacherSemesters().map(semester => (
                                        <option key={semester.semestersID} value={semester.semestersName}>
                                            {semester.semestersName}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="course">Môn học phần:</label>
                                <select
                                    id="course"
                                    value={selectedCourse}
                                    onChange={handleCourseChange}
                                    required
                                    disabled={!selectedSemester}
                                >
                                    <option value="" disabled>Chọn môn học phần</option>
                                    {filteredCourses.map(course => (
                                        <option key={course.subjectsID} value={course.subjectsID}>
                                            {course.subjectsName}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="class">Lớp dạy:</label>
                                <select
                                    id="class"
                                    value={selectedClass}
                                    onChange={handleClassChange}
                                    required
                                    disabled={!selectedCourse}
                                >
                                    <option value="" disabled>Chọn lớp dạy</option>
                                    {classes.map((classItem, index) => (
                                        <option key={index} value={classItem.className}>
                                            {classItem.className}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="dayOfweek_Period_Room">
                            <div className="form-group">
                                <label htmlFor="dayOfWeek">Thứ:</label>
                                <input
                                    type="text"
                                    id="dayOfWeek"
                                    value={dayOfWeek}
                                    onChange={(e) => setDayOfWeek(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="classPeriod">Tiết học:</label>
                                <input
                                    type="text"
                                    id="classPeriod"
                                    value={classPeriod}
                                    onChange={(e) => setClassPeriod(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="room">Phòng:</label>
                                <input
                                    type="text"
                                    id="room"
                                    value={room}
                                    onChange={(e) => setRoom(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="week">Tuần:</label>
                                <input
                                    type="text"
                                    id="week"
                                    value={week}
                                    onChange={(e) => setWeek(e.target.value)}
                                    required
                                    placeholder='Nhập tuần'
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="note">Ghi chú:</label>
                            <textarea
                                id="note"
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                required
                                placeholder='Lý do'
                            />
                        </div>

                        <button className="btn_submit" type="submit">ĐĂNG KÝ</button>
                    </form>
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

export default Tea_CreateNoteti;
