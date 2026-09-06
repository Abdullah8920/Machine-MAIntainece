// ---------------------------------------------------------------
// machineService.js (Express/MongoDB version)
//
// MongoDB shape (via API):
// Client documents + Machine documents linked by clientId
//
// Every function keeps the same name/shape as the Firestore version
// so pages only need to `await` them — no UI changes required.
// ---------------------------------------------------------------

import api from "./api";

/** Fetches every client document. */
export async function getAllClients() {
  return api.get("/clients");
}

export async function getClientById(clientId) {
  if (!clientId) return null;
  try {
    return await api.get(`/clients/${clientId}`);
  } catch (error) {
    if (error.message === "Client not found") return null;
    throw error;
  }
}

/**
 * Adds a machine/repair entry. Finds an existing client by
 * clientName + companyName (case-insensitive), or creates a new one.
 *
 * Note: images are stored as base64 data URLs directly on the
 * document for simplicity.
 */
export async function addMachineEntry({
  clientName,
  companyName,
  machineName,
  machineType = "New",
  date,
  deliveryDate = "",
  defect,
  cost,
  advance = 0,
  remarks,
  image = null,
  status = "Pending",
}) {
  return api.post("/clients/machines", {
    clientName,
    companyName,
    machineName,
    machineType,
    date,
    deliveryDate,
    defect,
    cost,
    advance,
    remarks,
    image,
    status,
  });
}

/**
 * Search by any combination of client/company name, defect keyword,
 * or machine name. Empty fields are ignored.
 */
export async function searchClients({ query = "", defect = "", machineName = "" }) {
  return api.get("/clients/search", {
    params: { query, defect, machineName },
  });
}

/** Returns a client's machine entries sorted newest first. */
export async function getClientHistory(clientId) {
  return api.get(`/clients/${clientId}/history`);
}

/**
 * Adds a machine entry directly to a known client (by ID) — used by
 * "Add Another Visit" so a typo/case mismatch in the name fields
 * can never accidentally create a duplicate client.
 */
export async function addMachineToClient(clientId, machineData) {
  return api.post(`/clients/${clientId}/machines`, machineData);
}

export async function updateMachineStatus(clientId, machineId, status) {
  return api.patch(`/clients/${clientId}/machines/${machineId}/status`, { status });
}

/**
 * Updates any combination of fields on an existing machine entry.
 */
export async function updateMachineEntry(clientId, machineId, updates) {
  return api.put(`/clients/${clientId}/machines/${machineId}`, updates);
}

/** Updates the client-level clientName / companyName fields. */
export async function updateClientInfo(clientId, { clientName, companyName }) {
  return api.put(`/clients/${clientId}`, { clientName, companyName });
}

/**
 * Finds every machine entry (across all clients) whose date matches
 * the given date (format: YYYY-MM-DD).
 */
export async function searchByDate(date) {
  if (!date) return [];
  return api.get("/machines/search-by-date", { params: { date } });
}
