//================================================================================
//  @file         formValidationMachines.js
//  @version      0.0.1
//  @path         lib/
//  @description  Regras para validação de MACHINES
//  @author       MateusDeveloper
//  @contact      mateus.developer@gmail.com
//  @copyright    Copyright Mateus Cardoso Nunes
//================================================================================

Shower({
	name:"insertMachineForm",
	template:"formInsertMachine",
	fields: {
		machinename: {
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
	name:"updateMachineForm",
	template:"formUpdateMachine",
	fields: {
		machinename: {
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

/**/
Shower({
	name:"insertTypeMachineForm",
	template:"formInsertTypeMachine",
	fields: {
		description: {
			required: true,
			requiredMessage: " precisa ser preenchido!",
			message: "mínimo 3 caracteres e máximo 60.",
			rules: {
				maxLength: 60,
				minLength: 3
			},
		},
		info: {
			message: "mínimo 3 caracteres e máximo 60.",
			rules: {
				maxLength: 255,
				minLength: 3
			},
		},
	},
});


Shower({
	name:"updateTypeMachineForm",
	template:"formUpdateTypeMachine",
	fields: {
		description: {
			required: true,
			requiredMessage: " precisa ser preenchido!",
			message: "mínimo 3 caracteres e máximo 60.",
			rules: {
				maxLength: 60,
				minLength: 3
			},
		},
		info: {
			message: "mínimo 3 caracteres e máximo 255.",
			rules: {
				maxLength: 255,
				minLength: 3
			},
		},
	},
});