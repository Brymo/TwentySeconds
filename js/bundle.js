(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
(function (Buffer){
grabFile =  async (user) => {
    const Octokit = require('@octokit/rest');
    const octokit = new Octokit();
    const stuff = await octokit.repos.getContents({
      owner:"Brymo",
      repo:"TwentySeconds",
      path:`./Posts/${user}/message.txt`
    })
    const content = await Buffer.from(stuff.data.content,'Base64').toString();
    console.log(content);
    return content;
}


function getRequests(){
    const axios = require('axios');
    axios.get('https://www.plainlaundry.com')
    .then((result) => {
        const data = result.data.wishers;
        const wishers = Object.keys(data);
        const wisherData = wishers.map((name) => {
            return {name: name, wish: data[name].message, hasPic:data[name]["hasPic"]}
        })
        

        const cdnURL = "https://www.plainlaundry.com/pics/"
        let lrtoggle = true;

        let count = 0;
        wisherData.forEach(element => {
        
            const main = document.querySelector("#root");
            const newMessage = document.createElement('div');
            const newText = document.createElement("div");

            if(element.wish.length > 1000){
                newText.style.fontSize = "1.5em";
            }

            newText.innerHTML = element.wish;
            const colors = ["#D4C685","#FFD700","#FFA630","#D7E8BA","#4DA1A9"];

            if(element.hasPic){
                const newImg = document.createElement("img");
                const imgwrap = document.createElement("div");

                imgwrap.className = "imgwrapper";
                imgwrap.appendChild(newImg);
                newImg.src =  cdnURL+element.name;

                if(lrtoggle){
                    newText.className = "msgtxtl";
                    newImg.className = "msgimgr";
                    newMessage.className = "messageframel";
                    newMessage.appendChild(imgwrap);
                    newMessage.appendChild(newText);
                }else{
                    newText.className = "msgtxtr";
                    newImg.className = "msgimgl";
                    newMessage.className = "messageframer";
                    newMessage.appendChild(newText);
                    newMessage.appendChild(imgwrap);
                }
                lrtoggle = !lrtoggle;
            }else{
                newText.className = "msgtxt";
                newMessage.className = "messageframe";
                newMessage.appendChild(newText);
            }
            const bgcol = colors[++count % colors.length];
            newMessage.style.backgroundColor = bgcol;
            newMessage.style.color = LightenDarkenColor(bgcol, -200);


            const wishLabel = document.createElement("div");
            wishLabel.className = "label";
            wishLabel.innerHTML = element.name;
            wishLabel.style.color = LightenDarkenColor(bgcol, 100);

            newMessage.appendChild(wishLabel);
            //newElem.innerHTML = element.name +": "+ element.wish;
            main.appendChild(newMessage);
            
        });

    })
}

function LightenDarkenColor(col, amt) {
  
    var usePound = false;
  
    if (col[0] == "#") {
        col = col.slice(1);
        usePound = true;
    }
 
    var num = parseInt(col,16);
 
    var r = (num >> 16) + amt;
 
    if (r > 255) r = 255;
    else if  (r < 0) r = 0;
 
    var b = ((num >> 8) & 0x00FF) + amt;
 
    if (b > 255) b = 255;
    else if  (b < 0) b = 0;
 
    var g = (num & 0x0000FF) + amt;
 
    if (g > 255) g = 255;
    else if (g < 0) g = 0;
 
    return (usePound?"#":"") + (g | (b << 8) | (r << 16)).toString(16);
  
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

const mainframe = document.getElementById("mainframe");
getRequests();
}).call(this,require("buffer").Buffer)
},{"@octokit/rest":7,"axios":36,"buffer":126}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var isPlainObject = _interopDefault(require('is-plain-object'));
var universalUserAgent = require('universal-user-agent');

function lowercaseKeys(object) {
  if (!object) {
    return {};
  }

  return Object.keys(object).reduce((newObj, key) => {
    newObj[key.toLowerCase()] = object[key];
    return newObj;
  }, {});
}

function mergeDeep(defaults, options) {
  const result = Object.assign({}, defaults);
  Object.keys(options).forEach(key => {
    if (isPlainObject(options[key])) {
      if (!(key in defaults)) Object.assign(result, {
        [key]: options[key]
      });else result[key] = mergeDeep(defaults[key], options[key]);
    } else {
      Object.assign(result, {
        [key]: options[key]
      });
    }
  });
  return result;
}

function merge(defaults, route, options) {
  if (typeof route === "string") {
    let [method, url] = route.split(" ");
    options = Object.assign(url ? {
      method,
      url
    } : {
      url: method
    }, options);
  } else {
    options = route || {};
  } // lowercase header names before merging with defaults to avoid duplicates


  options.headers = lowercaseKeys(options.headers);
  const mergedOptions = mergeDeep(defaults || {}, options); // mediaType.previews arrays are merged, instead of overwritten

  if (defaults && defaults.mediaType.previews.length) {
    mergedOptions.mediaType.previews = defaults.mediaType.previews.filter(preview => !mergedOptions.mediaType.previews.includes(preview)).concat(mergedOptions.mediaType.previews);
  }

  mergedOptions.mediaType.previews = mergedOptions.mediaType.previews.map(preview => preview.replace(/-preview/, ""));
  return mergedOptions;
}

function addQueryParameters(url, parameters) {
  const separator = /\?/.test(url) ? "&" : "?";
  const names = Object.keys(parameters);

  if (names.length === 0) {
    return url;
  }

  return url + separator + names.map(name => {
    if (name === "q") {
      return "q=" + parameters.q.split("+").map(encodeURIComponent).join("+");
    }

    return `${name}=${encodeURIComponent(parameters[name])}`;
  }).join("&");
}

const urlVariableRegex = /\{[^}]+\}/g;

function removeNonChars(variableName) {
  return variableName.replace(/^\W+|\W+$/g, "").split(/,/);
}

function extractUrlVariableNames(url) {
  const matches = url.match(urlVariableRegex);

  if (!matches) {
    return [];
  }

  return matches.map(removeNonChars).reduce((a, b) => a.concat(b), []);
}

function omit(object, keysToOmit) {
  return Object.keys(object).filter(option => !keysToOmit.includes(option)).reduce((obj, key) => {
    obj[key] = object[key];
    return obj;
  }, {});
}

// Based on https://github.com/bramstein/url-template, licensed under BSD
// TODO: create separate package.
//
// Copyright (c) 2012-2014, Bram Stein
// All rights reserved.
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions
// are met:
//  1. Redistributions of source code must retain the above copyright
//     notice, this list of conditions and the following disclaimer.
//  2. Redistributions in binary form must reproduce the above copyright
//     notice, this list of conditions and the following disclaimer in the
//     documentation and/or other materials provided with the distribution.
//  3. The name of the author may not be used to endorse or promote products
//     derived from this software without specific prior written permission.
// THIS SOFTWARE IS PROVIDED BY THE AUTHOR "AS IS" AND ANY EXPRESS OR IMPLIED
// WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
// MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO
// EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT,
// INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING,
// BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
// DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY
// OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
// NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
// EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

/* istanbul ignore file */
function encodeReserved(str) {
  return str.split(/(%[0-9A-Fa-f]{2})/g).map(function (part) {
    if (!/%[0-9A-Fa-f]/.test(part)) {
      part = encodeURI(part).replace(/%5B/g, "[").replace(/%5D/g, "]");
    }

    return part;
  }).join("");
}

function encodeUnreserved(str) {
  return encodeURIComponent(str).replace(/[!'()*]/g, function (c) {
    return "%" + c.charCodeAt(0).toString(16).toUpperCase();
  });
}

function encodeValue(operator, value, key) {
  value = operator === "+" || operator === "#" ? encodeReserved(value) : encodeUnreserved(value);

  if (key) {
    return encodeUnreserved(key) + "=" + value;
  } else {
    return value;
  }
}

function isDefined(value) {
  return value !== undefined && value !== null;
}

function isKeyOperator(operator) {
  return operator === ";" || operator === "&" || operator === "?";
}

function getValues(context, operator, key, modifier) {
  var value = context[key],
      result = [];

  if (isDefined(value) && value !== "") {
    if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
      value = value.toString();

      if (modifier && modifier !== "*") {
        value = value.substring(0, parseInt(modifier, 10));
      }

      result.push(encodeValue(operator, value, isKeyOperator(operator) ? key : ""));
    } else {
      if (modifier === "*") {
        if (Array.isArray(value)) {
          value.filter(isDefined).forEach(function (value) {
            result.push(encodeValue(operator, value, isKeyOperator(operator) ? key : ""));
          });
        } else {
          Object.keys(value).forEach(function (k) {
            if (isDefined(value[k])) {
              result.push(encodeValue(operator, value[k], k));
            }
          });
        }
      } else {
        const tmp = [];

        if (Array.isArray(value)) {
          value.filter(isDefined).forEach(function (value) {
            tmp.push(encodeValue(operator, value));
          });
        } else {
          Object.keys(value).forEach(function (k) {
            if (isDefined(value[k])) {
              tmp.push(encodeUnreserved(k));
              tmp.push(encodeValue(operator, value[k].toString()));
            }
          });
        }

        if (isKeyOperator(operator)) {
          result.push(encodeUnreserved(key) + "=" + tmp.join(","));
        } else if (tmp.length !== 0) {
          result.push(tmp.join(","));
        }
      }
    }
  } else {
    if (operator === ";") {
      if (isDefined(value)) {
        result.push(encodeUnreserved(key));
      }
    } else if (value === "" && (operator === "&" || operator === "?")) {
      result.push(encodeUnreserved(key) + "=");
    } else if (value === "") {
      result.push("");
    }
  }

  return result;
}

function parseUrl(template) {
  return {
    expand: expand.bind(null, template)
  };
}

function expand(template, context) {
  var operators = ["+", "#", ".", "/", ";", "?", "&"];
  return template.replace(/\{([^\{\}]+)\}|([^\{\}]+)/g, function (_, expression, literal) {
    if (expression) {
      let operator = "";
      const values = [];

      if (operators.indexOf(expression.charAt(0)) !== -1) {
        operator = expression.charAt(0);
        expression = expression.substr(1);
      }

      expression.split(/,/g).forEach(function (variable) {
        var tmp = /([^:\*]*)(?::(\d+)|(\*))?/.exec(variable);
        values.push(getValues(context, operator, tmp[1], tmp[2] || tmp[3]));
      });

      if (operator && operator !== "+") {
        var separator = ",";

        if (operator === "?") {
          separator = "&";
        } else if (operator !== "#") {
          separator = operator;
        }

        return (values.length !== 0 ? operator : "") + values.join(separator);
      } else {
        return values.join(",");
      }
    } else {
      return encodeReserved(literal);
    }
  });
}

function parse(options) {
  // https://fetch.spec.whatwg.org/#methods
  let method = options.method.toUpperCase(); // replace :varname with {varname} to make it RFC 6570 compatible

  let url = options.url.replace(/:([a-z]\w+)/g, "{+$1}");
  let headers = Object.assign({}, options.headers);
  let body;
  let parameters = omit(options, ["method", "baseUrl", "url", "headers", "request", "mediaType"]); // extract variable names from URL to calculate remaining variables later

  const urlVariableNames = extractUrlVariableNames(url);
  url = parseUrl(url).expand(parameters);

  if (!/^http/.test(url)) {
    url = options.baseUrl + url;
  }

  const omittedParameters = Object.keys(options).filter(option => urlVariableNames.includes(option)).concat("baseUrl");
  const remainingParameters = omit(parameters, omittedParameters);
  const isBinaryRequset = /application\/octet-stream/i.test(headers.accept);

  if (!isBinaryRequset) {
    if (options.mediaType.format) {
      // e.g. application/vnd.github.v3+json => application/vnd.github.v3.raw
      headers.accept = headers.accept.split(/,/).map(preview => preview.replace(/application\/vnd(\.\w+)(\.v3)?(\.\w+)?(\+json)?$/, `application/vnd$1$2.${options.mediaType.format}`)).join(",");
    }

    if (options.mediaType.previews.length) {
      const previewsFromAcceptHeader = headers.accept.match(/[\w-]+(?=-preview)/g) || [];
      headers.accept = previewsFromAcceptHeader.concat(options.mediaType.previews).map(preview => {
        const format = options.mediaType.format ? `.${options.mediaType.format}` : "+json";
        return `application/vnd.github.${preview}-preview${format}`;
      }).join(",");
    }
  } // for GET/HEAD requests, set URL query parameters from remaining parameters
  // for PATCH/POST/PUT/DELETE requests, set request body from remaining parameters


  if (["GET", "HEAD"].includes(method)) {
    url = addQueryParameters(url, remainingParameters);
  } else {
    if ("data" in remainingParameters) {
      body = remainingParameters.data;
    } else {
      if (Object.keys(remainingParameters).length) {
        body = remainingParameters;
      } else {
        headers["content-length"] = 0;
      }
    }
  } // default content-type for JSON if body is set


  if (!headers["content-type"] && typeof body !== "undefined") {
    headers["content-type"] = "application/json; charset=utf-8";
  } // GitHub expects 'content-length: 0' header for PUT/PATCH requests without body.
  // fetch does not allow to set `content-length` header, but we can set body to an empty string


  if (["PATCH", "PUT"].includes(method) && typeof body === "undefined") {
    body = "";
  } // Only return body/request keys if present


  return Object.assign({
    method,
    url,
    headers
  }, typeof body !== "undefined" ? {
    body
  } : null, options.request ? {
    request: options.request
  } : null);
}

function endpointWithDefaults(defaults, route, options) {
  return parse(merge(defaults, route, options));
}

function withDefaults(oldDefaults, newDefaults) {
  const DEFAULTS = merge(oldDefaults, newDefaults);
  const endpoint = endpointWithDefaults.bind(null, DEFAULTS);
  return Object.assign(endpoint, {
    DEFAULTS,
    defaults: withDefaults.bind(null, DEFAULTS),
    merge: merge.bind(null, DEFAULTS),
    parse
  });
}

const VERSION = "0.0.0-development";

const userAgent = `octokit-endpoint.js/${VERSION} ${universalUserAgent.getUserAgent()}`;
const DEFAULTS = {
  method: "GET",
  baseUrl: "https://api.github.com",
  headers: {
    accept: "application/vnd.github.v3+json",
    "user-agent": userAgent
  },
  mediaType: {
    format: "",
    previews: []
  }
};

const endpoint = withDefaults(null, DEFAULTS);

exports.endpoint = endpoint;


},{"is-plain-object":3,"universal-user-agent":115}],3:[function(require,module,exports){
'use strict';

/*!
 * isobject <https://github.com/jonschlinkert/isobject>
 *
 * Copyright (c) 2014-2017, Jon Schlinkert.
 * Released under the MIT License.
 */

function isObject(val) {
  return val != null && typeof val === 'object' && Array.isArray(val) === false;
}

/*!
 * is-plain-object <https://github.com/jonschlinkert/is-plain-object>
 *
 * Copyright (c) 2014-2017, Jon Schlinkert.
 * Released under the MIT License.
 */

function isObjectObject(o) {
  return isObject(o) === true
    && Object.prototype.toString.call(o) === '[object Object]';
}

function isPlainObject(o) {
  var ctor,prot;

  if (isObjectObject(o) === false) return false;

  // If has modified constructor
  ctor = o.constructor;
  if (typeof ctor !== 'function') return false;

  // If has modified prototype
  prot = ctor.prototype;
  if (isObjectObject(prot) === false) return false;

  // If constructor does not have an Object-specific method
  if (prot.hasOwnProperty('isPrototypeOf') === false) {
    return false;
  }

  // Most likely a plain Object
  return true;
}

module.exports = isPlainObject;

},{}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var deprecation = require('deprecation');
var once = _interopDefault(require('once'));

const logOnce = once(deprecation => console.warn(deprecation));
/**
 * Error with extra properties to help with debugging
 */

class RequestError extends Error {
  constructor(message, statusCode, options) {
    super(message); // Maintains proper stack trace (only available on V8)

    /* istanbul ignore next */

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }

    this.name = "HttpError";
    this.status = statusCode;
    Object.defineProperty(this, "code", {
      get() {
        logOnce(new deprecation.Deprecation("[@octokit/request-error] `error.code` is deprecated, use `error.status`."));
        return statusCode;
      }

    });
    this.headers = options.headers; // redact request credentials without mutating original request options

    const requestCopy = Object.assign({}, options.request);

    if (options.request.headers.authorization) {
      requestCopy.headers = Object.assign({}, options.request.headers, {
        authorization: options.request.headers.authorization.replace(/ .*$/, " [REDACTED]")
      });
    }

    requestCopy.url = requestCopy.url // client_id & client_secret can be passed as URL query parameters to increase rate limit
    // see https://developer.github.com/v3/#increasing-the-unauthenticated-rate-limit-for-oauth-applications
    .replace(/\bclient_secret=\w+/g, "client_secret=[REDACTED]") // OAuth tokens can be passed as URL query parameters, although it is not recommended
    // see https://developer.github.com/v3/#oauth2-token-sent-in-a-header
    .replace(/\baccess_token=\w+/g, "access_token=[REDACTED]");
    this.request = requestCopy;
  }

}

exports.RequestError = RequestError;

},{"deprecation":73,"once":104}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var endpoint = require('@octokit/endpoint');
var universalUserAgent = require('universal-user-agent');
var isPlainObject = _interopDefault(require('is-plain-object'));
var nodeFetch = _interopDefault(require('node-fetch'));
var requestError = require('@octokit/request-error');

const VERSION = "0.0.0-development";

function getBufferResponse(response) {
  return response.arrayBuffer();
}

function fetchWrapper(requestOptions) {
  if (isPlainObject(requestOptions.body) || Array.isArray(requestOptions.body)) {
    requestOptions.body = JSON.stringify(requestOptions.body);
  }

  let headers = {};
  let status;
  let url;
  const fetch = requestOptions.request && requestOptions.request.fetch || nodeFetch;
  return fetch(requestOptions.url, Object.assign({
    method: requestOptions.method,
    body: requestOptions.body,
    headers: requestOptions.headers,
    redirect: requestOptions.redirect
  }, requestOptions.request)).then(response => {
    url = response.url;
    status = response.status;

    for (const keyAndValue of response.headers) {
      headers[keyAndValue[0]] = keyAndValue[1];
    }

    if (status === 204 || status === 205) {
      return;
    } // GitHub API returns 200 for HEAD requsets


    if (requestOptions.method === "HEAD") {
      if (status < 400) {
        return;
      }

      throw new requestError.RequestError(response.statusText, status, {
        headers,
        request: requestOptions
      });
    }

    if (status === 304) {
      throw new requestError.RequestError("Not modified", status, {
        headers,
        request: requestOptions
      });
    }

    if (status >= 400) {
      return response.text().then(message => {
        const error = new requestError.RequestError(message, status, {
          headers,
          request: requestOptions
        });

        try {
          Object.assign(error, JSON.parse(error.message));
        } catch (e) {// ignore, see octokit/rest.js#684
        }

        throw error;
      });
    }

    const contentType = response.headers.get("content-type");

    if (/application\/json/.test(contentType)) {
      return response.json();
    }

    if (!contentType || /^text\/|charset=utf-8$/.test(contentType)) {
      return response.text();
    }

    return getBufferResponse(response);
  }).then(data => {
    return {
      status,
      url,
      headers,
      data
    };
  }).catch(error => {
    if (error instanceof requestError.RequestError) {
      throw error;
    }

    throw new requestError.RequestError(error.message, 500, {
      headers,
      request: requestOptions
    });
  });
}

function withDefaults(oldEndpoint, newDefaults) {
  const endpoint = oldEndpoint.defaults(newDefaults);

  const newApi = function (route, parameters) {
    const endpointOptions = endpoint.merge(route, parameters);

    if (!endpointOptions.request || !endpointOptions.request.hook) {
      return fetchWrapper(endpoint.parse(endpointOptions));
    }

    const request = (route, parameters) => {
      return fetchWrapper(endpoint.parse(endpoint.merge(route, parameters)));
    };

    Object.assign(request, {
      endpoint,
      defaults: withDefaults.bind(null, endpoint)
    });
    return endpointOptions.request.hook(request, endpointOptions);
  };

  return Object.assign(newApi, {
    endpoint,
    defaults: withDefaults.bind(null, endpoint)
  });
}

const request = withDefaults(endpoint.endpoint, {
  headers: {
    "user-agent": `octokit-request.js/${VERSION} ${universalUserAgent.getUserAgent()}`
  }
});

exports.request = request;


},{"@octokit/endpoint":2,"@octokit/request-error":4,"is-plain-object":6,"node-fetch":89,"universal-user-agent":115}],6:[function(require,module,exports){
arguments[4][3][0].apply(exports,arguments)
},{"dup":3}],7:[function(require,module,exports){
const Octokit = require('./lib/core')

const CORE_PLUGINS = [
  require('./plugins/log'),
  require('./plugins/authentication-deprecated'), // deprecated: remove in v17
  require('./plugins/authentication'),
  require('./plugins/pagination'),
  require('./plugins/normalize-git-reference-responses'),
  require('./plugins/register-endpoints'),
  require('./plugins/rest-api-endpoints'),
  require('./plugins/validate'),

  require('octokit-pagination-methods') // deprecated: remove in v17
]

module.exports = Octokit.plugin(CORE_PLUGINS)

},{"./lib/core":9,"./plugins/authentication":19,"./plugins/authentication-deprecated":16,"./plugins/log":23,"./plugins/normalize-git-reference-responses":24,"./plugins/pagination":25,"./plugins/register-endpoints":29,"./plugins/rest-api-endpoints":31,"./plugins/validate":33,"octokit-pagination-methods":91}],8:[function(require,module,exports){
module.exports = Octokit

const { request } = require('@octokit/request')
const Hook = require('before-after-hook')

const parseClientOptions = require('./parse-client-options')

function Octokit (plugins, options) {
  options = options || {}
  const hook = new Hook.Collection()
  const log = Object.assign({
    debug: () => {},
    info: () => {},
    warn: console.warn,
    error: console.error
  }, options && options.log)
  const api = {
    hook,
    log,
    request: request.defaults(parseClientOptions(options, log, hook))
  }

  plugins.forEach(pluginFunction => pluginFunction(api, options))

  return api
}

},{"./parse-client-options":11,"@octokit/request":5,"before-after-hook":62}],9:[function(require,module,exports){
const factory = require('./factory')

module.exports = factory()

},{"./factory":10}],10:[function(require,module,exports){
module.exports = factory

const Octokit = require('./constructor')
const registerPlugin = require('./register-plugin')

function factory (plugins) {
  const Api = Octokit.bind(null, plugins || [])
  Api.plugin = registerPlugin.bind(null, plugins || [])
  return Api
}

},{"./constructor":8,"./register-plugin":12}],11:[function(require,module,exports){
module.exports = parseOptions

const { Deprecation } = require('deprecation')
const { getUserAgent } = require('universal-user-agent')
const once = require('once')

const pkg = require('../package.json')

const deprecateOptionsTimeout = once((log, deprecation) => log.warn(deprecation))
const deprecateOptionsAgent = once((log, deprecation) => log.warn(deprecation))
const deprecateOptionsHeaders = once((log, deprecation) => log.warn(deprecation))

function parseOptions (options, log, hook) {
  if (options.headers) {
    options.headers = Object.keys(options.headers).reduce((newObj, key) => {
      newObj[key.toLowerCase()] = options.headers[key]
      return newObj
    }, {})
  }

  const clientDefaults = {
    headers: options.headers || {},
    request: options.request || {},
    mediaType: {
      previews: [],
      format: ''
    }
  }

  if (options.baseUrl) {
    clientDefaults.baseUrl = options.baseUrl
  }

  if (options.userAgent) {
    clientDefaults.headers['user-agent'] = options.userAgent
  }

  if (options.previews) {
    clientDefaults.mediaType.previews = options.previews
  }

  if (options.timeout) {
    deprecateOptionsTimeout(log, new Deprecation('[@octokit/rest] new Octokit({timeout}) is deprecated. Use {request: {timeout}} instead. See https://github.com/octokit/request.js#request'))
    clientDefaults.request.timeout = options.timeout
  }

  if (options.agent) {
    deprecateOptionsAgent(log, new Deprecation('[@octokit/rest] new Octokit({agent}) is deprecated. Use {request: {agent}} instead. See https://github.com/octokit/request.js#request'))
    clientDefaults.request.agent = options.agent
  }

  if (options.headers) {
    deprecateOptionsHeaders(log, new Deprecation('[@octokit/rest] new Octokit({headers}) is deprecated. Use {userAgent, previews} instead. See https://github.com/octokit/request.js#request'))
  }

  const userAgentOption = clientDefaults.headers['user-agent']
  const defaultUserAgent = `octokit.js/${pkg.version} ${getUserAgent()}`

  clientDefaults.headers['user-agent'] = [userAgentOption, defaultUserAgent].filter(Boolean).join(' ')

  clientDefaults.request.hook = hook.bind(null, 'request')

  return clientDefaults
}

},{"../package.json":13,"deprecation":73,"once":104,"universal-user-agent":115}],12:[function(require,module,exports){
module.exports = registerPlugin

const factory = require('./factory')

function registerPlugin (plugins, pluginFunction) {
  return factory(plugins.includes(pluginFunction) ? plugins : plugins.concat(pluginFunction))
}

},{"./factory":10}],13:[function(require,module,exports){
module.exports={
  "_from": "@octokit/rest",
  "_id": "@octokit/rest@16.28.9",
  "_inBundle": false,
  "_integrity": "sha512-IKGnX+Tvzt7XHhs8f4ajqxyJvYAMNX5nWfoJm4CQj8LZToMiaJgutf5KxxpxoC3y5w7JTJpW5rnWnF4TsIvCLA==",
  "_location": "/@octokit/rest",
  "_phantomChildren": {},
  "_requested": {
    "type": "tag",
    "registry": true,
    "raw": "@octokit/rest",
    "name": "@octokit/rest",
    "escapedName": "@octokit%2frest",
    "scope": "@octokit",
    "rawSpec": "",
    "saveSpec": null,
    "fetchSpec": "latest"
  },
  "_requiredBy": [
    "#USER",
    "/"
  ],
  "_resolved": "https://registry.npmjs.org/@octokit/rest/-/rest-16.28.9.tgz",
  "_shasum": "ac8c5f3ff305e9e0a0989a5245e4286f057a95d7",
  "_spec": "@octokit/rest",
  "_where": "/home/bryan/repos/TwentySeconds/js",
  "author": {
    "name": "Gregor Martynus",
    "url": "https://github.com/gr2m"
  },
  "bugs": {
    "url": "https://github.com/octokit/rest.js/issues"
  },
  "bundleDependencies": false,
  "bundlesize": [
    {
      "path": "./dist/octokit-rest.min.js.gz",
      "maxSize": "33 kB"
    }
  ],
  "contributors": [
    {
      "name": "Mike de Boer",
      "email": "info@mikedeboer.nl"
    },
    {
      "name": "Fabian Jakobs",
      "email": "fabian@c9.io"
    },
    {
      "name": "Joe Gallo",
      "email": "joe@brassafrax.com"
    },
    {
      "name": "Gregor Martynus",
      "url": "https://github.com/gr2m"
    }
  ],
  "dependencies": {
    "@octokit/request": "^5.0.0",
    "@octokit/request-error": "^1.0.2",
    "atob-lite": "^2.0.0",
    "before-after-hook": "^2.0.0",
    "btoa-lite": "^1.0.0",
    "deprecation": "^2.0.0",
    "lodash.get": "^4.4.2",
    "lodash.set": "^4.3.2",
    "lodash.uniq": "^4.5.0",
    "octokit-pagination-methods": "^1.1.0",
    "once": "^1.4.0",
    "universal-user-agent": "^4.0.0"
  },
  "deprecated": false,
  "description": "GitHub REST API client for Node.js",
  "devDependencies": {
    "@gimenete/type-writer": "^0.1.3",
    "@octokit/fixtures-server": "^5.0.1",
    "@octokit/routes": "20.9.2",
    "@types/node": "^12.0.0",
    "bundlesize": "^0.18.0",
    "chai": "^4.1.2",
    "compression-webpack-plugin": "^3.0.0",
    "coveralls": "^3.0.0",
    "glob": "^7.1.2",
    "http-proxy-agent": "^2.1.0",
    "lodash.camelcase": "^4.3.0",
    "lodash.merge": "^4.6.1",
    "lodash.upperfirst": "^4.3.1",
    "mkdirp": "^0.5.1",
    "mocha": "^6.0.0",
    "mustache": "^3.0.0",
    "nock": "^10.0.0",
    "npm-run-all": "^4.1.2",
    "nyc": "^14.0.0",
    "prettier": "^1.14.2",
    "proxy": "^0.2.4",
    "semantic-release": "^15.0.0",
    "sinon": "^7.2.4",
    "sinon-chai": "^3.0.0",
    "sort-keys": "^4.0.0",
    "standard": "^14.0.2",
    "string-to-arraybuffer": "^1.0.0",
    "string-to-jsdoc-comment": "^1.0.0",
    "typescript": "^3.3.1",
    "webpack": "^4.0.0",
    "webpack-bundle-analyzer": "^3.0.0",
    "webpack-cli": "^3.0.0"
  },
  "files": [
    "index.js",
    "index.d.ts",
    "lib",
    "plugins"
  ],
  "homepage": "https://github.com/octokit/rest.js#readme",
  "keywords": [
    "octokit",
    "github",
    "rest",
    "api-client"
  ],
  "license": "MIT",
  "name": "@octokit/rest",
  "nyc": {
    "ignore": [
      "test"
    ]
  },
  "publishConfig": {
    "access": "public"
  },
  "release": {
    "publish": [
      "@semantic-release/npm",
      {
        "path": "@semantic-release/github",
        "assets": [
          "dist/*",
          "!dist/*.map.gz"
        ]
      }
    ]
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/octokit/rest.js.git"
  },
  "scripts": {
    "build": "npm-run-all build:*",
    "build:browser": "npm-run-all build:browser:*",
    "build:browser:development": "webpack --mode development --entry . --output-library=Octokit --output=./dist/octokit-rest.js --profile --json > dist/bundle-stats.json",
    "build:browser:production": "webpack --mode production --entry . --plugin=compression-webpack-plugin --output-library=Octokit --output-path=./dist --output-filename=octokit-rest.min.js --devtool source-map",
    "build:ts": "node scripts/generate-types",
    "coverage": "nyc report --reporter=html && open coverage/index.html",
    "generate-bundle-report": "webpack-bundle-analyzer dist/bundle-stats.json --mode=static --no-open --report dist/bundle-report.html",
    "generate-routes": "node scripts/generate-routes",
    "postvalidate:ts": "tsc --noEmit --target es6 test/typescript-validate.ts",
    "prebuild:browser": "mkdirp dist/",
    "pretest": "standard",
    "prevalidate:ts": "npm run -s build:ts",
    "start-fixtures-server": "octokit-fixtures-server",
    "test": "nyc mocha test/mocha-node-setup.js \"test/*/**/*-test.js\"",
    "test:browser": "cypress run --browser chrome",
    "test:memory": "mocha test/memory-test",
    "validate:ts": "tsc --target es6 --noImplicitAny index.d.ts"
  },
  "standard": {
    "globals": [
      "describe",
      "before",
      "beforeEach",
      "afterEach",
      "after",
      "it",
      "expect",
      "cy"
    ],
    "ignore": [
      "/docs"
    ]
  },
  "types": "index.d.ts",
  "version": "16.28.9"
}

},{}],14:[function(require,module,exports){
module.exports = authenticate

const { Deprecation } = require('deprecation')
const once = require('once')

const deprecateAuthenticate = once((log, deprecation) => log.warn(deprecation))

function authenticate (state, options) {
  deprecateAuthenticate(state.octokit.log, new Deprecation('[@octokit/rest] octokit.authenticate() is deprecated. Use "auth" constructor option instead.'))

  if (!options) {
    state.auth = false
    return
  }

  switch (options.type) {
    case 'basic':
      if (!options.username || !options.password) {
        throw new Error('Basic authentication requires both a username and password to be set')
      }
      break

    case 'oauth':
      if (!options.token && !(options.key && options.secret)) {
        throw new Error('OAuth2 authentication requires a token or key & secret to be set')
      }
      break

    case 'token':
    case 'app':
      if (!options.token) {
        throw new Error('Token authentication requires a token to be set')
      }
      break

    default:
      throw new Error("Invalid authentication type, must be 'basic', 'oauth', 'token' or 'app'")
  }

  state.auth = options
}

},{"deprecation":73,"once":104}],15:[function(require,module,exports){
module.exports = authenticationBeforeRequest

const btoa = require('btoa-lite')
const uniq = require('lodash.uniq')

function authenticationBeforeRequest (state, options) {
  if (!state.auth.type) {
    return
  }

  if (state.auth.type === 'basic') {
    const hash = btoa(`${state.auth.username}:${state.auth.password}`)
    options.headers.authorization = `Basic ${hash}`
    return
  }

  if (state.auth.type === 'token') {
    options.headers.authorization = `token ${state.auth.token}`
    return
  }

  if (state.auth.type === 'app') {
    options.headers.authorization = `Bearer ${state.auth.token}`
    const acceptHeaders = options.headers.accept.split(',')
      .concat('application/vnd.github.machine-man-preview+json')
    options.headers.accept = uniq(acceptHeaders).filter(Boolean).join(',')
    return
  }

  options.url += options.url.indexOf('?') === -1 ? '?' : '&'

  if (state.auth.token) {
    options.url += `access_token=${encodeURIComponent(state.auth.token)}`
    return
  }

  const key = encodeURIComponent(state.auth.key)
  const secret = encodeURIComponent(state.auth.secret)
  options.url += `client_id=${key}&client_secret=${secret}`
}

},{"btoa-lite":66,"lodash.uniq":86}],16:[function(require,module,exports){
module.exports = authenticationPlugin

const { Deprecation } = require('deprecation')
const once = require('once')

const deprecateAuthenticate = once((log, deprecation) => log.warn(deprecation))

const authenticate = require('./authenticate')
const beforeRequest = require('./before-request')
const requestError = require('./request-error')

function authenticationPlugin (octokit, options) {
  if (options.auth) {
    octokit.authenticate = () => {
      deprecateAuthenticate(octokit.log, new Deprecation('[@octokit/rest] octokit.authenticate() is deprecated and has no effect when "auth" option is set on Octokit constructor'))
    }
    return
  }
  const state = {
    octokit,
    auth: false
  }
  octokit.authenticate = authenticate.bind(null, state)
  octokit.hook.before('request', beforeRequest.bind(null, state))
  octokit.hook.error('request', requestError.bind(null, state))
}

},{"./authenticate":14,"./before-request":15,"./request-error":17,"deprecation":73,"once":104}],17:[function(require,module,exports){
module.exports = authenticationRequestError

const { RequestError } = require('@octokit/request-error')

function authenticationRequestError (state, error, options) {
  /* istanbul ignore next */
  if (!error.headers) throw error

  const otpRequired = /required/.test(error.headers['x-github-otp'] || '')
  // handle "2FA required" error only
  if (error.status !== 401 || !otpRequired) {
    throw error
  }

  if (error.status === 401 && otpRequired && error.request && error.request.headers['x-github-otp']) {
    throw new RequestError('Invalid one-time password for two-factor authentication', 401, {
      headers: error.headers,
      request: options
    })
  }

  if (typeof state.auth.on2fa !== 'function') {
    throw new RequestError('2FA required, but options.on2fa is not a function. See https://github.com/octokit/rest.js#authentication', 401, {
      headers: error.headers,
      request: options
    })
  }

  return Promise.resolve()
    .then(() => {
      return state.auth.on2fa()
    })
    .then((oneTimePassword) => {
      const newOptions = Object.assign(options, {
        headers: Object.assign({ 'x-github-otp': oneTimePassword }, options.headers)
      })
      return state.octokit.request(newOptions)
    })
}

},{"@octokit/request-error":4}],18:[function(require,module,exports){
module.exports = authenticationBeforeRequest

const btoa = require('btoa-lite')

const withAuthorizationPrefix = require('./with-authorization-prefix')

function authenticationBeforeRequest (state, options) {
  if (typeof state.auth === 'string') {
    options.headers.authorization = withAuthorizationPrefix(state.auth)

    // https://developer.github.com/v3/previews/#integrations
    if (/^bearer /i.test(state.auth) && !/machine-man/.test(options.headers.accept)) {
      const acceptHeaders = options.headers.accept.split(',')
        .concat('application/vnd.github.machine-man-preview+json')
      options.headers.accept = acceptHeaders.filter(Boolean).join(',')
    }

    return
  }

  if (state.auth.username) {
    const hash = btoa(`${state.auth.username}:${state.auth.password}`)
    options.headers.authorization = `Basic ${hash}`
    if (state.otp) {
      options.headers['x-github-otp'] = state.otp
    }
    return
  }

  if (state.auth.clientId) {
    // There is a special case for OAuth applications, when `clientId` and `clientSecret` is passed as
    // Basic Authorization instead of query parameters. The only routes where that applies share the same
    // URL though: `/applications/:client_id/tokens/:access_token`.
    //
    //  1. [Check an authorization](https://developer.github.com/v3/oauth_authorizations/#check-an-authorization)
    //  2. [Reset an authorization](https://developer.github.com/v3/oauth_authorizations/#reset-an-authorization)
    //  3. [Revoke an authorization for an application](https://developer.github.com/v3/oauth_authorizations/#revoke-an-authorization-for-an-application)
    //
    // We identify by checking the URL. It must merge both "/applications/:client_id/tokens/:access_token"
    // as well as "/applications/123/tokens/token456"
    if (/\/applications\/:?[\w_]+\/tokens\/:?[\w_]+($|\?)/.test(options.url)) {
      const hash = btoa(`${state.auth.clientId}:${state.auth.clientSecret}`)
      options.headers.authorization = `Basic ${hash}`
      return
    }

    options.url += options.url.indexOf('?') === -1 ? '?' : '&'
    options.url += `client_id=${state.auth.clientId}&client_secret=${state.auth.clientSecret}`
    return
  }

  return Promise.resolve()

    .then(() => {
      return state.auth()
    })

    .then((authorization) => {
      options.headers.authorization = withAuthorizationPrefix(authorization)
    })
}

},{"./with-authorization-prefix":22,"btoa-lite":66}],19:[function(require,module,exports){
module.exports = authenticationPlugin

const beforeRequest = require('./before-request')
const requestError = require('./request-error')
const validate = require('./validate')

function authenticationPlugin (octokit, options) {
  if (!options.auth) {
    return
  }

  validate(options.auth)

  const state = {
    octokit,
    auth: options.auth
  }

  octokit.hook.before('request', beforeRequest.bind(null, state))
  octokit.hook.error('request', requestError.bind(null, state))
}

},{"./before-request":18,"./request-error":20,"./validate":21}],20:[function(require,module,exports){
module.exports = authenticationRequestError

const { RequestError } = require('@octokit/request-error')

function authenticationRequestError (state, error, options) {
  if (!error.headers) throw error

  const otpRequired = /required/.test(error.headers['x-github-otp'] || '')
  // handle "2FA required" error only
  if (error.status !== 401 || !otpRequired) {
    throw error
  }

  if (error.status === 401 && otpRequired && error.request && error.request.headers['x-github-otp']) {
    if (state.otp) {
      delete state.otp // no longer valid, request again
    } else {
      throw new RequestError('Invalid one-time password for two-factor authentication', 401, {
        headers: error.headers,
        request: options
      })
    }
  }

  if (typeof state.auth.on2fa !== 'function') {
    throw new RequestError('2FA required, but options.on2fa is not a function. See https://github.com/octokit/rest.js#authentication', 401, {
      headers: error.headers,
      request: options
    })
  }

  return Promise.resolve()
    .then(() => {
      return state.auth.on2fa()
    })
    .then((oneTimePassword) => {
      const newOptions = Object.assign(options, {
        headers: Object.assign(options.headers, { 'x-github-otp': oneTimePassword })
      })
      return state.octokit.request(newOptions)
        .then(response => {
          // If OTP still valid, then persist it for following requests
          state.otp = oneTimePassword
          return response
        })
    })
}

},{"@octokit/request-error":4}],21:[function(require,module,exports){
module.exports = validateAuth

function validateAuth (auth) {
  if (typeof auth === 'string') {
    return
  }

  if (typeof auth === 'function') {
    return
  }

  if (auth.username && auth.password) {
    return
  }

  if (auth.clientId && auth.clientSecret) {
    return
  }

  throw new Error(`Invalid "auth" option: ${JSON.stringify(auth)}`)
}

},{}],22:[function(require,module,exports){
module.exports = withAuthorizationPrefix

const atob = require('atob-lite')

const REGEX_IS_BASIC_AUTH = /^[\w-]+:/

function withAuthorizationPrefix (authorization) {
  if (/^(basic|bearer|token) /i.test(authorization)) {
    return authorization
  }

  try {
    if (REGEX_IS_BASIC_AUTH.test(atob(authorization))) {
      return `basic ${authorization}`
    }
  } catch (error) { }

  if (authorization.split(/\./).length === 3) {
    return `bearer ${authorization}`
  }

  return `token ${authorization}`
}

},{"atob-lite":35}],23:[function(require,module,exports){
module.exports = octokitDebug

function octokitDebug (octokit) {
  octokit.hook.wrap('request', (request, options) => {
    octokit.log.debug('request', options)
    const start = Date.now()
    const requestOptions = octokit.request.endpoint.parse(options)
    const path = requestOptions.url.replace(options.baseUrl, '')

    return request(options)

      .then(response => {
        octokit.log.info(`${requestOptions.method} ${path} - ${response.status} in ${Date.now() - start}ms`)
        return response
      })

      .catch(error => {
        octokit.log.info(`${requestOptions.method} ${path} - ${error.status} in ${Date.now() - start}ms`)
        throw error
      })
  })
}

},{}],24:[function(require,module,exports){
module.exports = octokitRestNormalizeGitReferenceResponses

const { RequestError } = require('@octokit/request-error')

function octokitRestNormalizeGitReferenceResponses (octokit) {
  octokit.hook.wrap('request', (request, options) => {
    const isGetOrListRefRequest = /\/repos\/:?\w+\/:?\w+\/git\/refs\/:?\w+/.test(options.url)

    if (!isGetOrListRefRequest) {
      return request(options)
    }

    const isGetRefRequest = 'ref' in options

    return request(options)
      .then(response => {
        // request single reference
        if (isGetRefRequest) {
          if (Array.isArray(response.data)) {
            throw new RequestError(`More than one reference found for "${options.ref}"`, 404, {
              request: options
            })
          }

          // ✅ received single reference
          return response
        }

        // request list of references
        if (!Array.isArray(response.data)) {
          response.data = [response.data]
        }

        return response
      })

      .catch(error => {
        if (isGetRefRequest) {
          throw error
        }

        if (error.status === 404) {
          return {
            status: 200,
            headers: error.headers,
            data: []
          }
        }

        throw error
      })
  })
}

},{"@octokit/request-error":4}],25:[function(require,module,exports){
module.exports = paginatePlugin

const iterator = require('./iterator')
const paginate = require('./paginate')

function paginatePlugin (octokit) {
  octokit.paginate = paginate.bind(null, octokit)
  octokit.paginate.iterator = iterator.bind(null, octokit)
}

},{"./iterator":26,"./paginate":28}],26:[function(require,module,exports){
module.exports = iterator

const normalizePaginatedListResponse = require('./normalize-paginated-list-response')

function iterator (octokit, options) {
  const headers = options.headers
  let url = octokit.request.endpoint(options).url

  return {
    [Symbol.asyncIterator]: () => ({
      next () {
        if (!url) {
          return Promise.resolve({ done: true })
        }

        return octokit.request({ url, headers })

          .then((response) => {
            normalizePaginatedListResponse(octokit, url, response)

            // `response.headers.link` format:
            // '<https://api.github.com/users/aseemk/followers?page=2>; rel="next", <https://api.github.com/users/aseemk/followers?page=2>; rel="last"'
            // sets `url` to undefined if "next" URL is not present or `link` header is not set
            url = ((response.headers.link || '').match(/<([^>]+)>;\s*rel="next"/) || [])[1]

            return { value: response }
          })
      }
    })
  }
}

},{"./normalize-paginated-list-response":27}],27:[function(require,module,exports){
/**
 * Some “list” response that can be paginated have a different response structure
 *
 * They have a `total_count` key in the response (search also has `incomplete_results`,
 * /installation/repositories also has `repository_selection`), as well as a key with
 * the list of the items which name varies from endpoint to endpoint:
 *
 * - https://developer.github.com/v3/search/#example (key `items`)
 * - https://developer.github.com/v3/checks/runs/#response-3 (key: `check_runs`)
 * - https://developer.github.com/v3/checks/suites/#response-1 (key: `check_suites`)
 * - https://developer.github.com/v3/apps/installations/#list-repositories (key: `repositories`)
 * - https://developer.github.com/v3/apps/installations/#list-installations-for-a-user (key `installations`)
 *
 * Octokit normalizes these responses so that paginated results are always returned following
 * the same structure. One challenge is that if the list response has only one page, no Link
 * header is provided, so this header alone is not sufficient to check wether a response is
 * paginated or not. For the exceptions with the namespace, a fallback check for the route
 * paths has to be added in order to normalize the response. We cannot check for the total_count
 * property because it also exists in the response of Get the combined status for a specific ref.
 */

module.exports = normalizePaginatedListResponse

const { Deprecation } = require('deprecation')
const once = require('once')

const deprecateIncompleteResults = once((log, deprecation) => log.warn(deprecation))
const deprecateTotalCount = once((log, deprecation) => log.warn(deprecation))
const deprecateNamespace = once((log, deprecation) => log.warn(deprecation))

const REGEX_IS_SEARCH_PATH = /^\/search\//
const REGEX_IS_CHECKS_PATH = /^\/repos\/[^/]+\/[^/]+\/commits\/[^/]+\/(check-runs|check-suites)/
const REGEX_IS_INSTALLATION_REPOSITORIES_PATH = /^\/installation\/repositories/
const REGEX_IS_USER_INSTALLATIONS_PATH = /^\/user\/installations/

function normalizePaginatedListResponse (octokit, url, response) {
  const path = url.replace(octokit.request.endpoint.DEFAULTS.baseUrl, '')
  if (
    !REGEX_IS_SEARCH_PATH.test(path) &&
    !REGEX_IS_CHECKS_PATH.test(path) &&
    !REGEX_IS_INSTALLATION_REPOSITORIES_PATH.test(path) &&
    !REGEX_IS_USER_INSTALLATIONS_PATH.test(path)
  ) {
    return
  }

  // keep the additional properties intact to avoid a breaking change,
  // but log a deprecation warning when accessed
  const incompleteResults = response.data.incomplete_results
  const repositorySelection = response.data.repository_selection
  const totalCount = response.data.total_count
  delete response.data.incomplete_results
  delete response.data.repository_selection
  delete response.data.total_count

  const namespaceKey = Object.keys(response.data)[0]

  response.data = response.data[namespaceKey]

  Object.defineProperty(response.data, namespaceKey, {
    get () {
      deprecateNamespace(octokit.log, new Deprecation(`[@octokit/rest] "result.data.${namespaceKey}" is deprecated. Use "result.data" instead`))
      return response.data
    }
  })

  if (typeof incompleteResults !== 'undefined') {
    Object.defineProperty(response.data, 'incomplete_results', {
      get () {
        deprecateIncompleteResults(octokit.log, new Deprecation('[@octokit/rest] "result.data.incomplete_results" is deprecated.'))
        return incompleteResults
      }
    })
  }

  if (typeof repositorySelection !== 'undefined') {
    Object.defineProperty(response.data, 'repository_selection', {
      get () {
        deprecateTotalCount(octokit.log, new Deprecation('[@octokit/rest] "result.data.repository_selection" is deprecated.'))
        return repositorySelection
      }
    })
  }

  Object.defineProperty(response.data, 'total_count', {
    get () {
      deprecateTotalCount(octokit.log, new Deprecation('[@octokit/rest] "result.data.total_count" is deprecated.'))
      return totalCount
    }
  })
}

},{"deprecation":73,"once":104}],28:[function(require,module,exports){
module.exports = paginate

const iterator = require('./iterator')

function paginate (octokit, route, options, mapFn) {
  if (typeof options === 'function') {
    mapFn = options
    options = undefined
  }
  options = octokit.request.endpoint.merge(route, options)
  return gather(octokit, [], iterator(octokit, options)[Symbol.asyncIterator](), mapFn)
}

function gather (octokit, results, iterator, mapFn) {
  return iterator.next()
    .then(result => {
      if (result.done) {
        return results
      }

      let earlyExit = false
      function done () {
        earlyExit = true
      }

      results = results.concat(mapFn ? mapFn(result.value, done) : result.value.data)

      if (earlyExit) {
        return results
      }

      return gather(octokit, results, iterator, mapFn)
    })
}

},{"./iterator":26}],29:[function(require,module,exports){
module.exports = octokitRegisterEndpoints

const registerEndpoints = require('./register-endpoints')

function octokitRegisterEndpoints (octokit) {
  octokit.registerEndpoints = registerEndpoints.bind(null, octokit)
}

},{"./register-endpoints":30}],30:[function(require,module,exports){
module.exports = registerEndpoints

const { Deprecation } = require('deprecation')

function registerEndpoints (octokit, routes) {
  Object.keys(routes).forEach(namespaceName => {
    if (!octokit[namespaceName]) {
      octokit[namespaceName] = {}
    }

    Object.keys(routes[namespaceName]).forEach(apiName => {
      const apiOptions = routes[namespaceName][apiName]

      const endpointDefaults = ['method', 'url', 'headers'].reduce((map, key) => {
        if (typeof apiOptions[key] !== 'undefined') {
          map[key] = apiOptions[key]
        }

        return map
      }, {})

      endpointDefaults.request = {
        validate: apiOptions.params
      }

      let request = octokit.request.defaults(endpointDefaults)

      // patch request & endpoint methods to support deprecated parameters.
      // Not the most elegant solution, but we don’t want to move deprecation
      // logic into octokit/endpoint.js as it’s out of scope
      const hasDeprecatedParam = Object.keys(apiOptions.params || {}).find(key => apiOptions.params[key].deprecated)
      if (hasDeprecatedParam) {
        const patch = patchForDeprecation.bind(null, octokit, apiOptions)
        request = patch(
          octokit.request.defaults(endpointDefaults),
          `.${namespaceName}.${apiName}()`
        )
        request.endpoint = patch(
          request.endpoint,
          `.${namespaceName}.${apiName}.endpoint()`
        )
        request.endpoint.merge = patch(
          request.endpoint.merge,
          `.${namespaceName}.${apiName}.endpoint.merge()`
        )
      }

      if (apiOptions.deprecated) {
        octokit[namespaceName][apiName] = function deprecatedEndpointMethod () {
          octokit.log.warn(new Deprecation(`[@octokit/rest] ${apiOptions.deprecated}`))
          octokit[namespaceName][apiName] = request
          return request.apply(null, arguments)
        }

        return
      }

      octokit[namespaceName][apiName] = request
    })
  })
}

function patchForDeprecation (octokit, apiOptions, method, methodName) {
  const patchedMethod = (options) => {
    options = Object.assign({}, options)

    Object.keys(options).forEach(key => {
      if (apiOptions.params[key] && apiOptions.params[key].deprecated) {
        const aliasKey = apiOptions.params[key].alias

        octokit.log.warn(new Deprecation(`[@octokit/rest] "${key}" parameter is deprecated for "${methodName}". Use "${aliasKey}" instead`))

        if (!(aliasKey in options)) {
          options[aliasKey] = options[key]
        }
        delete options[key]
      }
    })

    return method(options)
  }
  Object.keys(method).forEach(key => {
    patchedMethod[key] = method[key]
  })

  return patchedMethod
}

},{"deprecation":73}],31:[function(require,module,exports){
module.exports = octokitRestApiEndpoints

const ROUTES = require('./routes.json')

function octokitRestApiEndpoints (octokit) {
  // Aliasing scopes for backward compatibility
  // See https://github.com/octokit/rest.js/pull/1134
  ROUTES.gitdata = ROUTES.git
  ROUTES.authorization = ROUTES.oauthAuthorizations
  ROUTES.pullRequests = ROUTES.pulls

  octokit.registerEndpoints(ROUTES)
}

},{"./routes.json":32}],32:[function(require,module,exports){
module.exports={
  "activity": {
    "checkStarringRepo": {
      "method": "GET",
      "params": {
        "owner": {
          "required": true,
          "type": "string"
        },
        "repo": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/user/starred/:owner/:repo"
    },
    "deleteRepoSubscription": {
      "method": "DELETE",
      "params": {
        "owner": {
          "required": true,
          "type": "string"
        },
        "repo": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/subscription"
    },
    "deleteThreadSubscription": {
      "method": "DELETE",
      "params": {
        "thread_id": {
          "required": true,
          "type": "integer"
        }
      },
      "url": "/notifications/threads/:thread_id/subscription"
    },
    "getRepoSubscription": {
      "method": "GET",
      "params": {
        "owner": {
          "required": true,
          "type": "string"
        },
        "repo": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/subscription"
    },
    "getThread": {
      "method": "GET",
      "params": {
        "thread_id": {
          "required": true,
          "type": "integer"
        }
      },
      "url": "/notifications/threads/:thread_id"
    },
    "getThreadSubscription": {
      "method": "GET",
      "params": {
        "thread_id": {
          "required": true,
          "type": "integer"
        }
      },
      "url": "/notifications/threads/:thread_id/subscription"
    },
    "listEventsForOrg": {
      "method": "GET",
      "params": {
        "org": {
          "required": true,
          "type": "string"
        },
        "page": {
          "type": "integer"
        },
        "per_page": {
          "type": "integer"
        },
        "username": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/users/:username/events/orgs/:org"
    },
    "listEventsForUser": {
      "method": "GET",
      "params": {
        "page": {
          "type": "integer"
        },
        "per_page": {
          "type": "integer"
        },
        "username": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/users/:username/events"
    },
    "listFeeds": {
      "method": "GET",
      "params": {},
      "url": "/feeds"
    },
    "listNotifications": {
      "method": "GET",
      "params": {
        "all": {
          "type": "boolean"
        },
        "before": {
          "type": "string"
        },
        "page": {
          "type": "integer"
        },
        "participating": {
          "type": "boolean"
        },
        "per_page": {
          "type": "integer"
        },
        "since": {
          "type": "string"
        }
      },
      "url": "/notifications"
    },
    "listNotificationsForRepo": {
      "method": "GET",
      "params": {
        "all": {
          "type": "boolean"
        },
        "before": {
          "type": "string"
        },
        "owner": {
          "required": true,
          "type": "string"
        },
        "page": {
          "type": "integer"
        },
        "participating": {
          "type": "boolean"
        },
        "per_page": {
          "type": "integer"
        },
        "repo": {
          "required": true,
          "type": "string"
        },
        "since": {
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/notifications"
    },
    "listPublicEvents": {
      "method": "GET",
      "params": {
        "page": {
          "type": "integer"
        },
        "per_page": {
          "type": "integer"
        }
      },
      "url": "/events"
    },
    "listPublicEventsForOrg": {
      "method": "GET",
      "params": {
        "org": {
          "required": true,
          "type": "string"
        },
        "page": {
          "type": "integer"
        },
        "per_page": {
          "type": "integer"
        }
      },
      "url": "/orgs/:org/events"
    },
    "listPublicEventsForRepoNetwork": {
      "method": "GET",
      "params": {
        "owner": {
          "required": true,
          "type": "string"
        },
        "page": {
          "type": "integer"
        },
        "per_page": {
          "type": "integer"
        },
        "repo": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/networks/:owner/:repo/events"
    },
    "listPublicEventsForUser": {
      "method": "GET",
      "params": {
        "page": {
          "type": "integer"
        },
        "per_page": {
          "type": "integer"
        },
        "username": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/users/:username/events/public"
    },
    "listReceivedEventsForUser": {
      "method": "GET",
      "params": {
        "page": {
          "type": "integer"
        },
        "per_page": {
          "type": "integer"
        },
        "username": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/users/:username/received_events"
    },
    "listReceivedPublicEventsForUser": {
      "method": "GET",
      "params": {
        "page": {
          "type": "integer"
        },
        "per_page": {
          "type": "integer"
        },
        "username": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/users/:username/received_events/public"
    },
    "listRepoEvents": {
      "method": "GET",
      "params": {
        "owner": {
          "required": true,
          "type": "string"
        },
        "page": {
          "type": "integer"
        },
        "per_page": {
          "type": "integer"
        },
        "repo": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/events"
    },
    "listReposStarredByAuthenticatedUser": {
      "method": "GET",
      "params": {
        "direction": {
          "enum": [
            "asc",
            "desc"
          ],
          "type": "string"
        },
        "page": {
          "type": "integer"
        },
        "per_page": {
          "type": "integer"
        },
        "sort": {
          "enum": [
            "created",
            "updated"
          ],
          "type": "string"
        }
      },
      "url": "/user/starred"
    },
    "listReposStarredByUser": {
      "method": "GET",
      "params": {
        "direction": {
          "enum": [
            "asc",
            "desc"
          ],
          "type": "string"
        },
        "page": {
          "type": "integer"
        },
        "per_page": {
          "type": "integer"
        },
        "sort": {
          "enum": [
            "created",
            "updated"
          ],
          "type": "string"
        },
        "username": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/users/:username/starred"
    },
    "listReposWatchedByUser": {
      "method": "GET",
      "params": {
        "page": {
          "type": "integer"
        },
        "per_page": {
          "type": "integer"
        },
        "username": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/users/:username/subscriptions"
    },
    "listStargazersForRepo": {
      "method": "GET",
      "params": {
        "owner": {
          "required": true,
          "type": "string"
        },
        "page": {
          "type": "integer"
        },
        "per_page": {
          "type": "integer"
        },
        "repo": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/stargazers"
    },
    "listWatchedReposForAuthenticatedUser": {
      "method": "GET",
      "params": {
        "page": {
          "type": "integer"
        },
        "per_page": {
          "type": "integer"
        }
      },
      "url": "/user/subscriptions"
    },
    "listWatchersForRepo": {
      "method": "GET",
      "params": {
        "owner": {
          "required": true,
          "type": "string"
        },
        "page": {
          "type": "integer"
        },
        "per_page": {
          "type": "integer"
        },
        "repo": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/subscribers"
    },
    "markAsRead": {
      "method": "PUT",
      "params": {
        "last_read_at": {
          "type": "string"
        }
      },
      "url": "/notifications"
    },
    "markNotificationsAsReadForRepo": {
      "method": "PUT",
      "params": {
        "last_read_at": {
          "type": "string"
        },
        "owner": {
          "required": true,
          "type": "string"
        },
        "repo": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/notifications"
    },
    "markThreadAsRead": {
      "method": "PATCH",
      "params": {
        "thread_id": {
          "required": true,
          "type": "integer"
        }
      },
      "url": "/notifications/threads/:thread_id"
    },
    "setRepoSubscription": {
      "method": "PUT",
      "params": {
        "ignored": {
          "type": "boolean"
        },
        "owner": {
          "required": true,
          "type": "string"
        },
        "repo": {
          "required": true,
          "type": "string"
        },
        "subscribed": {
          "type": "boolean"
        }
      },
      "url": "/repos/:owner/:repo/subscription"
    },
    "setThreadSubscription": {
      "method": "PUT",
      "params": {
        "ignored": {
          "type": "boolean"
        },
        "thread_id": {
          "required": true,
          "type": "integer"
        }
      },
      "url": "/notifications/threads/:thread_id/subscription"
    },
    "starRepo": {
      "method": "PUT",
      "params": {
        "owner": {
          "required": true,
          "type": "string"
        },
        "repo": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/user/starred/:owner/:repo"
    },
    "unstarRepo": {
      "method": "DELETE",
      "params": {
        "owner": {
          "required": true,
          "type": "string"
        },
        "repo": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/user/starred/:owner/:repo"
    }
  },
  "apps": {
    "addRepoToInstallation": {
      "headers": {
        "accept": "application/vnd.github.machine-man-preview+json"
      },
      "method": "PUT",
      "params": {
        "installation_id": {
          "required": true,
          "type": "integer"
        },
        "repository_id": {
          "required": true,
          "type": "integer"
        }
      },
      "url": "/user/installations/:installation_id/repositories/:repository_id"
    },
    "checkAccountIsAssociatedWithAny": {
      "method": "GET",
      "params": {
        "account_id": {
          "required": true,
          "type": "integer"
        },
        "page": {
          "type": "integer"
        },
        "per_page": {
          "type": "integer"
        }
      },
      "url": "/marketplace_listing/accounts/:account_id"
    },
    "checkAccountIsAssociatedWithAnyStubbed": {
      "method": "GET",
      "params": {
        "account_id": {
          "required": true,
          "type": "integer"
        },
        "page": {
          "type": "integer"
        },
        "per_page": {
          "type": "integer"
        }
      },
      "url": "/marketplace_listing/stubbed/accounts/:account_id"
    },
    "createContentAttachment": {
      "headers": {
        "accept": "application/vnd.github.corsair-preview+json"
      },
      "method": "POST",
      "params": {
        "body": {
          "required": true,
          "type": "string"
        },
        "content_reference_id": {
          "required": true,
          "type": "integer"
        },
        "title": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/content_references/:content_reference_id/attachments"
    },
    "createFromManifest": {
      "headers": {
        "accept": "application/vnd.github.fury-preview+json"
      },
      "method": "POST",
      "params": {
        "code": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/app-manifests/:code/conversions"
    },
    "createInstallationToken": {
      "headers": {
        "accept": "application/vnd.github.machine-man-preview+json"
      },
      "method": "POST",
      "params": {
        "installation_id": {
          "required": true,
          "type": "integer"
        },
        "permissions": {
          "type": "object"
        },
        "repository_ids": {
          "type": "integer[]"
        }
      },
      "url": "/app/installations/:installation_id/access_tokens"
    },
    "deleteInstallation": {
      "headers": {
        "accept": "application/vnd.github.gambit-preview+json,application/vnd.github.machine-man-preview+json"
      },
      "method": "DELETE",
      "params": {
        "installation_id": {
          "required": true,
          "type": "integer"
        }
      },
      "url": "/app/installations/:installation_id"
    },
    "findOrgInstallation": {
      "deprecated": "octokit.apps.findOrgInstallation() has been renamed to octokit.apps.getOrgInstallation() (2019-04-10)",
      "headers": {
        "accept": "application/vnd.github.machine-man-preview+json"
      },
      "method": "GET",
      "params": {
        "org": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/orgs/:org/installation"
    },
    "findRepoInstallation": {
      "deprecated": "octokit.apps.findRepoInstallation() has been renamed to octokit.apps.getRepoInstallation() (2019-04-10)",
      "headers": {
        "accept": "application/vnd.github.machine-man-preview+json"
      },
      "method": "GET",
      "params": {
        "owner": {
          "required": true,
          "type": "string"
        },
        "repo": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/installation"
    },
    "findUserInstallation": {
      "deprecated": "octokit.apps.findUserInstallation() has been renamed to octokit.apps.getUserInstallation() (2019-04-10)",
      "headers": {
        "accept": "application/vnd.github.machine-man-preview+json"
      },
      "method": "GET",
      "params": {
        "username": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/users/:username/installation"
    },
    "getAuthenticated": {
      "headers": {
        "accept": "application/vnd.github.machine-man-preview+json"
      },
      "method": "GET",
      "params": {},
      "url": "/app"
    },
    "getBySlug": {
      "headers": {
        "accept": "application/vnd.github.machine-man-preview+json"
      },
      "method": "GET",
      "params": {
        "app_slug": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/apps/:app_slug"
    },
    "getInstallation": {
      "headers": {
        "accept": "application/vnd.github.machine-man-preview+json"
      },
      "method": "GET",
      "params": {
        "installation_id": {
          "required": true,
          "type": "integer"
        }
      },
      "url": "/app/installations/:installation_id"
    },
    "getOrgInstallation": {
      "headers": {
        "accept": "application/vnd.github.machine-man-preview+json"
      },
      "method": "GET",
      "params": {
        "org": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/orgs/:org/installation"
    },
    "getRepoInstallation": {
      "headers": {
        "accept": "application/vnd.github.machine-man-preview+json"
      },
      "method": "GET",
      "params": {
        "owner": {
          "required": true,
          "type": "string"
        },
        "repo": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/installation"
    },
    "getUserInstallation": {
      "headers": {
        "accept": "application/vnd.github.machine-man-preview+json"
      },
      "method": "GET",
      "params": {
        "username": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/users/:username/installation"
    },
    "listAccountsUserOrOrgOnPlan": {
      "method": "GET",
      "params": {
        "direction": {
          "enum": [
            "asc",
            "desc"
          ],
          "type": "string"
        },
        "page": {
          "type": "integer"
        },
        "per_page": {
          "type": "integer"
        },
        "plan_id": {
          "required": true,
          "type": "integer"
        },
        "sort": {
          "enum": [
            "created",
            "updated"
          ],
          "type": "string"
        }
      },
      "url": "/marketplace_listing/plans/:plan_id/accounts"
    },
    "listAccountsUserOrOrgOnPlanStubbed": {
      "method": "GET",
      "params": {
        "direction": {
          "enum": [
            "asc",
            "desc"
          ],
          "type": "string"
        },
        "page": {
          "type": "integer"
        },
        "per_page": {
          "type": "integer"
        },
        "plan_id": {
          "required": true,
          "type": "integer"
        },
        "sort": {
          "enum": [
            "created",
            "updated"
          ],
          "type": "string"
        }
      },
      "url": "/marketplace_listing/stubbed/plans/:plan_id/accounts"
    },
    "listInstallationReposForAuthenticatedUser": {
      "headers": {
        "accept": "application/vnd.github.machine-man-preview+json"
      },
      "method": "GET",
      "params": {
        "installation_id": {
          "required": true,
          "type": "integer"
        },
        "page": {
          "type": "integer"
        },
        "per_page": {
          "type": "integer"
        }
      },
      "url": "/user/installations/:installation_id/repositories"
    },
    "listInstallations": {
      "headers": {
        "accept": "application/vnd.github.machine-man-preview+json"
      },
      "method": "GET",
      "params": {
        "page": {
          "type": "integer"
        },
        "per_page": {
          "type": "integer"
        }
      },
      "url": "/app/installations"
    },
    "listInstallationsForAuthenticatedUser": {
      "headers": {
        "accept": "application/vnd.github.machine-man-preview+json"
      },
      "method": "GET",
      "params": {
        "page": {
          "type": "integer"
        },
        "per_page": {
          "type": "integer"
        }
      },
      "url": "/user/installations"
    },
    "listMarketplacePurchasesForAuthenticatedUser": {
      "method": "GET",
      "params": {
        "page": {
          "type": "integer"
        },
        "per_page": {
          "type": "integer"
        }
      },
      "url": "/user/marketplace_purchases"
    },
    "listMarketplacePurchasesForAuthenticatedUserStubbed": {
      "method": "GET",
      "params": {
        "page": {
          "type": "integer"
        },
        "per_page": {
          "type": "integer"
        }
      },
      "url": "/user/marketplace_purchases/stubbed"
    },
    "listPlans": {
      "method": "GET",
      "params": {
        "page": {
          "type": "integer"
        },
        "per_page": {
          "type": "integer"
        }
      },
      "url": "/marketplace_listing/plans"
    },
    "listPlansStubbed": {
      "method": "GET",
      "params": {
        "page": {
          "type": "integer"
        },
        "per_page": {
          "type": "integer"
        }
      },
      "url": "/marketplace_listing/stubbed/plans"
    },
    "listRepos": {
      "headers": {
        "accept": "application/vnd.github.machine-man-preview+json"
      },
      "method": "GET",
      "params": {
        "page": {
          "type": "integer"
        },
        "per_page": {
          "type": "integer"
        }
      },
      "url": "/installation/repositories"
    },
    "removeRepoFromInstallation": {
      "headers": {
        "accept": "application/vnd.github.machine-man-preview+json"
      },
      "method": "DELETE",
      "params": {
        "installation_id": {
          "required": true,
          "type": "integer"
        },
        "repository_id": {
          "required": true,
          "type": "integer"
        }
      },
      "url": "/user/installations/:installation_id/repositories/:repository_id"
    }
  },
  "checks": {
    "create": {
      "headers": {
        "accept": "application/vnd.github.antiope-preview+json"
      },
      "method": "POST",
      "params": {
        "actions": {
          "type": "object[]"
        },
        "actions[].description": {
          "required": true,
          "type": "string"
        },
        "actions[].identifier": {
          "required": true,
          "type": "string"
        },
        "actions[].label": {
          "required": true,
          "type": "string"
        },
        "completed_at": {
          "type": "string"
        },
        "conclusion": {
          "enum": [
            "success",
            "failure",
            "neutral",
            "cancelled",
            "timed_out",
            "action_required"
          ],
          "type": "string"
        },
        "details_url": {
          "type": "string"
        },
        "external_id": {
          "type": "string"
        },
        "head_sha": {
          "required": true,
          "type": "string"
        },
        "name": {
          "required": true,
          "type": "string"
        },
        "output": {
          "type": "object"
        },
        "output.annotations": {
          "type": "object[]"
        },
        "output.annotations[].annotation_level": {
          "enum": [
            "notice",
            "warning",
            "failure"
          ],
          "required": true,
          "type": "string"
        },
        "output.annotations[].end_column": {
          "type": "integer"
        },
        "output.annotations[].end_line": {
          "required": true,
          "type": "integer"
        },
        "output.annotations[].message": {
          "required": true,
          "type": "string"
        },
        "output.annotations[].path": {
          "required": true,
          "type": "string"
        },
        "output.annotations[].raw_details": {
          "type": "string"
        },
        "output.annotations[].start_column": {
          "type": "integer"
        },
        "output.annotations[].start_line": {
          "required": true,
          "type": "integer"
        },
        "output.annotations[].title": {
          "type": "string"
        },
        "output.images": {
          "type": "object[]"
        },
        "output.images[].alt": {
          "required": true,
          "type": "string"
        },
        "output.images[].caption": {
          "type": "string"
        },
        "output.images[].image_url": {
          "required": true,
          "type": "string"
        },
        "output.summary": {
          "required": true,
          "type": "string"
        },
        "output.text": {
          "type": "string"
        },
        "output.title": {
          "required": true,
          "type": "string"
        },
        "owner": {
          "required": true,
          "type": "string"
        },
        "repo": {
          "required": true,
          "type": "string"
        },
        "started_at": {
          "type": "string"
        },
        "status": {
          "enum": [
            "queued",
            "in_progress",
            "completed"
          ],
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/check-runs"
    },
    "createSuite": {
      "headers": {
        "accept": "application/vnd.github.antiope-preview+json"
      },
      "method": "POST",
      "params": {
        "head_sha": {
          "required": true,
          "type": "string"
        },
        "owner": {
          "required": true,
          "type": "string"
        },
        "repo": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/check-suites"
    },
    "get": {
      "headers": {
        "accept": "application/vnd.github.antiope-preview+json"
      },
      "method": "GET",
      "params": {
        "check_run_id": {
          "required": true,
          "type": "integer"
        },
        "owner": {
          "required": true,
          "type": "string"
        },
        "repo": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/check-runs/:check_run_id"
    },
    "getSuite": {
      "headers": {
        "accept": "application/vnd.github.antiope-preview+json"
      },
      "method": "GET",
      "params": {
        "check_suite_id": {
          "required": true,
          "type": "integer"
        },
        "owner": {
          "required": true,
          "type": "string"
        },
        "repo": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/check-suites/:check_suite_id"
    },
    "listAnnotations": {
      "headers": {
        "accept": "application/vnd.github.antiope-preview+json"
      },
      "method": "GET",
      "params": {
        "check_run_id": {
          "required": true,
          "type": "integer"
        },
        "owner": {
          "required": true,
          "type": "string"
        },
        "page": {
          "type": "integer"
        },
        "per_page": {
          "type": "integer"
        },
        "repo": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/check-runs/:check_run_id/annotations"
    },
    "listForRef": {
      "headers": {
        "accept": "application/vnd.github.antiope-preview+json"
      },
      "method": "GET",
      "params": {
        "check_name": {
          "type": "string"
        },
        "filter": {
          "enum": [
            "latest",
            "all"
          ],
          "type": "string"
        },
        "owner": {
          "required": true,
          "type": "string"
        },
        "page": {
          "type": "integer"
        },
        "per_page": {
          "type": "integer"
        },
        "ref": {
          "required": true,
          "type": "string"
        },
        "repo": {
          "required": true,
          "type": "string"
        },
        "status": {
          "enum": [
            "queued",
            "in_progress",
            "completed"
          ],
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/commits/:ref/check-runs"
    },
    "listForSuite": {
      "headers": {
        "accept": "application/vnd.github.antiope-preview+json"
      },
      "method": "GET",
      "params": {
        "check_name": {
          "type": "string"
        },
        "check_suite_id": {
          "required": true,
          "type": "integer"
        },
        "filter": {
          "enum": [
            "latest",
            "all"
          ],
          "type": "string"
        },
        "owner": {
          "required": true,
          "type": "string"
        },
        "page": {
          "type": "integer"
        },
        "per_page": {
          "type": "integer"
        },
        "repo": {
          "required": true,
          "type": "string"
        },
        "status": {
          "enum": [
            "queued",
            "in_progress",
            "completed"
          ],
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/check-suites/:check_suite_id/check-runs"
    },
    "listSuitesForRef": {
      "headers": {
        "accept": "application/vnd.github.antiope-preview+json"
      },
      "method": "GET",
      "params": {
        "app_id": {
          "type": "integer"
        },
        "check_name": {
          "type": "string"
        },
        "owner": {
          "required": true,
          "type": "string"
        },
        "page": {
          "type": "integer"
        },
        "per_page": {
          "type": "integer"
        },
        "ref": {
          "required": true,
          "type": "string"
        },
        "repo": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/commits/:ref/check-suites"
    },
    "rerequestSuite": {
      "headers": {
        "accept": "application/vnd.github.antiope-preview+json"
      },
      "method": "POST",
      "params": {
        "check_suite_id": {
          "required": true,
          "type": "integer"
        },
        "owner": {
          "required": true,
          "type": "string"
        },
        "repo": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/check-suites/:check_suite_id/rerequest"
    },
    "setSuitesPreferences": {
      "headers": {
        "accept": "application/vnd.github.antiope-preview+json"
      },
      "method": "PATCH",
      "params": {
        "auto_trigger_checks": {
          "type": "object[]"
        },
        "auto_trigger_checks[].app_id": {
          "required": true,
          "type": "integer"
        },
        "auto_trigger_checks[].setting": {
          "required": true,
          "type": "boolean"
        },
        "owner": {
          "required": true,
          "type": "string"
        },
        "repo": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/check-suites/preferences"
    },
    "update": {
      "headers": {
        "accept": "application/vnd.github.antiope-preview+json"
      },
      "method": "PATCH",
      "params": {
        "actions": {
          "type": "object[]"
        },
        "actions[].description": {
          "required": true,
          "type": "string"
        },
        "actions[].identifier": {
          "required": true,
          "type": "string"
        },
        "actions[].label": {
          "required": true,
          "type": "string"
        },
        "check_run_id": {
          "required": true,
          "type": "integer"
        },
        "completed_at": {
          "type": "string"
        },
        "conclusion": {
          "enum": [
            "success",
            "failure",
            "neutral",
            "cancelled",
            "timed_out",
            "action_required"
          ],
          "type": "string"
        },
        "details_url": {
          "type": "string"
        },
        "external_id": {
          "type": "string"
        },
        "name": {
          "type": "string"
        },
        "output": {
          "type": "object"
        },
        "output.annotations": {
          "type": "object[]"
        },
        "output.annotations[].annotation_level": {
          "enum": [
            "notice",
            "warning",
            "failure"
          ],
          "required": true,
          "type": "string"
        },
        "output.annotations[].end_column": {
          "type": "integer"
        },
        "output.annotations[].end_line": {
          "required": true,
          "type": "integer"
        },
        "output.annotations[].message": {
          "required": true,
          "type": "string"
        },
        "output.annotations[].path": {
          "required": true,
          "type": "string"
        },
        "output.annotations[].raw_details": {
          "type": "string"
        },
        "output.annotations[].start_column": {
          "type": "integer"
        },
        "output.annotations[].start_line": {
          "required": true,
          "type": "integer"
        },
        "output.annotations[].title": {
          "type": "string"
        },
        "output.images": {
          "type": "object[]"
        },
        "output.images[].alt": {
          "required": true,
          "type": "string"
        },
        "output.images[].caption": {
          "type": "string"
        },
        "output.images[].image_url": {
          "required": true,
          "type": "string"
        },
        "output.summary": {
          "required": true,
          "type": "string"
        },
        "output.text": {
          "type": "string"
        },
        "output.title": {
          "type": "string"
        },
        "owner": {
          "required": true,
          "type": "string"
        },
        "repo": {
          "required": true,
          "type": "string"
        },
        "started_at": {
          "type": "string"
        },
        "status": {
          "enum": [
            "queued",
            "in_progress",
            "completed"
          ],
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/check-runs/:check_run_id"
    }
  },
  "codesOfConduct": {
    "getConductCode": {
      "headers": {
        "accept": "application/vnd.github.scarlet-witch-preview+json"
      },
      "method": "GET",
      "params": {
        "key": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/codes_of_conduct/:key"
    },
    "getForRepo": {
      "headers": {
        "accept": "application/vnd.github.scarlet-witch-preview+json"
      },
      "method": "GET",
      "params": {
        "owner": {
          "required": true,
          "type": "string"
        },
        "repo": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/community/code_of_conduct"
    },
    "listConductCodes": {
      "headers": {
        "accept": "application/vnd.github.scarlet-witch-preview+json"
      },
      "method": "GET",
      "params": {},
      "url": "/codes_of_conduct"
    }
  },
  "emojis": {
    "get": {
      "method": "GET",
      "params": {},
      "url": "/emojis"
    }
  },
  "gists": {
    "checkIsStarred": {
      "method": "GET",
      "params": {
        "gist_id": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/gists/:gist_id/star"
    },
    "create": {
      "method": "POST",
      "params": {
        "description": {
          "type": "string"
        },
        "files": {
          "required": true,
          "type": "object"
        },
        "files.content": {
          "type": "string"
        },
        "public": {
          "type": "boolean"
        }
      },
      "url": "/gists"
    },
    "createComment": {
      "method": "POST",
      "params": {
        "body": {
          "required": true,
          "type": "string"
        },
        "gist_id": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/gists/:gist_id/comments"
    },
    "delete": {
      "method": "DELETE",
      "params": {
        "gist_id": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/gists/:gist_id"
    },
    "deleteComment": {
      "method": "DELETE",
      "params": {
        "comment_id": {
          "required": true,
          "type": "integer"
        },
        "gist_id": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/gists/:gist_id/comments/:comment_id"
    },
    "fork": {
      "method": "POST",
      "params": {
        "gist_id": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/gists/:gist_id/forks"
    },
    "get": {
      "method": "GET",
      "params": {
        "gist_id": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/gists/:gist_id"
    },
    "getComment": {
      "method": "GET",
      "params": {
        "comment_id": {
          "required": true,
          "type": "integer"
        },
        "gist_id": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/gists/:gist_id/comments/:comment_id"
    },
    "getRevision": {
      "method": "GET",
      "params": {
        "gist_id": {
          "required": true,
          "type": "string"
        },
        "sha": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/gists/:gist_id/:sha"
    },
    "list": {
      "method": "GET",
      "params": {
        "page": {
          "type": "integer"
        },
        "per_page": {
          "type": "integer"
        },
        "since": {
          "type": "string"
        }
      },
      "url": "/gists"
    },
    "listComments": {
      "method": "GET",
      "params": {
        "gist_id": {
          "required": true,
          "type": "string"
        },
        "page": {
          "type": "integer"
        },
        "per_page": {
          "type": "integer"
        }
      },
      "url": "/gists/:gist_id/comments"
    },
    "listCommits": {
      "method": "GET",
      "params": {
        "gist_id": {
          "required": true,
          "type": "string"
        },
        "page": {
          "type": "integer"
        },
        "per_page": {
          "type": "integer"
        }
      },
      "url": "/gists/:gist_id/commits"
    },
    "listForks": {
      "method": "GET",
      "params": {
        "gist_id": {
          "required": true,
          "type": "string"
        },
        "page": {
          "type": "integer"
        },
        "per_page": {
          "type": "integer"
        }
      },
      "url": "/gists/:gist_id/forks"
    },
    "listPublic": {
      "method": "GET",
      "params": {
        "page": {
          "type": "integer"
        },
        "per_page": {
          "type": "integer"
        },
        "since": {
          "type": "string"
        }
      },
      "url": "/gists/public"
    },
    "listPublicForUser": {
      "method": "GET",
      "params": {
        "page": {
          "type": "integer"
        },
        "per_page": {
          "type": "integer"
        },
        "since": {
          "type": "string"
        },
        "username": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/users/:username/gists"
    },
    "listStarred": {
      "method": "GET",
      "params": {
        "page": {
          "type": "integer"
        },
        "per_page": {
          "type": "integer"
        },
        "since": {
          "type": "string"
        }
      },
      "url": "/gists/starred"
    },
    "star": {
      "method": "PUT",
      "params": {
        "gist_id": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/gists/:gist_id/star"
    },
    "unstar": {
      "method": "DELETE",
      "params": {
        "gist_id": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/gists/:gist_id/star"
    },
    "update": {
      "method": "PATCH",
      "params": {
        "description": {
          "type": "string"
        },
        "files": {
          "type": "object"
        },
        "files.content": {
          "type": "string"
        },
        "files.filename": {
          "type": "string"
        },
        "gist_id": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/gists/:gist_id"
    },
    "updateComment": {
      "method": "PATCH",
      "params": {
        "body": {
          "required": true,
          "type": "string"
        },
        "comment_id": {
          "required": true,
          "type": "integer"
        },
        "gist_id": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/gists/:gist_id/comments/:comment_id"
    }
  },
  "git": {
    "createBlob": {
      "method": "POST",
      "params": {
        "content": {
          "required": true,
          "type": "string"
        },
        "encoding": {
          "type": "string"
        },
        "owner": {
          "required": true,
          "type": "string"
        },
        "repo": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/git/blobs"
    },
    "createCommit": {
      "method": "POST",
      "params": {
        "author": {
          "type": "object"
        },
        "author.date": {
          "type": "string"
        },
        "author.email": {
          "type": "string"
        },
        "author.name": {
          "type": "string"
        },
        "committer": {
          "type": "object"
        },
        "committer.date": {
          "type": "string"
        },
        "committer.email": {
          "type": "string"
        },
        "committer.name": {
          "type": "string"
        },
        "message": {
          "required": true,
          "type": "string"
        },
        "owner": {
          "required": true,
          "type": "string"
        },
        "parents": {
          "required": true,
          "type": "string[]"
        },
        "repo": {
          "required": true,
          "type": "string"
        },
        "signature": {
          "type": "string"
        },
        "tree": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/git/commits"
    },
    "createRef": {
      "method": "POST",
      "params": {
        "owner": {
          "required": true,
          "type": "string"
        },
        "ref": {
          "required": true,
          "type": "string"
        },
        "repo": {
          "required": true,
          "type": "string"
        },
        "sha": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/git/refs"
    },
    "createTag": {
      "method": "POST",
      "params": {
        "message": {
          "required": true,
          "type": "string"
        },
        "object": {
          "required": true,
          "type": "string"
        },
        "owner": {
          "required": true,
          "type": "string"
        },
        "repo": {
          "required": true,
          "type": "string"
        },
        "tag": {
          "required": true,
          "type": "string"
        },
        "tagger": {
          "type": "object"
        },
        "tagger.date": {
          "type": "string"
        },
        "tagger.email": {
          "type": "string"
        },
        "tagger.name": {
          "type": "string"
        },
        "type": {
          "enum": [
            "commit",
            "tree",
            "blob"
          ],
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/git/tags"
    },
    "createTree": {
      "method": "POST",
      "params": {
        "base_tree": {
          "type": "string"
        },
        "owner": {
          "required": true,
          "type": "string"
        },
        "repo": {
          "required": true,
          "type": "string"
        },
        "tree": {
          "required": true,
          "type": "object[]"
        },
        "tree[].content": {
          "type": "string"
        },
        "tree[].mode": {
          "enum": [
            "100644",
            "100755",
            "040000",
            "160000",
            "120000"
          ],
          "type": "string"
        },
        "tree[].path": {
          "type": "string"
        },
        "tree[].sha": {
          "type": "string"
        },
        "tree[].type": {
          "enum": [
            "blob",
            "tree",
            "commit"
          ],
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/git/trees"
    },
    "deleteRef": {
      "method": "DELETE",
      "params": {
        "owner": {
          "required": true,
          "type": "string"
        },
        "ref": {
          "required": true,
          "type": "string"
        },
        "repo": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/git/refs/:ref"
    },
    "getBlob": {
      "method": "GET",
      "params": {
        "file_sha": {
          "required": true,
          "type": "string"
        },
        "owner": {
          "required": true,
          "type": "string"
        },
        "repo": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/git/blobs/:file_sha"
    },
    "getCommit": {
      "method": "GET",
      "params": {
        "commit_sha": {
          "required": true,
          "type": "string"
        },
        "owner": {
          "required": true,
          "type": "string"
        },
        "repo": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/git/commits/:commit_sha"
    },
    "getRef": {
      "method": "GET",
      "params": {
        "owner": {
          "required": true,
          "type": "string"
        },
        "ref": {
          "required": true,
          "type": "string"
        },
        "repo": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/git/refs/:ref"
    },
    "getTag": {
      "method": "GET",
      "params": {
        "owner": {
          "required": true,
          "type": "string"
        },
        "repo": {
          "required": true,
          "type": "string"
        },
        "tag_sha": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/git/tags/:tag_sha"
    },
    "getTree": {
      "method": "GET",
      "params": {
        "owner": {
          "required": true,
          "type": "string"
        },
        "recursive": {
          "enum": [
            1
          ],
          "type": "integer"
        },
        "repo": {
          "required": true,
          "type": "string"
        },
        "tree_sha": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/git/trees/:tree_sha"
    },
    "listRefs": {
      "method": "GET",
      "params": {
        "namespace": {
          "type": "string"
        },
        "owner": {
          "required": true,
          "type": "string"
        },
        "page": {
          "type": "integer"
        },
        "per_page": {
          "type": "integer"
        },
        "repo": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/git/refs/:namespace"
    },
    "updateRef": {
      "method": "PATCH",
      "params": {
        "force": {
          "type": "boolean"
        },
        "owner": {
          "required": true,
          "type": "string"
        },
        "ref": {
          "required": true,
          "type": "string"
        },
        "repo": {
          "required": true,
          "type": "string"
        },
        "sha": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/git/refs/:ref"
    }
  },
  "gitignore": {
    "getTemplate": {
      "method": "GET",
      "params": {
        "name": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/gitignore/templates/:name"
    },
    "listTemplates": {
      "method": "GET",
      "params": {},
      "url": "/gitignore/templates"
    }
  },
  "interactions": {
    "addOrUpdateRestrictionsForOrg": {
      "headers": {
        "accept": "application/vnd.github.sombra-preview+json"
      },
      "method": "PUT",
      "params": {
        "limit": {
          "enum": [
            "existing_users",
            "contributors_only",
            "collaborators_only"
          ],
          "required": true,
          "type": "string"
        },
        "org": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/orgs/:org/interaction-limits"
    },
    "addOrUpdateRestrictionsForRepo": {
      "headers": {
        "accept": "application/vnd.github.sombra-preview+json"
      },
      "method": "PUT",
      "params": {
        "limit": {
          "enum": [
            "existing_users",
            "contributors_only",
            "collaborators_only"
          ],
          "required": true,
          "type": "string"
        },
        "owner": {
          "required": true,
          "type": "string"
        },
        "repo": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/interaction-limits"
    },
    "getRestrictionsForOrg": {
      "headers": {
        "accept": "application/vnd.github.sombra-preview+json"
      },
      "method": "GET",
      "params": {
        "org": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/orgs/:org/interaction-limits"
    },
    "getRestrictionsForRepo": {
      "headers": {
        "accept": "application/vnd.github.sombra-preview+json"
      },
      "method": "GET",
      "params": {
        "owner": {
          "required": true,
          "type": "string"
        },
        "repo": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/interaction-limits"
    },
    "removeRestrictionsForOrg": {
      "headers": {
        "accept": "application/vnd.github.sombra-preview+json"
      },
      "method": "DELETE",
      "params": {
        "org": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/orgs/:org/interaction-limits"
    },
    "removeRestrictionsForRepo": {
      "headers": {
        "accept": "application/vnd.github.sombra-preview+json"
      },
      "method": "DELETE",
      "params": {
        "owner": {
          "required": true,
          "type": "string"
        },
        "repo": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/interaction-limits"
    }
  },
  "issues": {
    "addAssignees": {
      "method": "POST",
      "params": {
        "assignees": {
          "type": "string[]"
        },
        "issue_number": {
          "required": true,
          "type": "integer"
        },
        "number": {
          "alias": "issue_number",
          "deprecated": true,
          "type": "integer"
        },
        "owner": {
          "required": true,
          "type": "string"
        },
        "repo": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/issues/:issue_number/assignees"
    },
    "addLabels": {
      "method": "POST",
      "params": {
        "issue_number": {
          "required": true,
          "type": "integer"
        },
        "labels": {
          "required": true,
          "type": "string[]"
        },
        "number": {
          "alias": "issue_number",
          "deprecated": true,
          "type": "integer"
        },
        "owner": {
          "required": true,
          "type": "string"
        },
        "repo": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/issues/:issue_number/labels"
    },
    "checkAssignee": {
      "method": "GET",
      "params": {
        "assignee": {
          "required": true,
          "type": "string"
        },
        "owner": {
          "required": true,
          "type": "string"
        },
        "repo": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/assignees/:assignee"
    },
    "create": {
      "method": "POST",
      "params": {
        "assignee": {
          "type": "string"
        },
        "assignees": {
          "type": "string[]"
        },
        "body": {
          "type": "string"
        },
        "labels": {
          "type": "string[]"
        },
        "milestone": {
          "type": "integer"
        },
        "owner": {
          "required": true,
          "type": "string"
        },
        "repo": {
          "required": true,
          "type": "string"
        },
        "title": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/issues"
    },
    "createComment": {
      "method": "POST",
      "params": {
        "body": {
          "required": true,
          "type": "string"
        },
        "issue_number": {
          "required": true,
          "type": "integer"
        },
        "number": {
          "alias": "issue_number",
          "deprecated": true,
          "type": "integer"
        },
        "owner": {
          "required": true,
          "type": "string"
        },
        "repo": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/issues/:issue_number/comments"
    },
    "createLabel": {
      "method": "POST",
      "params": {
        "color": {
          "required": true,
          "type": "string"
        },
        "description": {
          "type": "string"
        },
        "name": {
          "required": true,
          "type": "string"
        },
        "owner": {
          "required": true,
          "type": "string"
        },
        "repo": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/labels"
    },
    "createMilestone": {
      "method": "POST",
      "params": {
        "description": {
          "type": "string"
        },
        "due_on": {
          "type": "string"
        },
        "owner": {
          "required": true,
          "type": "string"
        },
        "repo": {
          "required": true,
          "type": "string"
        },
        "state": {
          "enum": [
            "open",
            "closed"
          ],
          "type": "string"
        },
        "title": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/milestones"
    },
    "deleteComment": {
      "method": "DELETE",
      "params": {
        "comment_id": {
          "required": true,
          "type": "integer"
        },
        "owner": {
          "required": true,
          "type": "string"
        },
        "repo": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/issues/comments/:comment_id"
    },
    "deleteLabel": {
      "method": "DELETE",
      "params": {
        "name": {
          "required": true,
          "type": "string"
        },
        "owner": {
          "required": true,
          "type": "string"
        },
        "repo": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/labels/:name"
    },
    "deleteMilestone": {
      "method": "DELETE",
      "params": {
        "milestone_number": {
          "required": true,
          "type": "integer"
        },
        "number": {
          "alias": "milestone_number",
          "deprecated": true,
          "type": "integer"
        },
        "owner": {
          "required": true,
          "type": "string"
        },
        "repo": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/milestones/:milestone_number"
    },
    "get": {
      "method": "GET",
      "params": {
        "issue_number": {
          "required": true,
          "type": "integer"
        },
        "number": {
          "alias": "issue_number",
          "deprecated": true,
          "type": "integer"
        },
        "owner": {
          "required": true,
          "type": "string"
        },
        "repo": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/issues/:issue_number"
    },
    "getComment": {
      "method": "GET",
      "params": {
        "comment_id": {
          "required": true,
          "type": "integer"
        },
        "owner": {
          "required": true,
          "type": "string"
        },
        "page": {
          "type": "integer"
        },
        "per_page": {
          "type": "integer"
        },
        "repo": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/issues/comments/:comment_id"
    },
    "getEvent": {
      "method": "GET",
      "params": {
        "event_id": {
          "required": true,
          "type": "integer"
        },
        "owner": {
          "required": true,
          "type": "string"
        },
        "repo": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/issues/events/:event_id"
    },
    "getLabel": {
      "method": "GET",
      "params": {
        "name": {
          "required": true,
          "type": "string"
        },
        "owner": {
          "required": true,
          "type": "string"
        },
        "repo": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/labels/:name"
    },
    "getMilestone": {
      "method": "GET",
      "params": {
        "milestone_number": {
          "required": true,
          "type": "integer"
        },
        "number": {
          "alias": "milestone_number",
          "deprecated": true,
          "type": "integer"
        },
        "owner": {
          "required": true,
          "type": "string"
        },
        "repo": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/milestones/:milestone_number"
    },
    "list": {
      "method": "GET",
      "params": {
        "direction": {
          "enum": [
            "asc",
            "desc"
          ],
          "type": "string"
        },
        "filter": {
          "enum": [
            "assigned",
            "created",
            "mentioned",
            "subscribed",
            "all"
          ],
          "type": "string"
        },
        "labels": {
          "type": "string"
        },
        "page": {
          "type": "integer"
        },
        "per_page": {
          "type": "integer"
        },
        "since": {
          "type": "string"
        },
        "sort": {
          "enum": [
            "created",
            "updated",
            "comments"
          ],
          "type": "string"
        },
        "state": {
          "enum": [
            "open",
            "closed",
            "all"
          ],
          "type": "string"
        }
      },
      "url": "/issues"
    },
    "listAssignees": {
      "method": "GET",
      "params": {
        "owner": {
          "required": true,
          "type": "string"
        },
        "page": {
          "type": "integer"
        },
        "per_page": {
          "type": "integer"
        },
        "repo": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/assignees"
    },
    "listComments": {
      "method": "GET",
      "params": {
        "issue_number": {
          "required": true,
          "type": "integer"
        },
        "number": {
          "alias": "issue_number",
          "deprecated": true,
          "type": "integer"
        },
        "owner": {
          "required": true,
          "type": "string"
        },
        "page": {
          "type": "integer"
        },
        "per_page": {
          "type": "integer"
        },
        "repo": {
          "required": true,
          "type": "string"
        },
        "since": {
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/issues/:issue_number/comments"
    },
    "listCommentsForRepo": {
      "method": "GET",
      "params": {
        "direction": {
          "enum": [
            "asc",
            "desc"
          ],
          "type": "string"
        },
        "owner": {
          "required": true,
          "type": "string"
        },
        "repo": {
          "required": true,
          "type": "string"
        },
        "since": {
          "type": "string"
        },
        "sort": {
          "enum": [
            "created",
            "updated"
          ],
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/issues/comments"
    },
    "listEvents": {
      "method": "GET",
      "params": {
        "issue_number": {
          "required": true,
          "type": "integer"
        },
        "number": {
          "alias": "issue_number",
          "deprecated": true,
          "type": "integer"
        },
        "owner": {
          "required": true,
          "type": "string"
        },
        "page": {
          "type": "integer"
        },
        "per_page": {
          "type": "integer"
        },
        "repo": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/issues/:issue_number/events"
    },
    "listEventsForRepo": {
      "method": "GET",
      "params": {
        "owner": {
          "required": true,
          "type": "string"
        },
        "page": {
          "type": "integer"
        },
        "per_page": {
          "type": "integer"
        },
        "repo": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/issues/events"
    },
    "listEventsForTimeline": {
      "headers": {
        "accept": "application/vnd.github.mockingbird-preview+json"
      },
      "method": "GET",
      "params": {
        "issue_number": {
          "required": true,
          "type": "integer"
        },
        "number": {
          "alias": "issue_number",
          "deprecated": true,
          "type": "integer"
        },
        "owner": {
          "required": true,
          "type": "string"
        },
        "page": {
          "type": "integer"
        },
        "per_page": {
          "type": "integer"
        },
        "repo": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/issues/:issue_number/timeline"
    },
    "listForAuthenticatedUser": {
      "method": "GET",
      "params": {
        "direction": {
          "enum": [
            "asc",
            "desc"
          ],
          "type": "string"
        },
        "filter": {
          "enum": [
            "assigned",
            "created",
            "mentioned",
            "subscribed",
            "all"
          ],
          "type": "string"
        },
        "labels": {
          "type": "string"
        },
        "page": {
          "type": "integer"
        },
        "per_page": {
          "type": "integer"
        },
        "since": {
          "type": "string"
        },
        "sort": {
          "enum": [
            "created",
            "updated",
            "comments"
          ],
          "type": "string"
        },
        "state": {
          "enum": [
            "open",
            "closed",
            "all"
          ],
          "type": "string"
        }
      },
      "url": "/user/issues"
    },
    "listForOrg": {
      "method": "GET",
      "params": {
        "direction": {
          "enum": [
            "asc",
            "desc"
          ],
          "type": "string"
        },
        "filter": {
          "enum": [
            "assigned",
            "created",
            "mentioned",
            "subscribed",
            "all"
          ],
          "type": "string"
        },
        "labels": {
          "type": "string"
        },
        "org": {
          "required": true,
          "type": "string"
        },
        "page": {
          "type": "integer"
        },
        "per_page": {
          "type": "integer"
        },
        "since": {
          "type": "string"
        },
        "sort": {
          "enum": [
            "created",
            "updated",
            "comments"
          ],
          "type": "string"
        },
        "state": {
          "enum": [
            "open",
            "closed",
            "all"
          ],
          "type": "string"
        }
      },
      "url": "/orgs/:org/issues"
    },
    "listForRepo": {
      "method": "GET",
      "params": {
        "assignee": {
          "type": "string"
        },
        "creator": {
          "type": "string"
        },
        "direction": {
          "enum": [
            "asc",
            "desc"
          ],
          "type": "string"
        },
        "labels": {
          "type": "string"
        },
        "mentioned": {
          "type": "string"
        },
        "milestone": {
          "type": "string"
        },
        "owner": {
          "required": true,
          "type": "string"
        },
        "page": {
          "type": "integer"
        },
        "per_page": {
          "type": "integer"
        },
        "repo": {
          "required": true,
          "type": "string"
        },
        "since": {
          "type": "string"
        },
        "sort": {
          "enum": [
            "created",
            "updated",
            "comments"
          ],
          "type": "string"
        },
        "state": {
          "enum": [
            "open",
            "closed",
            "all"
          ],
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/issues"
    },
    "listLabelsForMilestone": {
      "method": "GET",
      "params": {
        "milestone_number": {
          "required": true,
          "type": "integer"
        },
        "number": {
          "alias": "milestone_number",
          "deprecated": true,
          "type": "integer"
        },
        "owner": {
          "required": true,
          "type": "string"
        },
        "page": {
          "type": "integer"
        },
        "per_page": {
          "type": "integer"
        },
        "repo": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/milestones/:milestone_number/labels"
    },
    "listLabelsForRepo": {
      "method": "GET",
      "params": {
        "owner": {
          "required": true,
          "type": "string"
        },
        "page": {
          "type": "integer"
        },
        "per_page": {
          "type": "integer"
        },
        "repo": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/labels"
    },
    "listLabelsOnIssue": {
      "method": "GET",
      "params": {
        "issue_number": {
          "required": true,
          "type": "integer"
        },
        "number": {
          "alias": "issue_number",
          "deprecated": true,
          "type": "integer"
        },
        "owner": {
          "required": true,
          "type": "string"
        },
        "page": {
          "type": "integer"
        },
        "per_page": {
          "type": "integer"
        },
        "repo": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/issues/:issue_number/labels"
    },
    "listMilestonesForRepo": {
      "method": "GET",
      "params": {
        "direction": {
          "enum": [
            "asc",
            "desc"
          ],
          "type": "string"
        },
        "owner": {
          "required": true,
          "type": "string"
        },
        "page": {
          "type": "integer"
        },
        "per_page": {
          "type": "integer"
        },
        "repo": {
          "required": true,
          "type": "string"
        },
        "sort": {
          "enum": [
            "due_on",
            "completeness"
          ],
          "type": "string"
        },
        "state": {
          "enum": [
            "open",
            "closed",
            "all"
          ],
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/milestones"
    },
    "lock": {
      "method": "PUT",
      "params": {
        "issue_number": {
          "required": true,
          "type": "integer"
        },
        "lock_reason": {
          "enum": [
            "off-topic",
            "too heated",
            "resolved",
            "spam"
          ],
          "type": "string"
        },
        "number": {
          "alias": "issue_number",
          "deprecated": true,
          "type": "integer"
        },
        "owner": {
          "required": true,
          "type": "string"
        },
        "repo": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/issues/:issue_number/lock"
    },
    "removeAssignees": {
      "method": "DELETE",
      "params": {
        "assignees": {
          "type": "string[]"
        },
        "issue_number": {
          "required": true,
          "type": "integer"
        },
        "number": {
          "alias": "issue_number",
          "deprecated": true,
          "type": "integer"
        },
        "owner": {
          "required": true,
          "type": "string"
        },
        "repo": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/issues/:issue_number/assignees"
    },
    "removeLabel": {
      "method": "DELETE",
      "params": {
        "issue_number": {
          "required": true,
          "type": "integer"
        },
        "name": {
          "required": true,
          "type": "string"
        },
        "number": {
          "alias": "issue_number",
          "deprecated": true,
          "type": "integer"
        },
        "owner": {
          "required": true,
          "type": "string"
        },
        "repo": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/issues/:issue_number/labels/:name"
    },
    "removeLabels": {
      "method": "DELETE",
      "params": {
        "issue_number": {
          "required": true,
          "type": "integer"
        },
        "number": {
          "alias": "issue_number",
          "deprecated": true,
          "type": "integer"
        },
        "owner": {
          "required": true,
          "type": "string"
        },
        "repo": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/issues/:issue_number/labels"
    },
    "replaceLabels": {
      "method": "PUT",
      "params": {
        "issue_number": {
          "required": true,
          "type": "integer"
        },
        "labels": {
          "type": "string[]"
        },
        "number": {
          "alias": "issue_number",
          "deprecated": true,
          "type": "integer"
        },
        "owner": {
          "required": true,
          "type": "string"
        },
        "repo": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/issues/:issue_number/labels"
    },
    "unlock": {
      "method": "DELETE",
      "params": {
        "issue_number": {
          "required": true,
          "type": "integer"
        },
        "number": {
          "alias": "issue_number",
          "deprecated": true,
          "type": "integer"
        },
        "owner": {
          "required": true,
          "type": "string"
        },
        "repo": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/issues/:issue_number/lock"
    },
    "update": {
      "method": "PATCH",
      "params": {
        "assignee": {
          "type": "string"
        },
        "assignees": {
          "type": "string[]"
        },
        "body": {
          "type": "string"
        },
        "issue_number": {
          "required": true,
          "type": "integer"
        },
        "labels": {
          "type": "string[]"
        },
        "milestone": {
          "allowNull": true,
          "type": "integer"
        },
        "number": {
          "alias": "issue_number",
          "deprecated": true,
          "type": "integer"
        },
        "owner": {
          "required": true,
          "type": "string"
        },
        "repo": {
          "required": true,
          "type": "string"
        },
        "state": {
          "enum": [
            "open",
            "closed"
          ],
          "type": "string"
        },
        "title": {
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/issues/:issue_number"
    },
    "updateComment": {
      "method": "PATCH",
      "params": {
        "body": {
          "required": true,
          "type": "string"
        },
        "comment_id": {
          "required": true,
          "type": "integer"
        },
        "owner": {
          "required": true,
          "type": "string"
        },
        "repo": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/issues/comments/:comment_id"
    },
    "updateLabel": {
      "method": "PATCH",
      "params": {
        "color": {
          "type": "string"
        },
        "current_name": {
          "required": true,
          "type": "string"
        },
        "description": {
          "type": "string"
        },
        "name": {
          "type": "string"
        },
        "owner": {
          "required": true,
          "type": "string"
        },
        "repo": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/labels/:current_name"
    },
    "updateMilestone": {
      "method": "PATCH",
      "params": {
        "description": {
          "type": "string"
        },
        "due_on": {
          "type": "string"
        },
        "milestone_number": {
          "required": true,
          "type": "integer"
        },
        "number": {
          "alias": "milestone_number",
          "deprecated": true,
          "type": "integer"
        },
        "owner": {
          "required": true,
          "type": "string"
        },
        "repo": {
          "required": true,
          "type": "string"
        },
        "state": {
          "enum": [
            "open",
            "closed"
          ],
          "type": "string"
        },
        "title": {
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/milestones/:milestone_number"
    }
  },
  "licenses": {
    "get": {
      "method": "GET",
      "params": {
        "license": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/licenses/:license"
    },
    "getForRepo": {
      "method": "GET",
      "params": {
        "owner": {
          "required": true,
          "type": "string"
        },
        "repo": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/license"
    },
    "list": {
      "deprecated": "octokit.licenses.list() has been renamed to octokit.licenses.listCommonlyUsed() (2019-03-05)",
      "method": "GET",
      "params": {},
      "url": "/licenses"
    },
    "listCommonlyUsed": {
      "method": "GET",
      "params": {},
      "url": "/licenses"
    }
  },
  "markdown": {
    "render": {
      "method": "POST",
      "params": {
        "context": {
          "type": "string"
        },
        "mode": {
          "enum": [
            "markdown",
            "gfm"
          ],
          "type": "string"
        },
        "text": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/markdown"
    },
    "renderRaw": {
      "headers": {
        "content-type": "text/plain; charset=utf-8"
      },
      "method": "POST",
      "params": {
        "data": {
          "mapTo": "data",
          "required": true,
          "type": "string"
        }
      },
      "url": "/markdown/raw"
    }
  },
  "meta": {
    "get": {
      "method": "GET",
      "params": {},
      "url": "/meta"
    }
  },
  "migrations": {
    "cancelImport": {
      "headers": {
        "accept": "application/vnd.github.barred-rock-preview+json"
      },
      "method": "DELETE",
      "params": {
        "owner": {
          "required": true,
          "type": "string"
        },
        "repo": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/import"
    },
    "deleteArchiveForAuthenticatedUser": {
      "headers": {
        "accept": "application/vnd.github.wyandotte-preview+json"
      },
      "method": "DELETE",
      "params": {
        "migration_id": {
          "required": true,
          "type": "integer"
        }
      },
      "url": "/user/migrations/:migration_id/archive"
    },
    "deleteArchiveForOrg": {
      "headers": {
        "accept": "application/vnd.github.wyandotte-preview+json"
      },
      "method": "DELETE",
      "params": {
        "migration_id": {
          "required": true,
          "type": "integer"
        },
        "org": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/orgs/:org/migrations/:migration_id/archive"
    },
    "getArchiveForAuthenticatedUser": {
      "headers": {
        "accept": "application/vnd.github.wyandotte-preview+json"
      },
      "method": "GET",
      "params": {
        "migration_id": {
          "required": true,
          "type": "integer"
        }
      },
      "url": "/user/migrations/:migration_id/archive"
    },
    "getArchiveForOrg": {
      "headers": {
        "accept": "application/vnd.github.wyandotte-preview+json"
      },
      "method": "GET",
      "params": {
        "migration_id": {
          "required": true,
          "type": "integer"
        },
        "org": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/orgs/:org/migrations/:migration_id/archive"
    },
    "getCommitAuthors": {
      "headers": {
        "accept": "application/vnd.github.barred-rock-preview+json"
      },
      "method": "GET",
      "params": {
        "owner": {
          "required": true,
          "type": "string"
        },
        "repo": {
          "required": true,
          "type": "string"
        },
        "since": {
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/import/authors"
    },
    "getImportProgress": {
      "headers": {
        "accept": "application/vnd.github.barred-rock-preview+json"
      },
      "method": "GET",
      "params": {
        "owner": {
          "required": true,
          "type": "string"
        },
        "repo": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/import"
    },
    "getLargeFiles": {
      "headers": {
        "accept": "application/vnd.github.barred-rock-preview+json"
      },
      "method": "GET",
      "params": {
        "owner": {
          "required": true,
          "type": "string"
        },
        "repo": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/import/large_files"
    },
    "getStatusForAuthenticatedUser": {
      "headers": {
        "accept": "application/vnd.github.wyandotte-preview+json"
      },
      "method": "GET",
      "params": {
        "migration_id": {
          "required": true,
          "type": "integer"
        }
      },
      "url": "/user/migrations/:migration_id"
    },
    "getStatusForOrg": {
      "headers": {
        "accept": "application/vnd.github.wyandotte-preview+json"
      },
      "method": "GET",
      "params": {
        "migration_id": {
          "required": true,
          "type": "integer"
        },
        "org": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/orgs/:org/migrations/:migration_id"
    },
    "listForAuthenticatedUser": {
      "headers": {
        "accept": "application/vnd.github.wyandotte-preview+json"
      },
      "method": "GET",
      "params": {
        "page": {
          "type": "integer"
        },
        "per_page": {
          "type": "integer"
        }
      },
      "url": "/user/migrations"
    },
    "listForOrg": {
      "headers": {
        "accept": "application/vnd.github.wyandotte-preview+json"
      },
      "method": "GET",
      "params": {
        "org": {
          "required": true,
          "type": "string"
        },
        "page": {
          "type": "integer"
        },
        "per_page": {
          "type": "integer"
        }
      },
      "url": "/orgs/:org/migrations"
    },
    "mapCommitAuthor": {
      "headers": {
        "accept": "application/vnd.github.barred-rock-preview+json"
      },
      "method": "PATCH",
      "params": {
        "author_id": {
          "required": true,
          "type": "integer"
        },
        "email": {
          "type": "string"
        },
        "name": {
          "type": "string"
        },
        "owner": {
          "required": true,
          "type": "string"
        },
        "repo": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/import/authors/:author_id"
    },
    "setLfsPreference": {
      "headers": {
        "accept": "application/vnd.github.barred-rock-preview+json"
      },
      "method": "PATCH",
      "params": {
        "owner": {
          "required": true,
          "type": "string"
        },
        "repo": {
          "required": true,
          "type": "string"
        },
        "use_lfs": {
          "enum": [
            "opt_in",
            "opt_out"
          ],
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/import/lfs"
    },
    "startForAuthenticatedUser": {
      "method": "POST",
      "params": {
        "exclude_attachments": {
          "type": "boolean"
        },
        "lock_repositories": {
          "type": "boolean"
        },
        "repositories": {
          "required": true,
          "type": "string[]"
        }
      },
      "url": "/user/migrations"
    },
    "startForOrg": {
      "method": "POST",
      "params": {
        "exclude_attachments": {
          "type": "boolean"
        },
        "lock_repositories": {
          "type": "boolean"
        },
        "org": {
          "required": true,
          "type": "string"
        },
        "repositories": {
          "required": true,
          "type": "string[]"
        }
      },
      "url": "/orgs/:org/migrations"
    },
    "startImport": {
      "headers": {
        "accept": "application/vnd.github.barred-rock-preview+json"
      },
      "method": "PUT",
      "params": {
        "owner": {
          "required": true,
          "type": "string"
        },
        "repo": {
          "required": true,
          "type": "string"
        },
        "tfvc_project": {
          "type": "string"
        },
        "vcs": {
          "enum": [
            "subversion",
            "git",
            "mercurial",
            "tfvc"
          ],
          "type": "string"
        },
        "vcs_password": {
          "type": "string"
        },
        "vcs_url": {
          "required": true,
          "type": "string"
        },
        "vcs_username": {
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/import"
    },
    "unlockRepoForAuthenticatedUser": {
      "headers": {
        "accept": "application/vnd.github.wyandotte-preview+json"
      },
      "method": "DELETE",
      "params": {
        "migration_id": {
          "required": true,
          "type": "integer"
        },
        "repo_name": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/user/migrations/:migration_id/repos/:repo_name/lock"
    },
    "unlockRepoForOrg": {
      "headers": {
        "accept": "application/vnd.github.wyandotte-preview+json"
      },
      "method": "DELETE",
      "params": {
        "migration_id": {
          "required": true,
          "type": "integer"
        },
        "org": {
          "required": true,
          "type": "string"
        },
        "repo_name": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/orgs/:org/migrations/:migration_id/repos/:repo_name/lock"
    },
    "updateImport": {
      "headers": {
        "accept": "application/vnd.github.barred-rock-preview+json"
      },
      "method": "PATCH",
      "params": {
        "owner": {
          "required": true,
          "type": "string"
        },
        "repo": {
          "required": true,
          "type": "string"
        },
        "vcs_password": {
          "type": "string"
        },
        "vcs_username": {
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/import"
    }
  },
  "oauthAuthorizations": {
    "checkAuthorization": {
      "method": "GET",
      "params": {
        "access_token": {
          "required": true,
          "type": "string"
        },
        "client_id": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/applications/:client_id/tokens/:access_token"
    },
    "createAuthorization": {
      "method": "POST",
      "params": {
        "client_id": {
          "type": "string"
        },
        "client_secret": {
          "type": "string"
        },
        "fingerprint": {
          "type": "string"
        },
        "note": {
          "required": true,
          "type": "string"
        },
        "note_url": {
          "type": "string"
        },
        "scopes": {
          "type": "string[]"
        }
      },
      "url": "/authorizations"
    },
    "deleteAuthorization": {
      "method": "DELETE",
      "params": {
        "authorization_id": {
          "required": true,
          "type": "integer"
        }
      },
      "url": "/authorizations/:authorization_id"
    },
    "deleteGrant": {
      "method": "DELETE",
      "params": {
        "grant_id": {
          "required": true,
          "type": "integer"
        }
      },
      "url": "/applications/grants/:grant_id"
    },
    "getAuthorization": {
      "method": "GET",
      "params": {
        "authorization_id": {
          "required": true,
          "type": "integer"
        }
      },
      "url": "/authorizations/:authorization_id"
    },
    "getGrant": {
      "method": "GET",
      "params": {
        "grant_id": {
          "required": true,
          "type": "integer"
        }
      },
      "url": "/applications/grants/:grant_id"
    },
    "getOrCreateAuthorizationForApp": {
      "method": "PUT",
      "params": {
        "client_id": {
          "required": true,
          "type": "string"
        },
        "client_secret": {
          "required": true,
          "type": "string"
        },
        "fingerprint": {
          "type": "string"
        },
        "note": {
          "type": "string"
        },
        "note_url": {
          "type": "string"
        },
        "scopes": {
          "type": "string[]"
        }
      },
      "url": "/authorizations/clients/:client_id"
    },
    "getOrCreateAuthorizationForAppAndFingerprint": {
      "method": "PUT",
      "params": {
        "client_id": {
          "required": true,
          "type": "string"
        },
        "client_secret": {
          "required": true,
          "type": "string"
        },
        "fingerprint": {
          "required": true,
          "type": "string"
        },
        "note": {
          "type": "string"
        },
        "note_url": {
          "type": "string"
        },
        "scopes": {
          "type": "string[]"
        }
      },
      "url": "/authorizations/clients/:client_id/:fingerprint"
    },
    "getOrCreateAuthorizationForAppFingerprint": {
      "deprecated": "octokit.oauthAuthorizations.getOrCreateAuthorizationForAppFingerprint() has been renamed to octokit.oauthAuthorizations.getOrCreateAuthorizationForAppAndFingerprint() (2018-12-27)",
      "method": "PUT",
      "params": {
        "client_id": {
          "required": true,
          "type": "string"
        },
        "client_secret": {
          "required": true,
          "type": "string"
        },
        "fingerprint": {
          "required": true,
          "type": "string"
        },
        "note": {
          "type": "string"
        },
        "note_url": {
          "type": "string"
        },
        "scopes": {
          "type": "string[]"
        }
      },
      "url": "/authorizations/clients/:client_id/:fingerprint"
    },
    "listAuthorizations": {
      "method": "GET",
      "params": {
        "page": {
          "type": "integer"
        },
        "per_page": {
          "type": "integer"
        }
      },
      "url": "/authorizations"
    },
    "listGrants": {
      "method": "GET",
      "params": {
        "page": {
          "type": "integer"
        },
        "per_page": {
          "type": "integer"
        }
      },
      "url": "/applications/grants"
    },
    "resetAuthorization": {
      "method": "POST",
      "params": {
        "access_token": {
          "required": true,
          "type": "string"
        },
        "client_id": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/applications/:client_id/tokens/:access_token"
    },
    "revokeAuthorizationForApplication": {
      "method": "DELETE",
      "params": {
        "access_token": {
          "required": true,
          "type": "string"
        },
        "client_id": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/applications/:client_id/tokens/:access_token"
    },
    "revokeGrantForApplication": {
      "method": "DELETE",
      "params": {
        "access_token": {
          "required": true,
          "type": "string"
        },
        "client_id": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/applications/:client_id/grants/:access_token"
    },
    "updateAuthorization": {
      "method": "PATCH",
      "params": {
        "add_scopes": {
          "type": "string[]"
        },
        "authorization_id": {
          "required": true,
          "type": "integer"
        },
        "fingerprint": {
          "type": "string"
        },
        "note": {
          "type": "string"
        },
        "note_url": {
          "type": "string"
        },
        "remove_scopes": {
          "type": "string[]"
        },
        "scopes": {
          "type": "string[]"
        }
      },
      "url": "/authorizations/:authorization_id"
    }
  },
  "orgs": {
    "addOrUpdateMembership": {
      "method": "PUT",
      "params": {
        "org": {
          "required": true,
          "type": "string"
        },
        "role": {
          "enum": [
            "admin",
            "member"
          ],
          "type": "string"
        },
        "username": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/orgs/:org/memberships/:username"
    },
    "blockUser": {
      "method": "PUT",
      "params": {
        "org": {
          "required": true,
          "type": "string"
        },
        "username": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/orgs/:org/blocks/:username"
    },
    "checkBlockedUser": {
      "method": "GET",
      "params": {
        "org": {
          "required": true,
          "type": "string"
        },
        "username": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/orgs/:org/blocks/:username"
    },
    "checkMembership": {
      "method": "GET",
      "params": {
        "org": {
          "required": true,
          "type": "string"
        },
        "username": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/orgs/:org/members/:username"
    },
    "checkPublicMembership": {
      "method": "GET",
      "params": {
        "org": {
          "required": true,
          "type": "string"
        },
        "username": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/orgs/:org/public_members/:username"
    },
    "concealMembership": {
      "method": "DELETE",
      "params": {
        "org": {
          "required": true,
          "type": "string"
        },
        "username": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/orgs/:org/public_members/:username"
    },
    "convertMemberToOutsideCollaborator": {
      "method": "PUT",
      "params": {
        "org": {
          "required": true,
          "type": "string"
        },
        "username": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/orgs/:org/outside_collaborators/:username"
    },
    "createHook": {
      "method": "POST",
      "params": {
        "active": {
          "type": "boolean"
        },
        "config": {
          "required": true,
          "type": "object"
        },
        "config.content_type": {
          "type": "string"
        },
        "config.insecure_ssl": {
          "type": "string"
        },
        "config.secret": {
          "type": "string"
        },
        "config.url": {
          "required": true,
          "type": "string"
        },
        "events": {
          "type": "string[]"
        },
        "name": {
          "required": true,
          "type": "string"
        },
        "org": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/orgs/:org/hooks"
    },
    "createInvitation": {
      "method": "POST",
      "params": {
        "email": {
          "type": "string"
        },
        "invitee_id": {
          "type": "integer"
        },
        "org": {
          "required": true,
          "type": "string"
        },
        "role": {
          "enum": [
            "admin",
            "direct_member",
            "billing_manager"
          ],
          "type": "string"
        },
        "team_ids": {
          "type": "integer[]"
        }
      },
      "url": "/orgs/:org/invitations"
    },
    "deleteHook": {
      "method": "DELETE",
      "params": {
        "hook_id": {
          "required": true,
          "type": "integer"
        },
        "org": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/orgs/:org/hooks/:hook_id"
    },
    "get": {
      "method": "GET",
      "params": {
        "org": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/orgs/:org"
    },
    "getHook": {
      "method": "GET",
      "params": {
        "hook_id": {
          "required": true,
          "type": "integer"
        },
        "org": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/orgs/:org/hooks/:hook_id"
    },
    "getMembership": {
      "method": "GET",
      "params": {
        "org": {
          "required": true,
          "type": "string"
        },
        "username": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/orgs/:org/memberships/:username"
    },
    "getMembershipForAuthenticatedUser": {
      "method": "GET",
      "params": {
        "org": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/user/memberships/orgs/:org"
    },
    "list": {
      "method": "GET",
      "params": {
        "page": {
          "type": "integer"
        },
        "per_page": {
          "type": "integer"
        },
        "since": {
          "type": "string"
        }
      },
      "url": "/organizations"
    },
    "listBlockedUsers": {
      "method": "GET",
      "params": {
        "org": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/orgs/:org/blocks"
    },
    "listForAuthenticatedUser": {
      "method": "GET",
      "params": {
        "page": {
          "type": "integer"
        },
        "per_page": {
          "type": "integer"
        }
      },
      "url": "/user/orgs"
    },
    "listForUser": {
      "method": "GET",
      "params": {
        "page": {
          "type": "integer"
        },
        "per_page": {
          "type": "integer"
        },
        "username": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/users/:username/orgs"
    },
    "listHooks": {
      "method": "GET",
      "params": {
        "org": {
          "required": true,
          "type": "string"
        },
        "page": {
          "type": "integer"
        },
        "per_page": {
          "type": "integer"
        }
      },
      "url": "/orgs/:org/hooks"
    },
    "listInvitationTeams": {
      "method": "GET",
      "params": {
        "invitation_id": {
          "required": true,
          "type": "integer"
        },
        "org": {
          "required": true,
          "type": "string"
        },
        "page": {
          "type": "integer"
        },
        "per_page": {
          "type": "integer"
        }
      },
      "url": "/orgs/:org/invitations/:invitation_id/teams"
    },
    "listMembers": {
      "method": "GET",
      "params": {
        "filter": {
          "enum": [
            "2fa_disabled",
            "all"
          ],
          "type": "string"
        },
        "org": {
          "required": true,
          "type": "string"
        },
        "page": {
          "type": "integer"
        },
        "per_page": {
          "type": "integer"
        },
        "role": {
          "enum": [
            "all",
            "admin",
            "member"
          ],
          "type": "string"
        }
      },
      "url": "/orgs/:org/members"
    },
    "listMemberships": {
      "method": "GET",
      "params": {
        "page": {
          "type": "integer"
        },
        "per_page": {
          "type": "integer"
        },
        "state": {
          "enum": [
            "active",
            "pending"
          ],
          "type": "string"
        }
      },
      "url": "/user/memberships/orgs"
    },
    "listOutsideCollaborators": {
      "method": "GET",
      "params": {
        "filter": {
          "enum": [
            "2fa_disabled",
            "all"
          ],
          "type": "string"
        },
        "org": {
          "required": true,
          "type": "string"
        },
        "page": {
          "type": "integer"
        },
        "per_page": {
          "type": "integer"
        }
      },
      "url": "/orgs/:org/outside_collaborators"
    },
    "listPendingInvitations": {
      "method": "GET",
      "params": {
        "org": {
          "required": true,
          "type": "string"
        },
        "page": {
          "type": "integer"
        },
        "per_page": {
          "type": "integer"
        }
      },
      "url": "/orgs/:org/invitations"
    },
    "listPublicMembers": {
      "method": "GET",
      "params": {
        "org": {
          "required": true,
          "type": "string"
        },
        "page": {
          "type": "integer"
        },
        "per_page": {
          "type": "integer"
        }
      },
      "url": "/orgs/:org/public_members"
    },
    "pingHook": {
      "method": "POST",
      "params": {
        "hook_id": {
          "required": true,
          "type": "integer"
        },
        "org": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/orgs/:org/hooks/:hook_id/pings"
    },
    "publicizeMembership": {
      "method": "PUT",
      "params": {
        "org": {
          "required": true,
          "type": "string"
        },
        "username": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/orgs/:org/public_members/:username"
    },
    "removeMember": {
      "method": "DELETE",
      "params": {
        "org": {
          "required": true,
          "type": "string"
        },
        "username": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/orgs/:org/members/:username"
    },
    "removeMembership": {
      "method": "DELETE",
      "params": {
        "org": {
          "required": true,
          "type": "string"
        },
        "username": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/orgs/:org/memberships/:username"
    },
    "removeOutsideCollaborator": {
      "method": "DELETE",
      "params": {
        "org": {
          "required": true,
          "type": "string"
        },
        "username": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/orgs/:org/outside_collaborators/:username"
    },
    "unblockUser": {
      "method": "DELETE",
      "params": {
        "org": {
          "required": true,
          "type": "string"
        },
        "username": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/orgs/:org/blocks/:username"
    },
    "update": {
      "method": "PATCH",
      "params": {
        "billing_email": {
          "type": "string"
        },
        "company": {
          "type": "string"
        },
        "default_repository_permission": {
          "enum": [
            "read",
            "write",
            "admin",
            "none"
          ],
          "type": "string"
        },
        "description": {
          "type": "string"
        },
        "email": {
          "type": "string"
        },
        "has_organization_projects": {
          "type": "boolean"
        },
        "has_repository_projects": {
          "type": "boolean"
        },
        "location": {
          "type": "string"
        },
        "members_allowed_repository_creation_type": {
          "enum": [
            "all",
            "private",
            "none"
          ],
          "type": "string"
        },
        "members_can_create_repositories": {
          "type": "boolean"
        },
        "name": {
          "type": "string"
        },
        "org": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/orgs/:org"
    },
    "updateHook": {
      "method": "PATCH",
      "params": {
        "active": {
          "type": "boolean"
        },
        "config": {
          "type": "object"
        },
        "config.content_type": {
          "type": "string"
        },
        "config.insecure_ssl": {
          "type": "string"
        },
        "config.secret": {
          "type": "string"
        },
        "config.url": {
          "required": true,
          "type": "string"
        },
        "events": {
          "type": "string[]"
        },
        "hook_id": {
          "required": true,
          "type": "integer"
        },
        "org": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/orgs/:org/hooks/:hook_id"
    },
    "updateMembership": {
      "method": "PATCH",
      "params": {
        "org": {
          "required": true,
          "type": "string"
        },
        "state": {
          "enum": [
            "active"
          ],
          "required": true,
          "type": "string"
        }
      },
      "url": "/user/memberships/orgs/:org"
    }
  },
  "projects": {
    "addCollaborator": {
      "headers": {
        "accept": "application/vnd.github.inertia-preview+json"
      },
      "method": "PUT",
      "params": {
        "permission": {
          "enum": [
            "read",
            "write",
            "admin"
          ],
          "type": "string"
        },
        "project_id": {
          "required": true,
          "type": "integer"
        },
        "username": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/projects/:project_id/collaborators/:username"
    },
    "createCard": {
      "headers": {
        "accept": "application/vnd.github.inertia-preview+json"
      },
      "method": "POST",
      "params": {
        "column_id": {
          "required": true,
          "type": "integer"
        },
        "content_id": {
          "type": "integer"
        },
        "content_type": {
          "type": "string"
        },
        "note": {
          "type": "string"
        }
      },
      "url": "/projects/columns/:column_id/cards"
    },
    "createColumn": {
      "headers": {
        "accept": "application/vnd.github.inertia-preview+json"
      },
      "method": "POST",
      "params": {
        "name": {
          "required": true,
          "type": "string"
        },
        "project_id": {
          "required": true,
          "type": "integer"
        }
      },
      "url": "/projects/:project_id/columns"
    },
    "createForAuthenticatedUser": {
      "headers": {
        "accept": "application/vnd.github.inertia-preview+json"
      },
      "method": "POST",
      "params": {
        "body": {
          "type": "string"
        },
        "name": {
          "required": true,
          "type": "string"
        },
        "page": {
          "type": "integer"
        },
        "per_page": {
          "type": "integer"
        }
      },
      "url": "/user/projects"
    },
    "createForOrg": {
      "headers": {
        "accept": "application/vnd.github.inertia-preview+json"
      },
      "method": "POST",
      "params": {
        "body": {
          "type": "string"
        },
        "name": {
          "required": true,
          "type": "string"
        },
        "org": {
          "required": true,
          "type": "string"
        },
        "page": {
          "type": "integer"
        },
        "per_page": {
          "type": "integer"
        }
      },
      "url": "/orgs/:org/projects"
    },
    "createForRepo": {
      "headers": {
        "accept": "application/vnd.github.inertia-preview+json"
      },
      "method": "POST",
      "params": {
        "body": {
          "type": "string"
        },
        "name": {
          "required": true,
          "type": "string"
        },
        "owner": {
          "required": true,
          "type": "string"
        },
        "page": {
          "type": "integer"
        },
        "per_page": {
          "type": "integer"
        },
        "repo": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/projects"
    },
    "delete": {
      "headers": {
        "accept": "application/vnd.github.inertia-preview+json"
      },
      "method": "DELETE",
      "params": {
        "project_id": {
          "required": true,
          "type": "integer"
        }
      },
      "url": "/projects/:project_id"
    },
    "deleteCard": {
      "headers": {
        "accept": "application/vnd.github.inertia-preview+json"
      },
      "method": "DELETE",
      "params": {
        "card_id": {
          "required": true,
          "type": "integer"
        }
      },
      "url": "/projects/columns/cards/:card_id"
    },
    "deleteColumn": {
      "headers": {
        "accept": "application/vnd.github.inertia-preview+json"
      },
      "method": "DELETE",
      "params": {
        "column_id": {
          "required": true,
          "type": "integer"
        }
      },
      "url": "/projects/columns/:column_id"
    },
    "get": {
      "headers": {
        "accept": "application/vnd.github.inertia-preview+json"
      },
      "method": "GET",
      "params": {
        "page": {
          "type": "integer"
        },
        "per_page": {
          "type": "integer"
        },
        "project_id": {
          "required": true,
          "type": "integer"
        }
      },
      "url": "/projects/:project_id"
    },
    "getCard": {
      "headers": {
        "accept": "application/vnd.github.inertia-preview+json"
      },
      "method": "GET",
      "params": {
        "card_id": {
          "required": true,
          "type": "integer"
        }
      },
      "url": "/projects/columns/cards/:card_id"
    },
    "getColumn": {
      "headers": {
        "accept": "application/vnd.github.inertia-preview+json"
      },
      "method": "GET",
      "params": {
        "column_id": {
          "required": true,
          "type": "integer"
        }
      },
      "url": "/projects/columns/:column_id"
    },
    "listCards": {
      "headers": {
        "accept": "application/vnd.github.inertia-preview+json"
      },
      "method": "GET",
      "params": {
        "archived_state": {
          "enum": [
            "all",
            "archived",
            "not_archived"
          ],
          "type": "string"
        },
        "column_id": {
          "required": true,
          "type": "integer"
        },
        "page": {
          "type": "integer"
        },
        "per_page": {
          "type": "integer"
        }
      },
      "url": "/projects/columns/:column_id/cards"
    },
    "listCollaborators": {
      "headers": {
        "accept": "application/vnd.github.inertia-preview+json"
      },
      "method": "GET",
      "params": {
        "affiliation": {
          "enum": [
            "outside",
            "direct",
            "all"
          ],
          "type": "string"
        },
        "page": {
          "type": "integer"
        },
        "per_page": {
          "type": "integer"
        },
        "project_id": {
          "required": true,
          "type": "integer"
        }
      },
      "url": "/projects/:project_id/collaborators"
    },
    "listColumns": {
      "headers": {
        "accept": "application/vnd.github.inertia-preview+json"
      },
      "method": "GET",
      "params": {
        "page": {
          "type": "integer"
        },
        "per_page": {
          "type": "integer"
        },
        "project_id": {
          "required": true,
          "type": "integer"
        }
      },
      "url": "/projects/:project_id/columns"
    },
    "listForOrg": {
      "headers": {
        "accept": "application/vnd.github.inertia-preview+json"
      },
      "method": "GET",
      "params": {
        "org": {
          "required": true,
          "type": "string"
        },
        "page": {
          "type": "integer"
        },
        "per_page": {
          "type": "integer"
        },
        "state": {
          "enum": [
            "open",
            "closed",
            "all"
          ],
          "type": "string"
        }
      },
      "url": "/orgs/:org/projects"
    },
    "listForRepo": {
      "headers": {
        "accept": "application/vnd.github.inertia-preview+json"
      },
      "method": "GET",
      "params": {
        "owner": {
          "required": true,
          "type": "string"
        },
        "page": {
          "type": "integer"
        },
        "per_page": {
          "type": "integer"
        },
        "repo": {
          "required": true,
          "type": "string"
        },
        "state": {
          "enum": [
            "open",
            "closed",
            "all"
          ],
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/projects"
    },
    "listForUser": {
      "headers": {
        "accept": "application/vnd.github.inertia-preview+json"
      },
      "method": "GET",
      "params": {
        "page": {
          "type": "integer"
        },
        "per_page": {
          "type": "integer"
        },
        "state": {
          "enum": [
            "open",
            "closed",
            "all"
          ],
          "type": "string"
        },
        "username": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/users/:username/projects"
    },
    "moveCard": {
      "headers": {
        "accept": "application/vnd.github.inertia-preview+json"
      },
      "method": "POST",
      "params": {
        "card_id": {
          "required": true,
          "type": "integer"
        },
        "column_id": {
          "type": "integer"
        },
        "position": {
          "required": true,
          "type": "string",
          "validation": "^(top|bottom|after:\\d+)$"
        }
      },
      "url": "/projects/columns/cards/:card_id/moves"
    },
    "moveColumn": {
      "headers": {
        "accept": "application/vnd.github.inertia-preview+json"
      },
      "method": "POST",
      "params": {
        "column_id": {
          "required": true,
          "type": "integer"
        },
        "position": {
          "required": true,
          "type": "string",
          "validation": "^(first|last|after:\\d+)$"
        }
      },
      "url": "/projects/columns/:column_id/moves"
    },
    "removeCollaborator": {
      "headers": {
        "accept": "application/vnd.github.inertia-preview+json"
      },
      "method": "DELETE",
      "params": {
        "project_id": {
          "required": true,
          "type": "integer"
        },
        "username": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/projects/:project_id/collaborators/:username"
    },
    "reviewUserPermissionLevel": {
      "headers": {
        "accept": "application/vnd.github.inertia-preview+json"
      },
      "method": "GET",
      "params": {
        "project_id": {
          "required": true,
          "type": "integer"
        },
        "username": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/projects/:project_id/collaborators/:username/permission"
    },
    "update": {
      "headers": {
        "accept": "application/vnd.github.inertia-preview+json"
      },
      "method": "PATCH",
      "params": {
        "body": {
          "type": "string"
        },
        "name": {
          "type": "string"
        },
        "organization_permission": {
          "type": "string"
        },
        "page": {
          "type": "integer"
        },
        "per_page": {
          "type": "integer"
        },
        "private": {
          "type": "boolean"
        },
        "project_id": {
          "required": true,
          "type": "integer"
        },
        "state": {
          "enum": [
            "open",
            "closed"
          ],
          "type": "string"
        }
      },
      "url": "/projects/:project_id"
    },
    "updateCard": {
      "headers": {
        "accept": "application/vnd.github.inertia-preview+json"
      },
      "method": "PATCH",
      "params": {
        "archived": {
          "type": "boolean"
        },
        "card_id": {
          "required": true,
          "type": "integer"
        },
        "note": {
          "type": "string"
        }
      },
      "url": "/projects/columns/cards/:card_id"
    },
    "updateColumn": {
      "headers": {
        "accept": "application/vnd.github.inertia-preview+json"
      },
      "method": "PATCH",
      "params": {
        "column_id": {
          "required": true,
          "type": "integer"
        },
        "name": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/projects/columns/:column_id"
    }
  },
  "pulls": {
    "checkIfMerged": {
      "method": "GET",
      "params": {
        "number": {
          "alias": "pull_number",
          "deprecated": true,
          "type": "integer"
        },
        "owner": {
          "required": true,
          "type": "string"
        },
        "pull_number": {
          "required": true,
          "type": "integer"
        },
        "repo": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/pulls/:pull_number/merge"
    },
    "create": {
      "method": "POST",
      "params": {
        "base": {
          "required": true,
          "type": "string"
        },
        "body": {
          "type": "string"
        },
        "draft": {
          "type": "boolean"
        },
        "head": {
          "required": true,
          "type": "string"
        },
        "maintainer_can_modify": {
          "type": "boolean"
        },
        "owner": {
          "required": true,
          "type": "string"
        },
        "repo": {
          "required": true,
          "type": "string"
        },
        "title": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/pulls"
    },
    "createComment": {
      "method": "POST",
      "params": {
        "body": {
          "required": true,
          "type": "string"
        },
        "commit_id": {
          "required": true,
          "type": "string"
        },
        "number": {
          "alias": "pull_number",
          "deprecated": true,
          "type": "integer"
        },
        "owner": {
          "required": true,
          "type": "string"
        },
        "path": {
          "required": true,
          "type": "string"
        },
        "position": {
          "required": true,
          "type": "integer"
        },
        "pull_number": {
          "required": true,
          "type": "integer"
        },
        "repo": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/pulls/:pull_number/comments"
    },
    "createCommentReply": {
      "method": "POST",
      "params": {
        "body": {
          "required": true,
          "type": "string"
        },
        "in_reply_to": {
          "required": true,
          "type": "integer"
        },
        "number": {
          "alias": "pull_number",
          "deprecated": true,
          "type": "integer"
        },
        "owner": {
          "required": true,
          "type": "string"
        },
        "pull_number": {
          "required": true,
          "type": "integer"
        },
        "repo": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/pulls/:pull_number/comments"
    },
    "createFromIssue": {
      "method": "POST",
      "params": {
        "base": {
          "required": true,
          "type": "string"
        },
        "draft": {
          "type": "boolean"
        },
        "head": {
          "required": true,
          "type": "string"
        },
        "issue": {
          "required": true,
          "type": "integer"
        },
        "maintainer_can_modify": {
          "type": "boolean"
        },
        "owner": {
          "required": true,
          "type": "string"
        },
        "repo": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/pulls"
    },
    "createReview": {
      "method": "POST",
      "params": {
        "body": {
          "type": "string"
        },
        "comments": {
          "type": "object[]"
        },
        "comments[].body": {
          "required": true,
          "type": "string"
        },
        "comments[].path": {
          "required": true,
          "type": "string"
        },
        "comments[].position": {
          "required": true,
          "type": "integer"
        },
        "commit_id": {
          "type": "string"
        },
        "event": {
          "enum": [
            "APPROVE",
            "REQUEST_CHANGES",
            "COMMENT"
          ],
          "type": "string"
        },
        "number": {
          "alias": "pull_number",
          "deprecated": true,
          "type": "integer"
        },
        "owner": {
          "required": true,
          "type": "string"
        },
        "pull_number": {
          "required": true,
          "type": "integer"
        },
        "repo": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/pulls/:pull_number/reviews"
    },
    "createReviewRequest": {
      "method": "POST",
      "params": {
        "number": {
          "alias": "pull_number",
          "deprecated": true,
          "type": "integer"
        },
        "owner": {
          "required": true,
          "type": "string"
        },
        "pull_number": {
          "required": true,
          "type": "integer"
        },
        "repo": {
          "required": true,
          "type": "string"
        },
        "reviewers": {
          "type": "string[]"
        },
        "team_reviewers": {
          "type": "string[]"
        }
      },
      "url": "/repos/:owner/:repo/pulls/:pull_number/requested_reviewers"
    },
    "deleteComment": {
      "method": "DELETE",
      "params": {
        "comment_id": {
          "required": true,
          "type": "integer"
        },
        "owner": {
          "required": true,
          "type": "string"
        },
        "repo": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/pulls/comments/:comment_id"
    },
    "deletePendingReview": {
      "method": "DELETE",
      "params": {
        "number": {
          "alias": "pull_number",
          "deprecated": true,
          "type": "integer"
        },
        "owner": {
          "required": true,
          "type": "string"
        },
        "pull_number": {
          "required": true,
          "type": "integer"
        },
        "repo": {
          "required": true,
          "type": "string"
        },
        "review_id": {
          "required": true,
          "type": "integer"
        }
      },
      "url": "/repos/:owner/:repo/pulls/:pull_number/reviews/:review_id"
    },
    "deleteReviewRequest": {
      "method": "DELETE",
      "params": {
        "number": {
          "alias": "pull_number",
          "deprecated": true,
          "type": "integer"
        },
        "owner": {
          "required": true,
          "type": "string"
        },
        "pull_number": {
          "required": true,
          "type": "integer"
        },
        "repo": {
          "required": true,
          "type": "string"
        },
        "reviewers": {
          "type": "string[]"
        },
        "team_reviewers": {
          "type": "string[]"
        }
      },
      "url": "/repos/:owner/:repo/pulls/:pull_number/requested_reviewers"
    },
    "dismissReview": {
      "method": "PUT",
      "params": {
        "message": {
          "required": true,
          "type": "string"
        },
        "number": {
          "alias": "pull_number",
          "deprecated": true,
          "type": "integer"
        },
        "owner": {
          "required": true,
          "type": "string"
        },
        "pull_number": {
          "required": true,
          "type": "integer"
        },
        "repo": {
          "required": true,
          "type": "string"
        },
        "review_id": {
          "required": true,
          "type": "integer"
        }
      },
      "url": "/repos/:owner/:repo/pulls/:pull_number/reviews/:review_id/dismissals"
    },
    "get": {
      "method": "GET",
      "params": {
        "number": {
          "alias": "pull_number",
          "deprecated": true,
          "type": "integer"
        },
        "owner": {
          "required": true,
          "type": "string"
        },
        "pull_number": {
          "required": true,
          "type": "integer"
        },
        "repo": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/pulls/:pull_number"
    },
    "getComment": {
      "method": "GET",
      "params": {
        "comment_id": {
          "required": true,
          "type": "integer"
        },
        "owner": {
          "required": true,
          "type": "string"
        },
        "repo": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/pulls/comments/:comment_id"
    },
    "getCommentsForReview": {
      "method": "GET",
      "params": {
        "number": {
          "alias": "pull_number",
          "deprecated": true,
          "type": "integer"
        },
        "owner": {
          "required": true,
          "type": "string"
        },
        "page": {
          "type": "integer"
        },
        "per_page": {
          "type": "integer"
        },
        "pull_number": {
          "required": true,
          "type": "integer"
        },
        "repo": {
          "required": true,
          "type": "string"
        },
        "review_id": {
          "required": true,
          "type": "integer"
        }
      },
      "url": "/repos/:owner/:repo/pulls/:pull_number/reviews/:review_id/comments"
    },
    "getReview": {
      "method": "GET",
      "params": {
        "number": {
          "alias": "pull_number",
          "deprecated": true,
          "type": "integer"
        },
        "owner": {
          "required": true,
          "type": "string"
        },
        "pull_number": {
          "required": true,
          "type": "integer"
        },
        "repo": {
          "required": true,
          "type": "string"
        },
        "review_id": {
          "required": true,
          "type": "integer"
        }
      },
      "url": "/repos/:owner/:repo/pulls/:pull_number/reviews/:review_id"
    },
    "list": {
      "method": "GET",
      "params": {
        "base": {
          "type": "string"
        },
        "direction": {
          "enum": [
            "asc",
            "desc"
          ],
          "type": "string"
        },
        "head": {
          "type": "string"
        },
        "owner": {
          "required": true,
          "type": "string"
        },
        "page": {
          "type": "integer"
        },
        "per_page": {
          "type": "integer"
        },
        "repo": {
          "required": true,
          "type": "string"
        },
        "sort": {
          "enum": [
            "created",
            "updated",
            "popularity",
            "long-running"
          ],
          "type": "string"
        },
        "state": {
          "enum": [
            "open",
            "closed",
            "all"
          ],
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/pulls"
    },
    "listComments": {
      "method": "GET",
      "params": {
        "direction": {
          "enum": [
            "asc",
            "desc"
          ],
          "type": "string"
        },
        "number": {
          "alias": "pull_number",
          "deprecated": true,
          "type": "integer"
        },
        "owner": {
          "required": true,
          "type": "string"
        },
        "page": {
          "type": "integer"
        },
        "per_page": {
          "type": "integer"
        },
        "pull_number": {
          "required": true,
          "type": "integer"
        },
        "repo": {
          "required": true,
          "type": "string"
        },
        "since": {
          "type": "string"
        },
        "sort": {
          "enum": [
            "created",
            "updated"
          ],
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/pulls/:pull_number/comments"
    },
    "listCommentsForRepo": {
      "method": "GET",
      "params": {
        "direction": {
          "enum": [
            "asc",
            "desc"
          ],
          "type": "string"
        },
        "owner": {
          "required": true,
          "type": "string"
        },
        "page": {
          "type": "integer"
        },
        "per_page": {
          "type": "integer"
        },
        "repo": {
          "required": true,
          "type": "string"
        },
        "since": {
          "type": "string"
        },
        "sort": {
          "enum": [
            "created",
            "updated"
          ],
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/pulls/comments"
    },
    "listCommits": {
      "method": "GET",
      "params": {
        "number": {
          "alias": "pull_number",
          "deprecated": true,
          "type": "integer"
        },
        "owner": {
          "required": true,
          "type": "string"
        },
        "page": {
          "type": "integer"
        },
        "per_page": {
          "type": "integer"
        },
        "pull_number": {
          "required": true,
          "type": "integer"
        },
        "repo": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/pulls/:pull_number/commits"
    },
    "listFiles": {
      "method": "GET",
      "params": {
        "number": {
          "alias": "pull_number",
          "deprecated": true,
          "type": "integer"
        },
        "owner": {
          "required": true,
          "type": "string"
        },
        "page": {
          "type": "integer"
        },
        "per_page": {
          "type": "integer"
        },
        "pull_number": {
          "required": true,
          "type": "integer"
        },
        "repo": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/pulls/:pull_number/files"
    },
    "listReviewRequests": {
      "method": "GET",
      "params": {
        "number": {
          "alias": "pull_number",
          "deprecated": true,
          "type": "integer"
        },
        "owner": {
          "required": true,
          "type": "string"
        },
        "page": {
          "type": "integer"
        },
        "per_page": {
          "type": "integer"
        },
        "pull_number": {
          "required": true,
          "type": "integer"
        },
        "repo": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/pulls/:pull_number/requested_reviewers"
    },
    "listReviews": {
      "method": "GET",
      "params": {
        "number": {
          "alias": "pull_number",
          "deprecated": true,
          "type": "integer"
        },
        "owner": {
          "required": true,
          "type": "string"
        },
        "page": {
          "type": "integer"
        },
        "per_page": {
          "type": "integer"
        },
        "pull_number": {
          "required": true,
          "type": "integer"
        },
        "repo": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/pulls/:pull_number/reviews"
    },
    "merge": {
      "method": "PUT",
      "params": {
        "commit_message": {
          "type": "string"
        },
        "commit_title": {
          "type": "string"
        },
        "merge_method": {
          "enum": [
            "merge",
            "squash",
            "rebase"
          ],
          "type": "string"
        },
        "number": {
          "alias": "pull_number",
          "deprecated": true,
          "type": "integer"
        },
        "owner": {
          "required": true,
          "type": "string"
        },
        "pull_number": {
          "required": true,
          "type": "integer"
        },
        "repo": {
          "required": true,
          "type": "string"
        },
        "sha": {
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/pulls/:pull_number/merge"
    },
    "submitReview": {
      "method": "POST",
      "params": {
        "body": {
          "type": "string"
        },
        "event": {
          "enum": [
            "APPROVE",
            "REQUEST_CHANGES",
            "COMMENT"
          ],
          "required": true,
          "type": "string"
        },
        "number": {
          "alias": "pull_number",
          "deprecated": true,
          "type": "integer"
        },
        "owner": {
          "required": true,
          "type": "string"
        },
        "pull_number": {
          "required": true,
          "type": "integer"
        },
        "repo": {
          "required": true,
          "type": "string"
        },
        "review_id": {
          "required": true,
          "type": "integer"
        }
      },
      "url": "/repos/:owner/:repo/pulls/:pull_number/reviews/:review_id/events"
    },
    "update": {
      "method": "PATCH",
      "params": {
        "base": {
          "type": "string"
        },
        "body": {
          "type": "string"
        },
        "maintainer_can_modify": {
          "type": "boolean"
        },
        "number": {
          "alias": "pull_number",
          "deprecated": true,
          "type": "integer"
        },
        "owner": {
          "required": true,
          "type": "string"
        },
        "pull_number": {
          "required": true,
          "type": "integer"
        },
        "repo": {
          "required": true,
          "type": "string"
        },
        "state": {
          "enum": [
            "open",
            "closed"
          ],
          "type": "string"
        },
        "title": {
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/pulls/:pull_number"
    },
    "updateBranch": {
      "headers": {
        "accept": "application/vnd.github.lydian-preview+json"
      },
      "method": "PUT",
      "params": {
        "expected_head_sha": {
          "type": "string"
        },
        "owner": {
          "required": true,
          "type": "string"
        },
        "pull_number": {
          "required": true,
          "type": "integer"
        },
        "repo": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/pulls/:pull_number/update-branch"
    },
    "updateComment": {
      "method": "PATCH",
      "params": {
        "body": {
          "required": true,
          "type": "string"
        },
        "comment_id": {
          "required": true,
          "type": "integer"
        },
        "owner": {
          "required": true,
          "type": "string"
        },
        "repo": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/pulls/comments/:comment_id"
    },
    "updateReview": {
      "method": "PUT",
      "params": {
        "body": {
          "required": true,
          "type": "string"
        },
        "number": {
          "alias": "pull_number",
          "deprecated": true,
          "type": "integer"
        },
        "owner": {
          "required": true,
          "type": "string"
        },
        "pull_number": {
          "required": true,
          "type": "integer"
        },
        "repo": {
          "required": true,
          "type": "string"
        },
        "review_id": {
          "required": true,
          "type": "integer"
        }
      },
      "url": "/repos/:owner/:repo/pulls/:pull_number/reviews/:review_id"
    }
  },
  "rateLimit": {
    "get": {
      "method": "GET",
      "params": {},
      "url": "/rate_limit"
    }
  },
  "reactions": {
    "createForCommitComment": {
      "headers": {
        "accept": "application/vnd.github.squirrel-girl-preview+json"
      },
      "method": "POST",
      "params": {
        "comment_id": {
          "required": true,
          "type": "integer"
        },
        "content": {
          "enum": [
            "+1",
            "-1",
            "laugh",
            "confused",
            "heart",
            "hooray",
            "rocket",
            "eyes"
          ],
          "required": true,
          "type": "string"
        },
        "owner": {
          "required": true,
          "type": "string"
        },
        "repo": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/comments/:comment_id/reactions"
    },
    "createForIssue": {
      "headers": {
        "accept": "application/vnd.github.squirrel-girl-preview+json"
      },
      "method": "POST",
      "params": {
        "content": {
          "enum": [
            "+1",
            "-1",
            "laugh",
            "confused",
            "heart",
            "hooray",
            "rocket",
            "eyes"
          ],
          "required": true,
          "type": "string"
        },
        "issue_number": {
          "required": true,
          "type": "integer"
        },
        "number": {
          "alias": "issue_number",
          "deprecated": true,
          "type": "integer"
        },
        "owner": {
          "required": true,
          "type": "string"
        },
        "repo": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/issues/:issue_number/reactions"
    },
    "createForIssueComment": {
      "headers": {
        "accept": "application/vnd.github.squirrel-girl-preview+json"
      },
      "method": "POST",
      "params": {
        "comment_id": {
          "required": true,
          "type": "integer"
        },
        "content": {
          "enum": [
            "+1",
            "-1",
            "laugh",
            "confused",
            "heart",
            "hooray",
            "rocket",
            "eyes"
          ],
          "required": true,
          "type": "string"
        },
        "owner": {
          "required": true,
          "type": "string"
        },
        "repo": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/issues/comments/:comment_id/reactions"
    },
    "createForPullRequestReviewComment": {
      "headers": {
        "accept": "application/vnd.github.squirrel-girl-preview+json"
      },
      "method": "POST",
      "params": {
        "comment_id": {
          "required": true,
          "type": "integer"
        },
        "content": {
          "enum": [
            "+1",
            "-1",
            "laugh",
            "confused",
            "heart",
            "hooray",
            "rocket",
            "eyes"
          ],
          "required": true,
          "type": "string"
        },
        "owner": {
          "required": true,
          "type": "string"
        },
        "repo": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/pulls/comments/:comment_id/reactions"
    },
    "createForTeamDiscussion": {
      "headers": {
        "accept": "application/vnd.github.echo-preview+json,application/vnd.github.squirrel-girl-preview+json"
      },
      "method": "POST",
      "params": {
        "content": {
          "enum": [
            "+1",
            "-1",
            "laugh",
            "confused",
            "heart",
            "hooray",
            "rocket",
            "eyes"
          ],
          "required": true,
          "type": "string"
        },
        "discussion_number": {
          "required": true,
          "type": "integer"
        },
        "team_id": {
          "required": true,
          "type": "integer"
        }
      },
      "url": "/teams/:team_id/discussions/:discussion_number/reactions"
    },
    "createForTeamDiscussionComment": {
      "headers": {
        "accept": "application/vnd.github.echo-preview+json,application/vnd.github.squirrel-girl-preview+json"
      },
      "method": "POST",
      "params": {
        "comment_number": {
          "required": true,
          "type": "integer"
        },
        "content": {
          "enum": [
            "+1",
            "-1",
            "laugh",
            "confused",
            "heart",
            "hooray",
            "rocket",
            "eyes"
          ],
          "required": true,
          "type": "string"
        },
        "discussion_number": {
          "required": true,
          "type": "integer"
        },
        "team_id": {
          "required": true,
          "type": "integer"
        }
      },
      "url": "/teams/:team_id/discussions/:discussion_number/comments/:comment_number/reactions"
    },
    "delete": {
      "headers": {
        "accept": "application/vnd.github.echo-preview+json,application/vnd.github.squirrel-girl-preview+json"
      },
      "method": "DELETE",
      "params": {
        "reaction_id": {
          "required": true,
          "type": "integer"
        }
      },
      "url": "/reactions/:reaction_id"
    },
    "listForCommitComment": {
      "headers": {
        "accept": "application/vnd.github.squirrel-girl-preview+json"
      },
      "method": "GET",
      "params": {
        "comment_id": {
          "required": true,
          "type": "integer"
        },
        "content": {
          "enum": [
            "+1",
            "-1",
            "laugh",
            "confused",
            "heart",
            "hooray",
            "rocket",
            "eyes"
          ],
          "type": "string"
        },
        "owner": {
          "required": true,
          "type": "string"
        },
        "page": {
          "type": "integer"
        },
        "per_page": {
          "type": "integer"
        },
        "repo": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/comments/:comment_id/reactions"
    },
    "listForIssue": {
      "headers": {
        "accept": "application/vnd.github.squirrel-girl-preview+json"
      },
      "method": "GET",
      "params": {
        "content": {
          "enum": [
            "+1",
            "-1",
            "laugh",
            "confused",
            "heart",
            "hooray",
            "rocket",
            "eyes"
          ],
          "type": "string"
        },
        "issue_number": {
          "required": true,
          "type": "integer"
        },
        "number": {
          "alias": "issue_number",
          "deprecated": true,
          "type": "integer"
        },
        "owner": {
          "required": true,
          "type": "string"
        },
        "page": {
          "type": "integer"
        },
        "per_page": {
          "type": "integer"
        },
        "repo": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/issues/:issue_number/reactions"
    },
    "listForIssueComment": {
      "headers": {
        "accept": "application/vnd.github.squirrel-girl-preview+json"
      },
      "method": "GET",
      "params": {
        "comment_id": {
          "required": true,
          "type": "integer"
        },
        "content": {
          "enum": [
            "+1",
            "-1",
            "laugh",
            "confused",
            "heart",
            "hooray",
            "rocket",
            "eyes"
          ],
          "type": "string"
        },
        "owner": {
          "required": true,
          "type": "string"
        },
        "page": {
          "type": "integer"
        },
        "per_page": {
          "type": "integer"
        },
        "repo": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/issues/comments/:comment_id/reactions"
    },
    "listForPullRequestReviewComment": {
      "headers": {
        "accept": "application/vnd.github.squirrel-girl-preview+json"
      },
      "method": "GET",
      "params": {
        "comment_id": {
          "required": true,
          "type": "integer"
        },
        "content": {
          "enum": [
            "+1",
            "-1",
            "laugh",
            "confused",
            "heart",
            "hooray",
            "rocket",
            "eyes"
          ],
          "type": "string"
        },
        "owner": {
          "required": true,
          "type": "string"
        },
        "page": {
          "type": "integer"
        },
        "per_page": {
          "type": "integer"
        },
        "repo": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/pulls/comments/:comment_id/reactions"
    },
    "listForTeamDiscussion": {
      "headers": {
        "accept": "application/vnd.github.echo-preview+json,application/vnd.github.squirrel-girl-preview+json"
      },
      "method": "GET",
      "params": {
        "content": {
          "enum": [
            "+1",
            "-1",
            "laugh",
            "confused",
            "heart",
            "hooray",
            "rocket",
            "eyes"
          ],
          "type": "string"
        },
        "discussion_number": {
          "required": true,
          "type": "integer"
        },
        "page": {
          "type": "integer"
        },
        "per_page": {
          "type": "integer"
        },
        "team_id": {
          "required": true,
          "type": "integer"
        }
      },
      "url": "/teams/:team_id/discussions/:discussion_number/reactions"
    },
    "listForTeamDiscussionComment": {
      "headers": {
        "accept": "application/vnd.github.echo-preview+json,application/vnd.github.squirrel-girl-preview+json"
      },
      "method": "GET",
      "params": {
        "comment_number": {
          "required": true,
          "type": "integer"
        },
        "content": {
          "enum": [
            "+1",
            "-1",
            "laugh",
            "confused",
            "heart",
            "hooray",
            "rocket",
            "eyes"
          ],
          "type": "string"
        },
        "discussion_number": {
          "required": true,
          "type": "integer"
        },
        "page": {
          "type": "integer"
        },
        "per_page": {
          "type": "integer"
        },
        "team_id": {
          "required": true,
          "type": "integer"
        }
      },
      "url": "/teams/:team_id/discussions/:discussion_number/comments/:comment_number/reactions"
    }
  },
  "repos": {
    "acceptInvitation": {
      "method": "PATCH",
      "params": {
        "invitation_id": {
          "required": true,
          "type": "integer"
        }
      },
      "url": "/user/repository_invitations/:invitation_id"
    },
    "addCollaborator": {
      "method": "PUT",
      "params": {
        "owner": {
          "required": true,
          "type": "string"
        },
        "permission": {
          "enum": [
            "pull",
            "push",
            "admin"
          ],
          "type": "string"
        },
        "repo": {
          "required": true,
          "type": "string"
        },
        "username": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/collaborators/:username"
    },
    "addDeployKey": {
      "method": "POST",
      "params": {
        "key": {
          "required": true,
          "type": "string"
        },
        "owner": {
          "required": true,
          "type": "string"
        },
        "read_only": {
          "type": "boolean"
        },
        "repo": {
          "required": true,
          "type": "string"
        },
        "title": {
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/keys"
    },
    "addProtectedBranchAdminEnforcement": {
      "method": "POST",
      "params": {
        "branch": {
          "required": true,
          "type": "string"
        },
        "owner": {
          "required": true,
          "type": "string"
        },
        "repo": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/branches/:branch/protection/enforce_admins"
    },
    "addProtectedBranchRequiredSignatures": {
      "headers": {
        "accept": "application/vnd.github.zzzax-preview+json"
      },
      "method": "POST",
      "params": {
        "branch": {
          "required": true,
          "type": "string"
        },
        "owner": {
          "required": true,
          "type": "string"
        },
        "repo": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/branches/:branch/protection/required_signatures"
    },
    "addProtectedBranchRequiredStatusChecksContexts": {
      "method": "POST",
      "params": {
        "branch": {
          "required": true,
          "type": "string"
        },
        "contexts": {
          "mapTo": "data",
          "required": true,
          "type": "string[]"
        },
        "owner": {
          "required": true,
          "type": "string"
        },
        "repo": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/branches/:branch/protection/required_status_checks/contexts"
    },
    "addProtectedBranchTeamRestrictions": {
      "method": "POST",
      "params": {
        "branch": {
          "required": true,
          "type": "string"
        },
        "owner": {
          "required": true,
          "type": "string"
        },
        "repo": {
          "required": true,
          "type": "string"
        },
        "teams": {
          "mapTo": "data",
          "required": true,
          "type": "string[]"
        }
      },
      "url": "/repos/:owner/:repo/branches/:branch/protection/restrictions/teams"
    },
    "addProtectedBranchUserRestrictions": {
      "method": "POST",
      "params": {
        "branch": {
          "required": true,
          "type": "string"
        },
        "owner": {
          "required": true,
          "type": "string"
        },
        "repo": {
          "required": true,
          "type": "string"
        },
        "users": {
          "mapTo": "data",
          "required": true,
          "type": "string[]"
        }
      },
      "url": "/repos/:owner/:repo/branches/:branch/protection/restrictions/users"
    },
    "checkCollaborator": {
      "method": "GET",
      "params": {
        "owner": {
          "required": true,
          "type": "string"
        },
        "repo": {
          "required": true,
          "type": "string"
        },
        "username": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/collaborators/:username"
    },
    "checkVulnerabilityAlerts": {
      "headers": {
        "accept": "application/vnd.github.dorian-preview+json"
      },
      "method": "GET",
      "params": {
        "owner": {
          "required": true,
          "type": "string"
        },
        "repo": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/vulnerability-alerts"
    },
    "compareCommits": {
      "method": "GET",
      "params": {
        "base": {
          "required": true,
          "type": "string"
        },
        "head": {
          "required": true,
          "type": "string"
        },
        "owner": {
          "required": true,
          "type": "string"
        },
        "repo": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/compare/:base...:head"
    },
    "createCommitComment": {
      "method": "POST",
      "params": {
        "body": {
          "required": true,
          "type": "string"
        },
        "commit_sha": {
          "required": true,
          "type": "string"
        },
        "line": {
          "type": "integer"
        },
        "owner": {
          "required": true,
          "type": "string"
        },
        "path": {
          "type": "string"
        },
        "position": {
          "type": "integer"
        },
        "repo": {
          "required": true,
          "type": "string"
        },
        "sha": {
          "alias": "commit_sha",
          "deprecated": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/commits/:commit_sha/comments"
    },
    "createDeployment": {
      "method": "POST",
      "params": {
        "auto_merge": {
          "type": "boolean"
        },
        "description": {
          "type": "string"
        },
        "environment": {
          "type": "string"
        },
        "owner": {
          "required": true,
          "type": "string"
        },
        "payload": {
          "type": "string"
        },
        "production_environment": {
          "type": "boolean"
        },
        "ref": {
          "required": true,
          "type": "string"
        },
        "repo": {
          "required": true,
          "type": "string"
        },
        "required_contexts": {
          "type": "string[]"
        },
        "task": {
          "type": "string"
        },
        "transient_environment": {
          "type": "boolean"
        }
      },
      "url": "/repos/:owner/:repo/deployments"
    },
    "createDeploymentStatus": {
      "method": "POST",
      "params": {
        "auto_inactive": {
          "type": "boolean"
        },
        "deployment_id": {
          "required": true,
          "type": "integer"
        },
        "description": {
          "type": "string"
        },
        "environment": {
          "enum": [
            "production",
            "staging",
            "qa"
          ],
          "type": "string"
        },
        "environment_url": {
          "type": "string"
        },
        "log_url": {
          "type": "string"
        },
        "owner": {
          "required": true,
          "type": "string"
        },
        "repo": {
          "required": true,
          "type": "string"
        },
        "state": {
          "enum": [
            "error",
            "failure",
            "inactive",
            "in_progress",
            "queued",
            "pending",
            "success"
          ],
          "required": true,
          "type": "string"
        },
        "target_url": {
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/deployments/:deployment_id/statuses"
    },
    "createFile": {
      "deprecated": "octokit.repos.createFile() has been renamed to octokit.repos.createOrUpdateFile() (2019-06-07)",
      "method": "PUT",
      "params": {
        "author": {
          "type": "object"
        },
        "author.email": {
          "required": true,
          "type": "string"
        },
        "author.name": {
          "required": true,
          "type": "string"
        },
        "branch": {
          "type": "string"
        },
        "committer": {
          "type": "object"
        },
        "committer.email": {
          "required": true,
          "type": "string"
        },
        "committer.name": {
          "required": true,
          "type": "string"
        },
        "content": {
          "required": true,
          "type": "string"
        },
        "message": {
          "required": true,
          "type": "string"
        },
        "owner": {
          "required": true,
          "type": "string"
        },
        "path": {
          "required": true,
          "type": "string"
        },
        "repo": {
          "required": true,
          "type": "string"
        },
        "sha": {
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/contents/:path"
    },
    "createForAuthenticatedUser": {
      "method": "POST",
      "params": {
        "allow_merge_commit": {
          "type": "boolean"
        },
        "allow_rebase_merge": {
          "type": "boolean"
        },
        "allow_squash_merge": {
          "type": "boolean"
        },
        "auto_init": {
          "type": "boolean"
        },
        "description": {
          "type": "string"
        },
        "gitignore_template": {
          "type": "string"
        },
        "has_issues": {
          "type": "boolean"
        },
        "has_projects": {
          "type": "boolean"
        },
        "has_wiki": {
          "type": "boolean"
        },
        "homepage": {
          "type": "string"
        },
        "is_template": {
          "type": "boolean"
        },
        "license_template": {
          "type": "string"
        },
        "name": {
          "required": true,
          "type": "string"
        },
        "private": {
          "type": "boolean"
        },
        "team_id": {
          "type": "integer"
        }
      },
      "url": "/user/repos"
    },
    "createFork": {
      "method": "POST",
      "params": {
        "organization": {
          "type": "string"
        },
        "owner": {
          "required": true,
          "type": "string"
        },
        "repo": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/forks"
    },
    "createHook": {
      "method": "POST",
      "params": {
        "active": {
          "type": "boolean"
        },
        "config": {
          "required": true,
          "type": "object"
        },
        "config.content_type": {
          "type": "string"
        },
        "config.insecure_ssl": {
          "type": "string"
        },
        "config.secret": {
          "type": "string"
        },
        "config.url": {
          "required": true,
          "type": "string"
        },
        "events": {
          "type": "string[]"
        },
        "name": {
          "type": "string"
        },
        "owner": {
          "required": true,
          "type": "string"
        },
        "repo": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/hooks"
    },
    "createInOrg": {
      "method": "POST",
      "params": {
        "allow_merge_commit": {
          "type": "boolean"
        },
        "allow_rebase_merge": {
          "type": "boolean"
        },
        "allow_squash_merge": {
          "type": "boolean"
        },
        "auto_init": {
          "type": "boolean"
        },
        "description": {
          "type": "string"
        },
        "gitignore_template": {
          "type": "string"
        },
        "has_issues": {
          "type": "boolean"
        },
        "has_projects": {
          "type": "boolean"
        },
        "has_wiki": {
          "type": "boolean"
        },
        "homepage": {
          "type": "string"
        },
        "is_template": {
          "type": "boolean"
        },
        "license_template": {
          "type": "string"
        },
        "name": {
          "required": true,
          "type": "string"
        },
        "org": {
          "required": true,
          "type": "string"
        },
        "private": {
          "type": "boolean"
        },
        "team_id": {
          "type": "integer"
        }
      },
      "url": "/orgs/:org/repos"
    },
    "createOrUpdateFile": {
      "method": "PUT",
      "params": {
        "author": {
          "type": "object"
        },
        "author.email": {
          "required": true,
          "type": "string"
        },
        "author.name": {
          "required": true,
          "type": "string"
        },
        "branch": {
          "type": "string"
        },
        "committer": {
          "type": "object"
        },
        "committer.email": {
          "required": true,
          "type": "string"
        },
        "committer.name": {
          "required": true,
          "type": "string"
        },
        "content": {
          "required": true,
          "type": "string"
        },
        "message": {
          "required": true,
          "type": "string"
        },
        "owner": {
          "required": true,
          "type": "string"
        },
        "path": {
          "required": true,
          "type": "string"
        },
        "repo": {
          "required": true,
          "type": "string"
        },
        "sha": {
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/contents/:path"
    },
    "createRelease": {
      "method": "POST",
      "params": {
        "body": {
          "type": "string"
        },
        "draft": {
          "type": "boolean"
        },
        "name": {
          "type": "string"
        },
        "owner": {
          "required": true,
          "type": "string"
        },
        "prerelease": {
          "type": "boolean"
        },
        "repo": {
          "required": true,
          "type": "string"
        },
        "tag_name": {
          "required": true,
          "type": "string"
        },
        "target_commitish": {
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/releases"
    },
    "createStatus": {
      "method": "POST",
      "params": {
        "context": {
          "type": "string"
        },
        "description": {
          "type": "string"
        },
        "owner": {
          "required": true,
          "type": "string"
        },
        "repo": {
          "required": true,
          "type": "string"
        },
        "sha": {
          "required": true,
          "type": "string"
        },
        "state": {
          "enum": [
            "error",
            "failure",
            "pending",
            "success"
          ],
          "required": true,
          "type": "string"
        },
        "target_url": {
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/statuses/:sha"
    },
    "createUsingTemplate": {
      "headers": {
        "accept": "application/vnd.github.baptiste-preview+json"
      },
      "method": "POST",
      "params": {
        "description": {
          "type": "string"
        },
        "name": {
          "required": true,
          "type": "string"
        },
        "owner": {
          "type": "string"
        },
        "private": {
          "type": "boolean"
        },
        "template_owner": {
          "required": true,
          "type": "string"
        },
        "template_repo": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:template_owner/:template_repo/generate"
    },
    "declineInvitation": {
      "method": "DELETE",
      "params": {
        "invitation_id": {
          "required": true,
          "type": "integer"
        }
      },
      "url": "/user/repository_invitations/:invitation_id"
    },
    "delete": {
      "method": "DELETE",
      "params": {
        "owner": {
          "required": true,
          "type": "string"
        },
        "repo": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo"
    },
    "deleteCommitComment": {
      "method": "DELETE",
      "params": {
        "comment_id": {
          "required": true,
          "type": "integer"
        },
        "owner": {
          "required": true,
          "type": "string"
        },
        "repo": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/comments/:comment_id"
    },
    "deleteDownload": {
      "method": "DELETE",
      "params": {
        "download_id": {
          "required": true,
          "type": "integer"
        },
        "owner": {
          "required": true,
          "type": "string"
        },
        "repo": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/downloads/:download_id"
    },
    "deleteFile": {
      "method": "DELETE",
      "params": {
        "author": {
          "type": "object"
        },
        "author.email": {
          "type": "string"
        },
        "author.name": {
          "type": "string"
        },
        "branch": {
          "type": "string"
        },
        "committer": {
          "type": "object"
        },
        "committer.email": {
          "type": "string"
        },
        "committer.name": {
          "type": "string"
        },
        "message": {
          "required": true,
          "type": "string"
        },
        "owner": {
          "required": true,
          "type": "string"
        },
        "path": {
          "required": true,
          "type": "string"
        },
        "repo": {
          "required": true,
          "type": "string"
        },
        "sha": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/contents/:path"
    },
    "deleteHook": {
      "method": "DELETE",
      "params": {
        "hook_id": {
          "required": true,
          "type": "integer"
        },
        "owner": {
          "required": true,
          "type": "string"
        },
        "repo": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/hooks/:hook_id"
    },
    "deleteInvitation": {
      "method": "DELETE",
      "params": {
        "invitation_id": {
          "required": true,
          "type": "integer"
        },
        "owner": {
          "required": true,
          "type": "string"
        },
        "repo": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/invitations/:invitation_id"
    },
    "deleteRelease": {
      "method": "DELETE",
      "params": {
        "owner": {
          "required": true,
          "type": "string"
        },
        "release_id": {
          "required": true,
          "type": "integer"
        },
        "repo": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/releases/:release_id"
    },
    "deleteReleaseAsset": {
      "method": "DELETE",
      "params": {
        "asset_id": {
          "required": true,
          "type": "integer"
        },
        "owner": {
          "required": true,
          "type": "string"
        },
        "repo": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/releases/assets/:asset_id"
    },
    "disableAutomatedSecurityFixes": {
      "headers": {
        "accept": "application/vnd.github.london-preview+json"
      },
      "method": "DELETE",
      "params": {
        "owner": {
          "required": true,
          "type": "string"
        },
        "repo": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/automated-security-fixes"
    },
    "disablePagesSite": {
      "headers": {
        "accept": "application/vnd.github.switcheroo-preview+json"
      },
      "method": "DELETE",
      "params": {
        "owner": {
          "required": true,
          "type": "string"
        },
        "repo": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/pages"
    },
    "disableVulnerabilityAlerts": {
      "headers": {
        "accept": "application/vnd.github.dorian-preview+json"
      },
      "method": "DELETE",
      "params": {
        "owner": {
          "required": true,
          "type": "string"
        },
        "repo": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/vulnerability-alerts"
    },
    "enableAutomatedSecurityFixes": {
      "headers": {
        "accept": "application/vnd.github.london-preview+json"
      },
      "method": "PUT",
      "params": {
        "owner": {
          "required": true,
          "type": "string"
        },
        "repo": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/automated-security-fixes"
    },
    "enablePagesSite": {
      "headers": {
        "accept": "application/vnd.github.switcheroo-preview+json"
      },
      "method": "POST",
      "params": {
        "owner": {
          "required": true,
          "type": "string"
        },
        "repo": {
          "required": true,
          "type": "string"
        },
        "source": {
          "type": "object"
        },
        "source.branch": {
          "enum": [
            "master",
            "gh-pages"
          ],
          "type": "string"
        },
        "source.path": {
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/pages"
    },
    "enableVulnerabilityAlerts": {
      "headers": {
        "accept": "application/vnd.github.dorian-preview+json"
      },
      "method": "PUT",
      "params": {
        "owner": {
          "required": true,
          "type": "string"
        },
        "repo": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/vulnerability-alerts"
    },
    "get": {
      "method": "GET",
      "params": {
        "owner": {
          "required": true,
          "type": "string"
        },
        "repo": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo"
    },
    "getArchiveLink": {
      "method": "GET",
      "params": {
        "archive_format": {
          "required": true,
          "type": "string"
        },
        "owner": {
          "required": true,
          "type": "string"
        },
        "ref": {
          "required": true,
          "type": "string"
        },
        "repo": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/:archive_format/:ref"
    },
    "getBranch": {
      "method": "GET",
      "params": {
        "branch": {
          "required": true,
          "type": "string"
        },
        "owner": {
          "required": true,
          "type": "string"
        },
        "repo": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/branches/:branch"
    },
    "getBranchProtection": {
      "method": "GET",
      "params": {
        "branch": {
          "required": true,
          "type": "string"
        },
        "owner": {
          "required": true,
          "type": "string"
        },
        "repo": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/branches/:branch/protection"
    },
    "getClones": {
      "method": "GET",
      "params": {
        "owner": {
          "required": true,
          "type": "string"
        },
        "per": {
          "enum": [
            "day",
            "week"
          ],
          "type": "string"
        },
        "repo": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/traffic/clones"
    },
    "getCodeFrequencyStats": {
      "method": "GET",
      "params": {
        "owner": {
          "required": true,
          "type": "string"
        },
        "repo": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/stats/code_frequency"
    },
    "getCollaboratorPermissionLevel": {
      "method": "GET",
      "params": {
        "owner": {
          "required": true,
          "type": "string"
        },
        "repo": {
          "required": true,
          "type": "string"
        },
        "username": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/collaborators/:username/permission"
    },
    "getCombinedStatusForRef": {
      "method": "GET",
      "params": {
        "owner": {
          "required": true,
          "type": "string"
        },
        "ref": {
          "required": true,
          "type": "string"
        },
        "repo": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/commits/:ref/status"
    },
    "getCommit": {
      "method": "GET",
      "params": {
        "commit_sha": {
          "alias": "ref",
          "deprecated": true,
          "type": "string"
        },
        "owner": {
          "required": true,
          "type": "string"
        },
        "ref": {
          "required": true,
          "type": "string"
        },
        "repo": {
          "required": true,
          "type": "string"
        },
        "sha": {
          "alias": "commit_sha",
          "deprecated": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/commits/:ref"
    },
    "getCommitActivityStats": {
      "method": "GET",
      "params": {
        "owner": {
          "required": true,
          "type": "string"
        },
        "repo": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/stats/commit_activity"
    },
    "getCommitComment": {
      "method": "GET",
      "params": {
        "comment_id": {
          "required": true,
          "type": "integer"
        },
        "owner": {
          "required": true,
          "type": "string"
        },
        "repo": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/comments/:comment_id"
    },
    "getCommitRefSha": {
      "deprecated": "\"Get the SHA-1 of a commit reference\" will be removed. Use \"Get a single commit\" instead with media type format set to \"sha\" instead.",
      "method": "GET",
      "params": {
        "owner": {
          "required": true,
          "type": "string"
        },
        "ref": {
          "required": true,
          "type": "string"
        },
        "repo": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/commits/:ref"
    },
    "getContents": {
      "method": "GET",
      "params": {
        "owner": {
          "required": true,
          "type": "string"
        },
        "path": {
          "required": true,
          "type": "string"
        },
        "ref": {
          "type": "string"
        },
        "repo": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/contents/:path"
    },
    "getContributorsStats": {
      "method": "GET",
      "params": {
        "owner": {
          "required": true,
          "type": "string"
        },
        "repo": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/stats/contributors"
    },
    "getDeployKey": {
      "method": "GET",
      "params": {
        "key_id": {
          "required": true,
          "type": "integer"
        },
        "owner": {
          "required": true,
          "type": "string"
        },
        "repo": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/keys/:key_id"
    },
    "getDeployment": {
      "method": "GET",
      "params": {
        "deployment_id": {
          "required": true,
          "type": "integer"
        },
        "owner": {
          "required": true,
          "type": "string"
        },
        "repo": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/deployments/:deployment_id"
    },
    "getDeploymentStatus": {
      "method": "GET",
      "params": {
        "deployment_id": {
          "required": true,
          "type": "integer"
        },
        "owner": {
          "required": true,
          "type": "string"
        },
        "repo": {
          "required": true,
          "type": "string"
        },
        "status_id": {
          "required": true,
          "type": "integer"
        }
      },
      "url": "/repos/:owner/:repo/deployments/:deployment_id/statuses/:status_id"
    },
    "getDownload": {
      "method": "GET",
      "params": {
        "download_id": {
          "required": true,
          "type": "integer"
        },
        "owner": {
          "required": true,
          "type": "string"
        },
        "repo": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/downloads/:download_id"
    },
    "getHook": {
      "method": "GET",
      "params": {
        "hook_id": {
          "required": true,
          "type": "integer"
        },
        "owner": {
          "required": true,
          "type": "string"
        },
        "repo": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/hooks/:hook_id"
    },
    "getLatestPagesBuild": {
      "method": "GET",
      "params": {
        "owner": {
          "required": true,
          "type": "string"
        },
        "repo": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/pages/builds/latest"
    },
    "getLatestRelease": {
      "method": "GET",
      "params": {
        "owner": {
          "required": true,
          "type": "string"
        },
        "repo": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/releases/latest"
    },
    "getPages": {
      "method": "GET",
      "params": {
        "owner": {
          "required": true,
          "type": "string"
        },
        "repo": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/pages"
    },
    "getPagesBuild": {
      "method": "GET",
      "params": {
        "build_id": {
          "required": true,
          "type": "integer"
        },
        "owner": {
          "required": true,
          "type": "string"
        },
        "repo": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/pages/builds/:build_id"
    },
    "getParticipationStats": {
      "method": "GET",
      "params": {
        "owner": {
          "required": true,
          "type": "string"
        },
        "repo": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/stats/participation"
    },
    "getProtectedBranchAdminEnforcement": {
      "method": "GET",
      "params": {
        "branch": {
          "required": true,
          "type": "string"
        },
        "owner": {
          "required": true,
          "type": "string"
        },
        "repo": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/branches/:branch/protection/enforce_admins"
    },
    "getProtectedBranchPullRequestReviewEnforcement": {
      "method": "GET",
      "params": {
        "branch": {
          "required": true,
          "type": "string"
        },
        "owner": {
          "required": true,
          "type": "string"
        },
        "repo": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/branches/:branch/protection/required_pull_request_reviews"
    },
    "getProtectedBranchRequiredSignatures": {
      "headers": {
        "accept": "application/vnd.github.zzzax-preview+json"
      },
      "method": "GET",
      "params": {
        "branch": {
          "required": true,
          "type": "string"
        },
        "owner": {
          "required": true,
          "type": "string"
        },
        "repo": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/branches/:branch/protection/required_signatures"
    },
    "getProtectedBranchRequiredStatusChecks": {
      "method": "GET",
      "params": {
        "branch": {
          "required": true,
          "type": "string"
        },
        "owner": {
          "required": true,
          "type": "string"
        },
        "repo": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/branches/:branch/protection/required_status_checks"
    },
    "getProtectedBranchRestrictions": {
      "method": "GET",
      "params": {
        "branch": {
          "required": true,
          "type": "string"
        },
        "owner": {
          "required": true,
          "type": "string"
        },
        "repo": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/branches/:branch/protection/restrictions"
    },
    "getPunchCardStats": {
      "method": "GET",
      "params": {
        "owner": {
          "required": true,
          "type": "string"
        },
        "repo": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/stats/punch_card"
    },
    "getReadme": {
      "method": "GET",
      "params": {
        "owner": {
          "required": true,
          "type": "string"
        },
        "ref": {
          "type": "string"
        },
        "repo": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/readme"
    },
    "getRelease": {
      "method": "GET",
      "params": {
        "owner": {
          "required": true,
          "type": "string"
        },
        "release_id": {
          "required": true,
          "type": "integer"
        },
        "repo": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/releases/:release_id"
    },
    "getReleaseAsset": {
      "method": "GET",
      "params": {
        "asset_id": {
          "required": true,
          "type": "integer"
        },
        "owner": {
          "required": true,
          "type": "string"
        },
        "repo": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/releases/assets/:asset_id"
    },
    "getReleaseByTag": {
      "method": "GET",
      "params": {
        "owner": {
          "required": true,
          "type": "string"
        },
        "repo": {
          "required": true,
          "type": "string"
        },
        "tag": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/releases/tags/:tag"
    },
    "getTopPaths": {
      "method": "GET",
      "params": {
        "owner": {
          "required": true,
          "type": "string"
        },
        "repo": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/traffic/popular/paths"
    },
    "getTopReferrers": {
      "method": "GET",
      "params": {
        "owner": {
          "required": true,
          "type": "string"
        },
        "repo": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/traffic/popular/referrers"
    },
    "getViews": {
      "method": "GET",
      "params": {
        "owner": {
          "required": true,
          "type": "string"
        },
        "per": {
          "enum": [
            "day",
            "week"
          ],
          "type": "string"
        },
        "repo": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/traffic/views"
    },
    "list": {
      "method": "GET",
      "params": {
        "affiliation": {
          "type": "string"
        },
        "direction": {
          "enum": [
            "asc",
            "desc"
          ],
          "type": "string"
        },
        "page": {
          "type": "integer"
        },
        "per_page": {
          "type": "integer"
        },
        "sort": {
          "enum": [
            "created",
            "updated",
            "pushed",
            "full_name"
          ],
          "type": "string"
        },
        "type": {
          "enum": [
            "all",
            "owner",
            "public",
            "private",
            "member"
          ],
          "type": "string"
        },
        "visibility": {
          "enum": [
            "all",
            "public",
            "private"
          ],
          "type": "string"
        }
      },
      "url": "/user/repos"
    },
    "listAssetsForRelease": {
      "method": "GET",
      "params": {
        "owner": {
          "required": true,
          "type": "string"
        },
        "page": {
          "type": "integer"
        },
        "per_page": {
          "type": "integer"
        },
        "release_id": {
          "required": true,
          "type": "integer"
        },
        "repo": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/releases/:release_id/assets"
    },
    "listBranches": {
      "method": "GET",
      "params": {
        "owner": {
          "required": true,
          "type": "string"
        },
        "page": {
          "type": "integer"
        },
        "per_page": {
          "type": "integer"
        },
        "protected": {
          "type": "boolean"
        },
        "repo": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/branches"
    },
    "listBranchesForHeadCommit": {
      "headers": {
        "accept": "application/vnd.github.groot-preview+json"
      },
      "method": "GET",
      "params": {
        "commit_sha": {
          "required": true,
          "type": "string"
        },
        "owner": {
          "required": true,
          "type": "string"
        },
        "repo": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/commits/:commit_sha/branches-where-head"
    },
    "listCollaborators": {
      "method": "GET",
      "params": {
        "affiliation": {
          "enum": [
            "outside",
            "direct",
            "all"
          ],
          "type": "string"
        },
        "owner": {
          "required": true,
          "type": "string"
        },
        "page": {
          "type": "integer"
        },
        "per_page": {
          "type": "integer"
        },
        "repo": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/collaborators"
    },
    "listCommentsForCommit": {
      "method": "GET",
      "params": {
        "commit_sha": {
          "required": true,
          "type": "string"
        },
        "owner": {
          "required": true,
          "type": "string"
        },
        "page": {
          "type": "integer"
        },
        "per_page": {
          "type": "integer"
        },
        "ref": {
          "alias": "commit_sha",
          "deprecated": true,
          "type": "string"
        },
        "repo": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/commits/:commit_sha/comments"
    },
    "listCommitComments": {
      "method": "GET",
      "params": {
        "owner": {
          "required": true,
          "type": "string"
        },
        "page": {
          "type": "integer"
        },
        "per_page": {
          "type": "integer"
        },
        "repo": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/comments"
    },
    "listCommits": {
      "method": "GET",
      "params": {
        "author": {
          "type": "string"
        },
        "owner": {
          "required": true,
          "type": "string"
        },
        "page": {
          "type": "integer"
        },
        "path": {
          "type": "string"
        },
        "per_page": {
          "type": "integer"
        },
        "repo": {
          "required": true,
          "type": "string"
        },
        "sha": {
          "type": "string"
        },
        "since": {
          "type": "string"
        },
        "until": {
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/commits"
    },
    "listContributors": {
      "method": "GET",
      "params": {
        "anon": {
          "type": "string"
        },
        "owner": {
          "required": true,
          "type": "string"
        },
        "page": {
          "type": "integer"
        },
        "per_page": {
          "type": "integer"
        },
        "repo": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/contributors"
    },
    "listDeployKeys": {
      "method": "GET",
      "params": {
        "owner": {
          "required": true,
          "type": "string"
        },
        "page": {
          "type": "integer"
        },
        "per_page": {
          "type": "integer"
        },
        "repo": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/keys"
    },
    "listDeploymentStatuses": {
      "method": "GET",
      "params": {
        "deployment_id": {
          "required": true,
          "type": "integer"
        },
        "owner": {
          "required": true,
          "type": "string"
        },
        "page": {
          "type": "integer"
        },
        "per_page": {
          "type": "integer"
        },
        "repo": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/deployments/:deployment_id/statuses"
    },
    "listDeployments": {
      "method": "GET",
      "params": {
        "environment": {
          "type": "string"
        },
        "owner": {
          "required": true,
          "type": "string"
        },
        "page": {
          "type": "integer"
        },
        "per_page": {
          "type": "integer"
        },
        "ref": {
          "type": "string"
        },
        "repo": {
          "required": true,
          "type": "string"
        },
        "sha": {
          "type": "string"
        },
        "task": {
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/deployments"
    },
    "listDownloads": {
      "method": "GET",
      "params": {
        "owner": {
          "required": true,
          "type": "string"
        },
        "page": {
          "type": "integer"
        },
        "per_page": {
          "type": "integer"
        },
        "repo": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/downloads"
    },
    "listForOrg": {
      "method": "GET",
      "params": {
        "direction": {
          "enum": [
            "asc",
            "desc"
          ],
          "type": "string"
        },
        "org": {
          "required": true,
          "type": "string"
        },
        "page": {
          "type": "integer"
        },
        "per_page": {
          "type": "integer"
        },
        "sort": {
          "enum": [
            "created",
            "updated",
            "pushed",
            "full_name"
          ],
          "type": "string"
        },
        "type": {
          "enum": [
            "all",
            "public",
            "private",
            "forks",
            "sources",
            "member"
          ],
          "type": "string"
        }
      },
      "url": "/orgs/:org/repos"
    },
    "listForUser": {
      "method": "GET",
      "params": {
        "direction": {
          "enum": [
            "asc",
            "desc"
          ],
          "type": "string"
        },
        "page": {
          "type": "integer"
        },
        "per_page": {
          "type": "integer"
        },
        "sort": {
          "enum": [
            "created",
            "updated",
            "pushed",
            "full_name"
          ],
          "type": "string"
        },
        "type": {
          "enum": [
            "all",
            "owner",
            "member"
          ],
          "type": "string"
        },
        "username": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/users/:username/repos"
    },
    "listForks": {
      "method": "GET",
      "params": {
        "owner": {
          "required": true,
          "type": "string"
        },
        "page": {
          "type": "integer"
        },
        "per_page": {
          "type": "integer"
        },
        "repo": {
          "required": true,
          "type": "string"
        },
        "sort": {
          "enum": [
            "newest",
            "oldest",
            "stargazers"
          ],
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/forks"
    },
    "listHooks": {
      "method": "GET",
      "params": {
        "owner": {
          "required": true,
          "type": "string"
        },
        "page": {
          "type": "integer"
        },
        "per_page": {
          "type": "integer"
        },
        "repo": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/hooks"
    },
    "listInvitations": {
      "method": "GET",
      "params": {
        "owner": {
          "required": true,
          "type": "string"
        },
        "page": {
          "type": "integer"
        },
        "per_page": {
          "type": "integer"
        },
        "repo": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/invitations"
    },
    "listInvitationsForAuthenticatedUser": {
      "method": "GET",
      "params": {
        "page": {
          "type": "integer"
        },
        "per_page": {
          "type": "integer"
        }
      },
      "url": "/user/repository_invitations"
    },
    "listLanguages": {
      "method": "GET",
      "params": {
        "owner": {
          "required": true,
          "type": "string"
        },
        "repo": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/languages"
    },
    "listPagesBuilds": {
      "method": "GET",
      "params": {
        "owner": {
          "required": true,
          "type": "string"
        },
        "page": {
          "type": "integer"
        },
        "per_page": {
          "type": "integer"
        },
        "repo": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/pages/builds"
    },
    "listProtectedBranchRequiredStatusChecksContexts": {
      "method": "GET",
      "params": {
        "branch": {
          "required": true,
          "type": "string"
        },
        "owner": {
          "required": true,
          "type": "string"
        },
        "repo": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/branches/:branch/protection/required_status_checks/contexts"
    },
    "listProtectedBranchTeamRestrictions": {
      "method": "GET",
      "params": {
        "branch": {
          "required": true,
          "type": "string"
        },
        "owner": {
          "required": true,
          "type": "string"
        },
        "page": {
          "type": "integer"
        },
        "per_page": {
          "type": "integer"
        },
        "repo": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/branches/:branch/protection/restrictions/teams"
    },
    "listProtectedBranchUserRestrictions": {
      "method": "GET",
      "params": {
        "branch": {
          "required": true,
          "type": "string"
        },
        "owner": {
          "required": true,
          "type": "string"
        },
        "repo": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/branches/:branch/protection/restrictions/users"
    },
    "listPublic": {
      "method": "GET",
      "params": {
        "page": {
          "type": "integer"
        },
        "per_page": {
          "type": "integer"
        },
        "since": {
          "type": "string"
        }
      },
      "url": "/repositories"
    },
    "listPullRequestsAssociatedWithCommit": {
      "headers": {
        "accept": "application/vnd.github.groot-preview+json"
      },
      "method": "GET",
      "params": {
        "commit_sha": {
          "required": true,
          "type": "string"
        },
        "owner": {
          "required": true,
          "type": "string"
        },
        "page": {
          "type": "integer"
        },
        "per_page": {
          "type": "integer"
        },
        "repo": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/commits/:commit_sha/pulls"
    },
    "listReleases": {
      "method": "GET",
      "params": {
        "owner": {
          "required": true,
          "type": "string"
        },
        "page": {
          "type": "integer"
        },
        "per_page": {
          "type": "integer"
        },
        "repo": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/releases"
    },
    "listStatusesForRef": {
      "method": "GET",
      "params": {
        "owner": {
          "required": true,
          "type": "string"
        },
        "page": {
          "type": "integer"
        },
        "per_page": {
          "type": "integer"
        },
        "ref": {
          "required": true,
          "type": "string"
        },
        "repo": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/commits/:ref/statuses"
    },
    "listTags": {
      "method": "GET",
      "params": {
        "owner": {
          "required": true,
          "type": "string"
        },
        "page": {
          "type": "integer"
        },
        "per_page": {
          "type": "integer"
        },
        "repo": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/tags"
    },
    "listTeams": {
      "method": "GET",
      "params": {
        "owner": {
          "required": true,
          "type": "string"
        },
        "page": {
          "type": "integer"
        },
        "per_page": {
          "type": "integer"
        },
        "repo": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/teams"
    },
    "listTopics": {
      "method": "GET",
      "params": {
        "owner": {
          "required": true,
          "type": "string"
        },
        "repo": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/topics"
    },
    "merge": {
      "method": "POST",
      "params": {
        "base": {
          "required": true,
          "type": "string"
        },
        "commit_message": {
          "type": "string"
        },
        "head": {
          "required": true,
          "type": "string"
        },
        "owner": {
          "required": true,
          "type": "string"
        },
        "repo": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/merges"
    },
    "pingHook": {
      "method": "POST",
      "params": {
        "hook_id": {
          "required": true,
          "type": "integer"
        },
        "owner": {
          "required": true,
          "type": "string"
        },
        "repo": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/hooks/:hook_id/pings"
    },
    "removeBranchProtection": {
      "method": "DELETE",
      "params": {
        "branch": {
          "required": true,
          "type": "string"
        },
        "owner": {
          "required": true,
          "type": "string"
        },
        "repo": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/branches/:branch/protection"
    },
    "removeCollaborator": {
      "method": "DELETE",
      "params": {
        "owner": {
          "required": true,
          "type": "string"
        },
        "repo": {
          "required": true,
          "type": "string"
        },
        "username": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/collaborators/:username"
    },
    "removeDeployKey": {
      "method": "DELETE",
      "params": {
        "key_id": {
          "required": true,
          "type": "integer"
        },
        "owner": {
          "required": true,
          "type": "string"
        },
        "repo": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/keys/:key_id"
    },
    "removeProtectedBranchAdminEnforcement": {
      "method": "DELETE",
      "params": {
        "branch": {
          "required": true,
          "type": "string"
        },
        "owner": {
          "required": true,
          "type": "string"
        },
        "repo": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/branches/:branch/protection/enforce_admins"
    },
    "removeProtectedBranchPullRequestReviewEnforcement": {
      "method": "DELETE",
      "params": {
        "branch": {
          "required": true,
          "type": "string"
        },
        "owner": {
          "required": true,
          "type": "string"
        },
        "repo": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/branches/:branch/protection/required_pull_request_reviews"
    },
    "removeProtectedBranchRequiredSignatures": {
      "headers": {
        "accept": "application/vnd.github.zzzax-preview+json"
      },
      "method": "DELETE",
      "params": {
        "branch": {
          "required": true,
          "type": "string"
        },
        "owner": {
          "required": true,
          "type": "string"
        },
        "repo": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/branches/:branch/protection/required_signatures"
    },
    "removeProtectedBranchRequiredStatusChecks": {
      "method": "DELETE",
      "params": {
        "branch": {
          "required": true,
          "type": "string"
        },
        "owner": {
          "required": true,
          "type": "string"
        },
        "repo": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/branches/:branch/protection/required_status_checks"
    },
    "removeProtectedBranchRequiredStatusChecksContexts": {
      "method": "DELETE",
      "params": {
        "branch": {
          "required": true,
          "type": "string"
        },
        "contexts": {
          "mapTo": "data",
          "required": true,
          "type": "string[]"
        },
        "owner": {
          "required": true,
          "type": "string"
        },
        "repo": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/branches/:branch/protection/required_status_checks/contexts"
    },
    "removeProtectedBranchRestrictions": {
      "method": "DELETE",
      "params": {
        "branch": {
          "required": true,
          "type": "string"
        },
        "owner": {
          "required": true,
          "type": "string"
        },
        "repo": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/branches/:branch/protection/restrictions"
    },
    "removeProtectedBranchTeamRestrictions": {
      "method": "DELETE",
      "params": {
        "branch": {
          "required": true,
          "type": "string"
        },
        "owner": {
          "required": true,
          "type": "string"
        },
        "repo": {
          "required": true,
          "type": "string"
        },
        "teams": {
          "mapTo": "data",
          "required": true,
          "type": "string[]"
        }
      },
      "url": "/repos/:owner/:repo/branches/:branch/protection/restrictions/teams"
    },
    "removeProtectedBranchUserRestrictions": {
      "method": "DELETE",
      "params": {
        "branch": {
          "required": true,
          "type": "string"
        },
        "owner": {
          "required": true,
          "type": "string"
        },
        "repo": {
          "required": true,
          "type": "string"
        },
        "users": {
          "mapTo": "data",
          "required": true,
          "type": "string[]"
        }
      },
      "url": "/repos/:owner/:repo/branches/:branch/protection/restrictions/users"
    },
    "replaceProtectedBranchRequiredStatusChecksContexts": {
      "method": "PUT",
      "params": {
        "branch": {
          "required": true,
          "type": "string"
        },
        "contexts": {
          "mapTo": "data",
          "required": true,
          "type": "string[]"
        },
        "owner": {
          "required": true,
          "type": "string"
        },
        "repo": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/branches/:branch/protection/required_status_checks/contexts"
    },
    "replaceProtectedBranchTeamRestrictions": {
      "method": "PUT",
      "params": {
        "branch": {
          "required": true,
          "type": "string"
        },
        "owner": {
          "required": true,
          "type": "string"
        },
        "repo": {
          "required": true,
          "type": "string"
        },
        "teams": {
          "mapTo": "data",
          "required": true,
          "type": "string[]"
        }
      },
      "url": "/repos/:owner/:repo/branches/:branch/protection/restrictions/teams"
    },
    "replaceProtectedBranchUserRestrictions": {
      "method": "PUT",
      "params": {
        "branch": {
          "required": true,
          "type": "string"
        },
        "owner": {
          "required": true,
          "type": "string"
        },
        "repo": {
          "required": true,
          "type": "string"
        },
        "users": {
          "mapTo": "data",
          "required": true,
          "type": "string[]"
        }
      },
      "url": "/repos/:owner/:repo/branches/:branch/protection/restrictions/users"
    },
    "replaceTopics": {
      "method": "PUT",
      "params": {
        "names": {
          "required": true,
          "type": "string[]"
        },
        "owner": {
          "required": true,
          "type": "string"
        },
        "repo": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/topics"
    },
    "requestPageBuild": {
      "headers": {
        "accept": "application/vnd.github.mister-fantastic-preview+json"
      },
      "method": "POST",
      "params": {
        "owner": {
          "required": true,
          "type": "string"
        },
        "repo": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/pages/builds"
    },
    "retrieveCommunityProfileMetrics": {
      "method": "GET",
      "params": {
        "owner": {
          "required": true,
          "type": "string"
        },
        "repo": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/community/profile"
    },
    "testPushHook": {
      "method": "POST",
      "params": {
        "hook_id": {
          "required": true,
          "type": "integer"
        },
        "owner": {
          "required": true,
          "type": "string"
        },
        "repo": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/hooks/:hook_id/tests"
    },
    "transfer": {
      "headers": {
        "accept": "application/vnd.github.nightshade-preview+json"
      },
      "method": "POST",
      "params": {
        "new_owner": {
          "type": "string"
        },
        "owner": {
          "required": true,
          "type": "string"
        },
        "repo": {
          "required": true,
          "type": "string"
        },
        "team_ids": {
          "type": "integer[]"
        }
      },
      "url": "/repos/:owner/:repo/transfer"
    },
    "update": {
      "method": "PATCH",
      "params": {
        "allow_merge_commit": {
          "type": "boolean"
        },
        "allow_rebase_merge": {
          "type": "boolean"
        },
        "allow_squash_merge": {
          "type": "boolean"
        },
        "archived": {
          "type": "boolean"
        },
        "default_branch": {
          "type": "string"
        },
        "description": {
          "type": "string"
        },
        "has_issues": {
          "type": "boolean"
        },
        "has_projects": {
          "type": "boolean"
        },
        "has_wiki": {
          "type": "boolean"
        },
        "homepage": {
          "type": "string"
        },
        "is_template": {
          "type": "boolean"
        },
        "name": {
          "type": "string"
        },
        "owner": {
          "required": true,
          "type": "string"
        },
        "private": {
          "type": "boolean"
        },
        "repo": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo"
    },
    "updateBranchProtection": {
      "method": "PUT",
      "params": {
        "branch": {
          "required": true,
          "type": "string"
        },
        "enforce_admins": {
          "allowNull": true,
          "required": true,
          "type": "boolean"
        },
        "owner": {
          "required": true,
          "type": "string"
        },
        "repo": {
          "required": true,
          "type": "string"
        },
        "required_pull_request_reviews": {
          "allowNull": true,
          "required": true,
          "type": "object"
        },
        "required_pull_request_reviews.dismiss_stale_reviews": {
          "type": "boolean"
        },
        "required_pull_request_reviews.dismissal_restrictions": {
          "type": "object"
        },
        "required_pull_request_reviews.dismissal_restrictions.teams": {
          "type": "string[]"
        },
        "required_pull_request_reviews.dismissal_restrictions.users": {
          "type": "string[]"
        },
        "required_pull_request_reviews.require_code_owner_reviews": {
          "type": "boolean"
        },
        "required_pull_request_reviews.required_approving_review_count": {
          "type": "integer"
        },
        "required_status_checks": {
          "allowNull": true,
          "required": true,
          "type": "object"
        },
        "required_status_checks.contexts": {
          "required": true,
          "type": "string[]"
        },
        "required_status_checks.strict": {
          "required": true,
          "type": "boolean"
        },
        "restrictions": {
          "allowNull": true,
          "required": true,
          "type": "object"
        },
        "restrictions.teams": {
          "type": "string[]"
        },
        "restrictions.users": {
          "type": "string[]"
        }
      },
      "url": "/repos/:owner/:repo/branches/:branch/protection"
    },
    "updateCommitComment": {
      "method": "PATCH",
      "params": {
        "body": {
          "required": true,
          "type": "string"
        },
        "comment_id": {
          "required": true,
          "type": "integer"
        },
        "owner": {
          "required": true,
          "type": "string"
        },
        "repo": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/comments/:comment_id"
    },
    "updateFile": {
      "deprecated": "octokit.repos.updateFile() has been renamed to octokit.repos.createOrUpdateFile() (2019-06-07)",
      "method": "PUT",
      "params": {
        "author": {
          "type": "object"
        },
        "author.email": {
          "required": true,
          "type": "string"
        },
        "author.name": {
          "required": true,
          "type": "string"
        },
        "branch": {
          "type": "string"
        },
        "committer": {
          "type": "object"
        },
        "committer.email": {
          "required": true,
          "type": "string"
        },
        "committer.name": {
          "required": true,
          "type": "string"
        },
        "content": {
          "required": true,
          "type": "string"
        },
        "message": {
          "required": true,
          "type": "string"
        },
        "owner": {
          "required": true,
          "type": "string"
        },
        "path": {
          "required": true,
          "type": "string"
        },
        "repo": {
          "required": true,
          "type": "string"
        },
        "sha": {
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/contents/:path"
    },
    "updateHook": {
      "method": "PATCH",
      "params": {
        "active": {
          "type": "boolean"
        },
        "add_events": {
          "type": "string[]"
        },
        "config": {
          "type": "object"
        },
        "config.content_type": {
          "type": "string"
        },
        "config.insecure_ssl": {
          "type": "string"
        },
        "config.secret": {
          "type": "string"
        },
        "config.url": {
          "required": true,
          "type": "string"
        },
        "events": {
          "type": "string[]"
        },
        "hook_id": {
          "required": true,
          "type": "integer"
        },
        "owner": {
          "required": true,
          "type": "string"
        },
        "remove_events": {
          "type": "string[]"
        },
        "repo": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/hooks/:hook_id"
    },
    "updateInformationAboutPagesSite": {
      "method": "PUT",
      "params": {
        "cname": {
          "type": "string"
        },
        "owner": {
          "required": true,
          "type": "string"
        },
        "repo": {
          "required": true,
          "type": "string"
        },
        "source": {
          "enum": [
            "\"gh-pages\"",
            "\"master\"",
            "\"master /docs\""
          ],
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/pages"
    },
    "updateInvitation": {
      "method": "PATCH",
      "params": {
        "invitation_id": {
          "required": true,
          "type": "integer"
        },
        "owner": {
          "required": true,
          "type": "string"
        },
        "permissions": {
          "enum": [
            "read",
            "write",
            "admin"
          ],
          "type": "string"
        },
        "repo": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/invitations/:invitation_id"
    },
    "updateProtectedBranchPullRequestReviewEnforcement": {
      "method": "PATCH",
      "params": {
        "branch": {
          "required": true,
          "type": "string"
        },
        "dismiss_stale_reviews": {
          "type": "boolean"
        },
        "dismissal_restrictions": {
          "type": "object"
        },
        "dismissal_restrictions.teams": {
          "type": "string[]"
        },
        "dismissal_restrictions.users": {
          "type": "string[]"
        },
        "owner": {
          "required": true,
          "type": "string"
        },
        "repo": {
          "required": true,
          "type": "string"
        },
        "require_code_owner_reviews": {
          "type": "boolean"
        },
        "required_approving_review_count": {
          "type": "integer"
        }
      },
      "url": "/repos/:owner/:repo/branches/:branch/protection/required_pull_request_reviews"
    },
    "updateProtectedBranchRequiredStatusChecks": {
      "method": "PATCH",
      "params": {
        "branch": {
          "required": true,
          "type": "string"
        },
        "contexts": {
          "type": "string[]"
        },
        "owner": {
          "required": true,
          "type": "string"
        },
        "repo": {
          "required": true,
          "type": "string"
        },
        "strict": {
          "type": "boolean"
        }
      },
      "url": "/repos/:owner/:repo/branches/:branch/protection/required_status_checks"
    },
    "updateRelease": {
      "method": "PATCH",
      "params": {
        "body": {
          "type": "string"
        },
        "draft": {
          "type": "boolean"
        },
        "name": {
          "type": "string"
        },
        "owner": {
          "required": true,
          "type": "string"
        },
        "prerelease": {
          "type": "boolean"
        },
        "release_id": {
          "required": true,
          "type": "integer"
        },
        "repo": {
          "required": true,
          "type": "string"
        },
        "tag_name": {
          "type": "string"
        },
        "target_commitish": {
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/releases/:release_id"
    },
    "updateReleaseAsset": {
      "method": "PATCH",
      "params": {
        "asset_id": {
          "required": true,
          "type": "integer"
        },
        "label": {
          "type": "string"
        },
        "name": {
          "type": "string"
        },
        "owner": {
          "required": true,
          "type": "string"
        },
        "repo": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/repos/:owner/:repo/releases/assets/:asset_id"
    },
    "uploadReleaseAsset": {
      "method": "POST",
      "params": {
        "file": {
          "mapTo": "data",
          "required": true,
          "type": "string | object"
        },
        "headers": {
          "required": true,
          "type": "object"
        },
        "headers.content-length": {
          "required": true,
          "type": "integer"
        },
        "headers.content-type": {
          "required": true,
          "type": "string"
        },
        "label": {
          "type": "string"
        },
        "name": {
          "required": true,
          "type": "string"
        },
        "url": {
          "required": true,
          "type": "string"
        }
      },
      "url": ":url"
    }
  },
  "search": {
    "code": {
      "method": "GET",
      "params": {
        "order": {
          "enum": [
            "desc",
            "asc"
          ],
          "type": "string"
        },
        "page": {
          "type": "integer"
        },
        "per_page": {
          "type": "integer"
        },
        "q": {
          "required": true,
          "type": "string"
        },
        "sort": {
          "enum": [
            "indexed"
          ],
          "type": "string"
        }
      },
      "url": "/search/code"
    },
    "commits": {
      "headers": {
        "accept": "application/vnd.github.cloak-preview+json"
      },
      "method": "GET",
      "params": {
        "order": {
          "enum": [
            "desc",
            "asc"
          ],
          "type": "string"
        },
        "page": {
          "type": "integer"
        },
        "per_page": {
          "type": "integer"
        },
        "q": {
          "required": true,
          "type": "string"
        },
        "sort": {
          "enum": [
            "author-date",
            "committer-date"
          ],
          "type": "string"
        }
      },
      "url": "/search/commits"
    },
    "issues": {
      "deprecated": "octokit.search.issues() has been renamed to octokit.search.issuesAndPullRequests() (2018-12-27)",
      "method": "GET",
      "params": {
        "order": {
          "enum": [
            "desc",
            "asc"
          ],
          "type": "string"
        },
        "page": {
          "type": "integer"
        },
        "per_page": {
          "type": "integer"
        },
        "q": {
          "required": true,
          "type": "string"
        },
        "sort": {
          "enum": [
            "comments",
            "reactions",
            "reactions-+1",
            "reactions--1",
            "reactions-smile",
            "reactions-thinking_face",
            "reactions-heart",
            "reactions-tada",
            "interactions",
            "created",
            "updated"
          ],
          "type": "string"
        }
      },
      "url": "/search/issues"
    },
    "issuesAndPullRequests": {
      "method": "GET",
      "params": {
        "order": {
          "enum": [
            "desc",
            "asc"
          ],
          "type": "string"
        },
        "page": {
          "type": "integer"
        },
        "per_page": {
          "type": "integer"
        },
        "q": {
          "required": true,
          "type": "string"
        },
        "sort": {
          "enum": [
            "comments",
            "reactions",
            "reactions-+1",
            "reactions--1",
            "reactions-smile",
            "reactions-thinking_face",
            "reactions-heart",
            "reactions-tada",
            "interactions",
            "created",
            "updated"
          ],
          "type": "string"
        }
      },
      "url": "/search/issues"
    },
    "labels": {
      "method": "GET",
      "params": {
        "order": {
          "enum": [
            "desc",
            "asc"
          ],
          "type": "string"
        },
        "q": {
          "required": true,
          "type": "string"
        },
        "repository_id": {
          "required": true,
          "type": "integer"
        },
        "sort": {
          "enum": [
            "created",
            "updated"
          ],
          "type": "string"
        }
      },
      "url": "/search/labels"
    },
    "repos": {
      "method": "GET",
      "params": {
        "order": {
          "enum": [
            "desc",
            "asc"
          ],
          "type": "string"
        },
        "page": {
          "type": "integer"
        },
        "per_page": {
          "type": "integer"
        },
        "q": {
          "required": true,
          "type": "string"
        },
        "sort": {
          "enum": [
            "stars",
            "forks",
            "help-wanted-issues",
            "updated"
          ],
          "type": "string"
        }
      },
      "url": "/search/repositories"
    },
    "topics": {
      "method": "GET",
      "params": {
        "q": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/search/topics"
    },
    "users": {
      "method": "GET",
      "params": {
        "order": {
          "enum": [
            "desc",
            "asc"
          ],
          "type": "string"
        },
        "page": {
          "type": "integer"
        },
        "per_page": {
          "type": "integer"
        },
        "q": {
          "required": true,
          "type": "string"
        },
        "sort": {
          "enum": [
            "followers",
            "repositories",
            "joined"
          ],
          "type": "string"
        }
      },
      "url": "/search/users"
    }
  },
  "teams": {
    "addMember": {
      "method": "PUT",
      "params": {
        "team_id": {
          "required": true,
          "type": "integer"
        },
        "username": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/teams/:team_id/members/:username"
    },
    "addOrUpdateMembership": {
      "method": "PUT",
      "params": {
        "role": {
          "enum": [
            "member",
            "maintainer"
          ],
          "type": "string"
        },
        "team_id": {
          "required": true,
          "type": "integer"
        },
        "username": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/teams/:team_id/memberships/:username"
    },
    "addOrUpdateProject": {
      "headers": {
        "accept": "application/vnd.github.inertia-preview+json"
      },
      "method": "PUT",
      "params": {
        "permission": {
          "enum": [
            "read",
            "write",
            "admin"
          ],
          "type": "string"
        },
        "project_id": {
          "required": true,
          "type": "integer"
        },
        "team_id": {
          "required": true,
          "type": "integer"
        }
      },
      "url": "/teams/:team_id/projects/:project_id"
    },
    "addOrUpdateRepo": {
      "method": "PUT",
      "params": {
        "owner": {
          "required": true,
          "type": "string"
        },
        "permission": {
          "enum": [
            "pull",
            "push",
            "admin"
          ],
          "type": "string"
        },
        "repo": {
          "required": true,
          "type": "string"
        },
        "team_id": {
          "required": true,
          "type": "integer"
        }
      },
      "url": "/teams/:team_id/repos/:owner/:repo"
    },
    "checkManagesRepo": {
      "method": "GET",
      "params": {
        "owner": {
          "required": true,
          "type": "string"
        },
        "repo": {
          "required": true,
          "type": "string"
        },
        "team_id": {
          "required": true,
          "type": "integer"
        }
      },
      "url": "/teams/:team_id/repos/:owner/:repo"
    },
    "create": {
      "method": "POST",
      "params": {
        "description": {
          "type": "string"
        },
        "maintainers": {
          "type": "string[]"
        },
        "name": {
          "required": true,
          "type": "string"
        },
        "org": {
          "required": true,
          "type": "string"
        },
        "parent_team_id": {
          "type": "integer"
        },
        "permission": {
          "enum": [
            "pull",
            "push",
            "admin"
          ],
          "type": "string"
        },
        "privacy": {
          "enum": [
            "secret",
            "closed"
          ],
          "type": "string"
        },
        "repo_names": {
          "type": "string[]"
        }
      },
      "url": "/orgs/:org/teams"
    },
    "createDiscussion": {
      "headers": {
        "accept": "application/vnd.github.echo-preview+json"
      },
      "method": "POST",
      "params": {
        "body": {
          "required": true,
          "type": "string"
        },
        "private": {
          "type": "boolean"
        },
        "team_id": {
          "required": true,
          "type": "integer"
        },
        "title": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/teams/:team_id/discussions"
    },
    "createDiscussionComment": {
      "headers": {
        "accept": "application/vnd.github.echo-preview+json"
      },
      "method": "POST",
      "params": {
        "body": {
          "required": true,
          "type": "string"
        },
        "discussion_number": {
          "required": true,
          "type": "integer"
        },
        "team_id": {
          "required": true,
          "type": "integer"
        }
      },
      "url": "/teams/:team_id/discussions/:discussion_number/comments"
    },
    "delete": {
      "method": "DELETE",
      "params": {
        "team_id": {
          "required": true,
          "type": "integer"
        }
      },
      "url": "/teams/:team_id"
    },
    "deleteDiscussion": {
      "headers": {
        "accept": "application/vnd.github.echo-preview+json"
      },
      "method": "DELETE",
      "params": {
        "discussion_number": {
          "required": true,
          "type": "integer"
        },
        "team_id": {
          "required": true,
          "type": "integer"
        }
      },
      "url": "/teams/:team_id/discussions/:discussion_number"
    },
    "deleteDiscussionComment": {
      "headers": {
        "accept": "application/vnd.github.echo-preview+json"
      },
      "method": "DELETE",
      "params": {
        "comment_number": {
          "required": true,
          "type": "integer"
        },
        "discussion_number": {
          "required": true,
          "type": "integer"
        },
        "team_id": {
          "required": true,
          "type": "integer"
        }
      },
      "url": "/teams/:team_id/discussions/:discussion_number/comments/:comment_number"
    },
    "get": {
      "method": "GET",
      "params": {
        "team_id": {
          "required": true,
          "type": "integer"
        }
      },
      "url": "/teams/:team_id"
    },
    "getByName": {
      "method": "GET",
      "params": {
        "org": {
          "required": true,
          "type": "string"
        },
        "team_slug": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/orgs/:org/teams/:team_slug"
    },
    "getDiscussion": {
      "headers": {
        "accept": "application/vnd.github.echo-preview+json"
      },
      "method": "GET",
      "params": {
        "discussion_number": {
          "required": true,
          "type": "integer"
        },
        "team_id": {
          "required": true,
          "type": "integer"
        }
      },
      "url": "/teams/:team_id/discussions/:discussion_number"
    },
    "getDiscussionComment": {
      "headers": {
        "accept": "application/vnd.github.echo-preview+json"
      },
      "method": "GET",
      "params": {
        "comment_number": {
          "required": true,
          "type": "integer"
        },
        "discussion_number": {
          "required": true,
          "type": "integer"
        },
        "team_id": {
          "required": true,
          "type": "integer"
        }
      },
      "url": "/teams/:team_id/discussions/:discussion_number/comments/:comment_number"
    },
    "getMember": {
      "method": "GET",
      "params": {
        "team_id": {
          "required": true,
          "type": "integer"
        },
        "username": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/teams/:team_id/members/:username"
    },
    "getMembership": {
      "method": "GET",
      "params": {
        "team_id": {
          "required": true,
          "type": "integer"
        },
        "username": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/teams/:team_id/memberships/:username"
    },
    "list": {
      "method": "GET",
      "params": {
        "org": {
          "required": true,
          "type": "string"
        },
        "page": {
          "type": "integer"
        },
        "per_page": {
          "type": "integer"
        }
      },
      "url": "/orgs/:org/teams"
    },
    "listChild": {
      "headers": {
        "accept": "application/vnd.github.hellcat-preview+json"
      },
      "method": "GET",
      "params": {
        "page": {
          "type": "integer"
        },
        "per_page": {
          "type": "integer"
        },
        "team_id": {
          "required": true,
          "type": "integer"
        }
      },
      "url": "/teams/:team_id/teams"
    },
    "listDiscussionComments": {
      "headers": {
        "accept": "application/vnd.github.echo-preview+json"
      },
      "method": "GET",
      "params": {
        "direction": {
          "enum": [
            "asc",
            "desc"
          ],
          "type": "string"
        },
        "discussion_number": {
          "required": true,
          "type": "integer"
        },
        "page": {
          "type": "integer"
        },
        "per_page": {
          "type": "integer"
        },
        "team_id": {
          "required": true,
          "type": "integer"
        }
      },
      "url": "/teams/:team_id/discussions/:discussion_number/comments"
    },
    "listDiscussions": {
      "headers": {
        "accept": "application/vnd.github.echo-preview+json"
      },
      "method": "GET",
      "params": {
        "direction": {
          "enum": [
            "asc",
            "desc"
          ],
          "type": "string"
        },
        "page": {
          "type": "integer"
        },
        "per_page": {
          "type": "integer"
        },
        "team_id": {
          "required": true,
          "type": "integer"
        }
      },
      "url": "/teams/:team_id/discussions"
    },
    "listForAuthenticatedUser": {
      "method": "GET",
      "params": {
        "page": {
          "type": "integer"
        },
        "per_page": {
          "type": "integer"
        }
      },
      "url": "/user/teams"
    },
    "listMembers": {
      "method": "GET",
      "params": {
        "page": {
          "type": "integer"
        },
        "per_page": {
          "type": "integer"
        },
        "role": {
          "enum": [
            "member",
            "maintainer",
            "all"
          ],
          "type": "string"
        },
        "team_id": {
          "required": true,
          "type": "integer"
        }
      },
      "url": "/teams/:team_id/members"
    },
    "listPendingInvitations": {
      "method": "GET",
      "params": {
        "page": {
          "type": "integer"
        },
        "per_page": {
          "type": "integer"
        },
        "team_id": {
          "required": true,
          "type": "integer"
        }
      },
      "url": "/teams/:team_id/invitations"
    },
    "listProjects": {
      "headers": {
        "accept": "application/vnd.github.inertia-preview+json"
      },
      "method": "GET",
      "params": {
        "page": {
          "type": "integer"
        },
        "per_page": {
          "type": "integer"
        },
        "team_id": {
          "required": true,
          "type": "integer"
        }
      },
      "url": "/teams/:team_id/projects"
    },
    "listRepos": {
      "method": "GET",
      "params": {
        "page": {
          "type": "integer"
        },
        "per_page": {
          "type": "integer"
        },
        "team_id": {
          "required": true,
          "type": "integer"
        }
      },
      "url": "/teams/:team_id/repos"
    },
    "removeMember": {
      "method": "DELETE",
      "params": {
        "team_id": {
          "required": true,
          "type": "integer"
        },
        "username": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/teams/:team_id/members/:username"
    },
    "removeMembership": {
      "method": "DELETE",
      "params": {
        "team_id": {
          "required": true,
          "type": "integer"
        },
        "username": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/teams/:team_id/memberships/:username"
    },
    "removeProject": {
      "method": "DELETE",
      "params": {
        "project_id": {
          "required": true,
          "type": "integer"
        },
        "team_id": {
          "required": true,
          "type": "integer"
        }
      },
      "url": "/teams/:team_id/projects/:project_id"
    },
    "removeRepo": {
      "method": "DELETE",
      "params": {
        "owner": {
          "required": true,
          "type": "string"
        },
        "repo": {
          "required": true,
          "type": "string"
        },
        "team_id": {
          "required": true,
          "type": "integer"
        }
      },
      "url": "/teams/:team_id/repos/:owner/:repo"
    },
    "reviewProject": {
      "headers": {
        "accept": "application/vnd.github.inertia-preview+json"
      },
      "method": "GET",
      "params": {
        "project_id": {
          "required": true,
          "type": "integer"
        },
        "team_id": {
          "required": true,
          "type": "integer"
        }
      },
      "url": "/teams/:team_id/projects/:project_id"
    },
    "update": {
      "method": "PATCH",
      "params": {
        "description": {
          "type": "string"
        },
        "name": {
          "required": true,
          "type": "string"
        },
        "parent_team_id": {
          "type": "integer"
        },
        "permission": {
          "enum": [
            "pull",
            "push",
            "admin"
          ],
          "type": "string"
        },
        "privacy": {
          "type": "string"
        },
        "team_id": {
          "required": true,
          "type": "integer"
        }
      },
      "url": "/teams/:team_id"
    },
    "updateDiscussion": {
      "headers": {
        "accept": "application/vnd.github.echo-preview+json"
      },
      "method": "PATCH",
      "params": {
        "body": {
          "type": "string"
        },
        "discussion_number": {
          "required": true,
          "type": "integer"
        },
        "team_id": {
          "required": true,
          "type": "integer"
        },
        "title": {
          "type": "string"
        }
      },
      "url": "/teams/:team_id/discussions/:discussion_number"
    },
    "updateDiscussionComment": {
      "headers": {
        "accept": "application/vnd.github.echo-preview+json"
      },
      "method": "PATCH",
      "params": {
        "body": {
          "required": true,
          "type": "string"
        },
        "comment_number": {
          "required": true,
          "type": "integer"
        },
        "discussion_number": {
          "required": true,
          "type": "integer"
        },
        "team_id": {
          "required": true,
          "type": "integer"
        }
      },
      "url": "/teams/:team_id/discussions/:discussion_number/comments/:comment_number"
    }
  },
  "users": {
    "addEmails": {
      "method": "POST",
      "params": {
        "emails": {
          "required": true,
          "type": "string[]"
        }
      },
      "url": "/user/emails"
    },
    "block": {
      "method": "PUT",
      "params": {
        "username": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/user/blocks/:username"
    },
    "checkBlocked": {
      "method": "GET",
      "params": {
        "username": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/user/blocks/:username"
    },
    "checkFollowing": {
      "method": "GET",
      "params": {
        "username": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/user/following/:username"
    },
    "checkFollowingForUser": {
      "method": "GET",
      "params": {
        "target_user": {
          "required": true,
          "type": "string"
        },
        "username": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/users/:username/following/:target_user"
    },
    "createGpgKey": {
      "method": "POST",
      "params": {
        "armored_public_key": {
          "type": "string"
        }
      },
      "url": "/user/gpg_keys"
    },
    "createPublicKey": {
      "method": "POST",
      "params": {
        "key": {
          "type": "string"
        },
        "title": {
          "type": "string"
        }
      },
      "url": "/user/keys"
    },
    "deleteEmails": {
      "method": "DELETE",
      "params": {
        "emails": {
          "required": true,
          "type": "string[]"
        }
      },
      "url": "/user/emails"
    },
    "deleteGpgKey": {
      "method": "DELETE",
      "params": {
        "gpg_key_id": {
          "required": true,
          "type": "integer"
        }
      },
      "url": "/user/gpg_keys/:gpg_key_id"
    },
    "deletePublicKey": {
      "method": "DELETE",
      "params": {
        "key_id": {
          "required": true,
          "type": "integer"
        }
      },
      "url": "/user/keys/:key_id"
    },
    "follow": {
      "method": "PUT",
      "params": {
        "username": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/user/following/:username"
    },
    "getAuthenticated": {
      "method": "GET",
      "params": {},
      "url": "/user"
    },
    "getByUsername": {
      "method": "GET",
      "params": {
        "username": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/users/:username"
    },
    "getContextForUser": {
      "headers": {
        "accept": "application/vnd.github.hagar-preview+json"
      },
      "method": "GET",
      "params": {
        "subject_id": {
          "type": "string"
        },
        "subject_type": {
          "enum": [
            "organization",
            "repository",
            "issue",
            "pull_request"
          ],
          "type": "string"
        },
        "username": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/users/:username/hovercard"
    },
    "getGpgKey": {
      "method": "GET",
      "params": {
        "gpg_key_id": {
          "required": true,
          "type": "integer"
        }
      },
      "url": "/user/gpg_keys/:gpg_key_id"
    },
    "getPublicKey": {
      "method": "GET",
      "params": {
        "key_id": {
          "required": true,
          "type": "integer"
        }
      },
      "url": "/user/keys/:key_id"
    },
    "list": {
      "method": "GET",
      "params": {
        "page": {
          "type": "integer"
        },
        "per_page": {
          "type": "integer"
        },
        "since": {
          "type": "string"
        }
      },
      "url": "/users"
    },
    "listBlocked": {
      "method": "GET",
      "params": {},
      "url": "/user/blocks"
    },
    "listEmails": {
      "method": "GET",
      "params": {
        "page": {
          "type": "integer"
        },
        "per_page": {
          "type": "integer"
        }
      },
      "url": "/user/emails"
    },
    "listFollowersForAuthenticatedUser": {
      "method": "GET",
      "params": {
        "page": {
          "type": "integer"
        },
        "per_page": {
          "type": "integer"
        }
      },
      "url": "/user/followers"
    },
    "listFollowersForUser": {
      "method": "GET",
      "params": {
        "page": {
          "type": "integer"
        },
        "per_page": {
          "type": "integer"
        },
        "username": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/users/:username/followers"
    },
    "listFollowingForAuthenticatedUser": {
      "method": "GET",
      "params": {
        "page": {
          "type": "integer"
        },
        "per_page": {
          "type": "integer"
        }
      },
      "url": "/user/following"
    },
    "listFollowingForUser": {
      "method": "GET",
      "params": {
        "page": {
          "type": "integer"
        },
        "per_page": {
          "type": "integer"
        },
        "username": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/users/:username/following"
    },
    "listGpgKeys": {
      "method": "GET",
      "params": {
        "page": {
          "type": "integer"
        },
        "per_page": {
          "type": "integer"
        }
      },
      "url": "/user/gpg_keys"
    },
    "listGpgKeysForUser": {
      "method": "GET",
      "params": {
        "page": {
          "type": "integer"
        },
        "per_page": {
          "type": "integer"
        },
        "username": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/users/:username/gpg_keys"
    },
    "listPublicEmails": {
      "method": "GET",
      "params": {
        "page": {
          "type": "integer"
        },
        "per_page": {
          "type": "integer"
        }
      },
      "url": "/user/public_emails"
    },
    "listPublicKeys": {
      "method": "GET",
      "params": {
        "page": {
          "type": "integer"
        },
        "per_page": {
          "type": "integer"
        }
      },
      "url": "/user/keys"
    },
    "listPublicKeysForUser": {
      "method": "GET",
      "params": {
        "page": {
          "type": "integer"
        },
        "per_page": {
          "type": "integer"
        },
        "username": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/users/:username/keys"
    },
    "togglePrimaryEmailVisibility": {
      "method": "PATCH",
      "params": {
        "email": {
          "required": true,
          "type": "string"
        },
        "visibility": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/user/email/visibility"
    },
    "unblock": {
      "method": "DELETE",
      "params": {
        "username": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/user/blocks/:username"
    },
    "unfollow": {
      "method": "DELETE",
      "params": {
        "username": {
          "required": true,
          "type": "string"
        }
      },
      "url": "/user/following/:username"
    },
    "updateAuthenticated": {
      "method": "PATCH",
      "params": {
        "bio": {
          "type": "string"
        },
        "blog": {
          "type": "string"
        },
        "company": {
          "type": "string"
        },
        "email": {
          "type": "string"
        },
        "hireable": {
          "type": "boolean"
        },
        "location": {
          "type": "string"
        },
        "name": {
          "type": "string"
        }
      },
      "url": "/user"
    }
  }
}

},{}],33:[function(require,module,exports){
module.exports = octokitValidate

const validate = require('./validate')

function octokitValidate (octokit) {
  octokit.hook.before('request', validate.bind(null, octokit))
}

},{"./validate":34}],34:[function(require,module,exports){
'use strict'

module.exports = validate

const { RequestError } = require('@octokit/request-error')
const get = require('lodash.get')
const set = require('lodash.set')

function validate (octokit, options) {
  if (!options.request.validate) {
    return
  }
  const { validate: params } = options.request

  Object.keys(params).forEach(parameterName => {
    const parameter = get(params, parameterName)

    const expectedType = parameter.type
    let parentParameterName
    let parentValue
    let parentParamIsPresent = true
    let parentParameterIsArray = false

    if (/\./.test(parameterName)) {
      parentParameterName = parameterName.replace(/\.[^.]+$/, '')
      parentParameterIsArray = parentParameterName.slice(-2) === '[]'
      if (parentParameterIsArray) {
        parentParameterName = parentParameterName.slice(0, -2)
      }
      parentValue = get(options, parentParameterName)
      parentParamIsPresent = parentParameterName === 'headers' || (typeof parentValue === 'object' && parentValue !== null)
    }

    const values = parentParameterIsArray
      ? (get(options, parentParameterName) || []).map(value => value[parameterName.split(/\./).pop()])
      : [get(options, parameterName)]

    values.forEach((value, i) => {
      const valueIsPresent = typeof value !== 'undefined'
      const valueIsNull = value === null
      const currentParameterName = parentParameterIsArray
        ? parameterName.replace(/\[\]/, `[${i}]`)
        : parameterName

      if (!parameter.required && !valueIsPresent) {
        return
      }

      // if the parent parameter is of type object but allows null
      // then the child parameters can be ignored
      if (!parentParamIsPresent) {
        return
      }

      if (parameter.allowNull && valueIsNull) {
        return
      }

      if (!parameter.allowNull && valueIsNull) {
        throw new RequestError(`'${currentParameterName}' cannot be null`, 400, {
          request: options
        })
      }

      if (parameter.required && !valueIsPresent) {
        throw new RequestError(`Empty value for parameter '${currentParameterName}': ${JSON.stringify(value)}`, 400, {
          request: options
        })
      }

      // parse to integer before checking for enum
      // so that string "1" will match enum with number 1
      if (expectedType === 'integer') {
        const unparsedValue = value
        value = parseInt(value, 10)
        if (isNaN(value)) {
          throw new RequestError(`Invalid value for parameter '${currentParameterName}': ${JSON.stringify(unparsedValue)} is NaN`, 400, {
            request: options
          })
        }
      }

      if (parameter.enum && parameter.enum.indexOf(value) === -1) {
        throw new RequestError(`Invalid value for parameter '${currentParameterName}': ${JSON.stringify(value)}`, 400, {
          request: options
        })
      }

      if (parameter.validation) {
        const regex = new RegExp(parameter.validation)
        if (!regex.test(value)) {
          throw new RequestError(`Invalid value for parameter '${currentParameterName}': ${JSON.stringify(value)}`, 400, {
            request: options
          })
        }
      }

      if (expectedType === 'object' && typeof value === 'string') {
        try {
          value = JSON.parse(value)
        } catch (exception) {
          throw new RequestError(`JSON parse error of value for parameter '${currentParameterName}': ${JSON.stringify(value)}`, 400, {
            request: options
          })
        }
      }

      set(options, parameter.mapTo || currentParameterName, value)
    })
  })

  return options
}

},{"@octokit/request-error":4,"lodash.get":84,"lodash.set":85}],35:[function(require,module,exports){
module.exports = function _atob(str) {
  return atob(str)
}

},{}],36:[function(require,module,exports){
module.exports = require('./lib/axios');
},{"./lib/axios":38}],37:[function(require,module,exports){
'use strict';

var utils = require('./../utils');
var settle = require('./../core/settle');
var buildURL = require('./../helpers/buildURL');
var parseHeaders = require('./../helpers/parseHeaders');
var isURLSameOrigin = require('./../helpers/isURLSameOrigin');
var createError = require('../core/createError');

module.exports = function xhrAdapter(config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    var requestData = config.data;
    var requestHeaders = config.headers;

    if (utils.isFormData(requestData)) {
      delete requestHeaders['Content-Type']; // Let the browser set it
    }

    var request = new XMLHttpRequest();

    // HTTP basic authentication
    if (config.auth) {
      var username = config.auth.username || '';
      var password = config.auth.password || '';
      requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
    }

    request.open(config.method.toUpperCase(), buildURL(config.url, config.params, config.paramsSerializer), true);

    // Set the request timeout in MS
    request.timeout = config.timeout;

    // Listen for ready state
    request.onreadystatechange = function handleLoad() {
      if (!request || request.readyState !== 4) {
        return;
      }

      // The request errored out and we didn't get a response, this will be
      // handled by onerror instead
      // With one exception: request that using file: protocol, most browsers
      // will return status as 0 even though it's a successful request
      if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
        return;
      }

      // Prepare the response
      var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
      var responseData = !config.responseType || config.responseType === 'text' ? request.responseText : request.response;
      var response = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config: config,
        request: request
      };

      settle(resolve, reject, response);

      // Clean up request
      request = null;
    };

    // Handle browser request cancellation (as opposed to a manual cancellation)
    request.onabort = function handleAbort() {
      if (!request) {
        return;
      }

      reject(createError('Request aborted', config, 'ECONNABORTED', request));

      // Clean up request
      request = null;
    };

    // Handle low level network errors
    request.onerror = function handleError() {
      // Real errors are hidden from us by the browser
      // onerror should only fire if it's a network error
      reject(createError('Network Error', config, null, request));

      // Clean up request
      request = null;
    };

    // Handle timeout
    request.ontimeout = function handleTimeout() {
      reject(createError('timeout of ' + config.timeout + 'ms exceeded', config, 'ECONNABORTED',
        request));

      // Clean up request
      request = null;
    };

    // Add xsrf header
    // This is only done if running in a standard browser environment.
    // Specifically not if we're in a web worker, or react-native.
    if (utils.isStandardBrowserEnv()) {
      var cookies = require('./../helpers/cookies');

      // Add xsrf header
      var xsrfValue = (config.withCredentials || isURLSameOrigin(config.url)) && config.xsrfCookieName ?
        cookies.read(config.xsrfCookieName) :
        undefined;

      if (xsrfValue) {
        requestHeaders[config.xsrfHeaderName] = xsrfValue;
      }
    }

    // Add headers to the request
    if ('setRequestHeader' in request) {
      utils.forEach(requestHeaders, function setRequestHeader(val, key) {
        if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
          // Remove Content-Type if data is undefined
          delete requestHeaders[key];
        } else {
          // Otherwise add header to the request
          request.setRequestHeader(key, val);
        }
      });
    }

    // Add withCredentials to request if needed
    if (config.withCredentials) {
      request.withCredentials = true;
    }

    // Add responseType to request if needed
    if (config.responseType) {
      try {
        request.responseType = config.responseType;
      } catch (e) {
        // Expected DOMException thrown by browsers not compatible XMLHttpRequest Level 2.
        // But, this can be suppressed for 'json' type as it can be parsed by default 'transformResponse' function.
        if (config.responseType !== 'json') {
          throw e;
        }
      }
    }

    // Handle progress if needed
    if (typeof config.onDownloadProgress === 'function') {
      request.addEventListener('progress', config.onDownloadProgress);
    }

    // Not all browsers support upload events
    if (typeof config.onUploadProgress === 'function' && request.upload) {
      request.upload.addEventListener('progress', config.onUploadProgress);
    }

    if (config.cancelToken) {
      // Handle cancellation
      config.cancelToken.promise.then(function onCanceled(cancel) {
        if (!request) {
          return;
        }

        request.abort();
        reject(cancel);
        // Clean up request
        request = null;
      });
    }

    if (requestData === undefined) {
      requestData = null;
    }

    // Send the request
    request.send(requestData);
  });
};

},{"../core/createError":44,"./../core/settle":48,"./../helpers/buildURL":52,"./../helpers/cookies":54,"./../helpers/isURLSameOrigin":56,"./../helpers/parseHeaders":58,"./../utils":60}],38:[function(require,module,exports){
'use strict';

var utils = require('./utils');
var bind = require('./helpers/bind');
var Axios = require('./core/Axios');
var mergeConfig = require('./core/mergeConfig');
var defaults = require('./defaults');

/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 * @return {Axios} A new instance of Axios
 */
function createInstance(defaultConfig) {
  var context = new Axios(defaultConfig);
  var instance = bind(Axios.prototype.request, context);

  // Copy axios.prototype to instance
  utils.extend(instance, Axios.prototype, context);

  // Copy context to instance
  utils.extend(instance, context);

  return instance;
}

// Create the default instance to be exported
var axios = createInstance(defaults);

// Expose Axios class to allow class inheritance
axios.Axios = Axios;

// Factory for creating new instances
axios.create = function create(instanceConfig) {
  return createInstance(mergeConfig(axios.defaults, instanceConfig));
};

// Expose Cancel & CancelToken
axios.Cancel = require('./cancel/Cancel');
axios.CancelToken = require('./cancel/CancelToken');
axios.isCancel = require('./cancel/isCancel');

// Expose all/spread
axios.all = function all(promises) {
  return Promise.all(promises);
};
axios.spread = require('./helpers/spread');

module.exports = axios;

// Allow use of default import syntax in TypeScript
module.exports.default = axios;

},{"./cancel/Cancel":39,"./cancel/CancelToken":40,"./cancel/isCancel":41,"./core/Axios":42,"./core/mergeConfig":47,"./defaults":50,"./helpers/bind":51,"./helpers/spread":59,"./utils":60}],39:[function(require,module,exports){
'use strict';

/**
 * A `Cancel` is an object that is thrown when an operation is canceled.
 *
 * @class
 * @param {string=} message The message.
 */
function Cancel(message) {
  this.message = message;
}

Cancel.prototype.toString = function toString() {
  return 'Cancel' + (this.message ? ': ' + this.message : '');
};

Cancel.prototype.__CANCEL__ = true;

module.exports = Cancel;

},{}],40:[function(require,module,exports){
'use strict';

var Cancel = require('./Cancel');

/**
 * A `CancelToken` is an object that can be used to request cancellation of an operation.
 *
 * @class
 * @param {Function} executor The executor function.
 */
function CancelToken(executor) {
  if (typeof executor !== 'function') {
    throw new TypeError('executor must be a function.');
  }

  var resolvePromise;
  this.promise = new Promise(function promiseExecutor(resolve) {
    resolvePromise = resolve;
  });

  var token = this;
  executor(function cancel(message) {
    if (token.reason) {
      // Cancellation has already been requested
      return;
    }

    token.reason = new Cancel(message);
    resolvePromise(token.reason);
  });
}

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
CancelToken.prototype.throwIfRequested = function throwIfRequested() {
  if (this.reason) {
    throw this.reason;
  }
};

/**
 * Returns an object that contains a new `CancelToken` and a function that, when called,
 * cancels the `CancelToken`.
 */
CancelToken.source = function source() {
  var cancel;
  var token = new CancelToken(function executor(c) {
    cancel = c;
  });
  return {
    token: token,
    cancel: cancel
  };
};

module.exports = CancelToken;

},{"./Cancel":39}],41:[function(require,module,exports){
'use strict';

module.exports = function isCancel(value) {
  return !!(value && value.__CANCEL__);
};

},{}],42:[function(require,module,exports){
'use strict';

var utils = require('./../utils');
var buildURL = require('../helpers/buildURL');
var InterceptorManager = require('./InterceptorManager');
var dispatchRequest = require('./dispatchRequest');
var mergeConfig = require('./mergeConfig');

/**
 * Create a new instance of Axios
 *
 * @param {Object} instanceConfig The default config for the instance
 */
function Axios(instanceConfig) {
  this.defaults = instanceConfig;
  this.interceptors = {
    request: new InterceptorManager(),
    response: new InterceptorManager()
  };
}

/**
 * Dispatch a request
 *
 * @param {Object} config The config specific for this request (merged with this.defaults)
 */
Axios.prototype.request = function request(config) {
  /*eslint no-param-reassign:0*/
  // Allow for axios('example/url'[, config]) a la fetch API
  if (typeof config === 'string') {
    config = arguments[1] || {};
    config.url = arguments[0];
  } else {
    config = config || {};
  }

  config = mergeConfig(this.defaults, config);
  config.method = config.method ? config.method.toLowerCase() : 'get';

  // Hook up interceptors middleware
  var chain = [dispatchRequest, undefined];
  var promise = Promise.resolve(config);

  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
    chain.unshift(interceptor.fulfilled, interceptor.rejected);
  });

  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
    chain.push(interceptor.fulfilled, interceptor.rejected);
  });

  while (chain.length) {
    promise = promise.then(chain.shift(), chain.shift());
  }

  return promise;
};

Axios.prototype.getUri = function getUri(config) {
  config = mergeConfig(this.defaults, config);
  return buildURL(config.url, config.params, config.paramsSerializer).replace(/^\?/, '');
};

// Provide aliases for supported request methods
utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, config) {
    return this.request(utils.merge(config || {}, {
      method: method,
      url: url
    }));
  };
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, data, config) {
    return this.request(utils.merge(config || {}, {
      method: method,
      url: url,
      data: data
    }));
  };
});

module.exports = Axios;

},{"../helpers/buildURL":52,"./../utils":60,"./InterceptorManager":43,"./dispatchRequest":45,"./mergeConfig":47}],43:[function(require,module,exports){
'use strict';

var utils = require('./../utils');

function InterceptorManager() {
  this.handlers = [];
}

/**
 * Add a new interceptor to the stack
 *
 * @param {Function} fulfilled The function to handle `then` for a `Promise`
 * @param {Function} rejected The function to handle `reject` for a `Promise`
 *
 * @return {Number} An ID used to remove interceptor later
 */
InterceptorManager.prototype.use = function use(fulfilled, rejected) {
  this.handlers.push({
    fulfilled: fulfilled,
    rejected: rejected
  });
  return this.handlers.length - 1;
};

/**
 * Remove an interceptor from the stack
 *
 * @param {Number} id The ID that was returned by `use`
 */
InterceptorManager.prototype.eject = function eject(id) {
  if (this.handlers[id]) {
    this.handlers[id] = null;
  }
};

/**
 * Iterate over all the registered interceptors
 *
 * This method is particularly useful for skipping over any
 * interceptors that may have become `null` calling `eject`.
 *
 * @param {Function} fn The function to call for each interceptor
 */
InterceptorManager.prototype.forEach = function forEach(fn) {
  utils.forEach(this.handlers, function forEachHandler(h) {
    if (h !== null) {
      fn(h);
    }
  });
};

module.exports = InterceptorManager;

},{"./../utils":60}],44:[function(require,module,exports){
'use strict';

var enhanceError = require('./enhanceError');

/**
 * Create an Error with the specified message, config, error code, request and response.
 *
 * @param {string} message The error message.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The created error.
 */
module.exports = function createError(message, config, code, request, response) {
  var error = new Error(message);
  return enhanceError(error, config, code, request, response);
};

},{"./enhanceError":46}],45:[function(require,module,exports){
'use strict';

var utils = require('./../utils');
var transformData = require('./transformData');
var isCancel = require('../cancel/isCancel');
var defaults = require('../defaults');
var isAbsoluteURL = require('./../helpers/isAbsoluteURL');
var combineURLs = require('./../helpers/combineURLs');

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }
}

/**
 * Dispatch a request to the server using the configured adapter.
 *
 * @param {object} config The config that is to be used for the request
 * @returns {Promise} The Promise to be fulfilled
 */
module.exports = function dispatchRequest(config) {
  throwIfCancellationRequested(config);

  // Support baseURL config
  if (config.baseURL && !isAbsoluteURL(config.url)) {
    config.url = combineURLs(config.baseURL, config.url);
  }

  // Ensure headers exist
  config.headers = config.headers || {};

  // Transform request data
  config.data = transformData(
    config.data,
    config.headers,
    config.transformRequest
  );

  // Flatten headers
  config.headers = utils.merge(
    config.headers.common || {},
    config.headers[config.method] || {},
    config.headers || {}
  );

  utils.forEach(
    ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
    function cleanHeaderConfig(method) {
      delete config.headers[method];
    }
  );

  var adapter = config.adapter || defaults.adapter;

  return adapter(config).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config);

    // Transform response data
    response.data = transformData(
      response.data,
      response.headers,
      config.transformResponse
    );

    return response;
  }, function onAdapterRejection(reason) {
    if (!isCancel(reason)) {
      throwIfCancellationRequested(config);

      // Transform response data
      if (reason && reason.response) {
        reason.response.data = transformData(
          reason.response.data,
          reason.response.headers,
          config.transformResponse
        );
      }
    }

    return Promise.reject(reason);
  });
};

},{"../cancel/isCancel":41,"../defaults":50,"./../helpers/combineURLs":53,"./../helpers/isAbsoluteURL":55,"./../utils":60,"./transformData":49}],46:[function(require,module,exports){
'use strict';

/**
 * Update an Error with the specified config, error code, and response.
 *
 * @param {Error} error The error to update.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The error.
 */
module.exports = function enhanceError(error, config, code, request, response) {
  error.config = config;
  if (code) {
    error.code = code;
  }

  error.request = request;
  error.response = response;
  error.isAxiosError = true;

  error.toJSON = function() {
    return {
      // Standard
      message: this.message,
      name: this.name,
      // Microsoft
      description: this.description,
      number: this.number,
      // Mozilla
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      // Axios
      config: this.config,
      code: this.code
    };
  };
  return error;
};

},{}],47:[function(require,module,exports){
'use strict';

var utils = require('../utils');

/**
 * Config-specific merge-function which creates a new config-object
 * by merging two configuration objects together.
 *
 * @param {Object} config1
 * @param {Object} config2
 * @returns {Object} New object resulting from merging config2 to config1
 */
module.exports = function mergeConfig(config1, config2) {
  // eslint-disable-next-line no-param-reassign
  config2 = config2 || {};
  var config = {};

  utils.forEach(['url', 'method', 'params', 'data'], function valueFromConfig2(prop) {
    if (typeof config2[prop] !== 'undefined') {
      config[prop] = config2[prop];
    }
  });

  utils.forEach(['headers', 'auth', 'proxy'], function mergeDeepProperties(prop) {
    if (utils.isObject(config2[prop])) {
      config[prop] = utils.deepMerge(config1[prop], config2[prop]);
    } else if (typeof config2[prop] !== 'undefined') {
      config[prop] = config2[prop];
    } else if (utils.isObject(config1[prop])) {
      config[prop] = utils.deepMerge(config1[prop]);
    } else if (typeof config1[prop] !== 'undefined') {
      config[prop] = config1[prop];
    }
  });

  utils.forEach([
    'baseURL', 'transformRequest', 'transformResponse', 'paramsSerializer',
    'timeout', 'withCredentials', 'adapter', 'responseType', 'xsrfCookieName',
    'xsrfHeaderName', 'onUploadProgress', 'onDownloadProgress', 'maxContentLength',
    'validateStatus', 'maxRedirects', 'httpAgent', 'httpsAgent', 'cancelToken',
    'socketPath'
  ], function defaultToConfig2(prop) {
    if (typeof config2[prop] !== 'undefined') {
      config[prop] = config2[prop];
    } else if (typeof config1[prop] !== 'undefined') {
      config[prop] = config1[prop];
    }
  });

  return config;
};

},{"../utils":60}],48:[function(require,module,exports){
'use strict';

var createError = require('./createError');

/**
 * Resolve or reject a Promise based on response status.
 *
 * @param {Function} resolve A function that resolves the promise.
 * @param {Function} reject A function that rejects the promise.
 * @param {object} response The response.
 */
module.exports = function settle(resolve, reject, response) {
  var validateStatus = response.config.validateStatus;
  if (!validateStatus || validateStatus(response.status)) {
    resolve(response);
  } else {
    reject(createError(
      'Request failed with status code ' + response.status,
      response.config,
      null,
      response.request,
      response
    ));
  }
};

},{"./createError":44}],49:[function(require,module,exports){
'use strict';

var utils = require('./../utils');

/**
 * Transform the data for a request or a response
 *
 * @param {Object|String} data The data to be transformed
 * @param {Array} headers The headers for the request or response
 * @param {Array|Function} fns A single function or Array of functions
 * @returns {*} The resulting transformed data
 */
module.exports = function transformData(data, headers, fns) {
  /*eslint no-param-reassign:0*/
  utils.forEach(fns, function transform(fn) {
    data = fn(data, headers);
  });

  return data;
};

},{"./../utils":60}],50:[function(require,module,exports){
(function (process){
'use strict';

var utils = require('./utils');
var normalizeHeaderName = require('./helpers/normalizeHeaderName');

var DEFAULT_CONTENT_TYPE = {
  'Content-Type': 'application/x-www-form-urlencoded'
};

function setContentTypeIfUnset(headers, value) {
  if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
    headers['Content-Type'] = value;
  }
}

function getDefaultAdapter() {
  var adapter;
  // Only Node.JS has a process variable that is of [[Class]] process
  if (typeof process !== 'undefined' && Object.prototype.toString.call(process) === '[object process]') {
    // For node use HTTP adapter
    adapter = require('./adapters/http');
  } else if (typeof XMLHttpRequest !== 'undefined') {
    // For browsers use XHR adapter
    adapter = require('./adapters/xhr');
  }
  return adapter;
}

var defaults = {
  adapter: getDefaultAdapter(),

  transformRequest: [function transformRequest(data, headers) {
    normalizeHeaderName(headers, 'Accept');
    normalizeHeaderName(headers, 'Content-Type');
    if (utils.isFormData(data) ||
      utils.isArrayBuffer(data) ||
      utils.isBuffer(data) ||
      utils.isStream(data) ||
      utils.isFile(data) ||
      utils.isBlob(data)
    ) {
      return data;
    }
    if (utils.isArrayBufferView(data)) {
      return data.buffer;
    }
    if (utils.isURLSearchParams(data)) {
      setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
      return data.toString();
    }
    if (utils.isObject(data)) {
      setContentTypeIfUnset(headers, 'application/json;charset=utf-8');
      return JSON.stringify(data);
    }
    return data;
  }],

  transformResponse: [function transformResponse(data) {
    /*eslint no-param-reassign:0*/
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data);
      } catch (e) { /* Ignore */ }
    }
    return data;
  }],

  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,

  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',

  maxContentLength: -1,

  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  }
};

defaults.headers = {
  common: {
    'Accept': 'application/json, text/plain, */*'
  }
};

utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
  defaults.headers[method] = {};
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
});

module.exports = defaults;

}).call(this,require('_process'))
},{"./adapters/http":37,"./adapters/xhr":37,"./helpers/normalizeHeaderName":57,"./utils":60,"_process":137}],51:[function(require,module,exports){
'use strict';

module.exports = function bind(fn, thisArg) {
  return function wrap() {
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }
    return fn.apply(thisArg, args);
  };
};

},{}],52:[function(require,module,exports){
'use strict';

var utils = require('./../utils');

function encode(val) {
  return encodeURIComponent(val).
    replace(/%40/gi, '@').
    replace(/%3A/gi, ':').
    replace(/%24/g, '$').
    replace(/%2C/gi, ',').
    replace(/%20/g, '+').
    replace(/%5B/gi, '[').
    replace(/%5D/gi, ']');
}

/**
 * Build a URL by appending params to the end
 *
 * @param {string} url The base of the url (e.g., http://www.google.com)
 * @param {object} [params] The params to be appended
 * @returns {string} The formatted url
 */
module.exports = function buildURL(url, params, paramsSerializer) {
  /*eslint no-param-reassign:0*/
  if (!params) {
    return url;
  }

  var serializedParams;
  if (paramsSerializer) {
    serializedParams = paramsSerializer(params);
  } else if (utils.isURLSearchParams(params)) {
    serializedParams = params.toString();
  } else {
    var parts = [];

    utils.forEach(params, function serialize(val, key) {
      if (val === null || typeof val === 'undefined') {
        return;
      }

      if (utils.isArray(val)) {
        key = key + '[]';
      } else {
        val = [val];
      }

      utils.forEach(val, function parseValue(v) {
        if (utils.isDate(v)) {
          v = v.toISOString();
        } else if (utils.isObject(v)) {
          v = JSON.stringify(v);
        }
        parts.push(encode(key) + '=' + encode(v));
      });
    });

    serializedParams = parts.join('&');
  }

  if (serializedParams) {
    var hashmarkIndex = url.indexOf('#');
    if (hashmarkIndex !== -1) {
      url = url.slice(0, hashmarkIndex);
    }

    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }

  return url;
};

},{"./../utils":60}],53:[function(require,module,exports){
'use strict';

/**
 * Creates a new URL by combining the specified URLs
 *
 * @param {string} baseURL The base URL
 * @param {string} relativeURL The relative URL
 * @returns {string} The combined URL
 */
module.exports = function combineURLs(baseURL, relativeURL) {
  return relativeURL
    ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
    : baseURL;
};

},{}],54:[function(require,module,exports){
'use strict';

var utils = require('./../utils');

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs support document.cookie
    (function standardBrowserEnv() {
      return {
        write: function write(name, value, expires, path, domain, secure) {
          var cookie = [];
          cookie.push(name + '=' + encodeURIComponent(value));

          if (utils.isNumber(expires)) {
            cookie.push('expires=' + new Date(expires).toGMTString());
          }

          if (utils.isString(path)) {
            cookie.push('path=' + path);
          }

          if (utils.isString(domain)) {
            cookie.push('domain=' + domain);
          }

          if (secure === true) {
            cookie.push('secure');
          }

          document.cookie = cookie.join('; ');
        },

        read: function read(name) {
          var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
          return (match ? decodeURIComponent(match[3]) : null);
        },

        remove: function remove(name) {
          this.write(name, '', Date.now() - 86400000);
        }
      };
    })() :

  // Non standard browser env (web workers, react-native) lack needed support.
    (function nonStandardBrowserEnv() {
      return {
        write: function write() {},
        read: function read() { return null; },
        remove: function remove() {}
      };
    })()
);

},{"./../utils":60}],55:[function(require,module,exports){
'use strict';

/**
 * Determines whether the specified URL is absolute
 *
 * @param {string} url The URL to test
 * @returns {boolean} True if the specified URL is absolute, otherwise false
 */
module.exports = function isAbsoluteURL(url) {
  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
  // by any combination of letters, digits, plus, period, or hyphen.
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
};

},{}],56:[function(require,module,exports){
'use strict';

var utils = require('./../utils');

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs have full support of the APIs needed to test
  // whether the request URL is of the same origin as current location.
    (function standardBrowserEnv() {
      var msie = /(msie|trident)/i.test(navigator.userAgent);
      var urlParsingNode = document.createElement('a');
      var originURL;

      /**
    * Parse a URL to discover it's components
    *
    * @param {String} url The URL to be parsed
    * @returns {Object}
    */
      function resolveURL(url) {
        var href = url;

        if (msie) {
        // IE needs attribute set twice to normalize properties
          urlParsingNode.setAttribute('href', href);
          href = urlParsingNode.href;
        }

        urlParsingNode.setAttribute('href', href);

        // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
        return {
          href: urlParsingNode.href,
          protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
          host: urlParsingNode.host,
          search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
          hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
          hostname: urlParsingNode.hostname,
          port: urlParsingNode.port,
          pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
            urlParsingNode.pathname :
            '/' + urlParsingNode.pathname
        };
      }

      originURL = resolveURL(window.location.href);

      /**
    * Determine if a URL shares the same origin as the current location
    *
    * @param {String} requestURL The URL to test
    * @returns {boolean} True if URL shares the same origin, otherwise false
    */
      return function isURLSameOrigin(requestURL) {
        var parsed = (utils.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
        return (parsed.protocol === originURL.protocol &&
            parsed.host === originURL.host);
      };
    })() :

  // Non standard browser envs (web workers, react-native) lack needed support.
    (function nonStandardBrowserEnv() {
      return function isURLSameOrigin() {
        return true;
      };
    })()
);

},{"./../utils":60}],57:[function(require,module,exports){
'use strict';

var utils = require('../utils');

module.exports = function normalizeHeaderName(headers, normalizedName) {
  utils.forEach(headers, function processHeader(value, name) {
    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
      headers[normalizedName] = value;
      delete headers[name];
    }
  });
};

},{"../utils":60}],58:[function(require,module,exports){
'use strict';

var utils = require('./../utils');

// Headers whose duplicates are ignored by node
// c.f. https://nodejs.org/api/http.html#http_message_headers
var ignoreDuplicateOf = [
  'age', 'authorization', 'content-length', 'content-type', 'etag',
  'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
  'last-modified', 'location', 'max-forwards', 'proxy-authorization',
  'referer', 'retry-after', 'user-agent'
];

/**
 * Parse headers into an object
 *
 * ```
 * Date: Wed, 27 Aug 2014 08:58:49 GMT
 * Content-Type: application/json
 * Connection: keep-alive
 * Transfer-Encoding: chunked
 * ```
 *
 * @param {String} headers Headers needing to be parsed
 * @returns {Object} Headers parsed into an object
 */
module.exports = function parseHeaders(headers) {
  var parsed = {};
  var key;
  var val;
  var i;

  if (!headers) { return parsed; }

  utils.forEach(headers.split('\n'), function parser(line) {
    i = line.indexOf(':');
    key = utils.trim(line.substr(0, i)).toLowerCase();
    val = utils.trim(line.substr(i + 1));

    if (key) {
      if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
        return;
      }
      if (key === 'set-cookie') {
        parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
      } else {
        parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
      }
    }
  });

  return parsed;
};

},{"./../utils":60}],59:[function(require,module,exports){
'use strict';

/**
 * Syntactic sugar for invoking a function and expanding an array for arguments.
 *
 * Common use case would be to use `Function.prototype.apply`.
 *
 *  ```js
 *  function f(x, y, z) {}
 *  var args = [1, 2, 3];
 *  f.apply(null, args);
 *  ```
 *
 * With `spread` this example can be re-written.
 *
 *  ```js
 *  spread(function(x, y, z) {})([1, 2, 3]);
 *  ```
 *
 * @param {Function} callback
 * @returns {Function}
 */
module.exports = function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
};

},{}],60:[function(require,module,exports){
'use strict';

var bind = require('./helpers/bind');
var isBuffer = require('is-buffer');

/*global toString:true*/

// utils is a library of generic helper functions non-specific to axios

var toString = Object.prototype.toString;

/**
 * Determine if a value is an Array
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Array, otherwise false
 */
function isArray(val) {
  return toString.call(val) === '[object Array]';
}

/**
 * Determine if a value is an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
 */
function isArrayBuffer(val) {
  return toString.call(val) === '[object ArrayBuffer]';
}

/**
 * Determine if a value is a FormData
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an FormData, otherwise false
 */
function isFormData(val) {
  return (typeof FormData !== 'undefined') && (val instanceof FormData);
}

/**
 * Determine if a value is a view on an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
 */
function isArrayBufferView(val) {
  var result;
  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
    result = ArrayBuffer.isView(val);
  } else {
    result = (val) && (val.buffer) && (val.buffer instanceof ArrayBuffer);
  }
  return result;
}

/**
 * Determine if a value is a String
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a String, otherwise false
 */
function isString(val) {
  return typeof val === 'string';
}

/**
 * Determine if a value is a Number
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Number, otherwise false
 */
function isNumber(val) {
  return typeof val === 'number';
}

/**
 * Determine if a value is undefined
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if the value is undefined, otherwise false
 */
function isUndefined(val) {
  return typeof val === 'undefined';
}

/**
 * Determine if a value is an Object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Object, otherwise false
 */
function isObject(val) {
  return val !== null && typeof val === 'object';
}

/**
 * Determine if a value is a Date
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Date, otherwise false
 */
function isDate(val) {
  return toString.call(val) === '[object Date]';
}

/**
 * Determine if a value is a File
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a File, otherwise false
 */
function isFile(val) {
  return toString.call(val) === '[object File]';
}

/**
 * Determine if a value is a Blob
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Blob, otherwise false
 */
function isBlob(val) {
  return toString.call(val) === '[object Blob]';
}

/**
 * Determine if a value is a Function
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Function, otherwise false
 */
function isFunction(val) {
  return toString.call(val) === '[object Function]';
}

/**
 * Determine if a value is a Stream
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Stream, otherwise false
 */
function isStream(val) {
  return isObject(val) && isFunction(val.pipe);
}

/**
 * Determine if a value is a URLSearchParams object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
 */
function isURLSearchParams(val) {
  return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams;
}

/**
 * Trim excess whitespace off the beginning and end of a string
 *
 * @param {String} str The String to trim
 * @returns {String} The String freed of excess whitespace
 */
function trim(str) {
  return str.replace(/^\s*/, '').replace(/\s*$/, '');
}

/**
 * Determine if we're running in a standard browser environment
 *
 * This allows axios to run in a web worker, and react-native.
 * Both environments support XMLHttpRequest, but not fully standard globals.
 *
 * web workers:
 *  typeof window -> undefined
 *  typeof document -> undefined
 *
 * react-native:
 *  navigator.product -> 'ReactNative'
 * nativescript
 *  navigator.product -> 'NativeScript' or 'NS'
 */
function isStandardBrowserEnv() {
  if (typeof navigator !== 'undefined' && (navigator.product === 'ReactNative' ||
                                           navigator.product === 'NativeScript' ||
                                           navigator.product === 'NS')) {
    return false;
  }
  return (
    typeof window !== 'undefined' &&
    typeof document !== 'undefined'
  );
}

/**
 * Iterate over an Array or an Object invoking a function for each item.
 *
 * If `obj` is an Array callback will be called passing
 * the value, index, and complete array for each item.
 *
 * If 'obj' is an Object callback will be called passing
 * the value, key, and complete object for each property.
 *
 * @param {Object|Array} obj The object to iterate
 * @param {Function} fn The callback to invoke for each item
 */
function forEach(obj, fn) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === 'undefined') {
    return;
  }

  // Force an array if not already something iterable
  if (typeof obj !== 'object') {
    /*eslint no-param-reassign:0*/
    obj = [obj];
  }

  if (isArray(obj)) {
    // Iterate over array values
    for (var i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // Iterate over object keys
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        fn.call(null, obj[key], key, obj);
      }
    }
  }
}

/**
 * Accepts varargs expecting each argument to be an object, then
 * immutably merges the properties of each object and returns result.
 *
 * When multiple objects contain the same key the later object in
 * the arguments list will take precedence.
 *
 * Example:
 *
 * ```js
 * var result = merge({foo: 123}, {foo: 456});
 * console.log(result.foo); // outputs 456
 * ```
 *
 * @param {Object} obj1 Object to merge
 * @returns {Object} Result of all merge properties
 */
function merge(/* obj1, obj2, obj3, ... */) {
  var result = {};
  function assignValue(val, key) {
    if (typeof result[key] === 'object' && typeof val === 'object') {
      result[key] = merge(result[key], val);
    } else {
      result[key] = val;
    }
  }

  for (var i = 0, l = arguments.length; i < l; i++) {
    forEach(arguments[i], assignValue);
  }
  return result;
}

/**
 * Function equal to merge with the difference being that no reference
 * to original objects is kept.
 *
 * @see merge
 * @param {Object} obj1 Object to merge
 * @returns {Object} Result of all merge properties
 */
function deepMerge(/* obj1, obj2, obj3, ... */) {
  var result = {};
  function assignValue(val, key) {
    if (typeof result[key] === 'object' && typeof val === 'object') {
      result[key] = deepMerge(result[key], val);
    } else if (typeof val === 'object') {
      result[key] = deepMerge({}, val);
    } else {
      result[key] = val;
    }
  }

  for (var i = 0, l = arguments.length; i < l; i++) {
    forEach(arguments[i], assignValue);
  }
  return result;
}

/**
 * Extends object a by mutably adding to it the properties of object b.
 *
 * @param {Object} a The object to be extended
 * @param {Object} b The object to copy properties from
 * @param {Object} thisArg The object to bind function to
 * @return {Object} The resulting value of object a
 */
function extend(a, b, thisArg) {
  forEach(b, function assignValue(val, key) {
    if (thisArg && typeof val === 'function') {
      a[key] = bind(val, thisArg);
    } else {
      a[key] = val;
    }
  });
  return a;
}

module.exports = {
  isArray: isArray,
  isArrayBuffer: isArrayBuffer,
  isBuffer: isBuffer,
  isFormData: isFormData,
  isArrayBufferView: isArrayBufferView,
  isString: isString,
  isNumber: isNumber,
  isObject: isObject,
  isUndefined: isUndefined,
  isDate: isDate,
  isFile: isFile,
  isBlob: isBlob,
  isFunction: isFunction,
  isStream: isStream,
  isURLSearchParams: isURLSearchParams,
  isStandardBrowserEnv: isStandardBrowserEnv,
  forEach: forEach,
  merge: merge,
  deepMerge: deepMerge,
  extend: extend,
  trim: trim
};

},{"./helpers/bind":51,"is-buffer":61}],61:[function(require,module,exports){
/*!
 * Determine if an object is a Buffer
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */

module.exports = function isBuffer (obj) {
  return obj != null && obj.constructor != null &&
    typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)
}

},{}],62:[function(require,module,exports){
var register = require('./lib/register')
var addHook = require('./lib/add')
var removeHook = require('./lib/remove')

// bind with array of arguments: https://stackoverflow.com/a/21792913
var bind = Function.bind
var bindable = bind.bind(bind)

function bindApi (hook, state, name) {
  var removeHookRef = bindable(removeHook, null).apply(null, name ? [state, name] : [state])
  hook.api = { remove: removeHookRef }
  hook.remove = removeHookRef

  ;['before', 'error', 'after', 'wrap'].forEach(function (kind) {
    var args = name ? [state, kind, name] : [state, kind]
    hook[kind] = hook.api[kind] = bindable(addHook, null).apply(null, args)
  })
}

function HookSingular () {
  var singularHookName = 'h'
  var singularHookState = {
    registry: {}
  }
  var singularHook = register.bind(null, singularHookState, singularHookName)
  bindApi(singularHook, singularHookState, singularHookName)
  return singularHook
}

function HookCollection () {
  var state = {
    registry: {}
  }

  var hook = register.bind(null, state)
  bindApi(hook, state)

  return hook
}

var collectionHookDeprecationMessageDisplayed = false
function Hook () {
  if (!collectionHookDeprecationMessageDisplayed) {
    console.warn('[before-after-hook]: "Hook()" repurposing warning, use "Hook.Collection()". Read more: https://git.io/upgrade-before-after-hook-to-1.4')
    collectionHookDeprecationMessageDisplayed = true
  }
  return HookCollection()
}

Hook.Singular = HookSingular.bind()
Hook.Collection = HookCollection.bind()

module.exports = Hook
// expose constructors as a named property for TypeScript
module.exports.Hook = Hook
module.exports.Singular = Hook.Singular
module.exports.Collection = Hook.Collection

},{"./lib/add":63,"./lib/register":64,"./lib/remove":65}],63:[function(require,module,exports){
module.exports = addHook

function addHook (state, kind, name, hook) {
  var orig = hook
  if (!state.registry[name]) {
    state.registry[name] = []
  }

  if (kind === 'before') {
    hook = function (method, options) {
      return Promise.resolve()
        .then(orig.bind(null, options))
        .then(method.bind(null, options))
    }
  }

  if (kind === 'after') {
    hook = function (method, options) {
      var result
      return Promise.resolve()
        .then(method.bind(null, options))
        .then(function (result_) {
          result = result_
          return orig(result, options)
        })
        .then(function () {
          return result
        })
    }
  }

  if (kind === 'error') {
    hook = function (method, options) {
      return Promise.resolve()
        .then(method.bind(null, options))
        .catch(function (error) {
          return orig(error, options)
        })
    }
  }

  state.registry[name].push({
    hook: hook,
    orig: orig
  })
}

},{}],64:[function(require,module,exports){
module.exports = register

function register (state, name, method, options) {
  if (typeof method !== 'function') {
    throw new Error('method for before hook must be a function')
  }

  if (!options) {
    options = {}
  }

  if (Array.isArray(name)) {
    return name.reverse().reduce(function (callback, name) {
      return register.bind(null, state, name, callback, options)
    }, method)()
  }

  return Promise.resolve()
    .then(function () {
      if (!state.registry[name]) {
        return method(options)
      }

      return (state.registry[name]).reduce(function (method, registered) {
        return registered.hook.bind(null, method, options)
      }, method)()
    })
}

},{}],65:[function(require,module,exports){
module.exports = removeHook

function removeHook (state, name, method) {
  if (!state.registry[name]) {
    return
  }

  var index = state.registry[name]
    .map(function (registered) { return registered.orig })
    .indexOf(method)

  if (index === -1) {
    return
  }

  state.registry[name].splice(index, 1)
}

},{}],66:[function(require,module,exports){
module.exports = function _btoa(str) {
  return btoa(str)
}

},{}],67:[function(require,module,exports){
'use strict';

const cp = require('child_process');
const parse = require('./lib/parse');
const enoent = require('./lib/enoent');

function spawn(command, args, options) {
    // Parse the arguments
    const parsed = parse(command, args, options);

    // Spawn the child process
    const spawned = cp.spawn(parsed.command, parsed.args, parsed.options);

    // Hook into child process "exit" event to emit an error if the command
    // does not exists, see: https://github.com/IndigoUnited/node-cross-spawn/issues/16
    enoent.hookChildProcess(spawned, parsed);

    return spawned;
}

function spawnSync(command, args, options) {
    // Parse the arguments
    const parsed = parse(command, args, options);

    // Spawn the child process
    const result = cp.spawnSync(parsed.command, parsed.args, parsed.options);

    // Analyze if the command does not exist, see: https://github.com/IndigoUnited/node-cross-spawn/issues/16
    result.error = result.error || enoent.verifyENOENTSync(result.status, parsed);

    return result;
}

module.exports = spawn;
module.exports.spawn = spawn;
module.exports.sync = spawnSync;

module.exports._parse = parse;
module.exports._enoent = enoent;

},{"./lib/enoent":68,"./lib/parse":69,"child_process":119}],68:[function(require,module,exports){
(function (process){
'use strict';

const isWin = process.platform === 'win32';

function notFoundError(original, syscall) {
    return Object.assign(new Error(`${syscall} ${original.command} ENOENT`), {
        code: 'ENOENT',
        errno: 'ENOENT',
        syscall: `${syscall} ${original.command}`,
        path: original.command,
        spawnargs: original.args,
    });
}

function hookChildProcess(cp, parsed) {
    if (!isWin) {
        return;
    }

    const originalEmit = cp.emit;

    cp.emit = function (name, arg1) {
        // If emitting "exit" event and exit code is 1, we need to check if
        // the command exists and emit an "error" instead
        // See https://github.com/IndigoUnited/node-cross-spawn/issues/16
        if (name === 'exit') {
            const err = verifyENOENT(arg1, parsed, 'spawn');

            if (err) {
                return originalEmit.call(cp, 'error', err);
            }
        }

        return originalEmit.apply(cp, arguments); // eslint-disable-line prefer-rest-params
    };
}

function verifyENOENT(status, parsed) {
    if (isWin && status === 1 && !parsed.file) {
        return notFoundError(parsed.original, 'spawn');
    }

    return null;
}

function verifyENOENTSync(status, parsed) {
    if (isWin && status === 1 && !parsed.file) {
        return notFoundError(parsed.original, 'spawnSync');
    }

    return null;
}

module.exports = {
    hookChildProcess,
    verifyENOENT,
    verifyENOENTSync,
    notFoundError,
};

}).call(this,require('_process'))
},{"_process":137}],69:[function(require,module,exports){
(function (process){
'use strict';

const path = require('path');
const niceTry = require('nice-try');
const resolveCommand = require('./util/resolveCommand');
const escape = require('./util/escape');
const readShebang = require('./util/readShebang');
const semver = require('semver');

const isWin = process.platform === 'win32';
const isExecutableRegExp = /\.(?:com|exe)$/i;
const isCmdShimRegExp = /node_modules[\\/].bin[\\/][^\\/]+\.cmd$/i;

// `options.shell` is supported in Node ^4.8.0, ^5.7.0 and >= 6.0.0
const supportsShellOption = niceTry(() => semver.satisfies(process.version, '^4.8.0 || ^5.7.0 || >= 6.0.0', true)) || false;

function detectShebang(parsed) {
    parsed.file = resolveCommand(parsed);

    const shebang = parsed.file && readShebang(parsed.file);

    if (shebang) {
        parsed.args.unshift(parsed.file);
        parsed.command = shebang;

        return resolveCommand(parsed);
    }

    return parsed.file;
}

function parseNonShell(parsed) {
    if (!isWin) {
        return parsed;
    }

    // Detect & add support for shebangs
    const commandFile = detectShebang(parsed);

    // We don't need a shell if the command filename is an executable
    const needsShell = !isExecutableRegExp.test(commandFile);

    // If a shell is required, use cmd.exe and take care of escaping everything correctly
    // Note that `forceShell` is an hidden option used only in tests
    if (parsed.options.forceShell || needsShell) {
        // Need to double escape meta chars if the command is a cmd-shim located in `node_modules/.bin/`
        // The cmd-shim simply calls execute the package bin file with NodeJS, proxying any argument
        // Because the escape of metachars with ^ gets interpreted when the cmd.exe is first called,
        // we need to double escape them
        const needsDoubleEscapeMetaChars = isCmdShimRegExp.test(commandFile);

        // Normalize posix paths into OS compatible paths (e.g.: foo/bar -> foo\bar)
        // This is necessary otherwise it will always fail with ENOENT in those cases
        parsed.command = path.normalize(parsed.command);

        // Escape command & arguments
        parsed.command = escape.command(parsed.command);
        parsed.args = parsed.args.map((arg) => escape.argument(arg, needsDoubleEscapeMetaChars));

        const shellCommand = [parsed.command].concat(parsed.args).join(' ');

        parsed.args = ['/d', '/s', '/c', `"${shellCommand}"`];
        parsed.command = process.env.comspec || 'cmd.exe';
        parsed.options.windowsVerbatimArguments = true; // Tell node's spawn that the arguments are already escaped
    }

    return parsed;
}

function parseShell(parsed) {
    // If node supports the shell option, there's no need to mimic its behavior
    if (supportsShellOption) {
        return parsed;
    }

    // Mimic node shell option
    // See https://github.com/nodejs/node/blob/b9f6a2dc059a1062776133f3d4fd848c4da7d150/lib/child_process.js#L335
    const shellCommand = [parsed.command].concat(parsed.args).join(' ');

    if (isWin) {
        parsed.command = typeof parsed.options.shell === 'string' ? parsed.options.shell : process.env.comspec || 'cmd.exe';
        parsed.args = ['/d', '/s', '/c', `"${shellCommand}"`];
        parsed.options.windowsVerbatimArguments = true; // Tell node's spawn that the arguments are already escaped
    } else {
        if (typeof parsed.options.shell === 'string') {
            parsed.command = parsed.options.shell;
        } else if (process.platform === 'android') {
            parsed.command = '/system/bin/sh';
        } else {
            parsed.command = '/bin/sh';
        }

        parsed.args = ['-c', shellCommand];
    }

    return parsed;
}

function parse(command, args, options) {
    // Normalize arguments, similar to nodejs
    if (args && !Array.isArray(args)) {
        options = args;
        args = null;
    }

    args = args ? args.slice(0) : []; // Clone array to avoid changing the original
    options = Object.assign({}, options); // Clone object to avoid changing the original

    // Build our parsed object
    const parsed = {
        command,
        args,
        options,
        file: undefined,
        original: {
            command,
            args,
        },
    };

    // Delegate further parsing to shell or non-shell
    return options.shell ? parseShell(parsed) : parseNonShell(parsed);
}

module.exports = parse;

}).call(this,require('_process'))
},{"./util/escape":70,"./util/readShebang":71,"./util/resolveCommand":72,"_process":137,"nice-try":88,"path":135,"semver":109}],70:[function(require,module,exports){
'use strict';

// See http://www.robvanderwoude.com/escapechars.php
const metaCharsRegExp = /([()\][%!^"`<>&|;, *?])/g;

function escapeCommand(arg) {
    // Escape meta chars
    arg = arg.replace(metaCharsRegExp, '^$1');

    return arg;
}

function escapeArgument(arg, doubleEscapeMetaChars) {
    // Convert to string
    arg = `${arg}`;

    // Algorithm below is based on https://qntm.org/cmd

    // Sequence of backslashes followed by a double quote:
    // double up all the backslashes and escape the double quote
    arg = arg.replace(/(\\*)"/g, '$1$1\\"');

    // Sequence of backslashes followed by the end of the string
    // (which will become a double quote later):
    // double up all the backslashes
    arg = arg.replace(/(\\*)$/, '$1$1');

    // All other backslashes occur literally

    // Quote the whole thing:
    arg = `"${arg}"`;

    // Escape meta chars
    arg = arg.replace(metaCharsRegExp, '^$1');

    // Double escape meta chars if necessary
    if (doubleEscapeMetaChars) {
        arg = arg.replace(metaCharsRegExp, '^$1');
    }

    return arg;
}

module.exports.command = escapeCommand;
module.exports.argument = escapeArgument;

},{}],71:[function(require,module,exports){
(function (Buffer){
'use strict';

const fs = require('fs');
const shebangCommand = require('shebang-command');

function readShebang(command) {
    // Read the first 150 bytes from the file
    const size = 150;
    let buffer;

    if (Buffer.alloc) {
        // Node.js v4.5+ / v5.10+
        buffer = Buffer.alloc(size);
    } else {
        // Old Node.js API
        buffer = new Buffer(size);
        buffer.fill(0); // zero-fill
    }

    let fd;

    try {
        fd = fs.openSync(command, 'r');
        fs.readSync(fd, buffer, 0, size, 0);
        fs.closeSync(fd);
    } catch (e) { /* Empty */ }

    // Attempt to extract shebang (null is returned if not a shebang)
    return shebangCommand(buffer.toString());
}

module.exports = readShebang;

}).call(this,require("buffer").Buffer)
},{"buffer":126,"fs":119,"shebang-command":110}],72:[function(require,module,exports){
(function (process){
'use strict';

const path = require('path');
const which = require('which');
const pathKey = require('path-key')();

function resolveCommandAttempt(parsed, withoutPathExt) {
    const cwd = process.cwd();
    const hasCustomCwd = parsed.options.cwd != null;

    // If a custom `cwd` was specified, we need to change the process cwd
    // because `which` will do stat calls but does not support a custom cwd
    if (hasCustomCwd) {
        try {
            process.chdir(parsed.options.cwd);
        } catch (err) {
            /* Empty */
        }
    }

    let resolved;

    try {
        resolved = which.sync(parsed.command, {
            path: (parsed.options.env || process.env)[pathKey],
            pathExt: withoutPathExt ? path.delimiter : undefined,
        });
    } catch (e) {
        /* Empty */
    } finally {
        process.chdir(cwd);
    }

    // If we successfully resolved, ensure that an absolute path is returned
    // Note that when a custom `cwd` was used, we need to resolve to an absolute path based on it
    if (resolved) {
        resolved = path.resolve(hasCustomCwd ? parsed.options.cwd : '', resolved);
    }

    return resolved;
}

function resolveCommand(parsed) {
    return resolveCommandAttempt(parsed) || resolveCommandAttempt(parsed, true);
}

module.exports = resolveCommand;

}).call(this,require('_process'))
},{"_process":137,"path":135,"path-key":107,"which":116}],73:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

class Deprecation extends Error {
  constructor(message) {
    super(message); // Maintains proper stack trace (only available on V8)

    /* istanbul ignore next */

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }

    this.name = 'Deprecation';
  }

}

exports.Deprecation = Deprecation;

},{}],74:[function(require,module,exports){
var once = require('once');

var noop = function() {};

var isRequest = function(stream) {
	return stream.setHeader && typeof stream.abort === 'function';
};

var isChildProcess = function(stream) {
	return stream.stdio && Array.isArray(stream.stdio) && stream.stdio.length === 3
};

var eos = function(stream, opts, callback) {
	if (typeof opts === 'function') return eos(stream, null, opts);
	if (!opts) opts = {};

	callback = once(callback || noop);

	var ws = stream._writableState;
	var rs = stream._readableState;
	var readable = opts.readable || (opts.readable !== false && stream.readable);
	var writable = opts.writable || (opts.writable !== false && stream.writable);

	var onlegacyfinish = function() {
		if (!stream.writable) onfinish();
	};

	var onfinish = function() {
		writable = false;
		if (!readable) callback.call(stream);
	};

	var onend = function() {
		readable = false;
		if (!writable) callback.call(stream);
	};

	var onexit = function(exitCode) {
		callback.call(stream, exitCode ? new Error('exited with error code: ' + exitCode) : null);
	};

	var onerror = function(err) {
		callback.call(stream, err);
	};

	var onclose = function() {
		if (readable && !(rs && rs.ended)) return callback.call(stream, new Error('premature close'));
		if (writable && !(ws && ws.ended)) return callback.call(stream, new Error('premature close'));
	};

	var onrequest = function() {
		stream.req.on('finish', onfinish);
	};

	if (isRequest(stream)) {
		stream.on('complete', onfinish);
		stream.on('abort', onclose);
		if (stream.req) onrequest();
		else stream.on('request', onrequest);
	} else if (writable && !ws) { // legacy streams
		stream.on('end', onlegacyfinish);
		stream.on('close', onlegacyfinish);
	}

	if (isChildProcess(stream)) stream.on('exit', onexit);

	stream.on('end', onend);
	stream.on('finish', onfinish);
	if (opts.error !== false) stream.on('error', onerror);
	stream.on('close', onclose);

	return function() {
		stream.removeListener('complete', onfinish);
		stream.removeListener('abort', onclose);
		stream.removeListener('request', onrequest);
		if (stream.req) stream.req.removeListener('finish', onfinish);
		stream.removeListener('end', onlegacyfinish);
		stream.removeListener('close', onlegacyfinish);
		stream.removeListener('finish', onfinish);
		stream.removeListener('exit', onexit);
		stream.removeListener('end', onend);
		stream.removeListener('error', onerror);
		stream.removeListener('close', onclose);
	};
};

module.exports = eos;

},{"once":104}],75:[function(require,module,exports){
(function (process){
'use strict';
const path = require('path');
const childProcess = require('child_process');
const crossSpawn = require('cross-spawn');
const stripEof = require('strip-eof');
const npmRunPath = require('npm-run-path');
const isStream = require('is-stream');
const _getStream = require('get-stream');
const pFinally = require('p-finally');
const onExit = require('signal-exit');
const errname = require('./lib/errname');
const stdio = require('./lib/stdio');

const TEN_MEGABYTES = 1000 * 1000 * 10;

function handleArgs(cmd, args, opts) {
	let parsed;

	opts = Object.assign({
		extendEnv: true,
		env: {}
	}, opts);

	if (opts.extendEnv) {
		opts.env = Object.assign({}, process.env, opts.env);
	}

	if (opts.__winShell === true) {
		delete opts.__winShell;
		parsed = {
			command: cmd,
			args,
			options: opts,
			file: cmd,
			original: {
				cmd,
				args
			}
		};
	} else {
		parsed = crossSpawn._parse(cmd, args, opts);
	}

	opts = Object.assign({
		maxBuffer: TEN_MEGABYTES,
		buffer: true,
		stripEof: true,
		preferLocal: true,
		localDir: parsed.options.cwd || process.cwd(),
		encoding: 'utf8',
		reject: true,
		cleanup: true
	}, parsed.options);

	opts.stdio = stdio(opts);

	if (opts.preferLocal) {
		opts.env = npmRunPath.env(Object.assign({}, opts, {cwd: opts.localDir}));
	}

	if (opts.detached) {
		// #115
		opts.cleanup = false;
	}

	if (process.platform === 'win32' && path.basename(parsed.command) === 'cmd.exe') {
		// #116
		parsed.args.unshift('/q');
	}

	return {
		cmd: parsed.command,
		args: parsed.args,
		opts,
		parsed
	};
}

function handleInput(spawned, input) {
	if (input === null || input === undefined) {
		return;
	}

	if (isStream(input)) {
		input.pipe(spawned.stdin);
	} else {
		spawned.stdin.end(input);
	}
}

function handleOutput(opts, val) {
	if (val && opts.stripEof) {
		val = stripEof(val);
	}

	return val;
}

function handleShell(fn, cmd, opts) {
	let file = '/bin/sh';
	let args = ['-c', cmd];

	opts = Object.assign({}, opts);

	if (process.platform === 'win32') {
		opts.__winShell = true;
		file = process.env.comspec || 'cmd.exe';
		args = ['/s', '/c', `"${cmd}"`];
		opts.windowsVerbatimArguments = true;
	}

	if (opts.shell) {
		file = opts.shell;
		delete opts.shell;
	}

	return fn(file, args, opts);
}

function getStream(process, stream, {encoding, buffer, maxBuffer}) {
	if (!process[stream]) {
		return null;
	}

	let ret;

	if (!buffer) {
		// TODO: Use `ret = util.promisify(stream.finished)(process[stream]);` when targeting Node.js 10
		ret = new Promise((resolve, reject) => {
			process[stream]
				.once('end', resolve)
				.once('error', reject);
		});
	} else if (encoding) {
		ret = _getStream(process[stream], {
			encoding,
			maxBuffer
		});
	} else {
		ret = _getStream.buffer(process[stream], {maxBuffer});
	}

	return ret.catch(err => {
		err.stream = stream;
		err.message = `${stream} ${err.message}`;
		throw err;
	});
}

function makeError(result, options) {
	const {stdout, stderr} = result;

	let err = result.error;
	const {code, signal} = result;

	const {parsed, joinedCmd} = options;
	const timedOut = options.timedOut || false;

	if (!err) {
		let output = '';

		if (Array.isArray(parsed.opts.stdio)) {
			if (parsed.opts.stdio[2] !== 'inherit') {
				output += output.length > 0 ? stderr : `\n${stderr}`;
			}

			if (parsed.opts.stdio[1] !== 'inherit') {
				output += `\n${stdout}`;
			}
		} else if (parsed.opts.stdio !== 'inherit') {
			output = `\n${stderr}${stdout}`;
		}

		err = new Error(`Command failed: ${joinedCmd}${output}`);
		err.code = code < 0 ? errname(code) : code;
	}

	err.stdout = stdout;
	err.stderr = stderr;
	err.failed = true;
	err.signal = signal || null;
	err.cmd = joinedCmd;
	err.timedOut = timedOut;

	return err;
}

function joinCmd(cmd, args) {
	let joinedCmd = cmd;

	if (Array.isArray(args) && args.length > 0) {
		joinedCmd += ' ' + args.join(' ');
	}

	return joinedCmd;
}

module.exports = (cmd, args, opts) => {
	const parsed = handleArgs(cmd, args, opts);
	const {encoding, buffer, maxBuffer} = parsed.opts;
	const joinedCmd = joinCmd(cmd, args);

	let spawned;
	try {
		spawned = childProcess.spawn(parsed.cmd, parsed.args, parsed.opts);
	} catch (err) {
		return Promise.reject(err);
	}

	let removeExitHandler;
	if (parsed.opts.cleanup) {
		removeExitHandler = onExit(() => {
			spawned.kill();
		});
	}

	let timeoutId = null;
	let timedOut = false;

	const cleanup = () => {
		if (timeoutId) {
			clearTimeout(timeoutId);
			timeoutId = null;
		}

		if (removeExitHandler) {
			removeExitHandler();
		}
	};

	if (parsed.opts.timeout > 0) {
		timeoutId = setTimeout(() => {
			timeoutId = null;
			timedOut = true;
			spawned.kill(parsed.opts.killSignal);
		}, parsed.opts.timeout);
	}

	const processDone = new Promise(resolve => {
		spawned.on('exit', (code, signal) => {
			cleanup();
			resolve({code, signal});
		});

		spawned.on('error', err => {
			cleanup();
			resolve({error: err});
		});

		if (spawned.stdin) {
			spawned.stdin.on('error', err => {
				cleanup();
				resolve({error: err});
			});
		}
	});

	function destroy() {
		if (spawned.stdout) {
			spawned.stdout.destroy();
		}

		if (spawned.stderr) {
			spawned.stderr.destroy();
		}
	}

	const handlePromise = () => pFinally(Promise.all([
		processDone,
		getStream(spawned, 'stdout', {encoding, buffer, maxBuffer}),
		getStream(spawned, 'stderr', {encoding, buffer, maxBuffer})
	]).then(arr => {
		const result = arr[0];
		result.stdout = arr[1];
		result.stderr = arr[2];

		if (result.error || result.code !== 0 || result.signal !== null) {
			const err = makeError(result, {
				joinedCmd,
				parsed,
				timedOut
			});

			// TODO: missing some timeout logic for killed
			// https://github.com/nodejs/node/blob/master/lib/child_process.js#L203
			// err.killed = spawned.killed || killed;
			err.killed = err.killed || spawned.killed;

			if (!parsed.opts.reject) {
				return err;
			}

			throw err;
		}

		return {
			stdout: handleOutput(parsed.opts, result.stdout),
			stderr: handleOutput(parsed.opts, result.stderr),
			code: 0,
			failed: false,
			killed: false,
			signal: null,
			cmd: joinedCmd,
			timedOut: false
		};
	}), destroy);

	crossSpawn._enoent.hookChildProcess(spawned, parsed.parsed);

	handleInput(spawned, parsed.opts.input);

	spawned.then = (onfulfilled, onrejected) => handlePromise().then(onfulfilled, onrejected);
	spawned.catch = onrejected => handlePromise().catch(onrejected);

	return spawned;
};

// TODO: set `stderr: 'ignore'` when that option is implemented
module.exports.stdout = (...args) => module.exports(...args).then(x => x.stdout);

// TODO: set `stdout: 'ignore'` when that option is implemented
module.exports.stderr = (...args) => module.exports(...args).then(x => x.stderr);

module.exports.shell = (cmd, opts) => handleShell(module.exports, cmd, opts);

module.exports.sync = (cmd, args, opts) => {
	const parsed = handleArgs(cmd, args, opts);
	const joinedCmd = joinCmd(cmd, args);

	if (isStream(parsed.opts.input)) {
		throw new TypeError('The `input` option cannot be a stream in sync mode');
	}

	const result = childProcess.spawnSync(parsed.cmd, parsed.args, parsed.opts);
	result.code = result.status;

	if (result.error || result.status !== 0 || result.signal !== null) {
		const err = makeError(result, {
			joinedCmd,
			parsed
		});

		if (!parsed.opts.reject) {
			return err;
		}

		throw err;
	}

	return {
		stdout: handleOutput(parsed.opts, result.stdout),
		stderr: handleOutput(parsed.opts, result.stderr),
		code: 0,
		failed: false,
		signal: null,
		cmd: joinedCmd,
		timedOut: false
	};
};

module.exports.shellSync = (cmd, opts) => handleShell(module.exports.sync, cmd, opts);

}).call(this,require('_process'))
},{"./lib/errname":76,"./lib/stdio":77,"_process":137,"child_process":119,"cross-spawn":67,"get-stream":79,"is-stream":80,"npm-run-path":90,"p-finally":106,"path":135,"signal-exit":112,"strip-eof":114}],76:[function(require,module,exports){
(function (process){
'use strict';
// Older verions of Node.js might not have `util.getSystemErrorName()`.
// In that case, fall back to a deprecated internal.
const util = require('util');

let uv;

if (typeof util.getSystemErrorName === 'function') {
	module.exports = util.getSystemErrorName;
} else {
	try {
		uv = process.binding('uv');

		if (typeof uv.errname !== 'function') {
			throw new TypeError('uv.errname is not a function');
		}
	} catch (err) {
		console.error('execa/lib/errname: unable to establish process.binding(\'uv\')', err);
		uv = null;
	}

	module.exports = code => errname(uv, code);
}

// Used for testing the fallback behavior
module.exports.__test__ = errname;

function errname(uv, code) {
	if (uv) {
		return uv.errname(code);
	}

	if (!(code < 0)) {
		throw new Error('err >= 0');
	}

	return `Unknown system error ${code}`;
}


}).call(this,require('_process'))
},{"_process":137,"util":158}],77:[function(require,module,exports){
'use strict';
const alias = ['stdin', 'stdout', 'stderr'];

const hasAlias = opts => alias.some(x => Boolean(opts[x]));

module.exports = opts => {
	if (!opts) {
		return null;
	}

	if (opts.stdio && hasAlias(opts)) {
		throw new Error(`It's not possible to provide \`stdio\` in combination with one of ${alias.map(x => `\`${x}\``).join(', ')}`);
	}

	if (typeof opts.stdio === 'string') {
		return opts.stdio;
	}

	const stdio = opts.stdio || [];

	if (!Array.isArray(stdio)) {
		throw new TypeError(`Expected \`stdio\` to be of type \`string\` or \`Array\`, got \`${typeof stdio}\``);
	}

	const result = [];
	const len = Math.max(stdio.length, alias.length);

	for (let i = 0; i < len; i++) {
		let value = null;

		if (stdio[i] !== undefined) {
			value = stdio[i];
		} else if (opts[alias[i]] !== undefined) {
			value = opts[alias[i]];
		}

		result[i] = value;
	}

	return result;
};

},{}],78:[function(require,module,exports){
(function (Buffer){
'use strict';
const {PassThrough} = require('stream');

module.exports = options => {
	options = Object.assign({}, options);

	const {array} = options;
	let {encoding} = options;
	const buffer = encoding === 'buffer';
	let objectMode = false;

	if (array) {
		objectMode = !(encoding || buffer);
	} else {
		encoding = encoding || 'utf8';
	}

	if (buffer) {
		encoding = null;
	}

	let len = 0;
	const ret = [];
	const stream = new PassThrough({objectMode});

	if (encoding) {
		stream.setEncoding(encoding);
	}

	stream.on('data', chunk => {
		ret.push(chunk);

		if (objectMode) {
			len = ret.length;
		} else {
			len += chunk.length;
		}
	});

	stream.getBufferedValue = () => {
		if (array) {
			return ret;
		}

		return buffer ? Buffer.concat(ret, len) : ret.join('');
	};

	stream.getBufferedLength = () => len;

	return stream;
};

}).call(this,require("buffer").Buffer)
},{"buffer":126,"stream":153}],79:[function(require,module,exports){
'use strict';
const pump = require('pump');
const bufferStream = require('./buffer-stream');

class MaxBufferError extends Error {
	constructor() {
		super('maxBuffer exceeded');
		this.name = 'MaxBufferError';
	}
}

function getStream(inputStream, options) {
	if (!inputStream) {
		return Promise.reject(new Error('Expected a stream'));
	}

	options = Object.assign({maxBuffer: Infinity}, options);

	const {maxBuffer} = options;

	let stream;
	return new Promise((resolve, reject) => {
		const rejectPromise = error => {
			if (error) { // A null check
				error.bufferedData = stream.getBufferedValue();
			}
			reject(error);
		};

		stream = pump(inputStream, bufferStream(options), error => {
			if (error) {
				rejectPromise(error);
				return;
			}

			resolve();
		});

		stream.on('data', () => {
			if (stream.getBufferedLength() > maxBuffer) {
				rejectPromise(new MaxBufferError());
			}
		});
	}).then(() => stream.getBufferedValue());
}

module.exports = getStream;
module.exports.buffer = (stream, options) => getStream(stream, Object.assign({}, options, {encoding: 'buffer'}));
module.exports.array = (stream, options) => getStream(stream, Object.assign({}, options, {array: true}));
module.exports.MaxBufferError = MaxBufferError;

},{"./buffer-stream":78,"pump":108}],80:[function(require,module,exports){
'use strict';

var isStream = module.exports = function (stream) {
	return stream !== null && typeof stream === 'object' && typeof stream.pipe === 'function';
};

isStream.writable = function (stream) {
	return isStream(stream) && stream.writable !== false && typeof stream._write === 'function' && typeof stream._writableState === 'object';
};

isStream.readable = function (stream) {
	return isStream(stream) && stream.readable !== false && typeof stream._read === 'function' && typeof stream._readableState === 'object';
};

isStream.duplex = function (stream) {
	return isStream.writable(stream) && isStream.readable(stream);
};

isStream.transform = function (stream) {
	return isStream.duplex(stream) && typeof stream._transform === 'function' && typeof stream._transformState === 'object';
};

},{}],81:[function(require,module,exports){
(function (process,global){
var fs = require('fs')
var core
if (process.platform === 'win32' || global.TESTING_WINDOWS) {
  core = require('./windows.js')
} else {
  core = require('./mode.js')
}

module.exports = isexe
isexe.sync = sync

function isexe (path, options, cb) {
  if (typeof options === 'function') {
    cb = options
    options = {}
  }

  if (!cb) {
    if (typeof Promise !== 'function') {
      throw new TypeError('callback not provided')
    }

    return new Promise(function (resolve, reject) {
      isexe(path, options || {}, function (er, is) {
        if (er) {
          reject(er)
        } else {
          resolve(is)
        }
      })
    })
  }

  core(path, options || {}, function (er, is) {
    // ignore EACCES because that just means we aren't allowed to run it
    if (er) {
      if (er.code === 'EACCES' || options && options.ignoreErrors) {
        er = null
        is = false
      }
    }
    cb(er, is)
  })
}

function sync (path, options) {
  // my kingdom for a filtered catch
  try {
    return core.sync(path, options || {})
  } catch (er) {
    if (options && options.ignoreErrors || er.code === 'EACCES') {
      return false
    } else {
      throw er
    }
  }
}

}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./mode.js":82,"./windows.js":83,"_process":137,"fs":119}],82:[function(require,module,exports){
(function (process){
module.exports = isexe
isexe.sync = sync

var fs = require('fs')

function isexe (path, options, cb) {
  fs.stat(path, function (er, stat) {
    cb(er, er ? false : checkStat(stat, options))
  })
}

function sync (path, options) {
  return checkStat(fs.statSync(path), options)
}

function checkStat (stat, options) {
  return stat.isFile() && checkMode(stat, options)
}

function checkMode (stat, options) {
  var mod = stat.mode
  var uid = stat.uid
  var gid = stat.gid

  var myUid = options.uid !== undefined ?
    options.uid : process.getuid && process.getuid()
  var myGid = options.gid !== undefined ?
    options.gid : process.getgid && process.getgid()

  var u = parseInt('100', 8)
  var g = parseInt('010', 8)
  var o = parseInt('001', 8)
  var ug = u | g

  var ret = (mod & o) ||
    (mod & g) && gid === myGid ||
    (mod & u) && uid === myUid ||
    (mod & ug) && myUid === 0

  return ret
}

}).call(this,require('_process'))
},{"_process":137,"fs":119}],83:[function(require,module,exports){
(function (process){
module.exports = isexe
isexe.sync = sync

var fs = require('fs')

function checkPathExt (path, options) {
  var pathext = options.pathExt !== undefined ?
    options.pathExt : process.env.PATHEXT

  if (!pathext) {
    return true
  }

  pathext = pathext.split(';')
  if (pathext.indexOf('') !== -1) {
    return true
  }
  for (var i = 0; i < pathext.length; i++) {
    var p = pathext[i].toLowerCase()
    if (p && path.substr(-p.length).toLowerCase() === p) {
      return true
    }
  }
  return false
}

function checkStat (stat, path, options) {
  if (!stat.isSymbolicLink() && !stat.isFile()) {
    return false
  }
  return checkPathExt(path, options)
}

function isexe (path, options, cb) {
  fs.stat(path, function (er, stat) {
    cb(er, er ? false : checkStat(stat, path, options))
  })
}

function sync (path, options) {
  return checkStat(fs.statSync(path), path, options)
}

}).call(this,require('_process'))
},{"_process":137,"fs":119}],84:[function(require,module,exports){
(function (global){
/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as the `TypeError` message for "Functions" methods. */
var FUNC_ERROR_TEXT = 'Expected a function';

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0;

/** `Object#toString` result references. */
var funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    symbolTag = '[object Symbol]';

/** Used to match property names within property paths. */
var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
    reIsPlainProp = /^\w*$/,
    reLeadingDot = /^\./,
    rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to match backslashes in property paths. */
var reEscapeChar = /\\(\\)?/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue(object, key) {
  return object == null ? undefined : object[key];
}

/**
 * Checks if `value` is a host object in IE < 9.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a host object, else `false`.
 */
function isHostObject(value) {
  // Many host objects are `Object` objects that can coerce to strings
  // despite having improperly defined `toString` methods.
  var result = false;
  if (value != null && typeof value.toString != 'function') {
    try {
      result = !!(value + '');
    } catch (e) {}
  }
  return result;
}

/** Used for built-in method references. */
var arrayProto = Array.prototype,
    funcProto = Function.prototype,
    objectProto = Object.prototype;

/** Used to detect overreaching core-js shims. */
var coreJsData = root['__core-js_shared__'];

/** Used to detect methods masquerading as native. */
var maskSrcKey = (function() {
  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
  return uid ? ('Symbol(src)_1.' + uid) : '';
}());

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/** Built-in value references. */
var Symbol = root.Symbol,
    splice = arrayProto.splice;

/* Built-in method references that are verified to be native. */
var Map = getNative(root, 'Map'),
    nativeCreate = getNative(Object, 'create');

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol ? Symbol.prototype : undefined,
    symbolToString = symbolProto ? symbolProto.toString : undefined;

/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Hash(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */
function hashClear() {
  this.__data__ = nativeCreate ? nativeCreate(null) : {};
}

/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function hashDelete(key) {
  return this.has(key) && delete this.__data__[key];
}

/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function hashGet(key) {
  var data = this.__data__;
  if (nativeCreate) {
    var result = data[key];
    return result === HASH_UNDEFINED ? undefined : result;
  }
  return hasOwnProperty.call(data, key) ? data[key] : undefined;
}

/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function hashHas(key) {
  var data = this.__data__;
  return nativeCreate ? data[key] !== undefined : hasOwnProperty.call(data, key);
}

/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */
function hashSet(key, value) {
  var data = this.__data__;
  data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
  return this;
}

// Add methods to `Hash`.
Hash.prototype.clear = hashClear;
Hash.prototype['delete'] = hashDelete;
Hash.prototype.get = hashGet;
Hash.prototype.has = hashHas;
Hash.prototype.set = hashSet;

/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function ListCache(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */
function listCacheClear() {
  this.__data__ = [];
}

/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function listCacheDelete(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }
  return true;
}

/**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function listCacheGet(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  return index < 0 ? undefined : data[index][1];
}

/**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function listCacheHas(key) {
  return assocIndexOf(this.__data__, key) > -1;
}

/**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */
function listCacheSet(key, value) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}

// Add methods to `ListCache`.
ListCache.prototype.clear = listCacheClear;
ListCache.prototype['delete'] = listCacheDelete;
ListCache.prototype.get = listCacheGet;
ListCache.prototype.has = listCacheHas;
ListCache.prototype.set = listCacheSet;

/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function MapCache(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */
function mapCacheClear() {
  this.__data__ = {
    'hash': new Hash,
    'map': new (Map || ListCache),
    'string': new Hash
  };
}

/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function mapCacheDelete(key) {
  return getMapData(this, key)['delete'](key);
}

/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function mapCacheGet(key) {
  return getMapData(this, key).get(key);
}

/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function mapCacheHas(key) {
  return getMapData(this, key).has(key);
}

/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */
function mapCacheSet(key, value) {
  getMapData(this, key).set(key, value);
  return this;
}

// Add methods to `MapCache`.
MapCache.prototype.clear = mapCacheClear;
MapCache.prototype['delete'] = mapCacheDelete;
MapCache.prototype.get = mapCacheGet;
MapCache.prototype.has = mapCacheHas;
MapCache.prototype.set = mapCacheSet;

/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function assocIndexOf(array, key) {
  var length = array.length;
  while (length--) {
    if (eq(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}

/**
 * The base implementation of `_.get` without support for default values.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @returns {*} Returns the resolved value.
 */
function baseGet(object, path) {
  path = isKey(path, object) ? [path] : castPath(path);

  var index = 0,
      length = path.length;

  while (object != null && index < length) {
    object = object[toKey(path[index++])];
  }
  return (index && index == length) ? object : undefined;
}

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative(value) {
  if (!isObject(value) || isMasked(value)) {
    return false;
  }
  var pattern = (isFunction(value) || isHostObject(value)) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource(value));
}

/**
 * The base implementation of `_.toString` which doesn't convert nullish
 * values to empty strings.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 */
function baseToString(value) {
  // Exit early for strings to avoid a performance hit in some environments.
  if (typeof value == 'string') {
    return value;
  }
  if (isSymbol(value)) {
    return symbolToString ? symbolToString.call(value) : '';
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

/**
 * Casts `value` to a path array if it's not one.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {Array} Returns the cast property path array.
 */
function castPath(value) {
  return isArray(value) ? value : stringToPath(value);
}

/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */
function getMapData(map, key) {
  var data = map.__data__;
  return isKeyable(key)
    ? data[typeof key == 'string' ? 'string' : 'hash']
    : data.map;
}

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = getValue(object, key);
  return baseIsNative(value) ? value : undefined;
}

/**
 * Checks if `value` is a property name and not a property path.
 *
 * @private
 * @param {*} value The value to check.
 * @param {Object} [object] The object to query keys on.
 * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
 */
function isKey(value, object) {
  if (isArray(value)) {
    return false;
  }
  var type = typeof value;
  if (type == 'number' || type == 'symbol' || type == 'boolean' ||
      value == null || isSymbol(value)) {
    return true;
  }
  return reIsPlainProp.test(value) || !reIsDeepProp.test(value) ||
    (object != null && value in Object(object));
}

/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
function isKeyable(value) {
  var type = typeof value;
  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
    ? (value !== '__proto__')
    : (value === null);
}

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked(func) {
  return !!maskSrcKey && (maskSrcKey in func);
}

/**
 * Converts `string` to a property path array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the property path array.
 */
var stringToPath = memoize(function(string) {
  string = toString(string);

  var result = [];
  if (reLeadingDot.test(string)) {
    result.push('');
  }
  string.replace(rePropName, function(match, number, quote, string) {
    result.push(quote ? string.replace(reEscapeChar, '$1') : (number || match));
  });
  return result;
});

/**
 * Converts `value` to a string key if it's not a string or symbol.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {string|symbol} Returns the key.
 */
function toKey(value) {
  if (typeof value == 'string' || isSymbol(value)) {
    return value;
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to process.
 * @returns {string} Returns the source code.
 */
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {}
    try {
      return (func + '');
    } catch (e) {}
  }
  return '';
}

/**
 * Creates a function that memoizes the result of `func`. If `resolver` is
 * provided, it determines the cache key for storing the result based on the
 * arguments provided to the memoized function. By default, the first argument
 * provided to the memoized function is used as the map cache key. The `func`
 * is invoked with the `this` binding of the memoized function.
 *
 * **Note:** The cache is exposed as the `cache` property on the memoized
 * function. Its creation may be customized by replacing the `_.memoize.Cache`
 * constructor with one whose instances implement the
 * [`Map`](http://ecma-international.org/ecma-262/7.0/#sec-properties-of-the-map-prototype-object)
 * method interface of `delete`, `get`, `has`, and `set`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to have its output memoized.
 * @param {Function} [resolver] The function to resolve the cache key.
 * @returns {Function} Returns the new memoized function.
 * @example
 *
 * var object = { 'a': 1, 'b': 2 };
 * var other = { 'c': 3, 'd': 4 };
 *
 * var values = _.memoize(_.values);
 * values(object);
 * // => [1, 2]
 *
 * values(other);
 * // => [3, 4]
 *
 * object.a = 2;
 * values(object);
 * // => [1, 2]
 *
 * // Modify the result cache.
 * values.cache.set(object, ['a', 'b']);
 * values(object);
 * // => ['a', 'b']
 *
 * // Replace `_.memoize.Cache`.
 * _.memoize.Cache = WeakMap;
 */
function memoize(func, resolver) {
  if (typeof func != 'function' || (resolver && typeof resolver != 'function')) {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  var memoized = function() {
    var args = arguments,
        key = resolver ? resolver.apply(this, args) : args[0],
        cache = memoized.cache;

    if (cache.has(key)) {
      return cache.get(key);
    }
    var result = func.apply(this, args);
    memoized.cache = cache.set(key, result);
    return result;
  };
  memoized.cache = new (memoize.Cache || MapCache);
  return memoized;
}

// Assign cache to `_.memoize`.
memoize.Cache = MapCache;

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  return value === other || (value !== value && other !== other);
}

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 8-9 which returns 'object' for typed array and other constructors.
  var tag = isObject(value) ? objectToString.call(value) : '';
  return tag == funcTag || tag == genTag;
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && objectToString.call(value) == symbolTag);
}

/**
 * Converts `value` to a string. An empty string is returned for `null`
 * and `undefined` values. The sign of `-0` is preserved.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 * @example
 *
 * _.toString(null);
 * // => ''
 *
 * _.toString(-0);
 * // => '-0'
 *
 * _.toString([1, 2, 3]);
 * // => '1,2,3'
 */
function toString(value) {
  return value == null ? '' : baseToString(value);
}

/**
 * Gets the value at `path` of `object`. If the resolved value is
 * `undefined`, the `defaultValue` is returned in its place.
 *
 * @static
 * @memberOf _
 * @since 3.7.0
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @param {*} [defaultValue] The value returned for `undefined` resolved values.
 * @returns {*} Returns the resolved value.
 * @example
 *
 * var object = { 'a': [{ 'b': { 'c': 3 } }] };
 *
 * _.get(object, 'a[0].b.c');
 * // => 3
 *
 * _.get(object, ['a', '0', 'b', 'c']);
 * // => 3
 *
 * _.get(object, 'a.b.c', 'default');
 * // => 'default'
 */
function get(object, path, defaultValue) {
  var result = object == null ? undefined : baseGet(object, path);
  return result === undefined ? defaultValue : result;
}

module.exports = get;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],85:[function(require,module,exports){
(function (global){
/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as the `TypeError` message for "Functions" methods. */
var FUNC_ERROR_TEXT = 'Expected a function';

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0,
    MAX_SAFE_INTEGER = 9007199254740991;

/** `Object#toString` result references. */
var funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    symbolTag = '[object Symbol]';

/** Used to match property names within property paths. */
var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
    reIsPlainProp = /^\w*$/,
    reLeadingDot = /^\./,
    rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to match backslashes in property paths. */
var reEscapeChar = /\\(\\)?/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue(object, key) {
  return object == null ? undefined : object[key];
}

/**
 * Checks if `value` is a host object in IE < 9.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a host object, else `false`.
 */
function isHostObject(value) {
  // Many host objects are `Object` objects that can coerce to strings
  // despite having improperly defined `toString` methods.
  var result = false;
  if (value != null && typeof value.toString != 'function') {
    try {
      result = !!(value + '');
    } catch (e) {}
  }
  return result;
}

/** Used for built-in method references. */
var arrayProto = Array.prototype,
    funcProto = Function.prototype,
    objectProto = Object.prototype;

/** Used to detect overreaching core-js shims. */
var coreJsData = root['__core-js_shared__'];

/** Used to detect methods masquerading as native. */
var maskSrcKey = (function() {
  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
  return uid ? ('Symbol(src)_1.' + uid) : '';
}());

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/** Built-in value references. */
var Symbol = root.Symbol,
    splice = arrayProto.splice;

/* Built-in method references that are verified to be native. */
var Map = getNative(root, 'Map'),
    nativeCreate = getNative(Object, 'create');

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol ? Symbol.prototype : undefined,
    symbolToString = symbolProto ? symbolProto.toString : undefined;

/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Hash(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */
function hashClear() {
  this.__data__ = nativeCreate ? nativeCreate(null) : {};
}

/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function hashDelete(key) {
  return this.has(key) && delete this.__data__[key];
}

/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function hashGet(key) {
  var data = this.__data__;
  if (nativeCreate) {
    var result = data[key];
    return result === HASH_UNDEFINED ? undefined : result;
  }
  return hasOwnProperty.call(data, key) ? data[key] : undefined;
}

/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function hashHas(key) {
  var data = this.__data__;
  return nativeCreate ? data[key] !== undefined : hasOwnProperty.call(data, key);
}

/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */
function hashSet(key, value) {
  var data = this.__data__;
  data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
  return this;
}

// Add methods to `Hash`.
Hash.prototype.clear = hashClear;
Hash.prototype['delete'] = hashDelete;
Hash.prototype.get = hashGet;
Hash.prototype.has = hashHas;
Hash.prototype.set = hashSet;

/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function ListCache(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */
function listCacheClear() {
  this.__data__ = [];
}

/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function listCacheDelete(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }
  return true;
}

/**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function listCacheGet(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  return index < 0 ? undefined : data[index][1];
}

/**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function listCacheHas(key) {
  return assocIndexOf(this.__data__, key) > -1;
}

/**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */
function listCacheSet(key, value) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}

// Add methods to `ListCache`.
ListCache.prototype.clear = listCacheClear;
ListCache.prototype['delete'] = listCacheDelete;
ListCache.prototype.get = listCacheGet;
ListCache.prototype.has = listCacheHas;
ListCache.prototype.set = listCacheSet;

/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function MapCache(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */
function mapCacheClear() {
  this.__data__ = {
    'hash': new Hash,
    'map': new (Map || ListCache),
    'string': new Hash
  };
}

/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function mapCacheDelete(key) {
  return getMapData(this, key)['delete'](key);
}

/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function mapCacheGet(key) {
  return getMapData(this, key).get(key);
}

/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function mapCacheHas(key) {
  return getMapData(this, key).has(key);
}

/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */
function mapCacheSet(key, value) {
  getMapData(this, key).set(key, value);
  return this;
}

// Add methods to `MapCache`.
MapCache.prototype.clear = mapCacheClear;
MapCache.prototype['delete'] = mapCacheDelete;
MapCache.prototype.get = mapCacheGet;
MapCache.prototype.has = mapCacheHas;
MapCache.prototype.set = mapCacheSet;

/**
 * Assigns `value` to `key` of `object` if the existing value is not equivalent
 * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function assignValue(object, key, value) {
  var objValue = object[key];
  if (!(hasOwnProperty.call(object, key) && eq(objValue, value)) ||
      (value === undefined && !(key in object))) {
    object[key] = value;
  }
}

/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function assocIndexOf(array, key) {
  var length = array.length;
  while (length--) {
    if (eq(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative(value) {
  if (!isObject(value) || isMasked(value)) {
    return false;
  }
  var pattern = (isFunction(value) || isHostObject(value)) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource(value));
}

/**
 * The base implementation of `_.set`.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {Array|string} path The path of the property to set.
 * @param {*} value The value to set.
 * @param {Function} [customizer] The function to customize path creation.
 * @returns {Object} Returns `object`.
 */
function baseSet(object, path, value, customizer) {
  if (!isObject(object)) {
    return object;
  }
  path = isKey(path, object) ? [path] : castPath(path);

  var index = -1,
      length = path.length,
      lastIndex = length - 1,
      nested = object;

  while (nested != null && ++index < length) {
    var key = toKey(path[index]),
        newValue = value;

    if (index != lastIndex) {
      var objValue = nested[key];
      newValue = customizer ? customizer(objValue, key, nested) : undefined;
      if (newValue === undefined) {
        newValue = isObject(objValue)
          ? objValue
          : (isIndex(path[index + 1]) ? [] : {});
      }
    }
    assignValue(nested, key, newValue);
    nested = nested[key];
  }
  return object;
}

/**
 * The base implementation of `_.toString` which doesn't convert nullish
 * values to empty strings.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 */
function baseToString(value) {
  // Exit early for strings to avoid a performance hit in some environments.
  if (typeof value == 'string') {
    return value;
  }
  if (isSymbol(value)) {
    return symbolToString ? symbolToString.call(value) : '';
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

/**
 * Casts `value` to a path array if it's not one.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {Array} Returns the cast property path array.
 */
function castPath(value) {
  return isArray(value) ? value : stringToPath(value);
}

/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */
function getMapData(map, key) {
  var data = map.__data__;
  return isKeyable(key)
    ? data[typeof key == 'string' ? 'string' : 'hash']
    : data.map;
}

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = getValue(object, key);
  return baseIsNative(value) ? value : undefined;
}

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  length = length == null ? MAX_SAFE_INTEGER : length;
  return !!length &&
    (typeof value == 'number' || reIsUint.test(value)) &&
    (value > -1 && value % 1 == 0 && value < length);
}

/**
 * Checks if `value` is a property name and not a property path.
 *
 * @private
 * @param {*} value The value to check.
 * @param {Object} [object] The object to query keys on.
 * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
 */
function isKey(value, object) {
  if (isArray(value)) {
    return false;
  }
  var type = typeof value;
  if (type == 'number' || type == 'symbol' || type == 'boolean' ||
      value == null || isSymbol(value)) {
    return true;
  }
  return reIsPlainProp.test(value) || !reIsDeepProp.test(value) ||
    (object != null && value in Object(object));
}

/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
function isKeyable(value) {
  var type = typeof value;
  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
    ? (value !== '__proto__')
    : (value === null);
}

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked(func) {
  return !!maskSrcKey && (maskSrcKey in func);
}

/**
 * Converts `string` to a property path array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the property path array.
 */
var stringToPath = memoize(function(string) {
  string = toString(string);

  var result = [];
  if (reLeadingDot.test(string)) {
    result.push('');
  }
  string.replace(rePropName, function(match, number, quote, string) {
    result.push(quote ? string.replace(reEscapeChar, '$1') : (number || match));
  });
  return result;
});

/**
 * Converts `value` to a string key if it's not a string or symbol.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {string|symbol} Returns the key.
 */
function toKey(value) {
  if (typeof value == 'string' || isSymbol(value)) {
    return value;
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to process.
 * @returns {string} Returns the source code.
 */
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {}
    try {
      return (func + '');
    } catch (e) {}
  }
  return '';
}

/**
 * Creates a function that memoizes the result of `func`. If `resolver` is
 * provided, it determines the cache key for storing the result based on the
 * arguments provided to the memoized function. By default, the first argument
 * provided to the memoized function is used as the map cache key. The `func`
 * is invoked with the `this` binding of the memoized function.
 *
 * **Note:** The cache is exposed as the `cache` property on the memoized
 * function. Its creation may be customized by replacing the `_.memoize.Cache`
 * constructor with one whose instances implement the
 * [`Map`](http://ecma-international.org/ecma-262/7.0/#sec-properties-of-the-map-prototype-object)
 * method interface of `delete`, `get`, `has`, and `set`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to have its output memoized.
 * @param {Function} [resolver] The function to resolve the cache key.
 * @returns {Function} Returns the new memoized function.
 * @example
 *
 * var object = { 'a': 1, 'b': 2 };
 * var other = { 'c': 3, 'd': 4 };
 *
 * var values = _.memoize(_.values);
 * values(object);
 * // => [1, 2]
 *
 * values(other);
 * // => [3, 4]
 *
 * object.a = 2;
 * values(object);
 * // => [1, 2]
 *
 * // Modify the result cache.
 * values.cache.set(object, ['a', 'b']);
 * values(object);
 * // => ['a', 'b']
 *
 * // Replace `_.memoize.Cache`.
 * _.memoize.Cache = WeakMap;
 */
function memoize(func, resolver) {
  if (typeof func != 'function' || (resolver && typeof resolver != 'function')) {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  var memoized = function() {
    var args = arguments,
        key = resolver ? resolver.apply(this, args) : args[0],
        cache = memoized.cache;

    if (cache.has(key)) {
      return cache.get(key);
    }
    var result = func.apply(this, args);
    memoized.cache = cache.set(key, result);
    return result;
  };
  memoized.cache = new (memoize.Cache || MapCache);
  return memoized;
}

// Assign cache to `_.memoize`.
memoize.Cache = MapCache;

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  return value === other || (value !== value && other !== other);
}

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 8-9 which returns 'object' for typed array and other constructors.
  var tag = isObject(value) ? objectToString.call(value) : '';
  return tag == funcTag || tag == genTag;
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && objectToString.call(value) == symbolTag);
}

/**
 * Converts `value` to a string. An empty string is returned for `null`
 * and `undefined` values. The sign of `-0` is preserved.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 * @example
 *
 * _.toString(null);
 * // => ''
 *
 * _.toString(-0);
 * // => '-0'
 *
 * _.toString([1, 2, 3]);
 * // => '1,2,3'
 */
function toString(value) {
  return value == null ? '' : baseToString(value);
}

/**
 * Sets the value at `path` of `object`. If a portion of `path` doesn't exist,
 * it's created. Arrays are created for missing index properties while objects
 * are created for all other missing properties. Use `_.setWith` to customize
 * `path` creation.
 *
 * **Note:** This method mutates `object`.
 *
 * @static
 * @memberOf _
 * @since 3.7.0
 * @category Object
 * @param {Object} object The object to modify.
 * @param {Array|string} path The path of the property to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns `object`.
 * @example
 *
 * var object = { 'a': [{ 'b': { 'c': 3 } }] };
 *
 * _.set(object, 'a[0].b.c', 4);
 * console.log(object.a[0].b.c);
 * // => 4
 *
 * _.set(object, ['x', '0', 'y', 'z'], 5);
 * console.log(object.x[0].y.z);
 * // => 5
 */
function set(object, path, value) {
  return object == null ? object : baseSet(object, path, value);
}

module.exports = set;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],86:[function(require,module,exports){
(function (global){
/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE = 200;

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0;

/** `Object#toString` result references. */
var funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]';

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/**
 * A specialized version of `_.includes` for arrays without support for
 * specifying an index to search from.
 *
 * @private
 * @param {Array} [array] The array to inspect.
 * @param {*} target The value to search for.
 * @returns {boolean} Returns `true` if `target` is found, else `false`.
 */
function arrayIncludes(array, value) {
  var length = array ? array.length : 0;
  return !!length && baseIndexOf(array, value, 0) > -1;
}

/**
 * This function is like `arrayIncludes` except that it accepts a comparator.
 *
 * @private
 * @param {Array} [array] The array to inspect.
 * @param {*} target The value to search for.
 * @param {Function} comparator The comparator invoked per element.
 * @returns {boolean} Returns `true` if `target` is found, else `false`.
 */
function arrayIncludesWith(array, value, comparator) {
  var index = -1,
      length = array ? array.length : 0;

  while (++index < length) {
    if (comparator(value, array[index])) {
      return true;
    }
  }
  return false;
}

/**
 * The base implementation of `_.findIndex` and `_.findLastIndex` without
 * support for iteratee shorthands.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {Function} predicate The function invoked per iteration.
 * @param {number} fromIndex The index to search from.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function baseFindIndex(array, predicate, fromIndex, fromRight) {
  var length = array.length,
      index = fromIndex + (fromRight ? 1 : -1);

  while ((fromRight ? index-- : ++index < length)) {
    if (predicate(array[index], index, array)) {
      return index;
    }
  }
  return -1;
}

/**
 * The base implementation of `_.indexOf` without `fromIndex` bounds checks.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} value The value to search for.
 * @param {number} fromIndex The index to search from.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function baseIndexOf(array, value, fromIndex) {
  if (value !== value) {
    return baseFindIndex(array, baseIsNaN, fromIndex);
  }
  var index = fromIndex - 1,
      length = array.length;

  while (++index < length) {
    if (array[index] === value) {
      return index;
    }
  }
  return -1;
}

/**
 * The base implementation of `_.isNaN` without support for number objects.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is `NaN`, else `false`.
 */
function baseIsNaN(value) {
  return value !== value;
}

/**
 * Checks if a cache value for `key` exists.
 *
 * @private
 * @param {Object} cache The cache to query.
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function cacheHas(cache, key) {
  return cache.has(key);
}

/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue(object, key) {
  return object == null ? undefined : object[key];
}

/**
 * Checks if `value` is a host object in IE < 9.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a host object, else `false`.
 */
function isHostObject(value) {
  // Many host objects are `Object` objects that can coerce to strings
  // despite having improperly defined `toString` methods.
  var result = false;
  if (value != null && typeof value.toString != 'function') {
    try {
      result = !!(value + '');
    } catch (e) {}
  }
  return result;
}

/**
 * Converts `set` to an array of its values.
 *
 * @private
 * @param {Object} set The set to convert.
 * @returns {Array} Returns the values.
 */
function setToArray(set) {
  var index = -1,
      result = Array(set.size);

  set.forEach(function(value) {
    result[++index] = value;
  });
  return result;
}

/** Used for built-in method references. */
var arrayProto = Array.prototype,
    funcProto = Function.prototype,
    objectProto = Object.prototype;

/** Used to detect overreaching core-js shims. */
var coreJsData = root['__core-js_shared__'];

/** Used to detect methods masquerading as native. */
var maskSrcKey = (function() {
  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
  return uid ? ('Symbol(src)_1.' + uid) : '';
}());

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/** Built-in value references. */
var splice = arrayProto.splice;

/* Built-in method references that are verified to be native. */
var Map = getNative(root, 'Map'),
    Set = getNative(root, 'Set'),
    nativeCreate = getNative(Object, 'create');

/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Hash(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */
function hashClear() {
  this.__data__ = nativeCreate ? nativeCreate(null) : {};
}

/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function hashDelete(key) {
  return this.has(key) && delete this.__data__[key];
}

/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function hashGet(key) {
  var data = this.__data__;
  if (nativeCreate) {
    var result = data[key];
    return result === HASH_UNDEFINED ? undefined : result;
  }
  return hasOwnProperty.call(data, key) ? data[key] : undefined;
}

/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function hashHas(key) {
  var data = this.__data__;
  return nativeCreate ? data[key] !== undefined : hasOwnProperty.call(data, key);
}

/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */
function hashSet(key, value) {
  var data = this.__data__;
  data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
  return this;
}

// Add methods to `Hash`.
Hash.prototype.clear = hashClear;
Hash.prototype['delete'] = hashDelete;
Hash.prototype.get = hashGet;
Hash.prototype.has = hashHas;
Hash.prototype.set = hashSet;

/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function ListCache(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */
function listCacheClear() {
  this.__data__ = [];
}

/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function listCacheDelete(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }
  return true;
}

/**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function listCacheGet(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  return index < 0 ? undefined : data[index][1];
}

/**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function listCacheHas(key) {
  return assocIndexOf(this.__data__, key) > -1;
}

/**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */
function listCacheSet(key, value) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}

// Add methods to `ListCache`.
ListCache.prototype.clear = listCacheClear;
ListCache.prototype['delete'] = listCacheDelete;
ListCache.prototype.get = listCacheGet;
ListCache.prototype.has = listCacheHas;
ListCache.prototype.set = listCacheSet;

/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function MapCache(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */
function mapCacheClear() {
  this.__data__ = {
    'hash': new Hash,
    'map': new (Map || ListCache),
    'string': new Hash
  };
}

/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function mapCacheDelete(key) {
  return getMapData(this, key)['delete'](key);
}

/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function mapCacheGet(key) {
  return getMapData(this, key).get(key);
}

/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function mapCacheHas(key) {
  return getMapData(this, key).has(key);
}

/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */
function mapCacheSet(key, value) {
  getMapData(this, key).set(key, value);
  return this;
}

// Add methods to `MapCache`.
MapCache.prototype.clear = mapCacheClear;
MapCache.prototype['delete'] = mapCacheDelete;
MapCache.prototype.get = mapCacheGet;
MapCache.prototype.has = mapCacheHas;
MapCache.prototype.set = mapCacheSet;

/**
 *
 * Creates an array cache object to store unique values.
 *
 * @private
 * @constructor
 * @param {Array} [values] The values to cache.
 */
function SetCache(values) {
  var index = -1,
      length = values ? values.length : 0;

  this.__data__ = new MapCache;
  while (++index < length) {
    this.add(values[index]);
  }
}

/**
 * Adds `value` to the array cache.
 *
 * @private
 * @name add
 * @memberOf SetCache
 * @alias push
 * @param {*} value The value to cache.
 * @returns {Object} Returns the cache instance.
 */
function setCacheAdd(value) {
  this.__data__.set(value, HASH_UNDEFINED);
  return this;
}

/**
 * Checks if `value` is in the array cache.
 *
 * @private
 * @name has
 * @memberOf SetCache
 * @param {*} value The value to search for.
 * @returns {number} Returns `true` if `value` is found, else `false`.
 */
function setCacheHas(value) {
  return this.__data__.has(value);
}

// Add methods to `SetCache`.
SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
SetCache.prototype.has = setCacheHas;

/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function assocIndexOf(array, key) {
  var length = array.length;
  while (length--) {
    if (eq(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative(value) {
  if (!isObject(value) || isMasked(value)) {
    return false;
  }
  var pattern = (isFunction(value) || isHostObject(value)) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource(value));
}

/**
 * The base implementation of `_.uniqBy` without support for iteratee shorthands.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {Function} [iteratee] The iteratee invoked per element.
 * @param {Function} [comparator] The comparator invoked per element.
 * @returns {Array} Returns the new duplicate free array.
 */
function baseUniq(array, iteratee, comparator) {
  var index = -1,
      includes = arrayIncludes,
      length = array.length,
      isCommon = true,
      result = [],
      seen = result;

  if (comparator) {
    isCommon = false;
    includes = arrayIncludesWith;
  }
  else if (length >= LARGE_ARRAY_SIZE) {
    var set = iteratee ? null : createSet(array);
    if (set) {
      return setToArray(set);
    }
    isCommon = false;
    includes = cacheHas;
    seen = new SetCache;
  }
  else {
    seen = iteratee ? [] : result;
  }
  outer:
  while (++index < length) {
    var value = array[index],
        computed = iteratee ? iteratee(value) : value;

    value = (comparator || value !== 0) ? value : 0;
    if (isCommon && computed === computed) {
      var seenIndex = seen.length;
      while (seenIndex--) {
        if (seen[seenIndex] === computed) {
          continue outer;
        }
      }
      if (iteratee) {
        seen.push(computed);
      }
      result.push(value);
    }
    else if (!includes(seen, computed, comparator)) {
      if (seen !== result) {
        seen.push(computed);
      }
      result.push(value);
    }
  }
  return result;
}

/**
 * Creates a set object of `values`.
 *
 * @private
 * @param {Array} values The values to add to the set.
 * @returns {Object} Returns the new set.
 */
var createSet = !(Set && (1 / setToArray(new Set([,-0]))[1]) == INFINITY) ? noop : function(values) {
  return new Set(values);
};

/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */
function getMapData(map, key) {
  var data = map.__data__;
  return isKeyable(key)
    ? data[typeof key == 'string' ? 'string' : 'hash']
    : data.map;
}

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = getValue(object, key);
  return baseIsNative(value) ? value : undefined;
}

/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
function isKeyable(value) {
  var type = typeof value;
  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
    ? (value !== '__proto__')
    : (value === null);
}

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked(func) {
  return !!maskSrcKey && (maskSrcKey in func);
}

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to process.
 * @returns {string} Returns the source code.
 */
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {}
    try {
      return (func + '');
    } catch (e) {}
  }
  return '';
}

/**
 * Creates a duplicate-free version of an array, using
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons, in which only the first occurrence of each
 * element is kept.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {Array} array The array to inspect.
 * @returns {Array} Returns the new duplicate free array.
 * @example
 *
 * _.uniq([2, 1, 2]);
 * // => [2, 1]
 */
function uniq(array) {
  return (array && array.length)
    ? baseUniq(array)
    : [];
}

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  return value === other || (value !== value && other !== other);
}

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 8-9 which returns 'object' for typed array and other constructors.
  var tag = isObject(value) ? objectToString.call(value) : '';
  return tag == funcTag || tag == genTag;
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * This method returns `undefined`.
 *
 * @static
 * @memberOf _
 * @since 2.3.0
 * @category Util
 * @example
 *
 * _.times(2, _.noop);
 * // => [undefined, undefined]
 */
function noop() {
  // No operation performed.
}

module.exports = uniq;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],87:[function(require,module,exports){
'use strict';
const os = require('os');

const nameMap = new Map([
	[19, 'Catalina'],
	[18, 'Mojave'],
	[17, 'High Sierra'],
	[16, 'Sierra'],
	[15, 'El Capitan'],
	[14, 'Yosemite'],
	[13, 'Mavericks'],
	[12, 'Mountain Lion'],
	[11, 'Lion'],
	[10, 'Snow Leopard'],
	[9, 'Leopard'],
	[8, 'Tiger'],
	[7, 'Panther'],
	[6, 'Jaguar'],
	[5, 'Puma']
]);

const macosRelease = release => {
	release = Number((release || os.release()).split('.')[0]);
	return {
		name: nameMap.get(release),
		version: '10.' + (release - 4)
	};
};

module.exports = macosRelease;
// TODO: remove this in the next major version
module.exports.default = macosRelease;

},{"os":134}],88:[function(require,module,exports){
'use strict'

/**
 * Tries to execute a function and discards any error that occurs.
 * @param {Function} fn - Function that might or might not throw an error.
 * @returns {?*} Return-value of the function when no error occurred.
 */
module.exports = function(fn) {

	try { return fn() } catch (e) {}

}
},{}],89:[function(require,module,exports){
(function (global){
"use strict";

// ref: https://github.com/tc39/proposal-global
var getGlobal = function () {
	// the only reliable means to get the global object is
	// `Function('return this')()`
	// However, this causes CSP violations in Chrome apps.
	if (typeof self !== 'undefined') { return self; }
	if (typeof window !== 'undefined') { return window; }
	if (typeof global !== 'undefined') { return global; }
	throw new Error('unable to locate global object');
}

var global = getGlobal();

module.exports = exports = global.fetch;

// Needed for TypeScript and Webpack.
exports.default = global.fetch.bind(global);

exports.Headers = global.Headers;
exports.Request = global.Request;
exports.Response = global.Response;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],90:[function(require,module,exports){
(function (process){
'use strict';
const path = require('path');
const pathKey = require('path-key');

module.exports = opts => {
	opts = Object.assign({
		cwd: process.cwd(),
		path: process.env[pathKey()]
	}, opts);

	let prev;
	let pth = path.resolve(opts.cwd);
	const ret = [];

	while (prev !== pth) {
		ret.push(path.join(pth, 'node_modules/.bin'));
		prev = pth;
		pth = path.resolve(pth, '..');
	}

	// ensure the running `node` binary is used
	ret.push(path.dirname(process.execPath));

	return ret.concat(opts.path).join(path.delimiter);
};

module.exports.env = opts => {
	opts = Object.assign({
		env: process.env
	}, opts);

	const env = Object.assign({}, opts.env);
	const path = pathKey({env});

	opts.path = env[path];
	env[path] = module.exports(opts);

	return env;
};

}).call(this,require('_process'))
},{"_process":137,"path":135,"path-key":107}],91:[function(require,module,exports){
module.exports = paginationMethodsPlugin

function paginationMethodsPlugin (octokit) {
  octokit.getFirstPage = require('./lib/get-first-page').bind(null, octokit)
  octokit.getLastPage = require('./lib/get-last-page').bind(null, octokit)
  octokit.getNextPage = require('./lib/get-next-page').bind(null, octokit)
  octokit.getPreviousPage = require('./lib/get-previous-page').bind(null, octokit)
  octokit.hasFirstPage = require('./lib/has-first-page')
  octokit.hasLastPage = require('./lib/has-last-page')
  octokit.hasNextPage = require('./lib/has-next-page')
  octokit.hasPreviousPage = require('./lib/has-previous-page')
}

},{"./lib/get-first-page":93,"./lib/get-last-page":94,"./lib/get-next-page":95,"./lib/get-previous-page":98,"./lib/has-first-page":99,"./lib/has-last-page":100,"./lib/has-next-page":101,"./lib/has-previous-page":102}],92:[function(require,module,exports){
module.exports = deprecate

const loggedMessages = {}

function deprecate (message) {
  if (loggedMessages[message]) {
    return
  }

  console.warn(`DEPRECATED (@octokit/rest): ${message}`)
  loggedMessages[message] = 1
}

},{}],93:[function(require,module,exports){
module.exports = getFirstPage

const getPage = require('./get-page')

function getFirstPage (octokit, link, headers) {
  return getPage(octokit, link, 'first', headers)
}

},{"./get-page":97}],94:[function(require,module,exports){
module.exports = getLastPage

const getPage = require('./get-page')

function getLastPage (octokit, link, headers) {
  return getPage(octokit, link, 'last', headers)
}

},{"./get-page":97}],95:[function(require,module,exports){
module.exports = getNextPage

const getPage = require('./get-page')

function getNextPage (octokit, link, headers) {
  return getPage(octokit, link, 'next', headers)
}

},{"./get-page":97}],96:[function(require,module,exports){
module.exports = getPageLinks

function getPageLinks (link) {
  link = link.link || link.headers.link || ''

  const links = {}

  // link format:
  // '<https://api.github.com/users/aseemk/followers?page=2>; rel="next", <https://api.github.com/users/aseemk/followers?page=2>; rel="last"'
  link.replace(/<([^>]*)>;\s*rel="([\w]*)"/g, (m, uri, type) => {
    links[type] = uri
  })

  return links
}

},{}],97:[function(require,module,exports){
module.exports = getPage

const deprecate = require('./deprecate')
const getPageLinks = require('./get-page-links')
const HttpError = require('./http-error')

function getPage (octokit, link, which, headers) {
  deprecate(`octokit.get${which.charAt(0).toUpperCase() + which.slice(1)}Page() – You can use octokit.paginate or async iterators instead: https://github.com/octokit/rest.js#pagination.`)
  const url = getPageLinks(link)[which]

  if (!url) {
    const urlError = new HttpError(`No ${which} page found`, 404)
    return Promise.reject(urlError)
  }

  const requestOptions = {
    url,
    headers: applyAcceptHeader(link, headers)
  }

  const promise = octokit.request(requestOptions)

  return promise
}

function applyAcceptHeader (res, headers) {
  const previous = res.headers && res.headers['x-github-media-type']

  if (!previous || (headers && headers.accept)) {
    return headers
  }
  headers = headers || {}
  headers.accept = 'application/vnd.' + previous
    .replace('; param=', '.')
    .replace('; format=', '+')

  return headers
}

},{"./deprecate":92,"./get-page-links":96,"./http-error":103}],98:[function(require,module,exports){
module.exports = getPreviousPage

const getPage = require('./get-page')

function getPreviousPage (octokit, link, headers) {
  return getPage(octokit, link, 'prev', headers)
}

},{"./get-page":97}],99:[function(require,module,exports){
module.exports = hasFirstPage

const deprecate = require('./deprecate')
const getPageLinks = require('./get-page-links')

function hasFirstPage (link) {
  deprecate(`octokit.hasFirstPage() – You can use octokit.paginate or async iterators instead: https://github.com/octokit/rest.js#pagination.`)
  return getPageLinks(link).first
}

},{"./deprecate":92,"./get-page-links":96}],100:[function(require,module,exports){
module.exports = hasLastPage

const deprecate = require('./deprecate')
const getPageLinks = require('./get-page-links')

function hasLastPage (link) {
  deprecate(`octokit.hasLastPage() – You can use octokit.paginate or async iterators instead: https://github.com/octokit/rest.js#pagination.`)
  return getPageLinks(link).last
}

},{"./deprecate":92,"./get-page-links":96}],101:[function(require,module,exports){
module.exports = hasNextPage

const deprecate = require('./deprecate')
const getPageLinks = require('./get-page-links')

function hasNextPage (link) {
  deprecate(`octokit.hasNextPage() – You can use octokit.paginate or async iterators instead: https://github.com/octokit/rest.js#pagination.`)
  return getPageLinks(link).next
}

},{"./deprecate":92,"./get-page-links":96}],102:[function(require,module,exports){
module.exports = hasPreviousPage

const deprecate = require('./deprecate')
const getPageLinks = require('./get-page-links')

function hasPreviousPage (link) {
  deprecate(`octokit.hasPreviousPage() – You can use octokit.paginate or async iterators instead: https://github.com/octokit/rest.js#pagination.`)
  return getPageLinks(link).prev
}

},{"./deprecate":92,"./get-page-links":96}],103:[function(require,module,exports){
module.exports = class HttpError extends Error {
  constructor (message, code, headers) {
    super(message)

    // Maintains proper stack trace (only available on V8)
    /* istanbul ignore next */
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor)
    }

    this.name = 'HttpError'
    this.code = code
    this.headers = headers
  }
}

},{}],104:[function(require,module,exports){
var wrappy = require('wrappy')
module.exports = wrappy(once)
module.exports.strict = wrappy(onceStrict)

once.proto = once(function () {
  Object.defineProperty(Function.prototype, 'once', {
    value: function () {
      return once(this)
    },
    configurable: true
  })

  Object.defineProperty(Function.prototype, 'onceStrict', {
    value: function () {
      return onceStrict(this)
    },
    configurable: true
  })
})

function once (fn) {
  var f = function () {
    if (f.called) return f.value
    f.called = true
    return f.value = fn.apply(this, arguments)
  }
  f.called = false
  return f
}

function onceStrict (fn) {
  var f = function () {
    if (f.called)
      throw new Error(f.onceError)
    f.called = true
    return f.value = fn.apply(this, arguments)
  }
  var name = fn.name || 'Function wrapped with `once`'
  f.onceError = name + " shouldn't be called more than once"
  f.called = false
  return f
}

},{"wrappy":118}],105:[function(require,module,exports){
'use strict';
const os = require('os');
const macosRelease = require('macos-release');
const winRelease = require('windows-release');

const osName = (platform, release) => {
	if (!platform && release) {
		throw new Error('You can\'t specify a `release` without specifying `platform`');
	}

	platform = platform || os.platform();

	let id;

	if (platform === 'darwin') {
		if (!release && os.platform() === 'darwin') {
			release = os.release();
		}

		const prefix = release ? (Number(release.split('.')[0]) > 15 ? 'macOS' : 'OS X') : 'macOS';
		id = release ? macosRelease(release).name : '';
		return prefix + (id ? ' ' + id : '');
	}

	if (platform === 'linux') {
		if (!release && os.platform() === 'linux') {
			release = os.release();
		}

		id = release ? release.replace(/^(\d+\.\d+).*/, '$1') : '';
		return 'Linux' + (id ? ' ' + id : '');
	}

	if (platform === 'win32') {
		if (!release && os.platform() === 'win32') {
			release = os.release();
		}

		id = release ? winRelease(release) : '';
		return 'Windows' + (id ? ' ' + id : '');
	}

	return platform;
};

module.exports = osName;

},{"macos-release":87,"os":134,"windows-release":117}],106:[function(require,module,exports){
'use strict';
module.exports = (promise, onFinally) => {
	onFinally = onFinally || (() => {});

	return promise.then(
		val => new Promise(resolve => {
			resolve(onFinally());
		}).then(() => val),
		err => new Promise(resolve => {
			resolve(onFinally());
		}).then(() => {
			throw err;
		})
	);
};

},{}],107:[function(require,module,exports){
(function (process){
'use strict';
module.exports = opts => {
	opts = opts || {};

	const env = opts.env || process.env;
	const platform = opts.platform || process.platform;

	if (platform !== 'win32') {
		return 'PATH';
	}

	return Object.keys(env).find(x => x.toUpperCase() === 'PATH') || 'Path';
};

}).call(this,require('_process'))
},{"_process":137}],108:[function(require,module,exports){
(function (process){
var once = require('once')
var eos = require('end-of-stream')
var fs = require('fs') // we only need fs to get the ReadStream and WriteStream prototypes

var noop = function () {}
var ancient = /^v?\.0/.test(process.version)

var isFn = function (fn) {
  return typeof fn === 'function'
}

var isFS = function (stream) {
  if (!ancient) return false // newer node version do not need to care about fs is a special way
  if (!fs) return false // browser
  return (stream instanceof (fs.ReadStream || noop) || stream instanceof (fs.WriteStream || noop)) && isFn(stream.close)
}

var isRequest = function (stream) {
  return stream.setHeader && isFn(stream.abort)
}

var destroyer = function (stream, reading, writing, callback) {
  callback = once(callback)

  var closed = false
  stream.on('close', function () {
    closed = true
  })

  eos(stream, {readable: reading, writable: writing}, function (err) {
    if (err) return callback(err)
    closed = true
    callback()
  })

  var destroyed = false
  return function (err) {
    if (closed) return
    if (destroyed) return
    destroyed = true

    if (isFS(stream)) return stream.close(noop) // use close for fs streams to avoid fd leaks
    if (isRequest(stream)) return stream.abort() // request.destroy just do .end - .abort is what we want

    if (isFn(stream.destroy)) return stream.destroy()

    callback(err || new Error('stream was destroyed'))
  }
}

var call = function (fn) {
  fn()
}

var pipe = function (from, to) {
  return from.pipe(to)
}

var pump = function () {
  var streams = Array.prototype.slice.call(arguments)
  var callback = isFn(streams[streams.length - 1] || noop) && streams.pop() || noop

  if (Array.isArray(streams[0])) streams = streams[0]
  if (streams.length < 2) throw new Error('pump requires two streams per minimum')

  var error
  var destroys = streams.map(function (stream, i) {
    var reading = i < streams.length - 1
    var writing = i > 0
    return destroyer(stream, reading, writing, function (err) {
      if (!error) error = err
      if (err) destroys.forEach(call)
      if (reading) return
      destroys.forEach(call)
      callback(error)
    })
  })

  return streams.reduce(pipe)
}

module.exports = pump

}).call(this,require('_process'))
},{"_process":137,"end-of-stream":74,"fs":125,"once":104}],109:[function(require,module,exports){
(function (process){
exports = module.exports = SemVer

var debug
/* istanbul ignore next */
if (typeof process === 'object' &&
    process.env &&
    process.env.NODE_DEBUG &&
    /\bsemver\b/i.test(process.env.NODE_DEBUG)) {
  debug = function () {
    var args = Array.prototype.slice.call(arguments, 0)
    args.unshift('SEMVER')
    console.log.apply(console, args)
  }
} else {
  debug = function () {}
}

// Note: this is the semver.org version of the spec that it implements
// Not necessarily the package version of this code.
exports.SEMVER_SPEC_VERSION = '2.0.0'

var MAX_LENGTH = 256
var MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER ||
  /* istanbul ignore next */ 9007199254740991

// Max safe segment length for coercion.
var MAX_SAFE_COMPONENT_LENGTH = 16

// The actual regexps go on exports.re
var re = exports.re = []
var src = exports.src = []
var R = 0

// The following Regular Expressions can be used for tokenizing,
// validating, and parsing SemVer version strings.

// ## Numeric Identifier
// A single `0`, or a non-zero digit followed by zero or more digits.

var NUMERICIDENTIFIER = R++
src[NUMERICIDENTIFIER] = '0|[1-9]\\d*'
var NUMERICIDENTIFIERLOOSE = R++
src[NUMERICIDENTIFIERLOOSE] = '[0-9]+'

// ## Non-numeric Identifier
// Zero or more digits, followed by a letter or hyphen, and then zero or
// more letters, digits, or hyphens.

var NONNUMERICIDENTIFIER = R++
src[NONNUMERICIDENTIFIER] = '\\d*[a-zA-Z-][a-zA-Z0-9-]*'

// ## Main Version
// Three dot-separated numeric identifiers.

var MAINVERSION = R++
src[MAINVERSION] = '(' + src[NUMERICIDENTIFIER] + ')\\.' +
                   '(' + src[NUMERICIDENTIFIER] + ')\\.' +
                   '(' + src[NUMERICIDENTIFIER] + ')'

var MAINVERSIONLOOSE = R++
src[MAINVERSIONLOOSE] = '(' + src[NUMERICIDENTIFIERLOOSE] + ')\\.' +
                        '(' + src[NUMERICIDENTIFIERLOOSE] + ')\\.' +
                        '(' + src[NUMERICIDENTIFIERLOOSE] + ')'

// ## Pre-release Version Identifier
// A numeric identifier, or a non-numeric identifier.

var PRERELEASEIDENTIFIER = R++
src[PRERELEASEIDENTIFIER] = '(?:' + src[NUMERICIDENTIFIER] +
                            '|' + src[NONNUMERICIDENTIFIER] + ')'

var PRERELEASEIDENTIFIERLOOSE = R++
src[PRERELEASEIDENTIFIERLOOSE] = '(?:' + src[NUMERICIDENTIFIERLOOSE] +
                                 '|' + src[NONNUMERICIDENTIFIER] + ')'

// ## Pre-release Version
// Hyphen, followed by one or more dot-separated pre-release version
// identifiers.

var PRERELEASE = R++
src[PRERELEASE] = '(?:-(' + src[PRERELEASEIDENTIFIER] +
                  '(?:\\.' + src[PRERELEASEIDENTIFIER] + ')*))'

var PRERELEASELOOSE = R++
src[PRERELEASELOOSE] = '(?:-?(' + src[PRERELEASEIDENTIFIERLOOSE] +
                       '(?:\\.' + src[PRERELEASEIDENTIFIERLOOSE] + ')*))'

// ## Build Metadata Identifier
// Any combination of digits, letters, or hyphens.

var BUILDIDENTIFIER = R++
src[BUILDIDENTIFIER] = '[0-9A-Za-z-]+'

// ## Build Metadata
// Plus sign, followed by one or more period-separated build metadata
// identifiers.

var BUILD = R++
src[BUILD] = '(?:\\+(' + src[BUILDIDENTIFIER] +
             '(?:\\.' + src[BUILDIDENTIFIER] + ')*))'

// ## Full Version String
// A main version, followed optionally by a pre-release version and
// build metadata.

// Note that the only major, minor, patch, and pre-release sections of
// the version string are capturing groups.  The build metadata is not a
// capturing group, because it should not ever be used in version
// comparison.

var FULL = R++
var FULLPLAIN = 'v?' + src[MAINVERSION] +
                src[PRERELEASE] + '?' +
                src[BUILD] + '?'

src[FULL] = '^' + FULLPLAIN + '$'

// like full, but allows v1.2.3 and =1.2.3, which people do sometimes.
// also, 1.0.0alpha1 (prerelease without the hyphen) which is pretty
// common in the npm registry.
var LOOSEPLAIN = '[v=\\s]*' + src[MAINVERSIONLOOSE] +
                 src[PRERELEASELOOSE] + '?' +
                 src[BUILD] + '?'

var LOOSE = R++
src[LOOSE] = '^' + LOOSEPLAIN + '$'

var GTLT = R++
src[GTLT] = '((?:<|>)?=?)'

// Something like "2.*" or "1.2.x".
// Note that "x.x" is a valid xRange identifer, meaning "any version"
// Only the first item is strictly required.
var XRANGEIDENTIFIERLOOSE = R++
src[XRANGEIDENTIFIERLOOSE] = src[NUMERICIDENTIFIERLOOSE] + '|x|X|\\*'
var XRANGEIDENTIFIER = R++
src[XRANGEIDENTIFIER] = src[NUMERICIDENTIFIER] + '|x|X|\\*'

var XRANGEPLAIN = R++
src[XRANGEPLAIN] = '[v=\\s]*(' + src[XRANGEIDENTIFIER] + ')' +
                   '(?:\\.(' + src[XRANGEIDENTIFIER] + ')' +
                   '(?:\\.(' + src[XRANGEIDENTIFIER] + ')' +
                   '(?:' + src[PRERELEASE] + ')?' +
                   src[BUILD] + '?' +
                   ')?)?'

var XRANGEPLAINLOOSE = R++
src[XRANGEPLAINLOOSE] = '[v=\\s]*(' + src[XRANGEIDENTIFIERLOOSE] + ')' +
                        '(?:\\.(' + src[XRANGEIDENTIFIERLOOSE] + ')' +
                        '(?:\\.(' + src[XRANGEIDENTIFIERLOOSE] + ')' +
                        '(?:' + src[PRERELEASELOOSE] + ')?' +
                        src[BUILD] + '?' +
                        ')?)?'

var XRANGE = R++
src[XRANGE] = '^' + src[GTLT] + '\\s*' + src[XRANGEPLAIN] + '$'
var XRANGELOOSE = R++
src[XRANGELOOSE] = '^' + src[GTLT] + '\\s*' + src[XRANGEPLAINLOOSE] + '$'

// Coercion.
// Extract anything that could conceivably be a part of a valid semver
var COERCE = R++
src[COERCE] = '(?:^|[^\\d])' +
              '(\\d{1,' + MAX_SAFE_COMPONENT_LENGTH + '})' +
              '(?:\\.(\\d{1,' + MAX_SAFE_COMPONENT_LENGTH + '}))?' +
              '(?:\\.(\\d{1,' + MAX_SAFE_COMPONENT_LENGTH + '}))?' +
              '(?:$|[^\\d])'

// Tilde ranges.
// Meaning is "reasonably at or greater than"
var LONETILDE = R++
src[LONETILDE] = '(?:~>?)'

var TILDETRIM = R++
src[TILDETRIM] = '(\\s*)' + src[LONETILDE] + '\\s+'
re[TILDETRIM] = new RegExp(src[TILDETRIM], 'g')
var tildeTrimReplace = '$1~'

var TILDE = R++
src[TILDE] = '^' + src[LONETILDE] + src[XRANGEPLAIN] + '$'
var TILDELOOSE = R++
src[TILDELOOSE] = '^' + src[LONETILDE] + src[XRANGEPLAINLOOSE] + '$'

// Caret ranges.
// Meaning is "at least and backwards compatible with"
var LONECARET = R++
src[LONECARET] = '(?:\\^)'

var CARETTRIM = R++
src[CARETTRIM] = '(\\s*)' + src[LONECARET] + '\\s+'
re[CARETTRIM] = new RegExp(src[CARETTRIM], 'g')
var caretTrimReplace = '$1^'

var CARET = R++
src[CARET] = '^' + src[LONECARET] + src[XRANGEPLAIN] + '$'
var CARETLOOSE = R++
src[CARETLOOSE] = '^' + src[LONECARET] + src[XRANGEPLAINLOOSE] + '$'

// A simple gt/lt/eq thing, or just "" to indicate "any version"
var COMPARATORLOOSE = R++
src[COMPARATORLOOSE] = '^' + src[GTLT] + '\\s*(' + LOOSEPLAIN + ')$|^$'
var COMPARATOR = R++
src[COMPARATOR] = '^' + src[GTLT] + '\\s*(' + FULLPLAIN + ')$|^$'

// An expression to strip any whitespace between the gtlt and the thing
// it modifies, so that `> 1.2.3` ==> `>1.2.3`
var COMPARATORTRIM = R++
src[COMPARATORTRIM] = '(\\s*)' + src[GTLT] +
                      '\\s*(' + LOOSEPLAIN + '|' + src[XRANGEPLAIN] + ')'

// this one has to use the /g flag
re[COMPARATORTRIM] = new RegExp(src[COMPARATORTRIM], 'g')
var comparatorTrimReplace = '$1$2$3'

// Something like `1.2.3 - 1.2.4`
// Note that these all use the loose form, because they'll be
// checked against either the strict or loose comparator form
// later.
var HYPHENRANGE = R++
src[HYPHENRANGE] = '^\\s*(' + src[XRANGEPLAIN] + ')' +
                   '\\s+-\\s+' +
                   '(' + src[XRANGEPLAIN] + ')' +
                   '\\s*$'

var HYPHENRANGELOOSE = R++
src[HYPHENRANGELOOSE] = '^\\s*(' + src[XRANGEPLAINLOOSE] + ')' +
                        '\\s+-\\s+' +
                        '(' + src[XRANGEPLAINLOOSE] + ')' +
                        '\\s*$'

// Star ranges basically just allow anything at all.
var STAR = R++
src[STAR] = '(<|>)?=?\\s*\\*'

// Compile to actual regexp objects.
// All are flag-free, unless they were created above with a flag.
for (var i = 0; i < R; i++) {
  debug(i, src[i])
  if (!re[i]) {
    re[i] = new RegExp(src[i])
  }
}

exports.parse = parse
function parse (version, options) {
  if (!options || typeof options !== 'object') {
    options = {
      loose: !!options,
      includePrerelease: false
    }
  }

  if (version instanceof SemVer) {
    return version
  }

  if (typeof version !== 'string') {
    return null
  }

  if (version.length > MAX_LENGTH) {
    return null
  }

  var r = options.loose ? re[LOOSE] : re[FULL]
  if (!r.test(version)) {
    return null
  }

  try {
    return new SemVer(version, options)
  } catch (er) {
    return null
  }
}

exports.valid = valid
function valid (version, options) {
  var v = parse(version, options)
  return v ? v.version : null
}

exports.clean = clean
function clean (version, options) {
  var s = parse(version.trim().replace(/^[=v]+/, ''), options)
  return s ? s.version : null
}

exports.SemVer = SemVer

function SemVer (version, options) {
  if (!options || typeof options !== 'object') {
    options = {
      loose: !!options,
      includePrerelease: false
    }
  }
  if (version instanceof SemVer) {
    if (version.loose === options.loose) {
      return version
    } else {
      version = version.version
    }
  } else if (typeof version !== 'string') {
    throw new TypeError('Invalid Version: ' + version)
  }

  if (version.length > MAX_LENGTH) {
    throw new TypeError('version is longer than ' + MAX_LENGTH + ' characters')
  }

  if (!(this instanceof SemVer)) {
    return new SemVer(version, options)
  }

  debug('SemVer', version, options)
  this.options = options
  this.loose = !!options.loose

  var m = version.trim().match(options.loose ? re[LOOSE] : re[FULL])

  if (!m) {
    throw new TypeError('Invalid Version: ' + version)
  }

  this.raw = version

  // these are actually numbers
  this.major = +m[1]
  this.minor = +m[2]
  this.patch = +m[3]

  if (this.major > MAX_SAFE_INTEGER || this.major < 0) {
    throw new TypeError('Invalid major version')
  }

  if (this.minor > MAX_SAFE_INTEGER || this.minor < 0) {
    throw new TypeError('Invalid minor version')
  }

  if (this.patch > MAX_SAFE_INTEGER || this.patch < 0) {
    throw new TypeError('Invalid patch version')
  }

  // numberify any prerelease numeric ids
  if (!m[4]) {
    this.prerelease = []
  } else {
    this.prerelease = m[4].split('.').map(function (id) {
      if (/^[0-9]+$/.test(id)) {
        var num = +id
        if (num >= 0 && num < MAX_SAFE_INTEGER) {
          return num
        }
      }
      return id
    })
  }

  this.build = m[5] ? m[5].split('.') : []
  this.format()
}

SemVer.prototype.format = function () {
  this.version = this.major + '.' + this.minor + '.' + this.patch
  if (this.prerelease.length) {
    this.version += '-' + this.prerelease.join('.')
  }
  return this.version
}

SemVer.prototype.toString = function () {
  return this.version
}

SemVer.prototype.compare = function (other) {
  debug('SemVer.compare', this.version, this.options, other)
  if (!(other instanceof SemVer)) {
    other = new SemVer(other, this.options)
  }

  return this.compareMain(other) || this.comparePre(other)
}

SemVer.prototype.compareMain = function (other) {
  if (!(other instanceof SemVer)) {
    other = new SemVer(other, this.options)
  }

  return compareIdentifiers(this.major, other.major) ||
         compareIdentifiers(this.minor, other.minor) ||
         compareIdentifiers(this.patch, other.patch)
}

SemVer.prototype.comparePre = function (other) {
  if (!(other instanceof SemVer)) {
    other = new SemVer(other, this.options)
  }

  // NOT having a prerelease is > having one
  if (this.prerelease.length && !other.prerelease.length) {
    return -1
  } else if (!this.prerelease.length && other.prerelease.length) {
    return 1
  } else if (!this.prerelease.length && !other.prerelease.length) {
    return 0
  }

  var i = 0
  do {
    var a = this.prerelease[i]
    var b = other.prerelease[i]
    debug('prerelease compare', i, a, b)
    if (a === undefined && b === undefined) {
      return 0
    } else if (b === undefined) {
      return 1
    } else if (a === undefined) {
      return -1
    } else if (a === b) {
      continue
    } else {
      return compareIdentifiers(a, b)
    }
  } while (++i)
}

// preminor will bump the version up to the next minor release, and immediately
// down to pre-release. premajor and prepatch work the same way.
SemVer.prototype.inc = function (release, identifier) {
  switch (release) {
    case 'premajor':
      this.prerelease.length = 0
      this.patch = 0
      this.minor = 0
      this.major++
      this.inc('pre', identifier)
      break
    case 'preminor':
      this.prerelease.length = 0
      this.patch = 0
      this.minor++
      this.inc('pre', identifier)
      break
    case 'prepatch':
      // If this is already a prerelease, it will bump to the next version
      // drop any prereleases that might already exist, since they are not
      // relevant at this point.
      this.prerelease.length = 0
      this.inc('patch', identifier)
      this.inc('pre', identifier)
      break
    // If the input is a non-prerelease version, this acts the same as
    // prepatch.
    case 'prerelease':
      if (this.prerelease.length === 0) {
        this.inc('patch', identifier)
      }
      this.inc('pre', identifier)
      break

    case 'major':
      // If this is a pre-major version, bump up to the same major version.
      // Otherwise increment major.
      // 1.0.0-5 bumps to 1.0.0
      // 1.1.0 bumps to 2.0.0
      if (this.minor !== 0 ||
          this.patch !== 0 ||
          this.prerelease.length === 0) {
        this.major++
      }
      this.minor = 0
      this.patch = 0
      this.prerelease = []
      break
    case 'minor':
      // If this is a pre-minor version, bump up to the same minor version.
      // Otherwise increment minor.
      // 1.2.0-5 bumps to 1.2.0
      // 1.2.1 bumps to 1.3.0
      if (this.patch !== 0 || this.prerelease.length === 0) {
        this.minor++
      }
      this.patch = 0
      this.prerelease = []
      break
    case 'patch':
      // If this is not a pre-release version, it will increment the patch.
      // If it is a pre-release it will bump up to the same patch version.
      // 1.2.0-5 patches to 1.2.0
      // 1.2.0 patches to 1.2.1
      if (this.prerelease.length === 0) {
        this.patch++
      }
      this.prerelease = []
      break
    // This probably shouldn't be used publicly.
    // 1.0.0 "pre" would become 1.0.0-0 which is the wrong direction.
    case 'pre':
      if (this.prerelease.length === 0) {
        this.prerelease = [0]
      } else {
        var i = this.prerelease.length
        while (--i >= 0) {
          if (typeof this.prerelease[i] === 'number') {
            this.prerelease[i]++
            i = -2
          }
        }
        if (i === -1) {
          // didn't increment anything
          this.prerelease.push(0)
        }
      }
      if (identifier) {
        // 1.2.0-beta.1 bumps to 1.2.0-beta.2,
        // 1.2.0-beta.fooblz or 1.2.0-beta bumps to 1.2.0-beta.0
        if (this.prerelease[0] === identifier) {
          if (isNaN(this.prerelease[1])) {
            this.prerelease = [identifier, 0]
          }
        } else {
          this.prerelease = [identifier, 0]
        }
      }
      break

    default:
      throw new Error('invalid increment argument: ' + release)
  }
  this.format()
  this.raw = this.version
  return this
}

exports.inc = inc
function inc (version, release, loose, identifier) {
  if (typeof (loose) === 'string') {
    identifier = loose
    loose = undefined
  }

  try {
    return new SemVer(version, loose).inc(release, identifier).version
  } catch (er) {
    return null
  }
}

exports.diff = diff
function diff (version1, version2) {
  if (eq(version1, version2)) {
    return null
  } else {
    var v1 = parse(version1)
    var v2 = parse(version2)
    var prefix = ''
    if (v1.prerelease.length || v2.prerelease.length) {
      prefix = 'pre'
      var defaultResult = 'prerelease'
    }
    for (var key in v1) {
      if (key === 'major' || key === 'minor' || key === 'patch') {
        if (v1[key] !== v2[key]) {
          return prefix + key
        }
      }
    }
    return defaultResult // may be undefined
  }
}

exports.compareIdentifiers = compareIdentifiers

var numeric = /^[0-9]+$/
function compareIdentifiers (a, b) {
  var anum = numeric.test(a)
  var bnum = numeric.test(b)

  if (anum && bnum) {
    a = +a
    b = +b
  }

  return a === b ? 0
    : (anum && !bnum) ? -1
    : (bnum && !anum) ? 1
    : a < b ? -1
    : 1
}

exports.rcompareIdentifiers = rcompareIdentifiers
function rcompareIdentifiers (a, b) {
  return compareIdentifiers(b, a)
}

exports.major = major
function major (a, loose) {
  return new SemVer(a, loose).major
}

exports.minor = minor
function minor (a, loose) {
  return new SemVer(a, loose).minor
}

exports.patch = patch
function patch (a, loose) {
  return new SemVer(a, loose).patch
}

exports.compare = compare
function compare (a, b, loose) {
  return new SemVer(a, loose).compare(new SemVer(b, loose))
}

exports.compareLoose = compareLoose
function compareLoose (a, b) {
  return compare(a, b, true)
}

exports.rcompare = rcompare
function rcompare (a, b, loose) {
  return compare(b, a, loose)
}

exports.sort = sort
function sort (list, loose) {
  return list.sort(function (a, b) {
    return exports.compare(a, b, loose)
  })
}

exports.rsort = rsort
function rsort (list, loose) {
  return list.sort(function (a, b) {
    return exports.rcompare(a, b, loose)
  })
}

exports.gt = gt
function gt (a, b, loose) {
  return compare(a, b, loose) > 0
}

exports.lt = lt
function lt (a, b, loose) {
  return compare(a, b, loose) < 0
}

exports.eq = eq
function eq (a, b, loose) {
  return compare(a, b, loose) === 0
}

exports.neq = neq
function neq (a, b, loose) {
  return compare(a, b, loose) !== 0
}

exports.gte = gte
function gte (a, b, loose) {
  return compare(a, b, loose) >= 0
}

exports.lte = lte
function lte (a, b, loose) {
  return compare(a, b, loose) <= 0
}

exports.cmp = cmp
function cmp (a, op, b, loose) {
  switch (op) {
    case '===':
      if (typeof a === 'object')
        a = a.version
      if (typeof b === 'object')
        b = b.version
      return a === b

    case '!==':
      if (typeof a === 'object')
        a = a.version
      if (typeof b === 'object')
        b = b.version
      return a !== b

    case '':
    case '=':
    case '==':
      return eq(a, b, loose)

    case '!=':
      return neq(a, b, loose)

    case '>':
      return gt(a, b, loose)

    case '>=':
      return gte(a, b, loose)

    case '<':
      return lt(a, b, loose)

    case '<=':
      return lte(a, b, loose)

    default:
      throw new TypeError('Invalid operator: ' + op)
  }
}

exports.Comparator = Comparator
function Comparator (comp, options) {
  if (!options || typeof options !== 'object') {
    options = {
      loose: !!options,
      includePrerelease: false
    }
  }

  if (comp instanceof Comparator) {
    if (comp.loose === !!options.loose) {
      return comp
    } else {
      comp = comp.value
    }
  }

  if (!(this instanceof Comparator)) {
    return new Comparator(comp, options)
  }

  debug('comparator', comp, options)
  this.options = options
  this.loose = !!options.loose
  this.parse(comp)

  if (this.semver === ANY) {
    this.value = ''
  } else {
    this.value = this.operator + this.semver.version
  }

  debug('comp', this)
}

var ANY = {}
Comparator.prototype.parse = function (comp) {
  var r = this.options.loose ? re[COMPARATORLOOSE] : re[COMPARATOR]
  var m = comp.match(r)

  if (!m) {
    throw new TypeError('Invalid comparator: ' + comp)
  }

  this.operator = m[1]
  if (this.operator === '=') {
    this.operator = ''
  }

  // if it literally is just '>' or '' then allow anything.
  if (!m[2]) {
    this.semver = ANY
  } else {
    this.semver = new SemVer(m[2], this.options.loose)
  }
}

Comparator.prototype.toString = function () {
  return this.value
}

Comparator.prototype.test = function (version) {
  debug('Comparator.test', version, this.options.loose)

  if (this.semver === ANY) {
    return true
  }

  if (typeof version === 'string') {
    version = new SemVer(version, this.options)
  }

  return cmp(version, this.operator, this.semver, this.options)
}

Comparator.prototype.intersects = function (comp, options) {
  if (!(comp instanceof Comparator)) {
    throw new TypeError('a Comparator is required')
  }

  if (!options || typeof options !== 'object') {
    options = {
      loose: !!options,
      includePrerelease: false
    }
  }

  var rangeTmp

  if (this.operator === '') {
    rangeTmp = new Range(comp.value, options)
    return satisfies(this.value, rangeTmp, options)
  } else if (comp.operator === '') {
    rangeTmp = new Range(this.value, options)
    return satisfies(comp.semver, rangeTmp, options)
  }

  var sameDirectionIncreasing =
    (this.operator === '>=' || this.operator === '>') &&
    (comp.operator === '>=' || comp.operator === '>')
  var sameDirectionDecreasing =
    (this.operator === '<=' || this.operator === '<') &&
    (comp.operator === '<=' || comp.operator === '<')
  var sameSemVer = this.semver.version === comp.semver.version
  var differentDirectionsInclusive =
    (this.operator === '>=' || this.operator === '<=') &&
    (comp.operator === '>=' || comp.operator === '<=')
  var oppositeDirectionsLessThan =
    cmp(this.semver, '<', comp.semver, options) &&
    ((this.operator === '>=' || this.operator === '>') &&
    (comp.operator === '<=' || comp.operator === '<'))
  var oppositeDirectionsGreaterThan =
    cmp(this.semver, '>', comp.semver, options) &&
    ((this.operator === '<=' || this.operator === '<') &&
    (comp.operator === '>=' || comp.operator === '>'))

  return sameDirectionIncreasing || sameDirectionDecreasing ||
    (sameSemVer && differentDirectionsInclusive) ||
    oppositeDirectionsLessThan || oppositeDirectionsGreaterThan
}

exports.Range = Range
function Range (range, options) {
  if (!options || typeof options !== 'object') {
    options = {
      loose: !!options,
      includePrerelease: false
    }
  }

  if (range instanceof Range) {
    if (range.loose === !!options.loose &&
        range.includePrerelease === !!options.includePrerelease) {
      return range
    } else {
      return new Range(range.raw, options)
    }
  }

  if (range instanceof Comparator) {
    return new Range(range.value, options)
  }

  if (!(this instanceof Range)) {
    return new Range(range, options)
  }

  this.options = options
  this.loose = !!options.loose
  this.includePrerelease = !!options.includePrerelease

  // First, split based on boolean or ||
  this.raw = range
  this.set = range.split(/\s*\|\|\s*/).map(function (range) {
    return this.parseRange(range.trim())
  }, this).filter(function (c) {
    // throw out any that are not relevant for whatever reason
    return c.length
  })

  if (!this.set.length) {
    throw new TypeError('Invalid SemVer Range: ' + range)
  }

  this.format()
}

Range.prototype.format = function () {
  this.range = this.set.map(function (comps) {
    return comps.join(' ').trim()
  }).join('||').trim()
  return this.range
}

Range.prototype.toString = function () {
  return this.range
}

Range.prototype.parseRange = function (range) {
  var loose = this.options.loose
  range = range.trim()
  // `1.2.3 - 1.2.4` => `>=1.2.3 <=1.2.4`
  var hr = loose ? re[HYPHENRANGELOOSE] : re[HYPHENRANGE]
  range = range.replace(hr, hyphenReplace)
  debug('hyphen replace', range)
  // `> 1.2.3 < 1.2.5` => `>1.2.3 <1.2.5`
  range = range.replace(re[COMPARATORTRIM], comparatorTrimReplace)
  debug('comparator trim', range, re[COMPARATORTRIM])

  // `~ 1.2.3` => `~1.2.3`
  range = range.replace(re[TILDETRIM], tildeTrimReplace)

  // `^ 1.2.3` => `^1.2.3`
  range = range.replace(re[CARETTRIM], caretTrimReplace)

  // normalize spaces
  range = range.split(/\s+/).join(' ')

  // At this point, the range is completely trimmed and
  // ready to be split into comparators.

  var compRe = loose ? re[COMPARATORLOOSE] : re[COMPARATOR]
  var set = range.split(' ').map(function (comp) {
    return parseComparator(comp, this.options)
  }, this).join(' ').split(/\s+/)
  if (this.options.loose) {
    // in loose mode, throw out any that are not valid comparators
    set = set.filter(function (comp) {
      return !!comp.match(compRe)
    })
  }
  set = set.map(function (comp) {
    return new Comparator(comp, this.options)
  }, this)

  return set
}

Range.prototype.intersects = function (range, options) {
  if (!(range instanceof Range)) {
    throw new TypeError('a Range is required')
  }

  return this.set.some(function (thisComparators) {
    return thisComparators.every(function (thisComparator) {
      return range.set.some(function (rangeComparators) {
        return rangeComparators.every(function (rangeComparator) {
          return thisComparator.intersects(rangeComparator, options)
        })
      })
    })
  })
}

// Mostly just for testing and legacy API reasons
exports.toComparators = toComparators
function toComparators (range, options) {
  return new Range(range, options).set.map(function (comp) {
    return comp.map(function (c) {
      return c.value
    }).join(' ').trim().split(' ')
  })
}

// comprised of xranges, tildes, stars, and gtlt's at this point.
// already replaced the hyphen ranges
// turn into a set of JUST comparators.
function parseComparator (comp, options) {
  debug('comp', comp, options)
  comp = replaceCarets(comp, options)
  debug('caret', comp)
  comp = replaceTildes(comp, options)
  debug('tildes', comp)
  comp = replaceXRanges(comp, options)
  debug('xrange', comp)
  comp = replaceStars(comp, options)
  debug('stars', comp)
  return comp
}

function isX (id) {
  return !id || id.toLowerCase() === 'x' || id === '*'
}

// ~, ~> --> * (any, kinda silly)
// ~2, ~2.x, ~2.x.x, ~>2, ~>2.x ~>2.x.x --> >=2.0.0 <3.0.0
// ~2.0, ~2.0.x, ~>2.0, ~>2.0.x --> >=2.0.0 <2.1.0
// ~1.2, ~1.2.x, ~>1.2, ~>1.2.x --> >=1.2.0 <1.3.0
// ~1.2.3, ~>1.2.3 --> >=1.2.3 <1.3.0
// ~1.2.0, ~>1.2.0 --> >=1.2.0 <1.3.0
function replaceTildes (comp, options) {
  return comp.trim().split(/\s+/).map(function (comp) {
    return replaceTilde(comp, options)
  }).join(' ')
}

function replaceTilde (comp, options) {
  var r = options.loose ? re[TILDELOOSE] : re[TILDE]
  return comp.replace(r, function (_, M, m, p, pr) {
    debug('tilde', comp, _, M, m, p, pr)
    var ret

    if (isX(M)) {
      ret = ''
    } else if (isX(m)) {
      ret = '>=' + M + '.0.0 <' + (+M + 1) + '.0.0'
    } else if (isX(p)) {
      // ~1.2 == >=1.2.0 <1.3.0
      ret = '>=' + M + '.' + m + '.0 <' + M + '.' + (+m + 1) + '.0'
    } else if (pr) {
      debug('replaceTilde pr', pr)
      ret = '>=' + M + '.' + m + '.' + p + '-' + pr +
            ' <' + M + '.' + (+m + 1) + '.0'
    } else {
      // ~1.2.3 == >=1.2.3 <1.3.0
      ret = '>=' + M + '.' + m + '.' + p +
            ' <' + M + '.' + (+m + 1) + '.0'
    }

    debug('tilde return', ret)
    return ret
  })
}

// ^ --> * (any, kinda silly)
// ^2, ^2.x, ^2.x.x --> >=2.0.0 <3.0.0
// ^2.0, ^2.0.x --> >=2.0.0 <3.0.0
// ^1.2, ^1.2.x --> >=1.2.0 <2.0.0
// ^1.2.3 --> >=1.2.3 <2.0.0
// ^1.2.0 --> >=1.2.0 <2.0.0
function replaceCarets (comp, options) {
  return comp.trim().split(/\s+/).map(function (comp) {
    return replaceCaret(comp, options)
  }).join(' ')
}

function replaceCaret (comp, options) {
  debug('caret', comp, options)
  var r = options.loose ? re[CARETLOOSE] : re[CARET]
  return comp.replace(r, function (_, M, m, p, pr) {
    debug('caret', comp, _, M, m, p, pr)
    var ret

    if (isX(M)) {
      ret = ''
    } else if (isX(m)) {
      ret = '>=' + M + '.0.0 <' + (+M + 1) + '.0.0'
    } else if (isX(p)) {
      if (M === '0') {
        ret = '>=' + M + '.' + m + '.0 <' + M + '.' + (+m + 1) + '.0'
      } else {
        ret = '>=' + M + '.' + m + '.0 <' + (+M + 1) + '.0.0'
      }
    } else if (pr) {
      debug('replaceCaret pr', pr)
      if (M === '0') {
        if (m === '0') {
          ret = '>=' + M + '.' + m + '.' + p + '-' + pr +
                ' <' + M + '.' + m + '.' + (+p + 1)
        } else {
          ret = '>=' + M + '.' + m + '.' + p + '-' + pr +
                ' <' + M + '.' + (+m + 1) + '.0'
        }
      } else {
        ret = '>=' + M + '.' + m + '.' + p + '-' + pr +
              ' <' + (+M + 1) + '.0.0'
      }
    } else {
      debug('no pr')
      if (M === '0') {
        if (m === '0') {
          ret = '>=' + M + '.' + m + '.' + p +
                ' <' + M + '.' + m + '.' + (+p + 1)
        } else {
          ret = '>=' + M + '.' + m + '.' + p +
                ' <' + M + '.' + (+m + 1) + '.0'
        }
      } else {
        ret = '>=' + M + '.' + m + '.' + p +
              ' <' + (+M + 1) + '.0.0'
      }
    }

    debug('caret return', ret)
    return ret
  })
}

function replaceXRanges (comp, options) {
  debug('replaceXRanges', comp, options)
  return comp.split(/\s+/).map(function (comp) {
    return replaceXRange(comp, options)
  }).join(' ')
}

function replaceXRange (comp, options) {
  comp = comp.trim()
  var r = options.loose ? re[XRANGELOOSE] : re[XRANGE]
  return comp.replace(r, function (ret, gtlt, M, m, p, pr) {
    debug('xRange', comp, ret, gtlt, M, m, p, pr)
    var xM = isX(M)
    var xm = xM || isX(m)
    var xp = xm || isX(p)
    var anyX = xp

    if (gtlt === '=' && anyX) {
      gtlt = ''
    }

    if (xM) {
      if (gtlt === '>' || gtlt === '<') {
        // nothing is allowed
        ret = '<0.0.0'
      } else {
        // nothing is forbidden
        ret = '*'
      }
    } else if (gtlt && anyX) {
      // we know patch is an x, because we have any x at all.
      // replace X with 0
      if (xm) {
        m = 0
      }
      p = 0

      if (gtlt === '>') {
        // >1 => >=2.0.0
        // >1.2 => >=1.3.0
        // >1.2.3 => >= 1.2.4
        gtlt = '>='
        if (xm) {
          M = +M + 1
          m = 0
          p = 0
        } else {
          m = +m + 1
          p = 0
        }
      } else if (gtlt === '<=') {
        // <=0.7.x is actually <0.8.0, since any 0.7.x should
        // pass.  Similarly, <=7.x is actually <8.0.0, etc.
        gtlt = '<'
        if (xm) {
          M = +M + 1
        } else {
          m = +m + 1
        }
      }

      ret = gtlt + M + '.' + m + '.' + p
    } else if (xm) {
      ret = '>=' + M + '.0.0 <' + (+M + 1) + '.0.0'
    } else if (xp) {
      ret = '>=' + M + '.' + m + '.0 <' + M + '.' + (+m + 1) + '.0'
    }

    debug('xRange return', ret)

    return ret
  })
}

// Because * is AND-ed with everything else in the comparator,
// and '' means "any version", just remove the *s entirely.
function replaceStars (comp, options) {
  debug('replaceStars', comp, options)
  // Looseness is ignored here.  star is always as loose as it gets!
  return comp.trim().replace(re[STAR], '')
}

// This function is passed to string.replace(re[HYPHENRANGE])
// M, m, patch, prerelease, build
// 1.2 - 3.4.5 => >=1.2.0 <=3.4.5
// 1.2.3 - 3.4 => >=1.2.0 <3.5.0 Any 3.4.x will do
// 1.2 - 3.4 => >=1.2.0 <3.5.0
function hyphenReplace ($0,
  from, fM, fm, fp, fpr, fb,
  to, tM, tm, tp, tpr, tb) {
  if (isX(fM)) {
    from = ''
  } else if (isX(fm)) {
    from = '>=' + fM + '.0.0'
  } else if (isX(fp)) {
    from = '>=' + fM + '.' + fm + '.0'
  } else {
    from = '>=' + from
  }

  if (isX(tM)) {
    to = ''
  } else if (isX(tm)) {
    to = '<' + (+tM + 1) + '.0.0'
  } else if (isX(tp)) {
    to = '<' + tM + '.' + (+tm + 1) + '.0'
  } else if (tpr) {
    to = '<=' + tM + '.' + tm + '.' + tp + '-' + tpr
  } else {
    to = '<=' + to
  }

  return (from + ' ' + to).trim()
}

// if ANY of the sets match ALL of its comparators, then pass
Range.prototype.test = function (version) {
  if (!version) {
    return false
  }

  if (typeof version === 'string') {
    version = new SemVer(version, this.options)
  }

  for (var i = 0; i < this.set.length; i++) {
    if (testSet(this.set[i], version, this.options)) {
      return true
    }
  }
  return false
}

function testSet (set, version, options) {
  for (var i = 0; i < set.length; i++) {
    if (!set[i].test(version)) {
      return false
    }
  }

  if (version.prerelease.length && !options.includePrerelease) {
    // Find the set of versions that are allowed to have prereleases
    // For example, ^1.2.3-pr.1 desugars to >=1.2.3-pr.1 <2.0.0
    // That should allow `1.2.3-pr.2` to pass.
    // However, `1.2.4-alpha.notready` should NOT be allowed,
    // even though it's within the range set by the comparators.
    for (i = 0; i < set.length; i++) {
      debug(set[i].semver)
      if (set[i].semver === ANY) {
        continue
      }

      if (set[i].semver.prerelease.length > 0) {
        var allowed = set[i].semver
        if (allowed.major === version.major &&
            allowed.minor === version.minor &&
            allowed.patch === version.patch) {
          return true
        }
      }
    }

    // Version has a -pre, but it's not one of the ones we like.
    return false
  }

  return true
}

exports.satisfies = satisfies
function satisfies (version, range, options) {
  try {
    range = new Range(range, options)
  } catch (er) {
    return false
  }
  return range.test(version)
}

exports.maxSatisfying = maxSatisfying
function maxSatisfying (versions, range, options) {
  var max = null
  var maxSV = null
  try {
    var rangeObj = new Range(range, options)
  } catch (er) {
    return null
  }
  versions.forEach(function (v) {
    if (rangeObj.test(v)) {
      // satisfies(v, range, options)
      if (!max || maxSV.compare(v) === -1) {
        // compare(max, v, true)
        max = v
        maxSV = new SemVer(max, options)
      }
    }
  })
  return max
}

exports.minSatisfying = minSatisfying
function minSatisfying (versions, range, options) {
  var min = null
  var minSV = null
  try {
    var rangeObj = new Range(range, options)
  } catch (er) {
    return null
  }
  versions.forEach(function (v) {
    if (rangeObj.test(v)) {
      // satisfies(v, range, options)
      if (!min || minSV.compare(v) === 1) {
        // compare(min, v, true)
        min = v
        minSV = new SemVer(min, options)
      }
    }
  })
  return min
}

exports.minVersion = minVersion
function minVersion (range, loose) {
  range = new Range(range, loose)

  var minver = new SemVer('0.0.0')
  if (range.test(minver)) {
    return minver
  }

  minver = new SemVer('0.0.0-0')
  if (range.test(minver)) {
    return minver
  }

  minver = null
  for (var i = 0; i < range.set.length; ++i) {
    var comparators = range.set[i]

    comparators.forEach(function (comparator) {
      // Clone to avoid manipulating the comparator's semver object.
      var compver = new SemVer(comparator.semver.version)
      switch (comparator.operator) {
        case '>':
          if (compver.prerelease.length === 0) {
            compver.patch++
          } else {
            compver.prerelease.push(0)
          }
          compver.raw = compver.format()
          /* fallthrough */
        case '':
        case '>=':
          if (!minver || gt(minver, compver)) {
            minver = compver
          }
          break
        case '<':
        case '<=':
          /* Ignore maximum versions */
          break
        /* istanbul ignore next */
        default:
          throw new Error('Unexpected operation: ' + comparator.operator)
      }
    })
  }

  if (minver && range.test(minver)) {
    return minver
  }

  return null
}

exports.validRange = validRange
function validRange (range, options) {
  try {
    // Return '*' instead of '' so that truthiness works.
    // This will throw if it's invalid anyway
    return new Range(range, options).range || '*'
  } catch (er) {
    return null
  }
}

// Determine if version is less than all the versions possible in the range
exports.ltr = ltr
function ltr (version, range, options) {
  return outside(version, range, '<', options)
}

// Determine if version is greater than all the versions possible in the range.
exports.gtr = gtr
function gtr (version, range, options) {
  return outside(version, range, '>', options)
}

exports.outside = outside
function outside (version, range, hilo, options) {
  version = new SemVer(version, options)
  range = new Range(range, options)

  var gtfn, ltefn, ltfn, comp, ecomp
  switch (hilo) {
    case '>':
      gtfn = gt
      ltefn = lte
      ltfn = lt
      comp = '>'
      ecomp = '>='
      break
    case '<':
      gtfn = lt
      ltefn = gte
      ltfn = gt
      comp = '<'
      ecomp = '<='
      break
    default:
      throw new TypeError('Must provide a hilo val of "<" or ">"')
  }

  // If it satisifes the range it is not outside
  if (satisfies(version, range, options)) {
    return false
  }

  // From now on, variable terms are as if we're in "gtr" mode.
  // but note that everything is flipped for the "ltr" function.

  for (var i = 0; i < range.set.length; ++i) {
    var comparators = range.set[i]

    var high = null
    var low = null

    comparators.forEach(function (comparator) {
      if (comparator.semver === ANY) {
        comparator = new Comparator('>=0.0.0')
      }
      high = high || comparator
      low = low || comparator
      if (gtfn(comparator.semver, high.semver, options)) {
        high = comparator
      } else if (ltfn(comparator.semver, low.semver, options)) {
        low = comparator
      }
    })

    // If the edge version comparator has a operator then our version
    // isn't outside it
    if (high.operator === comp || high.operator === ecomp) {
      return false
    }

    // If the lowest version comparator has an operator and our version
    // is less than it then it isn't higher than the range
    if ((!low.operator || low.operator === comp) &&
        ltefn(version, low.semver)) {
      return false
    } else if (low.operator === ecomp && ltfn(version, low.semver)) {
      return false
    }
  }
  return true
}

exports.prerelease = prerelease
function prerelease (version, options) {
  var parsed = parse(version, options)
  return (parsed && parsed.prerelease.length) ? parsed.prerelease : null
}

exports.intersects = intersects
function intersects (r1, r2, options) {
  r1 = new Range(r1, options)
  r2 = new Range(r2, options)
  return r1.intersects(r2)
}

exports.coerce = coerce
function coerce (version) {
  if (version instanceof SemVer) {
    return version
  }

  if (typeof version !== 'string') {
    return null
  }

  var match = version.match(re[COERCE])

  if (match == null) {
    return null
  }

  return parse(match[1] +
    '.' + (match[2] || '0') +
    '.' + (match[3] || '0'))
}

}).call(this,require('_process'))
},{"_process":137}],110:[function(require,module,exports){
'use strict';
var shebangRegex = require('shebang-regex');

module.exports = function (str) {
	var match = str.match(shebangRegex);

	if (!match) {
		return null;
	}

	var arr = match[0].replace(/#! ?/, '').split(' ');
	var bin = arr[0].split('/').pop();
	var arg = arr[1];

	return (bin === 'env' ?
		arg :
		bin + (arg ? ' ' + arg : '')
	);
};

},{"shebang-regex":111}],111:[function(require,module,exports){
'use strict';
module.exports = /^#!.*/;

},{}],112:[function(require,module,exports){
(function (process){
// Note: since nyc uses this module to output coverage, any lines
// that are in the direct sync flow of nyc's outputCoverage are
// ignored, since we can never get coverage for them.
var assert = require('assert')
var signals = require('./signals.js')

var EE = require('events')
/* istanbul ignore if */
if (typeof EE !== 'function') {
  EE = EE.EventEmitter
}

var emitter
if (process.__signal_exit_emitter__) {
  emitter = process.__signal_exit_emitter__
} else {
  emitter = process.__signal_exit_emitter__ = new EE()
  emitter.count = 0
  emitter.emitted = {}
}

// Because this emitter is a global, we have to check to see if a
// previous version of this library failed to enable infinite listeners.
// I know what you're about to say.  But literally everything about
// signal-exit is a compromise with evil.  Get used to it.
if (!emitter.infinite) {
  emitter.setMaxListeners(Infinity)
  emitter.infinite = true
}

module.exports = function (cb, opts) {
  assert.equal(typeof cb, 'function', 'a callback must be provided for exit handler')

  if (loaded === false) {
    load()
  }

  var ev = 'exit'
  if (opts && opts.alwaysLast) {
    ev = 'afterexit'
  }

  var remove = function () {
    emitter.removeListener(ev, cb)
    if (emitter.listeners('exit').length === 0 &&
        emitter.listeners('afterexit').length === 0) {
      unload()
    }
  }
  emitter.on(ev, cb)

  return remove
}

module.exports.unload = unload
function unload () {
  if (!loaded) {
    return
  }
  loaded = false

  signals.forEach(function (sig) {
    try {
      process.removeListener(sig, sigListeners[sig])
    } catch (er) {}
  })
  process.emit = originalProcessEmit
  process.reallyExit = originalProcessReallyExit
  emitter.count -= 1
}

function emit (event, code, signal) {
  if (emitter.emitted[event]) {
    return
  }
  emitter.emitted[event] = true
  emitter.emit(event, code, signal)
}

// { <signal>: <listener fn>, ... }
var sigListeners = {}
signals.forEach(function (sig) {
  sigListeners[sig] = function listener () {
    // If there are no other listeners, an exit is coming!
    // Simplest way: remove us and then re-send the signal.
    // We know that this will kill the process, so we can
    // safely emit now.
    var listeners = process.listeners(sig)
    if (listeners.length === emitter.count) {
      unload()
      emit('exit', null, sig)
      /* istanbul ignore next */
      emit('afterexit', null, sig)
      /* istanbul ignore next */
      process.kill(process.pid, sig)
    }
  }
})

module.exports.signals = function () {
  return signals
}

module.exports.load = load

var loaded = false

function load () {
  if (loaded) {
    return
  }
  loaded = true

  // This is the number of onSignalExit's that are in play.
  // It's important so that we can count the correct number of
  // listeners on signals, and don't wait for the other one to
  // handle it instead of us.
  emitter.count += 1

  signals = signals.filter(function (sig) {
    try {
      process.on(sig, sigListeners[sig])
      return true
    } catch (er) {
      return false
    }
  })

  process.emit = processEmit
  process.reallyExit = processReallyExit
}

var originalProcessReallyExit = process.reallyExit
function processReallyExit (code) {
  process.exitCode = code || 0
  emit('exit', process.exitCode, null)
  /* istanbul ignore next */
  emit('afterexit', process.exitCode, null)
  /* istanbul ignore next */
  originalProcessReallyExit.call(process, process.exitCode)
}

var originalProcessEmit = process.emit
function processEmit (ev, arg) {
  if (ev === 'exit') {
    if (arg !== undefined) {
      process.exitCode = arg
    }
    var ret = originalProcessEmit.apply(this, arguments)
    emit('exit', process.exitCode, null)
    /* istanbul ignore next */
    emit('afterexit', process.exitCode, null)
    return ret
  } else {
    return originalProcessEmit.apply(this, arguments)
  }
}

}).call(this,require('_process'))
},{"./signals.js":113,"_process":137,"assert":120,"events":128}],113:[function(require,module,exports){
(function (process){
// This is not the set of all possible signals.
//
// It IS, however, the set of all signals that trigger
// an exit on either Linux or BSD systems.  Linux is a
// superset of the signal names supported on BSD, and
// the unknown signals just fail to register, so we can
// catch that easily enough.
//
// Don't bother with SIGKILL.  It's uncatchable, which
// means that we can't fire any callbacks anyway.
//
// If a user does happen to register a handler on a non-
// fatal signal like SIGWINCH or something, and then
// exit, it'll end up firing `process.emit('exit')`, so
// the handler will be fired anyway.
//
// SIGBUS, SIGFPE, SIGSEGV and SIGILL, when not raised
// artificially, inherently leave the process in a
// state from which it is not safe to try and enter JS
// listeners.
module.exports = [
  'SIGABRT',
  'SIGALRM',
  'SIGHUP',
  'SIGINT',
  'SIGTERM'
]

if (process.platform !== 'win32') {
  module.exports.push(
    'SIGVTALRM',
    'SIGXCPU',
    'SIGXFSZ',
    'SIGUSR2',
    'SIGTRAP',
    'SIGSYS',
    'SIGQUIT',
    'SIGIOT'
    // should detect profiler and enable/disable accordingly.
    // see #21
    // 'SIGPROF'
  )
}

if (process.platform === 'linux') {
  module.exports.push(
    'SIGIO',
    'SIGPOLL',
    'SIGPWR',
    'SIGSTKFLT',
    'SIGUNUSED'
  )
}

}).call(this,require('_process'))
},{"_process":137}],114:[function(require,module,exports){
'use strict';
module.exports = function (x) {
	var lf = typeof x === 'string' ? '\n' : '\n'.charCodeAt();
	var cr = typeof x === 'string' ? '\r' : '\r'.charCodeAt();

	if (x[x.length - 1] === lf) {
		x = x.slice(0, x.length - 1);
	}

	if (x[x.length - 1] === cr) {
		x = x.slice(0, x.length - 1);
	}

	return x;
};

},{}],115:[function(require,module,exports){
(function (process){
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var osName = _interopDefault(require('os-name'));

function getUserAgent() {
  try {
    return `Node.js/${process.version.substr(1)} (${osName()}; ${process.arch})`;
  } catch (error) {
    if (/wmic os get Caption/.test(error.message)) {
      return "Windows <version undetectable>";
    }

    throw error;
  }
}

exports.getUserAgent = getUserAgent;


}).call(this,require('_process'))
},{"_process":137,"os-name":105}],116:[function(require,module,exports){
(function (process){
module.exports = which
which.sync = whichSync

var isWindows = process.platform === 'win32' ||
    process.env.OSTYPE === 'cygwin' ||
    process.env.OSTYPE === 'msys'

var path = require('path')
var COLON = isWindows ? ';' : ':'
var isexe = require('isexe')

function getNotFoundError (cmd) {
  var er = new Error('not found: ' + cmd)
  er.code = 'ENOENT'

  return er
}

function getPathInfo (cmd, opt) {
  var colon = opt.colon || COLON
  var pathEnv = opt.path || process.env.PATH || ''
  var pathExt = ['']

  pathEnv = pathEnv.split(colon)

  var pathExtExe = ''
  if (isWindows) {
    pathEnv.unshift(process.cwd())
    pathExtExe = (opt.pathExt || process.env.PATHEXT || '.EXE;.CMD;.BAT;.COM')
    pathExt = pathExtExe.split(colon)


    // Always test the cmd itself first.  isexe will check to make sure
    // it's found in the pathExt set.
    if (cmd.indexOf('.') !== -1 && pathExt[0] !== '')
      pathExt.unshift('')
  }

  // If it has a slash, then we don't bother searching the pathenv.
  // just check the file itself, and that's it.
  if (cmd.match(/\//) || isWindows && cmd.match(/\\/))
    pathEnv = ['']

  return {
    env: pathEnv,
    ext: pathExt,
    extExe: pathExtExe
  }
}

function which (cmd, opt, cb) {
  if (typeof opt === 'function') {
    cb = opt
    opt = {}
  }

  var info = getPathInfo(cmd, opt)
  var pathEnv = info.env
  var pathExt = info.ext
  var pathExtExe = info.extExe
  var found = []

  ;(function F (i, l) {
    if (i === l) {
      if (opt.all && found.length)
        return cb(null, found)
      else
        return cb(getNotFoundError(cmd))
    }

    var pathPart = pathEnv[i]
    if (pathPart.charAt(0) === '"' && pathPart.slice(-1) === '"')
      pathPart = pathPart.slice(1, -1)

    var p = path.join(pathPart, cmd)
    if (!pathPart && (/^\.[\\\/]/).test(cmd)) {
      p = cmd.slice(0, 2) + p
    }
    ;(function E (ii, ll) {
      if (ii === ll) return F(i + 1, l)
      var ext = pathExt[ii]
      isexe(p + ext, { pathExt: pathExtExe }, function (er, is) {
        if (!er && is) {
          if (opt.all)
            found.push(p + ext)
          else
            return cb(null, p + ext)
        }
        return E(ii + 1, ll)
      })
    })(0, pathExt.length)
  })(0, pathEnv.length)
}

function whichSync (cmd, opt) {
  opt = opt || {}

  var info = getPathInfo(cmd, opt)
  var pathEnv = info.env
  var pathExt = info.ext
  var pathExtExe = info.extExe
  var found = []

  for (var i = 0, l = pathEnv.length; i < l; i ++) {
    var pathPart = pathEnv[i]
    if (pathPart.charAt(0) === '"' && pathPart.slice(-1) === '"')
      pathPart = pathPart.slice(1, -1)

    var p = path.join(pathPart, cmd)
    if (!pathPart && /^\.[\\\/]/.test(cmd)) {
      p = cmd.slice(0, 2) + p
    }
    for (var j = 0, ll = pathExt.length; j < ll; j ++) {
      var cur = p + pathExt[j]
      var is
      try {
        is = isexe.sync(cur, { pathExt: pathExtExe })
        if (is) {
          if (opt.all)
            found.push(cur)
          else
            return cur
        }
      } catch (ex) {}
    }
  }

  if (opt.all && found.length)
    return found

  if (opt.nothrow)
    return null

  throw getNotFoundError(cmd)
}

}).call(this,require('_process'))
},{"_process":137,"isexe":81,"path":135}],117:[function(require,module,exports){
'use strict';
const os = require('os');
const execa = require('execa');

// Reference: https://www.gaijin.at/en/lstwinver.php
const names = new Map([
	['10.0', '10'],
	['6.3', '8.1'],
	['6.2', '8'],
	['6.1', '7'],
	['6.0', 'Vista'],
	['5.2', 'Server 2003'],
	['5.1', 'XP'],
	['5.0', '2000'],
	['4.9', 'ME'],
	['4.1', '98'],
	['4.0', '95']
]);

const windowsRelease = release => {
	const version = /\d+\.\d/.exec(release || os.release());

	if (release && !version) {
		throw new Error('`release` argument doesn\'t match `n.n`');
	}

	const ver = (version || [])[0];

	// Server 2008, 2012 and 2016 versions are ambiguous with desktop versions and must be detected at runtime.
	// If `release` is omitted or we're on a Windows system, and the version number is an ambiguous version
	// then use `wmic` to get the OS caption: https://msdn.microsoft.com/en-us/library/aa394531(v=vs.85).aspx
	// If the resulting caption contains the year 2008, 2012 or 2016, it is a server version, so return a server OS name.
	if ((!release || release === os.release()) && ['6.1', '6.2', '6.3', '10.0'].includes(ver)) {
		const stdout = execa.sync('wmic', ['os', 'get', 'Caption']).stdout || '';
		const year = (stdout.match(/2008|2012|2016/) || [])[0];
		if (year) {
			return `Server ${year}`;
		}
	}

	return names.get(ver);
};

module.exports = windowsRelease;

},{"execa":75,"os":134}],118:[function(require,module,exports){
// Returns a wrapper function that returns a wrapped callback
// The wrapper function should do some stuff, and return a
// presumably different callback function.
// This makes sure that own properties are retained, so that
// decorations and such are not lost along the way.
module.exports = wrappy
function wrappy (fn, cb) {
  if (fn && cb) return wrappy(fn)(cb)

  if (typeof fn !== 'function')
    throw new TypeError('need wrapper function')

  Object.keys(fn).forEach(function (k) {
    wrapper[k] = fn[k]
  })

  return wrapper

  function wrapper() {
    var args = new Array(arguments.length)
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i]
    }
    var ret = fn.apply(this, args)
    var cb = args[args.length-1]
    if (typeof ret === 'function' && ret !== cb) {
      Object.keys(cb).forEach(function (k) {
        ret[k] = cb[k]
      })
    }
    return ret
  }
}

},{}],119:[function(require,module,exports){

},{}],120:[function(require,module,exports){
(function (global){
'use strict';

var objectAssign = require('object-assign');

// compare and isBuffer taken from https://github.com/feross/buffer/blob/680e9e5e488f22aac27599a57dc844a6315928dd/index.js
// original notice:

/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
function compare(a, b) {
  if (a === b) {
    return 0;
  }

  var x = a.length;
  var y = b.length;

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i];
      y = b[i];
      break;
    }
  }

  if (x < y) {
    return -1;
  }
  if (y < x) {
    return 1;
  }
  return 0;
}
function isBuffer(b) {
  if (global.Buffer && typeof global.Buffer.isBuffer === 'function') {
    return global.Buffer.isBuffer(b);
  }
  return !!(b != null && b._isBuffer);
}

// based on node assert, original notice:
// NB: The URL to the CommonJS spec is kept just for tradition.
//     node-assert has evolved a lot since then, both in API and behavior.

// http://wiki.commonjs.org/wiki/Unit_Testing/1.0
//
// THIS IS NOT TESTED NOR LIKELY TO WORK OUTSIDE V8!
//
// Originally from narwhal.js (http://narwhaljs.org)
// Copyright (c) 2009 Thomas Robinson <280north.com>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the 'Software'), to
// deal in the Software without restriction, including without limitation the
// rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
// sell copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
// ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

var util = require('util/');
var hasOwn = Object.prototype.hasOwnProperty;
var pSlice = Array.prototype.slice;
var functionsHaveNames = (function () {
  return function foo() {}.name === 'foo';
}());
function pToString (obj) {
  return Object.prototype.toString.call(obj);
}
function isView(arrbuf) {
  if (isBuffer(arrbuf)) {
    return false;
  }
  if (typeof global.ArrayBuffer !== 'function') {
    return false;
  }
  if (typeof ArrayBuffer.isView === 'function') {
    return ArrayBuffer.isView(arrbuf);
  }
  if (!arrbuf) {
    return false;
  }
  if (arrbuf instanceof DataView) {
    return true;
  }
  if (arrbuf.buffer && arrbuf.buffer instanceof ArrayBuffer) {
    return true;
  }
  return false;
}
// 1. The assert module provides functions that throw
// AssertionError's when particular conditions are not met. The
// assert module must conform to the following interface.

var assert = module.exports = ok;

// 2. The AssertionError is defined in assert.
// new assert.AssertionError({ message: message,
//                             actual: actual,
//                             expected: expected })

var regex = /\s*function\s+([^\(\s]*)\s*/;
// based on https://github.com/ljharb/function.prototype.name/blob/adeeeec8bfcc6068b187d7d9fb3d5bb1d3a30899/implementation.js
function getName(func) {
  if (!util.isFunction(func)) {
    return;
  }
  if (functionsHaveNames) {
    return func.name;
  }
  var str = func.toString();
  var match = str.match(regex);
  return match && match[1];
}
assert.AssertionError = function AssertionError(options) {
  this.name = 'AssertionError';
  this.actual = options.actual;
  this.expected = options.expected;
  this.operator = options.operator;
  if (options.message) {
    this.message = options.message;
    this.generatedMessage = false;
  } else {
    this.message = getMessage(this);
    this.generatedMessage = true;
  }
  var stackStartFunction = options.stackStartFunction || fail;
  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, stackStartFunction);
  } else {
    // non v8 browsers so we can have a stacktrace
    var err = new Error();
    if (err.stack) {
      var out = err.stack;

      // try to strip useless frames
      var fn_name = getName(stackStartFunction);
      var idx = out.indexOf('\n' + fn_name);
      if (idx >= 0) {
        // once we have located the function frame
        // we need to strip out everything before it (and its line)
        var next_line = out.indexOf('\n', idx + 1);
        out = out.substring(next_line + 1);
      }

      this.stack = out;
    }
  }
};

// assert.AssertionError instanceof Error
util.inherits(assert.AssertionError, Error);

function truncate(s, n) {
  if (typeof s === 'string') {
    return s.length < n ? s : s.slice(0, n);
  } else {
    return s;
  }
}
function inspect(something) {
  if (functionsHaveNames || !util.isFunction(something)) {
    return util.inspect(something);
  }
  var rawname = getName(something);
  var name = rawname ? ': ' + rawname : '';
  return '[Function' +  name + ']';
}
function getMessage(self) {
  return truncate(inspect(self.actual), 128) + ' ' +
         self.operator + ' ' +
         truncate(inspect(self.expected), 128);
}

// At present only the three keys mentioned above are used and
// understood by the spec. Implementations or sub modules can pass
// other keys to the AssertionError's constructor - they will be
// ignored.

// 3. All of the following functions must throw an AssertionError
// when a corresponding condition is not met, with a message that
// may be undefined if not provided.  All assertion methods provide
// both the actual and expected values to the assertion error for
// display purposes.

function fail(actual, expected, message, operator, stackStartFunction) {
  throw new assert.AssertionError({
    message: message,
    actual: actual,
    expected: expected,
    operator: operator,
    stackStartFunction: stackStartFunction
  });
}

// EXTENSION! allows for well behaved errors defined elsewhere.
assert.fail = fail;

// 4. Pure assertion tests whether a value is truthy, as determined
// by !!guard.
// assert.ok(guard, message_opt);
// This statement is equivalent to assert.equal(true, !!guard,
// message_opt);. To test strictly for the value true, use
// assert.strictEqual(true, guard, message_opt);.

function ok(value, message) {
  if (!value) fail(value, true, message, '==', assert.ok);
}
assert.ok = ok;

// 5. The equality assertion tests shallow, coercive equality with
// ==.
// assert.equal(actual, expected, message_opt);

assert.equal = function equal(actual, expected, message) {
  if (actual != expected) fail(actual, expected, message, '==', assert.equal);
};

// 6. The non-equality assertion tests for whether two objects are not equal
// with != assert.notEqual(actual, expected, message_opt);

assert.notEqual = function notEqual(actual, expected, message) {
  if (actual == expected) {
    fail(actual, expected, message, '!=', assert.notEqual);
  }
};

// 7. The equivalence assertion tests a deep equality relation.
// assert.deepEqual(actual, expected, message_opt);

assert.deepEqual = function deepEqual(actual, expected, message) {
  if (!_deepEqual(actual, expected, false)) {
    fail(actual, expected, message, 'deepEqual', assert.deepEqual);
  }
};

assert.deepStrictEqual = function deepStrictEqual(actual, expected, message) {
  if (!_deepEqual(actual, expected, true)) {
    fail(actual, expected, message, 'deepStrictEqual', assert.deepStrictEqual);
  }
};

function _deepEqual(actual, expected, strict, memos) {
  // 7.1. All identical values are equivalent, as determined by ===.
  if (actual === expected) {
    return true;
  } else if (isBuffer(actual) && isBuffer(expected)) {
    return compare(actual, expected) === 0;

  // 7.2. If the expected value is a Date object, the actual value is
  // equivalent if it is also a Date object that refers to the same time.
  } else if (util.isDate(actual) && util.isDate(expected)) {
    return actual.getTime() === expected.getTime();

  // 7.3 If the expected value is a RegExp object, the actual value is
  // equivalent if it is also a RegExp object with the same source and
  // properties (`global`, `multiline`, `lastIndex`, `ignoreCase`).
  } else if (util.isRegExp(actual) && util.isRegExp(expected)) {
    return actual.source === expected.source &&
           actual.global === expected.global &&
           actual.multiline === expected.multiline &&
           actual.lastIndex === expected.lastIndex &&
           actual.ignoreCase === expected.ignoreCase;

  // 7.4. Other pairs that do not both pass typeof value == 'object',
  // equivalence is determined by ==.
  } else if ((actual === null || typeof actual !== 'object') &&
             (expected === null || typeof expected !== 'object')) {
    return strict ? actual === expected : actual == expected;

  // If both values are instances of typed arrays, wrap their underlying
  // ArrayBuffers in a Buffer each to increase performance
  // This optimization requires the arrays to have the same type as checked by
  // Object.prototype.toString (aka pToString). Never perform binary
  // comparisons for Float*Arrays, though, since e.g. +0 === -0 but their
  // bit patterns are not identical.
  } else if (isView(actual) && isView(expected) &&
             pToString(actual) === pToString(expected) &&
             !(actual instanceof Float32Array ||
               actual instanceof Float64Array)) {
    return compare(new Uint8Array(actual.buffer),
                   new Uint8Array(expected.buffer)) === 0;

  // 7.5 For all other Object pairs, including Array objects, equivalence is
  // determined by having the same number of owned properties (as verified
  // with Object.prototype.hasOwnProperty.call), the same set of keys
  // (although not necessarily the same order), equivalent values for every
  // corresponding key, and an identical 'prototype' property. Note: this
  // accounts for both named and indexed properties on Arrays.
  } else if (isBuffer(actual) !== isBuffer(expected)) {
    return false;
  } else {
    memos = memos || {actual: [], expected: []};

    var actualIndex = memos.actual.indexOf(actual);
    if (actualIndex !== -1) {
      if (actualIndex === memos.expected.indexOf(expected)) {
        return true;
      }
    }

    memos.actual.push(actual);
    memos.expected.push(expected);

    return objEquiv(actual, expected, strict, memos);
  }
}

function isArguments(object) {
  return Object.prototype.toString.call(object) == '[object Arguments]';
}

function objEquiv(a, b, strict, actualVisitedObjects) {
  if (a === null || a === undefined || b === null || b === undefined)
    return false;
  // if one is a primitive, the other must be same
  if (util.isPrimitive(a) || util.isPrimitive(b))
    return a === b;
  if (strict && Object.getPrototypeOf(a) !== Object.getPrototypeOf(b))
    return false;
  var aIsArgs = isArguments(a);
  var bIsArgs = isArguments(b);
  if ((aIsArgs && !bIsArgs) || (!aIsArgs && bIsArgs))
    return false;
  if (aIsArgs) {
    a = pSlice.call(a);
    b = pSlice.call(b);
    return _deepEqual(a, b, strict);
  }
  var ka = objectKeys(a);
  var kb = objectKeys(b);
  var key, i;
  // having the same number of owned properties (keys incorporates
  // hasOwnProperty)
  if (ka.length !== kb.length)
    return false;
  //the same set of keys (although not necessarily the same order),
  ka.sort();
  kb.sort();
  //~~~cheap key test
  for (i = ka.length - 1; i >= 0; i--) {
    if (ka[i] !== kb[i])
      return false;
  }
  //equivalent values for every corresponding key, and
  //~~~possibly expensive deep test
  for (i = ka.length - 1; i >= 0; i--) {
    key = ka[i];
    if (!_deepEqual(a[key], b[key], strict, actualVisitedObjects))
      return false;
  }
  return true;
}

// 8. The non-equivalence assertion tests for any deep inequality.
// assert.notDeepEqual(actual, expected, message_opt);

assert.notDeepEqual = function notDeepEqual(actual, expected, message) {
  if (_deepEqual(actual, expected, false)) {
    fail(actual, expected, message, 'notDeepEqual', assert.notDeepEqual);
  }
};

assert.notDeepStrictEqual = notDeepStrictEqual;
function notDeepStrictEqual(actual, expected, message) {
  if (_deepEqual(actual, expected, true)) {
    fail(actual, expected, message, 'notDeepStrictEqual', notDeepStrictEqual);
  }
}


// 9. The strict equality assertion tests strict equality, as determined by ===.
// assert.strictEqual(actual, expected, message_opt);

assert.strictEqual = function strictEqual(actual, expected, message) {
  if (actual !== expected) {
    fail(actual, expected, message, '===', assert.strictEqual);
  }
};

// 10. The strict non-equality assertion tests for strict inequality, as
// determined by !==.  assert.notStrictEqual(actual, expected, message_opt);

assert.notStrictEqual = function notStrictEqual(actual, expected, message) {
  if (actual === expected) {
    fail(actual, expected, message, '!==', assert.notStrictEqual);
  }
};

function expectedException(actual, expected) {
  if (!actual || !expected) {
    return false;
  }

  if (Object.prototype.toString.call(expected) == '[object RegExp]') {
    return expected.test(actual);
  }

  try {
    if (actual instanceof expected) {
      return true;
    }
  } catch (e) {
    // Ignore.  The instanceof check doesn't work for arrow functions.
  }

  if (Error.isPrototypeOf(expected)) {
    return false;
  }

  return expected.call({}, actual) === true;
}

function _tryBlock(block) {
  var error;
  try {
    block();
  } catch (e) {
    error = e;
  }
  return error;
}

function _throws(shouldThrow, block, expected, message) {
  var actual;

  if (typeof block !== 'function') {
    throw new TypeError('"block" argument must be a function');
  }

  if (typeof expected === 'string') {
    message = expected;
    expected = null;
  }

  actual = _tryBlock(block);

  message = (expected && expected.name ? ' (' + expected.name + ').' : '.') +
            (message ? ' ' + message : '.');

  if (shouldThrow && !actual) {
    fail(actual, expected, 'Missing expected exception' + message);
  }

  var userProvidedMessage = typeof message === 'string';
  var isUnwantedException = !shouldThrow && util.isError(actual);
  var isUnexpectedException = !shouldThrow && actual && !expected;

  if ((isUnwantedException &&
      userProvidedMessage &&
      expectedException(actual, expected)) ||
      isUnexpectedException) {
    fail(actual, expected, 'Got unwanted exception' + message);
  }

  if ((shouldThrow && actual && expected &&
      !expectedException(actual, expected)) || (!shouldThrow && actual)) {
    throw actual;
  }
}

// 11. Expected to throw an error:
// assert.throws(block, Error_opt, message_opt);

assert.throws = function(block, /*optional*/error, /*optional*/message) {
  _throws(true, block, error, message);
};

// EXTENSION! This is annoying to write outside this module.
assert.doesNotThrow = function(block, /*optional*/error, /*optional*/message) {
  _throws(false, block, error, message);
};

assert.ifError = function(err) { if (err) throw err; };

// Expose a strict only variant of assert
function strict(value, message) {
  if (!value) fail(value, true, message, '==', strict);
}
assert.strict = objectAssign(strict, assert, {
  equal: assert.strictEqual,
  deepEqual: assert.deepStrictEqual,
  notEqual: assert.notStrictEqual,
  notDeepEqual: assert.notDeepStrictEqual
});
assert.strict.strict = assert.strict;

var objectKeys = Object.keys || function (obj) {
  var keys = [];
  for (var key in obj) {
    if (hasOwn.call(obj, key)) keys.push(key);
  }
  return keys;
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"object-assign":133,"util/":123}],121:[function(require,module,exports){
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}

},{}],122:[function(require,module,exports){
module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}
},{}],123:[function(require,module,exports){
(function (process,global){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var formatRegExp = /%[sdj%]/g;
exports.format = function(f) {
  if (!isString(f)) {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }
      default:
        return x;
    }
  });
  for (var x = args[i]; i < len; x = args[++i]) {
    if (isNull(x) || !isObject(x)) {
      str += ' ' + x;
    } else {
      str += ' ' + inspect(x);
    }
  }
  return str;
};


// Mark that a method should not be used.
// Returns a modified function which warns once by default.
// If --no-deprecation is set, then it is a no-op.
exports.deprecate = function(fn, msg) {
  // Allow for deprecating things in the process of starting up.
  if (isUndefined(global.process)) {
    return function() {
      return exports.deprecate(fn, msg).apply(this, arguments);
    };
  }

  if (process.noDeprecation === true) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (process.throwDeprecation) {
        throw new Error(msg);
      } else if (process.traceDeprecation) {
        console.trace(msg);
      } else {
        console.error(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
};


var debugs = {};
var debugEnviron;
exports.debuglog = function(set) {
  if (isUndefined(debugEnviron))
    debugEnviron = process.env.NODE_DEBUG || '';
  set = set.toUpperCase();
  if (!debugs[set]) {
    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
      var pid = process.pid;
      debugs[set] = function() {
        var msg = exports.format.apply(exports, arguments);
        console.error('%s %d: %s', set, pid, msg);
      };
    } else {
      debugs[set] = function() {};
    }
  }
  return debugs[set];
};


/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */
/* legacy: obj, showHidden, depth, colors*/
function inspect(obj, opts) {
  // default options
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  };
  // legacy...
  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];
  if (isBoolean(opts)) {
    // legacy...
    ctx.showHidden = opts;
  } else if (opts) {
    // got an "options" object
    exports._extend(ctx, opts);
  }
  // set default options
  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined(ctx.depth)) ctx.depth = 2;
  if (isUndefined(ctx.colors)) ctx.colors = false;
  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}
exports.inspect = inspect;


// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
inspect.colors = {
  'bold' : [1, 22],
  'italic' : [3, 23],
  'underline' : [4, 24],
  'inverse' : [7, 27],
  'white' : [37, 39],
  'grey' : [90, 39],
  'black' : [30, 39],
  'blue' : [34, 39],
  'cyan' : [36, 39],
  'green' : [32, 39],
  'magenta' : [35, 39],
  'red' : [31, 39],
  'yellow' : [33, 39]
};

// Don't use 'blue' not visible on cmd.exe
inspect.styles = {
  'special': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  // "name": intentionally not styling
  'regexp': 'red'
};


function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];

  if (style) {
    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
           '\u001b[' + inspect.colors[style][1] + 'm';
  } else {
    return str;
  }
}


function stylizeNoColor(str, styleType) {
  return str;
}


function arrayToHash(array) {
  var hash = {};

  array.forEach(function(val, idx) {
    hash[val] = true;
  });

  return hash;
}


function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect &&
      value &&
      isFunction(value.inspect) &&
      // Filter out the util module, it's inspect function is special
      value.inspect !== exports.inspect &&
      // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);
    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }

  // Primitive types cannot have properties
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }

  // Look up the keys of the object.
  var keys = Object.keys(value);
  var visibleKeys = arrayToHash(keys);

  if (ctx.showHidden) {
    keys = Object.getOwnPropertyNames(value);
  }

  // IE doesn't make error fields non-enumerable
  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
  if (isError(value)
      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
    return formatError(value);
  }

  // Some type of object without properties can be shortcutted.
  if (keys.length === 0) {
    if (isFunction(value)) {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }
    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '', array = false, braces = ['{', '}'];

  // Make Array say that they are Array
  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  }

  // Make functions say that they are functions
  if (isFunction(value)) {
    var n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  }

  // Make RegExps say that they are RegExps
  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  }

  // Make dates with properties first say the date
  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  }

  // Make error with message first say the error
  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);

  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function(key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}


function formatPrimitive(ctx, value) {
  if (isUndefined(value))
    return ctx.stylize('undefined', 'undefined');
  if (isString(value)) {
    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                             .replace(/'/g, "\\'")
                                             .replace(/\\"/g, '"') + '\'';
    return ctx.stylize(simple, 'string');
  }
  if (isNumber(value))
    return ctx.stylize('' + value, 'number');
  if (isBoolean(value))
    return ctx.stylize('' + value, 'boolean');
  // For some reason typeof null is "object", so special case here.
  if (isNull(value))
    return ctx.stylize('null', 'null');
}


function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}


function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          String(i), true));
    } else {
      output.push('');
    }
  }
  keys.forEach(function(key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          key, true));
    }
  });
  return output;
}


function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }
  if (!hasOwnProperty(visibleKeys, key)) {
    name = '[' + key + ']';
  }
  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }
      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function(line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function(line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }
  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify('' + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'")
                 .replace(/\\"/g, '"')
                 .replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}


function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = output.reduce(function(prev, cur) {
    numLinesEst++;
    if (cur.indexOf('\n') >= 0) numLinesEst++;
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] +
           (base === '' ? '' : base + '\n ') +
           ' ' +
           output.join(',\n  ') +
           ' ' +
           braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}


// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
function isArray(ar) {
  return Array.isArray(ar);
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return isObject(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = require('./support/isBuffer');

function objectToString(o) {
  return Object.prototype.toString.call(o);
}


function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}


var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
              'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()),
              pad(d.getMinutes()),
              pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}


// log is just a thin wrapper to console.log that prepends a timestamp
exports.log = function() {
  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
};


/**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */
exports.inherits = require('inherits');

exports._extend = function(origin, add) {
  // Don't do anything if add isn't an object
  if (!add || !isObject(add)) return origin;

  var keys = Object.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
};

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./support/isBuffer":122,"_process":137,"inherits":121}],124:[function(require,module,exports){
'use strict'

exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

// Support decoding URL-safe base64 strings, as Node.js does.
// See: https://en.wikipedia.org/wiki/Base64#URL_applications
revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function getLens (b64) {
  var len = b64.length

  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // Trim off extra bytes after placeholder bytes are found
  // See: https://github.com/beatgammit/base64-js/issues/42
  var validLen = b64.indexOf('=')
  if (validLen === -1) validLen = len

  var placeHoldersLen = validLen === len
    ? 0
    : 4 - (validLen % 4)

  return [validLen, placeHoldersLen]
}

// base64 is 4/3 + up to two characters of the original data
function byteLength (b64) {
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function _byteLength (b64, validLen, placeHoldersLen) {
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function toByteArray (b64) {
  var tmp
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]

  var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen))

  var curByte = 0

  // if there are placeholders, only get up to the last complete 4 chars
  var len = placeHoldersLen > 0
    ? validLen - 4
    : validLen

  var i
  for (i = 0; i < len; i += 4) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 18) |
      (revLookup[b64.charCodeAt(i + 1)] << 12) |
      (revLookup[b64.charCodeAt(i + 2)] << 6) |
      revLookup[b64.charCodeAt(i + 3)]
    arr[curByte++] = (tmp >> 16) & 0xFF
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 2) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 2) |
      (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 1) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 10) |
      (revLookup[b64.charCodeAt(i + 1)] << 4) |
      (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] +
    lookup[num >> 12 & 0x3F] +
    lookup[num >> 6 & 0x3F] +
    lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp =
      ((uint8[i] << 16) & 0xFF0000) +
      ((uint8[i + 1] << 8) & 0xFF00) +
      (uint8[i + 2] & 0xFF)
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(
      uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)
    ))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    parts.push(
      lookup[tmp >> 2] +
      lookup[(tmp << 4) & 0x3F] +
      '=='
    )
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + uint8[len - 1]
    parts.push(
      lookup[tmp >> 10] +
      lookup[(tmp >> 4) & 0x3F] +
      lookup[(tmp << 2) & 0x3F] +
      '='
    )
  }

  return parts.join('')
}

},{}],125:[function(require,module,exports){
arguments[4][119][0].apply(exports,arguments)
},{"dup":119}],126:[function(require,module,exports){
(function (Buffer){
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */

'use strict'

var base64 = require('base64-js')
var ieee754 = require('ieee754')
var customInspectSymbol =
  (typeof Symbol === 'function' && typeof Symbol.for === 'function')
    ? Symbol.for('nodejs.util.inspect.custom')
    : null

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

var K_MAX_LENGTH = 0x7fffffff
exports.kMaxLength = K_MAX_LENGTH

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Print warning and recommend using `buffer` v4.x which has an Object
 *               implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * We report that the browser does not support typed arrays if the are not subclassable
 * using __proto__. Firefox 4-29 lacks support for adding new properties to `Uint8Array`
 * (See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438). IE 10 lacks support
 * for __proto__ and has a buggy typed array implementation.
 */
Buffer.TYPED_ARRAY_SUPPORT = typedArraySupport()

if (!Buffer.TYPED_ARRAY_SUPPORT && typeof console !== 'undefined' &&
    typeof console.error === 'function') {
  console.error(
    'This browser lacks typed array (Uint8Array) support which is required by ' +
    '`buffer` v5.x. Use `buffer` v4.x if you require old browser support.'
  )
}

function typedArraySupport () {
  // Can typed array instances can be augmented?
  try {
    var arr = new Uint8Array(1)
    var proto = { foo: function () { return 42 } }
    Object.setPrototypeOf(proto, Uint8Array.prototype)
    Object.setPrototypeOf(arr, proto)
    return arr.foo() === 42
  } catch (e) {
    return false
  }
}

Object.defineProperty(Buffer.prototype, 'parent', {
  enumerable: true,
  get: function () {
    if (!Buffer.isBuffer(this)) return undefined
    return this.buffer
  }
})

Object.defineProperty(Buffer.prototype, 'offset', {
  enumerable: true,
  get: function () {
    if (!Buffer.isBuffer(this)) return undefined
    return this.byteOffset
  }
})

function createBuffer (length) {
  if (length > K_MAX_LENGTH) {
    throw new RangeError('The value "' + length + '" is invalid for option "size"')
  }
  // Return an augmented `Uint8Array` instance
  var buf = new Uint8Array(length)
  Object.setPrototypeOf(buf, Buffer.prototype)
  return buf
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new TypeError(
        'The "string" argument must be of type string. Received type number'
      )
    }
    return allocUnsafe(arg)
  }
  return from(arg, encodingOrOffset, length)
}

// Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
if (typeof Symbol !== 'undefined' && Symbol.species != null &&
    Buffer[Symbol.species] === Buffer) {
  Object.defineProperty(Buffer, Symbol.species, {
    value: null,
    configurable: true,
    enumerable: false,
    writable: false
  })
}

Buffer.poolSize = 8192 // not used by this implementation

function from (value, encodingOrOffset, length) {
  if (typeof value === 'string') {
    return fromString(value, encodingOrOffset)
  }

  if (ArrayBuffer.isView(value)) {
    return fromArrayLike(value)
  }

  if (value == null) {
    throw new TypeError(
      'The first argument must be one of type string, Buffer, ArrayBuffer, Array, ' +
      'or Array-like Object. Received type ' + (typeof value)
    )
  }

  if (isInstance(value, ArrayBuffer) ||
      (value && isInstance(value.buffer, ArrayBuffer))) {
    return fromArrayBuffer(value, encodingOrOffset, length)
  }

  if (typeof value === 'number') {
    throw new TypeError(
      'The "value" argument must not be of type number. Received type number'
    )
  }

  var valueOf = value.valueOf && value.valueOf()
  if (valueOf != null && valueOf !== value) {
    return Buffer.from(valueOf, encodingOrOffset, length)
  }

  var b = fromObject(value)
  if (b) return b

  if (typeof Symbol !== 'undefined' && Symbol.toPrimitive != null &&
      typeof value[Symbol.toPrimitive] === 'function') {
    return Buffer.from(
      value[Symbol.toPrimitive]('string'), encodingOrOffset, length
    )
  }

  throw new TypeError(
    'The first argument must be one of type string, Buffer, ArrayBuffer, Array, ' +
    'or Array-like Object. Received type ' + (typeof value)
  )
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(value, encodingOrOffset, length)
}

// Note: Change prototype *after* Buffer.from is defined to workaround Chrome bug:
// https://github.com/feross/buffer/pull/148
Object.setPrototypeOf(Buffer.prototype, Uint8Array.prototype)
Object.setPrototypeOf(Buffer, Uint8Array)

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be of type number')
  } else if (size < 0) {
    throw new RangeError('The value "' + size + '" is invalid for option "size"')
  }
}

function alloc (size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(size).fill(fill, encoding)
      : createBuffer(size).fill(fill)
  }
  return createBuffer(size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(size, fill, encoding)
}

function allocUnsafe (size) {
  assertSize(size)
  return createBuffer(size < 0 ? 0 : checked(size) | 0)
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(size)
}

function fromString (string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('Unknown encoding: ' + encoding)
  }

  var length = byteLength(string, encoding) | 0
  var buf = createBuffer(length)

  var actual = buf.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    buf = buf.slice(0, actual)
  }

  return buf
}

function fromArrayLike (array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0
  var buf = createBuffer(length)
  for (var i = 0; i < length; i += 1) {
    buf[i] = array[i] & 255
  }
  return buf
}

function fromArrayBuffer (array, byteOffset, length) {
  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('"offset" is outside of buffer bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('"length" is outside of buffer bounds')
  }

  var buf
  if (byteOffset === undefined && length === undefined) {
    buf = new Uint8Array(array)
  } else if (length === undefined) {
    buf = new Uint8Array(array, byteOffset)
  } else {
    buf = new Uint8Array(array, byteOffset, length)
  }

  // Return an augmented `Uint8Array` instance
  Object.setPrototypeOf(buf, Buffer.prototype)

  return buf
}

function fromObject (obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    var buf = createBuffer(len)

    if (buf.length === 0) {
      return buf
    }

    obj.copy(buf, 0, 0, len)
    return buf
  }

  if (obj.length !== undefined) {
    if (typeof obj.length !== 'number' || numberIsNaN(obj.length)) {
      return createBuffer(0)
    }
    return fromArrayLike(obj)
  }

  if (obj.type === 'Buffer' && Array.isArray(obj.data)) {
    return fromArrayLike(obj.data)
  }
}

function checked (length) {
  // Note: cannot use `length < K_MAX_LENGTH` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= K_MAX_LENGTH) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + K_MAX_LENGTH.toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return b != null && b._isBuffer === true &&
    b !== Buffer.prototype // so Buffer.isBuffer(Buffer.prototype) will be false
}

Buffer.compare = function compare (a, b) {
  if (isInstance(a, Uint8Array)) a = Buffer.from(a, a.offset, a.byteLength)
  if (isInstance(b, Uint8Array)) b = Buffer.from(b, b.offset, b.byteLength)
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError(
      'The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array'
    )
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!Array.isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  var buffer = Buffer.allocUnsafe(length)
  var pos = 0
  for (i = 0; i < list.length; ++i) {
    var buf = list[i]
    if (isInstance(buf, Uint8Array)) {
      buf = Buffer.from(buf)
    }
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos)
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (ArrayBuffer.isView(string) || isInstance(string, ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    throw new TypeError(
      'The "string" argument must be one of type string, Buffer, or ArrayBuffer. ' +
      'Received type ' + typeof string
    )
  }

  var len = string.length
  var mustMatch = (arguments.length > 2 && arguments[2] === true)
  if (!mustMatch && len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) {
          return mustMatch ? -1 : utf8ToBytes(string).length // assume utf8
        }
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// This property is used by `Buffer.isBuffer` (and the `is-buffer` npm package)
// to detect a Buffer instance. It's not possible to use `instanceof Buffer`
// reliably in a browserify context because there could be multiple different
// copies of the 'buffer' package in use. This method works even for Buffer
// instances that were created from another copy of the `buffer` package.
// See: https://github.com/feross/buffer/issues/154
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  var i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  var length = this.length
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.toLocaleString = Buffer.prototype.toString

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  str = this.toString('hex', 0, max).replace(/(.{2})/g, '$1 ').trim()
  if (this.length > max) str += ' ... '
  return '<Buffer ' + str + '>'
}
if (customInspectSymbol) {
  Buffer.prototype[customInspectSymbol] = Buffer.prototype.inspect
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (isInstance(target, Uint8Array)) {
    target = Buffer.from(target, target.offset, target.byteLength)
  }
  if (!Buffer.isBuffer(target)) {
    throw new TypeError(
      'The "target" argument must be one of type Buffer or Uint8Array. ' +
      'Received type ' + (typeof target)
    )
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  var x = thisEnd - thisStart
  var y = end - start
  var len = Math.min(x, y)

  var thisCopy = this.slice(thisStart, thisEnd)
  var targetCopy = target.slice(start, end)

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset // Coerce to Number.
  if (numberIsNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [val], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1
  var arrLength = arr.length
  var valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i
  if (dir) {
    var foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      var found = true
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  var strLen = string.length

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (numberIsNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset >>> 0
    if (isFinite(length)) {
      length = length >>> 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
        : (firstByte > 0xBF) ? 2
          : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; ++i) {
    out += hexSliceLookupTable[buf[i]]
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + (bytes[i + 1] * 256))
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf = this.subarray(start, end)
  // Return an augmented `Uint8Array` instance
  Object.setPrototypeOf(newBuf, Buffer.prototype)

  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  this[offset] = (value >>> 8)
  this[offset + 1] = (value & 0xff)
  return offset + 2
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  this[offset + 3] = (value >>> 24)
  this[offset + 2] = (value >>> 16)
  this[offset + 1] = (value >>> 8)
  this[offset] = (value & 0xff)
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  this[offset] = (value >>> 24)
  this[offset + 1] = (value >>> 16)
  this[offset + 2] = (value >>> 8)
  this[offset + 3] = (value & 0xff)
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    var limit = Math.pow(2, (8 * byteLength) - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    var limit = Math.pow(2, (8 * byteLength) - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  this[offset] = (value >>> 8)
  this[offset + 1] = (value & 0xff)
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  this[offset + 2] = (value >>> 16)
  this[offset + 3] = (value >>> 24)
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  this[offset] = (value >>> 24)
  this[offset + 1] = (value >>> 16)
  this[offset + 2] = (value >>> 8)
  this[offset + 3] = (value & 0xff)
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!Buffer.isBuffer(target)) throw new TypeError('argument should be a Buffer')
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('Index out of range')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start

  if (this === target && typeof Uint8Array.prototype.copyWithin === 'function') {
    // Use built-in when available, missing from IE11
    this.copyWithin(targetStart, start, end)
  } else if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (var i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, end),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if ((encoding === 'utf8' && code < 128) ||
          encoding === 'latin1') {
        // Fast path: If `val` fits into a single byte, use that numeric value.
        val = code
      }
    }
  } else if (typeof val === 'number') {
    val = val & 255
  } else if (typeof val === 'boolean') {
    val = Number(val)
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  var i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : Buffer.from(val, encoding)
    var len = bytes.length
    if (len === 0) {
      throw new TypeError('The value "' + val +
        '" is invalid for argument "value"')
    }
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node takes equal signs as end of the Base64 encoding
  str = str.split('=')[0]
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = str.trim().replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

// ArrayBuffer or Uint8Array objects from other contexts (i.e. iframes) do not pass
// the `instanceof` check but they should be treated as of that type.
// See: https://github.com/feross/buffer/issues/166
function isInstance (obj, type) {
  return obj instanceof type ||
    (obj != null && obj.constructor != null && obj.constructor.name != null &&
      obj.constructor.name === type.name)
}
function numberIsNaN (obj) {
  // For IE11 support
  return obj !== obj // eslint-disable-line no-self-compare
}

// Create lookup table for `toString('hex')`
// See: https://github.com/feross/buffer/issues/219
var hexSliceLookupTable = (function () {
  var alphabet = '0123456789abcdef'
  var table = new Array(256)
  for (var i = 0; i < 16; ++i) {
    var i16 = i * 16
    for (var j = 0; j < 16; ++j) {
      table[i16 + j] = alphabet[i] + alphabet[j]
    }
  }
  return table
})()

}).call(this,require("buffer").Buffer)
},{"base64-js":124,"buffer":126,"ieee754":129}],127:[function(require,module,exports){
(function (Buffer){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.

function isArray(arg) {
  if (Array.isArray) {
    return Array.isArray(arg);
  }
  return objectToString(arg) === '[object Array]';
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = Buffer.isBuffer;

function objectToString(o) {
  return Object.prototype.toString.call(o);
}

}).call(this,{"isBuffer":require("../../is-buffer/index.js")})
},{"../../is-buffer/index.js":131}],128:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var objectCreate = Object.create || objectCreatePolyfill
var objectKeys = Object.keys || objectKeysPolyfill
var bind = Function.prototype.bind || functionBindPolyfill

function EventEmitter() {
  if (!this._events || !Object.prototype.hasOwnProperty.call(this, '_events')) {
    this._events = objectCreate(null);
    this._eventsCount = 0;
  }

  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
var defaultMaxListeners = 10;

var hasDefineProperty;
try {
  var o = {};
  if (Object.defineProperty) Object.defineProperty(o, 'x', { value: 0 });
  hasDefineProperty = o.x === 0;
} catch (err) { hasDefineProperty = false }
if (hasDefineProperty) {
  Object.defineProperty(EventEmitter, 'defaultMaxListeners', {
    enumerable: true,
    get: function() {
      return defaultMaxListeners;
    },
    set: function(arg) {
      // check whether the input is a positive number (whose value is zero or
      // greater and not a NaN).
      if (typeof arg !== 'number' || arg < 0 || arg !== arg)
        throw new TypeError('"defaultMaxListeners" must be a positive number');
      defaultMaxListeners = arg;
    }
  });
} else {
  EventEmitter.defaultMaxListeners = defaultMaxListeners;
}

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
  if (typeof n !== 'number' || n < 0 || isNaN(n))
    throw new TypeError('"n" argument must be a positive number');
  this._maxListeners = n;
  return this;
};

function $getMaxListeners(that) {
  if (that._maxListeners === undefined)
    return EventEmitter.defaultMaxListeners;
  return that._maxListeners;
}

EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
  return $getMaxListeners(this);
};

// These standalone emit* functions are used to optimize calling of event
// handlers for fast cases because emit() itself often has a variable number of
// arguments and can be deoptimized because of that. These functions always have
// the same number of arguments and thus do not get deoptimized, so the code
// inside them can execute faster.
function emitNone(handler, isFn, self) {
  if (isFn)
    handler.call(self);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].call(self);
  }
}
function emitOne(handler, isFn, self, arg1) {
  if (isFn)
    handler.call(self, arg1);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].call(self, arg1);
  }
}
function emitTwo(handler, isFn, self, arg1, arg2) {
  if (isFn)
    handler.call(self, arg1, arg2);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].call(self, arg1, arg2);
  }
}
function emitThree(handler, isFn, self, arg1, arg2, arg3) {
  if (isFn)
    handler.call(self, arg1, arg2, arg3);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].call(self, arg1, arg2, arg3);
  }
}

function emitMany(handler, isFn, self, args) {
  if (isFn)
    handler.apply(self, args);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].apply(self, args);
  }
}

EventEmitter.prototype.emit = function emit(type) {
  var er, handler, len, args, i, events;
  var doError = (type === 'error');

  events = this._events;
  if (events)
    doError = (doError && events.error == null);
  else if (!doError)
    return false;

  // If there is no 'error' event listener then throw.
  if (doError) {
    if (arguments.length > 1)
      er = arguments[1];
    if (er instanceof Error) {
      throw er; // Unhandled 'error' event
    } else {
      // At least give some kind of context to the user
      var err = new Error('Unhandled "error" event. (' + er + ')');
      err.context = er;
      throw err;
    }
    return false;
  }

  handler = events[type];

  if (!handler)
    return false;

  var isFn = typeof handler === 'function';
  len = arguments.length;
  switch (len) {
      // fast cases
    case 1:
      emitNone(handler, isFn, this);
      break;
    case 2:
      emitOne(handler, isFn, this, arguments[1]);
      break;
    case 3:
      emitTwo(handler, isFn, this, arguments[1], arguments[2]);
      break;
    case 4:
      emitThree(handler, isFn, this, arguments[1], arguments[2], arguments[3]);
      break;
      // slower
    default:
      args = new Array(len - 1);
      for (i = 1; i < len; i++)
        args[i - 1] = arguments[i];
      emitMany(handler, isFn, this, args);
  }

  return true;
};

function _addListener(target, type, listener, prepend) {
  var m;
  var events;
  var existing;

  if (typeof listener !== 'function')
    throw new TypeError('"listener" argument must be a function');

  events = target._events;
  if (!events) {
    events = target._events = objectCreate(null);
    target._eventsCount = 0;
  } else {
    // To avoid recursion in the case that type === "newListener"! Before
    // adding it to the listeners, first emit "newListener".
    if (events.newListener) {
      target.emit('newListener', type,
          listener.listener ? listener.listener : listener);

      // Re-assign `events` because a newListener handler could have caused the
      // this._events to be assigned to a new object
      events = target._events;
    }
    existing = events[type];
  }

  if (!existing) {
    // Optimize the case of one listener. Don't need the extra array object.
    existing = events[type] = listener;
    ++target._eventsCount;
  } else {
    if (typeof existing === 'function') {
      // Adding the second element, need to change to array.
      existing = events[type] =
          prepend ? [listener, existing] : [existing, listener];
    } else {
      // If we've already got an array, just append.
      if (prepend) {
        existing.unshift(listener);
      } else {
        existing.push(listener);
      }
    }

    // Check for listener leak
    if (!existing.warned) {
      m = $getMaxListeners(target);
      if (m && m > 0 && existing.length > m) {
        existing.warned = true;
        var w = new Error('Possible EventEmitter memory leak detected. ' +
            existing.length + ' "' + String(type) + '" listeners ' +
            'added. Use emitter.setMaxListeners() to ' +
            'increase limit.');
        w.name = 'MaxListenersExceededWarning';
        w.emitter = target;
        w.type = type;
        w.count = existing.length;
        if (typeof console === 'object' && console.warn) {
          console.warn('%s: %s', w.name, w.message);
        }
      }
    }
  }

  return target;
}

EventEmitter.prototype.addListener = function addListener(type, listener) {
  return _addListener(this, type, listener, false);
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.prependListener =
    function prependListener(type, listener) {
      return _addListener(this, type, listener, true);
    };

function onceWrapper() {
  if (!this.fired) {
    this.target.removeListener(this.type, this.wrapFn);
    this.fired = true;
    switch (arguments.length) {
      case 0:
        return this.listener.call(this.target);
      case 1:
        return this.listener.call(this.target, arguments[0]);
      case 2:
        return this.listener.call(this.target, arguments[0], arguments[1]);
      case 3:
        return this.listener.call(this.target, arguments[0], arguments[1],
            arguments[2]);
      default:
        var args = new Array(arguments.length);
        for (var i = 0; i < args.length; ++i)
          args[i] = arguments[i];
        this.listener.apply(this.target, args);
    }
  }
}

function _onceWrap(target, type, listener) {
  var state = { fired: false, wrapFn: undefined, target: target, type: type, listener: listener };
  var wrapped = bind.call(onceWrapper, state);
  wrapped.listener = listener;
  state.wrapFn = wrapped;
  return wrapped;
}

EventEmitter.prototype.once = function once(type, listener) {
  if (typeof listener !== 'function')
    throw new TypeError('"listener" argument must be a function');
  this.on(type, _onceWrap(this, type, listener));
  return this;
};

EventEmitter.prototype.prependOnceListener =
    function prependOnceListener(type, listener) {
      if (typeof listener !== 'function')
        throw new TypeError('"listener" argument must be a function');
      this.prependListener(type, _onceWrap(this, type, listener));
      return this;
    };

// Emits a 'removeListener' event if and only if the listener was removed.
EventEmitter.prototype.removeListener =
    function removeListener(type, listener) {
      var list, events, position, i, originalListener;

      if (typeof listener !== 'function')
        throw new TypeError('"listener" argument must be a function');

      events = this._events;
      if (!events)
        return this;

      list = events[type];
      if (!list)
        return this;

      if (list === listener || list.listener === listener) {
        if (--this._eventsCount === 0)
          this._events = objectCreate(null);
        else {
          delete events[type];
          if (events.removeListener)
            this.emit('removeListener', type, list.listener || listener);
        }
      } else if (typeof list !== 'function') {
        position = -1;

        for (i = list.length - 1; i >= 0; i--) {
          if (list[i] === listener || list[i].listener === listener) {
            originalListener = list[i].listener;
            position = i;
            break;
          }
        }

        if (position < 0)
          return this;

        if (position === 0)
          list.shift();
        else
          spliceOne(list, position);

        if (list.length === 1)
          events[type] = list[0];

        if (events.removeListener)
          this.emit('removeListener', type, originalListener || listener);
      }

      return this;
    };

EventEmitter.prototype.removeAllListeners =
    function removeAllListeners(type) {
      var listeners, events, i;

      events = this._events;
      if (!events)
        return this;

      // not listening for removeListener, no need to emit
      if (!events.removeListener) {
        if (arguments.length === 0) {
          this._events = objectCreate(null);
          this._eventsCount = 0;
        } else if (events[type]) {
          if (--this._eventsCount === 0)
            this._events = objectCreate(null);
          else
            delete events[type];
        }
        return this;
      }

      // emit removeListener for all listeners on all events
      if (arguments.length === 0) {
        var keys = objectKeys(events);
        var key;
        for (i = 0; i < keys.length; ++i) {
          key = keys[i];
          if (key === 'removeListener') continue;
          this.removeAllListeners(key);
        }
        this.removeAllListeners('removeListener');
        this._events = objectCreate(null);
        this._eventsCount = 0;
        return this;
      }

      listeners = events[type];

      if (typeof listeners === 'function') {
        this.removeListener(type, listeners);
      } else if (listeners) {
        // LIFO order
        for (i = listeners.length - 1; i >= 0; i--) {
          this.removeListener(type, listeners[i]);
        }
      }

      return this;
    };

function _listeners(target, type, unwrap) {
  var events = target._events;

  if (!events)
    return [];

  var evlistener = events[type];
  if (!evlistener)
    return [];

  if (typeof evlistener === 'function')
    return unwrap ? [evlistener.listener || evlistener] : [evlistener];

  return unwrap ? unwrapListeners(evlistener) : arrayClone(evlistener, evlistener.length);
}

EventEmitter.prototype.listeners = function listeners(type) {
  return _listeners(this, type, true);
};

EventEmitter.prototype.rawListeners = function rawListeners(type) {
  return _listeners(this, type, false);
};

EventEmitter.listenerCount = function(emitter, type) {
  if (typeof emitter.listenerCount === 'function') {
    return emitter.listenerCount(type);
  } else {
    return listenerCount.call(emitter, type);
  }
};

EventEmitter.prototype.listenerCount = listenerCount;
function listenerCount(type) {
  var events = this._events;

  if (events) {
    var evlistener = events[type];

    if (typeof evlistener === 'function') {
      return 1;
    } else if (evlistener) {
      return evlistener.length;
    }
  }

  return 0;
}

EventEmitter.prototype.eventNames = function eventNames() {
  return this._eventsCount > 0 ? Reflect.ownKeys(this._events) : [];
};

// About 1.5x faster than the two-arg version of Array#splice().
function spliceOne(list, index) {
  for (var i = index, k = i + 1, n = list.length; k < n; i += 1, k += 1)
    list[i] = list[k];
  list.pop();
}

function arrayClone(arr, n) {
  var copy = new Array(n);
  for (var i = 0; i < n; ++i)
    copy[i] = arr[i];
  return copy;
}

function unwrapListeners(arr) {
  var ret = new Array(arr.length);
  for (var i = 0; i < ret.length; ++i) {
    ret[i] = arr[i].listener || arr[i];
  }
  return ret;
}

function objectCreatePolyfill(proto) {
  var F = function() {};
  F.prototype = proto;
  return new F;
}
function objectKeysPolyfill(obj) {
  var keys = [];
  for (var k in obj) if (Object.prototype.hasOwnProperty.call(obj, k)) {
    keys.push(k);
  }
  return k;
}
function functionBindPolyfill(context) {
  var fn = this;
  return function () {
    return fn.apply(context, arguments);
  };
}

},{}],129:[function(require,module,exports){
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = (e * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = (m * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = ((value * c) - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}

},{}],130:[function(require,module,exports){
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    if (superCtor) {
      ctor.super_ = superCtor
      ctor.prototype = Object.create(superCtor.prototype, {
        constructor: {
          value: ctor,
          enumerable: false,
          writable: true,
          configurable: true
        }
      })
    }
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    if (superCtor) {
      ctor.super_ = superCtor
      var TempCtor = function () {}
      TempCtor.prototype = superCtor.prototype
      ctor.prototype = new TempCtor()
      ctor.prototype.constructor = ctor
    }
  }
}

},{}],131:[function(require,module,exports){
/*!
 * Determine if an object is a Buffer
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */

// The _isBuffer check is for Safari 5-7 support, because it's missing
// Object.prototype.constructor. Remove this eventually
module.exports = function (obj) {
  return obj != null && (isBuffer(obj) || isSlowBuffer(obj) || !!obj._isBuffer)
}

function isBuffer (obj) {
  return !!obj.constructor && typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)
}

// For Node v0.10 support. Remove this eventually.
function isSlowBuffer (obj) {
  return typeof obj.readFloatLE === 'function' && typeof obj.slice === 'function' && isBuffer(obj.slice(0, 0))
}

},{}],132:[function(require,module,exports){
var toString = {}.toString;

module.exports = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};

},{}],133:[function(require,module,exports){
/*
object-assign
(c) Sindre Sorhus
@license MIT
*/

'use strict';
/* eslint-disable no-unused-vars */
var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

function shouldUseNative() {
	try {
		if (!Object.assign) {
			return false;
		}

		// Detect buggy property enumeration order in older V8 versions.

		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
		var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
		test1[5] = 'de';
		if (Object.getOwnPropertyNames(test1)[0] === '5') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test2 = {};
		for (var i = 0; i < 10; i++) {
			test2['_' + String.fromCharCode(i)] = i;
		}
		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
			return test2[n];
		});
		if (order2.join('') !== '0123456789') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test3 = {};
		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
			test3[letter] = letter;
		});
		if (Object.keys(Object.assign({}, test3)).join('') !==
				'abcdefghijklmnopqrst') {
			return false;
		}

		return true;
	} catch (err) {
		// We don't expect any of the above to throw, but better to be safe.
		return false;
	}
}

module.exports = shouldUseNative() ? Object.assign : function (target, source) {
	var from;
	var to = toObject(target);
	var symbols;

	for (var s = 1; s < arguments.length; s++) {
		from = Object(arguments[s]);

		for (var key in from) {
			if (hasOwnProperty.call(from, key)) {
				to[key] = from[key];
			}
		}

		if (getOwnPropertySymbols) {
			symbols = getOwnPropertySymbols(from);
			for (var i = 0; i < symbols.length; i++) {
				if (propIsEnumerable.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}

	return to;
};

},{}],134:[function(require,module,exports){
exports.endianness = function () { return 'LE' };

exports.hostname = function () {
    if (typeof location !== 'undefined') {
        return location.hostname
    }
    else return '';
};

exports.loadavg = function () { return [] };

exports.uptime = function () { return 0 };

exports.freemem = function () {
    return Number.MAX_VALUE;
};

exports.totalmem = function () {
    return Number.MAX_VALUE;
};

exports.cpus = function () { return [] };

exports.type = function () { return 'Browser' };

exports.release = function () {
    if (typeof navigator !== 'undefined') {
        return navigator.appVersion;
    }
    return '';
};

exports.networkInterfaces
= exports.getNetworkInterfaces
= function () { return {} };

exports.arch = function () { return 'javascript' };

exports.platform = function () { return 'browser' };

exports.tmpdir = exports.tmpDir = function () {
    return '/tmp';
};

exports.EOL = '\n';

exports.homedir = function () {
	return '/'
};

},{}],135:[function(require,module,exports){
(function (process){
// .dirname, .basename, and .extname methods are extracted from Node.js v8.11.1,
// backported and transplited with Babel, with backwards-compat fixes

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length - 1; i >= 0; i--) {
    var last = parts[i];
    if (last === '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// path.resolve([from ...], to)
// posix version
exports.resolve = function() {
  var resolvedPath = '',
      resolvedAbsolute = false;

  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    var path = (i >= 0) ? arguments[i] : process.cwd();

    // Skip empty and invalid entries
    if (typeof path !== 'string') {
      throw new TypeError('Arguments to path.resolve must be strings');
    } else if (!path) {
      continue;
    }

    resolvedPath = path + '/' + resolvedPath;
    resolvedAbsolute = path.charAt(0) === '/';
  }

  // At this point the path should be resolved to a full absolute path, but
  // handle relative paths to be safe (might happen when process.cwd() fails)

  // Normalize the path
  resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
};

// path.normalize(path)
// posix version
exports.normalize = function(path) {
  var isAbsolute = exports.isAbsolute(path),
      trailingSlash = substr(path, -1) === '/';

  // Normalize the path
  path = normalizeArray(filter(path.split('/'), function(p) {
    return !!p;
  }), !isAbsolute).join('/');

  if (!path && !isAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }

  return (isAbsolute ? '/' : '') + path;
};

// posix version
exports.isAbsolute = function(path) {
  return path.charAt(0) === '/';
};

// posix version
exports.join = function() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return exports.normalize(filter(paths, function(p, index) {
    if (typeof p !== 'string') {
      throw new TypeError('Arguments to path.join must be strings');
    }
    return p;
  }).join('/'));
};


// path.relative(from, to)
// posix version
exports.relative = function(from, to) {
  from = exports.resolve(from).substr(1);
  to = exports.resolve(to).substr(1);

  function trim(arr) {
    var start = 0;
    for (; start < arr.length; start++) {
      if (arr[start] !== '') break;
    }

    var end = arr.length - 1;
    for (; end >= 0; end--) {
      if (arr[end] !== '') break;
    }

    if (start > end) return [];
    return arr.slice(start, end - start + 1);
  }

  var fromParts = trim(from.split('/'));
  var toParts = trim(to.split('/'));

  var length = Math.min(fromParts.length, toParts.length);
  var samePartsLength = length;
  for (var i = 0; i < length; i++) {
    if (fromParts[i] !== toParts[i]) {
      samePartsLength = i;
      break;
    }
  }

  var outputParts = [];
  for (var i = samePartsLength; i < fromParts.length; i++) {
    outputParts.push('..');
  }

  outputParts = outputParts.concat(toParts.slice(samePartsLength));

  return outputParts.join('/');
};

exports.sep = '/';
exports.delimiter = ':';

exports.dirname = function (path) {
  if (typeof path !== 'string') path = path + '';
  if (path.length === 0) return '.';
  var code = path.charCodeAt(0);
  var hasRoot = code === 47 /*/*/;
  var end = -1;
  var matchedSlash = true;
  for (var i = path.length - 1; i >= 1; --i) {
    code = path.charCodeAt(i);
    if (code === 47 /*/*/) {
        if (!matchedSlash) {
          end = i;
          break;
        }
      } else {
      // We saw the first non-path separator
      matchedSlash = false;
    }
  }

  if (end === -1) return hasRoot ? '/' : '.';
  if (hasRoot && end === 1) {
    // return '//';
    // Backwards-compat fix:
    return '/';
  }
  return path.slice(0, end);
};

function basename(path) {
  if (typeof path !== 'string') path = path + '';

  var start = 0;
  var end = -1;
  var matchedSlash = true;
  var i;

  for (i = path.length - 1; i >= 0; --i) {
    if (path.charCodeAt(i) === 47 /*/*/) {
        // If we reached a path separator that was not part of a set of path
        // separators at the end of the string, stop now
        if (!matchedSlash) {
          start = i + 1;
          break;
        }
      } else if (end === -1) {
      // We saw the first non-path separator, mark this as the end of our
      // path component
      matchedSlash = false;
      end = i + 1;
    }
  }

  if (end === -1) return '';
  return path.slice(start, end);
}

// Uses a mixed approach for backwards-compatibility, as ext behavior changed
// in new Node.js versions, so only basename() above is backported here
exports.basename = function (path, ext) {
  var f = basename(path);
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};

exports.extname = function (path) {
  if (typeof path !== 'string') path = path + '';
  var startDot = -1;
  var startPart = 0;
  var end = -1;
  var matchedSlash = true;
  // Track the state of characters (if any) we see before our first dot and
  // after any path separator we find
  var preDotState = 0;
  for (var i = path.length - 1; i >= 0; --i) {
    var code = path.charCodeAt(i);
    if (code === 47 /*/*/) {
        // If we reached a path separator that was not part of a set of path
        // separators at the end of the string, stop now
        if (!matchedSlash) {
          startPart = i + 1;
          break;
        }
        continue;
      }
    if (end === -1) {
      // We saw the first non-path separator, mark this as the end of our
      // extension
      matchedSlash = false;
      end = i + 1;
    }
    if (code === 46 /*.*/) {
        // If this is our first dot, mark it as the start of our extension
        if (startDot === -1)
          startDot = i;
        else if (preDotState !== 1)
          preDotState = 1;
    } else if (startDot !== -1) {
      // We saw a non-dot and non-path separator before our dot, so we should
      // have a good chance at having a non-empty extension
      preDotState = -1;
    }
  }

  if (startDot === -1 || end === -1 ||
      // We saw a non-dot character immediately before the dot
      preDotState === 0 ||
      // The (right-most) trimmed path component is exactly '..'
      preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
    return '';
  }
  return path.slice(startDot, end);
};

function filter (xs, f) {
    if (xs.filter) return xs.filter(f);
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        if (f(xs[i], i, xs)) res.push(xs[i]);
    }
    return res;
}

// String.prototype.substr - negative index don't work in IE8
var substr = 'ab'.substr(-1) === 'b'
    ? function (str, start, len) { return str.substr(start, len) }
    : function (str, start, len) {
        if (start < 0) start = str.length + start;
        return str.substr(start, len);
    }
;

}).call(this,require('_process'))
},{"_process":137}],136:[function(require,module,exports){
(function (process){
'use strict';

if (typeof process === 'undefined' ||
    !process.version ||
    process.version.indexOf('v0.') === 0 ||
    process.version.indexOf('v1.') === 0 && process.version.indexOf('v1.8.') !== 0) {
  module.exports = { nextTick: nextTick };
} else {
  module.exports = process
}

function nextTick(fn, arg1, arg2, arg3) {
  if (typeof fn !== 'function') {
    throw new TypeError('"callback" argument must be a function');
  }
  var len = arguments.length;
  var args, i;
  switch (len) {
  case 0:
  case 1:
    return process.nextTick(fn);
  case 2:
    return process.nextTick(function afterTickOne() {
      fn.call(null, arg1);
    });
  case 3:
    return process.nextTick(function afterTickTwo() {
      fn.call(null, arg1, arg2);
    });
  case 4:
    return process.nextTick(function afterTickThree() {
      fn.call(null, arg1, arg2, arg3);
    });
  default:
    args = new Array(len - 1);
    i = 0;
    while (i < args.length) {
      args[i++] = arguments[i];
    }
    return process.nextTick(function afterTick() {
      fn.apply(null, args);
    });
  }
}


}).call(this,require('_process'))
},{"_process":137}],137:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
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
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
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
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],138:[function(require,module,exports){
module.exports = require('./lib/_stream_duplex.js');

},{"./lib/_stream_duplex.js":139}],139:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// a duplex stream is just a stream that is both readable and writable.
// Since JS doesn't have multiple prototypal inheritance, this class
// prototypally inherits from Readable, and then parasitically from
// Writable.

'use strict';

/*<replacement>*/

var pna = require('process-nextick-args');
/*</replacement>*/

/*<replacement>*/
var objectKeys = Object.keys || function (obj) {
  var keys = [];
  for (var key in obj) {
    keys.push(key);
  }return keys;
};
/*</replacement>*/

module.exports = Duplex;

/*<replacement>*/
var util = require('core-util-is');
util.inherits = require('inherits');
/*</replacement>*/

var Readable = require('./_stream_readable');
var Writable = require('./_stream_writable');

util.inherits(Duplex, Readable);

{
  // avoid scope creep, the keys array can then be collected
  var keys = objectKeys(Writable.prototype);
  for (var v = 0; v < keys.length; v++) {
    var method = keys[v];
    if (!Duplex.prototype[method]) Duplex.prototype[method] = Writable.prototype[method];
  }
}

function Duplex(options) {
  if (!(this instanceof Duplex)) return new Duplex(options);

  Readable.call(this, options);
  Writable.call(this, options);

  if (options && options.readable === false) this.readable = false;

  if (options && options.writable === false) this.writable = false;

  this.allowHalfOpen = true;
  if (options && options.allowHalfOpen === false) this.allowHalfOpen = false;

  this.once('end', onend);
}

Object.defineProperty(Duplex.prototype, 'writableHighWaterMark', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function () {
    return this._writableState.highWaterMark;
  }
});

// the no-half-open enforcer
function onend() {
  // if we allow half-open state, or if the writable side ended,
  // then we're ok.
  if (this.allowHalfOpen || this._writableState.ended) return;

  // no more data can be written.
  // But allow more writes to happen in this tick.
  pna.nextTick(onEndNT, this);
}

function onEndNT(self) {
  self.end();
}

Object.defineProperty(Duplex.prototype, 'destroyed', {
  get: function () {
    if (this._readableState === undefined || this._writableState === undefined) {
      return false;
    }
    return this._readableState.destroyed && this._writableState.destroyed;
  },
  set: function (value) {
    // we ignore the value if the stream
    // has not been initialized yet
    if (this._readableState === undefined || this._writableState === undefined) {
      return;
    }

    // backward compatibility, the user is explicitly
    // managing destroyed
    this._readableState.destroyed = value;
    this._writableState.destroyed = value;
  }
});

Duplex.prototype._destroy = function (err, cb) {
  this.push(null);
  this.end();

  pna.nextTick(cb, err);
};
},{"./_stream_readable":141,"./_stream_writable":143,"core-util-is":127,"inherits":130,"process-nextick-args":136}],140:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// a passthrough stream.
// basically just the most minimal sort of Transform stream.
// Every written chunk gets output as-is.

'use strict';

module.exports = PassThrough;

var Transform = require('./_stream_transform');

/*<replacement>*/
var util = require('core-util-is');
util.inherits = require('inherits');
/*</replacement>*/

util.inherits(PassThrough, Transform);

function PassThrough(options) {
  if (!(this instanceof PassThrough)) return new PassThrough(options);

  Transform.call(this, options);
}

PassThrough.prototype._transform = function (chunk, encoding, cb) {
  cb(null, chunk);
};
},{"./_stream_transform":142,"core-util-is":127,"inherits":130}],141:[function(require,module,exports){
(function (process,global){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

/*<replacement>*/

var pna = require('process-nextick-args');
/*</replacement>*/

module.exports = Readable;

/*<replacement>*/
var isArray = require('isarray');
/*</replacement>*/

/*<replacement>*/
var Duplex;
/*</replacement>*/

Readable.ReadableState = ReadableState;

/*<replacement>*/
var EE = require('events').EventEmitter;

var EElistenerCount = function (emitter, type) {
  return emitter.listeners(type).length;
};
/*</replacement>*/

/*<replacement>*/
var Stream = require('./internal/streams/stream');
/*</replacement>*/

/*<replacement>*/

var Buffer = require('safe-buffer').Buffer;
var OurUint8Array = global.Uint8Array || function () {};
function _uint8ArrayToBuffer(chunk) {
  return Buffer.from(chunk);
}
function _isUint8Array(obj) {
  return Buffer.isBuffer(obj) || obj instanceof OurUint8Array;
}

/*</replacement>*/

/*<replacement>*/
var util = require('core-util-is');
util.inherits = require('inherits');
/*</replacement>*/

/*<replacement>*/
var debugUtil = require('util');
var debug = void 0;
if (debugUtil && debugUtil.debuglog) {
  debug = debugUtil.debuglog('stream');
} else {
  debug = function () {};
}
/*</replacement>*/

var BufferList = require('./internal/streams/BufferList');
var destroyImpl = require('./internal/streams/destroy');
var StringDecoder;

util.inherits(Readable, Stream);

var kProxyEvents = ['error', 'close', 'destroy', 'pause', 'resume'];

function prependListener(emitter, event, fn) {
  // Sadly this is not cacheable as some libraries bundle their own
  // event emitter implementation with them.
  if (typeof emitter.prependListener === 'function') return emitter.prependListener(event, fn);

  // This is a hack to make sure that our error handler is attached before any
  // userland ones.  NEVER DO THIS. This is here only because this code needs
  // to continue to work with older versions of Node.js that do not include
  // the prependListener() method. The goal is to eventually remove this hack.
  if (!emitter._events || !emitter._events[event]) emitter.on(event, fn);else if (isArray(emitter._events[event])) emitter._events[event].unshift(fn);else emitter._events[event] = [fn, emitter._events[event]];
}

function ReadableState(options, stream) {
  Duplex = Duplex || require('./_stream_duplex');

  options = options || {};

  // Duplex streams are both readable and writable, but share
  // the same options object.
  // However, some cases require setting options to different
  // values for the readable and the writable sides of the duplex stream.
  // These options can be provided separately as readableXXX and writableXXX.
  var isDuplex = stream instanceof Duplex;

  // object stream flag. Used to make read(n) ignore n and to
  // make all the buffer merging and length checks go away
  this.objectMode = !!options.objectMode;

  if (isDuplex) this.objectMode = this.objectMode || !!options.readableObjectMode;

  // the point at which it stops calling _read() to fill the buffer
  // Note: 0 is a valid value, means "don't call _read preemptively ever"
  var hwm = options.highWaterMark;
  var readableHwm = options.readableHighWaterMark;
  var defaultHwm = this.objectMode ? 16 : 16 * 1024;

  if (hwm || hwm === 0) this.highWaterMark = hwm;else if (isDuplex && (readableHwm || readableHwm === 0)) this.highWaterMark = readableHwm;else this.highWaterMark = defaultHwm;

  // cast to ints.
  this.highWaterMark = Math.floor(this.highWaterMark);

  // A linked list is used to store data chunks instead of an array because the
  // linked list can remove elements from the beginning faster than
  // array.shift()
  this.buffer = new BufferList();
  this.length = 0;
  this.pipes = null;
  this.pipesCount = 0;
  this.flowing = null;
  this.ended = false;
  this.endEmitted = false;
  this.reading = false;

  // a flag to be able to tell if the event 'readable'/'data' is emitted
  // immediately, or on a later tick.  We set this to true at first, because
  // any actions that shouldn't happen until "later" should generally also
  // not happen before the first read call.
  this.sync = true;

  // whenever we return null, then we set a flag to say
  // that we're awaiting a 'readable' event emission.
  this.needReadable = false;
  this.emittedReadable = false;
  this.readableListening = false;
  this.resumeScheduled = false;

  // has it been destroyed
  this.destroyed = false;

  // Crypto is kind of old and crusty.  Historically, its default string
  // encoding is 'binary' so we have to make this configurable.
  // Everything else in the universe uses 'utf8', though.
  this.defaultEncoding = options.defaultEncoding || 'utf8';

  // the number of writers that are awaiting a drain event in .pipe()s
  this.awaitDrain = 0;

  // if true, a maybeReadMore has been scheduled
  this.readingMore = false;

  this.decoder = null;
  this.encoding = null;
  if (options.encoding) {
    if (!StringDecoder) StringDecoder = require('string_decoder/').StringDecoder;
    this.decoder = new StringDecoder(options.encoding);
    this.encoding = options.encoding;
  }
}

function Readable(options) {
  Duplex = Duplex || require('./_stream_duplex');

  if (!(this instanceof Readable)) return new Readable(options);

  this._readableState = new ReadableState(options, this);

  // legacy
  this.readable = true;

  if (options) {
    if (typeof options.read === 'function') this._read = options.read;

    if (typeof options.destroy === 'function') this._destroy = options.destroy;
  }

  Stream.call(this);
}

Object.defineProperty(Readable.prototype, 'destroyed', {
  get: function () {
    if (this._readableState === undefined) {
      return false;
    }
    return this._readableState.destroyed;
  },
  set: function (value) {
    // we ignore the value if the stream
    // has not been initialized yet
    if (!this._readableState) {
      return;
    }

    // backward compatibility, the user is explicitly
    // managing destroyed
    this._readableState.destroyed = value;
  }
});

Readable.prototype.destroy = destroyImpl.destroy;
Readable.prototype._undestroy = destroyImpl.undestroy;
Readable.prototype._destroy = function (err, cb) {
  this.push(null);
  cb(err);
};

// Manually shove something into the read() buffer.
// This returns true if the highWaterMark has not been hit yet,
// similar to how Writable.write() returns true if you should
// write() some more.
Readable.prototype.push = function (chunk, encoding) {
  var state = this._readableState;
  var skipChunkCheck;

  if (!state.objectMode) {
    if (typeof chunk === 'string') {
      encoding = encoding || state.defaultEncoding;
      if (encoding !== state.encoding) {
        chunk = Buffer.from(chunk, encoding);
        encoding = '';
      }
      skipChunkCheck = true;
    }
  } else {
    skipChunkCheck = true;
  }

  return readableAddChunk(this, chunk, encoding, false, skipChunkCheck);
};

// Unshift should *always* be something directly out of read()
Readable.prototype.unshift = function (chunk) {
  return readableAddChunk(this, chunk, null, true, false);
};

function readableAddChunk(stream, chunk, encoding, addToFront, skipChunkCheck) {
  var state = stream._readableState;
  if (chunk === null) {
    state.reading = false;
    onEofChunk(stream, state);
  } else {
    var er;
    if (!skipChunkCheck) er = chunkInvalid(state, chunk);
    if (er) {
      stream.emit('error', er);
    } else if (state.objectMode || chunk && chunk.length > 0) {
      if (typeof chunk !== 'string' && !state.objectMode && Object.getPrototypeOf(chunk) !== Buffer.prototype) {
        chunk = _uint8ArrayToBuffer(chunk);
      }

      if (addToFront) {
        if (state.endEmitted) stream.emit('error', new Error('stream.unshift() after end event'));else addChunk(stream, state, chunk, true);
      } else if (state.ended) {
        stream.emit('error', new Error('stream.push() after EOF'));
      } else {
        state.reading = false;
        if (state.decoder && !encoding) {
          chunk = state.decoder.write(chunk);
          if (state.objectMode || chunk.length !== 0) addChunk(stream, state, chunk, false);else maybeReadMore(stream, state);
        } else {
          addChunk(stream, state, chunk, false);
        }
      }
    } else if (!addToFront) {
      state.reading = false;
    }
  }

  return needMoreData(state);
}

function addChunk(stream, state, chunk, addToFront) {
  if (state.flowing && state.length === 0 && !state.sync) {
    stream.emit('data', chunk);
    stream.read(0);
  } else {
    // update the buffer info.
    state.length += state.objectMode ? 1 : chunk.length;
    if (addToFront) state.buffer.unshift(chunk);else state.buffer.push(chunk);

    if (state.needReadable) emitReadable(stream);
  }
  maybeReadMore(stream, state);
}

function chunkInvalid(state, chunk) {
  var er;
  if (!_isUint8Array(chunk) && typeof chunk !== 'string' && chunk !== undefined && !state.objectMode) {
    er = new TypeError('Invalid non-string/buffer chunk');
  }
  return er;
}

// if it's past the high water mark, we can push in some more.
// Also, if we have no data yet, we can stand some
// more bytes.  This is to work around cases where hwm=0,
// such as the repl.  Also, if the push() triggered a
// readable event, and the user called read(largeNumber) such that
// needReadable was set, then we ought to push more, so that another
// 'readable' event will be triggered.
function needMoreData(state) {
  return !state.ended && (state.needReadable || state.length < state.highWaterMark || state.length === 0);
}

Readable.prototype.isPaused = function () {
  return this._readableState.flowing === false;
};

// backwards compatibility.
Readable.prototype.setEncoding = function (enc) {
  if (!StringDecoder) StringDecoder = require('string_decoder/').StringDecoder;
  this._readableState.decoder = new StringDecoder(enc);
  this._readableState.encoding = enc;
  return this;
};

// Don't raise the hwm > 8MB
var MAX_HWM = 0x800000;
function computeNewHighWaterMark(n) {
  if (n >= MAX_HWM) {
    n = MAX_HWM;
  } else {
    // Get the next highest power of 2 to prevent increasing hwm excessively in
    // tiny amounts
    n--;
    n |= n >>> 1;
    n |= n >>> 2;
    n |= n >>> 4;
    n |= n >>> 8;
    n |= n >>> 16;
    n++;
  }
  return n;
}

// This function is designed to be inlinable, so please take care when making
// changes to the function body.
function howMuchToRead(n, state) {
  if (n <= 0 || state.length === 0 && state.ended) return 0;
  if (state.objectMode) return 1;
  if (n !== n) {
    // Only flow one buffer at a time
    if (state.flowing && state.length) return state.buffer.head.data.length;else return state.length;
  }
  // If we're asking for more than the current hwm, then raise the hwm.
  if (n > state.highWaterMark) state.highWaterMark = computeNewHighWaterMark(n);
  if (n <= state.length) return n;
  // Don't have enough
  if (!state.ended) {
    state.needReadable = true;
    return 0;
  }
  return state.length;
}

// you can override either this method, or the async _read(n) below.
Readable.prototype.read = function (n) {
  debug('read', n);
  n = parseInt(n, 10);
  var state = this._readableState;
  var nOrig = n;

  if (n !== 0) state.emittedReadable = false;

  // if we're doing read(0) to trigger a readable event, but we
  // already have a bunch of data in the buffer, then just trigger
  // the 'readable' event and move on.
  if (n === 0 && state.needReadable && (state.length >= state.highWaterMark || state.ended)) {
    debug('read: emitReadable', state.length, state.ended);
    if (state.length === 0 && state.ended) endReadable(this);else emitReadable(this);
    return null;
  }

  n = howMuchToRead(n, state);

  // if we've ended, and we're now clear, then finish it up.
  if (n === 0 && state.ended) {
    if (state.length === 0) endReadable(this);
    return null;
  }

  // All the actual chunk generation logic needs to be
  // *below* the call to _read.  The reason is that in certain
  // synthetic stream cases, such as passthrough streams, _read
  // may be a completely synchronous operation which may change
  // the state of the read buffer, providing enough data when
  // before there was *not* enough.
  //
  // So, the steps are:
  // 1. Figure out what the state of things will be after we do
  // a read from the buffer.
  //
  // 2. If that resulting state will trigger a _read, then call _read.
  // Note that this may be asynchronous, or synchronous.  Yes, it is
  // deeply ugly to write APIs this way, but that still doesn't mean
  // that the Readable class should behave improperly, as streams are
  // designed to be sync/async agnostic.
  // Take note if the _read call is sync or async (ie, if the read call
  // has returned yet), so that we know whether or not it's safe to emit
  // 'readable' etc.
  //
  // 3. Actually pull the requested chunks out of the buffer and return.

  // if we need a readable event, then we need to do some reading.
  var doRead = state.needReadable;
  debug('need readable', doRead);

  // if we currently have less than the highWaterMark, then also read some
  if (state.length === 0 || state.length - n < state.highWaterMark) {
    doRead = true;
    debug('length less than watermark', doRead);
  }

  // however, if we've ended, then there's no point, and if we're already
  // reading, then it's unnecessary.
  if (state.ended || state.reading) {
    doRead = false;
    debug('reading or ended', doRead);
  } else if (doRead) {
    debug('do read');
    state.reading = true;
    state.sync = true;
    // if the length is currently zero, then we *need* a readable event.
    if (state.length === 0) state.needReadable = true;
    // call internal read method
    this._read(state.highWaterMark);
    state.sync = false;
    // If _read pushed data synchronously, then `reading` will be false,
    // and we need to re-evaluate how much data we can return to the user.
    if (!state.reading) n = howMuchToRead(nOrig, state);
  }

  var ret;
  if (n > 0) ret = fromList(n, state);else ret = null;

  if (ret === null) {
    state.needReadable = true;
    n = 0;
  } else {
    state.length -= n;
  }

  if (state.length === 0) {
    // If we have nothing in the buffer, then we want to know
    // as soon as we *do* get something into the buffer.
    if (!state.ended) state.needReadable = true;

    // If we tried to read() past the EOF, then emit end on the next tick.
    if (nOrig !== n && state.ended) endReadable(this);
  }

  if (ret !== null) this.emit('data', ret);

  return ret;
};

function onEofChunk(stream, state) {
  if (state.ended) return;
  if (state.decoder) {
    var chunk = state.decoder.end();
    if (chunk && chunk.length) {
      state.buffer.push(chunk);
      state.length += state.objectMode ? 1 : chunk.length;
    }
  }
  state.ended = true;

  // emit 'readable' now to make sure it gets picked up.
  emitReadable(stream);
}

// Don't emit readable right away in sync mode, because this can trigger
// another read() call => stack overflow.  This way, it might trigger
// a nextTick recursion warning, but that's not so bad.
function emitReadable(stream) {
  var state = stream._readableState;
  state.needReadable = false;
  if (!state.emittedReadable) {
    debug('emitReadable', state.flowing);
    state.emittedReadable = true;
    if (state.sync) pna.nextTick(emitReadable_, stream);else emitReadable_(stream);
  }
}

function emitReadable_(stream) {
  debug('emit readable');
  stream.emit('readable');
  flow(stream);
}

// at this point, the user has presumably seen the 'readable' event,
// and called read() to consume some data.  that may have triggered
// in turn another _read(n) call, in which case reading = true if
// it's in progress.
// However, if we're not ended, or reading, and the length < hwm,
// then go ahead and try to read some more preemptively.
function maybeReadMore(stream, state) {
  if (!state.readingMore) {
    state.readingMore = true;
    pna.nextTick(maybeReadMore_, stream, state);
  }
}

function maybeReadMore_(stream, state) {
  var len = state.length;
  while (!state.reading && !state.flowing && !state.ended && state.length < state.highWaterMark) {
    debug('maybeReadMore read 0');
    stream.read(0);
    if (len === state.length)
      // didn't get any data, stop spinning.
      break;else len = state.length;
  }
  state.readingMore = false;
}

// abstract method.  to be overridden in specific implementation classes.
// call cb(er, data) where data is <= n in length.
// for virtual (non-string, non-buffer) streams, "length" is somewhat
// arbitrary, and perhaps not very meaningful.
Readable.prototype._read = function (n) {
  this.emit('error', new Error('_read() is not implemented'));
};

Readable.prototype.pipe = function (dest, pipeOpts) {
  var src = this;
  var state = this._readableState;

  switch (state.pipesCount) {
    case 0:
      state.pipes = dest;
      break;
    case 1:
      state.pipes = [state.pipes, dest];
      break;
    default:
      state.pipes.push(dest);
      break;
  }
  state.pipesCount += 1;
  debug('pipe count=%d opts=%j', state.pipesCount, pipeOpts);

  var doEnd = (!pipeOpts || pipeOpts.end !== false) && dest !== process.stdout && dest !== process.stderr;

  var endFn = doEnd ? onend : unpipe;
  if (state.endEmitted) pna.nextTick(endFn);else src.once('end', endFn);

  dest.on('unpipe', onunpipe);
  function onunpipe(readable, unpipeInfo) {
    debug('onunpipe');
    if (readable === src) {
      if (unpipeInfo && unpipeInfo.hasUnpiped === false) {
        unpipeInfo.hasUnpiped = true;
        cleanup();
      }
    }
  }

  function onend() {
    debug('onend');
    dest.end();
  }

  // when the dest drains, it reduces the awaitDrain counter
  // on the source.  This would be more elegant with a .once()
  // handler in flow(), but adding and removing repeatedly is
  // too slow.
  var ondrain = pipeOnDrain(src);
  dest.on('drain', ondrain);

  var cleanedUp = false;
  function cleanup() {
    debug('cleanup');
    // cleanup event handlers once the pipe is broken
    dest.removeListener('close', onclose);
    dest.removeListener('finish', onfinish);
    dest.removeListener('drain', ondrain);
    dest.removeListener('error', onerror);
    dest.removeListener('unpipe', onunpipe);
    src.removeListener('end', onend);
    src.removeListener('end', unpipe);
    src.removeListener('data', ondata);

    cleanedUp = true;

    // if the reader is waiting for a drain event from this
    // specific writer, then it would cause it to never start
    // flowing again.
    // So, if this is awaiting a drain, then we just call it now.
    // If we don't know, then assume that we are waiting for one.
    if (state.awaitDrain && (!dest._writableState || dest._writableState.needDrain)) ondrain();
  }

  // If the user pushes more data while we're writing to dest then we'll end up
  // in ondata again. However, we only want to increase awaitDrain once because
  // dest will only emit one 'drain' event for the multiple writes.
  // => Introduce a guard on increasing awaitDrain.
  var increasedAwaitDrain = false;
  src.on('data', ondata);
  function ondata(chunk) {
    debug('ondata');
    increasedAwaitDrain = false;
    var ret = dest.write(chunk);
    if (false === ret && !increasedAwaitDrain) {
      // If the user unpiped during `dest.write()`, it is possible
      // to get stuck in a permanently paused state if that write
      // also returned false.
      // => Check whether `dest` is still a piping destination.
      if ((state.pipesCount === 1 && state.pipes === dest || state.pipesCount > 1 && indexOf(state.pipes, dest) !== -1) && !cleanedUp) {
        debug('false write response, pause', src._readableState.awaitDrain);
        src._readableState.awaitDrain++;
        increasedAwaitDrain = true;
      }
      src.pause();
    }
  }

  // if the dest has an error, then stop piping into it.
  // however, don't suppress the throwing behavior for this.
  function onerror(er) {
    debug('onerror', er);
    unpipe();
    dest.removeListener('error', onerror);
    if (EElistenerCount(dest, 'error') === 0) dest.emit('error', er);
  }

  // Make sure our error handler is attached before userland ones.
  prependListener(dest, 'error', onerror);

  // Both close and finish should trigger unpipe, but only once.
  function onclose() {
    dest.removeListener('finish', onfinish);
    unpipe();
  }
  dest.once('close', onclose);
  function onfinish() {
    debug('onfinish');
    dest.removeListener('close', onclose);
    unpipe();
  }
  dest.once('finish', onfinish);

  function unpipe() {
    debug('unpipe');
    src.unpipe(dest);
  }

  // tell the dest that it's being piped to
  dest.emit('pipe', src);

  // start the flow if it hasn't been started already.
  if (!state.flowing) {
    debug('pipe resume');
    src.resume();
  }

  return dest;
};

function pipeOnDrain(src) {
  return function () {
    var state = src._readableState;
    debug('pipeOnDrain', state.awaitDrain);
    if (state.awaitDrain) state.awaitDrain--;
    if (state.awaitDrain === 0 && EElistenerCount(src, 'data')) {
      state.flowing = true;
      flow(src);
    }
  };
}

Readable.prototype.unpipe = function (dest) {
  var state = this._readableState;
  var unpipeInfo = { hasUnpiped: false };

  // if we're not piping anywhere, then do nothing.
  if (state.pipesCount === 0) return this;

  // just one destination.  most common case.
  if (state.pipesCount === 1) {
    // passed in one, but it's not the right one.
    if (dest && dest !== state.pipes) return this;

    if (!dest) dest = state.pipes;

    // got a match.
    state.pipes = null;
    state.pipesCount = 0;
    state.flowing = false;
    if (dest) dest.emit('unpipe', this, unpipeInfo);
    return this;
  }

  // slow case. multiple pipe destinations.

  if (!dest) {
    // remove all.
    var dests = state.pipes;
    var len = state.pipesCount;
    state.pipes = null;
    state.pipesCount = 0;
    state.flowing = false;

    for (var i = 0; i < len; i++) {
      dests[i].emit('unpipe', this, unpipeInfo);
    }return this;
  }

  // try to find the right one.
  var index = indexOf(state.pipes, dest);
  if (index === -1) return this;

  state.pipes.splice(index, 1);
  state.pipesCount -= 1;
  if (state.pipesCount === 1) state.pipes = state.pipes[0];

  dest.emit('unpipe', this, unpipeInfo);

  return this;
};

// set up data events if they are asked for
// Ensure readable listeners eventually get something
Readable.prototype.on = function (ev, fn) {
  var res = Stream.prototype.on.call(this, ev, fn);

  if (ev === 'data') {
    // Start flowing on next tick if stream isn't explicitly paused
    if (this._readableState.flowing !== false) this.resume();
  } else if (ev === 'readable') {
    var state = this._readableState;
    if (!state.endEmitted && !state.readableListening) {
      state.readableListening = state.needReadable = true;
      state.emittedReadable = false;
      if (!state.reading) {
        pna.nextTick(nReadingNextTick, this);
      } else if (state.length) {
        emitReadable(this);
      }
    }
  }

  return res;
};
Readable.prototype.addListener = Readable.prototype.on;

function nReadingNextTick(self) {
  debug('readable nexttick read 0');
  self.read(0);
}

// pause() and resume() are remnants of the legacy readable stream API
// If the user uses them, then switch into old mode.
Readable.prototype.resume = function () {
  var state = this._readableState;
  if (!state.flowing) {
    debug('resume');
    state.flowing = true;
    resume(this, state);
  }
  return this;
};

function resume(stream, state) {
  if (!state.resumeScheduled) {
    state.resumeScheduled = true;
    pna.nextTick(resume_, stream, state);
  }
}

function resume_(stream, state) {
  if (!state.reading) {
    debug('resume read 0');
    stream.read(0);
  }

  state.resumeScheduled = false;
  state.awaitDrain = 0;
  stream.emit('resume');
  flow(stream);
  if (state.flowing && !state.reading) stream.read(0);
}

Readable.prototype.pause = function () {
  debug('call pause flowing=%j', this._readableState.flowing);
  if (false !== this._readableState.flowing) {
    debug('pause');
    this._readableState.flowing = false;
    this.emit('pause');
  }
  return this;
};

function flow(stream) {
  var state = stream._readableState;
  debug('flow', state.flowing);
  while (state.flowing && stream.read() !== null) {}
}

// wrap an old-style stream as the async data source.
// This is *not* part of the readable stream interface.
// It is an ugly unfortunate mess of history.
Readable.prototype.wrap = function (stream) {
  var _this = this;

  var state = this._readableState;
  var paused = false;

  stream.on('end', function () {
    debug('wrapped end');
    if (state.decoder && !state.ended) {
      var chunk = state.decoder.end();
      if (chunk && chunk.length) _this.push(chunk);
    }

    _this.push(null);
  });

  stream.on('data', function (chunk) {
    debug('wrapped data');
    if (state.decoder) chunk = state.decoder.write(chunk);

    // don't skip over falsy values in objectMode
    if (state.objectMode && (chunk === null || chunk === undefined)) return;else if (!state.objectMode && (!chunk || !chunk.length)) return;

    var ret = _this.push(chunk);
    if (!ret) {
      paused = true;
      stream.pause();
    }
  });

  // proxy all the other methods.
  // important when wrapping filters and duplexes.
  for (var i in stream) {
    if (this[i] === undefined && typeof stream[i] === 'function') {
      this[i] = function (method) {
        return function () {
          return stream[method].apply(stream, arguments);
        };
      }(i);
    }
  }

  // proxy certain important events.
  for (var n = 0; n < kProxyEvents.length; n++) {
    stream.on(kProxyEvents[n], this.emit.bind(this, kProxyEvents[n]));
  }

  // when we try to consume some more bytes, simply unpause the
  // underlying stream.
  this._read = function (n) {
    debug('wrapped _read', n);
    if (paused) {
      paused = false;
      stream.resume();
    }
  };

  return this;
};

Object.defineProperty(Readable.prototype, 'readableHighWaterMark', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function () {
    return this._readableState.highWaterMark;
  }
});

// exposed for testing purposes only.
Readable._fromList = fromList;

// Pluck off n bytes from an array of buffers.
// Length is the combined lengths of all the buffers in the list.
// This function is designed to be inlinable, so please take care when making
// changes to the function body.
function fromList(n, state) {
  // nothing buffered
  if (state.length === 0) return null;

  var ret;
  if (state.objectMode) ret = state.buffer.shift();else if (!n || n >= state.length) {
    // read it all, truncate the list
    if (state.decoder) ret = state.buffer.join('');else if (state.buffer.length === 1) ret = state.buffer.head.data;else ret = state.buffer.concat(state.length);
    state.buffer.clear();
  } else {
    // read part of list
    ret = fromListPartial(n, state.buffer, state.decoder);
  }

  return ret;
}

// Extracts only enough buffered data to satisfy the amount requested.
// This function is designed to be inlinable, so please take care when making
// changes to the function body.
function fromListPartial(n, list, hasStrings) {
  var ret;
  if (n < list.head.data.length) {
    // slice is the same for buffers and strings
    ret = list.head.data.slice(0, n);
    list.head.data = list.head.data.slice(n);
  } else if (n === list.head.data.length) {
    // first chunk is a perfect match
    ret = list.shift();
  } else {
    // result spans more than one buffer
    ret = hasStrings ? copyFromBufferString(n, list) : copyFromBuffer(n, list);
  }
  return ret;
}

// Copies a specified amount of characters from the list of buffered data
// chunks.
// This function is designed to be inlinable, so please take care when making
// changes to the function body.
function copyFromBufferString(n, list) {
  var p = list.head;
  var c = 1;
  var ret = p.data;
  n -= ret.length;
  while (p = p.next) {
    var str = p.data;
    var nb = n > str.length ? str.length : n;
    if (nb === str.length) ret += str;else ret += str.slice(0, n);
    n -= nb;
    if (n === 0) {
      if (nb === str.length) {
        ++c;
        if (p.next) list.head = p.next;else list.head = list.tail = null;
      } else {
        list.head = p;
        p.data = str.slice(nb);
      }
      break;
    }
    ++c;
  }
  list.length -= c;
  return ret;
}

// Copies a specified amount of bytes from the list of buffered data chunks.
// This function is designed to be inlinable, so please take care when making
// changes to the function body.
function copyFromBuffer(n, list) {
  var ret = Buffer.allocUnsafe(n);
  var p = list.head;
  var c = 1;
  p.data.copy(ret);
  n -= p.data.length;
  while (p = p.next) {
    var buf = p.data;
    var nb = n > buf.length ? buf.length : n;
    buf.copy(ret, ret.length - n, 0, nb);
    n -= nb;
    if (n === 0) {
      if (nb === buf.length) {
        ++c;
        if (p.next) list.head = p.next;else list.head = list.tail = null;
      } else {
        list.head = p;
        p.data = buf.slice(nb);
      }
      break;
    }
    ++c;
  }
  list.length -= c;
  return ret;
}

function endReadable(stream) {
  var state = stream._readableState;

  // If we get here before consuming all the bytes, then that is a
  // bug in node.  Should never happen.
  if (state.length > 0) throw new Error('"endReadable()" called on non-empty stream');

  if (!state.endEmitted) {
    state.ended = true;
    pna.nextTick(endReadableNT, state, stream);
  }
}

function endReadableNT(state, stream) {
  // Check that we didn't get one last unshift.
  if (!state.endEmitted && state.length === 0) {
    state.endEmitted = true;
    stream.readable = false;
    stream.emit('end');
  }
}

function indexOf(xs, x) {
  for (var i = 0, l = xs.length; i < l; i++) {
    if (xs[i] === x) return i;
  }
  return -1;
}
}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./_stream_duplex":139,"./internal/streams/BufferList":144,"./internal/streams/destroy":145,"./internal/streams/stream":146,"_process":137,"core-util-is":127,"events":128,"inherits":130,"isarray":132,"process-nextick-args":136,"safe-buffer":147,"string_decoder/":148,"util":125}],142:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// a transform stream is a readable/writable stream where you do
// something with the data.  Sometimes it's called a "filter",
// but that's not a great name for it, since that implies a thing where
// some bits pass through, and others are simply ignored.  (That would
// be a valid example of a transform, of course.)
//
// While the output is causally related to the input, it's not a
// necessarily symmetric or synchronous transformation.  For example,
// a zlib stream might take multiple plain-text writes(), and then
// emit a single compressed chunk some time in the future.
//
// Here's how this works:
//
// The Transform stream has all the aspects of the readable and writable
// stream classes.  When you write(chunk), that calls _write(chunk,cb)
// internally, and returns false if there's a lot of pending writes
// buffered up.  When you call read(), that calls _read(n) until
// there's enough pending readable data buffered up.
//
// In a transform stream, the written data is placed in a buffer.  When
// _read(n) is called, it transforms the queued up data, calling the
// buffered _write cb's as it consumes chunks.  If consuming a single
// written chunk would result in multiple output chunks, then the first
// outputted bit calls the readcb, and subsequent chunks just go into
// the read buffer, and will cause it to emit 'readable' if necessary.
//
// This way, back-pressure is actually determined by the reading side,
// since _read has to be called to start processing a new chunk.  However,
// a pathological inflate type of transform can cause excessive buffering
// here.  For example, imagine a stream where every byte of input is
// interpreted as an integer from 0-255, and then results in that many
// bytes of output.  Writing the 4 bytes {ff,ff,ff,ff} would result in
// 1kb of data being output.  In this case, you could write a very small
// amount of input, and end up with a very large amount of output.  In
// such a pathological inflating mechanism, there'd be no way to tell
// the system to stop doing the transform.  A single 4MB write could
// cause the system to run out of memory.
//
// However, even in such a pathological case, only a single written chunk
// would be consumed, and then the rest would wait (un-transformed) until
// the results of the previous transformed chunk were consumed.

'use strict';

module.exports = Transform;

var Duplex = require('./_stream_duplex');

/*<replacement>*/
var util = require('core-util-is');
util.inherits = require('inherits');
/*</replacement>*/

util.inherits(Transform, Duplex);

function afterTransform(er, data) {
  var ts = this._transformState;
  ts.transforming = false;

  var cb = ts.writecb;

  if (!cb) {
    return this.emit('error', new Error('write callback called multiple times'));
  }

  ts.writechunk = null;
  ts.writecb = null;

  if (data != null) // single equals check for both `null` and `undefined`
    this.push(data);

  cb(er);

  var rs = this._readableState;
  rs.reading = false;
  if (rs.needReadable || rs.length < rs.highWaterMark) {
    this._read(rs.highWaterMark);
  }
}

function Transform(options) {
  if (!(this instanceof Transform)) return new Transform(options);

  Duplex.call(this, options);

  this._transformState = {
    afterTransform: afterTransform.bind(this),
    needTransform: false,
    transforming: false,
    writecb: null,
    writechunk: null,
    writeencoding: null
  };

  // start out asking for a readable event once data is transformed.
  this._readableState.needReadable = true;

  // we have implemented the _read method, and done the other things
  // that Readable wants before the first _read call, so unset the
  // sync guard flag.
  this._readableState.sync = false;

  if (options) {
    if (typeof options.transform === 'function') this._transform = options.transform;

    if (typeof options.flush === 'function') this._flush = options.flush;
  }

  // When the writable side finishes, then flush out anything remaining.
  this.on('prefinish', prefinish);
}

function prefinish() {
  var _this = this;

  if (typeof this._flush === 'function') {
    this._flush(function (er, data) {
      done(_this, er, data);
    });
  } else {
    done(this, null, null);
  }
}

Transform.prototype.push = function (chunk, encoding) {
  this._transformState.needTransform = false;
  return Duplex.prototype.push.call(this, chunk, encoding);
};

// This is the part where you do stuff!
// override this function in implementation classes.
// 'chunk' is an input chunk.
//
// Call `push(newChunk)` to pass along transformed output
// to the readable side.  You may call 'push' zero or more times.
//
// Call `cb(err)` when you are done with this chunk.  If you pass
// an error, then that'll put the hurt on the whole operation.  If you
// never call cb(), then you'll never get another chunk.
Transform.prototype._transform = function (chunk, encoding, cb) {
  throw new Error('_transform() is not implemented');
};

Transform.prototype._write = function (chunk, encoding, cb) {
  var ts = this._transformState;
  ts.writecb = cb;
  ts.writechunk = chunk;
  ts.writeencoding = encoding;
  if (!ts.transforming) {
    var rs = this._readableState;
    if (ts.needTransform || rs.needReadable || rs.length < rs.highWaterMark) this._read(rs.highWaterMark);
  }
};

// Doesn't matter what the args are here.
// _transform does all the work.
// That we got here means that the readable side wants more data.
Transform.prototype._read = function (n) {
  var ts = this._transformState;

  if (ts.writechunk !== null && ts.writecb && !ts.transforming) {
    ts.transforming = true;
    this._transform(ts.writechunk, ts.writeencoding, ts.afterTransform);
  } else {
    // mark that we need a transform, so that any data that comes in
    // will get processed, now that we've asked for it.
    ts.needTransform = true;
  }
};

Transform.prototype._destroy = function (err, cb) {
  var _this2 = this;

  Duplex.prototype._destroy.call(this, err, function (err2) {
    cb(err2);
    _this2.emit('close');
  });
};

function done(stream, er, data) {
  if (er) return stream.emit('error', er);

  if (data != null) // single equals check for both `null` and `undefined`
    stream.push(data);

  // if there's nothing in the write buffer, then that means
  // that nothing more will ever be provided
  if (stream._writableState.length) throw new Error('Calling transform done when ws.length != 0');

  if (stream._transformState.transforming) throw new Error('Calling transform done when still transforming');

  return stream.push(null);
}
},{"./_stream_duplex":139,"core-util-is":127,"inherits":130}],143:[function(require,module,exports){
(function (process,global,setImmediate){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// A bit simpler than readable streams.
// Implement an async ._write(chunk, encoding, cb), and it'll handle all
// the drain event emission and buffering.

'use strict';

/*<replacement>*/

var pna = require('process-nextick-args');
/*</replacement>*/

module.exports = Writable;

/* <replacement> */
function WriteReq(chunk, encoding, cb) {
  this.chunk = chunk;
  this.encoding = encoding;
  this.callback = cb;
  this.next = null;
}

// It seems a linked list but it is not
// there will be only 2 of these for each stream
function CorkedRequest(state) {
  var _this = this;

  this.next = null;
  this.entry = null;
  this.finish = function () {
    onCorkedFinish(_this, state);
  };
}
/* </replacement> */

/*<replacement>*/
var asyncWrite = !process.browser && ['v0.10', 'v0.9.'].indexOf(process.version.slice(0, 5)) > -1 ? setImmediate : pna.nextTick;
/*</replacement>*/

/*<replacement>*/
var Duplex;
/*</replacement>*/

Writable.WritableState = WritableState;

/*<replacement>*/
var util = require('core-util-is');
util.inherits = require('inherits');
/*</replacement>*/

/*<replacement>*/
var internalUtil = {
  deprecate: require('util-deprecate')
};
/*</replacement>*/

/*<replacement>*/
var Stream = require('./internal/streams/stream');
/*</replacement>*/

/*<replacement>*/

var Buffer = require('safe-buffer').Buffer;
var OurUint8Array = global.Uint8Array || function () {};
function _uint8ArrayToBuffer(chunk) {
  return Buffer.from(chunk);
}
function _isUint8Array(obj) {
  return Buffer.isBuffer(obj) || obj instanceof OurUint8Array;
}

/*</replacement>*/

var destroyImpl = require('./internal/streams/destroy');

util.inherits(Writable, Stream);

function nop() {}

function WritableState(options, stream) {
  Duplex = Duplex || require('./_stream_duplex');

  options = options || {};

  // Duplex streams are both readable and writable, but share
  // the same options object.
  // However, some cases require setting options to different
  // values for the readable and the writable sides of the duplex stream.
  // These options can be provided separately as readableXXX and writableXXX.
  var isDuplex = stream instanceof Duplex;

  // object stream flag to indicate whether or not this stream
  // contains buffers or objects.
  this.objectMode = !!options.objectMode;

  if (isDuplex) this.objectMode = this.objectMode || !!options.writableObjectMode;

  // the point at which write() starts returning false
  // Note: 0 is a valid value, means that we always return false if
  // the entire buffer is not flushed immediately on write()
  var hwm = options.highWaterMark;
  var writableHwm = options.writableHighWaterMark;
  var defaultHwm = this.objectMode ? 16 : 16 * 1024;

  if (hwm || hwm === 0) this.highWaterMark = hwm;else if (isDuplex && (writableHwm || writableHwm === 0)) this.highWaterMark = writableHwm;else this.highWaterMark = defaultHwm;

  // cast to ints.
  this.highWaterMark = Math.floor(this.highWaterMark);

  // if _final has been called
  this.finalCalled = false;

  // drain event flag.
  this.needDrain = false;
  // at the start of calling end()
  this.ending = false;
  // when end() has been called, and returned
  this.ended = false;
  // when 'finish' is emitted
  this.finished = false;

  // has it been destroyed
  this.destroyed = false;

  // should we decode strings into buffers before passing to _write?
  // this is here so that some node-core streams can optimize string
  // handling at a lower level.
  var noDecode = options.decodeStrings === false;
  this.decodeStrings = !noDecode;

  // Crypto is kind of old and crusty.  Historically, its default string
  // encoding is 'binary' so we have to make this configurable.
  // Everything else in the universe uses 'utf8', though.
  this.defaultEncoding = options.defaultEncoding || 'utf8';

  // not an actual buffer we keep track of, but a measurement
  // of how much we're waiting to get pushed to some underlying
  // socket or file.
  this.length = 0;

  // a flag to see when we're in the middle of a write.
  this.writing = false;

  // when true all writes will be buffered until .uncork() call
  this.corked = 0;

  // a flag to be able to tell if the onwrite cb is called immediately,
  // or on a later tick.  We set this to true at first, because any
  // actions that shouldn't happen until "later" should generally also
  // not happen before the first write call.
  this.sync = true;

  // a flag to know if we're processing previously buffered items, which
  // may call the _write() callback in the same tick, so that we don't
  // end up in an overlapped onwrite situation.
  this.bufferProcessing = false;

  // the callback that's passed to _write(chunk,cb)
  this.onwrite = function (er) {
    onwrite(stream, er);
  };

  // the callback that the user supplies to write(chunk,encoding,cb)
  this.writecb = null;

  // the amount that is being written when _write is called.
  this.writelen = 0;

  this.bufferedRequest = null;
  this.lastBufferedRequest = null;

  // number of pending user-supplied write callbacks
  // this must be 0 before 'finish' can be emitted
  this.pendingcb = 0;

  // emit prefinish if the only thing we're waiting for is _write cbs
  // This is relevant for synchronous Transform streams
  this.prefinished = false;

  // True if the error was already emitted and should not be thrown again
  this.errorEmitted = false;

  // count buffered requests
  this.bufferedRequestCount = 0;

  // allocate the first CorkedRequest, there is always
  // one allocated and free to use, and we maintain at most two
  this.corkedRequestsFree = new CorkedRequest(this);
}

WritableState.prototype.getBuffer = function getBuffer() {
  var current = this.bufferedRequest;
  var out = [];
  while (current) {
    out.push(current);
    current = current.next;
  }
  return out;
};

(function () {
  try {
    Object.defineProperty(WritableState.prototype, 'buffer', {
      get: internalUtil.deprecate(function () {
        return this.getBuffer();
      }, '_writableState.buffer is deprecated. Use _writableState.getBuffer ' + 'instead.', 'DEP0003')
    });
  } catch (_) {}
})();

// Test _writableState for inheritance to account for Duplex streams,
// whose prototype chain only points to Readable.
var realHasInstance;
if (typeof Symbol === 'function' && Symbol.hasInstance && typeof Function.prototype[Symbol.hasInstance] === 'function') {
  realHasInstance = Function.prototype[Symbol.hasInstance];
  Object.defineProperty(Writable, Symbol.hasInstance, {
    value: function (object) {
      if (realHasInstance.call(this, object)) return true;
      if (this !== Writable) return false;

      return object && object._writableState instanceof WritableState;
    }
  });
} else {
  realHasInstance = function (object) {
    return object instanceof this;
  };
}

function Writable(options) {
  Duplex = Duplex || require('./_stream_duplex');

  // Writable ctor is applied to Duplexes, too.
  // `realHasInstance` is necessary because using plain `instanceof`
  // would return false, as no `_writableState` property is attached.

  // Trying to use the custom `instanceof` for Writable here will also break the
  // Node.js LazyTransform implementation, which has a non-trivial getter for
  // `_writableState` that would lead to infinite recursion.
  if (!realHasInstance.call(Writable, this) && !(this instanceof Duplex)) {
    return new Writable(options);
  }

  this._writableState = new WritableState(options, this);

  // legacy.
  this.writable = true;

  if (options) {
    if (typeof options.write === 'function') this._write = options.write;

    if (typeof options.writev === 'function') this._writev = options.writev;

    if (typeof options.destroy === 'function') this._destroy = options.destroy;

    if (typeof options.final === 'function') this._final = options.final;
  }

  Stream.call(this);
}

// Otherwise people can pipe Writable streams, which is just wrong.
Writable.prototype.pipe = function () {
  this.emit('error', new Error('Cannot pipe, not readable'));
};

function writeAfterEnd(stream, cb) {
  var er = new Error('write after end');
  // TODO: defer error events consistently everywhere, not just the cb
  stream.emit('error', er);
  pna.nextTick(cb, er);
}

// Checks that a user-supplied chunk is valid, especially for the particular
// mode the stream is in. Currently this means that `null` is never accepted
// and undefined/non-string values are only allowed in object mode.
function validChunk(stream, state, chunk, cb) {
  var valid = true;
  var er = false;

  if (chunk === null) {
    er = new TypeError('May not write null values to stream');
  } else if (typeof chunk !== 'string' && chunk !== undefined && !state.objectMode) {
    er = new TypeError('Invalid non-string/buffer chunk');
  }
  if (er) {
    stream.emit('error', er);
    pna.nextTick(cb, er);
    valid = false;
  }
  return valid;
}

Writable.prototype.write = function (chunk, encoding, cb) {
  var state = this._writableState;
  var ret = false;
  var isBuf = !state.objectMode && _isUint8Array(chunk);

  if (isBuf && !Buffer.isBuffer(chunk)) {
    chunk = _uint8ArrayToBuffer(chunk);
  }

  if (typeof encoding === 'function') {
    cb = encoding;
    encoding = null;
  }

  if (isBuf) encoding = 'buffer';else if (!encoding) encoding = state.defaultEncoding;

  if (typeof cb !== 'function') cb = nop;

  if (state.ended) writeAfterEnd(this, cb);else if (isBuf || validChunk(this, state, chunk, cb)) {
    state.pendingcb++;
    ret = writeOrBuffer(this, state, isBuf, chunk, encoding, cb);
  }

  return ret;
};

Writable.prototype.cork = function () {
  var state = this._writableState;

  state.corked++;
};

Writable.prototype.uncork = function () {
  var state = this._writableState;

  if (state.corked) {
    state.corked--;

    if (!state.writing && !state.corked && !state.finished && !state.bufferProcessing && state.bufferedRequest) clearBuffer(this, state);
  }
};

Writable.prototype.setDefaultEncoding = function setDefaultEncoding(encoding) {
  // node::ParseEncoding() requires lower case.
  if (typeof encoding === 'string') encoding = encoding.toLowerCase();
  if (!(['hex', 'utf8', 'utf-8', 'ascii', 'binary', 'base64', 'ucs2', 'ucs-2', 'utf16le', 'utf-16le', 'raw'].indexOf((encoding + '').toLowerCase()) > -1)) throw new TypeError('Unknown encoding: ' + encoding);
  this._writableState.defaultEncoding = encoding;
  return this;
};

function decodeChunk(state, chunk, encoding) {
  if (!state.objectMode && state.decodeStrings !== false && typeof chunk === 'string') {
    chunk = Buffer.from(chunk, encoding);
  }
  return chunk;
}

Object.defineProperty(Writable.prototype, 'writableHighWaterMark', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function () {
    return this._writableState.highWaterMark;
  }
});

// if we're already writing something, then just put this
// in the queue, and wait our turn.  Otherwise, call _write
// If we return false, then we need a drain event, so set that flag.
function writeOrBuffer(stream, state, isBuf, chunk, encoding, cb) {
  if (!isBuf) {
    var newChunk = decodeChunk(state, chunk, encoding);
    if (chunk !== newChunk) {
      isBuf = true;
      encoding = 'buffer';
      chunk = newChunk;
    }
  }
  var len = state.objectMode ? 1 : chunk.length;

  state.length += len;

  var ret = state.length < state.highWaterMark;
  // we must ensure that previous needDrain will not be reset to false.
  if (!ret) state.needDrain = true;

  if (state.writing || state.corked) {
    var last = state.lastBufferedRequest;
    state.lastBufferedRequest = {
      chunk: chunk,
      encoding: encoding,
      isBuf: isBuf,
      callback: cb,
      next: null
    };
    if (last) {
      last.next = state.lastBufferedRequest;
    } else {
      state.bufferedRequest = state.lastBufferedRequest;
    }
    state.bufferedRequestCount += 1;
  } else {
    doWrite(stream, state, false, len, chunk, encoding, cb);
  }

  return ret;
}

function doWrite(stream, state, writev, len, chunk, encoding, cb) {
  state.writelen = len;
  state.writecb = cb;
  state.writing = true;
  state.sync = true;
  if (writev) stream._writev(chunk, state.onwrite);else stream._write(chunk, encoding, state.onwrite);
  state.sync = false;
}

function onwriteError(stream, state, sync, er, cb) {
  --state.pendingcb;

  if (sync) {
    // defer the callback if we are being called synchronously
    // to avoid piling up things on the stack
    pna.nextTick(cb, er);
    // this can emit finish, and it will always happen
    // after error
    pna.nextTick(finishMaybe, stream, state);
    stream._writableState.errorEmitted = true;
    stream.emit('error', er);
  } else {
    // the caller expect this to happen before if
    // it is async
    cb(er);
    stream._writableState.errorEmitted = true;
    stream.emit('error', er);
    // this can emit finish, but finish must
    // always follow error
    finishMaybe(stream, state);
  }
}

function onwriteStateUpdate(state) {
  state.writing = false;
  state.writecb = null;
  state.length -= state.writelen;
  state.writelen = 0;
}

function onwrite(stream, er) {
  var state = stream._writableState;
  var sync = state.sync;
  var cb = state.writecb;

  onwriteStateUpdate(state);

  if (er) onwriteError(stream, state, sync, er, cb);else {
    // Check if we're actually ready to finish, but don't emit yet
    var finished = needFinish(state);

    if (!finished && !state.corked && !state.bufferProcessing && state.bufferedRequest) {
      clearBuffer(stream, state);
    }

    if (sync) {
      /*<replacement>*/
      asyncWrite(afterWrite, stream, state, finished, cb);
      /*</replacement>*/
    } else {
      afterWrite(stream, state, finished, cb);
    }
  }
}

function afterWrite(stream, state, finished, cb) {
  if (!finished) onwriteDrain(stream, state);
  state.pendingcb--;
  cb();
  finishMaybe(stream, state);
}

// Must force callback to be called on nextTick, so that we don't
// emit 'drain' before the write() consumer gets the 'false' return
// value, and has a chance to attach a 'drain' listener.
function onwriteDrain(stream, state) {
  if (state.length === 0 && state.needDrain) {
    state.needDrain = false;
    stream.emit('drain');
  }
}

// if there's something in the buffer waiting, then process it
function clearBuffer(stream, state) {
  state.bufferProcessing = true;
  var entry = state.bufferedRequest;

  if (stream._writev && entry && entry.next) {
    // Fast case, write everything using _writev()
    var l = state.bufferedRequestCount;
    var buffer = new Array(l);
    var holder = state.corkedRequestsFree;
    holder.entry = entry;

    var count = 0;
    var allBuffers = true;
    while (entry) {
      buffer[count] = entry;
      if (!entry.isBuf) allBuffers = false;
      entry = entry.next;
      count += 1;
    }
    buffer.allBuffers = allBuffers;

    doWrite(stream, state, true, state.length, buffer, '', holder.finish);

    // doWrite is almost always async, defer these to save a bit of time
    // as the hot path ends with doWrite
    state.pendingcb++;
    state.lastBufferedRequest = null;
    if (holder.next) {
      state.corkedRequestsFree = holder.next;
      holder.next = null;
    } else {
      state.corkedRequestsFree = new CorkedRequest(state);
    }
    state.bufferedRequestCount = 0;
  } else {
    // Slow case, write chunks one-by-one
    while (entry) {
      var chunk = entry.chunk;
      var encoding = entry.encoding;
      var cb = entry.callback;
      var len = state.objectMode ? 1 : chunk.length;

      doWrite(stream, state, false, len, chunk, encoding, cb);
      entry = entry.next;
      state.bufferedRequestCount--;
      // if we didn't call the onwrite immediately, then
      // it means that we need to wait until it does.
      // also, that means that the chunk and cb are currently
      // being processed, so move the buffer counter past them.
      if (state.writing) {
        break;
      }
    }

    if (entry === null) state.lastBufferedRequest = null;
  }

  state.bufferedRequest = entry;
  state.bufferProcessing = false;
}

Writable.prototype._write = function (chunk, encoding, cb) {
  cb(new Error('_write() is not implemented'));
};

Writable.prototype._writev = null;

Writable.prototype.end = function (chunk, encoding, cb) {
  var state = this._writableState;

  if (typeof chunk === 'function') {
    cb = chunk;
    chunk = null;
    encoding = null;
  } else if (typeof encoding === 'function') {
    cb = encoding;
    encoding = null;
  }

  if (chunk !== null && chunk !== undefined) this.write(chunk, encoding);

  // .end() fully uncorks
  if (state.corked) {
    state.corked = 1;
    this.uncork();
  }

  // ignore unnecessary end() calls.
  if (!state.ending && !state.finished) endWritable(this, state, cb);
};

function needFinish(state) {
  return state.ending && state.length === 0 && state.bufferedRequest === null && !state.finished && !state.writing;
}
function callFinal(stream, state) {
  stream._final(function (err) {
    state.pendingcb--;
    if (err) {
      stream.emit('error', err);
    }
    state.prefinished = true;
    stream.emit('prefinish');
    finishMaybe(stream, state);
  });
}
function prefinish(stream, state) {
  if (!state.prefinished && !state.finalCalled) {
    if (typeof stream._final === 'function') {
      state.pendingcb++;
      state.finalCalled = true;
      pna.nextTick(callFinal, stream, state);
    } else {
      state.prefinished = true;
      stream.emit('prefinish');
    }
  }
}

function finishMaybe(stream, state) {
  var need = needFinish(state);
  if (need) {
    prefinish(stream, state);
    if (state.pendingcb === 0) {
      state.finished = true;
      stream.emit('finish');
    }
  }
  return need;
}

function endWritable(stream, state, cb) {
  state.ending = true;
  finishMaybe(stream, state);
  if (cb) {
    if (state.finished) pna.nextTick(cb);else stream.once('finish', cb);
  }
  state.ended = true;
  stream.writable = false;
}

function onCorkedFinish(corkReq, state, err) {
  var entry = corkReq.entry;
  corkReq.entry = null;
  while (entry) {
    var cb = entry.callback;
    state.pendingcb--;
    cb(err);
    entry = entry.next;
  }
  if (state.corkedRequestsFree) {
    state.corkedRequestsFree.next = corkReq;
  } else {
    state.corkedRequestsFree = corkReq;
  }
}

Object.defineProperty(Writable.prototype, 'destroyed', {
  get: function () {
    if (this._writableState === undefined) {
      return false;
    }
    return this._writableState.destroyed;
  },
  set: function (value) {
    // we ignore the value if the stream
    // has not been initialized yet
    if (!this._writableState) {
      return;
    }

    // backward compatibility, the user is explicitly
    // managing destroyed
    this._writableState.destroyed = value;
  }
});

Writable.prototype.destroy = destroyImpl.destroy;
Writable.prototype._undestroy = destroyImpl.undestroy;
Writable.prototype._destroy = function (err, cb) {
  this.end();
  cb(err);
};
}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("timers").setImmediate)
},{"./_stream_duplex":139,"./internal/streams/destroy":145,"./internal/streams/stream":146,"_process":137,"core-util-is":127,"inherits":130,"process-nextick-args":136,"safe-buffer":147,"timers":154,"util-deprecate":155}],144:[function(require,module,exports){
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Buffer = require('safe-buffer').Buffer;
var util = require('util');

function copyBuffer(src, target, offset) {
  src.copy(target, offset);
}

module.exports = function () {
  function BufferList() {
    _classCallCheck(this, BufferList);

    this.head = null;
    this.tail = null;
    this.length = 0;
  }

  BufferList.prototype.push = function push(v) {
    var entry = { data: v, next: null };
    if (this.length > 0) this.tail.next = entry;else this.head = entry;
    this.tail = entry;
    ++this.length;
  };

  BufferList.prototype.unshift = function unshift(v) {
    var entry = { data: v, next: this.head };
    if (this.length === 0) this.tail = entry;
    this.head = entry;
    ++this.length;
  };

  BufferList.prototype.shift = function shift() {
    if (this.length === 0) return;
    var ret = this.head.data;
    if (this.length === 1) this.head = this.tail = null;else this.head = this.head.next;
    --this.length;
    return ret;
  };

  BufferList.prototype.clear = function clear() {
    this.head = this.tail = null;
    this.length = 0;
  };

  BufferList.prototype.join = function join(s) {
    if (this.length === 0) return '';
    var p = this.head;
    var ret = '' + p.data;
    while (p = p.next) {
      ret += s + p.data;
    }return ret;
  };

  BufferList.prototype.concat = function concat(n) {
    if (this.length === 0) return Buffer.alloc(0);
    if (this.length === 1) return this.head.data;
    var ret = Buffer.allocUnsafe(n >>> 0);
    var p = this.head;
    var i = 0;
    while (p) {
      copyBuffer(p.data, ret, i);
      i += p.data.length;
      p = p.next;
    }
    return ret;
  };

  return BufferList;
}();

if (util && util.inspect && util.inspect.custom) {
  module.exports.prototype[util.inspect.custom] = function () {
    var obj = util.inspect({ length: this.length });
    return this.constructor.name + ' ' + obj;
  };
}
},{"safe-buffer":147,"util":125}],145:[function(require,module,exports){
'use strict';

/*<replacement>*/

var pna = require('process-nextick-args');
/*</replacement>*/

// undocumented cb() API, needed for core, not for public API
function destroy(err, cb) {
  var _this = this;

  var readableDestroyed = this._readableState && this._readableState.destroyed;
  var writableDestroyed = this._writableState && this._writableState.destroyed;

  if (readableDestroyed || writableDestroyed) {
    if (cb) {
      cb(err);
    } else if (err && (!this._writableState || !this._writableState.errorEmitted)) {
      pna.nextTick(emitErrorNT, this, err);
    }
    return this;
  }

  // we set destroyed to true before firing error callbacks in order
  // to make it re-entrance safe in case destroy() is called within callbacks

  if (this._readableState) {
    this._readableState.destroyed = true;
  }

  // if this is a duplex stream mark the writable part as destroyed as well
  if (this._writableState) {
    this._writableState.destroyed = true;
  }

  this._destroy(err || null, function (err) {
    if (!cb && err) {
      pna.nextTick(emitErrorNT, _this, err);
      if (_this._writableState) {
        _this._writableState.errorEmitted = true;
      }
    } else if (cb) {
      cb(err);
    }
  });

  return this;
}

function undestroy() {
  if (this._readableState) {
    this._readableState.destroyed = false;
    this._readableState.reading = false;
    this._readableState.ended = false;
    this._readableState.endEmitted = false;
  }

  if (this._writableState) {
    this._writableState.destroyed = false;
    this._writableState.ended = false;
    this._writableState.ending = false;
    this._writableState.finished = false;
    this._writableState.errorEmitted = false;
  }
}

function emitErrorNT(self, err) {
  self.emit('error', err);
}

module.exports = {
  destroy: destroy,
  undestroy: undestroy
};
},{"process-nextick-args":136}],146:[function(require,module,exports){
module.exports = require('events').EventEmitter;

},{"events":128}],147:[function(require,module,exports){
/* eslint-disable node/no-deprecated-api */
var buffer = require('buffer')
var Buffer = buffer.Buffer

// alternative to using Object.keys for old browsers
function copyProps (src, dst) {
  for (var key in src) {
    dst[key] = src[key]
  }
}
if (Buffer.from && Buffer.alloc && Buffer.allocUnsafe && Buffer.allocUnsafeSlow) {
  module.exports = buffer
} else {
  // Copy properties from require('buffer')
  copyProps(buffer, exports)
  exports.Buffer = SafeBuffer
}

function SafeBuffer (arg, encodingOrOffset, length) {
  return Buffer(arg, encodingOrOffset, length)
}

// Copy static methods from Buffer
copyProps(Buffer, SafeBuffer)

SafeBuffer.from = function (arg, encodingOrOffset, length) {
  if (typeof arg === 'number') {
    throw new TypeError('Argument must not be a number')
  }
  return Buffer(arg, encodingOrOffset, length)
}

SafeBuffer.alloc = function (size, fill, encoding) {
  if (typeof size !== 'number') {
    throw new TypeError('Argument must be a number')
  }
  var buf = Buffer(size)
  if (fill !== undefined) {
    if (typeof encoding === 'string') {
      buf.fill(fill, encoding)
    } else {
      buf.fill(fill)
    }
  } else {
    buf.fill(0)
  }
  return buf
}

SafeBuffer.allocUnsafe = function (size) {
  if (typeof size !== 'number') {
    throw new TypeError('Argument must be a number')
  }
  return Buffer(size)
}

SafeBuffer.allocUnsafeSlow = function (size) {
  if (typeof size !== 'number') {
    throw new TypeError('Argument must be a number')
  }
  return buffer.SlowBuffer(size)
}

},{"buffer":126}],148:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

/*<replacement>*/

var Buffer = require('safe-buffer').Buffer;
/*</replacement>*/

var isEncoding = Buffer.isEncoding || function (encoding) {
  encoding = '' + encoding;
  switch (encoding && encoding.toLowerCase()) {
    case 'hex':case 'utf8':case 'utf-8':case 'ascii':case 'binary':case 'base64':case 'ucs2':case 'ucs-2':case 'utf16le':case 'utf-16le':case 'raw':
      return true;
    default:
      return false;
  }
};

function _normalizeEncoding(enc) {
  if (!enc) return 'utf8';
  var retried;
  while (true) {
    switch (enc) {
      case 'utf8':
      case 'utf-8':
        return 'utf8';
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return 'utf16le';
      case 'latin1':
      case 'binary':
        return 'latin1';
      case 'base64':
      case 'ascii':
      case 'hex':
        return enc;
      default:
        if (retried) return; // undefined
        enc = ('' + enc).toLowerCase();
        retried = true;
    }
  }
};

// Do not cache `Buffer.isEncoding` when checking encoding names as some
// modules monkey-patch it to support additional encodings
function normalizeEncoding(enc) {
  var nenc = _normalizeEncoding(enc);
  if (typeof nenc !== 'string' && (Buffer.isEncoding === isEncoding || !isEncoding(enc))) throw new Error('Unknown encoding: ' + enc);
  return nenc || enc;
}

// StringDecoder provides an interface for efficiently splitting a series of
// buffers into a series of JS strings without breaking apart multi-byte
// characters.
exports.StringDecoder = StringDecoder;
function StringDecoder(encoding) {
  this.encoding = normalizeEncoding(encoding);
  var nb;
  switch (this.encoding) {
    case 'utf16le':
      this.text = utf16Text;
      this.end = utf16End;
      nb = 4;
      break;
    case 'utf8':
      this.fillLast = utf8FillLast;
      nb = 4;
      break;
    case 'base64':
      this.text = base64Text;
      this.end = base64End;
      nb = 3;
      break;
    default:
      this.write = simpleWrite;
      this.end = simpleEnd;
      return;
  }
  this.lastNeed = 0;
  this.lastTotal = 0;
  this.lastChar = Buffer.allocUnsafe(nb);
}

StringDecoder.prototype.write = function (buf) {
  if (buf.length === 0) return '';
  var r;
  var i;
  if (this.lastNeed) {
    r = this.fillLast(buf);
    if (r === undefined) return '';
    i = this.lastNeed;
    this.lastNeed = 0;
  } else {
    i = 0;
  }
  if (i < buf.length) return r ? r + this.text(buf, i) : this.text(buf, i);
  return r || '';
};

StringDecoder.prototype.end = utf8End;

// Returns only complete characters in a Buffer
StringDecoder.prototype.text = utf8Text;

// Attempts to complete a partial non-UTF-8 character using bytes from a Buffer
StringDecoder.prototype.fillLast = function (buf) {
  if (this.lastNeed <= buf.length) {
    buf.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, this.lastNeed);
    return this.lastChar.toString(this.encoding, 0, this.lastTotal);
  }
  buf.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, buf.length);
  this.lastNeed -= buf.length;
};

// Checks the type of a UTF-8 byte, whether it's ASCII, a leading byte, or a
// continuation byte. If an invalid byte is detected, -2 is returned.
function utf8CheckByte(byte) {
  if (byte <= 0x7F) return 0;else if (byte >> 5 === 0x06) return 2;else if (byte >> 4 === 0x0E) return 3;else if (byte >> 3 === 0x1E) return 4;
  return byte >> 6 === 0x02 ? -1 : -2;
}

// Checks at most 3 bytes at the end of a Buffer in order to detect an
// incomplete multi-byte UTF-8 character. The total number of bytes (2, 3, or 4)
// needed to complete the UTF-8 character (if applicable) are returned.
function utf8CheckIncomplete(self, buf, i) {
  var j = buf.length - 1;
  if (j < i) return 0;
  var nb = utf8CheckByte(buf[j]);
  if (nb >= 0) {
    if (nb > 0) self.lastNeed = nb - 1;
    return nb;
  }
  if (--j < i || nb === -2) return 0;
  nb = utf8CheckByte(buf[j]);
  if (nb >= 0) {
    if (nb > 0) self.lastNeed = nb - 2;
    return nb;
  }
  if (--j < i || nb === -2) return 0;
  nb = utf8CheckByte(buf[j]);
  if (nb >= 0) {
    if (nb > 0) {
      if (nb === 2) nb = 0;else self.lastNeed = nb - 3;
    }
    return nb;
  }
  return 0;
}

// Validates as many continuation bytes for a multi-byte UTF-8 character as
// needed or are available. If we see a non-continuation byte where we expect
// one, we "replace" the validated continuation bytes we've seen so far with
// a single UTF-8 replacement character ('\ufffd'), to match v8's UTF-8 decoding
// behavior. The continuation byte check is included three times in the case
// where all of the continuation bytes for a character exist in the same buffer.
// It is also done this way as a slight performance increase instead of using a
// loop.
function utf8CheckExtraBytes(self, buf, p) {
  if ((buf[0] & 0xC0) !== 0x80) {
    self.lastNeed = 0;
    return '\ufffd';
  }
  if (self.lastNeed > 1 && buf.length > 1) {
    if ((buf[1] & 0xC0) !== 0x80) {
      self.lastNeed = 1;
      return '\ufffd';
    }
    if (self.lastNeed > 2 && buf.length > 2) {
      if ((buf[2] & 0xC0) !== 0x80) {
        self.lastNeed = 2;
        return '\ufffd';
      }
    }
  }
}

// Attempts to complete a multi-byte UTF-8 character using bytes from a Buffer.
function utf8FillLast(buf) {
  var p = this.lastTotal - this.lastNeed;
  var r = utf8CheckExtraBytes(this, buf, p);
  if (r !== undefined) return r;
  if (this.lastNeed <= buf.length) {
    buf.copy(this.lastChar, p, 0, this.lastNeed);
    return this.lastChar.toString(this.encoding, 0, this.lastTotal);
  }
  buf.copy(this.lastChar, p, 0, buf.length);
  this.lastNeed -= buf.length;
}

// Returns all complete UTF-8 characters in a Buffer. If the Buffer ended on a
// partial character, the character's bytes are buffered until the required
// number of bytes are available.
function utf8Text(buf, i) {
  var total = utf8CheckIncomplete(this, buf, i);
  if (!this.lastNeed) return buf.toString('utf8', i);
  this.lastTotal = total;
  var end = buf.length - (total - this.lastNeed);
  buf.copy(this.lastChar, 0, end);
  return buf.toString('utf8', i, end);
}

// For UTF-8, a replacement character is added when ending on a partial
// character.
function utf8End(buf) {
  var r = buf && buf.length ? this.write(buf) : '';
  if (this.lastNeed) return r + '\ufffd';
  return r;
}

// UTF-16LE typically needs two bytes per character, but even if we have an even
// number of bytes available, we need to check if we end on a leading/high
// surrogate. In that case, we need to wait for the next two bytes in order to
// decode the last character properly.
function utf16Text(buf, i) {
  if ((buf.length - i) % 2 === 0) {
    var r = buf.toString('utf16le', i);
    if (r) {
      var c = r.charCodeAt(r.length - 1);
      if (c >= 0xD800 && c <= 0xDBFF) {
        this.lastNeed = 2;
        this.lastTotal = 4;
        this.lastChar[0] = buf[buf.length - 2];
        this.lastChar[1] = buf[buf.length - 1];
        return r.slice(0, -1);
      }
    }
    return r;
  }
  this.lastNeed = 1;
  this.lastTotal = 2;
  this.lastChar[0] = buf[buf.length - 1];
  return buf.toString('utf16le', i, buf.length - 1);
}

// For UTF-16LE we do not explicitly append special replacement characters if we
// end on a partial character, we simply let v8 handle that.
function utf16End(buf) {
  var r = buf && buf.length ? this.write(buf) : '';
  if (this.lastNeed) {
    var end = this.lastTotal - this.lastNeed;
    return r + this.lastChar.toString('utf16le', 0, end);
  }
  return r;
}

function base64Text(buf, i) {
  var n = (buf.length - i) % 3;
  if (n === 0) return buf.toString('base64', i);
  this.lastNeed = 3 - n;
  this.lastTotal = 3;
  if (n === 1) {
    this.lastChar[0] = buf[buf.length - 1];
  } else {
    this.lastChar[0] = buf[buf.length - 2];
    this.lastChar[1] = buf[buf.length - 1];
  }
  return buf.toString('base64', i, buf.length - n);
}

function base64End(buf) {
  var r = buf && buf.length ? this.write(buf) : '';
  if (this.lastNeed) return r + this.lastChar.toString('base64', 0, 3 - this.lastNeed);
  return r;
}

// Pass bytes on through for single-byte encodings (e.g. ascii, latin1, hex)
function simpleWrite(buf) {
  return buf.toString(this.encoding);
}

function simpleEnd(buf) {
  return buf && buf.length ? this.write(buf) : '';
}
},{"safe-buffer":147}],149:[function(require,module,exports){
module.exports = require('./readable').PassThrough

},{"./readable":150}],150:[function(require,module,exports){
exports = module.exports = require('./lib/_stream_readable.js');
exports.Stream = exports;
exports.Readable = exports;
exports.Writable = require('./lib/_stream_writable.js');
exports.Duplex = require('./lib/_stream_duplex.js');
exports.Transform = require('./lib/_stream_transform.js');
exports.PassThrough = require('./lib/_stream_passthrough.js');

},{"./lib/_stream_duplex.js":139,"./lib/_stream_passthrough.js":140,"./lib/_stream_readable.js":141,"./lib/_stream_transform.js":142,"./lib/_stream_writable.js":143}],151:[function(require,module,exports){
module.exports = require('./readable').Transform

},{"./readable":150}],152:[function(require,module,exports){
module.exports = require('./lib/_stream_writable.js');

},{"./lib/_stream_writable.js":143}],153:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

module.exports = Stream;

var EE = require('events').EventEmitter;
var inherits = require('inherits');

inherits(Stream, EE);
Stream.Readable = require('readable-stream/readable.js');
Stream.Writable = require('readable-stream/writable.js');
Stream.Duplex = require('readable-stream/duplex.js');
Stream.Transform = require('readable-stream/transform.js');
Stream.PassThrough = require('readable-stream/passthrough.js');

// Backwards-compat with node 0.4.x
Stream.Stream = Stream;



// old-style streams.  Note that the pipe method (the only relevant
// part of this class) is overridden in the Readable class.

function Stream() {
  EE.call(this);
}

Stream.prototype.pipe = function(dest, options) {
  var source = this;

  function ondata(chunk) {
    if (dest.writable) {
      if (false === dest.write(chunk) && source.pause) {
        source.pause();
      }
    }
  }

  source.on('data', ondata);

  function ondrain() {
    if (source.readable && source.resume) {
      source.resume();
    }
  }

  dest.on('drain', ondrain);

  // If the 'end' option is not supplied, dest.end() will be called when
  // source gets the 'end' or 'close' events.  Only dest.end() once.
  if (!dest._isStdio && (!options || options.end !== false)) {
    source.on('end', onend);
    source.on('close', onclose);
  }

  var didOnEnd = false;
  function onend() {
    if (didOnEnd) return;
    didOnEnd = true;

    dest.end();
  }


  function onclose() {
    if (didOnEnd) return;
    didOnEnd = true;

    if (typeof dest.destroy === 'function') dest.destroy();
  }

  // don't leave dangling pipes when there are errors.
  function onerror(er) {
    cleanup();
    if (EE.listenerCount(this, 'error') === 0) {
      throw er; // Unhandled stream error in pipe.
    }
  }

  source.on('error', onerror);
  dest.on('error', onerror);

  // remove all the event listeners that were added.
  function cleanup() {
    source.removeListener('data', ondata);
    dest.removeListener('drain', ondrain);

    source.removeListener('end', onend);
    source.removeListener('close', onclose);

    source.removeListener('error', onerror);
    dest.removeListener('error', onerror);

    source.removeListener('end', cleanup);
    source.removeListener('close', cleanup);

    dest.removeListener('close', cleanup);
  }

  source.on('end', cleanup);
  source.on('close', cleanup);

  dest.on('close', cleanup);

  dest.emit('pipe', source);

  // Allow for unix-like usage: A.pipe(B).pipe(C)
  return dest;
};

},{"events":128,"inherits":130,"readable-stream/duplex.js":138,"readable-stream/passthrough.js":149,"readable-stream/readable.js":150,"readable-stream/transform.js":151,"readable-stream/writable.js":152}],154:[function(require,module,exports){
(function (setImmediate,clearImmediate){
var nextTick = require('process/browser.js').nextTick;
var apply = Function.prototype.apply;
var slice = Array.prototype.slice;
var immediateIds = {};
var nextImmediateId = 0;

// DOM APIs, for completeness

exports.setTimeout = function() {
  return new Timeout(apply.call(setTimeout, window, arguments), clearTimeout);
};
exports.setInterval = function() {
  return new Timeout(apply.call(setInterval, window, arguments), clearInterval);
};
exports.clearTimeout =
exports.clearInterval = function(timeout) { timeout.close(); };

function Timeout(id, clearFn) {
  this._id = id;
  this._clearFn = clearFn;
}
Timeout.prototype.unref = Timeout.prototype.ref = function() {};
Timeout.prototype.close = function() {
  this._clearFn.call(window, this._id);
};

// Does not start the time, just sets up the members needed.
exports.enroll = function(item, msecs) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = msecs;
};

exports.unenroll = function(item) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = -1;
};

exports._unrefActive = exports.active = function(item) {
  clearTimeout(item._idleTimeoutId);

  var msecs = item._idleTimeout;
  if (msecs >= 0) {
    item._idleTimeoutId = setTimeout(function onTimeout() {
      if (item._onTimeout)
        item._onTimeout();
    }, msecs);
  }
};

// That's not how node.js implements it but the exposed api is the same.
exports.setImmediate = typeof setImmediate === "function" ? setImmediate : function(fn) {
  var id = nextImmediateId++;
  var args = arguments.length < 2 ? false : slice.call(arguments, 1);

  immediateIds[id] = true;

  nextTick(function onNextTick() {
    if (immediateIds[id]) {
      // fn.call() is faster so we optimize for the common use-case
      // @see http://jsperf.com/call-apply-segu
      if (args) {
        fn.apply(null, args);
      } else {
        fn.call(null);
      }
      // Prevent ids from leaking
      exports.clearImmediate(id);
    }
  });

  return id;
};

exports.clearImmediate = typeof clearImmediate === "function" ? clearImmediate : function(id) {
  delete immediateIds[id];
};
}).call(this,require("timers").setImmediate,require("timers").clearImmediate)
},{"process/browser.js":137,"timers":154}],155:[function(require,module,exports){
(function (global){

/**
 * Module exports.
 */

module.exports = deprecate;

/**
 * Mark that a method should not be used.
 * Returns a modified function which warns once by default.
 *
 * If `localStorage.noDeprecation = true` is set, then it is a no-op.
 *
 * If `localStorage.throwDeprecation = true` is set, then deprecated functions
 * will throw an Error when invoked.
 *
 * If `localStorage.traceDeprecation = true` is set, then deprecated functions
 * will invoke `console.trace()` instead of `console.error()`.
 *
 * @param {Function} fn - the function to deprecate
 * @param {String} msg - the string to print to the console when `fn` is invoked
 * @returns {Function} a new "deprecated" version of `fn`
 * @api public
 */

function deprecate (fn, msg) {
  if (config('noDeprecation')) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (config('throwDeprecation')) {
        throw new Error(msg);
      } else if (config('traceDeprecation')) {
        console.trace(msg);
      } else {
        console.warn(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
}

/**
 * Checks `localStorage` for boolean values for the given `name`.
 *
 * @param {String} name
 * @returns {Boolean}
 * @api private
 */

function config (name) {
  // accessing global.localStorage can trigger a DOMException in sandboxed iframes
  try {
    if (!global.localStorage) return false;
  } catch (_) {
    return false;
  }
  var val = global.localStorage[name];
  if (null == val) return false;
  return String(val).toLowerCase() === 'true';
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],156:[function(require,module,exports){
arguments[4][121][0].apply(exports,arguments)
},{"dup":121}],157:[function(require,module,exports){
arguments[4][122][0].apply(exports,arguments)
},{"dup":122}],158:[function(require,module,exports){
arguments[4][123][0].apply(exports,arguments)
},{"./support/isBuffer":157,"_process":137,"dup":123,"inherits":156}]},{},[1]);
