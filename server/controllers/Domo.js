const models = require('../models');
const DomoModel = require('../models/Domo');

const { Domo } = models;

const makerPage = (req, res) => res.render('app');

const makeDomo = async (req, res) => {
  if (!req.body.name || !req.body.age || !req.body.dHeight) {
    return res.status(400).json({ error: 'Name, age and height are all required!' });
  }

  const domoData = {
    name: req.body.name,
    age: req.body.age,
    dHeight: req.body.dHeight,
    owner: req.session.account._id,
  };

  try {
    const newDomo = new Domo(domoData);
    await newDomo.save();
    return res.status(201).json({ name: newDomo.name, age: newDomo.age, height: newDomo.height });
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
  }// if error

  // no error, so return the domos
  return res.json({ domos: docs });
});// get domo

// render the page for subscribers
const paidProfilePage = (req, res) => res.render('paidPage');// paid page

// search for a domo
const searchDomo = (req, res) => {
  if (!req.query.name) {
    return res.status(400).json({ error: 'Name is required to perform a search' });
  }

  return Domo.findByName(req.query.name, (err, doc) => {
    if (err) {
      return res.status(500).json({ err });
    }
    // if no doc found / empty doc
    if (!doc) {
      return res.json({ error: 'No domos found' });
    }

    // we got the domo data
    return res.json({
      name: doc.name,
      dHeight: doc.dHeight,
      age: doc.age,
    });
  });
};/// /end search Domo

module.exports = {
  makerPage,
  paidProfilePage,
  makeDomo,
  getDomos,
  searchDomo,
};
