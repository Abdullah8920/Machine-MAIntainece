import mongoose from "mongoose";

const clientSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    clientName: { type: String, required: true, trim: true },
    companyName: { type: String, required: true, trim: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

clientSchema.index(
  { clientName: 1, companyName: 1 },
  { collation: { locale: "en", strength: 2 } }
);

export default mongoose.model("Client", clientSchema);
