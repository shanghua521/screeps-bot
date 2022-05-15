class TowerTask {

  private room: Room
  private towers: StructureTower[]

  constructor() {
    this.room = Game.rooms['W28S22']
    this.towers = this.room.find(
      FIND_MY_STRUCTURES, { filter: { structureType: STRUCTURE_TOWER } });
  }
  private defendRoom(hostiles: Creep[]) {
    this.towers.forEach(tower => tower.attack(hostiles[0]))
  }

  private repairStructure() {
    let targets = this.room.find(FIND_STRUCTURES, {
      filter: object => object.hits < object.hitsMax && object.structureType != STRUCTURE_WALL && object.structureType != STRUCTURE_RAMPART
    });
    if (targets.length > 0) {
      targets.sort((a, b) => a.hits - b.hits);
      this.towers.forEach(tower => tower.repair(targets[0]))
    }
    return targets.length > 0
  }

  private repairMyCreep() {
    let targets = this.room.find(FIND_MY_CREEPS, {
      filter: object => object.hits < object.hitsMax
    });
    if (targets.length != 0) {
      targets.sort((a, b) => a.hits - b.hits);
      this.towers.forEach(tower => tower.heal(targets[0]))
    }
  }

  public work() {
    var hostiles = this.room.find(FIND_HOSTILE_CREEPS);
    if (hostiles.length > 0) {
      this.defendRoom(hostiles)
    } else {
      this.repairStructure() || this.repairMyCreep()
    }
  }
}

export default TowerTask