import { errorMapper } from './modules/errorMapper'
import MyCreep from './MyCreep';
import JobFactory from './JobFactory';
import SpawnTask from './SpawnTask'
import TowerTask from './TowerTask';

function dealMemory() {
  for (const name in Memory.creeps) {
    if (!Game.creeps[name]) {
      delete Memory.creeps[name]
    }
  }
}

//  Game.spawns['Spawn1'].spawnCreep( [WORK,WORK, CARRY,CARRY,MOVE, MOVE,MOVE], 'builder0',     { memory: { role: 'builder' } } );
export const loop = errorMapper(() => {
  if (Game.time % 1000 == 0) dealMemory()
  for (let name in Game.creeps) {
    let creep = Game.creeps[name];
    let myCreep = new MyCreep(creep)
    myCreep.creepLogic = JobFactory.getJob(creep.memory.role)
    myCreep.work()
  }

  new SpawnTask().work()
  new TowerTask().work()
})