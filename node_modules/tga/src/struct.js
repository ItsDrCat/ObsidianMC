const r = require('restructure');

exports.headerStruct = new r.Struct({
    idLength: r.uint8,
    colorMapType: r.uint8,
    dataType: r.uint8,
    colorMapOrigin: r.uint16le,
    colorMapLength: r.uint16le,
    colorMapDepth: r.uint8,
    xOrigin: r.uint16le,
    yOrigin: r.uint16le,
    width: r.uint16le,
    height: r.uint16le,
    bitsPerPixel: r.uint8,
    flags: r.uint8,
    id: new r.String('idLength', 'ascii'),
});

exports.footerStruct = new r.Struct({
    extensionAreaOffset: r.uint32le,
    developerDirectoryOffset: r.uint32,
    signature: new r.String(18)
});


exports.extensionStruct = new r.Struct({
    extensionSize: r.uint16le,
    authorName: new r.String(41),
    authorComments: new r.String(324),
    saveTime: new r.Array(r.uint16le, 6),
    jobName: new r.String(41),
    jobTime: new r.Array(r.uint16le, 3),
    software: new r.String(41),
    softwareVersion: r.uint16le,
    softwareVersionTag: new r.String(1),
    keyColor: new r.Array(r.uint8, 4),
    pixelAspectRatio: new r.Array(r.uint16le, 2),
    gamma: new r.Array(r.uint16le, 2),
    colorCorrectionOffset: r.uint32le,
    postageStampOffset: r.uint32le,
    scanLineOffset: r.uint32le,
    attributesType: r.uint8,
});