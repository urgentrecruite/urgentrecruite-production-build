(function () {
  const CONSENT_KEY = "urgentRecruiteCookieConsent";
  const CONSENT_VERSION = "2026-06-06";
  const ANALYTICS_READY_EVENT = "urgentRecruiteAnalyticsReady";
  const DEFAULT_CONSENT = {
    version: CONSENT_VERSION,
    necessary: true,
    analytics: false,
    decidedAt: ""
  };

  let analyticsConfigPromise = null;
  let analyticsLoaded = false;
  let gaReady = false;
  let clarityReady = false;

  const consentCopy = {
    en: {
      eyebrow: "Cookie preferences",
      title: "We use cookies responsibly.",
      description: "Necessary cookies keep the website working. Analytics cookies help us understand visits, improve the service, and measure recruitment form usage. Analytics stay off unless you accept them.",
      necessaryTitle: "Necessary cookies",
      necessaryDescription: "Required for language settings, cookie choices, forms, security, and core website operation.",
      alwaysActive: "Always active",
      analyticsTitle: "Analytics cookies",
      analyticsDescription: "Optional Google Analytics and Microsoft Clarity measurement. Disabled by default.",
      accept: "Accept All",
      reject: "Reject Non-Essential Cookies",
      rejectAll: "Reject All",
      customize: "Customize Preferences",
      save: "Save Preferences"
    },
    de: {
      eyebrow: "Cookie-Einstellungen",
      title: "Wir verwenden Cookies verantwortungsvoll.",
      description: "Notwendige Cookies halten die Website funktionsfahig. Analytics-Cookies helfen uns, Besuche zu verstehen, den Service zu verbessern und die Nutzung der Recruiting-Formulare zu messen. Analytics bleibt aus, sofern Sie nicht zustimmen.",
      necessaryTitle: "Notwendige Cookies",
      necessaryDescription: "Erforderlich fur Spracheinstellungen, Cookie-Auswahl, Formulare, Sicherheit und den grundlegenden Website-Betrieb.",
      alwaysActive: "Immer aktiv",
      analyticsTitle: "Analytics-Cookies",
      analyticsDescription: "Optionale Messung mit Google Analytics und Microsoft Clarity. Standardmassig deaktiviert.",
      accept: "Alle akzeptieren",
      reject: "Nicht notwendige Cookies ablehnen",
      rejectAll: "Alle ablehnen",
      customize: "Einstellungen anpassen",
      save: "Einstellungen speichern"
    },
    es: {
      eyebrow: "Preferencias de cookies",
      title: "Usamos cookies de forma responsable.",
      description: "Las cookies necesarias mantienen el sitio funcionando. Las cookies analiticas nos ayudan a entender las visitas, mejorar el servicio y medir el uso de los formularios de reclutamiento. Analytics permanece desactivado salvo que lo aceptes.",
      necessaryTitle: "Cookies necesarias",
      necessaryDescription: "Necesarias para idioma, preferencias de cookies, formularios, seguridad y funcionamiento basico del sitio.",
      alwaysActive: "Siempre activas",
      analyticsTitle: "Cookies analiticas",
      analyticsDescription: "Medicion opcional con Google Analytics y Microsoft Clarity. Desactivadas por defecto.",
      accept: "Aceptar todo",
      reject: "Rechazar cookies no esenciales",
      rejectAll: "Rechazar todo",
      customize: "Personalizar preferencias",
      save: "Guardar preferencias"
    },
    pt: {
      eyebrow: "Preferencias de cookies",
      title: "Usamos cookies de forma responsavel.",
      description: "Os cookies necessarios mantem o site a funcionar. Os cookies analiticos ajudam-nos a compreender visitas, melhorar o servico e medir a utilizacao dos formularios de recrutamento. A analise fica desligada a menos que aceite.",
      necessaryTitle: "Cookies necessarios",
      necessaryDescription: "Necessarios para idioma, escolhas de cookies, formularios, seguranca e funcionamento principal do site.",
      alwaysActive: "Sempre ativos",
      analyticsTitle: "Cookies analiticos",
      analyticsDescription: "Medicao opcional com Google Analytics e Microsoft Clarity. Desativados por defeito.",
      accept: "Aceitar tudo",
      reject: "Rejeitar cookies nao essenciais",
      rejectAll: "Rejeitar tudo",
      customize: "Personalizar preferencias",
      save: "Guardar preferencias"
    },
    fr: {
      eyebrow: "Preferences de cookies",
      title: "Nous utilisons les cookies de maniere responsable.",
      description: "Les cookies necessaires assurent le fonctionnement du site. Les cookies analytiques nous aident a comprendre les visites, ameliorer le service et mesurer l'utilisation des formulaires de recrutement. L'analyse reste desactivee sauf si vous l'acceptez.",
      necessaryTitle: "Cookies necessaires",
      necessaryDescription: "Requis pour la langue, les choix de cookies, les formulaires, la securite et le fonctionnement principal du site.",
      alwaysActive: "Toujours actifs",
      analyticsTitle: "Cookies analytiques",
      analyticsDescription: "Mesure optionnelle avec Google Analytics et Microsoft Clarity. Desactivee par defaut.",
      accept: "Tout accepter",
      reject: "Refuser les cookies non essentiels",
      rejectAll: "Tout refuser",
      customize: "Personnaliser",
      save: "Enregistrer"
    }
  };

  function getConsentCopy() {
    const language = window.localStorage.getItem("urgentRecruiteLanguage") || "en";
    return consentCopy[language] || consentCopy.en;
  }

  function readConsent() {
    try {
      const stored = JSON.parse(window.localStorage.getItem(CONSENT_KEY) || "null");
      if (!stored || stored.version !== CONSENT_VERSION) return null;
      return { ...DEFAULT_CONSENT, ...stored, necessary: true };
    } catch (error) {
      return null;
    }
  }

  function writeConsent(preferences) {
    const consent = {
      ...DEFAULT_CONSENT,
      ...preferences,
      necessary: true,
      decidedAt: new Date().toISOString()
    };
    window.localStorage.setItem(CONSENT_KEY, JSON.stringify(consent));
    return consent;
  }

  function hasAnalyticsConsent() {
    return Boolean(readConsent()?.analytics);
  }

  function getRuntimeConfig() {
    if (analyticsConfigPromise) return analyticsConfigPromise;

    analyticsConfigPromise = fetch("/api/runtime-config", { cache: "no-store" })
      .then((response) => response.ok ? response.json() : {})
      .catch(() => window.URGENT_RECRUITE_ANALYTICS_CONFIG || {});

    return analyticsConfigPromise;
  }

  function ensureGoogleTagBase() {
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () {
      window.dataLayer.push(arguments);
    };

    window.gtag("consent", "default", {
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      analytics_storage: "denied"
    });
  }

  function updateGoogleConsent(analyticsGranted) {
    if (!window.gtag) return;
    window.gtag("consent", "update", {
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      analytics_storage: analyticsGranted ? "granted" : "denied"
    });
  }

  function loadGoogleAnalytics(measurementId) {
    if (!measurementId || gaReady) return;

    ensureGoogleTagBase();
    updateGoogleConsent(true);

    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
    script.onload = () => {
      window.gtag("js", new Date());
      window.gtag("config", measurementId, { send_page_view: false });
      gaReady = true;
      trackPageView();
      window.dispatchEvent(new CustomEvent(ANALYTICS_READY_EVENT));
    };
    document.head.appendChild(script);
  }

  function loadMicrosoftClarity(projectId) {
    if (!projectId || clarityReady) return;

    (function (c, l, a, r, i, t, y) {
      c[a] = c[a] || function () {
        (c[a].q = c[a].q || []).push(arguments);
      };
      t = l.createElement(r);
      t.async = 1;
      t.src = `https://www.clarity.ms/tag/${i}`;
      y = l.getElementsByTagName(r)[0];
      y.parentNode.insertBefore(t, y);
    })(window, document, "clarity", "script", projectId);

    window.clarity("consentv2", {
      ad_Storage: "denied",
      analytics_Storage: "granted"
    });
    clarityReady = true;
  }

  async function enableAnalyticsIfAllowed() {
    if (!hasAnalyticsConsent()) {
      updateGoogleConsent(false);
      if (window.clarity) {
        window.clarity("consentv2", {
          ad_Storage: "denied",
          analytics_Storage: "denied"
        });
        window.clarity("consent", false);
      }
      return;
    }

    if (analyticsLoaded) {
      updateGoogleConsent(true);
      if (window.clarity) {
        window.clarity("consentv2", {
          ad_Storage: "denied",
          analytics_Storage: "granted"
        });
      }
      trackPageView();
      return;
    }
    analyticsLoaded = true;

    const config = await getRuntimeConfig();
    loadGoogleAnalytics(config.gaMeasurementId);
    loadMicrosoftClarity(config.clarityId);
  }

  function trackEvent(eventName, parameters = {}) {
    if (!hasAnalyticsConsent() || !gaReady || !window.gtag) return;
    window.gtag("event", eventName, {
      page_location: window.location.href,
      page_title: document.title,
      ...parameters
    });
  }

  function trackPageView() {
    if (!hasAnalyticsConsent() || !gaReady || !window.gtag) return;
    window.gtag("event", "page_view", {
      page_location: window.location.href,
      page_path: `${window.location.pathname}${window.location.search}${window.location.hash}`,
      page_title: document.title
    });
  }

  function removeConsentUi() {
    document.querySelector(".cookie-consent")?.remove();
  }

  function getVisibleAnalyticsChoice() {
    const toggle = document.querySelector("#analytics-cookie-toggle");
    return toggle ? toggle.checked : undefined;
  }

  function createConsentUi(mode = "banner", draftAnalyticsChoice) {
    removeConsentUi();

    const consent = readConsent();
    const isPreferences = mode === "preferences";
    const copy = getConsentCopy();
    const analyticsChecked = typeof draftAnalyticsChoice === "boolean"
      ? draftAnalyticsChoice
      : Boolean(consent?.analytics);
    const wrapper = document.createElement("section");
    wrapper.className = `cookie-consent${isPreferences ? " preferences-open" : ""}`;
    wrapper.setAttribute("role", "dialog");
    wrapper.setAttribute("aria-live", "polite");
    wrapper.setAttribute("aria-labelledby", "cookie-consent-title");
    wrapper.setAttribute("aria-describedby", "cookie-consent-description");

    wrapper.innerHTML = `
      <div class="cookie-consent-card">
        <div class="cookie-consent-copy">
          <p class="eyebrow">${copy.eyebrow}</p>
          <h2 id="cookie-consent-title">${copy.title}</h2>
          <p id="cookie-consent-description">${copy.description}</p>
        </div>
        <div class="cookie-consent-options">
          <div class="cookie-row">
            <div>
              <strong>${copy.necessaryTitle}</strong>
              <p>${copy.necessaryDescription}</p>
            </div>
            <span class="cookie-always-on">${copy.alwaysActive}</span>
          </div>
          <label class="cookie-row cookie-checkbox-row">
            <span>
              <strong>${copy.analyticsTitle}</strong>
              <p>${copy.analyticsDescription}</p>
            </span>
            <input type="checkbox" id="analytics-cookie-toggle" ${analyticsChecked ? "checked" : ""} aria-label="${copy.analyticsTitle}">
          </label>
        </div>
        <div class="cookie-consent-actions">
          <button class="primary-button cookie-accept-button" type="button" data-cookie-action="accept">${copy.accept}</button>
          <button class="secondary-button cookie-reject-button" type="button" data-cookie-action="reject">${copy.rejectAll}</button>
          <button class="secondary-button cookie-save-button" type="button" data-cookie-action="save">${copy.save}</button>
        </div>
      </div>
    `;

    document.body.appendChild(wrapper);

    const analyticsToggle = wrapper.querySelector("#analytics-cookie-toggle");

    wrapper.querySelector('[data-cookie-action="accept"]').addEventListener("click", () => {
      if (analyticsToggle) analyticsToggle.checked = true;
      writeConsent({ analytics: true });
      removeConsentUi();
      enableAnalyticsIfAllowed();
    });

    wrapper.querySelector('[data-cookie-action="reject"]').addEventListener("click", () => {
      writeConsent({ analytics: false });
      removeConsentUi();
      enableAnalyticsIfAllowed();
    });

    wrapper.querySelector('[data-cookie-action="save"]').addEventListener("click", () => {
      writeConsent({ analytics: Boolean(analyticsToggle?.checked) });
      removeConsentUi();
      enableAnalyticsIfAllowed();
    });

    wrapper.querySelector("button")?.focus({ preventScroll: true });
  }

  function openPreferences() {
    createConsentUi("preferences");
  }

  function bindPreferenceLinks() {
    document.querySelectorAll("[data-cookie-preferences]").forEach((trigger) => {
      trigger.addEventListener("click", (event) => {
        event.preventDefault();
        openPreferences();
      });
    });
  }

  window.urgentRecruiteAnalytics = {
    getConsent: readConsent,
    openPreferences,
    trackEvent,
    trackPageView
  };

  window.addEventListener("hashchange", trackPageView);
  window.addEventListener("popstate", trackPageView);
  window.addEventListener("urgentRecruiteLanguageChanged", () => {
    const activeConsentUi = document.querySelector(".cookie-consent");
    if (!activeConsentUi) return;

    const draftAnalyticsChoice = getVisibleAnalyticsChoice();
    createConsentUi(activeConsentUi.classList.contains("preferences-open") ? "preferences" : "banner", draftAnalyticsChoice);
  });
  window.addEventListener("storage", (event) => {
    if (event.key !== "urgentRecruiteLanguage" || !document.querySelector(".cookie-consent")) return;
    createConsentUi("preferences", getVisibleAnalyticsChoice());
  });

  document.addEventListener("DOMContentLoaded", () => {
    bindPreferenceLinks();
    if (!readConsent()) {
      createConsentUi("banner");
      return;
    }
    enableAnalyticsIfAllowed();
  });
})();
