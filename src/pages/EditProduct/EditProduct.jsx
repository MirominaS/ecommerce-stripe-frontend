import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContex";
import { updateProduct } from "../../services/adminService";
import { getProductById } from "../../services/productService";
import "./EditProduct.css";
import { showError, showSuccess } from "../../utils/toast";
import MediaPicker from "../../components/MediaPicker/MediaPicker";
import UploadImage from "../../components/UploadImage/UploadImage";

const EditProduct = () => {
  const { id } = useParams();

  const { token } = useAuth();

  const navigate = useNavigate();

  const [showImagePopup, setShowImagePopup] = useState(false);
  const [showUploadPopup, setShowUploadPopup] = useState(false);
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [formData, setFormData] = useState({
    sku: "",
    title: "",
    description: "",
    sellingPrice: "",
    image: "",
    category: "",
    hasVariants: false,
    minimumStockLevel:"",
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductById(id);

        setFormData({
          ...data.product,
          sellingPrice: data.product.sellingPrice || "",
        });

        if (data.product.imageUrl) {
          setSelectedImage({
            previewUrl: data.product.imageUrl,
          });
        }
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
      const payload = {
        title: formData.title,
        description: formData.description,
        minimumStockLevel: formData.minimumStockLevel,
        category: formData.category,
        image: formData.image,
      };

      if (!formData.hasVariants) {
        payload.sku = formData.sku;
        payload.sellingPrice = Number(formData.sellingPrice);
      }

      await updateProduct(id, payload, token);

      showSuccess("Product updated");

      navigate("/admin/products");
    } catch (error) {
      console.log(error);

      showError("Update failed");
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

          {!formData.hasVariants && (
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
          )}

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

           <div className="form-group">
            <label>Minimum Stock level</label>

            <input
              name="minimumStockLevel"
              value={formData.minimumStockLevel}
              placeholder="Enter minimum stock level"
              onChange={handleChange}
              min={0}
            />
          </div>


          {!formData.hasVariants && (
            <div className="form-group">
              <label>Selling Price</label>

              <input
                type="number"
                name="sellingPrice"
                value={formData.sellingPrice}
                onChange={handleChange}
                placeholder="Enter price"
              />
            </div>
          )}

          <div className="form-group product-image-section">
            <label>Product Image</label>

            <button
              type="button"
              className="image-select-btn"
              onClick={() => setShowImagePopup(true)}
            >
              Change Image
            </button>
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

          {formData.hasVariants && (
            <div className="variant-info-box">
              <h4>This product uses variants</h4>

              <p>Prices, stock and SKU are managed through variants.</p>

              <button
                type="button"
                className="manage-variants-btn"
                onClick={() => navigate(`/admin/products/${id}/variants`)}
              >
                Manage Variants
              </button>
            </div>
          )}

          {selectedImage?.previewUrl && (
            <div className="image-preview">
              <img src={selectedImage.previewUrl} alt={formData.title} />
            </div>
          )}

          <button type="submit" className="update-product-btn">
            Update Product
          </button>
        </form>
      </div>

      {showImagePopup && (
        <div className="image-modal">
          <div className="modal-content">
            <button
              type="button"
              className="modal-close"
              onClick={() => setShowImagePopup(false)}
            >
              ✕
            </button>

            <h3>Select Image</h3>

            <button
              type="button"
              onClick={() => {
                setShowImagePopup(false);
                setShowUploadPopup(true);
              }}
            >
              Upload New Image
            </button>

            <button
              type="button"
              onClick={() => {
                setShowImagePopup(false);
                setShowMediaPicker(true);
              }}
            >
              Select From Media Library
            </button>
          </div>
        </div>
      )}

      <MediaPicker
        isOpen={showMediaPicker}
        onClose={() => setShowMediaPicker(false)}
        onSelect={(image) => {
          setSelectedImage(image);

          setFormData((prev) => ({
            ...prev,
            image: image._id,
          }));

          setShowMediaPicker(false);
        }}
      />

      <UploadImage
        isOpen={showUploadPopup}
        onClose={() => setShowUploadPopup(false)}
        onUploadSuccess={(image) => {
          setSelectedImage(image);

          setFormData((prev) => ({
            ...prev,
            image: image._id,
          }));

          setShowUploadPopup(false);
        }}
      />
    </div>
  );
};

export default EditProduct;
