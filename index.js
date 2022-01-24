const express = require('express')
const bodyParser = require('body-parser');
const { getManagementToken, verifyRequest } = require('@contentful/node-apps-toolkit')
const path = require("path");
const fs = require('fs');
const app = express()
const fetch = require('node-fetch')
app.use(function (req, res, next) {
    var data = "";
    req.on('data', function (chunk) { data += chunk })
    req.on('end', function () {
        req.rawBody = data;
        req.jsonBody = JSON.parse(data);
        next();
    })
})


const PRIVATE_APP_KEY = "./keys/key.pem"
const BASE_URL = 'https://api.contentful.com'
const APP_ID = '1pzdu1GUKPCcJms2SUiA74'
const SIGNING_SECRET = '9r6VUG8Sk5ukjgI0FUiBbMpfgolC57COwnGFUnXNR4UH9t9ih-3ftQpOo61L1Qwb'

app.post('/', async function (req, res) {

    console.log('req.header', JSON.stringify(req.headers))
    console.log('req.body', req.jsonBody)


/**
 * Verifying shared secret
 */
    const canonicalRequest = {
        path: req.path,
        headers: req.headers,
        method: req.method,
        body: JSON.stringify(req.jsonBody),
    };

/**
 * Verifying request if it is coming from Contentful
 */
    try {
        const isValid = verifyRequest(SIGNING_SECRET, canonicalRequest);
        console.log('isValid', isValid)
    } catch (e) {
        console.error(e);
    }

/**
 * Creating app access Token
 */
    let pathString = path.join(__dirname, PRIVATE_APP_KEY)
    const spaceId = '1vt6sxbf70mi'
    const environmentId = 'master'
    const privateKey = fs.readFileSync(
        pathString,
        { encoding: "utf8" }
    );

/**
 * Receiving app access Token
 */
    const appAccessToken = await getManagementToken(privateKey, {
        appInstallationId: APP_ID,
        spaceId,
        environmentId,
    });

    console.log('jwt', appAccessToken)

/**
 * Making an api call with app access token
 */
    let textURL = `${BASE_URL}/spaces/${spaceId}/environments/${environmentId}/entries/${req.jsonBody.sys.id}`
    console.log(textURL)
    // We make a request to contentful's CMA to update the Entry with our defaul values
    const fetchResponse = await fetch(textURL,
        {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${appAccessToken}`,
                "X-Contentful-Content-Type": 'demoContentType',
                "Content-Type": "application/json",
                "X-Contentful-Version": `${req.jsonBody.sys.version}`,
            },
            body: JSON.stringify({
                fields: { field2: { "en-GB": 'updatedfromBackendApp2' } },
            }),
        }
    );

    if (fetchResponse.status === 200) {
        console.log(`Set default values for Entry `);
        return res.send("success");
    } else {
        console.log('cloud not set value', JSON.stringify(fetchResponse))
    }
})

app.listen(3004, function (req, res) {
    console.log('Running backend app...')
})