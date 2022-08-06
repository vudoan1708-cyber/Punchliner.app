module.exports = async(db, data) => {

  try {
    // create data
    return await db.insert({/* specify needed data */ data});
  } catch (err) {
    console.log(err);
    return err;
  }
};
