const r = require('restructure');
const { headerStruct, footerStruct, extensionStruct } = require('./struct');
const debug = require('debug')('TGA');

const tempColor = new Uint8Array(4);

class TGA {
    constructor(buf, opt = { dontFixAlpha: false }) {
        this.dontFixAlpha = !!opt.dontFixAlpha;
        this._buf = buf;
        this.data = new Uint8Array(buf);
        this.currentOffset = 0;
        this.parse();
    }

    static createTgaBuffer(width, height, pixels, dontFlipY) {
        debug('createTgaBuffer');
        const buffer = Buffer.alloc(18 + pixels.length);
        // write header
        buffer.writeInt8(0, 0);
        buffer.writeInt8(0, 1);
        buffer.writeInt8(2, 2);
        buffer.writeInt16LE(0, 3);
        buffer.writeInt16LE(0, 5);
        buffer.writeInt8(0, 7);
        buffer.writeInt16LE(0, 8);
        buffer.writeInt16LE(0, 10);
        buffer.writeInt16LE(width, 12);
        buffer.writeInt16LE(height, 14);
        buffer.writeInt8(32, 16);
        buffer.writeInt8(dontFlipY ? 32 : 0, 17);

        let offset = 18;
        for (let i = 0; i < height; i++) {
            for (let j = 0; j < width; j++) {
                const idx = ((dontFlipY ? i : height - i - 1) * width + j) * 4;
                buffer.writeUInt8(pixels[idx + 2], offset++);    // b
                buffer.writeUInt8(pixels[idx + 1], offset++);    // g
                buffer.writeUInt8(pixels[idx], offset++);        // r
                buffer.writeUInt8(pixels[idx + 3], offset++);    // a
            }
        }

        return buffer;
    }

    parseHeader() {
        const stream = new r.DecodeStream(this._buf);
        const header = headerStruct.decode(stream);

        debug('tga header', header);

        this.header = header;

        this.width = header.width;
        this.height = header.height;

        this.isUsingColorMap = [1, 9].includes(header.dataType);
        this.isUsingRLE = [9, 10, 11].includes(header.dataType);
        this.isGray = [3, 11].includes(header.dataType);

        this.hasAlpha = ((header.flags & 0x0f) || header.bitsPerPixel === 32) 
            || (this.isUsingColorMap && header.colorMapDepth === 32)
            || (this.isGray && header.bitsPerPixel === 16);
        
        debug('tga info isUsingColorMap=%s isUsingRLE=%s isGray=%s hasAlpha=%s', this.isUsingColorMap, this.isUsingRLE, this.isGray, this.hasAlpha);

        this.isFlipX = (header.flags & 16);
        this.isFlipY = !(header.flags & 32);
        this.currentOffset = 18 + header.idLength;
        debug('tag info isFlipX=%s isFlipY=%s', this.isFlipX, this.isFlipY);
    }

    parseFooter() {
        const stream = new r.DecodeStream(this._buf.subarray(-26));
        const footer = footerStruct.decode(stream);
        if (footer.signature.trim() === 'TRUEVISION-XFILE.\x00') {
            debug('footer', footer);
            if (footer.extensionAreaOffset) {
                this.parseExtension(footer.extensionAreaOffset);
            }
        }
    }

    parseExtension(extensionAreaOffset) {
        const stream = new r.DecodeStream(this._buf.subarray(extensionAreaOffset));
        const extension = extensionStruct.decode(stream);
        debug('extension', extension);
        if (extension.attributesType === 3) {
            this.hasAlpha = true;
        } else if (extension.attributesType === 4) {
            // pre-multiplied Alpha
            this.hasAlpha = true;
        } else {
            this.hasAlpha = false;
        }
    }
    
