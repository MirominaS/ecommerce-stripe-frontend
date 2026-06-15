import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContex";
import { createProduct } from "../../services/adminService";
import "./CreateProduct.css";
import { showError, showSuccess } from "../../utils/toast";
import MediaPicker from "../../components/MediaPicker/MediaPicker";
import UploadImage from "../../components/UploadImage/UploadImage";

const CreateProduct = () => {
  const { token } = useAuth();

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    sku: "",
    title: "",
    description: "",
    sellingPrice: "",
    image: "",
    category: "",
    minimumStockLevel: "",
  });
  const [showImagePopup, setShowImagePopup] = useState(false);
  const [showUploadPopup, setShowUploadPopup] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [hasVariants, setHasVariants] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let payload = {
        ...formData,
        hasVariants,
      };

      if (hasVariants) {
        delete payload.sku;
        delete payload.price;
        delete payload.stock;
        delete payload.sellingPrice;
      }

      console.log(payload);

      const response = await createProduct(payload, token);

      showSuccess("Product created");

      if (hasVariants) {
        navigate(`/admin/products/${response.product._id}/add-variants`);
      } else {
        navigate("/admin/products");
      }
    } catch (error) {
      console.log(error);
      showError(error.response?.data?.message || "Create failed");
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
            <label>Description</label>

            <textarea
              name="description"
              placeholder="Enter product description"
              onChange={handleChange}
              rows="5"
            />
          </div>

          <div className="form-group">
            <label>Minimum Stock level</label>

            <input
              name="minimumStockLevel"
              placeholder="Enter minimum stock level"
              onChange={handleChange}
              min={0}
            />
          </div>

          <div className="form-group product-image-section">
            <label>Product Image</label>

            <button
              type="button"
              className="image-select-btn"
              onClick={() => setShowImagePopup(true)}
            >
              Choose Image
            </button>
          </div>

          {selectedImage?.previewUrl && (
            <div className="image-preview">
              <img src={selectedImage.previewUrl} alt="Selected Product" />
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
          <div className="form-group">
            <label>Does this product have variants?</label>

            <div className="radio-group">
              <label>
                <input
                  type="radio"
                  checked={!hasVariants}
                  onChange={() => setHasVariants(false)}
                />
                No
              </label>

              <label>
                <input
                  type="radio"
                  checked={hasVariants}
                  onChange={() => setHasVariants(true)}
                />
                Yes
              </label>
            </div>
          </div>

          {hasVariants && (
            <div className="variant-info-box">
              <h4>Variant Product</h4>
              <p>
                Create the product first. After saving, you will be redirected
                to the Variant Management page where you can add multiple
                variants such as different colors, sizes, prices, stock
                quantities and images.
              </p>
            </div>
          )}

          <div className="has-not-variant">
            {!hasVariants && (
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
            )}

            {!hasVariants && (
              <div className="form-row">
                <div className="form-group">
                  <label>Price</label>

                  <input
                    type="number"
                    name="sellingPrice"
                    placeholder="Enter product price"
                    onChange={handleChange}
                  />
                </div>
              </div>
            )}
          </div>

          <button type="submit" className="create-product-btn">
            Create Product
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
        }}
      />
    </div>
  );
};

export default CreateProduct;
