interface FightData {
  [figntName: string]: {
    team1: string;
    team2: string;
    fightTime: number;
    messageId: string;
  };
}

class FightDataSingleton {
  private static instance: FightDataSingleton;
  private data: FightData;

  private constructor() {
    this.data = {};
  }

  static getInstance(): FightDataSingleton {
    if (!FightDataSingleton.instance) {
      FightDataSingleton.instance = new FightDataSingleton();
    }
    return FightDataSingleton.instance;
  }

  setData(fightName: string, value: any): void {
    this.data[fightName] = value;
  }
  getData(): FightData {
    return this.data;
  }
}
const fightDataInstance = FightDataSingleton.getInstance();

export { fightDataInstance };
