const [$, jQuery] = [window["$"], window["jQuery"]]
import { BridgeMock, createDefaultBridgeMockConfig } from '@bridgelauncher/api-mock';
import cupertinoElements from './cupertinoElements';
import springBoard from './springBoardElements';
const myDock = $("body #dock")
window["myDock"] = myDock
if (!window.Bridge) window.Bridge = new BridgeMock(new createDefaultBridgeMockConfig());
var allappsarchive = []
window["allappsarchive"] = allappsarchive

$(window).on("pointerup", function (e) {
    setTimeout(() => {
        $("div.C_ELEMENT.APPICON > img.ICON").each(function (index, element) {
            element["isContextOn"] = false
        })
    }, 10);
})
function onContextPointerMove(e) {
    var group = $("div.C_ELEMENT.APPICON > img.ICON")
    group.each(function (index, element) {
        if (element["isContextOn"] == true) {
            var distance = Math.pow(Math.pow(element.lastPointerPosition[0] - e.pageX, 2) + Math.pow(element.lastPointerPosition[1] - e.pageY, 2), .5)
            var pos = [-element.lastPointerPosition[0] + e.pageX, -element.lastPointerPosition[1] + e.pageY]
            var pos2 = [-element.lastPointerPosition[0] + e.pageX, -element.lastPointerPosition[1] + e.pageY]
            var scale = 1 - ((distance - 60) / 300)
            scale = scale > 1 ? 1 : scale < 0 ? 0 : scale

            function isMouseInsideElement(element, mouseX, mouseY) {
                // Get the bounding rectangle of the element
                const rect = element.getBoundingClientRect();
                const { top, right, bottom, left } = rect;
                // Check if the mouse is inside the bounding rectangle
                return mouseX >= left && mouseX <= right && mouseY >= top && mouseY <= bottom;
            }
            var onlyicon
            if (isMouseInsideElement(element.appInfoContextMenu, e.pageX, e.pageY)) {
                scale = 1
                pos2 = [0, 0]
            }

            $(element.appInfoContextMenu).children("div.C_ELEMENT.APPINFOCONTEXTMENUITEM").removeClass("active").addClass("s")
            $(element.appInfoContextMenu).children("div.C_ELEMENT.APPINFOCONTEXTMENUITEM").each(function (index, inneritem) {
                if (isMouseInsideElement(inneritem, e.pageX, e.pageY)) $(inneritem).addClass("active")
            })
            setTimeout(() => {
                $(element.appInfoContextMenu).children("div.C_ELEMENT.APPINFOCONTEXTMENUITEM").removeClass("s")
            }, 0)
            $(element.clone).css({
                transform: `translate(${pos[0] / 10}px, ${pos[1] / 10}px)`
            })
            $(element.appInfoContextMenu).css({
                "--scale": `${scale > .75 ? scale : 0}`,
                "--translate": scale < 1 ? `${pos2[0] / 40}px, ${pos2[1] / 20}px` : `0px, 0px`
            })

            if (scale < .75) {
                element["isContextOn"] = false
                springBoard.exitInfoView()
            }

        }
    })
}
const eventReloads = {
    appIcon: function () {

        function cancelPress(element) {
            $(element).removeClass("active")
            element.isPointerDown = false
            clearTimeout(element.contextMenuTimer)
        }
        $("div.C_ELEMENT.APPICON > img.ICON").each((index, element) => {

            element.cancelPress = function () {
                cancelPress(element)
            }
        })
        const group = $("div.C_ELEMENT.APPICON > img.ICON")
        group.unbind();
        group.on("pointerdown", function (e) {
            $(this).addClass("active")
            this.isPointerDown = true
            this.lastPointerDown = Date.now()
            this.contextMenuTimer = setTimeout(() => {
                $(this).trigger("contextmenu")
            }, 600);
            this.lastPosition = $(this).offset();
            this.lastPointerPosition = [e.clientX, e.clientY];

        })

        group.on("click", function () {
            if (Date.now() - this.lastPointerDown > 300) {
                return
            }
            const pn = $(this).parent().attr("packagename")
            cancelPress(this)

            if (pn == "com.tored.bridgelauncher" || pn == "web.bmdominatezz.bridgelauncher") {
                Bridge.requestOpenBridgeSettings()
            } else {
                Bridge.requestLaunchApp(pn)
            }
        })

        $(window).off("pointermove", onContextPointerMove)
        $(window).on("pointermove", onContextPointerMove)
        group.on("contextmenu", function (event) {
            if (!!!event["originalEvent"]) {
                homeScroller.cancel()
                var lastPosition = [$(this).parent().offset().left, $(this).parent().offset().top]
                this["isContextOn"] = true
                Bridge.requestVibration(20)
                cancelPress(this)
                this.backupParent = $(this).parent().parent()
                this.appInfoTranslucentLayer = cupertinoElements.appInfoTranslucentLayer()
                $(this).parent().addClass("hold")
                $("body").addClass("appinfoview")

                var region = 0
                if (this.lastPosition.left < document.body.clientWidth / 2) {
                    if (this.lastPosition.top < document.body.clientHeight / 2) {
                        region = 0
                    } else {
                        region = 2
                    }
                } else {
                    if (this.lastPosition.top < document.body.clientHeight / 2) {
                        region = 1
                    } else {
                        region = 3
                    }
                }
             

                cupertinoElements.appInfoContextMenu(document.body,
                    [
                        {
                            title: "Edit Home Screen", icon: "remove", action: function () {
                                springBoard.exitInfoView()
                                $("div.C_ELEMENT.APPINFOCONTEXTMENU").removeClass("open").addClass("close")
                                var deletecontext = $("div.C_ELEMENT.APPINFOCONTEXTMENU")
                                setTimeout(() => {
                                    deletecontext.remove()
                                }, 500);
                            }
                        },
                        "seperator",
                        {
                            title: "Remove App", icon: "remove", accent: true, action: function () {
                                springBoard.exitInfoView()
                                $("div.C_ELEMENT.APPINFOCONTEXTMENU").removeClass("open").addClass("close")
                                var deletecontext = $("div.C_ELEMENT.APPINFOCONTEXTMENU")
                                Bridge.requestAppUninstall($(event.target).parent().attr("packagename"), true)
                                setTimeout(() => {
                                    deletecontext.remove()
                                }, 500);
                            }
                        }
                    ],
                    region == 2 || region == 3
                )
                var lastmenu = $("div.APPINFOCONTEXTMENU").last()
                var [menuw, menuh] = [lastmenu.width(), lastmenu.height()]

                this.appInfoContextMenu = lastmenu[0]
                switch (region) {
                    case 0:
                        lastmenu.css({
                            left: $(this).offset().left,
                            top: $(this).offset().top + 69 + 16,
                            "transform-origin": `${69 / 2}px ${-69 / 1.5}px`
                        })
                        break;
                    case 1:
                        lastmenu.css({
                            left: $(this).offset().left - menuw + 69 + 2,
                            top: $(this).offset().top + 69 + 16,
                            "transform-origin": `${menuw - 69 / 2}px ${-69 / 1.5}px`
                        })
                        break;
                    case 2:
                        lastmenu.css({
                            left: $(this).offset().left,
                            top: $(this).offset().top - menuh - 16 + 2,
                            "transform-origin": `${69 / 2}px ${+ menuh + 69 / 1.5}px`
                        })
                        break;
                    case 3:
                        lastmenu.css({
                            left: $(this).offset().left - menuw + 69 + 2,
                            top: $(this).offset().top - menuh - 16 + 2,
                            "transform-origin": `${menuw - 69 / 2}px ${+ menuh + 69 / 1.5}px`
                        })
                        break;

                }
                eventReloads.appInfoContextMenu(lastmenu);
                lastmenu.addClass("open")
                $(this).removeClass("active").addClass("info")
                /* $(this).css({
                     left: lastPosition.left + "px",
                     top: lastPosition.top + "px"
                 })*/
                const clone = $(this).parent().clone()
                this.clone = clone
                $("body").append(clone)
                clone.css({
                    left: lastPosition[0],
                    top: lastPosition[1]
                })
                setTimeout(() => {
                    $(this).parent().css("visibility", "hidden")
                }, 0);
                event.preventDefault()
            } else {
                event.preventDefault()
                event.stopPropagation()
            }

        })
    },
    appInfoContextMenu: function (element) {
        var menu = $(element)
        console.log(element[0])

        $(window).off("pointerup", window["appInfoContextMenuEventHandler"])

        window["appInfoContextMenuEventHandler"] = eventhandler
        var eventhandler = function (e) {
            console.log("hassiktir", menu.children(".active")[0].onAction)
            menu.children(".active")[0].onAction()
        }
        $(window).on("pointerup", eventhandler)
    }
}
export default eventReloads;
