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

    this._text = [];

    function _toMap(arr) {
        var m = {}
        arr.forEach(function (pair) {
            m[pair[0]] = pair[1];
        });
        return m;
    }

    var self = this;
    var xml = require("node-xml");
    self._xml = new xml.SaxParser(function (cb) {

        cb.onStartDocument(function () {

        });
        cb.onEndDocument(function () {
            self.emit("close");
        });
        cb.onStartElementNS(function (elem, attrs, prefix, uri, namespaces) {
            self.emit("startElement", elem, _toMap(attrs));
            self._text = "";
        });
        cb.onEndElementNS(function (elem, prefix, uri) {

            if (self._text.length >=0) {
                var chars = self._text.trim();
                chars.split("\n").forEach(function (chunk) {
                    self.emit("text", chunk);
                });

            }
            self.emit("endElement", elem);
        });
        cb.onCharacters(function (chars) {
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
