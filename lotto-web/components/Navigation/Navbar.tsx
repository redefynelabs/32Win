"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import { NAV_ITEMS } from "../../Constants/Nav";
import CompanyLogo from "@/public/companyLogo.png";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="absolute top-0 left-0 w-full z-50 bg-transparent px-4 md:px-[105px] py-6">
            <div className="bg-white border border-primary/20 flex items-center justify-between rounded-full px-6 py-3  mx-auto max-w-[1800px] transition-all duration-300">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <Image
                        src={CompanyLogo}
                        alt="Company Logo"
                        width={55}
                        height={55}
                        className="object-contain"
                        priority
                    />
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-10">
                    {NAV_ITEMS.map((item, index) => (
                        <Link
                            key={index}
                            href={item.href}
                            className="text-gray-800 text-lg font-medium hover:text-primary transition-colors duration-200"
                        >
                            {item.label}
                        </Link>
                    ))}
                </div>

                {/* Desktop Login Button */}
                <div className="hidden md:block">
                    <Link
                        href="/login"
                        className="bg-primary  text-white px-5 py-2 text-lg rounded-full hover:bg-primary/90 transition-all duration-200"
                    >
                        Login
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="md:hidden text-gray-800 text-3xl focus:outline-none"
                    aria-label="Toggle Menu"
                >
                    {isOpen ? <HiX /> : <HiMenuAlt3 />}
                </button>
            </div>

            {/* Mobile Dropdown Menu */}
            {isOpen && (
                <div className="absolute top-[90px] left-0 w-full bg-white shadow-lg rounded-2xl py-6 px-4 flex flex-col items-center gap-6 md:hidden transition-all duration-300">
                    {NAV_ITEMS.map((item, index) => (
                        <Link
                            key={index}
                            href={item.href}
                            className="text-gray-800 text-lg font-medium hover:text-primary transition-colors duration-200"
                            onClick={() => setIsOpen(false)}
                        >
                            {item.label}
                        </Link>
                    ))}
                    <Link
                        href="/login"
                        className="bg-primary text-white w-[120px] text-center py-2 rounded-full hover:bg-primary/90 transition-all duration-200"
                        onClick={() => setIsOpen(false)}
                    >
                        Login
                    </Link>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
