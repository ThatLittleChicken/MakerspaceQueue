var BoxSDK = require('box-node-sdk');

var sdkConfig = require('./25517710_ti24mfuy_config.json');
var sdk = BoxSDK.getPreconfiguredInstance(sdkConfig);

// Get the service account client, used to create and manage app user accounts
// The enterprise ID is pre-populated by the JSON configuration,
// so you don't need to specify it here
var serviceAccountClient = sdk.getAppAuthClient('enterprise');

// Get an app user or managed user client
var appUserClient = sdk.getAppAuthClient('user', '31421655803');

appUserClient.users.get(appUserClient.CURRENT_USER_ID)
	.then(currentUser => { console.log(`Current user: ${currentUser.name}`) })
	.catch(error => { console.error(error) });