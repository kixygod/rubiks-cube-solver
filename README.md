# Rubiks Cube Assistant
Diploma project

## CSS Architecture
- **Typography**: Defined in `src/styles/typography.css` with responsive font sizes (`--font-size-h1` to `--font-size-xsmall`), font weights, and spacing variables (`--spacing-xs` to `--spacing-xl`).
- **Colors**: Defined in `src/styles/colors.css` with semantic variables (`--color-success-bg`, `--color-active-border`, etc.).
- **Global Styles**: `src/styles/global.css` applies typography rules for `h1`–`h6` and `p`, and imports `typography.css` and `colors.css`. `src/styles.css` handles CSS resets and font imports.
- **Type Safety**: `src/css.d.ts` declares CSS variables for TypeScript autocompletion and type checking.
- **Maintenance**: Update `css.d.ts` when adding new variables to `typography.css` or `colors.css`.
