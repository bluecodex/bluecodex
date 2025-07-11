import type { Project } from "./project/project";
import { Registry } from "./registry/registry";
import { Theme } from "./theme/theme";

class Ioc {
  registry: Registry = new Registry();
  theme: Theme = new Theme();

  private _project?: Project;

  // The remaining containers are self-initialized
  init(args: { project: Project }) {
    this.project = args.project;
  }

  get project() {
    if (!this._project) throw new Error("Project not defined on ioc");
    return this._project;
  }

  set project(newProject: Project) {
    this._project = newProject;
  }
}

export const ioc = new Ioc();

export function customTheme(themeClass: { new (): Theme }) {
  ioc.theme = new themeClass();
}
