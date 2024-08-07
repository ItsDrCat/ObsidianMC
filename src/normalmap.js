
const { createRequire } = require('node:module');
require = createRequire(__filename); 

const process= require('process');
process.removeAllListeners('warning');


//node.js packages
var Jimp = require("jimp");
const os = require('os');
const punycode = require('punycode/');
const fs = require('fs-extra')
var TGA = require('tga');
const prompts = require('prompts');
var colors = require('@colors/colors');
const { userInfo, platform, hostname } = require('node:os');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { count } = require('node:console');


//colors
colors.setTheme({
  pip: 'green',
  silly: 'rainbow',
  input: 'grey',
  verbose: 'cyan',
  prompt: 'grey',
  info: 'green',
  data: 'grey',
  help: 'cyan',
  warn: 'yellow',
  debug: 'blue',
  error: 'red'
});


let user = os.userInfo().username
let uPlatform = os.platform()

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function generateNormals(folder, configPath){

    const config = require(configPath);

    console.log("Starting a Normalmap Generation Instance!!!".brightBlue)
    fs.readdirSync(folder).forEach(async file =>{
      if(file.endsWith('_h.png')){
        
        const pixelY_array = []
        const pixelX_array = []

        //collect data
        Jimp.read(folder+'/'+file, (err, texture) => {
            if (err) throw err;
            texture
          .grayscale()
          .scale(config.scaleFactor, Jimp.RESIZE_NEAREST_NEIGHBOR)
          .scan(0, 0, texture.bitmap.width, texture.bitmap.height, function (x, y, idx) {

            let yTop = y-1
            let yBottom = y+1
            let xRight = x+1
            let xLeft = x-1

            //wrapping
            if(yTop < 0){
              yTop = texture.bitmap.height
            }
            if(yBottom > texture.bitmap.height){
              yBottom = 0
            }
            if(xRight > texture.bitmap.width){
              xRight = 0
            }
            if(xLeft < 0){
              xLeft = texture.bitmap.width
            }

            //get values
            let pixel = Jimp.intToRGBA(texture.getPixelColor(x, y)).r
            let top = Jimp.intToRGBA(texture.getPixelColor(x, yTop)).r
            let bottom = Jimp.intToRGBA(texture.getPixelColor(x, yBottom)).r
            let right = Jimp.intToRGBA(texture.getPixelColor(xRight, y)).r
            let left = Jimp.intToRGBA(texture.getPixelColor(xLeft, y)).r

            /*
            console.log('Top '+top)
            console.log('Bottom '+bottom)
            console.log('Right '+right)
            console.log('Left '+left)
            console.log('Center '+pixel)
            */

            let pixelY = (top - pixel) + (pixel - bottom)
            let pixelX = (right - pixel) + (left - pixel)

            pixelY = (127+(pixelY/0.7))
            pixelX = (127-(pixelX/0.7))

            if(pixelY > 255){
              pixelY = 255
            }
            if(pixelY < 0){
              pixelY = 0
            }

            if(pixelX > 255){
              pixelX = 255
            }
            if(pixelX < 0){
              pixelX = 0
            }

            pixelY_array.push(pixelY)
            pixelX_array.push(pixelX)
          
          /*
          console.log('PixelX_array '+pixelX_array[x+(y*texture.bitmap.width)])
          console.log('PixelY_array '+pixelY_array[x+(y*texture.bitmap.width)])
          */
          })

        })

        await sleep(8000)

        //write data
        Jimp.read(folder+'/'+file, (err, texture) => {
          if (err) throw err;
          texture
          .scale(config.scaleFactor, Jimp.RESIZE_NEAREST_NEIGHBOR)
          .scan(0, 0, texture.bitmap.width, texture.bitmap.height, function (x, y, idx) {

            this.bitmap.data[idx + 0] = pixelX_array[x+(y*texture.bitmap.width)];
            this.bitmap.data[idx + 1] = pixelY_array[x+(y*texture.bitmap.width)];
            this.bitmap.data[idx + 2] = 255;

          })
          .gaussian(1)
          .write(folder+'/'+file)
        })

      }
    })
  }

  function generateHeightNormals(folder, configPath){

    const config = require(configPath);

    console.log("Starting a Normalmap Generation Instance!!!".brightBlue)
    fs.readdirSync(folder).forEach(async file =>{
      if(file.endsWith('_h.png')){
        
        const pixelY_array = []
        const pixelX_array = []

        const pixelYE_array = []
        const pixelXE_array = []

        //collect data (height edges)
        Jimp.read(folder+'/'+file, (err, texture) => {
          if (err) throw err;
          texture
        .grayscale()
        .scale(8, Jimp.RESIZE_NEAREST_NEIGHBOR)
        .posterize(17)
        .scan(0, 0, texture.bitmap.width, texture.bitmap.height, function (x, y, idx) {

          let yTop = y-1
          let yBottom = y+1
          let xRight = x+1
          let xLeft = x-1

          //wrapping
          if(yTop < 0){
            yTop = texture.bitmap.height
          }
          if(yBottom > texture.bitmap.height){
            yBottom = 0
          }
          if(xRight > texture.bitmap.width){
            xRight = 0
          }
          if(xLeft < 0){
            xLeft = texture.bitmap.width
          }

          //get values
          let pixel = Jimp.intToRGBA(texture.getPixelColor(x, y)).r
          let top = Jimp.intToRGBA(texture.getPixelColor(x, yTop)).r
          let bottom = Jimp.intToRGBA(texture.getPixelColor(x, yBottom)).r
          let right = Jimp.intToRGBA(texture.getPixelColor(xRight, y)).r
          let left = Jimp.intToRGBA(texture.getPixelColor(xLeft, y)).r

          /*
          console.log('Top '+top)
          console.log('Bottom '+bottom)
          console.log('Right '+right)
          console.log('Left '+left)
          console.log('Center '+pixel)
          */

          let pixelY = (top - pixel) + (pixel - bottom)
          let pixelX = (right - pixel) + (left - pixel)

          pixelY = (127+(pixelY/0.7))
          pixelX = (127-(pixelX/0.7))

          if(pixelY > 127){
            pixelY = 127
          }
          if(pixelY < 0){
            pixelY = 0
          }

          if(pixelX > 127){
            pixelX = 127
          }
          if(pixelX < 0){
            pixelX = 0
          }

          pixelYE_array.push(pixelY)
          pixelXE_array.push(pixelX)
        
        /*
        console.log('PixelX_array '+pixelX_array[x+(y*texture.bitmap.width)])
        console.log('PixelY_array '+pixelY_array[x+(y*texture.bitmap.width)])
        */
        })

      })

        //collect data (base map)
        Jimp.read(folder+'/'+file, (err, texture) => {
            if (err) throw err;
            texture
          .grayscale()
          .scan(0, 0, texture.bitmap.width, texture.bitmap.height, function (x, y, idx) {

            let yTop = y-1
            let yBottom = y+1
            let xRight = x+1
            let xLeft = x-1

            //wrapping
            if(yTop < 0){
              yTop = texture.bitmap.height
            }
            if(yBottom > texture.bitmap.height){
              yBottom = 0
            }
            if(xRight > texture.bitmap.width){
              xRight = 0
            }
            if(xLeft < 0){
              xLeft = texture.bitmap.width
            }

            //get values
            let pixel = Jimp.intToRGBA(texture.getPixelColor(x, y)).r
            let top = Jimp.intToRGBA(texture.getPixelColor(x, yTop)).r
            let bottom = Jimp.intToRGBA(texture.getPixelColor(x, yBottom)).r
            let right = Jimp.intToRGBA(texture.getPixelColor(xRight, y)).r
            let left = Jimp.intToRGBA(texture.getPixelColor(xLeft, y)).r

            /*
            console.log('Top '+top)
            console.log('Bottom '+bottom)
            console.log('Right '+right)
            console.log('Left '+left)
            console.log('Center '+pixel)
            */

            let pixelY = (top - pixel) + (pixel - bottom)
            let pixelX = (right - pixel) + (left - pixel)

            pixelY = (127+(pixelY/1.3))
            pixelX = (127-(pixelX/1.3))

            if(pixelY > 255){
              pixelY = 255
            }
            if(pixelY < 0){
              pixelY = 0
            }

            if(pixelX > 255){
              pixelX = 255
            }
            if(pixelX < 0){
              pixelX = 0
            }

            pixelY_array.push(pixelY)
            pixelX_array.push(pixelX)
          
          /*
          console.log('PixelX_array '+pixelX_array[x+(y*texture.bitmap.width)])
          console.log('PixelY_array '+pixelY_array[x+(y*texture.bitmap.width)])
          */
          })

        })

        await sleep(8000)

        //write data
        Jimp.read(folder+'/'+file, (err, texture) => {
          if (err) throw err;
          texture
          .scan(0, 0, texture.bitmap.width, texture.bitmap.height, function (x, y, idx) {

            this.bitmap.data[idx + 0] = pixelX_array[x+(y*texture.bitmap.width)];
            this.bitmap.data[idx + 1] = pixelY_array[x+(y*texture.bitmap.width)];
            this.bitmap.data[idx + 2] = 255;

          })
          .scale(8, Jimp.RESIZE_NEAREST_NEIGHBOR)
          .scan(0, 0, texture.bitmap.width, texture.bitmap.height, function (x, y, idx) {

            if(pixelXE_array[x+(y*texture.bitmap.width)] != 127 || pixelYE_array[x+(y*texture.bitmap.width)] != 127){
            this.bitmap.data[idx + 0] = (this.bitmap.data[idx + 0]+ pixelXE_array[x+(y*texture.bitmap.width)]*2)/3;
            this.bitmap.data[idx + 1] = (this.bitmap.data[idx + 1]+ pixelYE_array[x+(y*texture.bitmap.width)]*2)/3;
            this.bitmap.data[idx + 2] = 255;
            }
          })
          .write(folder+'/'+file)
        })
      }
    })
  }

  module.exports = {
    generateNormals,
    generateHeightNormals
}