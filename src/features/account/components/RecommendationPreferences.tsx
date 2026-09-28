'use client';

import { CheckCircle2, Save, Sparkles } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { useAccountPreferences } from '../hooks/use-account-recommendations';

const CATEGORIES = [
  { slug: 'smartphones', label: 'Smartphones & Accessories' },
  { slug: 'laptops', label: 'Laptops & Computers' },
  { slug: 'audio', label: 'Audio & Headphones' },
  { slug: 'wearables', label: 'Wearables & Smartwatches' },
  { slug: 'beauty', label: 'Beauty & Skincare' },
];

export function RecommendationPreferences() {
  const { preferences, updatePreferences } = useAccountPreferences();

  const [categories, setCategories] = useState<readonly string[]>(
    preferences.preferredCategories
  );
  const [minPrice, setMinPrice] = useState<string>(
    preferences.minPrice !== undefined ? String(preferences.minPrice) : ''
  );
  const [maxPrice, setMaxPrice] = useState<string>(
    preferences.maxPrice !== undefined ? String(preferences.maxPrice) : ''
  );
  const [enablePersonalization, setEnablePersonalization] = useState(
    preferences.enablePersonalization
  );
  const [showExplanations, setShowExplanations] = useState(
    preferences.showExplanations
  );
  const [savedSuccess, setSavedSuccess] = useState(false);

  const toggleCategory = (slug: string) => {
    if (categories.includes(slug)) {
      setCategories(categories.filter((c) => c !== slug));
    } else {
      setCategories([...categories, slug]);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    updatePreferences({
      preferredCategories: categories,
      preferredBrands: preferences.preferredBrands,
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
      enablePersonalization,
      showExplanations,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-6">
      <div className="flex items-center gap-3 border-b border-border pb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Sparkles className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-foreground">Recommendation Preferences</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Tune your personalization parameters and recommendation explanation display settings.
          </p>
        </div>
      </div>

      {savedSuccess && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-xs text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>Preferences saved successfully! Your recommendations feed will adapt automatically.</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 text-xs max-w-xl">
        {/* Toggle Personalization */}
        <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-background">
          <div className="space-y-0.5">
            <span className="font-bold text-foreground">Enable Personalized AI Recommendations</span>
            <p className="text-muted-foreground text-[11px]">
              Use browsing history and wishlist signals to personalize product rails.
            </p>
          </div>
          <input
            type="checkbox"
            checked={enablePersonalization}
            onChange={(e) => setEnablePersonalization(e.target.checked)}
            className="h-5 w-5 rounded border-input text-primary focus:ring-ring cursor-pointer"
          />
        </div>

        {/* Toggle Explanations */}
        <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-background">
          <div className="space-y-0.5">
            <span className="font-bold text-foreground">Show Recommendation Explanations</span>
            <p className="text-muted-foreground text-[11px]">
              Display reason tags (e.g. &quot;Similar category and price range&quot;) on product cards.
            </p>
          </div>
          <input
            type="checkbox"
            checked={showExplanations}
            onChange={(e) => setShowExplanations(e.target.checked)}
            className="h-5 w-5 rounded border-input text-primary focus:ring-ring cursor-pointer"
          />
        </div>

        {/* Preferred Categories */}
        <div className="space-y-2">
          <span className="font-bold text-foreground">Preferred Categories</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {CATEGORIES.map((cat) => {
              const isChecked = categories.includes(cat.slug);
              return (
                <label
                  key={cat.slug}
                  className={`flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer transition-all ${
                    isChecked
                      ? 'border-primary bg-primary/5 font-semibold text-primary'
                      : 'border-border bg-background text-muted-foreground hover:bg-accent'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleCategory(cat.slug)}
                    className="h-4 w-4 rounded border-input text-primary focus:ring-ring"
                  />
                  <span>{cat.label}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Price Bounds */}
        <div className="space-y-2">
          <span className="font-bold text-foreground">Preferred Price Bounds ($)</span>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label htmlFor="pref-min-price" className="text-[11px] text-muted-foreground">
                Minimum Price
              </label>
              <input
                id="pref-min-price"
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                placeholder="0"
                className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="pref-max-price" className="text-[11px] text-muted-foreground">
                Maximum Price
              </label>
              <input
                id="pref-max-price"
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="1000"
                className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring transition-colors shadow-xs"
          >
            <Save className="h-4 w-4" />
            <span>Save Preferences</span>
          </button>
        </div>
      </form>
    </div>
  );
}
