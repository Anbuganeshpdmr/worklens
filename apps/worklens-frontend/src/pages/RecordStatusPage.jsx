
import { useState } from "react";

import RecordStatusRecords from "./RecordStatusRecords";
import StatusPage from "./StatusPage";

import "../styles/RecordStatus.css";

export default function RecordStatusPage() {
    const [activeTab, setActiveTab] = useState("records");

    return (
        <div className="record-status-shell">

            <main className="record-status-main">

                <div className="record-status-page">

                    {/* HEADER */}

                    <div className="record-status-header">

                        <div>
                            <h1>Record Status</h1>

                            <p>
                                Manage status and availability
                                for different records in the system.
                            </p>
                        </div>

                    </div>


                    {/* TABS */}

                    <div className="record-status-tabs">

                        <button
                            className={`tab ${activeTab === "records"
                                    ? "active"
                                    : ""
                                }`}
                            onClick={() =>
                                setActiveTab("records")
                            }
                        >
                            Records
                        </button>


                        <button
                            className={`tab ${activeTab === "status"
                                    ? "active"
                                    : ""
                                }`}
                            onClick={() =>
                                setActiveTab("status")
                            }
                        >
                            Status
                        </button>

                    </div>


                    {/* TAB CONTENT */}

                    {activeTab === "records" && (
                        <RecordStatusRecords />
                    )}

                    {activeTab === "status" && (
                        <StatusPage />
                    )}

                </div>

            </main>

        </div>
    );
}
