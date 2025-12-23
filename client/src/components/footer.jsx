import React from "react";
import { MapPin, Phone } from "lucide-react";

const Footer = () => {
    return (
        <footer className="w-full bg-[#0f1115] text-slate-300 border-t border-slate-800 font-sans">
            <div className="max-w-7xl mx-auto px-6 pt-16 pb-8">

                {/* --- MAIN GRID CONTENT --- */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16 items-start">

                    {/* COLUMN 1: BRAND & ORDER ICONS */}
                    <div className="space-y-6 flex flex-col items-start md:items-start text-left">
                        <div className="space-y-4">
                            <h2 className="text-2xl font-black tracking-tight text-white">
                                MANESAR <span className="text-orange-500">CAFE</span>
                            </h2>
                            <p className="text-slate-500 text-sm leading-relaxed max-w-xs">
                                Experience the perfect blend of ambiance and flavor. Fresh food,
                                premium coffee, and unforgettable moments.
                            </p>
                        </div>

                        {/* Order Online Icons */}
                        <div className="flex flex-col gap-3 pt-2">
                            <p className="text-xs font-bold text-white uppercase tracking-widest opacity-60">
                                Order Online:
                            </p>

                            <div className="flex items-center gap-4">
                                {/* Zomato Logo Button */}
                                <a
                                    href="https://www.zomato.com/ncr/manesar-cafe-2-manesar-gurgaon"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:scale-105 transition-transform duration-300"
                                >
                                    {/* PATH EXPLANATION:
                                       Files in 'public/images/' are accessed via '/images/filename'
                                    */}
                                    <img
                                        src="/images/zomatoIcon.png"
                                        alt="Order on Zomato"
                                        className="h-10 w-auto rounded-md shadow-lg shadow-red-900/20"
                                    />
                                </a>

                                {/* Swiggy Logo Button */}
                                <a
                                    href="https://www.swiggy.com/city/gurgaon/manesar-cafe-manesar-imt-manesar-rest945057"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:scale-105 transition-transform duration-300"
                                >
                                    {/* Adding bg-white and padding (p-1) to make the Swiggy logo
                                       pop against the dark footer background
                                    */}
                                    <img
                                        src="/images/swiggyIcon.png"
                                        alt="Order on Swiggy"
                                        className="h-10 w-auto bg-white rounded-md p-1 shadow-lg shadow-orange-900/20"
                                    />
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* COLUMN 2: QUICK LINKS */}
                    <div className="md:justify-self-center text-left">
                        <h3 className="text-white font-bold mb-6 tracking-wide text-sm uppercase relative inline-block">
                            Quick Links
                            <span className="absolute -bottom-2 left-0 w-8 h-0.5 bg-orange-500 rounded-full"></span>
                        </h3>
                        <ul className="space-y-4 text-sm">
                            <FooterLink href="#">Home</FooterLink>
                            <FooterLink href="#">Menu</FooterLink>
                            <FooterLink
                                href="https://www.google.com/search?sca_esv=283b61cf11016ab2&si=AMgyJEtREmoPL4P1I5IDCfuA8gybfVI2d5Uj7QMwYCZHKDZ-E7wGo_nXQ57SLaksU_w63hnGwTYjpab6BiumO-B7L4-UXQPLcpSoELbYbA3aYLoBmg6VU6P-3AZQ2tljMFHXjHNyRV6IAoicpyufXRmpPXKzJ_wWVg%3D%3D&q=Manesar+Cafe+%26+Restaurant+Reviews&sa=X&ved=2ahUKEwjap5j29tORAxUeTGwGHR2SKJYQ0bkNegQIHhAD&biw=2137&bih=1114&dpr=1.6"
                                isExternal={true}
                            >
                                Feedback
                            </FooterLink>
                        </ul>
                    </div>

                    {/* COLUMN 3: CONTACT INFO */}
                    <div className="md:justify-self-end text-left">
                        <h3 className="text-white font-bold mb-6 tracking-wide text-sm uppercase relative inline-block">
                            Contact Us
                            <span className="absolute -bottom-2 left-0 w-8 h-0.5 bg-orange-500 rounded-full"></span>
                        </h3>
                        <ul className="space-y-5 text-sm">
                            <li className="flex items-start space-x-3 group">
                                <MapPin size={20} className="text-orange-500 mt-0.5 shrink-0 group-hover:text-white transition-colors" />
                                <span className="text-slate-400 leading-relaxed">
                                    Shop no. 4, Lal Singh Market Chowk <br />
                                    Near IMT Road, Sector 1B, Manesar <br />
                                    Gurugram, Haryana 122052
                                </span>
                            </li>
                            <li className="flex items-center space-x-3 group">
                                <Phone size={20} className="text-orange-500 shrink-0 group-hover:text-white transition-colors" />
                                <span className="text-slate-400 font-medium tracking-wide">+91 97172 17202</span>
                            </li>
                        </ul>
                    </div>

                </div>

                {/* --- BOTTOM BAR --- */}
                <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-slate-500 text-sm font-medium">
                        © {new Date().getFullYear()} Manesar Cafe. All rights reserved.
                    </p>
                    <div className="flex space-x-6 text-sm text-slate-500">
                        <a href="#" className="hover:text-orange-500 transition-colors">
                            Privacy Policy
                        </a>
                        <a href="#" className="hover:text-orange-500 transition-colors">
                            Terms of Service
                        </a>
                    </div>
                </div>

            </div>
        </footer>
    );
};

// Helper Component for Links
const FooterLink = ({ href, children, isExternal }) => (
    <li>
        <a
            href={href}
            target={isExternal ? "_blank" : "_self"}
            rel={isExternal ? "noopener noreferrer" : ""}
            className="text-slate-400 hover:text-orange-500 hover:translate-x-1 inline-block transition-all duration-200"
        >
            {children}
        </a>
    </li>
);

export default Footer;