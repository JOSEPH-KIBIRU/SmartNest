import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ConvexProvider, ConvexReactClient } from 'convex/react';
import { Auth0Provider } from '@auth0/auth0-react';
import { CartProvider } from './contexts/CartContext';
import { AuthProvider } from './contexts/AuthContext';
import { FavoritesProvider } from './contexts/FavoritesContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CategoryPage from './pages/CategoryPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import OrdersPage from './pages/OrdersPage';
import SearchPage from './pages/SearchPage';
import LoginPage from './pages/LoginPage';
import FavoritesPage from './pages/FavoritesPage';
import DashboardPage from './pages/Admin/DashboardPage';
import ProductsManagePage from './pages/Admin/ProductsManagePage';
import OrdersManagePage from './pages/Admin/OrdersManagePage';
import InventoryPage from './pages/Admin/InventoryPage';
import CartDrawer from './components/cart/CartDrawer';
// import FloatingWhatsApp from './components/common/FloatingWhatsApp';

// Initialize Convex
const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL, {
  unsavedChangesWarning: false,
});


export default function App() {
  return (
    <Auth0Provider
      domain={import.meta.env.VITE_AUTH0_DOMAIN}
      clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
      authorizationParams={{
        redirect_uri: window.location.origin,
        scope: "openid profile email",
      }}
      useRefreshTokens={true}
      cacheLocation="localstorage"
      onRedirectCallback={(appState) => {
        window.history.replaceState(
          {},
          document.title,
          appState?.returnTo || window.location.pathname
        );
      }}
    >
      <ConvexProvider client={convex}>
        <AuthProvider>
          <FavoritesProvider>
            <CartProvider>
              <BrowserRouter>
                <div className="flex flex-col min-h-screen">
                  <Navbar />
                  <CartDrawer />
                  <main className="flex-grow">
                    <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/products" element={<ProductsPage />} />
                      <Route path="/product/:id" element={<ProductDetailPage />} />
                      <Route path="/category/:slug" element={<CategoryPage />} />
                      <Route path="/cart" element={<CartPage />} />
                      <Route path="/favorites" element={<FavoritesPage />} />
                      <Route path="/checkout" element={
                        <ProtectedRoute>
                          <CheckoutPage />
                        </ProtectedRoute>
                      } />
                      <Route path="/order-success" element={
                        <ProtectedRoute>
                          <OrderSuccessPage />
                        </ProtectedRoute>
                      } />
                      <Route path="/orders" element={
                        <ProtectedRoute>
                          <OrdersPage />
                        </ProtectedRoute>
                      } />
                      <Route path="/search" element={<SearchPage />} />
                      <Route path="/login" element={<LoginPage />} />
                      
                      {/* Admin Routes */}
                      <Route path="/admin" element={
                        <ProtectedRoute requireAdmin={true}>
                          <DashboardPage />
                        </ProtectedRoute>
                      } />
                      <Route path="/admin/products" element={
                        <ProtectedRoute requireAdmin={true}>
                          <ProductsManagePage />
                        </ProtectedRoute>
                      } />
                      <Route path="/admin/orders" element={
                        <ProtectedRoute requireAdmin={true}>
                          <OrdersManagePage />
                        </ProtectedRoute>
                      } />
                      <Route path="/admin/inventory" element={
                        <ProtectedRoute requireAdmin={true}>
                          <InventoryPage />
                        </ProtectedRoute>
                      } />
                    </Routes>
                  </main>
                  <Footer />
                  {/* <FloatingWhatsApp /> */}
                </div>
              </BrowserRouter>
            </CartProvider>
          </FavoritesProvider>
        </AuthProvider>
      </ConvexProvider>
    </Auth0Provider>
  );
}