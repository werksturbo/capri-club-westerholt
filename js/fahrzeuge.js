/* ==========================================================
   Capri Club Westerholt – dynamische Fahrzeugseite
   ========================================================== */

(async function () {
    "use strict";

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

    try {
        const response = await fetch("../json/fahrzeuge.json", { cache: "no-store" });

        if (!response.ok) {
            throw new Error("fahrzeuge.json konnte nicht geladen werden.");
        }

        const fahrzeuge = await response.json();
        const fahrzeug = fahrzeuge[id];

        if (!fahrzeug) {
            throw new Error("Fahrzeug " + id + " wurde nicht gefunden.");
        }

        document.title = fahrzeug.titel + " | Capri Club Westerholt";
        titel.textContent = fahrzeug.titel;

        felder.typ.textContent = fahrzeug.typ || "";
        felder.baujahr.textContent = fahrzeug.baujahr || "";
        felder.motor.textContent = fahrzeug.motor || "";
        felder.eigentümer.textContent = fahrzeug.eigentümer || "";
        felder.sonstiges.textContent = fahrzeug.sonstiges || "";
        felder.geschichte.textContent = fahrzeug.geschichte || "";

        // hauptbild darf entweder ein Pfad aus dem Fahrzeugordner
        // oder ein kompletter relativer Pfad aus der bestehenden
        // GitHub-Dateistruktur sein.
        const bildpfad = fahrzeug.hauptbild;

        hauptbild.src = bildpfad;
        hauptbild.alt = fahrzeug.titel;
        hauptbildLink.href = bildpfad;
        hauptbildLink.dataset.lightbox = "fahrzeug";

        const bilder = Array.isArray(fahrzeug.bilder) ? fahrzeug.bilder : [];

        galerie.innerHTML = "";

        if (bilder.length === 0) {
            keineBilder.hidden = false;
        } else {
            keineBilder.hidden = true;

            bilder.forEach((bild, index) => {
                const link = document.createElement("a");
                link.className = "gallery-link";
                link.href = "bilder/" + id + "/" + bild;
                link.dataset.lightbox = "fahrzeug";
                link.setAttribute("aria-label", "Fahrzeugbild " + (index + 1));

                const img = document.createElement("img");
                img.src = "bilder/" + id + "/" + bild;
                img.alt = fahrzeug.titel + " – Bild " + (index + 1);
                img.loading = "lazy";

                link.appendChild(img);
                galerie.appendChild(link);
            });
        }

    } catch (error) {
        console.error(error);
        titel.textContent = "Fahrzeug konnte nicht geladen werden";
        keineBilder.hidden = false;
        keineBilder.textContent =
            "Beim Laden der Fahrzeugdaten ist ein Fehler aufgetreten. " +
            "Bitte die Datei ../json/fahrzeuge.json und den Webserver prüfen.";
    }
})();
