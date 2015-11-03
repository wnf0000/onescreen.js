(function ($) {
    var css = {
        rootClass: 'one-screen',
        screenClass: 'screen',
        currentScreenClass:'current',
        naviClass: 'one-navi',
        naviActiveClass: 'active'
    }
    var attrName = {
        onescreen: 'data-ones',
        oneseasing: 'data-ones-easing',
        onesduration: 'data-ones-duration'
    }
    var $window = $(window),

        $oneScreen = $('[' + attrName.onescreen + ']').addClass(css.rootClass),
        $screens = $('.' + css.screenClass, $oneScreen),
        screenHeight = $oneScreen.height(),
        isAutoScroll = false,
        lastScrollTop = 0,
        naviarray = [],
        currentScreen = 0,
        animateDuration = parseInt($oneScreen.attr(attrName.onesduration)) || 1200,
        easing = $oneScreen.attr(attrName.oneseasing) || 'easeInOutCubic',
        scrollStep = 30
    ;
    var $onenavi = $('<ul>').addClass(css.naviClass);

    $screens.each(function (i, n) {
        var $li = $('<li>').text(i + 1);
        $onenavi.append($li);
        naviarray.push($li);
        $li.attr('data-index', i).click(function () {
            scrollToScreen(parseInt($li.attr('data-index')));
        });
    });

    $oneScreen.append($onenavi);

    $onenavi.css('top', (screenHeight - $onenavi.height()) / 2);

    function scroll(y) {
        if (isAutoScroll) {
            lastScrollTop = $oneScreen.scrollTop();
            return;
        }
        $oneScreen.scrollTop($oneScreen.scrollTop() + y);
        var scrollTop = $oneScreen.scrollTop();

        var screenNo = scrollTop / screenHeight + 1;

        if (scrollTop > lastScrollTop) {//向下滚动
            var i = parseInt(screenNo) - 1;
            var screenTop = i * screenHeight,
                    screenBottom = (i + 1) * screenHeight;
            $onenavi.children('.' + css.naviActiveClass).removeClass(css.naviActiveClass);
            naviarray[i].addClass(css.naviActiveClass);

            if (screenTop + scrollStep/*screenHeight / 4*/ <= scrollTop && screenBottom > scrollTop) {
                scrollToScreen(i + 1);
            }

        } else {//向上滚动
            var i = parseInt(screenNo) - 1;
            var screenTop = i * screenHeight,
                    screenBottom = (i + 1) * screenHeight;

            if (screenTop < scrollTop && screenTop + scrollStep /*screenHeight / 4*/ <= scrollTop) {

                scrollToScreen(i);
            }
        }
        lastScrollTop = $oneScreen.scrollTop();
    }
    //注册鼠标滚轮事件
    if (document.addEventListener) {
        document.addEventListener('DOMMouseScroll', onmousewheel, false);
    }
    window.onmousewheel = document.onmousewheel = onmousewheel;

    $window.keydown(function (ev) {
        switch (ev.keyCode) {
            case 40: {
                scroll(scrollStep);
                break;
            }
            case 38: {
                scroll(-scrollStep);
                break;
            }
            case 34: {//下一屏

                if (currentScreen >= $screens.length - 1) break;
                scrollToScreen(currentScreen + 1);
                break;
            }
            case 33: {//上一屏
                if (currentScreen <= 0) break;
                scrollToScreen(currentScreen - 1);
                break;
            }
            case 35: {//最后一屏
                scrollToScreen($screens.length - 1);
                break;
            }
            case 36: {//第一屏
                scrollToScreen(0);
                break;
            }
            default:
                break;
        }
    });
    function onmousewheel(ev) {
        var delta = ev.wheelDelta || -ev.detail;
        if (delta < 0) {
            delta = -scrollStep;
        }
        else {
            delta = scrollStep;
        }
        scroll(-delta);
    }
    function scrollToScreen(index) {
        isAutoScroll = true;
        $onenavi.children('.' + css.naviActiveClass).removeClass(css.naviActiveClass);
        naviarray[index].addClass(css.naviActiveClass);
        $oneScreen.animate({ scrollTop: screenHeight * index + 'px' }, animateDuration, easing, function () {
            isAutoScroll = false;
            lastScrollTop = $oneScreen.scrollTop();
        });
        $screens.filter('.' + css.currentScreenClass).removeClass(css.currentScreenClass).children()
            .animate({ 'left': '-100%', 'opacity': '0' }, 600, function () { $(this).css({ 'left': '100%' }) })
        
            //.removeClass(css.currentScreenClass);
        $screens.eq(index).addClass(css.currentScreenClass).children().animate({ 'left': '0%', 'opacity': '1' },800);
        currentScreen = index;
    }
    $window.resize(function () {
        screenHeight = $oneScreen.height();
        $onenavi.css('top', (screenHeight - $onenavi.height()) / 2);
    });

    $.extend($.easing, {
        easeOutBounce: function (x, t, b, c, d) {
            if ((t /= d) < (1 / 2.75)) {
                return c * (7.5625 * t * t) + b;
            } else if (t < (2 / 2.75)) {
                return c * (7.5625 * (t -= (1.5 / 2.75)) * t + .75) + b;
            } else if (t < (2.5 / 2.75)) {
                return c * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375) + b;
            } else {
                return c * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375) + b;
            }
        }
    });
    $.extend($.easing, { easeInOutCubic: function (x, t, b, c, d) { if ((t /= d / 2) < 1) return c / 2 * t * t * t + b; return c / 2 * ((t -= 2) * t * t + 2) + b; } });
    $.extend($.easing, { easeInQuart: function (x, t, b, c, d) { return c * (t /= d) * t * t * t + b; } });
    $(document).ready(function () {
        //$oneScreen.scrollTop(0);
        //naviarray[0].addClass(css.naviActiveClass);
        scrollToScreen(0);
    });

})(jQuery);