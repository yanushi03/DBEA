// src/auth.js
export function setLoggedIn(initials, accountId) {
  sessionStorage.setItem("isLoggedIn", "true");
  sessionStorage.setItem("userInitials", initials);
  sessionStorage.setItem("accountId", accountId);
}

export function logout() {
  sessionStorage.removeItem("isLoggedIn");
  sessionStorage.removeItem("userInitials");
  sessionStorage.removeItem("accountId");
}

export function isAuthenticated() {
  return sessionStorage.getItem("isLoggedIn") === "true";
}

export function getUserInitials() {
  return sessionStorage.getItem("userInitials");
}

export function getAccountId() {
  return sessionStorage.getItem("accountId");
}