    readColor(offset, bytesPerPixel) {
        const arr = this.data;
        if (bytesPerPixel === 3 || bytesPerPixel === 4) {
            tempColor[0] = arr[offset + 2];
            tempColor[1] = arr[offset + 1];
            tempColor[2] = arr[offset];
            tempColor[3] = (this.hasAlpha && bytesPerPixel === 4) ? arr[offset + 3] : 255;
        } else if (bytesPerPixel === 2) {
            if (this.isGray) {
                tempColor[0] = tempColor[1] = tempColor[2] = arr[offset];
                tempColor[1] = this.hasAlpha ? arr[offset + 1] : 255;
            } else {
                tempColor[0] = (arr[offset + 1] & 0x7c) << 1;
                tempColor[1] = ((arr[offset + 1] & 0x03) << 6) | ((arr[offset] & 0xe0) >> 2);
                tempColor[2] = (arr[offset] & 0x1f) << 3;
                tempColor[3] = this.hasAlpha ? (arr[offset + 1] & 0x80) : 255;
            }
        } else if (bytesPerPixel === 1) {
            tempColor[0] = tempColor[1] = tempColor[2] = arr[offset];
            tempColor[3] = 255;
        } else {
            console.error('Can\'t read color with bytesPerPixel=%s', bytesPerPixel);
        }
        return tempColor;
    }

    readColorWithColorMap(offset) {
        let index = this.data[offset];
        return this.colorMap.subarray(index * 4, index * 4 + 4);
    }

    readColorAuto(offset, bytesPerPixel, isUsingColorMap) {
        return isUsingColorMap ? this.readColorWithColorMap(offset) : this.readColor(offset, bytesPerPixel);
    }

    parseColorMap() {
        const len = this.header.colorMapLength;
        const bytesPerPixel = this.header.colorMapDepth / 8;
        const colorMap = new Uint8Array(len * 4);
        for (let i = 0; i < len; i++) {
            const color = this.readColor(this.currentOffset, bytesPerPixel);
            this.currentOffset += bytesPerPixel;
            colorMap.set(color, i * 4);
        }
        this.colorMap = colorMap;
    }

    setPixel(pixels, idx, color) {
        const { width, height } = this.header;
        if (this.isFlipX || this.isFlipY) {
            let x = idx % width;
            let y = Math.floor(idx / width);
            
            if (this.isFlipX) {
                x = width - 1 - x;
            }
            if (this.isFlipY) {
                y = height - 1 - y;
            }
            idx = y * width + x;
        }
        pixels.set(color, idx * 4);
    }

    parsePixels() {
        const header = this.header;
        const pixelCount = header.width * header.height;
        const pixels = new Uint8Array(pixelCount * 4);
        const bytesPerPixel = header.bitsPerPixel / 8;

        let offset = this.currentOffset;

        for (let i = 0; i < pixelCount; i++) {
            if (this.isUsingRLE) {
                const flag = this.data[offset++];
                const count = flag & 0x7f;
                const isRLEChunk = flag & 0x80;

                let color = this.readColorAuto(offset, bytesPerPixel, this.isUsingColorMap);
                offset += bytesPerPixel;
                this.setPixel(pixels, i, color);
                for (let j = 0; j < count; j++) {
                    if (!isRLEChunk) {
                        color = this.readColorAuto(offset, bytesPerPixel, this.isUsingColorMap);
                        offset += bytesPerPixel;
                    }
                    this.setPixel(pixels, ++i, color);
                }
            } else {
                const color = this.readColorAuto(offset, bytesPerPixel, this.isUsingColorMap);
                offset += bytesPerPixel;
                this.setPixel(pixels, i, color);
            }
        }
        this.currentOffset = offset;
        this.pixels = pixels;
        debug('pixels', this.pixels);
    }

    parse() {
        this.parseHeader();
        this.parseFooter();
        if (this.header.colorMapType === 1) {
            this.parseColorMap();
        }
        this.parsePixels();
        if (!this.dontFixAlpha) {
            this.fixForAlpha();
        }
    }

    fixForAlpha() {
        debug('fixForAlpha');
        let alpha0Count = 0;
        for (let i = this.pixels.length - 1; i > 0; i -= 4) {
            if (!this.pixels[i]) {
                alpha0Count++;
            }
        }
        if (alpha0Count === this.pixels.length / 4) {
            // all pixels are transparent, convert all alpha to 255
            for (let i = this.pixels.length - 1; i > 0; i -= 4) {
                if (!this.pixels[i]) {
                    this.pixels[i] = 255;
                }
            }
        }
    }
}

module.exports = TGA;
