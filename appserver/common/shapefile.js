"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var shapefile;
(function (shapefile) {
    ;
    var Record = (function () {
        function Record() {
        }
        Record.prototype.toString = function () {
            return this.shape.toString();
        };
        return Record;
    }());
    shapefile.Record = Record;
    var Shape = (function () {
        function Shape() {
        }
        Shape.prototype.toString = function () {
            return "Not implemented!";
        };
        return Shape;
    }());
    shapefile.Shape = Shape;
    var Point = (function (_super) {
        __extends(Point, _super);
        function Point(x, y) {
            _super.call(this);
            this.type = 1 /* POINT */;
            this.x = x;
            this.y = y;
        }
        return Point;
    }(Shape));
    shapefile.Point = Point;
    var PolyLine = (function (_super) {
        __extends(PolyLine, _super);
        function PolyLine() {
            _super.apply(this, arguments);
        }
        return PolyLine;
    }(Shape));
    shapefile.PolyLine = PolyLine;
    var Polygon = (function (_super) {
        __extends(Polygon, _super);
        function Polygon() {
            _super.call(this);
            this.type = 5 /* POLYGON */;
            this.points = [];
        }
        Polygon.prototype.toString = function () {
            return "Polygon with " + this.points.length + " point";
        };
        return Polygon;
    }(Shape));
    shapefile.Polygon = Polygon;
    var World = (function () {
        function World() {
            this.records = [];
        }
        return World;
    }());
    shapefile.World = World;
    var ShapeParser = (function () {
        function ShapeParser() {
        }
        ShapeParser.parseFile = function (file, callback) {
            var reader = new FileReader();
            var arrayBuffer;
            reader.onload = function () {
                arrayBuffer = reader.result;
                var world = ShapeParser.parse(arrayBuffer, file.name);
                /*
                console.log("World has been parsed with: ");
                world.records.forEach(record => {
                   console.log("\t" + record.toString());
                });
                */
                callback(world);
            };
            reader.readAsArrayBuffer(file);
        };
        ShapeParser.parse = function (arrayBuffer, fileName) {
            var world = new World();
            var dv = new DataView(arrayBuffer);
            var idx = 0;
            world.fileCode = dv.getInt32(idx, false);
            File;
            if (world.fileCode != 0x0000270a) {
                throw (new Error("Unknown file code: " + world.fileCode));
            }
            idx += 6 * 4;
            world.wordLength = dv.getInt32(idx, false);
            world.byteLength = world.wordLength * 2;
            idx += 4;
            world.version = dv.getInt32(idx, true);
            idx += 4;
            world.shapeType = dv.getInt32(idx, true);
            idx += 4;
            world.minX = dv.getFloat64(idx, true);
            world.minY = dv.getFloat64(idx + 8, true);
            world.maxX = dv.getFloat64(idx + 16, true);
            world.maxY = dv.getFloat64(idx + 24, true);
            world.minZ = dv.getFloat64(idx + 32, true);
            world.maxZ = dv.getFloat64(idx + 40, true);
            world.minM = dv.getFloat64(idx + 48, true);
            world.maxM = dv.getFloat64(idx + 56, true);
            idx += 8 * 8;
            while (idx < world.byteLength) {
                var record = new Record();
                record.number = dv.getInt32(idx, false);
                idx += 4;
                record.length = dv.getInt32(idx, false);
                idx += 4;
                try {
                    record.shape = this.parseShape(dv, idx, record.length);
                }
                catch (e) {
                    console.log(e, record);
                }
                idx += record.length * 2;
                world.records.push(record);
            }
            return world;
        };
        ShapeParser.parseShape = function (dv, idx, length) {
            //var i = 0, c = null;
            var i;
            var shape;
            var shapeType = dv.getInt32(idx, true);
            idx += 4;
            var byteLen = length * 2;
            switch (shapeType) {
                case 0 /* NULL */:
                    break;
                case 1 /* POINT */:
                    shape = new Point(dv.getFloat64(idx, true), dv.getFloat64(idx + 8, true));
                    break;
                case 3 /* POLYLINE */: // Polyline (MBR, partCount, pointCount, parts, points)
                case 5 /* POLYGON */:
                    shape = new Polygon();
                    var polygon = shape;
                    polygon.minX = dv.getFloat64(idx, true);
                    polygon.minY = dv.getFloat64(idx + 8, true);
                    polygon.maxX = dv.getFloat64(idx + 16, true);
                    polygon.maxY = dv.getFloat64(idx + 24, true);
                    polygon.parts = new Int32Array(dv.getInt32(idx + 32, true));
                    polygon._points = new Float64Array(dv.getInt32(idx + 36, true) * 2);
                    idx += 40;
                    for (i = 0; i < polygon.parts.length; i++) {
                        polygon.parts[i] = dv.getInt32(idx, true);
                        idx += 4;
                    }
                    for (i = 0; i < polygon._points.length; i++) {
                        polygon._points[i] = dv.getFloat64(idx, true);
                        idx += 8;
                    }
                    for (var k = 0; k < polygon.parts.length; k++) {
                        for (var j = polygon.parts[k], last = polygon.parts[k + 1] || (polygon._points.length / 2); j < last; j++) {
                            var x = polygon._points[j * 2];
                            var y = polygon._points[j * 2 + 1];
                            polygon.points.push(new Point(x, y * (-1)));
                        }
                    }
                    break;
                case 8: // MultiPoint (MBR, pointCount, points)
                case 11: // PointZ (X, Y, Z, M)
                case 13: // PolylineZ
                case 15: // PolygonZ
                case 18: // MultiPointZ
                case 21: // PointM (X, Y, M)
                case 23: // PolylineM
                case 25: // PolygonM
                case 28: // MultiPointM
                case 31:
                    throw new Error("Shape type not supported: " + shape.type);
                default:
                    throw new Error("Unknown shape type at " + (idx - 4) + ': ' + shape.type);
            }
            return shape;
        };
        return ShapeParser;
    }());
    shapefile.ShapeParser = ShapeParser;
})(shapefile = exports.shapefile || (exports.shapefile = {}));
/*
// Shapefile parser, following the specification at
// http://www.esri.com/library/whitepapers/pdfs/shapefile.pdf
SHP = {
  NULL: 0,
  POINT: 1,
  POLYLINE: 3,
  POLYGON: 5
};

SHP.getShapeName = function(id) {
  for (name in this) {
    if (id === this[name]) {
      return name;
    }
  }
};

SHPParser = function() {
};

SHPParser.load = function(src, callback, onerror) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', src);
  xhr.responseType = 'arraybuffer';
  xhr.onload = function() {
    console.log(xhr.response);
    var d = new SHPParser().parse(xhr.response,src);
    callback(d);
  };
  xhr.onerror = onerror;
  xhr.send(null);
};

SHPParser.prototype.parse = function(arrayBuffer,src) {
  var o = {};
  var dv = new DataView(arrayBuffer);
  var idx = 0;
  o.fileName = src;
  o.fileCode = dv.getInt32(idx, false);
  if (o.fileCode != 0x0000270a) {
    throw (new Error("Unknown file code: " + o.fileCode));
  }
  idx += 6*4;
  o.wordLength = dv.getInt32(idx, false);
  o.byteLength = o.wordLength * 2;
  idx += 4;
  o.version = dv.getInt32(idx, true);
  idx += 4;
  o.shapeType = dv.getInt32(idx, true);
  idx += 4;
  o.minX = dv.getFloat64(idx, true);
  o.minY = dv.getFloat64(idx+8, true);
  o.maxX = dv.getFloat64(idx+16, true);
  o.maxY = dv.getFloat64(idx+24, true);
  o.minZ = dv.getFloat64(idx+32, true);
  o.maxZ = dv.getFloat64(idx+40, true);
  o.minM = dv.getFloat64(idx+48, true);
  o.maxM = dv.getFloat64(idx+56, true);
  idx += 8*8;
  o.records = [];
  while (idx < o.byteLength) {
    var record = {};
    record.number = dv.getInt32(idx, false);
    idx += 4;
    record.length = dv.getInt32(idx, false);
    idx += 4;
    try {
      record.shape = this.parseShape(dv, idx, record.length);
    } catch(e) {
      console.log(e, record);
    }
    idx += record.length * 2;
    o.records.push(record);
  }
  return o;
};

SHPParser.prototype.parseShape = function(dv, idx, length) {
  var i=0, c=null;
  var shape = {};
  shape.type = dv.getInt32(idx, true);
  idx += 4;
  var byteLen = length * 2;
  switch (shape.type) {
    case SHP.NULL: // Null
      break;

    case SHP.POINT: // Point (x,y)
      shape.content = {
        x: dv.getFloat64(idx, true),
        y: dv.getFloat64(idx+8, true)
      };
      break;
    case SHP.POLYLINE: // Polyline (MBR, partCount, pointCount, parts, points)
    case SHP.POLYGON: // Polygon (MBR, partCount, pointCount, parts, points)
      c = shape.content = {
        minX: dv.getFloat64(idx, true),
        minY: dv.getFloat64(idx+8, true),
        maxX: dv.getFloat64(idx+16, true),
        maxY: dv.getFloat64(idx+24, true),
        parts: new Int32Array(dv.getInt32(idx+32, trpointsue)),
        points: new Float64Array(dv.getInt32(idx+36, true)*2)
      };
      idx += 40;
      for (i=0; i<c.parts.length; i++) {
        c.parts[i] = dv.getInt32(idx, true);
        idx += 4;
      }
      for (i=0; i<c.points.length; i++) {
        c.points[i] = dv.getFloat64(idx, true);
        idx += 8;
      }
      break;

    case 8: // MultiPoint (MBR, pointCount, points)
    case 11: // PointZ (X, Y, Z, M)
    case 13: // PolylineZ
    case 15: // PolygonZ
    case 18: // MultiPointZ
    case 21: // PointM (X, Y, M)
    case 23: // PolylineM
    case 25: // PolygonM
    case 28: // MultiPointM
    case 31: // MultiPatch
      throw new Error("Shape type not supported: "
                      + shape.type + ':' +
                      + SHP.getShapeName(shape.type));
    default:
      throw new Error("Unknown shape type at " + (idx-4) + ': ' + shape.type);
  }
  return shape;
};
*/ 
