const formatDate = function dateFormate(date) {
  var updatedDate = new Date(date)
  updatedDate.setHours(updatedDate.getHours() + 5);
  updatedDate.setMinutes(updatedDate.getMinutes() + 30);
  return updatedDate;
}

module.exports = { formatDate }