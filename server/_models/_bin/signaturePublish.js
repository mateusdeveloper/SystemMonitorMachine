//================================================================================
//  @file         signaturePublish.js
//  @version      0.0.1
//  @path         server/_models/_bin
//  @description  Cria as assinaturas publicas para os methods de CRUD.
//  @author       MateusDeveloper
//  @contact      mateus.developer@gmail.com
//  @copyright    Mateus Cardoso Nunes
//================================================================================

if (Meteor.isServer) {

  /** Publish 'mastercompany'
  *
  * @description Publica para God a collection Master Company
  * @param       n/d
  * @return      MasterCompany
  *
  */
  Meteor.publish('mastercompany', function() {
    if (!this.userId) return [];
    var currentUserId = this.userId;
    var userObj = Meteor.users.findOne({_id:currentUserId});
    //Testa se existe usuário logado
    if(currentUserId){
    	if(Roles.userIsInRole(currentUserId, 'God')){
    		return MasterCompany.find();
    	}else if(Roles.userIsInRole(currentUserId, 'SysAdm')){
        return MasterCompany.find({_id: userObj._idMasterCompany});
      }else if(Roles.userIsInRole(currentUserId, ['Adm', 'Supervisor'])){
        var companyObj = Company.findOne({_id: userObj._idCompany})
        return MasterCompany.find({_id: companyObj._idMasterCompany});
      }else{
        return false;
      }

      Company.findOne({_idMasterCompany : thisCompany}, {fields : {_id : 1}});
    }else{
    	return false;
    }
  });

  /** Publish 'company'
  *
  * @description Publica as empreas relacionadas ao usuário
  * @param       n/d
  * @return      Company
  *
  */
  Meteor.publish('company', function() {
    if (!this.userId) return [];
    var currentUserId = this.userId;
    var userObj = Meteor.users.findOne({_id:currentUserId});
    //Testa se existe usuário logado
    if(currentUserId){
      //Se é SysAdm, retorna todas as estações
      if(Roles.userIsInRole(currentUserId, 'God')){
      	return Company.find();
      }else if (Roles.userIsInRole(currentUserId, 'SysAdm')){
      	return Company.find({_idMasterCompany: userObj._idMasterCompany});
      }else{
      	return Company.find({_id: userObj._idCompany});
      }
    }else{
    	return false;
    }
  });

  /** Publish 'Machines'
  *
  * @description Publica as máquinas da(s) empresa(s) relacinoadas ao usuário
  * @param       n/d
  * @return      Machines
  *
  */
  Meteor.publish('machines', function() {
    if (!this.userId) return [];
    var currentUserId = this.userId;
    var userObj = Meteor.users.findOne({_id:currentUserId});
    //Testa se existe usuário logado
    if(currentUserId){
      //Se é SysAdm, retorna todas as estações
      if(Roles.userIsInRole(currentUserId, 'God')){
      	return Machines.find();
      }else if(Roles.userIsInRole(currentUserId, 'SysAdm')){
      	var myCompanies = Company.find({_idMasterCompany: userObj._idMasterCompany}, {fields: {'_id':1}}).fetch();

        //Cria o array vazio em que sera salvo os IDs das Machines
        var myCompaniesId = [];

        //Salva no array myMachinesId os Ids para usar no return
        for(i = 0; i < myCompanies.length; i++){
        	myCompaniesId[i] = myCompanies[i]._id;
        }

        return Machines.find({_idCompany: {$in: myCompaniesId}});
      }else if(Roles.userIsInRole(currentUserId, 'Adm')){

      	return Machines.find({_idCompany: userObj._idCompany});
      }else if(Roles.userIsInRole(currentUserId, 'Supervisor')){

        return Machines.find({_idCompany: userObj._idCompany, sysstatus:{$in: [1, 2]} });
      }else if(Roles.userIsInRole(currentUserId, 'Operator')){

      	return Machines.find({Operators: userObj._id, sysstatus:{$in: [1, 2]} });
      }
    }
      //Se currentUser está vazio (usuário deslogado), retorna falso
      return false;
    });


  // /** Publish 'MachineInputs'
  // *
  // * @description Publica os MachineInputs das Máquinas publciadas anteriormente
  // * @param       n/d
  // * @return      Devices com o mesmo _idCompany que o usuário
  // *
  // */
  // Meteor.publish('machineinputs', function() {
  //   if (!this.userId) return [];
  //   var currentUserId = this.userId;
  //   var userObj = Meteor.users.findOne({_id:currentUserId});
  //   //Testa se existe usuário logado
  //   if(currentUserId){
  //     //Se é SysAdm, retorna todas as estações
  //     if(Roles.userIsInRole(currentUserId, 'God')){
  //     	return MachineInputs.find();
  //     }else if(Roles.userIsInRole(currentUserId, 'SysAdm')){
  //     	var myCompanies = Company.find({_idMasterCompany: userObj._idMasterCompany}, {fields: {'_id':1}}).fetch();

  //       //Cria o array vazio em que sera salvo os IDs das Machines
  //       var myCompaniesId = [];

  //       //Salva no array myMachinesId os Ids para usar no return
  //       for(i = 0; i < myCompanies.length; i++){
  //       	myCompaniesId[i] = myCompanies[i]._id;
  //       }

  //       var myMachines = Machines.find({_idCompany: {$in: myCompaniesId}}, {fields: {'_id':1}}).fetch();
  //       //Cria o array vazio em que sera salvo os IDs das Machines
  //       var myMachinesId = [];

  //       //Salva no array myMachinesId os Ids para usar no return
  //       for(i = 0; i < myMachines.length; i++){
  //       	myMachinesId[i] = myMachines[i]._id;
  //       }

  //       return MachineInputs.find({_idMachine: {$in: myMachinesId}});
  //     }else if(Roles.userIsInRole(currentUserId, ['Adm', 'Supervisor'])){
  //     	var myMachines = Machines.find({_idCompany: userObj._idCompany}, {fields: {'_id':1}}).fetch();
  //       //Cria o array vazio em que sera salvo os IDs das Machines
  //       var myMachinesId = [];

  //       //Salva no array myMachinesId os Ids para usar no return
  //       for(i = 0; i < myMachines.length; i++){
  //       	myMachinesId[i] = myMachines[i]._id;
  //       }

  //       return MachineInputs.find({_idMachine: {$in: myMachinesId}});
  //     }else if(Roles.userIsInRole(currentUserId, 'Operator')){
  //     	var myMachines = Machines.find({Operators: userObj._id}, {fields: {'_id':1}}).fetch();
  //       //Cria o array vazio em que sera salvo os IDs das Machines
  //       var myMachinesId = [];

  //       //Salva no array myMachinesId os Ids para usar no return
  //       for(i = 0; i < myMachines.length; i++){
  //       	myMachinesId[i] = myMachines[i]._id;
  //       }


  //       return MachineInputs.find({_idMachine: {$in: myMachinesId}});
  //     }
  //   }else{
  //   	return false;
  //   }

  // });


  /** Publish 'Devices'
  *
  * @description Publica os Dispositivos relacionados ao usuário
  * @param       n/d
  * @return      Devices com o mesmo _idCompany que o usuário
  *
  */
  Meteor.publish('devices', function() {
    if (!this.userId) return [];
    var currentUserId = this.userId;
    var userObj = Meteor.users.findOne({_id:currentUserId});
    //Testa se existe usuário logado
    if(currentUserId){
      //Se é SysAdm, retorna todas as estações
      if(Roles.userIsInRole(currentUserId, 'God')){
      	return Devices.find();
      }else if(Roles.userIsInRole(currentUserId, 'SysAdm')){
      	var myCompanies = Company.find({_idMasterCompany: userObj._idMasterCompany}, {fields: {'_id':1}}).fetch();

        //Cria o array vazio em que sera salvo os IDs das Machines
        var myCompaniesId = [];
        var myCompaniesCode = [];
        //Salva no array myMachinesId os Ids para usar no return
        for(i = 0; i < myCompanies.length; i++){
        	myCompaniesId[i] = myCompanies[i]._id;
          /*acho que é aqui*/
          //myCompaniesCode[i] = myCompanies[i]._companyCode;
        }

        /*tentandoooooooooooooooo*/
        for(i = 0; i < myCompaniesId.length; i++){
          var thisCompany = Company.findOne({_id: myCompaniesId[i]});
          myCompaniesCode[i] = thisCompany._companyCode;
        }

        var myMachines = Machines.find({_idCompany: {$in: myCompaniesId}}, {fields: {'_id':1}}).fetch();
        //Cria o array vazio em que sera salvo os IDs das Machines

        var myMachinesId = [];

        //Salva no array myMachinesId os Ids para usar no return
        for(i = 0; i < myMachines.length; i++){
        	myMachinesId[i] = myMachines[i]._id;
        }
        return Devices.find({$or:[{_idMachine: {$in: myMachinesId}}, {_companyCode: {$in: myCompaniesCode}}]});
      }else if(Roles.userIsInRole(currentUserId, ['Adm', 'Supervisor'])){
      	var myMachines = Machines.find({_idCompany: userObj._idCompany}, {fields: {'_id':1}}).fetch();
        //Cria o array vazio em que sera salvo os IDs das Machines
        var myMachinesId = [];

        /*_companyCode para mostrar os dispositivos sem associação também*/
        var thisCompanyUser = Company.findOne({_id: userObj._idCompany});

        //Salva no array myMachinesId os Ids para usar no return
        for(i = 0; i < myMachines.length; i++){
        	myMachinesId[i] = myMachines[i]._id;
        }

        return Devices.find({$or:[{_idMachine: {$in: myMachinesId}}, {_companyCode: thisCompanyUser._companyCode}]});
      }else if(Roles.userIsInRole(currentUserId, 'Operator')){
      	var myMachines = Machines.find({Operators: userObj._id}, {fields: {'_id':1}}).fetch();
        //Cria o array vazio em que sera salvo os IDs das Machines
        var myMachinesId = [];

        //Salva no array myMachinesId os Ids para usar no return
        for(i = 0; i < myMachines.length; i++){
        	myMachinesId[i] = myMachines[i]._id;
        }


        return Devices.find({_idMachine: {$in: myMachinesId}});
      }
    }else{
    	return false;
    }
  });


  /** Publish 'users'
  *
  * @description Publica a lista de usuários relacionados ao usuário
  * @param       n/d
  * @return      Meteor.users
  *
  */
  Meteor.publish('users', function() {
    if (!this.userId) return [];
    var currentUserId = this.userId;
    var userObj = Meteor.users.findOne({_id:currentUserId});
    //Testa se existe usuário logado
    if(currentUserId){
      //Se é SysAdm, retorna a lista de usuários
      if(Roles.userIsInRole(currentUserId, 'God')){
      	return Meteor.users.find();
      } else if (Roles.userIsInRole(currentUserId, 'SysAdm')){
      	var myCompanies = Company.find({_idMasterCompany: userObj._idMasterCompany}, {fields: {'_id':1}}).fetch();

        //Cria o array vazio em que sera salvo os IDs das Machines
        var myCompaniesId = [];

        //Salva no array myMachinesId os Ids para usar no return
        for(i = 0; i < myCompanies.length; i++){
        	myCompaniesId[i] = myCompanies[i]._id;
        }

        return Meteor.users.find({$or:[{_idCompany: {$in: myCompaniesId}}, {_idMasterCompany: userObj._idMasterCompany}]});
      } else if (Roles.userIsInRole(currentUserId, ['Adm', 'Supervisor'])){
      	return Meteor.users.find({roles: {$in:['Operator', 'Supervisor', 'Adm']}, _idCompany: userObj._idCompany});
      } else if (Roles.userIsInRole(currentUserId, 'Operator')){
      	return Meteor.users.find({roles: {$in:['Operator', 'Supervisor', 'Adm']}, _idCompany: userObj._idCompany}, {fields: {'profile.name':1, '_idCompany':1}});
      }
    } else {
    	return false;
    }
  });


  /** Publish 'Devicedata'
  *
  * @description Publica os logs de dispositivos relacionados ao usuário
  * @param       n/d
  * @return      DeviceData com o mesmo _idCompany que o usuário
  *
  */
  Meteor.publish('devicedata', function() {
    if (!this.userId) return [];
    var currentUserId = this.userId;
    var userObj = Meteor.users.findOne({_id:currentUserId});
    //Testa se existe usuário logado
    if(currentUserId){
      //Se é SysAdm, retorna todas as estações
      if(Roles.userIsInRole(currentUserId, 'God')){
      	return DeviceData.find({},{limit:10, sort: {datetimedata: -1}});
      }else if(Roles.userIsInRole(currentUserId, 'SysAdm')){
      	var myCompanies = Company.find({_idMasterCompany: userObj._idMasterCompany}, {fields: {'_id':1}}).fetch();

        //Cria o array vazio em que sera salvo os IDs das Machines
        var myCompaniesId = [];

        //Salva no array myMachinesId os Ids para usar no return
        for(i = 0; i < myCompanies.length; i++){
        	myCompaniesId[i] = myCompanies[i]._id;
        }

        var myMachines = Machines.find({_idCompany: {$in: myCompaniesId}}, {fields: {'_id':1}}).fetch();
        //Cria o array vazio em que sera salvo os IDs das Machines
        var myMachinesId = [];

        //Salva no array myMachinesId os Ids para usar no return
        for(i = 0; i < myMachines.length; i++){
        	myMachinesId[i] = myMachines[i]._id;
        }

        var myDevices = Devices.find({_idMachine: {$in: myMachinesId}}, {fields: {'_id':1}}).fetch();
        //Cria o array vazio em que sera salvo os IDs dos Devices
        var myDevicesId = [];

        //Salva no array somente o ID
        for(i = 0; i < myDevices.length; i++){
        	myDevicesId[i] = myDevices[i]._id;
        }

        return DeviceData.find({_idDevice: {$in: myDevicesId}}, {limit:1000, sort: {datetimedata: -1}});
      }else if(Roles.userIsInRole(currentUserId, ['Adm', 'Supervisor'])){
      	var myMachines = Machines.find({_idCompany: userObj._idCompany}, {fields: {'_id':1}}).fetch();
        //Cria o array vazio em que sera salvo os IDs das Machines
        var myMachinesId = [];

        //Salva no array myMachinesId os Ids para usar no return
        for(i = 0; i < myMachines.length; i++){
        	myMachinesId[i] = myMachines[i]._id;
        }

        var myDevices = Devices.find({_idMachine: {$in: myMachinesId}}, {fields: {'_id':1}}).fetch();
        //Cria o array vazio em que sera salvo os IDs dos Devices
        var myDevicesId = [];

        //Salva no array somente o ID
        for(i = 0; i < myDevices.length; i++){
        	myDevicesId[i] = myDevices[i]._id;
        }

        return DeviceData.find({_idDevice: {$in: myDevicesId}}, {limit:1000, sort: {datetimedata: -1}});
      }else if(Roles.userIsInRole(currentUserId, 'Operator')){
      	var myMachines = Machines.find({Operators: userObj._id}, {fields: {'_id':1}}).fetch();
        //Cria o array vazio em que sera salvo os IDs das Machines
        var myMachinesId = [];

        //Salva no array myMachinesId os Ids para usar no return
        for(i = 0; i < myMachines.length; i++){
        	myMachinesId[i] = myMachines[i]._id;
        }

        var myDevices = Devices.find({_idMachine: {$in: myMachinesId}}, {fields: {'_id':1}}).fetch();
        //Cria o array vazio em que sera salvo os IDs dos Devices
        var myDevicesId = [];

        //Salva no array somente o ID
        for(i = 0; i < myDevices.length; i++){
        	myDevicesId[i] = myDevices[i]._id;
        }

        return DeviceData.find({_idDevice: {$in: myDevicesId}}, {limit:800, sort: {datetimedata: -1}});
      }
      //Se currentUser está vazio (usuário deslogado), retorna falso
    }else {
    	return false;
    }
  });

  /** Publish 'DailyReport'
  *
  * @description Publica os totalizadores diários dos dispositivos relacionados ao usuário
  * @param       n/d
  * @return      DeviceData com o mesmo _idCompany que o usuário
  *
  */
  Meteor.publish('dailyreport', function() {
    if (!this.userId) return [];
    var currentUserId = this.userId;
    var userObj = Meteor.users.findOne({_id:currentUserId});
    //Testa se existe usuário logado
    if(currentUserId){
      //Se é SysAdm, retorna todas as estações
      if(Roles.userIsInRole(currentUserId, 'God')){
        return DailyReport.find({},{limit:1000, sort: {datetimedata: -1}});
      }else if(Roles.userIsInRole(currentUserId, 'SysAdm')){
        var myCompanies = Company.find({_idMasterCompany: userObj._idMasterCompany}, {fields: {'_id':1}}).fetch();

        //Cria o array vazio em que sera salvo os IDs das Machines
        var myCompaniesId = [];

        //Salva no array myMachinesId os Ids para usar no return
        for(i = 0; i < myCompanies.length; i++){
          myCompaniesId[i] = myCompanies[i]._id;
        }

        var myMachines = Machines.find({_idCompany: {$in: myCompaniesId}}, {fields: {'_id':1}}).fetch();
        //Cria o array vazio em que sera salvo os IDs das Machines
        var myMachinesId = [];

        //Salva no array myMachinesId os Ids para usar no return
        for(i = 0; i < myMachines.length; i++){
          myMachinesId[i] = myMachines[i]._id;
        }

        return DailyReport.find({_idMachine: {$in: myMachinesId}}, {limit:500, sort: {datetimedata: -1}});
      }else if(Roles.userIsInRole(currentUserId, ['Adm', 'Supervisor'])){
        var myMachines = Machines.find({_idCompany: userObj._idCompany}, {fields: {'_id':1}}).fetch();
        //Cria o array vazio em que sera salvo os IDs das Machines
        var myMachinesId = [];

        //Salva no array myMachinesId os Ids para usar no return
        for(i = 0; i < myMachines.length; i++){
          myMachinesId[i] = myMachines[i]._id;
        }

        return DailyReport.find({_idMachine: {$in: myMachinesId}}, {limit:500, sort: {datetimedata: -1}});
      }else if(Roles.userIsInRole(currentUserId, 'Operator')){
        var myMachines = Machines.find({Operators: userObj._id}, {fields: {'_id':1}}).fetch();
        //Cria o array vazio em que sera salvo os IDs das Machines
        var myMachinesId = [];

        //Salva no array myMachinesId os Ids para usar no return
        for(i = 0; i < myMachines.length; i++){
          myMachinesId[i] = myMachines[i]._id;
        }

        return DailyReport.find({_idMachine: {$in: myMachinesId}}, {limit:500, sort: {datetimedata: -1}});
      }
      //Se currentUser está vazio (usuário deslogado), retorna falso
    }else {
      return false;
    }
  });

  /** Publish 'system'
  *
  * @description Publica somente as informaçõe do último sistema
  * @param       n/d
  * @return      System
  *
  */
  Meteor.publish('system', function() {
    if (!this.userId) return [];
    var currentUserId = this.userId;
    //Testa se existe usuário logado
    if(currentUserId){
    	return System.find({}, {sort:{daterelease: -1}, limit: 1});
    }
    else{
    	return false;
    }
  });


  /** Publish 'eventslist'
  *
  * @description Publica a lista de eventos
  * @param       n/d
  * @return      EventList
  *
  */
  Meteor.publish('eventlist', function() {
    if (!this.userId) return [];
    var currentUserId = this.userId;
    //Testa se existe usuário logado
    if(currentUserId){
    	return EventList.find({});
    }
    else{
    	return false;
    }
  });

  /** Publish 'eventtype'
  *
  * @description Publica a lista de tipos de eventos
  * @param       n/d
  * @return      EventType
  *
  */
  Meteor.publish('eventtype', function() {
    if (!this.userId) return [];
    var currentUserId = this.userId;
    //Testa se existe usuário logado
    if(currentUserId){
    	return EventType.find({});
    }
    else{
    	return false;
    }
  });



  /** Publish 'timelineevents'
  *
  * @description Publica os eventos do TimeLine
  * @param       n/d
  * @return      TimeLineEvents
  *
  */
  Meteor.publish('timelineevents', function() {
    if (!this.userId) return [];
    var currentUserId = this.userId;
    var userObj = Meteor.users.findOne({_id:currentUserId});
    //Testa se existe usuário logado
    if(currentUserId){
    	if(Roles.userIsInRole(currentUserId, 'God')){
    		return TimelineEvents.find({},{limit:1000, sort: {datetimeevent: -1}});
    	}else if(Roles.userIsInRole(currentUserId, 'SysAdm')){
    		var myCompanies = Company.find({_idMasterCompany: userObj._idMasterCompany}, {fields: {'_id':1}}).fetch();

        //Cria o array vazio em que sera salvo os IDs das Machines
        var myCompaniesId = [];

        //Salva no array myMachinesId os Ids para usar no return
        for(i = 0; i < myCompanies.length; i++){
        	myCompaniesId[i] = myCompanies[i]._id;
        }

        var myMachines = Machines.find({_idCompany: {$in: myCompaniesId}}, {fields: {'_id':1}}).fetch();
        //Cria o array vazio em que sera salvo os IDs das Machines
        var myMachinesId = [];

        //Salva no array myMachinesId os Ids para usar no return
        for(i = 0; i < myMachines.length; i++){
          myMachinesId[i] = myMachines[i]._id;
        }

        return TimelineEvents.find({_idMachine: {$in:myMachinesId}},{limit:300, sort: {datetimeevent: -1}});
      }else if(Roles.userIsInRole(currentUserId, ['Adm', 'Supervisor'])){
      	var myMachines = Machines.find({_idCompany: userObj._idCompany}, {fields: {'_id':1}}).fetch();
        //Cria o array vazio em que sera salvo os IDs das Machines
        var myMachinesId = [];

        //Salva no array myMachinesId os Ids para usar no return
        for(i = 0; i < myMachines.length; i++){
        	myMachinesId[i] = myMachines[i]._id;
        }

        return TimelineEvents.find({_idMachine: {$in:myMachinesId}},{limit:300, sort: {datetimeevent: -1}});
      }else if(Roles.userIsInRole(currentUserId, 'Operator')){
      	var myMachines = Machines.find({Operators: userObj._id}, {fields: {'_id':1}}).fetch();
        //Cria o array vazio em que sera salvo os IDs das Machines
        var myMachinesId = [];

        //Salva no array myMachinesId os Ids para usar no return
        for(i = 0; i < myMachines.length; i++){
        	myMachinesId[i] = myMachines[i]._id;
        }

        return TimelineEvents.find({_idMachine: {$in:myMachinesId}},{limit:300, sort: {datetimeevent: -1}});
      }
    }else{
    	return false;
    }

  });



  /** Publish 'report'
  *
  * @description Publica os eventos do TimeLine
  * @param       n/d
  * @return      Data of Report
  *
  */
  Meteor.publish('report', function(START_DATE_FILTER, END_DATE_FILTER, SELECTED_MACHINE, SELECTED_TYPE_REPORT) {
    if (!this.userId) return [];
    var currentUserId = this.userId;
    var userObj = Meteor.users.findOne({_id:currentUserId});

    //Testa se existe usuário logado
    if(currentUserId){
      if(Roles.userIsInRole(currentUserId, ['SysAdm', 'Adm', 'Supervisor'])){

        /*Filtro para Relatório Geral*/
        if (SELECTED_TYPE_REPORT == 'all'){
          return MachineData.find({_idMachine: SELECTED_MACHINE.valueOf(), datetimedata:{$gt: START_DATE_FILTER,$lt: END_DATE_FILTER}}, {limit:5000, sort: {datetimedata: -1}});

        /*Filtro para Relatório de Totalizadores*/
        }else if(SELECTED_TYPE_REPORT == 'productivity'){
          return MachineData.find({_idMachine: SELECTED_MACHINE.valueOf(), datetimedata:{$gt: START_DATE_FILTER,$lt: END_DATE_FILTER}}, {limit:5000, sort: {datetimedata: -1}});

        }else if(SELECTED_TYPE_REPORT == 'poweronoff'){
          return MachineData.find({_idMachine: SELECTED_MACHINE.valueOf(), datetimedata:{$gt: START_DATE_FILTER,$lt: END_DATE_FILTER}}, {limit:5000, sort: {datetimedata: -1}});

        }else if(SELECTED_TYPE_REPORT == 'resume'){
          return DailyReport.find({_idMachine: machineId, datetimedata:{$gt: before,$lt: after}}, {limit:500, sort: {datetimedata: -1}});

        }else {
          return true;
        }
      }
    }
  });
}


  /** Publish 'Devicedata'
  *
  * @description Publica os logs de dispositivos relacionados ao usuário
  * @param       n/d
  * @return      DeviceData com o mesmo _idCompany que o usuário
  *
  */
  Meteor.publish('newdevicedata', function(machineId) {
    if (!this.userId) return [];
    var currentUserId = this.userId;
    var userObj = Meteor.users.findOne({_id:currentUserId});
    //Testa se existe usuário logado
    if(currentUserId){
      if(Roles.userIsInRole(currentUserId, ['God', 'SysAdm', 'Adm', 'Supervisor'])){

        var myDevices = Devices.find({_idMachine: machineId}, {fields: {'_id':1}}).fetch();
        //Cria o array vazio em que sera salvo os IDs dos Devices
        var myDevicesId = [];

        //Salva no array somente o ID
        for(i = 0; i < myDevices.length; i++){
          myDevicesId[i] = myDevices[i]._id;
        }

        return [DeviceData.find({_idDevice: {$in: myDevicesId}}, {limit:50, sort: {datetimedata: -1}}), DailyReport.find({_idMachine: machineId}, {limit:5, sort: {datetimedata: -1}})];
      }else if(Roles.userIsInRole(currentUserId, 'Operator')){

        var myDevices = Devices.find({_idMachine: machineId}, {fields: {'_id':1}}).fetch();
        //Cria o array vazio em que sera salvo os IDs dos Devices
        var myDevicesId = [];

        //Salva no array somente o ID
        for(i = 0; i < myDevices.length; i++){
          myDevicesId[i] = myDevices[i]._id;
        }

        return [ DeviceData.find({_idDevice: {$in: myDevicesId}}, {limit:20, sort: {datetimedata: -1}}), DailyReport.find({_idMachine: machineId}, {limit:5, sort: {datetimedata: -1}})];
      }
      //Se currentUser está vazio (usuário deslogado), retorna falso
    }else {
      return false;
    }
  });

