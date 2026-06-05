import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContex";
import { updateProduct } from "../../services/adminService";
import { getProductById } from "../../services/productService";
import "./EditProduct.css";
import { showError, showSuccess } from "../../utils/toast";

const EditProduct = () => {
  const { id } = useParams();

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

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductById(id);

        setFormData(data.product);
      } catch (error) {
        console.log(error);
      }
    };

    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await updateProduct(id, formData, token);

      showSuccess("Product updated")

      navigate("/admin/products");
    } catch (error) {
      console.log(error);

      showError("Update failed")
    }
  };

  return (
    <div className="edit-product-page">
      <div className="edit-product-card">
        <div className="edit-product-header">
          <h1>Edit Product</h1>

          <p>Update your product information</p>
        </div>

        <form onSubmit={handleSubmit} className="edit-product-form">
          <div className="form-group">
            <label>Product Title</label>

            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter product title"
            />
          </div>

          <div className="form-group">
            <label>SKU</label>

            <input
              type="text"
              name="sku"
              value={formData.sku}
              onChange={handleChange}
              placeholder="Enter SKU"
            />
          </div>

          <div className="form-group">
            <label>Description</label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter product description"
              rows="5"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Price</label>

              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="Enter price"
              />
            </div>

            <div className="form-group">
              <label>Stock</label>

              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                placeholder="Enter stock"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Image URL</label>

            <input
              type="text"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="Enter image URL"
            />
          </div>

          <div className="form-group">
            <label>Category</label>

            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="Enter category"
            />
          </div>

          {formData.image && (
            <div className="image-preview">
              <img src={formData.image} alt={formData.title} />
            </div>
          )}

          <button type="submit" className="update-product-btn">
            Update Product
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;
