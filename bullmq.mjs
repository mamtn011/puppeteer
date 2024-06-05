import { Queue, Worker } from "bullmq";
import connection from "./util/redis_connection.mjs";

const queue = new Queue("data_collection", { connection });

new Worker(
  "data_collection",
  async (job) => {
    console.log(job.data);
  },
  { connection }
);

queue.add("product 1", { url: "https://example.com" }, { jobId: "vrtjpks3" });
queue.add("product 1", { url: "https://example.com" }, { jobId: "vrtjpks3" });
