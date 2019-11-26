module.exports = {
    inc:  function(value, options)
    {
        return parseInt(value) + 1;
    },
    ifCond: function(v1, v2,options) {
        if(String(v1) === String(v2)) {
          return options.fn(this);
        }
        return options.inverse(this);
    },
  }