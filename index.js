var fs = require('fs');
var http = require('http');
var mkfifo = require('mkfifo').mkfifoSync;
var mplayer = require('node-mplayer');
var routes = require('routes');
var tmp = require('tmp');
var youtubedl = require('youtube-dl');

// Routes
var router = routes();
router.addRoute("/play/:url", playUrl);
router.addRoute("/*", fourOhFour);

// Parse optional port arg.
var port = (process.argv.length > 2) ? process.argv[2] : 8000;

// Create server + setup router
http.createServer(function(req, res) {
  var route = router.match(req.url);
  if (route) {
    route.fn.apply(null, [req, res, route.params, route.splats]);
  }
}).listen(port);

function errorResponse(res, err, msg) {
  if (!res.finished) {
    res.writeHead(500, msg);
    res.end();
  }
  console.error(err);
}

// /play/:url route
function playUrl(req, res, params, splats) {

  // Generate a unique tempfile name
  tmp.tmpName(function(err, fifoName) {
    if (err) {
      errorResponse(res, err, "tmp messed up");
    }

    // Create a temporary FIFO to feed video data into. This is necessary
    // because some players (e.g. omxplayer) don't support input from stdin.
    try {
      mkfifo(fifoName, 0755);
    } catch (e) {
      errorResponse(res, e, "mkfifo messed up");
    }
    console.error("Created fifo: " + fifoName);
    var fifo = fs.createWriteStream(fifoName);

    // Start downloading the video and piping it into the FIFO.
    console.error("Starting to download " + params.url);
    var video = youtubedl(params.url, ['--max-quality=18'], {});
    video.pipe(fifo);

    // Have the player start playing from the FIFO.
    var player = new mplayer(fifoName);
    player.play();

    video.on('info', function(info) {
      // TODO: store the title somewhere (or something) for future use
      //console.dir(info);

      // End the request with success if the video has been retrieved
      // successfully.
      if (!res.finished) {
        res.end();
      }
    });

    // Bail gracefully on FIFO errors.
    fifo.on('error', function(err) {
      if (err.code === 'EPIPE') {
        // This is perfectly normal: the player was likely killed.
        console.error('player killed');
      } else {
        errorResponse(res, err, "fifo messed up");
      }
    });

    // Bail gracefully on video errors.
    video.on('error', function(err) {
      errorResponse(res, err, "video messed up");
    });

    // Bail gracefully on player errors.
    player.on('error', function(err) {
      errorResponse(res, err, "player messed up");
    });

    player.on('end', function() {
      // TODO: do something meaningful?
    });
  });
}

// /* route
function fourOhFour(req, res, params, splats) {
  res.writeHead(404, "Totally not found");
  res.end();
}

