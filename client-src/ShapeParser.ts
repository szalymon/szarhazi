module Shapes {

    const enum SHP {
        NULL = 0,
        POINT = 1,
        POLYLINE = 3,
        POLYGON = 5
    };

    export class ShapeParser {

        static parseFile(file: File): Shape {
            console.log('File is under parsing...');

            
            return null;
        }

        static parse(arrayBuffer:ArrayBuffer, fileName) {
            let o = {};
            let dv = new DataView(arrayBuffer);

            
        }
    }
}