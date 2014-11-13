var routes = require('routes');
var http = require('http');
var youtubedl = require('youtube-dl');
var mplayer = require('node-mplayer');
var fs = require('fs');
var mkfifo = require('mkfifo').mkfifoSync;
var tmp = require('tmp');

var router = routes();
router.addRoute("/play/:url", playUrl);
router.addRoute("/*", fourOhFour);

var port = (process.argv.length > 2) ? process.argv[2] : 8000;

http.createServer(function(req, res) {
  var route = router.match(req.url);
  if (route) {
    route.fn.apply(null, [req, res, route.params, route.splats]);
  }
}).listen(port);


function playUrl(req, res, params, splats) {
  var video = youtubedl(params.url, ['--max-quality=18'], {});

  tmp.tmpName(function(err, fifoName) {
    if (err) {
      throw err;
      res.writeHead(500, "tmpName messed up");
      res.write(err.toString());
      res.end();
    }

    try {
      mkfifo(fifoName, 0755);
    } catch (e) {
      res.writeHead(500, "mkfifo messed up");
      res.write(e.toString());
      res.end();
    }
    console.error("Created fifo: " + fifoName);
    var fifo = fs.createWriteStream(fifoName);

    console.error("Starting to download " + params.url);

    video.pipe(fifo);

    var player = new mplayer(fifoName);
    player.play();

    fifo.on('error', function(err) {
      if (err.code === 'EPIPE') {
        // perfectly normal; the player was likely killed
        console.error('player killed');
        res.end();
      } else {
        console.error("fifo error");
        console.error(err);
        res.writeHead(500, 'fifo error');
        res.write(err.toString());
        res.end();
      }
    });
    video.on('error', function(err) {
      console.error("video error");
      console.error(err);
      res.writeHead(500, 'video error');
      res.write(err.toString());
      res.end();
    });
    player.on('error', function(err) {
      console.error("player error");
      console.error(err);
      res.writeHead(500, 'player error');
      res.write(err.toString());
      res.end();
    });
    player.on('end', function() {
      res.end();
    });
  });
}

function fourOhFour(req, res, params, splats) {
  res.writeHead(404, "Totally not found");
  res.end();
}

