import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContex";
import { createProduct } from "../../services/adminService";
import "./CreateProduct.css";

const CreateProduct = () => {
  const { token } = useAuth();

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    sku: "",
    title: "",
    description: "",
    price: "",
    image: "",
    category: "",
    stock: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createProduct(formData, token);

      alert("Product created");

      navigate("/admin/products");
    } catch (error) {
      console.log(error);

      alert("Create failed");
    }
  };

  return (
    <div className="create-product-page">
      <div className="create-product-card">
        <div className="create-product-header">
          <h1>Create Product</h1>

          <p>Add a new product to your store</p>
        </div>

        <form onSubmit={handleSubmit} className="create-product-form">
          <div className="form-group">
            <label>Product Title</label>

            <input
              type="text"
              name="title"
              placeholder="Enter product title"
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>SKU</label>

            <input
              type="text"
              name="sku"
              placeholder="Enter SKU (e.g. PRD-001)"
              value={formData.sku}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Description</label>

            <textarea
              name="description"
              placeholder="Enter product description"
              onChange={handleChange}
              rows="5"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Price</label>

              <input
                type="number"
                name="price"
                placeholder="Enter product price"
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Stock</label>

              <input
                type="number"
                name="stock"
                placeholder="Enter stock quantity"
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Image URL</label>

            <input
              type="text"
              name="image"
              placeholder="Enter image URL"
              onChange={handleChange}
            />
          </div>

          {formData.image && (
            <div className="image-preview">
              <img src={formData.image} alt="Preview" />
            </div>
          )}

          <div className="form-group">
            <label>Category</label>

            <input
              type="text"
              name="category"
              placeholder="Enter category"
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="create-product-btn">
            Create Product
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateProduct;
