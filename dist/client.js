"format global";

/* */ 
"format global";
(function (global) {
  var babelHelpers = global.babelHelpers = {};

  babelHelpers.inherits = function (subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  };

  babelHelpers.defaults = function (obj, defaults) {
    var keys = Object.getOwnPropertyNames(defaults);

    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      var value = Object.getOwnPropertyDescriptor(defaults, key);

      if (value && value.configurable && obj[key] === undefined) {
        Object.defineProperty(obj, key, value);
      }
    }

    return obj;
  };

  babelHelpers.createClass = (function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  })();

  babelHelpers.createDecoratedClass = (function () {
    function defineProperties(target, descriptors, initializers) {
      for (var i = 0; i < descriptors.length; i++) {
        var descriptor = descriptors[i];
        var decorators = descriptor.decorators;
        var key = descriptor.key;
        delete descriptor.key;
        delete descriptor.decorators;
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor || descriptor.initializer) descriptor.writable = true;

        if (decorators) {
          for (var f = 0; f < decorators.length; f++) {
            var decorator = decorators[f];

            if (typeof decorator === "function") {
              descriptor = decorator(target, key, descriptor) || descriptor;
            } else {
              throw new TypeError("The decorator for method " + descriptor.key + " is of the invalid type " + typeof decorator);
            }
          }

          if (descriptor.initializer !== undefined) {
            initializers[key] = descriptor;
            continue;
          }
        }

        Object.defineProperty(target, key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps, protoInitializers, staticInitializers) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps, protoInitializers);
      if (staticProps) defineProperties(Constructor, staticProps, staticInitializers);
      return Constructor;
    };
  })();

  babelHelpers.createDecoratedObject = function (descriptors) {
    var target = {};

    for (var i = 0; i < descriptors.length; i++) {
      var descriptor = descriptors[i];
      var decorators = descriptor.decorators;
      var key = descriptor.key;
      delete descriptor.key;
      delete descriptor.decorators;
      descriptor.enumerable = true;
      descriptor.configurable = true;
      if ("value" in descriptor || descriptor.initializer) descriptor.writable = true;

      if (decorators) {
        for (var f = 0; f < decorators.length; f++) {
          var decorator = decorators[f];

          if (typeof decorator === "function") {
            descriptor = decorator(target, key, descriptor) || descriptor;
          } else {
            throw new TypeError("The decorator for method " + descriptor.key + " is of the invalid type " + typeof decorator);
          }
        }
      }

      if (descriptor.initializer) {
        descriptor.value = descriptor.initializer.call(target);
      }

      Object.defineProperty(target, key, descriptor);
    }

    return target;
  };

  babelHelpers.defineDecoratedPropertyDescriptor = function (target, key, descriptors) {
    var _descriptor = descriptors[key];
    if (!_descriptor) return;
    var descriptor = {};

    for (var _key in _descriptor) descriptor[_key] = _descriptor[_key];

    descriptor.value = descriptor.initializer ? descriptor.initializer.call(target) : undefined;
    Object.defineProperty(target, key, descriptor);
  };

  babelHelpers.taggedTemplateLiteral = function (strings, raw) {
    return Object.freeze(Object.defineProperties(strings, {
      raw: {
        value: Object.freeze(raw)
      }
    }));
  };

  babelHelpers.taggedTemplateLiteralLoose = function (strings, raw) {
    strings.raw = raw;
    return strings;
  };

  babelHelpers.toArray = function (arr) {
    return Array.isArray(arr) ? arr : Array.from(arr);
  };

  babelHelpers.toConsumableArray = function (arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

      return arr2;
    } else {
      return Array.from(arr);
    }
  };

  babelHelpers.slicedToArray = (function () {
    function sliceIterator(arr, i) {
      var _arr = [];
      var _n = true;
      var _d = false;
      var _e = undefined;

      try {
        for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
          _arr.push(_s.value);

          if (i && _arr.length === i) break;
        }
      } catch (err) {
        _d = true;
        _e = err;
      } finally {
        try {
          if (!_n && _i["return"]) _i["return"]();
        } finally {
          if (_d) throw _e;
        }
      }

      return _arr;
    }

    return function (arr, i) {
      if (Array.isArray(arr)) {
        return arr;
      } else if (Symbol.iterator in Object(arr)) {
        return sliceIterator(arr, i);
      } else {
        throw new TypeError("Invalid attempt to destructure non-iterable instance");
      }
    };
  })();

  babelHelpers.slicedToArrayLoose = function (arr, i) {
    if (Array.isArray(arr)) {
      return arr;
    } else if (Symbol.iterator in Object(arr)) {
      var _arr = [];

      for (var _iterator = arr[Symbol.iterator](), _step; !(_step = _iterator.next()).done;) {
        _arr.push(_step.value);

        if (i && _arr.length === i) break;
      }

      return _arr;
    } else {
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }
  };

  babelHelpers.objectWithoutProperties = function (obj, keys) {
    var target = {};

    for (var i in obj) {
      if (keys.indexOf(i) >= 0) continue;
      if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
      target[i] = obj[i];
    }

    return target;
  };

  babelHelpers.hasOwn = Object.prototype.hasOwnProperty;
  babelHelpers.slice = Array.prototype.slice;
  babelHelpers.bind = Function.prototype.bind;

  babelHelpers.defineProperty = function (obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  };

  babelHelpers.asyncToGenerator = function (fn) {
    return function () {
      var gen = fn.apply(this, arguments);
      return new Promise(function (resolve, reject) {
        var callNext = step.bind(null, "next");
        var callThrow = step.bind(null, "throw");

        function step(key, arg) {
          try {
            var info = gen[key](arg);
            var value = info.value;
          } catch (error) {
            reject(error);
            return;
          }

          if (info.done) {
            resolve(value);
          } else {
            Promise.resolve(value).then(callNext, callThrow);
          }
        }

        callNext();
      });
    };
  };

  babelHelpers.interopExportWildcard = function (obj, defaults) {
    var newObj = defaults({}, obj);
    delete newObj["default"];
    return newObj;
  };

  babelHelpers.interopRequireWildcard = function (obj) {
    if (obj && obj.__esModule) {
      return obj;
    } else {
      var newObj = {};

      if (obj != null) {
        for (var key in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
        }
      }

      newObj["default"] = obj;
      return newObj;
    }
  };

  babelHelpers.interopRequireDefault = function (obj) {
    return obj && obj.__esModule ? obj : {
      "default": obj
    };
  };

  babelHelpers._typeof = function (obj) {
    return obj && obj.constructor === Symbol ? "symbol" : typeof obj;
  };

  babelHelpers._extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  babelHelpers.get = function get(object, property, receiver) {
    if (object === null) object = Function.prototype;
    var desc = Object.getOwnPropertyDescriptor(object, property);

    if (desc === undefined) {
      var parent = Object.getPrototypeOf(object);

      if (parent === null) {
        return undefined;
      } else {
        return get(parent, property, receiver);
      }
    } else if ("value" in desc) {
      return desc.value;
    } else {
      var getter = desc.get;

      if (getter === undefined) {
        return undefined;
      }

      return getter.call(receiver);
    }
  };

  babelHelpers.set = function set(object, property, value, receiver) {
    var desc = Object.getOwnPropertyDescriptor(object, property);

    if (desc === undefined) {
      var parent = Object.getPrototypeOf(object);

      if (parent !== null) {
        set(parent, property, value, receiver);
      }
    } else if ("value" in desc && desc.writable) {
      desc.value = value;
    } else {
      var setter = desc.set;

      if (setter !== undefined) {
        setter.call(receiver, value);
      }
    }

    return value;
  };

  babelHelpers.newArrowCheck = function (innerThis, boundThis) {
    if (innerThis !== boundThis) {
      throw new TypeError("Cannot instantiate an arrow function");
    }
  };

  babelHelpers.classCallCheck = function (instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };

  babelHelpers.objectDestructuringEmpty = function (obj) {
    if (obj == null) throw new TypeError("Cannot destructure undefined");
  };

  babelHelpers.temporalUndefined = {};

  babelHelpers.temporalAssertDefined = function (val, name, undef) {
    if (val === undef) {
      throw new ReferenceError(name + " is not defined - temporal dead zone");
    }

    return true;
  };

  babelHelpers.selfGlobal = typeof global === "undefined" ? self : global;
  babelHelpers.typeofReactElement = typeof Symbol === "function" && Symbol["for"] && Symbol["for"]("react.element") || 60103;

  babelHelpers.defaultProps = function (defaultProps, props) {
    if (defaultProps) {
      for (var propName in defaultProps) {
        if (typeof props[propName] === "undefined") {
          props[propName] = defaultProps[propName];
        }
      }
    }

    return props;
  };

  babelHelpers._instanceof = function (left, right) {
    if (right != null && right[Symbol.hasInstance]) {
      return right[Symbol.hasInstance](left);
    } else {
      return left instanceof right;
    }
  };

  babelHelpers.interopRequire = function (obj) {
    return obj && obj.__esModule ? obj["default"] : obj;
  };
})(typeof global === "undefined" ? self : global);

!function(e){function r(e,r,o){return 4===arguments.length?t.apply(this,arguments):void n(e,{declarative:!0,deps:r,declare:o})}function t(e,r,t,o){n(e,{declarative:!1,deps:r,executingRequire:t,execute:o})}function n(e,r){r.name=e,e in p||(p[e]=r),r.normalizedDeps=r.deps}function o(e,r){if(r[e.groupIndex]=r[e.groupIndex]||[],-1==v.call(r[e.groupIndex],e)){r[e.groupIndex].push(e);for(var t=0,n=e.normalizedDeps.length;n>t;t++){var a=e.normalizedDeps[t],u=p[a];if(u&&!u.evaluated){var d=e.groupIndex+(u.declarative!=e.declarative);if(void 0===u.groupIndex||u.groupIndex<d){if(void 0!==u.groupIndex&&(r[u.groupIndex].splice(v.call(r[u.groupIndex],u),1),0==r[u.groupIndex].length))throw new TypeError("Mixed dependency cycle detected");u.groupIndex=d}o(u,r)}}}}function a(e){var r=p[e];r.groupIndex=0;var t=[];o(r,t);for(var n=!!r.declarative==t.length%2,a=t.length-1;a>=0;a--){for(var u=t[a],i=0;i<u.length;i++){var s=u[i];n?d(s):l(s)}n=!n}}function u(e){return x[e]||(x[e]={name:e,dependencies:[],exports:{},importers:[]})}function d(r){if(!r.module){var t=r.module=u(r.name),n=r.module.exports,o=r.declare.call(e,function(e,r){if(t.locked=!0,"object"==typeof e)for(var o in e)n[o]=e[o];else n[e]=r;for(var a=0,u=t.importers.length;u>a;a++){var d=t.importers[a];if(!d.locked)for(var i=0;i<d.dependencies.length;++i)d.dependencies[i]===t&&d.setters[i](n)}return t.locked=!1,r},r.name);t.setters=o.setters,t.execute=o.execute;for(var a=0,i=r.normalizedDeps.length;i>a;a++){var l,s=r.normalizedDeps[a],c=p[s],v=x[s];v?l=v.exports:c&&!c.declarative?l=c.esModule:c?(d(c),v=c.module,l=v.exports):l=f(s),v&&v.importers?(v.importers.push(t),t.dependencies.push(v)):t.dependencies.push(null),t.setters[a]&&t.setters[a](l)}}}function i(e){var r,t=p[e];if(t)t.declarative?c(e,[]):t.evaluated||l(t),r=t.module.exports;else if(r=f(e),!r)throw new Error("Unable to load dependency "+e+".");return(!t||t.declarative)&&r&&r.__useDefault?r["default"]:r}function l(r){if(!r.module){var t={},n=r.module={exports:t,id:r.name};if(!r.executingRequire)for(var o=0,a=r.normalizedDeps.length;a>o;o++){var u=r.normalizedDeps[o],d=p[u];d&&l(d)}r.evaluated=!0;var c=r.execute.call(e,function(e){for(var t=0,n=r.deps.length;n>t;t++)if(r.deps[t]==e)return i(r.normalizedDeps[t]);throw new TypeError("Module "+e+" not declared as a dependency.")},t,n);c&&(n.exports=c),t=n.exports,t&&t.__esModule?r.esModule=t:r.esModule=s(t)}}function s(r){if(r===e)return r;var t={};if("object"==typeof r||"function"==typeof r)if(g){var n;for(var o in r)(n=Object.getOwnPropertyDescriptor(r,o))&&h(t,o,n)}else{var a=r&&r.hasOwnProperty;for(var o in r)(!a||r.hasOwnProperty(o))&&(t[o]=r[o])}return t["default"]=r,h(t,"__useDefault",{value:!0}),t}function c(r,t){var n=p[r];if(n&&!n.evaluated&&n.declarative){t.push(r);for(var o=0,a=n.normalizedDeps.length;a>o;o++){var u=n.normalizedDeps[o];-1==v.call(t,u)&&(p[u]?c(u,t):f(u))}n.evaluated||(n.evaluated=!0,n.module.execute.call(e))}}function f(e){if(D[e])return D[e];if("@node/"==e.substr(0,6))return y(e.substr(6));var r=p[e];if(!r)throw"Module "+e+" not present.";return a(e),c(e,[]),p[e]=void 0,r.declarative&&h(r.module.exports,"__esModule",{value:!0}),D[e]=r.declarative?r.module.exports:r.esModule}var p={},v=Array.prototype.indexOf||function(e){for(var r=0,t=this.length;t>r;r++)if(this[r]===e)return r;return-1},g=!0;try{Object.getOwnPropertyDescriptor({a:0},"a")}catch(m){g=!1}var h;!function(){try{Object.defineProperty({},"a",{})&&(h=Object.defineProperty)}catch(e){h=function(e,r,t){try{e[r]=t.value||t.get.call(e)}catch(n){}}}}();var x={},y="undefined"!=typeof System&&System._nodeRequire||"undefined"!=typeof require&&require.resolve&&"undefined"!=typeof process&&require,D={"@empty":{}};return function(e,n,o){return function(a){a(function(a){for(var u={_nodeRequire:y,register:r,registerDynamic:t,get:f,set:function(e,r){D[e]=r},newModule:function(e){return e}},d=0;d<n.length;d++)(function(e,r){r&&r.__esModule?D[e]=r:D[e]=s(r)})(n[d],arguments[d]);o(u);var i=f(e[0]);if(e.length>1)for(var d=1;d<e.length;d++)f(e[d]);return i.__useDefault?i["default"]:i})}}}("undefined"!=typeof self?self:global)

