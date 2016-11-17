declare module Shapes {
    class Point {
        x: number;
        y: number;
    }
}
declare module Shapes {
    class Polygon {
        points: Point[];
    }
}
declare module Shapes {
    class Shape {
        id: number;
        polygons: Polygon[];
    }
}
declare module Shapes {
    class ShapeParser {
        static parseFile(file: File): Shape;
        static parse(arrayBuffer: ArrayBuffer, fileName: any): void;
    }
}
