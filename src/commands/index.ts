import { createFight } from "./fight/createFight";
import { finishFight } from "./fight/finishFight";
import { deleteFight } from "./fight/deleteFight";
import { createTeam } from "./team/createTeam";
const availableCommands = [createFight, finishFight, deleteFight, createTeam];

export default availableCommands;
