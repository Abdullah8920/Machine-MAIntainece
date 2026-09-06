import { Router } from "express";
import {
  listClients,
  getClient,
  getClientHistory,
  updateClientInfo,
  searchClients,
  addMachineEntry,
  addMachineToClient,
  updateMachineStatus,
  updateMachineEntry,
  searchByDate,
} from "../controllers/clientController.js";
import { respondSuccess } from "../middleware/respondSuccess.js";

const router = Router();

router.get("/clients", listClients, respondSuccess);
router.get("/clients/search", searchClients, respondSuccess);
router.get("/clients/:id", getClient, respondSuccess);
router.get("/clients/:id/history", getClientHistory, respondSuccess);
router.put("/clients/:id", updateClientInfo, respondSuccess);
router.post("/clients/machines", addMachineEntry, respondSuccess);
router.post("/clients/:id/machines", addMachineToClient, respondSuccess);
router.patch("/clients/:id/machines/:machineId/status", updateMachineStatus, respondSuccess);
router.put("/clients/:id/machines/:machineId", updateMachineEntry, respondSuccess);
router.get("/machines/search-by-date", searchByDate, respondSuccess);

export default router;
