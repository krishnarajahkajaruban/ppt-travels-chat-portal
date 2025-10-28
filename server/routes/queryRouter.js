const router = require("express").Router();

const { creatingQueryResponse, gettingQueryResponses, gettingSuggestionQueryResponse, contactMessage, getAllContactMessages } = require("../controller/queryController");

// Define routes for user operations

router.post("/create-query-response", creatingQueryResponse);

router.post("/find-matching-response", gettingQueryResponses);

router.post("/find-out-matching-queries", gettingSuggestionQueryResponse);

router.post("/contact", contactMessage);

router.get("/contact", getAllContactMessages);

module.exports = router;
