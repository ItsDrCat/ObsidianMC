
const { createRequire } = require('node:module');
require = createRequire(__filename); 

const process= require('process');
process.removeAllListeners('warning');

const appSettings = require('./settings.json')

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

const heightmap = require('./src/heightmap.js')
const mer = require('./src/mer.js')
const normalmap = require('./src/normalmap.js')


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

  fs.readdirSync('./src/presets/').forEach(file => {
    console.log(file.brightBlue)
  });

  const preset = await prompts({
    type: 'text',
    name: 'preset',
    message: 'What preset do you want to use? (Choices listed above)'
    
  });

  //import preset stuffs
  const configPath = __dirname+'\\src\\presets\\'+preset.preset+'\\config.json'
  const config = require(configPath);
  console.log(config.heightIterations)


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
  if(fs.existsSync(folder)){
  if(config.useCustomGlass == true){
    fs.copySync('./src/presets/'+preset.preset+'/assets/glass',folder,{recursive: true})
  }
  if(config.forceCustomWater == true){
    fs.copySync('./src/presets/'+preset.preset+'/assets/water',folder,{recursive: true})
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


  heightmap.heightmapProcess(folder, configPath)
    await sleep(11000)
    try{
      mer.createMer(folder,'.png', folder, configPath)
    } catch (error){
      console.warn(error);
    }
    await sleep(5000)
    try{
      if(fs.existsSync(folder+'/candles')){
      mer.createMer(folder+'/candles','.png', folder+'/candles', configPath)
      }
    } catch (error){
      console.warn(error);
    }
    await sleep(5000)
    try{
      if(fs.existsSync(folder+'/deepslate')){
      mer.createMer(folder+'/deepslate','.png', folder+'/deepslate', configPath)
      }
    } catch (error){
      console.warn(error);
    }
    await sleep(5000)
    try{
      if(fs.existsSync(folder+'/huge_fungus')){
      mer.createMer(folder+'/huge_fungus','.png', folder+'/huge_fungus', configPath)
      }
    } catch (error){
      console.warn(error);
    }
    await sleep(5000)
    mer.createMer('./tempimg','.png', folder, configPath)
    fs.cpSync('./src/presets/'+preset.preset+'/fogs', 'C:/Users/'+user+'/AppData/Local/Packages/Microsoft.MinecraftUWP_8wekyb3d8bbwe/LocalState/games/com.mojang/development_resource_packs/'+ packName.name +'/fogs', {recursive: true});
    fs.cpSync('./src/presets/'+preset.preset+'/biomes_client.json', 'C:/Users/'+user+'/AppData/Local/Packages/Microsoft.MinecraftUWP_8wekyb3d8bbwe/LocalState/games/com.mojang/development_resource_packs/'+ packName.name +'/biomes_client.json', {recursive: false});
    
    if(config.generateNormalmaps){
    await sleep(15000)
    try{
      if(fs.existsSync(folder)){
      normalmap.generateNormals(folder, configPath)
      }
    } catch (error){
      console.warn(error);
    }
    await sleep(15000)
    try{
      if(fs.existsSync(folder+'/candles')){
        normalmap.generateNormals(folder+'/candles', configPath)
      }
    } catch (error){
      console.warn(error);
    }
    await sleep(15000)
    try{
      if(fs.existsSync(folder+'/deepslate')){
        normalmap.generateNormals(folder+'/deepslate', configPath)
      }
    } catch (error){
      console.warn(error);
    }
    await sleep(15000)
    try{
      if(fs.existsSync(folder+'/huge_fungus')){
        normalmap.generateNormals(folder+'/huge_fungus', configPath)
      }
    } catch (error){
      console.warn(error);
    }
  }

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
  }else{
    console.log("pack doesn't exist!".error)
  }
    
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
      if (!fs.existsSync('./src/presets/'+newPresetName.name)) {
        fs.mkdirSync('./src/presets/'+newPresetName.name);
        fs.mkdirSync('./src/presets/'+newPresetName.name+'/fogs');
        fs.mkdirSync('./src/presets/'+newPresetName.name+'/assets');
        fs.mkdirSync('./src/presets/'+newPresetName.name+'/assets/glass');
        fs.mkdirSync('./src/presets/'+newPresetName.name+'/assets/water');
        fs.copy('./src/presets/Default/config.json','./src/presets/'+newPresetName.name+'/config.json')
        var writeStream = fs.createWriteStream('./src/presets/'+newPresetName.name+'/biomes_client.json')
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