const SidebarMinimal = () => {
  return (
    <aside className="w-60 h-screen bg-orange-950 text-white flex flex-col justify-between fixed left-0 top-0 z-50 shadow-lg">
      {/* 상단 영역 */}
      <div className="h-20 flex items-center px-6 border-b border-white">
        <span className="text-2xl font-bold">BT관리자페이지</span>
      </div>

      {/* 하단 영역 */}
      <div className="flex-center border-t border-white">
        <button
          onClick={() => window.history.back()}
          className="h-16 w-full text-sm hover:underline text-white"
        >
          이전 페이지로 가기
        </button>
      </div>
    </aside>
  );
};

export default SidebarMinimal;
