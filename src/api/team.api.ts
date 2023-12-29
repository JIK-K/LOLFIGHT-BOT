import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * @팀생성
 * @param teamName
 */
export const postTeam = async (teamName: string) => {
  try {
    const newTeam = await prisma.team.create({
      data: {
        name: teamName,
      },
    });
    console.log("Created Team:", newTeam);
  } catch (error) {
    console.error("Error creating Team:", error);
  } finally {
    await prisma.$disconnect();
  }
};

/**
 * @팀조회
 * @param teamName
 */
export const getTeam = async (teamName: string) => {
  try {
    const team = await prisma.team.findUnique({
      where: {
        name: teamName,
      },
    });
    console.log("Team found by name:", team);
  } catch (error) {
    console.error("Error fetching team by name:", error);
  } finally {
    await prisma.$disconnect();
  }
};

/**
 * @팀리스트조회
 */
export const getTeamList = async () => {
  try {
    const teams = await prisma.team.findMany();
    console.log("All teams:", teams);
  } catch (error) {
    console.error("Error fetching teams:", error);
  } finally {
    await prisma.$disconnect();
  }
};

/**
 * @팀인원증가
 * @param teamName
 */
export const patchPlusTeamMember = async (teamName: string) => {
  try {
    const updatedTeam = await prisma.team.update({
      where: {
        name: teamName,
      },
      data: {
        numberMembers: {
          increment: 1,
        },
      },
    });
    console.log("Updated team number members:", updatedTeam);
  } catch (error) {
    console.error("Error updating team number members:", error);
  } finally {
    await prisma.$disconnect();
  }
};

/**
 * @팀인원감소
 * @param teamName
 */
export const patchSubtractTeamMember = async (teamName: string) => {
  try {
    const updatedTeam = await prisma.team.update({
      where: {
        name: teamName,
      },
      data: {
        numberMembers: {
          decrement: 1,
        },
      },
    });
    console.log("Updated team number members:", updatedTeam);
  } catch (error) {
    console.error("Error updating team number members:", error);
  } finally {
    await prisma.$disconnect();
  }
};

/**
 * @팀삭제
 * @param teamName
 */
export const removeTeam = async (teamName: string) => {
  try {
    const deletedTeam = await prisma.team.delete({
      where: {
        name: teamName,
      },
    });
    console.log("Deleted team:", deletedTeam);
  } catch (error) {
    console.error("Error deleting team:", error);
  } finally {
    await prisma.$disconnect();
  }
};
