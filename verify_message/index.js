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
// Here's an example for a link to a sign request page:
// https://thebananostand.com/signmessage#message=hello&url=https://example.com/api/validate_banano_message
app.options('/api/validate_banano_message', cors(thebananostandCorsOptions)); // pre-flight to enable PUT CORS
app.put('/api/validate_banano_message', cors(thebananostandCorsOptions), (req, res) => {
  const banano_address = req.body.banano_address;
  const message = req.body.message;
  const signature = req.body.signature;
  // TODO: Check that banano_address, message, and signature is present.

  let messageIsValid;
  try {
    const publicKey = bananojs.BananoUtil.getAccountPublicKey(banano_address);
    messageIsValid = bananojs.verifyMessage(publicKey, message, signature);
  } catch(error) {
    // TODO: Log error for inspection here.
    return res.json({
      success: false,
      message: 'Internal server error.'
    });
  }

  if (messageIsValid) {
    res.json({
      success: true,
      message: 'Success! The message signature was validated by the server.'
    });
  } else {
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
