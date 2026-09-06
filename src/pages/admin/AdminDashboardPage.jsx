/**
 * packageName    : src.pages.admin
 * fileName       : AdminDashboardPage.jsx
 * description    : 관리자 대시보드 (Dashboard 도메인)
 * ===========================================================
 */

import Sidebar from "@/components/admin/Sidebar";
import { formatDateTime } from "@/constants/dateUtils";
import { useState, useEffect } from "react";
import axiosInstance from "@/api/axiosInstance";

const SummaryTile = ({ label, value, tone = "default" }) => {
  const toneClass = tone === "warning" ? "text-red-600" : "text-gray-900";
  return (
    <div className="bg-white border border-gray-300 rounded-lg p-4 text-center">
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className={`text-2xl font-bold ${toneClass}`}>{value}</p>
    </div>
  );
};

const AdminDashboardPage = () => {
  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    axiosInstance.get("/admin/dashboard")
      .then((res) => setDashboard(res.data))
      .catch((error) => console.error("대시보드 조회 실패", error));
  }, []);

  return (
    <div className="flex">
      <Sidebar />
      <main className="w-full min-h-screen p-8 bg-gray-50">
        <h1 className="text-2xl font-bold mb-6">관리자 대시보드</h1>

        {dashboard && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
              <SummaryTile label="오늘 예약" value={dashboard.todayReservationCount ?? 0} />
              <SummaryTile label="대기 중인 예약" value={dashboard.pendingReservationCount ?? 0} />
              <SummaryTile label="오늘 상담 신청" value={dashboard.todayConsultationCount ?? 0} />
              <SummaryTile label="답변 대기 문의" value={dashboard.waitingInquiryCount ?? 0} />
              <SummaryTile label="PMS 연동 실패" value={dashboard.pmsFailedCount ?? 0} tone={dashboard.pmsFailedCount ? "warning" : "default"} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white border border-gray-300 rounded-lg p-4">
                <h2 className="font-bold text-gray-700 mb-3">최근 예약</h2>
                {dashboard.recentReservations?.length ? (
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-gray-500">
                        <th className="py-1">예약자</th>
                        <th className="py-1">날짜</th>
                        <th className="py-1">시간</th>
                        <th className="py-1">상태</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dashboard.recentReservations.map((r) => (
                        <tr key={r.reservationId} className="border-t">
                          <td className="py-1">{r.uId}</td>
                          <td className="py-1">{r.reservationDate}</td>
                          <td className="py-1">{r.reservationTime}</td>
                          <td className="py-1">{r.reservationStatus}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-sm text-gray-500">데이터가 없습니다.</p>
                )}
              </div>

              <div className="bg-white border border-gray-300 rounded-lg p-4">
                <h2 className="font-bold text-gray-700 mb-3">최근 문의</h2>
                {dashboard.recentInquiries?.length ? (
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-gray-500">
                        <th className="py-1">작성자</th>
                        <th className="py-1">제목</th>
                        <th className="py-1">작성일</th>
                        <th className="py-1">상태</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dashboard.recentInquiries.map((q) => (
                        <tr key={q.inquiryId} className="border-t">
                          <td className="py-1">{q.uId}</td>
                          <td className="py-1">{q.title}</td>
                          <td className="py-1">{formatDateTime(q.createdAt)}</td>
                          <td className="py-1">{q.inquiryStatus}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-sm text-gray-500">데이터가 없습니다.</p>
                )}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default AdminDashboardPage;
