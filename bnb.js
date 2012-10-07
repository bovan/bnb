var Bnb = (function(){
  var config  = require('./config'),
      express = require('express'),
      routes  = require('./routes'),
      user    = require('./routes/user'),
      http    = require('http'),
      path    = require('path'),
      app     = express();

  function startServer () {
    app.configure(function(){
        app.set('port', config.port);
        app.set('views', config.rootdir + '/' + config.viewsdir);

        app.set('view engine', 'ejs');
        app.use(express.favicon());
        app.use(express.logger('dev'));
        app.use(express.bodyParser());
        app.use(express.methodOverride());
        app.use(express.cookieParser('your secret here'));
        app.use(express.session());
        app.use(app.router);
        app.use(require('less-middleware')({ src: config.rootdir + '/public' }));
        app.use(express.static(path.join(config.rootdir, 'public')));
    });

    app.configure('development', function(){
        app.use(express.errorHandler());
    });

    app.get('/', routes.index);
    app.get('/users', user.list);

    http.createServer(app).listen(app.get('port'), function(){
        console.log("Express server listening on port " + app.get('port'));
    });
  }
  
  function addOverrides (configObject) {
    var key;
    for (key in configObject) {
      config[key] = configObject[key];
    }
  }
  
  return {
    start     :  startServer,
    configure :  addOverrides
  };
})();

module.exports = Bnb;