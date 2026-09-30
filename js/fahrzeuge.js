/* CCW Fahrzeugdetail – Prototyp
   Bild_XX: höchste vorhandene Nummer = neuestes Bild = Hauptbild.
   Galerie wird automatisch absteigend aufgebaut. */
(function () {
    "use strict";

    const params = new URLSearchParams(window.location.search);
    const fahrzeugId = params.get("id") || "01";
    const MAX_BILDER = 30;

    const titelEl = document.getElementById("fahrzeug-titel");
    const hauptbild = document.getElementById("hauptbild");
    const hauptbildLink = document.getElementById("hauptbild-link");
    const galerie = document.getElementById("galerie");
    const keineBilder = document.getElementById("keine-bilder");

    function setText(id, value) {
        const el = document.getElementById(id);
        if (el) el.textContent = value ?? "";
    }

    function bildPfad(ordner, nummer) {
        return "../data/fahrzeuge/" + ordner + "/Bild_" + String(nummer).padStart(2, "0") + ".jpg";
    }

    function pruefeBild(src) {
        return new Promise(resolve => {
            const img = new Image();
            img.onload = () => resolve(true);
            img.onerror = () => resolve(false);
            img.src = src;
        });
    }

    async function ermittleBilder(ordner) {
        const pruefungen = [];
        for (let nummer = MAX_BILDER; nummer >= 1; nummer--) {
            const src = bildPfad(ordner, nummer);
            pruefungen.push(pruefeBild(src).then(vorhanden => vorhanden ? { nummer, src } : null));
        }
        const ergebnisse = await Promise.all(pruefungen);
        return ergebnisse.filter(Boolean).sort((a, b) => b.nummer - a.nummer);
    }

    function lightboxOeffnen(bilder, index, titel) {
        if (typeof Lightbox === "undefined") {
            console.warn("Lightbox ist nicht geladen.");
            return;
        }
        Lightbox.open(bilder.map(b => b.src), index, titel);
    }

    function setzeHauptbild(bilder, fahrzeug) {
        if (!bilder.length) {
            hauptbildLink.style.display = "none";
            return;
        }
        hauptbildLink.style.display = "block";
        hauptbild.src = bilder[0].src;
        hauptbild.alt = fahrzeug.titel + " – aktuelles Hauptbild";
        hauptbildLink.href = bilder[0].src;
        hauptbildLink.onclick = event => {
            event.preventDefault();
            lightboxOeffnen(bilder, 0, fahrzeug.titel);
        };
    }

    function zeigeGalerie(bilder, fahrzeug) {
        galerie.innerHTML = "";
        if (!bilder.length) {
            keineBilder.hidden = false;
            return;
        }
        keineBilder.hidden = true;
        bilder.forEach((bild, index) => {
            const link = document.createElement("a");
            link.href = bild.src;
            link.title = "Bild " + String(bild.nummer).padStart(2, "0") + " vergrößern";
            const img = document.createElement("img");
            img.src = bild.src;
            img.alt = fahrzeug.titel + " – Bild " + String(bild.nummer).padStart(2, "0");
            img.loading = index < 5 ? "eager" : "lazy";
            link.appendChild(img);
            galerie.appendChild(link);
            link.addEventListener("click", event => {
                event.preventDefault();
                lightboxOeffnen(bilder, index, fahrzeug.titel);
            });
        });
    }

    function fuelleFahrzeugdaten(fahrzeug) {
        titelEl.textContent = fahrzeug.titel || "Fahrzeug";
        document.title = (fahrzeug.titel || "Fahrzeug") + " | Capri Club Westerholt e.V.";
        setText("typ", fahrzeug.typ);
        setText("baujahr", fahrzeug.baujahr);
        setText("motor", fahrzeug.motor);
        setText("eigentümer", fahrzeug.eigentuemer);
        setText("sonstiges", fahrzeug.sonstiges);
        setText("geschichte", fahrzeug.geschichte);
        if (fahrzeug.geschichteLabel) setText("geschichte-label", fahrzeug.geschichteLabel);
    }

    async function starteFahrzeugseite() {
        try {
            const response = await fetch("../json/fahrzeuge.json", { cache: "no-cache" });
            if (!response.ok) throw new Error("JSON konnte nicht geladen werden: " + response.status);
            const daten = await response.json();
            const fahrzeug = daten.find(eintrag => String(eintrag.id) === String(fahrzeugId));
            if (!fahrzeug) throw new Error("Fahrzeug-ID " + fahrzeugId + " wurde nicht gefunden.");

            fuelleFahrzeugdaten(fahrzeug);
            const bilder = await ermittleBilder(fahrzeug.bildordner);
            setzeHauptbild(bilder, fahrzeug);
            zeigeGalerie(bilder, fahrzeug);

            console.log("Fahrzeug " + fahrzeugId + ": " + bilder.length + " Bilder. Neuestes Bild: " + (bilder.length ? bilder[0].nummer : "keines"));
        } catch (error) {
            console.error("Fehler auf der Fahrzeugseite:", error);
            titelEl.textContent = "Fahrzeug konnte nicht geladen werden.";
            galerie.innerHTML = "";
            keineBilder.hidden = false;
            keineBilder.textContent = "Die Fahrzeugdaten konnten nicht geladen werden. Bitte JSON-Datei und Fahrzeug-ID prüfen.";
        }
    }

    document.addEventListener("DOMContentLoaded", starteFahrzeugseite);
})();
