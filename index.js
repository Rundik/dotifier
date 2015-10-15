var validator = require('validator');

module.exports = {
  _binRep: function (n, m) {
    // return capacity-padded binary representation of n
    n = n.toString(2);
    n = '0'.repeat(this._getCapacity(m.length).toString(2).length - n.length) + n;
    return n;
  },
  _getCapacity: function (m) {
    // return number of dot permutations for the given string length
    return (Math.pow(2, m - 1) - 1);
  },
  _splitMail: function (email) {
    // split email address into local and @domain parts
    return [email.slice(0, email.indexOf('@')), email.slice(email.indexOf('@'))];
  },
  encode: function (email, n) {
    if (!validator.isEmail(email)) return null;
    if (!validator.isInt(n)) return null;
    if (n === 0) return email;
    if (n < 0) return null;

    email = this._splitMail(email);
    // m = local part of email address
    var m = email[0];

    if (n > this._getCapacity(m.length)) return null;

    // convert n to its capacity-padded binary representation
    n = this._binRep(n, m);

    // merge dots into m
    var result = '';
    for (var i = 0; i < m.length; i++) {
      result += m[i];
      if (n[i] === '1') {
        result += '.';
      }
    }

    // return the result as a valid email address
    return result + email[1];
  }
};