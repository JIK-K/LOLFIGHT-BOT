import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * @팀멤버생성
 * @param userName @param teamName
 */
export const postTeamMember = async (userName: string, teamName: string) => {
  try {
    const newTeam = await prisma.team_Member.create({
      data: {
        name: userName,
        teamName: teamName,
      },
    });
    console.log("Created Team-Member:", newTeam);
  } catch (error) {
    console.error("Error creating Team-Member:", error);
  } finally {
    await prisma.$disconnect();
  }
};

/**
 * @팀멤버조회
 * @param userName
 */
export const getTeamMember = async (userName: string) => {
  try {
    const team = await prisma.team_Member.findUnique({
      where: {
        name: userName,
      },
    });
    console.log("Team-Member found by name:", team);
    return team;
  } catch (error) {
    console.error("Error fetching team-member by name:", error);
  } finally {
    await prisma.$disconnect();
  }
};

/**
 * @팀멤버리스트조회
 */
export const getTeamMemberList = async () => {
  try {
    const teamMembers = await prisma.team_Member.findMany();
    console.log("All team-members:", teamMembers);
  } catch (error) {
    console.error("Error fetching team-members:", error);
  } finally {
    await prisma.$disconnect();
  }
};

/**
 * @팀멤버삭제
 * @param userName
 */
export const removeTeamMember = async (userName: string) => {
  try {
    const deletedTeam = await prisma.team_Member.delete({
      where: {
        name: userName,
      },
    });
    console.log("Deleted team-members:", deletedTeam);
  } catch (error) {
    console.error("Error deleting team-members:", error);
  } finally {
    await prisma.$disconnect();
  }
};
