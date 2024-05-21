# Getting Started with Obsidian Preset Creation!
***(Intermediate knowledge of Minecraft RTX pack creation is needed to follow this guide!!!)***
## Setting up your own preset
* Start Obsidian.
* Run the command 'QuickNewPreset'.
* Answer asked questions.
* Check if new preset was created.
* Done.

## Using the Generator Config
Upon doing the previous step, a copy of the Default config should have been provided for you. To edit the config, just edit it as you would as any other text file.
### Default Config Explanation
*(Values that are relatively "self-explanitory" will be skipped)*

*(Reading through MER generation functions inside of the index.js file is reccommened for a better understanding on how math in generation is done)*
```
{
    "contrast":0.06,            //Determines the grayscale contrast of texture duing heightmap generation
    "heightIterations":45.815,          //How many levels of detail the posterize function should have during heightmap generation

    "emissivePosterizeIterations": 7.95,        //How many levels of detail the posterize function should have during emmissive MER generation
    "emissiveDetectMin": 85,        //Minimum pixel brightness in order to be considered a "glowing" pixel
    "emissiveBrightnessSubtraction": 195,       
    "emissiveRoughnessDivision": 15,

    "floraStemRed": 0,      //metalness
    "floraStemGreen": 0,        //emissiveness
    "floraStemBlue": 200,       //roughness
    "floraFlowerRed": 0,
    "floraFlowerGreen": 5,
    "floraFlowerBlue": 85,

    "matteRoughness": 235,      //how rough "matte" blocks should be

    "metalContrast": -0.05,      //Determines the grayscale contrast of texture duing metal MER generation
    "metalPosterize": 15.5,     //How many levels of detail the posterize function should have during metal MER generation
    "metalMetalMultiplier": 54.5,      
    "metalMetalAverage": 210,       //The base metal value that is averaged with calculated value at a ration of 3:1
    "metalRoughnessSubtraction": 45,

    "netherFloraBaseRoughness": 150,
    "netherFloraDivision": 5,

    "oreOreRed": 180,
    "oreOreGreen": 0,
    "oreOreBlue": 35,
    "oreStoneDetectionRange": 15,       //The range in which a pixel is determined to be a stone pixel 

    "redstoneDetectMin": 53,        //minimum red value in order for a pixel to be considered as "powered redstone"        
    "redstoneEmissiveMultiplier": 1.9,      //Multiplier on how bright *activated* redstone should be

    "sculkEmissiveMultiplier": 0.2,     //Multiplier on how bright the blue parts of sculk should be
    "sculkRoughnessDivision": 28,

    "shinyMetal": 5,        //Metal value of "shiny" blocks
    "shinyBaseRoughness": 255,      //Base roughness value (subtracted by calculated value)
    "shinyAverage": 20,     //The base rough value that is averaged with calculated value at a ration of 3:1
    "shinyDivision": 2,
    
    "stoneBaseRoughness": 255,
    "stoneSubtractRoughnessAverage": 40,
    
    "waterMetal": 15,
    "waterRoughness": 55,

    "woodBaseRoughness": 255,
    "woodSubtractRoughnessAverage": 45,

    "useCustomGlass": false,        //Use glass asset folder
    "forceCustomWater": false       //Forcefully use water asset folder
}
```
## Fogs in Presets
For convenience, the fog setup in Obsidian is identical to Minecraft and all files provided by your preset will simply just get copied over to the Obsidian converted pack.

If you are unaware of how to setup fogs (especially in RTX) we recommend reading through this link!
[Microsoft Learn: Fog in Resource Packs](https://learn.microsoft.com/en-us/minecraft/creator/documents/foginresourcepacks?view=minecraft-bedrock-stable)

## Getting started with Assets
Assets are files that are imported into the current texture pack. As of right now there are two main categories for assets: **water** and **glass**.


The Water folder should **only consist of two files**, "water_still_grey.png" and "water_flow_grey.png". This folder is required and if either files are missing, Obsidian will crash most of the time. This is because Obsidian uses this asset folder as a backup if a water texture is missing as to prevent water weirdness.


The Glass folder may contain as many files as needed. Unlike the water folder, it is not required unless *"useCustomeGlass"* is true in the preset config. Though this folder is intended for glass, it could theoretically have any file be imported as well as long as it contains the word "glass".