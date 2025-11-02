import type { Locale } from "../../lib/blogs";

type LocaleTabsProps = {
  locales?: Locale[];
  active: Locale;
  onChange: (locale: Locale) => void;
};

const DEFAULT_LOCALES: Locale[] = ["en", "ar"];

export function LocaleTabs({ locales = DEFAULT_LOCALES, active, onChange }: LocaleTabsProps) {
  return (
    <div className="inline-flex rounded-xl border border-emerald-100 bg-white p-1 shadow-sm">
      {locales.map((locale) => {
        const isActive = locale === active;
        return (
          <button
            key={locale}
            type="button"
            onClick={() => onChange(locale)}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
              isActive
                ? "bg-emerald-600 text-white shadow"
                : "text-slate-600 hover:text-emerald-700 hover:bg-emerald-50"
            }`}
            aria-pressed={isActive}
          >
            {locale === "en" ? "English" : "العربية"}
          </button>
        );
      })}
    </div>
  );
}
