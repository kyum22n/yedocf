import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import ScrollToTop from './components/common/ScrollToTop';
import UserLayout from './components/layout/UserLayout';
import AdminLayout from './pages/admin/AdminLayout';
import AdminRoute from './components/auth/AdminRoute';

import AdminLoginPage from './pages/admin/AdminLoginPage';
import UserManagePage from './pages/admin/UserManagePage';
import ReservationManagePage from './pages/admin/ReservationManagePage';
import NoticeEventManagePage from './pages/admin/NoticeEventManagePage';
import StaffManagePage from './pages/admin/StaffManagePage';
import ConsultationManagePage from './pages/admin/ConsultationManagePage';
import TreatmentManagePage from './pages/admin/TreatmentManagePage';
import StaffScheduleManagePage from './pages/admin/StaffScheduleManagePage';
import StatisticsDashboardPage from './pages/admin/StatisticsDashboardPage';
import ReviewManagePage from './pages/admin/ReviewManagePage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';

import NoticeEventPage from './pages/user/NoticeEventPage';
import InquiryManagePage from './pages/admin/InquiryManagePage';

function App() {
  return (
    <Router>
      <ScrollToTop />

      <Routes>
        {/* 관리자 로그인 */}
        <Route path="/adminlogin" element={<AdminLoginPage />} />

        {/* 관리자 레이아웃 (로그인 필요) */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route index element={<UserManagePage />} />
          <Route path="reservations" element={<ReservationManagePage />} />
          <Route path="staff" element={<StaffManagePage />} />
          <Route path="inquiry" element={<InquiryManagePage />} />
          <Route path="noticeManage" element={<NoticeEventManagePage />} />
          <Route path="consultations" element={<ConsultationManagePage />} />
          <Route path="treatments" element={<TreatmentManagePage />} />
          <Route path="staff-schedules" element={<StaffScheduleManagePage />} />
          <Route path="statistics" element={<StatisticsDashboardPage />} />
          <Route path="reviews" element={<ReviewManagePage />} />
          <Route path="dashboard" element={<AdminDashboardPage />} />
        </Route>

        {/* 공지사항 / 이벤트 탭 추가 */}
        <Route path="/notice-event" element={<NoticeEventPage />} />

        {/* 사용자 레이아웃 */}
        <Route path="/*" element={<UserLayout />} />
      </Routes>
    </Router>
  );
}

export default App;
