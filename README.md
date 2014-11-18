## What is this?
**youtubedl-media-server** is a lightweight front-end over [youtube-dl]() and
your favourite media player (currently [mplayer]() or [omxplayer]()). It runs
as an HTTP server that exposes a small set of useful commands to initiate and
control playback.

## Installation
```
$ npm install -g youtubedl-media-player

$ youtubedl-media-player
```

## Send the current tab's video to the server
The use case that **youtubedl-media-server** was written to fulfill was to make
it easy to initiate playback of a video on [any website supported by
youtube-dl]() from your current device to a device hooked up a larger display,
like, say, a [Raspberry Pi]() hooked up a TV.

Assuming this also resembles your use case, you can use the following
[bookmarklet]() to play the current tab's video on the device running
**youtubedl-media-server**:

```
javascript:var SERVER="http://localhost:8000";var request = new XMLHttpRequest(); var url = encodeURIComponent(location.href); request.open("GET", SERVER+/play/"+url, true); request.onreadystatechange = function() { var done = 4, ok = 200; if (request.readyState == done && request.status == ok) { if (request.responseText) { alert(request.responseText); } } }; request.send(null);
```

Simply replace the value of `SERVER` with the IP:port tuple of your choosing.

## HTTP API
For a less streamlined experience, the server exposes the following set of HTTP
routes:

`/play/:url`plays the media at the provided `:url` (url-encoded)

(more routes forthcoming)

## License
BSD
