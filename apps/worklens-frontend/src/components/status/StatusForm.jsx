
export default function StatusForm({
    status,
    onChange,
    onSave,
    onCancel,
    saving
}) {

    return (

        <div className="status-modal-overlay">

            <div className="status-modal">

                {/* MODAL HEADER */}

                <div className="status-modal-header">

                    <h3>
                        Edit Status
                    </h3>

                    <button
                        type="button"
                        className="status-modal-close"
                        onClick={onCancel}
                        disabled={saving}
                    >
                        ×
                    </button>

                </div>


                {/* NAME */}

                <div className="status-form-field">

                    <label>
                        Name
                    </label>

                    <input
                        type="text"
                        value={status.name || ""}
                        onChange={(e) =>
                            onChange(
                                "name",
                                e.target.value
                            )
                        }
                        disabled={saving}
                    />

                </div>


                {/* COLOUR */}

                <div className="status-form-field">

                    <label>
                        Colour
                    </label>

                    <div className="colour-picker-row">

                        <input
                            type="color"
                            value={
                                status.colourCode ||
                                "#000000"
                            }
                            onChange={(e) =>
                                onChange(
                                    "colourCode",
                                    e.target.value
                                )
                            }
                            disabled={saving}
                        />

                        <span
                            className="selected-colour"
                            style={{
                                backgroundColor:
                                    status.colourCode
                            }}
                        />

                    </div>

                </div>


                {/* BOTTOM BUTTONS */}

                <div className="status-form-actions">

                    <button
                        type="button"
                        className="status-cancel-button"
                        onClick={onCancel}
                        disabled={saving}
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        className="status-save-button"
                        onClick={onSave}
                        disabled={saving}
                    >
                        {saving
                            ? "Saving..."
                            : "Save"}
                    </button>

                </div>

            </div>

        </div>

    );
}

