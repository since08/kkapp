import { strNotNull } from "../utils/ComonHelper.js";

class I18n {
  lanObj = require("./zh.json");
  static locale = "zh";
  constructor() {
    global.language = "zh";
  
  }

  setLanguage = language => {
    I18n.locale = language;
    global.language = language;
    switch (language) {
      case "en":
        lanObj = require("./english.json");
        break;
      case "zh":
        lanObj = require("./zh.json");
        break;
    }
  };

  t = key => {
    if(strNotNull(key)){
      if(key.indexOf('.') !== -1){
        let keys = key.split('.')
        return this.lanObj[keys[0]][keys[1]]
      }
    }
    return this.lanObj[key] || key;
  };
}

export default new I18n()