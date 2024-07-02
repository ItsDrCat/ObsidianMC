
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

    //fix water


    if(!fs.existsSync(folder+'/water_flow_grey.png')){
      fs.copySync('./presets/'+preset.preset+'/assets/water/water_flow_grey.png',folder)
    }

    if(!fs.existsSync(folder+'/water_still_grey.png')){
      fs.copySync('./presets/'+preset.preset+'/assets/water/water_still_grey.png',folder)
    }

    if(fs.existsSync(folder+'/water_flow_grey.png')){
    Jimp.read(folder+'/water_flow_grey.png', (err, texture) => {
      if (err) throw err;
      texture
        .scan(0, 0, texture.bitmap.width, texture.bitmap.height, function (x, y, idx) {
            this.bitmap.data[idx+3] = 127
            if(config.isDeferred == true){
              this.bitmap.data[idx+3] = 150
            }
        })
        .write(folder+'/water_flow_grey.png'); // save
    });
  }
  if(fs.existsSync(folder+'/water_still_grey.png')){
    Jimp.read(folder+'/water_still_grey.png', (err, texture) => {
      if (err) throw err;
      texture
        .scan(0, 0, texture.bitmap.width, texture.bitmap.height, function (x, y, idx) {
            this.bitmap.data[idx+3] = 127
            if(config.isDeferred == true){
              this.bitmap.data[idx+3] = 150
            }
        })
        .write(folder+'/water_still_grey.png'); // save
    });
  }
    await sleep(3000)
    

    //start texture_set file
    var writeStream = fs.createWriteStream(folder+'/'+slicedFile+".texture_set.json");
    if(config.generateNormalmaps){
      writeStream.write('{"format_version":"1.16.100","minecraft:texture_set":{"color": "'+ slicedFile +'","metalness_emissive_roughness":"'+ slicedFile +'_mer","normal": "'+ slicedFile +'_h"}}')
      }else{
      writeStream.write('{"format_version":"1.16.100","minecraft:texture_set":{"color": "'+ slicedFile +'","metalness_emissive_roughness":"'+ slicedFile +'_mer","heightmap": "'+ slicedFile +'_h"}}')        
      }  }
  });
  if(fs.existsSync(folder+'/deepslate')){
  fs.readdirSync(folder+'/deepslate').forEach(async file => {
    if(file.endsWith('.png') &! file.endsWith('_h.png') &! file.endsWith('_mer.png')){
    let slicedFile = file.slice(0,-4)
    Jimp.read(folder+'/deepslate/'+file, (err, texture) => {
      if (err) throw err;
      texture
        .greyscale()
        .contrast(config.contrast)
        .posterize(config.heightIterations)
        .write(folder+'/deepslate/'+slicedFile+"_h.png"); // save
    });

    await sleep(3000)
    

    //start texture_set file
    var writeStream = fs.createWriteStream(folder+'/deepslate/'+slicedFile+".texture_set.json");
    if(config.generateNormalmaps){
      writeStream.write('{"format_version":"1.16.100","minecraft:texture_set":{"color": "'+ slicedFile +'","metalness_emissive_roughness":"'+ slicedFile +'_mer","normal": "'+ slicedFile +'_h"}}')
      }else{
      writeStream.write('{"format_version":"1.16.100","minecraft:texture_set":{"color": "'+ slicedFile +'","metalness_emissive_roughness":"'+ slicedFile +'_mer","heightmap": "'+ slicedFile +'_h"}}')        
      }
    }})}
    if(fs.existsSync(folder+'/huge_fungus')){
    fs.readdirSync(folder+'/huge_fungus').forEach(async file => {
      if(file.endsWith('.png') &! file.endsWith('_h.png') &! file.endsWith('_mer.png')){
      let slicedFile = file.slice(0,-4)
      Jimp.read(folder+'/huge_fungus/'+file, (err, texture) => {
        if (err) throw err;
        texture
          .greyscale()
          .contrast(config.contrast)
          .posterize(config.heightIterations)
          .write(folder+'/huge_fungus/'+slicedFile+"_h.png"); // save
      });
  
      await sleep(3000)
      
  
      //start texture_set file
      var writeStream = fs.createWriteStream(folder+'/huge_fungus/'+slicedFile+".texture_set.json");
      if(config.generateNormalmaps){
        writeStream.write('{"format_version":"1.16.100","minecraft:texture_set":{"color": "'+ slicedFile +'","metalness_emissive_roughness":"'+ slicedFile +'_mer","normal": "'+ slicedFile +'_h"}}')
        }else{
        writeStream.write('{"format_version":"1.16.100","minecraft:texture_set":{"color": "'+ slicedFile +'","metalness_emissive_roughness":"'+ slicedFile +'_mer","heightmap": "'+ slicedFile +'_h"}}')        
        }  
      }})}
      if(fs.existsSync(folder+'/candles')){
      fs.readdirSync(folder+'/candles').forEach(async file => {
        if(file.endsWith('.png') &! file.endsWith('_h.png') &! file.endsWith('_mer.png')){
        let slicedFile = file.slice(0,-4)
        Jimp.read(folder+'/candles/'+file, (err, texture) => {
          if (err) throw err;
          texture
            .greyscale()
            .contrast(config.contrast)
            .posterize(config.heightIterations)
            .write(folder+'/candles/'+slicedFile+"_h.png"); // save
        });
    
        await sleep(3000)
        
    
        //start texture_set file
        var writeStream = fs.createWriteStream(folder+'/candles/'+slicedFile+".texture_set.json");
        if(config.generateNormalmaps){
          writeStream.write('{"format_version":"1.16.100","minecraft:texture_set":{"color": "'+ slicedFile +'","metalness_emissive_roughness":"'+ slicedFile +'_mer","normal": "'+ slicedFile +'_h"}}')
          }else{
          writeStream.write('{"format_version":"1.16.100","minecraft:texture_set":{"color": "'+ slicedFile +'","metalness_emissive_roughness":"'+ slicedFile +'_mer","heightmap": "'+ slicedFile +'_h"}}')        
          }    
        }})}


    //tga
    fs.readdirSync(folder).forEach(async file => {
      if(file.endsWith('.tga') &! file.endsWith('_h.tga')){
      let slicedFile = file.slice(0,-4)
      
      fs.copyFile(folder+'/'+file,'./tempimg/'+file, (err) => {
        if (err) {
          // handle error
          console.log(err);
          return;
        }
      })

      await sleep(3000)
      //this took away so much of my sanity
      var tga = new TGA(fs.readFileSync('./tempimg/'+file));
      var PNG = require('pngjs').PNG;
      var png = new PNG({
        width: tga.width,
        height: tga.height
      });
      png.data = tga.pixels;
      png.pack().pipe(fs.createWriteStream('./tempimg/'+slicedFile+'.png'));
      await sleep(9000)
      Jimp.read('./tempimg/'+slicedFile+'.png', (err, texture) => {
        if (err) throw err;
        texture
          .greyscale()
          .contrast(config.contrast)
          .posterize(config.heightIterations)
          .write(folder+'/'+slicedFile+'_h.png'); // save
      });
      //start texture_set file
      var writeStream = fs.createWriteStream(folder+'/'+slicedFile+".texture_set.json");
      if(config.generateNormalmaps){
      writeStream.write('{"format_version":"1.16.100","minecraft:texture_set":{"color": "'+ slicedFile +'","metalness_emissive_roughness":"'+ slicedFile +'_mer","normal": "'+ slicedFile +'_h"}}')
      }else{
      writeStream.write('{"format_version":"1.16.100","minecraft:texture_set":{"color": "'+ slicedFile +'","metalness_emissive_roughness":"'+ slicedFile +'_mer","heightmap": "'+ slicedFile +'_h"}}')        
      }
    }
    });
}

module.exports = {
    heightmapProcess
}