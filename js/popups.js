/* ==========================================
   CCW POPUP - TEILEMARKT
   Zentrale Popup-Funktion
   ========================================== */

(function () {

    "use strict";


    /* =========================================================
       POPUP-PFAD ERMITTELN
       ========================================================= */

    const scriptElement =
        document.currentScript;


    const scriptUrl =
        scriptElement
            ? new URL(
                scriptElement.src,
                document.baseURI
              )
            : new URL(
                "js/popups.js",
                document.baseURI
              );


    /*
     * popups.js befindet sich in:
     *
     * /js/popups.js
     *
     * Daher liegen die benötigten Dateien eine Ebene höher:
     *
     * /popups/popup-teilemarkt.html
     * /css/teilemarkt.css
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


    console.log(
        "CCW Popup:",
        popupDatei
    );


    let popupGeladen =
        false;


    /* =========================================================
       POPUP-CSS LADEN
       ========================================================= */

    function ladePopupCSS() {

        const cssUrl =
            popupCssDatei;


        const bereitsGeladen =
            Array.from(
                document.querySelectorAll(
                    'link[rel="stylesheet"]'
                )
            ).some(
                function (link) {

                    return (
                        link.href === cssUrl
                    );

                }
            );


        if (
            bereitsGeladen
        ) {

            return;
        }


        const link =
            document.createElement(
                "link"
            );


        link.rel =
            "stylesheet";


        link.href =
            cssUrl;


        document.head.appendChild(
            link
        );
    }


    /* =========================================================
       POPUP ÖFFNEN
       ========================================================= */

    window.openTeilemarktPopup =
        async function () {


        /*
         * CSS laden
         */

        ladePopupCSS();


        /*
         * Popup beim ersten Aufruf laden
         */

        if (
            !popupGeladen
        ) {

            try {


                console.log(
                    "Lade:",
                    popupDatei
                );


                const antwort =
                    await fetch(
                        popupDatei,
                        {
                            cache:
                                "no-cache"
                        }
                    );


                if (
                    !antwort.ok
                ) {

                    throw new Error(
                        "HTTP " +
                        antwort.status +
                        " – " +
                        popupDatei
                    );
                }


                const html =
                    await antwort.text();


                /*
                 * Sicherheitsprüfung
                 */

                if (
                    !html.includes(
                        'id="teilemarktPopup"'
                    )
                ) {

                    throw new Error(
                        "Das Popup-Element " +
                        "#teilemarktPopup " +
                        "wurde nicht gefunden."
                    );
                }


                /*
                 * HTML einsetzen
                 */

                const container =
                    document.createElement(
                        "div"
                    );


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
                    "konnte nicht geladen werden.\n\n" +

                    "Gesuchte Datei:\n" +

                    popupDatei
                );


                return;
            }
        }


        /* =====================================================
           POPUP ANZEIGEN
           ===================================================== */

        const popup =
            document.getElementById(
                "teilemarktPopup"
            );


        if (
            !popup
        ) {

            console.error(
                "CCW Popup: " +
                "#teilemarktPopup nicht gefunden."
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


        /*
         * Cursor ins Namensfeld
         */

        const nameField =
            document.getElementById(
                "teilemarktName"
            );


        if (
            nameField
        ) {

            setTimeout(
                function () {

                    nameField.focus();

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


        if (
            popup
        ) {

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
       POPUP EINRICHTEN
       ========================================================= */

    function setupTeilemarktPopup() {


        const popup =
            document.getElementById(
                "teilemarktPopup"
            );


        if (
            !popup
        ) {

            return;
        }


        /*
         * Klick auf dunklen Hintergrund
         */

        popup.addEventListener(
            "click",
            function (event) {

                if (
                    event.target ===
                    popup
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


        if (
            form
        ) {

            form.addEventListener(
                "submit",
                function (event) {

                    event.preventDefault();


                    alert(
                        "Vielen Dank für Deine Anmeldung " +
                        "zum Capri-Teilemarkt!"
                    );

                }
            );
        }

    };


    /* =========================================================
       ESC = SCHLIESSEN
       ========================================================= */

    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key ===
                "Escape"
            ) {

                closeTeilemarktPopup();
            }

        }
    );


})();/* ==========================================
   CCW POPUP - TEILEMARKT
   Zentrale Popup-Funktion für alle CCW-Seiten
   ========================================== */

(function () {

    "use strict";


    /* =========================================================
       BASISPFAD DES CCW-PROJEKTS ERMITTELN
       ========================================================= */

    function getProjektBasis() {

        const pathname =
            window.location.pathname;


        /*
         * Wenn wir uns in /pages/ befinden,
         * gehen wir zurück zum Projekt-Hauptordner.
         */

        const pagesMarker =
            "/pages/";


        if (
            pathname.includes(pagesMarker)
        ) {

            return (
                pathname.split(
                    pagesMarker
                )[0] + "/"
            );
        }


        /*
         * Startseite im Projekt-Hauptordner
         */

        const letzterSlash =
            pathname.lastIndexOf("/");


        return (
            pathname.substring(
                0,
                letzterSlash + 1
            )
        );
    }


    const projektBasis =
        getProjektBasis();


    /* =========================================================
       DATEIPFADE
       ========================================================= */

    const popupDatei =
        projektBasis +
        "popups/popup-teilemarkt.html";


    const popupCssDatei =
        projektBasis +
        "css/teilemarkt.css";


    /*
     * Für die Fehlersuche in der Browser-Konsole.
     */

    console.log(
        "CCW Popup-Datei:",
        popupDatei
    );


    let popupGeladen =
        false;

    let cssGeladen =
        false;


    /* =========================================================
       TEILEMARKT-CSS LADEN
       ========================================================= */

    function ladePopupCSS() {

        if (cssGeladen) {
            return;
        }


        const cssUrl =
            new URL(
                popupCssDatei,
                window.location.origin
            ).href;


        const bereitsVorhanden =
            Array.from(
                document.querySelectorAll(
                    'link[rel="stylesheet"]'
                )
            ).some(
                function (link) {

                    return (
                        link.href === cssUrl
                    );

                }
            );


        if (
            !bereitsVorhanden
        ) {

            const link =
                document.createElement(
                    "link"
                );


            link.rel =
                "stylesheet";


            link.href =
                cssUrl;


            link.setAttribute(
                "data-ccw-popup-css",
                "true"
            );


            document.head.appendChild(
                link
            );
        }


        cssGeladen =
            true;
    }


    /* =========================================================
       POPUP ÖFFNEN
       ========================================================= */

    window.openTeilemarktPopup =
        async function () {

            /*
             * CSS laden
             */

            ladePopupCSS();


            /*
             * Popup nur beim ersten Aufruf laden.
             */

            if (
                !popupGeladen
            ) {

                try {

                    console.log(
                        "Lade Teilemarkt-Popup:",
                        popupDatei
                    );


                    const antwort =
                        await fetch(
                            popupDatei,
                            {
                                method: "GET",
                                cache: "no-cache"
                            }
                        );


                    if (
                        !antwort.ok
                    ) {

                        throw new Error(
                            "HTTP " +
                            antwort.status +
                            " beim Laden von " +
                            popupDatei
                        );
                    }


                    const html =
                        await antwort.text();


                    /*
                     * Kontrolle:
                     * Ist wirklich unser Popup enthalten?
                     */

                    if (
                        !html ||
                        !html.includes(
                            'id="teilemarktPopup"'
                        )
                    ) {

                        throw new Error(
                            "Popup-Datei geladen, " +
                            "aber #teilemarktPopup fehlt."
                        );
                    }


                    /*
                     * Popup in die Seite einsetzen.
                     */

                    const container =
                        document.createElement(
                            "div"
                        );


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
                        "CCW Teilemarkt-Popup Fehler:",
                        fehler
                    );


                    alert(
                        "Die Anmeldung zum Teilemarkt " +
                        "konnte nicht geladen werden.\n\n" +
                        "Gesuchte Datei:\n" +
                        popupDatei
                    );


                    return;
                }
            }


            /* =================================================
               POPUP SICHTBAR MACHEN
               ================================================= */

            const popup =
                document.getElementById(
                    "teilemarktPopup"
                );


            if (
                !popup
            ) {

                console.error(
                    "CCW Popup: " +
                    "#teilemarktPopup wurde nicht gefunden."
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


            /*
             * Cursor direkt ins Namensfeld setzen.
             */

            const nameField =
                document.getElementById(
                    "teilemarktName"
                );


            if (
                nameField
            ) {

                setTimeout(
                    function () {

                        nameField.focus();

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


            if (
                popup
            ) {

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
       POPUP EINRICHTEN
       ========================================================= */

    function setupTeilemarktPopup() {

        const popup =
            document.getElementById(
                "teilemarktPopup"
            );


        if (
            !popup
        ) {

            return;
        }


        /*
         * Klick auf den dunklen Bereich
         * schließt das Popup.
         */

        popup.addEventListener(
            "click",
            function (event) {

                if (
                    event.target ===
                    popup
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


        if (
            form
        ) {

            form.addEventListener(
                "submit",
                function (event) {

                    event.preventDefault();


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


})();
