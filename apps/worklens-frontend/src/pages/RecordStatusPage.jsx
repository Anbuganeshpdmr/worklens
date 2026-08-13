import "../styles/RecordStatus.css";

import {
  getRecordTypes,
  getRecordStatuses,
  updateRecordStatuses,
} from "../api/recordStatus";

import { useEffect, useState, useRef } from "react";


function RecordStatusPage() {
   console.log("RecordStatusPage is running");

  const [activeTab, setActiveTab] = useState("Records");

  const [recordTypes, setRecordTypes] = useState([]);

  const [expandedRecord, setExpandedRecord] = useState(null);

  const [recordStatuses, setRecordStatuses] = useState([]);

  const [loading, setLoading] = useState(false);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [toastSuccess, setToastSuccess] = useState({ show: false, message: "" });
  const [toastError, setToastError] = useState({ show: false, message: "" });
  const [banner, setBanner] = useState({ show: false, type: "", message: "" });
  const toastTimerRef = useRef(null);
  const [saved, setSaved] = useState(false);
  const savedTimerRef = useRef(null);


  // Load record types when page opens
  useEffect(() => {
      console.log("PROJECT API call starting");
    loadRecordTypes();
  }, []);


  // Get all record types from backend
  const loadRecordTypes = async () => {
    console.log("loadRecordTypes called");
    try {
      setLoading(true);
      setError("");

      const data = await getRecordTypes();
      console.log("API response:", data);

      setRecordTypes(data);

      // Open the first record automatically
      if (data.length > 0) {
        setExpandedRecord(data[0]);
        await loadRecordStatuses(data[0]);
      }

    } catch (error) {
      console.error("Error loading record types:", error);
      setError("Failed to load record types.");
    } finally {
      setLoading(false);
    }
  };


  // Get statuses for selected record
  const loadRecordStatuses = async (recordName) => {
    try {
      setLoading(true);
      setError("");

      const data = await getRecordStatuses(recordName);

      setRecordStatuses(data);

    } catch (error) {
      console.error("Error loading record statuses:", error);
      setError("Failed to load record statuses.");
    } finally {
      setLoading(false);
    }
  };


  // Expand / collapse record
  const toggleRecord = async (recordName) => {

    if (expandedRecord === recordName) {
      setExpandedRecord(null);
      setRecordStatuses([]);
      return;
    }

    setExpandedRecord(recordName);

    await loadRecordStatuses(recordName);
  };


  // Change default status
  const handleDefaultChange = (id) => {

    setRecordStatuses((previousStatuses) =>
      previousStatuses.map((status) => ({
        ...status,
        isDefault:
          status.recordStatusId === id,
      }))
    );

  };


  // Change allowed status
  const handleAllowedChange = (id) => {

    setRecordStatuses((previousStatuses) =>
      previousStatuses.map((status) =>
        status.recordStatusId === id
          ? {
              ...status,
              isAllowed: !status.isAllowed,
            }
          : status
      )
    );

  };


  // Save status changes
  const handleSave = async () => {
  console.log("========== SAVE CLICKED ==========");

  console.log("Expanded Record:", expandedRecord);
  console.log("Current statuses:", recordStatuses);

  const payload = recordStatuses.map((status) => ({
    id: status.recordStatusId,
    isAllowed: status.isAllowed,
    isDefault: status.isDefault,
  }));

  console.log("PUT Payload:", payload);

  try {
    setSaving(true);
    setError("");

    console.log("Calling updateRecordStatuses...");

    const response = await updateRecordStatuses(
      expandedRecord,
      payload
    );

    console.log("PUT Response:", response);

    // Show stable success feedback (toast + banner)
    try {
      showSuccess("Record status saved successfully.");
      // show saved indicator briefly
      setSaved(true);
      if (savedTimerRef.current) clearTimeout(savedTimerRef.current);
      savedTimerRef.current = setTimeout(() => setSaved(false), 2500);
    } catch (e) {
      // Fallback: set basic state
      setToastSuccess({ show: true, message: "Record status saved successfully." });
      setSaved(true);
      if (savedTimerRef.current) clearTimeout(savedTimerRef.current);
      savedTimerRef.current = setTimeout(() => setSaved(false), 2500);
    }

    await loadRecordStatuses(expandedRecord);

  } catch (error) {
    console.error("SAVE ERROR:", error);
    console.error("Response:", error.response);
    console.error("Response data:", error.response?.data);

    const msg =
      error.response?.data?.message ||
      "Failed to save record statuses.";

    setError(msg);
    try {
      showError(msg);
    } catch (e) {
      setToastError({ show: true, message: msg });
    }

  } finally {
    setSaving(false);
  }
};


  // Refresh current record
  const handleRefresh = () => {

    if (expandedRecord) {
      loadRecordStatuses(expandedRecord);
    } else {
      loadRecordTypes();
    }

  };


  // Unified show/hide helpers to ensure reliable feedback
  const showSuccess = (message) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToastSuccess({ show: true, message });
    setToastError({ show: false, message: "" });
    setBanner({ show: true, type: "success", message });
    toastTimerRef.current = setTimeout(() => {
      setToastSuccess({ show: false, message: "" });
      setBanner({ show: false, type: "", message: "" });
      toastTimerRef.current = null;
    }, 3000);
  };

  const showError = (message) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToastError({ show: true, message });
    setToastSuccess({ show: false, message: "" });
    setBanner({ show: true, type: "error", message });
    toastTimerRef.current = setTimeout(() => {
      setToastError({ show: false, message: "" });
      setBanner({ show: false, type: "", message: "" });
      toastTimerRef.current = null;
    }, 4000);
  };

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
      if (savedTimerRef.current) clearTimeout(savedTimerRef.current);
    };
  }, []);


  return (
    <div className="record-status-page">

      {/* Header */}
      <div className="record-status-header">

        <div>

          <h1>
            Record Status
          </h1>

          <p>
            Manage status and availability for different records in the system.
          </p>

        </div>


        <button
          className="refresh-button"
          onClick={handleRefresh}
          disabled={loading}
        >
          ↻ Refresh
        </button>

      </div>


      {/* Tabs */}
      <div className="record-status-tabs">

        {/* Inline banner fallback for reliable feedback */}
        {banner.show && (
          <div className={`rs-banner ${banner.type === 'error' ? 'rs-banner-error' : 'rs-banner-success'}`}>
            {banner.message}
          </div>
        )}

        <button
          className={`tab ${
            activeTab === "Records"
              ? "active"
              : ""
          }`}
          onClick={() => setActiveTab("Records")}
        >
          Records
        </button>


        <button
          className={`tab ${
            activeTab === "Status"
              ? "active"
              : ""
          }`}
          onClick={() => setActiveTab("Status")}
        >
          Status
        </button>

      </div>


      {/* Records Tab */}
      {activeTab === "Records" && (

        <div className="record-status-content">

          <h2>
            Records
          </h2>


          {/* Error message */}
          {error && (
            <p className="error-message">
              {error}
            </p>
          )}


          {/* Loading records */}
          {loading && recordTypes.length === 0 && (
            <p>
              Loading records...
            </p>
          )}


          {/* Record cards */}
          {recordTypes.map((record) => (

            <div
              className="record-card"
              key={record}
            >

              {/* Record Header */}
              <div
                className="record-card-header"
                onClick={() =>
                  toggleRecord(record)
                }
              >

                <h3>
                  {record}
                </h3>


                <span className="expand-icon">
                  {expandedRecord === record
                    ? "⌃"
                    : "⌄"}
                </span>

              </div>


              {/* Expanded Record */}
              {expandedRecord === record && (

                <div className="record-card-body">

                  {loading ? (

                    <p>
                      Loading statuses...
                    </p>

                  ) : (

                    <>

                      <div className="record-table">

                        {/* Table Header */}
                        <div className="record-table-header">

                          <span>
                            Name
                          </span>

                          <span>
                            Default
                          </span>

                          <span>
                            Available
                          </span>

                          <span>
                            Colour
                          </span>

                        </div>


                        {/* Status Rows */}
                        {recordStatuses.map((status) => (

                          <div
                            className="record-row"
                            key={status.recordStatusId}
                          >

                            {/* Status Name */}
                            <span>
                              {status.statusName}
                            </span>


                            {/* Default */}
                            <span>

                              <input
                                type="radio"
                                name={`defaultStatus-${record}`}
                                checked={status.isDefault}
                                onChange={() =>
                                  handleDefaultChange(
                                    status.recordStatusId
                                  )
                                }
                              />

                            </span>


                            {/* Available */}
                            <span>

                              <input
                                type="checkbox"
                                checked={status.isAllowed}
                                onChange={() =>
                                  handleAllowedChange(
                                    status.recordStatusId
                                  )
                                }
                              />

                            </span>


                            {/* Colour */}
                            <span>

                              <span
                                className="status-color"
                                style={{
                                  backgroundColor:
                                    status.colourCode,
                                }}
                              />

                            </span>

                          </div>

                        ))}

                      </div>


                      {/* Actions */}
                      <div className="record-actions">

                        <button
                          className="save-button"
                          onClick={() => {
                            console.log("SAVE BUTTON CLICKED");
                            handleSave();
                          }}
                          disabled={saving}
                        >
                          {saving ? (
                            <>
                              <span className="spinner-border spinner-border-sm text-white me-2" role="status" aria-hidden="true"></span>
                              Saving...
                            </>
                          ) : saved ? (
                            <span className="saved-indicator">✓ Saved</span>
                          ) : (
                            "Save"
                          )}
                        </button>


                        <button
                          className="close-button"
                          onClick={() => {
                            setExpandedRecord(null);
                            setRecordStatuses([]);
                          }}
                        >
                          Close
                        </button>

                      </div>

                    </>

                  )}

                </div>

              )}

            </div>

          ))}

        </div>

      )}


      {/* Status Tab */}
      {activeTab === "Status" && (

        <div className="status-tab-content">

          <h2>
            Status
          </h2>

          <p>
            Status configuration will be available here.
          </p>

        </div>

      )}

      {/* Toast */}
      <div className="toast-container position-fixed bottom-0 end-0 p-3">
        {toastSuccess.show && (
          <div className="toast show align-items-center text-white bg-success border-0 mb-2" role="status">
            <div className="d-flex">
              <div className="toast-body">{toastSuccess.message}</div>
              <button type="button" className="btn-close btn-close-white me-2 m-auto" aria-label="Close" onClick={() => setToastSuccess({ show: false, message: "" })}></button>
            </div>
          </div>
        )}

        {toastError.show && (
          <div className="toast show align-items-center text-white bg-danger border-0 mb-2" role="alert">
            <div className="d-flex">
              <div className="toast-body">{toastError.message}</div>
              <button type="button" className="btn-close btn-close-white me-2 m-auto" aria-label="Close" onClick={() => setToastError({ show: false, message: "" })}></button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}


export default RecordStatusPage;
