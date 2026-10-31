/* CCW Online-Aufnahmeantrag Popup */
(function () {
  const popupDatei = "../popups/popup-aufnahmeantrag.html";
  const formspreeEndpoint = "https://formspree.io/f/mpppywlr";
  let popupGeladen = false;

  window.openAufnahmePopup = async function () {
    if (!popupGeladen) {
      try {
        const response = await fetch(popupDatei);
        if (!response.ok) throw new Error("Popup konnte nicht geladen werden.");
        const container = document.createElement("div");
        container.id = "aufnahmePopupContainer";
        container.innerHTML = await response.text();
        document.body.appendChild(container);
        popupGeladen = true;
        setupAufnahmePopup();
      } catch (error) {
        console.error(error);
        alert("Der Online-Aufnahmeantrag konnte nicht geladen werden. Bitte versuche es später erneut.");
        return;
      }
    }
    const popup = document.getElementById("aufnahmePopup");
    if (popup) {
      popup.classList.add("aktiv");
      popup.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      setTimeout(() => document.getElementById("aufnahmeName")?.focus(), 100);
    }
  };

  window.closeAufnahmePopup = function () {
    const popup = document.getElementById("aufnahmePopup");
    if (popup) {
      popup.classList.remove("aktiv");
      popup.setAttribute("aria-hidden", "true");
    }
    document.body.style.overflow = "";
  };

  function setupAufnahmePopup() {
    const popup = document.getElementById("aufnahmePopup");
    const form = document.getElementById("aufnahmeForm");
    if (!popup || !form) return;

    popup.addEventListener("click", event => {
      if (event.target === popup) window.closeAufnahmePopup();
    });

    form.addEventListener("submit", async event => {
      event.preventDefault();
      if (!form.reportValidity()) return;

      const button = form.querySelector('button[type="submit"]');
      const originalText = button ? button.textContent : "";
      const formData = new FormData(form);
      formData.append("_subject", "Neuer Online-Aufnahmeantrag – Capri Club Westerholt");
      formData.append("_replyto", String(formData.get("email") || ""));

      if (button) {
        button.disabled = true;
        button.textContent = "Antrag wird gesendet …";
      }
      const status = document.getElementById("aufnahmeStatus");
      if (status) {
        status.textContent = "";
        status.className = "aufnahme-status";
      }

      try {
        const response = await fetch(formspreeEndpoint, {
          method: "POST",
          body: formData,
          headers: { "Accept": "application/json" }
        });
        const result = await response.json().catch(() => ({}));
        if (response.ok) {
          form.innerHTML = '<div class="aufnahme-success" role="status" aria-live="polite"><h3>Vielen Dank für Deinen Antrag!</h3><p>Dein Aufnahmeantrag wurde erfolgreich an den Capri Club Westerholt übermittelt.</p><p>Wir melden uns so bald wie möglich bei Dir.</p></div>';
          return;
        }
        const message = Array.isArray(result.errors) ? result.errors.map(e => e.message).join(" ") : "";
        if (status) {
          status.className = "aufnahme-status aufnahme-status-error";
          status.textContent = message || "Der Antrag konnte leider nicht gesendet werden. Bitte versuche es erneut.";
        }
      } catch (error) {
        if (status) {
          status.className = "aufnahme-status aufnahme-status-error";
          status.textContent = "Der Antrag konnte nicht gesendet werden. Bitte prüfe Deine Internetverbindung und versuche es erneut.";
        }
      } finally {
        if (button && document.body.contains(button)) {
          button.disabled = false;
          button.textContent = originalText;
        }
      }
    });
  }

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") window.closeAufnahmePopup();
  });
})();
