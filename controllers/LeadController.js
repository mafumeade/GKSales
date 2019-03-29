const mongoose = require("mongoose");
const Lead = mongoose.model("Lead");

const axios = require("axios");
const fs = require("fs");

// Updates local leads collection with data fetched from
// https://garagekings.herokuapp.com/api/leads
// Does not delete leads or remove any properties
module.exports.refreshLeads = async (req, res) => {
  // Fetch leads from GK API
  const { data: leads } = await axios.get("https://garagekings.herokuapp.com/api/leads");

  // Upsert each lead
  const upsertPromises = [];
  leads.forEach(lead => {
    upsertPromises.push(Lead.findOneAndUpdate({ _id: lead._id }, lead, { upsert: true, new: true }).exec());
  });
  const updatedLeads = await Promise.all(upsertPromises);

  res.send(updatedLeads);
};

// Returns all leads
module.exports.getLeads = async (req, res) => {
  const leads = await Lead.find();
  res.send(leads);
};

// Returns a lead by ID
module.exports.getLead = async (req, res) => {
  const lead = await Lead.findOne({ _id: req.params.id });

  if (!lead) {
    return res.status(404).send({ err: "Not found" });
  }
  res.send(lead);
};
