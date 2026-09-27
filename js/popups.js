/* ==========================================
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