(["1"], [], function($__System) {

!function(){var t=$__System;if("undefined"!=typeof window&&"undefined"!=typeof document&&window.location)var s=location.protocol+"//"+location.hostname+(location.port?":"+location.port:"");t.set("@@cjs-helpers",t.newModule({getPathVars:function(t){var n,o=t.lastIndexOf("!");n=-1!=o?t.substr(0,o):t;var e=n.split("/");return e.pop(),e=e.join("/"),"file:///"==n.substr(0,8)?(n=n.substr(7),e=e.substr(7),isWindows&&(n=n.substr(1),e=e.substr(1))):s&&n.substr(0,s.length)===s&&(n=n.substr(s.length),e=e.substr(s.length)),{filename:n,dirname:e}}}))}();
$__System.registerDynamic("2", [], true, function($__require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  module.exports = window.ReactDOM;
  global.define = __define;
  return module.exports;
});

$__System.register('3', ['4', '5', '6', '7', '8', '9'], function (_export) {
  var React, PropTypes, provide, _get, _inherits, _createClass, _classCallCheck, connectedStates, Header;

  return {
    setters: [function (_5) {
      React = _5['default'];
      PropTypes = _5.PropTypes;
    }, function (_6) {
      provide = _6['default'];
    }, function (_) {
      _get = _['default'];
    }, function (_2) {
      _inherits = _2['default'];
    }, function (_3) {
      _createClass = _3['default'];
    }, function (_4) {
      _classCallCheck = _4['default'];
    }],
    execute: function () {
      'use strict';

      connectedStates = {
        open: true,
        opening: true
      };

      Header = (function (_React$Component) {
        _inherits(Header, _React$Component);

        function Header() {
          _classCallCheck(this, _Header);

          _get(Object.getPrototypeOf(_Header.prototype), 'constructor', this).apply(this, arguments);
        }

        _createClass(Header, [{
          key: 'status',
          value: function status(socketStatus) {
            switch (socketStatus) {
              case 'opening':
                return '^';
              case 'open':
                return '≡';
              case 'closed':
                return '⨯';
              case 'error':
                return '⚠';
              default:
                return '?';
            }
          }
        }, {
          key: 'reconnect',
          value: function reconnect() {
            console.log('... RECONNECTING ...'); // eslint-disable-line no-console
            this.props.openSocket();
          }
        }, {
          key: 'reload',
          value: function reload() {
            window.location.reload();
          }
        }, {
          key: 'render',
          value: function render() {
            //    console.log('Header', this.props);
            var _props = this.props;
            var pingInfo = _props.pingInfo;
            var socketStatus = _props.socketStatus;

            var status = this.status(socketStatus);
            var pingSymbol = '⨯'; // Small cross as ping symbol for unknown states.
            var pingColour = '';
            if (pingInfo === -2) {
              pingSymbol = '·';
            } else if (pingInfo === 0) {
              pingSymbol = '✓';
            } else if (pingInfo > 0) {
              pingSymbol = '' + pingInfo;
              if (pingInfo > 7) {
                pingColour = 'danger';
              } else if (pingInfo > 3) {
                pingColour = 'warning';
              } else {
                pingColour = 'notify';
              }
            }
            var reconnect = socketStatus in connectedStates ? null : React.createElement(
              'a',
              { className: 'reconnect', onClick: this.reconnect.bind(this) },
              'reconnect'
            );
            return React.createElement(
              'span',
              { className: 'header ' + socketStatus },
              React.createElement(
                'span',
                { className: 'status' },
                status
              ),
              React.createElement(
                'span',
                { className: 'ping ' + pingColour },
                pingSymbol
              ),
              reconnect,
              React.createElement(
                'h1',
                null,
                '[beep]spurter'
              ),
              React.createElement(
                'a',
                { className: 'reload', onClick: this.reload.bind(this) },
                'reload'
              )
            );
          }
        }], [{
          key: 'propTypes',
          value: {
            socketStatus: PropTypes.string.isRequired,
            pingInfo: PropTypes.number.isRequired,
            openSocket: PropTypes.func.isRequired
          },
          enumerable: true
        }]);

        var _Header = Header;
        Header = provide(Header) || Header;
        return Header;
      })(React.Component);

      _export('default', Header);
    }
  };
});
$__System.register('a', ['4', '5', '6', '7', '8', '9'], function (_export) {
  var React, PropTypes, provide, _get, _inherits, _createClass, _classCallCheck, Master;

  return {
    setters: [function (_5) {
      React = _5['default'];
      PropTypes = _5.PropTypes;
    }, function (_6) {
      provide = _6['default'];
    }, function (_) {
      _get = _['default'];
    }, function (_2) {
      _inherits = _2['default'];
    }, function (_3) {
      _createClass = _3['default'];
    }, function (_4) {
      _classCallCheck = _4['default'];
    }],
    execute: function () {
      'use strict';

      Master = (function (_React$Component) {
        _inherits(Master, _React$Component);

        function Master() {
          _classCallCheck(this, _Master);

          _get(Object.getPrototypeOf(_Master.prototype), 'constructor', this).apply(this, arguments);
        }

        _createClass(Master, [{
          key: 'stateChange',
          value: function stateChange(state) {
            //    console.log('Master stateChange request', state);
            this.props.sendSocket('/renderer/STATE', state);
          }
        }, {
          key: 'render',
          value: function render() {
            var _this = this;

            //    console.log('Master', this.props.masterState);
            var state = this.props.masterState.state;

            var activeOff = state === 'off' ? 'active' : null;
            var activeRun = state === 'run' ? 'active' : null;
            var activePause = state === 'pause' ? 'active' : null;
            return React.createElement(
              'span',
              { className: 'master' },
              React.createElement(
                'button',
                { className: activeOff,
                  onClick: function () {
                    return _this.stateChange('off');
                  }
                },
                'off'
              ),
              React.createElement(
                'button',
                { className: activeRun,
                  onClick: function () {
                    return _this.stateChange('run');
                  }
                },
                'run'
              ),
              React.createElement(
                'button',
                { className: activePause,
                  onClick: function () {
                    return _this.stateChange('pause');
                  }
                },
                'pause'
              )
            );
          }
        }], [{
          key: 'propTypes',
          value: {
            // TODO: rendererState
            masterState: PropTypes.any,
            sendSocket: PropTypes.func.isRequired
          },
          enumerable: true
        }]);

        var _Master = Master;
        Master = provide(Master) || Master;
        return Master;
      })(React.Component);

      _export('default', Master);
    }
  };
});
$__System.register('b', ['4', '5', '6', '7', '8', '9', 'e', 'c', 'd'], function (_export) {
  var React, PropTypes, provide, _get, _inherits, _createClass, _classCallCheck, _extends, TextArea, halignClassLookup, valignClassLookup, TextAreaContainer;

  return {
    setters: [function (_5) {
      React = _5['default'];
      PropTypes = _5.PropTypes;
    }, function (_6) {
      provide = _6['default'];
    }, function (_) {
      _get = _['default'];
    }, function (_2) {
      _inherits = _2['default'];
    }, function (_3) {
      _createClass = _3['default'];
    }, function (_4) {
      _classCallCheck = _4['default'];
    }, function (_e) {
      _extends = _e['default'];
    }, function (_c) {
      TextArea = _c.TextArea;
    }, function (_d) {
      halignClassLookup = _d.halignClassLookup;
      valignClassLookup = _d.valignClassLookup;
    }],
    execute: function () {
      'use strict';

      TextAreaContainer = (function (_React$Component) {
        _inherits(TextAreaContainer, _React$Component);

        function TextAreaContainer() {
          _classCallCheck(this, _TextAreaContainer);

          _get(Object.getPrototypeOf(_TextAreaContainer.prototype), 'constructor', this).apply(this, arguments);
        }

        _createClass(TextAreaContainer, [{
          key: 'render',

          //  onBlur = () => console.log('onBlur!');
          //  onFocus = () => console.log('onFocus!');

          value: function render() {
            var _props = this.props;
            var message = _props.message;
            var setMessage = _props.setMessage;
            var alignment = _props.alignment;
            var styling = _props.styling;
            var halign = alignment.halign;
            var valign = alignment.valign;
            var bold = styling.bold;
            var italic = styling.italic;
            var fontFamily = styling.fontFamily;
            var _styling$fontSize = styling.fontSize;
            var fontSize = _styling$fontSize === undefined ? 100 : _styling$fontSize;

            var halignClass = halignClassLookup(halign);
            var valignClass = valignClassLookup(valign);
            var fontStyle = {
              fontFamily: fontFamily,
              fontSize: fontSize + 40 + '%',
              fontWeight: bold ? 'bold' : 'normal',
              fontStyle: italic ? 'italic' : 'normal'
            };
            return React.createElement(TextArea, { className: 'word-area dbl-click flex-all ' + halignClass + ' ' + valignClass,
              style: _extends({}, fontStyle),
              autoComplete: 'off', cols: 30, rows: 4,
              value: message,
              onChange: setMessage
            });
            // onFocus={this.onFocus}
            // onBlur={this.onBlur}
          }
        }], [{
          key: 'propTypes',
          value: {
            message: PropTypes.string.isRequired,
            setMessage: PropTypes.func.isRequired,
            alignment: PropTypes.object.isRequired,
            styling: PropTypes.object.isRequired
          },
          enumerable: true
        }]);

        var _TextAreaContainer = TextAreaContainer;
        TextAreaContainer = provide(TextAreaContainer) || TextAreaContainer;
        return TextAreaContainer;
      })(React.Component);

      _export('default', TextAreaContainer);
    }
  };
});
$__System.register('f', ['4', '10'], function (_export) {
  var React, PropTypes, _objectWithoutProperties, FontList;

  return {
    setters: [function (_2) {
      React = _2['default'];
      PropTypes = _2.PropTypes;
    }, function (_) {
      _objectWithoutProperties = _['default'];
    }],
    execute: function () {
      'use strict';

      FontList = function FontList(props) {
        var fonts = props.fonts;
        var selected = props.selected;
        var onClick = props.onClick;

        var strippedProps = _objectWithoutProperties(props, ['fonts', 'selected', 'onClick']);

        if (!fonts || !fonts.length) {
          // FIXME: Update React so stateless component can return null/false.
          return null;
        }

        var fontItems = fonts.map(function (font, index) {
          return React.createElement(
            'li',
            { key: index,
              className: font.family === selected ? 'selected' : null,
              style: { fontFamily: font.family,
                fontSize: font.size ? font.size + '%' : null },
              onClick: function () {
                return onClick(font.family);
              } },
            font.family
          );
        });

        return React.createElement(
          'ol',
          strippedProps,
          fontItems
        );
      };

      FontList.propTypes = {
        fonts: PropTypes.array.isRequired,
        // FIXME: Rename selected to selectedFontFamily:
        selected: PropTypes.string.isRequired,
        onClick: PropTypes.func.isRequired
      };

      _export('default', FontList);
    }
  };
});
$__System.register('11', ['4', '5', '6', '7', '8', '9', 'f'], function (_export) {
  var React, PropTypes, provide, _get, _inherits, _createClass, _classCallCheck, FontList, FontListContainer;

  return {
    setters: [function (_5) {
      React = _5['default'];
      PropTypes = _5.PropTypes;
    }, function (_6) {
      provide = _6['default'];
    }, function (_) {
      _get = _['default'];
    }, function (_2) {
      _inherits = _2['default'];
    }, function (_3) {
      _createClass = _3['default'];
    }, function (_4) {
      _classCallCheck = _4['default'];
    }, function (_f) {
      FontList = _f['default'];
    }],
    execute: function () {

      /*
         style={{ ...rowParent, ...flexContainer,
         flexWrap: 'wrap',
         justifyContent: 'space-between' }}
       */

      'use strict';

      FontListContainer = (function (_React$Component) {
        _inherits(FontListContainer, _React$Component);

        function FontListContainer() {
          _classCallCheck(this, _FontListContainer);

          _get(Object.getPrototypeOf(_FontListContainer.prototype), 'constructor', this).apply(this, arguments);
        }

        _createClass(FontListContainer, [{
          key: 'render',
          value: function render() {
            var fontFamily = this.props.styling.fontFamily;

            var showFontClass = this.props.fontPanelIsOpen ? 'show-fonts' : 'hide-fonts';
            return React.createElement(FontList, { className: 'font-list ' + showFontClass,
              fonts: this.props.fontList,
              selected: fontFamily,
              onClick: this.props.setFont });
          }
        }], [{
          key: 'propTypes',
          value: {
            styling: PropTypes.object.isRequired,
            fontList: PropTypes.array.isRequired,
            fontPanelIsOpen: PropTypes.bool.isRequired,
            setFont: PropTypes.func.isRequired
          },
          enumerable: true
        }]);

        var _FontListContainer = FontListContainer;
        FontListContainer = provide(FontListContainer) || FontListContainer;
        return FontListContainer;
      })(React.Component);

      _export('default', FontListContainer);
    }
  };
});
$__System.registerDynamic("12", ["13", "14", "15"], true, function($__require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  var anObject = $__require('13'),
      get = $__require('14');
  module.exports = $__require('15').getIterator = function(it) {
    var iterFn = get(it);
    if (typeof iterFn != 'function')
      throw TypeError(it + ' is not iterable!');
    return anObject(iterFn.call(it));
  };
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("16", ["17", "18", "12"], true, function($__require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  $__require('17');
  $__require('18');
  module.exports = $__require('12');
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("19", ["16"], true, function($__require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  module.exports = {
    "default": $__require('16'),
    __esModule: true
  };
  global.define = __define;
  return module.exports;
});

$__System.register('1a', ['4', '5', '6', '7', '8', '9', '19', 'e', 'c', 'd'], function (_export) {
  var React, PropTypes, provide, _get, _inherits, _createClass, _classCallCheck, _getIterator, _extends, Button, CheckBox, shallowEqual, SendAutoSendClear;

  return {
    setters: [function (_6) {
      React = _6['default'];
      PropTypes = _6.PropTypes;
    }, function (_7) {
      provide = _7['default'];
    }, function (_) {
      _get = _['default'];
    }, function (_2) {
      _inherits = _2['default'];
    }, function (_3) {
      _createClass = _3['default'];
    }, function (_4) {
      _classCallCheck = _4['default'];
    }, function (_5) {
      _getIterator = _5['default'];
    }, function (_e) {
      _extends = _e['default'];
    }, function (_c) {
      Button = _c.Button;
      CheckBox = _c.CheckBox;
    }, function (_d) {
      shallowEqual = _d.shallowEqual;
    }],
    execute: function () {
      'use strict';

      SendAutoSendClear = (function (_React$Component) {
        _inherits(SendAutoSendClear, _React$Component);

        function SendAutoSendClear() {
          var _this = this;

          _classCallCheck(this, _SendAutoSendClear);

          _get(Object.getPrototypeOf(_SendAutoSendClear.prototype), 'constructor', this).apply(this, arguments);

          this.state = {
            autoSend: false,
            sending: false
          };

          this.cancelTimer = function () {
            if (_this._timer) {
              clearTimeout(_this._timer);
              _this._timer = null;
            }
          };

          this.resetIndicator = function () {
            _this.setState({ sending: false });
            _this._timer = null;
          };

          this.transmitMessage = function (props) {
            var _extends2 = _extends({}, _this.props, props);

            var message = _extends2.message;
            var alignment = _extends2.alignment;
            var styling = _extends2.styling;
            var fontFamily = styling.fontFamily;
            var bold = styling.bold;
            var italic = styling.italic;
            var halign = alignment.halign;
            var valign = alignment.valign;

            var msg = { message: message, fontFamily: fontFamily, bold: bold, italic: italic, halign: halign, valign: valign };
            //    console.warn('sendSocket', msg);	// eslint-disable-line no-console
            _this.props.sendSocket('/spurter/STATE', msg);

            _this.cancelTimer();
            _this.setState({ sending: true });
            _this._timer = setTimeout(_this.resetIndicator, 66);
          };

          this.toggleAutoSend = function () {
            var autoSend = !_this.state.autoSend;
            if (autoSend) {
              // Transmit current state when enabling auto-send.
              _this.transmitMessage();
            }
            _this.setState({ autoSend: autoSend });
          };
        }

        _createClass(SendAutoSendClear, [{
          key: 'componentWillReceiveProps',
          value: function componentWillReceiveProps(nextProps) {
            var checkedProps = ['message', 'alignment', 'styling'];
            var send = false;
            if (this.state.autoSend) {
              var _iteratorNormalCompletion = true;
              var _didIteratorError = false;
              var _iteratorError = undefined;

              try {
                for (var _iterator = _getIterator(checkedProps), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                  var k = _step.value;

                  var equal = shallowEqual(this.props[k], nextProps[k]);
                  if (!equal) {
                    send = true;
                    break;
                  }
                }
              } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
              } finally {
                try {
                  if (!_iteratorNormalCompletion && _iterator['return']) {
                    _iterator['return']();
                  }
                } finally {
                  if (_didIteratorError) {
                    throw _iteratorError;
                  }
                }
              }
            }
            if (send) {
              this.transmitMessage(nextProps);
            }
          }
        }, {
          key: 'componentWillUnmount',
          value: function componentWillUnmount() {
            this.cancelTimer();
          }
        }, {
          key: 'render',
          value: function render() {
            var _state = this.state;
            var autoSend = _state.autoSend;
            var sending = _state.sending;

            var checkedClassName = autoSend ? 'checked' : 'unchecked';
            var sendingClassName = sending ? 'sending' : 'inactive';

            return React.createElement(
              'div',
              { className: 'transmission-container' },
              React.createElement(
                Button,
                { className: 'round-button send',
                  onClick: this.transmitMessage },
                'send'
              ),
              React.createElement('div', { className: 'sender ' + sendingClassName }),
              React.createElement(
                CheckBox,
                { className: 'auto-send ' + checkedClassName,
                  checked: autoSend,
                  onChange: this.toggleAutoSend },
                'auto-send'
              ),
              React.createElement(
                'a',
                { className: 'clear-link',
                  onClick: this.props.clearMessage },
                '× clear'
              )
            );
          }
        }], [{
          key: 'propTypes',
          value: {
            message: PropTypes.string.isRequired,
            alignment: PropTypes.object.isRequired,
            styling: PropTypes.object.isRequired,
            clearMessage: PropTypes.func.isRequired,
            sendSocket: PropTypes.func.isRequired
          },
          enumerable: true
        }]);

        var _SendAutoSendClear = SendAutoSendClear;
        SendAutoSendClear = provide(SendAutoSendClear) || SendAutoSendClear;
        return SendAutoSendClear;
      })(React.Component);

      _export('default', SendAutoSendClear);
    }
  };
});
$__System.register('1b', ['4', '10', 'd'], function (_export) {
  var React, PropTypes, _objectWithoutProperties, fixedFromCharCode, Styling;

  return {
    setters: [function (_2) {
      React = _2['default'];
      PropTypes = _2.PropTypes;
    }, function (_) {
      _objectWithoutProperties = _['default'];
    }, function (_d) {
      fixedFromCharCode = _d.fixedFromCharCode;
    }],
    execute: function () {
      'use strict';

      Styling = function Styling(props) {
        var bold = props.bold;
        var italic = props.italic;
        var setBold = props.setBold;
        var setItalic = props.setItalic;
        var children = props.children;

        var restProps = _objectWithoutProperties(props, ['bold', 'italic', 'setBold', 'setItalic', 'children']);

        var boldClass = bold ? 'bold on' : 'bold off';
        var italicClass = italic ? 'italic on' : 'italic off';

        return React.createElement(
          'span',
          restProps,
          React.createElement(
            'a',
            { className: boldClass,
              onClick: function () {
                return setBold(!bold);
              } },
            fixedFromCharCode(0x1d401)
          ),
          React.createElement(
            'a',
            { className: italicClass,
              onClick: function () {
                return setItalic(!italic);
              } },
            fixedFromCharCode(0x1d456)
          ),
          children
        );
      };

      Styling.propTypes = {
        bold: PropTypes.bool.isRequired,
        italic: PropTypes.bool.isRequired,
        setBold: PropTypes.func.isRequired,
        setItalic: PropTypes.func.isRequired,
        children: PropTypes.node
      };

      _export('default', Styling);
    }
  };
});
$__System.register('1c', ['4', '5', '6', '7', '8', '9', 'e', '1b'], function (_export) {
  var React, PropTypes, provide, _get, _inherits, _createClass, _classCallCheck, _extends, Styling, StylingContainer;

  return {
    setters: [function (_5) {
      React = _5['default'];
      PropTypes = _5.PropTypes;
    }, function (_6) {
      provide = _6['default'];
    }, function (_) {
      _get = _['default'];
    }, function (_2) {
      _inherits = _2['default'];
    }, function (_3) {
      _createClass = _3['default'];
    }, function (_4) {
      _classCallCheck = _4['default'];
    }, function (_e) {
      _extends = _e['default'];
    }, function (_b) {
      Styling = _b['default'];
    }],
    execute: function () {
      'use strict';

      StylingContainer = (function (_React$Component) {
        _inherits(StylingContainer, _React$Component);

        function StylingContainer() {
          _classCallCheck(this, _StylingContainer);

          _get(Object.getPrototypeOf(_StylingContainer.prototype), 'constructor', this).apply(this, arguments);
        }

        _createClass(StylingContainer, [{
          key: 'render',
          value: function render() {
            var _props = this.props;
            var styling = _props.styling;
            var setBold = _props.setBold;
            var setItalic = _props.setItalic;
            var fontPanelIsOpen = _props.fontPanelIsOpen;
            var toggleFontPanelState = _props.toggleFontPanelState;
            var bold = styling.bold;
            var italic = styling.italic;
            var fontFamily = styling.fontFamily;
            var _styling$fontSize = styling.fontSize;
            var fontSize = _styling$fontSize === undefined ? 80 : _styling$fontSize;

            var showFontClass = fontPanelIsOpen ? 'show-fonts' : 'hide-fonts';
            var stylingProps = { bold: bold, italic: italic, setBold: setBold, setItalic: setItalic };

            return React.createElement(
              Styling,
              _extends({ className: 'styling flex-all'
              }, stylingProps),
              React.createElement(
                'a',
                { className: showFontClass,
                  style: { fontSize: fontSize + '%',
                    fontFamily: fontFamily,
                    maxHeight: '1.5rem' },
                  onClick: function () {
                    return toggleFontPanelState();
                  } },
                fontFamily
              )
            );
          }
        }], [{
          key: 'propTypes',
          value: {
            styling: PropTypes.object.isRequired,
            setBold: PropTypes.func.isRequired,
            setItalic: PropTypes.func.isRequired,
            toggleFontPanelState: PropTypes.func.isRequired,
            fontPanelIsOpen: PropTypes.bool.isRequired
          },
          enumerable: true
        }]);

        var _StylingContainer = StylingContainer;
        StylingContainer = provide(StylingContainer) || StylingContainer;
        return StylingContainer;
      })(React.Component);

      _export('default', StylingContainer);
    }
  };
});
$__System.register('1d', ['4', '5', '6', '7', '8', '9', 'e', 'c', '1e'], function (_export) {
  var React, PropTypes, provide, _get, _inherits, _createClass, _classCallCheck, _extends, Button, flexChild, flexNone, SaveButtonContainer;

  return {
    setters: [function (_5) {
      React = _5['default'];
      PropTypes = _5.PropTypes;
    }, function (_6) {
      provide = _6['default'];
    }, function (_) {
      _get = _['default'];
    }, function (_2) {
      _inherits = _2['default'];
    }, function (_3) {
      _createClass = _3['default'];
    }, function (_4) {
      _classCallCheck = _4['default'];
    }, function (_e) {
      _extends = _e['default'];
    }, function (_c) {
      Button = _c.Button;
    }, function (_e2) {
      flexChild = _e2.flexChild;
      flexNone = _e2.flexNone;
    }],
    execute: function () {
      'use strict';

      SaveButtonContainer = (function (_React$Component) {
        _inherits(SaveButtonContainer, _React$Component);

        function SaveButtonContainer() {
          _classCallCheck(this, _SaveButtonContainer);

          _get(Object.getPrototypeOf(_SaveButtonContainer.prototype), 'constructor', this).apply(this, arguments);
        }

        _createClass(SaveButtonContainer, [{
          key: 'wordData',
          value: function wordData() {
            var _props = this.props;
            var message = _props.message;
            var alignment = _props.alignment;
            var styling = _props.styling;
            var fontFamily = styling.fontFamily;
            var bold = styling.bold;
            var italic = styling.italic;
            var halign = alignment.halign;
            var valign = alignment.valign;

            return { message: message, fontFamily: fontFamily, bold: bold, italic: italic, halign: halign, valign: valign };
          }
        }, {
          key: 'saveWord',
          value: function saveWord() {
            var word = this.wordData();
            this.props.saveWord(word);
          }
        }, {
          key: 'saveNewWord',
          value: function saveNewWord() {
            var word = this.wordData();
            this.props.saveNewWord(word);
          }
        }, {
          key: 'render',
          value: function render() {
            return React.createElement(
              'span',
              { style: _extends({}, flexChild, flexNone) },
              React.createElement(
                Button,
                { className: 'round-button save',
                  onClick: this.saveWord.bind(this) },
                'save'
              ),
              React.createElement(
                Button,
                { className: 'round-button save-new',
                  onClick: this.saveNewWord.bind(this) },
                'save new'
              )
            );
          }
        }], [{
          key: 'propTypes',
          value: {
            message: PropTypes.string.isRequired,
            alignment: PropTypes.object.isRequired,
            styling: PropTypes.object.isRequired,
            saveWord: PropTypes.func.isRequired,
            saveNewWord: PropTypes.func.isRequired
          },
          enumerable: true
        }]);

        var _SaveButtonContainer = SaveButtonContainer;
        SaveButtonContainer = provide(SaveButtonContainer) || SaveButtonContainer;
        return SaveButtonContainer;
      })(React.Component);

      _export('default', SaveButtonContainer);
    }
  };
});
$__System.register('1f', ['4', '10', '20', 'c'], function (_export) {
  var React, PropTypes, _objectWithoutProperties, ALIGN, TextButton, HorizontalAlignment;

  return {
    setters: [function (_2) {
      React = _2['default'];
      PropTypes = _2.PropTypes;
    }, function (_) {
      _objectWithoutProperties = _['default'];
    }, function (_3) {
      ALIGN = _3.ALIGN;
    }, function (_c) {
      TextButton = _c.TextButton;
    }],
    execute: function () {
      'use strict';

      HorizontalAlignment = function HorizontalAlignment(props) {
        var alignment = props.alignment;
        var onChange = props.onChange;

        var restProps = _objectWithoutProperties(props, ['alignment', 'onChange']);

        var chosen = function chosen(a) {
          return alignment === a ? 'chosen' : null;
        };
        return React.createElement(
          'span',
          restProps,
          React.createElement(
            TextButton,
            { className: chosen(ALIGN.LEFT),
              onClick: function () {
                return onChange(ALIGN.LEFT);
              } },
            '◀'
          ),
          React.createElement(
            TextButton,
            { className: chosen(ALIGN.CENTER),
              style: { marginTop: -4 },
              onClick: function () {
                return onChange(ALIGN.CENTER);
              } },
            '◆'
          ),
          React.createElement(
            TextButton,
            { className: chosen(ALIGN.RIGHT),
              onClick: function () {
                return onChange(ALIGN.RIGHT);
              } },
            '▶'
          )
        );
      };

      HorizontalAlignment.propTypes = {
        alignment: PropTypes.number.isRequired,
        onChange: PropTypes.func.isRequired
      };

      _export('default', HorizontalAlignment);
    }
  };
});
$__System.register('21', ['4', '5', '6', '7', '8', '9', '1f'], function (_export) {
  var React, PropTypes, provide, _get, _inherits, _createClass, _classCallCheck, HorizontalAlignment, HorizontalAlignmentContainer;

  return {
    setters: [function (_5) {
      React = _5['default'];
      PropTypes = _5.PropTypes;
    }, function (_6) {
      provide = _6['default'];
    }, function (_) {
      _get = _['default'];
    }, function (_2) {
      _inherits = _2['default'];
    }, function (_3) {
      _createClass = _3['default'];
    }, function (_4) {
      _classCallCheck = _4['default'];
    }, function (_f) {
      HorizontalAlignment = _f['default'];
    }],
    execute: function () {
      'use strict';

      HorizontalAlignmentContainer = (function (_React$Component) {
        _inherits(HorizontalAlignmentContainer, _React$Component);

        function HorizontalAlignmentContainer() {
          var _this = this;

          _classCallCheck(this, _HorizontalAlignmentContainer);

          _get(Object.getPrototypeOf(_HorizontalAlignmentContainer.prototype), 'constructor', this).apply(this, arguments);

          this.halign = function (alignment) {
            _this.props.setHorizontalAlignment(alignment);
          };
        }

        _createClass(HorizontalAlignmentContainer, [{
          key: 'render',
          value: function render() {
            return React.createElement(HorizontalAlignment, { className: 'horizontal-alignment',
              alignment: this.props.alignment.halign,
              onChange: this.halign });
          }
        }], [{
          key: 'propTypes',
          value: {
            alignment: PropTypes.object.isRequired,
            setHorizontalAlignment: PropTypes.func.isRequired
          },
          enumerable: true
        }]);

        var _HorizontalAlignmentContainer = HorizontalAlignmentContainer;
        HorizontalAlignmentContainer = provide(HorizontalAlignmentContainer) || HorizontalAlignmentContainer;
        return HorizontalAlignmentContainer;
      })(React.Component);

      _export('default', HorizontalAlignmentContainer);
    }
  };
});
$__System.registerDynamic("10", [], true, function($__require, exports, module) {
  "use strict";
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  exports["default"] = function(obj, keys) {
    var target = {};
    for (var i in obj) {
      if (keys.indexOf(i) >= 0)
        continue;
      if (!Object.prototype.hasOwnProperty.call(obj, i))
        continue;
      target[i] = obj[i];
    }
    return target;
  };
  exports.__esModule = true;
  global.define = __define;
  return module.exports;
});

$__System.register('c', ['4', 'e'], function (_export) {
  var React, PropTypes, _extends, TextArea, CheckBox, Button, TextButton;

  return {
    setters: [function (_) {
      React = _['default'];
      PropTypes = _.PropTypes;
    }, function (_e) {
      _extends = _e['default'];
    }],
    execute: function () {
      'use strict';

      TextArea = function TextArea(props) {
        var onChange = function onChange(e) {
          return props.onChange && props.onChange(e.target.value);
        };
        return React.createElement('textarea', _extends({}, props, { onChange: onChange }));
      };

      TextArea.propTypes = {
        onChange: PropTypes.func.isRequired
      };

      CheckBox = function CheckBox(props) {
        return React.createElement(
          'label',
          { className: props.className, style: _extends({}, props.style) },
          React.createElement('input', _extends({ type: 'checkbox' }, props, { className: null, style: null, children: null })),
          props.children
        );
      };

      CheckBox.propTypes = {
        className: PropTypes.string,
        style: PropTypes.object,
        children: PropTypes.node
      };

      Button = function Button(props) {
        return React.createElement(
          'button',
          _extends({ type: 'button' }, props, { children: null }),
          props.children
        );
      };

      Button.propTypes = {
        children: PropTypes.node
      };

      TextButton = function TextButton(props) {
        return React.createElement(
          'button',
          _extends({ type: 'button' }, props, { children: null,
            className: props.className ? 'text-button ' + props.className : 'text-button' }),
          props.children
        );
      };

      TextButton.propTypes = {
        className: PropTypes.string,
        children: PropTypes.node
      };

      _export('Button', Button);

      _export('TextButton', TextButton);

      _export('CheckBox', CheckBox);

      _export('TextArea', TextArea);
    }
  };
});
$__System.register('22', ['4', '10', '20', 'c'], function (_export) {
  var React, PropTypes, _objectWithoutProperties, ALIGN, TextButton, VerticalAlignment;

  return {
    setters: [function (_2) {
      React = _2['default'];
      PropTypes = _2.PropTypes;
    }, function (_) {
      _objectWithoutProperties = _['default'];
    }, function (_3) {
      ALIGN = _3.ALIGN;
    }, function (_c) {
      TextButton = _c.TextButton;
    }],
    execute: function () {
      'use strict';

      VerticalAlignment = function VerticalAlignment(props) {
        var alignment = props.alignment;
        var onChange = props.onChange;

        var restProps = _objectWithoutProperties(props, ['alignment', 'onChange']);

        var chosen = function chosen(a) {
          return alignment === a ? 'chosen' : null;
        };

        return React.createElement(
          'span',
          restProps,
          React.createElement(
            TextButton,
            { className: chosen(ALIGN.TOP),
              onClick: function () {
                return onChange(ALIGN.TOP);
              } },
            '△'
          ),
          React.createElement(
            TextButton,
            { className: chosen(ALIGN.MIDDLE),
              onClick: function () {
                return onChange(ALIGN.MIDDLE);
              } },
            '◇'
          ),
          React.createElement(
            TextButton,
            { className: chosen(ALIGN.BOTTOM),
              onClick: function () {
                return onChange(ALIGN.BOTTOM);
              } },
            '▽'
          )
        );
      };

      VerticalAlignment.propTypes = {
        alignment: PropTypes.number.isRequired,
        onChange: PropTypes.func.isRequired
      };

      _export('default', VerticalAlignment);
    }
  };
});
$__System.register('23', ['4', '5', '6', '7', '8', '9', '22'], function (_export) {
  var React, PropTypes, provide, _get, _inherits, _createClass, _classCallCheck, VerticalAlignment, VerticalAlignmentContainer;

  return {
    setters: [function (_5) {
      React = _5['default'];
      PropTypes = _5.PropTypes;
    }, function (_6) {
      provide = _6['default'];
    }, function (_) {
      _get = _['default'];
    }, function (_2) {
      _inherits = _2['default'];
    }, function (_3) {
      _createClass = _3['default'];
    }, function (_4) {
      _classCallCheck = _4['default'];
    }, function (_7) {
      VerticalAlignment = _7['default'];
    }],
    execute: function () {
      'use strict';

      VerticalAlignmentContainer = (function (_React$Component) {
        _inherits(VerticalAlignmentContainer, _React$Component);

        function VerticalAlignmentContainer() {
          var _this = this;

          _classCallCheck(this, _VerticalAlignmentContainer);

          _get(Object.getPrototypeOf(_VerticalAlignmentContainer.prototype), 'constructor', this).apply(this, arguments);

          this.valign = function (alignment) {
            _this.props.setVerticalAlignment(alignment);
          };
        }

        _createClass(VerticalAlignmentContainer, [{
          key: 'render',
          value: function render() {
            return React.createElement(VerticalAlignment, { className: 'vertical-alignment',
              alignment: this.props.alignment.valign,
              onChange: this.valign });
          }
        }], [{
          key: 'propTypes',
          value: {
            alignment: PropTypes.object.isRequired,
            setVerticalAlignment: PropTypes.func.isRequired
          },
          enumerable: true
        }]);

        var _VerticalAlignmentContainer = VerticalAlignmentContainer;
        VerticalAlignmentContainer = provide(VerticalAlignmentContainer) || VerticalAlignmentContainer;
        return VerticalAlignmentContainer;
      })(React.Component);

      _export('default', VerticalAlignmentContainer);
    }
  };
});
$__System.register('24', ['4', '6', '7', '8', '9', '11', '21', '23', 'e', '1e', 'b', '1a', '1c', '1d'], function (_export) {
  var React, _get, _inherits, _createClass, _classCallCheck, FontListContainer, HorizontalAlignmentContainer, VerticalAlignmentContainer, _extends, rowParent, flexAll, TextAreaContainer, SendAutoSendClear, StylingContainer, SaveButtonContainer, WordEditor;

  return {
    setters: [function (_5) {
      React = _5['default'];
    }, function (_) {
      _get = _['default'];
    }, function (_2) {
      _inherits = _2['default'];
    }, function (_3) {
      _createClass = _3['default'];
    }, function (_4) {
      _classCallCheck = _4['default'];
    }, function (_6) {
      FontListContainer = _6['default'];
    }, function (_7) {
      HorizontalAlignmentContainer = _7['default'];
    }, function (_8) {
      VerticalAlignmentContainer = _8['default'];
    }, function (_e) {
      _extends = _e['default'];
    }, function (_e2) {
      rowParent = _e2.rowParent;
      flexAll = _e2.flexAll;
    }, function (_b) {
      TextAreaContainer = _b['default'];
    }, function (_a) {
      SendAutoSendClear = _a['default'];
    }, function (_c) {
      StylingContainer = _c['default'];
    }, function (_d) {
      SaveButtonContainer = _d['default'];
    }],
    execute: function () {
      'use strict';

      WordEditor = (function (_React$Component) {
        _inherits(WordEditor, _React$Component);

        function WordEditor() {
          _classCallCheck(this, WordEditor);

          _get(Object.getPrototypeOf(WordEditor.prototype), 'constructor', this).apply(this, arguments);
        }

        _createClass(WordEditor, [{
          key: 'render',
          value: function render() {
            return React.createElement(
              'div',
              null,
              React.createElement(
                'div',
                { className: 'word-editor',
                  style: _extends({}, rowParent) },
                React.createElement(VerticalAlignmentContainer, null),
                React.createElement(TextAreaContainer, null),
                React.createElement(SendAutoSendClear, null)
              ),
              React.createElement(
                'div',
                { className: 'word-manipulation',
                  style: _extends({}, rowParent) },
                React.createElement(HorizontalAlignmentContainer, null),
                React.createElement(StylingContainer, null),
                React.createElement(SaveButtonContainer, null)
              ),
              React.createElement(FontListContainer, null),
              React.createElement(
                'div',
                { className: 'word-fx',
                  style: _extends({}, flexAll) },
                React.createElement(
                  'h2',
                  null,
                  'Word FX'
                )
              )
            );
          }
        }]);

        return WordEditor;
      })(React.Component);

      _export('default', WordEditor);
    }
  };
});
$__System.registerDynamic("25", ["26", "27"], true, function($__require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  var toIObject = $__require('26');
  $__require('27')('getOwnPropertyDescriptor', function($getOwnPropertyDescriptor) {
    return function getOwnPropertyDescriptor(it, key) {
      return $getOwnPropertyDescriptor(toIObject(it), key);
    };
  });
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("28", ["29", "25"], true, function($__require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  var $ = $__require('29');
  $__require('25');
  module.exports = function getOwnPropertyDescriptor(it, key) {
    return $.getDesc(it, key);
  };
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("2a", ["28"], true, function($__require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  module.exports = {
    "default": $__require('28'),
    __esModule: true
  };
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("6", ["2a"], true, function($__require, exports, module) {
  "use strict";
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  var _Object$getOwnPropertyDescriptor = $__require('2a')["default"];
  exports["default"] = function get(_x, _x2, _x3) {
    var _again = true;
    _function: while (_again) {
      var object = _x,
          property = _x2,
          receiver = _x3;
      _again = false;
      if (object === null)
        object = Function.prototype;
      var desc = _Object$getOwnPropertyDescriptor(object, property);
      if (desc === undefined) {
        var parent = Object.getPrototypeOf(object);
        if (parent === null) {
          return undefined;
        } else {
          _x = parent;
          _x2 = property;
          _x3 = receiver;
          _again = true;
          desc = parent = undefined;
          continue _function;
        }
      } else if ("value" in desc) {
        return desc.value;
      } else {
        var getter = desc.get;
        if (getter === undefined) {
          return undefined;
        }
        return getter.call(receiver);
      }
    }
  };
  exports.__esModule = true;
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("7", ["2b", "2c"], true, function($__require, exports, module) {
  "use strict";
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  var _Object$create = $__require('2b')["default"];
  var _Object$setPrototypeOf = $__require('2c')["default"];
  exports["default"] = function(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }
    subClass.prototype = _Object$create(superClass && superClass.prototype, {constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }});
    if (superClass)
      _Object$setPrototypeOf ? _Object$setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  };
  exports.__esModule = true;
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("8", ["2d"], true, function($__require, exports, module) {
  "use strict";
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  var _Object$defineProperty = $__require('2d')["default"];
  exports["default"] = (function() {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor)
          descriptor.writable = true;
        _Object$defineProperty(target, descriptor.key, descriptor);
      }
    }
    return function(Constructor, protoProps, staticProps) {
      if (protoProps)
        defineProperties(Constructor.prototype, protoProps);
      if (staticProps)
        defineProperties(Constructor, staticProps);
      return Constructor;
    };
  })();
  exports.__esModule = true;
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("9", [], true, function($__require, exports, module) {
  "use strict";
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  exports["default"] = function(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };
  exports.__esModule = true;
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("2e", [], true, function($__require, exports, module) {
  "use strict";
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  module.exports = function isObject(val) {
    return val != null && typeof val === 'object' && !Array.isArray(val);
  };
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("2f", ["2e"], true, function($__require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  module.exports = $__require('2e');
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("30", ["2f"], true, function($__require, exports, module) {
  "use strict";
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  var isObject = $__require('2f');
  function isObjectObject(o) {
    return isObject(o) === true && Object.prototype.toString.call(o) === '[object Object]';
  }
  module.exports = function isPlainObject(o) {
    var ctor,
        prot;
    if (isObjectObject(o) === false)
      return false;
    ctor = o.constructor;
    if (typeof ctor !== 'function')
      return false;
    prot = ctor.prototype;
    if (isObjectObject(prot) === false)
      return false;
    if (prot.hasOwnProperty('isPrototypeOf') === false) {
      return false;
    }
    return true;
  };
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("31", ["30"], true, function($__require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  module.exports = $__require('30');
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("32", [], true, function($__require, exports, module) {
  "use strict";
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  exports.__esModule = true;
  exports["default"] = shallowEqual;
  function shallowEqual(objA, objB) {
    if (objA === objB) {
      return true;
    }
    var keysA = Object.keys(objA);
    var keysB = Object.keys(objB);
    if (keysA.length !== keysB.length) {
      return false;
    }
    var hasOwn = Object.prototype.hasOwnProperty;
    for (var i = 0; i < keysA.length; i++) {
      if (!hasOwn.call(objB, keysA[i]) || objA[keysA[i]] !== objB[keysA[i]]) {
        return false;
      }
    }
    return true;
  }
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("33", ["34"], true, function($__require, exports, module) {
  "use strict";
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  exports.__esModule = true;
  exports["default"] = wrapActionCreators;
  var _redux = $__require('34');
  function wrapActionCreators(actionCreators) {
    return function(dispatch) {
      return (0, _redux.bindActionCreators)(actionCreators, dispatch);
    };
  }
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("35", [], true, function($__require, exports, module) {
  "use strict";
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  var REACT_STATICS = {
    childContextTypes: true,
    contextTypes: true,
    defaultProps: true,
    displayName: true,
    getDefaultProps: true,
    mixins: true,
    propTypes: true,
    type: true
  };
  var KNOWN_STATICS = {
    name: true,
    length: true,
    prototype: true,
    caller: true,
    arguments: true,
    arity: true
  };
  module.exports = function hoistNonReactStatics(targetComponent, sourceComponent) {
    var keys = Object.getOwnPropertyNames(sourceComponent);
    for (var i = 0; i < keys.length; ++i) {
      if (!REACT_STATICS[keys[i]] && !KNOWN_STATICS[keys[i]]) {
        try {
          targetComponent[keys[i]] = sourceComponent[keys[i]];
        } catch (error) {}
      }
    }
    return targetComponent;
  };
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("36", ["35"], true, function($__require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  module.exports = $__require('35');
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("37", ["4", "31", "34", "32", "33", "38", "39", "36", "3a"], true, function($__require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  (function(process) {
    'use strict';
    exports.__esModule = true;
    var _createClass = (function() {
      function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
          var descriptor = props[i];
          descriptor.enumerable = descriptor.enumerable || false;
          descriptor.configurable = true;
          if ('value' in descriptor)
            descriptor.writable = true;
          Object.defineProperty(target, descriptor.key, descriptor);
        }
      }
      return function(Constructor, protoProps, staticProps) {
        if (protoProps)
          defineProperties(Constructor.prototype, protoProps);
        if (staticProps)
          defineProperties(Constructor, staticProps);
        return Constructor;
      };
    })();
    var _extends = Object.assign || function(target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i];
        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }
      return target;
    };
    exports['default'] = provide;
    exports.reloadProviders = reloadProviders;
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {'default': obj};
    }
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError('Cannot call a class as a function');
      }
    }
    function _inherits(subClass, superClass) {
      if (typeof superClass !== 'function' && superClass !== null) {
        throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass);
      }
      subClass.prototype = Object.create(superClass && superClass.prototype, {constructor: {
          value: subClass,
          enumerable: false,
          writable: true,
          configurable: true
        }});
      if (superClass)
        Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
    }
    var _react = $__require('4');
    var _react2 = _interopRequireDefault(_react);
    var _isPlainObject = $__require('31');
    var _isPlainObject2 = _interopRequireDefault(_isPlainObject);
    var _redux = $__require('34');
    var _reactReduxLibUtilsShallowEqual = $__require('32');
    var _reactReduxLibUtilsShallowEqual2 = _interopRequireDefault(_reactReduxLibUtilsShallowEqual);
    var _reactReduxLibUtilsWrapActionCreators = $__require('33');
    var _reactReduxLibUtilsWrapActionCreators2 = _interopRequireDefault(_reactReduxLibUtilsWrapActionCreators);
    var _createProviderStore = $__require('38');
    var _createProviderStore2 = _interopRequireDefault(_createProviderStore);
    var _createCombinedStore = $__require('39');
    var _createCombinedStore2 = _interopRequireDefault(_createCombinedStore);
    var _hoistNonReactStatics = $__require('36');
    var _hoistNonReactStatics2 = _interopRequireDefault(_hoistNonReactStatics);
    var defaultMapState = function defaultMapState() {
      return {};
    };
    var defaultMapDispatch = function defaultMapDispatch(dispatch) {
      return {dispatch: dispatch};
    };
    var defaultMerge = function defaultMerge(stateProps, dispatchProps, parentProps) {
      return _extends({}, parentProps, stateProps, dispatchProps);
    };
    var contextTypes = {
      providedState: _react.PropTypes.object,
      providers: _react.PropTypes.object,
      combinedProviders: _react.PropTypes.oneOfType([_react.PropTypes.object, _react.PropTypes.arrayOf(_react.PropTypes.object)]),
      combinedProviderStores: _react.PropTypes.object,
      providerReady: _react.PropTypes.arrayOf(_react.PropTypes.func)
    };
    var wrappedInstances = {};
    var rootInstance = null;
    function provide(WrappedComponent) {
      var stateless = typeof WrappedComponent.prototype.render === 'undefined';
      var wrappedName = WrappedComponent.displayName || WrappedComponent.name;
      var instances = wrappedInstances[wrappedName] || new Set();
      var pure = WrappedComponent.pure !== false;
      var doSubscribe = false;
      var statePropsDepend = false;
      var dispatchPropsDepend = false;
      if (!wrappedInstances[wrappedName]) {
        wrappedInstances[wrappedName] = instances;
      }
      function getDisplayName() {
        var providers = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
        return 'Provide' + wrappedName + '(' + Object.keys(providers).join(',') + ')';
      }
      function getReduced(reducers) {
        var reduced = {};
        for (var key in reducers) {
          reduced[key] = reducers[key](undefined, {});
        }
        return reduced;
      }
      var Provide = (function(_Component) {
        _inherits(Provide, _Component);
        Provide.prototype.getChildContext = function getChildContext() {
          return {
            providedState: this.providedState,
            providers: this.contextProviders,
            combinedProviders: this.contextCombinedProviders,
            combinedProviderStores: this.contextCombinedProviderStores,
            providerReady: this.providerReady
          };
        };
        _createClass(Provide, null, [{
          key: 'WrappedComponent',
          value: WrappedComponent,
          enumerable: true
        }, {
          key: 'displayName',
          value: getDisplayName(),
          enumerable: true
        }, {
          key: 'propTypes',
          value: contextTypes,
          enumerable: true
        }, {
          key: 'contextTypes',
          value: contextTypes,
          enumerable: true
        }, {
          key: 'childContextTypes',
          value: contextTypes,
          enumerable: true
        }]);
        function Provide(props, context) {
          _classCallCheck(this, Provide);
          _Component.call(this, props);
          if (!context.providers) {
            rootInstance = this;
          }
          this.prerenders = 1;
          this.renders = 0;
          this.initialize(props, context);
        }
        Provide.prototype.initialize = function initialize(props, context) {
          this.stores = new Set();
          this.storesStates = new WeakMap();
          this.providedState = props.providedState || context.providedState || {};
          this.providerReady = props.providerReady || context.providerReady;
          this.initCombinedProviderStores(props, context);
          this.initProviders(props, context);
          this.initState(props, context);
        };
        Provide.prototype.reinitialize = function reinitialize(props, context, newWrappedComponent) {
          if (newWrappedComponent) {
            this.setWrappedComponent(newWrappedComponent);
          }
          this.initialize(props, context);
          this.tryUnsubscribe();
          this.trySubscribe();
          this.forceUpdate();
        };
        Provide.prototype.setWrappedComponent = function setWrappedComponent(newWrappedComponent) {
          var prevWrappedName = wrappedName;
          WrappedComponent = newWrappedComponent;
          Provide.WrappedComponent = WrappedComponent;
          wrappedName = WrappedComponent.displayName || WrappedComponent.name;
          if (prevWrappedName !== wrappedName) {
            wrappedInstances[wrappedName] = instances;
            delete wrappedInstances[prevWrappedName];
          }
          pure = WrappedComponent.pure !== false;
          doSubscribe = false;
          statePropsDepend = false;
          dispatchPropsDepend = false;
        };
        Provide.prototype.initCombinedProviderStores = function initCombinedProviderStores(props, context) {
          if (!props.providers && context.combinedProviderStores) {
            this.contextCombinedProviders = context.combinedProviders;
            this.contextCombinedProviderStores = context.combinedProviderStores;
            return;
          }
          var _props$combinedProviders = props.combinedProviders;
          var combinedProviders = _props$combinedProviders === undefined ? [] : _props$combinedProviders;
          if (!Array.isArray(combinedProviders)) {
            combinedProviders = [combinedProviders];
          }
          if (this.contextCombinedProviderStores) {
            var removed = new WeakSet();
            for (var _name in this.contextCombinedProviderStores) {
              var store = this.contextCombinedProviderStores[_name];
              if (store && store.remove && !removed.has(store)) {
                store.remove();
                removed.add(store);
              }
            }
          }
          this.contextCombinedProviders = combinedProviders;
          this.contextCombinedProviderStores = {};
          for (var _iterator = combinedProviders,
              _isArray = Array.isArray(_iterator),
              _i = 0,
              _iterator = _isArray ? _iterator : _iterator[Symbol.iterator](); ; ) {
            var _ref;
            if (_isArray) {
              if (_i >= _iterator.length)
                break;
              _ref = _iterator[_i++];
            } else {
              _i = _iterator.next();
              if (_i.done)
                break;
              _ref = _i.value;
            }
            var providers = _ref;
            var store = _createCombinedStore2['default'](providers, this.providedState);
            for (var _name2 in providers) {
              this.contextCombinedProviderStores[_name2] = store;
            }
          }
        };
        Provide.prototype.initProviders = function initProviders(props, context) {
          var _WrappedComponent = WrappedComponent;
          var _WrappedComponent$propTypes = _WrappedComponent.propTypes;
          var propTypes = _WrappedComponent$propTypes === undefined ? {} : _WrappedComponent$propTypes;
          if (props.providers) {
            if (this.contextProviders) {
              var removed = new WeakSet();
              for (var _name3 in this.contextProviders) {
                var store = this.contextProviders[_name3].store;
                if (store && store.remove && !removed.has(store)) {
                  store.remove();
                  removed.add(store);
                }
              }
            }
            this.contextProviders = {};
            for (var _name4 in props.providers) {
              this.initProvider(_name4, props.providers[_name4]);
            }
          } else {
            this.contextProviders = context.providers;
          }
          this.providers = {};
          for (var _name5 in this.contextProviders) {
            var provider = this.contextProviders[_name5];
            var _provider$actions = provider.actions;
            var actions = _provider$actions === undefined ? {} : _provider$actions;
            var _provider$reducers = provider.reducers;
            var reducers = _provider$reducers === undefined ? {} : _provider$reducers;
            var merge = provider.merge;
            var merged = merge && merge(getReduced(reducers), {}, {}) || {};
            for (var propKey in propTypes) {
              if (propKey in actions || propKey in reducers || propKey in merged) {
                this.providers[_name5] = provider;
                this.addStore(provider.store);
                if (provider.shouldSubscribe) {
                  doSubscribe = true;
                }
                if (provider.mapStateProps) {
                  statePropsDepend = true;
                }
                if (provider.mapDispatchProps) {
                  dispatchPropsDepend = true;
                }
                break;
              }
            }
          }
          Provide.displayName = getDisplayName(this.providers);
        };
        Provide.prototype.initProvider = function initProvider(name, provider) {
          var _provider$actions2 = provider.actions;
          var actions = _provider$actions2 === undefined ? {} : _provider$actions2;
          var _provider$reducers2 = provider.reducers;
          var reducers = _provider$reducers2 === undefined ? {} : _provider$reducers2;
          var mapState = provider.mapState;
          var mapDispatch = provider.mapDispatch;
          var merge = provider.merge;
          var shouldSubscribe = false;
          if (typeof mapState === 'undefined') {
            mapState = function(state) {
              var props = {};
              for (var key in reducers) {
                props[key] = state[key];
              }
              return props;
            };
          }
          if (typeof mapState === 'function') {
            shouldSubscribe = true;
          } else {
            mapState = defaultMapState;
          }
          if (typeof mapDispatch === 'undefined') {
            mapDispatch = function(dispatch) {
              return _redux.bindActionCreators(actions, dispatch);
            };
          } else if (_isPlainObject2['default'](mapDispatch)) {
            mapDispatch = _reactReduxLibUtilsWrapActionCreators2['default'](mapDispatch);
          } else if (typeof mapDispatch !== 'function') {
            mapDispatch = defaultMapDispatch;
          }
          if (!merge) {
            merge = defaultMerge;
          }
          var mapStateProps = mapState.length !== 1;
          var mapDispatchProps = mapDispatch.length !== 1;
          this.contextProviders[name] = this.setProviderStore(_extends({name: name}, provider, {
            shouldSubscribe: shouldSubscribe,
            mapState: mapState,
            mapStateProps: mapStateProps,
            mapDispatch: mapDispatch,
            mapDispatchProps: mapDispatchProps,
            merge: merge
          }));
        };
        Provide.prototype.addStore = function addStore(store) {
          this.stores.add(store);
          this.storesStates.set(store, store.getState());
        };
        Provide.prototype.setProviderStore = function setProviderStore(provider) {
          if (!provider.store) {
            provider.store = this.contextCombinedProviderStores[provider.name] || _createProviderStore2['default'](provider, this.providedState);
            this.setProviderReady(provider);
          }
          return provider;
        };
        Provide.prototype.setProviderReady = function setProviderReady(provider) {
          if (this.providerReady) {
            for (var _iterator2 = this.providerReady,
                _isArray2 = Array.isArray(_iterator2),
                _i2 = 0,
                _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator](); ; ) {
              var _ref2;
              if (_isArray2) {
                if (_i2 >= _iterator2.length)
                  break;
                _ref2 = _iterator2[_i2++];
              } else {
                _i2 = _iterator2.next();
                if (_i2.done)
                  break;
                _ref2 = _i2.value;
              }
              var ready = _ref2;
              ready(provider);
            }
          }
        };
        Provide.prototype.initState = function initState(props, context) {
          this.state = {storesStates: this.storesStates};
          this.setStateProps(props);
          this.setDispatchProps(props);
          this.setMergedProps(props);
        };
        Provide.prototype.setStateProps = function setStateProps(props) {
          var stateProps = this.stateProps;
          var nextStateProps = this.computeStateProps(props);
          if (stateProps && _reactReduxLibUtilsShallowEqual2['default'](nextStateProps, stateProps)) {
            return false;
          }
          this.stateProps = nextStateProps;
          return true;
        };
        Provide.prototype.computeStateProps = function computeStateProps(props) {
          var stateProps = {};
          for (var _name6 in this.providers) {
            var provider = this.providers[_name6];
            var state = provider.store.getState();
            var providerStateProps = provider.mapStateProps ? provider.mapState(state, props) : provider.mapState(state);
            if (!_isPlainObject2['default'](providerStateProps)) {
              throw new Error('`mapState` must return an object. Instead received %s.', providerStateProps);
            }
            Object.assign(stateProps, providerStateProps);
          }
          return stateProps;
        };
        Provide.prototype.setDispatchProps = function setDispatchProps(props) {
          var dispatchProps = this.dispatchProps;
          var nextDispatchProps = this.computeDispatchProps(props);
          if (dispatchProps && _reactReduxLibUtilsShallowEqual2['default'](nextDispatchProps, dispatchProps)) {
            return false;
          }
          this.dispatchProps = nextDispatchProps;
          return true;
        };
        Provide.prototype.computeDispatchProps = function computeDispatchProps(props) {
          var dispatchProps = {};
          for (var _name7 in this.providers) {
            var provider = this.providers[_name7];
            var dispatch = provider.store.dispatch;
            var providerDispatchProps = provider.mapDispatchProps ? provider.mapDispatch(dispatch, props) : provider.mapDispatch(dispatch);
            if (!_isPlainObject2['default'](providerDispatchProps)) {
              throw new Error('`mapDispatch` must return an object. Instead received %s.', providerDispatchProps);
            }
            Object.assign(dispatchProps, providerDispatchProps);
          }
          return dispatchProps;
        };
        Provide.prototype.setMergedProps = function setMergedProps(props) {
          var stateProps = this.stateProps;
          var dispatchProps = this.dispatchProps;
          var mergedProps = this.mergedProps;
          this.mergedProps = this.computeMergedProps(stateProps, dispatchProps, WrappedComponent.defaultProps ? _extends({}, WrappedComponent.defaultProps, props) : props);
          return !mergedProps || !_reactReduxLibUtilsShallowEqual2['default'](mergedProps, this.mergedProps);
        };
        Provide.prototype.computeMergedProps = function computeMergedProps(stateProps, dispatchProps, parentProps) {
          var mergedProps = defaultMerge(stateProps, dispatchProps, parentProps);
          var filtered = {};
          for (var _name8 in this.providers) {
            var provider = this.providers[_name8];
            var providerMergedProps = provider.merge(stateProps, dispatchProps, mergedProps);
            if (!_isPlainObject2['default'](providerMergedProps)) {
              throw new Error('`merge` must return an object. Instead received %s.', providerMergedProps);
            }
            Object.assign(mergedProps, providerMergedProps);
          }
          for (var key in WrappedComponent.propTypes) {
            if (mergedProps[key] !== undefined) {
              filtered[key] = mergedProps[key];
            }
          }
          return filtered;
        };
        Provide.prototype.componentDidMount = function componentDidMount() {
          this.trySubscribe();
          instances.add(this);
        };
        Provide.prototype.componentWillUnmount = function componentWillUnmount() {
          this.tryUnsubscribe();
          instances['delete'](this);
        };
        Provide.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
          if (!pure || !_reactReduxLibUtilsShallowEqual2['default'](nextProps, this.props)) {
            this.propsChanged = true;
          }
        };
        Provide.prototype.isSubscribed = function isSubscribed() {
          return this.unsubscribe && typeof this.unsubscribe[0] === 'function';
        };
        Provide.prototype.trySubscribe = function trySubscribe() {
          var _this = this;
          if (doSubscribe && !this.unsubscribe) {
            this.unsubscribe = Array.from(this.stores).map(function(store) {
              return store.subscribe(_this.handleChange.bind(_this));
            });
            this.handleChange();
          }
        };
        Provide.prototype.tryUnsubscribe = function tryUnsubscribe() {
          if (this.unsubscribe) {
            for (var _iterator3 = this.unsubscribe,
                _isArray3 = Array.isArray(_iterator3),
                _i3 = 0,
                _iterator3 = _isArray3 ? _iterator3 : _iterator3[Symbol.iterator](); ; ) {
              var _ref3;
              if (_isArray3) {
                if (_i3 >= _iterator3.length)
                  break;
                _ref3 = _iterator3[_i3++];
              } else {
                _i3 = _iterator3.next();
                if (_i3.done)
                  break;
                _ref3 = _i3.value;
              }
              var unsubscribe = _ref3;
              unsubscribe();
            }
            this.unsubscribe = null;
          }
        };
        Provide.prototype.handleChange = function handleChange() {
          if (!this.unsubscribe) {
            return;
          }
          if (!pure || this.storesDidChange()) {
            this.storesChanged = true;
            this.setState({storesStates: this.storesStates});
          }
        };
        Provide.prototype.storesDidChange = function storesDidChange() {
          var stores = this.stores;
          var storesStates = this.storesStates;
          var changed = false;
          this.storesStates = new WeakMap();
          for (var _iterator4 = stores,
              _isArray4 = Array.isArray(_iterator4),
              _i4 = 0,
              _iterator4 = _isArray4 ? _iterator4 : _iterator4[Symbol.iterator](); ; ) {
            var _ref4;
            if (_isArray4) {
              if (_i4 >= _iterator4.length)
                break;
              _ref4 = _iterator4[_i4++];
            } else {
              _i4 = _iterator4.next();
              if (_i4.done)
                break;
              _ref4 = _i4.value;
            }
            var store = _ref4;
            var prevStoreState = storesStates.get(store);
            var storeState = store.getState();
            if (prevStoreState !== storeState && !_reactReduxLibUtilsShallowEqual2['default'](prevStoreState, storeState)) {
              changed = true;
            }
            this.storesStates.set(store, storeState);
          }
          return changed;
        };
        Provide.prototype.getCurrentProvidedState = function getCurrentProvidedState() {
          var contextProviders = this.contextProviders;
          var providedState = {};
          for (var _name9 in contextProviders) {
            Object.assign(providedState, contextProviders[_name9].store.getState());
          }
          return providedState;
        };
        Provide.prototype.shouldComponentUpdate = function shouldComponentUpdate(props) {
          var propsChanged = this.propsChanged;
          var storesChanged = this.storesChanged;
          var statePropsChanged = false;
          var dispatchPropsChanged = false;
          var mergedPropsChanged = false;
          if (!pure) {
            return true;
          }
          if (!propsChanged && !storesChanged) {
            return false;
          }
          if (storesChanged || propsChanged && statePropsDepend) {
            statePropsChanged = this.setStateProps(props);
          }
          if (propsChanged && dispatchPropsDepend) {
            dispatchPropsChanged = this.setDispatchProps(props);
          }
          if (statePropsChanged || dispatchPropsChanged || propsChanged) {
            mergedPropsChanged = this.setMergedProps(props);
          }
          this.prerenders++;
          this.propsChanged = false;
          this.storesChanged = false;
          return mergedPropsChanged;
        };
        Provide.prototype.render = function render() {
          this.renders++;
          return stateless ? _react2['default'].createElement(WrappedComponent, this.mergedProps) : _react2['default'].createElement(WrappedComponent, _extends({ref: 'wrappedInstance'}, this.mergedProps));
        };
        return Provide;
      })(_react.Component);
      if (process.env.NODE_ENV !== 'production') {
        for (var _iterator5 = instances,
            _isArray5 = Array.isArray(_iterator5),
            _i5 = 0,
            _iterator5 = _isArray5 ? _iterator5 : _iterator5[Symbol.iterator](); ; ) {
          var _ref5;
          if (_isArray5) {
            if (_i5 >= _iterator5.length)
              break;
            _ref5 = _iterator5[_i5++];
          } else {
            _i5 = _iterator5.next();
            if (_i5.done)
              break;
            _ref5 = _i5.value;
          }
          var instance = _ref5;
          var props = instance.props;
          var context = instance.context;
          instance.reinitialize(props, context, WrappedComponent);
        }
      }
      return _hoistNonReactStatics2['default'](Provide, WrappedComponent);
    }
    function reloadProviders(_ref7) {
      var providers = _ref7.providers;
      var combinedProviders = _ref7.combinedProviders;
      rootInstance.reinitialize(_extends({}, rootInstance.props, {
        providedState: rootInstance.getCurrentProvidedState(),
        providers: providers,
        combinedProviders: combinedProviders
      }), rootInstance.context);
      var _rootInstance = rootInstance;
      var contextProviders = _rootInstance.contextProviders;
      var contextCombinedProviders = _rootInstance.contextCombinedProviders;
      var contextCombinedProviderStores = _rootInstance.contextCombinedProviderStores;
      for (var wrappedName in wrappedInstances) {
        var instances = wrappedInstances[wrappedName];
        for (var _iterator6 = instances,
            _isArray6 = Array.isArray(_iterator6),
            _i6 = 0,
            _iterator6 = _isArray6 ? _iterator6 : _iterator6[Symbol.iterator](); ; ) {
          var _ref6;
          if (_isArray6) {
            if (_i6 >= _iterator6.length)
              break;
            _ref6 = _iterator6[_i6++];
          } else {
            _i6 = _iterator6.next();
            if (_i6.done)
              break;
            _ref6 = _i6.value;
          }
          var instance = _ref6;
          var props = instance.props;
          var context = instance.context;
          if (instance !== rootInstance) {
            context.providers = contextProviders;
            context.combinedProviders = contextCombinedProviders;
            context.combinedProviderStores = contextCombinedProviderStores;
            instance.reinitialize(props, context);
          }
        }
      }
    }
  })($__require('3a'));
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("3b", ["3c"], true, function($__require, exports, module) {
  "use strict";
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  exports.__esModule = true;
  exports.ActionTypes = undefined;
  exports["default"] = createStore;
  var _isPlainObject = $__require('3c');
  var _isPlainObject2 = _interopRequireDefault(_isPlainObject);
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {"default": obj};
  }
  var ActionTypes = exports.ActionTypes = {INIT: '@@redux/INIT'};
  function createStore(reducer, initialState, enhancer) {
    if (typeof initialState === 'function' && typeof enhancer === 'undefined') {
      enhancer = initialState;
      initialState = undefined;
    }
    if (typeof enhancer !== 'undefined') {
      if (typeof enhancer !== 'function') {
        throw new Error('Expected the enhancer to be a function.');
      }
      return enhancer(createStore)(reducer, initialState);
    }
    if (typeof reducer !== 'function') {
      throw new Error('Expected the reducer to be a function.');
    }
    var currentReducer = reducer;
    var currentState = initialState;
    var currentListeners = [];
    var nextListeners = currentListeners;
    var isDispatching = false;
    function ensureCanMutateNextListeners() {
      if (nextListeners === currentListeners) {
        nextListeners = currentListeners.slice();
      }
    }
    function getState() {
      return currentState;
    }
    function subscribe(listener) {
      if (typeof listener !== 'function') {
        throw new Error('Expected listener to be a function.');
      }
      var isSubscribed = true;
      ensureCanMutateNextListeners();
      nextListeners.push(listener);
      return function unsubscribe() {
        if (!isSubscribed) {
          return;
        }
        isSubscribed = false;
        ensureCanMutateNextListeners();
        var index = nextListeners.indexOf(listener);
        nextListeners.splice(index, 1);
      };
    }
    function dispatch(action) {
      if (!(0, _isPlainObject2["default"])(action)) {
        throw new Error('Actions must be plain objects. ' + 'Use custom middleware for async actions.');
      }
      if (typeof action.type === 'undefined') {
        throw new Error('Actions may not have an undefined "type" property. ' + 'Have you misspelled a constant?');
      }
      if (isDispatching) {
        throw new Error('Reducers may not dispatch actions.');
      }
      try {
        isDispatching = true;
        currentState = currentReducer(currentState, action);
      } finally {
        isDispatching = false;
      }
      var listeners = currentListeners = nextListeners;
      for (var i = 0; i < listeners.length; i++) {
        listeners[i]();
      }
      return action;
    }
    function replaceReducer(nextReducer) {
      if (typeof nextReducer !== 'function') {
        throw new Error('Expected the nextReducer to be a function.');
      }
      currentReducer = nextReducer;
      dispatch({type: ActionTypes.INIT});
    }
    dispatch({type: ActionTypes.INIT});
    return {
      dispatch: dispatch,
      subscribe: subscribe,
      getState: getState,
      replaceReducer: replaceReducer
    };
  }
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("3d", [], true, function($__require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  var nativeGetPrototype = Object.getPrototypeOf;
  function getPrototype(value) {
    return nativeGetPrototype(Object(value));
  }
  module.exports = getPrototype;
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("3e", [], true, function($__require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  function isHostObject(value) {
    var result = false;
    if (value != null && typeof value.toString != 'function') {
      try {
        result = !!(value + '');
      } catch (e) {}
    }
    return result;
  }
  module.exports = isHostObject;
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("3f", [], true, function($__require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  function isObjectLike(value) {
    return !!value && typeof value == 'object';
  }
  module.exports = isObjectLike;
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("3c", ["3d", "3e", "3f"], true, function($__require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  var getPrototype = $__require('3d'),
      isHostObject = $__require('3e'),
      isObjectLike = $__require('3f');
  var objectTag = '[object Object]';
  var objectProto = Object.prototype;
  var funcToString = Function.prototype.toString;
  var hasOwnProperty = objectProto.hasOwnProperty;
  var objectCtorString = funcToString.call(Object);
  var objectToString = objectProto.toString;
  function isPlainObject(value) {
    if (!isObjectLike(value) || objectToString.call(value) != objectTag || isHostObject(value)) {
      return false;
    }
    var proto = getPrototype(value);
    if (proto === null) {
      return true;
    }
    var Ctor = hasOwnProperty.call(proto, 'constructor') && proto.constructor;
    return (typeof Ctor == 'function' && Ctor instanceof Ctor && funcToString.call(Ctor) == objectCtorString);
  }
  module.exports = isPlainObject;
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("40", ["3b", "3c", "41", "3a"], true, function($__require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  (function(process) {
    'use strict';
    exports.__esModule = true;
    exports["default"] = combineReducers;
    var _createStore = $__require('3b');
    var _isPlainObject = $__require('3c');
    var _isPlainObject2 = _interopRequireDefault(_isPlainObject);
    var _warning = $__require('41');
    var _warning2 = _interopRequireDefault(_warning);
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {"default": obj};
    }
    function getUndefinedStateErrorMessage(key, action) {
      var actionType = action && action.type;
      var actionName = actionType && '"' + actionType.toString() + '"' || 'an action';
      return 'Given action ' + actionName + ', reducer "' + key + '" returned undefined. ' + 'To ignore an action, you must explicitly return the previous state.';
    }
    function getUnexpectedStateShapeWarningMessage(inputState, reducers, action) {
      var reducerKeys = Object.keys(reducers);
      var argumentName = action && action.type === _createStore.ActionTypes.INIT ? 'initialState argument passed to createStore' : 'previous state received by the reducer';
      if (reducerKeys.length === 0) {
        return 'Store does not have a valid reducer. Make sure the argument passed ' + 'to combineReducers is an object whose values are reducers.';
      }
      if (!(0, _isPlainObject2["default"])(inputState)) {
        return 'The ' + argumentName + ' has unexpected type of "' + {}.toString.call(inputState).match(/\s([a-z|A-Z]+)/)[1] + '". Expected argument to be an object with the following ' + ('keys: "' + reducerKeys.join('", "') + '"');
      }
      var unexpectedKeys = Object.keys(inputState).filter(function(key) {
        return !reducers.hasOwnProperty(key);
      });
      if (unexpectedKeys.length > 0) {
        return 'Unexpected ' + (unexpectedKeys.length > 1 ? 'keys' : 'key') + ' ' + ('"' + unexpectedKeys.join('", "') + '" found in ' + argumentName + '. ') + 'Expected to find one of the known reducer keys instead: ' + ('"' + reducerKeys.join('", "') + '". Unexpected keys will be ignored.');
      }
    }
    function assertReducerSanity(reducers) {
      Object.keys(reducers).forEach(function(key) {
        var reducer = reducers[key];
        var initialState = reducer(undefined, {type: _createStore.ActionTypes.INIT});
        if (typeof initialState === 'undefined') {
          throw new Error('Reducer "' + key + '" returned undefined during initialization. ' + 'If the state passed to the reducer is undefined, you must ' + 'explicitly return the initial state. The initial state may ' + 'not be undefined.');
        }
        var type = '@@redux/PROBE_UNKNOWN_ACTION_' + Math.random().toString(36).substring(7).split('').join('.');
        if (typeof reducer(undefined, {type: type}) === 'undefined') {
          throw new Error('Reducer "' + key + '" returned undefined when probed with a random type. ' + ('Don\'t try to handle ' + _createStore.ActionTypes.INIT + ' or other actions in "redux/*" ') + 'namespace. They are considered private. Instead, you must return the ' + 'current state for any unknown actions, unless it is undefined, ' + 'in which case you must return the initial state, regardless of the ' + 'action type. The initial state may not be undefined.');
        }
      });
    }
    function combineReducers(reducers) {
      var reducerKeys = Object.keys(reducers);
      var finalReducers = {};
      for (var i = 0; i < reducerKeys.length; i++) {
        var key = reducerKeys[i];
        if (typeof reducers[key] === 'function') {
          finalReducers[key] = reducers[key];
        }
      }
      var finalReducerKeys = Object.keys(finalReducers);
      var sanityError;
      try {
        assertReducerSanity(finalReducers);
      } catch (e) {
        sanityError = e;
      }
      return function combination() {
        var state = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
        var action = arguments[1];
        if (sanityError) {
          throw sanityError;
        }
        if (process.env.NODE_ENV !== 'production') {
          var warningMessage = getUnexpectedStateShapeWarningMessage(state, finalReducers, action);
          if (warningMessage) {
            (0, _warning2["default"])(warningMessage);
          }
        }
        var hasChanged = false;
        var nextState = {};
        for (var i = 0; i < finalReducerKeys.length; i++) {
          var key = finalReducerKeys[i];
          var reducer = finalReducers[key];
          var previousStateForKey = state[key];
          var nextStateForKey = reducer(previousStateForKey, action);
          if (typeof nextStateForKey === 'undefined') {
            var errorMessage = getUndefinedStateErrorMessage(key, action);
            throw new Error(errorMessage);
          }
          nextState[key] = nextStateForKey;
          hasChanged = hasChanged || nextStateForKey !== previousStateForKey;
        }
        return hasChanged ? nextState : state;
      };
    }
  })($__require('3a'));
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("42", [], true, function($__require, exports, module) {
  "use strict";
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  exports.__esModule = true;
  exports["default"] = bindActionCreators;
  function bindActionCreator(actionCreator, dispatch) {
    return function() {
      return dispatch(actionCreator.apply(undefined, arguments));
    };
  }
  function bindActionCreators(actionCreators, dispatch) {
    if (typeof actionCreators === 'function') {
      return bindActionCreator(actionCreators, dispatch);
    }
    if (typeof actionCreators !== 'object' || actionCreators === null) {
      throw new Error('bindActionCreators expected an object or a function, instead received ' + (actionCreators === null ? 'null' : typeof actionCreators) + '. ' + 'Did you write "import ActionCreators from" instead of "import * as ActionCreators from"?');
    }
    var keys = Object.keys(actionCreators);
    var boundActionCreators = {};
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      var actionCreator = actionCreators[key];
      if (typeof actionCreator === 'function') {
        boundActionCreators[key] = bindActionCreator(actionCreator, dispatch);
      }
    }
    return boundActionCreators;
  }
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("43", ["44"], true, function($__require, exports, module) {
  "use strict";
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  exports.__esModule = true;
  var _extends = Object.assign || function(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  exports["default"] = applyMiddleware;
  var _compose = $__require('44');
  var _compose2 = _interopRequireDefault(_compose);
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {"default": obj};
  }
  function applyMiddleware() {
    for (var _len = arguments.length,
        middlewares = Array(_len),
        _key = 0; _key < _len; _key++) {
      middlewares[_key] = arguments[_key];
    }
    return function(createStore) {
      return function(reducer, initialState, enhancer) {
        var store = createStore(reducer, initialState, enhancer);
        var _dispatch = store.dispatch;
        var chain = [];
        var middlewareAPI = {
          getState: store.getState,
          dispatch: function dispatch(action) {
            return _dispatch(action);
          }
        };
        chain = middlewares.map(function(middleware) {
          return middleware(middlewareAPI);
        });
        _dispatch = _compose2["default"].apply(undefined, chain)(store.dispatch);
        return _extends({}, store, {dispatch: _dispatch});
      };
    };
  }
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("44", [], true, function($__require, exports, module) {
  "use strict";
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  exports.__esModule = true;
  exports["default"] = compose;
  function compose() {
    for (var _len = arguments.length,
        funcs = Array(_len),
        _key = 0; _key < _len; _key++) {
      funcs[_key] = arguments[_key];
    }
    return function() {
      if (funcs.length === 0) {
        return arguments.length <= 0 ? undefined : arguments[0];
      }
      var last = funcs[funcs.length - 1];
      var rest = funcs.slice(0, -1);
      return rest.reduceRight(function(composed, f) {
        return f(composed);
      }, last.apply(undefined, arguments));
    };
  }
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("41", [], true, function($__require, exports, module) {
  "use strict";
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  exports.__esModule = true;
  exports["default"] = warning;
  function warning(message) {
    if (typeof console !== 'undefined' && typeof console.error === 'function') {
      console.error(message);
    }
    try {
      throw new Error(message);
    } catch (e) {}
  }
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("45", ["3b", "40", "42", "43", "44", "41", "3a"], true, function($__require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  (function(process) {
    'use strict';
    exports.__esModule = true;
    exports.compose = exports.applyMiddleware = exports.bindActionCreators = exports.combineReducers = exports.createStore = undefined;
    var _createStore = $__require('3b');
    var _createStore2 = _interopRequireDefault(_createStore);
    var _combineReducers = $__require('40');
    var _combineReducers2 = _interopRequireDefault(_combineReducers);
    var _bindActionCreators = $__require('42');
    var _bindActionCreators2 = _interopRequireDefault(_bindActionCreators);
    var _applyMiddleware = $__require('43');
    var _applyMiddleware2 = _interopRequireDefault(_applyMiddleware);
    var _compose = $__require('44');
    var _compose2 = _interopRequireDefault(_compose);
    var _warning = $__require('41');
    var _warning2 = _interopRequireDefault(_warning);
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {"default": obj};
    }
    function isCrushed() {}
    if (process.env.NODE_ENV !== 'production' && typeof isCrushed.name === 'string' && isCrushed.name !== 'isCrushed') {
      (0, _warning2["default"])('You are currently using minified code outside of NODE_ENV === \'production\'. ' + 'This means that you are running a slower development build of Redux. ' + 'You can use loose-envify (https://github.com/zertosh/loose-envify) for browserify ' + 'or DefinePlugin for webpack (http://stackoverflow.com/questions/30030031) ' + 'to ensure you have the correct code for your production build.');
    }
    exports.createStore = _createStore2["default"];
    exports.combineReducers = _combineReducers2["default"];
    exports.bindActionCreators = _bindActionCreators2["default"];
    exports.applyMiddleware = _applyMiddleware2["default"];
    exports.compose = _compose2["default"];
  })($__require('3a'));
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("34", ["45"], true, function($__require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  module.exports = $__require('45');
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("38", ["34"], true, function($__require, exports, module) {
  "use strict";
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  exports.__esModule = true;
  var _extends = Object.assign || function(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  exports['default'] = createProviderStore;
  var _redux = $__require('34');
  function createProviderStore(provider, initialState) {
    var reducers = provider.reducers;
    var middleware = provider.middleware;
    var enhancer = provider.enhancer;
    var enhancers = [];
    var create = undefined;
    if (middleware) {
      enhancers.push(_redux.applyMiddleware.apply(null, [].concat(middleware)));
    }
    if (enhancer) {
      enhancers = enhancers.concat(enhancer);
    }
    if (initialState) {
      initialState = _extends({}, initialState);
      for (var key in initialState) {
        if (reducers[key] === undefined) {
          delete initialState[key];
        }
      }
    }
    if (enhancers.length) {
      create = _redux.compose.apply(undefined, enhancers)(_redux.createStore);
    } else {
      create = _redux.createStore;
    }
    return create(_redux.combineReducers(reducers), initialState);
  }
  module.exports = exports['default'];
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("39", ["38"], true, function($__require, exports, module) {
  "use strict";
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  exports.__esModule = true;
  exports['default'] = createdCombinedStore;
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {'default': obj};
  }
  var _createProviderStore = $__require('38');
  var _createProviderStore2 = _interopRequireDefault(_createProviderStore);
  function createdCombinedStore(providers, initialState) {
    var combinedProvider = {
      reducers: {},
      middleware: [],
      enhancer: []
    };
    for (var providerName in providers) {
      copyValues(combinedProvider, providers[providerName]);
    }
    return _createProviderStore2['default'](combinedProvider, initialState);
  }
  function copyValues(combinedProvider, provider) {
    for (var key in combinedProvider) {
      var value = combinedProvider[key];
      var providerValue = provider[key];
      if (!providerValue) {
        continue;
      }
      if (Array.isArray(value)) {
        if (!Array.isArray(providerValue)) {
          providerValue = [providerValue];
        }
        for (var _iterator = providerValue,
            _isArray = Array.isArray(_iterator),
            _i = 0,
            _iterator = _isArray ? _iterator : _iterator[Symbol.iterator](); ; ) {
          var _ref;
          if (_isArray) {
            if (_i >= _iterator.length)
              break;
            _ref = _iterator[_i++];
          } else {
            _i = _iterator.next();
            if (_i.done)
              break;
            _ref = _i.value;
          }
          var item = _ref;
          if (value.indexOf(item) < 0) {
            value.push(item);
          }
        }
      } else if (typeof providerValue === 'object') {
        Object.assign(value, providerValue);
      }
    }
  }
  module.exports = exports['default'];
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("46", ["47"], true, function($__require, exports, module) {
  "use strict";
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  exports.__esModule = true;
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {'default': obj};
  }
  var _createKeyConcat = $__require('47');
  var _createKeyConcat2 = _interopRequireDefault(_createKeyConcat);
  var pushMiddleware = _createKeyConcat2['default']('middleware');
  exports['default'] = pushMiddleware;
  module.exports = exports['default'];
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("48", ["47"], true, function($__require, exports, module) {
  "use strict";
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  exports.__esModule = true;
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {'default': obj};
  }
  var _createKeyConcat = $__require('47');
  var _createKeyConcat2 = _interopRequireDefault(_createKeyConcat);
  var unshiftMiddleware = _createKeyConcat2['default']('middleware', true);
  exports['default'] = unshiftMiddleware;
  module.exports = exports['default'];
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("49", ["47"], true, function($__require, exports, module) {
  "use strict";
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  exports.__esModule = true;
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {'default': obj};
  }
  var _createKeyConcat = $__require('47');
  var _createKeyConcat2 = _interopRequireDefault(_createKeyConcat);
  var pushEnhancer = _createKeyConcat2['default']('enhancer');
  exports['default'] = pushEnhancer;
  module.exports = exports['default'];
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("47", [], true, function($__require, exports, module) {
  "use strict";
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  exports.__esModule = true;
  exports["default"] = createKeyConcat;
  function createKeyConcat(key, unshift) {
    return function(providers, value) {
      for (var providerName in providers) {
        var provider = providers[providerName];
        if (!provider[key]) {
          provider[key] = [];
        } else if (!Array.isArray(provider[key])) {
          provider[key] = [provider[key]];
        }
        if (unshift) {
          provider[key] = [].concat(value).concat(provider[key]);
        } else {
          provider[key] = provider[key].concat(value);
        }
      }
    };
  }
  module.exports = exports["default"];
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("4a", ["47"], true, function($__require, exports, module) {
  "use strict";
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  exports.__esModule = true;
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {'default': obj};
  }
  var _createKeyConcat = $__require('47');
  var _createKeyConcat2 = _interopRequireDefault(_createKeyConcat);
  var unshiftEnhancer = _createKeyConcat2['default']('enhancer', true);
  exports['default'] = unshiftEnhancer;
  module.exports = exports['default'];
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("4b", ["37", "38", "39", "46", "48", "49", "4a"], true, function($__require, exports, module) {
  "use strict";
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  exports.__esModule = true;
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {'default': obj};
  }
  var _provide = $__require('37');
  var _provide2 = _interopRequireDefault(_provide);
  var _createProviderStore = $__require('38');
  var _createProviderStore2 = _interopRequireDefault(_createProviderStore);
  var _createCombinedStore = $__require('39');
  var _createCombinedStore2 = _interopRequireDefault(_createCombinedStore);
  var _pushMiddleware = $__require('46');
  var _pushMiddleware2 = _interopRequireDefault(_pushMiddleware);
  var _unshiftMiddleware = $__require('48');
  var _unshiftMiddleware2 = _interopRequireDefault(_unshiftMiddleware);
  var _pushEnhancer = $__require('49');
  var _pushEnhancer2 = _interopRequireDefault(_pushEnhancer);
  var _unshiftEnhancer = $__require('4a');
  var _unshiftEnhancer2 = _interopRequireDefault(_unshiftEnhancer);
  exports['default'] = _provide2['default'];
  exports.provide = _provide2['default'];
  exports.reloadProviders = _provide.reloadProviders;
  exports.createProviderStore = _createProviderStore2['default'];
  exports.createCombinedStore = _createCombinedStore2['default'];
  exports.pushMiddleware = _pushMiddleware2['default'];
  exports.unshiftMiddleware = _unshiftMiddleware2['default'];
  exports.pushEnhancer = _pushEnhancer2['default'];
  exports.unshiftEnhancer = _unshiftEnhancer2['default'];
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("5", ["4b"], true, function($__require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  module.exports = $__require('4b');
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("4", [], true, function($__require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  module.exports = window.React;
  global.define = __define;
  return module.exports;
});

$__System.register('4c', ['4', 'e'], function (_export) {
  var React, PropTypes, _extends, halignStyles, halignClasses, valignClasses, safeLookup, WordEntry;

  return {
    setters: [function (_) {
      React = _['default'];
      PropTypes = _.PropTypes;
    }, function (_e) {
      _extends = _e['default'];
    }],
    execute: function () {
      'use strict';

      halignStyles = [{
        justifyContent: 'flex-start',
        textAlign: 'left'
      }, {
        justifyContent: 'center',
        textAlign: 'center'
      }, {
        justifyContent: 'flex-end',
        textAlign: 'right'
      }];
      halignClasses = ['h-left', 'h-center', 'h-right'];
      valignClasses = ['v-top', 'v-middle', 'v-bottom'];

      safeLookup = function safeLookup(a, i) {
        try {
          return a[i | 0];
        } catch (e) {
          return a[0];
        }
      };

      WordEntry = function WordEntry(props) {
        var index = props.index;
        var activated = props.activated;
        var editing = props.editing;
        var canDel = props.canDel;
        var halign = props.halign;
        var valign = props.valign;

        var maybeDel = canDel ? React.createElement(
          'span',
          { className: 'del action flex-none',
            onClick: function () {
              return props.del(index);
            } },
          'del'
        ) : null;
        var activeClass = activated ? 'activated' : '';
        var editClass = editing ? ' editing' : '';
        var editSigil = editing ? React.createElement(
          'span',
          { className: 'sigil flex-none' },
          '◀'
        ) : null;
        var halignStyle = safeLookup(halignStyles, halign);
        var halignClass = safeLookup(halignClasses, halign);
        var valignClass = safeLookup(valignClasses, valign);
        return React.createElement(
          'div',
          { className: 'word-entry ' + activeClass + ' flex-row flex-none' },
          editSigil,
          React.createElement(
            'span',
            { className: 'edit action flex-none' + editClass,
              onClick: function () {
                return props.edit(index);
              }
            },
            'edit'
          ),
          React.createElement(
            'span',
            { className: 'word-activator flex-auto',
              onClick: function () {
                return props.activate(index);
              } },
            React.createElement('span', { className: 'word-align-sigil ' + halignClass + ' ' + valignClass }),
            React.createElement(
              'span',
              { className: 'word flex-auto',
                style: _extends({}, props.style, halignStyle) },
              props.message
            )
          ),
          maybeDel,
          React.createElement(
            'span',
            { className: 'dup action flex-none',
              onClick: function () {
                return props.dup(index);
              } },
            'dup'
          ),
          React.createElement(
            'span',
            { className: 'swappers flex-none' },
            React.createElement(
              'span',
              { className: 'swapper up',
                onClick: function () {
                  return props.nudge(index, -1);
                }
              },
              '▲'
            ),
            React.createElement(
              'span',
              { className: 'swapper down',
                onClick: function () {
                  return props.nudge(index, 1);
                }
              },
              '▼'
            )
          )
        );
      };

      WordEntry.propTypes = {
        index: PropTypes.number.isRequired,
        style: PropTypes.object,
        activated: PropTypes.bool,
        editing: PropTypes.bool,
        canDel: PropTypes.bool,
        halign: PropTypes.number,
        valign: PropTypes.number,
        message: PropTypes.string,
        activate: PropTypes.func.isRequired,
        del: PropTypes.func.isRequired,
        dup: PropTypes.func.isRequired,
        edit: PropTypes.func.isRequired,
        nudge: PropTypes.func.isRequired
      };

      _export('default', WordEntry);
    }
  };
});
$__System.register('4d', ['4', '5', '6', '7', '8', '9', 'e', '4c', '1e'], function (_export) {
  var React, PropTypes, provide, _get, _inherits, _createClass, _classCallCheck, _extends, WordEntry, columnParent, flexContainer, WordList;

  return {
    setters: [function (_5) {
      React = _5['default'];
      PropTypes = _5.PropTypes;
    }, function (_6) {
      provide = _6['default'];
    }, function (_) {
      _get = _['default'];
    }, function (_2) {
      _inherits = _2['default'];
    }, function (_3) {
      _createClass = _3['default'];
    }, function (_4) {
      _classCallCheck = _4['default'];
    }, function (_e) {
      _extends = _e['default'];
    }, function (_c) {
      WordEntry = _c['default'];
    }, function (_e2) {
      columnParent = _e2.columnParent;
      flexContainer = _e2.flexContainer;
    }],
    execute: function () {

      // TODO: Refactor into CSS styles applied to .word-list
      'use strict';

      WordList = (function (_React$Component) {
        _inherits(WordList, _React$Component);

        function WordList() {
          _classCallCheck(this, _WordList);

          _get(Object.getPrototypeOf(_WordList.prototype), 'constructor', this).apply(this, arguments);
        }

        _createClass(WordList, [{
          key: 'activate',
          value: function activate(index) {
            var word = this.props.wordList[index];
            this.props.activateWord(index);
            this.props.sendSocket('/spurter/STATE', word);
          }
        }, {
          key: 'edit',
          value: function edit(index) {
            var word = this.props.wordList[index];
            //    console.log('** mergeState', word); // eslint-disable-line no-console
            this.props.mergeState({
              message: word.message,
              alignment: {
                halign: word.halign,
                valign: word.valign
              },
              styling: {
                bold: word.bold,
                italic: word.italic,
                fontFamily: word.fontFamily
              }
            });
            this.props.editWord(index);
          }
        }, {
          key: 'dup',
          value: function dup(index) {
            this.props.dupWord(index);
          }
        }, {
          key: 'del',
          value: function del(index) {
            this.props.delWord(index);
          }
        }, {
          key: 'nudge',
          value: function nudge(index) {
            var dir = arguments.length <= 1 || arguments[1] === undefined ? 1 : arguments[1];

            this.props.nudgeWord(index, dir);
          }
        }, {
          key: 'renderWords',
          value: function renderWords(words) {
            var _this = this;

            return words.map(function (word, index, array) {
              return React.createElement(WordEntry, _extends({ key: index }, word, { index: index,
                style: { fontFamily: word.fontFamily,
                  fontWeight: word.bold ? 'bold' : 'normal',
                  fontStyle: word.italic ? 'italic' : 'normal',
                  fontSize: word.fontSize ? word.fontSize + '%' : '100%'
                },
                activate: _this.activate.bind(_this),
                edit: _this.edit.bind(_this),
                dup: _this.dup.bind(_this),
                del: _this.del.bind(_this),
                nudge: _this.nudge.bind(_this),
                canDel: array.length !== 1 }));
            });
          }
        }, {
          key: 'render',
          value: function render() {
            //    console.log('WordList props', this.props);
            var words = this.renderWords(this.props.wordList);
            return React.createElement(
              'section',
              { className: 'word-list',
                style: _extends({}, flexContainer, columnParent) },
              words
            );
          }
        }], [{
          key: 'propTypes',
          value: {
            wordList: PropTypes.array.isRequired,
            delWord: PropTypes.func.isRequired,
            dupWord: PropTypes.func.isRequired,
            nudgeWord: PropTypes.func.isRequired,
            editWord: PropTypes.func.isRequired,
            activateWord: PropTypes.func.isRequired,
            mergeState: PropTypes.func.isRequired,
            sendSocket: PropTypes.func.isRequired
          },
          enumerable: true
        }]);

        var _WordList = WordList;
        WordList = provide(WordList) || WordList;
        return WordList;
      })(React.Component);

      _export('default', WordList);
    }
  };
});
$__System.register('1e', ['e'], function (_export) {
  var _extends, flexContainer, rowParent, columnParent, flexChild, flexAll, flexAuto, flexNone;

  return {
    setters: [function (_e) {
      _extends = _e['default'];
    }],
    execute: function () {
      'use strict';

      flexContainer = {
        width: '100%',
        height: '100%'
      };
      rowParent = {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'nowrap',
        justifyContent: 'flex-start',
        alignContent: 'stretch',
        alignItems: 'stretch'
      };
      columnParent = _extends({}, rowParent, {
        flexDirection: 'column'
      });
      flexChild = {
        display: 'flex',
        flex: '1 0 0', // flexGrow, flexShrink, flexBasis
        alignSelf: 'auto'
      };
      flexAll = {
        flex: '1 1 0'
      };
      flexAuto = {
        flex: '1 1 auto'
      };
      flexNone = {
        flex: '0 0 auto'
      };

      _export('flexContainer', flexContainer);

      _export('rowParent', rowParent);

      _export('columnParent', columnParent);

      _export('flexChild', flexChild);

      _export('flexAll', flexAll);

      _export('flexAuto', flexAuto);

      _export('flexNone', flexNone);
    }
  };
});
$__System.register('4e', ['3', '4', '5', '6', '7', '8', '9', '24', 'e', 'a', '4d', '1e'], function (_export) {
  var Header, React, provide, _get, _inherits, _createClass, _classCallCheck, WordEditor, _extends, Master, WordList, columnParent, rowParent, flexContainer, flexChild, flexAll, flexNone, LeftPanel, RightPanel, App;

  return {
    setters: [function (_7) {
      Header = _7['default'];
    }, function (_5) {
      React = _5['default'];
    }, function (_6) {
      provide = _6['default'];
    }, function (_) {
      _get = _['default'];
    }, function (_2) {
      _inherits = _2['default'];
    }, function (_3) {
      _createClass = _3['default'];
    }, function (_4) {
      _classCallCheck = _4['default'];
    }, function (_8) {
      WordEditor = _8['default'];
    }, function (_e) {
      _extends = _e['default'];
    }, function (_a) {
      Master = _a['default'];
    }, function (_d) {
      WordList = _d['default'];
    }, function (_e2) {
      columnParent = _e2.columnParent;
      rowParent = _e2.rowParent;
      flexContainer = _e2.flexContainer;
      flexChild = _e2.flexChild;
      flexAll = _e2.flexAll;
      flexNone = _e2.flexNone;
    }],
    execute: function () {
      'use strict';

      LeftPanel = function LeftPanel() {
        return React.createElement(
          'div',
          { className: 'left-panel',
            style: _extends({}, flexChild) },
          React.createElement(WordEditor, null)
        );
      };

      RightPanel = function RightPanel() {
        return React.createElement(
          'section',
          { className: 'right-panel',
            style: _extends({}, flexChild, columnParent) },
          React.createElement(
            'div',
            { className: 'word-list-panel',
              style: _extends({}, flexChild, flexAll, { overflowY: 'scroll' }) },
            React.createElement(WordList, null)
          ),
          React.createElement(
            'section',
            { style: _extends({}, flexChild, rowParent, flexNone) },
            React.createElement(
              'div',
              { style: _extends({}, flexChild) },
              React.createElement(
                'h2',
                null,
                'LFO ',
                '>',
                ' OPACITY'
              )
            ),
            React.createElement(
              'div',
              { style: _extends({}, flexChild) },
              React.createElement(
                'h2',
                null,
                'SEQUENCER'
              )
            )
          )
        );
      };

      App = (function (_React$Component) {
        _inherits(App, _React$Component);

        function App() {
          _classCallCheck(this, _App);

          _get(Object.getPrototypeOf(_App.prototype), 'constructor', this).apply(this, arguments);
        }

        _createClass(App, [{
          key: 'render',
          value: function render() {
            return React.createElement(
              'section',
              { style: _extends({}, flexChild, columnParent, flexContainer) },
              React.createElement(
                'header',
                { style: _extends({}, flexChild, flexNone) },
                React.createElement(Header, null),
                React.createElement(Master, null)
              ),
              React.createElement(
                'section',
                { style: _extends({}, flexChild, rowParent) },
                React.createElement(LeftPanel, null),
                React.createElement(RightPanel, null)
              ),
              React.createElement('footer', { style: _extends({}, flexChild, flexNone) })
            );
          }
        }]);

        var _App = App;
        App = provide(App) || App;
        return App;
      })(React.Component);

      _export('default', App);
    }
  };
});
$__System.registerDynamic("4f", ["29", "26"], true, function($__require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  var $ = $__require('29'),
      toIObject = $__require('26');
  module.exports = function(object, el) {
    var O = toIObject(object),
        keys = $.getKeys(O),
        length = keys.length,
        index = 0,
        key;
    while (length > index)
      if (O[key = keys[index++]] === el)
        return key;
  };
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("50", ["26", "29"], true, function($__require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  var toIObject = $__require('26'),
      getNames = $__require('29').getNames,
      toString = {}.toString;
  var windowNames = typeof window == 'object' && Object.getOwnPropertyNames ? Object.getOwnPropertyNames(window) : [];
  var getWindowNames = function(it) {
    try {
      return getNames(it);
    } catch (e) {
      return windowNames.slice();
    }
  };
  module.exports.get = function getOwnPropertyNames(it) {
    if (windowNames && toString.call(it) == '[object Window]')
      return getWindowNames(it);
    return getNames(toIObject(it));
  };
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("51", ["29"], true, function($__require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  var $ = $__require('29');
  module.exports = function(it) {
    var keys = $.getKeys(it),
        getSymbols = $.getSymbols;
    if (getSymbols) {
      var symbols = getSymbols(it),
          isEnum = $.isEnum,
          i = 0,
          key;
      while (symbols.length > i)
        if (isEnum.call(it, key = symbols[i++]))
          keys.push(key);
    }
    return keys;
  };
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("52", ["53"], true, function($__require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  var cof = $__require('53');
  module.exports = Array.isArray || function(arg) {
    return cof(arg) == 'Array';
  };
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("54", ["29", "55", "56", "57", "58", "59", "5a", "5b", "5c", "5d", "5e", "4f", "50", "51", "52", "13", "26", "5f", "60"], true, function($__require, exports, module) {
  "use strict";
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  var $ = $__require('29'),
      global = $__require('55'),
      has = $__require('56'),
      DESCRIPTORS = $__require('57'),
      $export = $__require('58'),
      redefine = $__require('59'),
      $fails = $__require('5a'),
      shared = $__require('5b'),
      setToStringTag = $__require('5c'),
      uid = $__require('5d'),
      wks = $__require('5e'),
      keyOf = $__require('4f'),
      $names = $__require('50'),
      enumKeys = $__require('51'),
      isArray = $__require('52'),
      anObject = $__require('13'),
      toIObject = $__require('26'),
      createDesc = $__require('5f'),
      getDesc = $.getDesc,
      setDesc = $.setDesc,
      _create = $.create,
      getNames = $names.get,
      $Symbol = global.Symbol,
      $JSON = global.JSON,
      _stringify = $JSON && $JSON.stringify,
      setter = false,
      HIDDEN = wks('_hidden'),
      isEnum = $.isEnum,
      SymbolRegistry = shared('symbol-registry'),
      AllSymbols = shared('symbols'),
      useNative = typeof $Symbol == 'function',
      ObjectProto = Object.prototype;
  var setSymbolDesc = DESCRIPTORS && $fails(function() {
    return _create(setDesc({}, 'a', {get: function() {
        return setDesc(this, 'a', {value: 7}).a;
      }})).a != 7;
  }) ? function(it, key, D) {
    var protoDesc = getDesc(ObjectProto, key);
    if (protoDesc)
      delete ObjectProto[key];
    setDesc(it, key, D);
    if (protoDesc && it !== ObjectProto)
      setDesc(ObjectProto, key, protoDesc);
  } : setDesc;
  var wrap = function(tag) {
    var sym = AllSymbols[tag] = _create($Symbol.prototype);
    sym._k = tag;
    DESCRIPTORS && setter && setSymbolDesc(ObjectProto, tag, {
      configurable: true,
      set: function(value) {
        if (has(this, HIDDEN) && has(this[HIDDEN], tag))
          this[HIDDEN][tag] = false;
        setSymbolDesc(this, tag, createDesc(1, value));
      }
    });
    return sym;
  };
  var isSymbol = function(it) {
    return typeof it == 'symbol';
  };
  var $defineProperty = function defineProperty(it, key, D) {
    if (D && has(AllSymbols, key)) {
      if (!D.enumerable) {
        if (!has(it, HIDDEN))
          setDesc(it, HIDDEN, createDesc(1, {}));
        it[HIDDEN][key] = true;
      } else {
        if (has(it, HIDDEN) && it[HIDDEN][key])
          it[HIDDEN][key] = false;
        D = _create(D, {enumerable: createDesc(0, false)});
      }
      return setSymbolDesc(it, key, D);
    }
    return setDesc(it, key, D);
  };
  var $defineProperties = function defineProperties(it, P) {
    anObject(it);
    var keys = enumKeys(P = toIObject(P)),
        i = 0,
        l = keys.length,
        key;
    while (l > i)
      $defineProperty(it, key = keys[i++], P[key]);
    return it;
  };
  var $create = function create(it, P) {
    return P === undefined ? _create(it) : $defineProperties(_create(it), P);
  };
  var $propertyIsEnumerable = function propertyIsEnumerable(key) {
    var E = isEnum.call(this, key);
    return E || !has(this, key) || !has(AllSymbols, key) || has(this, HIDDEN) && this[HIDDEN][key] ? E : true;
  };
  var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key) {
    var D = getDesc(it = toIObject(it), key);
    if (D && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key]))
      D.enumerable = true;
    return D;
  };
  var $getOwnPropertyNames = function getOwnPropertyNames(it) {
    var names = getNames(toIObject(it)),
        result = [],
        i = 0,
        key;
    while (names.length > i)
      if (!has(AllSymbols, key = names[i++]) && key != HIDDEN)
        result.push(key);
    return result;
  };
  var $getOwnPropertySymbols = function getOwnPropertySymbols(it) {
    var names = getNames(toIObject(it)),
        result = [],
        i = 0,
        key;
    while (names.length > i)
      if (has(AllSymbols, key = names[i++]))
        result.push(AllSymbols[key]);
    return result;
  };
  var $stringify = function stringify(it) {
    if (it === undefined || isSymbol(it))
      return;
    var args = [it],
        i = 1,
        $$ = arguments,
        replacer,
        $replacer;
    while ($$.length > i)
      args.push($$[i++]);
    replacer = args[1];
    if (typeof replacer == 'function')
      $replacer = replacer;
    if ($replacer || !isArray(replacer))
      replacer = function(key, value) {
        if ($replacer)
          value = $replacer.call(this, key, value);
        if (!isSymbol(value))
          return value;
      };
    args[1] = replacer;
    return _stringify.apply($JSON, args);
  };
  var buggyJSON = $fails(function() {
    var S = $Symbol();
    return _stringify([S]) != '[null]' || _stringify({a: S}) != '{}' || _stringify(Object(S)) != '{}';
  });
  if (!useNative) {
    $Symbol = function Symbol() {
      if (isSymbol(this))
        throw TypeError('Symbol is not a constructor');
      return wrap(uid(arguments.length > 0 ? arguments[0] : undefined));
    };
    redefine($Symbol.prototype, 'toString', function toString() {
      return this._k;
    });
    isSymbol = function(it) {
      return it instanceof $Symbol;
    };
    $.create = $create;
    $.isEnum = $propertyIsEnumerable;
    $.getDesc = $getOwnPropertyDescriptor;
    $.setDesc = $defineProperty;
    $.setDescs = $defineProperties;
    $.getNames = $names.get = $getOwnPropertyNames;
    $.getSymbols = $getOwnPropertySymbols;
    if (DESCRIPTORS && !$__require('60')) {
      redefine(ObjectProto, 'propertyIsEnumerable', $propertyIsEnumerable, true);
    }
  }
  var symbolStatics = {
    'for': function(key) {
      return has(SymbolRegistry, key += '') ? SymbolRegistry[key] : SymbolRegistry[key] = $Symbol(key);
    },
    keyFor: function keyFor(key) {
      return keyOf(SymbolRegistry, key);
    },
    useSetter: function() {
      setter = true;
    },
    useSimple: function() {
      setter = false;
    }
  };
  $.each.call(('hasInstance,isConcatSpreadable,iterator,match,replace,search,' + 'species,split,toPrimitive,toStringTag,unscopables').split(','), function(it) {
    var sym = wks(it);
    symbolStatics[it] = useNative ? sym : wrap(sym);
  });
  setter = true;
  $export($export.G + $export.W, {Symbol: $Symbol});
  $export($export.S, 'Symbol', symbolStatics);
  $export($export.S + $export.F * !useNative, 'Object', {
    create: $create,
    defineProperty: $defineProperty,
    defineProperties: $defineProperties,
    getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
    getOwnPropertyNames: $getOwnPropertyNames,
    getOwnPropertySymbols: $getOwnPropertySymbols
  });
  $JSON && $export($export.S + $export.F * (!useNative || buggyJSON), 'JSON', {stringify: $stringify});
  setToStringTag($Symbol, 'Symbol');
  setToStringTag(Math, 'Math', true);
  setToStringTag(global.JSON, 'JSON', true);
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("61", ["54", "62", "15"], true, function($__require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  $__require('54');
  $__require('62');
  module.exports = $__require('15').Symbol;
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("63", ["61"], true, function($__require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  module.exports = $__require('61');
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("64", ["63"], true, function($__require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  module.exports = {
    "default": $__require('63'),
    __esModule: true
  };
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("65", ["29"], true, function($__require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  var $ = $__require('29');
  module.exports = function create(P, D) {
    return $.create(P, D);
  };
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("2b", ["65"], true, function($__require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  module.exports = {
    "default": $__require('65'),
    __esModule: true
  };
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("66", ["58", "67"], true, function($__require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  var $export = $__require('58');
  $export($export.S, 'Object', {setPrototypeOf: $__require('67').set});
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("68", ["66", "15"], true, function($__require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  $__require('66');
  module.exports = $__require('15').Object.setPrototypeOf;
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("2c", ["68"], true, function($__require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  module.exports = {
    "default": $__require('68'),
    __esModule: true
  };
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("69", ["64", "2b", "2c", "6a", "3a"], true, function($__require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  (function(process) {
    "use strict";
    var _Symbol = $__require('64')["default"];
    var _Object$create = $__require('2b')["default"];
    var _Object$setPrototypeOf = $__require('2c')["default"];
    var _Promise = $__require('6a')["default"];
    !(function(global) {
      "use strict";
      var hasOwn = Object.prototype.hasOwnProperty;
      var undefined;
      var $Symbol = typeof _Symbol === "function" ? _Symbol : {};
      var iteratorSymbol = $Symbol.iterator || "@@iterator";
      var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";
      var inModule = typeof module === "object";
      var runtime = global.regeneratorRuntime;
      if (runtime) {
        if (inModule) {
          module.exports = runtime;
        }
        return;
      }
      runtime = global.regeneratorRuntime = inModule ? module.exports : {};
      function wrap(innerFn, outerFn, self, tryLocsList) {
        var generator = _Object$create((outerFn || Generator).prototype);
        var context = new Context(tryLocsList || []);
        generator._invoke = makeInvokeMethod(innerFn, self, context);
        return generator;
      }
      runtime.wrap = wrap;
      function tryCatch(fn, obj, arg) {
        try {
          return {
            type: "normal",
            arg: fn.call(obj, arg)
          };
        } catch (err) {
          return {
            type: "throw",
            arg: err
          };
        }
      }
      var GenStateSuspendedStart = "suspendedStart";
      var GenStateSuspendedYield = "suspendedYield";
      var GenStateExecuting = "executing";
      var GenStateCompleted = "completed";
      var ContinueSentinel = {};
      function Generator() {}
      function GeneratorFunction() {}
      function GeneratorFunctionPrototype() {}
      var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype;
      GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
      GeneratorFunctionPrototype.constructor = GeneratorFunction;
      GeneratorFunctionPrototype[toStringTagSymbol] = GeneratorFunction.displayName = "GeneratorFunction";
      function defineIteratorMethods(prototype) {
        ["next", "throw", "return"].forEach(function(method) {
          prototype[method] = function(arg) {
            return this._invoke(method, arg);
          };
        });
      }
      runtime.isGeneratorFunction = function(genFun) {
        var ctor = typeof genFun === "function" && genFun.constructor;
        return ctor ? ctor === GeneratorFunction || (ctor.displayName || ctor.name) === "GeneratorFunction" : false;
      };
      runtime.mark = function(genFun) {
        if (_Object$setPrototypeOf) {
          _Object$setPrototypeOf(genFun, GeneratorFunctionPrototype);
        } else {
          genFun.__proto__ = GeneratorFunctionPrototype;
          if (!(toStringTagSymbol in genFun)) {
            genFun[toStringTagSymbol] = "GeneratorFunction";
          }
        }
        genFun.prototype = _Object$create(Gp);
        return genFun;
      };
      runtime.awrap = function(arg) {
        return new AwaitArgument(arg);
      };
      function AwaitArgument(arg) {
        this.arg = arg;
      }
      function AsyncIterator(generator) {
        function invoke(method, arg, resolve, reject) {
          var record = tryCatch(generator[method], generator, arg);
          if (record.type === "throw") {
            reject(record.arg);
          } else {
            var result = record.arg;
            var value = result.value;
            if (value instanceof AwaitArgument) {
              return _Promise.resolve(value.arg).then(function(value) {
                invoke("next", value, resolve, reject);
              }, function(err) {
                invoke("throw", err, resolve, reject);
              });
            }
            return _Promise.resolve(value).then(function(unwrapped) {
              result.value = unwrapped;
              resolve(result);
            }, reject);
          }
        }
        if (typeof process === "object" && process.domain) {
          invoke = process.domain.bind(invoke);
        }
        var previousPromise;
        function enqueue(method, arg) {
          function callInvokeWithMethodAndArg() {
            return new _Promise(function(resolve, reject) {
              invoke(method, arg, resolve, reject);
            });
          }
          return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg();
        }
        this._invoke = enqueue;
      }
      defineIteratorMethods(AsyncIterator.prototype);
      runtime.async = function(innerFn, outerFn, self, tryLocsList) {
        var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList));
        return runtime.isGeneratorFunction(outerFn) ? iter : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
      };
      function makeInvokeMethod(innerFn, self, context) {
        var state = GenStateSuspendedStart;
        return function invoke(method, arg) {
          if (state === GenStateExecuting) {
            throw new Error("Generator is already running");
          }
          if (state === GenStateCompleted) {
            if (method === "throw") {
              throw arg;
            }
            return doneResult();
          }
          while (true) {
            var delegate = context.delegate;
            if (delegate) {
              if (method === "return" || method === "throw" && delegate.iterator[method] === undefined) {
                context.delegate = null;
                var returnMethod = delegate.iterator["return"];
                if (returnMethod) {
                  var record = tryCatch(returnMethod, delegate.iterator, arg);
                  if (record.type === "throw") {
                    method = "throw";
                    arg = record.arg;
                    continue;
                  }
                }
                if (method === "return") {
                  continue;
                }
              }
              var record = tryCatch(delegate.iterator[method], delegate.iterator, arg);
              if (record.type === "throw") {
                context.delegate = null;
                method = "throw";
                arg = record.arg;
                continue;
              }
              method = "next";
              arg = undefined;
              var info = record.arg;
              if (info.done) {
                context[delegate.resultName] = info.value;
                context.next = delegate.nextLoc;
              } else {
                state = GenStateSuspendedYield;
                return info;
              }
              context.delegate = null;
            }
            if (method === "next") {
              if (state === GenStateSuspendedYield) {
                context.sent = arg;
              } else {
                context.sent = undefined;
              }
            } else if (method === "throw") {
              if (state === GenStateSuspendedStart) {
                state = GenStateCompleted;
                throw arg;
              }
              if (context.dispatchException(arg)) {
                method = "next";
                arg = undefined;
              }
            } else if (method === "return") {
              context.abrupt("return", arg);
            }
            state = GenStateExecuting;
            var record = tryCatch(innerFn, self, context);
            if (record.type === "normal") {
              state = context.done ? GenStateCompleted : GenStateSuspendedYield;
              var info = {
                value: record.arg,
                done: context.done
              };
              if (record.arg === ContinueSentinel) {
                if (context.delegate && method === "next") {
                  arg = undefined;
                }
              } else {
                return info;
              }
            } else if (record.type === "throw") {
              state = GenStateCompleted;
              method = "throw";
              arg = record.arg;
            }
          }
        };
      }
      defineIteratorMethods(Gp);
      Gp[iteratorSymbol] = function() {
        return this;
      };
      Gp[toStringTagSymbol] = "Generator";
      Gp.toString = function() {
        return "[object Generator]";
      };
      function pushTryEntry(locs) {
        var entry = {tryLoc: locs[0]};
        if (1 in locs) {
          entry.catchLoc = locs[1];
        }
        if (2 in locs) {
          entry.finallyLoc = locs[2];
          entry.afterLoc = locs[3];
        }
        this.tryEntries.push(entry);
      }
      function resetTryEntry(entry) {
        var record = entry.completion || {};
        record.type = "normal";
        delete record.arg;
        entry.completion = record;
      }
      function Context(tryLocsList) {
        this.tryEntries = [{tryLoc: "root"}];
        tryLocsList.forEach(pushTryEntry, this);
        this.reset(true);
      }
      runtime.keys = function(object) {
        var keys = [];
        for (var key in object) {
          keys.push(key);
        }
        keys.reverse();
        return function next() {
          while (keys.length) {
            var key = keys.pop();
            if (key in object) {
              next.value = key;
              next.done = false;
              return next;
            }
          }
          next.done = true;
          return next;
        };
      };
      function values(iterable) {
        if (iterable) {
          var iteratorMethod = iterable[iteratorSymbol];
          if (iteratorMethod) {
            return iteratorMethod.call(iterable);
          }
          if (typeof iterable.next === "function") {
            return iterable;
          }
          if (!isNaN(iterable.length)) {
            var i = -1,
                next = function next() {
                  while (++i < iterable.length) {
                    if (hasOwn.call(iterable, i)) {
                      next.value = iterable[i];
                      next.done = false;
                      return next;
                    }
                  }
                  next.value = undefined;
                  next.done = true;
                  return next;
                };
            return next.next = next;
          }
        }
        return {next: doneResult};
      }
      runtime.values = values;
      function doneResult() {
        return {
          value: undefined,
          done: true
        };
      }
      Context.prototype = {
        constructor: Context,
        reset: function reset(skipTempReset) {
          this.prev = 0;
          this.next = 0;
          this.sent = undefined;
          this.done = false;
          this.delegate = null;
          this.tryEntries.forEach(resetTryEntry);
          if (!skipTempReset) {
            for (var name in this) {
              if (name.charAt(0) === "t" && hasOwn.call(this, name) && !isNaN(+name.slice(1))) {
                this[name] = undefined;
              }
            }
          }
        },
        stop: function stop() {
          this.done = true;
          var rootEntry = this.tryEntries[0];
          var rootRecord = rootEntry.completion;
          if (rootRecord.type === "throw") {
            throw rootRecord.arg;
          }
          return this.rval;
        },
        dispatchException: function dispatchException(exception) {
          if (this.done) {
            throw exception;
          }
          var context = this;
          function handle(loc, caught) {
            record.type = "throw";
            record.arg = exception;
            context.next = loc;
            return !!caught;
          }
          for (var i = this.tryEntries.length - 1; i >= 0; --i) {
            var entry = this.tryEntries[i];
            var record = entry.completion;
            if (entry.tryLoc === "root") {
              return handle("end");
            }
            if (entry.tryLoc <= this.prev) {
              var hasCatch = hasOwn.call(entry, "catchLoc");
              var hasFinally = hasOwn.call(entry, "finallyLoc");
              if (hasCatch && hasFinally) {
                if (this.prev < entry.catchLoc) {
                  return handle(entry.catchLoc, true);
                } else if (this.prev < entry.finallyLoc) {
                  return handle(entry.finallyLoc);
                }
              } else if (hasCatch) {
                if (this.prev < entry.catchLoc) {
                  return handle(entry.catchLoc, true);
                }
              } else if (hasFinally) {
                if (this.prev < entry.finallyLoc) {
                  return handle(entry.finallyLoc);
                }
              } else {
                throw new Error("try statement without catch or finally");
              }
            }
          }
        },
        abrupt: function abrupt(type, arg) {
          for (var i = this.tryEntries.length - 1; i >= 0; --i) {
            var entry = this.tryEntries[i];
            if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) {
              var finallyEntry = entry;
              break;
            }
          }
          if (finallyEntry && (type === "break" || type === "continue") && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc) {
            finallyEntry = null;
          }
          var record = finallyEntry ? finallyEntry.completion : {};
          record.type = type;
          record.arg = arg;
          if (finallyEntry) {
            this.next = finallyEntry.finallyLoc;
          } else {
            this.complete(record);
          }
          return ContinueSentinel;
        },
        complete: function complete(record, afterLoc) {
          if (record.type === "throw") {
            throw record.arg;
          }
          if (record.type === "break" || record.type === "continue") {
            this.next = record.arg;
          } else if (record.type === "return") {
            this.rval = record.arg;
            this.next = "end";
          } else if (record.type === "normal" && afterLoc) {
            this.next = afterLoc;
          }
        },
        finish: function finish(finallyLoc) {
          for (var i = this.tryEntries.length - 1; i >= 0; --i) {
            var entry = this.tryEntries[i];
            if (entry.finallyLoc === finallyLoc) {
              this.complete(entry.completion, entry.afterLoc);
              resetTryEntry(entry);
              return ContinueSentinel;
            }
          }
        },
        "catch": function _catch(tryLoc) {
          for (var i = this.tryEntries.length - 1; i >= 0; --i) {
            var entry = this.tryEntries[i];
            if (entry.tryLoc === tryLoc) {
              var record = entry.completion;
              if (record.type === "throw") {
                var thrown = record.arg;
                resetTryEntry(entry);
              }
              return thrown;
            }
          }
          throw new Error("illegal catch attempt");
        },
        delegateYield: function delegateYield(iterable, resultName, nextLoc) {
          this.delegate = {
            iterator: values(iterable),
            resultName: resultName,
            nextLoc: nextLoc
          };
          return ContinueSentinel;
        }
      };
    })(typeof global === "object" ? global : typeof window === "object" ? window : typeof self === "object" ? self : undefined);
  })($__require('3a'));
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("6b", ["69"], true, function($__require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  var g = typeof global === "object" ? global : typeof window === "object" ? window : typeof self === "object" ? self : this;
  var hadRuntime = g.regeneratorRuntime && Object.getOwnPropertyNames(g).indexOf("regeneratorRuntime") >= 0;
  var oldRuntime = hadRuntime && g.regeneratorRuntime;
  g.regeneratorRuntime = undefined;
  module.exports = $__require('69');
  if (hadRuntime) {
    g.regeneratorRuntime = oldRuntime;
  } else {
    try {
      delete g.regeneratorRuntime;
    } catch (e) {
      g.regeneratorRuntime = undefined;
    }
  }
  module.exports = {
    "default": module.exports,
    __esModule: true
  };
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("6c", ["6b"], true, function($__require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  module.exports = $__require('6b');
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("6d", ["6e"], true, function($__require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  module.exports = $__require('6e');
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("62", [], true, function($__require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  "format cjs";
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("6f", [], true, function($__require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  module.exports = function() {};
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("70", [], true, function($__require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  module.exports = function(done, value) {
    return {
      value: value,
      done: !!done
    };
  };
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("26", ["71", "72"], true, function($__require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  var IObject = $__require('71'),
      defined = $__require('72');
  module.exports = function(it) {
    return IObject(defined(it));
  };
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("73", ["6f", "70", "74", "26", "75"], true, function($__require, exports, module) {
  "use strict";
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  var addToUnscopables = $__require('6f'),
      step = $__require('70'),
      Iterators = $__require('74'),
      toIObject = $__require('26');
  module.exports = $__require('75')(Array, 'Array', function(iterated, kind) {
    this._t = toIObject(iterated);
    this._i = 0;
    this._k = kind;
  }, function() {
    var O = this._t,
        kind = this._k,
        index = this._i++;
    if (!O || index >= O.length) {
      this._t = undefined;
      return step(1);
    }
    if (kind == 'keys')
      return step(0, index);
    if (kind == 'values')
      return step(0, O[index]);
    return step(0, [index, O[index]]);
  }, 'values');
  Iterators.Arguments = Iterators.Array;
  addToUnscopables('keys');
  addToUnscopables('values');
  addToUnscopables('entries');
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("17", ["73", "74"], true, function($__require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  $__require('73');
  var Iterators = $__require('74');
  Iterators.NodeList = Iterators.HTMLCollection = Iterators.Array;
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("76", [], true, function($__require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  module.exports = function(it, Constructor, name) {
    if (!(it instanceof Constructor))
      throw TypeError(name + ": use the 'new' operator!");
    return it;
  };
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("77", ["78", "79", "7a", "13", "7b", "14"], true, function($__require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  var ctx = $__require('78'),
      call = $__require('79'),
      isArrayIter = $__require('7a'),
      anObject = $__require('13'),
      toLength = $__require('7b'),
      getIterFn = $__require('14');
  module.exports = function(iterable, entries, fn, that) {
    var iterFn = getIterFn(iterable),
        f = ctx(fn, that, entries ? 2 : 1),
        index = 0,
        length,
        step,
        iterator;
    if (typeof iterFn != 'function')
      throw TypeError(iterable + ' is not iterable!');
    if (isArrayIter(iterFn))
      for (length = toLength(iterable.length); length > index; index++) {
        entries ? f(anObject(step = iterable[index])[0], step[1]) : f(iterable[index]);
      }
    else
      for (iterator = iterFn.call(iterable); !(step = iterator.next()).done; ) {
        call(iterator, f, step.value, entries);
      }
  };
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("67", ["29", "7c", "13", "78"], true, function($__require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  var getDesc = $__require('29').getDesc,
      isObject = $__require('7c'),
      anObject = $__require('13');
  var check = function(O, proto) {
    anObject(O);
    if (!isObject(proto) && proto !== null)
      throw TypeError(proto + ": can't set as prototype!");
  };
  module.exports = {
    set: Object.setPrototypeOf || ('__proto__' in {} ? function(test, buggy, set) {
      try {
        set = $__require('78')(Function.call, getDesc(Object.prototype, '__proto__').set, 2);
        set(test, []);
        buggy = !(test instanceof Array);
      } catch (e) {
        buggy = true;
      }
      return function setPrototypeOf(O, proto) {
        check(O, proto);
        if (buggy)
          O.__proto__ = proto;
        else
          set(O, proto);
        return O;
      };
    }({}, false) : undefined),
    check: check
  };
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("7d", [], true, function($__require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  module.exports = Object.is || function is(x, y) {
    return x === y ? x !== 0 || 1 / x === 1 / y : x != x && y != y;
  };
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("7e", ["13", "7f", "5e"], true, function($__require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  var anObject = $__require('13'),
      aFunction = $__require('7f'),
      SPECIES = $__require('5e')('species');
  module.exports = function(O, D) {
    var C = anObject(O).constructor,
        S;
    return C === undefined || (S = anObject(C)[SPECIES]) == undefined ? D : aFunction(S);
  };
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("80", [], true, function($__require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  module.exports = function(fn, args, that) {
    var un = that === undefined;
    switch (args.length) {
      case 0:
        return un ? fn() : fn.call(that);
      case 1:
        return un ? fn(args[0]) : fn.call(that, args[0]);
      case 2:
        return un ? fn(args[0], args[1]) : fn.call(that, args[0], args[1]);
      case 3:
        return un ? fn(args[0], args[1], args[2]) : fn.call(that, args[0], args[1], args[2]);
      case 4:
        return un ? fn(args[0], args[1], args[2], args[3]) : fn.call(that, args[0], args[1], args[2], args[3]);
    }
    return fn.apply(that, args);
  };
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("81", ["55"], true, function($__require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  module.exports = $__require('55').document && document.documentElement;
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("82", ["7c", "55"], true, function($__require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  var isObject = $__require('7c'),
      document = $__require('55').document,
      is = isObject(document) && isObject(document.createElement);
  module.exports = function(it) {
    return is ? document.createElement(it) : {};
  };
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("83", ["78", "80", "81", "82", "55", "53", "3a"], true, function($__require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  (function(process) {
    var ctx = $__require('78'),
        invoke = $__require('80'),
        html = $__require('81'),
        cel = $__require('82'),
        global = $__require('55'),
        process = global.process,
        setTask = global.setImmediate,
        clearTask = global.clearImmediate,
        MessageChannel = global.MessageChannel,
        counter = 0,
        queue = {},
        ONREADYSTATECHANGE = 'onreadystatechange',
        defer,
        channel,
        port;
    var run = function() {
      var id = +this;
      if (queue.hasOwnProperty(id)) {
        var fn = queue[id];
        delete queue[id];
        fn();
      }
    };
    var listner = function(event) {
      run.call(event.data);
    };
    if (!setTask || !clearTask) {
      setTask = function setImmediate(fn) {
        var args = [],
            i = 1;
        while (arguments.length > i)
          args.push(arguments[i++]);
        queue[++counter] = function() {
          invoke(typeof fn == 'function' ? fn : Function(fn), args);
        };
        defer(counter);
        return counter;
      };
      clearTask = function clearImmediate(id) {
        delete queue[id];
      };
      if ($__require('53')(process) == 'process') {
        defer = function(id) {
          process.nextTick(ctx(run, id, 1));
        };
      } else if (MessageChannel) {
        channel = new MessageChannel;
        port = channel.port2;
        channel.port1.onmessage = listner;
        defer = ctx(port.postMessage, port, 1);
      } else if (global.addEventListener && typeof postMessage == 'function' && !global.importScripts) {
        defer = function(id) {
          global.postMessage(id + '', '*');
        };
        global.addEventListener('message', listner, false);
      } else if (ONREADYSTATECHANGE in cel('script')) {
        defer = function(id) {
          html.appendChild(cel('script'))[ONREADYSTATECHANGE] = function() {
            html.removeChild(this);
            run.call(id);
          };
        };
      } else {
        defer = function(id) {
          setTimeout(ctx(run, id, 1), 0);
        };
      }
    }
    module.exports = {
      set: setTask,
      clear: clearTask
    };
  })($__require('3a'));
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("84", ["55", "83", "53", "3a"], true, function($__require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  (function(process) {
    var global = $__require('55'),
        macrotask = $__require('83').set,
        Observer = global.MutationObserver || global.WebKitMutationObserver,
        process = global.process,
        Promise = global.Promise,
        isNode = $__require('53')(process) == 'process',
        head,
        last,
        notify;
    var flush = function() {
      var parent,
          domain,
          fn;
      if (isNode && (parent = process.domain)) {
        process.domain = null;
        parent.exit();
      }
      while (head) {
        domain = head.domain;
        fn = head.fn;
        if (domain)
          domain.enter();
        fn();
        if (domain)
          domain.exit();
        head = head.next;
      }
      last = undefined;
      if (parent)
        parent.enter();
    };
    if (isNode) {
      notify = function() {
        process.nextTick(flush);
      };
    } else if (Observer) {
      var toggle = 1,
          node = document.createTextNode('');
      new Observer(flush).observe(node, {characterData: true});
      notify = function() {
        node.data = toggle = -toggle;
      };
    } else if (Promise && Promise.resolve) {
      notify = function() {
        Promise.resolve().then(flush);
      };
    } else {
      notify = function() {
        macrotask.call(global, flush);
      };
    }
    module.exports = function asap(fn) {
      var task = {
        fn: fn,
        next: undefined,
        domain: isNode && process.domain
      };
      if (last)
        last.next = task;
      if (!head) {
        head = task;
        notify();
      }
      last = task;
    };
  })($__require('3a'));
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("85", ["59"], true, function($__require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  var redefine = $__require('59');
  module.exports = function(target, src) {
    for (var key in src)
      redefine(target, key, src[key]);
    return target;
  };
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("86", ["15", "29", "57", "5e"], true, function($__require, exports, module) {
  "use strict";
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  var core = $__require('15'),
      $ = $__require('29'),
      DESCRIPTORS = $__require('57'),
      SPECIES = $__require('5e')('species');
  module.exports = function(KEY) {
    var C = core[KEY];
    if (DESCRIPTORS && C && !C[SPECIES])
      $.setDesc(C, SPECIES, {
        configurable: true,
        get: function() {
          return this;
        }
      });
  };
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("87", ["29", "60", "55", "78", "88", "58", "7c", "13", "7f", "76", "77", "67", "7d", "5e", "7e", "84", "57", "85", "5c", "86", "15", "89", "3a"], true, function($__require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  (function(process) {
    'use strict';
    var $ = $__require('29'),
        LIBRARY = $__require('60'),
        global = $__require('55'),
        ctx = $__require('78'),
        classof = $__require('88'),
        $export = $__require('58'),
        isObject = $__require('7c'),
        anObject = $__require('13'),
        aFunction = $__require('7f'),
        strictNew = $__require('76'),
        forOf = $__require('77'),
        setProto = $__require('67').set,
        same = $__require('7d'),
        SPECIES = $__require('5e')('species'),
        speciesConstructor = $__require('7e'),
        asap = $__require('84'),
        PROMISE = 'Promise',
        process = global.process,
        isNode = classof(process) == 'process',
        P = global[PROMISE],
        Wrapper;
    var testResolve = function(sub) {
      var test = new P(function() {});
      if (sub)
        test.constructor = Object;
      return P.resolve(test) === test;
    };
    var USE_NATIVE = function() {
      var works = false;
      function P2(x) {
        var self = new P(x);
        setProto(self, P2.prototype);
        return self;
      }
      try {
        works = P && P.resolve && testResolve();
        setProto(P2, P);
        P2.prototype = $.create(P.prototype, {constructor: {value: P2}});
        if (!(P2.resolve(5).then(function() {}) instanceof P2)) {
          works = false;
        }
        if (works && $__require('57')) {
          var thenableThenGotten = false;
          P.resolve($.setDesc({}, 'then', {get: function() {
              thenableThenGotten = true;
            }}));
          works = thenableThenGotten;
        }
      } catch (e) {
        works = false;
      }
      return works;
    }();
    var sameConstructor = function(a, b) {
      if (LIBRARY && a === P && b === Wrapper)
        return true;
      return same(a, b);
    };
    var getConstructor = function(C) {
      var S = anObject(C)[SPECIES];
      return S != undefined ? S : C;
    };
    var isThenable = function(it) {
      var then;
      return isObject(it) && typeof(then = it.then) == 'function' ? then : false;
    };
    var PromiseCapability = function(C) {
      var resolve,
          reject;
      this.promise = new C(function($$resolve, $$reject) {
        if (resolve !== undefined || reject !== undefined)
          throw TypeError('Bad Promise constructor');
        resolve = $$resolve;
        reject = $$reject;
      });
      this.resolve = aFunction(resolve), this.reject = aFunction(reject);
    };
    var perform = function(exec) {
      try {
        exec();
      } catch (e) {
        return {error: e};
      }
    };
    var notify = function(record, isReject) {
      if (record.n)
        return;
      record.n = true;
      var chain = record.c;
      asap(function() {
        var value = record.v,
            ok = record.s == 1,
            i = 0;
        var run = function(reaction) {
          var handler = ok ? reaction.ok : reaction.fail,
              resolve = reaction.resolve,
              reject = reaction.reject,
              result,
              then;
          try {
            if (handler) {
              if (!ok)
                record.h = true;
              result = handler === true ? value : handler(value);
              if (result === reaction.promise) {
                reject(TypeError('Promise-chain cycle'));
              } else if (then = isThenable(result)) {
                then.call(result, resolve, reject);
              } else
                resolve(result);
            } else
              reject(value);
          } catch (e) {
            reject(e);
          }
        };
        while (chain.length > i)
          run(chain[i++]);
        chain.length = 0;
        record.n = false;
        if (isReject)
          setTimeout(function() {
            var promise = record.p,
                handler,
                console;
            if (isUnhandled(promise)) {
              if (isNode) {
                process.emit('unhandledRejection', value, promise);
              } else if (handler = global.onunhandledrejection) {
                handler({
                  promise: promise,
                  reason: value
                });
              } else if ((console = global.console) && console.error) {
                console.error('Unhandled promise rejection', value);
              }
            }
            record.a = undefined;
          }, 1);
      });
    };
    var isUnhandled = function(promise) {
      var record = promise._d,
          chain = record.a || record.c,
          i = 0,
          reaction;
      if (record.h)
        return false;
      while (chain.length > i) {
        reaction = chain[i++];
        if (reaction.fail || !isUnhandled(reaction.promise))
          return false;
      }
      return true;
    };
    var $reject = function(value) {
      var record = this;
      if (record.d)
        return;
      record.d = true;
      record = record.r || record;
      record.v = value;
      record.s = 2;
      record.a = record.c.slice();
      notify(record, true);
    };
    var $resolve = function(value) {
      var record = this,
          then;
      if (record.d)
        return;
      record.d = true;
      record = record.r || record;
      try {
        if (record.p === value)
          throw TypeError("Promise can't be resolved itself");
        if (then = isThenable(value)) {
          asap(function() {
            var wrapper = {
              r: record,
              d: false
            };
            try {
              then.call(value, ctx($resolve, wrapper, 1), ctx($reject, wrapper, 1));
            } catch (e) {
              $reject.call(wrapper, e);
            }
          });
        } else {
          record.v = value;
          record.s = 1;
          notify(record, false);
        }
      } catch (e) {
        $reject.call({
          r: record,
          d: false
        }, e);
      }
    };
    if (!USE_NATIVE) {
      P = function Promise(executor) {
        aFunction(executor);
        var record = this._d = {
          p: strictNew(this, P, PROMISE),
          c: [],
          a: undefined,
          s: 0,
          d: false,
          v: undefined,
          h: false,
          n: false
        };
        try {
          executor(ctx($resolve, record, 1), ctx($reject, record, 1));
        } catch (err) {
          $reject.call(record, err);
        }
      };
      $__require('85')(P.prototype, {
        then: function then(onFulfilled, onRejected) {
          var reaction = new PromiseCapability(speciesConstructor(this, P)),
              promise = reaction.promise,
              record = this._d;
          reaction.ok = typeof onFulfilled == 'function' ? onFulfilled : true;
          reaction.fail = typeof onRejected == 'function' && onRejected;
          record.c.push(reaction);
          if (record.a)
            record.a.push(reaction);
          if (record.s)
            notify(record, false);
          return promise;
        },
        'catch': function(onRejected) {
          return this.then(undefined, onRejected);
        }
      });
    }
    $export($export.G + $export.W + $export.F * !USE_NATIVE, {Promise: P});
    $__require('5c')(P, PROMISE);
    $__require('86')(PROMISE);
    Wrapper = $__require('15')[PROMISE];
    $export($export.S + $export.F * !USE_NATIVE, PROMISE, {reject: function reject(r) {
        var capability = new PromiseCapability(this),
            $$reject = capability.reject;
        $$reject(r);
        return capability.promise;
      }});
    $export($export.S + $export.F * (!USE_NATIVE || testResolve(true)), PROMISE, {resolve: function resolve(x) {
        if (x instanceof P && sameConstructor(x.constructor, this))
          return x;
        var capability = new PromiseCapability(this),
            $$resolve = capability.resolve;
        $$resolve(x);
        return capability.promise;
      }});
    $export($export.S + $export.F * !(USE_NATIVE && $__require('89')(function(iter) {
      P.all(iter)['catch'](function() {});
    })), PROMISE, {
      all: function all(iterable) {
        var C = getConstructor(this),
            capability = new PromiseCapability(C),
            resolve = capability.resolve,
            reject = capability.reject,
            values = [];
        var abrupt = perform(function() {
          forOf(iterable, false, values.push, values);
          var remaining = values.length,
              results = Array(remaining);
          if (remaining)
            $.each.call(values, function(promise, index) {
              var alreadyCalled = false;
              C.resolve(promise).then(function(value) {
                if (alreadyCalled)
                  return;
                alreadyCalled = true;
                results[index] = value;
                --remaining || resolve(results);
              }, reject);
            });
          else
            resolve(results);
        });
        if (abrupt)
          reject(abrupt.error);
        return capability.promise;
      },
      race: function race(iterable) {
        var C = getConstructor(this),
            capability = new PromiseCapability(C),
            reject = capability.reject;
        var abrupt = perform(function() {
          forOf(iterable, false, function(promise) {
            C.resolve(promise).then(capability.resolve, reject);
          });
        });
        if (abrupt)
          reject(abrupt.error);
        return capability.promise;
      }
    });
  })($__require('3a'));
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("8a", ["62", "18", "17", "87", "15"], true, function($__require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  $__require('62');
  $__require('18');
  $__require('17');
  $__require('87');
  module.exports = $__require('15').Promise;
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("6a", ["8a"], true, function($__require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  module.exports = {
    "default": $__require('8a'),
    __esModule: true
  };
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("27", ["58", "15", "5a"], true, function($__require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  var $export = $__require('58'),
      core = $__require('15'),
      fails = $__require('5a');
  module.exports = function(KEY, exec) {
    var fn = (core.Object || {})[KEY] || Object[KEY],
        exp = {};
    exp[KEY] = exec(fn);
    $export($export.S + $export.F * fails(function() {
      fn(1);
    }), 'Object', exp);
  };
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("8b", ["8c", "27"], true, function($__require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  var toObject = $__require('8c');
  $__require('27')('keys', function($keys) {
    return function keys(it) {
      return $keys(toObject(it));
    };
  });
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("8d", ["8b", "15"], true, function($__require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  $__require('8b');
  module.exports = $__require('15').Object.keys;
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("8e", ["8d"], true, function($__require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  module.exports = {
    "default": $__require('8d'),
    __esModule: true
  };
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("8f", ["90", "91", "92"], true, function($__require, exports, module) {
  "use strict";
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  Object.defineProperty(exports, "__esModule", {value: true});
  exports.NOT_ITERATOR_ERROR = undefined;
  exports.storeIO = storeIO;
  exports.runSaga = runSaga;
  var _utils = $__require('90');
  var _proc = $__require('91');
  var _proc2 = _interopRequireDefault(_proc);
  var _emitter = $__require('92');
  var _emitter2 = _interopRequireDefault(_emitter);
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {default: obj};
  }
  var NOT_ITERATOR_ERROR = exports.NOT_ITERATOR_ERROR = "runSaga must be called on an iterator";
  var IO = (0, _utils.sym)('IO');
  function storeIO(store) {
    (0, _utils.warnDeprecated)('storeIO is deprecated, to run Saga dynamically, use \'run\' method of the middleware');
    if (store[IO])
      return store[IO];
    var storeEmitter = (0, _emitter2.default)();
    var _dispatch = store.dispatch;
    store.dispatch = function(action) {
      var result = _dispatch(action);
      storeEmitter.emit(action);
      return result;
    };
    store[IO] = {
      subscribe: storeEmitter.subscribe,
      dispatch: store.dispatch,
      getState: store.getState
    };
    return store[IO];
  }
  function runSaga(iterator, _ref) {
    var subscribe = _ref.subscribe;
    var dispatch = _ref.dispatch;
    var getState = _ref.getState;
    var monitor = arguments.length <= 2 || arguments[2] === undefined ? _utils.noop : arguments[2];
    (0, _utils.check)(iterator, _utils.is.iterator, NOT_ITERATOR_ERROR);
    return (0, _proc2.default)(iterator, subscribe, dispatch, getState, monitor);
  }
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("93", ["90", "94", "95"], true, function($__require, exports, module) {
  "use strict";
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  Object.defineProperty(exports, "__esModule", {value: true});
  var _slicedToArray = function() {
    function sliceIterator(arr, i) {
      var _arr = [];
      var _n = true;
      var _d = false;
      var _e = undefined;
      try {
        for (var _i = arr[Symbol.iterator](),
            _s; !(_n = (_s = _i.next()).done); _n = true) {
          _arr.push(_s.value);
          if (i && _arr.length === i)
            break;
        }
      } catch (err) {
        _d = true;
        _e = err;
      } finally {
        try {
          if (!_n && _i["return"])
            _i["return"]();
        } finally {
          if (_d)
            throw _e;
        }
      }
      return _arr;
    }
    return function(arr, i) {
      if (Array.isArray(arr)) {
        return arr;
      } else if (Symbol.iterator in Object(arr)) {
        return sliceIterator(arr, i);
      } else {
        throw new TypeError("Invalid attempt to destructure non-iterable instance");
      }
    };
  }();
  exports.takeEvery = takeEvery;
  exports.takeLatest = takeLatest;
  var _utils = $__require('90');
  var _io = $__require('94');
  var _SagaCancellationException = $__require('95');
  var _SagaCancellationException2 = _interopRequireDefault(_SagaCancellationException);
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {default: obj};
  }
  var resume = function resume(fnOrValue, arg) {
    return _utils.is.func(fnOrValue) ? fnOrValue(arg) : fnOrValue;
  };
  var done = {done: true};
  function fsmIterator(fsm, nextState) {
    var name = arguments.length <= 2 || arguments[2] === undefined ? 'iterator' : arguments[2];
    var aborted = undefined,
        updateState = undefined;
    function next(arg, error) {
      if (aborted)
        return done;
      if (error) {
        aborted = true;
        if (!(error instanceof _SagaCancellationException2.default))
          throw error;
        return done;
      } else {
        if (updateState)
          updateState(arg);
        var _fsm$nextState = _slicedToArray(fsm[nextState], 3);
        var output = _fsm$nextState[0];
        var transition = _fsm$nextState[1];
        var _updateState = _fsm$nextState[2];
        updateState = _updateState;
        nextState = resume(transition, arg);
        return resume(output, arg);
      }
    }
    var iterator = {
      name: name,
      next: next,
      throw: function _throw(error) {
        return next(null, error);
      }
    };
    if (typeof Symbol !== 'undefined') {
      iterator[Symbol.iterator] = function() {
        return iterator;
      };
    }
    return iterator;
  }
  function takeEvery(pattern, worker) {
    for (var _len = arguments.length,
        args = Array(_len > 2 ? _len - 2 : 0),
        _key = 2; _key < _len; _key++) {
      args[_key - 2] = arguments[_key];
    }
    var yieldTake = {
      done: false,
      value: (0, _io.take)(pattern)
    };
    var yieldFork = function yieldFork(action) {
      return {
        done: false,
        value: _io.fork.apply(undefined, [worker].concat(args, [action]))
      };
    };
    return fsmIterator({
      'take': [yieldTake, 'fork'],
      'fork': [yieldFork, 'take']
    }, 'take', 'takeEvery(' + pattern + ', ' + worker.name + ')');
  }
  function takeLatest(pattern, worker) {
    for (var _len2 = arguments.length,
        args = Array(_len2 > 2 ? _len2 - 2 : 0),
        _key2 = 2; _key2 < _len2; _key2++) {
      args[_key2 - 2] = arguments[_key2];
    }
    var yieldTake = {
      done: false,
      value: (0, _io.take)(pattern)
    };
    var yieldFork = function yieldFork() {
      return {
        done: false,
        value: _io.fork.apply(undefined, [worker].concat(args, [currentAction]))
      };
    };
    var yieldCancel = function yieldCancel() {
      return {
        done: false,
        value: (0, _io.cancel)(currentTask)
      };
    };
    var forkOrCancel = function forkOrCancel() {
      return currentTask ? 'cancel' : 'fork';
    };
    var currentTask = undefined,
        currentAction = undefined;
    return fsmIterator({
      'take': [yieldTake, forkOrCancel, function(action) {
        return currentAction = action;
      }],
      'cancel': [yieldCancel, 'fork'],
      'fork': [yieldFork, 'take', function(task) {
        return currentTask = task;
      }]
    }, 'take', 'takeLatest(' + pattern + ', ' + worker.name + ')');
  }
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("92", ["90"], true, function($__require, exports, module) {
  "use strict";
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  Object.defineProperty(exports, "__esModule", {value: true});
  exports.default = emitter;
  var _utils = $__require('90');
  function emitter() {
    var cbs = [];
    function subscribe(cb) {
      cbs.push(cb);
      return function() {
        return (0, _utils.remove)(cbs, cb);
      };
    }
    function emit(item) {
      cbs.slice().forEach(function(cb) {
        return cb(item);
      });
    }
    return {
      subscribe: subscribe,
      emit: emit
    };
  }
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("96", ["90", "91", "92", "97", "95"], true, function($__require, exports, module) {
  "use strict";
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  Object.defineProperty(exports, "__esModule", {value: true});
  exports.GET_STATE_DEPRECATED_WARNING = exports.RUN_SAGA_DYNAMIC_ERROR = exports.sagaArgError = undefined;
  exports.default = sagaMiddlewareFactory;
  var _utils = $__require('90');
  var _proc = $__require('91');
  var _proc2 = _interopRequireDefault(_proc);
  var _emitter = $__require('92');
  var _emitter2 = _interopRequireDefault(_emitter);
  var _monitorActions = $__require('97');
  var _SagaCancellationException = $__require('95');
  var _SagaCancellationException2 = _interopRequireDefault(_SagaCancellationException);
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {default: obj};
  }
  var sagaArgError = exports.sagaArgError = function sagaArgError(fn, pos, saga) {
    return '\n  ' + fn + ' can only be called on Generator functions\n  Argument ' + saga + ' at position ' + pos + ' is not function!\n';
  };
  var RUN_SAGA_DYNAMIC_ERROR = exports.RUN_SAGA_DYNAMIC_ERROR = 'Before running a Saga dynamically using middleware.run, you must mount the Saga middleware on the Store using applyMiddleware';
  var GET_STATE_DEPRECATED_WARNING = exports.GET_STATE_DEPRECATED_WARNING = '\n  Using the \'getState\' param of Sagas to access the state is deprecated since 0.9.1\n  To access the Store\'s state use \'yield select()\' instead\n  For more infos see http://yelouafi.github.io/redux-saga/docs/api/index.html#selectselector-args\n';
  function sagaMiddlewareFactory() {
    for (var _len = arguments.length,
        sagas = Array(_len),
        _key = 0; _key < _len; _key++) {
      sagas[_key] = arguments[_key];
    }
    var runSagaDynamically = undefined;
    sagas.forEach(function(saga, idx) {
      return (0, _utils.check)(saga, _utils.is.func, sagaArgError('createSagaMiddleware', idx, saga));
    });
    function sagaMiddleware(_ref) {
      var getState = _ref.getState;
      var dispatch = _ref.dispatch;
      var sagaEmitter = (0, _emitter2.default)();
      var monitor = _utils.isDev ? function(action) {
        return (0, _utils.asap)(function() {
          return dispatch(action);
        });
      } : undefined;
      var getStateDeprecated = function getStateDeprecated() {
        (0, _utils.warnDeprecated)(GET_STATE_DEPRECATED_WARNING);
        return getState();
      };
      function runSaga(saga) {
        for (var _len2 = arguments.length,
            args = Array(_len2 > 1 ? _len2 - 1 : 0),
            _key2 = 1; _key2 < _len2; _key2++) {
          args[_key2 - 1] = arguments[_key2];
        }
        return (0, _proc2.default)(saga.apply(undefined, [getStateDeprecated].concat(args)), sagaEmitter.subscribe, dispatch, getState, monitor, 0, saga.name);
      }
      runSagaDynamically = runSaga;
      sagas.forEach(runSaga);
      return function(next) {
        return function(action) {
          var result = next(action);
          if (!action[_monitorActions.MONITOR_ACTION])
            sagaEmitter.emit(action);
          return result;
        };
      };
    }
    sagaMiddleware.run = function(saga) {
      for (var _len3 = arguments.length,
          args = Array(_len3 > 1 ? _len3 - 1 : 0),
          _key3 = 1; _key3 < _len3; _key3++) {
        args[_key3 - 1] = arguments[_key3];
      }
      if (!runSagaDynamically) {
        throw new Error(RUN_SAGA_DYNAMIC_ERROR);
      }
      (0, _utils.check)(saga, _utils.is.func, sagaArgError('sagaMiddleware.run', 0, saga));
      var task = runSagaDynamically.apply(undefined, [saga].concat(args));
      task.done.catch(function(err) {
        if (!(err instanceof _SagaCancellationException2.default))
          throw err;
      });
      return task;
    };
    return sagaMiddleware;
  }
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("6e", ["94"], true, function($__require, exports, module) {
  "use strict";
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  Object.defineProperty(exports, "__esModule", {value: true});
  exports.select = exports.cancel = exports.join = exports.fork = exports.cps = exports.apply = exports.call = exports.race = exports.put = exports.take = undefined;
  var _io = $__require('94');
  exports.take = _io.take;
  exports.put = _io.put;
  exports.race = _io.race;
  exports.call = _io.call;
  exports.apply = _io.apply;
  exports.cps = _io.cps;
  exports.fork = _io.fork;
  exports.join = _io.join;
  exports.cancel = _io.cancel;
  exports.select = _io.select;
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("94", ["90"], true, function($__require, exports, module) {
  "use strict";
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  Object.defineProperty(exports, "__esModule", {value: true});
  exports.asEffect = exports.SELECT_ARG_ERROR = exports.INVALID_PATTERN = exports.CANCEL_ARG_ERROR = exports.JOIN_ARG_ERROR = exports.FORK_ARG_ERROR = exports.CALL_FUNCTION_ARG_ERROR = undefined;
  var _slicedToArray = function() {
    function sliceIterator(arr, i) {
      var _arr = [];
      var _n = true;
      var _d = false;
      var _e = undefined;
      try {
        for (var _i = arr[Symbol.iterator](),
            _s; !(_n = (_s = _i.next()).done); _n = true) {
          _arr.push(_s.value);
          if (i && _arr.length === i)
            break;
        }
      } catch (err) {
        _d = true;
        _e = err;
      } finally {
        try {
          if (!_n && _i["return"])
            _i["return"]();
        } finally {
          if (_d)
            throw _e;
        }
      }
      return _arr;
    }
    return function(arr, i) {
      if (Array.isArray(arr)) {
        return arr;
      } else if (Symbol.iterator in Object(arr)) {
        return sliceIterator(arr, i);
      } else {
        throw new TypeError("Invalid attempt to destructure non-iterable instance");
      }
    };
  }();
  exports.matcher = matcher;
  exports.take = take;
  exports.put = put;
  exports.race = race;
  exports.call = call;
  exports.apply = apply;
  exports.cps = cps;
  exports.fork = fork;
  exports.join = join;
  exports.cancel = cancel;
  exports.select = select;
  var _utils = $__require('90');
  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }
    return obj;
  }
  var CALL_FUNCTION_ARG_ERROR = exports.CALL_FUNCTION_ARG_ERROR = "call/cps/fork first argument must be a function, an array [context, function] or an object {context, fn}";
  var FORK_ARG_ERROR = exports.FORK_ARG_ERROR = "fork first argument must be a generator function or an iterator";
  var JOIN_ARG_ERROR = exports.JOIN_ARG_ERROR = "join argument must be a valid task (a result of a fork)";
  var CANCEL_ARG_ERROR = exports.CANCEL_ARG_ERROR = "cancel argument must be a valid task (a result of a fork)";
  var INVALID_PATTERN = exports.INVALID_PATTERN = "Invalid pattern passed to `take` (HINT: check if you didn't mispell a constant)";
  var SELECT_ARG_ERROR = exports.SELECT_ARG_ERROR = "select first argument must be a function";
  var IO = (0, _utils.sym)('IO');
  var TAKE = 'TAKE';
  var PUT = 'PUT';
  var RACE = 'RACE';
  var CALL = 'CALL';
  var CPS = 'CPS';
  var FORK = 'FORK';
  var JOIN = 'JOIN';
  var CANCEL = 'CANCEL';
  var SELECT = 'SELECT';
  var effect = function effect(type, payload) {
    var _ref;
    return _ref = {}, _defineProperty(_ref, IO, true), _defineProperty(_ref, type, payload), _ref;
  };
  var matchers = {
    wildcard: function wildcard() {
      return _utils.kTrue;
    },
    default: function _default(pattern) {
      return function(input) {
        return input.type === pattern;
      };
    },
    array: function array(patterns) {
      return function(input) {
        return patterns.some(function(p) {
          return p === input.type;
        });
      };
    },
    predicate: function predicate(_predicate) {
      return function(input) {
        return _predicate(input);
      };
    }
  };
  function matcher(pattern) {
    return (pattern === '*' ? matchers.wildcard : _utils.is.array(pattern) ? matchers.array : _utils.is.func(pattern) ? matchers.predicate : matchers.default)(pattern);
  }
  function take(pattern) {
    if (arguments.length > 0 && _utils.is.undef(pattern)) {
      throw new Error(INVALID_PATTERN);
    }
    return effect(TAKE, _utils.is.undef(pattern) ? '*' : pattern);
  }
  function put(action) {
    return effect(PUT, action);
  }
  function race(effects) {
    return effect(RACE, effects);
  }
  function getFnCallDesc(fn, args) {
    (0, _utils.check)(fn, _utils.is.notUndef, CALL_FUNCTION_ARG_ERROR);
    var context = null;
    if (_utils.is.array(fn)) {
      var _fn = fn;
      var _fn2 = _slicedToArray(_fn, 2);
      context = _fn2[0];
      fn = _fn2[1];
    } else if (fn.fn) {
      var _fn3 = fn;
      context = _fn3.context;
      fn = _fn3.fn;
    }
    (0, _utils.check)(fn, _utils.is.func, CALL_FUNCTION_ARG_ERROR);
    return {
      context: context,
      fn: fn,
      args: args
    };
  }
  function call(fn) {
    for (var _len = arguments.length,
        args = Array(_len > 1 ? _len - 1 : 0),
        _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }
    return effect(CALL, getFnCallDesc(fn, args));
  }
  function apply(context, fn) {
    var args = arguments.length <= 2 || arguments[2] === undefined ? [] : arguments[2];
    return effect(CALL, getFnCallDesc({
      context: context,
      fn: fn
    }, args));
  }
  function cps(fn) {
    for (var _len2 = arguments.length,
        args = Array(_len2 > 1 ? _len2 - 1 : 0),
        _key2 = 1; _key2 < _len2; _key2++) {
      args[_key2 - 1] = arguments[_key2];
    }
    return effect(CPS, getFnCallDesc(fn, args));
  }
  function fork(fn) {
    for (var _len3 = arguments.length,
        args = Array(_len3 > 1 ? _len3 - 1 : 0),
        _key3 = 1; _key3 < _len3; _key3++) {
      args[_key3 - 1] = arguments[_key3];
    }
    return effect(FORK, getFnCallDesc(fn, args));
  }
  var isForkedTask = function isForkedTask(task) {
    return task[_utils.TASK];
  };
  function join(taskDesc) {
    if (!isForkedTask(taskDesc))
      throw new Error(JOIN_ARG_ERROR);
    return effect(JOIN, taskDesc);
  }
  function cancel(taskDesc) {
    if (!isForkedTask(taskDesc))
      throw new Error(CANCEL_ARG_ERROR);
    return effect(CANCEL, taskDesc);
  }
  function select(selector) {
    for (var _len4 = arguments.length,
        args = Array(_len4 > 1 ? _len4 - 1 : 0),
        _key4 = 1; _key4 < _len4; _key4++) {
      args[_key4 - 1] = arguments[_key4];
    }
    if (arguments.length === 0) {
      selector = _utils.ident;
    } else {
      (0, _utils.check)(selector, _utils.is.func, SELECT_ARG_ERROR);
    }
    return effect(SELECT, {
      selector: selector,
      args: args
    });
  }
  var asEffect = exports.asEffect = {
    take: function take(effect) {
      return effect && effect[IO] && effect[TAKE];
    },
    put: function put(effect) {
      return effect && effect[IO] && effect[PUT];
    },
    race: function race(effect) {
      return effect && effect[IO] && effect[RACE];
    },
    call: function call(effect) {
      return effect && effect[IO] && effect[CALL];
    },
    cps: function cps(effect) {
      return effect && effect[IO] && effect[CPS];
    },
    fork: function fork(effect) {
      return effect && effect[IO] && effect[FORK];
    },
    join: function join(effect) {
      return effect && effect[IO] && effect[JOIN];
    },
    cancel: function cancel(effect) {
      return effect && effect[IO] && effect[CANCEL];
    },
    select: function select(effect) {
      return effect && effect[IO] && effect[SELECT];
    }
  };
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("95", [], true, function($__require, exports, module) {
  "use strict";
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  Object.defineProperty(exports, "__esModule", {value: true});
  exports.default = SagaCancellationException;
  function SagaCancellationException(type, saga, origin) {
    var message = 'SagaCancellationException; type: ' + type + ', saga: ' + saga + ', origin: ' + origin;
    this.name = 'SagaCancellationException';
    this.message = message;
    this.type = type;
    this.saga = saga;
    this.origin = origin;
    this.stack = new Error().stack;
  }
  SagaCancellationException.prototype = Object.create(Error.prototype);
  SagaCancellationException.prototype.constructor = SagaCancellationException;
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("91", ["90", "94", "97", "95"], true, function($__require, exports, module) {
  "use strict";
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  Object.defineProperty(exports, "__esModule", {value: true});
  exports.MANUAL_CANCEL = exports.RACE_AUTO_CANCEL = exports.PARALLEL_AUTO_CANCEL = exports.CANCEL = exports.undefindInputError = exports.NOT_ITERATOR_ERROR = undefined;
  exports.default = proc;
  var _utils = $__require('90');
  var _io = $__require('94');
  var _monitorActions = $__require('97');
  var monitorActions = _interopRequireWildcard(_monitorActions);
  var _SagaCancellationException = $__require('95');
  var _SagaCancellationException2 = _interopRequireDefault(_SagaCancellationException);
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {default: obj};
  }
  function _interopRequireWildcard(obj) {
    if (obj && obj.__esModule) {
      return obj;
    } else {
      var newObj = {};
      if (obj != null) {
        for (var key in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, key))
            newObj[key] = obj[key];
        }
      }
      newObj.default = obj;
      return newObj;
    }
  }
  function _toConsumableArray(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0,
          arr2 = Array(arr.length); i < arr.length; i++) {
        arr2[i] = arr[i];
      }
      return arr2;
    } else {
      return Array.from(arr);
    }
  }
  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }
    return obj;
  }
  var NOT_ITERATOR_ERROR = exports.NOT_ITERATOR_ERROR = 'proc first argument (Saga function result) must be an iterator';
  var undefindInputError = exports.undefindInputError = function undefindInputError(name) {
    return '\n  ' + name + ' saga was provided with an undefined input action\n  Hints :\n  - check that your Action Creator returns a non undefined value\n  - if the Saga was started using runSaga, check that your subscribe source provides the action to its listeners\n';
  };
  var CANCEL = exports.CANCEL = (0, _utils.sym)('@@redux-saga/cancelPromise');
  var PARALLEL_AUTO_CANCEL = exports.PARALLEL_AUTO_CANCEL = 'PARALLEL_AUTO_CANCEL';
  var RACE_AUTO_CANCEL = exports.RACE_AUTO_CANCEL = 'RACE_AUTO_CANCEL';
  var MANUAL_CANCEL = exports.MANUAL_CANCEL = 'MANUAL_CANCEL';
  var nextEffectId = (0, _utils.autoInc)();
  function proc(iterator) {
    var subscribe = arguments.length <= 1 || arguments[1] === undefined ? function() {
      return _utils.noop;
    } : arguments[1];
    var dispatch = arguments.length <= 2 || arguments[2] === undefined ? _utils.noop : arguments[2];
    var getState = arguments.length <= 3 || arguments[3] === undefined ? _utils.noop : arguments[3];
    var monitor = arguments.length <= 4 || arguments[4] === undefined ? _utils.noop : arguments[4];
    var parentEffectId = arguments.length <= 5 || arguments[5] === undefined ? 0 : arguments[5];
    var name = arguments.length <= 6 || arguments[6] === undefined ? 'anonymous' : arguments[6];
    var forked = arguments[7];
    (0, _utils.check)(iterator, _utils.is.iterator, NOT_ITERATOR_ERROR);
    var UNDEFINED_INPUT_ERROR = undefindInputError(name);
    var deferredInputs = [];
    var deferredEnd = (0, _utils.deferred)();
    var unsubscribe = subscribe(function(input) {
      if (input === undefined)
        throw UNDEFINED_INPUT_ERROR;
      for (var i = 0; i < deferredInputs.length; i++) {
        var def = deferredInputs[i];
        if (def.match(input)) {
          deferredInputs = [];
          def.resolve(input);
        }
      }
    });
    next.cancel = _utils.noop;
    var task = newTask(parentEffectId, name, iterator, deferredEnd.promise, forked);
    task.done[CANCEL] = function(_ref) {
      var type = _ref.type;
      var origin = _ref.origin;
      next.cancel(new _SagaCancellationException2.default(type, name, origin));
    };
    iterator._isRunning = true;
    next();
    return task;
    function logError(level, message, error) {
      if (typeof window === 'undefined') {
        console.log('redux-saga ' + level + ': ' + message + '\n' + error.stack);
      } else {
        console[level].call(console, message, error);
      }
    }
    function next(error, arg) {
      if (!iterator._isRunning)
        throw new Error('Trying to resume an already finished generator');
      try {
        var result = error ? iterator.throw(error) : iterator.next(arg);
        if (!result.done) {
          runEffect(result.value, parentEffectId, '', next);
        } else {
          end(result.value);
        }
      } catch (error) {
        end(error, true);
        if (error instanceof _SagaCancellationException2.default) {
          if (_utils.isDev) {
            logError('warn', name + ': uncaught', error);
          }
        } else {
          logError('error', name + ': uncaught', error);
        }
      }
    }
    function end(result, isError) {
      iterator._isRunning = false;
      if (!isError) {
        iterator._result = result;
        deferredEnd.resolve(result);
      } else {
        iterator._error = result;
        deferredEnd.reject(result);
      }
      unsubscribe();
    }
    function runEffect(effect, parentEffectId) {
      var label = arguments.length <= 2 || arguments[2] === undefined ? '' : arguments[2];
      var cb = arguments[3];
      var effectId = nextEffectId();
      monitor(monitorActions.effectTriggered(effectId, parentEffectId, label, effect));
      var effectSettled = undefined;
      function currCb(err, res) {
        if (effectSettled)
          return;
        effectSettled = true;
        cb.cancel = _utils.noop;
        err ? monitor(monitorActions.effectRejected(effectId, err)) : monitor(monitorActions.effectResolved(effectId, res));
        cb(err, res);
      }
      currCb.cancel = _utils.noop;
      cb.cancel = function(cancelError) {
        if (effectSettled)
          return;
        effectSettled = true;
        try {
          currCb.cancel(cancelError);
        } catch (err) {
          void 0;
        }
        currCb.cancel = _utils.noop;
        cb(cancelError);
        monitor(monitorActions.effectRejected(effectId, cancelError));
      };
      var data = undefined;
      return (_utils.is.promise(effect) ? resolvePromise(effect, currCb) : _utils.is.iterator(effect) ? resolveIterator(effect, effectId, name, currCb) : _utils.is.array(effect) ? runParallelEffect(effect, effectId, currCb) : _utils.is.notUndef(data = _io.asEffect.take(effect)) ? runTakeEffect(data, currCb) : _utils.is.notUndef(data = _io.asEffect.put(effect)) ? runPutEffect(data, currCb) : _utils.is.notUndef(data = _io.asEffect.race(effect)) ? runRaceEffect(data, effectId, currCb) : _utils.is.notUndef(data = _io.asEffect.call(effect)) ? runCallEffect(data, effectId, currCb) : _utils.is.notUndef(data = _io.asEffect.cps(effect)) ? runCPSEffect(data, currCb) : _utils.is.notUndef(data = _io.asEffect.fork(effect)) ? runForkEffect(data, effectId, currCb) : _utils.is.notUndef(data = _io.asEffect.join(effect)) ? runJoinEffect(data, currCb) : _utils.is.notUndef(data = _io.asEffect.cancel(effect)) ? runCancelEffect(data, currCb) : _utils.is.notUndef(data = _io.asEffect.select(effect)) ? runSelectEffect(data, currCb) : currCb(null, effect));
    }
    function resolvePromise(promise, cb) {
      var cancelPromise = promise[CANCEL];
      if (typeof cancelPromise === 'function') {
        cb.cancel = cancelPromise;
      }
      promise.then(function(result) {
        return cb(null, result);
      }, function(error) {
        return cb(error);
      });
    }
    function resolveIterator(iterator, effectId, name, cb) {
      resolvePromise(proc(iterator, subscribe, dispatch, getState, monitor, effectId, name).done, cb);
    }
    function runTakeEffect(pattern, cb) {
      var def = {
        match: (0, _io.matcher)(pattern),
        pattern: pattern,
        resolve: function resolve(input) {
          return cb(null, input);
        }
      };
      deferredInputs.push(def);
      cb.cancel = function() {
        return (0, _utils.remove)(deferredInputs, def);
      };
    }
    function runPutEffect(action, cb) {
      (0, _utils.asap)(function() {
        return cb(null, dispatch(action));
      });
    }
    function runCallEffect(_ref2, effectId, cb) {
      var context = _ref2.context;
      var fn = _ref2.fn;
      var args = _ref2.args;
      var result = undefined;
      try {
        result = fn.apply(context, args);
      } catch (error) {
        return cb(error);
      }
      return _utils.is.promise(result) ? resolvePromise(result, cb) : _utils.is.iterator(result) ? resolveIterator(result, effectId, fn.name, cb) : cb(null, result);
    }
    function runCPSEffect(_ref3, cb) {
      var context = _ref3.context;
      var fn = _ref3.fn;
      var args = _ref3.args;
      try {
        fn.apply(context, args.concat(cb));
      } catch (error) {
        return cb(error);
      }
    }
    function runForkEffect(_ref4, effectId, cb) {
      var context = _ref4.context;
      var fn = _ref4.fn;
      var args = _ref4.args;
      var result = undefined,
          error = undefined,
          _iterator = undefined;
      try {
        result = fn.apply(context, args);
      } catch (err) {
        error = err;
      }
      if (_utils.is.iterator(result)) {
        _iterator = result;
      } else {
        _iterator = (error ? regeneratorRuntime.mark(function _callee() {
          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  throw error;
                case 1:
                case 'end':
                  return _context.stop();
              }
            }
          }, _callee, this);
        }) : regeneratorRuntime.mark(function _callee2() {
          return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  _context2.next = 2;
                  return result;
                case 2:
                  return _context2.abrupt('return', _context2.sent);
                case 3:
                case 'end':
                  return _context2.stop();
              }
            }
          }, _callee2, this);
        }))();
      }
      cb(null, proc(_iterator, subscribe, dispatch, getState, monitor, effectId, fn.name, true));
    }
    function runJoinEffect(task, cb) {
      resolvePromise(task.done, cb);
    }
    function runCancelEffect(task, cb) {
      task.done[CANCEL](new _SagaCancellationException2.default(MANUAL_CANCEL, name, name));
      cb();
    }
    function runParallelEffect(effects, effectId, cb) {
      if (!effects.length) {
        cb(null, []);
        return;
      }
      var completedCount = 0;
      var completed = undefined;
      var results = Array(effects.length);
      function checkEffectEnd() {
        if (completedCount === results.length) {
          completed = true;
          cb(null, results);
        }
      }
      var childCbs = effects.map(function(eff, idx) {
        var chCbAtIdx = function chCbAtIdx(err, res) {
          if (completed)
            return;
          if (err) {
            try {
              cb.cancel(new _SagaCancellationException2.default(PARALLEL_AUTO_CANCEL, name, name));
            } catch (err) {
              void 0;
            }
            cb(err);
          } else {
            results[idx] = res;
            completedCount++;
            checkEffectEnd();
          }
        };
        chCbAtIdx.cancel = _utils.noop;
        return chCbAtIdx;
      });
      cb.cancel = function(cancelError) {
        if (!completed) {
          completed = true;
          childCbs.forEach(function(chCb) {
            return chCb.cancel(cancelError);
          });
        }
      };
      effects.forEach(function(eff, idx) {
        return runEffect(eff, effectId, idx, childCbs[idx]);
      });
    }
    function runRaceEffect(effects, effectId, cb) {
      var completed = undefined;
      var keys = Object.keys(effects);
      var childCbs = {};
      keys.forEach(function(key) {
        var chCbAtKey = function chCbAtKey(err, res) {
          if (completed)
            return;
          if (err) {
            try {
              cb.cancel(new _SagaCancellationException2.default(RACE_AUTO_CANCEL, name, name));
            } catch (err) {
              void 0;
            }
            cb(_defineProperty({}, key, err));
          } else {
            try {
              cb.cancel(new _SagaCancellationException2.default(RACE_AUTO_CANCEL, name, name));
            } catch (err) {
              void 0;
            }
            completed = true;
            cb(null, _defineProperty({}, key, res));
          }
        };
        chCbAtKey.cancel = _utils.noop;
        childCbs[key] = chCbAtKey;
      });
      cb.cancel = function(cancelError) {
        if (!completed) {
          completed = true;
          keys.forEach(function(key) {
            return childCbs[key].cancel(cancelError);
          });
        }
      };
      keys.forEach(function(key) {
        return runEffect(effects[key], effectId, key, childCbs[key]);
      });
    }
    function runSelectEffect(_ref5, cb) {
      var selector = _ref5.selector;
      var args = _ref5.args;
      try {
        var state = selector.apply(undefined, [getState()].concat(_toConsumableArray(args)));
        cb(null, state);
      } catch (error) {
        cb(error);
      }
    }
    function newTask(id, name, iterator, done, forked) {
      var _ref6;
      return _ref6 = {}, _defineProperty(_ref6, _utils.TASK, true), _defineProperty(_ref6, 'id', id), _defineProperty(_ref6, 'name', name), _defineProperty(_ref6, 'done', done), _defineProperty(_ref6, 'forked', forked), _defineProperty(_ref6, 'cancel', function cancel(error) {
        if (!(error instanceof _SagaCancellationException2.default)) {
          error = new _SagaCancellationException2.default(MANUAL_CANCEL, name, error);
        }
        done[CANCEL](error);
      }), _defineProperty(_ref6, 'isRunning', function isRunning() {
        return iterator._isRunning;
      }), _defineProperty(_ref6, 'result', function result() {
        return iterator._result;
      }), _defineProperty(_ref6, 'error', function error() {
        return iterator._error;
      }), _ref6;
    }
  }
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("98", [], true, function($__require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  var process = module.exports = {};
  var queue = [];
  var draining = false;
  var currentQueue;
  var queueIndex = -1;
  function cleanUpNextTick() {
    draining = false;
    if (currentQueue.length) {
      queue = currentQueue.concat(queue);
    } else {
      queueIndex = -1;
    }
    if (queue.length) {
      drainQueue();
    }
  }
  function drainQueue() {
    if (draining) {
      return;
    }
    var timeout = setTimeout(cleanUpNextTick);
    draining = true;
    var len = queue.length;
    while (len) {
      currentQueue = queue;
      queue = [];
      while (++queueIndex < len) {
        if (currentQueue) {
          currentQueue[queueIndex].run();
        }
      }
      queueIndex = -1;
      len = queue.length;
    }
    currentQueue = null;
    draining = false;
    clearTimeout(timeout);
  }
  process.nextTick = function(fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
      for (var i = 1; i < arguments.length; i++) {
        args[i - 1] = arguments[i];
      }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
      setTimeout(drainQueue, 0);
    }
  };
  function Item(fun, array) {
    this.fun = fun;
    this.array = array;
  }
  Item.prototype.run = function() {
    this.fun.apply(null, this.array);
  };
  process.title = 'browser';
  process.browser = true;
  process.env = {};
  process.argv = [];
  process.version = '';
  process.versions = {};
  function noop() {}
  process.on = noop;
  process.addListener = noop;
  process.once = noop;
  process.off = noop;
  process.removeListener = noop;
  process.removeAllListeners = noop;
  process.emit = noop;
  process.binding = function(name) {
    throw new Error('process.binding is not supported');
  };
  process.cwd = function() {
    return '/';
  };
  process.chdir = function(dir) {
    throw new Error('process.chdir is not supported');
  };
  process.umask = function() {
    return 0;
  };
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("99", ["98"], true, function($__require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  module.exports = $__require('98');
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("9a", ["99"], true, function($__require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  module.exports = $__System._nodeRequire ? process : $__require('99');
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("3a", ["9a"], true, function($__require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  module.exports = $__require('9a');
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("90", ["3a"], true, function($__require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  (function(process) {
    'use strict';
    Object.defineProperty(exports, "__esModule", {value: true});
    var _extends = Object.assign || function(target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i];
        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }
      return target;
    };
    exports.ident = ident;
    exports.check = check;
    exports.remove = remove;
    exports.deferred = deferred;
    exports.arrayOfDeffered = arrayOfDeffered;
    exports.autoInc = autoInc;
    exports.asap = asap;
    exports.warnDeprecated = warnDeprecated;
    var sym = exports.sym = function sym(id) {
      return '@@redux-saga/' + id;
    };
    var TASK = exports.TASK = sym('TASK');
    var kTrue = exports.kTrue = function kTrue() {
      return true;
    };
    var noop = exports.noop = function noop() {};
    function ident(v) {
      return v;
    }
    var isDev = exports.isDev = typeof process !== 'undefined' && process.env && process.env.NODE_ENV === 'development';
    function check(value, predicate, error) {
      if (!predicate(value))
        throw new Error(error);
    }
    var is = exports.is = {
      undef: function undef(v) {
        return v === null || v === undefined;
      },
      notUndef: function notUndef(v) {
        return v !== null && v !== undefined;
      },
      func: function func(f) {
        return typeof f === 'function';
      },
      array: Array.isArray,
      promise: function promise(p) {
        return p && is.func(p.then);
      },
      iterator: function iterator(it) {
        return it && is.func(it.next) && is.func(it.throw);
      },
      task: function task(it) {
        return it && it[TASK];
      }
    };
    function remove(array, item) {
      var index = array.indexOf(item);
      if (index >= 0)
        array.splice(index, 1);
    }
    function deferred() {
      var props = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
      var def = _extends({}, props);
      var promise = new Promise(function(resolve, reject) {
        def.resolve = resolve;
        def.reject = reject;
      });
      def.promise = promise;
      return def;
    }
    function arrayOfDeffered(length) {
      var arr = [];
      for (var i = 0; i < length; i++) {
        arr.push(deferred());
      }
      return arr;
    }
    function autoInc() {
      var seed = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];
      return function() {
        return ++seed;
      };
    }
    function asap(action) {
      return Promise.resolve(1).then(function() {
        return action();
      });
    }
    function warnDeprecated(msg) {
      if (isDev) {
        console.warn('DEPRECATION WARNING', msg);
      }
    }
  })($__require('3a'));
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("9b", ["90"], true, function($__require, exports, module) {
  "use strict";
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  Object.defineProperty(exports, "__esModule", {value: true});
  exports.createMockTask = createMockTask;
  var _utils = $__require('90');
  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }
    return obj;
  }
  function createMockTask() {
    var _ref;
    var running = true;
    var _result = undefined,
        _error = undefined;
    return _ref = {}, _defineProperty(_ref, _utils.TASK, true), _defineProperty(_ref, 'isRunning', function isRunning() {
      return running;
    }), _defineProperty(_ref, 'result', function result() {
      return _result;
    }), _defineProperty(_ref, 'error', function error() {
      return _error;
    }), _defineProperty(_ref, 'setRunning', function setRunning(b) {
      return running = b;
    }), _defineProperty(_ref, 'setResult', function setResult(r) {
      return _result = r;
    }), _defineProperty(_ref, 'setError', function setError(e) {
      return _error = e;
    }), _ref;
  }
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("97", [], true, function($__require, exports, module) {
  "use strict";
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  Object.defineProperty(exports, "__esModule", {value: true});
  exports.effectTriggered = effectTriggered;
  exports.effectResolved = effectResolved;
  exports.effectRejected = effectRejected;
  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }
    return obj;
  }
  var MONITOR_ACTION = exports.MONITOR_ACTION = 'MONITOR_ACTION';
  var EFFECT_TRIGGERED = exports.EFFECT_TRIGGERED = 'EFFECT_TRIGGERED';
  var EFFECT_RESOLVED = exports.EFFECT_RESOLVED = 'EFFECT_RESOLVED';
  var EFFECT_REJECTED = exports.EFFECT_REJECTED = 'EFFECT_REJECTED';
  function effectTriggered(effectId, parentEffectId, label, effect) {
    var _ref;
    return _ref = {}, _defineProperty(_ref, MONITOR_ACTION, true), _defineProperty(_ref, 'type', EFFECT_TRIGGERED), _defineProperty(_ref, 'effectId', effectId), _defineProperty(_ref, 'parentEffectId', parentEffectId), _defineProperty(_ref, 'label', label), _defineProperty(_ref, 'effect', effect), _ref;
  }
  function effectResolved(effectId, result) {
    var _ref2;
    return _ref2 = {}, _defineProperty(_ref2, MONITOR_ACTION, true), _defineProperty(_ref2, 'type', EFFECT_RESOLVED), _defineProperty(_ref2, 'effectId', effectId), _defineProperty(_ref2, 'result', result), _ref2;
  }
  function effectRejected(effectId, error) {
    var _ref3;
    return _ref3 = {}, _defineProperty(_ref3, MONITOR_ACTION, true), _defineProperty(_ref3, 'type', EFFECT_REJECTED), _defineProperty(_ref3, 'effectId', effectId), _defineProperty(_ref3, 'error', error), _ref3;
  }
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("9c", ["90", "94", "91", "9b", "97"], true, function($__require, exports, module) {
  "use strict";
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  Object.defineProperty(exports, "__esModule", {value: true});
  exports.monitorActions = exports.createMockTask = exports.MANUAL_CANCEL = exports.PARALLEL_AUTO_CANCEL = exports.RACE_AUTO_CANCEL = exports.CANCEL = exports.asap = exports.arrayOfDeffered = exports.deferred = exports.asEffect = exports.is = exports.noop = exports.TASK = undefined;
  var _utils = $__require('90');
  var _io = $__require('94');
  var _proc = $__require('91');
  var _testUtils = $__require('9b');
  var _monitorActions = $__require('97');
  var monitorActions = _interopRequireWildcard(_monitorActions);
  function _interopRequireWildcard(obj) {
    if (obj && obj.__esModule) {
      return obj;
    } else {
      var newObj = {};
      if (obj != null) {
        for (var key in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, key))
            newObj[key] = obj[key];
        }
      }
      newObj.default = obj;
      return newObj;
    }
  }
  exports.TASK = _utils.TASK;
  exports.noop = _utils.noop;
  exports.is = _utils.is;
  exports.asEffect = _io.asEffect;
  exports.deferred = _utils.deferred;
  exports.arrayOfDeffered = _utils.arrayOfDeffered;
  exports.asap = _utils.asap;
  exports.CANCEL = _proc.CANCEL;
  exports.RACE_AUTO_CANCEL = _proc.RACE_AUTO_CANCEL;
  exports.PARALLEL_AUTO_CANCEL = _proc.PARALLEL_AUTO_CANCEL;
  exports.MANUAL_CANCEL = _proc.MANUAL_CANCEL;
  exports.createMockTask = _testUtils.createMockTask;
  exports.monitorActions = monitorActions;
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("9d", ["8f", "93", "96", "95", "6e", "9c"], true, function($__require, exports, module) {
  "use strict";
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  Object.defineProperty(exports, "__esModule", {value: true});
  exports.utils = exports.effects = exports.takeLatest = exports.takeEvery = exports.storeIO = exports.runSaga = exports.isCancelError = exports.SagaCancellationException = undefined;
  var _runSaga = $__require('8f');
  Object.defineProperty(exports, 'runSaga', {
    enumerable: true,
    get: function get() {
      return _runSaga.runSaga;
    }
  });
  Object.defineProperty(exports, 'storeIO', {
    enumerable: true,
    get: function get() {
      return _runSaga.storeIO;
    }
  });
  var _sagaHelpers = $__require('93');
  Object.defineProperty(exports, 'takeEvery', {
    enumerable: true,
    get: function get() {
      return _sagaHelpers.takeEvery;
    }
  });
  Object.defineProperty(exports, 'takeLatest', {
    enumerable: true,
    get: function get() {
      return _sagaHelpers.takeLatest;
    }
  });
  var _middleware = $__require('96');
  var _middleware2 = _interopRequireDefault(_middleware);
  var _SagaCancellationException2 = $__require('95');
  var _SagaCancellationException3 = _interopRequireDefault(_SagaCancellationException2);
  var _effects = $__require('6e');
  var effects = _interopRequireWildcard(_effects);
  var _utils = $__require('9c');
  var utils = _interopRequireWildcard(_utils);
  function _interopRequireWildcard(obj) {
    if (obj && obj.__esModule) {
      return obj;
    } else {
      var newObj = {};
      if (obj != null) {
        for (var key in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, key))
            newObj[key] = obj[key];
        }
      }
      newObj.default = obj;
      return newObj;
    }
  }
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {default: obj};
  }
  exports.default = _middleware2.default;
  var SagaCancellationException = exports.SagaCancellationException = _SagaCancellationException3.default;
  var isCancelError = exports.isCancelError = function isCancelError(error) {
    return error instanceof SagaCancellationException;
  };
  exports.effects = effects;
  exports.utils = utils;
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("9e", ["9d"], true, function($__require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  module.exports = $__require('9d');
  global.define = __define;
  return module.exports;
});

$__System.register('d', ['6a', '8e', '9e'], function (_export) {
  var _Promise, _Object$keys, utils, CANCEL, cancellablePromise, delayedResolve, domainRegex, portRegex, endpointFromWindowLocation, fixedFromCharCode, halignClasses, valignClasses, safeLookup, halignClassLookup, valignClassLookup;

  // ---- shallowEqual

  function shallowEqual(objA, objB) {
    if (objA === objB) {
      return true;
    }

    if (typeof objA !== 'object' || objA === null || typeof objB !== 'object' || objB === null) {
      return false;
    }

    var keysA = _Object$keys(objA);
    var keysB = _Object$keys(objB);

    if (keysA.length !== keysB.length) {
      return false;
    }

    // Test for A's keys different from B.
    var bHasOwnProperty = Object.prototype.hasOwnProperty.bind(objB);
    for (var i = 0; i < keysA.length; i++) {
      if (!bHasOwnProperty(keysA[i]) || objA[keysA[i]] !== objB[keysA[i]]) {
        return false;
      }
    }

    return true;
  }

  return {
    setters: [function (_a) {
      _Promise = _a['default'];
    }, function (_e) {
      _Object$keys = _e['default'];
    }, function (_e2) {
      utils = _e2.utils;
    }],
    execute: function () {
      /* eslint no-param-reassign: [2, {"props": false }] */

      // --- Saga stuff: cancellable promise & delayed resolve.
      'use strict';

      _export('shallowEqual', shallowEqual);

      CANCEL = utils.CANCEL;

      cancellablePromise = function cancellablePromise(p, doCancel) {
        p[CANCEL] = doCancel;
        return p;
      };

      _export('cancellablePromise', cancellablePromise);

      delayedResolve = function delayedResolve(ms) {
        return new _Promise(function (resolve) {
          return setTimeout(function () {
            return resolve(true);
          }, ms);
        });
      };

      _export('delayedResolve', delayedResolve);

      // ---- URL stuff: convert browser location to websocket endpoint.
      domainRegex = /[a-zA-Z0-9\-\.]+/;
      portRegex = /(\:(6553[0-5]|655[0-2]\d|65[0-4]\d{2}|6[0-4]\d{3}|[1-5]\d{4}|[1-9]\d{0,3}))/;

      endpointFromWindowLocation = function endpointFromWindowLocation(location) {
        var loc = typeof location === 'string' ? location : location.toString();
        var regex = new RegExp(domainRegex.source + portRegex.source);
        var socketIPAndPort = regex.exec(loc.toString()).shift();
        var pieces = socketIPAndPort.split(':');
        var socketString = ['ws://', pieces[0], ':', parseInt(pieces[1], 10)].join('');
        return socketString;
      };

      _export('endpointFromWindowLocation', endpointFromWindowLocation);

      // ---- Unicode: convert Unicode hex code point into glyph pair.

      fixedFromCharCode = function fixedFromCharCode(codePt) {
        var s = undefined;
        if (codePt > 0xFFFF) {
          var code = codePt - 0x10000;
          s = String.fromCharCode(0xD800 + (code >> 10), 0xDC00 + (code & 0x3FF));
        } else {
          s = String.fromCharCode(codePt);
        }
        return s;
      };

      _export('fixedFromCharCode', fixedFromCharCode);

      // ---- Alignment: convert enumerated values into classes.
      halignClasses = ['h-left', 'h-center', 'h-right'];
      valignClasses = ['v-top', 'v-middle', 'v-bottom'];

      safeLookup = function safeLookup(a, i) {
        try {
          return a[i | 0];
        } catch (e) {
          return a[0];
        }
      };

      halignClassLookup = function halignClassLookup(halign) {
        return safeLookup(halignClasses, halign);
      };

      _export('halignClassLookup', halignClassLookup);

      valignClassLookup = function valignClassLookup(valign) {
        return safeLookup(valignClasses, valign);
      };

      _export('valignClassLookup', valignClassLookup);
    }
  };
});
$__System.register('9f', ['e', '6c', '6a', '9e', '6d', 'd'], function (_export) {
  var _extends, _regeneratorRuntime, _Promise, createSagaMiddleware, isCancelError, call, cancel, fork, put, race, take, cancellablePromise, delayedResolve, endpointFromWindowLocation, marked0$0, SOCKET_OPENED, SOCKET_CLOSED, SOCKET_ERRORED, SOCKET_RECV, PONG_RECV, OPEN_SOCKET, CLOSE_SOCKET, SEND_SOCKET, SET_SOCKET_STATUS, SET_PING_INFO, actionCreators, dontLog, socketSource, noopAction, noop, handlers, nullArgs, mungeArgs, middleware, actions, reducers;

  function fetchSocket(source) {
    var setStatus, msg, action;
    return _regeneratorRuntime.wrap(function fetchSocket$(context$1$0) {
      while (1) switch (context$1$0.prev = context$1$0.next) {
        case 0:
          context$1$0.prev = 0;

          console.log('* fetchSocket');

          setStatus = function setStatus(status) {
            return put(actionCreators.setSocketStatus(status));
          };

          context$1$0.next = 5;
          return call(source.nextMessage);

        case 5:
          msg = context$1$0.sent;

        case 6:
          if (!msg) {
            context$1$0.next = 52;
            break;
          }

          if (!(msg.addr in dontLog)) {
            console.log(':::: MSG', msg);
          }

          if (!(msg.type && msg.type === SOCKET_RECV)) {
            context$1$0.next = 21;
            break;
          }

          action = undefined;

          // Sanitize remote actions against registered handlers.
          if (msg.addr && msg.addr in handlers) {
            action = handlers[msg.addr](msg);
          }

          if (!action) {
            context$1$0.next = 18;
            break;
          }

          if (!(action !== noopAction)) {
            context$1$0.next = 16;
            break;
          }

          if (!action.dontLog) {
            console.log('>:>|', action);
          }
          context$1$0.next = 16;
          return put(action);

        case 16:
          context$1$0.next = 19;
          break;

        case 18:
          console.error('^^^^^ UNHANDLED SOCKET MESSAGE !!!!!!\n');

        case 19:
          context$1$0.next = 47;
          break;

        case 21:
          if (!(msg === 'opened')) {
            context$1$0.next = 28;
            break;
          }

          context$1$0.next = 24;
          return setStatus('open');

        case 24:
          context$1$0.next = 26;
          return put({ type: SOCKET_OPENED });

        case 26:
          context$1$0.next = 47;
          break;

        case 28:
          if (!(msg === 'closed')) {
            context$1$0.next = 35;
            break;
          }

          context$1$0.next = 31;
          return setStatus('closed');

        case 31:
          context$1$0.next = 33;
          return put({ type: SOCKET_CLOSED });

        case 33:
          context$1$0.next = 47;
          break;

        case 35:
          if (!(msg === 'error')) {
            context$1$0.next = 42;
            break;
          }

          context$1$0.next = 38;
          return setStatus('error');

        case 38:
          context$1$0.next = 40;
          return put({ type: SOCKET_ERRORED, error: msg });

        case 40:
          context$1$0.next = 47;
          break;

        case 42:
          console.warn('unknown message type on socket', msg);
          context$1$0.next = 45;
          return setStatus('error');

        case 45:
          context$1$0.next = 47;
          return put({ type: SOCKET_ERRORED, error: msg });

        case 47:
          context$1$0.next = 49;
          return call(source.nextMessage);

        case 49:
          msg = context$1$0.sent;
          context$1$0.next = 6;
          break;

        case 52:
          context$1$0.next = 57;
          break;

        case 54:
          context$1$0.prev = 54;
          context$1$0.t0 = context$1$0['catch'](0);

          if (!isCancelError(context$1$0.t0)) {
            console.error('*fetchSocket error', context$1$0.t0);
          }

        case 57:
        case 'end':
          return context$1$0.stop();
      }
    }, marked0$0[0], this, [[0, 54]]);
  }

  function sendSocket(websocket) {
    var send, msg, addr, _msg$args, args, id, data;

    return _regeneratorRuntime.wrap(function sendSocket$(context$1$0) {
      while (1) switch (context$1$0.prev = context$1$0.next) {
        case 0:
          context$1$0.prev = 0;
          context$1$0.next = 3;
          return take(SOCKET_OPENED);

        case 3:
          send = true;

        case 4:
          if (!send) {
            context$1$0.next = 17;
            break;
          }

          context$1$0.next = 7;
          return take(SEND_SOCKET);

        case 7:
          msg = context$1$0.sent;
          addr = msg.addr;
          _msg$args = msg.args;
          args = _msg$args === undefined ? nullArgs : _msg$args;
          id = websocket._id;
          data = JSON.stringify({ addr: addr, args: mungeArgs(args), id: id });

          if (!(addr in dontLog)) {
            console.log('> socketSend', data);
          }
          websocket.send(data);
          context$1$0.next = 4;
          break;

        case 17:
          context$1$0.next = 22;
          break;

        case 19:
          context$1$0.prev = 19;
          context$1$0.t0 = context$1$0['catch'](0);

          if (!isCancelError(context$1$0.t0)) {
            console.error('*sendSocket error', context$1$0.t0);
          }

        case 22:
        case 'end':
          return context$1$0.stop();
      }
    }, marked0$0[1], this, [[0, 19]]);
  }

  function pingSocket() {
    var pingActive, pingFrame, level, _ref3, pong;

    return _regeneratorRuntime.wrap(function pingSocket$(context$1$0) {
      while (1) switch (context$1$0.prev = context$1$0.next) {
        case 0:
          context$1$0.prev = 0;
          context$1$0.next = 3;
          return take(SOCKET_OPENED);

        case 3:
          context$1$0.next = 5;
          return put(actionCreators.setPingInfo(-2));

        case 5:
          context$1$0.next = 7;
          return delayedResolve(1 * 1000);

        case 7:
          pingActive = true;

        case 8:
          if (!pingActive) {
            context$1$0.next = 35;
            break;
          }

          pingFrame = Math.random() * 0xffffffff | 0;
          context$1$0.next = 12;
          return put(actionCreators.sendPing(pingFrame));

        case 12:
          level = 0;

        case 13:
          if (!(level < 10)) {
            context$1$0.next = 28;
            break;
          }

          context$1$0.next = 16;
          return put(actionCreators.setPingInfo(level));

        case 16:
          context$1$0.next = 18;
          return race({
            pong: take(PONG_RECV),
            timeout: delayedResolve(100)
          });

        case 18:
          _ref3 = context$1$0.sent;
          pong = _ref3.pong;

          if (!pong) {
            context$1$0.next = 25;
            break;
          }

          if (!(pingFrame === pong.args)) {
            context$1$0.next = 23;
            break;
          }

          return context$1$0.abrupt('break', 28);

        case 23:
          context$1$0.next = 26;
          break;

        case 25:
          level = level + 1;

        case 26:
          context$1$0.next = 13;
          break;

        case 28:
          if (level >= 10) {
            console.warn('!!! PING TIMEOUT !!!', level);
          }

          context$1$0.next = 31;
          return put(actionCreators.setPingInfo(level));

        case 31:
          context$1$0.next = 33;
          return delayedResolve(3 * 1000);

        case 33:
          context$1$0.next = 8;
          break;

        case 35:
          context$1$0.next = 40;
          break;

        case 37:
          context$1$0.prev = 37;
          context$1$0.t0 = context$1$0['catch'](0);

          if (!isCancelError(context$1$0.t0)) {
            console.error('*pingSocket error', context$1$0.t0);
          }

        case 40:
        case 'end':
          return context$1$0.stop();
      }
    }, marked0$0[2], this, [[0, 37]]);
  }

  function rootSaga() {
    var active, awaitOpen, endpoint, socket, source, fetchTask, sendTask, pingTask, winner;
    return _regeneratorRuntime.wrap(function rootSaga$(context$1$0) {
      while (1) switch (context$1$0.prev = context$1$0.next) {
        case 0:
          if (window.WebSocket) {
            context$1$0.next = 2;
            break;
          }

          throw new Error('WebSocket support required!');

        case 2:
          active = true;
          awaitOpen = false;

        case 4:
          if (!active) {
            context$1$0.next = 45;
            break;
          }

          if (!awaitOpen) {
            context$1$0.next = 9;
            break;
          }

          context$1$0.next = 8;
          return take(OPEN_SOCKET);

        case 8:
          console.log('::: OPEN_SOCKET');

        case 9:
          context$1$0.next = 11;
          return put(actionCreators.setSocketStatus('opening'));

        case 11:
          endpoint = endpointFromWindowLocation(window.location);

          console.log(':::: WS connecting to endpoint ' + endpoint);

          socket = new window.WebSocket(endpoint);
          source = socketSource(socket);
          context$1$0.next = 17;
          return fork(fetchSocket, source);

        case 17:
          fetchTask = context$1$0.sent;
          context$1$0.next = 20;
          return fork(sendSocket, socket);

        case 20:
          sendTask = context$1$0.sent;
          context$1$0.next = 23;
          return fork(pingSocket, socket);

        case 23:
          pingTask = context$1$0.sent;
          context$1$0.next = 26;
          return race({
            didClose: take(SOCKET_CLOSED),
            erred: take(SOCKET_ERRORED),
            close: take(CLOSE_SOCKET),
            open: take(OPEN_SOCKET)
          });

        case 26:
          winner = context$1$0.sent;

          console.log('**** socketSaga race!', winner, fetchTask.isRunning(), sendTask.isRunning(), pingTask.isRunning());

          // Close socket if didClose didn't win race.
          if (!winner.didClose) {
            socket.close();
          }

          // Cancel fetch, send & ping.
          console.log('cancelling socket ping');
          context$1$0.next = 32;
          return cancel(pingTask);

        case 32:

          console.log('cancelling socket fetch');
          context$1$0.next = 35;
          return cancel(fetchTask);

        case 35:

          console.log('cancelling socket send');
          context$1$0.next = 38;
          return cancel(sendTask);

        case 38:
          context$1$0.next = 40;
          return put(actionCreators.setSocketStatus('closed'));

        case 40:
          context$1$0.next = 42;
          return put(actionCreators.setPingInfo(-1));

        case 42:

          // If socket closed or errored then await new open request, i.e. from direct user intervention.
          awaitOpen = !winner.open;
          context$1$0.next = 4;
          break;

        case 45:
        case 'end':
          return context$1$0.stop();
      }
    }, marked0$0[3], this);
  }

  return {
    setters: [function (_e) {
      _extends = _e['default'];
    }, function (_c) {
      _regeneratorRuntime = _c['default'];
    }, function (_a) {
      _Promise = _a['default'];
    }, function (_e2) {
      createSagaMiddleware = _e2['default'];
      isCancelError = _e2.isCancelError;
    }, function (_d) {
      call = _d.call;
      cancel = _d.cancel;
      fork = _d.fork;
      put = _d.put;
      race = _d.race;
      take = _d.take;
    }, function (_d2) {
      cancellablePromise = _d2.cancellablePromise;
      delayedResolve = _d2.delayedResolve;
      endpointFromWindowLocation = _d2.endpointFromWindowLocation;
    }],
    execute: function () {
      /* eslint-disable no-console */

      // Socket notifications.
      'use strict';

      marked0$0 = [fetchSocket, sendSocket, pingSocket, rootSaga].map(_regeneratorRuntime.mark);
      SOCKET_OPENED = '/socket/OPENED';
      SOCKET_CLOSED = '/socket/CLOSED';
      SOCKET_ERRORED = '/socket/ERROR';
      SOCKET_RECV = '/socket/RECV';
      PONG_RECV = '/socket/PONG';

      // Socket manipulation requests.
      OPEN_SOCKET = '/socket/OPEN';

      _export('OPEN_SOCKET', OPEN_SOCKET);

      CLOSE_SOCKET = '/socket/CLOSE';

      _export('CLOSE_SOCKET', CLOSE_SOCKET);

      SEND_SOCKET = '/socket/SEND';

      _export('SEND_SOCKET', SEND_SOCKET);

      // Socket status updates.
      SET_SOCKET_STATUS = '/socket/SET_STATUS';
      SET_PING_INFO = '/socket/SET_PING_INFO';
      actionCreators = {
        setSocketStatus: function setSocketStatus(status) {
          return { type: SET_SOCKET_STATUS, status: status };
        },
        sendSocket: function sendSocket(addr) {
          for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            args[_key - 1] = arguments[_key];
          }

          return { type: SEND_SOCKET, addr: addr, args: args };
        },
        sendPing: function sendPing() {
          for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            args[_key2] = arguments[_key2];
          }

          return { type: SEND_SOCKET, addr: '/ping', args: args };
        },
        setPingInfo: function setPingInfo(info) {
          return { type: SET_PING_INFO, info: info };
        },
        openSocket: function openSocket() {
          return { type: OPEN_SOCKET };
        }
      };

      // FIXME: Replace with a check for action having a truthy 'dontLog' field.
      dontLog = {
        '/ping': true,
        '/pong': true
      };

      /* eslint no-param-reassign: [2, {"props": false }] */

      socketSource = function socketSource(websocket) {
        var messageQueue = [];
        var resolveQueue = [];
        var resolve = function resolve(msg) {
          if (resolveQueue.length) {
            var nextResolve = resolveQueue.shift();
            nextResolve(msg);
          } else {
            messageQueue.push(msg);
          }
        };
        websocket.onopen = function () {
          console.log('socket/opened');
          resolve('opened');
        };
        websocket.onerror = function (err) {
          console.error('socket/error', err);
          resolve('error');
        };
        websocket.onclose = function (e) {
          // TODO: convert code into reason text as per:
          //       https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent
          console.log('socket/closed [reason, code]', e.reason, e.code);
          resolve('closed');
        };
        websocket.onmessage = function (msg) {
          //    console.log('socket/receive [origin, data]', msg.origin, msg.data);
          try {
            var data = msg.data;

            data = JSON.parse(data);
            var res = _extends({
              type: SOCKET_RECV
            }, data);
            if (data.addr === '*HIHO*' && data.id) {
              websocket._id = data.id;
            }
            resolve(res);
          } catch (ex) {
            console.error(msg, ex);
          }
        };
        return {
          nextMessage: function nextMessage() {
            return messageQueue.length ? cancellablePromise(_Promise.resolve(messageQueue.shift())) : cancellablePromise(new _Promise(function (resolver) {
              return resolveQueue.push(resolver);
            }));
          }
        };
      };

      noopAction = {};

      noop = function noop() {
        return noopAction;
      };

      handlers = {
        '*HIHO*': noop,
        '/pong': function pong(_ref) {
          var args = _ref.args;
          return { type: PONG_RECV, args: args, dontLog: true };
        },
        '/renderer/STATE': function rendererSTATE(_ref2) {
          var args = _ref2.args;
          return { type: '/renderer/STATE', payload: args, root: true };
        }
      };
      nullArgs = [];

      mungeArgs = function mungeArgs(args) {
        return args.length === 1 ? args[0] : args;
      };

      middleware = createSagaMiddleware(rootSaga);
      actions = _extends({}, actionCreators);
      reducers = {
        masterState: function masterState(state, action) {
          if (state === undefined) state = { state: 'unknown' };

          switch (action.type) {
            case '/renderer/STATE':
              {
                //        console.error('MERGE_STATE ()()()()()', state, action.payload);
                var r = _extends({}, state, action.payload);
                //        console.log('post-merge master state', r);
                return r;
              }
            default:
              return state;
          }
        },
        pingInfo: function pingInfo(state, action) {
          if (state === undefined) state = -1;

          switch (action.type) {
            case SET_PING_INFO:
              //        console.log(action);
              return action.info;
            default:
              return state;
          }
        },
        socketStatus: function socketStatus(state, action) {
          if (state === undefined) state = 'unknown';

          switch (action.type) {
            case SET_SOCKET_STATUS:
              //        console.log(action);
              return action.status;
            default:
              return state;
          }
        }
      };

      _export('default', {
        actionCreators: actionCreators,
        actions: actions,
        reducers: reducers,
        middleware: middleware
      });
    }
  };
});
/* websocket */ // Awaiting initial ping.

// Wait 1 second after socket has opened before starting to ping.

// Check for identical pingFrame.

//            console.log(`@! pong !@ ${pingFrame} ${level}`);

// Wait 3 seconds between subsequent ping transmissions.

// Race: didClose, close, error, open.

// Update socket & ping status.
$__System.register('a0', ['e', 'a1'], function (_export) {
  var _extends, _defineProperty, panels, makeActionType, actions, reducePanelState, reducers;

  return {
    setters: [function (_e) {
      _extends = _e['default'];
    }, function (_a1) {
      _defineProperty = _a1['default'];
    }],
    execute: function () {
      'use strict';

      panels = ['Font'];

      makeActionType = function makeActionType(panel, type) {
        return '/ui/' + panel + 'Panel/' + type;
      };

      actions = panels.reduce(function (out, panel) {
        var _extends2;

        return _extends({}, out, (_extends2 = {}, _defineProperty(_extends2, 'open' + panel + 'Panel', function () {
          return {
            type: makeActionType(panel, 'STATE'),
            open: true
          };
        }), _defineProperty(_extends2, 'close' + panel + 'Panel', function () {
          return {
            type: makeActionType(panel, 'STATE'),
            open: false
          };
        }), _defineProperty(_extends2, 'set' + panel + 'PanelState', function (open) {
          return {
            type: makeActionType(panel, 'STATE'),
            open: open
          };
        }), _defineProperty(_extends2, 'toggle' + panel + 'PanelState', function () {
          return {
            type: makeActionType(panel, 'TOGGLE')
          };
        }), _extends2));
      }, {});

      reducePanelState = function reducePanelState(panel) {
        var initiallyOpen = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];
        return function (state, action) {
          if (state === undefined) state = initiallyOpen;

          var newState = state;
          if (action.type === makeActionType(panel, 'STATE')) {
            newState = !!action.open;
          } else if (action.type === makeActionType(panel, 'TOGGLE')) {
            newState = !state;
          }
          return newState;
        };
      };

      reducers = panels.reduce(function (out, panel) {
        return _extends({}, out, _defineProperty({}, panel.toLowerCase() + 'PanelIsOpen', reducePanelState(panel)));
      }, {});

      _export('default', {
        actions: actions,
        reducers: reducers
      });
    }
  };
});
$__System.registerDynamic("a2", ["29"], true, function($__require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  var $ = $__require('29');
  module.exports = function defineProperty(it, key, desc) {
    return $.setDesc(it, key, desc);
  };
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("2d", ["a2"], true, function($__require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  module.exports = {
    "default": $__require('a2'),
    __esModule: true
  };
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("a1", ["2d"], true, function($__require, exports, module) {
  "use strict";
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  var _Object$defineProperty = $__require('2d')["default"];
  exports["default"] = function(obj, key, value) {
    if (key in obj) {
      _Object$defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }
    return obj;
  };
  exports.__esModule = true;
  global.define = __define;
  return module.exports;
});

$__System.register('20', ['e', 'a1'], function (_export) {
  var _extends, _defineProperty, MERGE_STATE, CLEAR_MESSAGE, SET_MESSAGE, SET_BOLD, SET_ITALIC, SET_FONT, SET_HALIGN, SET_VALIGN, creator, actions, ALIGN, defaultMessage, defaultStyling, defaultAlignment, BASE_FONT_SIZE, FONT_LIST, FONT_MAP, reducers;

  return {
    setters: [function (_e) {
      _extends = _e['default'];
    }, function (_a1) {
      _defineProperty = _a1['default'];
    }],
    execute: function () {
      // CLIENT PROVIDER!
      // import { shallowEqual } from '../utils';

      // const TRANSMIT_MESSAGE = '/wordEditor/TRANSMIT';
      'use strict';

      MERGE_STATE = '/wordEditor/MERGE';
      CLEAR_MESSAGE = '/wordEditor/CLEAR_MESSAGE';
      SET_MESSAGE = '/wordEditor/MESSAGE';
      SET_BOLD = '/wordEditor/BOLD';
      SET_ITALIC = '/wordEditor/ITALIC';
      SET_FONT = '/wordEditor/FONT';
      SET_HALIGN = '/wordEditor/HALIGN';
      SET_VALIGN = '/wordEditor/VALIGN';

      creator = function creator(type) {
        return function (payload) {
          return { type: type, payload: payload };
        };
      };

      actions = {
        //  transmitMessage: creator(TRANSMIT_MESSAGE),
        mergeState: creator(MERGE_STATE),
        clearMessage: creator(CLEAR_MESSAGE),
        setMessage: creator(SET_MESSAGE),
        setFont: creator(SET_FONT),
        setBold: creator(SET_BOLD),
        setItalic: creator(SET_ITALIC),
        setHorizontalAlignment: creator(SET_HALIGN),
        setVerticalAlignment: creator(SET_VALIGN)
      };
      ALIGN = {
        LEFT: 0,
        CENTER: 1,
        RIGHT: 2,
        TOP: 0,
        MIDDLE: 1,
        BOTTOM: 2
      };

      _export('ALIGN', ALIGN);

      // TODO: Replicate from localForage.
      defaultMessage = 'do it';
      defaultStyling = {
        bold: false,
        italic: false,
        fontFamily: 'Heiti SC',
        fontSize: 80
      };
      defaultAlignment = {
        halign: ALIGN.LEFT,
        valign: ALIGN.TOP
      };
      BASE_FONT_SIZE = 80;
      FONT_LIST = [{ family: 'Aladin', size: 110 }, { family: 'American Typewriter', size: BASE_FONT_SIZE }, { family: 'Arial Black', size: BASE_FONT_SIZE }, { family: 'Bradley Hand', size: BASE_FONT_SIZE }, { family: 'Chalkduster', size: BASE_FONT_SIZE }, { family: 'Copperplate', size: BASE_FONT_SIZE }, { family: 'Courier New', size: BASE_FONT_SIZE }, { family: 'DIN Alternate', size: BASE_FONT_SIZE }, { family: 'Futura', size: BASE_FONT_SIZE }, { family: 'Georgia', size: BASE_FONT_SIZE }, { family: 'Gill Sans', size: BASE_FONT_SIZE }, { family: 'Heiti SC', size: BASE_FONT_SIZE }, { family: 'Helvetica', size: BASE_FONT_SIZE }, { family: 'Marker Felt', size: BASE_FONT_SIZE }, { family: 'Menlo', size: BASE_FONT_SIZE }, { family: 'Optima', size: BASE_FONT_SIZE }, { family: 'Papyrus', size: BASE_FONT_SIZE }, { family: 'Roboto', size: BASE_FONT_SIZE }, { family: 'Rockwell', size: BASE_FONT_SIZE }, { family: 'Share Tech Mono', size: 90 }, { family: 'Skia', size: 90 }, { family: 'Superclarendon', size: BASE_FONT_SIZE }, { family: 'Times New Roman', size: BASE_FONT_SIZE }, { family: 'Trebuchet MS', size: BASE_FONT_SIZE }, { family: 'Ultra', size: BASE_FONT_SIZE }, { family: 'Underdog', size: BASE_FONT_SIZE }, { family: 'Unica One', size: 90 }, { family: 'Wallpoet', size: BASE_FONT_SIZE }, { family: 'Wire One', size: 120 }, { family: 'Zapfino', size: 60 }, { family: 'Zeyada', size: 120 }];
      FONT_MAP = FONT_LIST.reduce(function (total, cur) {
        return _extends({}, total, _defineProperty({}, cur.family, {
          family: cur.family,
          size: cur.size
        }));
      });
      reducers = {
        message: function message(state, _ref) {
          if (state === undefined) state = defaultMessage;
          var type = _ref.type;
          var payload = _ref.payload;

          switch (type) {
            case CLEAR_MESSAGE:
              return '';
            case SET_MESSAGE:
              return payload;
            case MERGE_STATE:
              return payload.message || state;
            default:
              return state;
          }
        },
        alignment: function alignment(state, _ref2) {
          if (state === undefined) state = defaultAlignment;
          var type = _ref2.type;
          var payload = _ref2.payload;

          switch (type) {
            case SET_HALIGN:
              return _extends({}, state, {
                halign: payload
              });
            case SET_VALIGN:
              return _extends({}, state, {
                valign: payload
              });
            case MERGE_STATE:
              return _extends({}, state, payload.alignment);
            default:
              return state;
          }
        },
        styling: function styling(state, _ref3) {
          if (state === undefined) state = defaultStyling;
          var type = _ref3.type;
          var payload = _ref3.payload;

          switch (type) {
            case SET_BOLD:
              return _extends({}, state, {
                bold: !!payload
              });
            case SET_ITALIC:
              return _extends({}, state, {
                italic: !!payload
              });
            case SET_FONT:
              return _extends({}, state, {
                fontFamily: payload,
                fontSize: FONT_MAP[payload] ? FONT_MAP[payload].size : BASE_FONT_SIZE
              });
            case MERGE_STATE:
              return _extends({}, state, payload.styling);
            default:
              return state;
          }
        },

        fontList: function fontList() {
          return FONT_LIST;
        },
        fontMap: function fontMap() {
          return FONT_MAP;
        }
      };

      _export('default', {
        actions: actions,
        reducers: reducers
      });
    }
  };
});
$__System.registerDynamic("71", ["53"], true, function($__require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  var cof = $__require('53');
  module.exports = Object('z').propertyIsEnumerable(0) ? Object : function(it) {
    return cof(it) == 'String' ? it.split('') : Object(it);
  };
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("a3", ["29", "8c", "71", "5a"], true, function($__require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  var $ = $__require('29'),
      toObject = $__require('8c'),
      IObject = $__require('71');
  module.exports = $__require('5a')(function() {
    var a = Object.assign,
        A = {},
        B = {},
        S = Symbol(),
        K = 'abcdefghijklmnopqrst';
    A[S] = 7;
    K.split('').forEach(function(k) {
      B[k] = k;
    });
    return a({}, A)[S] != 7 || Object.keys(a({}, B)).join('') != K;
  }) ? function assign(target, source) {
    var T = toObject(target),
        $$ = arguments,
        $$len = $$.length,
        index = 1,
        getKeys = $.getKeys,
        getSymbols = $.getSymbols,
        isEnum = $.isEnum;
    while ($$len > index) {
      var S = IObject($$[index++]),
          keys = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S),
          length = keys.length,
          j = 0,
          key;
      while (length > j)
        if (isEnum.call(S, key = keys[j++]))
          T[key] = S[key];
    }
    return T;
  } : Object.assign;
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("a4", ["58", "a3"], true, function($__require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  var $export = $__require('58');
  $export($export.S + $export.F, 'Object', {assign: $__require('a3')});
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("a5", ["a4", "15"], true, function($__require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  $__require('a4');
  module.exports = $__require('15').Object.assign;
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("a6", ["a5"], true, function($__require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  module.exports = {
    "default": $__require('a5'),
    __esModule: true
  };
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("e", ["a6"], true, function($__require, exports, module) {
  "use strict";
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  var _Object$assign = $__require('a6')["default"];
  exports["default"] = _Object$assign || function(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  exports.__esModule = true;
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("a7", ["a8", "72"], true, function($__require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  var toInteger = $__require('a8'),
      defined = $__require('72');
  module.exports = function(TO_STRING) {
    return function(that, pos) {
      var s = String(defined(that)),
          i = toInteger(pos),
          l = s.length,
          a,
          b;
      if (i < 0 || i >= l)
        return TO_STRING ? '' : undefined;
      a = s.charCodeAt(i);
      return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff ? TO_STRING ? s.charAt(i) : a : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
    };
  };
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("60", [], true, function($__require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  module.exports = true;
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("59", ["a9"], true, function($__require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  module.exports = $__require('a9');
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("5f", [], true, function($__require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  module.exports = function(bitmap, value) {
    return {
      enumerable: !(bitmap & 1),
      configurable: !(bitmap & 2),
      writable: !(bitmap & 4),
      value: value
    };
  };
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("5a", [], true, function($__require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  module.exports = function(exec) {
    try {
      return !!exec();
    } catch (e) {
      return true;
    }
  };
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("57", ["5a"], true, function($__require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  module.exports = !$__require('5a')(function() {
    return Object.defineProperty({}, 'a', {get: function() {
        return 7;
      }}).a != 7;
  });
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("a9", ["29", "5f", "57"], true, function($__require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  var $ = $__require('29'),
      createDesc = $__require('5f');
  module.exports = $__require('57') ? function(object, key, value) {
    return $.setDesc(object, key, createDesc(1, value));
  } : function(object, key, value) {
    object[key] = value;
    return object;
  };
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("aa", ["29", "5f", "5c", "a9", "5e"], true, function($__require, exports, module) {
  "use strict";
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  var $ = $__require('29'),
      descriptor = $__require('5f'),
      setToStringTag = $__require('5c'),
      IteratorPrototype = {};
  $__require('a9')(IteratorPrototype, $__require('5e')('iterator'), function() {
    return this;
  });
  module.exports = function(Constructor, NAME, next) {
    Constructor.prototype = $.create(IteratorPrototype, {next: descriptor(1, next)});
    setToStringTag(Constructor, NAME + ' Iterator');
  };
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("56", [], true, function($__require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  var hasOwnProperty = {}.hasOwnProperty;
  module.exports = function(it, key) {
    return hasOwnProperty.call(it, key);
  };
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("5c", ["29", "56", "5e"], true, function($__require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  var def = $__require('29').setDesc,
      has = $__require('56'),
      TAG = $__require('5e')('toStringTag');
  module.exports = function(it, tag, stat) {
    if (it && !has(it = stat ? it : it.prototype, TAG))
      def(it, TAG, {
        configurable: true,
        value: tag
      });
  };
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("29", [], true, function($__require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  var $Object = Object;
  module.exports = {
    create: $Object.create,
    getProto: $Object.getPrototypeOf,
    isEnum: {}.propertyIsEnumerable,
    getDesc: $Object.getOwnPropertyDescriptor,
    setDesc: $Object.defineProperty,
    setDescs: $Object.defineProperties,
    getKeys: $Object.keys,
    getNames: $Object.getOwnPropertyNames,
    getSymbols: $Object.getOwnPropertySymbols,
    each: [].forEach
  };
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("75", ["60", "58", "59", "a9", "56", "74", "aa", "5c", "29", "5e"], true, function($__require, exports, module) {
  "use strict";
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  var LIBRARY = $__require('60'),
      $export = $__require('58'),
      redefine = $__require('59'),
      hide = $__require('a9'),
      has = $__require('56'),
      Iterators = $__require('74'),
      $iterCreate = $__require('aa'),
      setToStringTag = $__require('5c'),
      getProto = $__require('29').getProto,
      ITERATOR = $__require('5e')('iterator'),
      BUGGY = !([].keys && 'next' in [].keys()),
      FF_ITERATOR = '@@iterator',
      KEYS = 'keys',
      VALUES = 'values';
  var returnThis = function() {
    return this;
  };
  module.exports = function(Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {
    $iterCreate(Constructor, NAME, next);
    var getMethod = function(kind) {
      if (!BUGGY && kind in proto)
        return proto[kind];
      switch (kind) {
        case KEYS:
          return function keys() {
            return new Constructor(this, kind);
          };
        case VALUES:
          return function values() {
            return new Constructor(this, kind);
          };
      }
      return function entries() {
        return new Constructor(this, kind);
      };
    };
    var TAG = NAME + ' Iterator',
        DEF_VALUES = DEFAULT == VALUES,
        VALUES_BUG = false,
        proto = Base.prototype,
        $native = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT],
        $default = $native || getMethod(DEFAULT),
        methods,
        key;
    if ($native) {
      var IteratorPrototype = getProto($default.call(new Base));
      setToStringTag(IteratorPrototype, TAG, true);
      if (!LIBRARY && has(proto, FF_ITERATOR))
        hide(IteratorPrototype, ITERATOR, returnThis);
      if (DEF_VALUES && $native.name !== VALUES) {
        VALUES_BUG = true;
        $default = function values() {
          return $native.call(this);
        };
      }
    }
    if ((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])) {
      hide(proto, ITERATOR, $default);
    }
    Iterators[NAME] = $default;
    Iterators[TAG] = returnThis;
    if (DEFAULT) {
      methods = {
        values: DEF_VALUES ? $default : getMethod(VALUES),
        keys: IS_SET ? $default : getMethod(KEYS),
        entries: !DEF_VALUES ? $default : getMethod('entries')
      };
      if (FORCED)
        for (key in methods) {
          if (!(key in proto))
            redefine(proto, key, methods[key]);
        }
      else
        $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
    }
    return methods;
  };
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("18", ["a7", "75"], true, function($__require, exports, module) {
  "use strict";
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  var $at = $__require('a7')(true);
  $__require('75')(String, 'String', function(iterated) {
    this._t = String(iterated);
    this._i = 0;
  }, function() {
    var O = this._t,
        index = this._i,
        point;
    if (index >= O.length)
      return {
        value: undefined,
        done: true
      };
    point = $at(O, index);
    this._i += point.length;
    return {
      value: point,
      done: false
    };
  });
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("7f", [], true, function($__require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  module.exports = function(it) {
    if (typeof it != 'function')
      throw TypeError(it + ' is not a function!');
    return it;
  };
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("78", ["7f"], true, function($__require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  var aFunction = $__require('7f');
  module.exports = function(fn, that, length) {
    aFunction(fn);
    if (that === undefined)
      return fn;
    switch (length) {
      case 1:
        return function(a) {
          return fn.call(that, a);
        };
      case 2:
        return function(a, b) {
          return fn.call(that, a, b);
        };
      case 3:
        return function(a, b, c) {
          return fn.call(that, a, b, c);
        };
    }
    return function() {
      return fn.apply(that, arguments);
    };
  };
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("58", ["55", "15", "78"], true, function($__require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  var global = $__require('55'),
      core = $__require('15'),
      ctx = $__require('78'),
      PROTOTYPE = 'prototype';
  var $export = function(type, name, source) {
    var IS_FORCED = type & $export.F,
        IS_GLOBAL = type & $export.G,
        IS_STATIC = type & $export.S,
        IS_PROTO = type & $export.P,
        IS_BIND = type & $export.B,
        IS_WRAP = type & $export.W,
        exports = IS_GLOBAL ? core : core[name] || (core[name] = {}),
        target = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE],
        key,
        own,
        out;
    if (IS_GLOBAL)
      source = name;
    for (key in source) {
      own = !IS_FORCED && target && key in target;
      if (own && key in exports)
        continue;
      out = own ? target[key] : source[key];
      exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key] : IS_BIND && own ? ctx(out, global) : IS_WRAP && target[key] == out ? (function(C) {
        var F = function(param) {
          return this instanceof C ? new C(param) : C(param);
        };
        F[PROTOTYPE] = C[PROTOTYPE];
        return F;
      })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
      if (IS_PROTO)
        (exports[PROTOTYPE] || (exports[PROTOTYPE] = {}))[key] = out;
    }
  };
  $export.F = 1;
  $export.G = 2;
  $export.S = 4;
  $export.P = 8;
  $export.B = 16;
  $export.W = 32;
  module.exports = $export;
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("72", [], true, function($__require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  module.exports = function(it) {
    if (it == undefined)
      throw TypeError("Can't call method on  " + it);
    return it;
  };
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("8c", ["72"], true, function($__require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  var defined = $__require('72');
  module.exports = function(it) {
    return Object(defined(it));
  };
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("7c", [], true, function($__require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  module.exports = function(it) {
    return typeof it === 'object' ? it !== null : typeof it === 'function';
  };
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("13", ["7c"], true, function($__require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  var isObject = $__require('7c');
  module.exports = function(it) {
    if (!isObject(it))
      throw TypeError(it + ' is not an object!');
    return it;
  };
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("79", ["13"], true, function($__require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  var anObject = $__require('13');
  module.exports = function(iterator, fn, value, entries) {
    try {
      return entries ? fn(anObject(value)[0], value[1]) : fn(value);
    } catch (e) {
      var ret = iterator['return'];
      if (ret !== undefined)
        anObject(ret.call(iterator));
      throw e;
    }
  };
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("7a", ["74", "5e"], true, function($__require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  var Iterators = $__require('74'),
      ITERATOR = $__require('5e')('iterator'),
      ArrayProto = Array.prototype;
  module.exports = function(it) {
    return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
  };
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("a8", [], true, function($__require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  var ceil = Math.ceil,
      floor = Math.floor;
  module.exports = function(it) {
    return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
  };
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("7b", ["a8"], true, function($__require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  var toInteger = $__require('a8'),
      min = Math.min;
  module.exports = function(it) {
    return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0;
  };
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("53", [], true, function($__require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  var toString = {}.toString;
  module.exports = function(it) {
    return toString.call(it).slice(8, -1);
  };
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("88", ["53", "5e"], true, function($__require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  var cof = $__require('53'),
      TAG = $__require('5e')('toStringTag'),
      ARG = cof(function() {
        return arguments;
      }()) == 'Arguments';
  module.exports = function(it) {
    var O,
        T,
        B;
    return it === undefined ? 'Undefined' : it === null ? 'Null' : typeof(T = (O = Object(it))[TAG]) == 'string' ? T : ARG ? cof(O) : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
  };
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("74", [], true, function($__require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  module.exports = {};
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("14", ["88", "5e", "74", "15"], true, function($__require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  var classof = $__require('88'),
      ITERATOR = $__require('5e')('iterator'),
      Iterators = $__require('74');
  module.exports = $__require('15').getIteratorMethod = function(it) {
    if (it != undefined)
      return it[ITERATOR] || it['@@iterator'] || Iterators[classof(it)];
  };
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("5b", ["55"], true, function($__require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  var global = $__require('55'),
      SHARED = '__core-js_shared__',
      store = global[SHARED] || (global[SHARED] = {});
  module.exports = function(key) {
    return store[key] || (store[key] = {});
  };
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("5d", [], true, function($__require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  var id = 0,
      px = Math.random();
  module.exports = function(key) {
    return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
  };
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("55", [], true, function($__require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  var global = module.exports = typeof window != 'undefined' && window.Math == Math ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
  if (typeof __g == 'number')
    __g = global;
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("5e", ["5b", "5d", "55"], true, function($__require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  var store = $__require('5b')('wks'),
      uid = $__require('5d'),
      Symbol = $__require('55').Symbol;
  module.exports = function(name) {
    return store[name] || (store[name] = Symbol && Symbol[name] || (Symbol || uid)('Symbol.' + name));
  };
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("89", ["5e"], true, function($__require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  var ITERATOR = $__require('5e')('iterator'),
      SAFE_CLOSING = false;
  try {
    var riter = [7][ITERATOR]();
    riter['return'] = function() {
      SAFE_CLOSING = true;
    };
    Array.from(riter, function() {
      throw 2;
    });
  } catch (e) {}
  module.exports = function(exec, skipClosing) {
    if (!skipClosing && !SAFE_CLOSING)
      return false;
    var safe = false;
    try {
      var arr = [7],
          iter = arr[ITERATOR]();
      iter.next = function() {
        safe = true;
      };
      arr[ITERATOR] = function() {
        return iter;
      };
      exec(arr);
    } catch (e) {}
    return safe;
  };
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("ab", ["78", "58", "8c", "79", "7a", "7b", "14", "89"], true, function($__require, exports, module) {
  "use strict";
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  var ctx = $__require('78'),
      $export = $__require('58'),
      toObject = $__require('8c'),
      call = $__require('79'),
      isArrayIter = $__require('7a'),
      toLength = $__require('7b'),
      getIterFn = $__require('14');
  $export($export.S + $export.F * !$__require('89')(function(iter) {
    Array.from(iter);
  }), 'Array', {from: function from(arrayLike) {
      var O = toObject(arrayLike),
          C = typeof this == 'function' ? this : Array,
          $$ = arguments,
          $$len = $$.length,
          mapfn = $$len > 1 ? $$[1] : undefined,
          mapping = mapfn !== undefined,
          index = 0,
          iterFn = getIterFn(O),
          length,
          result,
          step,
          iterator;
      if (mapping)
        mapfn = ctx(mapfn, $$len > 2 ? $$[2] : undefined, 2);
      if (iterFn != undefined && !(C == Array && isArrayIter(iterFn))) {
        for (iterator = iterFn.call(O), result = new C; !(step = iterator.next()).done; index++) {
          result[index] = mapping ? call(iterator, mapfn, [step.value, index], true) : step.value;
        }
      } else {
        length = toLength(O.length);
        for (result = new C(length); length > index; index++) {
          result[index] = mapping ? mapfn(O[index], index) : O[index];
        }
      }
      result.length = index;
      return result;
    }});
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("15", [], true, function($__require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  var core = module.exports = {version: '1.2.6'};
  if (typeof __e == 'number')
    __e = core;
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("ac", ["18", "ab", "15"], true, function($__require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  $__require('18');
  $__require('ab');
  module.exports = $__require('15').Array.from;
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("ad", ["ac"], true, function($__require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  module.exports = {
    "default": $__require('ac'),
    __esModule: true
  };
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("ae", ["ad"], true, function($__require, exports, module) {
  "use strict";
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  var _Array$from = $__require('ad')["default"];
  exports["default"] = function(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0,
          arr2 = Array(arr.length); i < arr.length; i++)
        arr2[i] = arr[i];
      return arr2;
    } else {
      return _Array$from(arr);
    }
  };
  exports.__esModule = true;
  global.define = __define;
  return module.exports;
});

$__System.register('af', ['e', 'ae'], function (_export) {
  var _extends, _toConsumableArray, SET_WORD_LIST, DEL_WORD, DUP_WORD, NUDGE_WORD, ACTIVATE_WORD, EDIT_WORD, SAVE_WORD, SAVE_NEW_WORD, actions, defaultWordListInternal, savedWordList, defaultWordList, del, dup, nudge, edit, activate, saveNew, save, reducers, middleware;

  return {
    setters: [function (_e) {
      _extends = _e['default'];
    }, function (_ae) {
      _toConsumableArray = _ae['default'];
    }],
    execute: function () {
      'use strict';

      SET_WORD_LIST = 'words/SET';
      DEL_WORD = 'words/DEL';
      DUP_WORD = 'words/DUP';
      NUDGE_WORD = 'words/NUDGE';
      ACTIVATE_WORD = 'words/ACTIVATE';
      EDIT_WORD = 'words/EDIT';
      SAVE_WORD = 'words/SAVE';
      SAVE_NEW_WORD = 'words/SAVE_NEW';
      actions = {
        setWordList: function setWordList(list) {
          return { type: SET_WORD_LIST, list: list };
        },
        delWord: function delWord(index) {
          return { type: DEL_WORD, index: index };
        },
        dupWord: function dupWord(index) {
          return { type: DUP_WORD, index: index };
        },
        nudgeWord: function nudgeWord(index, dir) {
          return { type: NUDGE_WORD, index: index, dir: dir };
        },
        activateWord: function activateWord(index) {
          return { type: ACTIVATE_WORD, index: index };
        },
        editWord: function editWord(index) {
          return { type: EDIT_WORD, index: index };
        },
        saveWord: function saveWord(word) {
          return { type: SAVE_WORD, word: word };
        },
        saveNewWord: function saveNewWord(word) {
          return { type: SAVE_NEW_WORD, word: word };
        }
      };
      defaultWordListInternal = [{
        message: '[beep]',
        styling: {
          fontFamily: 'Rockwell',
          bold: true,
          italic: true
        },
        alignment: {
          halign: 1,
          valign: 0
        }
      }, {
        message: 'TECHNO',
        styling: {
          fontFamily: 'Wire One',
          bold: false,
          italic: false
        },
        alignment: {
          halign: 2,
          valign: 0
        }
      }, {
        message: 'top left',
        styling: {
          fontFamily: 'Roboto',
          bold: false,
          italic: false
        },
        alignment: {
          halign: 0,
          valign: 0
        }
      }, {
        message: 'middle center',
        styling: {
          fontFamily: 'Roboto',
          bold: false,
          italic: false
        },
        alignment: {
          halign: 1,
          valign: 1
        }
      }, {
        message: 'multiple lines\nbottom right',
        styling: {
          fontFamily: 'Roboto',
          bold: false,
          italic: false
        },
        alignment: {
          halign: 2,
          valign: 2
        }
      }];
      savedWordList = window.localStorage && !window.location.hash.includes('noload') && window.localStorage.getItem('wordListProvider');
      defaultWordList = savedWordList ? JSON.parse(savedWordList).data : defaultWordListInternal;

      del = function del(list, index) {
        if (index < 0 || index >= list.length || list.length === 1) {
          console.warn('Bad del request at index ' + index + ' for', list); // eslint-disable-line no-console
          return list;
        }
        return [].concat(_toConsumableArray(list.slice(0, index)), _toConsumableArray(list.slice(index + 1)));
      };

      dup = function dup(list, index) {
        if (index < 0 || index >= list.length) {
          console.warn('Bad dup index ' + index + ' for', list); // eslint-disable-line no-console
          return list;
        }
        return [].concat(_toConsumableArray(list.slice(0, index)), [list[index], list[index]], _toConsumableArray(list.slice(index + 1)));
      };

      nudge = function nudge(list, index) {
        var dir = arguments.length <= 2 || arguments[2] === undefined ? 1 : arguments[2];

        var dest = index + dir;
        if (index < 0 || index >= list.length || dest < 0 || dest >= list.length) {
          console.warn('Bad nudge request at ' + index + ' & ' + dest + ' for', // eslint-disable-line no-console
          list, index, dir);
          return list;
        }
        var l = list.slice();
        l[dest] = list[index];
        l[index] = list[dest];
        return l;
      };

      edit = function edit(list, index) {
        return list.map(function (w, i) {
          return _extends({}, w, { editing: i === index });
        });
      };

      activate = function activate(list, index) {
        return list.map(function (w, i) {
          return _extends({}, w, { activated: i === index });
        });
      };

      saveNew = function saveNew(list, word) {
        return [].concat(_toConsumableArray(list.map(function (w) {
          return _extends({}, w, { editing: false });
        })), [_extends({}, word, { editing: true })]);
      };

      save = function save(list, word) {
        //  console.log('save', list, word);
        var index = list.findIndex(function (w) {
          return w.editing === true;
        });
        var l = undefined;
        if (index === -1) {
          l = [].concat(_toConsumableArray(list), [_extends({}, word, { editing: true })]);
        } else {
          l = list.slice();
          l[index] = _extends({}, word, { editing: true });
        }
        return l;
      };

      reducers = {
        wordList: function wordList(state, action) {
          if (state === undefined) state = defaultWordList;

          switch (action.type) {
            case SET_WORD_LIST:
              return action.list;

            case DEL_WORD:
              return del(state, action.index);

            case DUP_WORD:
              return dup(state, action.index);

            case NUDGE_WORD:
              return nudge(state, action.index, action.dir);

            case EDIT_WORD:
              return edit(state, action.index);

            case ACTIVATE_WORD:
              return activate(state, action.index);

            case SAVE_WORD:
              return save(state, action.word);

            case SAVE_NEW_WORD:
              return saveNew(state, action.word);

            default:
              return state;
          }
        }
        // FIXME: This needs to handle all word list actions that modify list indices.
        // 		i.e.: set, del, dup, nudge, activate.
        //  activeWordIndex: (state = null, action) =>
        //    ((action.type === ACTIVATE_WORD) ? action.index : state)
      };

      middleware = function middleware(store) {
        return function (next) {
          return function (action) {
            var result = next(action);
            var wordList = store.getState().wordList;
            // FIXME: word lists should be stored as named presets, with
            //		an entry named init that references the actual named preset to load.
            var listState = JSON.stringify({ data: wordList });
            // FIXME: Only persist upon actual state changes: check via diff, or pure referential equality.
            window.localStorage.setItem('wordListProvider', listState);
            console.warn('+ wordListProvider persisted to localStorage +'); // eslint-disable-line no-console
            return result;
          };
        };
      };

      _export('default', {
        actions: actions,
        reducers: reducers,
        middleware: middleware
      });
    }
  };
});
$__System.register('b0', ['20', '9f', 'a0', 'af'], function (_export) {
  // import miscProvider from './miscProvider';
  'use strict';

  var wordEditor, socketSaga, ui, wordList;
  return {
    setters: [function (_) {
      wordEditor = _['default'];
    }, function (_f) {
      socketSaga = _f['default'];
    }, function (_a0) {
      ui = _a0['default'];
    }, function (_af) {
      wordList = _af['default'];
    }],
    execute: function () {
      _export('default', {
        ui: ui,
        socketSaga: socketSaga,
        wordList: wordList,
        wordEditor: wordEditor
      });
    }
  };
});
$__System.register('1', ['2', '4', '4e', 'b0'], function (_export) {
  /* eslint-disable no-console */
  'use strict';

  var render, React, App, providers, context, main, loadedStates;
  return {
    setters: [function (_2) {
      render = _2.render;
    }, function (_) {
      React = _['default'];
    }, function (_e) {
      App = _e['default'];
    }, function (_b0) {
      providers = _b0['default'];
    }],
    execute: function () {
      context = {
        providers: providers,
        providedState: {
          //    socketStatus: '???',
        }
      };

      main = function main() {
        console.log('-- -- MAIN -- --');

        render(React.createElement(App, context), document.getElementById('app'));

        console.log('-- -- MAIN -- --');
      };

      loadedStates = ['complete', 'loaded', 'interactive'];

      if (loadedStates.includes(document.readyState) && document.body) {
        main();
      } else {
        window.addEventListener('DOMContentLoaded', main, false);
      }
    }
  };
});
})
(function(factory) {
  factory();
});
//# sourceMappingURL=client.js.map