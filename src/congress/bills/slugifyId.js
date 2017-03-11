module.exports = function slugifyId(id) {
  return id.replace(/\./g, '').toLowerCase();
};
