const [$, jQuery] = [window["$"], window["jQuery"]]
import { BridgeMock, createDefaultBridgeMockConfig } from '@bridgelauncher/api-mock';
import cupertinoElements from './cupertinoElements';
const myDock = $("body #dock")
window["myDock"] = myDock
if (!window.Bridge) window.Bridge = new BridgeMock(new createDefaultBridgeMockConfig());
var allappsarchive = []
window["allappsarchive"] = allappsarchive



const eventReloads = {
    appIcon: function () {

        function cancelPress(element) {
            $(element).removeClass("active")
            console.log("afa")
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
        group.on("pointerdown", function () {
            $(this).addClass("active")
            console.log("aıfhasdklfa")
            this.isPointerDown = true
            this.lastPointerDown = Date.now()
            this.contextMenuTimer = setTimeout(() => {
                $(this).trigger("contextmenu")
            }, 600);
            this.lastPosition = $(this).offset();

        })
        group.on("pointerup", function () {
            cancelPress(this)
        })
        group.on("click", function () {
            if (Date.now() - this.lastPointerDown > 300) {
                return
            }
            const pn = $(this).parent().attr("packagename")
            console.log(pn)
            cancelPress(this)

            if (pn == "com.tored.bridgelauncher" || pn == "web.bmdominatezz.bridgelauncher") {
            Bridge.requestOpenBridgeSettings()
        } else {
            Bridge.requestLaunchApp(pn)
        }
            console.log("popo")
})
    group.on("contextmenu", function (event) {
        if (!!!event["originalEvent"]) {
            var lastPosition = [$(this).parent().offset().left, $(this).parent().offset().top]

            Bridge.requestVibration(20)
            this.backupParent = $(this).parent().parent()
            this.appInfoTranslucentLayer = cupertinoElements.appInfoTranslucentLayer()
            $(this).parent().addClass("hold")
            $("body").addClass("appinfoview")
            $(this).trigger("pointerup").removeClass("active").addClass("info")
            /* $(this).css({
                 left: lastPosition.left + "px",
                 top: lastPosition.top + "px"
             })*/
            const clone = $(this).parent().clone()
            $("body").append(clone)
            clone.css({
                left: lastPosition[0],
                top: lastPosition[1]
            })
            setTimeout(() => {
                $(this).parent().css("visibility", "hidden")
            }, 0);
            homeScroller.trigger("touchEnd")
            console.log("taç bitti")

            event.preventDefault()
        } else {
            event.preventDefault()
            event.stopPropagation()
        }

    })
    }
}
export default eventReloads;
