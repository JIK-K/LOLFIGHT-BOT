import { createFight } from "./fight/createFight";
import { finishFight } from "./fight/finishFight";
import { deleteFight } from "./fight/deleteFight";
import { createTeam } from "./team/createTeam";
import { deleteTeam } from "./team/deleteTeam";
const availableCommands = [
  createFight,
  finishFight,
  deleteFight,
  createTeam,
  deleteTeam,
];

export default availableCommands;
