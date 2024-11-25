import React, { useState, useEffect } from 'react';
import './Tea_CreateNoteti_com.scss';
import { Link } from 'react-router-dom';

const Tea_CreateNoteti_com = () => {
    const [semesters, setSemesters] = useState([]);
    const [selectedSemester, setSelectedSemester] = useState('');
    const [courses, setCourses] = useState([]);
    const [filteredCourses, setFilteredCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState('');
    const [classes, setClasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState('');
    const [week, setWeek] = useState('');
    const [dayOfWeek, setDayOfWeek] = useState('');
    const [classPeriods, setClassPeriods] = useState([]);
    const [classRoom, setClassRoom] = useState('');
    const [classRooms, setClassRooms] = useState([]);
    const [periodDayOfWeek, setPeriodDayOfWeek] = useState([]);
    const [note, setNote] = useState('');
    const [notifications, setNotifications] = useState([]);
    const [daysOfWeek, setDaysOfWeek] = useState([]);
    const [error, setError] = useState('');

    const username = localStorage.getItem('username');
    const currentTeacher = username;

    useEffect(() => {
        fetchSemesters();
        fetchCourses();
        fetchNotifications();
        fetchDaysOfWeek();
        fetchClassrooms();
        fetchPeriods();
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
        setNotifications(data);
    };

    const fetchDaysOfWeek = async () => {
        const response = await fetch('http://localhost:5000/Tea_list_dayofweek');
        const data = await response.json();
        setDaysOfWeek(data);
    };

    const fetchClassrooms = async () => {
        const response = await fetch('http://localhost:5000/classrooms');
        const data = await response.json();
        setClassRooms(data);
    };

    const fetchPeriods = async () => {
        const response = await fetch('http://localhost:5000/period_dayOfweek');
        const data = await response.json();
        setPeriodDayOfWeek(data);
    };

    const getTeacherSemesters = () => {
        return semesters.filter(semester =>
            courses.some(course => course.teachers.includes(currentTeacher) && course.semestersName === semester.semestersName)
        );
    };

    const handleSemesterChange = (e) => {
        const selectedSemester = e.target.value;
        setSelectedSemester(selectedSemester);
        setSelectedCourse('');
        setFilteredCourses([]);
        setClasses([]);
        setSelectedClass('');

        const filtered = courses.filter(course =>
            course.teachers.includes(currentTeacher) && course.semestersName === selectedSemester
        );
        setFilteredCourses(filtered);
    };

    const handleCourseChange = (e) => {
        const selectedCourseID = e.target.value;
        setSelectedCourse(selectedCourseID);
        setClasses([]);
        setSelectedClass('');

        const selectedCourseData = courses.find(course => course.subjectsID === selectedCourseID);
        if (selectedCourseData) {
            setClasses(selectedCourseData.classes);
        } else {
            setClasses([]);
        }
    };
    const handleClassPeriodsChange = (e) => {
        const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);

        // Kiểm tra nếu số lượng tiết học vượt quá 3
        if (selectedOptions.length > 3) {
            alert('Bạn chỉ được chọn tối đa 3 tiết học!');
            return;
        }

        // Cập nhật trạng thái nếu hợp lệ
        setClassPeriods(selectedOptions);
    };
    const handleCheckboxChange = (e, periodID) => {
        if (e.target.checked) {
            // Kiểm tra nếu đã chọn đủ 3 tiết
            if (classPeriods.length >= 3) {
                setError('Bạn chỉ được chọn tối đa 3 tiết học!');
                return;
            }
            setError('');
            setClassPeriods([...classPeriods, periodID]); // Thêm tiết mới
        } else {
            // Bỏ chọn
            setError('');
            setClassPeriods(classPeriods.filter(id => id !== periodID));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const selectedCourseName = filteredCourses.find(course => course.subjectsID === selectedCourse)?.subjectsName;
        const newNotification = {
            course: selectedCourseName,
            class: selectedClass,
            classRoom,
            week,
            dayOfWeek,
            classPeriods,
            note,
            createdAt: new Date().toISOString(),
        };

        saveNotification(newNotification)
            .then(() => {
                alert('Thông báo đã được tạo thành công!');
                resetForm();
            })
            .catch(() => alert('Có lỗi xảy ra khi tạo thông báo. Vui lòng thử lại!'));
    };

    const saveNotification = async (newNotification) => {
        const response = await fetch('http://localhost:5000/notifications_com', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newNotification),
        });
        const data = await response.json();
        setNotifications(prevNotifications => [...prevNotifications, data]);
    };

    const resetForm = () => {
        setSelectedSemester('');
        setSelectedCourse('');
        setSelectedClass('');
        setClassRoom('');
        setWeek('');
        setDayOfWeek('');
        setClassPeriods('');
        setNote('');
    };

    return (
        <div className="CreateNotification_com">
            <div className="grid__column-2-3">
                <div className="View_Created_Notetication_com">
                    <p className="CreateNotification_com_title">ĐĂNG KÝ BÙ</p>
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
                                <label htmlFor="course">Môn dạy:</label>
                                <select
                                    id="course"
                                    value={selectedCourse}
                                    onChange={handleCourseChange}
                                    required
                                    disabled={!selectedSemester}
                                >
                                    <option value="" disabled>Chọn môn học</option>
                                    {filteredCourses.map(course => (
                                        <option key={course.subjectsID} value={course.subjectsID}>
                                            {course.subjectsName}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="class">Lớp:</label>
                                <select
                                    id="class"
                                    value={selectedClass}
                                    onChange={(e) => setSelectedClass(e.target.value)}
                                    required
                                    disabled={!selectedCourse}
                                >
                                    <option value="" disabled>Chọn lớp học</option>
                                    {classes.length > 0 ? (
                                        classes.map((classItem, index) => (
                                            <option key={index} value={classItem.className}>
                                                {classItem.className}
                                            </option>
                                        ))
                                    ) : (
                                        <option disabled>Không có lớp học</option>
                                    )}
                                </select>
                            </div>
                        </div>
                        <div className="dayOfweek_Period_Room_com">
                            <div className="form-group">
                                <label htmlFor="dayOfWeek">Thứ:</label>
                                <select
                                    id="dayOfWeek"
                                    value={dayOfWeek}
                                    onChange={(e) => setDayOfWeek(e.target.value)}
                                    required
                                >
                                    <option value="" disabled>Chọn thứ</option>
                                    {daysOfWeek.map((day) => (
                                        <option key={day.dayofWeeksName} value={day.dayofWeeksName}>
                                            {day.dayofWeeksName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Tiết học:</label>
                                <div className="checkbox-group-scrollable">
                                    {periodDayOfWeek.map(period => (
                                        <div key={period.classPeriodID} className="checkbox-item">
                                            <input
                                                type="checkbox"
                                                id={`period-${period.classPeriodID}`}
                                                value={period.classPeriodID}
                                                onChange={(e) => handleCheckboxChange(e, period.classPeriodID)}
                                                checked={classPeriods.includes(period.classPeriodID)}
                                            />
                                            <label htmlFor={`period-${period.classPeriodID}`}>{period.classPeriodName}</label>
                                        </div>
                                    ))}
                                </div>
                                {error && <p className="error-message">{error}</p>}
                            </div>


                            <div className="form-group">
                                <label htmlFor="classRoom">Phòng học:</label>
                                <select
                                    id="classRoom"
                                    value={classRoom}
                                    onChange={(e) => setClassRoom(e.target.value)}
                                    required
                                >
                                    <option value="" disabled>Chọn phòng học</option>
                                    {classRooms.map(room => (
                                        <option key={room.id} value={room.name}>
                                            {room.name}
                                        </option>
                                    ))}
                                </select>
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
export default Tea_CreateNoteti_com;