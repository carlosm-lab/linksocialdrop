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
