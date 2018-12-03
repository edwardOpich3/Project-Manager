const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const _ = require('underscore');

let DomoModel = {};
let MilestoneModel = {};
let RequirementModel = {};

// mongoose.Types.ObjectID is a function that converts string ID into real mongo ID
const convertId = mongoose.Types.ObjectId;
const setName = (name) => _.escape(name).trim();

const RequirementSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },

  completed: {
    type: Boolean,
    required: true,
    default: false,
  },
});

const MilestoneSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },

  description: {
    type: String,
    required: true,
    trim: true,
  },

  deadline: {
    type: Date,
    required: false,
  },

  order: {
    type: Number,
    required: true,
    default: 0,
  },

  requirements: {
    type: [RequirementSchema],
    required: false,
  },
});

const DomoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },

  description: {
    type: String,
    required: true,
    trim: true,
  },

  deadline: {
    type: Date,
    required: false,
  },

  order: {
    type: Number,
    required: true,
    default: 0,
  },

  milestones: {
    type: [MilestoneSchema],
    required: false,
  },

  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },
});

DomoSchema.statics.toAPI = (doc) => ({
  name: doc.name,
  description: doc.description,
  deadline: doc.deadline,
  order: doc.order,
  milestones: doc.milestones,
  owner: doc.owner,
});

DomoSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: convertId(ownerId),
  };

  return DomoModel.find(search).select(
    'name description deadline order milestones owner'
  ).exec(callback);
};

DomoSchema.statics.findByName = (ownerId, name, callback) => {
  const search = {
    owner: convertId(ownerId),
    name,
  };

  return DomoModel.find(search).select(
    'name description deadline order milestones owner'
  ).exec(callback);
};

DomoModel = mongoose.model('Domo', DomoSchema);
MilestoneModel = mongoose.model('Milestone', MilestoneSchema);
RequirementModel = mongoose.model('Requirement', RequirementSchema);

module.exports.DomoModel = DomoModel;
module.exports.MilestoneModel = MilestoneModel;
module.exports.RequirementModel = RequirementModel;
module.exports.DomoSchema = DomoSchema;
