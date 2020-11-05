import { monkeypatchSheet } from "./lib/itemSheet5e.js";
import { darkSheetCompat } from "./compat/darksheetCompat.js";

// Setting to always show resources
Hooks.on("init", function () {
  game.settings.register("srd-heros-et-dragons", "RessClassAll", {
    name: "montrer toutes les ressources",
    hint: "montrer toutes les ressources spécifique aux classes.",
    scope: "client",
    config: true,
    default: false,
    type: Boolean,
    onChange: x => window.location.reload()
  });
  // Init resource list + resource counter
  var sheetResources = ["primary", "secondary", "tertiary", "Rage", "Inspiration", "Canalisation", "Sorcellerie", "Ki", "Lien", "Formes", "Imposition"];

  sheetResources = sheetResources.slice(0, 11);

  // Monkeypatch original function

  
  const originalGetData = game.dnd5e.applications.ActorSheet5eCharacter.prototype.getData;
  if (typeof libWrapper === "function") {
    libWrapper.register(
      "srd-heros-et-dragons",
      "game.dnd5e.applications.ActorSheet5eCharacter.prototype.getData",
      function (wrapper, ...args) {
        const sheetData = originalGetData.call(this);
        sheetData["resources"] = sheetResources.reduce((arr, r) => {
          const res = sheetData.data.resources[r] || {};
          res.name = r;
          res.placeholder = game.i18n.localize("DND5E.Resource" + r.titleCase());

          if (res && res.name === "count" && res.value === null) res.value = 3;
          if (res && res.name === "count" && res.value > globalLimit) res.value = globalLimit;
          return arr.concat([res]);
        }, []);
        wrapper.apply(this, args);
        return sheetData;
      },
      "WRAPPER"
    );
  } else {
    game.dnd5e.applications.ActorSheet5eCharacter.prototype.getData = function () {
      const sheetData = originalGetData.call(this);

      // Temporary HP
      let hp = sheetData.data.attributes.hp;
      if (hp.temp === 0) delete hp.temp;
      if (hp.tempmax === 0) delete hp.tempmax;

      // Resources
      sheetData["resources"] = sheetResources.reduce((arr, r) => {
        const res = sheetData.data.resources[r] || {};
        res.name = r;
        res.placeholder = game.i18n.localize("DND5E.Resource" + r.titleCase());
        if (res && res.value === 0 && res.name != "count") delete res.value;
        if (res && res.max === 0 && res.name != "count") delete res.max;
        if (res && res.name === "count") {
          res.max = globalLimit;
          res.label = "Resource Count";
          res.sr = false;
          res.lr = false;
        }
        if (res && res.name === "count" && res.value === null) res.value = 3;
        if (res && res.name === "count" && res.value > globalLimit) res.value = globalLimit;
        return arr.concat([res]);
      }, []);

      // Return data for rendering
      // Experience Tracking
      sheetData["disableExperience"] = game.settings.get("dnd5e", "disableExperienceTracking");

      return sheetData;
    };
  }
  /** @type {string[]} */
  var itemResources = [];

  sheetResources.forEach((resource) => {
    if (!(resource === "count" || resource === "primary" || resource === "secondary" || resource === "tertiary")) {
      itemResources.push(`resources.${resource}.value`);
    }
  });


  // Monkeypatch item sheet list so it shows up under the resources for items/spells
  monkeypatchSheet(itemResources);

  // Compatibility
  game.modules.forEach((module) => {
    switch (module.id) {
      // darksheet compat
      case "darksheet":
        if (module.active) {
          darkSheetCompat(sheetResources);
        }
        break;
    }
  });
});



Hooks.on("renderActorSheet", function (app,html,data) {

  // récupérer les classes
  let classes=data.items.filter(it=>it.type==="class");
//récupérer les éléments de ressources et les rendre invivibles
  let resBlock=html.find("li.resource").css({"display": "none"});
//rendre les 3 premières ressources visible
   resBlock.slice(0,3).css({"display": "block"})
   //récup les input des noms de ressources
  let ressName = html.find("li.resource").find(".attribute-name").find("input");
  // rendre les noms de ressources de classes inchangeable et les styler
  for (let i=3;i<ressName.length;i++){
    if (ressName[i].placeholder){
      ressName[i].value=ressName[i].placeholder;
         ressName[i].disabled="disabled";
         ressName[i].style.borderBottom = "3px solid #8a338c";
        
      }
  }
//afficher les bonnes ressources selon la classe
// à faire : afficher aussi selon les spécialisation de classe
  for (let cl of classes){
    switch(cl.name){
      case "Barbare":resBlock[3].style.display="block";break;
      case "Barde":resBlock[4].style.display="block";break;
      case "Clerc":resBlock[5].style.display="block";break;
      case "Druide":resBlock[9].style.display="block";break;
      case "Ensorceleur":resBlock[6].style.display="block";break;
      case "Guerrier":resBlock[6].style.display="block";break;
      case "Magicien":break;
      case "Moine":resBlock[7].style.display="block";break;
      case "Paladin":resBlock[5].style.display="block";resBlock[10].style.display="block";break;
      case "Rôdeur":break;
      case "Roublard":resBlock[6].style.display="block";break;
      case "Sorcier":resBlock[6].style.display="block";break;
    }
    
  }
 
 




 
  



})
