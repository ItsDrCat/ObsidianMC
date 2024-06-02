
const { createRequire } = require('node:module');
require = createRequire(__filename); 

const process= require('process');
process.removeAllListeners('warning');

const appSettings = require('./settings.json')

//node.js packages
var Jimp = require("jimp");
const insertLine = require('insert-line')
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
let folder = './test/';

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}


(async () => {
  fs.readdirSync('./tempimg/').forEach(async file => {
    if(file != 'empty.txt'){
    fs.unlink('./tempimg/'+file, (err) => {
      if (err) throw err;
    });
  }
  });



  console.clear();
  //boot sequence
  //oh my god, its so shit
  //remember that you have to make a toggle for this bud
  if(appSettings.doBootAnimation == true){
  console.log('************** OBSIDIAN-MC V0.1.0 **************'.pip)
  console.log('\r\n')
  await sleep (200)
  console.log('MADE BY ITSDRCAT'.pip)
  await sleep (200)
  console.log('CURRENT USER: '.pip + user.pip);
  await sleep (200)
  console.log('OPERATING SYSTEM PLATFORM: '.pip + uPlatform.pip)
  await sleep (200)
  console.log('BLAH BLAH BLAH'.pip)
  await sleep (200)
  console.log('YOU SHOULD JOIN MY DISCORD SERVER'.pip)
  await sleep (200)
  console.log('https://discord.gg/8wKA8W6zAY'.pip)
  await sleep (1000)
  console.clear();
  console.log(" /\\____/\\ ".pip);
  console.log("( * w  * )".pip);
  console.log("C       C|".pip);
  console.log("|        |".pip);
  console.log("C_______C|==".pip);
  console.log("  LOADING...".pip)
  await sleep (600)
  console.clear();
  console.log(" /\\____/\\ ".pip);
  console.log("( * w  * )".pip);
  console.log("C       C|".pip);
  console.log("|        | /".pip);
  console.log("C_______C|/".pip);
  console.log("  LOADING...".pip)
  await sleep (600)
  console.clear();
  console.log(" /\\____/\\ ".pip);
  console.log("( * w  * )".pip);
  console.log("C       C|".pip);
  console.log("|        |".pip);
  console.log("C_______C|==".pip);
  console.log("  LOADING...".pip)
  await sleep (600)
  console.clear();
  console.log(" /\\____/\\ ".pip);
  console.log("( * w  * )".pip);
  console.log("C       C|".pip);
  console.log("|        | /".pip);
  console.log("C_______C|/".pip);
  console.log("  LOADING...".pip)
  await sleep (600)
  console.clear();
  console.log(" /\\____/\\ ".pip);
  console.log("( * w  * )".pip);
  console.log("C       C|".pip);
  console.log("|        |".pip);
  console.log("C_______C|==".pip);
  console.log("  LOADING...".pip)
  await sleep (600)
  console.clear();
  console.log(" /\\____/\\ ".pip);
  console.log("( * w  * )".pip);
  console.log("C       C|".pip);
  console.log("|        | /".pip);
  console.log("C_______C|/".pip);
  console.log("  LOADING...".pip)
  await sleep (600)
  console.clear();
  }

  //settings

  console.log('\r\n')

  if(uPlatform != 'win32'){
  console.log('Obsidian was designed for Windows devices, please precede with caution!!!'.error)
  console.log('\r\n')
  }

  console.log('Obsidian'.brightBlue)
  console.log('DevMerSetup'.brightBlue)
  console.log('QuickNewPreset'.brightBlue)
  console.log('QuickSetupPack'.brightBlue)

  const command = await prompts({
    type: 'text',
    name: 'option',
    message: 'What do you want to do? (Choices listed above)'
    
  });

  if(command.option == 'Obsidian'){

  fs.readdirSync('./presets/').forEach(file => {
    console.log(file.brightBlue)
  });

  const preset = await prompts({
    type: 'text',
    name: 'preset',
    message: 'What preset do you want to use? (Choices listed above)'
    
  });

  //import preset stuffs
  const config = require('./presets/'+preset.preset+'/config.json')


  fs.readdirSync('C:/Users/'+user+'/AppData/Local/Packages/Microsoft.MinecraftUWP_8wekyb3d8bbwe/LocalState/games/com.mojang/development_resource_packs/').forEach(file => {
    console.log(file.brightBlue)
  });

  const packName = await prompts({
    type: 'text',
    name: 'name',
    message: 'What is the name of the pack? (Choices listed above)'
    
  });

  let folder = 'C:/Users/'+user+'/AppData/Local/Packages/Microsoft.MinecraftUWP_8wekyb3d8bbwe/LocalState/games/com.mojang/development_resource_packs/'+ packName.name +'/textures/blocks'
  console.log(folder.silly)
  //file stuff

  if(config.useCustomGlass == true){
    fs.copySync('./presets/'+preset.preset+'/assets/glass',folder,{recursive: true})
  }
  if(config.forceCustomWater == true){
    fs.copySync('./presets/'+preset.preset+'/assets/water',folder,{recursive: true})
  }

  //fog folder
  try {
    if (!fs.existsSync('C:/Users/'+user+'/AppData/Local/Packages/Microsoft.MinecraftUWP_8wekyb3d8bbwe/LocalState/games/com.mojang/development_resource_packs/'+ packName.name +'/fogs')) {
      fs.mkdirSync('C:/Users/'+user+'/AppData/Local/Packages/Microsoft.MinecraftUWP_8wekyb3d8bbwe/LocalState/games/com.mojang/development_resource_packs/'+ packName.name +'/fogs');
    }
  } catch (err) {
    console.error(err);
  }

  fs.readdirSync('C:/Users/'+user+'/AppData/Local/Packages/Microsoft.MinecraftUWP_8wekyb3d8bbwe/LocalState/games/com.mojang/development_resource_packs/'+ packName.name +'/fogs').forEach(async file => {
    fs.unlink('C:/Users/'+user+'/AppData/Local/Packages/Microsoft.MinecraftUWP_8wekyb3d8bbwe/LocalState/games/com.mojang/development_resource_packs/'+ packName.name +'/fogs/'+file, (err) => {
      if (err) throw err;
  });
  }) 


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
        })
        .write(folder+'/water_still_grey.png'); // save
    });
  }
    await sleep(3000)
    

    //start texture_set file
    var writeStream = fs.createWriteStream(folder+'/'+slicedFile+".texture_set.json");
    writeStream.write('{"format_version":"1.16.100","minecraft:texture_set":{"color": "'+ slicedFile +'","metalness_emissive_roughness":"'+ slicedFile +'_mer","heightmap": "'+ slicedFile +'_h"}}')    
  }
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
    writeStream.write('{"format_version":"1.16.100","minecraft:texture_set":{"color": "'+ slicedFile +'","metalness_emissive_roughness":"'+ slicedFile +'_mer","heightmap": "'+ slicedFile +'_h"}}')

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
      writeStream.write('{"format_version":"1.16.100","minecraft:texture_set":{"color": "'+ slicedFile +'","metalness_emissive_roughness":"'+ slicedFile +'_mer","heightmap": "'+ slicedFile +'_h"}}')
  
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
        writeStream.write('{"format_version":"1.16.100","minecraft:texture_set":{"color": "'+ slicedFile +'","metalness_emissive_roughness":"'+ slicedFile +'_mer","heightmap": "'+ slicedFile +'_h"}}')
    
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
      writeStream.write('{"format_version":"1.16.100","minecraft:texture_set":{"color": "'+ slicedFile +'","metalness_emissive_roughness":"'+ slicedFile +'_mer","heightmap": "'+ slicedFile +'_h"}}')
    }
    });
    
    function createMer(folder, fileType, Sfolder) {

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
          this.bitmap.data[idx] = (((255 - this.bitmap.data[idx])*config.metalMetalMultiplier)+config.metalMetalAverage)/2
          if(this.bitmap.data[idx] > 255){
            this.bitmap.data[idx] = 255
          }
          this.bitmap.data[idx+2] = (this.bitmap.data[idx]/2)-config.metalRoughnessSubtraction
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

    await sleep(11000)
    try{
      createMer(folder,'.png', folder)
    } catch (error){
      console.warn(error);
    }
    await sleep(5000)
    try{
      if(fs.existsSync(folder+'/candles')){
      createMer(folder+'/candles','.png', folder+'/candles')
      }
    } catch (error){
      console.warn(error);
    }
    await sleep(5000)
    try{
      if(fs.existsSync(folder+'/deepslate')){
      createMer(folder+'/deepslate','.png', folder+'/deepslate')
      }
    } catch (error){
      console.warn(error);
    }
    await sleep(5000)
    try{
      if(fs.existsSync(folder+'/huge_fungus')){
      createMer(folder+'/huge_fungus','.png', folder+'/huge_fungus')
      }
    } catch (error){
      console.warn(error);
    }
    await sleep(5000)
    createMer('./tempimg','.png', folder)
    fs.cpSync('./presets/'+preset.preset+'/fogs', 'C:/Users/'+user+'/AppData/Local/Packages/Microsoft.MinecraftUWP_8wekyb3d8bbwe/LocalState/games/com.mojang/development_resource_packs/'+ packName.name +'/fogs', {recursive: true});
    fs.cpSync('./presets/'+preset.preset+'/biomes_client.json', 'C:/Users/'+user+'/AppData/Local/Packages/Microsoft.MinecraftUWP_8wekyb3d8bbwe/LocalState/games/com.mojang/development_resource_packs/'+ packName.name +'/biomes_client.json', {recursive: false});

    console.log("\r\nPlease wait until Obsidian automatically closes this window. \r\nThis may take some time...".brightMagenta)
    

    //manifest.json checking system
    fs.access('C:/Users/'+user+'/AppData/Local/Packages/Microsoft.MinecraftUWP_8wekyb3d8bbwe/LocalState/games/com.mojang/development_resource_packs/'+ packName.name +'/obsidian.txt', fs.constants.F_OK, (err) => {
      if(err){
        var writeStream = fs.createWriteStream('C:/Users/'+user+'/AppData/Local/Packages/Microsoft.MinecraftUWP_8wekyb3d8bbwe/LocalState/games/com.mojang/development_resource_packs/'+ packName.name +'/manifest.json');
        writeStream.write('{"format_version": 2,"header": {"name": "'+packName.name+'-Obsidian","description": "An ObsidianMC conversion of '+packName.name+'","uuid": "'+uuidv4()+'","version": [1, 0, 0],"min_engine_version": [1, 16, 0]},"modules": [{"type": "resources","uuid": "'+uuidv4()+'","version": [1, 0, 0]}], "capabilities":["raytraced"]}')
        var writeStream = fs.createWriteStream('C:/Users/'+user+'/AppData/Local/Packages/Microsoft.MinecraftUWP_8wekyb3d8bbwe/LocalState/games/com.mojang/development_resource_packs/'+ packName.name +'/obsidian.txt');
        writeStream.write('This pack was converted to RTX with Obsidian! :3')
      }
    });
    
    
  }else if(command.option == 'DevMerSetup'){
    fs.readdirSync('./block_cat/').forEach(file => {
      console.log(file.brightRed)
    });
    
    const confirmDevMer = await prompts({
      type: 'text',
      name: 'val',
      message: 'Do you want to generate MER lists? (Based of folders aboved) [Y] or [N]'
    });

    //this worked first try lol
    //make lists of block textures
    if(confirmDevMer.val == "Y"){
      fs.readdirSync('./block_cat/').forEach(folder => {
        fs.readdirSync('./block_cat/'+folder+'/').forEach(file => {
          let slicedFile = file.slice(0,-4)
          fs.appendFile('./block_cat/'+folder+'.txt', slicedFile+'.png\n', function (err) {
            if (err) throw err;
            console.log('Saved '+file.bgGreen);
          })
        });
      });
    

    }else{
      console.log('stopping...'.silly)
    }

  }else if(command.option == 'QuickNewPreset'){
    const newPresetName = await prompts({
      type: 'text',
      name: 'name',
      message: 'What do you want to name the new preset?'
    });

    try {
      if (!fs.existsSync('./presets/'+newPresetName.name)) {
        fs.mkdirSync('./presets/'+newPresetName.name);
        fs.mkdirSync('./presets/'+newPresetName.name+'/fogs');
        fs.mkdirSync('./presets/'+newPresetName.name+'/assets');
        fs.mkdirSync('./presets/'+newPresetName.name+'/assets/glass');
        fs.mkdirSync('./presets/'+newPresetName.name+'/assets/water');
        fs.copy('./presets/Default/config.json','./presets/'+newPresetName.name+'/config.json')
        var writeStream = fs.createWriteStream('./presets/'+newPresetName.name+'/biomes_client.json')
        writeStream.write('{\r\n"biomes": {\r\n\r\n}\r\n}')
        console.log('Should be complete!!!'.rainbow)
      }
    } catch (err) {
      console.error(err);
    }


  }else if(command.option == 'QuickSetupPack'){
    fs.readdirSync('C:/Users/'+user+'/AppData/Local/Packages/Microsoft.MinecraftUWP_8wekyb3d8bbwe/LocalState/games/com.mojang/resource_packs/').forEach(file => {
      console.log(file.brightBlue)
    });
    console.log("\r\n(Running this command is optional and is not required to use Obsidian!)".brightMagenta)
    const selectedPack = await prompts({
      type: 'text',
      name: 'name',
      message: 'Which resource pack would you like to prepare?'
    });
    fs.copySync('C:/Users/'+user+'/AppData/Local/Packages/Microsoft.MinecraftUWP_8wekyb3d8bbwe/LocalState/games/com.mojang/resource_packs/'+selectedPack.name,'C:/Users/'+user+'/AppData/Local/Packages/Microsoft.MinecraftUWP_8wekyb3d8bbwe/LocalState/games/com.mojang/development_resource_packs/'+selectedPack.name,{recursive: true})
    //manifest.json checking system
    fs.access('C:/Users/'+user+'/AppData/Local/Packages/Microsoft.MinecraftUWP_8wekyb3d8bbwe/LocalState/games/com.mojang/development_resource_packs/'+ selectedPack.name +'/obsidian.txt', fs.constants.F_OK, (err) => {
      if(err){
        var writeStream = fs.createWriteStream('C:/Users/'+user+'/AppData/Local/Packages/Microsoft.MinecraftUWP_8wekyb3d8bbwe/LocalState/games/com.mojang/development_resource_packs/'+ selectedPack.name +'/manifest.json');
        writeStream.write('{"format_version": 2,"header": {"name": "'+selectedPack.name+'-Obsidian","description": "An ObsidianMC conversion of '+selectedPack.name+'","uuid": "'+uuidv4()+'","version": [1, 0, 0],"min_engine_version": [1, 16, 0]},"modules": [{"type": "resources","uuid": "'+uuidv4()+'","version": [1, 0, 0]}], "capabilities":["raytraced"]}')
        var writeStream = fs.createWriteStream('C:/Users/'+user+'/AppData/Local/Packages/Microsoft.MinecraftUWP_8wekyb3d8bbwe/LocalState/games/com.mojang/development_resource_packs/'+ selectedPack.name +'/obsidian.txt');
        writeStream.write('This pack was converted to RTX with Obsidian! :3')
      }
    });

    console.log("DONE!!! :3".brightMagenta)
  }
})();