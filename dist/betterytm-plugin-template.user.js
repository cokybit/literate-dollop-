// ==UserScript==
// @name         BetterYTM Plugin Template
// @namespace    https://github.com/Sv443
// @version      0.1.0
// @author       Sv443
// @description  Example and template for creating a plugin using BetterYTM's existing API to further improve YouTube and YouTube Music.
// @license      Unlicense
// @copyright    Copyright 2025 Sv443
// @icon         https://raw.githubusercontent.com/Sv443/BetterYTM-Plugin-Template/a65da62/assets/plugin_icon_128x128.png#sha256=4GgH3wuDgVjYVPf1s6NURcDU0QvjnLCigrlKowsF6x8=
// @homepage     https://github.com/Sv443/BetterYTM-Plugin-Template
// @homepageURL  https://github.com/Sv443/BetterYTM-Plugin-Template
// @source       https://github.com/Sv443/BetterYTM-Plugin-Template.git
// @supportURL   https://github.com/Sv443/BetterYTM-Plugin-Template/issues
// @match        https://youtube.com/*
// @match        https://music.youtube.com/*
// @resource     doc_license     https://raw.githubusercontent.com/Sv443/BetterYTM-Plugin-Template/a65da62/LICENSE.txt
// @resource     icon_1000       https://raw.githubusercontent.com/Sv443/BetterYTM-Plugin-Template/a65da62/assets/plugin_icon_1000x1000.png#sha256=IrFR29ZTCXuH5WsSVcmPn5FA+GvBopOyGR9lFSi4s5c=
// @resource     icon_128        https://raw.githubusercontent.com/Sv443/BetterYTM-Plugin-Template/a65da62/assets/plugin_icon_128x128.png#sha256=4GgH3wuDgVjYVPf1s6NURcDU0QvjnLCigrlKowsF6x8=
// @resource     library_lodash  https://cdn.jsdelivr.net/npm/lodash@4.17.21#sha256=qXBd/EfAdjOA2FGrGAG+b3YBn2tn5A6bhz+LSgYD96k=
// @resource     script_example  https://raw.githubusercontent.com/Sv443/BetterYTM-Plugin-Template/a65da62/assets/resourceExample.js#sha256=b/3glaVu/edSdKrr1dEFH02dww35y1nun7fuXIVNFhA=
// @connect      i.ytimg.com
// @connect      youtube.com
// @connect      github.com
// @connect      raw.githubusercontent.com
// @grant        GM.getResourceUrl
// @grant        unsafeWindow
// @run-at       document-start
// @noframes
// ==/UserScript==

