import jquery from "jquery";
var $ = jquery;
var jQuery = jquery;

import webpackVariables from "webpackVariables";
window["webpackVariables"] = webpackVariables;
window.windowinsets = document.body.windowinsets = {
  left: 0,
  top: 0,
  right: 0,
  bottom: 0,
};
detectDeviceType();
const fakeBlurCanvas = document.createElement("canvas");
window.fakeBlurCanvas = fakeBlurCanvas;
// set that will hold all registered event listeners
const bridgeEvents = new Set();

// upon receiving an event, forward it to all listeners
window.onBridgeEvent = (...event) => {
  bridgeEvents.forEach((l) => l(...event));
};

// adding a listener later in the code
bridgeEvents.add((name, args) => {
  //    console.log("WOWOWOWOWO", name, args)   // args will be strongly typed
  if (name != "systemBarsWindowInsetsChanged") return;
  windowinsets = JSON.parse(Bridge.getSystemBarsWindowInsets());
  insetF();
  Object.keys(windowinsets).forEach((element) => {
    $("body").css("--window-inset-" + element, windowinsets[element] + "px");
  });
});

import cupertinoElements from "./cupertinoElements.js";
import eventReloads from "./eventReloads.js";
import springBoard from "./springBoardEvents.js";
import BScroll from "better-scroll";

import easings from "../scripts/libraries/easings.js";
window["cupertinoElements"] = cupertinoElements;
window["springBoard"] = springBoard;
window["BScroll"] = BScroll;
window["easings"] = easings;
function detectDeviceType() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);

  // Get the width and height of the screen
  var screenWidth = document.body.clientWidth;
  var screenHeight = document.body.clientHeight;

  // Calculate the diagonal length using the Pythagorean theorem (hypotenuse)
  var diagonalLength = Math.sqrt(
    Math.pow(screenWidth, 2) + Math.pow(screenHeight, 2)
  );
  // Define thresholds for phone and tablet diagonal lengths
  var phoneThreshold = 1100; // Threshold for phones (adjust as needed)
  var tabletThreshold = 900; // Threshold for tablets (adjust as needed)
  //   console.log(diagonalLength)
  // Determine the device type based on diagonal length
  var answer = "phone";

  if (urlParams.has("tablet")) {
    if (urlParams.get("tablet").toLowerCase() == "true") {
      answer = "tablet";
    } else {
      answer = "phone";
    }
  } else {
    if (diagonalLength <= phoneThreshold) {
      answer = "phone";
    } else if (diagonalLength <= tabletThreshold) {
      answer = "tablet";
    } else {
      answer = "tablet"; // Assume desktop for larger screens
    }
  }

  if (answer == "tablet") {
    document.body["TABLET_VIEW"] = true;
    document.body.classList.add("TABLET_VIEW");
  } else {
    document.body["TABLET_VIEW"] = false;
    document.body.classList.remove("TABLET_VIEW");
  }
  springBoard.relocateIcons();
  return answer;
}

// Example usage:

// only mock when not injected by the launcher
// make sure this runs before any code that uses the API!

$("#dock").append(
  new cupertinoElements.appIcon(
    "/mock/icons/default/com.google.android.dialer.png",
    "bb",
    "cc"
  )
);
$("#dock").append(
  new cupertinoElements.appIcon(
    "/mock/icons/default/com.google.android.apps.messaging.png",
    "bb",
    "cc"
  )
);
$("#dock").append(
  new cupertinoElements.appIcon(
    "../mock/icons/default/com.android.chrome.png",
    "bb",
    "cc"
  )
);
$("#dock").append(
  new cupertinoElements.appIcon(
    "/mock/icons/default/com.tored.bridgelauncher.png",
    "bb",
    "cc"
  )
);

