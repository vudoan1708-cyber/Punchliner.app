export default async (db, PARAM) => {
  try {
    // find all
    return await db.find({ /* specify needed data */ PARAM });
  } catch (err) {
    console.log(err);
    return err;
  }
};
