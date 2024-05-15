TGA
========
This is a pure Node.js module for parse or write tga image file.

Requirements
========
* Node.js v6

Installation
========
```
$ npm install tga --save
```

API
========
### Class TGA(buffer, opt = { dontFixAlpha: false })
* buffer: buffer is the tga file Buffer(fs.readFile)
* opt: tga parse options
    * dontFixAlpha: some tga image is fully transparent, it will convert the alpha chanel to 255, you can turn this on if you dont want this feature.


### TGA.createTgaBuffer(width, height, pixels)
* width: image width
* height: image height
* pixels(Uint8Array): pixels data, [r, g, b, a, r, g, b, a]

### TGA.getHeader(buffer)
* buffer: buffer is the tga file Buffer(fs.readFile)
* return a object contain the tga header info such as width, height and so on

Example
========
```js
var fs = require('fs');
var TGA = require('tga');
var tga = new TGA(fs.readFileSync('./test.tga'));
console.log(tga.width, tga.height);
for (var i = 0; i < tga.pixels.length; i += 4) {
    // the range of r, g, b and a is [0, 255]
    console.log(tga.pixels[i], tga.pixels[i + 1], tga.pixels[i + 2], tga.pixels[i + 3]);
}

// save as another tga image
var buf = TGA.createTgaBuffer(tga.width, tga.height, tga.pixels);
fs.writeFileSync('./out.tga', buf);

// save the tga as png
var PNG = require('pngjs').PNG;
var png = new PNG({
    width: tga.width,
    height: tga.height
});
png.data = tga.pixels;
png.pack().pipe(fs.createWriteStream('./test.png'));

```