var TABLET_VIEW = document.body["TABLET_VIEW"];
springBoard.relocateIcons();
$(window).on("resize", springBoard.relocateIcons);
$(window).on("resize", function () {
  return;
  var appGridInner = function (columns, rows) {
    var [colem, rowsem] = [columns, rows];
    if (document.body.clientWidth > document.body.clientHeight)
      [colem, rowsem] = [rows, columns];

    var _isPortrait;
    function createColumn(curRow) {
      var string = "";
      for (let i = 1; i <= colem; i++) {
        //string += `<th>${i + (curRow - 1) * columns}</th>`
        string += `<th></th>`;
      }
      return string;
    }
    function createRow() {
      var string = "";
      for (let i = 1; i <= rowsem; i++) {
        console.log("ROROR");
        string += `<tr>${createColumn(i)}</tr>`;
      }
      return string;
    }
    const dom = $.parseHTML(`
            <table>${createRow()}</table>
        `);
    console.log(createRow());
    return dom;
  };
  var config = springBoard.getDB();

  $("div.C_ELEMENT.PAGEGRIDTABLE").remove();

  $("#pages")
    .children("div.C_ELEMENT.PAGEGRID")
    .each((index, element) => {
      $(element).append(appGridInner(config.temp.grid[0], config.temp.grid[1]));
    });
  $("#pages")
    .children("div.C_ELEMENT.PAGEGRID")
    .each((index, element) => {
      $(element)
        .children("table")
        .children("tbody")
        .children("tr")
        .children("th")
        .each((indexe, elemente) => {
          if (config.placement.pages[index].length - 1 >= indexe) {
            console.log(elemente);
            $(elemente).append(
              new cupertinoElements.appIcon(
                "../mock/icons/default/com.android.chrome.png",
                springBoard.findLabelFromPackageName(
                  config.placement.pages[index][indexe]
                ),
                config.placement.pages[index][indexe]
              )
            );
          }
        });
    });
});

springBoard.getDB();
springBoard.relocateIcons();

var center = [document.body.clientWidth / 2, document.body.clientHeight / 2];

springBoard.reloadApps(function () {
  springBoard.relocateIcons();

  const homeScroller = new BScroll($("#pages-wrapper")[0], {
    scrollX: true,
    scrollY: false,
    momentum: false,
    bounce: true,
    disableMouse: false,
    disableTouch: false,
    slide: {
      loop: false,
      autoplay: false,
      threshold: 0,
    },
    HWCompositing: false,
    click: true,
    tap: "tap",
    phoneThreshold: 0,
    tabletThreshold: 0,
    threshold: 0,
  });
  homeScroller["cancel"] = function () {
    const scrollContainer = document.querySelector("#pages-wrapper");

    // To simulate a pointer up event
    const touchEndEvent = new TouchEvent("touchend", {
      bubbles: true,
      cancelable: true,
      view: window,
    });
    // To simulate a pointer up event
    const mouseUpEvent = new MouseEvent("mouseup", {
      bubbles: true,
      cancelable: true,
      view: window,
    });
    scrollContainer.dispatchEvent(mouseUpEvent);
    scrollContainer.dispatchEvent(touchEndEvent);
  };
  window["homeScroller"] = homeScroller;

  const bs = window["homeScroller"];
  bs.scroller.translater.hooks.on(
    "beforeTranslate",
    (transformStyle, point) => {
      clearTimeout(window["entereditmodetimeout"]);
      return;
      var transformString = transformStyle[0];
      var pxRegex = /-?\d+\.?\d*/;
      var matches = transformString.match(pxRegex);
      if (matches) {
        var pxValue = parseFloat(matches[0]); // Convert string to float
        var roundedPxValue = Math.round(pxValue);
        transformStyle[0] = "translateX(" + roundedPxValue + "px)";
      }

      //$("div.C_ELEMENT.APPICON > .ICON").trigger("pointerup")
    }
  );
  bs.scroller.actions.hooks.on("scrollStart", () => {
    eventReloads.appIcon();
    $("#pages").addClass("scrollHelper");
    $("div.C_ELEMENT.APPICON > img.ICON.active").each((index, element) => {
      element.cancelPress();
      element.classList.add("cancelled");
    });
    $("body").addClass("scrolling");
  });
  bs.on("scrollEnd", () => {
    $("body").removeClass("scrolling");
    springBoard.drawFakeBlur.appUninstallIcon();
    //  drawAppUninstallIconBG()
  });
  $(window).on("pointerup", function () { });


});
$(window).on("contextmenu", function (event) {
  event.preventDefault();
});

$(window).on("focus", function () { });

$(window).on("blur", function () { });

Bridge.requestSetNavigationBarAppearance("light-fg");
Bridge.requestSetStatusBarAppearance("light-fg");

