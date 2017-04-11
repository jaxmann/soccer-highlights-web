# pmr-web < 20
just the webapp though

&nbsp;

### PMR Services

[pmr-server](https://github.com/jaxmann/pmr-server)

[pmr-rest](https://github.com/kevinchesser/pmr-rest)

[pmr-web](https://github.com/jaxmann/pmr-web)

## Usage

Run pmr-rest first - it needs to run on port 8080, this can run on 8081. Start with npm package [http-server](https://www.npmjs.com/package/http-server).

`cd /var/www/html`

`git clone https://github.com/jaxmann/pmr-web.git`

`mv pmr-web/* .`

## About

This web application allows users to log in to their PMR account to configure settings for soccer highlight notifications. Create a user account, sign in, and set up notifications. 

### Security

 - front-end and back-end hashing and salting to protect user names (however please be careful with your password, as always)
 - session tracking (each time you log in we create a 1-hour session key that allows you to log in for one hour without having to go through the log in screen)
 
### Features

 - select favorite players from any league in the favorites box and receive tailored alerts via email (text coming soon!)
 - disable alerts for as long as you want (if you are recording the game, for instance) - you'll receive alerts again afterwards automatically
 




