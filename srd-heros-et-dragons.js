
//fonctions et class déportées
import { aidejeu } from './modules/aidejeu.js';
import { openSRD } from './modules/openSRD.js';
import { openWiki } from './modules/openWiki.js';
import { openSupport } from './modules/openSupport.js';
import { trieAlphabFR } from './modules/trieAlpha.js';
import { compendiumColor } from './modules/compendiums.js';
import { hideDD5Compendium } from './modules/compendiums.js';
import { ClassFeaturesHD } from './modules/ClassFeatures.js'; //----WIP---
import { giveSubClass } from './modules/giveSubClass.js'; //----WIP---
//import { Actor5e } from '../../systems/dnd5e/module/actor/entity.js'; //----WIP---




/*-- -- -- -- -- --- -- -- --- -- -- -- -- -- -- -
 ----------------INIT--------------------
 -- -- -- -- -- --- -- -- --- -- -- -- -- -- -- -*/
Hooks.once("init", async function() {


    //---------déclaration des settings


    game.settings.register('srd-heros-et-dragons', 'HDstyle', {
        name: "appliquer le style",
        hint: "applique une surchouche graphique au jeu",
        scope: "world",
        config: true,
        default: false,
        type: Boolean,
        onChange: x => window.location.reload()
    });
    game.settings.register('srd-heros-et-dragons', 'HDcompendiumColor', {
        name: "couleur des compendium H&D et DD5",
        hint: "affiche les compendium H&D en vert, DD5 en rouge",
        scope: "world",
        config: true,
        default: true,
        type: Boolean,
        onChange: x => window.location.reload()
    });
    game.settings.register('srd-heros-et-dragons', 'HDhideDD5Compendium', {
        name: "masquer les compendium DD5",
        hint: "masque les compendium issus du system DD5",
        scope: "world",
        config: true,
        default: false,
        type: Boolean,
        onChange: x => window.location.reload()
    });
    game.settings.register('srd-heros-et-dragons', 'consoleDebug', {
        name: "console Debug",
        hint: "activer le debugage console (pour dev)",
        scope: "world",
        config: true,
        default: false,
        type: Boolean,
        onChange: x => window.location.reload()
    });

    game.settings.register('srd-heros-et-dragons', 'levelUp', {
        name: "aptitudes automatiques",
        hint: "NON FONCTIONNEL // travail en cours",
        scope: "world",
        config: true,
        default: false,
        type: Boolean,
        onChange: x => window.location.reload()
    });



    //appliquer css selon les options de config du module
    if (game.settings.get('srd-heros-et-dragons', 'HDstyle')) {

        // Create new link Element 
        var styleHD = document.createElement('link');
        // set the attributes for link element 
        styleHD.rel = 'stylesheet';
        styleHD.type = 'text/css';
        styleHD.href = '/modules/srd-heros-et-dragons/style/HD.css';
        styleHD.media = 'all';
        document.getElementsByTagName('HEAD')[0].appendChild(styleHD);


        // Create new link Element 
        var styleHDbetterNPC = document.createElement('link');
        // set the attributes for link element 
        styleHDbetterNPC.rel = 'stylesheet';
        styleHDbetterNPC.type = 'text/css';
        styleHDbetterNPC.href = '/modules/srd-heros-et-dragons/style/HDbetterNPC.css';
        styleHDbetterNPC.media = 'all';
        document.getElementsByTagName('HEAD')[0].appendChild(styleHDbetterNPC);

        // Create new link Element 
        var styleHDmidiqol = document.createElement('link');
        // set the attributes for link element 
        styleHDmidiqol.rel = 'stylesheet';
        styleHDmidiqol.type = 'text/css';
        styleHDmidiqol.href = '/modules/srd-heros-et-dragons/style/HDmidiqol.css';
        styleHDmidiqol.media = 'all';
        document.getElementsByTagName('HEAD')[0].appendChild(styleHDmidiqol);

        // Create new link Element 
        var styleHDtidysheet = document.createElement('link');
        // set the attributes for link element 
        styleHDtidysheet.rel = 'stylesheet';
        styleHDtidysheet.type = 'text/css';
        styleHDtidysheet.href = '/modules/srd-heros-et-dragons/style/HDtidysheet.css';
        styleHDtidysheet.media = 'all';
        document.getElementsByTagName('HEAD')[0].appendChild(styleHDtidysheet);
    }

    //console debug

    if (game.settings.get('srd-heros-et-dragons', 'consoleDebug')) {
        CONFIG.debug.hooks = true;
    }else{
        CONFIG.debug.hooks = false;
    };

    //modif des évolution de classes depuis ./modules/classFeatures.js
    if (game.settings.get('srd-heros-et-dragons', 'levelUp')) {
       // CONFIG.DND5E.classFeatures=ClassFeaturesHD
       CONFIG.DND5E.classFeatures={};// solution temporaire
    }else{
        CONFIG.DND5E.classFeatures={};
    };
console.log(CONFIG.DND5E.classFeatures)
    
});

