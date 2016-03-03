//================================================================================
//  @file         coMachines.js
//  @version      0.0.1
//  @path         client/_controllers/
//  @description  CONTROLLER para Machines.
//  @author       MateusDeveloper
//  @contact      mateus.developer@gmail.com
//  @copyright    Copyright Mateus Cardoso Nunes
//================================================================================

if (Meteor.isClient) {

//********************************************************************************
// Helpers
//********************************************************************************
Template.machine.helpers({

  'getMachines': function(){
    return Machines.find({}, {sort: {name: 1}});
  },

  'getCompanyName': function(idCompany){
    var companyObj = Company.findOne(idCompany);
    var result = companyObj.name;
    return result;
  },

  'testSysStatusNotAssociated': function(sysStatusMachine){
    if(sysStatusMachine != 3){
      return true;
    }else {
      return false
    }
  },

});


Template.selectTypeMachineModal.helpers({
  'getMachineType': function(){
    var typeObj = MachineType.find().fetch();
    return typeObj;
  },

  'getCompany': function(){
   var companyList = Company.find({}).fetch();
   return companyList;
 },

});


Template.formInsertMachine.helpers({
  'getCompanySelect': function(){
    var selectedCompany = Session.get('SELECTED_MACHINE_COMPANY');

    if(selectedCompany !== undefined){
      var test = Company.findOne({_id: selectedCompany});
      console.log(test.name);
      return Company.findOne({_id: selectedCompany});
    }else{
      return '';
    }
  },

  'getProfileData': function(){
    var selectedType = Session.get('SELECTED_MACHINE_TYPE');
    var typeMachineObj = MachineType.findOne({_id: selectedType})
    var valueArray = typeMachineObj.Definitions.Profile.value;
    var unitArray = typeMachineObj.Definitions.Profile.unit;
    var limitArray = typeMachineObj.Definitions.Profile.limit;
    var resultArray = [];

    for(i = 0; i < valueArray.length; i++){
      resultArray[i] = [valueArray[i], unitArray[i], limitArray[i]];
    }

    return resultArray;
  },

  'getGoalData': function(){
    var selectedType = Session.get('SELECTED_MACHINE_TYPE');
    var typeMachineObj = MachineType.findOne({_id: selectedType})
    var descriptionArray = typeMachineObj.Definitions.Goals.description;
    var valueArray = typeMachineObj.Definitions.Goals.value;
    var resultArray = [];

    for(i = 0; i < descriptionArray.length; i++){
      resultArray[i] = [descriptionArray[i], valueArray[i]];
    }

    return resultArray;
  },

  'getOperator': function(){
    var selectedType = Session.get('SELECTED_MACHINE_TYPE');
    var selectedTypeObj = MachineType.findOne({_id: selectedType});
    var selectedCompany = Session.get('SELECTED_MACHINE_COMPANY');
    if(selectedTypeObj != undefined){
      return Meteor.users.find({$and: [{_idCompany: selectedCompany}, {roles: selectedTypeObj.Definitions.Operators.roles}]});
    }else{
      return;
    }
  },

  'getSelectedOperator': function(){
    var selectedList = Session.get('SELECTED_MACHINE_OPERATOR');

    if(selectedList !== undefined){
      return Meteor.users.find({_id : {$in: selectedList}}).fetch();
    }else{
      return '';
    }
  },

});


Template.formUpdateMachine.helpers({
	'getMachine': function(){
		var thisMachine = Session.get('SELECTED_MACHINE');
		return Machines.findOne(thisMachine);
	},

  'getProfileData': function(){
    var machineSelectedId = Session.get('SELECTED_MACHINE');
    var machineObj = Machines.findOne({_id: machineSelectedId});
    var valueArray = machineObj.Profile.value;
    var unitArray = machineObj.Profile.unit;
    var limitArray = machineObj.Profile.limit;
    var resultArray = [];

    for(i = 0; i < valueArray.length; i++){
      resultArray[i] = [valueArray[i], unitArray[i], limitArray[i]];
    }

    return resultArray;
  },

  'getGoalData': function(){
    var machineSelectedId = Session.get('SELECTED_MACHINE');
    var machineObj = Machines.findOne({_id: machineSelectedId});
    var descriptionArray = machineObj.Goals.description;
    var valueArray = machineObj.Goals.value;
    var resultArray = [];

    for(i = 0; i < descriptionArray.length; i++){
      resultArray[i] = [descriptionArray[i], valueArray[i]];
    }

    return resultArray;
  },

  'getOperator': function(){
    var selectedMachineId = Session.get('SELECTED_MACHINE');
    var machineObj = Machines.findOne({_id: selectedMachineId});
    var companyObj = Company.findOne({_id: machineObj._idCompany});
    var typeMachineObj = MachineType.findOne({_id: machineObj._idMachineType});
    if(selectedMachineId != undefined){
      return Meteor.users.find({$and: [{_idCompany: companyObj._id}, {roles: typeMachineObj.Definitions.Operators.roles}]});
    }else{
      return;
    }
  },

  'getSelectedOperator': function(){
    var selectedList = Session.get('SELECTED_MACHINE_OPERATOR');

    if(selectedList !== undefined){
      return Meteor.users.find({_id : {$in: selectedList}}).fetch();
    }else{
      return '';
    }
  },

});


Template.deleteMachineModal.helpers({
  'getMachine': function(){
    var thisMachine = Session.get('SELECTED_MACHINE');
    return Machines.findOne(thisMachine);
  },
});


Template.statusMachineModal.helpers({
  'getMachine': function(){
    var thisMachine = Session.get('SELECTED_MACHINE');
    return Machines.findOne(thisMachine);
  },
});


Template.emergencyMachineModal.helpers({
  'getMachine': function(){
    var thisMachine = Session.get('SELECTED_MACHINE');
    return Machines.findOne(thisMachine);
  },

  'getMachinesInputs': function() {
    var thisMachine = Session.get('SELECTED_MACHINE');
    var machineInputs = Machines.findOne({_id: thisMachine});
    return machineInputs;
  }
});

//********************************************************************************
// Events
//********************************************************************************
Template.machine.events({
  'click .update-machine-button': function(){
    var machineId = this._id;
    Session.set('SELECTED_MACHINE', machineId);
    var machineObj = Machines.findOne(this);
    var operatorList = machineObj.Operators;
    Session.set('SELECTED_MACHINE_OPERATOR', operatorList);
    Router.go('/formUpdateMachine');
  },

  'click .delete-machine-button': function(){
    var thisMachine = this._id;
    Session.set('SELECTED_MACHINE', thisMachine);
  },

  'click .uptadestatus-machine-button': function(){
    var machineId = this._id;
    Session.set('SELECTED_MACHINE', machineId);
  },

  'click .emergency-machine-button': function(){
    var machineId = this._id;
    Session.set('SELECTED_MACHINE', machineId);
  },
});


Template.selectTypeMachineModal.events({
  'click #confirm-select-type-machine-button':function(event, template){
    event.preventDefault();
    var machineType = template.find('#select-machine-type').value;
    var company = template.find('#select-company').value;

    if((machineType != '')&&(company != '')){
      var companyString = removeObject(company);
      var companyObjId = new Mongo.ObjectID(companyString);
      Session.set('SELECTED_MACHINE_COMPANY', companyObjId);

      var machineTypeString = removeObject(machineType);
      var machineTypeObjId = new Mongo.ObjectID(machineTypeString);
      Session.set('SELECTED_MACHINE_TYPE', machineTypeObjId);

      document.getElementById('close-select-type-machine-button').click();
      Router.go('formInsertMachine');
    }else {
      Materialize.toast('Selecione um Tipo de Máquina', 3000);
      Materialize.toast('Selecione uma Empresa', 3000);
    }
  }
});


Template.formInsertMachine.events({
  'change #select-machine-operator': function(event) {
    var selectedOperator = event.currentTarget.value;

    if (Session.get('SELECTED_MACHINE_OPERATOR') == undefined){
      var sessionArray = [];
    }else{
      sessionArray = Session.get('SELECTED_MACHINE_OPERATOR');
    }
    sessionArray.push(selectedOperator);
    Session.set('SELECTED_MACHINE_OPERATOR', sessionArray);
  },

  'click .operator-remove-button': function(event){
    var idToRemove = this._id;
    var operatorArray = Session.get('SELECTED_MACHINE_OPERATOR');
    var index = operatorArray.indexOf(idToRemove);
    var removeFromOpArray = operatorArray.splice(index,1);
    Session.set('SELECTED_MACHINE_OPERATOR', operatorArray);
  },

  'submit #insert-machine-form':function(event, template){
    var machineType = Session.get('SELECTED_MACHINE_TYPE');
    var companyMachine = Session.get('SELECTED_MACHINE_COMPANY');
    var Operator = Session.get('SELECTED_MACHINE_OPERATOR');

    var profileValueArray = $('.profile-value').serializeArray();
    var profileUnitArray  = $('.profile-unit').serializeArray();
    var profileLimitArray = $('.profile-limit').serializeArray();

    var goalDescriptionArray = $('.goal-description').serializeArray();
    var goalValueArray  = $('.goal-value').serializeArray();

    for(i = 0; i < profileValueArray.length; i++){
      profileValueArray[i] = profileValueArray[i].value;
      profileUnitArray[i] = profileUnitArray[i].value;
      profileLimitArray[i] = profileLimitArray[i].value;
    }

    for(i = 0; i < goalDescriptionArray.length; i++){
      goalDescriptionArray[i] = goalDescriptionArray[i].value;
      goalValueArray[i] = goalValueArray[i].value;
    }


    var machineData = {
      _idCompany      : companyMachine,
      _idMachineType  : machineType,
      machinename     : template.find('#machinename').value,
      serialnumber    : template.find('#serialnumber').value,
      info 		        : template.find('#machineinfo').value,
      profileValue    : profileValueArray,
      profileUnit     : profileUnitArray,
      profileLimit    : profileLimitArray,
      goalDescription : goalDescriptionArray,
      goalValue       : goalValueArray,
      Operator        : Session.get('SELECTED_MACHINE_OPERATOR'),
    }

    //Envia para o Shower para validar o Formulário
    var validationObject = Shower.insertMachineForm.validate(machineData);

    if(validationObject.errors == 0){
      Meteor.call('insertMachineMtd', machineData, function(error, result){
        if(result == true){
          Materialize.toast('Máquina ' + '(' + machineData.name + ')' + ' inserida com sucesso!', 3000);
          template.find('#insert-machine-form').reset();
          Router.go('machine');
        }else{
          Materialize.toast('Erro ao inserir máquina! Tente novamente!', 3000);
        }
      });
      Session.set('SELECTED_MACHINE_OPERATOR', undefined);
    }else{
      return false;
    }

}

});

Template.formUpdateMachine.events({
  'change #select-machine-operator': function(event) {
    var selectedOperator = event.currentTarget.value;

    if (Session.get('SELECTED_MACHINE_OPERATOR') == undefined){
      var sessionArray = [];
    }else{
      sessionArray = Session.get('SELECTED_MACHINE_OPERATOR');
    }
    sessionArray.push(selectedOperator);
    Session.set('SELECTED_MACHINE_OPERATOR', sessionArray);
  },

  'click .operator-remove-button': function(event){
    var idToRemove = this._id;
    var operatorArray = Session.get('SELECTED_MACHINE_OPERATOR');
    var index = operatorArray.indexOf(idToRemove);
    var removeFromOpArray = operatorArray.splice(index,1);
    Session.set('SELECTED_MACHINE_OPERATOR', operatorArray);
  },

  'submit #update-machine-form':function(event, template){
    event.preventDefault();

    var profileValueArray = $('.profile-value').serializeArray();
    var profileUnitArray  = $('.profile-unit').serializeArray();
    var profileLimitArray = $('.profile-limit').serializeArray();

    var goalDescriptionArray = $('.goal-description').serializeArray();
    var goalValueArray  = $('.goal-value').serializeArray();

    for(i = 0; i < profileValueArray.length; i++){
      profileValueArray[i] = profileValueArray[i].value;
      profileUnitArray[i] = profileUnitArray[i].value;
      profileLimitArray[i] = profileLimitArray[i].value;
    }

    for(i = 0; i < goalDescriptionArray.length; i++){
      goalDescriptionArray[i] = goalDescriptionArray[i].value;
      goalValueArray[i] = goalValueArray[i].value;
    }


    var machineData = {
      _idMachine      : Session.get('SELECTED_MACHINE'),
      machinename     : template.find('#machinename').value,
      serialnumber    : template.find('#serialnumber').value,
      info            : template.find('#machineinfo').value,
      profileValue    : profileValueArray,
      profileUnit     : profileUnitArray,
      profileLimit    : profileLimitArray,
      goalDescription : goalDescriptionArray,
      goalValue       : goalValueArray,
      Operator        : Session.get('SELECTED_MACHINE_OPERATOR'),
    }

    //Envia para o Shower para validar o Formulário
    var validationObject = Shower.updateMachineForm.validate(machineData);

    if(validationObject.errors == 0){
      Meteor.call('updateMachineMtd', machineData, function(error, result){
        if(result == true){
          Materialize.toast('Máquina ' + '(' + machineData.name + ')' + ' atualizada com sucesso!', 3000);
          template.find('#update-machine-form').reset();
          Session.set('SELECTED_MACHINE_OPERATOR', undefined);
          Router.go('machine');
        }else{
          Materialize.toast('Erro ao editar máquina! Tente novamente!', 3000);
        }
      });
    }else{
      return false;
    }
  }
});


Template.deleteMachineModal.events({
  'click #confirmDelete':function(event, template){
    var thisMachine = Session.get('SELECTED_MACHINE');

     //Envia ao método
     if (Meteor.call('deleteMachineMtd', thisMachine)) {
      Materialize.toast('Erro ao excluir! Tente novamente.', 3000);
    } else {
      Materialize.toast('Máquina excluída com sucesso!', 3000);
    }
  },
});


Template.statusMachineModal.events({
  'click #save-status-machine-button':function(event, template){
    var thisMachine = Session.get('SELECTED_MACHINE');
    var machineData = {
      _id    : thisMachine,
      sysstatus : template.find('input:radio[name=sysstatus]:checked').value,
    }

     //Envia ao método
     if (Meteor.call('updateStatusMachineMtd', machineData)) {
      Materialize.toast('Erro ao atualizar o Status! Tente novamente.', 3000);
    } else {
      Router.go('machine');
      Materialize.toast('Status Atualizado com Sucesso!', 3000);
    }
  },
});


Template.emergencyMachineModal.events({
  'click #save-emergency-machine-button':function(event, template){
    event.preventDefault();
    var thisMachine = Session.get('SELECTED_MACHINE');

    var StopEmergency = {
      _idMachine            : thisMachine,
      switchEmergencia      : checkToInt(template.find('#switchEmergencia').checked),
      switchTravaExterna    : checkToInt(template.find('#switchTravaExterna').checked),
      switchTravaInterna    : checkToInt(template.find('#switchTravaInterna').checked),
      switchIluminacao      : checkToInt(template.find('#switchIluminacao').checked),
    }

    if (Meteor.call('updateEmergencyMtd', StopEmergency)) {
      Materialize.toast('Erro ao atualizar os Eventos de Emergência! Tente novamente.', 3000);
    } else {
      Router.go('machine');
      Materialize.toast('Eventos de Emergência atualizado com Sucesso!', 3000);
    }
  },
});

//********************************************************************************
// Lifecycle Hook
//********************************************************************************
Template.machine.onRendered( function() {
  /*controle dos menús*/
  $('#home').removeClass('active');
  $('#notifications').removeClass('active');
  $('#administration').addClass('active');
  $('#report').removeClass('active');

  $('#mastercompany').removeClass('active');
  $('#company').removeClass('active');
  $('#users').removeClass('active');
  $('#admmachine').addClass('active');
  $('#machine').addClass('active');
  $('#typemachine').removeClass('active');
  $('#registermachine').addClass('active');
  $('#eventsmachine').removeClass('active');
  $('#device').removeClass('active');

  $('#homecell').removeClass('active');
  $('#notificationscell').removeClass('active');
  $('#reportcell').removeClass('active');
  $('#administrationcell').addClass('active');
  $('#mastercompanycell').removeClass('active');
  $('#companycell').removeClass('active');
  $('#userscell').removeClass('active');
  $('#admmachinecell').addClass('active');
  $('#machinecell').addClass('active');
  $('#typemachinecell').removeClass('active');
  $('#registermachinecell').addClass('active');
  $('#eventsmachinecell').removeClass('active');
  $('#devicecell').removeClass('active');

  /*controle da cor de fundo do template*/
  $('body').removeClass('grey darken-4');

  /*controle do layout do template*/
  $('#main').addClass('main-administration');
  $('#footer').addClass('main-administration');

  /*inicialização de pluguins*/
  $('.tooltipped').tooltip({delay: 50});
  $('.modal-trigger').leanModal({
    dismissible: false,
  });
  $('ul.tabs').tabs();

  $('#data-table-machine').DataTable( {
    "order": [[ 3, "asc" ]],
    "language": {
      "sEmptyTable": "Nenhum registro encontrado",
      "sInfo": "Mostrando de _START_ até _END_ de _TOTAL_ registros",
      "sInfoEmpty": "Mostrando 0 até 0 de 0 registros",
      "sInfoFiltered": "(Filtrados de _MAX_ registros)",
      "sInfoPostFix": "",
      "sInfoThousands": ".",
      "sLengthMenu": "Mostrar _MENU_",
      "sLoadingRecords": "Carregando...",
      "sProcessing": "Processando...",
      "sZeroRecords": "Nenhum registro encontrado",
      "sSearch": "Pesquisar",
      "oPaginate": {
        "sNext": "Próximo",
        "sPrevious": "Anterior",
        "sFirst": "Primeiro",
        "sLast": "Último"
      },
      "oAria": {
        "sSortAscending": ": Ordenar colunas de forma ascendente",
        "sSortDescending": ": Ordenar colunas de forma descendente"
      }
    }
  });

  $('select').material_select();

});


Template.selectTypeMachineModal.onRendered( function() {
  /*controle da cor de fundo do template*/
  $('body').removeClass('grey darken-4');

  /*controle do layout da tela*/
  $('#main').addClass('main-administration');
  $('#footer').addClass('main-administration');

  /*inicialização de pluguins*/
  $('.tooltipped').tooltip({delay: 50});
  $('select').select2();
});


Template.formInsertMachine.onRendered( function() {
  /*controle da cor de fundo do template*/
  $('body').removeClass('grey darken-4');

  /*controle do layout da tela*/
  $('#main').addClass('main-administration');
  $('#footer').addClass('main-administration');

  /*inicialização de pluguins*/
  $('.tooltipped').tooltip({delay: 50});
  $('select').select2();
  $('ul.tabs').tabs();
  $('.modal-trigger').leanModal({
    dismissible: true,
  });
});


Template.formUpdateMachine.onRendered( function() {
  /*controle da cor de fundo do template*/
  $('body').removeClass('grey darken-4');

  /*controle do layout da tela*/
  $('#main').addClass('main-administration');
  $('#footer').addClass('main-administration');

  /*inicialização de pluguins*/
  $('.tooltipped').tooltip({delay: 50});
  $('select').select2();
  $('ul.tabs').tabs();
  $('.modal-trigger').leanModal({
    dismissible: false,
  });
});


Template.formInsertMachine.onDestroyed( function() {
  delete Session.keys['SELECTED_MACHINE'];
  delete Session.keys['SELECTED_MACHINE_OPERATOR'];
  delete Session.keys['SELECTED_MACHINE_TYPE'];
  delete Session.keys['SELECTED_MACHINE_COMPANY'];
});

Template.formUpdateMachine.onDestroyed( function() {
  delete Session.keys['SELECTED_MACHINE'];
  delete Session.keys['SELECTED_MACHINE_OPERATOR'];
  delete Session.keys['SELECTED_MACHINE_TYPE'];
  delete Session.keys['SELECTED_MACHINE_COMPANY'];
});

}