import React from "react";

function Header() {
  return (
    <div className="flex flex-col items-center justify-start mt-3  ">
      {/* Full width header box at the top */}
      <div className="w-fullp-2 mt-0 p-3 ">
        <header className="text-center">
          <h1 className="text-4xl font-extrabold text-white">
            Welcome to Constitution AI
          </h1>
          <p className="text-2xl text-pink-500 ">
            A Retrieval-Augmented Generation System for the Indian Constitution
          </p>
        </header>
      </div>
    </div>
  );
}

export default Header;
