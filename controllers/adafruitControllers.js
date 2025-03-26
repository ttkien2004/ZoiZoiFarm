const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const axiosClient = require('./../axiosConfig/axiosConfig');


// Lấy dữ liệu từ feed "TEMP" của Adafruit IO và lưu vào bảng data
exports.fetchAndStoreTempData = async (req, res) => {
    try {
      const response = await axiosClient.get('/temp/data?limit=1');
      const feedData = response.data; 
      
      // Lặp qua từng bản ghi và lưu vào bảng data của database qua Prisma
      for (const record of feedData) {
        const value = parseFloat(record.value);
        const dataTime = new Date(record.created_at);
        
        await prisma.data.create({
          data: {
            sensorID: 1, //sensor của cảm biến nhiệt độ có ID là 1 "Temperature & Humidity Sensor"
            dataTime: dataTime,
            value: value,
          },
        });
      }
      
      return res.status(200).json({ message: 'Lấy dữ liệu và lưu vào database thành công!', data: feedData });
    } catch (error) {
      console.error('Lỗi khi lấy hoặc lưu dữ liệu:', error);
      return res.status(500).json({ error: 'Có lỗi xảy ra khi lấy hoặc lưu dữ liệu.' });
    }
  };

// Lấy dữ liệu từ feed "HUMD" của Adafruit IO và lưu vào bảng data
exports.fetchAndStoreHumdData = async (req, res) => {
    try {
      const response = await axiosClient.get('/humd/data?limit=1');
      const feedData = response.data; // Mảng các record
  
      // Lặp qua từng bản ghi và lưu vào bảng data của database qua Prisma
      for (const record of feedData) {
        const value = parseFloat(record.value);
        const dataTime = new Date(record.created_at);
  
        await prisma.data.create({
          data: {
            sensorID: 2, //sensor của cảm biến độ ẩm không khí có ID là 2 "Temperature & Humidity Sensor"
            dataTime: dataTime,
            value: value,
          },
        });
      }
  
      return res.status(200).json({
        message: 'Lấy dữ liệu humd và lưu vào database thành công!', data: feedData,});
    } catch (error) {
      console.error('Lỗi khi lấy hoặc lưu dữ liệu humd:', error);
      return res
        .status(500)
        .json({ error: 'Có lỗi xảy ra khi lấy hoặc lưu dữ liệu humd.' });
    }
  };

// Lấy dữ liệu từ feed "LUX" của Adafruit IO và lưu vào bảng data
exports.fetchAndStoreLuxData = async (req, res) => {
    try {
      const response = await axiosClient.get('/lux/data?limit=1');
      const feedData = response.data; 
  
      for (const record of feedData) {
        const value = parseFloat(record.value);
        const dataTime = new Date(record.created_at);
  
        await prisma.data.create({
          data: {
            sensorID: 3, //sensor của cảm biến độ anh sang có ID là 3 "Light Sensor"
            dataTime: dataTime,
            value: value,
          },
        });
      }
  
      return res.status(200).json({
        message: 'Lấy dữ liệu lux và lưu vào database thành công!',
        data: feedData,
      });
    } catch (error) {
      console.error('Lỗi khi lấy hoặc lưu dữ liệu lux:', error);
      return res
        .status(500)
        .json({ error: 'Có lỗi xảy ra khi lấy hoặc lưu dữ liệu lux.' });
    }
  };

// Lấy dữ liệu từ feed "LUX" của Adafruit IO và lưu vào bảng data
exports.fetchAndStoreSmoData = async (req, res) => {
try {
    const response = await axiosClient.get('/somo/data?limit=1');
    const feedData = response.data; 

    for (const record of feedData) {
    const value = parseFloat(record.value);
    const dataTime = new Date(record.created_at);

    await prisma.data.create({
        data: {
        sensorID: 4, //sensor của cảm biến độ ẩm dat có ID là 4 "Soil Moisture Sensor"
        dataTime: dataTime,
        value: value,
        },
    });
    }

    return res.status(200).json({
    message: 'Lấy dữ liệu và lưu vào database thành công!',
    data: feedData,
    });
} catch (error) {
    console.error('Lỗi khi lấy hoặc lưu dữ liệu smo:', error);
    return res
    .status(500)
    .json({ error: 'Có lỗi xảy ra khi lấy hoặc lưu dữ liệu smo.' });
}
};