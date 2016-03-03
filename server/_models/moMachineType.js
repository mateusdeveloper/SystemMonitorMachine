//================================================================================
//  @file         moMachineType.js
//  @version      0.0.1
//  @path         server/_models
//  @description  Métodos para manipular a collection "MachineType"
//  @author       Mateus Cardoso
//  @contact      mateus.developer@gmail.com
//  @copyright    Copyright HydrBytes Technologies Corporation Ltda.
//================================================================================

if (Meteor.isServer) {

	Meteor.methods({


		/** insertMachineTypeMtd()
		*
		* @description Método para incluir novo usuário.
		* @param       n/d
		* @return      n/d
		*
		*/
		'insertMachineTypeMtd' : function(machineTypeData){
			try{
				if((machineTypeData.description != '')){

					/*define o novo código para o Dashboard*/
					var machineTypeObj = MachineType.findOne({},{sort: {dashcode: -1}});
					if((machineTypeObj == undefined) || (machineTypeObj == null)) {
						var newcode = 0;
					}else {
						var newcode = machineTypeObj.dashcode + 1;
					}

					/*Insere o novo tipo de máquina no Banco*/
					MachineType.insert({
						"description"	 : machineTypeData.description,
						"info"			   : machineTypeData.info,
						"dashcode"	   : newcode,
					});


					/*Adiciona as Companias no novo tipo de Máquina*/
					for(k = 0; k < machineTypeData.company.length; k++){
						var actualId = machineTypeData.company[k];
						MachineType.update({ dashcode: newcode },{
							$addToSet: {MasterCompany: actualId }
						});
					}

					/*Adiciona Profile nas Definitions no novo tipo de Máquina*/
					if(machineTypeData.profile != undefined){

						var values = [];
						var units  = [];
						var limits  = [];

						for(i = 0; i < machineTypeData.profile.length; i++){
							values.push(machineTypeData.profile[i][0]);
							units.push(machineTypeData.profile[i][1]);
							limits.push(machineTypeData.profile[i][2]);
						}
					}

					/*Adiciona Goal nas Definitions no novo tipo de Máquina*/
					if(machineTypeData.goal != undefined){

						var description = [];
						var value  = [];

						for(i = 0; i < machineTypeData.goal.length; i++){
							description.push(machineTypeData.goal[i][0]);
							value.push(machineTypeData.goal[i][1]);
						}
					}

					/*Adiciona Operadores nas Definitions no novo tipo de Máquina*/
					if(machineTypeData.operators != undefined){

						var roles = [];

						for(i = 0; i < machineTypeData.operators.length; i++){
							roles.push(machineTypeData.operators[i]);
						}
					}

					MachineType.update({ dashcode: newcode },{
						$set: {
							"Definitions": {
								"Profile": {
									"value" : values,
									"unit"  : units,
									"limit" : limits,
								},
								'Goals': {
									"description" : description,
									"value"  : value,
								},
								"Operators": {
									"roles" : roles,
								},
							},
						}
					});

					result = true;

				}else {
					result = false;
				}
			}catch(e){
				console.log(e);
			}
			return result;
		},


		/** updateTypeMachineMtd
		*
		* @description Método para update em tipo de máquina.
		* @param       n/d
		* @return      n/d
		*
		*/
		'updateTypeMachineMtd' : function(machineTypeData){
			try{
				if((machineTypeData.description != '')){
					MachineType.update({_id: machineTypeData._id},{
						$set: {
							"description"   : machineTypeData.description,
							"info"          : machineTypeData.info,
							"MasterCompany" : [],
						},
					});

					/*Adiciona as Companias no novo tipo de Máquina*/
					for(k = 0; k < machineTypeData.company.length; k++){
						var actualId = machineTypeData.company[k];
						MachineType.update({_id: machineTypeData._id},{
							$addToSet: {MasterCompany: actualId }
						});
					}

					/*Adiciona Profile nas Definitions no novo tipo de Máquina*/
					if(machineTypeData.profile != undefined){

						var values = [];
						var units  = [];
						var limits  = [];

						for(i = 0; i < machineTypeData.profile.length; i++){
							values.push(machineTypeData.profile[i][0]);
							units.push(machineTypeData.profile[i][1]);
							limits.push(machineTypeData.profile[i][2]);
						}
					}

					/*Adiciona Goal nas Definitions no novo tipo de Máquina*/
					if(machineTypeData.goal != undefined){

						var description = [];
						var value  = [];

						for(i = 0; i < machineTypeData.goal.length; i++){
							description.push(machineTypeData.goal[i][0]);
							value.push(machineTypeData.goal[i][1]);
						}
					}

					/*Adiciona Operadores nas Definitions no novo tipo de Máquina*/
					if(machineTypeData.operators != undefined){

						var roles = [];

						for(i = 0; i < machineTypeData.operators.length; i++){
							roles.push(machineTypeData.operators[i]);
						}
					}

					MachineType.update({_id: machineTypeData._id},{
						$set: {
							"Definitions": {
								"Profile": {
									"value" : values,
									"unit"  : units,
									"limit" : limits,
								},
								'Goals': {
									"description" : description,
									"value"  : value,
								},
								"Operators": {
									"roles" : roles,
								},
							},
						}
					});

					result = true;
				}else {
					result = false;
				}
			}catch(e){
				console.log(e);
			}
			return result;
		},


		/** deleteTypeMachineMtd()
		*
		* @description Função para deletar tipos de máquina pelo '_id'.
		* @param       n/d
		* @return      mensagem de sucesso/erro
		*
		*/
		'deleteTypeMachineMtd' : function(thisTypeMachine){
			try{
				if(thisTypeMachine != null) {
					MachineType.remove({_id: thisTypeMachine});
					result = true;
				}else {
					result = false;
				}
			}catch(e){
				console.log(e);
			}
			return result;
		},



	})
}