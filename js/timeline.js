jQuery(document).ready(function() {

    var timelineSwiper = new Swiper('.timeline .swiper-container', {
        direction: 'vertical',
        loop: false,
        speed: 1600,
        pagination: '.swiper-pagination',
        paginationBulletRender: function(swiper, index, className) {
            var year = document.querySelectorAll('.swiper-slide')[index].getAttribute('data-year');
            return '<span class="' + className + '">' + year + '</span>';
        },
        paginationClickable: true
            /*,
            nextButton: '.swiper-button-next',
            prevButton: '.swiper-button-prev',
            breakpoints: {
              768: {
                direction: 'horizontal',
              }
            }*/
    });

    jQuery('.timeline .swiper-pagination .swiper-pagination-bullet').hover(function() {
        jQuery(this).click();
    });

    var $window = jQuery(window);
    var $swiperContainer = jQuery('.timeline .swiper-container'),
        $firstSwiperSlide = jQuery('.swiper-wrapper .swiper-slide').first();

    var firstBullet = jQuery('.timeline .swiper-pagination .swiper-pagination-bullet').first();
    firstBullet.attr('style', 'margin-top: 0 !important');

    var maxMargin = (jQuery('.timeline .swiper-pagination .swiper-pagination-bullet').length + 1) * firstBullet.outerHeight();
    var offset = 50;
    var mobileWidthLimit = 667;

    var prevButton = jQuery('.timeline .swiper-button-prev');
    var nextButton = jQuery('.timeline .swiper-button-next');

    initializeTimeLine();
    if ($window.width() > mobileWidthLimit) {
        refreshPrevNextBtn();
    } else {
        refreshPrevNextBtnMobile();
    }

    function initializeTimeLine() {
        var $mainContainer = jQuery('.main-container', $firstSwiperSlide),
            $swiperSlideGrid = jQuery('.swiper-slide-grid', $mainContainer),
            $swiperSlideContent = jQuery('.swiper-slide-content', $swiperSlideGrid),
            $swiperSlideContentClone = $swiperSlideContent.clone();

        $swiperSlideContentClone.find('.timeline-title').remove();
        $swiperSlideContentClone.appendTo($swiperContainer);
    }

    function move(up) {
        var currentMargin = parseInt(firstBullet.css("margin-top"));
        var nextMargin = 0;

        if (up) {
            nextMargin = currentMargin + (firstBullet.outerHeight() * 5 + offset);

            if (nextMargin > 0) return;
        } else {
            nextMargin = currentMargin - (firstBullet.outerHeight() * 5 + offset);

            if (Math.abs(nextMargin) > maxMargin) return;
        }

        firstBullet.attr('style', 'margin-top: ' + nextMargin + 'px !important');
        refreshPrevNextBtn();
    }

    function refreshPrevNextBtn() {
        var currentMargin = parseInt(firstBullet.css("margin-top"));
        var upMargin = 0,
            downMargin = 0;

        upMargin = currentMargin + (firstBullet.outerHeight() * 5 + offset);
        downMargin = currentMargin - (firstBullet.outerHeight() * 5 + offset);
        if (upMargin > 0) {
            prevButton.addClass('disabled');
        } else {
            prevButton.removeClass('disabled');
        }

        if (Math.abs(downMargin) > maxMargin) {
            nextButton.addClass('disabled');
        } else {
            nextButton.removeClass('disabled');
        }
    }

    function mobileMove(previous) {
        var $swiperPagination = jQuery('.swiper-pagination'),
            $activeSwiperPaginationBullet = jQuery('.swiper-pagination-bullet.swiper-pagination-bullet-active', $swiperPagination),
            $nextSwiperPaginationBullet = $activeSwiperPaginationBullet.next(),
            $prevSwiperPaginationBullet = $activeSwiperPaginationBullet.prev();

        firstBullet.attr('style', 'margin-top: 0 !important');
        if (previous && $prevSwiperPaginationBullet.length > 0) {
            $activeSwiperPaginationBullet.removeClass('swiper-pagination-bullet-active');
            $prevSwiperPaginationBullet.addClass('swiper-pagination-bullet-active');
            $prevSwiperPaginationBullet.click();
        }

        if (!previous && $nextSwiperPaginationBullet.length > 0) {
            $activeSwiperPaginationBullet.removeClass('swiper-pagination-bullet-active');
            $nextSwiperPaginationBullet.addClass('swiper-pagination-bullet-active');
            $nextSwiperPaginationBullet.click();
        }

        refreshPrevNextBtnMobile();
    }

    function refreshPrevNextBtnMobile() {
        var $swiperPagination = jQuery('.swiper-pagination'),
            $activeSwiperPaginationBullet = jQuery('.swiper-pagination-bullet.swiper-pagination-bullet-active', $swiperPagination),
            $nextSwiperPaginationBullet = $activeSwiperPaginationBullet.next(),
            $prevSwiperPaginationBullet = $activeSwiperPaginationBullet.prev();

        if ($nextSwiperPaginationBullet.length > 0) {
            nextButton.removeClass('disabled');
        } else {
            nextButton.addClass('disabled');
        }

        if ($prevSwiperPaginationBullet.length > 0) {
            prevButton.removeClass('disabled');
        } else {
            prevButton.addClass('disabled');
        }
    }

    prevButton.click(function () {
        var screenWidth = $window.width();
        if (screenWidth > mobileWidthLimit) {
            move(true);
        } else {
            mobileMove(true);
        }
    });

    nextButton.click(function () {
        var screenWidth = $window.width();
        if (screenWidth > mobileWidthLimit) {
            move(false);
        } else {
            mobileMove(false);
        }
    });
});