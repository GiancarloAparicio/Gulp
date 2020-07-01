(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

var _example = require("./modules/example");

var _activeMenu = require("./modules/active-menu");

(0, _example.saludo)();
(0, _activeMenu.activeMenu)();

},{"./modules/active-menu":2,"./modules/example":3}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var activeMenu = exports.activeMenu = function activeMenu() {
    var menu = document.getElementById('main-menu');
    if (menu) {
        var links = Array.from(menu.querySelectorAll('a'));
        links.map(function (link) {
            if (link.href === location.href || link.href === location.href.slice(0, -1)) link.classList.add('active');
        });
    }
};

},{}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
// Este es un ejemplo de como exportar funciones desde un archivo
// En index.js se importan estas funciones

var saludo = exports.saludo = function saludo() {
  console.log('Hola mundo');
};

var despedida = exports.despedida = function despedida() {
  console.log('Adiós mundo');
};

},{}]},{},[1]);

//# sourceMappingURL=scripts-min.js.map
