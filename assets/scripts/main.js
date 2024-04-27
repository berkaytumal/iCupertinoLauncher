
window.windowinsets = document.body.windowinsets = { left: 0, top: 0, right: 0, bottom: 0 }

detectDeviceType()

// set that will hold all registered event listeners
const bridgeEvents = new Set;

// upon receiving an event, forward it to all listeners
window.onBridgeEvent = (...event) => {
    bridgeEvents.forEach(l => l(...event));
}

// adding a listener later in the code
bridgeEvents.add((name, args) => {
    console.log("WOWOWOWOWO", name, args)   // args will be strongly typed
    if (name != "systemBarsWindowInsetsChanged") return
    windowinsets = JSON.parse(Bridge.getSystemBarsWindowInsets())
    Object.keys(windowinsets).forEach(element => {
        $("body").css("--window-inset-" + element, windowinsets[element] + "px")
    });
})


import cupertinoElements from './cupertinoElements.js';
import eventReloads from './eventReloads.js';
import springBoard from './springBoardElements.js';
import BScroll from "better-scroll"
import jquery from 'jquery';
window.$ = jquery, window.jQuery = jquery
window["cupertinoElements"] = cupertinoElements
window["springBoard"] = springBoard
window["BScroll"] = BScroll




function detectDeviceType() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);


    // Get the width and height of the screen
    var screenWidth = document.body.clientWidth;
    var screenHeight = document.body.clientHeight;

    // Calculate the diagonal length using the Pythagorean theorem (hypotenuse)
    var diagonalLength = Math.sqrt(Math.pow(screenWidth, 2) + Math.pow(screenHeight, 2));
    console.log("DIAGONAL SIZE", diagonalLength)
    // Define thresholds for phone and tablet diagonal lengths
    var phoneThreshold = 1100; // Threshold for phones (adjust as needed)
    var tabletThreshold = 900; // Threshold for tablets (adjust as needed)
    //   console.log(diagonalLength)
    // Determine the device type based on diagonal length
    var answer = "phone"

    if (urlParams.has('tablet')) {
        if (urlParams.get("tablet").toLowerCase() == "true") {
            answer = "tablet"
        } else {
            answer = "phone"
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
        document.body["TABLET_VIEW"] = true
        document.body.classList.add("TABLET_VIEW");
    } else {
        document.body["TABLET_VIEW"] = false
        document.body.classList.remove("TABLET_VIEW");
    }
    springBoard.relocateIcons()
    return answer
}

// Example usage:  




// only mock when not injected by the launcher
// make sure this runs before any code that uses the API!

$("#dock").append(new cupertinoElements.appIcon("/mock/icons/default/com.google.android.dialer.png", "bb", "cc"))
$("#dock").append(new cupertinoElements.appIcon("/mock/icons/default/com.google.android.apps.messaging.png", "bb", "cc"))
$("#dock").append(new cupertinoElements.appIcon("../mock/icons/default/com.android.chrome.png", "bb", "cc"))
$("#dock").append(new cupertinoElements.appIcon("/mock/icons/default/com.tored.bridgelauncher.png", "bb", "cc"))

var TABLET_VIEW = document.body["TABLET_VIEW"]
springBoard.relocateIcons()
$(window).on("resize", springBoard.relocateIcons)
$(window).on("resize", function () {
    return
    var appGridInner = function (columns, rows) {
        var [colem, rowsem] = [columns, rows]
        if (document.body.clientWidth > document.body.clientHeight) [colem, rowsem] = [rows, columns]

        var _isPortrait
        function createColumn(curRow) {
            var string = ""
            for (let i = 1; i <= colem; i++) {
                //string += `<th>${i + (curRow - 1) * columns}</th>`
                string += `<th></th>`
            }
            return string
        }
        function createRow() {
            var string = ""
            for (let i = 1; i <= rowsem; i++) {
                console.log("ROROR")
                string += `<tr>${createColumn(i)}</tr>`
            }
            return string
        }
        const dom = $.parseHTML(`
            <table>${createRow()}</table>
        `)
        console.log(createRow())
        return dom;
    }
    var config = springBoard.getDB()

    $("div.C_ELEMENT.PAGEGRIDTABLE").remove()

    $("#pages").children("div.C_ELEMENT.PAGEGRID").each((index, element) => {
        $(element).append(appGridInner(config.temp.grid[0], config.temp.grid[1]))
    })
    $("#pages").children("div.C_ELEMENT.PAGEGRID").each((index, element) => {
        $(element).children("table").children("tbody").children("tr").children("th").each((indexe, elemente) => {
            if (config.placement.pages[index].length - 1 >= indexe) {
                console.log(elemente)
                $(elemente).append(new cupertinoElements.appIcon("../mock/icons/default/com.android.chrome.png", springBoard.findLabelFromPackageName(config.placement.pages[index][indexe]), config.placement.pages[index][indexe]))
            }
        })
    })
})
setTimeout(() => {
    $("#dock").css("transition", "var(--basic-animation)")
}, 10);




