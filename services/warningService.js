const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getAllWarningsService = async (userID) => {
  const warnings = await prisma.warning.findMany({
    where: {userID},
  });
  return warnings;
};

exports.createWarningService = async ({ message, sensorID, date }) => {
  const parsedDate = new Date(date);
  const newWarning = await prisma.warning.create({
    data: {
      sensorID,
      message,
      timeWarning: parsedDate,
    },
  });
  return newWarning;
};

exports.deleteWarningService = async (warningID) => {
  const warningIdParsed = Number(warningID);
  const delWarning = await prisma.warning.delete({
    where: { warningID: warningIdParsed },
  });
  return delWarning;
};
