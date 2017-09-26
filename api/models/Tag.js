/**
 * Tag.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
  	name : {
  		type : "string",
  		required : true,
  		unique : true
  	},

  	device : {
      model : "device",
      required : true
  	},

  	address : {
  		type : "string",
  		required : true
  	},

    description : {
      type : "string"
    },

    min : {
      type : "float"
    },

    max : {
      type : "float"
    },

    lo_lim : {
      type : "float"
    },
    
    hi_lim : {
      type : "float"
    },

    value : {
      type : "string"
    },

    status : {
      type : "string"
    },

    timestamp : {
      column : "updatedAt"
    }
        
  }
};

