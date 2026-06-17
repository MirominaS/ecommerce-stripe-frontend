import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getProductById } from "../../services/productService";
import { deleteVariant } from "../../services/productVariant";
import { useAuth } from "../../context/AuthContex";
import AlertModal from "../../components/AlertModal/AlertModal";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import "./ProductVariants.css";

const ProductVariants = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [product, setProduct] = useState(null);
  const [variants, setVariants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alertModal, setAlertModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "success",
    showCancel: false,
    onConfirm: null,
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductById(productId);

        setProduct(data.product);
        setVariants(data.product.variants || []);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  useEffect(() => {
    variants.forEach((v) => {
      console.log(v.sku, v.attributes);
    });
  }, [variants]);

  const handleDelete = (id) => {
    setAlertModal({
      isOpen: true,
      title: "Delete Variant",
      message: "Are you sure you want to delete this variant?",
      type: "warning",
      showCancel: true,

      onConfirm: async () => {
        try {
          await deleteVariant(id, token);

          setVariants((prev) => prev.filter((v) => v._id !== id));

          setAlertModal({
            isOpen: true,
            title: "Success",
            message: "Variant deleted successfully",
            type: "success",
            showCancel: false,
          });
        } catch (error) {
          console.log(error.response?.data);

          setAlertModal({
            isOpen: true,
            title: "Error",
            message:
              error.response?.data?.message || "Failed to delete variant",
            type: "error",
            showCancel: false,
          });
        }
      },
    });
  };
  if (loading) {
    return <h2>Loading...</h2>;
  }

  return (
    <div className="product-variants-page">
      <div className="product-variants-header">
        <h1>{product.title} Variants</h1>

        <button
          className="add-variant-btn"
          onClick={() => navigate(`/admin/products/${productId}/add-variants`)}
        >
          Add Variant
        </button>
      </div>

      <div className="variants-table-wrapper">
        <table className="variants-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>SKU</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Attributes</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {variants.map((variant) => (
              <tr key={variant._id}>
                <td>
                  {variant.imageUrls?.[0] && (
                    <img
                      src={variant.imageUrls[0]}
                      alt={variant.sku}
                      className="variant-image"
                    />
                  )}
                </td>

                <td>{variant.sku}</td>

                <td>€ {variant.sellingPrice}</td>

                <td>{variant.stock}</td>

                <td>
                  {Object.entries(variant.attributes || {}).map(
                    ([key, value]) => (
                      <span key={key} className="variant-attribute">
                        {key}: {value}
                      </span>
                    ),
                  )}
                </td>
                <td>
                  <div className="variant-actions">
                    <Link
                      to={`/admin/products/${productId}/variants/${variant._id}/edit`}
                      className="variant-edit-btn"
                    >
                      <FaEdit />
                    </Link>

                    <button
                      className="variant-delete-btn"
                      onClick={() => handleDelete(variant._id)}
                    >
                      <MdDelete />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Link to="/admin/products" className="back-products-link">
        ← Back to Products
      </Link>

      <AlertModal
        isOpen={alertModal.isOpen}
        title={alertModal.title}
        message={alertModal.message}
        type={alertModal.type}
        showCancel={alertModal.showCancel}
        onConfirm={alertModal.onConfirm}
        onClose={() =>
          setAlertModal((prev) => ({
            ...prev,
            isOpen: false,
          }))
        }
      />
    </div>
  );
};

export default ProductVariants;
