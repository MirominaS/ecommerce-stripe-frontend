import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  createVariant,
  getVariantsByProduct,
} from "../../services/productVariant";
import { useAuth } from "../../context/AuthContex";
import { showSuccess, showError } from "../../utils/toast";
import { getProductById } from "../../services/productService";
import MediaPicker from "../../components/MediaPicker/MediaPicker";
import UploadImage from "../../components/UploadImage/UploadImage";

import "./CreateVariant.css";

const CreateVariant = () => {
  const { token } = useAuth();

  const { productId } = useParams();

  const navigate = useNavigate();

  const [variants, setVariants] = useState([]);
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [attributeName, setAttributeName] = useState("");
  const [attributeValue, setAttributeValue] = useState("");
  const [attributes, setAttributes] = useState({});
  const [product, setProduct] = useState(null);
  const [showUploadPopup, setShowUploadPopup] = useState(false);
  const [showImagePopup, setShowImagePopup] = useState(false);
  const [formData, setFormData] = useState({
    sku: "",
    sellingPrice: "",
    stock: "",
    color: "",
    size: "",
    image: "",
  });

  useEffect(() => {
    loadProduct();
    loadVariants();
  }, []);

  const loadProduct = async () => {
    try {
      const response = await getProductById(productId);

      setProduct(response.product);
    } catch (error) {
      console.log(error);
    }
  };
  const loadVariants = async () => {
    try {
      const variants = await getVariantsByProduct(productId);

      setVariants(variants);
    } catch (error) {
      console.log(error);
    }
  };
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreateVariant = async (e) => {
    e.preventDefault();

    try {
      console.log("Sending attributes:", attributes);
      await createVariant(
        productId,
        {
          sku: formData.sku,
          sellingPrice: Number(formData.sellingPrice),

          attributes,

          image: formData.image ? [formData.image] : [],
        },
        token,
      );

      showSuccess("Variant created");

      setFormData({
        sku: "",
        sellingPrice: "",
        stock: "",
        color: "",
        size: "",
        image: "",
      });

      setSelectedImage(null);

      loadVariants();
    } catch (error) {
      console.log(error);

      showError(error?.response?.data?.message || "Failed to create variant");
    }
  };

  const handleAddAttribute = () => {
    if (!attributeName.trim() || !attributeValue.trim()) {
      return;
    }

    setAttributes((prev) => ({
      ...prev,
      [attributeName]: attributeValue,
    }));

    setAttributeName("");
    setAttributeValue("");
  };

  variants.forEach((v) => {
    console.log(v.sku, v.attributes);
  });

  return (
    <div className="create-variant-page">
      <div className="create-variant-card">
        <div className="variant-header">
          {product && (
            <div className="product-header">
              <div className="product-header-image">
                <img src={product.imageUrl} alt={product.title} />
              </div>

              <div>
                <h1>{product.title}</h1>

                <p>{product.category}</p>

                <p>{product.description}</p>
              </div>
            </div>
          )}
          <h1>Product Variants</h1>

          <p>Add multiple variants for this product</p>
        </div>

        <form onSubmit={handleCreateVariant} className="variant-form">
          <div className="form-group">
            <label>SKU</label>

            <input name="sku" value={formData.sku} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Selling Price</label>

            <input
              type="number"
              name="sellingPrice"
              value={formData.sellingPrice}
              onChange={handleChange}
            />
          </div>
          <div className="attribute-section">
            <h4>Attributes</h4>

            <div className="attribute-inputs">
              <input
                placeholder="Attribute Name"
                value={attributeName}
                onChange={(e) => setAttributeName(e.target.value)}
              />

              <input
                placeholder="Attribute Value"
                value={attributeValue}
                onChange={(e) => setAttributeValue(e.target.value)}
              />

              <button type="button" onClick={handleAddAttribute}>
                Add
              </button>
            </div>

            <div className="attribute-list">
              {Object.entries(attributes).map(([key, value]) => (
                <div key={key} className="attribute-item">
                  <strong>{key}</strong>: {value}
                </div>
              ))}
            </div>
          </div>
          <div className="form-group">
            <label>Variant Image</label>

            <button
              type="button"
              className="select-image-btn"
              onClick={() => setShowImagePopup(true)}
            >
              Select Image
            </button>
          </div>

          {selectedImage && (
            <div className="image-preview">
              <img src={selectedImage.previewUrl} alt="" />
            </div>
          )}

          <button type="submit" className="add-variant-btn">
            Add Variant
          </button>
        </form>

        <div className="variant-list">
          <h2>Existing Variants ({variants.length})</h2>

          <div className="variant-list-wrapper">
            <table className="variant-table">
              <thead>
                <tr>
                  <th>SKU</th>
                  <th>Price</th>
                  <th>Attributes</th>
                </tr>
              </thead>

              <tbody>
                {variants.map((variant) => (
                  <tr key={variant._id}>
                    <td>{variant.sku}</td>

                    <td>€ {variant.sellingPrice}</td>

                    <td>
                      <div className="variant-attributes">
                        {Object.entries(variant.attributes || {}).map(
                          ([key, value]) => (
                            <span key={key} className="variant-attribute-badge">
                              {key}: {value}
                            </span>
                          ),
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <button
          className="finish-btn"
          onClick={() => navigate(`/admin/products/${productId}/variants`)}
        >
          Finish
        </button>
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

export default CreateVariant;
