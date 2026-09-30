import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { ShopProvider } from './context/ShopContext';
import ScrollToTop from './components/ScrollToTop';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Toast from './components/Toast';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';

function App() {
  return (
    <ThemeProvider>
      <ShopProvider>
        <Router>
          <ScrollToTop />
          <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900 dark:bg-zinc-950 dark:text-gray-100 transition-colors duration-200">
            {/* Sticky Header Navbar */}
            <Navbar />

            {/* Notification Toast */}
            <Toast />

            {/* Main Content Viewport */}
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/product/:id" element={<ProductDetails />} />
                <Route path="/cart" element={<Cart />} />
                {/* Fallback route */}
                <Route path="*" element={<Home />} />
              </Routes>
            </main>

            {/* Footer */}
            <Footer />
          </div>
        </Router>
      </ShopProvider>
    </ThemeProvider>
  );
}

export default App;
