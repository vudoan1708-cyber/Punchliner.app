import monk from "monk";

export default (collectionNum) => {
  const MONGODB_URI = process.env.MONGODB_URI;

  try {
    const db = monk(MONGODB_URI);
    const database =
      collectionNum === 1 ? db.get("accounts") : db.get("documents");
    console.log(`Connect to MongoDB Database ${collectionNum} successfully`);
    return database;
  } catch (err) {
    console.error(`Error: ${err}`);
    return err;
  }
};
