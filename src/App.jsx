import React, { useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import ScrollToTop from './util/ScrollToTop';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Navbar from './pages/Navbar/Navbar';
import Tea_Navbar from './teacher/Tea_Navbar/Tea_Navbar';
import { useUser } from './components/Header/Login/UserContext';
// Import context

// Các trang dành cho sinh viên
import Home from './pages/Home/Home';
import News from './pages/News/News';
import Introduce from './pages/Introduce/Introduce';
import Admissions from './pages/Admissions/Admissions';
import TimeTable from './pages/TimeTable/TimeTable';
import ViewNoteti from './pages/ViewNoteti/ViewNoteti';
import ExamSchedule from './pages/ExamSchedule/ExamSchedule';

// Các trang dành cho giảng viên
import Tea_TimeTable from './teacher/Tea_TimeTable/Tea_TimeTable';
import Tea_ExamSchedule from './teacher/Tea_ExamSchedule/Tea_ExamSchedule';
import Tea_ViewNoteti from './teacher/Notetication/Tea_ViewNoteti/Tea_ViewNoteti';
import Tea_CreateNoteti from './teacher/Notetication/Tea_CreateNoteti/Tea_CreateNoteti';
import Tea_View_CreateNoteti from './teacher/Notetication/Tea_View_CreateNoteti/Tea_View_CreateNoteti';
import Tea_CreateNoteti_com from './teacher/Notetication/Tea_CreateNoteti_com/Tea_CreateNoteti_com';
import Tea_CreateNoteti_session from './teacher/Notetication/Tea_CreateNoteti_session/Tea_CreateNoteti_session';

const App = () => {
  const { user, login } = useUser(); // Lấy thông tin người dùng từ context
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/'); // Quay về trang chính nếu chưa đăng nhập
    }
  }, [user, navigate]);

  const handleLogout = () => {
    // Gọi API hoặc xóa trạng thái từ context
    login(null, null); // Reset user
    navigate('/');
  };

  return (
    <div className="app">
      {/* Cuộn lên đầu mỗi khi đổi route */}
      <ScrollToTop />

      {/* Header */}
      <Header handleLogout={handleLogout} />

      {/* Navbar dựa trên vai trò */}
      {user?.role === 'student' && <Navbar />}
      {user?.role === 'teacher' && <Tea_Navbar />}

      {/* Route chính */}
      <Routes>
        {/* Route công khai */}
        <Route path="/" element={<Home />} />
        <Route path="/news" element={<News />} />
        <Route path="/introduce" element={<Introduce />} />
        <Route path="/admissions" element={<Admissions />} />

        {/* Route dành cho sinh viên */}
        {user?.role === 'student' && (
          <>
            <Route path="/timetable" element={<TimeTable />} />
            <Route path="/viewnoteti" element={<ViewNoteti />} />
            <Route path="/examschedule" element={<ExamSchedule />} />
          </>
        )}

        {/* Route dành cho giảng viên */}
        {user?.role === 'teacher' && (
          <>
            <Route path="/tea_timetable" element={<Tea_TimeTable />} />
            <Route path="/tea_viewnoteti" element={<Tea_ViewNoteti />} />
            <Route path="/tea_off_createnoteti" element={<Tea_CreateNoteti />} />
            <Route path="/tea_on_createnoteti" element={<Tea_CreateNoteti_com />} />
            <Route path="/tea_createnoteti_session" element={<Tea_CreateNoteti_session />} />
            <Route path="/tea_view_createnoteti" element={<Tea_View_CreateNoteti />} />
            <Route path="/tea_examschedule" element={<Tea_ExamSchedule />} />
          </>
        )}
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
