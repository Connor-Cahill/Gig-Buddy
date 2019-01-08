const Client = require('../models/client');
const wrap = require('../middleware/errorHandler');

module.exports = function(app) {

    // // GET: returns list of all clients
    app.get('/clients', wrap( async (req, res) => {
        const clients = await Client.find({}).exec();
        await res.render('clients-index', { clients });
    }));

    //  GET: renders the clients form 
    app.get('/clients/new', (req, res) => {
        res.render('client-form');
    })

    //  GET: returns single client given the ID 
    app.get('/clients/:id', wrap( async (req, res) => {
        const client = await Client.findOne({ _id: req.params.id }).exec();
        await res.render('clients-show', { client });
    }))

    
    //  POST: creates a new client --- **LATER** -> need to add user 
    app.post('/clients', wrap( async (req, res) => {
        const client = new Client(req.body);
        await client.save();
        await res.redirect(`/clients/${client._id}`);
    }));


    // PUT: edits a client and updates it 
    app.put('/clients/:id', wrap(async (req, res) => {
        const client = await Client.findOne({ _id: req.params.id }).exec();
        client.set(req.body);
        await client.save();
        await res.redirect(`/clients/${client._id}`);
    }));

    // DELETE: removes a client
    app.delete('/clients/:id', wrap(async (req, res) => {
        const client = await Client.findOneAndRemove({ _id: req.params.id }).exec();
        await res.redirect('/');
    }))

}