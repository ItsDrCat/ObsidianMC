
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

function createMer(folder, fileType, Sfolder, configPath) {

    const config = require(configPath);

    console.log("Starting a MER Generation Instance!!!".pip)
    fs.readdirSync(folder).forEach(async file =>{
      //create arrays of funnies
      //for mer creation
    if(file.endsWith(fileType) &! file.endsWith('_mer'+fileType) &! file.endsWith('_h'+fileType)){
    let slicedFile = file.slice(0,-4)
    fs.readFile('./block_cat/emissive.txt', function(err, data) {
      if(err) throw err;
      var emissiveMER = data.toString().split("\n");
      if(emissiveMER.includes(file)){
        Jimp.read(folder+'/'+file, (err, texture) => {
          if (err) throw err;
          texture
            .greyscale()
            .posterize(config.emissivePosterizeIterations)
            .scan(0, 0, texture.bitmap.width, texture.bitmap.height, function (x, y, idx) {
              if(this.bitmap.data[idx] >= config.emissiveDetectMin){
                this.bitmap.data[idx] = 0
                this.bitmap.data[idx+1] = (this.bitmap.data[idx] + this.bitmap.data[idx+1])/2 - config.emissiveBrightnessSubtraction
                this.bitmap.data[idx+2] = 255 - (this.bitmap.data[idx=2]/6)
              }else{
                this.bitmap.data[idx+1] = 0
                this.bitmap.data[idx] = 0
                this.bitmap.data[idx=2] = 255 - (this.bitmap.data[idx=2]/config.emissiveRoughnessDivision)
              }
              if(this.bitmap.data[idx+1] > 255){
                this.bitmap.data[idx+1] = 255
              }
              if(this.bitmap.data[idx+2] > 255){
                this.bitmap.data[idx+2] = 255
              }

              if(this.bitmap.data[idx+1] < 0){
                this.bitmap.data[idx+1] = 0
              }
              if(this.bitmap.data[idx+2] < 0){
                this.bitmap.data[idx+2] = 0
              }
  
            })
            .write(Sfolder+'/'+slicedFile+"_mer.png"); // save
        });
      }
    });
    await sleep(3200)
    fs.readFile('./block_cat/flora.txt', function(err, data) {
      if(err) throw err;
      var floraMER = data.toString().split("\n");
      if(floraMER.includes(file)){
      Jimp.read(folder+'/'+file, (err, texture) => {
        if (err) throw err;
        texture
      .scan(0, 0, texture.bitmap.width, texture.bitmap.height, function (x, y, idx) {
        let greyscaleVal = (this.bitmap.data[idx]+this.bitmap.data[idx+1]+this.bitmap.data[idx+2])/3
        if(this.bitmap.data[idx] > greyscaleVal){
          this.bitmap.data[idx] = config.floraFlowerRed
          this.bitmap.data[idx+1] = config.floraFlowerGreen
          this.bitmap.data[idx+2] = config.floraFlowerBlue
        }else if(this.bitmap.data[idx+1] > greyscaleVal){
          this.bitmap.data[idx] = config.floraStemRed
          this.bitmap.data[idx+1] = config.floraStemGreen
          this.bitmap.data[idx+2] = config.floraStemBlue
        }else if(this.bitmap.data[idx+2] > greyscaleVal){
          this.bitmap.data[idx] = config.floraFlowerRed
          this.bitmap.data[idx+1] = config.floraFlowerGreen
          this.bitmap.data[idx+2] = config.floraFlowerBlue
        }else{
          this.bitmap.data[idx+1] = 0
          this.bitmap.data[idx] = 0
          this.bitmap.data[idx+2] = 255
        }})
        .write(Sfolder+'/'+slicedFile+"_mer.png"); // save});
    }
    )}})
  
      
    await sleep(3400)
    fs.readFile('./block_cat/matte.txt', function(err, data) {
      if(err) throw err;
      var matteMER = data.toString().split("\n");
      if(matteMER.includes(file)){
      Jimp.read(folder+'/'+file, (err, texture) => {
        if (err) throw err;
        texture
      .greyscale()
      .scan(0, 0, texture.bitmap.width, texture.bitmap.height, function (x, y, idx) {
        this.bitmap.data[idx+1] = 0
        this.bitmap.data[idx] = 0
        this.bitmap.data[idx+2] = config.matteRoughness
      })
      .write(Sfolder+'/'+slicedFile+"_mer.png"); // save
    })}
    });
    await sleep(3600)
    fs.readFile('./block_cat/metal.txt', function(err, data) {
      if(err) throw err;
      var metalMER = data.toString().split("\n");
      if(metalMER.includes(file)){
      Jimp.read(folder+'/'+file, (err, texture) => {
        if (err) throw err;
        texture
      .greyscale()
      .contrast(config.metalContrast)
      //posterize maybe?
      .posterize(config.metalPosterize) //add config
      .scan(0, 0, texture.bitmap.width, texture.bitmap.height, function (x, y, idx) {
        this.bitmap.data[idx+1] = 0
        this.bitmap.data[idx] = (((255 - this.bitmap.data[idx])*config.metalMetalMultiplier)+config.metalMetalAverage)/1.3
        if(this.bitmap.data[idx] > 255){
          this.bitmap.data[idx] = 255
        }
        if(this.bitmap.data[idx+2] > 255){
          this.bitmap.data[idx+2] = 255
        }

        if(this.bitmap.data[idx] < 0){
          this.bitmap.data[idx] = 0
        }
        if(this.bitmap.data[idx+2] < 0){
          this.bitmap.data[idx+2] = 0
        }
        this.bitmap.data[idx+2] = ((this.bitmap.data[idx]/2)-config.metalRoughnessSubtraction)/4
      })
      .write(Sfolder+'/'+slicedFile+"_mer.png"); // save
    })}
    });
    await sleep(3800)
    fs.readFile('./block_cat/n_flora.txt', function(err, data) {
      if(err) throw err;
      var n_floraMER = data.toString().split("\n");
      if(n_floraMER.includes(file)){
      Jimp.read(folder+'/'+file, (err, texture) => {
        if (err) throw err;
        texture
      .greyscale()
      .scan(0, 0, texture.bitmap.width, texture.bitmap.height, function (x, y, idx) {
        this.bitmap.data[idx+1] = 0
        this.bitmap.data[idx] = 0
        this.bitmap.data[idx+2] = config.netherFloraBaseRoughness - this.bitmap.data[idx]/config.netherFloraDivision
      })
      .write(Sfolder+'/'+slicedFile+"_mer.png"); // save
    })}
    });
    await sleep(4000)
    fs.readFile('./block_cat/ore.txt', function(err, data) {
      if(err) throw err;
      var oreMER = data.toString().split("\n");
      if(oreMER.includes(file)){
      Jimp.read(folder+'/'+file, (err, texture) => {
        if (err) throw err;
        texture
      .scan(0, 0, texture.bitmap.width, texture.bitmap.height, function (x, y, idx) {
        let greyscaleVal = (this.bitmap.data[idx]+this.bitmap.data[idx+1]+this.bitmap.data[idx+2])/3
        if(this.bitmap.data[idx] > (greyscaleVal + config.oreStoneDetectionRange) || this.bitmap.data[idx] < (greyscaleVal + -config.oreStoneDetectionRange)){
          this.bitmap.data[idx+1] = config.oreOreGreen
          this.bitmap.data[idx] = config.oreOreRed
          this.bitmap.data[idx+2] = config.oreOreBlue
        }else if(this.bitmap.data[idx+1] > (greyscaleVal + config.oreStoneDetectionRange) || this.bitmap.data[idx] < (greyscaleVal + -config.oreStoneDetectionRange)){
          this.bitmap.data[idx+1] = config.oreOreGreen
          this.bitmap.data[idx] = config.oreOreRed
          this.bitmap.data[idx+2] = config.oreOreBlue
        }else if(this.bitmap.data[idx+2] > (greyscaleVal + config.oreStoneDetectionRange) || this.bitmap.data[idx] < (greyscaleVal + -config.oreStoneDetectionRange)){
          this.bitmap.data[idx+1] = config.oreOreGreen
          this.bitmap.data[idx] = config.oreOreRed
          this.bitmap.data[idx+2] = config.oreOreBlue
        }else{
        this.bitmap.data[idx+1] = 0
        this.bitmap.data[idx] = 0
        this.bitmap.data[idx+2] = config.stoneBaseRoughness - (((this.bitmap.data[idx+2]/0.4) + config.stoneSubtractRoughnessAverage*3)/4)
        if(this.bitmap.data[idx+2] > 255){
          this.bitmap.data[idx+2] = 255
        }
        }
      })
      .write(Sfolder+'/'+slicedFile+"_mer.png"); // save
    })
      
    }
    });
    await sleep(4200)
    fs.readFile('./block_cat/redstone.txt', function(err, data) {
      if(err) throw err;
      var redstoneMER = data.toString().split("\n");
      if(redstoneMER.includes(file)){
      Jimp.read(folder+'/'+file, (err, texture) => {
        if (err) throw err;
        texture
      .scan(0, 0, texture.bitmap.width, texture.bitmap.height, function (x, y, idx) {
        if(this.bitmap.data[idx]-((this.bitmap.data[idx+1] + this.bitmap.data[idx])/2) >= config.redstoneDetectMin)
        {
          this.bitmap.data[idx+1] = this.bitmap.data[idx]*config.redstoneEmissiveMultiplier
          this.bitmap.data[idx] = 0
          this.bitmap.data[idx+2] = 0
        }else{
          this.bitmap.data[idx+1] = 0
          this.bitmap.data[idx] = 25
          this.bitmap.data[idx+2] = 150 - this.bitmap.data[idx]*0.75
        }
  
        if(this.bitmap.data[idx+1] > 255){
          this.bitmap.data[idx+1] = 255
        }
      })
      .write(Sfolder+'/'+slicedFile+"_mer.png"); // save
    })}
    });
    await sleep(4400)
    fs.readFile('./block_cat/sculk.txt', function(err, data) {
      if(err) throw err;
      var sculkMER = data.toString().split("\n");
      if(sculkMER.includes(file)){
      Jimp.read(folder+'/'+file, (err, texture) => {
        if (err) throw err;
        texture
      .scan(0, 0, texture.bitmap.width, texture.bitmap.height, function (x, y, idx) {
        if((this.bitmap.data[idx+2]-((this.bitmap.data[idx+1] + this.bitmap.data[idx])/2)) >= 35){
          this.bitmap.data[idx+1] = this.bitmap.data[idx+2]+20
          this.bitmap.data[idx] = 0
          this.bitmap.data[idx+2] = this.bitmap.data[idx+2]*config.sculkEmissiveMultiplier
        }else{
          this.bitmap.data[idx+1] = 0
          this.bitmap.data[idx] = 0
          this.bitmap.data[idx+2] = this.bitmap.data[idx+2]/config.sculkRoughnessDivision
        }
      })
      .write(Sfolder+'/'+slicedFile+"_mer.png"); // save
    })}
    });
    await sleep(4600)
    fs.readFile('./block_cat/shiny.txt', function(err, data) {
      if(err) throw err;
      var shinyMER = data.toString().split("\n");
      if(shinyMER.includes(file)){
      Jimp.read(folder+'/'+file, (err, texture) => {
        if (err) throw err;
        texture
      .greyscale()
      .scan(0, 0, texture.bitmap.width, texture.bitmap.height, function (x, y, idx) {
        this.bitmap.data[idx+1] = 0
        this.bitmap.data[idx] = config.shinyMetal
        this.bitmap.data[idx+2] = ((config.shinyBaseRoughness - this.bitmap.data[idx+2]) + config.shinyAverage)/2
        //add shiny config later

        if(this.bitmap.data[idx] > 255){
          this.bitmap.data[idx] = 255
        }
        if(this.bitmap.data[idx+2] > 255){
          this.bitmap.data[idx+2] = 255
        }

        if(this.bitmap.data[idx] < 0){
          this.bitmap.data[idx] = 0
        }
        if(this.bitmap.data[idx+2] < 0){
          this.bitmap.data[idx+2] = 0
        }
      })
      .write(Sfolder+'/'+slicedFile+"_mer.png"); // save
    })}
    });
    await sleep(4800)
    fs.readFile('./block_cat/stone.txt', function(err, data) {
      if(err) throw err;
      var stoneMER = data.toString().split("\n");
      if(stoneMER.includes(file)){
      Jimp.read(folder+'/'+file, (err, texture) => {
        if (err) throw err;
        texture
      .greyscale()
      .scan(0, 0, texture.bitmap.width, texture.bitmap.height, function (x, y, idx) {
        this.bitmap.data[idx+1] = 0
        this.bitmap.data[idx] = 0
        this.bitmap.data[idx+2] = config.stoneBaseRoughness - (((this.bitmap.data[idx+2]/0.4) + config.stoneSubtractRoughnessAverage*3)/4)
        if(this.bitmap.data[idx+2] > 255){
          this.bitmap.data[idx+2] = 255
        }
      })
      .write(Sfolder+'/'+slicedFile+"_mer.png"); // save
    })}
    });
    await sleep(5000)
    fs.readFile('./block_cat/water.txt', function(err, data) {
      if(err) throw err;
      var waterMER = data.toString().split("\n");
      if(waterMER.includes(file)){
      Jimp.read(folder+'/'+file, (err, texture) => {
        if (err) throw err;
        texture
      .greyscale()
      .scan(0, 0, texture.bitmap.width, texture.bitmap.height, function (x, y, idx) {
        this.bitmap.data[idx+1] = 0
        this.bitmap.data[idx] = config.waterMetal
        this.bitmap.data[idx+2] = config.waterRoughness
      })
      .write(Sfolder+'/'+slicedFile+"_mer.png"); // save
    })}
    });
    await sleep(5200)
    fs.readFile('./block_cat/wood.txt', function(err, data) {
      if(err) throw err;
      var woodMER = data.toString().split("\n");
      if(woodMER.includes(file)){
      Jimp.read(folder+'/'+file, (err, texture) => {
        if (err) throw err;
        texture
      .greyscale()
      .scan(0, 0, texture.bitmap.width, texture.bitmap.height, function (x, y, idx) {
        this.bitmap.data[idx+1] = 0
        this.bitmap.data[idx] = 0
        this.bitmap.data[idx+2] = config.woodBaseRoughness - (this.bitmap.data[idx+2]+(config.woodSubtractRoughnessAverage*3))/4
      })
      .contrast(0.5)
      .write(Sfolder+'/'+slicedFile+"_mer.png"); // save
    })}
    });
    }})
  }

  module.exports = {
    createMer
}