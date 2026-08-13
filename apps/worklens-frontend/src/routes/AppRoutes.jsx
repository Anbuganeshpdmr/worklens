import { useState } from "react";
import "../styles/RecordStatus.css";

const recordTypes = [
  "PROJECT",
  "SPRINT",
  "ACTIVITY",
  "ENTRY",
  "MEMBER",
];

const projectStatuses = [
  {
    name: "Active",
    isDefault: true,
    available: true,
    color: "active-color",
  },
  {
    name: "Inactive",
    isDefault: false,
    available: true,
    color: "inactive-color",
  },
  {
    name: "Started",
    isDefault: false,
    available: false,
    color: "started-color",
  },
  {
    name: "In Progress",
    isDefault: false,
    available: false,
    color: "progress-color",
  },
  {
    name: "Completed",
    isDefault: false,
    available: true,
    color: "completed-color",
  },
  {
    name: "On Hold",
    isDefault: false,
    available: false,
    color: "hold-color",
  },
  {
    name: "Cancelled",
    isDefault: false,
    available: true,
    color: "cancelled-color",
  },
];

function RecordStatusPage() {
  const [activeTab, setActiveTab] = useState("Records");
  const [expandedRecord, setExpandedRecord] = useState("PROJECT");

  const toggleRecord = (record) => {
    setExpandedRecord(
      expandedRecord === record ? null : record
    );
  };

  return (
    <div className="record-status-page">

      {/* Header */}
      <div className="record-status-header">
        <div>
          <h1>Record Status</h1>

          <p>
            Manage status and availability for different records in the system.
          </p>
        </div>

        <button className="refresh-button">
          ↻ Refresh
        </button>
      </div>

      {/* Tabs */}
      <div className="record-status-tabs">

        <button
          className={`tab ${
            activeTab === "Records" ? "active" : ""
          }`}
          onClick={() => setActiveTab("Records")}
        >
          Records
        </button>

        <button
          className={`tab ${
            activeTab === "Status" ? "active" : ""
          }`}
          onClick={() => setActiveTab("Status")}
        >
          Status
        </button>

      </div>

      {/* Records tab */}
      {activeTab === "Records" && (
        <div className="record-status-content">

          {recordTypes.map((record) => (
            <div
              className="record-card"
              key={record}
            >

              {/* Record header */}
              <div
                className="record-card-header"
                onClick={() => toggleRecord(record)}
              >
                <div>
                  <h3>{record}</h3>

                  {record === "PROJECT" && (
                    <span className="default-label">
                      Default
                    </span>
                  )}
                </div>

                <span className="expand-icon">
                  {expandedRecord === record ? "⌃" : "⌄"}
                </span>
              </div>

              {/* Expanded PROJECT section */}
              {expandedRecord === record && (
                <div className="record-card-body">

                  {record === "PROJECT" ? (
                    <>
                      <div className="record-table">

                        <div className="record-table-header">
                          <span>Name</span>
                          <span>Default</span>
                          <span>Available</span>
                          <span>Colour</span>
                        </div>

                        {projectStatuses.map((status) => (
                          <div
                            className="record-row"
                            key={status.name}
                          >

                            <span>
                              {status.name}
                            </span>

                            <span>
                              <input
                                type="radio"
                                name="defaultStatus"
                                defaultChecked={status.isDefault}
                              />
                            </span>

                            <span>
                              <input
                                type="checkbox"
                                defaultChecked={status.available}
                              />
                            </span>

                            <span>
                              <span
                                className={`status-color ${status.color}`}
                              />
                            </span>

                          </div>
                        ))}

                      </div>

                      <div className="record-actions">

                        <button className="save-button">
                          Save
                        </button>

                        <button className="close-button">
                          Close
                        </button>

                      </div>
                    </>
                  ) : (
                    <div className="empty-record-message">
                      Status configuration for {record} will be available here.
                    </div>
                  )}

                </div>
              )}

            </div>
          ))}

        </div>
      )}

      {/* Status tab */}
      {activeTab === "Status" && (
        <div className="status-tab-content">
          <h2>Status</h2>

          <p>
            Status configuration will be available here.
          </p>
        </div>
      )}

    </div>
  );
}

export default RecordStatusPage;