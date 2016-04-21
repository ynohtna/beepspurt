# Hacks

**node-restify** 4.0.4 has the following on line 37 of `lib/clients/http_client.js`:
```
var VERSION = JSON.parse(fs.readFileSync(path.normalize(__dirname + '/../../package.json'), 'utf8')).version;
```
JSPM bundles this so it executes at runtime and fails in Plask's node environment.

Either edit this line before bundling (hard-coding version string, maybe), or install my
personal fork through JSPM:
```
jspm install restify=github:ynohtna/node-restify@hacks
```
This fork removes an attempt by `lib/dtrace.js` to `require('dtrace-provider')` at runtime, which
also fails in the Plask node environment, as well as branching off the latest release on github.

The default branch/version served by npm which installs a very old 1.32.5 version of `spdy` that
tries to `require('_http_commmon')` (line 12, `lib/spdy/stream.js`) at runtime and, again, fails.

## react-redux-provide

May need its package.json fiddling so its react & react-dom dependencies accept v15.0.0, a la:
```
    "react": "^0.14.0 || ^15.0.0-0",
```
