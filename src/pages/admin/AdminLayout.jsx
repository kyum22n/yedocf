import { Outlet } from 'react-router-dom';
import Sidebar from '@/components/admin/Sidebar';

const AdminLayout = () => {
  // 예시: 로그인 여부나 권한은 전역 상태나 로컬스토리지, Context 등에서 가져올 수 있음
  const isLoggedIn = true; // 실제 구현 시 상태 사용
  const isSuperAdmin = true;
  const adminName = "최고관리자";

  return (
    <div className="flex">
      <Sidebar
        isLoggedIn={isLoggedIn}
        isSuperAdmin={isSuperAdmin}
        adminName={adminName}
      />
      <main className="ml-60 w-full min-h-screen">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
