
const StatusTable = ({ statuses, onEdit, onApplicableChange }) => {
    return (
        <table className="status-table">
            <thead>
                <tr>
                    <th>Applicable</th>
                    <th>Display Name</th>
                    <th>Colour</th>
                    <th>Action</th>
                </tr>
            </thead>

            <tbody>
                {statuses.map((status) => (
                    <tr key={status.statusId}>
                        <td>
                            <input
                                type="checkbox"
                                checked={status.applicable}
                                readOnly
                                disabled
                            />
                        </td>

                        <td>{status.displayName}</td>

                        <td>
                            <span
                                className="status-colour"
                                style={{
                                    backgroundColor: status.colourCode,
                                }}
                            />
                        </td>

                        <td>
                            <button
                                type="button"
                                onClick={() => onEdit(status)}
                                aria-label={`Edit ${status.displayName}`}
                            >
                                <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M12 20h9" />
                                    <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
                                </svg>
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default StatusTable;

