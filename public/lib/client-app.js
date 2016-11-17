var Point = (function () {
    function Point() {
    }
    return Point;
}());
var Polygon = (function () {
    function Polygon() {
    }
    return Polygon;
}());
define("Shape", ["require", "exports"], function (require, exports) {
    "use strict";
    var Shape = (function () {
        function Shape() {
        }
        return Shape;
    }());
    exports.Shape = Shape;
});
define("ShapeParser", ["require", "exports"], function (require, exports) {
    "use strict";
    var ShapeParser = (function () {
        function ShapeParser() {
        }
        ShapeParser.parseFile = function (file) {
            console.log('File is under parsing...');
            return null;
        };
        return ShapeParser;
    }());
});
