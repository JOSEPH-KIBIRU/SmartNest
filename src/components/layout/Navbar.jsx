import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  Menu,
  X,
  Search,
  User,
  Store,
  LogIn,
  LogOut,
  LayoutDashboard,
} from "lucide-react";
import { useCart } from "../../contexts/CartContext";
import { useAuth } from "../../contexts/AuthContext";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [q, setQ] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const { totalItems, setIsOpen } = useCart();
  const { isAuthenticated, login, logout, user, isAdmin, isLoading } =
    useAuth();
  const navigate = useNavigate();

  // Detect scroll to change navbar style
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const onSearch = (e) => {
    e.preventDefault();
    if (q.trim()) {
      navigate(`/search?q=${encodeURIComponent(q)}`);
      setQ("");
      setMenuOpen(false);
    }
  };

  const handleLoginClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log("Login button clicked - mobile or desktop");

    if (typeof login !== "function") {
      console.error("Auth error: Login function not available.");
      alert("Auth error: Login function not available.");
      return;
    }

    try {
      // Close mobile menu first
      setMenuOpen(false);
      
      // Small delay to ensure menu closes before redirect
      setTimeout(() => {
        login();
      }, 100);
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  const handleLogoutClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setMenuOpen(false);
    logout();
  };

  // Direct login for mobile - bypasses any potential event issues
  const handleMobileLogin = () => {
    console.log("Mobile login button clicked directly");
    setMenuOpen(false);
    // Small delay to ensure menu closes
    setTimeout(() => {
      if (typeof login === "function") {
        login();
      } else {
        console.error("Login function not available");
        alert("Unable to login. Please try again.");
      }
    }, 100);
  };

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-gradient-to-r from-gray-900 via-slate-800 to-gray-900 shadow-2xl backdrop-blur-lg bg-opacity-95"
          : "bg-gradient-to-r from-gray-800 via-slate-800 to-gray-800 shadow-lg"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-2 flex-shrink-0 group"
            onClick={() => setMenuOpen(false)}
          >
            <Store className="h-8 w-8 text-emerald-400 drop-shadow-lg" />
            <span className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              SmartNest
            </span>
          </Link>

          {/* Desktop Search */}
          <form
            onSubmit={onSearch}
            className="hidden md:flex flex-1 max-w-lg mx-8"
          >
            <div className="relative w-full group">
              <input
                type="text"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Tafuta bidhaa..."
                className="w-full pl-12 pr-4 py-2.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all duration-300"
              />
              <Search className="absolute left-4 top-3 h-5 w-5 text-white/60 group-hover:text-amber-400 transition-colors" />
            </div>
          </form>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {isAdmin && (
              <Link
                to="/admin"
                className="flex items-center text-sm font-medium text-amber-300 hover:text-amber-200 transition-colors px-3 py-2 rounded-full hover:bg-white/10"
              >
                <LayoutDashboard className="h-4 w-4 mr-1" />
                Admin
              </Link>
            )}

            {isLoading ? (
              <div className="text-sm text-white/80">
                <div className="animate-pulse">Inapakia...</div>
              </div>
            ) : isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link
                  to="/orders"
                  className="flex items-center text-white/90 hover:text-amber-300 transition-colors px-3 py-2 rounded-full hover:bg-white/10"
                >
                  <User className="h-5 w-5" />
                </Link>
                <button
                  onClick={handleLogoutClick}
                  className="flex items-center text-sm text-white/90 hover:text-red-300 transition-colors px-3 py-2 rounded-full hover:bg-white/10"
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  Toka
                </button>
              </div>
            ) : (
              <button
                onClick={handleLoginClick}
                type="button"
                className="flex items-center text-sm font-medium text-white bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-2 rounded-full hover:from-amber-600 hover:to-orange-600 transition-all duration-300 hover:scale-105 shadow-lg"
              >
                <LogIn className="h-4 w-4 mr-1" />
                Ingia
              </button>
            )}

            {/* Cart Button */}
            <button
              onClick={() => setIsOpen(true)}
              className="relative p-2 text-white hover:text-amber-300 transition-colors rounded-full hover:bg-white/10"
            >
              <ShoppingCart className="h-6 w-6" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-bounce">
                  {totalItems}
                </span>
              )}
            </button>
          </div>

          {/* Mobile buttons */}
          <div className="md:hidden flex items-center space-x-4">
            <button
              onClick={() => setIsOpen(true)}
              className="relative p-2 text-white hover:text-amber-300 transition-colors"
            >
              <ShoppingCart className="h-6 w-6" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 text-white hover:text-amber-300 transition-colors"
            >
              {menuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu - FIXED LOGIN BUTTON */}
      {menuOpen && (
        <div className="md:hidden bg-gradient-to-br from-gray-800 via-slate-800 to-gray-900 backdrop-blur-lg border-t border-white/20">
          <div className="px-4 pt-4 pb-6 space-y-4">
            <form onSubmit={onSearch} className="relative">
              <input
                type="text"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Tafuta bidhaa..."
                className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
              <Search className="absolute left-4 top-3.5 h-5 w-5 text-white/60" />
            </form>

            <div className="space-y-2">
              <Link
                to="/products"
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-3 text-white/90 hover:text-amber-300 hover:bg-white/10 rounded-xl transition-all"
              >
                Bidhaa Zote
              </Link>
              <Link
                to="/category/kitchen"
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-3 text-white/90 hover:text-amber-300 hover:bg-white/10 rounded-xl transition-all"
              >
                Jikoni
              </Link>
              <Link
                to="/category/electronics"
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-3 text-white/90 hover:text-amber-300 hover:bg-white/10 rounded-xl transition-all"
              >
                Elektroniki
              </Link>

              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setMenuOpen(false)}
                  className="block px-4 py-3 text-amber-300 hover:text-amber-200 hover:bg-white/10 rounded-xl transition-all font-medium flex items-center"
                >
                  <LayoutDashboard className="h-4 w-4 mr-2" />
                  Admin Dashboard
                </Link>
              )}

              {isAuthenticated ? (
                <>
                  <Link
                    to="/orders"
                    onClick={() => setMenuOpen(false)}
                    className="block px-4 py-3 text-white/90 hover:text-amber-300 hover:bg-white/10 rounded-xl transition-all"
                  >
                    Maagizo Yangu
                  </Link>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleLogoutClick();
                    }}
                    className="block w-full text-left px-4 py-3 text-red-300 hover:text-red-200 hover:bg-white/10 rounded-xl transition-all flex items-center"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Toka
                  </button>
                </>
              ) : (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log("Mobile login button clicked");
                    handleMobileLogin();
                  }}
                  className="block w-full text-left px-4 py-3 text-amber-300 hover:text-amber-200 hover:bg-white/10 rounded-xl transition-all font-medium flex items-center"
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  Ingia / Jiunge
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}