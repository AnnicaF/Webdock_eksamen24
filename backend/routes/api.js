const express = require("express");
const requests = require("../controller/requests");
const likes = require("../controller/likes");
const categories = require("../controller/categories");
const auth = require("../controller/auth");
const merges = require("../controller/merges");
const router = express.Router();

//Request
router.get("/v1/request", requests.show);
router.get("/v1/request/:id", requests.showOne);
router.get("/v1/search", requests.search);

router.post("/v1/request", requests.create);
router.post("/v1/request/:id/comment", requests.createComment);

router.delete("/v1/request/:requestId", requests.deleteRequest);

//webdock can change status here
router.post("/v1/request/status", requests.changeStatus);

//Like
router.post("/v1/like", likes.create);

//categories
router.get("/v1/category", categories.show);
router.get("/v1/cat", requests.showCat);

//Login
router.post("/v1/authenticate", auth.authentication);

// Merge
router.get("/v1/merge/current/:id", merges.getCurrentRequest);
router.get("/v1/merge/all", merges.getAllRequests);
router.post("/v1/merge", merges.mergeRequests);

module.exports = router;
