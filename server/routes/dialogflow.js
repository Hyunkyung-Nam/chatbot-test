const express = require("express");
const router = express.Router();
const structjson = require("./structjson.js");
const dialogflow = require("dialogflow");
const uuid = require("uuid");

const config = require("../config/keys");
const sessionId = config.dialogFlowSessionID;
const projectId = config.googleProjectID;
const languageCode = config.dialogFlowSessionLanguageCode;

// Create a new session
const sessionClient = new dialogflow.SessionsClient();
const sessionPath = sessionClient.sessionPath(projectId, sessionId);

router.post("/hello", async (req, res) => {
    //console.log(req.body);
    const { responseId, queryResult, originalDetectIntentRequest, session } = req.body;
    const { queryText, parameters, outputContexts, intent } = queryResult;
    console.log("parameters" + JSON.stringify(parameters));

    const intentName = intent.displayName;
    console.log(intentName);
    if (intentName == "ask-weather") {
        res.json({ fulfillmentText: `거참 날씨가 좋구만` });
    } else if (intentName == "location-weather") {
        const { location } = parameters;
        res.json({ fulfillmentText: `${location}의 날씨가 궁금한것이여?` });
    } else {
        console.log(` No intent matched.`);
    }
});

//Text query route

router.post("/textQuery", async (req, res) => {
    // dialogflow api 로 부터 받은거 client로 보내기

    // The text query request.
    const request = {
        session: sessionPath,
        queryInput: {
            text: {
                text: req.body.text,
                languageCode,
            },
        },
    };

    // Send request and log result
    const responses = await sessionClient.detectIntent(request);
    console.log("Detected intent");
    const result = responses[0].queryResult;
    console.log(`  Query: ${result.queryText}`);
    console.log(`  Response: ${result.fulfillmentText}`);
    res.send(result);
    //   if (result.intent) {
    //     console.log(`  Intent: ${result.intent.displayName}`);
    //   } else {
    //     console.log(`  No intent matched.`);
    //   }
});

// event query route
router.post("/eventQuery", async (req, res) => {
    // dialogflow api 로 부터 받은거 client로 보내기

    // The text query request.
    const request = {
        session: sessionPath,
        queryInput: {
            event: {
                name: req.body.event,
                languageCode,
            },
        },
    };

    // Send request and log result
    const responses = await sessionClient.detectIntent(request);
    console.log("Detected intent");
    const result = responses[0].queryResult;
    console.log(`  Query: ${result.queryText}`);
    console.log(`  Response: ${result.fulfillmentText}`);
    res.send(result);
    //   if (result.intent) {
    //     console.log(`  Intent: ${result.intent.displayName}`);
    //   } else {
    //     console.log(`  No intent matched.`);
    //   }
});

module.exports = router;
