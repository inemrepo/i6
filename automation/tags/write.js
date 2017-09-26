var i6 = global.automation;
i6.tag = typeof(i6.tag)=='undefined' ? {} : i6.tag;


i6.tag.writeToDevice = function(tagName, value){
    var devName = i6.tags[tagName].device;
    var dataType = i6.tags[tagName].dataType;
    var device = i6.devices[devName];
    device.writeToDevice(tagName, value);
};

function parse(type, value){
	var retval;
	switch(type){
		case 'bool' : 
		case 'bit' :
			retval = value ? true : false;
			break;
		case 'byte' :
		case 'int' :
		case 'uint' :
		case 'real' :
		case 'float' :
			retval = parseFloat(value);
			break;
	}
}