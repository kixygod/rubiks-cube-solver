export {};

declare module '*.css' {
  interface IClassNames {
    [className: string]: string;
  }
  const classNames: IClassNames;
  export = classNames;
}

declare global {
  interface CSSStyleDeclaration {
    '--font-size-h1': string;
    '--font-size-h2': string;
    '--font-size-h3': string;
    '--font-size-p': string;
    '--font-size-small': string;
    '--font-size-xsmall': string;
    '--font-size-button': string;
    '--font-size-button-small': string;
    '--font-weight-bold': string;
    '--font-weight-regular': string;
    '--spacing-xs': string;
    '--spacing-sm': string;
    '--spacing-md': string;
    '--spacing-lg': string;
    '--spacing-xl': string;
    '--color-background-light': string;
    '--color-background-white': string;
    '--color-border-default': string;
    '--color-border-dark': string;
    '--color-border-gray': string;
    '--color-hover-light': string;
    '--color-success-bg': string;
    '--color-success-border': string;
    '--color-active-bg': string;
    '--color-active-border': string;
    '--color-text-dark': string;
    '--color-shadow-light': string;
    '--color-shadow-dark': string;
  }
}
