import React, { useState } from "react";
import Link from "next/link";
import { FaBars } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";

const ChatNavbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <div className="relative ">
      {/* Menu Toggle Icon */}
      <FaBars
        className="cursor-pointer text-2xl text-blue-600"
        onClick={toggleMenu}
      />

      {/* Modal Menu */}
      {menuOpen && (
        <div className="fixed top-4 right-4 rounded-2xl backdrop-blur-md bg-[rgba(255,255,255,0.1)] z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-xl full max-w-md p-6 relative flex flex-col gap-3 text-center">
            {/* Close Button */}
            <button
              onClick={closeMenu}
              className="absolute top-4 right-4 text-2xl text-gray-500 hover:text-gray-700"
            >
              <IoMdClose />
            </button>
            <Link href="/diseasePrediction" onClick={closeMenu} className="text-blue-600">
              Predict Disease
            </Link>
            <Link href="/nearestPharmacies" onClick={closeMenu} className="text-blue-600">
              Pharmacies
            </Link>
            <Link href="/nearestHospitals" onClick={closeMenu} className="text-blue-600">
              Hospitals
            </Link>
            <Link href="/medicineDetails" onClick={closeMenu} className="text-blue-600">
              Medicines
            </Link>
            <Link href="/nutritionChart" onClick={closeMenu} className="text-blue-600">
              Diet Chart
            </Link>
            <div className="flex justify-center gap-4">
              <Link
                href="/dashboard"
                className="text-white bg-gradient-to-r from-blue-500 to-blue-800 hover:bg-gradient-to-bl focus:ring-2 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-4 py-2.5"
                onClick={closeMenu}
              >
                Dashboard
              </Link>
              <Link
                href="/chat"
                className="text-white bg-gradient-to-r from-blue-500 to-blue-800 hover:bg-gradient-to-bl focus:ring-2 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-4 py-2.5"
                onClick={closeMenu}
              >
                Chat
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatNavbar;
