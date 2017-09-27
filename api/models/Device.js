/**
 * Device.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
  	name : {
  		type : "string",
  		required : true,
    	unique: true
  	},

  	description : {
  		type : "string"
  	},

    type: {
      required : true,
      model: 'driver',
      //via: 'device',
    },

  	host : {
  		type : "string",
  	},

  	port : {
  		type : "string",
  		required : true
  	},

  	node : {
  		type : "integer",
  		defaultsTo : 1  		
  	},

  	rack : {
  		type : "integer",
  		defaultsTo : 0
  	},

  	slot : {
  		type : "integer",
  		defaultsTo : 1
  	},

  	enabled : {
  		type : "boolean",
  		defaultsTo : false
  	},

  	tags : {
      // model : "tag"
  		collection : "tag",
  		via : "device",
      //dominant: true
  	},

    toJSON: function() {
        var obj = this.toObject();
        delete obj.createdAt;
        delete obj.updatedAt;
        return obj;
    }
  },
  //connection : "MySQL"
};

