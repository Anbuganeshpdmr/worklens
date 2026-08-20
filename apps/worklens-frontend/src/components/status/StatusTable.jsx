
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
                                    ✎
                                </button>

                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>

    );

}

