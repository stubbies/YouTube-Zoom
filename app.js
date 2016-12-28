/*!
 * YTZoom.js 0.1
 * http://errvald.github.io
 * MIT licensed
 */


var YTZoom = (function() {
   
    var 
    rendered       = false,
    zoom_level     = 2,
    zoomEl         = null, 
    zoomWrapper    = null,
    videoEl        = null,
    currentUrl     = null,
    zoomWrapperEvn = null,
    zoomElEvn      = null
    ;

    return {
        init: function () {

            chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {

                if (!rendered) {

                    currentUrl = request.data.url;
                    var pos = currentUrl.search("watch");

                    if (pos !== -1) {
                        rendered = true;
                        renderElements();
                        zoom_events();
                    }

                }

            });


        }
    }

    function renderElements(){

        videoEl = document.getElementsByClassName("html5-video-container")[0];

        // Zoom button
        var icon = `<svg width="100%" height="100%" viewBox="0 0 512 512">
        <path class="zoomBtn__zoom-in" d="M497.913,497.914c-18.782,18.781-49.226,18.781-68.008,0l-84.862-84.864c-34.89,22.366-76.131,35.718-120.66,35.718  C100.468,448.768,0,348.314,0,224.384C0,100.454,100.468,0,224.383,0c123.931,0,224.384,100.453,224.384,224.384  c0,44.529-13.353,85.771-35.718,120.675l84.863,84.849C516.695,448.689,516.695,479.131,497.913,497.914z M224.383,64.11  c-88.511,0-160.274,71.763-160.274,160.274c0,88.526,71.764,160.274,160.274,160.274c88.526,0,160.273-71.748,160.273-160.274  C384.656,135.873,312.909,64.11,224.383,64.11z M256.438,320.548h-64.108v-64.109H128.22V192.33h64.109v-64.11h64.108v64.11h64.11  v64.109h-64.11V320.548z"/>
        <path class="zoomBtn__zoom-out" d="M497.913,429.906l-84.863-84.848c22.365-34.903,35.718-76.146,35.718-120.676C448.768,100.453,348.314,0,224.383,0    C100.468,0,0,100.453,0,224.384s100.468,224.384,224.383,224.384c44.529,0,85.771-13.352,120.66-35.718l84.862,84.864    c18.782,18.781,49.226,18.781,68.008,0C516.695,479.131,516.695,448.689,497.913,429.906z M224.383,384.658    c-88.511,0-160.274-71.748-160.274-160.274c0-88.511,71.764-160.274,160.274-160.274c88.526,0,160.273,71.763,160.273,160.274    C384.656,312.91,312.909,384.658,224.383,384.658z M128.219,256.438h192.329v-64.109H128.219V256.438z"/>
        </svg>`;
        
        zoomEl = document.createElement("button");
        zoomEl.classList.add("ytp-subtitles-button","ytp-button","zoomBtn");
        zoomEl.title = "Zoom Video";
        zoomEl.innerHTML = icon;

        var controls = document.getElementsByClassName('ytp-right-controls')[0];
        controls.insertBefore(zoomEl, controls.firstChild);

        // Zoom video wrapper
        zoomWrapper = document.createElement("div");
        zoomWrapper.classList.add("zoomWrapper");

        var videoWrapper = document.getElementsByClassName('html5-video-player')[0];
        videoWrapper.insertAdjacentElement('beforeend', zoomWrapper);

    }

    function zoom_events(){

        var 
        status = false,
        zoomed = false,
        opts = {};

        zoomWrapperEvn = function(e){

            zoomed = !zoomed;

            if(!zoomed) return zoomOut();

            var bounds = zoomWrapper.getBoundingClientRect();

            opts.translateX = e.offsetX - (bounds.width/2);
            opts.translateY = e.offsetY;

            videoEl.style.transform = 'translate('+ -opts.translateX +'px,'+ -e.offsetY +'px) scale('+ zoom_level +')';
            zoomWrapper.classList.add("zoomWrapper--zoomed");

        };

        zoomElEvn = function () {
            status = !status;

            zoomEl.classList.toggle("zoomBtn--zoomed");
            zoomWrapper.classList.toggle("zoomWrapper--active");

            if (status) {
                zoomWrapper.addEventListener('click', zoomWrapperEvn);
            } else {
                zoomOut();
            }
        }

        zoomEl.addEventListener('click', zoomElEvn);

        function zoomOut(){
            status = false;
            zoomed = false;
            videoEl.style.transform = "";
            zoomWrapper.classList.remove("zoomWrapper--active","zoomWrapper--zoomed");
            zoomEl.classList.remove("zoomBtn--zoomed");
            zoomWrapper.removeEventListener('click', zoomWrapperEvn);
        }

    }

})();

YTZoom.init();