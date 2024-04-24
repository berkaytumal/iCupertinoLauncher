const [$, jQuery] = [window["$"], window["jQuery"]]
import eventReloads from "./eventReloads";
import springBoard from "./springBoardElements";

const cupertinoElements = {
    appIcon: function (iconUrl, string, packageName) {
        setTimeout(() => {
            eventReloads.appIcon()
        }, 1);
        return $.parseHTML(`
        <div class="C_ELEMENT APPICON" packageName="${packageName}">
            <img class="ICON" src="${iconUrl}" style="background:white;" onerror="this.src='assets/drawable/undefined.png'"/>
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
             $(div).on("click",function () {
            springBoard.exitInfoView()
        })
        }, 500);
        $("body").append(div)
       
        return div
    },
    appInfoContextMenu:function () {
        
    }
}
export default cupertinoElements;