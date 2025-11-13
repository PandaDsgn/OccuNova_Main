import React from "react";

const Hero = () => {
  return (
    <section className="bg-surface text-textPrimary pt-24 pb-16 border-b border-secondaryAccent transition-colors duration-500">
      <div className="max-w-4xl mx-auto text-center px-4">
        {/* --- Reduced heading size --- */}
        <h1 className="text-2xl md:text-3xl font-bold mb-3 tracking-tight text-primaryAccent">
          AI-Powered Glaucoma Screening
        </h1>
        <div className="w-16 h-0.5 bg-primaryAccent mx-auto mb-5 rounded-full"></div>
        <p className="text-base md:text-lg leading-relaxed max-w-2xl mx-auto text-textSecondary">
          Early detection saves vision. Occunova applies advanced image analysis
          and AI algorithms to help clinicians detect glaucoma efficiently,
          accurately, and at scale.
        </p>
      </div>
    </section>
  );
};

export default Hero;