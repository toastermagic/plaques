'use strict';

var _ = require('lodash');
var sql = require('mssql');

var PlaqueRepositoryFactory = function(config) {
    var _ready = false;

    return {
        connect: function() {
            if (_ready)
            {
                return;
            }

            sql.connect(config.sqlServer).then(function() {
                console.log('sql server connected', config.sqlServer.database);
                _ready = true;
            }).catch(function(err) {
                console.error(err);
                _ready = false;
            });
        },
        getById: function(plaqueId) {
            var request = new sql.Request();

            return request.query('select * from plaque where plaqueId = \'' + plaqueId + '\'')
                .then(function(recordset) {
                    return recordset[0];
                }).catch(function(err) {
                    console.error(err);
                    // ... error checks
                });
        },
        list: function(numRecords) {
            var request = new sql.Request();
            return request.query('select top ' + numRecords.toString() + ' * from plaque')
                .then(function(recordset) {
                    return recordset;
                }).catch(function(err) {
                    console.error(err);
                    // ... error checks
                });
        },
        stream: function(searchTerm, startCallback, rowCallback, endCallback) {
            if (searchTerm === null)
                return;

            var request = new sql.Request();
            var rowCount = 0;
                        
            request.stream = true;
            request.query('select top 50 * from plaque where firstName + lastName + streetAddress like \'%' + searchTerm + '%\'');
            
            request.on('recordset', function(columns) {
                startCallback();
            });
            
            request.on('row', function(row) {
                rowCount++;
                if (rowCallback!==null) {
                    rowCallback(row);
                }
            });
            
            request.on('error', function(err) {
                console.error(err);
            });
            
            request.on('done', function(affected) {
                console.log('done total', rowCount);
                if (endCallback!==undefined){
                    endCallback(rowCount);
                }
            });
        },
        search: function(searchTerm) {
            if (searchTerm === null)
                return;

            var request = new sql.Request();
            return request
                .query('select top 50 * from plaque where firstName + lastName + streetAddress like \'%' + searchTerm + '%\'')
                .then(function(recordset) {
                    if (recordset.length > 0) {
                        return recordset;
                    }
                }).catch(function(err) {
                    console.error(err);
                    // ... error checks
                });
        }
    }
}

module.exports = PlaqueRepositoryFactory;