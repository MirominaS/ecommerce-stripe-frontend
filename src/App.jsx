import { BrowserRouter, Route, Routes } from "react-router-dom";
// import './App.css'
import Home from "./pages/Home/Home";
import ProductDetails from "./pages/ProductDetails/ProductDetails";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Cart from "./pages/Cart/Cart";
import Checkout from "./pages/Checkout/Checkout";
import Success from "./pages/Success/Success";
import Order from "./pages/Order/Order";
import AdminRoute from "./routes/AdminRoute";
import AdminLayout from "./layouts/AdminLayout/AdminLayout";
import Dashboard from "./pages/Dashboard/Dashboard";
import Analytics from "./pages/Analytics/Analytics";
import AdminProducts from "./pages/AdminProducts/AdminProducts";
import EditProduct from "./pages/EditProduct/EditProduct";
import CreateProduct from "./pages/CreateProduct/CreateProduct";
import AdminOrders from "./pages/AdminOrders/AdminOrders";
import Payments from "./pages/Payments/Payments";
import AdminUsers from "./pages/AdminUsers/AdminUsers";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/checkout/:productId" element={<Checkout />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword/>}/>
        <Route path="/success" element={<Success />} />
        <Route path="/order" element={<Order />} />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="analytics" element={<Analytics/>}/>
          <Route path="products" element={<AdminProducts/>}/>
          <Route path="products/create" element={<CreateProduct/>}/>
          <Route path="products/edit/:id" element={<EditProduct/>}/>
          <Route path="orders" element={<AdminOrders/>}/>
          <Route path="payments" element={<Payments/>}/>
          <Route path="users" element={<AdminUsers/>}/>

        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
