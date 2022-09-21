// vr/client.js
import {Module, VRInstance} from 'react-vr-web';
import 'webvr-polyfill/src/main';

// add ability to move camera
class TeleportModule extends Module {
  constructor() {
    super('TeleportModule');
    this._camera = null;
  }

  setCamera(camera) {
    this._camera = camera;
  }

  teleportCamera(x, y, z) {
    if (this._camera) {
      this._camera.position.set(x, y, z);
      // Call this to make sure anything positioned relative to the camera is set up properly:
      this._camera.updateMatrixWorld(true);
    }
  }
}

// add raycaster to be able to interact with environment
const SimpleRaycaster = {
    getType: () => "simple",
    getRayOrigin: () => [0, 0, 0],
    getRayDirection: () => [0, 0, -1],
    drawsCursor: () => true
};

// add webvr polyfill to see side by side webvr rendering
const isPolyfilled = false;
let vrDisplay = null;

navigator.getVRDisplays()
  .then((displays) => {
    if (displays.length > 0) {
      vrDisplay = displays[0];

      isPolyfilled = vrDisplay.displayName === 'Cardboard VRDisplay (webvr-polyfill)';
    }
  });

function resizePolyfilled(vr) {
  if (!isPolyfilled || (isPolyfilled && !vrDisplay.isPresenting)) return;

  const { innerWidth: width, innerHeight: height } = window;

  if (parseInt(vr.player.glRenderer.domElement.style.width, 10) !== width) {
    vr.player.glRenderer.domElement.style.width = `${width}px`;
    vr.player.glRenderer.domElement.style.height = `${height}px`;
    vr.player.glRenderer.domElement.style.paddingRight = 0;
    vr.player.glRenderer.domElement.style.paddingBottom = 0;
  }
}

function init(bundle, parent, options) {
  const teleportModule = new TeleportModule();
  const vr = new VRInstance(bundle, 'react_vr_game', parent, {
    // Add custom options here
    raycasters: [
      SimpleRaycaster // Add SimpleRaycaster to the options
    ],
    cursorVisibility: "visible", // Add cursorVisibility
    nativeModules: [ teleportModule ],
    ...options,
  });

  // set camera position
  teleportModule.setCamera(vr.player.camera);

  // -- BOX ---
  // create texture for box
  // Create a custom canvas texture we update each frame
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  let last = 0;
  let sum = 0;
  let count = 0;
  const bars = [];
  const cx = canvas.getContext('2d');
  // blue color
  cx.fillStyle = '#2255ff';
  cx.fillRect(0, 0, 256, 256);
  // --- END BOX ---

  // Register our custom canvas texture
  vr.registerTextureSource('fps', canvas, {updateOnFrame: true}); // Needs an update each frame

  vr.render = function(ms) {
    // Any custom behavior you want to perform on each frame goes here
    resizePolyfilled(vr);

    // --- BOX ---
    // adjust texture for box per frame
    // if (last !== 0) {
    //   const delta = ms - last;
    //   // Only update every 30 frames, averaging across those
    //   if (count < 30) {
    //     sum += delta;
    //     count++;
    //     last = ms;
    //   } else {
    //     const fps = count * 1000 / sum;
    //     sum = 0;
    //     count = 0;
    //     bars.push(fps);
    //     if (bars.length > 32) {
    //       bars.shift();
    //     }
    //     // clear canvas
    //     canvas.width = 256;
    //     cx.fillStyle = '#ffffff';
    //     cx.fillRect(0, 0, 256, 256);
    //     // draw fps bars
    //     cx.fillStyle = '#2255ff';
    //     for (let i = 0; i < bars.length; i++) {
    //       const height = bars[i] / 60 * 100;
    //       cx.fillRect(8 * i, 256 - height, 8, height);
    //     }
    //     // draw fps rate
    //     cx.font = '40px Arial';
    //     cx.fillStyle = '#000000';
    //     cx.fillText(Math.round(fps), 20, 50);
    //   }
    // }
    // last = ms;
    // --- END BOX ---
  };
  // Begin the animation loop
  vr.start();
  return vr;
}

window.ReactVR = {init};
