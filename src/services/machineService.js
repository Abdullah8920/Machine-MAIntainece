// ---------------------------------------------------------------
// machineService.js (Firestore version)
//
// Firestore shape:
// clients/{clientId} = { clientName, companyName, machines: { machineId: {...} } }
//
// Every function keeps the same name/shape it had in the
// localStorage version — pages just need to `await` them now.
// ---------------------------------------------------------------

import { db } from "../firebase/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";

const CLIENTS_COLLECTION = "clients";

function slugify(text) {
  return text
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function makeId(prefix) {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

/** Fetches every client document. */
export async function getAllClients() {
  const snap = await getDocs(collection(db, CLIENTS_COLLECTION));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function getClientById(clientId) {
  if (!clientId) return null;
  const ref = doc(db, CLIENTS_COLLECTION, clientId);
  const snap = await getDoc(ref);
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

/**
 * Adds a machine/repair entry. Finds an existing client by
 * clientName + companyName (case-insensitive), or creates a new one.
 *
 * Note: images are stored as base64 data URLs directly on the
 * document for simplicity. Firestore caps a document at ~1MB, so
 * for a production app swap this for Firebase Storage (upload the
 * file, save the download URL instead of the base64 string).
 */
export async function addMachineEntry({
  clientName,
  companyName,
  machineName,
  date,
  defect,
  cost,
  advance = 0,
  remarks,
  image = null,
  status = "Pending",
}) {
  const clients = await getAllClients();

  const existing = clients.find(
    (c) =>
      c.clientName.toLowerCase() === clientName.toLowerCase() &&
      c.companyName.toLowerCase() === companyName.toLowerCase()
  );

  const clientId = existing
    ? existing.id
    : slugify(`${clientName}-${companyName}`) || makeId("client");
  const machineId = makeId("machine");

  const ref = doc(db, CLIENTS_COLLECTION, clientId);
  const machineEntry = {
    id: machineId,
    machineName,
    date,
    defect,
    cost,
    advance,
    remarks,
    image,
    status,
  };

  if (!existing) {
    await setDoc(ref, {
      clientName,
      companyName,
      machines: { [machineId]: machineEntry },
    });
  } else {
    await updateDoc(ref, {
      [`machines.${machineId}`]: machineEntry,
    });
  }

  return { clientId, machineId };
}

/**
 * Search by any combination of client/company name, defect keyword,
 * or machine name. Empty fields are ignored. Filters client-side
 * after fetching all clients (fine for this app's scale).
 */
export async function searchClients({ query = "", defect = "", machineName = "" }) {
  const clients = await getAllClients();
  const q = query.trim().toLowerCase();
  const d = defect.trim().toLowerCase();
  const m = machineName.trim().toLowerCase();

  return clients.filter((client) => {
    const nameMatch =
      !q ||
      client.clientName.toLowerCase().includes(q) ||
      client.companyName.toLowerCase().includes(q);

    const machines = Object.values(client.machines || {});

    const defectMatch =
      !d || machines.some((mc) => mc.defect.toLowerCase().includes(d));

    const machineMatch =
      !m || machines.some((mc) => mc.machineName.toLowerCase().includes(m));

    return nameMatch && defectMatch && machineMatch;
  });
}

/** Returns a client's machine entries sorted newest first. */
export async function getClientHistory(clientId) {
  const client = await getClientById(clientId);
  if (!client) return [];
  return Object.values(client.machines || {}).sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );
}

export async function updateMachineStatus(clientId, machineId, status) {
  const ref = doc(db, CLIENTS_COLLECTION, clientId);
  await updateDoc(ref, { [`machines.${machineId}.status`]: status });
}

/**
 * Updates any combination of fields (machineName, date, defect, cost,
 * remarks, image, status) on an existing machine entry.
 */
export async function updateMachineEntry(clientId, machineId, updates) {
  const ref = doc(db, CLIENTS_COLLECTION, clientId);
  const fieldUpdates = {};
  Object.keys(updates).forEach((key) => {
    fieldUpdates[`machines.${machineId}.${key}`] = updates[key];
  });
  await updateDoc(ref, fieldUpdates);
}

/**
 * Finds every machine entry (across all clients) whose date matches
 * the given date (format: YYYY-MM-DD, same as an <input type="date">).
 * Returns flat records with client info attached, newest first.
 */
export async function searchByDate(date) {
  if (!date) return [];
  const clients = await getAllClients();

  const matches = [];
  clients.forEach((client) => {
    Object.values(client.machines || {}).forEach((machine) => {
      if (machine.date === date) {
        matches.push({
          ...machine,
          clientId: client.id,
          clientName: client.clientName,
          companyName: client.companyName,
        });
      }
    });
  });

  return matches;
}