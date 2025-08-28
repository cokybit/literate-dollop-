/**
 * @module index
 * @description The entry point of the script.
 */

import { events, tryRegisterPlugin } from "@utils/plugin.js";
import { log } from "@utils/logging.js";
import { buildNumber, buildMode } from "@utils/constants.js";
import { examplePreInit } from "@/example/preInit.js";
import { exampleMainEntrypoint } from "@/example/main.js";
import { jsdocPow, plainJsSetFactor } from "@/example/plainJs.mjs";
import "@/types.js";

// #region register plugin

// this is the earliest point you may register the plugin - it is executed before the DOM is loaded and before BYTM has loaded anything asynchronous, like its feature configuration, but immediately after the plugin interface is ready:
unsafeWindow.addEventListener("bytm:preInitPlugin", async (event) => {
  try {
    // register the plugin with BetterYTM to be able to call authenticated API functions:
    await tryRegisterPlugin(event);
    log(`Registered plugin successfully!\nUsing BetterYTM v${unsafeWindow.BYTM.version}\nPlugin build number: ${buildNumber} (${buildMode} mode)`);
  }
  catch(err) {
    alert("Couldn't register the plugin. Refer to the console for more information.");
    console.error("Couldn't register plugin due to error:", err);
    return;
  }

  // call a few functions that need to be run as soon as possible:
  preInit();
});

// this is the main entry point of plugins, executed before the DOM is loaded, but after some slightly time consuming initialization tasks have been done by BYTM:
unsafeWindow.addEventListener("bytm:registerPlugin", async (event) => {
  void ["plugin is already registered, so disregard the event:", event];

  try {
    // now hook into various events to run your code when certain parts are ready:

    events.once("bytm:featureInitialized", (featureKey: string) => {
      // this code runs every time a feature is initialized, so you can use this to run code when a specific feature is ready
      // to see all available feature keys, refer to the first item in each `ftInit.push()` call in `bytm/src/index.ts`
      // or set the BYTM log level to debug and check the console with the filter `bytm:featureInitialized` to see all emitted events

      if(featureKey === "initSiteEvents") {
        // for example, call a function that depends on the siteEvents system in here:
      }

      void ["to make ESLint shut up:", featureKey];
    });

    events.once("bytm:ready", () => {
      // this event is emitted when the plugin is fully registered and the DOM is ready, but before most features have finished initializing
      // you should instead use `bytm:featureInitialized` to check if the feature you depend on is ready

      // check out this example code in src/example/main.ts:
      exampleMainEntrypoint();
    });

    events.once("bytm:allReady", () => {
      // this code will run when all features have fully initialized or the initialization has timed out
      // I don't recommend using this to modify the page or BYTM features, since it will be emitted much later than the point at which the DOM/feature is ready
    });
  }
  catch(err) {
    console.error("A generic error occurred:", err);
  }
});

// #region preInit

/** You can do anything in here that needs to be done as soon as the page loads, except modifying the DOM. */
function preInit() {
  // check out this example code in src/example/preInit.ts:
  examplePreInit();

  // here are some examples involving the plain JS module 'src/example/plainJs.mjs'
  // hover over the functions to see how the IDE can help you with types, even without TypeScript:

  // this one accepts any type, making it prone to bugs:
  const foo = plainJsSetFactor("hello");
  //    ^?: string

  const factor = plainJsSetFactor(2);
  //    ^?: number

  // this one has its argument and return value typed via JSDoc, so the IDE gives hints about the expected types:
  const result = jsdocPow(9);
  //    ^?: number

  log(`factor: ${factor}, result: ${result}`); // factor: 2, result: 81

  void foo;
}
