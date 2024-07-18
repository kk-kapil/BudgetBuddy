import React from "react";

function Model({ show, onClose, children }) {
  return (
    <div
      style={{
        transform: show ? "translateX(0%)" : "translateX(-200%)",
      }}
      className="absolute top-0 left-0 w-full h-full z-10 transition-all duration-500"
    >
      <div className="container mx-auto max-w-2xl min-h-[80vh] rounded-3xl bg-slate-800 py-6 px-4 overflow-auto flex flex-col">
        <button
          onClick={() => {
            onClose(false); // Close the modal when the button is clicked
          }}
          className="w-10 h-10 mb-4 font-bold rounded-full bg-slate-600"
        >
          X
        </button>
        {children}
      </div>
    </div>
  );
}

export default Model;
