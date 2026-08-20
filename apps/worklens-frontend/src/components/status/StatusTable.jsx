
export default function StatusTable({
    statuses,
    onEdit
}) {

    return (

        <div className="status-table-wrapper">

            <table className="status-table">

                <thead>

                    <tr>

                        <th>
                            Name
                        </th>

                        <th>
                            Colour
                        </th>

                        <th>
                            Edit
                        </th>

                    </tr>

                </thead>


                <tbody>

                    {statuses.map((status) => (

                        <tr key={status.id}>

                            <td>
                                {status.name}
                            </td>


                            <td>

                                <span
                                    className="status-colour"
                                    style={{
                                        backgroundColor:
                                            status.colourCode
                                    }}
                                    title={
                                        status.colourCode
                                    }
                                />

                            </td>


                            <td>

                                <button
    className="status-edit-button"
    onClick={() =>
        onEdit(status)
    }
    title="Edit"
    type="button"
>
    <svg
        viewBox="0 0 24 24"
        width="16"
        height="16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
    >
        <path d="M13.5 6.5L17.5 10.5" />
        <path d="M4 20h4l10.5-10.5a2.83 2.83 0 0 0-4-4L4 16v4Z" />
    </svg>
</button>
                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>

    );

}

