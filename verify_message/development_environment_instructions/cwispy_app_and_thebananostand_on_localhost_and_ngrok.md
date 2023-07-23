# Development environment

thebananostand: https://localhost:4200 and ngrok
app server: https://cwispy.app/api/validate_banano_message_any_cors

# Instructions

1) Host thebananostand on localhost using `yarn start`
2) Make thebananostand available through ngrok:
    ``
    ngrok http 4200 --host-header="localhost:4200"
    ```
    This will open up a an ngrok URL for you similar to this:
    `https://9cf5-your-url-here-70.ngrok-free.app`
3) Sign a message from your ngrok URL. Replace the ngrok url with your own ngrok URL:
https://9cf5-your-url-here-70.ngrok-free.app/signmessage#message=Hello%20cwispy.app!%0ASession:%20674362467463743%0ATime:%202023-01-01T20:30:01Z&url=https://cwispy.app/api/validate_banano_message_any_cors

