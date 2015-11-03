(function ($) {
    var css = {
        rootClass: 'one-screen',
        screenClass: 'screen',
        naviClass: 'one-navi',
        naviActiveClass:'active'
    }
    var $window = $(window),

        $oneScreen = $('.'+css.rootClass),
        $screens = $('.'+css.screenClass, $oneScreen),
        screenHeight = $oneScreen.height(),
        isAutoScroll = false,
        lastScrollTop = 0,
        naviarray = [],
        currentScreen = 0,
        animateDuration=1200
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
        var scrollTop = $oneScreen.scrollTop();

        var screenNo = scrollTop / screenHeight + 1;

        if (scrollTop > lastScrollTop) {//scroll down
            var i = parseInt(screenNo) - 1;
            var screenTop = i * screenHeight,
                    screenBottom = (i + 1) * screenHeight;
            $onenavi.children('.' + css.naviActiveClass).removeClass(css.naviActiveClass);
            naviarray[i].addClass(css.naviActiveClass);

            if (screenTop + screenHeight / 2 < scrollTop && screenBottom > scrollTop) {
                scrollToScreen(i + 1);
            }
            else {
                $oneScreen.scrollTop($oneScreen.scrollTop() + y);
            }

        } else {//scroll up
            var i = parseInt(screenNo) - 1;
            var screenTop = i * screenHeight,
                    screenBottom = (i + 1) * screenHeight;

            if (screenTop < scrollTop && screenTop + screenHeight / 2 > scrollTop) {

                scrollToScreen(i);
            }
            else {
                $oneScreen.scrollTop($oneScreen.scrollTop() + y);
            }
        }
    }
    //注册鼠标滚轮事件
    if (document.addEventListener) {
        document.addEventListener('DOMMouseScroll', onmousewheel, false);
    }
    window.onmousewheel = document.onmousewheel = onmousewheel;

    $window.keydown(function (ev) {
        switch (ev.keyCode) {
            case 40: {
                scroll(30);
                break;
            }
            case 38: {
                scroll(-30);
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
        var delta = ev.wheelDelta / 4;
        scroll(-delta);
    }
    function scrollToScreen(index) {
        isAutoScroll = true;
        $onenavi.children('.' + css.naviActiveClass).removeClass(css.naviActiveClass);
        naviarray[index].addClass(css.naviActiveClass);
        $oneScreen.animate({ scrollTop: screenHeight * index + 'px' }, animateDuration, 'easeOutBounce', function () {
            isAutoScroll = false;
            lastScrollTop = $oneScreen.scrollTop();
        });
        currentScreen = index;
    }
    $window.resize(function () {
        screenHeight = $oneScreen.height();
        $onenavi.css('top', (screenHeight - $onenavi.height()) / 2);
    });
    $(document).ready(function () {
        $oneScreen.scrollTop(0);
        naviarray[0].addClass(css.naviActiveClass);
    });

})(jQuery);