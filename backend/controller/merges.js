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
    const currentRequest = await Request.findByPk(req.body.currentRequestId);
    const selectedRequest = await Request.findByPk(req.body.selectedRequestId);

    const userId = req.body.userId;
    // Perform the merging logic here

    // Create a comment in the selected request with details from the current request
    await Comment.create({
      bodyText: ` ${currentRequest.title}\n<br/><br/> ${currentRequest.bodyText}`,
      userID: userId,
      requestID: selectedRequest.id,
      isMerged: true,
    });

    // Set the merged flag to true for the current request
    currentRequest.merged = true;
    await currentRequest.save();

    res.json({ message: "Requests merged successfully" });
  } catch (error) {
    console.error("Error merging requests:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
