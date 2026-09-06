/**
 * packageName    : src.pages.admin
 * fileName       : StatisticsDashboardPage.jsx
 * description    : 관리자 통계 대시보드 (Statistics 도메인)
 * ===========================================================
 */

import Sidebar from "@/components/admin/Sidebar";
import InputField from "@/components/common/InputField";
import Button from "@/components/common/Button";
import { useState, useEffect } from "react";
import axiosInstance from "@/api/axiosInstance";

const StatCard = ({ title, children }) => (
  <div className="bg-white border border-gray-300 rounded-lg p-4">
    <h3 className="font-bold text-gray-700 mb-3">{title}</h3>
    {children}
  </div>
);

const StatRow = ({ label, value }) => (
  <div className="flex justify-between text-sm py-1 border-b last:border-b-0">
    <span className="text-gray-500">{label}</span>
    <span className="font-semibold">{value}</span>
  </div>
);

const StatisticsDashboardPage = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [summary, setSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchSummary = () => {
    setIsLoading(true);
    axiosInstance.post("/admin/statistics/summary", {
      startDate: startDate || undefined,
      endDate: endDate || undefined,
    })
      .then((res) => setSummary(res.data))
      .catch((error) => {
        console.error("통계 조회 실패", error);
        alert(error.response?.data?.message || "통계 조회에 실패했습니다.");
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchSummary();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex">
      <Sidebar />
      <main className="w-full min-h-screen p-8 bg-gray-50">
        <h1 className="text-2xl font-bold mb-6">통계 대시보드</h1>

        <div className="flex items-end gap-2 mb-6">
          <div>
            <label className="block text-sm text-gray-600 mb-1">시작일</label>
            <InputField name="startDate" type="date" variant="admin" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">종료일</label>
            <InputField name="endDate" type="date" variant="admin" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </div>
          <Button variant="primary" onClick={fetchSummary} disabled={isLoading}>
            {isLoading ? "조회 중..." : "조회"}
          </Button>
        </div>

        {summary && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard title="예약 통계">
              <StatRow label="전체 예약" value={summary.reservationStatistics?.totalReservationCount ?? 0} />
              <StatRow label="대기" value={summary.reservationStatistics?.pendingCount ?? 0} />
              <StatRow label="확정" value={summary.reservationStatistics?.confirmedCount ?? 0} />
              <StatRow label="완료" value={summary.reservationStatistics?.completedCount ?? 0} />
              <StatRow label="취소" value={summary.reservationStatistics?.canceledCount ?? 0} />
              <StatRow label="노쇼" value={summary.reservationStatistics?.noShowCount ?? 0} />
              <StatRow label="노쇼율" value={`${summary.reservationStatistics?.noShowRate ?? 0}%`} />
            </StatCard>

            <StatCard title="상담 통계">
              <StatRow label="전체 상담" value={summary.consultationStatistics?.totalConsultationCount ?? 0} />
              <StatRow label="접수" value={summary.consultationStatistics?.receivedCount ?? 0} />
              <StatRow label="상담 예정" value={summary.consultationStatistics?.scheduledCount ?? 0} />
              <StatRow label="완료" value={summary.consultationStatistics?.completedCount ?? 0} />
              <StatRow label="예약 전환" value={summary.consultationStatistics?.convertedCount ?? 0} />
              <StatRow label="취소" value={summary.consultationStatistics?.canceledCount ?? 0} />
              <StatRow label="전환율" value={`${summary.consultationStatistics?.conversionRate ?? 0}%`} />
            </StatCard>

            <StatCard title="문의 통계">
              <StatRow label="전체 문의" value={summary.inquiryStatistics?.totalInquiryCount ?? 0} />
              <StatRow label="대기" value={summary.inquiryStatistics?.waitingCount ?? 0} />
              <StatRow label="답변완료" value={summary.inquiryStatistics?.answeredCount ?? 0} />
            </StatCard>

            <div className="md:col-span-3">
              <StatCard title="인기 진료 항목">
                {summary.treatmentStatistics?.length ? (
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-gray-500">
                        <th className="py-1">진료 항목</th>
                        <th className="py-1">건수</th>
                      </tr>
                    </thead>
                    <tbody>
                      {summary.treatmentStatistics.map((t) => (
                        <tr key={t.treatmentId} className="border-t">
                          <td className="py-1">{t.treatmentName}</td>
                          <td className="py-1">{t.reservationCount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-sm text-gray-500">데이터가 없습니다.</p>
                )}
              </StatCard>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default StatisticsDashboardPage;
