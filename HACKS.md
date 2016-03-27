# Hacks

**node-restify** 4.0.4 has the following on line 37 of `lib/clients/http_client.js`:
```
var VERSION = JSON.parse(fs.readFileSync(path.normalize(__dirname + '/../../package.json'), 'utf8')).version;
```
JSPM bundles this so it executes at runtime and fails in Plask's node environment.

Either comment out this line before bundling, or install personal fork with JSPM:
```
jspm install restify=github:ynohtna/node-restify@hacks
```
This removes an attempt by `lib/dtrace.js` to `require('dtrace-provider')` at runtime, which also
fails in the Plask node environment.

The `ynohtna/node-restify` fork branches off the latest release github, unlike the
default version served by npm which installs a very old 1.32.5 version of `spdy` that
tries to `require('_http_commmon')` (line 12, `lib/spdy/stream.js`) at runtime and,
again, fails.
