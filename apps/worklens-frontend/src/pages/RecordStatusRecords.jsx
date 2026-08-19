
import { useEffect, useState } from "react";

import RecordStatusTable
    from "../components/recordstatus/RecordStatusTable";

import RecordStatusForm
    from "../components/recordstatus/RecordStatusForm";

import {
    getRecordStatuses,
    updateRecordStatuses
} from "../api/recordStatus";


export default function RecordStatusRecords() {

    const recordTypes = [
        "PROJECT",
        "SPRINT",
        "ACTIVITY",
        "ENTRY",
        "MEMBER"
    ];


    const [expandedRecord, setExpandedRecord] =
        useState(null);

    const [statuses, setStatuses] =
        useState([]);

    const [loading, setLoading] =
        useState(false);

    const [saving, setSaving] =
        useState(false);

    const [saved, setSaved] =
        useState(false);

    const [error, setError] =
        useState("");


    /* =========================
       LOAD RECORD STATUSES
    ========================= */

    const loadStatuses = async (recordName) => {

        try {

            setLoading(true);
            setError("");

            const data =
                await getRecordStatuses(recordName);

            console.log(
                `GET /records/${recordName}`,
                data
            );


            if (!Array.isArray(data)) {

                setStatuses([]);

                return;
            }


            /*
             * Keep colourCode exactly as returned
             * by backend.
             *
             * No colours are defined here.
             */

            const formattedStatuses =
                data.map(status => ({

                    ...status,

                    allowed:
                        !!(
                            status.allowed ??
                            status.isAllowed
                        ),

                    default:
                        !!(
                            status.default ??
                            status.isDefault
                        ),

                    /*
                     * Backend colour
                     */
                    colourCode:
                        status.colourCode

                }));


            console.log(
                "Formatted record statuses:",
                formattedStatuses
            );


            setStatuses(
                formattedStatuses
            );

        } catch (err) {

            console.error(
                `Failed to load ${recordName}:`,
                err
            );

            setStatuses([]);

            setError(
                err.message ||
                `Failed to load ${recordName}`
            );

        } finally {

            setLoading(false);

        }

    };


    /* =========================
       INITIAL LOAD
    ========================= */

    useEffect(() => {

        const firstRecord =
            recordTypes[0];

        setExpandedRecord(
            firstRecord
        );

        loadStatuses(
            firstRecord
        );

    }, []);


    /* =========================
       RECORD OPEN / CLOSE
    ========================= */

    const handleRecordClick = async (
        recordName
    ) => {

        if (
            expandedRecord ===
            recordName
        ) {

            setExpandedRecord(null);

            setStatuses([]);

            return;
        }


        setExpandedRecord(
            recordName
        );

        await loadStatuses(
            recordName
        );

    };


    /* =========================
       DEFAULT CHANGE
    ========================= */

    const handleDefaultChange = (
        statusId
    ) => {

        setSaved(false);

        setStatuses(previous =>

            previous.map(status => {

                if (
                    status.recordStatusId ===
                    statusId
                ) {

                    return {
                        ...status,

                        allowed: true,

                        default: true
                    };

                }


                return {
                    ...status,

                    default: false
                };

            })

        );

    };


    /* =========================
       AVAILABLE CHANGE
    ========================= */

    const handleAllowedChange = (
        statusId
    ) => {

        setSaved(false);

        setStatuses(previous =>

            previous.map(status => {

                if (
                    status.recordStatusId !==
                    statusId
                ) {

                    return status;
                }


                /*
                 * Default status cannot
                 * become unavailable.
                 */

                if (
                    status.default
                ) {

                    return status;
                }


                return {

                    ...status,

                    allowed:
                        !status.allowed

                };

            })

        );

    };


    /* =========================
       SAVE
    ========================= */

    const handleSave = async () => {

        if (!expandedRecord) {
            return;
        }


        try {

            setSaving(true);

            setSaved(false);

            setError("");


            const payload =
                statuses.map(status => ({

                    allowed:
                        !!status.allowed,

                    default:
                        !!status.default,

                    id:
                        status.recordStatusId

                }));


            console.log(
                `PUT /records/${expandedRecord}`,
                payload
            );


            await updateRecordStatuses(
                expandedRecord,
                payload
            );


            setSaved(true);


        } catch (err) {

            console.error(
                "Failed to save record status:",
                err
            );

            setError(
                err.message ||
                "Failed to save record status."
            );

        } finally {

            setSaving(false);

        }

    };


    /* =========================
       UI
    ========================= */

    return (

        <div className="record-status-content">


            {/* =========================
                HEADER
            ========================= */}

            <div className="record-status-content-header">

                <h2>
                    Records
                </h2>


                <button
                    className="refresh-button"
                    onClick={() => {

                        if (
                            expandedRecord
                        ) {

                            loadStatuses(
                                expandedRecord
                            );

                        }

                    }}
                    disabled={loading}
                >

                    ↻ Refresh

                </button>

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
                RECORD TYPES
            ========================= */}

            {recordTypes.map(
                recordName => (

                    <div
                        className="record-card"
                        key={recordName}
                    >


                        {/* RECORD HEADER */}

                        <div
                            className="record-card-header"
                            onClick={() =>
                                handleRecordClick(
                                    recordName
                                )
                            }
                        >

                            <h3>
                                {recordName}
                            </h3>


                            <span>

                                {
                                    expandedRecord ===
                                    recordName

                                        ? "⌃"

                                        : "⌄"
                                }

                            </span>

                        </div>


                        {/* RECORD BODY */}

                        {
                            expandedRecord ===
                            recordName && (

                                <div className="record-card-body">


                                    {/* LOADING */}

                                    {loading ? (

                                        <p>
                                            Loading...
                                        </p>

                                    )


                                    /* NO DATA */

                                    : statuses.length === 0 ? (

                                        <p>
                                            No statuses available.
                                        </p>

                                    )


                                    /* DATA */

                                    : (

                                        <>

                                            <RecordStatusTable
                                                statuses={
                                                    statuses
                                                }
                                                onDefaultChange={
                                                    handleDefaultChange
                                                }
                                                onAllowedChange={
                                                    handleAllowedChange
                                                }
                                            />


                                            <RecordStatusForm
                                                onSave={
                                                    handleSave
                                                }
                                                onClose={() => {

                                                    setExpandedRecord(
                                                        null
                                                    );

                                                    setStatuses(
                                                        []
                                                    );

                                                }}
                                                saving={
                                                    saving
                                                }
                                                saved={
                                                    saved
                                                }
                                            />

                                        </>

                                    )}

                                </div>

                            )
                        }

                    </div>

                )
            )}

        </div>

    );

}

