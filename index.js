var routes = require('routes');
var http = require('http');
var youtubedl = require('youtube-dl');
var mplayer = require('node-mplayer');

var router = routes();
router.addRoute("/play/:url", playUrl);
router.addRoute("/*", fourOhFour);

http.createServer(function(req, res) {
  console.dir(req.url);

  var route = router.match(req.url);
  if (route) {
    route.fn.apply(null, [req, res, route.params, route.splats]);
  }
}).listen(8000);


function playUrl(req, res, params, splats) {
  var video = youtubedl(params.url, ['--max-quality=18'], {});
  process.stdout.pipe(process.stdin);
  video.pipe(process.stdout);
  var player = new mplayer("-");
  player.play();
  res.end();
}

function fourOhFour(req, res, params, splats) {
  res.writeHead(404, "Totally not found");
  res.end();
}

