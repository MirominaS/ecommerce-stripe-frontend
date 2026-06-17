import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProducts } from "../../services/productService";
import { getVariantsByProduct } from "../../services/productVariant";
import { createStockAdjustment } from "../../services/stockAdjustmentService";
import { showSuccess, showError } from "../../utils/toast";
import { useAuth } from "../../context/AuthContex";
import Select from "react-select";
import "./CreateStockAdjustment.css";

const CreateStockAdjustment = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [products, setProducts] = useState([]);
  const [variants, setVariants] = useState([]);

  const [selectedProduct, setSelectedProduct] = useState(null);

  const [formData, setFormData] = useState({
    productId: "",
    variantId: "",
    type: "increase",
    quantity: "",
    reason: "",
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await getProducts();

      setProducts(data.products);
    } catch (error) {
      showError(error.message);
    }
  };

  const handleProductChange = async (productId) => {
    try {
      setFormData((prev) => ({
        ...prev,
        productId,
        variantId: "",
      }));

      const product = products.find((p) => p._id === productId);

      setSelectedProduct(product);

      if (product?.hasVariants) {
        const data = await getVariantsByProduct(productId);

        setVariants(data);
      } else {
        setVariants([]);
      }
    } catch (error) {
      showError(error.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        ...formData,
        quantity: Number(formData.quantity),
        variantId: formData.variantId || null,
      };

      const data = await createStockAdjustment(payload, token);

      if (data.isLowStock) {
        showSuccess("Stock adjusted. Product is below minimum stock level.");
      } else {
        showSuccess("Stock adjusted successfully.");
      }

      navigate("/admin/stock-adjustment");
    } catch (error) {
      showError(error.response?.data?.message || error.message);
    }
  };

  const productOptions = products.map((product) => ({
    value: product._id,
    label: product.title,
  }));

  const variantOptions = variants.map((variant) => ({
    value: variant._id,
    label: variant.sku,
  }));

  return (
    <div className="create-stock-adjustment">
      <h1>Stock Adjustment</h1>

      <form onSubmit={handleSubmit}>
        {/* Product */}
        <div>
          <label>Product</label>

          <Select
            options={productOptions}
            placeholder="Search product..."
            value={
              productOptions.find(
                (option) => option.value === formData.productId,
              ) || null
            }
            onChange={(selected) =>
              handleProductChange(selected ? selected.value : "")
            }
            isClearable
          />
        </div>

        {/* Variant */}
        {selectedProduct?.hasVariants && (
          <div>
            <label>Variant</label>

            <Select
              options={variantOptions}
              placeholder="Search variant..."
              value={
                variantOptions.find(
                  (option) => option.value === formData.variantId,
                ) || null
              }
              onChange={(selected) =>
                setFormData((prev) => ({
                  ...prev,
                  variantId: selected ? selected.value : "",
                }))
              }
              isClearable
            />
          </div>
        )}
        {/* Type */}
        <div>
          <label>Adjustment Type</label>

          <select name="type" value={formData.type} onChange={handleChange}>
            <option value="increase">Increase</option>

            <option value="decrease">Decrease</option>
          </select>
        </div>

        {/* Quantity */}
        <div>
          <label>Quantity</label>

          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            min={1}
            required
          />
        </div>

        {/* Reason */}
        <div>
          <label>Reason</label>

          <textarea
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            rows={4}
          />
        </div>

        <button type="submit">Save Adjustment</button>
      </form>
    </div>
  );
};

export default CreateStockAdjustment;
