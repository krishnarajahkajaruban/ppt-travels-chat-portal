const QueryResponse = require("../models/queryResponse");
const contactDetail = require("../models/contact");

const creatingQueryResponse = async (req, res) => {
  try {
    const { query, response } = req.body;
    const newQueryResponse = new QueryResponse({
      query,
      response
    })
    await newQueryResponse.save();
    res.status(201).json({
      message: "Query response created successfully",
      data: newQueryResponse
    });
  } catch (err) {
    res.status(500).json({
      error: err.message
    })
  }
}

const gettingQueryResponses = async (req, res) => {
  try {
    const { query: userInput, dbquery: dbInput } = req.body;

    if (!userInput && !dbInput) {
      return res.status(400).json({ error: "Please provide a message" });
    }

    // Check if the userInput contains keywords related to date
    const dateKeywords = ["today", "date", "current date", "today's date", "what's the date today"];
    const containsDateKeyword = userInput && dateKeywords.some(keyword =>
      new RegExp(keyword, 'i').test(userInput)
    );

    if (containsDateKeyword) {
      const today = new Date();
      return res.status(200).json({ response: today.toDateString() });
    }

    // Greeting Inputs
    const greetingInput = ["hi", "hello", "hey", "sup", "yo", "wassup", "what's up", "what's new", "howdy", "greetings", "good morning", "good afternoon", "good evening"];
    const containsGreetingKeyword = userInput && greetingInput.some(keyword =>
      new RegExp(keyword, 'i').test(userInput)
    );

    if (containsGreetingKeyword) {
      return res.status(200).json({ response: "Hello There, how can I help you?" });
    }

    // Farewell Inputs
    const farewellInput = ["bye", "goodbye", "see you", "later", "cya", "take care", "farewell"];
    const containsFarewellKeyword = userInput && farewellInput.some(keyword =>
      new RegExp(keyword, 'i').test(userInput)
    );

    if (containsFarewellKeyword) {
      return res.status(200).json({ response: "Goodbye! Have a great day!" });
    }

    // Thank You Inputs
    const thankYouInput = ["thank you", "thanks", "thx", "thanks a lot", "thank you very much", "thanks a bunch"];
    const containsThankYouKeyword = userInput && thankYouInput.some(keyword =>
      new RegExp(keyword, 'i').test(userInput)
    );

    if (containsThankYouKeyword) {
      return res.status(200).json({ response: "You're welcome!" });
    }

    // Affirmative Responses
    const affirmativeInput = ["yes", "yeah", "yep", "sure", "of course", "definitely", "absolutely"];
    const containsAffirmativeKeyword = userInput && affirmativeInput.some(keyword =>
      new RegExp(keyword, 'i').test(userInput)
    );

    if (containsAffirmativeKeyword) {
      return res.status(200).json({ response: "Great!" });
    }

    // Negative Responses
    const negativeInput = ["no", "nope", "nah", "not really", "I don't think so"];
    const containsNegativeKeyword = userInput && negativeInput.some(keyword =>
      new RegExp(keyword, 'i').test(userInput)
    );

    if (containsNegativeKeyword) {
      return res.status(200).json({ response: "Okay, let me know if there's anything else you need." });
    }

    // Help Requests
    const helpRequestInput = ["help", "can you help me", "i need help", "assist me", "i need assistance", "support"];
    const containsHelpRequestKeyword = userInput && helpRequestInput.some(keyword =>
      new RegExp(keyword, 'i').test(userInput)
    );

    if (containsHelpRequestKeyword) {
      return res.status(200).json({ response: "Sure, I'm here to help! What do you need assistance with?" });
    }

    // Status Inquiries
    const statusInquiryInput = ["how are you", "how's it going", "how are you doing", "what's up", "what's new"];
    const containsStatusInquiryKeyword = userInput && statusInquiryInput.some(keyword =>
      new RegExp(keyword, 'i').test(userInput)
    );

    if (containsStatusInquiryKeyword) {
      return res.status(200).json({ response: "I'm just a bot, but I'm here to assist you!" });
    }

    // Clarification Requests
    const clarificationRequestInput = ["what do you mean", "can you explain", "clarify please", "what does that mean", "I don't understand"];
    const containsClarificationRequestKeyword = userInput && clarificationRequestInput.some(keyword =>
      new RegExp(keyword, 'i').test(userInput)
    );

    if (containsClarificationRequestKeyword) {
      return res.status(200).json({ response: "I'm here to clarify! What would you like to know more about?" });
    }

    // General Small Talk
    const smallTalkInput = ["how's the weather", "what's your favorite color", "do you like music", "tell me a joke"];
    const containsSmallTalkKeyword = userInput && smallTalkInput.some(keyword =>
      new RegExp(keyword, 'i').test(userInput)
    );

    if (containsSmallTalkKeyword) {
      return res.status(200).json({ response: "I'm just a bot, but I'm happy to chat!" });
    }

    // Availability and Booking Queries
    const availabilityKeywords = ["availability", "bookings", "busses", "bus availability", "check availability", "bus bookings", "bus booking"];
    const containsAvailabilityKeyword = userInput && availabilityKeywords.some(keyword =>
      new RegExp(keyword, 'i').test(userInput)
    );

    if (containsAvailabilityKeyword) {
      return res.status(200).json({ 
        response: "You can check the availability for bookings or busses by visiting: <a href='https://www.ppttravel.com/' target='_blank'>https://www.ppttravel.com/</a>" 
      });
    }

    let queryResponse = null;

    if (userInput) {
      const regex = new RegExp(userInput, 'i'); // 'i' makes the search case-insensitive
      queryResponse = await QueryResponse.findOne({ query: { $elemMatch: { $regex: regex } } });
    }

    if (!queryResponse && dbInput) {
      queryResponse = await QueryResponse.findOne({ query: { $in: dbInput } });
    }

    if (queryResponse) {
      return res.status(200).json({ response: queryResponse.response });
    } else {
      const responseMessage = "I'm sorry, but I don't understand what you're asking. Could you please contact the P.P.T Travels & Tours for more information? Hotline: <a href='tel:+94112364999'>011-236-4999</a>, Email: <a href='mailto:info@ppttravel.com'>info@ppttravel.com</a>, Website: <a href='http://www.ppttravel.com' target='_blank'>www.ppttravel.com</a>.";

      return res.status(200).json({
        response: responseMessage
      });
    }

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

const gettingSuggestionQueryResponse = async (req, res) => {
  try {
    const { queryString } = req.body;

    if (!queryString) {
      res.status(200).json([]);
      return;
    }

    const regex = new RegExp(queryString, 'i'); // 'i' makes the search case-insensitive

    const results = await QueryResponse.aggregate([
      { $match: { query: { $elemMatch: { $regex: regex } } } },
      { $unwind: "$query" },
      { $match: { query: { $regex: regex } } },
      {
        $group: {
          _id: null,
          allQueries: { $push: "$query" }
        }
      },
      {
        $project: {
          _id: 0,
          allQueries: 1
        }
      }
    ]);

    res.status(200).json(results.length > 0 ? results[0].allQueries : []);
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
}

/* contact detail posting */
const contactMessage = async (req, res) => {
  console.log(req.body);
  try {
    const newContactMessage = new contactDetail({
      ...req.body,
    });
    await newContactMessage.save();
    console.log(newContactMessage);
    return res.status(201).json(newContactMessage);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

const getAllContactMessages = async (req, res) => {
  try {
    const allContactMessages = await contactDetail.find();
    console.log(allContactMessages);
    return res.status(200).json(allContactMessages);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};


module.exports = {
  creatingQueryResponse,
  gettingQueryResponses,
  gettingSuggestionQueryResponse,
  contactMessage,
  getAllContactMessages
}