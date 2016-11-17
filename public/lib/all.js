var Shapes;
(function (Shapes) {
    var Point = (function () {
        function Point() {
        }
        return Point;
    }());
    Shapes.Point = Point;
})(Shapes || (Shapes = {}));
var Shapes;
(function (Shapes) {
    var Polygon = (function () {
        function Polygon() {
        }
        return Polygon;
    }());
    Shapes.Polygon = Polygon;
})(Shapes || (Shapes = {}));
var Shapes;
(function (Shapes) {
    var Shape = (function () {
        function Shape() {
        }
        return Shape;
    }());
    Shapes.Shape = Shape;
})(Shapes || (Shapes = {}));
var Shapes;
(function (Shapes) {
    ;
    var ShapeParser = (function () {
        function ShapeParser() {
        }
        ShapeParser.parseFile = function (file) {
            console.log('File is under parsing...');
            return null;
        };
        ShapeParser.parse = function (arrayBuffer, fileName) {
            var o = {};
            var dv = new DataView(arrayBuffer);
        };
        return ShapeParser;
    }());
    Shapes.ShapeParser = ShapeParser;
})(Shapes || (Shapes = {}));
