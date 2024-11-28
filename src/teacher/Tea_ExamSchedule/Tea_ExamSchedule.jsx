import React, { useState, useEffect } from 'react';
import './Tea_ExamSchedule.scss';

const ExamSchedule = () => {
    const [semesters, setSemesters] = useState([]); // Danh sách học kỳ
    const [selectedSemester, setSelectedSemester] = useState(''); // Học kỳ đã chọn
    const [examData, setExamData] = useState([]); // Dữ liệu lịch coi thi

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
                // Lọc dữ liệu theo học kỳ
                const filteredData = data.filter(
                    (item) => item.semesterName.trim() === selectedSemester.trim()
                );

                // Sắp xếp dữ liệu theo ngày thi
                const sortedData = filteredData.sort((a, b) => {
                    const dateA = new Date(a.examDate);
                    const dateB = new Date(b.examDate);
                    return dateA - dateB;
                });

                setExamData(sortedData);
            })

            .catch(error => {
                console.error('Error fetching exam schedule:', error);
                setExamData([]); // Nếu lỗi, đặt dữ liệu trống
            });
    };

    // Định dạng ngày thi thành DD/MM/YYYY
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
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
                                <td>{formatDate(row.examDate)}</td>
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
