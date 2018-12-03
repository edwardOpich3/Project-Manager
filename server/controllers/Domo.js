const models = require('../models');

const Domo = models.Domo;

const makerPage = (req, res) => {
  Domo.DomoModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.render('app', { csrfToken: req.csrfToken(), domos: docs });
  });
};

const makeDomo = (req, res) => {
  if (!req.body.name || !req.body.description) {
    return res.status(400).json({ error: 'Project needs both a name and a description' });
  }

  const domoData = {
    name: req.body.name,
    description: req.body.description,
    order: 0,
    owner: req.session.account._id,
  };

  const newDomo = new Domo.DomoModel(domoData);

  const domoPromise = newDomo.save();

  domoPromise.then(() => res.json({ redirect: '/maker' }));

  domoPromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Project already exists.' });
    }

    return res.status(400).json({ error: 'An error occurred.' });
  });

  return domoPromise;
};

const addMilestone = (req, res) => {
  if(!req.body.project){
    return res.status(400).json({ error: "You somehow requested a milestone without attaching it to a project..." });
  }

  if(!req.body.name || !req.body.description){
    return res.status(400).json({ error: "Milestone needs both a name and a description" });
  }

  const milestoneData = {
    name: req.body.name,
    description: req.body.description,
    order: 0
  };

  const newMilestone = new Domo.MilestoneModel(milestoneData);

  // Get our project
  const project = Domo.DomoModel.findOne({name: req.body.project}).exec((err, doc) => {
    if(err){
      console.log(err);
      res.status(400).json({ error: "Something happened" });
    }

    return doc;
  });

  project.then((doc) => {
    doc.milestones.push(newMilestone);

    console.log(doc);

    const promise = Domo.DomoModel.updateOne({name: doc.name}, doc);

    promise.then(() => res.json({redirect: '/maker'}));

    promise.catch((err) => {
      console.log(err);
      if(err.code === 11000){
        return res.status(400).json({ error: 'Project already exists' });
      }
  
      return res.status(400).json({ error: "An error occurred." });
    });

    return promise;
  });

  return project;
};

const addRequirement = (req, res) => {
  if(!req.body.project || !req.body.milestone){
    return res.status(400).json({ error: "You somehow requested a requirement without attaching it to a valid milestone..." });
  }

  if(!req.body.name){
    return res.status(400).json({ error: "Requirement needs a name" });
  }

  const requirementData = {
    name: req.body.name,
    completed: false
  };

  const newRequirement = new Domo.RequirementModel(requirementData);

  // Get our project
  const project = Domo.DomoModel.findOne({name: req.body.project}).exec((err, projectDoc) => {
    if(err){
      console.log(err);
      res.status(400).json({ error: "Something happened" });
    }

    return projectDoc;
  });

  project.then((projectDoc) => {
    const milestone = projectDoc.milestones.id(req.body.milestone);

    milestone.requirements.push(newRequirement);

    const promise = Domo.DomoModel.updateOne({_id: projectDoc._id}, projectDoc);

    promise.then(() => res.json({redirect: '/maker'}));

    promise.catch((err) => {
      console.log(err);
      if(err.code === 11000){
        return res.status(400).json({ error: 'Project already exists' });
      }
  
      return res.status(400).json({ error: "An error occurred." });
    });

    return promise;
  });

  return project;
};

const deleteProject = (req, res) => {
  if(!req.body.project){
    return res.status(400).json({ error: "Can't delete a project when I'm not given one!" });
  }

  const promise = Domo.DomoModel.findOne({name: req.body.project}).exec((err, doc) => {
    if(err){
      console.log(err);
      res.status(400).json({ error: "Something happened, no find before delete" });
    }

    return doc;
  });

  promise.then((doc) => {
    const deletePromise = Domo.DomoModel.deleteOne({ _id: doc._id }, (err, doc) => {
      if(err){
        console.log(err);
        return res.status(400).json({ error: "Something happened, no delete" });
      }

      return doc;
    });

    deletePromise.then(() => res.json({redirect: '/maker'}));

    return deletePromise;
  });

  return promise;
};

const getDomos = (request, response) => {
  const req = request;
  const res = response;

  return Domo.DomoModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.json({ domos: docs });
  });
};

module.exports.makerPage = makerPage;
module.exports.make = makeDomo;
module.exports.addMilestone = addMilestone;
module.exports.addRequirement = addRequirement;
module.exports.getDomos = getDomos;
module.exports.deleteProject = deleteProject;
