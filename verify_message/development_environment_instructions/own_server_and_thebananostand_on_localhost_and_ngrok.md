# Development environment

thebananostand: https://localhost:4200 and ngrok
app server: https://example.com

# Instructions

1) Host thebananostand on localhost using `yarn start`
2) Make thebananostand available through ngrok:
    ``
    ngrok http 4200 --host-header="localhost:4200"
    ```
    This will open up a an ngrok URL for you similar to this:
    `https://9cf5-your-url-here-70.ngrok-free.app`
3) Edit `verify_message/index.js` and replace `"https://thebananostand.com"` with your ngrok URL from above
    ```
    const thebananostandCorsOptions = {
        origin: "https://thebananostand.com", // Can be set to ngrok url for thebananostand running on localhost.
        methods: "OPTIONS,PUT"
    };
    ```
    Should become this:
    ```
    const thebananostandCorsOptions = {
        origin: "https://9cf5-your-url-here-70.ngrok-free.app", // Can be set to ngrok url for thebananostand running on localhost.
        methods: "OPTIONS,PUT"
    };
    ```
4) Follow the instructions in `verify_message/readme.md` to set up the endpoint: http://example.com/api/validate_banano_message
5) Sign a message from your ngrok URL. Replace the ngrok url with your own ngrok URL from above and example.com with your own domain name:
https://9cf5-your-url-here-70.ngrok-free.app/sign-message#message=Hello%20example.com!%0ASession:%20674362467463743%0ATime:%202023-01-01T20:30:01Z&url=https://example.com/api/validate_banano_message

