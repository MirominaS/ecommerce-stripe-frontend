import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getVariantById, updateVariant } from "../../services/productVariant";
import { useAuth } from "../../context/AuthContex";
import { showSuccess, showError } from "../../utils/toast";
import MediaPicker from "../../components/MediaPicker/MediaPicker";
import "./EditProductVariant.css";
import { MdDelete } from "react-icons/md";

const EditProductVariant = () => {
  const { token } = useAuth();

  const { productId, variantId } = useParams();

  const navigate = useNavigate();

  const [showMediaPicker, setShowMediaPicker] = useState(false);

  const [selectedImage, setSelectedImage] = useState(null);

  const [attributeName, setAttributeName] = useState("");

  const [attributeValue, setAttributeValue] = useState("");

  const [attributes, setAttributes] = useState({});

  const [formData, setFormData] = useState({
    sku: "",
    sellingPrice: "",
    image: "",
  });

  useEffect(() => {
    loadVariant();
  }, []);

  const loadVariant = async () => {
    try {
      const data = await getVariantById(variantId);

      const variant = data.variant;

      setFormData({
        sku: variant.sku,
        sellingPrice: variant.sellingPrice,
        image: variant.image?.[0]?._id || "",
      });

      setAttributes(variant.attributes || {});

      if (variant.imageUrls?.length > 0) {
        setSelectedImage({
          previewUrl: variant.imageUrls[0],
        });
      }
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

  const handleAddAttribute = () => {
    if (!attributeName.trim() || !attributeValue.trim()) {
      return;
    }

    if (attributes[attributeName]) {
      showError("Attribute already exists");
      return;
    }

    setAttributes((prev) => ({
      ...prev,
      [attributeName]: attributeValue,
    }));

    setAttributeName("");
    setAttributeValue("");
  };

  const handleRemoveAttribute = (key) => {
    const copy = {
      ...attributes,
    };

    delete copy[key];

    setAttributes(copy);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await updateVariant(
        variantId,
        {
          sku: formData.sku,
          sellingPrice: Number(formData.sellingPrice),
          attributes,
          image: formData.image ? [formData.image] : [],
        },
        token,
      );

      showSuccess("Variant updated");

      navigate(`/admin/products/${productId}/variants`);
    } catch (error) {
      console.log(error);

      showError(error.response?.data?.message || "Update failed");
    }
  };

  return (
    <div className="create-variant-page">
      <div className="create-variant-card">
        <h1>Edit Variant</h1>

        <form onSubmit={handleSubmit} className="variant-form">
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
                  <input value={key} disabled className="attribute-key" />

                  <input
                    value={value}
                    onChange={(e) =>
                      setAttributes((prev) => ({
                        ...prev,
                        [key]: e.target.value,
                      }))
                    }
                    className="attribute-value"
                  />

                  <button
                    type="button"
                    onClick={() => handleRemoveAttribute(key)}
                  >
                    <MdDelete />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Variant Image</label>

            <button type="button" onClick={() => setShowMediaPicker(true)}>
              Select Image
            </button>
          </div>

          {selectedImage && (
            <div className="image-preview">
              <img src={selectedImage.previewUrl} alt="" />
            </div>
          )}

          <button type="submit" className="add-variant-btn">
            Update Variant
          </button>
        </form>
      </div>

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
    </div>
  );
};

export default EditProductVariant;
