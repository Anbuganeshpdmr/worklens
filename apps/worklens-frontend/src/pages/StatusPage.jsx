import { useEffect, useState } from "react";

import {
    getAllStatuses,
    updateStatus,
    createStatus
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

    const [addingStatus, setAddingStatus] =
        useState(false);

    const [saving, setSaving] = useState(false);

    const [addingStatusForm, setAddingStatusForm] =
        useState({
            name: "",
            colourCode: ""
        });


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
     * Open add modal
     */
    const handleAdd = () => {

        setError("");

        setAddingStatusForm({
            name: "",
            colourCode: ""
        });

        setAddingStatus(true);
    };

    /*
     * Close modal
     */
    const handleCancel = () => {

        setEditingStatus(null);
        setAddingStatus(false);

    };


    /*
     * Change edit form
     */
    const handleEditChange = (
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
     * Change add form
     */
    const handleAddChange = (
        field,
        value
    ) => {

        setAddingStatusForm(
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

            setStatuses(
                previous =>
                    previous.map(status =>
                        status.id === editingStatus.id
                            ? updatedStatus
                            : status
                    )
            );

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


    /*
     * Create new status
     *
     * POST /status
     */
    const handleCreate = async () => {

        if (!addingStatusForm.name.trim()) {

            setError(
                "Status name is required."
            );

            return;
        }

        try {

            setSaving(true);
            setError("");

            const payload = {

                name:
                    addingStatusForm.name.trim(),

                colourCode:
                    addingStatusForm.colourCode

            };

            console.log(
                "POST /status",
                payload
            );

            const newStatus =
                await createStatus(
                    payload
                );

            console.log(
                "Created status:",
                newStatus
            );

            setStatuses(
                previous => [
                    ...previous,
                    newStatus
                ]
            );

            setAddingStatus(false);

            setAddingStatusForm({
                name: "",
                colourCode: ""
            });

        } catch (err) {

            console.error(
                "Failed to create status:",
                err
            );

            setError(
                err.message ||
                "Failed to create status."
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


                <div className="status-page-actions">

                    <button
                        className="add-status-button"
                        onClick={handleAdd}
                        type="button"
                    >
                        + Add Status
                    </button>


                    <button
                        className="refresh-button"
                        onClick={loadStatuses}
                        disabled={loading}
                        type="button"
                    >

                        <span
                            className="refresh-icon"
                            aria-hidden="true"
                        ></span>

                        <span>
                            Refresh
                        </span>

                    </button>

                </div>

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

                    title="Edit Status"

                    onChange={handleEditChange}

                    onSave={handleSave}

                    onCancel={handleCancel}

                    saving={saving}

                />

            )}


            {/* =========================
                ADD MODAL
            ========================= */}

            {addingStatus && (

                <StatusForm

                    status={addingStatusForm}

                    title="Add Status"

                    onChange={handleAddChange}

                    onSave={handleCreate}

                    onCancel={handleCancel}

                    saving={saving}

                />

            )}

        </div>

    );

}