import React, { useState, useEffect } from 'react';
import './Tea_ExamSchedule.scss';

const ExamSchedule = () => {
    const [semesters, setSemesters] = useState([]); // Danh sách học kỳ
    const [selectedSemester, setSelectedSemester] = useState(''); // Học kỳ đã chọn
    const [examData, setExamData] = useState([]); // Dữ liệu lịch coi thi
    const username = localStorage.getItem('username'); // Lấy username từ localStorage

    // Lấy danh sách học kỳ từ API
    useEffect(() => {
        fetch('http://localhost:5000/semesters')
            .then(response => response.json())
            .then(data => setSemesters(data))
            .catch(error => console.error('Error fetching semesters:', error));
    }, []);

    // Lọc dữ liệu theo học kỳ và giảng viên
    const handleFilterChange = () => {
        if (!selectedSemester) {
            setExamData([]); // Nếu chưa chọn học kỳ, không hiển thị dữ liệu
            return;
        }

        // Lấy dữ liệu lịch coi thi từ API
        fetch('http://localhost:5000/tea_examSchedule')
            .then(response => response.json())
            .then(data => {
                console.log('Exam Tea_Schedule Data:', data); // Kiểm tra dữ liệu gốc

                // Đảm bảo teachers luôn là mảng và loại bỏ khoảng trắng
                const Tea_examSchedule = data.map(item => ({
                    ...item,
                    semesterName: item.semesterName?.trim() || '', // Loại bỏ khoảng trắng thừa
                    teachers: Array.isArray(item.teachers) ? item.teachers.map(t => t.trim()) : [], // Đảm bảo teachers là mảng
                }));

                // Lọc dữ liệu theo học kỳ và giảng viên
                const filteredData = Tea_examSchedule.filter(item => {
                    const semesterName = item.semesterName?.toLowerCase() || ''; // Chuyển đổi về chữ thường
                    const selected = selectedSemester.trim().toLowerCase(); // Chuyển đổi chọn học kỳ về chữ thường
                    const TeacherInExam = Array.isArray(item.teachers) && item.teachers.some(teacher => teacher.trim() === username.trim());

                    console.log(`Checking semesterName: "${semesterName}" === "${selected}"`);
                    console.log(`Checking invigilator: "${username}" in`, item.teachers);

                    return semesterName === selected && TeacherInExam;
                });

                const sortedData = filteredData.sort((a, b) => {
                    const dateA = new Date(a.examDate); // Chuyển đổi ngày của mục A
                    const dateB = new Date(b.examDate); // Chuyển đổi ngày của mục B
                    return dateA - dateB; // Sắp xếp tăng dần
                });

                console.log('Filtered & Sorted Data:', sortedData);

                setExamData(sortedData); // Cập nhật dữ liệu sau khi sắp xếp

                console.log('Filtered Data:', filteredData);


                setExamData(filteredData); // Cập nhật dữ liệu
            })
            .catch(error => {
                console.error('Error fetching examSchedule:', error);
                setExamData([]); // Xử lý khi lỗi xảy ra
            });

    };

    return (
        <div className="exam-schedule-container">
            <h2 className="exam-schedule-title">TRA CỨU LỊCH COI THI</h2>

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
                            <th>Phòng thi</th>
                            <th>Giờ bắt đầu</th>
                            <th>Giờ kết thúc</th>
                            <th>Thời lượng</th>
                            <th>Ghi chú</th>
                        </tr>
                    </thead>
                    <tbody>
                        {examData.map((row, index) => (
                            <tr key={index}>
                                <td>{new Date(row.examDate).toLocaleDateString()}</td>
                                <td>{row.subjectID}</td>
                                <td>{row.subjectname}</td>
                                <td>{row.examTypeName}</td>
                                <td>{row.roomName}</td>
                                <td>{row.startTime}</td>
                                <td>{row.endTime}</td>
                                <td>{row.duration}</td>
                                <td>{row.note}</td>
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
                            <th>Phòng thi</th>
                            <th>Giờ bắt đầu</th>
                            <th>Giờ kết thúc</th>
                            <th>Thời lượng</th>
                            <th>Ghi chú</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="Null_value">
                            <td colSpan="8" style={{ textAlign: 'center' }}>
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