$(window).on("load", function () {
  windowinsets = JSON.parse(Bridge.getSystemBarsWindowInsets());
  insetF();
  Object.keys(windowinsets).forEach((element) => {
    $("body").css("--window-inset-" + element, windowinsets[element] + "px");
  });
  if (!Bridge["requestVibration"])
    Bridge["requestVibration"] = (e) => {
      try {
        navigator.vibrate(e);
      } catch (e) { }
    };
});

$(window).on("load", function () { });

/*
setTimeout(() => {

    const apiKey = '7c3dbcd1dcmsh7b16326b1603255p187441jsn64166f1bf2a5'

    const packageNames = allappsarchive.map(obj => obj.packageName);

    let requestsCompleted = 0;
    let categoryPackages = {}
    window.categoryPackages = categoryPackages
    packageNames.forEach(packageName => {
        const settings = {
            async: true,
            crossDomain: true,
            url: `https://app-details-from-playstore.p.rapidapi.com/category?id=${packageName}`,
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': apiKey,
                'X-RapidAPI-Host': 'app-details-from-playstore.p.rapidapi.com'
            }
        };  

        $.ajax(settings).done(function (response) {
            const categoryName = response.message; // Assuming the category name is in the 'title' field of the response
            console.log(`Category for ${packageName}: ${categoryName}`);

            if (!categoryPackages[categoryName]) {
                categoryPackages[categoryName] = [];
            }

            // Add the package name to the corresponding category array
            categoryPackages[categoryName].push(packageName);

        }).fail(function (xhr, status, error) {
            console.error(`Error retrieving category for ${packageName}: ${error}`);

            var categoryName = "Other"
            if (!categoryPackages[categoryName]) {
                categoryPackages[categoryName] = [];
            }

            // Add the package name to the corresponding category array
            categoryPackages[categoryName].push(packageName);
        }).always(function () {
            requestsCompleted++;
            if (requestsCompleted === packageNames.length) {
                console.log("done");
            }
        });
    });
}, 3000);
*/

$(window).on("pointerdown", function (event) {
  if (event.target.id != "dock" && !event.target.classList.contains("PAGEGRID"))
    return;
  clearTimeout(window["entereditmodetimeout"]);
  window["entereditmodetimeout"] = setTimeout(() => {
    springBoard.enterEditMode();
  }, 1000);
  window["editmodeprevios"] = window["inEditMode"];
});
$(window).on("pointerup", function (event) {
  if (event.target.id != "dock" && !event.target.classList.contains("PAGEGRID"))
    return;
  clearTimeout(window["entereditmodetimeout"]);
});
$(window).on("click", function (event) {
  if (event.target.id != "dock" && !event.target.classList.contains("PAGEGRID"))
    return;
  if (window["editmodeprevios"]) springBoard.exitEditMode();
});

/*


function blurBack(element, radius) {
    // Get background image
    const backgroundImage = getComputedStyle(document.body).backgroundImage;
    const imageURL = backgroundImage.replace(/url\(['"]?(.*?)['"]?\)/i, '$1');

    // Create a canvas
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // Set canvas size to match element size
    const rect = element.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    // Get background image position
    const backgroundPosX = -rect.left;
    const backgroundPosY = -rect.top;

    // Draw background image onto canvas
    const bgImage = new Image();
    bgImage.onload = function () {
        ctx.drawImage(bgImage, backgroundPosX, backgroundPosY);
        // Apply blur filter
        ctx.filter = `blur(${radius}px)`;
        ctx.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, canvas.width, canvas.height);
        // Set canvas output as div background
        element.style.backgroundImage = `url(${canvas.toDataURL()})`;
        // Dispose canvas
        canvas.remove();
    };
    bgImage.src = imageURL;
}

// Usage example
blurBack(document.getElementById('blurryDiv'), 10); // Blur the background of #blurryDiv with radius 10px
*/

