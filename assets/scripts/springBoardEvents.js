import jquery from 'jquery';
var $ = jquery; var jQuery = jquery;
//import { BridgeMock, createDefaultBridgeMockConfig } from '@bridgelauncher/api-mock';
import cupertinoElements from './cupertinoElements';
import easings from "../scripts/libraries/easings.js"
import formatString from '../scripts/libraries/stringFormat.js';

const myDock = $("body #dock")
window["myDock"] = myDock
//if (!window.Bridge) window.Bridge = new BridgeMock(new createDefaultBridgeMockConfig());
var allappsarchive = []
window["allappsarchive"] = allappsarchive
function transformValue(y, x, z) {
  return x + (y - x) * (1 - z);
}/*
var appUninstallIconCache = {
  ls: [0, 0]
}*/

window.availableIconMoveSpots = [
  //{parent: $("#dock")[0], index:0, position: [0,0]}

]
const exampleDB = function () {
  return {
    placement: {
      dock: [],
      pages: [[]]
    },
    order: [],
    customGrid: false,
    wallpaper: "undefined",
    nestedDock: false
  }
}
const isElementInViewport = function (el) {
  var rect = el.getBoundingClientRect();

  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}
const getCurrentDBName = function () {
  var urlParams = new URLSearchParams(window.location.search);
  var d_name = ""
  if (urlParams.has('emudata')) {
    d_name = "mDB_" + urlParams.get('emudata')
  } else {
    d_name = "defaultDB"
  }
  return d_name
}
const getGrid = function (db) {
  var ava = JSON.parse(JSON.stringify(db))
  var defaultGrid = document.body["TABLET_VIEW"] ? [5, 6] : Math.max(document.body.clientHeight, document.body.clientWidth) < 650 ? [4, 5] : [4, 6]
  if (!ava.customGrid) {
    ava["temp"] = {
      grid: [0, 0]
    }
    try {
      if (String([Number(cacdb.customGrid[0]), Number(cacdb.customGrid[1])]) != String([0, 0])) {
        ava.temp.grid = [Number(cacdb.customGrid[0]), Number(cacdb.customGrid[1])]
        //        console.log("res0")
        //      console.log("ava", ava)

      } else {
        //    console.log("res1")
        ava.temp.grid = defaultGrid
        //      console.log("ava", ava)

      }
    } catch (error) {
      //      console.log("res2")
      ava.temp.grid = defaultGrid
      //     console.log("ava", ava)

    }

  }
  springBoard.setDB(ava)
  return ava
}

