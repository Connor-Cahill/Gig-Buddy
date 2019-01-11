const sendgrid = require('@sendgrid/mail');
const exphbs = require('express-handlebars').create();

sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

module.exports = ((user, client, template) => {
    exphbs.render(`email-templates/${template}.hbs`, { user, client }).then(html => {
        sendgrid.send({
            to: user.email,
            from: client.email,
            subject: `${ user.firstName } ${ user.lastName } is requesting ${ client.paymentTotal }`,
            html: html,
        }).then(()=>{}).catch(console.error);
    })
    

});