import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import ResetPassword from "./pages/auth/ResetPassword";
import VerifyEmailPage from "./pages/auth/VerifyEmailPage";
import UserProfile from "./pages/UserProfile";
import CheckoutPage from "./pages/CheckoutPage";
import Page_Product_Detail from './pages/Page_Product_Detail'
import Page_Product_List from './pages/Page_Product_List'
import Order_History_List from './pages/Order_History_List'
import Order_History_Detail from './pages/Order_History_Detail'
import OrderConfirmationMessage from "./components/atoms/OrderConfirmationMessage";
import ShippingAddress from "./components/atoms/ShippingAddress";
import Cart from "./pages/Cart";
import Orderconfirm from "./pages/OrderconfirmPage";
import { ProductPage } from "./pages/ProductPage";


// import { useContext } from "react";
import { ValueContext } from "./context/ValueContext";
import { Toaster } from "sonner";
import { AdminProductManagement } from "./pages/AdminProductManagement";
import ScrollToTop from "../ScrollToTop";

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route index element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot" element={<ForgotPasswordPage />} />
        <Route path="/reset" element={<ResetPassword />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/userprofile" element={<UserProfile />} />
        <Route
          path="/OrderConfirmationMessage"
          element={<OrderConfirmationMessage />}
        />
        <Route path="/ShippingAddress" element={<ShippingAddress />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/order-confirm/:orderId" element={<Orderconfirm />} />
        <Route path="/products/add" element={<ProductPage />} />
        <Route path="/products/:id" element={<Page_Product_Detail />} />
        <Route path="/products" element={<Page_Product_List />} />
        <Route path="/orderhistory" element={<Order_History_List />} />
        <Route path="/orderhistory/:id" element={<Order_History_Detail />} />
        <Route path="/adminproductmanagement" element={<AdminProductManagement />} />
        <Route path="/pageproductdetail" element={<Page_Product_Detail />} />
        <Route path="/pageproductlist" element={<Page_Product_List />} />
        <Route path="/products/edit/:id" element={<ProductPage />} />
        

        {/* TODO: category pages, product detail, cart, etc. */}
      </Routes>
      <Toaster richColors position="top-center" expand={true} toastOptions={{
          style: {
            fontSize: '16px', 
          padding: '16px',
          fontFamily: 'Poppins',
          backgroundColor: 'var(--color-off-white)',
            //color: 'var(--color-charcoal)'
          },
        }}/>
    </BrowserRouter>
  );
}