$(window).on("load", function () {
  function redrawWallpaperCache() {
    fakeBlurCanvas.width = window.innerWidth;
    fakeBlurCanvas.height = window.innerHeight;
    var canvas = fakeBlurCanvas;
    var ctx = canvas.getContext("2d");
    var img = $("#system_wallpaper")[0];
    // Calculate the scale to fit the image within the canvas while maintaining aspect ratio
    const scaleFactor = Math.max(
      canvas.width / img.naturalWidth,
      canvas.height / img.naturalHeight
    );
    const scaledWidth = img.naturalWidth * scaleFactor;
    const scaledHeight = img.naturalHeight * scaleFactor;
    const x = (canvas.width - scaledWidth) / 2;
    const y = (canvas.height - scaledHeight) / 2;

    // Clear the canvas and draw the image
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, x, y, scaledWidth, scaledHeight);
  }
  $(window).on("resize", redrawWallpaperCache);
  redrawWallpaperCache();

  $(window).on("resize", function () {
    requestAnimationFrame(springBoard.drawFakeBlur.dock);
  });
  springBoard.drawFakeBlur.dock();

  startUpSequence();
});

window.onappicondeleteshow = function () {
  console.log("burdayım");
};

window.appIconClick = function (el) {
  console.log(el);
  Bridge.requestAppUninstall($(el).parent().attr("packagename"), true);
};
function insetF() {
  // windowinsets.bottom = windowinsets.bottom < 50 ? 0 : windowinsets.bottom
}

//hide loader and load springboard
window.finishLoading = function finishLoading() {
  setTimeout(() => {
    function continueLoad() {
      $("#loader").addClass("hide");
      setTimeout(() => {
        $("#loader").remove();
        $("#loaderstyle").remove();
      }, 300);
    }
    if (
      webpackVariables.mode == "development" &&
      !webpackVariables.forceDevelopmentEnv
    ) {
      springBoard.alert(
        "Warning!",
        "This build is intended for development purposes. It may be unstable and/or slow. Please proceed with caution.",
        [
          { title: "Continue", style: "default", action: continueLoad },
          {
            title: "Cancel",
            style: "cancel",
            action: function () {
              //show cute messages on cancel
              const goodbyeMessages = [
                "Looks like we're putting iCupertino's grand entrance on hold! 🚀",
                "Whoopsie-doodle! iCupertino's launch party is postponed for now! 🎉",
                "Time to hit the brakes on the iCupertino hype train! 🚂",
                "Hold the phone! iCupertino's big reveal is taking a rain check! ☔",
                "Oops-a-daisy! iCupertino's debut is taking a chill pill for the moment! ❄️",
                "Cancel culture strikes again! iCupertino's grand opening will have to wait! 🎈",
                "Well, well, well... Looks like iCupertino's debut is hitting snooze! ⏰",
                "Hey there, party pooper! iCupertino's launch is on pause mode! 😭",
                "Breaking news: iCupertino's launch event has hit a speed bump! 🚧",
                "Hold onto your hats! iCupertino's launch shenanigans are on temporary hold! 🎩",
              ];

              $("body").children(":not(style, link, div.loader)").remove();
              setTimeout(() => {
                $("body").append(
                  `<p class="goodbye">:(<br><br>${goodbyeMessages[
                  Math.floor(Math.random() * goodbyeMessages.length)
                  ]
                  }</p>`
                );
              }, 10);
            },
          },
        ]
      );
    } else {
      continueLoad();
    }
  }, 0);
};

function startUpSequence() {
  //Check if user have set iCupertino up
  (window.checkSetup = function checkSetup(params) {
    //skip setup in development mode
    if (webpackVariables.forceDevelopmentEnv) {
      (function forceSetupTest() {
        var db = springBoard.getDB();
        db.userSetup = true;
        springBoard.setDB(db);
      })();
    }
    if ("paintWorklet" in CSS) {
      CSS.paintWorklet.addModule(
        "/node_modules/css-houdini-squircle/lib/squircle.js"
      );
      document.body.classList.add("squircle");
    } else {
      console.log("houdini not supported");
      springBoard.alert(
        "Warning!",
        "WebView you are using is old/unsupported!",
        [{ title: "Ok", style: "default" }]
      );
    }

    //        console.log("setup", springBoard.getDB().userSetup)
    if (springBoard.getDB().userSetup == true) {
      finishLoading();
      return;
    } else if (springBoard.getDB()["userSetup"] == undefined) {
      var db = springBoard.getDB();
      db.userSetup = false;
      springBoard.setDB(db);
    } else {
      springBoard.userSetupView.enter();
      return;
    }
  })();
}
