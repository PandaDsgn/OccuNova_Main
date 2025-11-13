import React from "react";
import { Link } from "react-router-dom";

const GlaucomaInfo = () => {
  return (
    <section className="bg-background text-textPrimary py-14 transition-colors duration-500">
      <div className="max-w-3xl mx-auto px-4">
        {/* --- Reduced heading size --- */}
        <h2 className="text-xl md:text-2xl font-bold mb-3">
          What is <span className="text-primaryAccent">Glaucoma?</span>
        </h2>
        <div className="w-12 h-0.5 bg-secondaryAccent mb-6 rounded"></div>

        <p className="text-base md:text-lg leading-relaxed mb-6 text-textSecondary">
          Glaucoma is a group of eye conditions that damage the optic nerve, a
          vital part of vision. The damage is often linked to increased pressure
          inside the eye. If untreated, glaucoma can lead to irreversible vision
          loss or blindness.
        </p>

        {/* --- Reduced heading size --- */}
        <h3 className="text-lg font-medium mb-3 text-primaryAccent">
          Key Facts
        </h3>
        <ul className="list-disc list-inside text-textSecondary text-base md:text-lg space-y-2">
          <li>One of the leading causes of irreversible blindness globally.</li>
          <li>
            Early stages are asymptomatic, making routine screening essential.
          </li>
          <li>
            Nerve damage from glaucoma cannot be reversed — prevention and early
            detection are critical.
          </li>
          <li>Risk factors include age, family history, and diabetes.</li>
        </ul>

        <div className="text-center mt-12">
          <Link
            to="/dashboard"
            // --- Reduced button size and text size ---
            className="inline-block bg-primaryAccent text-white font-bold text-base px-6 py-2 rounded-full shadow-md hover:bg-opacity-80 transition-all duration-300 transform hover:scale-105"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </section>
  );
};

export default GlaucomaInfo;