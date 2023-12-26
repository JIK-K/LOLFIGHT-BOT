import { createFight } from "./fight/createFight";
import { finishFight } from "./fight/finishFight";
import { deleteFight } from "./fight/deleteFight";
import { createTeam } from "./team/createTeam";
import { deleteTeam } from "./team/deleteTeam";
import { inviteTeam } from "./team/inviteTeam";
const availableCommands = [
  createFight,
  finishFight,
  deleteFight,
  createTeam,
  deleteTeam,
  inviteTeam,
];

export default availableCommands;
