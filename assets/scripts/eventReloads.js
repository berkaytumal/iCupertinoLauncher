import jquery from 'jquery';
var $ = jquery; var jQuery = jquery;
import { BridgeMock, createDefaultBridgeMockConfig } from '@bridgelauncher/api-mock';
import cupertinoElements from './cupertinoElements';
import springBoard from './springBoardEvents';
import { event } from 'jquery';
const myDock = $("body #dock")
window["myDock"] = myDock
const BridgeMockInstance = !window.Bridge

if (BridgeMockInstance) {
    window.Bridge = new BridgeMock(new createDefaultBridgeMockConfig());
    Bridge.config.logRaisedBridgeEvents = false
    Bridge.config.appsUrl = "mock/apps.json"
    Bridge.config.statusBarHeight = 0
    Bridge.config.navigationBarHeight = 0
}
var allappsarchive = []
window["allappsarchive"] = allappsarchive

function windowGlobalPointerUp() {
    setTimeout(() => {
        $("div.C_ELEMENT.APPICON > img.ICON").each(function (index, element) {
            element["isContextOn"] = false
        })
    }, 10);
    $("body > div.C_ELEMENT.APPICON").each(function (index, element) {

        //console.log(element.original.moveMode)
        element.original.cancelPress()
        element.original.moveMode.leave()

        $(element).css({
            left: $(element.original).offset().left + 0,
            top: $(element.original).offset().top + 0,
            transition: "var(--soft2anim) .2s"
        })//.addClass("hide")
        //console.log(element.original.lastPosition.left)
    })
}
$(window).on("pointerup", windowGlobalPointerUp)
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
            if (scale < .75) {
                springBoard.exitInfoView(false)

                element.moveMode.enter()
                e.stopPropagation()
                $(window).on("pointerup", windowGlobalPointerUp)

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
                var deletecontext = $("div.C_ELEMENT.APPINFOCONTEXTMENU")
                setTimeout(() => {
                    deletecontext.remove()
                }, 500);

            }

        } else if (element.isPointerDown) {
            //amount of lenght to cancel pointerdown
            const hypotenuse = Math.pow(Math.pow(e.clientX - element.lastPointerPosition[0], 2) + Math.pow(e.clientY - element.lastPointerPosition[1], 2), .5)
            //console.log("süre", Date.now() - element.lastPointerDown)
            if (hypotenuse > 15) {
                if (Date.now() - element.lastPointerDown > 250) {
                    element.moveMode.enter(true)
                } else {
                    element.cancelPress()
                }
            }


        } else if (element.parentElement.classList.contains("movingClone")) {

            var originalIcon = $(element.parentElement.original.parentElement)
            var availableIndex = springBoard.closestAvailableSpot(e.pageX - 30, e.pageY - 40)
            var destination = availableIconMoveSpots[availableIndex]
            if (!element.lastMovePosition) element.lastMovePosition = element.parentElement.original.lastPointerPosition
            var speed = Math.hypot(e.pageX - element.lastMovePosition[0], e.pageY - element.lastMovePosition[1])
            console.log("speed", speed)
            element.lastMovePosition = [e.pageX, e.pageY]
            if (element.lastAvailableSpot != availableIndex) {
                if (speed > 2) {
                    element.lastAvailableSpot = availableIndex
                    originalIcon.detach()
                    springBoard.insertAt(destination.parent, destination.index, originalIcon)
                    var calcspeed = 1000 / speed
                    setTimeout(() => {
                        console.log("hoopp")
                        springBoard.relocateIcons(true)
                    }, calcspeed > 1000 ? 1000 : calcspeed)
                }

            }
            var icon = element.parentElement
            $(icon).css({
                left: e.pageX + element.parentElement.original.lastPosition.left - element.parentElement.original.lastPointerPosition[0],
                top: e.pageY + element.parentElement.original.lastPosition.top - element.parentElement.original.lastPointerPosition[1]
            })
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
            element.moveMode = {
                enter: function (withoutContextMenu) {
                    springBoard.enterEditMode()
                    $(element).parent().addClass("movemode")

                    if (withoutContextMenu) {
                        var icon = element
                        element.cancelPress()
                        homeScroller.cancel()
                        var lastPosition = [$(icon).parent().offset().left, $(icon).parent().offset().top]
                        Bridge.requestVibration(20)
                        icon.backupParent = $(icon).parent().parent()
                        $(icon).parent().removeClass("hold")
                        // $("body").addClass("appinfoview")
                        $(icon).removeClass("active").addClass("info")
                        const clone = $(icon).parent().clone()
                        clone[0].isOriginal = false
                        icon.isOriginal = true
                        clone[0].original = icon
                        icon.clone = clone
                        $("body").append(clone)
                        clone.css({
                            left: lastPosition[0],
                            top: lastPosition[1]
                        })
                        setTimeout(() => {
                            // springBoard.enterEditMode()

                        }, 10);
                        //   $(icon).trigger("pointerup")
                    } else {

                        //$(element.clone).trigger("pointerup")
                    }

                    $(element.clone).children("img").removeClass("info")



                    $(element).addClass("moving")
                    $(element.clone).addClass("movingClone")
                },
                leave: function () {
                    $(element).removeClass("info")

                    setTimeout(() => {
                        $(element).removeClass("moving info")
                        $(element.clone).remove()
                        $(element).parent().removeClass("movemode")

                    }, 200);
                    // springBoard.exitEditMode()
                }
            }
        })
        const group = $("div.C_ELEMENT.APPICON > img.ICON")
        group.unbind();
        group.on("pointerdown", function (e) {
            if ($("body").hasClass("editmode")) {
                $(this).addClass("active")
                this.isPointerDown = true
                this.lastPointerDown = Date.now()
                this.contextMenuTimer = setTimeout(() => {
                    this.moveMode.enter(true)
                    homeScroller.cancel()
                }, 600);
                this.lastPosition = $(this).offset();
                this.lastPointerPosition = [e.pageX, e.pageY];
                console.log(this.relativePointerPosition)
            } else {
                $(this).addClass("active")
                this.isPointerDown = true
                this.lastPointerDown = Date.now()
                this.contextMenuTimer = setTimeout(() => {
                    $(this).trigger("contextmenu")
                }, 600);
                this.lastPosition = $(this).offset();
                this.lastPointerPosition = [e.pageX, e.pageY];
            }

        })

        group.on("click", function (e) {
            if ($("body").hasClass("editmode")) {
                console.log(event.target)
            } else {
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
            }

        })

        $(window).off("pointermove", onContextPointerMove)
        $(window).on("pointermove", onContextPointerMove)
        group.on("contextmenu", function (event) {
            if ($("body").hasClass("editmodee")) {
                console.log("afa")
                return
            }
            if (!!!event["originalEvent"]) {
                homeScroller.cancel()
                var lastPosition = [$(this).parent().offset().left, $(this).parent().offset().top]
                this["isContextOn"] = true
                Bridge.requestVibration(20)
                cancelPress(this)
                this.cancelPress()
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
                            title: "Edit Home Screen", icon: "", action: function () {
                                springBoard.exitInfoView()
                                $("div.C_ELEMENT.APPINFOCONTEXTMENU").removeClass("open").addClass("close")
                                var deletecontext = $("div.C_ELEMENT.APPINFOCONTEXTMENU")
                                setTimeout(() => {
                                    deletecontext.remove()
                                }, 500);
                                springBoard.enterEditMode()

                            }
                        },
                        "seperator",
                        {
                            title: "Delete App", icon: "", accent: true, action: function () {
                                springBoard.exitInfoView()
                                $("div.C_ELEMENT.APPINFOCONTEXTMENU").removeClass("open").addClass("close")
                                var deletecontext = $("div.C_ELEMENT.APPINFOCONTEXTMENU")
                                Bridge.requestAppUninstall($(event.target).parent().attr("packagename"), true)
                                setTimeout(() => {
                                    nestedDock
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
                clone[0].isOriginal = false
                this.isOriginal = true
                clone[0].original = this
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
                console.log("fgaga")
                event.preventDefault()
                event.stopPropagation()
            }

        })
    },
    appInfoContextMenu: function (element) {
        var menu = $(element)
        $(window).off("pointerup", window["appInfoContextMenuEventHandler"])

        window["appInfoContextMenuEventHandler"] = eventhandler
        var eventhandler = function (e) {
            $("div.C_ELEMENT.APPICON > img.ICON").each(function (index, element) {
                element.isContextOn = false
            })
            menu.children(".active")[0].onAction()
        }
        $(window).on("pointerup", eventhandler)
    }
}
export default eventReloads;
//