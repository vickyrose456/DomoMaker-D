const models = require('../models');
const DomoModel = require('../models/Domo');

const { Domo } = models;

const makerPage = (req, res) => {
  // use React to rende the maker page
  res.render('app');
};// maker page

const makeDomo = async (req, res) => {
  if (!req.body.name || !req.body.age) {
    return res.status(400).json({ error: 'Both name and age are required!' });
  }

  const domoData = {
    name: req.body.name,
    age: req.body.age,
    owner: req.session.account._id,
  };

  try {
    const newDomo = new Domo(domoData);
    await newDomo.save();
    return res.status(201).json({ name: newDomo.name, age: newDomo.age });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Domo already exist!' });
    }

    return res.status(400).json({ error: 'An error occured' });
  }
};// make domo

/**
 * This function will allow us to just get JSON responses of Domos for a user. This will
allow our client app to update dynamically using React. We can pair the data on
screen to the data from this function
 */
const getDomos = (req, res) => DomoModel.findByOwner(req.session.account._id, (err, docs) => {
  if (err) {
    console.log(err);
    return res.status(400).json({ error: 'An error occured' });
  }

  // no error, so return the domos
  return res.json({ domos: docs });
});// get domo

module.exports = {
  makerPage,
  makeDomo,
  getDomos,
};
