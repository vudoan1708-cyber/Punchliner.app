module.exports = async(db) => {

  try {
    // find all
    return await db.find({});
  } catch (err) {
    return err;
  }
};
