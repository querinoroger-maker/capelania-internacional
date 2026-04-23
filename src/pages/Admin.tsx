import { useState } from "react";
import { useI18n } from "@/i18n/context";
import { trpc } from "@/providers/trpc";
import Navbar from "@/components/Navbar";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  X,
  User,
  Save,
  AlertTriangle,
} from "lucide-react";
import { toast, Toaster } from "sonner";

type StudentFormData = {
  id?: number;
  fullName: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  country: string;
  course: string;
  completionDate: string;
  certificateNumber: string;
  status: string;
  notes: string;
};

const emptyForm: StudentFormData = {
  fullName: "",
  email: "",
  phone: "",
  city: "",
  state: "",
  country: "",
  course: "",
  completionDate: "",
  certificateNumber: "",
  status: "active",
  notes: "",
};

export default function Admin() {
  const { t } = useI18n();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<StudentFormData>(emptyForm);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);

  const utils = trpc.useUtils();
  const studentsQuery = trpc.student.list.useQuery();
  const createMutation = trpc.student.create.useMutation({
    onSuccess: () => {
      utils.student.list.invalidate();
      toast.success(t.admin.studentAdded);
      handleCloseForm();
    },
  });
  const updateMutation = trpc.student.update.useMutation({
    onSuccess: () => {
      utils.student.list.invalidate();
      toast.success(t.admin.studentUpdated);
      handleCloseForm();
    },
  });
  const deleteMutation = trpc.student.delete.useMutation({
    onSuccess: () => {
      utils.student.list.invalidate();
      toast.success(t.admin.studentDeleted);
      setShowDeleteConfirm(null);
    },
  });
  const searchMutation = trpc.student.search.useMutation();

  const handleOpenAdd = () => {
    setFormData(emptyForm);
    setEditingId(null);
    setShowForm(true);
  };

  const handleOpenEdit = (student: NonNullable<typeof studentsQuery.data>[0]) => {
    setFormData({
      id: student.id,
      fullName: student.fullName,
      email: student.email || "",
      phone: student.phone || "",
      city: student.city || "",
      state: student.state || "",
      country: student.country || "",
      course: student.course || "",
      completionDate: student.completionDate || "",
      certificateNumber: student.certificateNumber || "",
      status: student.status || "active",
      notes: student.notes || "",
    });
    setEditingId(student.id);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData(emptyForm);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim()) return;

    if (editingId) {
      updateMutation.mutate({
        id: editingId,
        ...formData,
      });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleDelete = (id: number) => {
    deleteMutation.mutate({ id });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      searchMutation.mutate({ query: searchQuery.trim() });
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    searchMutation.reset();
  };

  const displayStudents = searchMutation.data || studentsQuery.data || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      <Navbar />

      {/* Header */}
      <section className="bg-white border-b py-6">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">{t.admin.title}</h1>
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-2 px-5 py-2.5 bg-yellow-600 hover:bg-yellow-700 text-white font-medium rounded-lg transition-colors"
          >
            <Plus size={18} />
            {t.admin.addStudent}
          </button>
        </div>
      </section>

      {/* Content */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4">
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex gap-2 mb-6 max-w-md">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.admin.search}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-sm"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white rounded-lg transition-colors text-sm"
            >
              {t.home.searchButton}
            </button>
            {(searchMutation.data || searchQuery) && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="px-3 py-2 bg-gray-200 hover:bg-gray-300 text-gray-600 rounded-lg transition-colors"
              >
                <X size={16} />
              </button>
            )}
          </form>

          {/* Form Modal */}
          {showForm && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between rounded-t-xl">
                  <h2 className="text-lg font-bold text-gray-800">
                    {editingId ? t.admin.editStudent : t.admin.addStudent}
                  </h2>
                  <button
                    onClick={handleCloseForm}
                    className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X size={20} className="text-gray-500" />
                  </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t.admin.fullName} *
                      </label>
                      <input
                        type="text"
                        value={formData.fullName}
                        onChange={(e) =>
                          setFormData({ ...formData, fullName: e.target.value })
                        }
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t.admin.email}
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t.admin.phone}
                      </label>
                      <input
                        type="text"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t.admin.city}
                      </label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) =>
                          setFormData({ ...formData, city: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t.admin.state}
                      </label>
                      <input
                        type="text"
                        value={formData.state}
                        onChange={(e) =>
                          setFormData({ ...formData, state: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t.admin.country}
                      </label>
                      <input
                        type="text"
                        value={formData.country}
                        onChange={(e) =>
                          setFormData({ ...formData, country: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t.admin.course}
                      </label>
                      <input
                        type="text"
                        value={formData.course}
                        onChange={(e) =>
                          setFormData({ ...formData, course: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t.admin.completionDate}
                      </label>
                      <input
                        type="text"
                        value={formData.completionDate}
                        onChange={(e) =>
                          setFormData({ ...formData, completionDate: e.target.value })
                        }
                        placeholder="DD/MM/YYYY"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t.admin.certificateNumber}
                      </label>
                      <input
                        type="text"
                        value={formData.certificateNumber}
                        onChange={(e) =>
                          setFormData({ ...formData, certificateNumber: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t.admin.status}
                      </label>
                      <select
                        value={formData.status}
                        onChange={(e) =>
                          setFormData({ ...formData, status: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-sm"
                      >
                        <option value="active">{t.admin.active}</option>
                        <option value="inactive">{t.admin.inactive}</option>
                      </select>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t.admin.notes}
                      </label>
                      <textarea
                        value={formData.notes}
                        onChange={(e) =>
                          setFormData({ ...formData, notes: e.target.value })
                        }
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-sm resize-none"
                      />
                    </div>
                  </div>
                  <div className="flex gap-3 mt-6 pt-4 border-t">
                    <button
                      type="submit"
                      disabled={createMutation.isPending || updateMutation.isPending}
                      className="flex items-center gap-2 px-5 py-2.5 bg-yellow-600 hover:bg-yellow-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
                    >
                      <Save size={16} />
                      {t.admin.save}
                    </button>
                    <button
                      type="button"
                      onClick={handleCloseForm}
                      className="px-5 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-lg transition-colors"
                    >
                      {t.admin.cancel}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Delete Confirmation */}
          {showDeleteConfirm && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 text-center">
                <AlertTriangle className="mx-auto text-red-500 mb-3" size={40} />
                <h3 className="text-lg font-bold text-gray-800 mb-2">
                  {t.admin.confirmDelete}
                </h3>
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => handleDelete(showDeleteConfirm)}
                    disabled={deleteMutation.isPending}
                    className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
                  >
                    {t.admin.delete}
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(null)}
                    className="flex-1 px-4 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-lg transition-colors"
                  >
                    {t.admin.cancel}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Students Table */}
          {studentsQuery.isLoading ? (
            <div className="text-center py-12 text-gray-500">Loading...</div>
          ) : displayStudents.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
              <User className="mx-auto text-gray-300 mb-3" size={48} />
              <p className="text-gray-500">{t.admin.noStudents}</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left px-4 py-3 font-medium text-gray-700">
                      {t.admin.fullName}
                    </th>
                    <th className="text-left px-4 py-3 font-medium text-gray-700 hidden md:table-cell">
                      {t.admin.email}
                    </th>
                    <th className="text-left px-4 py-3 font-medium text-gray-700 hidden lg:table-cell">
                      {t.admin.city}
                    </th>
                    <th className="text-left px-4 py-3 font-medium text-gray-700 hidden lg:table-cell">
                      {t.admin.course}
                    </th>
                    <th className="text-left px-4 py-3 font-medium text-gray-700">
                      {t.admin.status}
                    </th>
                    <th className="text-left px-4 py-3 font-medium text-gray-700">
                      {t.admin.actions}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {displayStudents.map((student) => (
                    <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0">
                            <User size={14} className="text-yellow-600" />
                          </div>
                          <span className="font-medium text-gray-800 truncate max-w-[150px]">
                            {student.fullName}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-500 hidden md:table-cell truncate max-w-[150px]">
                        {student.email || "-"}
                      </td>
                      <td className="px-4 py-3 text-gray-500 hidden lg:table-cell">
                        {student.city || "-"}
                        {student.state && `, ${student.state}`}
                      </td>
                      <td className="px-4 py-3 text-gray-500 hidden lg:table-cell">
                        {student.course || "-"}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            student.status === "active"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {student.status === "active" ? t.admin.active : t.admin.inactive}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleOpenEdit(student)}
                            className="p-1.5 hover:bg-yellow-100 rounded-md transition-colors text-yellow-600"
                            title={t.admin.edit}
                          >
                            <Pencil size={15} />
                          </button>
                          <button
                            onClick={() => setShowDeleteConfirm(student.id)}
                            className="p-1.5 hover:bg-red-100 rounded-md transition-colors text-red-600"
                            title={t.admin.delete}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1a1a1a] text-gray-400 py-8 text-center mt-auto">
        <p className="text-sm">
          © {new Date().getFullYear()} Edify Mission International Chaplaincy. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
