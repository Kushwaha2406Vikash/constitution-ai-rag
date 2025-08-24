import React from "react";

const Footer = () => {
  return (
    <footer className="mt-8 bg-black pt-6 border-t border-slate-800 text-center text-white px-4 sm:px-8 md:px-16 lg:px-24">
      {/* Logo */}
      {/* <img
        src="https://placehold.co/80x80/6495ED/ffffff?text=Logo"
        alt="Constitution AI Logo"
        className="mx-auto mb-4 rounded-full w-16 h-16 sm:w-20 sm:h-20"
      /> */}

      {/* Disclaimer */}
      <p className="mb-2 text-white text-sm sm:text-base md:text-lg">
        This AI is a prototype designed to demonstrate a Retrieval-Augmented
        Generation system.
      </p>
      <p className="text-white text-sm sm:text-base md:text-lg">
        The information provided is for educational and informational purposes
        only and should not be considered legal advice.
      </p>

      {/* Copyright */}
      <p className="mt-4 text-white text-xs sm:text-sm md:text-base">
        &copy; 2025 Constitution AI. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
