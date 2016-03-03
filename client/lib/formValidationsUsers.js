//================================================================================
//  @file         formValidationUsers.js
//  @version      0.0.1
//  @path         lib/
//  @description  Regras para validação de USUÁRIOS
//  @author       MateusDeveloper
//  @contact      mateus.developer@gmail.com
//  @copyright    Copyright Mateus Cardoso Nunes
//================================================================================

Shower({
	name:"insertUserForm",
	template:"formInsertUser",
	fields:{
		name:{
			required	: true,
			requiredMessage : " precisa ser preenchido!",
			message: "mínimo 3 caracteres e máximo 60.",
			rules:{
				maxLength:60,
				minLength:3
			},
		},
		email:{
			required	: true,
			requiredMessage : " precisa ser preenchido!",
			message: " precisa ser preenchido corretamente!",
			format 		: "email",
		},
		passwordagain:{
			required	: true,
			requiredMessage : " precisa ser preenchido!",
			message		: " Senhas diferentes ou com menos de 4 caracteres!",
			rules:{
				maxLength:60,
				minLength:4
			},
		},
		password:{
			required	: true,
			requiredMessage : " precisa ser preenchido!",
			message		: " Senhas diferentes ou com menos de 4 caracteres!",
			rules: {
				equalsField: "passwordagain",
				maxLength:60,
				minLength:4
			},
		},
		role:{
			required: true,
			requiredMessage: " precisa ser preenchido!",
		},
	}
});

Shower({
	name:"updateUserForm",
	template:"formUpdateUser",
	fields:{
		name:{
			required	: true,
			requiredMessage : " precisa ser preenchido!",
			message: "mínimo 3 caracteres e máximo 60.",
			rules:{
				maxLength:60,
				minLength:3
			},
		},
		email:{
			required	: true,
			requiredMessage : " precisa ser preenchido!",
			message: " precisa ser preenchido corretamente!",
			format 		: "email",
		},
		role:{
			required: true,
			requiredMessage: " precisa ser preenchido!",
		},
	},
});

Shower({
	name:"updatePasswordForm",
	template:"sysInfoModal",
	fields:{
		actualPassword:{
			required	: true,
			requiredMessage : " precisa ser preenchido!",
			message		: " Mínimo de 4 caracteres!",
			rules:{
				maxLength:60,
				minLength:4
			},
		},
		newPassword:{
			required	: true,
			requiredMessage : " precisa ser preenchido!",
			message		: " Senhas diferentes ou com menos de 4 caracteres!",
			rules:{
				maxLength:60,
				minLength:4
			},
		},
		newPasswordAgain:{
			required	: true,
			requiredMessage : " precisa ser preenchido!",
			message		: " Senhas diferentes ou com menos de 4 caracteres!",
			rules: {
				equalsField: "newPassword",
				maxLength:60,
				minLength:4
			},
		},
	},
});