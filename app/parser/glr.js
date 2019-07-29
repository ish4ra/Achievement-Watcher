"use strict";

const { remote } = require('electron');
const path = require("path");
const regedit = require(path.join(remote.app.getAppPath(),"native/regedit/regedit.js"));

module.exports.scan = async () => {
  try {
  
    let data = [];
    
    let glr = regedit.RegListAllSubkeys("HKCU","SOFTWARE/GLR/AppID");
      if (glr) {
        for (let key of glr) {
            
            try {
               let glr_ach_enable = parseInt(regedit.RegQueryIntegerValue("HKCU",`SOFTWARE/GLR/AppID/${key}`,"SkipStatsAndAchievements"));

               if(glr_ach_enable === 0) {

                 data.push({appid: key,
                             data: {
                                type: "reg",
                                root: "HKCU",
                                path: `SOFTWARE/GLR/AppID/${key}/Achievements`}
                          });
                }
                
             }catch(e){
                //Do nothing
             }
        }
      } else {
        throw "GLR No achievement found in registry";
      }
    
    return data;
  
  }catch(err){
      throw err;
  }
}

module.exports.getAchievements = async (root,key) => {
  try {
  
    let result = regedit.RegListAllValues(root,key);
    if (!result) throw "No achievement found in registry";

    return result.map((name) => {
      return {
        id: name,
        Achieved: parseInt(regedit.RegQueryIntegerValue(root,key,name)) 
      }
    });
  
  }catch(err){
      throw err;
  }
}