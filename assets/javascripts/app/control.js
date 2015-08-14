var $ = require('jquery'),
    Slider = require('./slider');

module.exports = (function () {

    function Control() {
        var max;

        this.$navigation = $('#navigation');
        this.$pagination = $('#pagination');
        this.$counter = $('#counter');

        max = this.$counter.find('input').attr('max');

        this.slider = new Slider();
        this.slider.setNumber(max);

        this.setPaginationItems(max);
        this.setPaginationActiveItems(this.slider.loader.active);
        this.navigation();
        this.pagination();
        this.counter();
        this.addKeyDownListener();
    }

    $.extend(Control.prototype, {

        navigation: function () {
            this.$navigation.find('a').on('click', (function (self) {
                return function (event) {
                    event.preventDefault();
                    self.slider[$(this).data('direction')]();
                    self.setPaginationActiveItems(self.slider.loader.active);
                };
            })(this));
        },

        pagination: function () {
            this.$pagination.on('click', 'a', (function (self) {
                return function (event) {
                    event.preventDefault();
                    self.slider.open($(this).parent().index() + 1);
                    self.setPaginationActiveItems(self.slider.loader.active);
                };
            })(this));
            this.$pagination.on('mouseover', 'a', function () {
                $(this).attr('data-content', $(this).text());
            });
        },

        counter: function () {
            this.$counter.find('input').on('change', (function (self) {
                return function () {
                    self.slider.open($(this).val());
                    self.setPaginationActiveItems(self.slider.loader.active);
                };
            })(this));
            this.$counter.find('form').on('submit', (function (self) {
                return function (event) {
                    event.preventDefault();
                    var val = $(this).find('input').val();

                    if (val) {
                        self.slider.open(val);
                        self.setPaginationActiveItems(self.slider.loader.active);
                    }
                };
            })(this));
        },

        setPaginationActiveItems: function (active) {
            this.$pagination.find('li').eq(active - 1).find('a').addClass('active last')
                .parent().nextAll().find('a').removeClass('active last');
            this.$pagination.find('li').eq(active - 1).prevAll().find('a').addClass('active').removeClass('last');
        },

        setPaginationItems: function (number) {

            for (var i = 0; i < number; i++) {
                this.$pagination.append('<li><a href="#">' + (i + 1) + '</a></li>');
            }

            this.$pagination.find('a').css('width', this.$pagination.width() / number + 'px');
        },

        addKeyDownListener: function () {

            document.addEventListener('keydown', (function (self) {
                return function (event) {

                    if (event.keyCode === 70) {
                        self.slider.requestFullScreen();
                    } else if (event.keyCode === 27) {
                        self.slider.exitFullscreen();
                    } else if (event.keyCode === 39) {
                        self.slider.next();
                        self.setPaginationActiveItems(self.slider.loader.active);
                    } else if (event.keyCode === 37) {
                        self.slider.prev();
                        self.setPaginationActiveItems(self.slider.loader.active);
                    }
                };
            })(this), false);
        }
    });

    return Control;
})();