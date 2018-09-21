exports.sendOK = function(res, data={}) {
  return res.status(200).send({
    success: true,
    data
  });
};

exports.sendCreated = function(res, data={}) {
  return res.status(201).send({
    success: true,
    data
  });
};

exports.sendNoContent = function(res) {
  return res.status(201).send({
    success: false,
    message: "Data not Found"
  });
};

exports.sendBadRequest = function(res, message) {
  return res.status(400).send({
    success: false,
    message
  });
};

exports.sendUnauthorized = function(res, message) {
  return res.status(401).send({
    success: false,
    message
  });
};

exports.sendForbidden = function(res) {
  return res.status(403).send({ 
    success: false,
    message: 'You do not have rights to access this resource.'
  });
};

exports.sendNotFound = function(res) {
  return res.status(404).send({
    success: false,
    message: 'Resource not found.'
  });
};

exports.sendError = function(res, err) {
  return res.status(500).send({
    success: false,
    message: err.message
  });
};

exports.setHeadersForCORS = function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, X-Access-Token, Content-Type, Accept");
  next();
}