Meteor.publish('machinetype', function() {
  if (!this.userId) return [];
  var currentUserId = this.userId;
  var userObj = Meteor.users.findOne({_id:currentUserId});
    //Testa se existe usuário logado
    if(currentUserId){
      if(Roles.userIsInRole(currentUserId, 'God')){
        return MachineType.find();
      } else if(Roles.userIsInRole(currentUserId, 'SysAdm')){
        var userObj = Meteor.users.findOne({_id:currentUserId});
        var masterCompanyObj = MasterCompany.findOne({_id: userObj._idMasterCompany});
        return MachineType.find({MasterCompany: masterCompanyObj._id});
      } else if(Roles.userIsInRole(currentUserId, 'Adm')){
        var userObj = Meteor.users.findOne({_id:currentUserId});
        var companyObj = Company.findOne({_id: userObj._idCompany});
        var masterCompanyObj = MasterCompany.findOne({_id: companyObj._idMasterCompany});
        return MachineType.find({MasterCompany: masterCompanyObj._id});
      }
    }
  })


  /** Publish 'MachineData'
  *
  * @description Publica MachineData e DailyReport para os Dashboard0,
  * @param       n/d
  * @return      MachineData de _idMachine
  *
  */
  Meteor.publish('machinedata', function(machineId) {
    if (!this.userId) return [];
    var currentUserId = this.userId;
    var userObj = Meteor.users.findOne({_id:currentUserId});
    //Testa se existe usuário logado
    if(currentUserId){
      if(Roles.userIsInRole(currentUserId, ['God', 'SysAdm', 'Adm', 'Supervisor'])){
        console.log(machineId._str);

        return [MachineData.find({_idMachine: machineId._str}, {limit:50, sort: {datetimedata: -1}}), DailyReport.find({_idMachine: machineId}, {limit:5, sort: {datetimedata: -1}})];
      }else if(Roles.userIsInRole(currentUserId, 'Operator')){


        return [MachineData.find({_idMachine: machineId._str}, {limit:50, sort: {datetimedata: -1}}), DailyReport.find({_idMachine: machineId}, {limit:5, sort: {datetimedata: -1}})];
      }
      //Se currentUser está vazio (usuário deslogado), retorna falso
    }else {
      return false;
    }
  });