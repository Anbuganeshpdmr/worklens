export function getUserStatusName(user) {
  const currentStatus = user?.currentStatus;
  if (
    typeof currentStatus?.displayName === "string" &&
    currentStatus.displayName.trim()
  ) {
    return currentStatus.displayName;
  }
  if (typeof currentStatus?.uniqueName === "string") {
    const separator = currentStatus.uniqueName.indexOf("_");
    return separator < 0
      ? currentStatus.uniqueName
      : currentStatus.uniqueName.slice(separator + 1);
  }
  if (user?.active === true || user?.active === 1 || user?.isActive === true) {
    return "Active";
  }
  if (
    user?.active === false ||
    user?.active === 0 ||
    user?.isActive === false
  ) {
    return "Inactive";
  }
  return "Unknown";
}

export function isUserActive(user) {
  const currentStatus = user?.currentStatus;
  const statusName =
    currentStatus?.displayName ||
    (typeof currentStatus?.uniqueName === "string"
      ? currentStatus.uniqueName.slice(currentStatus.uniqueName.indexOf("_") + 1)
      : "");

  if (typeof statusName === "string" && statusName.trim()) {
    return statusName.trim().toLowerCase() === "active";
  }

  return user?.active === true || user?.active === 1 || user?.isActive === true;
}
