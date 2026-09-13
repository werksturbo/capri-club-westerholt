/* =========================================================
   CCW LIGHTBOX
   Zentrale Bildanzeige für alle CCW-Seiten
   ========================================================= */

(function () {
    "use strict";

    let items = [];
    let currentIndex = 0;
    let touchStartX = 0;
    let touchStartY = 0;


    /* ---------------------------------------------------------
       Lightbox erzeugen
       --------------------------------------------------------- */

    const lightbox = document.createElement("div");

    lightbox.className = "ccw-lightbox";
    lightbox.setAttribute("aria-hidden", "true");

    lightbox.innerHTML = `
        <div class="ccw-lightbox-content"
             role="dialog"
             aria-modal="true"
             aria-label="Bildansicht">

            <button class="ccw-lightbox-close"
                    type="button"
                    aria-label="Bildansicht schließen">×</button>

            <button class="ccw-lightbox-prev"
                    type="button"
                    aria-label="Vorheriges Bild">‹</button>

            <img class="ccw-lightbox-image" alt="">

            <button class="ccw-lightbox-next"
                    type="button"
                    aria-label="Nächstes Bild">›</button>

            <div class="ccw-lightbox-counter"></div>

            <div class="ccw-lightbox-caption"></div>

        </div>
    `;


    document.body.appendChild(lightbox);


    const image =
        lightbox.querySelector(".ccw-lightbox-image");

    const closeButton =
        lightbox.querySelector(".ccw-lightbox-close");

    const prevButton =
        lightbox.querySelector(".ccw-lightbox-prev");

    const nextButton =
        lightbox.querySelector(".ccw-lightbox-next");

    const counter =
        lightbox.querySelector(".ccw-lightbox-counter");

    const caption =
        lightbox.querySelector(".ccw-lightbox-caption");


    /* ---------------------------------------------------------
       Hilfsfunktion:
       Link innerhalb des angeklickten Elements finden
       --------------------------------------------------------- */

    function getAnchor(element) {

        if (!element) {
            return null;
        }

        if (element.matches("a")) {
            return element;
        }

        return element.querySelector("a");
    }


    /* ---------------------------------------------------------
       Galerie bestimmen
       --------------------------------------------------------- */

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
         *
         * Alle Bilder derselben Gruppe gehören
         * automatisch zusammen.
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
         * Auf der Werbung-Seite bildet jeder
         * .werbung-bereich eine eigene Galerie.
         */

        const section =
            wrapper.closest(".werbung-bereich");


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
         * Einzelnes Bild
         */

        return [
            getAnchor(wrapper)
        ].filter(Boolean);
    }


    /* ---------------------------------------------------------
       Navigation aktualisieren
       --------------------------------------------------------- */

    function updateNavigation() {

        const multiple =
            items.length > 1;


        prevButton.style.display =
            multiple ? "flex" : "none";


        nextButton.style.display =
            multiple ? "flex" : "none";


        counter.textContent =
            multiple
                ? `${currentIndex + 1} / ${items.length}`
                : "";
    }


    /* ---------------------------------------------------------
       Bild anzeigen
       --------------------------------------------------------- */

    function showImage(index) {

        if (!items.length) {
            return;
        }


        currentIndex =
            (index + items.length) %
            items.length;


        const link =
            items[currentIndex];


        const thumbnailImage =
            link.querySelector("img");


        /*
         * Hier wird das ORIGINALBILD geladen.
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


    /* ---------------------------------------------------------
       Lightbox öffnen
       --------------------------------------------------------- */

    function openLightbox(clickedElement) {

        items =
            getGalleryItems(clickedElement);


        const clickedAnchor =
            getAnchor(clickedElement);


        if (
            !items.length ||
            !clickedAnchor
        ) {
            return;
        }


        currentIndex =
            items.indexOf(clickedAnchor);


        if (currentIndex < 0) {
            currentIndex = 0;
        }


        showImage(currentIndex);


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


    /* ---------------------------------------------------------
       Lightbox schließen
       --------------------------------------------------------- */

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


        items = [];


        currentIndex = 0;
    }


    /* ---------------------------------------------------------
       Vorheriges Bild
       --------------------------------------------------------- */

    function previousImage() {

        if (items.length > 1) {

            showImage(
                currentIndex - 1
            );
        }
    }


    /* ---------------------------------------------------------
       Nächstes Bild
       --------------------------------------------------------- */

    function nextImage() {

        if (items.length > 1) {

            showImage(
                currentIndex + 1
            );
        }
    }


    /* =========================================================
       BILDER ÖFFNEN

       WICHTIG:

       Der Event-Handler läuft in der CAPTURE-PHASE.

       Dadurch wird der Klick abgefangen,
       BEVOR der normale Link mit

           target="_blank"

       ausgeführt werden kann.
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
                getAnchor(trigger);


            if (!anchor) {
                return;
            }


            /*
             * Normale Link-Aktion verhindern.
             */

            event.preventDefault();


            event.stopPropagation();


            /*
             * Lightbox öffnen.
             */

            openLightbox(trigger);

        },
        true
    );


    /* ---------------------------------------------------------
       Schließen-Button
       --------------------------------------------------------- */

    closeButton.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            event.stopPropagation();

            closeLightbox();
        }
    );


    /* ---------------------------------------------------------
       Vorheriger Button
       --------------------------------------------------------- */

    prevButton.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            event.stopPropagation();

            previousImage();
        }
    );


    /* ---------------------------------------------------------
       Nächster Button
       --------------------------------------------------------- */

    nextButton.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            event.stopPropagation();

            nextImage();
        }
    );


    /* ---------------------------------------------------------
       Klick auf dunklen Hintergrund
       --------------------------------------------------------- */

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
       TASTATURSTEUERUNG
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
             * ESC = schließen
             */

            if (
                event.key === "Escape"
            ) {

                event.preventDefault();

                closeLightbox();
            }


            /*
             * Pfeil links
             */

            if (
                event.key === "ArrowLeft"
            ) {

                event.preventDefault();

                previousImage();
            }


            /*
             * Pfeil rechts
             */

            if (
                event.key === "ArrowRight"
            ) {

                event.preventDefault();

                nextImage();
            }

        }
    );


    /* =========================================================
       SMARTPHONE – WISCHGESTEN
       ========================================================= */

    lightbox.addEventListener(
        "touchstart",
        function (event) {

            if (
                !event.touches.length
            ) {
                return;
            }


            touchStartX =
                event.touches[0].clientX;


            touchStartY =
                event.touches[0].clientY;

        },
        {
            passive: true
        }
    );


    lightbox.addEventListener(
        "touchend",
        function (event) {

            if (
                !event.changedTouches.length
            ) {
                return;
            }


            const touchEndX =
                event.changedTouches[0].clientX;


            const touchEndY =
                event.changedTouches[0].clientY;


            const deltaX =
                touchEndX -
                touchStartX;


            const deltaY =
                touchEndY -
                touchStartY;


            /*
             * Nur deutlich horizontale
             * Wischbewegungen berücksichtigen.
             */

            if (
                Math.abs(deltaX) < 50 ||
                Math.abs(deltaX) <=
                Math.abs(deltaY)
            ) {
                return;
            }


            if (deltaX < 0) {

                nextImage();

            } else {

                previousImage();
            }

        },
        {
            passive: true
        }
    );

})();
