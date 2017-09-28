module.exports = {
	auth : {
		postActions : {
			login : {
				/*
				'default' - digunakan untuk redirect ke halaman utama.
				'current' - digunakan untuk redirect ke halaman terakhir ketika diminta login
				*/
				success : 'current',

				failed : 'default'
			}
		}
	},

	securityLevel : {
		developer : 99,
		admin : 80,
		engineer : 70,
		operator : 10,
		guest : 0
	}
};



