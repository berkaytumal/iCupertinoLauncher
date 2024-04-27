const [$, jQuery] = [window["$"], window["jQuery"]]
//import { BridgeMock, createDefaultBridgeMockConfig } from '@bridgelauncher/api-mock';
import cupertinoElements from './cupertinoElements';
const myDock = $("body #dock")
window["myDock"] = myDock
//if (!window.Bridge) window.Bridge = new BridgeMock(new createDefaultBridgeMockConfig());
var allappsarchive = []
window["allappsarchive"] = allappsarchive
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
console.log(getCurrentDBName())
const getGrid = function (db) {
  var ava = JSON.parse(JSON.stringify(db))
  var defaultGrid = document.body["TABLET_VIEW"] ? [5, 6] : document.body.clientHeight < 650 ? [4, 5] : [4, 6]
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

  relocateIcons: function () {
    //dock
    window.windowinsets = JSON.parse(Bridge.getSystemBarsWindowInsets())
    var [smallestSize, biggestSize] = [Math.min(document.body.clientWidth, document.body.clientHeight), Math.max(document.body.clientWidth, document.body.clientHeight)]
    var iconsize = Number($("body").css("--icon-size").slice(0, -2));
    var nestedDock = false
    if (biggestSize < 700) {
      $("body").addClass("nestedDock")
      nestedDock = true
      console.log("nested dock")
    } else {
      $("body").removeClass("nestedDock")
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

        width = myDock.css("width").slice(0, -2) - 19 * 2 - iconsize
        left = 19

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
    const config = springBoard.getDB()
    const grid = config.temp.grid
    var [column, row] = [grid[0], grid[1]]

    var landscape = (document.body.clientWidth > document.body.clientHeight)
    if (landscape) [column, row] = [grid[1], grid[0]]
    const rect = [100, 100, 0, $("#dock").height() + $("#dock").css("bottom").slice(0, -2) * 2]
    if (isTablet()) {

      rect[0] = document.body.clientWidth * 0.075 + 50
      rect[1] = document.body.clientHeight * 0.06 + 15
      rect[2] = rect[0]
      rect[3] = document.body.clientHeight * 0.06 + 15 + 120
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
            rect[3] = document.body.clientHeight * 0.02 + 110
            rect[1] = rect[0] / 2
          } else {
            rect[0] = document.body.clientWidth * 0.2 + -45
            rect[2] = 20 / (390 / document.body.clientWidth)
            rect[3] = document.body.clientHeight * 0.02 + 120
            rect[1] = rect[0] / 1
          }
          var maxheight = (document.body.clientWidth - rect[2] - rect[0]) / 3 * 3 * 1.75
          console.log("maxheight", maxheight)
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
    console.log(window.windowinsets)
    rect[1] += window.windowinsets.top



    /* if (document.body["TABLET_VIEW"]) {
       if (landscape) {
     
         rect[0] = document.body.clientWidth / 7.8666666667
         rect[1] = document.body.clientHeight / 15.7692307692
         rect[2] = document.body.clientWidth / 7.8666666667
         rect[3] = document.body.clientHeight / 10
       } {
         rect[0] = document.body.clientWidth / 7.3214285714
         rect[1] = document.body.clientHeight / 17, 3529411765
         rect[2] = document.body.clientWidth / 7.3214285714
         rect[3] = document.body.clientHeight / 10
       }
     
     
     } else {
       rect[0] = 32
       rect[1] = 31 + 40
       rect[2] = 32
       rect[3] = 190
     }
     */
    /*
    if (document.body["TABLET_VIEW"]) {
    
    } else {
      if (document.body.clientHeight < 600) {
        rect[0] /= 2
        rect[2] /= 2
      } else {
      }
    }*/
    const convrect = [rect[0], rect[1], document.body.clientWidth - rect[2] - rect[0], document.body.clientHeight - rect[3] - rect[1]]
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
    console.log(document.body.clientHeight, convrect[3])
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

  },
  exitInfoView: function () {
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
      console.log(icon)
      console.log("BOOOOK")
      inner.css("animation", "")
      icon.css("visibility", "")
      setTimeout(() => {
        $("body > div.C_ELEMENT.APPICON").remove()

      }, 0);

    }, 200);
    
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
  }
});
function isTablet() {
  return document.body["TABLET_VIEW"]
}