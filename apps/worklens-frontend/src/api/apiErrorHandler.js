export function commonApiErrorHandler(
  error,
  defaultMessage = "Something went wrong.",
) {
  console.error("API Error:", error);

  // Server responded with an error
  if (error.response) {
    const { status, data } = error.response;

    const serverMessage = data?.message || data?.error || data?.detail;

    // Authentication / authorization
    if (status === 401 || status === 403) {
      throw new Error("Session expired. Please log in again.");
    }

    // Server provided a meaningful message
    if (serverMessage) {
      throw new Error(serverMessage);
    }

    // No message from server
    if (status >= 400 && status < 500) {
      throw new Error("Invalid request. Please check your input.");
    }

    if (status >= 500) {
      throw new Error("Server error. Please try again later.");
    }
  }

  // Request was sent but no response received
  if (error.request) {
    throw new Error(
      "Unable to reach the server. Please check your network connection.",
    );
  }

  // Something happened while setting up the request
  throw new Error(error.message || defaultMessage);
}
