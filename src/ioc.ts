import { CommandRegistry } from "./command-registry";
import type { Project } from "./project";

let commandRegistry: CommandRegistry = new CommandRegistry();
let project: Project;

class Ioc {
  //The remaining containers are self-initialized
  init(args: { project: Project }) {
    this.project = args.project;
  }

  /*
   * Command Registry
   */

  get commandRegistry(): CommandRegistry {
    return commandRegistry;
  }

  set commandRegistry(newCommandRegistry: CommandRegistry) {
    commandRegistry = newCommandRegistry;
  }

  /*
   * Project
   */

  get project(): Project {
    return project;
  }

  set project(newProject: Project) {
    project = newProject;
  }
}

export const ioc = new Ioc();
