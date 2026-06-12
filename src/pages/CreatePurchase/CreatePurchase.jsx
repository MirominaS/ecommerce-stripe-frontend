import "./CreatePurchase.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContex";

import { getProducts } from "../../services/productService";
import { getVariantsByProduct } from "../../services/productVariant";
import { createPurchase } from "../../services/purchaseSevice";

import { showSuccess, showError } from "../../utils/toast";

const CreatePurchase = () => {
  const navigate = useNavigate();
  const { token } = useAuth();

  const [loading, setLoading] = useState(false);

  const [products, setProducts] = useState([]);
  const [variants, setVariants] = useState([]);

  const [selectedProduct, setSelectedProduct] =
    useState(null);

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

      setProducts(data.products);
    } catch (error) {
      showError("Failed to load products");
    }
  };

  const handleProductChange = async (e) => {
    const productId = e.target.value;

    const product = products.find(
      (p) => p._id === productId,
    );

    setSelectedProduct(product);

    setFormData((prev) => ({
      ...prev,
      productId,
      variantId: "",
    }));

    setVariants([]);

    if (product?.hasVariants) {
      try {
        const data =
          await getVariantsByProduct(
            productId,
          );

        setVariants(data.variants);
      } catch (error) {
        showError(
          "Failed to load variants",
        );
      }
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]:
        e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const payload = {
        productId:
          formData.productId,
        quantity: Number(
          formData.quantity,
        ),
        purchasePrice: Number(
          formData.purchasePrice,
        ),
        note: formData.note,
      };

      if (
        selectedProduct?.hasVariants
      ) {
        payload.variantId =
          formData.variantId;
      }

      await createPurchase(
        payload,
        token,
      );

      showSuccess(
        "Purchase created successfully",
      );

      navigate("/purchases");
    } catch (error) {
      showError(
        error.response?.data
          ?.message ||
          "Failed to create purchase",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-purchase">
      <h1>Add Purchase</h1>

      <form
        onSubmit={handleSubmit}
      >
        <div>
          <label>Product</label>

          <select
            name="productId"
            value={
              formData.productId
            }
            onChange={
              handleProductChange
            }
            required
          >
            <option value="">
              Select Product
            </option>

            {products.map(
              (product) => (
                <option
                  key={
                    product._id
                  }
                  value={
                    product._id
                  }
                >
                  {
                    product.title
                  }
                </option>
              ),
            )}
          </select>
        </div>

        {selectedProduct?.hasVariants && (
          <div>
            <label>
              Variant
            </label>

            <select
              name="variantId"
              value={
                formData.variantId
              }
              onChange={
                handleChange
              }
              required
            >
              <option value="">
                Select Variant
              </option>

              {variants.map(
                (variant) => (
                  <option
                    key={
                      variant._id
                    }
                    value={
                      variant._id
                    }
                  >
                    {Object.values(
                      variant.attributes ||
                        {},
                    ).join(
                      " / ",
                    )}
                  </option>
                ),
              )}
            </select>
          </div>
        )}

        <div>
          <label>
            Quantity
          </label>

          <input
            type="number"
            name="quantity"
            value={
              formData.quantity
            }
            onChange={
              handleChange
            }
            min="1"
            required
          />
        </div>

        <div>
          <label>
            Purchase Price
          </label>

          <input
            type="number"
            name="purchasePrice"
            value={
              formData.purchasePrice
            }
            onChange={
              handleChange
            }
            min="0"
            step="0.01"
            required
          />
        </div>

        <div>
          <label>Note</label>

          <textarea
            name="note"
            value={
              formData.note
            }
            onChange={
              handleChange
            }
            rows="4"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
        >
          {loading
            ? "Saving..."
            : "Create Purchase"}
        </button>
      </form>
    </div>
  );
};

export default CreatePurchase;