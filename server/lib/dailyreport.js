//================================================================================
//  @file         dailyreport.js
//  @version      0.0.1
//  @path         server/
//  @description  Faz o relatório diário
//  @author       MateusDeveloper
//  @contact      mateus.developer@gmail.com
//  @copyright    Copyright HydrBytes Technologies Corporation Ltda.
//================================================================================

if (Meteor.isServer) {

  /** dailyreport()
	*
	* @description Cria os relatorios diariamente a meia noite!
 	*
 	*/

 	dailyreport = function () {
 		console.log("Call ---------> dailyreport()");
    Meteor.setTimeout(dailyreport, 3600000); //1000 = 1s => Executado a cada 1h
    var now = moment.utc().hour();
    var unixNow = moment.utc().unix();

    var idType = EventType.findOne({type: "DailyReport"});

  	//Se é meia noite (3am UTC)
  	if(now == 2){
  		var devicesStorage = Devices.find({sysstatus: {$in: [0, 1, 2]}}).fetch();

      //Percorre o array para cada Dispositivo
      for(i = 0; i < devicesStorage.length; i++) {
       if(devicesStorage[i]._idMachine !== null){
  				//Pega a máquina associada com o dispositivo atual
  				var thisMachine = Machines.findOne({_id: devicesStorage[i]._idMachine});
  				var loadArray = getLoad(thisMachine._id, unixNow);
  				var dataArray = getHours(thisMachine._id, unixNow);

  				if((dataArray[0] != 'e') && (loadArray[0] != 'e')){
  					//Adiciona o evento Relatório Diário
  					DailyReport.insert({
  						"_idMachine"    : thisMachine._id,
  						"datetimedata"	: unixNow,
  						"name"          : "Relatório Diário",
  						"Data": {
  							"timeon"				: dataArray[0],
  							"load"					: loadArray[0],
  							"maxTemp"				: dataArray[1],
  							"maxPress"			: dataArray[2],
  						}
  					});
  					var dailyHourCounter = dataArray[0];

  					//Testo e formato para horas ou minutos
  					if(dailyHourCounter > 3600){
  						dailyHourCounter = moment.duration(dailyHourCounter, 'seconds').as('hours');
  						dailyHourCounter = dailyHourCounter.toFixed(1).split('.');
  						dailyHourCounter[0] = dailyHourCounter[0] + " h";
  					}else{
  						dailyHourCounter = moment.duration(dailyHourCounter, 'seconds').as('minutes');
  						dailyHourCounter = dailyHourCounter.toFixed(1).split('.');
  						dailyHourCounter[0] = dailyHourCounter[0] + " min";
  					}
  					TimelineEvents.insert({
  						"_idMachine"    : thisMachine._id,
  						"_idOperator"   : null,
  						"_idEventType"  : idType._id,
  						"name"          : "Relatório Diário",
  						"datetimeevent" : unixNow,
  						"report" 				: true,
  						"description"   : [dailyHourCounter[0], loadArray[0], dataArray[1], dataArray[2]],
  					});
  				}

  			}
  		}
  	}
  },

  /** getLoad(machineId, unixNow)
	*
	* @description Devolve ao dailyreport a media diária de carga/alívio
	* @param       machineId = id da máquina a ser testada, unixNow = momento a ser testado em Unixtime
	* @return      return [% em carga, % em alivio]
	*/
	getLoad = function (machineId, unixNow) {
  	var	before = unixNow - 86400;
    var dataArray = MachineData.find({datetimedata:{$gt: before,$lt: unixNow}, _idMachine:machineId, "HardwareSignals.InDigs.0.InDig0.0": 1},
      {sort: {datetimedata:1}}).fetch();

    if(dataArray.length >= 1){
      var carga = 0
      var alivio = 0;

	  	//Percorre o array de dados somando o número de entradas em carga ou alivio
	  	for(k = 0; k < dataArray.length; k++){

	      //Testa se deve adicionar em carga ou alivio
	      if( dataArray[k].HardwareSignals.InDigs[1].InDig1[0].load == 1){
          carga = carga + (dataArray[k].datetimedata[dataArray[k].datetimedata.length - 1] - dataArray[k].datetimedata[0]);

        }else{
          alivio = alivio + (dataArray[k].datetimedata[dataArray[k].datetimedata.length - 1] - dataArray[k].datetimedata[0]);
        }
      }

	  	//Retorna as porcentagens
	  	var soma = carga+alivio;
	  	carga = (carga*100)/soma;
	  	carga = carga | 0;
	  	alivio = (alivio*100)/soma;
	  	alivio = alivio | 0;

	  	return [carga, alivio];
	  }else{
	  	return 'e';
	  }
	},

  /** getHours(machineId, unixNow)
	*
	* @description Devolve ao dailyreport o horimetro e maximo de temp/pressao
	* @param       machineId = id da máquina a ser testada, unixNow = momento a ser testado em Unixtime
	* @return      return [horímetro do dia, temperatura maxima, pressao maxima]
	*/
	getHours = function (machineId, unixNow) {
  	//Before é o momento da chamada -24h
  	var	before = unixNow - 86400;

  	var dataArray = MachineData.find({datetimedata:{$gt: before,$lt: unixNow}, _idMachine:machineId, "HardwareSignals.InDigs.0.InDig0.0": 1},
  		{sort: {datetimedata:1}}).fetch();
  	if(dataArray.length >= 1){
  		var dailyHourCount = 0;
  		var maxTemp = 0;
  		var maxPressure = 0;

	  	//Percorre o array de dados somando o número de entradas em carga ou alivio
	  	for(j = 0; j < dataArray.length; j++){
        dailyHourCount = dailyHourCount + (dataArray[j].datetimedata[dataArray[j].datetimedata.length - 1] - dataArray[j].datetimedata[0]);

        for(l = 0; l <= dataArray[j].datetimedata.length; l++){
          if(dataArray[j].HardwareSignals.InAnls[0].InAnl0[l] > maxTemp){
            maxTemp = dataArray[j].HardwareSignals.InAnls[0].InAnl0[l];
          }
          if(dataArray[j].HardwareSignals.InAnls[1].InAnl1[l] > maxPressure){
            maxPressure = dataArray[j].HardwareSignals.InAnls[1].InAnl1[l];
          }
        }
      }

      return [dailyHourCount, maxTemp, maxPressure];
    }else{
      return 'e';
    }
  }

}