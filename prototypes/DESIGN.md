```markdown
# Design System: The Digital Manager

## 1. Overview & Creative North Star

The "Digital Manager" is the driving philosophy behind this design system. We are moving away from the "link-in-bio" template fatigue—characterized by rigid boxes and cluttered lists—and moving toward a high-end editorial experience. 

This system treats digital real estate like a premium gallery space. We utilize **intentional asymmetry**, where content isn't always centered or perfectly balanced, creating a sense of professional, human-led curation. By leveraging the extreme contrast between the `display-lg` typography and generous white space (using the `20` and `24` spacing tokens), we create an interface that feels like a physical lookbook rather than a mobile app.

**Key Principles:**
*   **Aural Depth:** Using tonal layers instead of lines to define space.
*   **Editorial Authority:** High-contrast type scales that demand attention.
*   **Luminous Interaction:** Using the Electric Teal (`primary_container`) as a light source, not just a color.

---

## 2. Colors & Surface Architecture

The palette is rooted in deep, obsidian slates to provide a sophisticated canvas for the Electric Teal accents.

### The "No-Line" Rule
**Explicit Instruction:** Designers are prohibited from using 1px solid borders to section content. Boundaries must be defined through background shifts. For example, a card should be `surface_container_low` sitting on a `surface` background. If you feel the need for a line, use whitespace (`spacing-3`) instead.

### Surface Hierarchy & Nesting
We treat the UI as a series of nested, physical layers. 
*   **Base Layer:** `surface` (#111316) for the overall page background.
*   **Sectioning:** Use `surface_container_low` for large content blocks.
*   **Interactive Elements:** Use `surface_container_high` or `highest` for cards that require user engagement.
*   **The Glass Rule:** For floating navigation or modal overlays, use `surface_container` at 70% opacity with a `24px` backdrop blur. This allows the "soul" of the background gradients to bleed through, maintaining a premium feel.

### Signature Textures
Avoid flat Teal blocks. Instead, use a subtle "Luminous Gradient" for primary CTAs: 
*   **Linear Gradient (135deg):** `primary_fixed` (#63f7ff) to `primary_container` (#00F5FF). This creates a sense of internal glow rather than a 2000s-style bevel.

---

## 3. Typography

The typography strategy relies on the tension between the geometric authority of **Epilogue** and the functional clarity of **Inter**.

*   **Display & Headline (Epilogue):** These are your "Editorial Voice." Use `display-lg` for names or primary brand statements. Tighten the letter-spacing (tracking) by -2% to -4% for a custom, "high-fashion" look.
*   **Title & Body (Inter):** These are your "Information Layer." Use `body-lg` for descriptions. Always ensure a minimum of `1.5` line-height to maintain the "high-end" airy feel.
*   **Label (Inter):** Used for metadata or small tags. These should always be in `label-md` or `label-sm` with increased letter-spacing (+5%) to ensure readability against dark backgrounds.

---

## 4. Elevation & Depth

We eschew traditional "Drop Shadows" in favor of **Tonal Layering**.

*   **The Layering Principle:** To lift a card, move it from `surface_container_low` to `surface_container_highest`. The eye perceives the shift in value as a shift in physical height.
*   **Ambient Shadows:** If an element must float (like a persistent "Add Link" button), use a shadow color derived from `surface_container_lowest` at 40% opacity, with a `blur` of `32px` and a `y-offset` of `12px`. It should feel like an atmospheric hum, not a hard edge.
*   **The Ghost Border Fallback:** If accessibility requirements demand a container edge, use the `outline_variant` token at **15% opacity**. This provides a "suggestion" of a border without breaking the editorial flow.

---

## 5. Components

### Buttons
*   **Primary:** Solid fill using the "Luminous Gradient" (Teal). Text is `on_primary_fixed`. Roundedness: `full`. No border.
*   **Secondary:** `surface_container_highest` fill with `primary` text. This creates a high-contrast but "quiet" interaction.
*   **Tertiary:** Transparent background, `primary` text, with a `sm` (0.25rem) bottom border that only spans 50% of the text width—an editorial underline.

### Cards & Lists
*   **Constraint:** Zero dividers. 
*   **Structure:** Use `spacing-6` between list items. Use a `surface_container_low` background for the entire list area and `surface_container_highest` for the individual active items.
*   **Roundedness:** All cards must use `xl` (1.5rem) corner radius to soften the "Brutalist" typography.

### Input Fields
*   **Style:** Minimalist underline style or "Soft Box." 
*   **Default:** `surface_container_low` background, `none` border, `md` roundedness.
*   **Active State:** The background remains, but a 1px "Ghost Border" of `primary` appears at 40% opacity.

### Signature Component: "The Spotlight Card"
A special component for featured links. It uses a `surface_container_highest` background with a soft, 5% opacity radial gradient of `primary_container` in the top-right corner, mimicking a physical light source hitting the card.

---

## 6. Do's and Don'ts

### Do:
*   **Use Asymmetric Padding:** Try `spacing-8` on the left and `spacing-12` on the right for headline containers to create an editorial rhythm.
*   **Embrace the Teal:** Use `primary_container` for icons and interactive states to guide the eye through the dark UI.
*   **Respect the "Breath":** If a screen feels crowded, increase the spacing tokens rather than shrinking the font.

### Don't:
*   **Don't use Pure Black:** Always use `surface` (#111316). Pure black (#000000) kills the "depth" effect of the slate tones.
*   **Don't use Purple:** Even in gradients. Stick to Teal and Slate/Charcoal transitions.
*   **Don't use Standard Grids:** Avoid centering everything. Align text to the left and allow imagery or "Glass" elements to overlap container edges using negative margins.