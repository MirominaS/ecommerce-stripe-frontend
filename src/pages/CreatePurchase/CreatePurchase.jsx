import "./CreatePurchase.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContex";
import { getProducts } from "../../services/productService";
import { getVariantsByProduct } from "../../services/productVariant";
import { createPurchase } from "../../services/purchaseSevice";
import { showSuccess, showError } from "../../utils/toast";
import Select from "react-select";

const CreatePurchase = () => {
  const navigate = useNavigate();
  const { token } = useAuth();

  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [variants, setVariants] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formData, setFormData] = useState({
    productId: "",
    variantId: "",
    quantity: "",
    purchasePrice: "",
    note: "",
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await getProducts();
      console.log(data);
      setProducts(data.products);
    } catch (error) {
      showError("Failed to load products");
    }
  };

  const handleProductChange = async (e) => {
    const productId = e.target.value;

    const product = products.find((p) => p._id === productId);

    setSelectedProduct(product);

    setFormData((prev) => ({
      ...prev,
      productId,
      variantId: "",
    }));

    setVariants([]);

    if (product?.hasVariants) {
      try {
        const data = await getVariantsByProduct(productId);
        console.log("Variants response:", data);

        setVariants(data);
      } catch (error) {
        showError("Failed to load variants");
      }
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const payload = {
        productId: formData.productId,
        quantity: Number(formData.quantity),
        purchasePrice: Number(formData.purchasePrice),
        note: formData.note,
      };

      if (selectedProduct?.hasVariants) {
        payload.variantId = formData.variantId;
      }

      console.log(payload);
      await createPurchase(payload, token);

      showSuccess("Purchase created successfully");

      navigate("/admin/purchase");
    } catch (error) {
      console.log(error.response?.data);

      showError(error.response?.data?.message || "Failed to create purchase");
    } finally {
      setLoading(false);
    }
  };

  const productOptions = products.map((product) => ({
    value: product._id,
    label: `${product.title} (${product.sku || "Variant Product"})`,
    product,
  }));

  const variantOptions = variants.map((variant) => ({
    value: variant._id,
    label: Object.values(variant.attributes || {}).join(" / ") || variant.sku,
  }));

  if (loading) return <p className="loading">Loading...</p>;

  return (
    <div className="create-purchase">
      <h1>Add Purchase</h1>

      <form onSubmit={handleSubmit}>
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
            onChange={async (selected) => {
              const productId = selected?.value || "";

              const product = selected?.product;

              setSelectedProduct(product);

              setFormData((prev) => ({
                ...prev,
                productId,
                variantId: "",
              }));

              setVariants([]);

              if (product?.hasVariants) {
                try {
                  const data = await getVariantsByProduct(productId);

                  setVariants(data);
                } catch (error) {
                  showError("Failed to load variants");
                }
              }
            }}
          />
        </div>

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
                  variantId: selected?.value || "",
                }))
              }
            />
          </div>
        )}

        <div>
          <label>Quantity</label>

          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            min="1"
            required
          />
        </div>

        <div>
          <label>Purchase Price</label>

          <input
            type="number"
            name="purchasePrice"
            value={formData.purchasePrice}
            onChange={handleChange}
            min="0"
            required
          />
        </div>

        <div>
          <label>Note</label>

          <textarea
            name="note"
            value={formData.note}
            onChange={handleChange}
            rows="4"
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Create Purchase"}
        </button>
      </form>
    </div>
  );
};

export default CreatePurchase;
