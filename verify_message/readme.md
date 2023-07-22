# Example server: Verify message

This is a basic Express/Node.js server that exposes a single endpoint to https://thebananostand.com clients:

```
OPTIONS /api/validate_banano_message
PUT /api/validate_banano_message
```

## Generate sign request links

To generate a link to request a signature that will be submitted to `https://example.com/api/validate_banano_message`, you can use this code snippet:
```
const submitToUrl = 'https://example.com/api/validate_banano_message'
const message = "Title: Hello, Banano!\nAction: Zapu zapu\nTime: 2023-01-01 20:30Z"

const signRequestLink = `https://thebananostand.com/signmessage#message=${encodeURIComponent(message)}&url=${encodeURIComponent(submitToUrl)}`;
```

# Setup

## 1) Clone and setup server

Clone the repository and change into the directory:

```
git clone https://github.com/Airtune/banano-message-verification-examples.git
cd ./banano-message-verification-examples/verify_message
```

Install dependencies:

```
npm install
```

## 2) Start the server

```
npm start
```

After starting the server you should see the following:
```
> verify_message@1.0.0 start
> node index.js

HTTP Server running on port 5420
```

## 3) Configure Reverse Proxy with NGINX or Apache2

Set up a Reverse Proxy for requests from https://example.com to http://localhost:5420

### Prerequisites

Make sure your firewall, like UFW, allows https.

You should have your SSL certificates set up. For this example, these certificates are already set up:

```
/etc/letsencrypt/live/www.example.com/fullchain.pem
/etc/letsencrypt/live/www.example.com/privkey.pem
/etc/letsencrypt/live/example.com/fullchain.pem;
/etc/letsencrypt/live/example.com/privkey.pem;
```

### NGINX Reverse Proxy setup

Install NGINX

```
sudo apt-get update
sudo apt-get install nginx
```

Edit the example.com configuration:

```
sudo nano /etc/nginx/sites-available/example.com
```

Copy the setup below into the configuration file. This setup does three things:
* Reverse Proxy https requests for https://example.com to https://localhost:5420
* Redirect http to https
* Redirect https://www.example.com to https://example.com

```
server {
    listen 80;
    server_name example.com www.example.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name www.example.com;
    ssl_certificate /etc/letsencrypt/live/www.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/www.example.com/privkey.pem;
    return 301 https://example.com$request_uri;
}

server {
    listen 443 ssl http2;
    server_name example.com;

    ssl_certificate /etc/letsencrypt/live/example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;

    location / {
        proxy_pass http://localhost:5420;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Press `ctrl+x` and save the file.

Create symlink to enable site:

```
cd /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/example.com .
```

Test to make sure there are no syntax errors in your configuration files:

```
sudo nginx -t
```

Reload NGINX to apply the changes:

```
sudo systemctl reload nginx
```

### Apache2 Reverse Proxy Setup

First, install Apache2:

```
sudo apt-get update
sudo apt-get install apache2
```

Enable the necessary modules to Reverse Proxy:

```
sudo a2enmod proxy
sudo a2enmod proxy_http
sudo a2enmod ssl
```

Edit the example.com configuration:

```
sudo nano /etc/apache2/sites-available/example.com.conf
```

Copy the setup below into the configuration file. This setup does three things:
* Reverse Proxy https requests for https://example.com to https://localhost:5420
* Redirect http to https
* Redirect https://www.example.com to https://example.com

```
<VirtualHost *:80>
    ServerName example.com
    ServerAlias www.example.com
    Redirect permanent / https://example.com/
</VirtualHost>

<VirtualHost *:443>
    ServerName www.example.com
    Redirect permanent / https://example.com/

    SSLEngine on
    SSLCertificateFile /etc/letsencrypt/live/www.example.com/fullchain.pem
    SSLCertificateKeyFile /etc/letsencrypt/live/www.example.com/privkey.pem
</VirtualHost>

<VirtualHost *:443>
    ServerName example.com

    SSLEngine on
    SSLCertificateFile /etc/letsencrypt/live/example.com/fullchain.pem
    SSLCertificateKeyFile /etc/letsencrypt/live/example.com/privkey.pem

    ProxyPreserveHost On
    ProxyPass / http://localhost:5420/
    ProxyPassReverse / http://localhost:5420/
</VirtualHost>
```

Press `ctrl+x`` and save the file.

Enable your site:

```
sudo a2ensite example.com
```

Test your configuration file for syntax errors:

```
sudo apachectl configtest
```

Reload Apache2 to apply the changes:

```
sudo systemctl reload apache2
```
