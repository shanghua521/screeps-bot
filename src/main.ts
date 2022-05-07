import { errorMapper } from './modules/errorMapper'
import { sayHello } from './modules/utils'
import roleHarvester from "./roleHarvester";
import roleUpgrader from "./roleUpgrader";

export const loop = errorMapper(() => {
  for (var name in Game.creeps) {
    var creep = Game.creeps[name];
    if (creep.memory.role == 'harvester') {
      roleHarvester.run(creep);
    }
    if (creep.memory.role == 'upgrader') {
      roleUpgrader.run(creep);
    }
  }
})