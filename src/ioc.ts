import { CommandRegistry } from "./command/command-registry";
import { EnvironmentManager } from "./environment/environment-manager";
import type { Project } from "./project/project";
import { SettingsManager } from "./settings/settings-manager";

class Ioc {
  commandRegistry: CommandRegistry = new CommandRegistry();
  settingsManager: SettingsManager = new SettingsManager();
  environmentManager: EnvironmentManager = new EnvironmentManager();

  private _project?: Project;

  //The remaining containers are self-initialized
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
