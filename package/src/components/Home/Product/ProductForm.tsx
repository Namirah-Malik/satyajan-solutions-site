"use client";
import React, { useState } from "react";

const ProductForm: React.FC = () => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    images: "",
    salient_features: "",
    features: "",
    specifications: "",
    category: ""
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          description: form.description,
          price: parseFloat(form.price),
          images: form.images.split(",").map((s) => s.trim()),
          salient_features: form.salient_features.split(",").map((s) => s.trim()),
          features: form.features.split(",").map((s) => s.trim()),
          specifications: form.specifications.split(",").map((s) => s.trim()),
          category: form.category || undefined
        }),
      });
      if (res.ok) {
        setMessage("Product added successfully!");
        setForm({ name: "", description: "", price: "", images: "", salient_features: "", features: "", specifications: "", category: "" });
      } else {
        setMessage("Failed to add product.");
      }
    } catch {
      setMessage("Error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto p-6 bg-white rounded shadow flex flex-col gap-4">
      <h2 className="text-2xl font-bold mb-4">Add New Product</h2>
      <input
        type="text"
        name="name"
        placeholder="Product Name"
        value={form.name}
        onChange={handleChange}
        required
        className="border p-2 rounded"
      />
      <select
        name="category"
        value={form.category}
        onChange={handleChange}
        required
        className="border p-2 rounded"
      >
        <option value="">Select Category</option>
        <option value="BMMS">BMMS</option>
        <option value="Solar">Solar</option>
      </select>
      <textarea
        name="description"
        placeholder="Description"
        value={form.description}
        onChange={handleChange}
        required
        className="border p-2 rounded"
      />
      <input
        type="number"
        name="price"
        placeholder="Price"
        value={form.price}
        onChange={handleChange}
        required
        className="border p-2 rounded"
      />
      <input
        type="text"
        name="images"
        placeholder="Image URLs (comma separated)"
        value={form.images}
        onChange={handleChange}
        className="border p-2 rounded"
      />
      <input
        type="text"
        name="salient_features"
        placeholder="Salient Features (comma separated)"
        value={form.salient_features}
        onChange={handleChange}
        className="border p-2 rounded"
      />
      <input
        type="text"
        name="features"
        placeholder="Features (comma separated)"
        value={form.features}
        onChange={handleChange}
        className="border p-2 rounded"
      />
      <input
        type="text"
        name="specifications"
        placeholder="Specifications (comma separated)"
        value={form.specifications}
        onChange={handleChange}
        className="border p-2 rounded"
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-primary text-white px-4 py-2 rounded hover:bg-dark duration-300"
      >
        {loading ? "Adding..." : "Add Product"}
      </button>
      {message && <p className="text-center mt-2">{message}</p>}
    </form>
  );
};

export default ProductForm; 