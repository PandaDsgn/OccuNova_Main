import React from "react";
import { FaTimes } from "react-icons/fa";

// Reusable component for displaying a single piece of data
const DetailRow = ({ label, value }) => (
  <div>
    <p className="text-sm font-medium text-textSecondary">{label}</p>
    <p className="text-base text-textPrimary">{value || "N/A"}</p>
  </div>
);

// Reusable component for displaying boolean (Yes/No) data
const CheckRow = ({ label, checked }) => (
  <div className="flex items-center gap-2">
    <p className="text-sm font-medium text-textSecondary">{label}:</p>
    <p className={`text-base font-medium ${checked ? 'text-green-500' : 'text-red-500'}`}>
      {checked ? "Yes" : "No"}
    </p>
  </div>
);

const ScanViewModal = ({ scan, isOpen, onClose }) => {
  if (!isOpen || !scan) {
    return null;
  }

  return (
    // Modal Overlay
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 transition-opacity">
      {/* Modal Content */}
      <div className="bg-surface rounded-lg shadow-xl overflow-hidden max-w-3xl w-full m-4">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
          <h2 className="text-xl font-bold text-textPrimary">
            View Scan Details: {scan.patientId}
          </h2>
          <button
            onClick={onClose}
            className="text-textSecondary hover:text-textPrimary"
          >
            <FaTimes />
          </button>
        </div>

        {/* Modal Body (Read-only data) */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* --- Section 1: Patient Information --- */}
          <fieldset className="border p-4 rounded-md border-textSecondary border-opacity-50">
            <legend className="px-2 font-medium text-textPrimary">1. Patient Information</legend>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
              <DetailRow label="Patient ID" value={scan.patientId} />
              <DetailRow label="Age / Date of Birth" value={scan.patientDOB} />
              <DetailRow label="Sex / Gender" value={scan.patientSex} />
              <DetailRow label="Ethnicity" value={scan.patientEthnicity} />
              <DetailRow label="Scan Date" value={scan.scanDate} />
              <DetailRow label="Eye(s) Scanned" value={scan.eyeScanned} />
              <DetailRow label="Reason for Visit" value={scan.reasonForVisit} />
              <DetailRow label="Visual Acuity" value={scan.visualAcuity} />
              <DetailRow label="Intraocular Pressure (IOP)" value={scan.iop} />
              <div className="md:col-span-3">
                <DetailRow label="Medical History" value={scan.medicalHistory} />
              </div>
            </div>
          </fieldset>

          {/* --- Section 2: Doctor / Technician Information --- */}
          <fieldset className="border p-4 rounded-md border-textSecondary border-opacity-50">
            <legend className="px-2 font-medium text-textPrimary">2. Doctor / Technician Information</legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <DetailRow label="Doctor Name / ID" value={scan.doctorName} />
              <DetailRow label="Department / Specialty" value={scan.doctorDepartment} />
              <DetailRow label="Contact Info" value={scan.doctorContact} />
              <DetailRow label="Performing Technician" value={scan.performingTechnician} />
              <DetailRow label="Imaging Equipment" value={scan.deviceManufacturer} />
              <DetailRow label="Notes / Observations" value={scan.notes} />
            </div>
          </fieldset>

          {/* --- Section 3: Consent & Compliance --- */}
          <fieldset className="border p-4 rounded-md border-textSecondary border-opacity-50">
            <legend className="px-2 font-medium text-textPrimary">3. Consent & Compliance</legend>
            <div className="space-y-3 mt-2">
              <CheckRow label="Patient Consent Confirmed" checked={scan.consentConfirmed} />
              <CheckRow label="HIPAA/GDPR Compliance" checked={scan.hipaaCompliance} />
              <CheckRow label="Data Anonymization" checked={scan.anonymizationConfirmed} />
            </div>
          </fieldset>

        </div>

        {/* Modal Footer */}
        <div className="flex justify-end gap-4 p-4 bg-background">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-primaryAccent text-white rounded-md hover:bg-opacity-80"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScanViewModal;