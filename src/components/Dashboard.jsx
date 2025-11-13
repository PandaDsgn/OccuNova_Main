import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaHourglassHalf,
  FaExclamationTriangle,
  FaCheckCircle,
  FaFolderOpen,
  FaHome,
  FaTrash,
  FaPencilAlt,
  FaExternalLinkAlt,
  FaEye,
  FaClipboardCheck, // 1. Import new icon
} from "react-icons/fa";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import ScanEditModal from "./ScanEditModal";
import ScanViewModal from "./ScanViewModal"; 
import ReviewModal from "./ReviewModal"; // 2. Import the new Review Modal

// --- ADD YOUR CLOUDINARY DETAILS HERE ---
const YOUR_CLOUD_NAME = "dpwmdsj4r"; 
const YOUR_UPLOAD_PRESET = "Glaucoma"; 
// ------------------------------------------

// Set the initial data to an EMPTY array
const mockScans = [];

// (StatCard component is unchanged)
const StatCard = ({ title, value, icon, color }) => (
  <div className="bg-surface shadow-md rounded-lg p-5 flex items-center space-x-4">
    <div className={`text-3xl ${color}`}>{icon}</div>
    <div>
      <h3 className="text-sm font-medium text-textSecondary uppercase">
        {title}
      </h3>
      <p className="text-2xl font-bold text-textPrimary">{value}</p>
    </div>
  </div>
);

// 3. --- ADDED Badge component back in ---
// We need this for the new table columns
const Badge = ({ text, color }) => {
  const colorClasses = {
    red: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    green: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    blue: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    yellow: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    gray: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
  };
  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${colorClasses[color]}`}
    >
      {text}
    </span>
  );
};

// (uploadFileToCloudinary function is unchanged)
const uploadFileToCloudinary = async (file, publicId = null) => {
  const url = `https://api.cloudinary.com/v1_1/${YOUR_CLOUD_NAME}/upload`;
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", YOUR_UPLOAD_PRESET);
  
  if (publicId) {
    formData.append("public_id", publicId);
    formData.append("overwrite", "true"); 
  }
  
  const response = await fetch(url, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error("Cloudinary upload failed:", errorData);
    throw new Error("Cloudinary upload failed");
  }

  const data = await response.json();
  return data.secure_url; 
};

// (generatePdf function is unchanged)
const generatePdf = (scanData) => {
  const doc = new jsPDF();
  const margin = 15;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("Glaucoma Scan Report", margin, 20);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.text(`Patient ID: ${scanData.patientId}`, margin, 30);
  doc.text(`Scan Date: ${scanData.scanDate}`, 120, 30);
  
  autoTable(doc, {
    startY: 40,
    head: [['1. Patient Information', 'Details']],
    body: [
      ['Age / Date of Birth', scanData.patientDOB],
      ['Sex / Gender', scanData.patientSex],
      ['Ethnicity', scanData.patientEthnicity],
      ['Eye(s) Scanned', scanData.eyeScanned],
      ['Reason for Visit', scanData.reasonForVisit],
      ['Medical History', scanData.medicalHistory],
      ['Visual Acuity', scanData.visualAcuity],
      ['Intraocular Pressure (IOP)', scanData.iop],
    ],
    theme: 'grid',
    headStyles: { fillColor: [10, 61, 98] }, 
  });

  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 10,
    head: [['2. Doctor / Technician Information', 'Details']],
    body: [
      ['Doctor Name / ID', scanData.doctorName],
      ['Department / Specialty', scanData.doctorDepartment],
      ['Contact Info', scanData.doctorContact],
      ['Performing Technician', scanData.performingTechnician],
      ['Imaging Equipment', scanData.deviceManufacturer],
      ['Notes / Observations', scanData.notes],
    ],
    theme: 'grid',
    headStyles: { fillColor: [10, 61, 98] },
  });

  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 10,
    head: [['3. Consent & Compliance', 'Status']],
    body: [
      ['Patient Consent Confirmed', scanData.consentConfirmed ? 'Yes' : 'No'],
      ['HIPAA/GDPR Compliance', scanData.hipaaCompliance ? 'Yes' : 'No'],
      ['Data Anonymization', scanData.anonymizationConfirmed ? 'Yes' : 'No'],
    ],
    theme: 'grid',
    headStyles: { fillColor: [10, 61, 98] },
  });

  doc.save(`${scanData.patientId}.pdf`);
};


const Dashboard = () => {
  // (Stat hooks are unchanged)
  const [pendingCount, setPendingCount] = useState(0);
  const [highRiskCount, setHighRiskCount] = useState(0);
  const [reviewedCount, setReviewedCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [scans, setScans] = useState(mockScans);
  
  // 4. --- UPDATED MODAL STATE ---
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false); // New state
  const [selectedScan, setSelectedScan] = useState(null); // Use one scan for all modals

  // 5. --- UPDATED UPLOAD CLICK ---
  const handleUploadClick = () => {
    const today = new Date().toISOString().split("T")[0];
    setSelectedScan({
      internalId: crypto.randomUUID(),
      patientId: "", 
      patientDOB: "",
      patientSex: "N/A",
      patientEthnicity: "N/A",
      eyeScanned: "Both",
      medicalHistory: "",
      reasonForVisit: "",
      visualAcuity: "",
      iop: "",
      scanDate: today,
      doctorName: "",
      doctorDepartment: "",
      doctorContact: "",
      performingTechnician: "",
      deviceManufacturer: "",
      notes: "",
      consentConfirmed: false,
      hipaaCompliance: false,
      anonymizationConfirmed: false,
      isNew: true,
      scanImageUrl: null,
      scanDataUrl: null,
      reviewStatus: "Pending", // Add default review status
      riskLevel: "Not Determined", // Add default risk level
    });
    setIsEditModalOpen(true);
  };
  
  // 6. --- UPDATED CLICK HANDLERS ---
  const handleEditClick = (scan) => {
    setSelectedScan({ ...scan, isNew: false });
    setIsEditModalOpen(true);
  };
  const handleViewClick = (scan) => {
    setSelectedScan(scan);
    setIsViewModalOpen(true);
  };
  // 7. --- NEW CLICK HANDLER ---
  const handleReviewClick = (scan) => {
    setSelectedScan(scan);
    setIsReviewModalOpen(true);
  };

  // (handleSaveScan for EDITING is unchanged)
  const handleSaveScan = async (savedScan) => {
    const { isNew, scanFile, ...scanData } = savedScan;
    if (!scanData.patientId) {
      alert("Patient ID is required.");
      return;
    }
    if (isNew && !scanFile) {
      alert("Please select a scan file to upload.");
      return;
    }

    generatePdf(scanData);

    try {
      let imageUrl = savedScan.scanImageUrl; 
      if (scanFile) {
        imageUrl = await uploadFileToCloudinary(scanFile, null);
      }
      const finalScanData = { ...scanData, scanImageUrl: imageUrl, scanDataUrl: null };

      if (isNew) {
        setScans([finalScanData, ...scans]);
        setTotalCount(totalCount + 1);
        // New scans are "Pending" by default, so update count
        setPendingCount(pendingCount + 1);
      } else {
        setScans(
          scans.map((scan) =>
            scan.internalId === finalScanData.internalId ? finalScanData : scan
          )
        );
      }
      
      setIsEditModalOpen(false);
      setSelectedScan(null);

    } catch (error) {
      console.error("Image upload failed:", error);
      alert("PDF Downloaded. However, the image upload failed. Please try editing the scan to re-upload.");
    }
  };

  // 8. --- NEW SAVE HANDLER for Review Modal ---
  const handleSaveReview = (reviewData) => {
    // Find the original scan to calculate stat changes
    const oldScan = scans.find(s => s.internalId === reviewData.internalId);

    // Calculate changes for stat cards
    let newPending = pendingCount;
    if (oldScan.reviewStatus === 'Pending' && reviewData.reviewStatus === 'Reviewed') {
      newPending--;
    } else if (oldScan.reviewStatus === 'Reviewed' && reviewData.reviewStatus === 'Pending') {
      newPending++;
    }

    let newHighRisk = highRiskCount;
    if (oldScan.riskLevel !== 'High Risk' && reviewData.riskLevel === 'High Risk') {
      newHighRisk++;
    } else if (oldScan.riskLevel === 'High Risk' && reviewData.riskLevel !== 'High Risk') {
      newHighRisk--;
    }

    // Update the states
    setPendingCount(newPending);
    setHighRiskCount(newHighRisk);
    setScans(
      scans.map((scan) =>
        scan.internalId === reviewData.internalId ? reviewData : scan
      )
    );
    
    // Close modal
    setIsReviewModalOpen(false);
    setSelectedScan(null);
  };

  // (handleDeleteClick is unchanged)
  const handleDeleteClick = (internalId) => {
    const scanToDelete = scans.find((scan) => scan.internalId === internalId);
    if (!scanToDelete) return;

    // Also update stats on delete
    setTotalCount(totalCount - 1);
    if (scanToDelete.reviewStatus === "Pending") {
      setPendingCount(pendingCount - 1);
    }
    if (scanToDelete.riskLevel === "High Risk") {
      setHighRiskCount(highRiskCount - 1);
    }

    setScans(scans.filter((scan) => scan.internalId !== internalId));
  };


  return (
    <>
      {/* 9. --- Render all three modals --- */}
      <ScanEditModal
        isOpen={isEditModalOpen}
        scan={selectedScan}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveScan}
      />
      <ScanViewModal
        isOpen={isViewModalOpen}
        scan={selectedScan}
        onClose={() => setIsViewModalOpen(false)}
      />
      <ReviewModal
        isOpen={isReviewModalOpen}
        scan={selectedScan}
        onClose={() => setIsReviewModalOpen(false)}
        onSave={handleSaveReview}
      />

      <div className="pt-20 min-h-screen">
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* (Header is unchanged) */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <h1 className="text-2xl font-bold text-textPrimary">
              Doctor's Dashboard
            </h1>
            <div className="flex items-center gap-6">
              <Link
                to="/"
                title="Back to Home"
                className="text-primaryAccent transition-all duration-300 transform hover:scale-110 hover:text-opacity-80"
              >
                <FaHome className="w-6 h-6" />
              </Link>
              <button
                onClick={handleUploadClick}
                className="inline-block bg-primaryAccent text-white font-bold text-base px-6 py-2 rounded-full shadow-md hover:bg-opacity-80 transition-all duration-300 transform hover:scale-105"
              >
                + Upload New Scan
              </button>
            </div>
          </div>

          {/* (Stats cards are unchanged) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            <StatCard
              title="Pending Review"
              value={pendingCount}
              icon={<FaHourglassHalf />}
              color="text-yellow-500"
            />
            <StatCard
              title="High Risk Detected"
              value={highRiskCount}
              icon={<FaExclamationTriangle />}
              color="text-red-500"
            />
            <StatCard
              title="Reviewed Today"
              value={reviewedCount}
              icon={<FaCheckCircle />}
              color="text-green-500"
            />
            <StatCard
              title="Total Patients"
              value={totalCount}
              icon={<FaFolderOpen />}
              color="text-blue-500"
            />
          </div>

          {/* 10. --- UPDATED TABLE --- */}
          <div className="bg-surface shadow-md rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b dark:border-gray-700">
              <h2 className="text-xl font-bold text-textPrimary">
                Recent Patient Scans
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y dark:divide-gray-700">
                <thead className="bg-background">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">
                      Patient ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">
                      Scan Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">
                      Scan
                    </th>
                    {/* New Columns */}
                    <th className="px-6 py-3 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">
                      Risk Level
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">
                      Review Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-textSecondary uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y dark:divide-gray-700">
                  {scans.length === 0 ? (
                    <tr>
                      <td
                        colSpan="6" // Updated colSpan
                        className="px-6 py-8 text-center text-textSecondary"
                      >
                        No patient scans found. Click "Upload New Scan" to begin.
                      </td>
                    </tr>
                  ) : (
                    scans.map((scan) => (
                      <tr key={scan.internalId} className="hover:bg-background">
                        <td className="px-6 py-4 whitespace-nowrap font-medium text-textPrimary">
                          {scan.patientId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-textSecondary">
                          {scan.scanDate}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-textSecondary">
                          <a
                            href={scan.scanImageUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primaryAccent hover:text-opacity-80 flex items-center gap-1"
                          >
                            View Scan <FaExternalLinkAlt size={12} />
                          </a>
                        </td>
                        {/* New Data Cells */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge
                            text={scan.riskLevel}
                            color={
                              scan.riskLevel === "High" ? "red" :
                              scan.riskLevel === "Medium" ? "yellow" :
                              scan.riskLevel === "Low" ? "green" : "gray"
                            }
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                           <Badge
                            text={scan.reviewStatus}
                            color={
                              scan.reviewStatus === "Pending" ? "yellow" : "blue"
                            }
                          />
                        </td>
                        {/* New Action Button */}
                        <td className="px-6 py-4 whitespace-nowrap text-right font-medium flex justify-end items-center gap-4">
                          <button
                            onClick={() => handleViewClick(scan)}
                            title="View Details"
                            className="text-green-500 hover:text-green-700 transition-colors duration-200"
                          >
                            <FaEye />
                          </button>
                          <button
                            onClick={() => handleReviewClick(scan)}
                            title="Update Status"
                            className="text-yellow-500 hover:text-yellow-700 transition-colors duration-200"
                          >
                            <FaClipboardCheck />
                          </button>
                          <button
                            onClick={() => handleEditClick(scan)}
                            title="Edit Scan"
                            className="text-blue-500 hover:text-blue-700 transition-colors duration-200"
                          >
                            <FaPencilAlt />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(scan.internalId)}
                            title="Delete Scan"
                            className="text-red-500 hover:text-red-700 transition-colors duration-200"
                          >
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Dashboard;