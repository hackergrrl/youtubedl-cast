# Woah woah woah
This is still in pre-release development. You probably shouldn't use this unless
you like pain.

## What is this?
Cast tabs with videos to a server hooked up a TV using bookmarklets!

## Wha? Cast videos to a server?
Install **youtubedl-cast** to your handy [Raspberry Pi]() or server hooked up
to your TV and send videos to it from any [youtube-dl compatible page]().

## Using bookmarklets?
Proprietary vendor plugin systems like Chrome extensions and Firefox add-ons
are lame and non-portable: [embed javascript in bookmarklets]() for easy,
browser agnostic functionality! One click to play the current tab's video on
your TV!

## Installation
```
$ npm install -g youtubedl-cast

$ youtubedl-cast
```

## Cast videos: bookmarklet
Paste the following bookmarklet verbatim as a new bookmark in your browser of choice:

```
javascript:var SERVER="http://localhost:8000";var request = new XMLHttpRequest(); var url = encodeURIComponent(location.href); request.open("GET", SERVER+"/play/"+url, true); request.onreadystatechange = function() { var done = 4, ok = 200; if (request.readyState == done && request.status == ok) { if (request.responseText) { alert(request.responseText); } } }; request.send(null);
```

Don't forget to replace the value of `SERVER` with the IP:port tuple of your choosing.

## HTTP API
**youtubedl-cast** exposes a simple HTTP interface:

`/play/:url`plays the media at the provided `:url` (url-encoded)

(more routes forthcoming)

## License
BSD
