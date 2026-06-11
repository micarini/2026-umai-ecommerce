"use client";

import { useCallback, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import {
  createCategory,
  deleteCategory,
  updateCategory,
} from "@/app/actions/categories";

const initialForm = {
  name: "",
  description: "",
};

export default function CategoryManager({ initialCategories = [] }) {
  const router = useRouter();
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState("");
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isRefreshing, startRefreshTransition] = useTransition();

  const resetForm = useCallback(() => {
    setForm(initialForm);
    setEditingId("");
  }, []);

  const refreshCategories = useCallback(() => {
    startRefreshTransition(() => {
      router.refresh();
    });
  }, [router]);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSaving(true);

    const formData = new FormData(event.currentTarget);
    const action = editingId
      ? updateCategory.bind(null, editingId)
      : createCategory;

    try {
      const result = await action(null, formData);
      setMessage(result.message);

      if (result.ok) {
        resetForm();
        refreshCategories();
      }
    } catch {
      setMessage("An error occurred while saving the category.");
    } finally {
      setIsSaving(false);
    }
  }

  function handleEdit(category) {
    setEditingId(category._id);
    setForm({
      name: category.name,
      description: category.description,
    });
    setMessage("Editing category.");
  }

  async function handleDelete(id) {
    const result = await deleteCategory(id);

    if (!result.ok) {
      setMessage(result.message || "Could not delete the category.");
      return;
    }

    if (editingId === id) {
      resetForm();
    }

    setMessage(result.message);
    refreshCategories();
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
      <section className="rounded-lg border border-black/10 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-semibold text-slate-900">
          {editingId ? "Edit Category" : "New Category"}
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Categories can be associated with multiple bowls.
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <input
            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none"
            name="name"
            placeholder="Category name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <textarea
            className="min-h-28 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none"
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
          />

          <div className="flex gap-3">
            <button
              className="rounded-lg bg-slate-900 px-4 py-3 text-sm font-semibold text-white"
              disabled={isSaving}
              type="submit"
            >
              {isSaving ? "Saving..." : editingId ? "Update" : "Create"}
            </button>
            <button
              className="rounded-lg border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700"
              type="button"
              onClick={resetForm}
            >
              Clear
            </button>
          </div>
        </form>

        {message ? <p className="mt-4 text-sm text-slate-700">{message}</p> : null}
      </section>

      <section className="rounded-lg border border-black/10 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Categories</h2>
            <p className="mt-2 text-sm text-slate-600">
              List of available categories for bowls.
            </p>
          </div>
          <button
            className="rounded-lg border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700"
            disabled={isRefreshing}
            type="button"
            onClick={refreshCategories}
          >
            {isRefreshing ? "Reloading..." : "Reload"}
          </button>
        </div>

        {initialCategories.length === 0 ? (
          <p className="mt-6 text-slate-600">No categories loaded yet.</p>
        ) : (
          <div className="mt-6 grid gap-4">
            {initialCategories.map((category) => (
              <article
                key={category._id}
                className="rounded-lg border border-slate-200 p-5"
              >
                <h3 className="text-xl font-semibold text-slate-900">
                  {category.name}
                </h3>
                <p className="mt-2 text-sm text-slate-600">
                  {category.description || "No description"}
                </p>
                <p className="mt-3 break-all text-xs text-slate-500">
                  ID: {category._id}
                </p>

                <div className="mt-4 flex gap-3">
                  <button
                    className="rounded-lg bg-amber-100 px-4 py-2 text-sm font-semibold text-amber-900"
                    type="button"
                    onClick={() => handleEdit(category)}
                  >
                    Edit
                  </button>
                  <button
                    className="rounded-lg bg-red-100 px-4 py-2 text-sm font-semibold text-red-900"
                    type="button"
                    onClick={() => handleDelete(category._id)}
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
