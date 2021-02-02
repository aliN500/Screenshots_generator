var screenshotmachine = require('screenshotmachine');
const { google } = require('googleapis');
const readline = require('readline');
// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/drive'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';
var customerKey = 'b7e8ff';
    secretPhrase = ''; //leave secret phrase empty, if not needed
    var array = [
      "https://ifunded.de/en/",
      "https://www.propertypartner.co",
      "https://propertymoose.co.uk",
      "https://www.homegrown.co.uk",
      "https://www.realtymogul.com"
];
    for (let index = 0; index < array.length; index++) {
      options = {
        //mandatory parameter
        url : array[index],
        // all next parameters are optional, see our website screenshot API guide for more details
        dimension : '1920x1080', // or "1366xfull" for full length screenshot
        device : 'desktop',
        format: 'png',
        cacheLimit: '0',
        delay: '200',
        zoom: '100'
      }
      var apiUrl = screenshotmachine.generateScreenshotApiUrl(customerKey, secretPhrase, options);

      //put link to your html code
      console.log('<img src="' + apiUrl + '">');

       //or save screenshot as an image
       var fs = require('fs');
       var output = ['iFunded.jpg','Property Partner.jpg','Property Moose.jpg','Homegrown.jpg','Realty Mogul.jpg'];
       var output1 = [];
         screenshotmachine.readScreenshot(apiUrl).pipe(fs.createWriteStream(index+1 + '-' +output[index]).on('close', function() {
           console.log('Screenshot saved as ' + output[index]);
           var x= index+1 +'-'+ output[index];

         
           output1.push(x);
           
         }));


 }
// Load client secrets from a local file.
fs.readFile('credentials.json', (err, content) => {
  if (err) return console.log('Error loading client secret file:', err);
  // Authorize a client with credentials, then call the Google Drive API.
  authorize(JSON.parse(content),uploadFile);
});

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  const {client_secret, client_id, redirect_uris} = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getAccessToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getAccessToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error retrieving access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}



async function uploadFile(auth) {
  for (file of output1) {
    var fileMetadata = {
      name: file
    };
    var media = {
      body: fs.createReadStream(file)
    };
    const drive = google.drive({version: 'v3', auth});
    const result = await drive.files.create(
      {
        resource: fileMetadata,
        media: media,
        fields: "id"
      },
      function(err, fileid) {
        if (err) {
          // Handle error
          console.error(err);
        } else {
          console.log("File Id: ", fileid.data.id);
          console.log("Uploaded..:" + file);
        }
      }
    );
    console.log("Uploading file..:" + file);
  }
}