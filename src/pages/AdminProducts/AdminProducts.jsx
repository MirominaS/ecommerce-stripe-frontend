import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContex";
import { deleteProduct, getAdminProducts } from "../../services/adminService";
import { importProducts } from "../../services/productService";
import "./AdminProducts.css";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { FaPlus } from "react-icons/fa6";
import { LuImport } from "react-icons/lu";
import Papa from "papaparse";
import AlertModal from "../../components/AlertModal/AlertModal";
import { FaAngleDoubleRight } from "react-icons/fa";
import { FaAngleDoubleLeft } from "react-icons/fa";
import { getMediaAccessUrl } from "../../services/mediaService";

const AdminProducts = () => {
  const { token } = useAuth();

  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isImporting, setIsImporting] = useState(false);
  const [alertModal, setAlertModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "success",
    showCancel: false,
    onConfirm: null,
  });

  const fetchProducts = async () => {
    try {
      const data = await getAdminProducts(token, page);

      const productsWithUrls = await Promise.all(
        data.products.map(async (product) => {
          try {
            if (!product.image?._id) {
              return product;
            }

            const urlData = await getMediaAccessUrl(product.image._id, token);

            return {
              ...product,
              imageUrl: urlData.url,
            };
          } catch (error) {
            console.log(error);
            return product;
          }
        }),
      );

      setProducts(productsWithUrls);

      setTotalPages(data.pagination.totalPages);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page]);

  const handleDelete = async (id) => {
    setAlertModal({
      isOpen: true,
      title: "Delete Product",
      message: "Are you sure you want to delete this product?",
      type: "warning",
      showCancel: true,

      onConfirm: async () => {
        try {
          await deleteProduct(id, token);

          fetchProducts();

          setAlertModal({
            isOpen: true,
            title: "Success",
            message: "Product deleted successfully",
            type: "success",
            showCancel: false,
          });
        } catch (error) {
          setAlertModal({
            isOpen: true,
            title: "Error",
            message: "Failed to delete product",
            type: "error",
            showCancel: false,
          });
        }
      },
    });
  };

  const handleImportCSV = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setIsImporting(true);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,

      complete: async (results) => {
        try {
          const data = await importProducts(results.data, token);

          setAlertModal({
            isOpen: true,
            title: "Import Complete",
            type: "success",
            message: `Created: ${data.created} Updated: ${data.updated} Skipped: ${data.skipped} `,
          });

          fetchProducts();
        } catch (error) {
          console.log(error);
          setAlertModal({
            isOpen: true,
            title: "Import Failed",
            type: "error",
            message: error.message,
          });
        } finally {
          setIsImporting(false);
          e.target.value = "";
        }
      },
    });
  };

  return (
    <div className="admin-products">
      <div className="admin-products-header">
        <div>
          <h1>Products</h1>

          <p>Manage all store products</p>
        </div>
        <input
          id="csvInput"
          type="file"
          accept=".csv"
          hidden
          onChange={handleImportCSV}
        />

        <div className="header-actions">
          <button
            className="import-btn"
            disabled={isImporting}
            onClick={() => document.getElementById("csvInput").click()}
          >
            <LuImport />
            {isImporting ? "Importing..." : "Import CSV"}
          </button>

          <Link
            to={isImporting ? "#" : "/admin/products/create"}
            className="add-product-btn"
          >
            <FaPlus />
            Add Product
          </Link>
        </div>
      </div>

      <div className="products-table-wrapper">
        <table className="products-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Title</th>
              <th>SKU</th>
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
                    src={product.imageUrl}
                    alt={product.title}
                    className="product-image"
                  />
                </td>

                <td className="product-title">{product.title}</td>
                <td className="product-sku">{product.sku}</td>
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
                      className="edit-prdct-btn"
                    >
                      <FaEdit />
                    </Link>

                    <button
                      onClick={() => handleDelete(product._id)}
                      className="delete-prdct-btn"
                    >
                      <MdDelete />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="admin-users-pagination">
          <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
            <FaAngleDoubleLeft />
          </button>

          <span>
            Page {page} of {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            <FaAngleDoubleRight />
          </button>
        </div>
      </div>
      {isImporting && (
        <div className="import-overlay">
          <div className="import-loader">
            <div className="spinner"></div>
            <p>Importing products...</p>
            <small>Please wait. Do not refresh the page.</small>
          </div>
        </div>
      )}
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

export default AdminProducts;
