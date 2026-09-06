import Client from "../models/Client.js";
import Machine from "../models/Machine.js";

function machinesToMap(machines) {
  return machines.reduce((acc, machine) => {
    acc[machine._id] = {
      id: machine._id,
      machineName: machine.machineName,
      machineType: machine.machineType,
      date: machine.date,
      deliveryDate: machine.deliveryDate,
      defect: machine.defect,
      cost: machine.cost,
      advance: machine.advance,
      remarks: machine.remarks,
      image: machine.image,
      status: machine.status,
    };
    return acc;
  }, {});
}

export async function buildClientPayload(client, machines) {
  return {
    id: client._id,
    clientName: client.clientName,
    companyName: client.companyName,
    machines: machinesToMap(machines),
  };
}

export async function getMachinesForClient(clientId) {
  return Machine.find({ clientId }).lean();
}

export async function findClientByName(clientName, companyName) {
  return Client.findOne({
    clientName: { $regex: new RegExp(`^${escapeRegex(clientName.trim())}$`, "i") },
    companyName: { $regex: new RegExp(`^${escapeRegex(companyName.trim())}$`, "i") },
  }).lean();
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function getAllClientsPayload() {
  const clients = await Client.find().lean();
  const allMachines = await Machine.find().lean();
  const machinesByClient = allMachines.reduce((acc, machine) => {
    if (!acc[machine.clientId]) acc[machine.clientId] = [];
    acc[machine.clientId].push(machine);
    return acc;
  }, {});

  return Promise.all(
    clients.map((client) => buildClientPayload(client, machinesByClient[client._id] || []))
  );
}

export async function getClientPayloadById(clientId) {
  const client = await Client.findById(clientId).lean();
  if (!client) return null;
  const machines = await getMachinesForClient(clientId);
  return buildClientPayload(client, machines);
}

export async function getClientHistoryPayload(clientId) {
  const machines = await Machine.find({ clientId }).lean();
  return machines
    .map((machine) => ({
      id: machine._id,
      machineName: machine.machineName,
      machineType: machine.machineType,
      date: machine.date,
      deliveryDate: machine.deliveryDate,
      defect: machine.defect,
      cost: machine.cost,
      advance: machine.advance,
      remarks: machine.remarks,
      image: machine.image,
      status: machine.status,
    }))
    .sort((a, b) => new Date(b.date) - new Date(a.date));
}
