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
