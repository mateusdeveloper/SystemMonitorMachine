//================================================================================
//  @file         formValidationDevices.js
//  @version      0.0.1
//  @path         lib/
//  @description  Regras para validação de DEVICES
//  @author       MateusDeveloper
//  @contact      mateus.developer@gmail.com
//  @copyright    Copyright Mateus Cardoso Nunes
//================================================================================

Shower({
	name:"insertDeviceForm",
	template:"formInsertDevice",
			fields: {
				_id: {
					required: true,
					requiredMessage: " precisa ser preenchido!",
				},
				_idMachine: {
					required: true,
					requiredMessage: " precisa ser preenchido!",
				},
				name: {
					required: true,
					requiredMessage: " precisa ser preenchido!",
					message: "mínimo 3 caracteres e máximo 60.",
					rules: {
						maxLength: 60,
						minLength: 3
					},
				},
		},
});

Shower({
	name:"updateDeviceForm",
	template:"formUpdateDevice",
	fields: {
				_id: {
					required: true,
					requiredMessage: " precisa ser preenchido!",
				},
				_idMachine: {
					required: true,
					requiredMessage: " precisa ser preenchido!",
				},
				name: {
					required: true,
					requiredMessage: " precisa ser preenchido!",
					message: "mínimo 3 caracteres e máximo 60.",
					rules: {
						maxLength: 60,
						minLength: 3
					},
				},
		},
});