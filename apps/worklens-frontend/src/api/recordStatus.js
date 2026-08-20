
import apiClient from "./axios";
import sidebar from "../components/Sidebar";

/*
 * Common API response/error handler
 */
async function handleRequest(promise) {

    try {

        const response = await promise;

        /*
         * Some backend responses return:
         * { statuses: [...] }
         */
        if (response?.data?.statuses) {
            return response.data.statuses;
        }

        return response?.data ?? response;

    } catch (error) {

        if (error.response) {

            const status = error.response.status;

            if (status === 401 || status === 403) {

                throw new Error(
                    "Session expired. Please log in again."
                );
            }

            if (status >= 500) {

                throw new Error(
                    "Server error. Please try again later."
                );
            }

            throw new Error(
                error.response.data?.message ||
                "Request failed."
            );
        }

        if (error.request) {

            throw new Error(
                "Unable to reach the server. Please check your network connection."
            );
        }

        throw new Error(
            error?.message ||
            "Unexpected error"
        );
    }
}


/* =========================================================
   RECORD STATUS APIs
   ========================================================= */


/*
 * GET /records/{recordName}
 *
 * Example:
 * /records/PROJECT
 * /records/SPRINT
 * /records/ACTIVITY
 * /records/ENTRY
 * /records/MEMBER
 */
export const getRecordStatuses = async (
    recordName
) => {

    return handleRequest(
        apiClient.get(
            `/records/${encodeURIComponent(recordName)}`
        )
    );
};


/*
 * PUT /records/{recordName}
 *
 * Updates the allowed/default status mapping
 * for a record type.
 */
export const updateRecordStatuses = async (
    recordName,
    statuses
) => {

    return handleRequest(
        apiClient.put(
            `/records/${encodeURIComponent(recordName)}`,
            statuses
        )
    );
};


/*
 * GET /records/{recordName}/allowed
 *
 * Returns only allowed statuses.
 */
export const getAllowedRecordStatuses = async (
    recordName
) => {

    return handleRequest(
        apiClient.get(
            `/records/${encodeURIComponent(recordName)}/allowed`
        )
    );
};


/* =========================================================
   STATUS APIs
   ========================================================= */


/*
 * GET /status/all
 *
 * Returns all master statuses.
 *
 * Response example:
 *
 * [
 *   {
 *     id: 1,
 *     name: "InActive",
 *     colourCode: "#005401"
 *   }
 * ]
 */
export const getAllStatuses = async () => {

    return handleRequest(
        apiClient.get("/status/all")
    );
};


/*
 * POST /status
 *
 * Create a new status.
 *
 * Body:
 *
 * {
 *   name: "Completed",
 *   colourCode: "#0054e1"
 * }
 */
export const createStatus = async (
    status
) => {

    return handleRequest(
        apiClient.post(
            "/status",
            {
                name: status.name,
                colourCode: status.colourCode
            }
        )
    );
};


/*
 * PUT /status/{id}
 *
 * Update an existing status.
 *
 * Body:
 *
 * {
 *   name: "Process",
 *   colourCode: "#008010"
 * }
 */
export const updateStatus = async (
    id,
    status
) => {

    return handleRequest(
        apiClient.put(
            `/status/${id}`,
            {
                name: status.name,
                colourCode: status.colourCode
            }
        )
    );
};

