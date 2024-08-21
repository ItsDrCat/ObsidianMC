
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

function heightmapProcess(folder, configPath){

    const config = require(configPath);

    //png
  console.log("Starting Heightmap Generation Process!!!".pip)
  fs.readdirSync(folder).forEach(async file => {
    if(file.endsWith('.png') &! file.endsWith('_h.png') &! file.endsWith('_mer.png')){

      if(file.includes('glass')){
        Jimp.read(folder+'/'+file, (err, texture) => {
          if (err) throw err;
          texture
          .scan(0, 0, texture.bitmap.width, texture.bitmap.height, function (x, y, idx) {
            this.bitmap.data[idx+3] = 127
            if(config.isDeferred == true){
              this.bitmap.data[idx+3] = 150
            }
        })
    
          .write(folder+'/'+file); // save
        });
      }
    let slicedFile = file.slice(0,-4)
    Jimp.read(folder+'/'+file, (err, texture) => {
      if (err) throw err;
      texture
        .greyscale()
        .contrast(config.contrast)
        .posterize(config.heightIterations)
        .write(folder+'/'+slicedFile+"_h.png"); // save
    });
    

    //start texture_set file
    var writeStream = fs.createWriteStream(folder+'/'+slicedFile+".texture_set.json");
    if(config.generateNormalmaps){
      writeStream.write('{"format_version":"1.16.100","minecraft:texture_set":{"color": "'+ slicedFile +'","metalness_emissive_roughness":"'+ slicedFile +'_mer","normal": "'+ slicedFile +'_h"}}')
      }else{
      writeStream.write('{"format_version":"1.16.100","minecraft:texture_set":{"color": "'+ slicedFile +'","metalness_emissive_roughness":"'+ slicedFile +'_mer","heightmap": "'+ slicedFile +'_h"}}')        
      }  }
  });
}

module.exports = {
    heightmapProcess
}