/* global define module */
'use strict';

// String.prototype.repeat polyfill
if (!String.prototype.repeat) {
  String.prototype.repeat = function (count) { // eslint-disable-line no-extend-native
    var str = '' + this;
    count = Math.floor(count);
    var rpt = '';
    while (true) {
      if ((count & 1) === 1) {
        rpt += str;
      }
      count >>>= 1;
      if (count === 0) {
        break;
      }
      str += str;
    }
    return rpt;
  };
}

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD + global
    define(['validator'], function (validator) {
      return (root.dotifier = factory(validator));
    });
  } else if (typeof module === 'object' && module.exports) {
    // CJS + global
    module.exports = (root.dotifier = factory(require('validator')));
  } else {
    // global
    root.dotifier = factory(root.validator);
  }
}(this, function (validator) {
  var dotifier = {
    _binRep: function (n, slen) {
      // return capacity-padded binary representation of n
      n = n.toString(2);
      n = '0'.repeat(this._getCapacity(slen).toString(2).length - n.length) + n;
      return n;
    },
    _getCapacity: function (slen) {
      // return number of dot permutations for the given string length
      return (Math.pow(2, slen - 1) - 1);
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
      var local = email[0];

      if (n > this._getCapacity(local.length)) return null;

      // convert n to its capacity-padded binary representation
      n = this._binRep(n, local.length);

      // merge dots into local
      var result = '';
      for (var i = 0; i < local.length; i++) {
        result += local[i];
        if (n[i] === '1') {
          result += '.';
        }
      }

      // return the result as a valid email address
      return result + email[1];
    },
    decode: function (email) {
      if (!validator.isEmail(email)) return null;
      var local = this._splitMail(email)[0];
      // local length needs to be > 2 to contain anything
      if (local.length <= 2) return 0;

      var result = '';
      for (var i = 0; i < local.length - 1; i++) {
        if (validator.isAlpha(local[i])) {
          result += (local[i + 1] === '.') ? '1' : '0';
        }
      }
      return parseInt(result, 2);
    }
  };
  return dotifier;
}));
