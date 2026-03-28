// aHR0cHM6Ly9naXRodWIuY29tL2x1b3N0MjYvYWNhZGVtaWMtaG9tZXBhZ2U=
$(function () {
    lazyLoadOptions = {
        scrollDirection: 'vertical',
        effect: 'fadeIn',
        effectTime: 300,
        placeholder: "",
        onError: function(element) {
            console.log('[lazyload] Error loading ' + element.data('src'));
        },
        afterLoad: function(element) {
            if (element.is('img')) {
                // remove background-image style
                element.css('background-image', 'none');
                element.css('min-height', '0');
            } else if (element.is('div')) {
                // set the style to background-size: cover; 
                element.css('background-size', 'cover');
                element.css('background-position', 'center');
            }
        }
    }

    $('img.lazy, div.lazy:not(.always-load)').Lazy({visibleOnly: true, ...lazyLoadOptions});
    $('div.lazy.always-load').Lazy({visibleOnly: false, ...lazyLoadOptions});

    $('[data-toggle="tooltip"]').tooltip()

    var $grid = $('.grid').masonry({
        "percentPosition": true,
        "itemSelector": ".grid-item",
        "columnWidth": ".grid-sizer"
    });
    // layout Masonry after each image loads
    $grid.imagesLoaded().progress(function () {
        $grid.masonry('layout');
    });

    $(".lazy").on("load", function () {
        $grid.masonry('layout');
    });
    // Glass navbar scroll effect
    const updateNavbar = function() {
        const topOfScreen = $(window).scrollTop();

        // Show/hide name in header
        const profileName = $('#profile-name-container');
        if (profileName.length) {
            const bottomOfName = profileName.offset().top + profileName.outerHeight();
            if (topOfScreen > bottomOfName) {
                $('.navbar-brand').addClass('show-name');
            } else {
                $('.navbar-brand').removeClass('show-name');
            }
        } else {
            $('.navbar-brand').addClass('show-name');
        }
    };

    updateNavbar();
    $(window).scroll(function() {
        updateNavbar();
    });
})
