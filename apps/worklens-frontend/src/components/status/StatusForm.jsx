import { useEffect, useState } from "react";

const StatusForm = ({
    isOpen,
    mode,
    status,
    recordTypes,
    onClose,
    onSave
}) => {
    const isEdit = mode === "edit";

    const [recordName, setRecordName] = useState("");
    const [displayName, setDisplayName] = useState("");
    const [colourCode, setColourCode] = useState("#000000");

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        if (isEdit && status) {
            setRecordName(
                status.uniqueName?.split("_")[0] || ""
            );
            setDisplayName(status.displayName || "");
            setColourCode(status.colourCode || "#000000");
        } else {
            setRecordName(recordTypes?.[0] || "");
            setDisplayName("");
            setColourCode("#000000");
        }
    }, [isOpen, isEdit, status, recordTypes]);

    if (!isOpen) {
        return null;
    }

    const handleSubmit = (event) => {
        event.preventDefault();

        if (isEdit) {
            onSave({
                statusId: status.statusId,
                displayName,
                colourCode
            });

            return;
        }

        onSave({
            recordName,
            displayName,
            colourCode
        });
    };

    return (
        <div className="status-modal-overlay">
            <div className="status-modal">

                <div className="status-modal-header">
                    <h2>
                        {isEdit ? "Edit Status" : "New Status"}
                    </h2>

                    <button
                        type="button"
                        className="status-modal-close"
                        onClick={onClose}
                        aria-label="Close"
                    >
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit}>

                    <div className="status-modal-body">

                        {!isEdit && (
                            <div className="status-form-group">
                                <label>
                                    Record Type
                                </label>

                                <select
                                    value={recordName}
                                    onChange={(event) =>
                                        setRecordName(
                                            event.target.value
                                        )
                                    }
                                    required
                                >
                                    <option value="">
                                        Select Record Type
                                    </option>

                                    {recordTypes.map((type) => (
                                        <option
                                            key={type}
                                            value={type}
                                        >
                                            {type}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        <div className="status-form-group">
                            <label>
                                Status Name
                            </label>

                            <input
                                type="text"
                                value={displayName}
                                onChange={(event) =>
                                    setDisplayName(
                                        event.target.value
                                    )
                                }
                                disabled={
                                    isEdit && status?.mandatory
                                }
                                required
                            />
                        </div>

                        <div className="status-form-group">
                            <label>
                                Colour
                            </label>

                            <div className="status-colour-input">
                                <input
                                    type="color"
                                    value={colourCode}
                                    onChange={(event) =>
                                        setColourCode(
                                            event.target.value
                                        )
                                    }
                                />

                                <span
                                    className="status-colour-preview"
                                    style={{
                                        backgroundColor:
                                            colourCode
                                    }}
                                />
                            </div>
                        </div>

                    </div>

                    <div className="status-modal-footer">

                        <button
                            type="button"
                            className="status-cancel-button"
                            onClick={onClose}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="status-save-button"
                        >
                            {isEdit ? "Update" : "Create"}
                        </button>

                    </div>

                </form>
            </div>
        </div>
    );
};

export default StatusForm;