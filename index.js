var dust = require('dust')();
var serand = require('serand');

var user;

dust.loadSource(dust.compile(require('./template'), 'hub-drones-ui'));

module.exports = function (sandbox, fn, options) {
    $.ajax({
        url: '/apis/v/domains/' + options.id + '/drones',
        headers: {
            'x-host': 'hub.serandives.com:4000'
        },
        dataType: 'json',
        success: function (data) {
            serand.once('hub', 'domains listed', function (domain) {
                dust.render('hub-drones-ui', {
                    domain: domain.name,
                    drones: data
                }, function (err, out) {
                    if (err) {
                        fn(err);
                        return;
                    }
                    $(out).appendTo(sandbox);
                    fn(false, function () {
                        $('.hub-drones', sandbox).remove();
                    });
                });
            });
            serand.emit('hub', 'domains list', options.id);
        },
        error: function () {
            fn(true, function () {

            });
        }
    });
};
