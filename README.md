# Heroku link : https://cluster-duck-server.herokuapp.com/

# Getting Started
- run  `npm i` to install all dependencies

## Developing
- run `npm run dev` in your terminal to only start up the server without the front-end React server launching
## Other useful scripts
- `npm run format` to format code and ensure the same style is maintained
-  `npm run lint` to lint your code in case your syntax checker is not working or you just want to double check your code.
## Environment Variables
- the  `.env.sample` file is there to show you what to put in your `.env ` which you will create yourselves. The value of certain variables is not put in for security reasons. The `.env` is also ignored just like the `node_modules` for security reasons. 
- The uses of the `.env` will become more apparent as we figure how to set up our database.

# PRODUCTION
- Any scripts containing `build` or `clean` in their name are for PRODUCTION only and will therefore be used by Heroku and not by us. Use only the above scripts mentioned while developing.