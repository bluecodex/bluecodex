import type { Project } from "./project/project";
import { Registry } from "./registry/registry";
import { ThemeClass } from "./theme/theme-class";

class Ioc {
  registry: Registry = new Registry();
  theme: ThemeClass = new ThemeClass();

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
