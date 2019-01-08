const Client = require('../models/client');

module.exports = function(app) {

    // GET: returns list of all clients
    app.get('/clients', (req, res) => {
        Client.find({}).then(clients => {
            res.render('clients-index', { clients })
        }).catch(console.error)
    });

    //  GET: renders the clients form 
    app.get('/clients/new', (req, res) => {
        res.render('client-form');
    })

    //  GET: returns single client given the ID 
    app.get('/clients/:id', (req, res) => {
        Client.findOne({ _id: req.params.id }).then(client => {
            res.render('clients-show', { client })
        }).catch(console.error)
    });
    
    //  POST: creates a new client --- **LATER** -> need to add user 
    app.post('/clients', (req, res) => {
        const client = new Client(req.body);
        client.save().then(client => {
            res.redirect(`/clients/${client._id}`);
        }).catch(console.error)
    });


    // PUT: edits a client and updates it 
    app.put('/clients/:id', (req, res) => {
        Client.findOne({ _id: req.params.id }).then(client => {
            client.set(req.body);
            return client.save();
        }).then(client => {
            res.redirect(`/clients/${client._id}`);
        }).catch(console.error)
    });

    // DELETE: removes a client
    app.delete('/clients/:id', (req, res) => {
        Client.findOneAndRemove({ _id: req.params.id }).then(res => {
            res.redirect('/clients')
        }).catch(console.error)
    });

}