const resetDB = function () {
  return getGrid(exampleDB())
}
const replaceApps = function (resp) {
  var mygridsize = springBoard.getDB().temp.grid[0] * springBoard.getDB().temp.grid[1]

  var response = resp
  var allapps = [].concat(springBoard.getDB().placement.dock, springBoard.getDB().placement.pages,);
  // console.log("allaps:", allapps)
  function processArrays(array1, array2) {
    // Step 1: Filter array1
    //   console.log(array1)
    const deletedFromArray1 = array1.filter(str => !array2.includes(str));
    //   console.log("kontrol et tatlım", array1, array2)
    //   console.log("Deleted apps:", deletedFromArray1);
    array1 = array1.filter(str => array2.includes(str));
    // Step 2: Filter array2
    array2 = array2.filter(str => !array1.includes(str));
    //   console.log("Loaded apps:", array2);


    // Step 3: Create array3 from concatenation of array1 and array2
    array1.concat(array2);
    return [array1, array2]
    if (deletedFromArray1.length == 0 && array2.length == 0) {
      return allapps
    } else if (deletedFromArray1.length == 0) {
      return
      return array3;

    }
  }
  function arrayAddToEnd(gridsize, arrayofarrays, array) {
    // Given arrays
    let lists = arrayofarrays;
    let add = array;

    // Function to add elements to lists while ensuring each inner array has max 4 length
    function addToNestedArray(arr, value) {
      if (arr.length === 0 || arr[arr.length - 1].length === gridsize) {
        arr.push([]);
      }
      arr[arr.length - 1].push(value);
    }

    // Loop through the 'add' array and add elements to 'lists'
    add.forEach(value => {
      addToNestedArray(lists, value);
    });

    // Output the updated 'lists' array
    //   console.log(lists);
    return lists

  }
  // Example usage:
  var db = springBoard.getDB()
  // console.log("ŞU ANKİ DATA", springBoard.getDB())
  const array3 = processArrays(allapps, resp["apps"].map(obj => obj.packageName));
  // console.log("gridsize", mygridsize)
  const newapplist = arrayAddToEnd(mygridsize, array3[0], array3[1])
  db.placement.pages = (typeof newapplist[0] == "string") ? [].push(newapplist) : newapplist
  //  console.log("db gelitoooee", db.placement.pages)
  springBoard.setDB(db)

}
const springBoard = {
  changeZoom: function (scale) {
    scale = scale == 0 ? 1 : scale < 0.1 ? 0.1 : scale > 10 ? 10 : scale
    $("body").css("zoom", scale)
    $("#debugmenu").css("zoom", 1 / scale)
    $("div.C_ELEMENT.PAGEGRID").css("width", document.body.clientWidth)
    springBoard.relocateIcons()
  },
  closestAvailableSpot: function (x, y) {
    let closestIndex = -1;
    let closestDistance = Infinity;

    availableIconMoveSpots.forEach((item, index) => {
      const positionX = item.position[0];
      const positionY = item.position[1];

      const distance = Math.sqrt((x - positionX) ** 2 + (y - positionY) ** 2);

      if (distance < closestDistance) {
        closestIndex = index;
        closestDistance = distance;
      }
    });
    return closestIndex;
  },
  insertAt: function (th, index, element) {
    index = index < 0 ? 0 : index
    index = index > $(th).children().length ? $(th).children().length : index
    if (index != $(th).children().length) {
      $(element).insertBefore($(th).children().eq(index));
    } else {
      $(th).append(element);

    }

    return $(element);
  },
  findLabelFromPackageName: function (packageName) {
    var apps = window["allappsarchive"]
    for (let i = 0; i < window["allappsarchive"].length; i++) {
      if (window["allappsarchive"][i].packageName == packageName) {
        return window["allappsarchive"][i].label;
      }
    }
    return null; // Return null if packageName is not found in the array
  },
  reloadApps: function (callback) {
    fetch(Bridge.getAppsURL())
      .then(resp => resp.json())
      .then(resp => {
        replaceApps(resp);
        window["allappsarchive"] = resp.apps
        springBoard.reloadPages()
        if (callback && typeof callback == "function") callback(); else {
          //  console.log("couldnt call callback")
        }
        // $("body").append(new cupertinoElements.appIcon("../mock/icons/default/com.android.chrome.png", "bb", "cc"))
      })
  },
  setDB: function (json) {
    try {
      var deaa = JSON.parse(JSON.stringify(json))
      delete deaa.temp
      localStorage.setItem(getCurrentDBName(), JSON.stringify(deaa))
    } catch (error) {
      // console.log(error)
      return false
    }
  },
  getDB: function () {
    //console.log("db:", getCurrentDBName())


    try {
      const cacdb = JSON.parse(localStorage[getCurrentDBName()])
      delete cacdb.temp
      return getGrid(cacdb)

    } catch (error) {
      console.info("DATABASE REBUILD")
      var dat = resetDB()
      springBoard.setDB(dat)
      return resetDB()
    }
  },
  relocateIcons: function (animate = false) {
    if (animate == true) {
      $("body").addClass("iconsMoveTransition")
      clearTimeout(window["relocateIconsTransitionTimeout"])
      window["relocateIconsTransitionTimeout"] = setTimeout(() => {
        $("body").removeClass("iconsMoveTransition")
      }, 500);
    } else {
      clearTimeout(window["relocateIconsTransitionTimeout"])
      $("body").removeClass("iconsMoveTransition")
    }

    window.windowinsets = JSON.parse(Bridge.getSystemBarsWindowInsets())
    //if (window["inEditMode"]) window.windowinsets.top += 30
    var [smallestSize, biggestSize] = [Math.min(document.body.clientWidth, document.body.clientHeight), Math.max(document.body.clientWidth, document.body.clientHeight)]
    var iconsize = Number($("body").css("--icon-size").slice(0, -2));
    var nestedDock = false
    if (biggestSize < 700) {
      $("body").addClass("nestedDock")
      nestedDock = true
    } else {
      $("body").removeClass("nestedDock")
    }


    const config = springBoard.getDB()
    const grid = config.temp.grid
    console.log
    var [column, row] = [grid[0], grid[1]]

    var landscape = (document.body.clientWidth > document.body.clientHeight)
    if (landscape) [column, row] = [grid[1], grid[0]]
    var rect = [100, 100, 0, $("#dock").height() + $("#dock").css("bottom").slice(0, -2) * 2]
    if (isTablet()) {
      rect[0] = document.body.clientWidth * 0.075 + 40 //50

      rect[1] = document.body.clientHeight * 0.06 + 15
      rect[2] = rect[0]
      rect[3] = document.body.clientHeight * 0.06 + 15 + 120


      rect[3] -= 20
      rect[1] = document.body.clientHeight * 0.03 + 15
      rect[3] += windowinsets.bottom

    } else {
      if (landscape) {
        rect[0] = 32
        rect[1] = 12
        rect[2] = 32
        rect[3] = 120
      }
      else {

        if (document.body.clientHeight < 700) {
          if (document.body.clientHeight < 670) {
            rect[0] = document.body.clientWidth * 0.2 + -45
            rect[2] = 20 / (390 / document.body.clientWidth)
            rect[3] = document.body.clientHeight * 0.02 + 120
            rect[1] = rect[0] / 2
          } else {
            rect[0] = document.body.clientWidth * 0.2 + -45
            rect[2] = 20 / (390 / document.body.clientWidth)
            rect[3] = document.body.clientHeight * 0.02 + 120
            rect[1] = rect[0] / 1
          }
          var maxheight = (document.body.clientWidth - rect[2] - rect[0]) / 3 * 3 * 1.75
          maxheight = maxheight < 450 ? 450 : maxheight
          if (document.body.clientHeight - rect[3] - rect[1] >= maxheight) rect[3] = document.body.clientHeight - (rect[1] + maxheight)

        } else {
          rect[0] = document.body.clientWidth * 0.09 + 0
          rect[1] = document.body.clientWidth * 0.2 + 0 + 120
          rect[3] = document.body.clientHeight * 0.06 + 15 + 100
          const maxheight = (document.body.clientWidth - rect[2] - rect[0]) / 3 * 3 * 1.25
          if (document.body.clientHeight - rect[3] - rect[1] >= maxheight) rect[3] = document.body.clientHeight - (rect[1] + maxheight)
          rect[1] = rect[0]

        }
        rect[2] = rect[0]
        rect[3] += window.windowinsets.bottom


      }
    }
    rect[1] += window.windowinsets.top
    if (rect[0] > (nestedDock ? 30 : 31) && !isTablet()) rect[2] = rect[0] = nestedDock ? 30 : 31
    // rect[3] = 0
    const convrect = [
      rect[0],
      rect[1],
      document.body.clientWidth - rect[2] - rect[0],
      document.body.clientHeight - rect[3] - rect[1]]
    /*
        if (document.body["TABLET_VIEW"]) {
     
        } else {
          if (document.body.clientHeight < 600) {
            convrect[3] = (convrect[3] - rect[1]) < 420 ? 420 - rect[1] : convrect[3]
          } else {
            convrect[3] = (convrect[3] - rect[1]) < 600 ? 600 - rect[1] : convrect[3]
          }
        }
    */
    function relocatePageIcons(eq) {

      $("#pages").children("div.C_ELEMENT.PAGEGRID").eq(eq).children("div.C_ELEMENT.APPICON").each(function (index, element) {
        const [lx, ly] = [index % column, Math.floor(index / column)]
        const [cx, cy] = [lx / (column - 1), ly / (row - 1)]
        //     console.log(lx, ly, cx, cy)
        //   console.log
        $(element).css({
          left: `${convrect[0] + cx * (convrect[2] - iconsize)}px`,
          top: `${convrect[1] + cy * (convrect[3] - iconsize - 20)}px`
        })
      })
    }
    for (let i = 0; i < $("#pages").children("div.C_ELEMENT.PAGEGRID").length; i++) {
      relocatePageIcons(i)
      //  console.log(i)

    }

    (function relocateDockIcons(params) {
      $(":root").css({
        "--screen-width": document.body.clientWidth + "px",
        "--screen-height": document.body.clientHeight + "px",
        "--screen-width-p": (document.body.clientWidth / devicePixelRatio) + "px",
        "--screen-height-p": (document.body.clientHeight / devicePixelRatio) + "px"
      })

      var iconcount = Number(myDock.children("div.C_ELEMENT.APPICON").length)
      var restedDock = $("body").css("--screenradius").slice(0, -2) <= 18
      /*if (restedDock) {
        $("body").addClass("nestedDock")
      } else {
        $("body").removeClass("nestedDock")
      }*/
      if (!!document.body["TABLET_VIEW"]) {
        var width = (iconcount - 1) * iconsize + (iconcount - 1) * 17
        var left = myDock.css("width").slice(0, -2) / 2 - (width + iconsize) / 2
        if (!restedDock) {
          if (width + 17 * 2 + iconsize > myDock.css("min-width").slice(0, -2)) {
            $("#dock").css("width", (iconcount * iconsize + (iconcount + 1) * 17) + "px")
            myDock.children().each(function (index, element) {
              const tr = index / (iconcount - 1)
              $(element).css({
                left: `${((index - 0) * iconsize + 17 * (index + 1))}px`,
                top: `17px`,
              })
            })
          } else {
            myDock.children().each(function (index, element) {
              const tr = index / (iconcount - 1)
              $(element).css({
                left: `${left + --width * tr}px`,
                top: `17px`,
              })
            })
          }
        } else {

          var width = ((iconcount * iconsize + (iconcount + 1) * 17) * 5 + document.body.clientWidth) / 6
          var left = myDock.css("width").slice(0, -2) / 2 - (width + iconsize) / 2
          myDock.children().each(function (index, element) {
            //   console.log(index, index, iconcount)
            const tr = index / (iconcount - 1)
            //    console.log(width)
            $(element).css({
              left: `${left + --width * tr}px`,
              top: `19px`,
            })
            //console.log($(element).css("left"), $(element).css("top"))
          })

        }


      } else {
        //MAX ICON 
        if (iconcount > 4) {
          myDock.children().slice("4").remove()
          iconcount = Number(myDock.children("div.C_ELEMENT.APPICON").length)
          iconsize = Number($("body").css("--icon-size").slice(0, -2))
        }

        width = myDock.width() - 19 * 2 - iconsize + 4
        left = 19
        if (left + 12 > rect[0] && iconcount == 4) {
          left = rect[0] - 12;
          width = myDock.width() - (rect[0] - 12) * 2 - iconsize + 4
        }
        var pseudowidth = (4 - 1) * iconsize + (4 - 2) * 19 + 29
        var pseudoleft = myDock.css("width").slice(0, -2) / 2 - (pseudowidth + iconsize) / 2

        if (iconcount <= 3) {
          var width = (iconcount - 1) * iconsize + (iconcount - 2) * 29 + 19
          var left = myDock.css("width").slice(0, -2) / 2 - (width + iconsize) / 2
        } else if ((iconcount == 4 && pseudoleft > 100)) {
          var width = (iconcount - 1) * iconsize + (iconcount - 2) * 116 + 19
          var left = myDock.css("width").slice(0, -2) / 2 - (width + iconsize) / 2
        } else {
        }

        myDock.children().each(function (index, element) {
          //   console.log(index, index, iconcount)
          const tr = index / (iconcount - 1)
          //    console.log(width)
          $(element).css({
            left: `${left + --width * tr}px`,
            top: `19px`,
          })
          //console.log($(element).css("left"), $(element).css("top"))
        })
      }
      /* myDock.children().each(function (index, element) {
         console.log(index, index, iconcount)
         $(element).css({
           left: `${(window["TABLET_VIEW"] ? translateX : translateX)}px`,
           top: `${window["TABLET_VIEW"] ? 17 : 19}px`,
         })
         console.log($(element).css("left"), $(element).css("top"))
       })*/
    })();
    if (!window["homeScroller"]) {
      console.log("homescroller yok")


    } else if (animate == false) {

      springBoard.relocateIconMovingSpots()


      $(`#pages > div:nth-child(${homeScroller.getCurrentPage().pageX + 1})`).children("div.C_ELEMENT.APPICON").each(function (index, element) {
        var el = $(element)
        var pos = el.offset()
        pos.left += iconsize * .5, pos.top += iconsize * .5
        var height = document.body.clientHeight - 120
        el.css({
          "--centerX": pos.left - document.body.clientWidth / 2,
          "--centerY": pos.top - height / 2,
          "--centerHypot": Math.hypot(pos.left - document.body.clientWidth / 2, pos.top - height / 2),
        })
      })
    }


  },
  relocateIconMovingSpots: function () {

    availableIconMoveSpots = []
    window.windowinsets = JSON.parse(Bridge.getSystemBarsWindowInsets())
    //if (window["inEditMode"]) window.windowinsets.top += 30
    var [smallestSize, biggestSize] = [Math.min(document.body.clientWidth, document.body.clientHeight), Math.max(document.body.clientWidth, document.body.clientHeight)]
    var iconsize = Number($("body").css("--icon-size").slice(0, -2));
    var nestedDock = false
    if (biggestSize < 700) {
      nestedDock = true
    } else {
    }
    const config = springBoard.getDB()
    const grid = config.temp.grid
    console.log
    var [column, row] = [grid[0], grid[1]]

    var landscape = (document.body.clientWidth > document.body.clientHeight)
    if (landscape) [column, row] = [grid[1], grid[0]]
    var rect = [100, 100, 0, $("#dock").height() + $("#dock").css("bottom").slice(0, -2) * 2]
    if (isTablet()) {
      rect[0] = document.body.clientWidth * 0.075 + 40 //50

      rect[1] = document.body.clientHeight * 0.06 + 15
      rect[2] = rect[0]
      rect[3] = document.body.clientHeight * 0.06 + 15 + 120
    } else {
      if (landscape) {
        rect[0] = 32
        rect[1] = 12
        rect[2] = 32
        rect[3] = 120

      } else {

        if (document.body.clientHeight < 700) {
          if (document.body.clientHeight < 670) {
            rect[0] = document.body.clientWidth * 0.2 + -45
            rect[2] = 20 / (390 / document.body.clientWidth)
            rect[3] = document.body.clientHeight * 0.02 + 120
            rect[1] = rect[0] / 2
          } else {
            rect[0] = document.body.clientWidth * 0.2 + -45
            rect[2] = 20 / (390 / document.body.clientWidth)
            rect[3] = document.body.clientHeight * 0.02 + 120
            rect[1] = rect[0] / 1
          }
          var maxheight = (document.body.clientWidth - rect[2] - rect[0]) / 3 * 3 * 1.75
          maxheight = maxheight < 450 ? 450 : maxheight
          if (document.body.clientHeight - rect[3] - rect[1] >= maxheight) rect[3] = document.body.clientHeight - (rect[1] + maxheight)

        } else {
          rect[0] = document.body.clientWidth * 0.09 + 0
          rect[1] = document.body.clientWidth * 0.2 + 0 + 120
          rect[3] = document.body.clientHeight * 0.06 + 15 + 100
          const maxheight = (document.body.clientWidth - rect[2] - rect[0]) / 3 * 3 * 1.25
          if (document.body.clientHeight - rect[3] - rect[1] >= maxheight) rect[3] = document.body.clientHeight - (rect[1] + maxheight)
          rect[1] = rect[0]

        }
        rect[2] = rect[0]
        rect[3] += window.windowinsets.bottom


      }
    }
    rect[1] += window.windowinsets.top
    if (rect[0] > (nestedDock ? 30 : 31) && !isTablet()) rect[2] = rect[0] = nestedDock ? 30 : 31
    // rect[3] = 0

    const convrect = [
      rect[0],
      rect[1],
      document.body.clientWidth - rect[2] - rect[0],
      document.body.clientHeight - rect[3] - rect[1]]
    /*
        if (document.body["TABLET_VIEW"]) {
     
        } else {
          if (document.body.clientHeight < 600) {
            convrect[3] = (convrect[3] - rect[1]) < 420 ? 420 - rect[1] : convrect[3]
          } else {
            convrect[3] = (convrect[3] - rect[1]) < 600 ? 600 - rect[1] : convrect[3]
          }
        }
    */
    function relocatePageIcons(index) {

      const [lx, ly] = [index % column, Math.floor(index / column)]
      const [cx, cy] = [lx / (column - 1), ly / (row - 1)]
      availableIconMoveSpots.push({ parent: $(`#pages > div:nth-child(${homeScroller.getCurrentPage().pageX + 1})`)[0], index: index, position: [convrect[0] + cx * (convrect[2] - iconsize), convrect[1] + cy * (convrect[3] - iconsize - 20)] })
    }
    for (let i = 0; i < springBoard.getDB().temp.grid[0] * springBoard.getDB().temp.grid[1]; i++) {
      relocatePageIcons(i)
      //  console.log(i)

    }

    (function relocateDockIcons(params) {
      var iconcount = Number(myDock.children("div.C_ELEMENT.APPICON").length)
      var restedDock = $("body").css("--screenradius").slice(0, -2) <= 18
      var maxicons = isTablet() ? 999 : 4
      var plusone = myDock.children().length + 1 > maxicons ? maxicons : myDock.children().length + 1
      iconcount = plusone
      var myDockOffset = myDock.offset()
      var imaginaryWidth = (plusone * iconsize + (plusone + 1) * 17) //myDock.css("width")
      myDockOffset.left += (myDock.width() - imaginaryWidth) / 2


      if (!!document.body["TABLET_VIEW"]) {
        var width = (iconcount - 1) * iconsize + (iconcount - 1) * 17
        var left = imaginaryWidth / 2 - (width + iconsize) / 2
        if (!restedDock) {
          if (width + 17 * 2 + iconsize > myDock.css("min-width").slice(0, -2)) {
            for (let index = 0; index < plusone; index++) {
              const tr = index / (iconcount - 1)
              availableIconMoveSpots.push({ parent: $(`#dock`)[0], index: index, position: [(index - 0) * iconsize + 17 * (index + 1) + myDockOffset.left, 17 + myDockOffset.top] })
            }

          } else {

            for (let index = 0; index < plusone; index++) {
              const tr = index / (iconcount - 1)
              availableIconMoveSpots.push({ parent: $(`#dock`)[0], index: index, position: [left + --width * tr + myDockOffset.left, 19 + myDockOffset.top] })
            }


          }
        } else {

          var width = ((iconcount * iconsize + (iconcount + 1) * 17) * 5 + document.body.clientWidth) / 6
          var left = imaginaryWidth / 2 - (width + iconsize) / 2
          for (let index = 0; index < plusone; index++) {
            const tr = index / (iconcount - 1)
            availableIconMoveSpots.push({ parent: $(`#dock`)[0], index: index, position: [left + --width * tr + myDockOffset.left, 19 + myDockOffset.top] })
          }

        }


      } else {
        //MAX ICON 
        if (iconcount > 4) {
          iconcount = Number(myDock.children("div.C_ELEMENT.APPICON").length)
          iconsize = Number($("body").css("--icon-size").slice(0, -2))
        }

        width = imaginaryWidth - 19 * 2 - iconsize + 4
        left = 19
        if (left + 12 > rect[0] && iconcount == 4) {
          left = rect[0] - 12;
          width = imaginaryWidth - (rect[0] - 12) * 2 - iconsize + 4
        }
        var pseudowidth = (4 - 1) * iconsize + (4 - 2) * 19 + 29
        var pseudoleft = imaginaryWidth / 2 - (pseudowidth + iconsize) / 2

        if (iconcount <= 3) {
          var width = (iconcount - 1) * iconsize + (iconcount - 2) * 29 + 19
          var left = imaginaryWidth / 2 - (width + iconsize) / 2
        } else if ((iconcount == 4 && pseudoleft > 100)) {
          var width = (iconcount - 1) * iconsize + (iconcount - 2) * 116 + 19
          var left = imaginaryWidth / 2 - (width + iconsize) / 2
        } else {
        }

        for (let index = 0; index < plusone; index++) {
          const tr = index / (iconcount - 1)
          availableIconMoveSpots.push({ parent: $(`#dock`)[0], index: index, position: [left + --width * tr + myDockOffset.left, 19 + myDockOffset.top] })
        }
      }
      /* myDock.children().each(function (index, element) {
         console.log(index, index, iconcount)
         $(element).css({
           left: `${(window["TABLET_VIEW"] ? translateX : translateX)}px`,
           top: `${window["TABLET_VIEW"] ? 17 : 19}px`,
         })
         console.log($(element).css("left"), $(element).css("top"))
       })*/
    })();
  },
  reloadPages: function () {
    const config = springBoard.getDB()

    // Define the desired number of children
    const desiredChildrenCount = config.placement.pages.length;

    // Get the number of children elements with class "PAGEGRID" under element with id "pages"
    const childrenCount = $("#pages").children(".PAGEGRID").length;

    // Check if the number of children is greater than desiredChildrenCount
    if (childrenCount > desiredChildrenCount) {
      // If there are more than desiredChildrenCount children, remove the extra children after the desired count
      $("#pages").children(".PAGEGRID:gt(" + (desiredChildrenCount - 1) + ")").remove();

    } else if (childrenCount < desiredChildrenCount) {
      // If there are fewer than desiredChildrenCount children, create enough children to reach desiredChildrenCount
      const childrenToAdd = desiredChildrenCount - childrenCount;
      //   console.log(desiredChildrenCount, "tane istiyosun", childrenCount + "tane var")
      // console.log(childrenToAdd, "tane ekliyorum")
      for (let i = 0; i < childrenToAdd; i++) {
        var page = cupertinoElements.appGrid(config.temp.grid[0], config.temp.grid[1])
        $("#pages").append(page)
      }
    } else {
      //  console.log("zaten okay")
    }

    $("#pages").children("div.C_ELEMENT.PAGEGRID").each((index, element) => {
      config.placement.pages[index].forEach((elemente, indexe) => {
        if (config.placement.pages[index].length - 1 >= indexe) {
          //  console.log(Bridge)
          $(element).append(new cupertinoElements.appIcon(Bridge.getDefaultAppIconURL(config.placement.pages[index][indexe]), springBoard.findLabelFromPackageName(config.placement.pages[index][indexe]), config.placement.pages[index][indexe]))

        }
      });
    })
    $("div.C_ELEMENT.APPICON > p.STRING").fitText()


  },
  userSetupView: {
    enter: function () {
      console.log("hey")
      springBoard.userSetupView.leave(() => {
        $("#innerapp").css("display", "none")
        const fxtag = Date.now() + "-" + Math.round(Math.random() * 1000)

        $("body").append(`<div class="C_ELEMENT USERSETUPVIEW" src="">
        <div class="pagecover">
        <div class="page">
        <p class="welcomemessage">Welcome to iCupertino</p>
          <canvas class="C_ELEMENT USERSETUPVIEWHELLO" id="${fxtag}" width=250 height=150></canvas>
          <div class="fxlayer"></div>
          <div class="fxlayercontinuetext">
            <div class="fxlayercontinue"></div>
            <div class="fxlayercontinue2"></div>

            <svg aria-hidden="true">
            <clipPath id="usersetupviewcontinuetext">
              <text dominant-baseline="hanging" text-anchor="middle" x="50%" y="0em" dy="0.125em"> Swipe left to start</text>
            </clipPath>
          </svg>
          <svg aria-hidden="true">
          <clipPath id="usersetupviewcontinuetext2">
            <text dominant-baseline="hanging" text-anchor="middle" x="50%" y="-10px" dy="0.125em"> Swipe left to start</text>
          </clipPath>
        </svg>
          </div>
          
    
          
        </div>  
        <div class="page">
        page2
        </div>  
        <div class="page">
        page2
        </div>  
        </div>  
        </div>`)
        var c_usersetupview = $("div.C_ELEMENT.USERSETUPVIEW").last().children("div.pagecover")

        const setupScroller = new BScroll(c_usersetupview.parent()[0], {
          scrollX: true,
          scrollY: false,
          momentum: false,
          bounce: true,
          disableMouse: false,
          disableTouch: false,
          slide: {
            loop: false,
            autoplay: false,
            threshold: 0
          },
          HWCompositing: false,
          click: true,
          tap: "tap",
          phoneThreshold: 0,
          tabletThreshold: 0,
          threshold: 0

        })
        window["setupScroller"] = setupScroller
        var lastx = 0
        const hooks = setupScroller.scroller.actionsHandler.hooks
        function backtransition(x) {
          c_usersetupview.css("background", `rgb(255,255,255,${easings.easeOutCubic(Math.pow(1 - (window.innerWidth + x) / window.innerWidth, 2))})`)
        }
        setupScroller.on('scrollStart', () => {
          clearInterval(c_usersetupview.backtransitioninterval)
          clearTimeout(c_usersetupview.backtransitiontimeout)
          backtransition(setupScroller.x < 0 ? setupScroller.x : 0)
          console.log(setupScroller.x)
          lastx = setupScroller.x < 0 ? setupScroller.x : 0

        })
        hooks.on('move', ({ deltaX, deltaY, e }) => {
          backtransition(setupScroller.x < 0 ? setupScroller.x : 0)
          lastx = setupScroller.x < 0 ? setupScroller.x : 0

        })
        setupScroller.on("touchEnd", function () {
          backtransition()
          const start = Date.now()
          clearInterval(c_usersetupview.backtransitioninterval)
          clearTimeout(c_usersetupview.backtransitiontimeout)
          c_usersetupview.backtransitioninterval = setInterval(() => {
            backtransition(transformValue(lastx, (setupScroller.x < 0 ? setupScroller.x : 0), (Date.now() - start) / 400))
          }, 0);
          c_usersetupview.backtransitiontimeout = setTimeout(() => {
            clearInterval(c_usersetupview.backtransitioninterval)
            lastx = setupScroller.x < 0 ? setupScroller.x : 0

          }, 400);
        })
        setupScroller.on("scrollEnd", function () {
          clearInterval(c_usersetupview.backtransitioninterval)
          clearTimeout(c_usersetupview.backtransitiontimeout)
          backtransition(setupScroller.x)
          lastx = setupScroller.x < 0 ? setupScroller.x : 0
        })
        springBoard.drawFakeBlur.applyToElement(c_usersetupview.parent()[0], "blur(3px) brightness(0.5)", .1, window.finishLoading)
        c_usersetupview[0].helloRenderContext = c_usersetupview.children().eq(0).children("canvas.USERSETUPVIEWHELLO")[0].getContext("2d")
        var ctx = c_usersetupview[0].helloRenderContext
        var helloLocales = {}
        var start = Date.now()
        var word = ""
        var localeChoise = 0
        var sent = false
        c_usersetupview[0].renderHelloScreenRenderLoop = function () {

          ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
          ctx.font = "400 50px Inter";
          var scale = 0.5
          ctx.save()
          const wordsize = ctx.measureText(word);

          scale = ctx.canvas.width / wordsize.width < 1 ? ctx.canvas.width / wordsize.width : 1
          ctx.translate((ctx.canvas.width - (ctx.canvas.width * scale)) * .5, 0)
          ctx.scale(scale, scale)

          var x = 125 - wordsize.width / 2
          var y = 50;

          // Set font properties
          ctx.globalAlpha = 1
          var now = Date.now()

          ctx.fillText(word, x, y)
          ctx.restore()

          if (!!!sent) {
            sent = true
            c_usersetupview.children().eq(0).children("div.fxlayer").css("mask", `url(${ctx.canvas.toDataURL()})`)

          }
          if (now - start >= 5000) {
            sent = false
            start = Date.now()
            localeChoise = Math.floor(Math.random() * helloLocales.length)
            word = helloLocales[localeChoise].hello;
            c_usersetupview.children().eq(0).children("div.fxlayer").css("animation", "")
            setTimeout(() => {
              c_usersetupview.children().eq(0).children("div.fxlayer").css("animation", "fxlayerblink 5s")
            }, 0);
          }
          requestAnimationFrame(c_usersetupview[0].renderHelloScreenRenderLoop)
        }

        $.getJSON("assets/locale/hello.json")
          .done(function (data) {
            sent = false
            helloLocales = data
            c_usersetupview[0].renderHelloScreenRenderLoop()
            setTimeout(() => {
              c_usersetupview.children().eq(0).children("div.fxlayer").css("mask", `url(${ctx.canvas.toDataURL()})`)

            }, 100);
            localeChoise = Math.floor(Math.random() * helloLocales.length)
            word = helloLocales[localeChoise].hello;
            c_usersetupview.children().eq(0).children("div.fxlayer").css("animation", "")
            setTimeout(() => {
              c_usersetupview.children().eq(0).children("div.fxlayer").css("animation", "fxlayerblink 5s")
            }, 0);
          })
          .fail(function () {
            console.log("error");
          })
          .always(function () {
            console.log("complete");
          });

      })

    },
    leave: function (callback) {
      var rv = $("iframe.C_ELEMENT.USERSETUPVIEW").addClass("exit")
      $("#innerapp").css("display", "")
      setTimeout(() => {
        rv.remove()
        try { callback() } catch (e) { }
      }, 200);
    }
  },
  exitInfoView: function (keepicon = false) {
    const icon = $("div.C_ELEMENT.APPICON.hold")
    const inner = icon.children("img.ICON")
    const del = $("div.C_ELEMENT.APPINFOTRANSLUCENTLAYER")
    $("div.C_ELEMENT.APPINFOTRANSLUCENTLAYER").css("animation", "aitl_exit 0.2s ease-in-out forwards")
    $("body").removeClass("appinfoview")
    inner.css("animation", "iconinfoexit 0.2s forwards").removeClass("info")

    icon.removeClass("hold")
    icon.css("z-index", "11")
    $(window).off("pointerup", window["appInfoContextMenuEventHandler"])

    setTimeout(() => {
      del.remove()
      icon.css("z-index", "")
      inner.css("animation", "")
      icon.css("visibility", "")
      setTimeout(() => {
        if (keepicon == true) $("body > div.C_ELEMENT.APPICON").remove()

      }, 0);

    }, 200);

  },
  enterEditMode: function () {

    Bridge.requestSetStatusBarAppearance("hide")
    console.log("enterEditMode")
    springBoard.drawFakeBlur.appUninstallIcon()
    $("body").addClass("editmode")
    if (!window["inEditMode"]) window["lastsb"] = Bridge.getStatusBarAppearance()
    window["inEditMode"] = true
    clearTimeout(window["editModeTimeoutCounter"])
    //Bridge.requestSetStatusBarAppearance("hide")
    window["editModeTimeoutCounter"] = setTimeout(() => {
      springBoard.exitEditMode()
    }, 25000);

    setTimeout(() => {
      springBoard.drawFakeBlur.appUninstallIcon()
    }, 300);
  },
  exitEditMode: function () {
    Bridge.requestSetStatusBarAppearance("light-fg")
    console.log("exitEditMode")
    $("body").removeClass("editmode").addClass("exiteditmode")
    setTimeout(() => {
      $("body").removeClass("exiteditmode")
    }, 200);
    clearTimeout(window["editModeTimeoutCounter"])
    if (window["lastsb"]) {
      Bridge.requestSetStatusBarAppearance(window["lastsb"])
      delete window["lastsb"]
    }
    window["inEditMode"] = false
  },
  drawFakeBlur: {
    getTexture: function (rectangle, filter, scale, callback) {
      var canvas = window.fakeBlurCanvas;

      // Create a new canvas with the size of the rectangle
      const newCanvas = document.createElement('canvas');
      newCanvas.width = rectangle.width * scale;
      newCanvas.height = rectangle.height * scale;
      newCanvas.width = newCanvas.width <= 1 ? 2 : newCanvas.width;
      newCanvas.height = newCanvas.height <= 1 ? 2 : newCanvas.height;
      const newCtx = newCanvas.getContext('2d');
      newCtx.filter = filter;

      // Draw the rectangle from the original canvas onto the new canvas
      newCtx.drawImage(
        canvas,
        rectangle.x, // source x
        rectangle.y, // source y
        rectangle.width, // source width
        rectangle.height, // source height
        0, // destination x
        0, // destination y
        rectangle.width * scale, // destination width
        rectangle.height * scale // destination height
      );
      newCtx.filter = "none";

      var imageData = newCtx.getImageData(0, 0, newCanvas.width, newCanvas.height);

      // Loop through the image data and set all alpha values to 255
      for (var i = 3; i < imageData.data.length; i += 4) {
        imageData.data[i] = 255; // Set alpha value to 255
      }

      // Put the modified image data onto the second canvas
      newCtx.putImageData(imageData, 0, 0);

      newCanvas.toBlob((blob) => {
        if (blob) {
          const blobURL = URL.createObjectURL(blob);
          if (callback && typeof callback === 'function') {
            callback(null, blobURL);
          }
        } else {
          if (callback && typeof callback === 'function') {
            callback(new Error('Failed to create blob'), null);
          }
        }
      });
    },
    applyToElement: function (element, filter, scale = 1, callback) {
      springBoard.drawFakeBlur.getTexture(element.getBoundingClientRect(), filter, scale, (e, blobURL) => {
        $(element).css("background-image", `url(${blobURL})`).css("background-size", "100% 100%")
      })
    },
    dock: function (callback) {
      springBoard.drawFakeBlur.applyToElement(
        $($("body").hasClass("nestedDock") ? "#dockBg" : "#dock")[0],
        window.matchMedia('(prefers-color-scheme: dark)').matches ?
          "blur(50px) contrast(0.9) saturate(1.1) brightness(0.83) contrast(1.1) " :
          `blur(50px) contrast(0.75) brightness(${1 / 0.75})`
        , callback
      )


    },
    appUninstallIcon: function () {
      // if (!window["inEditMode"]) return
      requestAnimationFrame(function () {
        $(`#pages > div:nth-child(${homeScroller.getCurrentPage().pageX + 1}) div.C_ELEMENT.APPICONDELETE`).each((index, element) => {

          if (isElementInViewport(element)) springBoard.drawFakeBlur.applyToElement(element, window.matchMedia('(prefers-color-scheme: dark)').matches ? "blur(1px) contrast(0.5)  brightness(1.5)  saturate(1.5) brightness(0.85)" : "blur(1px) contrast(0.5)  brightness(1.5)  saturate(1.5)", .1)
        })

      })
    }
  },
  alert: function (title = "Alert!", message = "Message", actions = [{ title: "" }]) {
    var items = ""
    actions.forEach(element => {
      if (!element["style"]) element.style = "cancel"

      items += `<button class="C_ELEMENT ALERTWINDOWACTIONITEM${element["style"] == "default" ? " default" : element["style"] == "destructive" ? " destructive" : ""}">
          ${element.title}
        </button>`

    });
    $("body").append(`
      <div class="C_ELEMENT ALERTWINDOW">
        <p class="ALERTWINDOWTITLE">${title}</p>
        <p class="ALERTWINDOWMESSAGE">${message}</p>
        ${items}
    </div>`)
    if ($("div.ALERTWINDOWLAYER:not(.taken)").length == 0) {
      $("body").append(`
      <div class="C_ELEMENT ALERTWINDOWLAYER">
       
    </div>`)
    }
    var alertmenu = $("div.C_ELEMENT.ALERTWINDOW").last()
    actions.forEach((element, index) => {
      console.log("index", index)
      if (element["action"]) {
        if (typeof element["action"] == "function") {
          alertmenu.children("button.ALERTWINDOWACTIONITEM").eq(index).on("click", function () {
            setTimeout(() => {
              actions[index].action()
            }, 200);
          })
        }
      }
    });
    function closeW(params) {
      if ($("div.C_ELEMENT.ALERTWINDOW").length == 1) {
        var layer = $("div.ALERTWINDOWLAYER").addClass("taken")
        layer.addClass("exit")
        setTimeout(() => {
          layer.remove()
        }, 200);
      }
      alertmenu.addClass("exit")
      setTimeout(() => {
        alertmenu.remove()
      }, 200);
    }
    alertmenu.click(function (e) {
      if (e.target == this) closeW()
    })
    alertmenu.children("button").click(closeW)

  },
  checkIsDarkSchemePreferred: () => window?.matchMedia?.('(prefers-color-scheme:dark)')?.matches ?? false,
  isDarkSchemePreferred: false,
  animate: {
    intro: function () {
      var page = $(`#pages > div:nth-child(${homeScroller.getCurrentPage().pageX + 1})`).removeClass("animateIntro").css("animation", "none")
      page.addClass("animateIntro").css("animation", "")
      clearTimeout(window["introTimeout"])
      window["introTimeout"] = setTimeout(() => {
        page.removeClass("animateIntro")
        delete window["introTimeout"]
      }, 1000);


    }
  }
}
export default springBoard;

$.ajax({
  url: springBoard.getDB().wallpaper,
  type: 'HEAD',
  error: function () {
    console.log("NO WALLPAPER. DEFAULT SELECTED")
  },
  success: function () {
    //do something cheerful :)
    $("#system_wallpaper").attr("src", springBoard.getDB().wallpaper)
  },
  appsearch: {
    swipe: {
      start: (position) => {

      },
      move: (position) => {

      },
      stop: (position) => {

      }
    },
    enter: function () {

    },
    leave: function () {

    }
  }
});
function isTablet() {
  return document.body["TABLET_VIEW"]
}
springBoard.isDarkSchemePreferred = springBoard.checkIsDarkSchemePreferred()
window.matchMedia('(prefers-color-scheme: dark)')
  .addEventListener('change', ({ matches }) => {
    console.log("match", matches)
    springBoard.isDarkSchemePreferred = matches
    springBoard.drawFakeBlur.dock()
    springBoard.drawFakeBlur.appUninstallIcon()

  })