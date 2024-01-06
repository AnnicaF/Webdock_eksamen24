const { Request, Comment } = require("../models");

exports.getCurrentRequest = async (req, res) => {
  try {
    const currentRequest = await Request.findOne({
      where: { id: req.params.id },
      attributes: ["id", "title", "bodyText"],
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

exports.mergeRequests = async (req, res) => {
  try {
    // Find den nuværende anmodning og den valgte anmodning
    const currentRequest = await Request.findByPk(req.body.currentRequestId);
    const selectedRequest = await Request.findByPk(req.body.selectedRequestId);

    // Hvis en eller begge anmodninger ikke eksisterer, kast en fejl
    if (!currentRequest || !selectedRequest) {
      return res.status(404).json({ error: "One or both requests not found" });
    }

    // Performér eventuel anden logik for sammenføjning her

    // Opret en kommentar i den valgte anmodning med detaljer fra den nuværende anmodning
    await Comment.create({
      bodyText: currentRequest.bodyText,
      userID: 22475, // Dette skal muligvis justeres baseret på din brugerlogik
      requestID: selectedRequest.id,
    });

    // Opdater 'merged' attributten for den nuværende anmodning
    await currentRequest.update({ merged: true });

    res.json({ message: "Requests merged successfully" });
  } catch (error) {
    console.error("Error merging requests:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
