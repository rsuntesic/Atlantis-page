(function (window, document) {
    'use strict';
    var supportsObjectFit = function () {
        var testElem = document.createElement('div').style;
        if ('object-fit' in testElem ||
            '-o-object-fit' in testElem) {
            return true;
        }
        return false;
    };
    if ( false === supportsObjectFit() ) {
        var images = document.getElementsByClassName('obj-fit-cover'),
            images_length = images.length,
            image_cur_src,
            image_classes,
            i = 0;
        for (i; i < images_length; i++) {
            if ('currentSrc' in images[i]) {
                image_cur_src = images[i].currentSrc;
                if ('' === image_cur_src) {
                    image_cur_src = images[i].src;
                }
            } else {
                image_cur_src = images[i].src;
            }
            image_classes = images[i].className;

            var shim_wrapper = document.createElement('div');
            shim_wrapper.className = image_classes;
            shim_wrapper.style.background = 'url('+image_cur_src+') center center / cover no-repeat';

            var shim_img = document.createElement('img');
            shim_img.src = image_cur_src;
            shim_img.style.cssText = 'display: block; width: 100%; height: 100%; visibility: hidden!important; opacity: 0!important;';

            shim_wrapper.appendChild(shim_img);

            images[i].parentNode.replaceChild(shim_wrapper, images[i]);

            shim_wrapper = null;
            shim_img = null;
        }
        images = null;
    }
})(window, document);