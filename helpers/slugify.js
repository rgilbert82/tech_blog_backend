module.exports = function slugify(title) {
  var dateStr  = new Date().toLocaleString().replace(/\W/ig, '').toLowerCase();
  var newTitle = title.replace(/\W/ig, '-').toLowerCase();

  return newTitle + '-' + dateStr;
};
