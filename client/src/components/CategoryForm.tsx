import { useState } from "react";
import { createCategory } from "../lib/api";
import toast from "react-hot-toast";
import { Plus, Tag, X } from "lucide-react";

interface CategoryFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

const CategoryForm = ({ onClose, onSuccess }: CategoryFormProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<{
    name: string;
    type: "expense" | "income";
    subcategories: string[];
  }>({
    name: "",
    type: "expense",
    subcategories: [""],
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      setLoading(true);
      await createCategory({
        name: formData.name,
        type: formData.type,
        subcategories: formData.subcategories
          .filter((sub) => sub.trim())
          .map((name) => ({ name })),
      });
      toast.success("Category added successfully");
      onSuccess();
      onClose();
    } catch {
      toast.error("Error adding category");
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Add Category</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Category Name
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Tag className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                className="block w-full pl-10 pr-3 py-2 rounded-md border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="e.g., Groceries"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Type
            </label>
            <select
              value={formData.type}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  type: e.target.value as "expense" | "income",
                }))
              }
              className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subcategories
            </label>
            <div className="space-y-2">
              {formData.subcategories.map((subcategory, index) => (
                <div key={index} className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={subcategory}
                      onChange={(e) => {
                        const newSubcategories = [...formData.subcategories];
                        newSubcategories[index] = e.target.value;
                        setFormData((prev) => ({
                          ...prev,
                          subcategories: newSubcategories,
                        }));
                      }}
                      className="block w-full rounded-md border-gray-300 pr-10 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder={`Subcategory ${index + 1}`}
                    />
                  </div>
                  {index === formData.subcategories.length - 1 ? (
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          subcategories: [...prev.subcategories, ""],
                        }))
                      }
                      className="inline-flex items-center p-2 border border-transparent rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          subcategories: prev.subcategories.filter(
                            (_, i) => i !== index
                          ),
                        }))
                      }
                      className="inline-flex items-center p-2 border border-transparent rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Saving..." : "Save Category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryForm;
