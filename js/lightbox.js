/* =========================================================
   CCW LIGHTBOX
   Zentrale Bildanzeige mit Zoom und einfachem Kopierschutz
   ========================================================= */

(function () {

    "use strict";


    /* =========================================================
       GRUNDEINSTELLUNGEN
       ========================================================= */

    let items = [];
    let currentIndex = 0;

    let zoomLevel = 1;

    const zoomStep = 0.5;
    const minZoom = 1;
    const maxZoom = 4;

    let panX = 0;
    let panY = 0;

    let dragging = false;

    let dragStartX = 0;
    let dragStartY = 0;

    let startPanX = 0;
    let startPanY = 0;

    let touchStartX = 0;
    let touchStartY = 0;

    let touchStartTime = 0;

    let pinchStartDistance = 0;
    let pinchStartZoom = 1;


    /* =========================================================
       LIGHTBOX ERZEUGEN
       ========================================================= */

    const lightbox =
        document.createElement("div");

    lightbox.className =
        "ccw-lightbox";

    lightbox.setAttribute(
        "aria-hidden",
        "true"
    );


    lightbox.innerHTML = `

        <div class="ccw-lightbox-content"
             role="dialog"
             aria-modal="true"
             aria-label="Bildansicht">


            <!-- Schließen -->

            <button
                class="ccw-lightbox-close"
                type="button"
                aria-label="Bildansicht schließen">

                ×

            </button>


            <!-- Vorheriges Bild -->

            <button
                class="ccw-lightbox-prev"
                type="button"
                aria-label="Vorheriges Bild">

                ‹

            </button>


            <!-- Bild -->

            <div class="ccw-lightbox-image-wrap">

                <img
                    class="ccw-lightbox-image"
                    alt=""
                    draggable="false">

            </div>


            <!-- Nächstes Bild -->

            <button
                class="ccw-lightbox-next"
                type="button"
                aria-label="Nächstes Bild">

                ›

            </button>


            <!-- Bildzähler -->

            <div class="ccw-lightbox-counter"></div>


            <!-- Zoom -->

            <div
                class="ccw-lightbox-zoom"
                aria-label="Zoom-Steuerung">


                <button
                    class="ccw-lightbox-zoom-out"
                    type="button"
                    aria-label="Verkleinern">

                    −

                </button>


                <div
                    class="ccw-lightbox-zoom-level">

                    100 %

                </div>


                <button
                    class="ccw-lightbox-zoom-in"
                    type="button"
                    aria-label="Vergrößern">

                    +

                </button>


                <button
                    class="ccw-lightbox-zoom-reset"
                    type="button"
                    aria-label="Zoom zurücksetzen">

                    100 %

                </button>

            </div>


            <!-- Bildbeschriftung -->

            <div
                class="ccw-lightbox-caption">
            </div>


        </div>
    `;


    document.body.appendChild(
        lightbox
    );


    /* =========================================================
       ELEMENTE
       ========================================================= */

    const image =
        lightbox.querySelector(
            ".ccw-lightbox-image"
        );

    const imageWrap =
        lightbox.querySelector(
            ".ccw-lightbox-image-wrap"
        );

    const closeButton =
        lightbox.querySelector(
            ".ccw-lightbox-close"
        );

    const prevButton =
        lightbox.querySelector(
            ".ccw-lightbox-prev"
        );

    const nextButton =
        lightbox.querySelector(
            ".ccw-lightbox-next"
        );

    const zoomOutButton =
        lightbox.querySelector(
            ".ccw-lightbox-zoom-out"
        );

    const zoomInButton =
        lightbox.querySelector(
            ".ccw-lightbox-zoom-in"
        );

    const zoomResetButton =
        lightbox.querySelector(
            ".ccw-lightbox-zoom-reset"
        );

    const zoomLevelDisplay =
        lightbox.querySelector(
            ".ccw-lightbox-zoom-level"
        );

    const counter =
        lightbox.querySelector(
            ".ccw-lightbox-counter"
        );

    const caption =
        lightbox.querySelector(
            ".ccw-lightbox-caption"
        );


    /* =========================================================
       LINK AUS ELEMENT ERMITTELN
       ========================================================= */

    function getAnchor(element) {

        if (!element) {
            return null;
        }


        if (element.matches("a")) {
            return element;
        }


        return element.querySelector("a");
    }


    /* =========================================================
       GALERIE ERMITTELN
       ========================================================= */

    function getGalleryItems(clickedElement) {

        const wrapper =
            clickedElement.closest(
                ".werbung-thumbnail, a.lightbox"
            );


        if (!wrapper) {
            return [];
        }


        /*
         * Zukünftige Möglichkeit:
         *
         * data-lightbox-group="name"
         */

        const group =
            wrapper.getAttribute(
                "data-lightbox-group"
            );


        if (group) {

            return Array.from(
                document.querySelectorAll(
                    '[data-lightbox-group="' +
                    CSS.escape(group) +
                    '"]'
                )
            )
            .map(getAnchor)
            .filter(Boolean);
        }


        /*
         * Werbung:
         * Jeder .werbung-bereich
         * ist eine eigene Galerie.
         */

        const section =
            wrapper.closest(
                ".werbung-bereich"
            );


        if (section) {

            return Array.from(
                section.querySelectorAll(
                    ".werbung-thumbnail"
                )
            )
            .map(getAnchor)
            .filter(Boolean);
        }


        /*
         * Einzelbild
         */

        return [
            getAnchor(wrapper)
        ].filter(Boolean);
    }


    /* =========================================================
       ZOOM
       ========================================================= */

    function updateZoomDisplay() {

        const percent =
            Math.round(
                zoomLevel * 100
            );


        zoomLevelDisplay.textContent =
            percent + " %";


        zoomOutButton.disabled =
            zoomLevel <= minZoom;


        zoomInButton.disabled =
            zoomLevel >= maxZoom;


        image.classList.toggle(
            "is-zoomed",
            zoomLevel > 1
        );


        image.style.transform =
            "translate(" +
            panX +
            "px, " +
            panY +
            "px) scale(" +
            zoomLevel +
            ")";
    }


    function resetZoom() {

        zoomLevel = 1;

        panX = 0;
        panY = 0;

        updateZoomDisplay();
    }


    function setZoom(newZoom) {

        zoomLevel =
            Math.max(
                minZoom,
                Math.min(
                    maxZoom,
                    newZoom
                )
            );


        if (zoomLevel === 1) {

            panX = 0;
            panY = 0;
        }


        updateZoomDisplay();
    }


    function zoomIn() {

        setZoom(
            zoomLevel + zoomStep
        );
    }


    function zoomOut() {

        setZoom(
            zoomLevel - zoomStep
        );
    }


    /* =========================================================
       NAVIGATION
       ========================================================= */

    function updateNavigation() {

        const multiple =
            items.length > 1;


        prevButton.style.display =
            multiple
                ? "flex"
                : "none";


        nextButton.style.display =
            multiple
                ? "flex"
                : "none";


        counter.textContent =
            multiple
                ? `${currentIndex + 1} / ${items.length}`
                : "";
    }


    /* =========================================================
       BILD ANZEIGEN
       ========================================================= */

    function showImage(index) {

        if (!items.length) {
            return;
        }


        currentIndex =
            (
                index +
                items.length
            ) %
            items.length;


        const link =
            items[currentIndex];


        const thumbnailImage =
            link.querySelector(
                "img"
            );


        /*
         * Beim Bildwechsel
         * Zoom zurücksetzen.
         */

        resetZoom();


        /*
         * Originalbild laden
         */

        image.src =
            link.href;


        image.alt =
            thumbnailImage
                ? thumbnailImage.alt
                : "";


        caption.textContent =
            thumbnailImage
                ? thumbnailImage.alt
                : "";


        updateNavigation();
    }


    /* =========================================================
       LIGHTBOX ÖFFNEN
       ========================================================= */

    function openLightbox(clickedElement) {

        items =
            getGalleryItems(
                clickedElement
            );


        const clickedAnchor =
            getAnchor(
                clickedElement
            );


        if (
            !items.length ||
            !clickedAnchor
        ) {
            return;
        }


        currentIndex =
            items.indexOf(
                clickedAnchor
            );


        if (
            currentIndex < 0
        ) {
            currentIndex = 0;
        }


        showImage(
            currentIndex
        );


        lightbox.classList.add(
            "is-open"
        );


        lightbox.setAttribute(
            "aria-hidden",
            "false"
        );


        document.body.classList.add(
            "ccw-lightbox-open"
        );


        closeButton.focus();
    }


    /* =========================================================
       LIGHTBOX SCHLIESSEN
       ========================================================= */

    function closeLightbox() {

        lightbox.classList.remove(
            "is-open"
        );


        lightbox.setAttribute(
            "aria-hidden",
            "true"
        );


        document.body.classList.remove(
            "ccw-lightbox-open"
        );


        image.removeAttribute(
            "src"
        );


        image.alt = "";


        caption.textContent = "";


        counter.textContent = "";


        resetZoom();


        items = [];

        currentIndex = 0;
    }


    /* =========================================================
       VORHERIGES / NÄCHSTES BILD
       ========================================================= */

    function previousImage() {

        if (
            items.length > 1
        ) {

            showImage(
                currentIndex - 1
            );
        }
    }


    function nextImage() {

        if (
            items.length > 1
        ) {

            showImage(
                currentIndex + 1
            );
        }
    }


    /* =========================================================
       BILDER ÖFFNEN

       Capture-Phase verhindert target="_blank"
       ========================================================= */

    document.addEventListener(
        "click",
        function (event) {

            const trigger =
                event.target.closest(
                    ".werbung-thumbnail, a.lightbox"
                );


            if (!trigger) {
                return;
            }


            const anchor =
                getAnchor(
                    trigger
                );


            if (!anchor) {
                return;
            }


            event.preventDefault();

            event.stopPropagation();


            openLightbox(
                trigger
            );

        },
        true
    );


    /* =========================================================
       BUTTONS
       ========================================================= */

    closeButton.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            event.stopPropagation();

            closeLightbox();
        }
    );


    prevButton.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            event.stopPropagation();

            previousImage();
        }
    );


    nextButton.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            event.stopPropagation();

            nextImage();
        }
    );


    zoomInButton.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            event.stopPropagation();

            zoomIn();
        }
    );


    zoomOutButton.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            event.stopPropagation();

            zoomOut();
        }
    );


    zoomResetButton.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            event.stopPropagation();

            resetZoom();
        }
    );


    /* =========================================================
       KOPIERSCHUTZ
       ========================================================= */


    /*
     * Rechtsklick innerhalb der Lightbox verhindern.
     */

    lightbox.addEventListener(
        "contextmenu",
        function (event) {

            event.preventDefault();
            event.stopPropagation();

        }
    );


    /*
     * Direktes Ziehen des Bildes verhindern.
     */

    lightbox.addEventListener(
        "dragstart",
        function (event) {

            event.preventDefault();
            event.stopPropagation();

        }
    );


    /*
     * Markieren / Kopieren des Bildes verhindern.
     */

    image.addEventListener(
        "selectstart",
        function (event) {

            event.preventDefault();

        }
    );


    /*
     * Zusätzliche Sicherheit für das eigentliche
     * Bild.
     */

    image.addEventListener(
        "contextmenu",
        function (event) {

            event.preventDefault();

        }
    );


    image.addEventListener(
        "dragstart",
        function (event) {

            event.preventDefault();

        }
    );


    /*
     * Browser-Gesten bzw. Speichern über
     * bestimmte Mausaktionen erschweren.
     */

    image.addEventListener(
        "mousedown",
        function (event) {

            /*
             * Mittlere Maustaste / Sonderfälle
             * nicht als Link öffnen lassen.
             */

            if (
                event.button !== 0
            ) {

                event.preventDefault();
            }

        }
    );


    /* =========================================================
       HINTERGRUND KLICK
       ========================================================= */

    lightbox.addEventListener(
        "click",
        function (event) {

            if (
                event.target === lightbox
            ) {

                closeLightbox();
            }
        }
    );


    /* =========================================================
       MAUSRAD = ZOOM
       ========================================================= */

    imageWrap.addEventListener(
        "wheel",
        function (event) {

            event.preventDefault();


            if (
                event.deltaY < 0
            ) {

                zoomIn();

            } else {

                zoomOut();
            }

        },
        {
            passive: false
        }
    );


    /* =========================================================
       MAUS:
       VERGRÖSSERTES BILD VERSCHIEBEN
       ========================================================= */

    imageWrap.addEventListener(
        "mousedown",
        function (event) {

            if (
                zoomLevel <= 1
            ) {
                return;
            }


            dragging = true;


            imageWrap.classList.add(
                "is-dragging"
            );


            dragStartX =
                event.clientX;


            dragStartY =
                event.clientY;


            startPanX =
                panX;


            startPanY =
                panY;


            event.preventDefault();
        }
    );


    document.addEventListener(
        "mousemove",
        function (event) {

            if (!dragging) {
                return;
            }


            panX =
                startPanX +
                (
                    event.clientX -
                    dragStartX
                );


            panY =
                startPanY +
                (
                    event.clientY -
                    dragStartY
                );


            updateZoomDisplay();
        }
    );


    document.addEventListener(
        "mouseup",
        function () {

            dragging = false;


            imageWrap.classList.remove(
                "is-dragging"
            );
        }
    );


    /* =========================================================
       DOPPELKLICK
       100 % <-> 200 %
       ========================================================= */

    imageWrap.addEventListener(
        "dblclick",
        function (event) {

            event.preventDefault();


            if (
                zoomLevel > 1
            ) {

                resetZoom();

            } else {

                setZoom(2);
            }
        }
    );


    /* =========================================================
       TOUCH START
       ========================================================= */

    imageWrap.addEventListener(
        "touchstart",
        function (event) {

            if (
                event.touches.length === 1
            ) {

                touchStartX =
                    event.touches[0].clientX;


                touchStartY =
                    event.touches[0].clientY;


                touchStartTime =
                    Date.now();


                if (
                    zoomLevel > 1
                ) {

                    dragging = true;


                    dragStartX =
                        touchStartX;


                    dragStartY =
                        touchStartY;


                    startPanX =
                        panX;


                    startPanY =
                        panY;
                }
            }


            /*
             * Zwei Finger = Pinch-Zoom
             */

            if (
                event.touches.length === 2
            ) {

                dragging = false;


                const dx =
                    event.touches[1].clientX -
                    event.touches[0].clientX;


                const dy =
                    event.touches[1].clientY -
                    event.touches[0].clientY;


                pinchStartDistance =
                    Math.hypot(
                        dx,
                        dy
                    );


                pinchStartZoom =
                    zoomLevel;
            }

        },
        {
            passive: true
        }
    );


    /* =========================================================
       TOUCH MOVE
       ========================================================= */

    imageWrap.addEventListener(
        "touchmove",
        function (event) {

            /*
             * Pinch-Zoom
             */

            if (
                event.touches.length === 2
            ) {

                event.preventDefault();


                const dx =
                    event.touches[1].clientX -
                    event.touches[0].clientX;


                const dy =
                    event.touches[1].clientY -
                    event.touches[0].clientY;


                const distance =
                    Math.hypot(
                        dx,
                        dy
                    );


                if (
                    pinchStartDistance > 0
                ) {

                    const factor =
                        distance /
                        pinchStartDistance;


                    setZoom(
                        pinchStartZoom *
                        factor
                    );
                }


                return;
            }


            /*
             * Vergrößertes Bild verschieben
             */

            if (
                event.touches.length === 1 &&
                dragging &&
                zoomLevel > 1
            ) {

                event.preventDefault();


                panX =
                    startPanX +
                    (
                        event.touches[0].clientX -
                        dragStartX
                    );


                panY =
                    startPanY +
                    (
                        event.touches[0].clientY -
                        dragStartY
                    );


                updateZoomDisplay();
            }

        },
        {
            passive: false
        }
    );


    /* =========================================================
       TOUCH END
       ========================================================= */

    imageWrap.addEventListener(
        "touchend",
        function (event) {

            if (
                event.touches.length !== 0
            ) {
                return;
            }


            dragging = false;

            pinchStartDistance = 0;


            if (
                !event.changedTouches.length
            ) {
                return;
            }


            const endX =
                event.changedTouches[0].clientX;


            const endY =
                event.changedTouches[0].clientY;


            const deltaX =
                endX -
                touchStartX;


            const deltaY =
                endY -
                touchStartY;


            const duration =
                Date.now() -
                touchStartTime;


            /*
             * Wischen nur bei 100 %
             */

            if (
                zoomLevel === 1 &&
                duration < 600 &&
                Math.abs(deltaX) > 50 &&
                Math.abs(deltaX) >
                Math.abs(deltaY)
            ) {

                if (
                    deltaX < 0
                ) {

                    nextImage();

                } else {

                    previousImage();
                }
            }

        },
        {
            passive: true
        }
    );


    /* =========================================================
       TASTATUR
       ========================================================= */

    document.addEventListener(
        "keydown",
        function (event) {

            if (
                !lightbox.classList.contains(
                    "is-open"
                )
            ) {
                return;
            }


            /*
             * ESC
             */

            if (
                event.key === "Escape"
            ) {

                event.preventDefault();

                closeLightbox();

                return;
            }


            /*
             * Pfeil links
             */

            if (
                event.key === "ArrowLeft"
            ) {

                event.preventDefault();

                previousImage();

                return;
            }


            /*
             * Pfeil rechts
             */

            if (
                event.key === "ArrowRight"
            ) {

                event.preventDefault();

                nextImage();

                return;
            }


            /*
             * +
             */

            if (
                event.key === "+" ||
                event.key === "="
            ) {

                event.preventDefault();

                zoomIn();

                return;
            }


            /*
             * -
             */

            if (
                event.key === "-"
            ) {

                event.preventDefault();

                zoomOut();

                return;
            }


            /*
             * 0 = 100 %
             */

            if (
                event.key === "0"
            ) {

                event.preventDefault();

                resetZoom();
            }

        }
    );

})();
