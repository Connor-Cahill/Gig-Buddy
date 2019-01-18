# Gig Buddy 
Visit https://gig-buddy.herokuapp.com to see the live version!

![Image Of App](public/assets/Screen&#32;Shot&#32;2019-01-16&#32;at&#32;8.47.04&#32;PM.png)

## Overview
Gig Buddy is a tool developed to help make freelancers work flow more effecient and organized. This app is a dashboard that allows users to easily track their clients, services & payments as well as sending your clients payment requests through the app.
### Technologies Used:
- NodeJS
- ExpressJS
- MongoDB 
- Mongoose
- Handlebars 
- Javascript
  
### Skills Used
- User authentication and authorization using bcrypt-nodejs to encrypt password and JWT to store user sessions.
- Sending custom emails through the app using Sendgrid API.
- Used ES6 Syntax Async/Await for Express routes.
- Utilized client side Axios to make AJAX requests.

## Features
### Clients
![Image of client dashboard](public/assets/Screen&#32;Shot&#32;2019-01-17&#32;at&#32;9.10.05&#32;PM.png)

The **clients overview** portion of the dashboard allows users to get a quick snapshot of how many clients they have, what services they are providing for each client, and the total compensation earned from each client.

### Services
![Gif of services dashboard](public/assets/Screen&#32;Shot&#32;2019-01-17&#32;at&#32;9.49.22&#32;PM.png)

The **services dashboard** allows users to store and organize their services in one place. It also holds userful information on pricing and whether it is reocurring service or not.

### Payments
![payments feed dashboard](public/assets/Screen&#32;Shot&#32;2019-01-17&#32;at&#32;9.59.53&#32;PM.png)
On the payments feed portion of the dashboard users view all the payment requests they have sent and whether or not the client has paid the request.

## Running Locally
To run this project locally you must first have NodeJs installed on your machine. After installing Node do the following:

    $ git clone https://github.com/Connor-Cahill/Gig-Buddy.git

  Once in the project directory run the following to install dependencies:

    $ npm i

You will also need to setup your .env with the following:
  - COOKIE - name of token
  - SECRET - JWT encryption secret
  - SENDGRID_API_KEY - your sendgrid api key
  
## Future Development
Stay tuned for product updates and new features including:
- accept payments through the app 
- More analytics to track user progress through the gig economy
- UI Improvements 
  

  