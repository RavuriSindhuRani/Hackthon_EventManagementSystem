const express = require("express");
const router = express.Router();
const Organization = require("../models/organizations"); // import your Organization schema

// Registration route for Organization
router.post("/organization", async (req, res) => {
  then(async()=> {
    // Check if organization already exists by name + type
    const existingOrg = await Organization.findOne({ 
      name: req.body.name, 
      type: req.body.type 
    });
    if (existingOrg) {
      return res.json({ status: "Organization already exists" });
    }

    // Create new organization according to schema
    const newOrg = await Organization.create({
      name: req.body.name,
      type: req.body.type, // must be "NGO" or "COMPANY"
      description: req.body.description,
      logoUrl: req.body.logoUrl,
      contactEmail: req.body.contactEmail,
      contactPhone: req.body.contactPhone,
      address: {
        city: req.body.address?.city,
        state: req.body.address?.state,
        country: req.body.address?.country
      },
      status: req.body.status || "ACTIVE",
      createdBy: req.body.createdBy // ObjectId of User who created it
    });

    res.json({ status: "Organization registration successful", organizationId: newOrg._id });
  })
  .catch ((err)=> {
    console.error(err);
    res.status(500).json({ status: "Error during organization registration" });
  })
});

module.exports = router;
