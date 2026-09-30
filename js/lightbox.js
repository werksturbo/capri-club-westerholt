/* =========================================================
   CCW LIGHTBOX
   Gemeinsame Lightbox für Fahrzeugseiten
   Ohne Download-Funktion
   ========================================================= */

(function () {
    "use strict";

    let bilder = [];
    let index = 0;
    let fahrzeugTitel = "";

    function createLightbox() {
        let box = document.getElementById("lightbox");

        if (box) return box;

        box = document.createElement("div");
        box.id = "lightbox";
        box.setAttribute("aria-hidden", "true");

        box.innerHTML = `
            <button id="closeLightbox" type="button"
                    aria-label="Lightbox schließen">&times;</button>

            <button id="prevImage" class="lightboxNav" type="button"
                    aria-label="Vorheriges Bild">&#10094;</button>

            <div id="lightboxLoader" aria-hidden="true"></div>

            <img id="lightboxImage" alt="" draggable="false">

            <button id="nextImage" class="lightboxNav" type="button"
                    aria-label="Nächstes Bild">&#10095;</button>

            <div id="lightboxInfo">
                <div><strong>Fahrzeug:</strong> <span id="lbStatus"></span></div>
                <div><strong>Bild:</strong> <span id="lbCounter"></span></div>
            </div>
        `;

        document.body.appendChild(box);
        return box;
    }

    function elements() {
        const box = createLightbox();

        return {
            box,
            image: document.getElementById("lightboxImage"),
            close: document.getElementById("closeLightbox"),
            prev: document.getElementById("prevImage"),
            next: document.getElementById("nextImage"),
            loader: document.getElementById("lightboxLoader"),
            status: document.getElementById("lbStatus"),
            counter: document.getElementById("lbCounter")
        };
    }

    function update() {
        const el = elements();

        if (!bilder.length) return;

        index = Math.max(0, Math.min(index, bilder.length - 1));

        const src = typeof bilder[index] === "string"
            ? bilder[index]
            : bilder[index].src;

        const nummer = typeof bilder[index] === "string"
            ? (index + 1)
            : bilder[index].nummer;

        el.loader.style.display = "block";
        el.image.style.display = "none";

        const image = new Image();

        image.onload = function () {
            el.image.src = src;
            el.image.alt = fahrzeugTitel + " – Bild " + nummer;
            el.loader.style.display = "none";
            el.image.style.display = "block";
        };

        image.onerror = function () {
            el.loader.style.display = "none";
            el.image.style.display = "none";
        };

        image.src = src;

        el.status.textContent = fahrzeugTitel || "Fahrzeug";
        el.counter.textContent =
            "Bild " + String(nummer).padStart(2, "0") +
            " von " + bilder.length;

        const sichtbar = bilder.length > 1 ? "flex" : "none";
        el.prev.style.display = sichtbar;
        el.next.style.display = sichtbar;
    }

    function open(list, startIndex, title) {
        bilder = Array.isArray(list) ? list.slice() : [];
        index = Number.isInteger(startIndex) ? startIndex : 0;
        fahrzeugTitel = title || "";

        if (!bilder.length) return;

        const el = elements();

        el.box.classList.add("show");
        el.box.setAttribute("aria-hidden", "false");
        document.body.classList.add("lightbox-open");

        update();
    }

    function close() {
        const el = elements();

        el.box.classList.remove("show");
        el.box.setAttribute("aria-hidden", "true");
        document.body.classList.remove("lightbox-open");

        el.image.removeAttribute("src");
        el.image.alt = "";

        bilder = [];
        index = 0;
    }

    function previous() {
        if (bilder.length < 2) return;
        index = (index - 1 + bilder.length) % bilder.length;
        update();
    }

    function next() {
        if (bilder.length < 2) return;
        index = (index + 1) % bilder.length;
        update();
    }

    function init() {
        const el = elements();

        el.close.addEventListener("click", close);
        el.prev.addEventListener("click", previous);
        el.next.addEventListener("click", next);

        el.box.addEventListener("click", function (event) {
            if (event.target === el.box) close();
        });

        document.addEventListener("keydown", function (event) {
            if (!el.box.classList.contains("show")) return;

            if (event.key === "Escape") {
                event.preventDefault();
                close();
            } else if (event.key === "ArrowLeft") {
                event.preventDefault();
                previous();
            } else if (event.key === "ArrowRight") {
                event.preventDefault();
                next();
            }
        });
    }

    window.Lightbox = {
        open,
        close,
        previous,
        next
    };

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }

})();
