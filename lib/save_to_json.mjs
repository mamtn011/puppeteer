import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";

const saveToJson = async () => {
  const db = new Low(new JSONFile("ecommerce.json"), {});
  await db.read();
  const saveToDB = async (id, productData) => {
    db.data[id] = productData;
    await db.write();
  };

  return { db, saveToDB };
};

export default saveToJson;
