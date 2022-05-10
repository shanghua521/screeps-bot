import RoleBuilder from "./RoleBuilder";
import RoleCarrier from "./RoleCarrier";
import RoleHarvester from "./RoleHarvester";
import RoleUpgrader from "./RoleUpgrader";

class JobFactory {

  static getJob(role: string) {
    switch (role) {
      case "harvester":
        return RoleHarvester.instance
      case "upgrader":
        return RoleUpgrader.instance
      case "builder":
        return RoleBuilder.instance
      case "carrier":
        return RoleCarrier.instance
      default:
        return RoleHarvester.instance
    }
  }
}
export default JobFactory