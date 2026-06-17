import React, { useEffect, useState } from "react";
import { getPurchases } from "../../services/purchaseSevice";
import { useAuth } from "../../context/AuthContex";
import { useNavigate } from "react-router-dom";
import "./AdminPurchase.css";

const AdminPurchase = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const data = await getPurchases(token);
        setPurchases(data.purchases);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchPurchases();
    }
  }, [token]);

  if (loading) return <p className="loading">Loading...</p>;

  return (
    <div className="purchase-page">
      <div className="purchase-header">
        <h2>Purchases</h2>

        <button onClick={() => navigate("/admin/add-purchase")}>
          Add Purchase
        </button>
      </div>

      {purchases.length === 0 ? (
        <div className="no-purchases">No purchases found.</div>
      ) : (
        <div className="purchase-table-wrapper">
          <table className="purchase-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Product</th>
                <th>SKU</th>
                <th>Variant</th>
                <th>Quantity</th>
                <th>Purchase Price</th>
                <th>Note</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>
              {purchases.map((purchase) => (
                <tr key={purchase._id}>
                  <td>
                    {purchase.variantImageUrls?.[0] ||
                    purchase.productImageUrl ? (
                      <img
                        src={
                          purchase.variantImageUrls?.[0] ||
                          purchase.productImageUrl
                        }
                        alt={purchase.productId?.title}
                        className="purchase-image"
                      />
                    ) : (
                      "No Image"
                    )}
                  </td>
                  <td>{purchase.productId?.title}</td>

                  <td>
                    {purchase.variantId?.sku || purchase.productId?.sku || "-"}
                  </td>

                  <td>{purchase.variantId?.name || "-"}</td>

                  <td>{purchase.quantity}</td>

                  <td>€.{purchase.purchasePrice}</td>

                  <td>{purchase.note}</td>

                  <td>{new Date(purchase.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
export default AdminPurchase;
