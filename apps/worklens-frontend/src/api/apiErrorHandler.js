export function commonApiErrorHandler(
  error,
  defaultMessage = "Something went wrong.",
) {
  console.error("API Error:", error);

  // Server responded with an error
  if (error.response) {
    const { status, data } = error.response;

    const serverMessage = [data?.message, data?.error, data?.detail].find(
      (message) => typeof message === "string" && message.trim(),
    );

    // Authentication / authorization
    if (status === 401 || status === 403) {
      if (serverMessage) {
        console.error("Authentication/Authorization Error:", serverMessage);
        return new Error(serverMessage);
      }

      return new Error("Session expired. Please log in again.");
    }

    // Server provided a meaningful message
    if (serverMessage) {
      return new Error(serverMessage);
    }

    // No message from server
    if (status >= 400 && status < 500) {
      return new Error("Invalid request. Please check your input.");
    }

    if (status >= 500) {
      return new Error("Server error. Please try again later.");
    }
  }

  // Request was sent but no response received
  if (error.request) {
    return new Error(
      "Unable to reach the server. Please check your network connection.",
    );
  }

  // Something happened while setting up the request
  return new Error(error.message || defaultMessage);
}
