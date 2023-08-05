const PORT = 5420;

const express = require('express');
const cors = require('cors');
const bananojs = require('@bananocoin/bananojs');

const app = express();
app.use(express.json());

// Configure CORS to instruct the browser to allow requests to this server from 'https://thebananostand.com'.
const thebananostandCorsOptions = {
  origin: "https://thebananostand.com", // Can be set to ngrok url for thebananostand running on localhost.
  methods: "OPTIONS,PUT"
};

// Receive signed message from wallet signing page.
// Example: https://thebananostand.com/sign-message#message=hello&url=https://example.com/api/validate_banano_message
// To configure CORS from any origin simply use cors()
app.options('/api/validate_banano_message', cors(thebananostandCorsOptions)); // pre-flight to enable PUT CORS
app.put('/api/validate_banano_message', cors(thebananostandCorsOptions), (req, res) => {
  const banano_address = req.body.banano_address;
  const message = req.body.message;
  const signature = req.body.signature;
  // TODO: Check that banano_address, message, and signature is present.

  let messageSignatureIsValid;
  try {
    const publicKey = bananojs.BananoUtil.getAccountPublicKey(banano_address);
    messageSignatureIsValid = bananojs.verifyMessage(publicKey, message, signature);
  } catch(error) {
    // TODO: Log error for inspection here.
    return res.json({
      success: false,
      message: 'Internal server error.'
    });
  }

  if (messageSignatureIsValid) {
    // Validate and handle the message; do what you must server-side.
    res.json({
      success: true,
      message: 'Success! The message signature was validated by the server.'
    });
  } else {
    // The signature isn't valid so don't bother handling the message.
    res.json({
      success: false,
      message: 'Failure! The signature could not be verified for the message.'
    });
  }
});

// Starting server on PORT
app.listen(PORT, () => {
  console.log(`HTTP Server running on port ${PORT}`);
});
