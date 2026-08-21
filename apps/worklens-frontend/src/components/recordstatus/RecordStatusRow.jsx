export default function RecordStatusRow({
    status,
    onDefaultChange,
    onAllowedChange
}) {
    return (
        <div
            className="record-row"
            data-id={status.recordStatusId}
        >

            <span>
                {status.statusName}
            </span>


            <span>

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

            </span>


            <span>

                <input
                    type="checkbox"
                    checked={!!status.allowed}
                    onChange={() =>
                        onAllowedChange(
                            status.recordStatusId
                        )
                    }
                />

            </span>


            <span>

                <span
                    className="status-color"
                    style={{
                        backgroundColor:
                            status.colourCode
                    }}
                />

            </span>

        </div>
    );
}