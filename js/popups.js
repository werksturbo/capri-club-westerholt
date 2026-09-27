/* ==========================================
   CCW POPUP - TEILEMARKT
   Lädt das Popup einmalig in jede Seite.
   ========================================== */

(function () {

    const popupDatei = "popups/popup-teilemarkt.html";
    let popupGeladen = false;

    window.openTeilemarktPopup = async function () {

        if (!popupGeladen) {
            try {
                const antwort = await fetch(popupDatei);

                if (!antwort.ok) {
                    throw new Error("Popup konnte nicht geladen werden.");
                }

                const html = await antwort.text();

                const container = document.createElement("div");
                container.id = "teilemarktPopupContainer";
                container.innerHTML = html;

                document.body.appendChild(container);

                popupGeladen = true;

                setupTeilemarktPopup();

            } catch (fehler) {
                console.error(fehler);
                alert("Die Anmeldung zum Teilemarkt konnte nicht geladen werden.");
                return;
            }
        }

        const popup = document.getElementById("teilemarktPopup");

        if (popup) {
            popup.classList.add("aktiv");
            popup.setAttribute("aria-hidden", "false");

            document.body.style.overflow = "hidden";

            const name = document.getElementById("teilemarktName");

            if (name) {
                setTimeout(() => name.focus(), 100);
            }
        }
    };


    window.closeTeilemarktPopup = function () {

        const popup = document.getElementById("teilemarktPopup");

        if (popup) {
            popup.classList.remove("aktiv");
            popup.setAttribute("aria-hidden", "true");
        }

        document.body.style.overflow = "";
    };


    function setupTeilemarktPopup() {

        const popup = document.getElementById("teilemarktPopup");

        if (!popup) return;


        /* ==========================================
           Klick auf den dunklen Hintergrund
           ========================================== */

        popup.addEventListener("click", function (event) {

            if (event.target === popup) {
                closeTeilemarktPopup();
            }

        });


        /* ==========================================
           Formular
           ========================================== */

        const form = document.getElementById("teilemarktForm");

        if (form) {

            form.addEventListener("submit", function (event) {

                event.preventDefault();

                /*
                 * Hier kommt später der tatsächliche
                 * Versand der Anmeldung hin.
                 *
                 * Bis dahin wird nur eine Testmeldung
                 * angezeigt.
                 */

                alert(
                    "Vielen Dank für Deine Anmeldung zum Capri-Teilemarkt 2026!"
                );

            });

        }

    }


    /* ==========================================
       ESC-Taste schließt das Popup
       ========================================== */

    document.addEventListener("keydown", function (event) {

        if (event.key === "Escape") {
            closeTeilemarktPopup();
        }

    });

})();
