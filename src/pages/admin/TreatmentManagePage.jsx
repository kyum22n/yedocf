/**
 * packageName    : src.pages.admin
 * fileName       : TreatmentManagePage.jsx
 * description    : 진료항목 / 카테고리 관리 (Treatment, TreatmentCategory 도메인)
 * ===========================================================
 */

import Sidebar from "@/components/admin/Sidebar";
import InputField from "@/components/common/InputField";
import Dropdown from "@/components/common/Dropdown";
import Button from "@/components/common/Button";
import Modal from "@/components/common/Modal";
import { useState, useEffect } from "react";
import axiosInstance from "@/api/axiosInstance";

const TreatmentManagePage = () => {
  const [tab, setTab] = useState("treatments"); // treatments | categories

  // 진료 항목 상태
  const [treatments, setTreatments] = useState([]);
  const [categories, setCategories] = useState([]);

  const fetchTreatments = () => {
    axiosInstance.get("/admin/treatments/all")
      .then((res) => setTreatments(res.data))
      .catch((error) => console.error("진료 항목 조회 실패", error));
  };

  const fetchCategories = () => {
    axiosInstance.get("/admin/treatment-categories/all")
      .then((res) => setCategories(res.data))
      .catch((error) => console.error("진료 카테고리 조회 실패", error));
  };

  useEffect(() => {
    fetchTreatments();
    fetchCategories();
  }, []);

  const categoryName = (id) => categories.find((c) => c.categoryId === id)?.categoryName ?? id;
  const categoryOptions = categories.map((c) => ({ value: String(c.categoryId), label: c.categoryName }));

  // 진료 항목 추가/수정 모달
  const [isTreatmentModalOpen, setIsTreatmentModalOpen] = useState(false);
  const [treatmentForm, setTreatmentForm] = useState({
    treatmentId: null,
    categoryId: "",
    treatmentName: "",
    description: "",
    isReservable: true,
    isVisible: true,
  });
  const [isTreatmentDeleteOpen, setIsTreatmentDeleteOpen] = useState(false);
  const [selectedTreatment, setSelectedTreatment] = useState(null);

  const openCreateTreatment = () => {
    setTreatmentForm({
      treatmentId: null,
      categoryId: categories[0] ? String(categories[0].categoryId) : "",
      treatmentName: "",
      description: "",
      isReservable: true,
      isVisible: true,
    });
    setIsTreatmentModalOpen(true);
  };

  const openEditTreatment = (t) => {
    setTreatmentForm({
      treatmentId: t.treatmentId,
      categoryId: String(t.categoryId),
      treatmentName: t.treatmentName,
      description: t.description || "",
      isReservable: t.isReservable,
      isVisible: t.isVisible,
    });
    setIsTreatmentModalOpen(true);
  };

  const handleSaveTreatment = async () => {
    const payload = {
      categoryId: Number(treatmentForm.categoryId),
      treatmentName: treatmentForm.treatmentName,
      description: treatmentForm.description,
      isReservable: treatmentForm.isReservable,
      isVisible: treatmentForm.isVisible,
    };

    try {
      if (treatmentForm.treatmentId) {
        await axiosInstance.put("/admin/treatments/update", { ...payload, treatmentId: treatmentForm.treatmentId });
      } else {
        await axiosInstance.post("/admin/treatments/register", payload);
      }
      fetchTreatments();
      setIsTreatmentModalOpen(false);
    } catch (error) {
      console.error("진료 항목 저장 실패", error);
      alert(error.response?.data?.message || "저장에 실패했습니다.");
    }
  };

  const handleDeleteTreatment = async () => {
    try {
      await axiosInstance.delete(`/admin/treatments/delete/${selectedTreatment.treatmentId}`);
      fetchTreatments();
      setIsTreatmentDeleteOpen(false);
    } catch (error) {
      console.error("진료 항목 삭제 실패", error);
      alert("삭제에 실패했습니다.");
    }
  };

  // 카테고리 추가/수정 모달
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [categoryForm, setCategoryForm] = useState({ categoryId: null, categoryName: "", isVisible: true });
  const [isCategoryDeleteOpen, setIsCategoryDeleteOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const openCreateCategory = () => {
    setCategoryForm({ categoryId: null, categoryName: "", isVisible: true });
    setIsCategoryModalOpen(true);
  };

  const openEditCategory = (c) => {
    setCategoryForm({ categoryId: c.categoryId, categoryName: c.categoryName, isVisible: c.isVisible });
    setIsCategoryModalOpen(true);
  };

  const handleSaveCategory = async () => {
    const payload = { categoryName: categoryForm.categoryName, isVisible: categoryForm.isVisible };

    try {
      if (categoryForm.categoryId) {
        await axiosInstance.put("/admin/treatment-categories/update", { ...payload, categoryId: categoryForm.categoryId });
      } else {
        await axiosInstance.post("/admin/treatment-categories/register", payload);
      }
      fetchCategories();
      setIsCategoryModalOpen(false);
    } catch (error) {
      console.error("카테고리 저장 실패", error);
      alert(error.response?.data?.message || "저장에 실패했습니다.");
    }
  };

  const handleDeleteCategory = async () => {
    try {
      await axiosInstance.delete(`/admin/treatment-categories/delete/${selectedCategory.categoryId}`);
      fetchCategories();
      setIsCategoryDeleteOpen(false);
    } catch (error) {
      console.error("카테고리 삭제 실패", error);
      alert("삭제에 실패했습니다.");
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <main className="w-full min-h-screen p-8 bg-gray-50">
        <h1 className="text-2xl font-bold mb-6">진료항목 / 카테고리 관리</h1>

        <div className="flex mb-4 gap-2">
          <Button variant={tab === "treatments" ? "primary" : "secondary"} onClick={() => setTab("treatments")}>진료 항목</Button>
          <Button variant={tab === "categories" ? "primary" : "secondary"} onClick={() => setTab("categories")}>카테고리</Button>
        </div>

        {tab === "treatments" && (
          <>
            <div className="flex mb-4 justify-end">
              <Button variant="primary" className="bg-green-600" onClick={openCreateTreatment}>진료 항목 추가</Button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-300">
                <thead>
                  <tr className="bg-gray-100 text-center text-sm font-semibold">
                    <th className="px-4 py-3 border">이름</th>
                    <th className="px-4 py-3 border">카테고리</th>
                    <th className="px-4 py-3 border">설명</th>
                    <th className="px-4 py-3 border">예약 가능</th>
                    <th className="px-4 py-3 border">노출</th>
                    <th className="py-3 border">변경 / 삭제</th>
                  </tr>
                </thead>
                <tbody>
                  {treatments.map((t) => (
                    <tr key={t.treatmentId} className="text-center">
                      <td className="px-4 py-2 border">{t.treatmentName}</td>
                      <td className="px-4 py-2 border">{categoryName(t.categoryId)}</td>
                      <td className="px-4 py-2 border">{t.description}</td>
                      <td className="px-4 py-2 border">{t.isReservable ? "O" : "X"}</td>
                      <td className="px-4 py-2 border">{t.isVisible ? "O" : "X"}</td>
                      <td className="py-2 border flex justify-center gap-2">
                        <Button variant="secondary" onClick={() => openEditTreatment(t)}>변경</Button>
                        <Button variant="danger" onClick={() => { setSelectedTreatment(t); setIsTreatmentDeleteOpen(true); }}>삭제</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {tab === "categories" && (
          <>
            <div className="flex mb-4 justify-end">
              <Button variant="primary" className="bg-green-600" onClick={openCreateCategory}>카테고리 추가</Button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-300">
                <thead>
                  <tr className="bg-gray-100 text-center text-sm font-semibold">
                    <th className="px-4 py-3 border">이름</th>
                    <th className="px-4 py-3 border">노출</th>
                    <th className="py-3 border">변경 / 삭제</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((c) => (
                    <tr key={c.categoryId} className="text-center">
                      <td className="px-4 py-2 border">{c.categoryName}</td>
                      <td className="px-4 py-2 border">{c.isVisible ? "O" : "X"}</td>
                      <td className="py-2 border flex justify-center gap-2">
                        <Button variant="secondary" onClick={() => openEditCategory(c)}>변경</Button>
                        <Button variant="danger" onClick={() => { setSelectedCategory(c); setIsCategoryDeleteOpen(true); }}>삭제</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* 진료 항목 추가/수정 모달 */}
        <Modal
          isOpen={isTreatmentModalOpen}
          onClose={() => setIsTreatmentModalOpen(false)}
          title={treatmentForm.treatmentId ? "진료 항목 변경" : "진료 항목 추가"}
          actionLabel={treatmentForm.treatmentId ? "변경" : "추가"}
          onAction={handleSaveTreatment}
        >
          <div className="space-y-2">
            <Dropdown
              value={treatmentForm.categoryId}
              onChange={(e) => setTreatmentForm((prev) => ({ ...prev, categoryId: e.target.value }))}
              options={categoryOptions}
              placeholder="카테고리 선택"
            />
            <InputField
              name="treatmentName"
              placeholder="진료 항목명"
              variant="admin"
              value={treatmentForm.treatmentName}
              onChange={(e) => setTreatmentForm((prev) => ({ ...prev, treatmentName: e.target.value }))}
            />
            <InputField
              name="description"
              placeholder="설명"
              variant="admin"
              value={treatmentForm.description}
              onChange={(e) => setTreatmentForm((prev) => ({ ...prev, description: e.target.value }))}
            />
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={treatmentForm.isReservable}
                onChange={(e) => setTreatmentForm((prev) => ({ ...prev, isReservable: e.target.checked }))}
              />
              예약 가능
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={treatmentForm.isVisible}
                onChange={(e) => setTreatmentForm((prev) => ({ ...prev, isVisible: e.target.checked }))}
              />
              사용자에게 노출
            </label>
          </div>
        </Modal>

        {/* 진료 항목 삭제 모달 */}
        <Modal
          isOpen={isTreatmentDeleteOpen}
          onClose={() => setIsTreatmentDeleteOpen(false)}
          title="진료 항목 삭제"
          actionLabel="삭제"
          onAction={handleDeleteTreatment}
        >
          <p className="text-sm text-gray-700">
            <strong>{selectedTreatment?.treatmentName}</strong>을(를) 삭제하시겠습니까?
          </p>
        </Modal>

        {/* 카테고리 추가/수정 모달 */}
        <Modal
          isOpen={isCategoryModalOpen}
          onClose={() => setIsCategoryModalOpen(false)}
          title={categoryForm.categoryId ? "카테고리 변경" : "카테고리 추가"}
          actionLabel={categoryForm.categoryId ? "변경" : "추가"}
          onAction={handleSaveCategory}
        >
          <div className="space-y-2">
            <InputField
              name="categoryName"
              placeholder="카테고리명"
              variant="admin"
              value={categoryForm.categoryName}
              onChange={(e) => setCategoryForm((prev) => ({ ...prev, categoryName: e.target.value }))}
            />
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={categoryForm.isVisible}
                onChange={(e) => setCategoryForm((prev) => ({ ...prev, isVisible: e.target.checked }))}
              />
              사용자에게 노출
            </label>
          </div>
        </Modal>

        {/* 카테고리 삭제 모달 */}
        <Modal
          isOpen={isCategoryDeleteOpen}
          onClose={() => setIsCategoryDeleteOpen(false)}
          title="카테고리 삭제"
          actionLabel="삭제"
          onAction={handleDeleteCategory}
        >
          <p className="text-sm text-gray-700">
            <strong>{selectedCategory?.categoryName}</strong>을(를) 삭제하시겠습니까?
          </p>
        </Modal>
      </main>
    </div>
  );
};

export default TreatmentManagePage;
