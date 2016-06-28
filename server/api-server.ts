import * as express from 'express';
// import * as favicon from 'serve-favicon';
import * as logger from 'morgan';
import * as cookieParser from 'cookie-parser';
import * as compression from 'compression';
import * as bodyParser from 'body-parser';
import * as http from 'http';
// import * as httpProxy from 'http-proxy';

export default (PORT) => {
    var app = express();
    var server = http.createServer(app);
    // var proxy = httpProxy.createProxyServer({
    //     changeOrigin: true
    // });
    // view engine setup
    app.set('view engine', 'html');

    // uncomment after placing your favicon in /public
    // app.use(favicon(__dirname + '/public/favicon.ico'));
    app.use(logger('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(compression());

    console.log('serving static from ', __dirname + '/../wwwroot')
    app.use(express.static(__dirname + '/../wwwroot'));

    app.use(function (req, res, next) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers',
            'Origin, X-Requested-With, Content-Type, Accept');
        next();
    });

    app.use('/api/plaque', require('./api/plaque'));

    // app.all('/build/*', function (req, res) {
    //     proxy.web(req, res, {
    //         target: `http://localhost:${PORT + 1}`
    //     });
    // });

    // the 404 Route (ALWAYS Keep this as the last route)
    // app.get('*', function (req, res) {
    //     res.sendFile('index.html', { root: __dirname + '/../wwwroot' });
    // });

    server.listen(PORT, function (err) {
        console.log('express listening on port ' + PORT);
    });

    return server;
}

