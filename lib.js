var util = require('util');
var xml = require("node-xml");
var EventEmitter = require("events").EventEmitter;
var Parser = function(encoding)
{

  function _toMap(arr) {
    var m = {}
    arr.forEach(function(pair) {
        m[pair[0]]=pair[1];
    });
    return m;
  }
  var self = this;
  self._xml = new xml.SaxParser(function(cb){
 
          cb.onStartDocument(function() {
          });
          cb.onEndDocument(function() {
              self.emit("close");
          });
          cb.onStartElementNS(function(elem,attrs,prefix,uri,namespaces) {
            self.emit("startElement",elem,_toMap(attrs)); 
          });
          cb.onEndElementNS(function(elem,prefix,uri) {
            self.emit("endElement",elem);
          });
          cb.onCharacters(function(chars){
            chars.split("\n").forEach(function(chunk){ self.emit("text",chunk);});
          });
  });

}
util.inherits(Parser,EventEmitter);
Parser.prototype.write = function(str) {
   this._xml.parseString(str);
};

Parser.prototype.end = function() {
};


exports.Parser = Parser;


