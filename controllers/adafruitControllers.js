const { fetchAndStoreTempDataService, fetchAndStoreHumdDataService, fetchAndStoreLuxDataService, fetchAndStoreSmoDataService } = require('../services/adafruitService');

// Get data from feed TEMP, sensorID=1
exports.fetchAndStoreTempData = async (req, res) => {
  try {
    const feedData = await fetchAndStoreTempDataService();
    return res.status(200).json({
      message: 'Lấy dữ liệu và lưu vào database thành công!',
      data: feedData,
    });
  } catch (error) {
    console.error('Lỗi khi lấy hoặc lưu dữ liệu:', error);
    return res
      .status(500)
      .json({ error: 'Có lỗi xảy ra khi lấy hoặc lưu dữ liệu.' });
  }
};

// Get data from feed HUMD, sensorID=2
exports.fetchAndStoreHumdData = async (req, res) => {
  try {
    const feedData = await fetchAndStoreHumdDataService();
    return res.status(200).json({
      message: 'Lấy dữ liệu humd và lưu vào database thành công!',
      data: feedData,
    });
  } catch (error) {
    console.error('Lỗi khi lấy hoặc lưu dữ liệu humd:', error);
    return res
      .status(500)
      .json({ error: 'Có lỗi xảy ra khi lấy hoặc lưu dữ liệu humd.' });
  }
};

// Get data from feed LUX, sensorID=3
exports.fetchAndStoreLuxData = async (req, res) => {
  try {
    const feedData = await fetchAndStoreLuxDataService();
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

// Get data from feed SOMO, sensorID=4
exports.fetchAndStoreSmoData = async (req, res) => {
  try {
    const feedData = await fetchAndStoreSmoDataService();
    return res.status(200).json({
      message: 'Lấy dữ liệu và lưu vào database thành công!',
      data: feedData,
    });
  } catch (error) {
    console.error('Lỗi khi lấy hoặc lưu dữ liệu somo:', error);
    return res
      .status(500)
      .json({ error: 'Có lỗi xảy ra khi lấy hoặc lưu dữ liệu somo.' });
  }
};
