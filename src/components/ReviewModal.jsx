import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";

// --- Custom "Slider" Components ---

// A 2-point segmented control for Review Status
const ReviewStatusSlider = ({ value, onChange }) => {
  const activeStyles = "bg-primaryAccent text-white";
  const inactiveStyles = "bg-background text-textSecondary hover:bg-surface";

  return (
    <div>
      <label className="block text-sm font-medium text-textPrimary mb-2">
        Review Status
      </label>
      <div className="flex rounded-md shadow-sm">
        <button
          type="button"
          onClick={() => onChange("Pending")}
          className={`flex-1 px-4 py-2 rounded-l-md transition-colors ${value === "Pending" ? activeStyles : inactiveStyles}`}
        >
          Pending
        </button>
        <button
          type="button"
          onClick={() => onChange("Reviewed")}
          className={`flex-1 px-4 py-2 rounded-r-md transition-colors ${value === "Reviewed" ? activeStyles : inactiveStyles}`}
        >
          Reviewed
        </button>
      </div>
    </div>
  );
};

// A 4-point segmented control for Risk Level
const RiskSlider = ({ value, onChange }) => {
  // Color styles for each button
  const styles = {
    Low: "bg-green-100 text-green-800 hover:bg-green-200",
    Medium: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
    High: "bg-red-100 text-red-800 hover:bg-red-200",
    "Not Determined": "bg-gray-100 text-gray-800 hover:bg-gray-200",
  };
  const activeStyle = "ring-2 ring-primaryAccent ring-offset-2 ring-offset-surface";

  return (
    <div>
      <label className="block text-sm font-medium text-textPrimary mb-2">
        Risk Level
      </label>
      <div className="grid grid-cols-4 gap-2">
        <button
          type="button"
          onClick={() => onChange("Low")}
          className={`px-4 py-2 rounded-md transition-all ${styles.Low} ${value === "Low" ? activeStyle : ""}`}
        >
          Low
        </button>
        <button
          type="button"
          onClick={() => onChange("Medium")}
          className={`px-4 py-2 rounded-md transition-all ${styles.Medium} ${value === "Medium" ? activeStyle : ""}`}
        >
          Medium
        </button>
        <button
          type="button"
          onClick={() => onChange("High")}
          className={`px-4 py-2 rounded-md transition-all ${styles.High} ${value === "High" ? activeStyle : ""}`}
        >
          High
        </button>
        <button
          type="button"
          onClick={() => onChange("Not Determined")}
          className={`px-4 py-2 rounded-md transition-all ${styles["Not Determined"]} ${value === "Not Determined" ? activeStyle : ""}`}
        >
          Not Determined
        </button>
      </div>
    </div>
  );
};


// --- Main Review Modal Component ---

const ReviewModal = ({ scan, isOpen, onClose, onSave }) => {
  // Internal state for the modal's values
  const [reviewStatus, setReviewStatus] = useState("Pending");
  const [riskLevel, setRiskLevel] = useState("Not Determined");

  // When the modal opens, set its state from the scan prop
  useEffect(() => {
    if (scan) {
      setReviewStatus(scan.reviewStatus || "Pending");
      setRiskLevel(scan.riskLevel || "Not Determined");
    }
  }, [scan]);

  if (!isOpen) {
    return null;
  }

  const handleSaveClick = () => {
    // Pass the updated scan data back up to the Dashboard
    onSave({
      ...scan,
      reviewStatus: reviewStatus,
      riskLevel: riskLevel,
    });
  };

  return (
    // Modal Overlay
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 transition-opacity">
      {/* Modal Content */}
      <div className="bg-surface rounded-lg shadow-xl overflow-hidden max-w-lg w-full m-4">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
          <h2 className="text-xl font-bold text-textPrimary">
            Update Status: {scan.patientId}
          </h2>
          <button
            onClick={onClose}
            className="text-textSecondary hover:text-textPrimary"
          >
            <FaTimes />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          <ReviewStatusSlider value={reviewStatus} onChange={setReviewStatus} />
          <RiskSlider value={riskLevel} onChange={setRiskLevel} />
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end gap-4 p-4 bg-background">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-textSecondary text-white rounded-md hover:bg-opacity-80"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveClick}
            className="px-4 py-2 bg-primaryAccent text-white rounded-md hover:bg-opacity-80"
          >
            Save Status
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;