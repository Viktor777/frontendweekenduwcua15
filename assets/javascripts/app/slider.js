var $ = require('jquery'),
    Loader = require('./loader');

module.exports = (function () {

    function Slider() {
        this.loader = new Loader('files/', $('#content'));

        this.loader.load();
    }

    $.extend(Slider.prototype, {

        next: function () {
            this.setActive(this.loader.active + 1);
            this.loader.load();
        },

        prev: function () {
            this.setActive(this.loader.active - 1);
            this.loader.load();
        },

        open: function (num) {
            this.loader.active = parseInt(num, 10);

            this.loader.load();
        },

        requestFullScreen: function () {

            if (document.documentElement.requestFullscreen) {
                document.documentElement.requestFullscreen();
            } else if (document.documentElement.webkitRequestFullscreen) {
                document.documentElement.webkitRequestFullscreen();
            } else if (document.documentElement.mozRequestFullScreen) {
                document.documentElement.mozRequestFullScreen();
            }
        },

        exitFullScreen: function () {

            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            }
        },

        setActive: function (active) {

            if (active <= this.number) {
                this.loader.active = active;
            }
        },

        setNumber: function (number) {
            this.number = number;
        }
    });

    return Slider;
})();