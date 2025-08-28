/**
 * @module example/main
 * @description This is some example code that is executed when the plugin is fully registered and the DOM is ready.  
 * Use it as a reference or starting point for your own plugin's runtime code.
 */

import { error, log } from "@utils/logging.js";
import { token } from "@utils/plugin.js";
import { LogLevel } from "@bytm/src/types.js";

export async function exampleMainEntrypoint() {
  // For example, you could add a button to the page that does something when clicked:
  const button = document.createElement("button");
  button.id = "my-plugin-button";
  button.textContent = "Click me!";

  // And then insert the button into a very specific element, as soon as it is found in the DOM:
  unsafeWindow.BYTM.addSelectorListener("playerBar", ".middle-controls-buttons", {
    listener: (btnsContainerElement) =>
      btnsContainerElement.appendChild(button),
    debounce: 100,
  });

  // For aborting the interaction listener at any time, call ac.abort():
  const ac = new AbortController();

  // And add accessible click and keyboard-press event listeners to the button:
  unsafeWindow.BYTM.onInteraction(button, async (evt) => {
    // (only add the style if it doesn't exist yet)
    if(document.head.querySelector("style#rainbowfill-style"))
      return;

    let confirmed = true;
    // (skip the prompt if the shift key is held down)
    if(!evt.shiftKey) {
      confirmed = await unsafeWindow.BYTM.showPrompt({
        message: "Hello from my cool plugin!\nAre you sure you want to continue?",
        type: "confirm",
        confirmBtnText: "Continue",
        confirmBtnTooltip: "Click to continue",
      });
    }

    // (abort the interaction listener on ctrl+shift+alt+click)
    if(evt.ctrlKey && evt.shiftKey && evt.altKey)
      ac.abort();

    // (insert some CSS when the prompt was confirmed or skipped)
    if(confirmed) {
      const styleElem = unsafeWindow.BYTM.UserUtils.addGlobalStyle(`\
@keyframes rainbowfill {
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

      // (remove the style after 30 seconds)
      setTimeout(() => styleElem.remove(), 30_000);
    }
  }, {
    capture: true,     // ensure absolute priority over other event listeners
    once: false,       // might be useful in other places, but here the button should be clickable an infinite amount of times
    signal: ac.signal, // can be used to abort the event listener at any time
    // stopPropagation and preventDefault are set to true by default, so you don't have to worry about the button's click event bubbling up and triggering other listeners on the page
  });

  // You can also use authenticated function calls, since the plugin is now registered:
  const features = unsafeWindow.BYTM.getFeatures(token);
  if(features) {
    log("BYTM's locale is", features.locale);
    log("BYTM's log level is", features.logLevel, `(${LogLevel[features.logLevel]})`);
  }

  // Fetching resources like an external JS file should be done via the fetch API:
  const exampleScript = await unsafeWindow.BYTM.CoreUtils.fetchAdvanced(await GM.getResourceUrl("script_example"), {
    timeout: 10_000,
  });

  // And then you can eval the fetched script as follows.
  // ⚠️ When evaluating code that isn't directly bundled or fetched from a static, non-changing source (like version-tagged GitHub URLs), make sure to set the `integrity` property in `resources.json` to true so this can be done somewhat safely!
  try {
    eval(await exampleScript.text());
  }
  catch(err) {
    error("Failed to eval the fetched example script:", err);
  }
}
