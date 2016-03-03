//================================================================================
//  @file         formValidationsCompany.js
//  @version      0.0.1
//  @path         lib/
//  @description  Regras para validação de forms de Company. Edição e Inserção.
//  @author       Mateus Cardoso
//  @contact      mateus.developer@gmail.com
//  @copyright    Copyright Mateus Cardoso Nunes
//================================================================================

Shower({
	name: "insertCompanyForm",
	template: "formInsertCompany",
	fields: {
		name: {
			required : true,
			requiredMessage : "precisa ser preenchido!",
			message : "mínimo 3 letras e máximo 80.",
			rules: {
				maxLength: 80,
				minLength: 3
			},
		},
		cnpj: {
			required : true,
			requiredMessage : "precisa ser preenchido!",
			message : "formato inválido, preencha com apenas números.",
			format : /^([0-9]{2}[\.]?[0-9]{3}[\.]?[0-9]{3}[\/]?[0-9]{4}[-]?[0-9]{2})/,
		},
		contact: {
			required : true,
			requiredMessage : "precisa ser preenchido!",
			message : "mínimo 3 letras e máximo 50.",
			rules: {
				maxLength: 50,
				minLength: 3
			},
		},
		phone: {
			required : true,
			requiredMessage : "precisa ser preenchido!",
			message : "formato inválido, preencha com apenas números.",
			format : /^([\(][0-9]{2}[\)] ?[0-9]{4}[\-]?[0-9]{4})|([\(][0-9]{2}[\)] ?[0-9]{4}[\-]?[0-9]{5})$/,
		},
		email: {
			required : true,
			requiredMessage : "precisa ser preenchido!",
			message : "formato inválido.",
			format : "email",
			rules: {
				maxLength: 50,
				minLength: 3
			},
		},
		street: {
			required : true,
			requiredMessage : "precisa ser preenchido!",
			message : "mínimo 3 letras e máximo 100.",
			rules: {
				maxLength: 100,
				minLength: 3
			},
		},
		city: {
			required : true,
			requiredMessage : "precisa ser preenchido!",
			message : "mínimo 3 letras e máximo 50.",
			rules: {
				maxLength: 50,
				minLength: 3
			},
		},
		state: {
			required : true,
			requiredMessage : "precisa ser preenchido!",
			message : "mínimo 2 letras e máximo 50.",
			rules: {
				maxLength: 50,
				minLength: 2
			},
		},
		zipcode: {
			required : true,
			requiredMessage : "precisa ser preenchido!",
			format: /(^\d{5}$)|(^\d{5}-\d{4}$)|(([a-z0-9]{8})*$)/,
		},
		// master: {
		// 	required : true,
		// 	requiredMessage : "precisa ser preenchido!",
		// 	rules: {
		// 		maxLength: 100,
		// 		minLength: 3
		// 	},
		// },
	}
});


Shower({
	name: "updateCompanyForm",
	template: "formUpdateCompany",
	fields: {
		name: {
			required : true,
			requiredMessage : "precisa ser preenchido!",
			message : "mínimo 3 letras e máximo 80.",
			rules: {
				maxLength: 80,
				minLength: 3
			},
		},
		cnpj: {
			required : true,
			requiredMessage : "precisa ser preenchido!",
			message : "formato inválido, preencha com apenas números.",
			format : /^([0-9]{2}[\.]?[0-9]{3}[\.]?[0-9]{3}[\/]?[0-9]{4}[-]?[0-9]{2})/,
		},
		contact: {
			required : true,
			requiredMessage : "precisa ser preenchido!",
			message : "mínimo 3 letras e máximo 50.",
			rules: {
				maxLength: 50,
				minLength: 3
			},
		},
		phone: {
			required : true,
			requiredMessage : "precisa ser preenchido!",
			message : "formato inválido, preencha com apenas números.",
			format : /^([\(][0-9]{2}[\)] ?[0-9]{4}[\-]?[0-9]{4})|([\(][0-9]{2}[\)] ?[0-9]{4}[\-]?[0-9]{5})$/,
		},
		email: {
			required : true,
			requiredMessage : "precisa ser preenchido!",
			message : "formato inválido.",
			format : "email",
			rules: {
				maxLength: 50,
				minLength: 3
			},
		},
		street: {
			required : true,
			requiredMessage : "precisa ser preenchido!",
			message : "mínimo 3 letras e máximo 100.",
			rules: {
				maxLength: 100,
				minLength: 3
			},
		},
		city: {
			required : true,
			requiredMessage : "precisa ser preenchido!",
			message : "mínimo 3 letras e máximo 50.",
			rules: {
				maxLength: 50,
				minLength: 3
			},
		},
		state: {
			required : true,
			requiredMessage : "precisa ser preenchido!",
			message : "mínimo 2 letras e máximo 50.",
			rules: {
				maxLength: 50,
				minLength: 2
			},
		},
		zipcode: {
			required : true,
			requiredMessage : "precisa ser preenchido!",
			format: /(^\d{5}$)|(^\d{5}-\d{4}$)|(([a-z0-9]{8})*$)/,
		},
		// _idMasterCompany: {
		// 	required : true,
		// 	requiredMessage : "precisa ser preenchido!",
		// 	rules: {
		// 		maxLength: 100,
		// 		minLength: 3
		// 	},
		// },
	}
});