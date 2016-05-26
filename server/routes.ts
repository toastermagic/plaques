/**
 * Main application routes
 */

'use strict';

var path = require('path');

module.exports = function(app, server) {
   app.route('/views/:viewName')
   .get(function(req, res) {
      res.render(req.params.viewName); 
   });

  // All other routes should redirect to the index.html
  app.route('/*')
    .get(function(req, res) {
        res.sendFile(path.resolve(app.get('appPath') + '/index.html'));
        //res.render('layout');
    });
};
