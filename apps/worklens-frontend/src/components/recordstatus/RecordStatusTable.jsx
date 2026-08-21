export default function RecordStatusTable({
    statuses,
    onDefaultChange,
    onAllowedChange
}) {
    return (
        <div className="record-status-table-wrapper">

            <table className="record-status-table">

                <thead>
                    <tr>
                        <th>Status</th>
                        <th>Available</th>
                        <th>Default</th>
                        <th>Colour</th>
                    </tr>
                </thead>

                <tbody>

                    {statuses.map((status) => (

                        <tr key={status.recordStatusId}>

                            {/* STATUS NAME */}
                            <td>
                                {status.statusName}
                            </td>

                            {/* AVAILABLE */}
                            <td>
                                <input
                                    type="checkbox"
                                    checked={!!status.allowed}
                                    onChange={() =>
                                        onAllowedChange(
                                            status.recordStatusId
                                        )
                                    }
                                />
                            </td>

                            {/* DEFAULT */}
                            <td>
                                <input
                                    type="radio"
                                    name="defaultStatus"
                                    checked={!!status.default}
                                    onChange={() =>
                                        onDefaultChange(
                                            status.recordStatusId
                                        )
                                    }
                                />
                            </td>

                            {/* COLOUR - ONLY DISPLAY THE COLOUR */}
                            <td>
                                <span
                                    className="record-status-colour"
                                    style={{
                                        backgroundColor:
                                            status.colourCode
                                    }}
                                />
                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>
    );
}