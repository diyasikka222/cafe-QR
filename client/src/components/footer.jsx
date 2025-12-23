import React from "react";
import {
  Facebook,
  Instagram,
  Twitter,
  MapPin,
  Phone,
  Mail,
  ArrowRight,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="w-full bg-[#0f1115] text-slate-300 border-t border-slate-800 font-sans">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Column 1: Brand & Tagline */}
          <div className="space-y-4">
            <h2 className="text-2xl font-black tracking-tight text-white">
              MANESAR <span className="text-orange-500">CAFE</span>
            </h2>
            <p className="text-slate-500 text-sm leading-relaxed max-w-xs">
              Experience the perfect blend of ambiance and flavor. Fresh food,
              premium coffee, and unforgettable moments served right at your
              table.
            </p>
            <div className="flex space-x-4 pt-2">
              <SocialIcon icon={<Instagram size={20} />} href="#" />
              <SocialIcon icon={<Facebook size={20} />} href="#" />
              <SocialIcon icon={<Twitter size={20} />} href="#" />
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-white font-bold mb-6 tracking-wide text-sm uppercase">
              Quick Links
            </h3>
            <ul className="space-y-3 text-sm">
              <FooterLink href="#">Home</FooterLink>
              <FooterLink href="#">Menu</FooterLink>
            </ul>
          </div>

          {/* Column 3: Contact Info */}
          <div>
            <h3 className="text-white font-bold mb-6 tracking-wide text-sm uppercase">
              Contact Us
            </h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start space-x-3">
                <MapPin size={18} className="text-orange-500 mt-0.5 shrink-0" />
                <span className="text-slate-400">
                  Shop no. 4, Lal Singh Market Chowk <br />
                  Near IMT Road, Sector 1B, Manesar
                  <br />
                  Gurugram, Haryana 122052
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone size={18} className="text-orange-500 shrink-0" />
                <span className="text-slate-400">+91 98765 43210</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail size={18} className="text-orange-500 shrink-0" />
                <span className="text-slate-400">hello@manesarcafe.com</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div>
            <h3 className="text-white font-bold mb-6 tracking-wide text-sm uppercase">
              Stay Updated
            </h3>
            <p className="text-slate-500 text-sm mb-4">
              Subscribe for exclusive offers and new menu drops.
            </p>
            <div className="flex flex-col space-y-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="bg-[#1a1d23] border border-slate-700 text-white text-sm rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500 transition-colors"
              />
              <button className="bg-orange-600 hover:bg-orange-500 text-white text-sm font-bold py-3 rounded-lg transition-colors flex justify-center items-center gap-2">
                Subscribe <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Legal */}
        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm text-center md:text-left">
            © {new Date().getFullYear()} CafeQR Scanner System. All rights
            reserved.
          </p>
          <div className="flex space-x-6 text-sm text-slate-500">
            <a href="#" className="hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

// Helper Component for Links
const FooterLink = ({ href, children }) => (
  <li>
    <a
      href={href}
      className="text-slate-400 hover:text-orange-500 transition-colors duration-200"
    >
      {children}
    </a>
  </li>
);

// Helper Component for Social Icons
const SocialIcon = ({ icon, href }) => (
  <a
    href={href}
    className="w-10 h-10 rounded-full bg-[#1a1d23] border border-slate-800 flex items-center justify-center text-slate-400 hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all duration-300"
  >
    {icon}
  </a>
);

export default Footer;
