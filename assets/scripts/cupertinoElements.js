import jquery from 'jquery';
var $ = jquery; var jQuery = jquery;
import eventReloads from "./eventReloads";
import springBoard from "./springBoardEvents";
import formatString from '../scripts/libraries/stringFormat.js';
import localeHelper from '../scripts/libraries/stringFormat.js';

const cupertinoElements = {
    appIcon: function (iconUrl, string, packageName) {
        setTimeout(() => {
            eventReloads.appIcon()
        }, 1);
        const apptag = Date.now() + "-" + Math.round(Math.random() * 1000)
        var icone = ""
        try {
            icone = window.icons[packageName]
        } catch (error) {
            
        }
        return $.parseHTML(`
        <div class="C_ELEMENT APPICON" id="${apptag}" packageName="${packageName}">
            <div class="C_ELEMENT APPICONDELETE" tag="${apptag}" style="--tag:'${apptag}'" onclick="appIconClick(this)"></div>
            <img loading="lazy" class="ICON" src="${icone}" dada="${icone}" style="background:white;" onerror="this.src='assets/drawable/undefined.png'"/>
            <p class="STRING">${string}</p>
        </div>`)
        //            <div class="ICON" style="--background:url(${iconUrl});"></div>

    },
    appGrid: function (columns, rows) {
        var _isPortrait
        function createColumn(curRow) {
            var string = ""
            for (let i = 1; i <= columns; i++) {
                //string += `<th>${i + (curRow - 1) * columns}</th>`
                string += `<th></th>`
            }
            return string
        }
        function createRow() {
            var string = ""
            for (let i = 1; i <= rows; i++) {
                string += `<tr>${createColumn(i)}</tr>`
            }
            return string
        }
        const dom = $.parseHTML(`
        <div class="C_ELEMENT PAGEGRID">${createRow()}
        </div>`)
        dom.isPortrait = function () {

        }
        return dom;
    },
    appInfoTranslucentLayer: function () {
        var div = document.createElement("div")
        div.classList.add("C_ELEMENT")
        div.classList.add("APPINFOTRANSLUCENTLAYER")
        setTimeout(() => {
            div.cango = true
            $(div).on("click", function () {
                $("div.C_ELEMENT.APPICON > img.ICON").each(function (index, element) {
                    element["isContextOn"] = false
                })
                springBoard.exitInfoView(true)
                $("div.C_ELEMENT.APPINFOCONTEXTMENU").removeClass("open").addClass("close")
                var deletecontext = $("div.C_ELEMENT.APPINFOCONTEXTMENU")
                setTimeout(() => {
                    deletecontext.remove()
                }, 500);
            })
        }, 500);
        $("body").append(div)

        return div
    },
    appInfoContextMenu: function (element, menu, inverted) {
        /*  var menu = [
              {
                  title: "Remove App", icon: "remove", click: function () {
  
                  },
                  title: "Edit Home Screen", icon: "edit", click: function () {
  
                  }
              }
          ]
          */
        if (inverted) menu = menu.reverse()
        var items = ""
        menu.forEach(element => {
            if (typeof element == "object") {
                items += `<div class="C_ELEMENT APPINFOCONTEXTMENUITEM"><p class="C_ELEMENT APPINFOCONTEXTMENUITEMTITLE${element["accent"] ? " accent" : ""}">${element.title}</p>

                <span class="C_ELEMENT APPINFOCONTEXTMENUITEMICON${element["accent"] ? " accent" : ""}">
                ${element["icon"]}</span>

                </div>`
            } else if (element == "seperator") {
                items += `<div class="C_ELEMENT APPINFOCONTEXTMENUSEPERATOR"></div>`
            }
        });
        $(element).append($.parseHTML(`
        <div class="C_ELEMENT APPINFOCONTEXTMENU">
            ${items}
        </div>`))
        var lastmenu = $("div.C_ELEMENT.APPINFOCONTEXTMENU").last()
        lastmenu.children("div.C_ELEMENT.APPINFOCONTEXTMENUITEM").each((index, element) => {

            element.onAction = menu.filter(function (item) {
                return typeof item == "object";
            })[index].action
            $(element).on("pointerdown", function () {
                $("div.APPINFOCONTEXTMENUITEM").removeClass("active")
                this.classList.add("active")
            })
            $(element).on("pointerup", function () {
                setTimeout(() => {
                    this.classList.remove("active")
                }, 0);
            })
        })
    }
}
export default cupertinoElements;