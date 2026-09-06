import mongoose from "mongoose";
import dns from "dns";

// Fix DNS SRV lookup on Windows networks where default DNS fails to resolve _mongodb._tcp SRV records
try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (err) {
  console.warn("Could not set custom DNS servers:", err.message);
}

const connectDB = async () => {
  try {
    const con = await mongoose.connect(
      process.env.MONGO_URI,
      { dbName: "cluster0" }
    );
    if (con) {
      console.log("MongoDB Connected SuccesFully");
    }
  } catch (error) {
    console.error("Something went wrong while connecting to mongodb:", error);
    throw error;
  }
};

export default connectDB;