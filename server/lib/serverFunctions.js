//================================================================================
//  @file         serverFunctions.js
//  @version      0.0.1
//  @path         server/
//  @description  Serviços de suporte e aplicações.
//  @contact      mateus.developer@gmail.com
//  @copyright    Copyright HydrBytes Technologies Corporation Ltda.
//================================================================================
keepAlive = function() {
  var now = moment.utc().unix();
  var deviceList = Devices.find().fetch();

  for(i = 0; i<deviceList.length; i++){
    var thisMachine = deviceList[i]._idMachine;
    if(thisMachine != null){
      var lastMachineData = MachineData.findOne({_idMachine: thisMachine._str}, {sort: {datetimedata: -1}, fields: {datetimedata: 1}});
      if(lastMachineData != undefined){
        Devices.update({_id: deviceList[i]._id}, {
          $set: {
            "KeepAlive.timer": lastMachineData.datetimedata[lastMachineData.datetimedata.length -1],
          },
        })

        if(deviceList[i].KeepAlive.flag == 0){
          if((now - deviceList[i].KeepAlive.timer) > 60 ){
            Machines.update({_id: deviceList[i]._idMachine},{
              $set: {
                "status": 0,
              }
            });
            var idType = EventType.findOne({type: "StopDevice"});
            TimelineEvents.insert({
              "_idMachine"    : thisMachine,
              "_idOperator"   : null,
              "_idEventType"  : idType._id,
              "name"          : "Dispositivo Desconectado",
              "datetimeevent" : now,
              "description"   : "Este dispositivo não enviou dados nos últimos 10 min!",
            });
            Devices.update({_id: deviceList[i]._id}, {
              $set: {
                "status": 0,
                "KeepAlive.flag": 1
              },
            })
          }
        }else{
          if((now - deviceList[i].KeepAlive.timer) < 60 ){
            Machines.update({_id: deviceList[i]._idMachine},{
              $set: {
                "status": 1,
              }
            });
            var idType = EventType.findOne({type: "ConnectDevice"});
            var timeDifference = now - deviceList[i].KeepAlive.timer;
            if(timeDifference > 3600){
              timeDifference = moment.duration(timeDifference, 'seconds').as('hours');
              timeDifference = timeDifference.toFixed(1).split('.');
              timeDifference[0] = timeDifference[0] + " h";
            }else{
              timeDifference = moment.duration(timeDifference, 'seconds').as('minutes');
              timeDifference = timeDifference.toFixed(1).split('.');
              timeDifference[0] = timeDifference[0] + " min";
            }

            TimelineEvents.insert({
              "_idMachine"    : thisMachine._id,
              "_idOperator"   : null,
              "_idEventType"  : idType._id,
              "name"          : "Dispositivo Reconectado",
              "datetimeevent" : now,
              "description"   : "Dispositivo voltou a enviar dados após " + timeDifference[0] + ".",
            });
            Devices.update({_id: deviceList[i]._id}, {
              $set: {
                "status": 1,
                "KeepAlive.flag": 0
              },

            })
          }
        }
      }
    }
  }
}


hourCounter = function() {
  var now = moment.utc().unix();
  var machineList = Machines.find().fetch();

  for(i = 0; i < machineList.length; i++){
    var referenceCounter = machineList[i].hourcount;
    var newReference = [0,0];

    var machineDataList = MachineData.find({_idMachine: machineList[i]._id._str, "HardwareSignals.InDigs.0.InDig0.0": 1, "datetimedata": {$gt: referenceCounter[0]}}, {sort: {datetimedata: 1}}).fetch();

    if(machineDataList.length > 1){
      for(j = 0; j < machineDataList.length; j++){
        newReference[0] = machineDataList[j].datetimedata[machineDataList[j].datetimedata.length - 1];
        newReference[1] = newReference[1] + (newReference[0] - machineDataList[j].datetimedata[0]);
      }
      var lastMachineData = MachineData.findOne({_idMachine: machineList[i]._id._str});

      if(lastMachineData != undefined){
        if(lastMachineData.HardwareSignals.InDigs[0].InDig0[0] == 0){
          Machines.update({_id: machineList[i]._id}, {
            $set: {
              "hourcount" : newReference,
            },
          });
        }else{
          Machines.update({_id: machineList[i]._id}, {
            $set: {
              "hourcount" : newReference,
            },
          });
        }
      }
    }
  }
}
