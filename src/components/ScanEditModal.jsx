import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";

// --- (All reusable field components are unchanged) ---
const InputField = ({ label, value, onChange, name, type = "text", disabled = false, placeholder = "" }) => (
  <div>
    <label
      htmlFor={name}
      className="block text-sm font-medium text-textSecondary"
    >
      {label}
    </label>
    <input
      type={type}
      name={name}
      id={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
      placeholder={placeholder}
      className={`mt-1 block w-full bg-background border border-textSecondary rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primaryAccent focus:border-primaryAccent sm:text-sm ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    />
  </div>
);

const SelectField = ({ label, value, onChange, name, children }) => (
  <div>
    <label
      htmlFor={name}
      className="block text-sm font-medium text-textSecondary"
    >
      {label}
    </label>
    <select
      name={name}
      id={name}
      value={value}
      onChange={onChange}
      className="mt-1 block w-full bg-background border border-textSecondary rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primaryAccent focus:border-primaryAccent sm:text-sm"
    >
      {children}
    </select>
  </div>
);

const TextAreaField = ({ label, value, onChange, name, rows = 3, placeholder = "" }) => (
  <div>
    <label
      htmlFor={name}
      className="block text-sm font-medium text-textSecondary"
    >
      {label}
    </label>
    <textarea
      name={name}
      id={name}
      rows={rows}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="mt-1 block w-full bg-background border border-textSecondary rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primaryAccent focus:border-primaryAccent sm:text-sm"
    />
  </div>
);

const RadioGroup = ({ label, name, value, onChange, options }) => (
  <div>
    <label className="block text-sm font-medium text-textSecondary">{label}</label>
    <div className="mt-2 flex gap-4">
      {options.map((option) => (
        <label key={option} className="flex items-center">
          <input
            type="radio"
            name={name}
            value={option}
            checked={value === option}
            onChange={onChange}
            className="h-4 w-4 text-primaryAccent focus:ring-primaryAccent border-textSecondary"
          />
          <span className="ml-2 text-sm text-textPrimary">{option}</span>
        </label>
      ))}
    </div>
  </div>
);

const CheckboxField = ({ label, name, checked, onChange }) => (
  <div className="flex items-center">
    <input
      id={name}
      name={name}
      type="checkbox"
      checked={checked}
      onChange={onChange}
      className="h-4 w-4 text-primaryAccent focus:ring-primaryAccent border-textSecondary rounded"
    />
    <label htmlFor={name} className="ml-2 block text-sm text-textPrimary">
      {label}
    </label>
  </div>
);
// --- (End of unchanged components) ---


const ScanEditModal = ({ scan, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({});
  // 1. Add state to hold the selected file
  const [scanFile, setScanFile] = useState(null);

  useEffect(() => {
    if (scan) {
      setFormData(scan);
      // When opening an existing scan, we don't have the file object,
      // so we'll just clear the file input.
      setScanFile(null);
    }
  }, [scan]);

  if (!isOpen) {
    return null;
  }

  // Universal handler for all form inputs
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // 2. Add a handler for the file input
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setScanFile(e.target.files[0]);
    }
  };

  const handleSaveClick = () => {
    // 3. Pass the file object back to the Dashboard along with the form data
    onSave({ ...formData, scanFile: scanFile });
  };

  return (
    // Modal Overlay
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 transition-opacity">
      {/* Modal Content */}
      <div className="bg-surface rounded-lg shadow-xl overflow-hidden max-w-3xl w-full m-4">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
          <h2 className="text-xl font-bold text-textPrimary">
            {formData.isNew ? "Upload New Scan" : `Edit Scan: ${formData.patientId}`}
          </h2>
          <button
            onClick={onClose}
            className="text-textSecondary hover:text-textPrimary"
          >
            <FaTimes />
          </button>
        </div>

        {/* Modal Body (The Form) */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* --- (Section 1, 2, 3 are unchanged) --- */}
          <fieldset className="border p-4 rounded-md border-textSecondary border-opacity-50">
            <legend className="px-2 font-medium text-textPrimary">1. Patient Information</legend>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
              <InputField
                label="Patient ID / Record Number"
                name="patientId"
                value={formData.patientId || ""}
                onChange={handleChange}
                placeholder="e.g., A-00123"
              />
              <InputField
                label="Age / Date of Birth"
                name="patientDOB"
                type="date"
                value={formData.patientDOB || ""}
                onChange={handleChange}
              />
              <SelectField
                label="Sex / Gender"
                name="patientSex"
                value={formData.patientSex || "N/A"}
                onChange={handleChange}
              >
                <option>N/A</option>
                <option>Female</option>
                <option>Male</option>
                <option>Other</option>
              </SelectField>
              <SelectField
                label="Ethnicity (Optional)"
                name="patientEthnicity"
                value={formData.patientEthnicity || "N/A"}
                onChange={handleChange}
              >
                <option>N/A</option>
                <option>Asian</option>
                <option>Black or African American</option>
                <option>Hispanic or Latino</option>
                <option>White</option>
                <option>Other</option>
              </SelectField>
              <InputField
                label="Scan Date"
                name="scanDate"
                type="date"
                value={formData.scanDate || ""}
                onChange={handleChange}
              />
              <RadioGroup
                label="Eye(s) Scanned"
                name="eyeScanned"
                value={formData.eyeScanned || "Both"}
                onChange={handleChange}
                options={["Right", "Left", "Both"]}
              />
              <InputField
                label="Reason for Visit (Optional)"
                name="reasonForVisit"
                value={formData.reasonForVisit || ""}
                onChange={handleChange}
                placeholder="e.g., Glaucoma suspect"
              />
               <InputField
                label="Visual Acuity (Optional)"
                name="visualAcuity"
                value={formData.visualAcuity || ""}
                onChange={handleChange}
                placeholder="e.g., 20/20"
              />
               <InputField
                label="Intraocular Pressure (Optional)"
                name="iop"
                value={formData.iop || ""}
                onChange={handleChange}
                placeholder="e.g., 18 mmHg"
              />
              <TextAreaField
                label="Medical History (Optional)"
                name="medicalHistory"
                value={formData.medicalHistory || ""}
                onChange={handleChange}
                placeholder="Diabetes, Hypertension, Previous eye surgery, etc."
                rows={4}
              />
            </div>
          </fieldset>
          <fieldset className="border p-4 rounded-md border-textSecondary border-opacity-50">
            <legend className="px-2 font-medium text-textPrimary">2. Doctor / Technician Information</legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <InputField
                label="Doctor Name / ID"
                name="doctorName"
                value={formData.doctorName || ""}
                onChange={handleChange}
                placeholder="e.g., Dr. A. Ray / 9012"
              />
              <InputField
                label="Department / Specialty"
                name="doctorDepartment"
                value={formData.doctorDepartment || ""}
                onChange={handleChange}
                placeholder="e.g., Ophthalmology"
              />
              <InputField
                label="Contact Info (Optional)"
                name="doctorContact"
                value={formData.doctorContact || ""}
                onChange={handleChange}
                placeholder="e.g., email or phone"
              />
              <InputField
                label="Performing Technician (Optional)"
                name="performingTechnician"
                value={formData.performingTechnician || ""}
                onChange={handleChange}
              />
              <InputField
                label="Device / Imaging Equipment"
                name="deviceManufacturer"
                value={formData.deviceManufacturer || ""}
                onChange={handleChange}
                placeholder="e.g., Topcon, Zeiss"
              />
              <TextAreaField
                label="Notes / Observations"
                name="notes"
                value={formData.notes || ""}
                onChange={handleChange}
                rows={2}
                placeholder="e.g., Quality issues, artifacts, etc."
              />
            </div>
          </fieldset>
          <fieldset className="border p-4 rounded-md border-textSecondary border-opacity-50">
            <legend className="px-2 font-medium text-textPrimary">3. Consent & Compliance</legend>
            <div className="space-y-3 mt-2">
              <CheckboxField
                label="Patient consent confirmation: Yes"
                name="consentConfirmed"
                checked={formData.consentConfirmed || false}
                onChange={handleChange}
              />
              <CheckboxField
                label="HIPAA/GDPR compliance confirmation: Yes"
                name="hipaaCompliance"
                checked={formData.hipaaCompliance || false}
                onChange={handleChange}
              />
              <CheckboxField
                label="Data anonymization confirmation: Yes"
                name="anonymizationConfirmed"
                checked={formData.anonymizationConfirmed || false}
                onChange={handleChange}
              />
            </div>
          </fieldset>

          {/* --- Section 4: Upload Section --- */}
          <fieldset className="border p-4 rounded-md border-textSecondary border-opacity-50">
            <legend className="px-2 font-medium text-textPrimary">4. Upload Section</legend>
            <div className="mt-2">
              <label className="block text-sm font-medium text-textSecondary">
                Upload Fundus Scan File(s)
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-textSecondary border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-textSecondary"
                    stroke="currentColor" fill="none" viewBox="0 0 48 48"
                  >
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" />
                  </svg>
                  <div className="flex text-sm text-textSecondary">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer bg-surface rounded-md font-medium text-primaryAccent hover:text-opacity-80"
                    >
                      <span>Upload a file</span>
                      {/* 4. Add onChange to the file input */}
                      <input 
                        id="file-upload" 
                        name="file-upload" 
                        type="file" 
                        className="sr-only"
                        onChange={handleFileChange}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  {/* 5. Show the selected file name */}
                  <p className="text-xs text-textPrimary">
                    {scanFile ? scanFile.name : "JPEG, PNG, DICOM"}
                  </p>
                </div>
              </div>
            </div>
          </fieldset>
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
            Save Scan
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScanEditModal;