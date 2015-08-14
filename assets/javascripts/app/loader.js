var $ = require('jquery'),
    hljs = require('highlight.js');

module.exports = (function () {

    function Loader(baseUrl, $selector) {
        var active = 1;

        this.baseUrl = baseUrl;
        this.cacheKey = 'contents';
        this.$selector = $selector;
        this.$loader = $('.loader');

        if (location.hash) {
            active = parseInt(location.hash.replace(/#\//, ''));

            if (!active || isNaN(active)) {
                active = 1;
            }
        } else {
            this.clear();
        }

        this.active = active;

        this.addEventListeners();
    }

    $.extend(Loader.prototype, {

        load: function (number) {
            var active,
                cached,
                filename = this.baseUrl;

            if (number) {
                number = parseInt(number);
                this.active = number;
            }

            if (this.active < 1) {
                this.active = 1;
            }

            active = 'slide-' + this.active;
            filename += 'contents/' + active + '.html';
            cached = this.getItem(active);

            this.$loader.fadeIn();

            if (cached) {
                this.$selector.html(cached);
                this.done();
            } else {
                this.$selector.empty().load(filename, (function (self) {
                    return function () {
                        self.setItem(active, $(this).html());
                        self.done();
                    };
                })(this));
            }

            if (this.isHistoryAPIExists()) {
                history.pushState({
                    active: this.active,
                    fileUrl: filename
                }, null, '#/' + this.active);
            }
        },

        isHistoryAPIExists: function () {
            return !!(window.history && window.history.pushState);
        },

        isStorageAPIExists: function () {
            return typeof Storage !== 'undefined';
        },

        addEventListeners: function () {

            if (this.isHistoryAPIExists()) {
                $(window).on('popstate', (function (self) {
                    return function (event) {

                        if (event.originalEvent.state) {

                            if (event.originalEvent.state.hasOwnProperty('fileUrl')) {
                                self.$selector.empty().load(event.originalEvent.state.fileUrl);
                            }

                            if (event.originalEvent.state.hasOwnProperty('active')) {
                                self.active = event.originalEvent.state.active;
                            }
                        }
                    };
                })(this));
            }
        },

        done: function () {
            this.highlight();
            this.$loader.stop().fadeOut();
        },

        highlight: function () {

            $('pre code').each(function(i, block) {
                hljs.highlightBlock(block);
            });
        },

        setItem: function (key, value) {
            var cache;

            if (!this.isStorageAPIExists()) {
                return null;
            }

            cache = JSON.parse(localStorage.getItem(this.cacheKey)) || {};

            try {
                cache[key] = value;
                localStorage.setItem(this.cacheKey, JSON.stringify(cache));
            } catch (exception) {
                this.clear();

                if (typeof console !== 'undefined') {
                    console.log(exception);
                }

                return null;
            }
        },

        getItem: function (key) {
            var cache;

            if (!this.isStorageAPIExists()) {
                return null;
            }

            cache = JSON.parse(localStorage.getItem(this.cacheKey));

            if (cache && cache.hasOwnProperty(key)) {
                return cache[key];
            } else {
                return null;
            }
        },

        clear: function () {

            if (!this.isStorageAPIExists()) {
                return null;
            }

            localStorage.removeItem(this.cacheKey)
        }
    });

    return Loader;
})();