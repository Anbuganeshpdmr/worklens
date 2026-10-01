const TypeTable = ({ types, onEdit }) => {
    return (
        <table className="category-type-table">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Colour</th>
                    <th>Action</th>
                </tr>
            </thead>

            <tbody>
                {types.map((type) => (
                    <tr key={type.id}>
                        <td>{type.name}</td>

                        <td>
                            <span
                                className="category-colour"
                                style={{
                                    backgroundColor: type.colourCode,
                                }}
                            />
                        </td>

                        <td>
                            <button
                                type="button"
                                className="category-edit-button"
                                onClick={() => onEdit(type)}
                                title="Edit"
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

export default TypeTable;