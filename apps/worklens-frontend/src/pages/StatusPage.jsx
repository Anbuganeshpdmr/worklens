import { useEffect, useState } from "react";

import {
    getStatuses,
    getRecordTypes,
    createStatus,
    updateStatus
} from "../api/status";

import StatusTable from "../components/status/StatusTable";
import StatusForm from "../components/status/StatusForm";
import "../styles/Status.css";

const StatusPage = () => {
    const [recordTypes, setRecordTypes] = useState([]);
    const [statuses, setStatuses] = useState([]);
    const [expandedRecordTypes, setExpandedRecordTypes] = useState({});
    const [loading, setLoading] = useState(false);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState("new");
    const [selectedStatus, setSelectedStatus] = useState(null);

    const [toast, setToast] = useState("");

    const loadData = async () => {
        setLoading(true);

        const [types, statusData] = await Promise.all([
            getRecordTypes(),
            getStatuses()
        ]);

        setRecordTypes(types);
        setStatuses(statusData);

        setLoading(false);
    };

    useEffect(() => {
        loadData();
    }, []);

    const toggleRecordType = (recordType) => {
        setExpandedRecordTypes((previous) => ({
            ...previous,
            [recordType]: !previous[recordType]
        }));
    };

    const getStatusesForRecordType = (recordType) => {
        return statuses.filter((status) => {
            const statusRecordType = status.uniqueName.split("_");

            return statusRecordType.slice(0, -1).join("_") === recordType;
        });
    };

    const handleNewStatus = () => {
        setSelectedStatus(null);
        setModalMode("new");
        setIsModalOpen(true);
    };

    const handleEdit = (status) => {
        setSelectedStatus(status);
        setModalMode("edit");
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedStatus(null);
    };

    const showToast = (message) => {
        setToast(message);

        setTimeout(() => {
            setToast("");
        }, 3000);
    };

    return (
        <div className="status-page">

            {toast && (
                <div className="status-toast">
                    {toast}
                </div>
            )}

            <div className="status-page-header">
                <h1>Status Management</h1>

                <div className="status-page-actions">
                    <button
                        type="button"
                        onClick={handleNewStatus}
                    >
                        + New
                    </button>

                    <button
                        type="button"
                        onClick={loadData}
                    >
                        Refresh
                    </button>
                </div>
            </div>

            {loading ? (
                <p>Loading...</p>
            ) : (
                recordTypes.map((recordType) => (
                    <div
                        className="status-record-section"
                        key={recordType}
                    >
                        <button
                            type="button"
                            className="status-record-header"
                            onClick={() =>
                                toggleRecordType(recordType)
                            }
                        >
                            <span>
                                {expandedRecordTypes[recordType]
                                    ? "⌄"
                                    : "›"}
                            </span>

                            <span>
                                {recordType}
                            </span>
                        </button>

                        {expandedRecordTypes[recordType] && (
                            <StatusTable
                                statuses={getStatusesForRecordType(
                                    recordType
                                )}
                                onEdit={handleEdit}
                            />
                        )}
                    </div>
                ))
            )}

            <StatusForm
                isOpen={isModalOpen}
                mode={modalMode}
                status={selectedStatus}
                recordTypes={recordTypes}
                onClose={handleCloseModal}
                onSave={async (data) => {
                    console.log("Status form data:", data);

                    if (modalMode === "edit") {
                        await updateStatus(data);
                        showToast("Status updated successfully");
                    } else {
                        await createStatus(data);
                        showToast("Status created successfully");
                    }

                    await loadData();
                    handleCloseModal();
                }}
            />

        </div>
    );
};

export default StatusPage;