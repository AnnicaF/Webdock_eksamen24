const { Request } = require("../models");

exports.getCurrentRequest = async (req, res) => {
  try {
    const currentRequest = await Request.findOne({
      where: { id: req.params.id },
    });
    res.json(currentRequest);
  } catch (error) {
    console.error("Error fetching current request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getAllRequests = async (req, res) => {
  try {
    const allRequests = await Request.findAll();
    res.json(allRequests);
  } catch (error) {
    console.error("Error fetching all requests:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// det her bruges ikke endnu
exports.mergeRequests = async (req, res) => {
  try {
    const currentRequest = await Request.findOne({
      where: { id: req.body.currentRequestId },
    });
    const selectedRequest = await Request.findOne({
      where: { id: req.body.selectedRequestId },
    });
    // Perform the merging logic here

    res.json({ message: "Requests merged successfully" });
  } catch (error) {
    console.error("Error merging requests:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

