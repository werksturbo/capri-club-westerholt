/* ==========================================
   CCW POPUP - TEILEMARKT
   Zentrale, seitenunabhängige Popup-Funktion
   ========================================== */

(function () {

    "use strict";


    /* =========================================================
       PFAD ZUM SCRIPT ERMITTELN
       Dadurch funktioniert das Popup sowohl auf index.html
       als auch auf Seiten im Ordner /pages/.
       ========================================================= */

    const scriptElement = document.currentScript;

    const scriptUrl = scriptElement
        ? new URL(scriptElement.src, document.baseURI)
        : new URL("js/popups.js", document.baseURI);


    /*
     * popups.js liegt in /js/
     *
     * Von dort aus:
     *
     * ../popups/popup-teilemarkt.html
     * ../css/teilemarkt.css
     */

    const popupDatei =
        new URL(
            "../popups/popup-teilemarkt.html",
            scriptUrl
        ).href;

    const popupCssDatei =
        new URL(
            "../css/teilemarkt.css",
            scriptUrl
        ).href;


    let popupGeladen = false;
    let cssGeladen = false;


    /* =========================================================
       TEILEMARKT-CSS AUTOMATISCH LADEN
       ========================================================= */

    function ladePopupCSS() {

        if (cssGeladen) {
            return;
        }


        /*
         * Prüfen, ob die CSS-Datei bereits auf der Seite
         * eingebunden ist.
         */

        const bereitsVorhanden =
            Array.from(
                document.querySelectorAll(
                    'link[rel="stylesheet"]'
                )
            ).some(
                function (link) {

                    return (
                        link.href === popupCssDatei
                    );

                }
            );


        if (!bereitsVorhanden) {

            const link =
                document.createElement("link");


            link.rel =
                "stylesheet";


            link.href =
                popupCssDatei;


            link.setAttribute(
                "data-ccw-teilemarkt-css",
                "true"
            );


            document.head.appendChild(link);
        }


        cssGeladen = true;
    }


    /* =========================================================
       POPUP ÖFFNEN
       ========================================================= */

    window.openTeilemarktPopup =
        async function () {

            /*
             * CSS sicherheitshalber zuerst laden.
             */

            ladePopupCSS();


            /* -------------------------------------------------
               Popup beim ersten Aufruf laden
               ------------------------------------------------- */

            if (!popupGeladen) {

                try {

                    const antwort =
                        await fetch(
                            popupDatei,
                            {
                                cache: "no-cache"
                            }
                        );


                    if (!antwort.ok) {

                        throw new Error(
                            "Popup konnte nicht geladen werden. " +
                            "HTTP-Status: " +
                            antwort.status +
                            " – " +
                            popupDatei
                        );

                    }


                    const html =
                        await antwort.text();


                    if (!html.trim()) {

                        throw new Error(
                            "Die Popup-Datei ist leer: " +
                            popupDatei
                        );
                    }


                    const container =
                        document.createElement("div");


                    container.id =
                        "teilemarktPopupContainer";


                    container.innerHTML =
                        html;


                    document.body.appendChild(
                        container
                    );


                    popupGeladen =
                        true;


                    setupTeilemarktPopup();


                } catch (fehler) {

                    console.error(
                        "CCW Teilemarkt-Popup:",
                        fehler
                    );


                    alert(
                        "Die Anmeldung zum Teilemarkt " +
                        "konnte nicht geladen werden."
                    );


                    return;
                }
            }


            /* -------------------------------------------------
               Popup sichtbar machen
               ------------------------------------------------- */

            const popup =
                document.getElementById(
                    "teilemarktPopup"
                );


            if (!popup) {

                console.error(
                    "CCW Teilemarkt-Popup: " +
                    "Element #teilemarktPopup wurde nicht gefunden."
                );


                return;
            }


            popup.classList.add(
                "aktiv"
            );


            popup.setAttribute(
                "aria-hidden",
                "false"
            );


            document.body.style.overflow =
                "hidden";


            const name =
                document.getElementById(
                    "teilemarktName"
                );


            if (name) {

                setTimeout(
                    function () {
                        name.focus();
                    },
                    100
                );
            }
        };


    /* =========================================================
       POPUP SCHLIESSEN
       ========================================================= */

    window.closeTeilemarktPopup =
        function () {

            const popup =
                document.getElementById(
                    "teilemarktPopup"
                );


            if (popup) {

                popup.classList.remove(
                    "aktiv"
                );


                popup.setAttribute(
                    "aria-hidden",
                    "true"
                );
            }


            document.body.style.overflow =
                "";
        };


    /* =========================================================
       POPUP EINMALIG EINRICHTEN
       ========================================================= */

    function setupTeilemarktPopup() {

        const popup =
            document.getElementById(
                "teilemarktPopup"
            );


        if (!popup) {
            return;
        }


        /*
         * Klick auf den dunklen Hintergrund
         */

        popup.addEventListener(
            "click",
            function (event) {

                if (
                    event.target === popup
                ) {

                    closeTeilemarktPopup();
                }

            }
        );


        /*
         * Formular
         */

        const form =
            document.getElementById(
                "teilemarktForm"
            );


        if (form) {

            form.addEventListener(
                "submit",
                function (event) {

                    event.preventDefault();


                    /*
                     * Hier kommt später der tatsächliche
                     * Versand des Formulars hinein.
                     */

                    alert(
                        "Vielen Dank für Deine Anmeldung " +
                        "zum Capri-Teilemarkt!"
                    );

                }
            );
        }
    }


    /* =========================================================
       ESC = POPUP SCHLIESSEN
       ========================================================= */

    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Escape"
            ) {

                closeTeilemarktPopup();
            }

        }
    );


})();/* ==========================================
   CCW POPUP - TEILEMARKT
   Lädt das Popup einmalig in jede Seite.
   ========================================== */

