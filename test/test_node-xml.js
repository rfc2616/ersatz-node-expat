/*global require,describe, it*/
var expat = require('node-expat');
var ersatzt = require("../lib");
var should = require("should");

describe("compare node-expat  and erstatz-node-expat", function () {


    function perform_test(namespace) {
        var parser = new namespace.Parser('UTF-8');


        var infos = [];

        parser.on('startElement', function (name, attrs) {
            console.log("startElement", name, attrs)
            infos.push(['startElement',name,attrs]);
        });

        parser.on('endElement', function (name) {
            console.log("endElement", name)
            infos.push(['endElement',name]);
        });

        parser.on('text', function (text) {
            console.log(" text : <" + text + ">");
            text = text.split("\n").join("");
            if (text.length >0) {
                infos.push(['text',text.trim()]);
            }
        });

        parser.on('error', function (error) {
            console.error(error);
            infos.push(['error',error]);
        });

        var xml_string = require("fs").readFileSync(__dirname + "/demo.xml");
        parser.write(xml_string);

        return infos;
    }

    it("node-expat", function () {
       var infos1 =  perform_test(expat);
       var infos2 = perform_test(ersatzt);
       infos1.should.eql(infos2);

    });
});
