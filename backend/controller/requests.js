const { Op } = require("sequelize");
const { Request, Comment, User, Status, Like } = require("../models");
const axios = require("axios");

exports.show = async (req, res) => {
  try {
    const requests = await Request.findAll({
      where: {
        merged: false,
      },
      include: [
        {
          model: User,
        },
        {
          model: Status,
        },
        {
          model: Comment,
        },
        {
          model: Like,
        },
      ],
      where: { merged: false },
    });

    return res.status(200).json(requests);
  } catch (err) {
    console.log(err);
    return res.send("Error");
  }
};

//get searched requests
exports.search = async (req, res) => {
  try {
    const searchQuery = req.query.q; // Extracting search term from query parameters
    console.log("Received search query: ", searchQuery); // print the received searchQuery

    const requests = await Request.findAll({
      where: {
        // condition for search where the term is found either in title or the content of the posts
        [Op.or]: [
          {
            title: {
              [Op.like]: `%${searchQuery}%`, // Allows for partial matching
            },
          },
          {
            bodyText: {
              [Op.like]: `%${searchQuery}%`,
            },
          },
        ],
      },
      include: [
        {
          model: User,
        },
        {
          model: Status,
        },
        {
          model: Comment,
        },
        {
          model: Like,
        },
      ],
    });
    return res.status(200).json(requests);
  } catch (err) {
    console.log(err);
    return res.send("Error");
  }
};

//get one request (+ user + comment)
exports.showOne = async (req, res) => {
  const request = await Request.findOne({
    where: {
      id: req.params.id,
    },
    include: [
      {
        model: User,
      },
      {
        model: Comment,
        include: User,
      },
      {
        model: Like,
      },
    ],
  });
  res.status(200).json(request);
};

//get request from 1 category
exports.showCat = async (req, res) => {
  try {
    const cat = req.query.c;
    console.log(cat);
    const requests = await Request.findAll({
      where: {
        categoryID: cat,
      },
      include: [
        {
          model: User,
        },
        {
          model: Status,
        },
        {
          model: Comment,
        },
        {
          model: Like,
        },
      ],
    });
    return res.status(200).json(requests);
  } catch (err) {
    console.log(err);
    return res.send("Error");
  }
};

//create a new request
exports.create = async (req, res) => {
  const { title, bodyText, categoryID, categoryName, userId } = req.body;
  let data = {
    userID: userId,
    title: title,
    description: bodyText,
    category: categoryName,
  };

  axios
    .post("https://webdock.io/en/platform_data/feature_requests/new", data)
    .then((response) => {
      // Handle the success response
      let webdockID = response.data.id;

      const newRequest = Request.build({
        id: webdockID,
        title: title,
        bodyText: bodyText,
        categoryID: categoryID,
        userID: userId,
      });

      try {
        newRequest.save();

        return res.status(201).json(newRequest);
      } catch (err) {
        return res.json(err);
      }
    })
    .catch((error) => {
      // Handle the error
      console.error("Error:", error);
    });
};

//webdock change status
exports.changeStatus = async (req, res) => {
  const { feature_request_id, status } = req.body;
  try {
    const statusObj = await Status.findOne({
      where: { name: status },
    });

    if (statusObj) {
      await Request.update(
        {
          statusID: statusObj.id,
        },
        {
          where: { id: feature_request_id },
        }
      );
      return res.status(200).send("Status updated successfully");
    } else {
      return res.status(404).send("Status not found");
    }
  } catch (err) {
    console.error("Error updating request: ", err);
    return res.status(500).send(err);
  }
};

//create a new comment
exports.createComment = async (req, res) => {
  const { bodyText, userID, requestID } = req.body;

  const newComment = Comment.build({
    bodyText: bodyText,
    userID: userID,
    requestID: requestID,
  });

  try {
    await newComment.save();

    return res.status(201).json(newComment);
  } catch (err) {
    return res.json(err);
  }
};

exports.deleteRequest = async (req, res) => {
  const requestId = req.params.requestId;

  try {
    // Find anmodningen baseret på requestId med tilknyttede kommentarer
    const request = await Request.findByPk(requestId, {
      include: [Comment, Like],
    });

    if (!request) {
      return res.status(404).json({ error: "Anmodning ikke fundet" });
    }
    // Delete associated likes
    await Like.destroy({ where: { requestID: requestId } });

    await Comment.destroy({ where: { requestID: requestId } });

    await Request.destroy({ where: { id: requestId } });

    return res.status(204).send(); // 204 No Content - Anmodningen blev slettet
  } catch (error) {
    console.error("Fejl under sletning af anmodning:", error);
    return res.status(500).json({ error: "Internt serverproblem" });
  }
};
