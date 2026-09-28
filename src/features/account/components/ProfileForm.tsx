'use client';

import { AlertCircle, CheckCircle2, UserCheck } from 'lucide-react';
import { useProfile } from '../hooks/use-profile';

export function ProfileForm() {
  const {
    name,
    setName,
    email,
    setEmail,
    phone,
    setPhone,
    isSubmitting,
    error,
    success,
    handleSubmit,
  } = useProfile();

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-6">
      <div>
        <h2 className="text-lg font-bold text-foreground">Profile Settings</h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Update your personal details and account contact information.
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-destructive/20 bg-destructive/10 p-3 text-xs text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-xs text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
        <div className="space-y-1.5">
          <label htmlFor="profile-name" className="text-xs font-semibold text-foreground">
            Full Name <span className="text-destructive">*</span>
          </label>
          <input
            id="profile-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="John Doe"
            className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="profile-email" className="text-xs font-semibold text-foreground">
            Email Address <span className="text-destructive">*</span>
          </label>
          <input
            id="profile-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="john.doe@example.com"
            className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="profile-phone" className="text-xs font-semibold text-foreground">
            Phone Number
          </label>
          <input
            id="profile-phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+1 (555) 000-0000"
            className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 transition-colors shadow-xs"
          >
            <UserCheck className="h-4 w-4" />
            <span>{isSubmitting ? 'Saving Changes...' : 'Save Profile'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
