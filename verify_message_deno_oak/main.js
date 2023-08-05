import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import { oakCors } from 'https://deno.land/x/cors/mod.ts';
import * as bananojs from "npm:@bananocoin/bananojs";

const port = 5420;

const app = new Application();
const router = new Router();

const thebananostandCorsOptions = {
  origin: "https://thebananostand.com", // Can be set to ngrok url for thebananostand running on localhost.
  methods: ["OPTIONS", "PUT"]
};

// Enable CORS only for this route
router.options('/api/validate_banano_message', oakCors(thebananostandCorsOptions)); // pre-flight to enable PUT CORS
router.put('/api/validate_banano_message', oakCors(thebananostandCorsOptions), async (context) => {
  const body = await context.request.body().value;
  const { banano_address, message, signature } = body;

  // TODO: Check that banano_address, message, and signature is present.
  let messageSignatureIsValid;
  try {
    const publicKey = bananojs.BananoUtil.getAccountPublicKey(banano_address);
    messageSignatureIsValid = bananojs.verifyMessage(publicKey, message, signature);
  } catch(error) {
    // TODO: Log error for inspection here.
    context.response.body = {
      success: false,
      message: 'Internal server error.'
    };
    return;
  }

  if (messageSignatureIsValid) {
    context.response.body = {
      success: true,
      message: 'Success! The message signature was validated by the server.'
    };
  } else {
    context.response.body = {
      success: false,
      message: 'Failure! The signature could not be verified for the message.'
    };
  };
});

app.use(router.routes());
app.use(router.allowedMethods());
//app.use(oakCors()); // Enable CORS for all routes

// Start the server
console.log(`Oak Banano Message Verification HTTP Server running on port ${port}`);
await app.listen({ port });
