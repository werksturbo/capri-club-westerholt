/* ==========================================================
   CCW – Fahrzeugseite
   ========================================================== */

(function () {
    "use strict";

    /* ----------------------------------------------------------
       Mobiles Menü / Dropdowns
       ---------------------------------------------------------- */

    const header = document.querySelector("header");
    const toggle = document.getElementById("mobileMenuToggle");
    const nav = document.getElementById("mainNavigation");

    if (header && toggle && nav) {

        function closeMobileMenu() {
            header.classList.remove("nav-open");
            toggle.setAttribute("aria-expanded", "false");
            toggle.setAttribute("aria-label", "Menü öffnen");
        }

        toggle.addEventListener("click", function (event) {
            event.stopPropagation();

            const open = header.classList.toggle("nav-open");

            toggle.setAttribute(
                "aria-expanded",
                open ? "true" : "false"
            );

            toggle.setAttribute(
                "aria-label",
                open ? "Menü schließen" : "Menü öffnen"
            );
        });

        const submenuItems =
            nav.querySelectorAll(".has-submenu");

        function closeAllSubmenus(except) {
            submenuItems.forEach(function (item) {

                if (item !== except) {
                    item.classList.remove("submenu-open");

                    const button =
                        item.querySelector(".submenu-toggle");

                    if (button) {
                        button.setAttribute(
                            "aria-expanded",
                            "false"
                        );
                    }
                }
            });
        }

        submenuItems.forEach(function (item) {

            const button =
                item.querySelector(".submenu-toggle");

            const submenu =
                item.querySelector(".submenu");

            if (!button || !submenu) {
                return;
            }

            button.addEventListener("click", function (event) {
                event.preventDefault();
                event.stopPropagation();

                const isOpen =
                    item.classList.contains("submenu-open");

                closeAllSubmenus(item);

                if (isOpen) {
                    item.classList.remove("submenu-open");
                    button.setAttribute("aria-expanded", "false");
                } else {
                    item.classList.add("submenu-open");
                    button.setAttribute("aria-expanded", "true");
                }
            });
        });

        nav.querySelectorAll("a").forEach(function (link) {
            link.addEventListener("click", function () {
                closeAllSubmenus();
                closeMobileMenu();
            });
        });

        document.addEventListener("click", function (event) {
            if (!header.contains(event.target)) {
                closeAllSubmenus();
                closeMobileMenu();
            }
        });

        document.addEventListener("keydown", function (event) {
            if (event.key === "Escape") {
                closeAllSubmenus();
                closeMobileMenu();
            }
        });

        window.addEventListener("resize", function () {
            if (window.innerWidth > 900) {
                closeMobileMenu();
            }
        });
    }

    /* ----------------------------------------------------------
       Fahrzeugdaten
       ---------------------------------------------------------- */

    const params = new URLSearchParams(window.location.search);
    const id = params.get("id") || "01";

    const titel = document.getElementById("fahrzeug-titel");
    const hauptbild = document.getElementById("hauptbild");
    const hauptbildLink = document.getElementById("hauptbild-link");
    const galerie = document.getElementById("galerie");
    const keineBilder = document.getElementById("keine-bilder");

    const felder = {
        typ: document.getElementById("typ"),
        baujahr: document.getElementById("baujahr"),
        motor: document.getElementById("motor"),
        eigentümer: document.getElementById("eigentümer"),
        sonstiges: document.getElementById("sonstiges"),
        geschichte: document.getElementById("geschichte")
    };

    async function ladeFahrzeug() {

        try {
            const response =
                await fetch("../json/fahrzeuge.json", {
                    cache: "no-store"
                });

            if (!response.ok) {
                throw new Error(
                    "fahrzeuge.json konnte nicht geladen werden."
                );
            }

            const fahrzeuge = await response.json();
            const fahrzeug = fahrzeuge[id];

            if (!fahrzeug) {
                throw new Error(
                    "Fahrzeug " + id + " wurde nicht gefunden."
                );
            }

            document.title =
                fahrzeug.titel +
                " | Capri Club Westerholt e.V.";

            titel.textContent = fahrzeug.titel;

            felder.typ.textContent =
                fahrzeug.typ || "";

            felder.baujahr.textContent =
                fahrzeug.baujahr || "";

            felder.motor.textContent =
                fahrzeug.motor || "";

            felder.eigentümer.textContent =
                fahrzeug.eigentümer || "";

            felder.sonstiges.textContent =
                fahrzeug.sonstiges || "";

            felder.geschichte.textContent =
                fahrzeug.geschichte || "";

            hauptbild.src =
                fahrzeug.hauptbild;

            hauptbild.alt =
                fahrzeug.titel;

            hauptbildLink.href =
                fahrzeug.hauptbild;

            /*
             * Vorbereitung für die vorhandene Lightbox.
             * Die endgültige Einbindung erfolgt, sobald die
             * vorhandene lightbox.js angeschlossen wird.
             */
            hauptbildLink.dataset.lightbox =
                "fahrzeug";

            const bilder =
                Array.isArray(fahrzeug.bilder)
                    ? fahrzeug.bilder
                    : [];

            galerie.innerHTML = "";

            if (bilder.length === 0) {

                keineBilder.hidden = false;

            } else {

                keineBilder.hidden = true;

                bilder.forEach(function (bild, index) {

                    const link =
                        document.createElement("a");

                    link.className =
                        "gallery-link";

                    link.href = bild;

                    link.dataset.lightbox =
                        "fahrzeug";

                    link.setAttribute(
                        "aria-label",
                        "Fahrzeugbild " + (index + 1)
                    );

                    const img =
                        document.createElement("img");

                    img.src = bild;

                    img.alt =
                        fahrzeug.titel +
                        " – Bild " +
                        (index + 1);

                    img.loading = "lazy";

                    link.appendChild(img);
                    galerie.appendChild(link);
                });
            }

        } catch (error) {

            console.error(error);

            titel.textContent =
                "Fahrzeug konnte nicht geladen werden";

            keineBilder.hidden = false;

            keineBilder.textContent =
                "Die Fahrzeugdaten konnten momentan nicht geladen werden.";
        }
    }

    ladeFahrzeug();

})();
