const mongoose = require('mongoose');
const _ = require('underscore');

let DomoModel = {};

const setName = (name) => _.escape(name).trim();

const DomoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },
  age: {
    type: Number,
    min: 0,
    require: true,
  },
  dHeight: {
    type: Number,
    min: 0,
    require: true,
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

DomoSchema.statics.toAPI = (doc) => ({
  name: doc.name,
  age: doc.age,
  dHeight: doc.dHeight,
});

DomoSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    // convert the string ownerID to an object id
    owner: mongoose.Types.ObjectId(ownerId),
  };

  return DomoModel.find(search).select('name age dHeight').lean().exec(callback);
};

// finding a specific domo by name
DomoSchema.statics.findByName = (dName, callback) => {
  const search = { name: dName };

  return DomoModel.findOne(search, callback);
};

DomoModel = mongoose.model('Domo', DomoSchema);

module.exports = DomoModel;
