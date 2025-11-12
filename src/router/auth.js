// src/auth.js
import { authStore } from "../store/authStore";

export function setLoggedIn(initials, accountId, customerId) {
  sessionStorage.setItem("isLoggedIn", "true");
  sessionStorage.setItem("userInitials", initials);
  sessionStorage.setItem("accountId", accountId);
  sessionStorage.setItem("customerId", customerId);

  // update reactive store
  authStore.initials = initials;
  authStore.isLoggedIn = true;
}

export function logout() {
  sessionStorage.removeItem("isLoggedIn");
  sessionStorage.removeItem("userInitials");
  sessionStorage.removeItem("accountId");
  sessionStorage.removeItem("customerId");
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
