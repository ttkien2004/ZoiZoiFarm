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
            sensorID: 3, //sensor của cảm biến độ ánh sáng có ID là 3 "Light Sensor"
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
            sensorID: 4, //sensor của cảm biến độ ẩm đất có ID là 4 "Soil Moisture Sensor"
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


// Lấy trạng thái máy bơm từ Adafruit IO (feed "maybom"), 
exports.getPumpAdafruitState = async (req, res) => {
    try {
      // Lấy pumpID từ URL param
      const { pumpID } = req.params;
  
      // Tìm pump trong DB
      const pump = await prisma.pump.findUnique({
        where: { pumpID: parseInt(pumpID) },
        include: { device: true }, // nếu cần thông tin device
      });
      if (!pump) {
        return res.status(404).json({ error: 'Không tìm thấy máy bơm!' });
      }
  
      // Gọi Adafruit IO, lấy 1 bản ghi mới nhất
      const response = await axiosClient.get('/maybom/data?limit=1');
      const feedData = response.data; // Mảng record, mỗi record có { value, created_at, ... }
      if (feedData.length === 0) {
        return res.status(200).json({ 
          pumpID: pumpID,
          state: null,
          message: 'Chưa có dữ liệu trên feed maybom' 
        });
      }
  
      // Lấy giá trị mới nhất
      const lastValue = feedData[0].value; // chuỗi "0" hoặc "1"
      let newState = 'off';
      if (lastValue === '1') newState = 'on';
  
      const updatedPump = await prisma.pump.update({
        where: { pumpID: parseInt(pumpID) },
        data: { state: newState }, // "on" hoặc "off"
      });
  
      return res.status(200).json({
        pumpID: pumpID,
        state: newState,
        message: 'Lấy trạng thái máy bơm thành công!',
      });
    } catch (error) {
      console.error('Lỗi khi lấy trạng thái máy bơm:', error);
      return res.status(500).json({ error: 'Không thể lấy trạng thái máy bơm.' });
    }
};

//Bật/tắt máy bơm thông qua Adafruit
exports.setPumpAdafruitState = async (req, res) => {
    try {
      const { pumpID } = req.params;
      const { state, userID } = req.body;
      
      // Kiểm tra pumpID
      const pump = await prisma.pump.findUnique({
        where: { pumpID: parseInt(pumpID) },
        include: { device: true }, 
      });
      if (!pump) {
        return res.status(404).json({ error: 'Không tìm thấy máy bơm!' });
      }
  
      // Kiểm tra state hợp lệ
      if (!['on', 'off', 'auto'].includes(state)) {
        return res.status(400).json({ error: 'Trạng thái không hợp lệ (on/off/auto)' });
      }
  
      // Chuyển state => giá trị feed
      let feedValue = '0';
      if (state === 'on') feedValue = '1';
      else if (state === 'auto') feedValue = '2'; 
  
      // Gửi POST lên feed "maybom"
      await axiosClient.post('/maybom/data', {
        value: feedValue
      });
  
      // Cập nhật DB
      const updatedPump = await prisma.pump.update({
        where: { pumpID: parseInt(pumpID) },
        data: { state },
      });
  
      const deviceID = pump.device?.deviceID; 
      if (userID) {
        await prisma.controls.create({
          data: {
            userID: parseInt(userID),
            deviceID: deviceID || null, // pumpID = deviceID
            timeSwitch: new Date(),
            action: `Cập nhật máy bơm ${pump.device?.deviceName || ''} thành ${state}`,
          }
        });
      }
  
      return res.status(200).json({
        message: `Đã cập nhật máy bơm sang trạng thái ${state}`,
        pump: updatedPump,
      });
    } catch (error) {
      console.error('Lỗi khi đặt trạng thái máy bơm:', error);
      return res.status(500).json({ error: 'Không thể đặt trạng thái máy bơm.' });
    }
};
