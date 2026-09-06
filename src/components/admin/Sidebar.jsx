import { NavLink } from 'react-router-dom';
import {
  ArrowRightStartOnRectangleIcon,
  UserIcon,
  UsersIcon,
  BookmarkSquareIcon,
  InformationCircleIcon,
  QuestionMarkCircleIcon,
} from '@heroicons/react/24/outline';

const Sidebar = () => {
  const adminName = sessionStorage.getItem("aId") || "";
  const role = sessionStorage.getItem("role");
  const isSuperAdmin = role === "SUPERADMIN";

  return (
    <aside className="w-60 h-screen bg-orange-950 text-white fixed left-0 top-0 z-50 shadow-lg">
      {/* 상단 헤더 */}
      <div className="h-24 px-6 flex flex-col justify-center border-b border-orange-100">
        <span className="text-xl font-bold mb-1">BT관리자페이지</span>
        <span className="text-sm font-normal">{adminName}님 안녕하세요!</span>
      </div>

      {/* 사이드바 메뉴 */}
      <nav className="flex flex-col">

        {isSuperAdmin && (
          <SidebarLink to="/admin/staff" label="직원 관리" icon={UserIcon} />
        )}
        <SidebarLink to="/admin" label="사용자 관리" icon={UsersIcon} />
        <SidebarLink to="/admin/reservations" label="예약 관리" icon={BookmarkSquareIcon} />
        <SidebarLink to="/admin/noticeManage" label="공지사항/이벤트 관리" icon={InformationCircleIcon} />
        <SidebarLink to="/admin/inquiry" label="문의 관리" icon={QuestionMarkCircleIcon} />

      </nav>

      {/* 하단 버튼 */}
      <div className="absolute bottom-0 h-32 w-60 border-t border-orange-100 flex-col items-center justify-center gap-2 bg-orange-950">
        <button
          onClick={() => {
            window.location.href = `/`;
          }}
          className="h-16 w-60 flex items-center justify-center gap-2 text-lg hover:underline text-white"
        >
          사용자 페이지로 이동
        </button>
        <button
          onClick={() => {
            sessionStorage.clear();
            window.location.href = '/';
          }}
          className="h-16 w-60 flex items-center justify-center gap-2 text-xl hover:underline text-white border-t border-orange-100"
        >
          <ArrowRightStartOnRectangleIcon className="w-5 h-5 text-white" />
          로그아웃
        </button>
      </div>
    </aside>
  );
};

// NavLink 스타일 분리
const SidebarLink = ({ to, label, icon: Icon }) => (
  <NavLink
    to={to}
    end={to === "/admin"}
    className={({ isActive }) =>
      `h-14 text-m font-medium transition-all border-orange-100 border-b-2 
        w-full gap-2 flex items-center
       ${isActive
        ? ' text-lg font-bold bg-white/10 hover:bg-white/30'
        : 'font-bold hover:bg-white/30'
      }`
    }
  >
    {Icon && <Icon className="w-8 h-8 text-white float-left mx-2" />}
    <span>{label}</span>
  </NavLink>
);

export default Sidebar;
