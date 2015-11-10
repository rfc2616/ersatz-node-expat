/**
 * License MIT
 */
var util = require('util');
var EventEmitter = require("events").EventEmitter;

/**
 * @class Parser
 * @param encoding
 * @constructor
 */
var Parser = function (encoding) {

    this._text = "";

    function _toMap(arr) {
        var m = {}
        arr.forEach(function (pair) {
            m[pair[0]] = pair[1];
        });
        return m;
    }

    var self = this;
    var xml = require("node-xml");

    var level = 0;

    self._xml = new xml.SaxParser(function (cb) {

        cb.onStartDocument(function () {
            //xx console.log("onStartDocument");

        });

        cb.onEndDocument(function () {
            // be careful ! this event could be called at the end of a unterminated string , when data
            // is written by chunk => we need to check that we are at the root level.
            if (level === 0) {
                self.emit("close");
            }
        });

        cb.onStartElementNS(function (elem, attrs, prefix, uri, namespaces) {
            level = level+1;
            self.emit("startElement", elem, _toMap(attrs),prefix,uri,namespaces);
            self._text = "";
        });

        cb.onEndElementNS(function (elem, prefix, uri) {

            if (self._text.length >=0) {
                var chars = self._text.trim();
                chars.split("\n").forEach(function (chunk) {
                    self.emit("text", chunk);
                });
                self._text = "";
            }
            //xx console.log("onEndElementNS");
            self.emit("endElement", elem , prefix, uri);
            level = level - 1;

        });

        cb.onCharacters(function (chars) {
            ///xxx console.log("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX ",chars,self._text);
            self._text += chars;
        });

    });

};
util.inherits(Parser, EventEmitter);

Parser.prototype.write = function (str) {
    this._xml.parseString(str);
};

Parser.prototype.end = function (data) {
    if (data) {
        this.write(data);
    }
};

exports.Parser = Parser;
