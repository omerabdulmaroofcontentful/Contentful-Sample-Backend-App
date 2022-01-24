# Contentful-Sample-Backend-App

This is a sample backend app which updates the entry value to 'updatedfromBackendApp2' creation of the entry. The purpose of this Demo is to show customers how backend Apps Identities and events work. 

Steps to run
`npm install` to install the packages
`node index.js` to start the server
`ngrok http 3004` to get the public URL of the App. 


- Go to your App Definition
- Click on **Security** Tab --> **Generate Key Pair** 
  - Download the **Private key** and replace the one in the **keys** folder
  - In the same Tab click on **Request Vefification** and copy the **signing secret**, and pase it in index.js file on line 22 (This is just for Demo plz dont use secrets in code in production).    
- Click on **Events** Tab and provide the public URL from **ngrok**
- Select **Entry** and on **Save** Event(This will trigger the App Event when the entry is created.)
