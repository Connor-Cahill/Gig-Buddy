

module.exports = function(app) {
    //  GET: renders the landing page 
    app.get('/', (req, res) => {
        res.render('index');
    });
}