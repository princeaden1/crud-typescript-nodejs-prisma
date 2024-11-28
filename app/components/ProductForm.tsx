"use client"; // This enables the component to run on the client side in the app directory

import { useState, useEffect } from "react";
import axios from "axios";

interface Product {
  id?: number;
  name: string;
  price: number;
  description: string;
}

interface ProductFormProps {
  productToEdit?: Product;
  onProductSaved: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({
  productToEdit,
  onProductSaved,
}) => {
  const [product, setProduct] = useState<Product>({
    name: "",
    price: 0,
    description: "",
  });

  useEffect(() => {
    if (productToEdit) {
      setProduct(productToEdit);
    }
  }, [productToEdit]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProduct({
      ...product,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (productToEdit) {
      // Update existing product
      await axios.put("/api/products", product);
    } else {
      // Add new product
      await axios.post("/api/products", product);
    }

    setProduct({ name: "", price: 0, description: "" }); // Reset form after submission
    onProductSaved(); // Notify parent to refresh product list
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto p-4 border rounded-md"
    >
      <h2 className="text-xl font-bold mb-4">
        {productToEdit ? "Edit Product" : "Add Product"}
      </h2>
      <div className="mb-4">
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={product.name}
          onChange={handleInputChange}
          required
          className="w-full border border-gray-300 px-3 py-2 rounded-md"
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="price"
          className="block text-sm font-medium text-gray-700"
        >
          Price
        </label>
        <input
          type="number"
          id="price"
          name="price"
          value={product.price}
          onChange={handleInputChange}
          required
          step="0.01"
          className="w-full border border-gray-300 px-3 py-2 rounded-md"
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700"
        >
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={product.description}
          onChange={handleInputChange}
          required
          className="w-full border border-gray-300 px-3 py-2 rounded-md"
        />
      </div>
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
      >
        {productToEdit ? "Update Product" : "Add Product"}
      </button>
    </form>
  );
};

export default ProductForm;
