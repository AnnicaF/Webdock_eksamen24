const { Request, Comment } = require("../models");
const createDOMPurify = require("dompurify");
const { JSDOM } = require("jsdom");

const window = new JSDOM("").window;
const DOMPurify = createDOMPurify(window);

exports.currentRequest = async (req, res) => {
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

exports.allRequests = async (req, res) => {
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

    const sanitizedTitle = DOMPurify.sanitize(currentRequest.title);
    const sanitizedBodyText = DOMPurify.sanitize(currentRequest.bodyText);

    await Comment.create({
      bodyText: ` ${sanitizedTitle}\n<br/><br/> ${sanitizedBodyText}`,
      userID: 22475,
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
