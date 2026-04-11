# Component Registry

This file serves as the Single Source of Truth for all UI components extracted and built by AI agents.
**CRITICAL RULE:** Every time a new component is created or imported from prototypes, you MUST document it here.

## Template for new components:

### `<ComponentName />`

**Path:** `src/components/...`
**Description:** Brief explanation of what it does and its visual state.

**Props:**

- `propName` (`type`): Description of the prop.

**Example Usage:**

```tsx
import { ComponentName } from "@/components/ComponentName";

<ComponentName propName="value" />;
```

---

## Registered Components

_(Add new components below this line)_

### `<LanguageSwitcher />`

**Path:** `src/components/shared/LanguageSwitcher.tsx`
**Description:** Client component that renders a pill-style ES/EN toggle for switching the active locale. The active locale button gets a highlighted accent background. Uses `next-intl` navigation to swap the locale while preserving the current path.

**Props:** None

**Example Usage:**

```tsx
import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher";

<LanguageSwitcher />;
```

**Used in:** `TopAppBar`

---

### `<Icon />`

**Path:** `src/components/ui/icon.tsx`
**Description:** Universal icon component powered by Lucide React. Resolves a string name (legacy Material Symbol names or Lucide names) to a Lucide SVG component via the registry at `src/lib/icons.ts`. Uses `width: 1em; height: 1em` by default so it inherits size from Tailwind text utilities (`text-2xl`, `text-sm`, etc.).

**Props:**

- `name` (`string`): Icon name — accepts legacy Material Symbol names (e.g., `"visibility"`, `"keyboard_arrow_up"`) and standard Lucide names (e.g., `"eye"`, `"chevron-up"`). Falls back to `Link` icon if not found.
- `size?` (`number`): Explicit size in pixels. Overrides CSS-based sizing.
- `className?` (`string`): Passed to the wrapping `<span>`.
- `style?` (`CSSProperties`): Passed to the wrapping `<span>`.

**Example Usage:**

```tsx
import { Icon } from "@/components/ui/icon";

<Icon name="link" className="text-2xl text-cyan-400" />
<Icon name="settings" size={20} />
<Icon name="visibility" className="text-primary-container" />
```

**Used in:** Landing page, BottomNavBar, TopAppBar, LinksClient, AppearanceClient, PublicLinkItem, Analytics, Admin, Sandbox

---

### `<ExportCsvButton />`

**Path:** `src/components/analytics/ExportCsvButton.tsx`
**Description:** Client component that generates and triggers a CSV file download containing the user's analytics summary (views, clicks, CTR) and link performance leaderboard. The CSV is UTF-8 encoded with BOM for Excel compatibility.

**Props:**

- `label` (`string`): The button text label (i18n-driven).
- `views` (`number`): Total page views count.
- `clicks` (`number`): Total unique clicks count.
- `ctr` (`string`): CTR average percentage as a string.
- `leaderboard` (`{ id: string; title: string; clicks: number }[]`): Array of link performance data for the leaderboard section.

**Example Usage:**

```tsx
import { ExportCsvButton } from "@/components/analytics/ExportCsvButton";

<ExportCsvButton
  label="Export"
  views={1234}
  clicks={567}
  ctr="45.9"
  leaderboard={[{ id: "1", title: "My Link", clicks: 42 }]}
/>;
```

**Used in:** Analytics dashboard page

---

### `<OnboardingFlow />`

**Path:** `src/components/OnboardingFlow.tsx`
**Description:** Full 3-step animated onboarding. Step 0 = Welcome screen. Step 1 = Username with real-time availability debounce API check. Step 2 = Avatar upload + display name + 150-char bio counter. Step 3 = First link with auto social-network icon detection. Finishes with particle-burst celebration screen.

**Props:** none (uses `useAction(completeOnboarding)` internally)

**Example Usage:**

```tsx
import { OnboardingFlow } from "@/components/OnboardingFlow";
<OnboardingFlow />;
```

---

### `<LivePreview />`

**Path:** `src/components/shared/LivePreview.tsx`
**Description:** Sticky phone-frame mockup rendered in the dashboard. Respects all 6 button styles (pill/rounded/square/glassmorphism/neon/outline), applies dynamic fontFamily from CSS variables, and shows per-link custom bg_color/text_color overrides with automatic contrast calculation.

**Props:**

- `profile` (`Partial<ProfileRow> | null`): User profile data.
- `links` (`Partial<LinkRow>[] | null`): Active links to render.

**Example Usage:**

```tsx
<LivePreview profile={profile} links={links} />
```

---

### `<LinksClient />`

**Path:** `src/app/[locale]/dashboard/links/LinksClient.tsx`
**Description:** Full link management UI. Includes drag-and-drop with DND Kit + spring animations, Framer Motion animated create/edit modal with dark overlay, per-link color customization with collapsible section, animated FAB with 45° rotation on open, profile URL bar with copy + live-view buttons, delete confirmation dialog.

**Props:**

- `initialLinks` (`LinkItem[]`): Server-fetched links array.
- `profile` (`{ username: string|null; ... }`): Used for profile URL bar.

---

### `<AppearanceClient />`

**Path:** `src/app/[locale]/dashboard/appearance/AppearanceClient.tsx`
**Description:** Full appearance settings form. Features: 8 typography options with live font family preview, 6 button styles with visual shape previews, 150-char bio counter with color-coded warnings, auto-save indicator, animated username status feedback, accent color presets + custom picker.

**Props:**

- `initialProfile` (`Profile`): Hydrated profile from the server.

---

### `<MarketplaceClient />`

**Path:** `src/app/[locale]/dashboard/marketplace/MarketplaceClient.tsx`
**Description:** Premium marketplace client with filter pills, animated grid, mini phone mockup previews, apply/buy buttons, and active state indicators. Handles theme application logic.

**Props:**

- `themes` (`ThemeRow[]`): List of active marketplace themes.
- `userThemes` (`{ theme_id: string; is_active: boolean }[]`): Array of theme IDs owned by the user.
- `activeThemeId` (`string | null`): Currently active theme ID.

---

### `<AdminThemesClient />`

**Path:** `src/app/[locale]/admin/temas/AdminThemesClient.tsx`
**Description:** Admin dashboard panel for creating, editing, and managing marketplace themes. Features a CRUD modal for themes including JSON config editing.

**Props:**

- `themes` (`ThemeRow[]`): List of all marketplace themes regardless of active status.
- `themeUserCounts` (`Record<string, number>`): Map of theme ID to number of users currently using it.