//--------------------------------------
//----setting compendiums
//--------------------------------------
Hooks.on("renderSidebarTab", async function() {
    if (game.settings.get('srd-heros-et-dragons', 'HDcompendiumColor')) {
        compendiumColor();
    };
    if (game.settings.get('srd-heros-et-dragons', 'HDhideDD5Compendium')) {
        hideDD5Compendium();
    }
});



Hooks.once("ready", async function() {
    //----------le menu liens externes
    let liensExt = new Dialog({
        title: "acceder au SRD ?",
        content: "<p>que voulez-vous faire</p>",
        buttons: {

            one: {
                icon: '<i class="fas fa-check"></i>',
                label: "acceder au srd dans le navigateur",
                callback: () => openSRD()
            },
            two: {
                icon: '<i class="fas fa-check"></i>',
                label: "joindre le support du module sur discord",
                callback: () => openSupport()
            },
            three: {
                icon: '<i class="fas fa-check"></i>',
                label: "accéder au wiki francophone dédié",
                callback: () => openWiki()
            }

        }
    });


    //------------message et logo dans console 


    console.log(`--------Heros et Dragons SRD Ready--------------------------------`);
    console.log(`
      .......................................

      .....................:*=#=+-...........
      
      ..................-=##=-...............
      
      ................-=####*:*=#######*:....
      
      ...........-:..*#############*:........
      
      ..........=#####################=*-....
      
      .........*##########################=-.
      
      ........-########################*-::+-
      
      ...-...+###########=-..+##########=-...
      
      ..+#:+=#######:=##:.....-###########=..
      
      .-##########=-:##+......+########+.*#+.
      
      .+#####=+....-=#=......*########=....:.
      
      .:#=+-..-*##====:....+##########*......
      
      ..-..-++:-........-=###########=.......
      
      ...............-=#############=........
      
      .............-=#############*..........
      
      ............+##########=+-.............
      
      ............######=+-..................
      
      ............=##=:......................
      
      .............+.........................
      `);



    //----logo image
    var logo = document.getElementById("logo");
    logo.setAttribute("src", "modules/srd-heros-et-dragons/img/logoHD.png");

    //--------------ouvrir le menu lien sur click logo
    logo.setAttribute("title", "liens externes");
    logo.addEventListener("click", function() {
        liensExt.render(true);
    });

    //------------ajout bouton aide de regles
    let zoneAide = document.createElement('div');
    renderTemplate("modules/srd-heros-et-dragons/templates/menuAide.html").then(html => {
        zoneAide.id = "openAide";
        zoneAide.innerHTML = html;;
        document.body.append(zoneAide);
    });

    let aideApp = new aidejeu;
    zoneAide.addEventListener("click", function() {

        aideApp.render(true);
    });


   

});

//-------------action sur feuille de perso---------
//-------------------------------------------------

Hooks.on("renderActorSheet", async function (app,html,data)  {
    //---trie alphabétique
    trieAlphabFR();
});
Hooks.on("createOwnedItem", async function (actor,item,sheet,id)  {
    //---trie alphabétique
   giveSubClass(actor,item);
   return actor
});