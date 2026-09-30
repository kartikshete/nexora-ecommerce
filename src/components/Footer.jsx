import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Instagram, Linkedin, ArrowRight, ShieldCheck } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-zinc-950 text-gray-400 pt-16 pb-12 border-t border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-zinc-800/80">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-9 h-9 rounded-xl bg-white text-zinc-900 flex items-center justify-center font-extrabold text-lg shadow-lg">
                N
              </div>
              <span className="text-2xl font-extrabold tracking-tight text-white font-sans">
                NEXORA<span className="text-brand-500 font-normal">.</span>
              </span>
            </Link>

            <p className="text-sm text-gray-400 max-w-sm leading-relaxed">
              Curating elevated tech, apparel, and living essentials. Redefining modern e-commerce through uncompromised design, sustainability, and quality.
            </p>

            <div className="flex items-center space-x-4 pt-2">
              <a href="#" className="p-2 rounded-full bg-zinc-900 text-gray-400 hover:text-white hover:bg-zinc-800 transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-full bg-zinc-900 text-gray-400 hover:text-white hover:bg-zinc-800 transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-full bg-zinc-900 text-gray-400 hover:text-white hover:bg-zinc-800 transition-colors">
                <Github className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-full bg-zinc-900 text-gray-400 hover:text-white hover:bg-zinc-800 transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 1: Shop */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Categories</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/products" className="hover:text-white transition-colors">Electronics & Audio</Link></li>
              <li><Link to="/products" className="hover:text-white transition-colors">Minimalist Apparel</Link></li>
              <li><Link to="/products" className="hover:text-white transition-colors">Performance Footwear</Link></li>
              <li><Link to="/products" className="hover:text-white transition-colors">Luxury Accessories</Link></li>
              <li><Link to="/products" className="hover:text-white transition-colors">Home & Workspace</Link></li>
            </ul>
          </div>

          {/* Column 2: Customer Support */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Support & Care</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#" className="hover:text-white transition-colors">Order Tracking</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Shipping & Global Delivery</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Returns & Exchange Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Product Care Guides</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact Support</a></li>
            </ul>
          </div>

          {/* Column 3: Company */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Company</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#" className="hover:text-white transition-colors">Our Philosophy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Sustainability Pledge</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Press & Media Kit</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers & Internships</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
            </ul>
          </div>

        </div>

        {/* Bottom Copyright & Security note */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p>© {new Date().getFullYear()} NEXORA Inc. All rights reserved. Designed for excellence.</p>
          <div className="flex items-center space-x-6">
            <span className="flex items-center space-x-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>256-Bit SSL Encrypted</span>
            </span>
            <a href="#" className="hover:text-gray-400">Terms of Service</a>
            <a href="#" className="hover:text-gray-400">Cookies Policy</a>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
