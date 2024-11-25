import React, { useState, useEffect } from 'react';
import './ExamSchedule.scss';

const ExamSchedule = () => {
    const [semesters, setSemesters] = useState([]); // Danh sách học kỳ
    const [selectedSemester, setSelectedSemester] = useState(''); // Học kỳ đã chọn
    const [examData, setExamData] = useState([]); // Dữ liệu lịch thi
    const username = localStorage.getItem('username'); // Lấy username từ localStorage

    // Lấy danh sách học kỳ từ API
    useEffect(() => {
        fetch('http://localhost:5000/semesters')
            .then(response => response.json())
            .then(data => setSemesters(data))
            .catch(error => console.error('Error fetching semesters:', error));
    }, []);

    // Lọc dữ liệu theo học kỳ và sinh viên
    const handleFilterChange = () => {
        if (!selectedSemester) {
            setExamData([]); // Nếu chưa chọn học kỳ, không hiển thị dữ liệu
            return;
        }

        // Lấy dữ liệu lịch thi từ API
        fetch('http://localhost:5000/examSchedule')
            .then(response => response.json())
            .then(data => {
                console.log('Exam Schedule Data:', data); // Kiểm tra dữ liệu lịch thi

                const examSchedule = data || []; // Dữ liệu lịch thi từ API

                // Lọc dữ liệu theo học kỳ và sinh viên
                const filteredData = examSchedule.filter(item => {
                    const semesterName = item.semesterName.trim(); // Loại bỏ khoảng trắng thừa
                    const selected = selectedSemester.trim(); // Loại bỏ khoảng trắng thừa
                    const studentInExam = item.students.includes(username); // Kiểm tra sinh viên có trong kỳ thi

                    return (
                        semesterName === selected && // Kiểm tra học kỳ
                        studentInExam // Kiểm tra sinh viên có trong danh sách thi
                    );
                });

                if (filteredData.length === 0) {
                    setExamData([]); // Nếu không có dữ liệu, đặt dữ liệu trống
                    return;
                }
                const sortedData = filteredData.sort((a, b) => {
                    const dateA = new Date(a.examDate); // Chuyển đổi ngày của mục A
                    const dateB = new Date(b.examDate); // Chuyển đổi ngày của mục B
                    return dateA - dateB; // Sắp xếp tăng dần
                });

                setExamData(sortedData);

                setExamData(filteredData); // Cập nhật dữ liệu
            })
            .catch(error => {
                console.error('Error fetching examSchedule:', error);
                setExamData([]); // Nếu lỗi, đặt dữ liệu trống
            });
    };

    return (
        <div className="exam-schedule-container">
            <h2 className="exam-schedule-title">TRA CỨU LỊCH THI</h2>

            <div className="filter-container">
                <select
                    value={selectedSemester}
                    onChange={e => setSelectedSemester(e.target.value)}
                >
                    <option value="" disabled>Chọn học kỳ</option>
                    {semesters.map(semester => (
                        <option key={semester.semestersID} value={semester.semestersName}>
                            {semester.semestersName}
                        </option>
                    ))}
                </select>
                <button onClick={handleFilterChange}>Tra cứu</button>
            </div>

            {examData.length > 0 ? (
                <table className="result-table">
                    <thead>
                        <tr>
                            <th>Ngày</th>
                            <th>Mã học phần</th>
                            <th>Tên học phần</th>
                            <th>Hình thức thi</th>
                            <th>Phòng</th>
                            <th>Giờ thi</th>
                            <th>Thời gian</th>
                        </tr>
                    </thead>
                    <tbody>
                        {examData.map((row, index) => (
                            <tr key={index}>
                                <td>{row.examDate}</td>
                                <td>{row.subjectID}</td>
                                <td>{row.subjectname}</td>
                                <td>{row.examTypeName}</td>
                                <td>{row.roomName}</td>
                                <td>{row.startTime}</td>
                                <td>{row.duration}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <table className="result-table">
                    <thead>
                        <tr>
                            <th>Ngày</th>
                            <th>Mã học phần</th>
                            <th>Tên học phần</th>
                            <th>Hình thức thi</th>
                            <th>Phòng</th>
                            <th>Giờ thi</th>
                            <th>Thời gian</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="Null_value">
                            <td colSpan="7" style={{ textAlign: 'center' }}>
                                Không có dữ liệu nào được tìm thấy
                            </td>
                        </tr>
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default ExamSchedule;
