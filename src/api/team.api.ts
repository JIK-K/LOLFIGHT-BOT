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
 * @팀명변경 아직미완
 * @param teamName
 */
export const patchTeam = async (teamName: string) => {
  try {
    const updatedUser = await prisma.team.update({
      where: {
        name: "teamName",
      },
      data: {
        name: "Updated Name",
      },
    });
    console.log("Updated user:", updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
  } finally {
    await prisma.$disconnect();
  }
};

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
