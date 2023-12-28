import { createFight } from "./fight/createFight";
import { finishFight } from "./fight/finishFight";
import { deleteFight } from "./fight/deleteFight";
import { createTeam } from "./team/createTeam";
import { deleteTeam } from "./team/deleteTeam";
import { inviteTeam } from "./team/inviteTeam";
import { leaveTeam } from "./team/leaveTeam";

const availableCommands = [
  createFight,
  finishFight,
  deleteFight,
  createTeam,
  deleteTeam,
  inviteTeam,
  leaveTeam,
];

export default availableCommands;