(function () {
  'use strict';

  var LogLevel = /* @__PURE__ */ ((LogLevel2) => {
    LogLevel2[LogLevel2["Debug"] = 0] = "Debug";
    LogLevel2[LogLevel2["Info"] = 1] = "Info";
    return LogLevel2;
  })(LogLevel || {});
  var PluginIntent = /* @__PURE__ */ ((PluginIntent2) => {
    PluginIntent2[PluginIntent2["ReadFeatureConfig"] = 1] = "ReadFeatureConfig";
    PluginIntent2[PluginIntent2["WriteFeatureConfig"] = 2] = "WriteFeatureConfig";
    PluginIntent2[PluginIntent2["SeeHiddenConfigValues"] = 4] = "SeeHiddenConfigValues";
    PluginIntent2[PluginIntent2["WriteLyricsCache"] = 8] = "WriteLyricsCache";
    PluginIntent2[PluginIntent2["WriteTranslations"] = 16] = "WriteTranslations";
    PluginIntent2[PluginIntent2["CreateModalDialogs"] = 32] = "CreateModalDialogs";
    PluginIntent2[PluginIntent2["ReadAutoLikeData"] = 64] = "ReadAutoLikeData";
    PluginIntent2[PluginIntent2["WriteAutoLikeData"] = 128] = "WriteAutoLikeData";
    PluginIntent2[PluginIntent2["InternalAccess"] = 256] = "InternalAccess";
    PluginIntent2[PluginIntent2["FullAccess"] = 512] = "FullAccess";
    return PluginIntent2;
  })(PluginIntent || {});
  const userscriptName = "BetterYTM Plugin Template";
  const description = "Example and template for creating a plugin using BetterYTM's existing API to further improve YouTube and YouTube Music.";
  const version = "0.1.0";
  const homepage = "https://github.com/Sv443/BetterYTM-Plugin-Template";
  const namespace = "https://github.com/Sv443";
  const license = "Unlicense";
  const licenseUrl = "https://github.com/Sv443/BetterYTM-Plugin-Template/blob/main/LICENSE.txt";
  const bugs = {
    url: "https://github.com/Sv443/BetterYTM-Plugin-Template/issues"
  };
  const packageJson = {
    userscriptName,
    description,
    version,
    homepage,
    namespace,
    license,
    licenseUrl,
    bugs
  };
  const pluginDef = {
    // The permissions of the plugin:
    intents: [
      PluginIntent.ReadFeatureConfig,
      PluginIntent.CreateModalDialogs
    ],
    // The metadata of the plugin:
    plugin: {
      name: packageJson.userscriptName,
      namespace: packageJson.namespace,
      description: {
        "en-US": packageJson.description
      },
      homepage: {
        source: packageJson.homepage,
        bug: packageJson.bugs.url
      },
      version: packageJson.version,
      license: {
        name: packageJson.license,
        // should be a valid SPDX license identifier, or "UNLICENSED" to explicitly state the plugin is "all rights reserved"
        url: packageJson.licenseUrl
      },
      // If you have a logo, you can add it here - it should *ideally* be square and between 48x48 and 128x128.
      // Also make sure it is hosted on a server where CORS is enabled (like the GitHub CDN below), otherwise the browser will block it.
      iconUrl: "https://raw.githubusercontent.com/Sv443/BetterYTM-Plugin-Template/main/assets/plugin_icon_128x128.png"
    }
    // If you have contributors defined in package.json, you can add them here:
    // contributors,
  };
  let events;
  let token;
  async function tryRegisterPlugin({ detail: registerPlugin }) {
    const res = registerPlugin(pluginDef);
    events = res.events;
    token = res.token;
    return await events.once("pluginRegistered");
  }
  const consPrefix = `[${packageJson.userscriptName}]`;
  function log(...args) {
    console.log(consPrefix, ...args);
  }
  function error(...args) {
    console.error(consPrefix, ...args);
  }
  const rawConsts = {
    buildMode: "production",
    buildNumber: "a65da62"
  };
  const getConst = (constKey, defaultVal) => {
    const val = rawConsts[constKey];
    return val.match(/^#{{.+}}$/) ? defaultVal : val;
  };
  const buildMode = getConst("buildMode", "production");
  const buildNumber = getConst("buildNumber", "BUILD_ERROR");
  function examplePreInit() {
    unsafeWindow.BYTM.UserUtils.interceptWindowEvent("beforeunload", () => true);
  }
  async function exampleMainEntrypoint() {
    const button = document.createElement("button");
    button.id = "my-plugin-button";
    button.textContent = "Click me!";
    unsafeWindow.BYTM.addSelectorListener("playerBar", ".middle-controls-buttons", {
      listener: (btnsContainerElement) => btnsContainerElement.appendChild(button),
      debounce: 100
    });
    const ac = new AbortController();
    unsafeWindow.BYTM.onInteraction(button, async (evt) => {
      if (document.head.querySelector("style#rainbowfill-style"))
        return;
      let confirmed = true;
      if (!evt.shiftKey) {
        confirmed = await unsafeWindow.BYTM.showPrompt({
          message: "Hello from my cool plugin!\nAre you sure you want to continue?",
          type: "confirm",
          confirmBtnText: "Continue",
          confirmBtnTooltip: "Click to continue"
        });
      }
      if (evt.ctrlKey && evt.shiftKey && evt.altKey)
        ac.abort();
      if (confirmed) {
        const styleElem = unsafeWindow.BYTM.UserUtils.addGlobalStyle(`@keyframes rainbowfill {
  0%     { fill: #ff0000; }
  16.66% { fill: #ff7f00; }
  33.33% { fill: #ffff00; }
  50%    { fill: #00ff00; }
  66.66% { fill: #3535ff; }
  83.33% { fill: #7b23dd; }
  100%   { fill: #ff0000; }
}
tp-yt-iron-icon, svg path, .bytm-adorn-icon svg path, .bytm-toast-icon svg path {
  animation: rainbowfill 7s linear infinite;
}`);
        styleElem.id = "rainbowfill-style";
        setTimeout(() => styleElem.remove(), 3e4);
      }
    }, {
      capture: true,
      // ensure absolute priority over other event listeners
      once: false,
      // might be useful in other places, but here the button should be clickable an infinite amount of times
      signal: ac.signal
      // can be used to abort the event listener at any time
      // stopPropagation and preventDefault are set to true by default, so you don't have to worry about the button's click event bubbling up and triggering other listeners on the page
    });
    const features = unsafeWindow.BYTM.getFeatures(token);
    if (features) {
      log("BYTM's locale is", features.locale);
      log("BYTM's log level is", features.logLevel, `(${LogLevel[features.logLevel]})`);
    }
    const exampleScript = await unsafeWindow.BYTM.CoreUtils.fetchAdvanced(await GM.getResourceUrl("script_example"), {
      timeout: 1e4
    });
    try {
      eval(await exampleScript.text());
    } catch (err) {
      error("Failed to eval the fetched example script:", err);
    }
  }
  let globalVar;
  function jsdocPow(arg) {
    console.log("Hello from JS!");
    return Math.pow(arg, globalVar ?? 1);
  }
  function plainJsSetFactor(arg) {
    console.log("Hello from JS!", arg);
    return globalVar = arg;
  }
  unsafeWindow.addEventListener("bytm:preInitPlugin", async (event) => {
    try {
      await tryRegisterPlugin(event);
      log(`Registered plugin successfully!
Using BetterYTM v${unsafeWindow.BYTM.version}
Plugin build number: ${buildNumber} (${buildMode} mode)`);
    } catch (err) {
      alert("Couldn't register the plugin. Refer to the console for more information.");
      console.error("Couldn't register plugin due to error:", err);
      return;
    }
    preInit();
  });
  unsafeWindow.addEventListener("bytm:registerPlugin", async (event) => {
    try {
      events.once("bytm:featureInitialized", (featureKey) => {
        if (featureKey === "initSiteEvents") {
        }
      });
      events.once("bytm:ready", () => {
        exampleMainEntrypoint();
      });
      events.once("bytm:allReady", () => {
      });
    } catch (err) {
      console.error("A generic error occurred:", err);
    }
  });
  function preInit() {
    examplePreInit();
    plainJsSetFactor("hello");
    const factor = plainJsSetFactor(2);
    const result = jsdocPow(9);
    log(`factor: ${factor}, result: ${result}`);
  }

})();