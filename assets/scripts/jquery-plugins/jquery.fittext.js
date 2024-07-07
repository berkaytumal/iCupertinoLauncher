/*global jQuery */
/*!
* FitText.js 1.2
*
* Copyright 2011, Dave Rupert http://daverupert.com
* Released under the WTFPL license
* http://sam.zoy.org/wtfpl/
*
* Date: Thu May 05 14:23:00 2011 -0600
*/
function fitText(jq) {
  (function ($) {

    $.fn.fitText = function (kompressor, options) {

      // Setup options
      var compressor = kompressor || 1,
        settings = $.extend({
          'minFontSize': 12,
          'maxFontSize': 12,
          'originalFontSize': 12
        }, options);
      return this.each(function () {

        // Store the object
        var $this = $(this);
        var backups = {
          "transition": String($this.css("transition")),
          "max-width": String($this.css("max-width")),
          "overflow":  String($this.css("overflow"))
        }
        $this.addClass("noanim")

        $this.css("transition", "0s")
        $this.css("max-width", "80px")
        $this.css("font-size", `${settings.originalFontSize}px`)
        // Resizer() resizes items based on the object width divided by the compressor * 10
        const fontsiz = Math.max(Math.min(

          settings.originalFontSize / ($this.width() / $this.parent().width())

          , parseFloat(settings.maxFontSize))
          , parseFloat(settings.minFontSize))
        $this.css('font-size', fontsiz);
        const scale = fontsiz / settings.originalFontSize
        const before = $this.css("width").slice(0,-2)
        if (before > 70) {
          $this.css("transform",`translateX(-50%) scaleX(${70 / before})`)
        }

        // Call on resize. Opera debounces their resize by default.
        Object.entries(backups).forEach(element => {
          $this.css(element[0], element[1])
        });

        $this.css("max-width", "80px")


        requestAnimationFrame(() => {
          $this.removeClass("noanim")

        })

      });

    };

  })(jq);

}
export default fitText;