const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * Lấy lịch sử hoạt động của một user dựa trên userID
 * @param {number} userID 
 * @returns {object} Trả về object gồm: { user, controlsHistory }
 * @throws {Error} Ném lỗi "USER_NOT_FOUND" nếu không tìm thấy user
 */
// services/historyService.js
exports.getUserControlHistoryService = async (userID) => {
  /* 1. Kiểm tra người dùng */
  const user = await prisma.user.findUnique({ where: { userID } });
  if (!user) throw new Error("USER_NOT_FOUND");

  /* 2. Lấy dữ liệu song song cho nhanh */
  const [controls, warnings] = await Promise.all([
    prisma.controls.findMany({
      where: { userID },
      include: { device: true, sensor: true},
      orderBy: { timeSwitch: "desc" },        // không bắt buộc nhưng giúp slice/paginate
    }),
    prisma.warning.findMany({
      where: { userID }, 
      orderBy: { timeWarning: "desc" },
    }),
  ]);

  /* 3. Chuẩn hoá → gộp → sort */
  console.log(controls, warnings, "he;;p")
  const timeline = [
    ...controls.map(c => ({
      type: "CONTROL",               // để FE biết kiểu
      id:   c.controlID,
      time: c.timeSwitch,            // Date object hoặc string ISO
      data: c,                       // toàn bộ control record
    })),
    ...warnings.map(w => ({
      type: "WARNING",
      id:   w.warningID,
      time: w.timeWarning,
      data: w,
    })),
  ].sort((a, b) => new Date(b.time) - new Date(a.time)); // mới nhất trước
  // console.log(timeline)
  /* 4. Trả về */
  return { user, timeline };
};

