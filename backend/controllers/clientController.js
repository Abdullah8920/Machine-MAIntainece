import Client from "../models/Client.js";
import Machine from "../models/Machine.js";
import { slugify, makeId } from "../utils/helpers.js";
import {
  findClientByName,
  getAllClientsPayload,
  getClientPayloadById,
  getClientHistoryPayload,
} from "../services/clientService.js";

export async function listClients(_req, res, next) {
  try {
    const clients = await getAllClientsPayload();
    res.locals.result = clients;
    next();
  } catch (error) {
    next(error);
  }
}

export async function getClient(req, res, next) {
  try {
    const client = await getClientPayloadById(req.params.id);
    if (!client) {
      return res.status(404).json({ success: false, message: "Client not found" });
    }
    res.locals.result = client;
    next();
  } catch (error) {
    next(error);
  }
}

export async function getClientHistory(req, res, next) {
  try {
    const client = await Client.findById(req.params.id).lean();
    if (!client) {
      return res.status(404).json({ success: false, message: "Client not found" });
    }
    const history = await getClientHistoryPayload(req.params.id);
    res.locals.result = history;
    next();
  } catch (error) {
    next(error);
  }
}

export async function updateClientInfo(req, res, next) {
  try {
    const { clientName, companyName } = req.body;
    if (!clientName?.trim() || !companyName?.trim()) {
      return res.status(400).json({ success: false, message: "Client name and company name are required" });
    }

    const client = await Client.findByIdAndUpdate(
      req.params.id,
      { clientName: clientName.trim(), companyName: companyName.trim() },
      { new: true, runValidators: true }
    ).lean();

    if (!client) {
      return res.status(404).json({ success: false, message: "Client not found" });
    }

    res.locals.result = { id: client._id, clientName: client.clientName, companyName: client.companyName };
    next();
  } catch (error) {
    next(error);
  }
}

export async function searchClients(req, res, next) {
  try {
    const query = (req.query.query || "").trim().toLowerCase();
    const defect = (req.query.defect || "").trim().toLowerCase();
    const machineName = (req.query.machineName || "").trim().toLowerCase();

    const clients = await getAllClientsPayload();

    const results = clients.filter((client) => {
      const nameMatch =
        !query ||
        client.clientName.toLowerCase().includes(query) ||
        client.companyName.toLowerCase().includes(query);

      const machines = Object.values(client.machines || {});

      const defectMatch =
        !defect || machines.some((mc) => mc.defect.toLowerCase().includes(defect));

      const machineMatch =
        !machineName || machines.some((mc) => mc.machineName.toLowerCase().includes(machineName));

      return nameMatch && defectMatch && machineMatch;
    });

    res.locals.result = results;
    next();
  } catch (error) {
    next(error);
  }
}

export async function addMachineEntry(req, res, next) {
  try {
    const {
      clientName,
      companyName,
      machineName,
      machineType = "New",
      date,
      deliveryDate = "",
      defect,
      cost,
      advance = 0,
      remarks = "",
      image = null,
      status = "Pending",
    } = req.body;

    if (!clientName?.trim() || !companyName?.trim() || !machineName?.trim() || !date || !defect || cost === undefined || cost === "") {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const trimmedClientName = clientName.trim();
    const trimmedCompanyName = companyName.trim();

    let client = await findClientByName(trimmedClientName, trimmedCompanyName);
    let clientId;

    if (client) {
      clientId = client._id;
    } else {
      clientId = slugify(`${trimmedClientName}-${trimmedCompanyName}`) || makeId("client");
      const existingById = await Client.findById(clientId).lean();
      if (existingById) {
        clientId = makeId("client");
      }
      client = await Client.create({
        _id: clientId,
        clientName: trimmedClientName,
        companyName: trimmedCompanyName,
      });
    }

    const machineId = makeId("machine");
    await Machine.create({
      _id: machineId,
      clientId,
      machineName: machineName.trim(),
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

    res.locals.result = { clientId, machineId };
    res.locals.statusCode = 201;
    next();
  } catch (error) {
    next(error);
  }
}

export async function addMachineToClient(req, res, next) {
  try {
    const client = await Client.findById(req.params.id).lean();
    if (!client) {
      return res.status(404).json({ success: false, message: "Client not found" });
    }

    const machineId = makeId("machine");
    const machineData = req.body;

    await Machine.create({
      _id: machineId,
      clientId: req.params.id,
      machineName: machineData.machineName,
      machineType: machineData.machineType || "New",
      date: machineData.date,
      deliveryDate: machineData.deliveryDate || "",
      defect: machineData.defect,
      cost: machineData.cost,
      advance: machineData.advance ?? 0,
      remarks: machineData.remarks || "",
      image: machineData.image ?? null,
      status: machineData.status || "Pending",
    });

    res.locals.result = { clientId: req.params.id, machineId };
    res.locals.statusCode = 201;
    next();
  } catch (error) {
    next(error);
  }
}

export async function updateMachineStatus(req, res, next) {
  try {
    const machine = await Machine.findOneAndUpdate(
      { _id: req.params.machineId, clientId: req.params.id },
      { status: req.body.status },
      { new: true, runValidators: true }
    ).lean();

    if (!machine) {
      return res.status(404).json({ success: false, message: "Machine record not found" });
    }

    res.locals.result = { clientId: req.params.id, machineId: machine._id, status: machine.status };
    next();
  } catch (error) {
    next(error);
  }
}

export async function updateMachineEntry(req, res, next) {
  try {
    const allowedFields = [
      "machineName",
      "machineType",
      "date",
      "deliveryDate",
      "defect",
      "cost",
      "advance",
      "remarks",
      "image",
      "status",
    ];

    const updates = {};
    allowedFields.forEach((field) => {
      if (Object.prototype.hasOwnProperty.call(req.body, field)) {
        updates[field] = req.body[field];
      }
    });

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ success: false, message: "No valid fields to update" });
    }

    const machine = await Machine.findOneAndUpdate(
      { _id: req.params.machineId, clientId: req.params.id },
      updates,
      { new: true, runValidators: true }
    ).lean();

    if (!machine) {
      return res.status(404).json({ success: false, message: "Machine record not found" });
    }

    res.locals.result = { clientId: req.params.id, machineId: machine._id };
    next();
  } catch (error) {
    next(error);
  }
}

export async function searchByDate(req, res, next) {
  try {
    const { date } = req.query;
    if (!date) {
      return res.status(400).json({ success: false, message: "Date query parameter is required" });
    }

    const machines = await Machine.find({ date }).lean();
    const clientIds = [...new Set(machines.map((m) => m.clientId))];
    const clients = await Client.find({ _id: { $in: clientIds } }).lean();
    const clientMap = clients.reduce((acc, client) => {
      acc[client._id] = client;
      return acc;
    }, {});

    const matches = machines
      .map((machine) => {
        const client = clientMap[machine.clientId];
        if (!client) return null;
        return {
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
          clientId: client._id,
          clientName: client.clientName,
          companyName: client.companyName,
        };
      })
      .filter(Boolean)
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    res.locals.result = matches;
    next();
  } catch (error) {
    next(error);
  }
}
