import { useTranslation } from "react-i18next";

type Language = "pt" | "en" | "es" | "he";

function normalizeLanguage(lng: string | undefined): Language {
  const base = (lng ?? "en").toLowerCase().split("-")[0];
  if (base === "pt" || base === "en" || base === "es" || base === "he")
    return base;
  return "en";
}

export function LanguageSwitch() {
  const { i18n, t } = useTranslation("common");
  const current = normalizeLanguage(i18n.resolvedLanguage ?? i18n.language);

  const setLanguage = (language: Language) => {
    i18n.changeLanguage(language);
    localStorage.setItem("lang", language);
  };

  const baseBtn =
    "px-3 py-1.5 text-sm rounded-md transition-colors cursor-pointer";

  const activeBtn = "bg-gray-900 text-white";
  const idleBtn = "text-gray-700 hover:bg-gray-100";

  return (
    <div
      role="group"
      aria-label={t("i18n.switchLanguage")}
      className="inline-flex rounded-lg border border-gray-300 bg-white p-1"
    >
      <button
        type="button"
        onClick={() => setLanguage("pt")}
        className={[baseBtn, current === "pt" ? activeBtn : idleBtn].join(" ")}
        aria-pressed={current === "pt"}
      >
        PT
      </button>

      <button
        type="button"
        onClick={() => setLanguage("en")}
        className={[baseBtn, current === "en" ? activeBtn : idleBtn].join(" ")}
        aria-pressed={current === "en"}
      >
        EN
      </button>

      <button
        type="button"
        onClick={() => setLanguage("es")}
        className={[baseBtn, current === "es" ? activeBtn : idleBtn].join(" ")}
        aria-pressed={current === "es"}
      >
        ES
      </button>

      <button
        type="button"
        onClick={() => setLanguage("he")}
        className={[baseBtn, current === "he" ? activeBtn : idleBtn].join(" ")}
        aria-pressed={current === "he"}
      >
        עב
      </button>
    </div>
  );
}
