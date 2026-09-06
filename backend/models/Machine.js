import mongoose from "mongoose";

const machineSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    clientId: { type: String, required: true, ref: "Client", index: true },
    machineName: { type: String, required: true, trim: true },
    machineType: { type: String, default: "New" },
    date: { type: String, required: true },
    deliveryDate: { type: String, default: "" },
    defect: { type: String, required: true },
    cost: { type: mongoose.Schema.Types.Mixed, required: true },
    advance: { type: mongoose.Schema.Types.Mixed, default: 0 },
    remarks: { type: String, default: "" },
    image: { type: String, default: null },
    status: {
      type: String,
      enum: ["Pending", "Active", "Completed"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

machineSchema.index({ date: 1 });
machineSchema.index({ defect: 1 });
machineSchema.index({ machineName: 1 });

export default mongoose.model("Machine", machineSchema);
