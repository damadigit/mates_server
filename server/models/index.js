'use strict';

const fs = require('fs');

module.exports = function () {
    fs.readdirSync('./server/models').forEach(function (file) {
     //   console.log(file);
        if (file.substr(-3, 3) === '.js' && file !== 'index.js') {
            require('./' + file.replace('.js', ''));
        }
    });
};
