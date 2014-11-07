var routes = require('routes');
var http = require('http');

var router = routes();
router.addRoute("/play/:url", playUrl);
router.addRoute("/*", root);

http.createServer(function(req, res) {
  console.dir(req.url);

  var route = router.match(req.url);
  if (route) {
    route.fn.apply(null, [req, res, route.params, route.splats]);
  }
}).listen(8000);


function playUrl(req, res, params, splats) {
  console.log(params);
  res.end();
}

function root(req, res, params, splats) {
  res.writeHead(404, "Totally not found");
  res.end();
}

