import React, { useState, useEffect } from 'react';
import './Tea_CreateNoteti.scss';
import { Link } from 'react-router-dom';

const Tea_CreateNoteti = () => {
    const [semesters, setSemesters] = useState([]);
    const [selectedSemester, setSelectedSemester] = useState('');
    const [courses, setCourses] = useState([]);
    const [filteredCourses, setFilteredCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState('');
    const [classes, setClasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState('');
    const [room, setRoom] = useState('');
    const [week, setWeek] = useState('');
    const [dayOfWeek, setDayOfWeek] = useState('');
    const [classPeriod, setClassPeriod] = useState('');
    const [note, setNote] = useState('');
    const [notifications, setNotifications] = useState([]);

    const username = localStorage.getItem('username');

    useEffect(() => {
        fetchSemesters();
    }, []);

    const fetchSemesters = async () => {
        try {
            const response = await fetch('http://localhost:5000/semesters');
            const data = await response.json();
            setSemesters(data);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách học kỳ:", error);
        }
    };

    const fetchCourses = async (semesterID) => {
        try {
            const response = await fetch(`http://localhost:5000/Tea_list_course_semeter?semesterID=${semesterID}`);
            const data = await response.json();
            setCourses(data);
            setFilteredCourses(data);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách môn học:", error);
        }
    };

    const fetchClasses = async (courseID) => {
        try {
            const response = await fetch(`http://localhost:5000/Tea_list_classCousre?courseID=${courseID}`);
            const data = await response.json();
            setClasses(data);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách lớp học:", error);
        }
    };

    const handleSemesterChange = (e) => {
        const semesterID = e.target.value;
        setSelectedSemester(semesterID);

        setSelectedCourse('');
        setSelectedClass('');
        setClasses([]);
        setFilteredCourses([]);
        fetchCourses(semesterID);
    };

    const handleCourseChange = (e) => {
        const courseID = e.target.value;
        setSelectedCourse(courseID);

        setSelectedClass('');
        setClasses([]);
        fetchClasses(courseID);
    };

    const handleClassChange = (e) => {
        setSelectedClass(e.target.value); // Cập nhật lớp học đã chọn
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const selectedCourseName = courses.find(course => course.subjectsID === selectedCourse)?.subjectsName;

        const newNotification = {
            course: selectedCourseName,
            class: selectedClass,
            room,
            week,
            dayOfWeek,
            classPeriod,
            note,
            createdAt: new Date().toISOString(),
        };

        try {
            const response = await fetch('http://localhost:5000/notifications', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newNotification),
            });

            if (!response.ok) throw new Error("Lưu thông báo thất bại.");

            const data = await response.json();
            setNotifications(prevNotifications => [...prevNotifications, data]);

            alert("Thông báo đã được tạo thành công!");
            setSelectedSemester('');
            setSelectedCourse('');
            setSelectedClass('');
            setRoom('');
            setWeek('');
            setDayOfWeek('');
            setClassPeriod('');
            setNote('');
        } catch (error) {
            alert("Có lỗi xảy ra khi tạo thông báo. Vui lòng thử lại!");
            console.error(error);
        }
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
                                    {semesters.map(semester => (
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
                                    onChange={handleClassChange}  // Đã định nghĩa hàm này
                                    required
                                    disabled={!selectedCourse}
                                >
                                    <option value="" disabled>Chọn lớp dạy</option>
                                    {classes.length > 0 ? (
                                        classes.map((classItem) => (
                                            <option key={classItem.courseClassID} value={classItem.courseClassID}>
                                                {classItem.courseClassName}
                                            </option>
                                        ))
                                    ) : (
                                        <option value="" disabled>Không có lớp học</option>
                                    )}
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
                                    placeholder="Nhập tuần"
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
                                placeholder="Lý do"
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
