const wrap = require('./errorHandler');
const Client = require('../models/client');
const Service = require('../models/service');


/*
This middleware function collects and sends
along data about number of services you currently have open.
It also separates it into monthly and oneTime payments.
*/
module.exports = wrap(async (req, res, next) => {
    const clients = await Client.find({}).populate('services').exec();
    let totalServices = 0;
    let monthlyServices = 0;
    let oneTimeServices = 0;

    //  Functions used for filtering methods below
    const filterMonthlys = function trueIfServiceIsReoccurring(service) {
        if (service.reoccurring) {
            return true
        } else {
            return false
        }
    };

    const filterOneTimes = function trueIfServiceIsOneTime(service) {
        if (!service.reoccurring) {
            return true
        } else {
            return false
        }
    }

    clients.forEach((client) => {
        const services = client.services;
        //  filtering through services Arr 
        const monthly = services.filter(filterMonthlys);
        const oneTime = services.filter(filterOneTimes);

        //  adding total number of services client has to totalServices
        totalServices += services.length;
        //  adding monthly Services to monthlyServices
        monthlyServices += monthly.length;
        //  adding oneTime to oneTimeServices
        oneTimeServices += oneTime.length;
    });

    req.totalServices = totalServices;
    req.monthlyServices = monthlyServices;
    req.oneTimeServices = oneTimeServices;
    return next();



})