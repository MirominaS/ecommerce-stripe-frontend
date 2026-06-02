import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContex";
import { deleteProduct, getAdminProducts } from "../../services/adminService";
import "./AdminProducts.css";

const AdminProducts = () => {
  const { token } = useAuth();

  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    try {
      const data = await getAdminProducts(token);

      setProducts(data.products);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Delete this product?");

    if (!confirmDelete) return;

    try {
      await deleteProduct(id, token);

      alert("Product deleted");

      fetchProducts();
    } catch (error) {
      console.log(error);

      alert("Delete failed");
    }
  };

  return (
    <div className="admin-products">
      <div className="admin-products-header">
        <div>
          <h1>Products</h1>

          <p>Manage all store products</p>
        </div>

        <Link to="/admin/products/create" className="add-product-btn">
          Add Product
        </Link>
      </div>

      <div className="products-table-wrapper">
        <table className="products-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Title</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td>
                  <img
                    src={product.image}
                    alt={product.title}
                    className="product-image"
                  />
                </td>

                <td className="product-title">{product.title}</td>

                <td className="product-price">${product.price}</td>

                <td>
                  <span
                    className={`stock-badge ${
                      product.stock > 0 ? "in-stock" : "out-stock"
                    }`}
                  >
                    {product.stock}
                  </span>
                </td>

                <td>
                  <div className="action-buttons">
                    <Link
                      to={`/admin/products/edit/${product._id}`}
                      className="edit-btn"
                    >
                      Edit
                    </Link>

                    <button
                      onClick={() => handleDelete(product._id)}
                      className="delete-btn"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminProducts;
