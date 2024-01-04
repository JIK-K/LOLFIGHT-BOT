import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * @내전생성
 * @param fightName
 * @param homeTeamName
 * @param awayTeamName
 * @param fightTime
 */
export const postFight = async (
  fightName: string,
  homeTeamName: string,
  awayTeamName: string,
  fightTime: Date,
  messageId: string
) => {
  try {
    const newFight = await prisma.fight.create({
      data: {
        name: fightName,
        homeTeam: homeTeamName,
        awayTeam: awayTeamName,
        fightTime: fightTime,
        messageId: messageId,
      },
    });
    console.log("Created Fight:", newFight);
  } catch (error) {
    console.error("Error creating Fight:", error);
  } finally {
    await prisma.$disconnect();
  }
};

/**
 * @내전조회
 * @param fightName
 */
export const getFight = async (fightName: string) => {
  try {
    const fight = await prisma.fight.findUnique({
      where: {
        name: fightName,
      },
    });

    console.log("Fight found by fightName:", fight);
    return fight;
  } catch (error) {
    console.error("Error fetching Fight by fightName:", error);
  } finally {
    await prisma.$disconnect();
  }
};

/**
 * @내전리스트조회
 */
export const getFightList = async () => {
  try {
    const fights = await prisma.fight.findMany();
    console.log("All fights:", fights);
  } catch (error) {
    console.error("Error fetching fights:", error);
  } finally {
    await prisma.$disconnect();
  }
};

/**
 * @내전승자
 * @param fightName
 */
export const patchFight = async (fightName: string) => {
  try {
    const fight = await prisma.fight.update({
      where: {
        name: fightName,
      },
      data: {
        status: "E",
      },
    });
    console.log("Fight found by fightName:", fight);
    return fight;
  } catch (error) {
    console.error("Error fetching Fight by fightName:", error);
  } finally {
    await prisma.$disconnect();
  }
};

/**
 * @내전삭제
 * @param fightName
 */
export const removeFight = async (fightName: string) => {
  try {
    const deletedFight = await prisma.fight.delete({
      where: {
        name: fightName,
      },
    });
    console.log("Deleted fight:", deletedFight);
  } catch (error) {
    console.error("Error deleting fight:", error);
  } finally {
    await prisma.$disconnect();
  }
};
