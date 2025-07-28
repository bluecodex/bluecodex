import { ioc } from "../ioc";
import { ThemeClass } from "./theme-class";

/**
 * Override theme with custom parts
 */
export function theme(override: Partial<ThemeClass>) {
  const newTheme = new ThemeClass();
  Object.assign(newTheme, override);

  ioc.theme = newTheme;
}
