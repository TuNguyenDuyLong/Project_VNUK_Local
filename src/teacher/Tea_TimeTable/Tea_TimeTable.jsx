import React, { useState, useEffect } from 'react';
import './Tea_TimeTable.scss';

const TimeTable = () => {
    const [semesters, setSemesters] = useState([]); // Danh sách học kỳ
    const [selectedSemester, setSelectedSemester] = useState(''); // Học kỳ đã chọn
    const [tableData, setTableData] = useState([]); // Dữ liệu thời khóa biểu sau khi lọc
    const username = localStorage.getItem('username'); // Lấy username từ localStorage

    // Lấy danh sách học kỳ từ API
    useEffect(() => {
        fetch('http://localhost:5000/semesters')
            .then(response => response.json())
            .then(data => setSemesters(data))
            .catch(error => console.error('Error fetching semesters:', error));
    }, []);

    // Xử lý khi chọn học kỳ
    const handleFilterChange = () => {
        if (!selectedSemester) {
            setTableData([]); // Nếu chưa chọn học kỳ, không hiển thị dữ liệu
            return;
        }

        // Lấy dữ liệu thời khóa biểu từ API
        fetch('http://localhost:5000/tea_timetable')
            .then(response => response.json())
            .then(data => {
                console.log(data); // Kiểm tra dữ liệu trả về từ API
                const tea_timetable = (data.length > 0 && data[0].tea_timetable) || []; // Lấy dữ liệu thời khóa biểu từ API

                // Lọc dữ liệu theo học kỳ và giảng viên
                const filteredData = tea_timetable.filter(item => {
                    return (
                        item.semestersName === selectedSemester && // Kiểm tra học kỳ
                        item.teachers && item.teachers.includes(username)
                    );
                });

                console.log(filteredData); // Kiểm tra dữ liệu đã lọc

                // Sắp xếp theo ngày trong tuần
                const daysOfWeek = [
                    'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật',
                ];
                const sortedData = filteredData.sort(
                    (a, b) =>
                        daysOfWeek.indexOf(a.dayOfWeekName) - daysOfWeek.indexOf(b.dayOfWeekName)
                );

                // Tính rowspan cho các ô "Thứ"
                const groupedData = [];
                let lastDay = null;
                let rowspan = 0;

                sortedData.forEach((row, index) => {
                    if (row.dayOfWeekName !== lastDay) {
                        if (rowspan > 0) {
                            groupedData[groupedData.length - rowspan].rowspan = rowspan;
                        }
                        lastDay = row.dayOfWeekName;
                        rowspan = 1;
                        groupedData.push({ ...row, rowspan: 0 });
                    } else {
                        rowspan++;
                        groupedData.push({ ...row, rowspan: 0 });
                    }

                    if (index === sortedData.length - 1 && rowspan > 0) {
                        groupedData[groupedData.length - rowspan].rowspan = rowspan;
                    }
                });

                setTableData(groupedData); // Cập nhật dữ liệu
            })
            .catch(error => {
                console.error('Error fetching timetable:', error);
                setTableData([]); // Nếu lỗi, đặt dữ liệu trống
            });

    };

    return (
        <div className="timetable-container">
            <h2 className="timetable-title">TRA CỨU THỜI KHÓA BIỂU</h2>

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

            {tableData.length > 0 ? (
                <table className="result-table">
                    <thead>
                        <tr>
                            <th>Thứ</th>
                            <th>Tên học phần</th>
                            <th>Lớp tín chỉ</th>
                            <th>Tín chỉ</th>
                            <th>Tuần học</th>
                            <th>Phòng</th>
                            <th>Tiết</th>
                            <th>Ghi chú</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tableData.map((row, index) => (
                            <tr key={index} className='detail_timetable'>
                                {row.rowspan > 0 && (
                                    <td rowSpan={row.rowspan}>{row.dayOfWeekName}</td>
                                )}
                                <td>{row.subjectsName}</td>
                                <td>{row.courseClassName}</td>
                                <td>{row.numberOfCredits}</td>
                                <td>{row.weekStart} - {row.weekEnd}</td>
                                <td>{row.roomName}</td>
                                <td>{row.classPeriodName}</td>
                                <td>{row.note}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <table className="result-table">
                    <thead>
                        <tr>
                            <th>Thứ</th>
                            <th>Tên học phần</th>
                            <th>Lớp tín chỉ</th>
                            <th>Tín chỉ</th>
                            <th>Tuần học</th>
                            <th>Phòng</th>
                            <th>Tiết</th>
                            <th>Ghi chú</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="Null_value">
                            <td colSpan="10" style={{ textAlign: 'center' }}>
                                Không có dữ liệu nào được tìm thấy
                            </td>
                        </tr>
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default TimeTable;
