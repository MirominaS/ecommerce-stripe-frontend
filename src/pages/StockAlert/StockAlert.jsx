import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getLowStockProducts } from "../../services/productService";
import { showError } from "../../utils/toast";
import "./StockAlert.css";

const StockAlert = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const data = await getLowStockProducts();

      setProducts(data.products);
    } catch (error) {
      showError(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="low-stock-page">
        <h1>Low Stock Products</h1>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="low-stock-page">
      <div className="page-header">
        <h1>Low Stock Products</h1>

        <div className="count">Total: {products.length}</div>
        <Link className="create-button" to={"/admin/create-stock-adjustment"}>
          Create Stock Adjustment
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="empty-state">No low stock products found.</div>
      ) : (
        <table className="low-stock-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Product</th>
              <th>Category</th>
              <th>Current Stock</th>
              <th>Minimum Stock</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td>
                  {product.lowStockVariants?.[0]?.imageUrls?.[0] ||
                  product.imageUrl ? (
                    <img
                      src={
                        product.lowStockVariants?.[0]?.imageUrls?.[0] ||
                        product.imageUrl
                      }
                      alt={product.title}
                      className="product-image"
                    />
                  ) : (
                    <div className="no-image">No Image</div>
                  )}
                </td>

                <td>
                  <div>{product.title}</div>

                  {product.lowStockVariants?.length > 0 && (
                    <div className="variant-warning">
                      {product.lowStockVariants.map((variant) => (
                        <div key={variant._id}>
                          ⚠️ {variant.sku || variant.title || "Variant"}
                          {" - "}
                          {variant.stock} left
                        </div>
                      ))}
                    </div>
                  )}
                </td>

                <td>{product.category}</td>

                <td>{product.stock}</td>

                <td>{product.minimumStockLevel}</td>

                <td>
                  {product.stock === 0 ? (
                    <span className="status out-of-stock">Out of Stock</span>
                  ) : (
                    <span className="status low-stock">Low Stock</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default StockAlert;
