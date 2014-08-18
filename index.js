var dust = require('dust')();
var serand = require('serand');

var user;

dust.loadSource(dust.compile(require('./template'), 'hub-drones-ui'));

module.exports = function (sandbox, fn, options) {
    serand.once('hub', 'domains res', function (domain) {
        $.ajax({
            url: '/apis/v/domains/' + options.id + '/drones',
            headers: {
                'x-host': 'hub.serandives.com:4000'
            },
            dataType: 'json',
            success: function (data) {
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
            },
            error: function () {
                fn(true, function () {

                });
            }
        });
    });
    serand.emit('hub', 'domains req', options.id);
};
