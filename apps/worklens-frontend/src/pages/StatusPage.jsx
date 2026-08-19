
import { useEffect, useState } from "react";

import {
    getAllStatuses,
    updateStatus
} from "../api/recordStatus";

import StatusTable
    from "../components/status/StatusTable";

import StatusForm
    from "../components/status/StatusForm";

import "../styles/Status.css";


export default function StatusPage() {

    const [statuses, setStatuses] = useState([]);

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    const [editingStatus, setEditingStatus] =
        useState(null);

    const [saving, setSaving] = useState(false);


    /*
     * GET /status/all
     */
    const loadStatuses = async () => {

        try {

            setLoading(true);
            setError("");

            const data = await getAllStatuses();

            console.log(
                "GET /status/all",
                data
            );

            setStatuses(
                Array.isArray(data)
                    ? data
                    : []
            );

        } catch (err) {

            console.error(
                "Failed to load statuses:",
                err
            );

            setStatuses([]);

            setError(
                err.message ||
                "Failed to load statuses."
            );

        } finally {

            setLoading(false);

        }
    };


    /*
     * Load statuses when page opens
     */
    useEffect(() => {

        loadStatuses();

    }, []);


    /*
     * Open edit modal
     */
    const handleEdit = (status) => {

        setError("");

        setEditingStatus({
            ...status
        });

    };


    /*
     * Close edit modal
     */
    const handleCancel = () => {

        setEditingStatus(null);

    };


    /*
     * Change Name / Colour
     */
    const handleChange = (
        field,
        value
    ) => {

        setEditingStatus(
            previous => ({
                ...previous,
                [field]: value
            })
        );

    };


    /*
     * Save edited status
     *
     * PUT /status/{id}
     */
    const handleSave = async () => {

        if (!editingStatus) {
            return;
        }


        try {

            setSaving(true);
            setError("");


            const payload = {

                name:
                    editingStatus.name,

                colourCode:
                    editingStatus.colourCode

            };


            console.log(
                `PUT /status/${editingStatus.id}`,
                payload
            );


            const updatedStatus =
                await updateStatus(
                    editingStatus.id,
                    payload
                );


            console.log(
                "Updated status:",
                updatedStatus
            );


            /*
             * Update table immediately
             */
            setStatuses(
                previous =>
                    previous.map(status =>
                        status.id === editingStatus.id
                            ? updatedStatus
                            : status
                    )
            );


            /*
             * Close modal
             */
            setEditingStatus(null);


        } catch (err) {

            console.error(
                "Failed to update status:",
                err
            );

            setError(
                err.message ||
                "Failed to update status."
            );

        } finally {

            setSaving(false);

        }

    };


    return (

        <div className="status-page">

            {/* =========================
                HEADER
            ========================= */}

            <div className="status-page-header">

                <div>

                    <h2>
                        Status
                    </h2>

                    <p>
                        Manage statuses used across
                        the system.
                    </p>

                </div>


                <button
                    className="status-refresh-button"
                    onClick={loadStatuses}
                    disabled={loading}
                >
                    ↻ Refresh
                </button>

            </div>


            {/* =========================
                ERROR
            ========================= */}

            {error && (

                <div className="error-message">
                    {error}
                </div>

            )}


            {/* =========================
                CONTENT
            ========================= */}

            {loading ? (

                <p>
                    Loading statuses...
                </p>

            ) : statuses.length === 0 ? (

                <p>
                    No statuses available.
                </p>

            ) : (

                <StatusTable
                    statuses={statuses}
                    onEdit={handleEdit}
                />

            )}


            {/* =========================
                EDIT MODAL
            ========================= */}

            {editingStatus && (

                <StatusForm

                    status={editingStatus}

                    onChange={handleChange}

                    onSave={handleSave}

                    onCancel={handleCancel}

                    saving={saving}

                />

            )}

        </div>

    );

}

