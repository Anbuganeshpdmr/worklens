export default function RecordStatusForm({
    onSave,
    onClose,
    saving,
    saved
}) {
    return (
        <div className="record-actions">

            <button
                className="save-button"
                onClick={onSave}
                disabled={saving}
            >
                {saving
                    ? "Saving..."
                    : saved
                        ? "✓ Saved"
                        : "Save"}
            </button>

            <button
                className="close-button"
                onClick={onClose}
            >
                Close
            </button>

        </div>
    );
}