const { getAllWarningsService, createWarningService, deleteWarningService
  } = require("../services/warningService");
  
//Get all warning of a user
  exports.getAllWarnings = async (req, res) => {
	try {
	  const userID = req.userID; 
	  const warnings = await getAllWarningsService(userID);
	  return res.status(200).json({
		msg: "Get all warnings successfully",
		data: warnings
	  });
	} catch (err) {
	  console.error(err);
	  return res.status(400).json({ msg: "Get warnings failed" });
	}
  };
  
//Create a new warning
  exports.createWarning = async (req, res) => {
	const { message, sensorID, date } = req.body;
	try {
	  const newWarning = await createWarningService({ message, sensorID, date });
	  res.status(201).json({
		msg: "Create warning successfully",
		data: newWarning
	  });
	} catch (err) {
	  console.error(err.message);
	  res.status(400).json({ msg: "Create warning failed", error: err.message });
	}
  };
  
//Delete a warning
  exports.deleteWarning = async (req, res) => {
	try {
	  // Lấy warningId từ query
	  const { warningId } = req.query;
	  const delWarning = await deleteWarningService(warningId);
	  if (delWarning) {
		return res.status(200).json({ msg: "Delete warning successfully" });
	  }
	} catch (err) {
	  console.error(err);
	  res.status(400).json({ msg: "Delete warning failed" });
	}
  };
  