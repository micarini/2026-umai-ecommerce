"use client";

import {
  useCallback,
  useState,
  useTransition,
} from "react";
import { useRouter } from "next/navigation";

import {
  createProduct,
  deleteProduct,
  updateProduct,
} from "@/app/actions/products";

const initialForm = {
  name: "",
  description: "",
  price: "",
  stock: "",
  image: "",
  categories: [],
};

export default function ProductManager({
  initialCategories = [],
  initialProducts = [],
}) {
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

  const refreshProducts = useCallback(() => {
    startRefreshTransition(() => {
      router.refresh();
    });
  }, [router]);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function handleCategoryChange(event) {
    const { checked, value } = event.target;

    setForm((current) => {
      const categories = checked
        ? [...current.categories, value]
        : current.categories.filter((categoryId) => categoryId !== value);

      return { ...current, categories };
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSaving(true);

    const formData = new FormData(event.currentTarget);
    const action = editingId ? updateProduct.bind(null, editingId) : createProduct;

    try {
      const result = await action(null, formData);
      setMessage(result.message);

      if (result.ok) {
        resetForm();
        refreshProducts();
      }
    } catch {
      setMessage("An error occurred while saving the bowl.");
    } finally {
      setIsSaving(false);
    }
  }

  function handleEdit(product) {
    setEditingId(product._id);
    setForm({
      name: product.name,
      description: product.description,
      price: String(product.price),
      stock: String(product.stock),
      image: product.image || "",
      categories: (product.categories || []).map((category) =>
        typeof category === "string" ? category : category._id
      ),
    });
    setMessage("Editing bowl.");
  }

  async function handleDelete(id) {
    const result = await deleteProduct(id);

    if (!result.ok) {
      setMessage(result.message || "Could not delete the bowl.");
      return;
    }

    if (editingId === id) {
      resetForm();
    }

    setMessage(result.message);
    refreshProducts();
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
      <section className="rounded-3xl border border-sand bg-white/40 p-6">
        <h2 className="text-2xl font-extrabold text-teal">
          {editingId ? "Edit Bowl" : "New Bowl"}
        </h2>
        <p className="mt-2 text-sm text-teal/60">
          Create and manage bowl products.
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <input
            className="w-full rounded-lg border border-sand bg-cream px-4 py-3 text-teal outline-none focus:border-teal"
            name="name"
            placeholder="Bowl name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <textarea
            className="min-h-28 w-full rounded-lg border border-sand bg-cream px-4 py-3 text-teal outline-none focus:border-teal"
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
          />
          <input
            className="w-full rounded-lg border border-sand bg-cream px-4 py-3 text-teal outline-none focus:border-teal"
            name="price"
            placeholder="Price"
            type="number"
            min="0"
            step="0.01"
            value={form.price}
            onChange={handleChange}
            required
          />
          <input
            className="w-full rounded-lg border border-sand bg-cream px-4 py-3 text-teal outline-none focus:border-teal"
            name="stock"
            placeholder="Stock quantity"
            type="number"
            min="0"
            value={form.stock}
            onChange={handleChange}
            required
          />
          <input
            className="w-full rounded-lg border border-sand bg-cream px-4 py-3 text-teal outline-none focus:border-teal"
            name="image"
            placeholder="Image filename, e.g: spicy-tuna.png"
            value={form.image}
            onChange={handleChange}
          />
          <fieldset className="rounded-lg border border-sand px-4 py-3">
            <legend className="px-1 text-sm font-bold text-teal/70">
              Categories
            </legend>

            {initialCategories.length === 0 ? (
              <p className="py-2 text-sm text-teal/40">
                Create a category before associating it with bowls.
              </p>
            ) : (
              <div className="grid gap-3">
                {initialCategories.map((category) => (
                  <label
                    key={category._id}
                    className="flex cursor-pointer items-start gap-3 rounded-lg border border-sand px-3 py-2 hover:bg-sand/40"
                  >
                    <input
                      checked={form.categories.includes(category._id)}
                      className="mt-1 h-4 w-4"
                      name="categories"
                      type="checkbox"
                      value={category._id}
                      onChange={handleCategoryChange}
                    />
                    <span>
                      <span className="block text-sm font-bold text-teal">
                        {category.name}
                      </span>
                      {category.description ? (
                        <span className="mt-1 block text-xs text-teal/40">
                          {category.description}
                        </span>
                      ) : null}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </fieldset>

          <div className="flex gap-3">
            <button
              className="rounded-full bg-salmon px-6 py-3 text-sm font-bold text-white transition hover:bg-salmon-dark disabled:cursor-not-allowed disabled:opacity-50"
              disabled={isSaving}
              type="submit"
            >
              {isSaving ? "Saving..." : editingId ? "Update" : "Create"}
            </button>
            <button
              className="rounded-full border border-sand px-6 py-3 text-sm font-bold text-teal transition hover:bg-sand"
              type="button"
              onClick={resetForm}
            >
              Clear
            </button>
          </div>
        </form>

        {message ? <p className="mt-4 text-sm text-teal/70">{message}</p> : null}
      </section>

      <section className="rounded-3xl border border-sand bg-white/40 p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-teal">Bowls</h2>
            <p className="mt-2 text-sm text-teal/60">
              List of all bowls in the catalog.
            </p>
          </div>
          <button
            className="rounded-full border border-sand px-6 py-3 text-sm font-bold text-teal transition hover:bg-sand disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isRefreshing}
            type="button"
            onClick={refreshProducts}
          >
            {isRefreshing ? "Reloading..." : "Reload"}
          </button>
        </div>

        {initialProducts.length === 0 ? (
          <p className="mt-6 text-teal/60">No bowls loaded yet.</p>
        ) : (
          <div className="mt-6 grid gap-4">
            {initialProducts.map((product) => (
              <article
                key={product._id}
                className="rounded-2xl border border-sand p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-teal">{product.name}</h3>
                    <p className="mt-2 text-sm text-teal/60">
                      {product.description || "No description"}
                    </p>
                  </div>
                  <div className="text-right text-sm text-teal/70">
                    <p>${product.price}</p>
                    <p>Available: {product.stock}</p>
                  </div>
                </div>

                <p className="mt-3 break-all text-xs text-teal/40">
                  ID: {product._id}
                </p>

                {product.categories?.length ? (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {product.categories.map((category) => (
                      <span
                        key={typeof category === "string" ? category : category._id}
                        className="rounded-full bg-wasabi-light px-3 py-1 text-xs font-semibold text-wasabi"
                      >
                        {typeof category === "string" ? category : category.name}
                      </span>
                    ))}
                  </div>
                ) : null}

                <div className="mt-4 flex gap-3">
                  <button
                    className="rounded-full border border-teal/20 px-4 py-2 text-sm font-bold text-teal transition hover:bg-sand"
                    type="button"
                    onClick={() => handleEdit(product)}
                  >
                    Edit
                  </button>
                  <button
                    className="rounded-full bg-salmon/10 px-4 py-2 text-sm font-bold text-salmon transition hover:bg-salmon/20"
                    type="button"
                    onClick={() => handleDelete(product._id)}
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
