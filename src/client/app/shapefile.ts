export module shapefile {

    const enum SHP {
        NULL = 0,
        POINT = 1,
        POLYLINE = 3,
        POLYGON = 5
    };

    export class Record {
        number: number;
        length: number;
        shape: Shape;
    }

    export class Shape {
        type: SHP;
    }

    export class Point extends Shape {
        x: number;
        y: number;

        constructor(x: number, y: number) {
            super();
            this.type = SHP.POINT;

            this.x = x;
            this.y = y;
        }
    }

    export class PolyLine extends Shape {
        points: Point[];
    }

    export class Polygon extends Shape {
        minX: number;
        minY: number;

        maxX: number;
        maxY: number;

        parts: Int32Array;
        points: Float64Array;

        constructor() {
            super();
            this.type = SHP.POLYGON;
        }
    }


    export class World {
        fileCode: number;
        wordLength: number;
        byteLength: number;
        version: number;
        shapeType: SHP;

        minX: number;
        minY: number;
        maxX: number;
        maxY: number;
        minZ: number;
        maxZ: number;
        minM: number;
        maxM: number;

        records: Record[];
    }


    export class ShapeParser {

        static parseFile(file: File): World {
            console.log('File is under parsing...');
            return null;
        }

        static parse(arrayBuffer: ArrayBuffer, fileName: String) {
            var world: World = new World();
            var dv = new DataView(arrayBuffer);
            var idx = 0;
            world.fileCode = dv.getInt32(idx, false); File
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
            world.records = [];
            while (idx < world.byteLength) {
                var record: Record = new Record();
                record.number = dv.getInt32(idx, false);
                idx += 4;
                record.length = dv.getInt32(idx, false);
                idx += 4;
                try {
                    record.shape = this.parseShape(dv, idx, record.length);
                } catch (e) {
                    console.log(e, record);
                }
                idx += record.length * 2;
                world.records.push(record);
            }
            return world;
        }

        public static parseShape(dv: DataView, idx: number, length: number): Shape {
            //var i = 0, c = null;
            var i;
            var shape: Shape;
            var shapeType = dv.getInt32(idx, true);
            idx += 4;
            var byteLen = length * 2;
            switch (shapeType) {
                case SHP.NULL: // Null
                    break;
                case SHP.POINT: // Point (x,y)
                    shape = new Point(dv.getFloat64(idx, true), dv.getFloat64(idx + 8, true));
                    break;
                case SHP.POLYLINE: // Polyline (MBR, partCount, pointCount, parts, points)
                case SHP.POLYGON: // Polygon (MBR, partCount, pointCount, parts, points)
                    shape = new Polygon();
                    let polygon: Polygon = <Polygon>shape;
                    polygon.minX = dv.getFloat64(idx, true);
                    polygon.minY = dv.getFloat64(idx + 8, true);
                    polygon.maxX = dv.getFloat64(idx + 16, true);
                    polygon.maxY = dv.getFloat64(idx + 24, true);

                    polygon.parts = new Int32Array(dv.getInt32(idx + 32, true));
                    polygon.points = new Float64Array(dv.getInt32(idx + 36, true) * 2);

                    idx += 40;

                    for (i = 0; i < polygon.parts.length; i++) {
                        polygon.parts[i] = dv.getInt32(idx, true);
                        idx += 4;
                    }

                    for (i = 0; i < polygon.points.length; i++) {
                        polygon.points[i] = dv.getFloat64(idx, true);
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
                        + shape.type);
                default:
                    throw new Error("Unknown shape type at " + (idx - 4) + ': ' + shape.type);
            }
            return shape;
        }
    }
}


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
        parts: new Int32Array(dv.getInt32(idx+32, true)),
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