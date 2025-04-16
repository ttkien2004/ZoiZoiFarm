const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * Lấy lịch sử hoạt động của một user dựa trên userID
 * @param {number} userID 
 * @returns {object} Trả về object gồm: { user, controlsHistory }
 * @throws {Error} Ném lỗi "USER_NOT_FOUND" nếu không tìm thấy user
 */
exports.getUserControlHistoryService = async (userID) => {
  const user = await prisma.user.findUnique({
    where: { userID },
  });
  if (!user) {
    throw new Error("USER_NOT_FOUND");
  }

  // Lấy danh sách lịch sử hoạt động
  const controlsHistory = await prisma.controls.findMany({
    where: { userID },
    include: {
      device: true,
      sensor: true,
    },
    orderBy: {
      timeSwitch: "desc",
    },
  });

  return { user, controlsHistory };
};