springBoard.getDB()
springBoard.relocateIcons()

console.log("aa")
var center = [document.body.clientWidth / 2, document.body.clientHeight / 2]

springBoard.reloadApps(function () {
    springBoard.relocateIcons()

    const homeScroller = new BScroll($('#pages-wrapper')[0], {
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
    homeScroller["cancel"] = function () {
        const scrollContainer = document.querySelector('#pages-wrapper');

        // To simulate a pointer up event
        const mouseUpEvent = new MouseEvent('mouseup', {
            bubbles: true,
            cancelable: true,
            view: window,
        });
        scrollContainer.dispatchEvent(mouseUpEvent);
    }
    window["homeScroller"] = homeScroller

    const bs = window["homeScroller"]
    bs.scroller.translater.hooks.on('beforeTranslate', (transformStyle, point) => {
        var transformString = transformStyle[0]
        var pxRegex = /-?\d+\.?\d*/;
        var matches = transformString.match(pxRegex);
        if (matches) {
            var pxValue = parseFloat(matches[0]); // Convert string to float
            var roundedPxValue = Math.round(pxValue);
            transformStyle[0] = "translateX(" + roundedPxValue + "px)";
        }

        //$("div.C_ELEMENT.APPICON > .ICON").trigger("pointerup")
    })
    bs.scroller.actions.hooks.on('scrollStart', () => {
        eventReloads.appIcon()
        $("#pages").addClass("scrollHelper")
        $("div.C_ELEMENT.APPICON > img.ICON.active").each((index, element) => {
            element.cancelPress()
            element.classList.add("cancelled")
        })
    })
    /*
        bs.scroller.hooks.on('touchEnd', (event) => {
            console.log("sdgksdghjşlsdkaa")
            $("#pages").removeClass("scrollHelper")
        })
    */
    $(window).on("pointerup", function () {
    })
    /*

    return
   const homeScroller = new iScroll($('#pages-wrapper')[0], {
        scrollX: true,
        scrollY: false,
    })
    window["homeScroller"] = homeScroller
    homeScroller.on('scrollStart', () => {
        console.log('scrollStart-')
    })
    homeScroller.on('scroll', ({ y }) => {
        console.log('scrolling-')
    })
    homeScroller.on('scrollEnd', () => {
        console.log('scrollingEnd')
    })*/
})

if (navigator.userAgent == "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36") {
    $(window).on("click", function () {
        document.body.requestFullscreen()
        detectDeviceType()

    })
}
/*
const pages = document.getElementById("pages-wrapper")
const pages_wrap  = document.getElementById("pages")
pages.c_scrollLeft = 0
$("#pages-wrapper").on("pointerdown", function (e) {
    pages.c_lastScroll = [pages.c_scrollLeft, $(pages).scrollTop()]
    pages.c_lastPointer = [e.clientX, e.clientY]

    pages.c_pointerDown = true
    console.log("bastı")
})
$(window).on("pointerup", function (e) {
    const maxscroll = pages.scrollWidth - $(pages).outerWidth();

    pages.c_pointerDown = false
 //   $(pages).css({
  //      transform: ``
 //   })
  //  pages.c_pointer
    console.log("bıraktı")
})
$(window).on("pointermove", function (e) {
    if (pages.c_pointerDown) {
        console.log("ee")
        pages.c_scrollLeft = (pages.c_lastScroll[0] + pages.c_lastPointer[0] - e.clientX)
    }
})
function frameTick() {
    if (pages.c_scrollLeft != undefined) {

        if(pages.c_pointerDown){
            const maxscroll = pages.scrollWidth - $(pages).outerWidth();
            $(pages).scrollLeft(0)
            $(pages_wrap).css({
                transform: `translateX(calc(${pages.c_scrollLeft} * -1px))`
            })
        
        }
       
    }

    requestAnimationFrame(frameTick)
}
frameTick()
*/
$(window).on("contextmenu", function (event) {
    console.log("bok")
    event.preventDefault()
})


$(window).on("focus", function () {
    console.log('Focus');
});

$(window).on("blur", function () {
    console.log('Blur');
});

Bridge.requestSetNavigationBarAppearance("hide")
Bridge.requestSetStatusBarAppearance("dark-fg")


$(window).on("load", function () {
    windowinsets = JSON.parse(Bridge.getSystemBarsWindowInsets())
    Object.keys(windowinsets).forEach(element => {
        $("body").css("--window-inset-" + element, windowinsets[element] + "px")
    });
    if (!Bridge["requestVibration"]) Bridge["requestVibration"] = (e) => { navigator.vibrate(e) }

})
