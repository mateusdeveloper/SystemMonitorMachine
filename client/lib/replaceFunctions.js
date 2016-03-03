//================================================================================
//  @file         replaceFunctions.js
//  @version      0.0.1
//  @path         lib/
//  @description  Retira pedaços de string para poder tratar ObjectIDs
//  @author       MateusCardoso
//  @contact      mateus.developer@gmail.com
//  @copyright    Copyright Mateus Cardoso Nunes
//================================================================================

removeObject = function(string){
	string = string.replace('ObjectID("', '');
		string = string.replace('")', '');
		return string;
	},

	checkToInt = function(check){
		if(check == true){
			return 1;
		}else{
			return 0;
		}
	}