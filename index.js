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

/**
 * Provide the private key from ..
 */
const PRIVATE_APP_KEY = "./keys/key.pem"

/**
 * BASE_URL for Content Management API
 */
const BASE_URL = "https://api.contentful.com/"//process.env['BASE_URL']

/**
 * Provide your App ID ...
 */
const APP_ID =  "1pzdu1GUKPCcJms2SUiA74"//process.env['APP_ID']

/**
 * Provide signing secret ...
 */
const SIGNING_SECRET = "a7ls2HSrqJGAvIudLLi0BPyFWzJLrkCpXStrr6JXHoTem3efxCIVWUSdT6lMX4Qu"//process.env["SIGNING_SECRET"]

async function  setDefaultValue(spaceId,environmentId,req,appAccessToken,res){
    /**
 * Making an api call with app access token to update the field value
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
                 fields: { demoField: { "en-US": 'updatedfromBackendApp2' } },
             }),
         }
     );
 
     if (fetchResponse.status === 200) {
         console.log(`Set default values for Entry `);
         return res.send("success");
     } else {
         console.log('cloud not set value', JSON.stringify(fetchResponse))
     }
}

async function  setTagToEntry(spaceId,environmentId,req,appAccessToken,res){
    /**
 * Making an api call with app access token to set tag to the entry
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
             body: JSON.stringify(
            {
                metadata:{ 
                    tags:[
                        {
                            sys: {
                                type: "Link",
                                linkType: "Tag",
                                id: "digitalMarketing"
                            }
                        }
                    ]
                } 
             }),
         }
     );
 
     if (fetchResponse.status === 200) {
         console.log(`Set Tag for Entry `);
         return res.send("success");
     } else {
         console.log('cloud not set value', JSON.stringify(fetchResponse))
     }
}

async function  createChildEntry(spaceId,environmentId,req,appAccessToken,res){
    /**
 * Making an api call with app access token to create a child entry
 */
     let childEntry = `${req.jsonBody.sys.id}childEntry`
     let textURL = `${BASE_URL}/spaces/${spaceId}/environments/${environmentId}/entries/${childEntry}`
     console.log(textURL)

     // We make a request to contentful's CMA to create a child entry
     const fetchResponseChildEntry = await fetch(textURL,
         {
             method: "PUT",
             headers: {
                 Authorization: `Bearer ${appAccessToken}`,
                 "X-Contentful-Content-Type": 'demoChildContentType',
                 "Content-Type": "application/vnd.contentful.management.v1+json"
             },
             body:JSON.stringify({
                fields: { title: { "en-US": 'child entry created' } },
             })
         }
     );
 
     if (fetchResponseChildEntry.status === 201) {
         console.log(`Child entry created `);
            //return res.send("success");
            //Link child entry to parent entry
            let textURL = `${BASE_URL}/spaces/${spaceId}/environments/${environmentId}/entries/${req.jsonBody.sys.id}`
            const fetchLinktoParentEntry = await fetch(textURL,
                {
                    method: "PATCH",
                    headers: {
                        Authorization: `Bearer ${appAccessToken}`,
                        "X-Contentful-Content-Type": 'demoContentType',
                        "Content-Type": "application/json-patch+json",
                        "X-Contentful-Version": 1,  
                    },
                    body: JSON.stringify(
                    [
                        {
                            "op":"add",
                            "path":"/fields/childContentType",
                            "value":{
                                "en-US":{
                                    "sys":{
                                        "type":"Link",
                                        "linkType":"Entry",
                                        "id":`${childEntry}`
                                    }
                                }
                            }
                        }
                    ]
                ),
                }
            );

            if (fetchLinktoParentEntry.status === 200) {
                console.log(`Child entry Linked `);
                return res.send("success");
            } else {
                console.log('cloud not set value', fetchLinktoParentEntry.status,JSON.stringify(fetchLinktoParentEntry))
                return res.send("success");
            }
     } else {
         console.log('could not create child entry',fetchResponseChildEntry.status, JSON.stringify(fetchResponseChildEntry))
     }
}

app.post('/', async function (req, res) {

    console.log('req.header', JSON.stringify(req.headers))
    console.log('req.body', req.jsonBody)
    console.log('req.body', req.jsonBody.sys.contentType.sys.id)

/**
 * We only want to listen to demoContentType and we will ignore other content entry creation
 */
    if(req.jsonBody.sys.contentType.sys.id !== "demoContentType"){
        console.log("ignoring this entry")
        return res.send("ingoring this entry");
    }


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

//These are 3 examples, uncomment and run once at a time.

/**
 * Making an api call with app access token to update the field value
 * example 1 on entry create 
 */
//await setDefaultValue(spaceId,environmentId,req,appAccessToken,res)

/**
 * Making an api call with app access token to add the tag to the entry 
 * on entry creation
 *  example 2
 */
//await setTagToEntry(spaceId,environmentId,req,appAccessToken,res)

/**
 * Making an api call with app access token to create a child entry on 
 * entry creation.
 *  example 1
 */
//  await createChildEntry(spaceId,environmentId,req,appAccessToken,res)

})

app.listen(3004, function (req, res) {
    console.log('Running backend app...2')
})