(function () {

    /*
     * Die termine.html liegt im Ordner /pages.
     * Von dort aus liegt das Popup unter:
     *
     * ../popups/popup-teilemarkt.html
     *
     * Die Datei popups.js selbst liegt unter /js.
     */
    const popupDatei = "../popups/popup-teilemarkt.html";

    let popupGeladen = false;


    /* ==========================================
       POPUP ÖFFNEN
       ========================================== */

    window.openTeilemarktPopup = async function () {

        /*
         * Popup beim ersten Aufruf laden.
         * Danach bleibt es bereits im Dokument.
         */
        if (!popupGeladen) {

            try {

                const antwort = await fetch(popupDatei);

                if (!antwort.ok) {
                    throw new Error(
                        "Popup konnte nicht geladen werden. Status: "
                        + antwort.status
                    );
                }

                const html = await antwort.text();


                /*
                 * Popup in die aktuelle Seite einsetzen
                 */
                const container = document.createElement("div");

                container.id = "teilemarktPopupContainer";

                container.innerHTML = html;

                document.body.appendChild(container);


                popupGeladen = true;


                /*
                 * Ereignisse des Popups einrichten
                 */
                setupTeilemarktPopup();


            } catch (fehler) {

                console.error(
                    "Fehler beim Laden des Teilemarkt-Popups:",
                    fehler
                );

                alert(
                    "Die Anmeldung zum Teilemarkt konnte nicht geladen werden."
                );

                return;
            }
        }


        /*
         * Popup sichtbar machen
         */
        const popup = document.getElementById("teilemarktPopup");

        if (popup) {

            popup.classList.add("aktiv");

            popup.setAttribute("aria-hidden", "false");


            /*
             * Hintergrundseite während des Popups
             * nicht scrollen lassen.
             */
            document.body.style.overflow = "hidden";


            /*
             * Cursor direkt ins Namensfeld setzen
             */
            const name = document.getElementById("teilemarktName");

            if (name) {

                setTimeout(function () {
                    name.focus();
                }, 100);

            }
        }
    };


    /* ==========================================
       POPUP SCHLIESSEN
       ========================================== */

    window.closeTeilemarktPopup = function () {

        const popup = document.getElementById("teilemarktPopup");

        if (popup) {

            popup.classList.remove("aktiv");

            popup.setAttribute("aria-hidden", "true");
        }


        /*
         * Scrollen der normalen Seite wieder erlauben
         */
        document.body.style.overflow = "";
    };


    /* ==========================================
       POPUP EINRICHTEN
       ========================================== */

    function setupTeilemarktPopup() {

        const popup = document.getElementById("teilemarktPopup");

        if (!popup) {
            return;
        }


        /* ==========================================
           Klick auf den dunklen Hintergrund
           schließt das Popup
           ========================================== */

        popup.addEventListener("click", function (event) {

            if (event.target === popup) {

                closeTeilemarktPopup();

            }

        });


        /* ==========================================
           FORMULAR
           ========================================== */

        const form = document.getElementById("teilemarktForm");

        if (form) {

            form.addEventListener("submit", function (event) {

                /*
                 * Noch kein echter Versand.
                 *
                 * Das Formular wird momentan nur
                 * zu Testzwecken abgefangen.
                 */
                event.preventDefault();


                alert(
                    "Vielen Dank für Deine Anmeldung zum Capri-Teilemarkt 2026!"
                );

            });

        }

    }


    /* ==========================================
       ESC-TASTE
       ========================================== */

    document.addEventListener("keydown", function (event) {

        if (event.key === "Escape") {

            closeTeilemarktPopup();

        }

    });


})();
