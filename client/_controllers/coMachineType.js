//================================================================================
//  @file         coMachinesType.js
//  @version      0.0.1
//  @path         client/_controllers/
//  @description  CONTROLLER para MachinesType.
//  @author       MateusDeveloper
//  @contact      mateus.developer@gmail.com
//  @copyright    Copyright Mateus Cardoso Nunes
//================================================================================

if (Meteor.isClient) {

//********************************************************************************
// Helpers
//********************************************************************************
Template.typeMachine.helpers({
  'getMachineType': function(){
    return MachineType.find({}, {sort: {name: 1}});
  },
});


Template.formInsertTypeMachine.helpers({
  /*Tab Company*/
  'getMasterCompany': function(){
    return MasterCompany.find({ "Contact.email": { $not: "god@system.com"}}).fetch();
  },

  'getSelectedCompany': function(){
    var selectedList = Session.get('SELECTED_COMPANY');

    if(selectedList !== undefined){
      return MasterCompany.find({_id : {$in: selectedList}}).fetch();
    }else{
      return '';
    }
  },

  /*Tab Profile*/
  'getProfileData': function(){
    return Session.get('PROFILE_ARRAY');
  },

  /*Tab Goal*/
  'getGoalData': function(){
    return Session.get('GOAL_ARRAY');
  },

  /*Tab Operators*/
  'getOperatorData': function(){
    return Session.get('OPERATOR_ARRAY');
  },
});


Template.formUpdateTypeMachine.helpers({
  'getTypeMachine': function(){
    var thisTypeMachine = Session.get('SELECTED_UPDATE_TYPEMACHINE');
    return MachineType.findOne(thisTypeMachine);
  },

  /*Tab Company*/
  'getMasterCompany': function(){
    return MasterCompany.find({ "Contact.email": { $not: "god@system.com"}}).fetch();
  },

  'getSelectedCompany': function(){
    var selectedList = Session.get('SELECTED_COMPANY');

    if(selectedList !== undefined){
      return MasterCompany.find({_id : {$in: selectedList}}).fetch();
    }else{
      return '';
    }
  },

  /*Tab Profile*/
  'getProfileData': function(){
    return Session.get('PROFILE_ARRAY');
  },

  /*Tab Goal*/
  'getGoalData': function(){
    return Session.get('GOAL_ARRAY');
  },

  /*Tab Operators*/
  'getOperatorData': function(){
    return Session.get('OPERATOR_ARRAY');
  },

});


Template.deleteTypeMachineModal.helpers({
  'getMachineAssociated': function(){
    var machineTypeAssociated = Session.get('MACHINE_TYPE_ASSOCIATED');
    if(machineTypeAssociated == true){
      return true;
    }else{
      return false;
    }
  },
});



//********************************************************************************
// Events
//********************************************************************************
Template.typeMachine.events({
  'click .update-typemachine-button': function(){
    var typeMachineId = this._id;
    Session.set('SELECTED_UPDATE_TYPEMACHINE', typeMachineId);

    /*Parametros para atualizar*/
    var typeMachineObj = MachineType.findOne(this);

    /*Company*/
    var companyArray = typeMachineObj.MasterCompany;
    Session.set('SELECTED_COMPANY', companyArray);

    // /*Profile*/
    var profileArray = typeMachineObj.Definitions.Profile;
    var arrayToAdd = [];
    if(profileArray.value != null){
      for(i = 0; profileArray.value.length > i; i++){
        var newProfileArray = [profileArray.value[i], profileArray.unit[i], profileArray.limit[i]];
        arrayToAdd.push(newProfileArray);
      }
    }
    Session.set('PROFILE_ARRAY', arrayToAdd);

    /*Goals*/
    var goalsArray = typeMachineObj.Definitions.Goals;
    var arrayToAdd = [];
    if(goalsArray.description != null){
      for(i = 0; goalsArray.description.length > i; i++){
        var newGoalArray = [goalsArray.description[i], goalsArray.value[i]];
        arrayToAdd.push(newGoalArray);
      }
    }
    Session.set('GOAL_ARRAY', arrayToAdd);

    /*Operators*/
    var operatorsArray = typeMachineObj.Definitions.Operators.roles;
    Session.set('OPERATOR_ARRAY', operatorsArray);

    Router.go('/formUpdateTypeMachine');
  },

  'click .delete-typemachine-button': function(){
    Session.set('MACHINE_TYPE_ASSOCIATED', false);

    var typeMachineId = this._id;
    Session.set('SELECTED_TYPEMACHINE', typeMachineId);
  },
});


Template.formInsertTypeMachine.events({

  /* Tab Company */
  'change #select-company-machine': function(event) {
    var selectedCompanyId = event.currentTarget.value;
    var selectedCompanyIdString = removeObject(selectedCompanyId);
    var companyIdFormated = new Mongo.ObjectID(selectedCompanyIdString);
    if (Session.get('SELECTED_COMPANY') == undefined){
      var sessionArray = [];
    }else{
      sessionArray = Session.get('SELECTED_COMPANY');
    }

    var findEquals = false;

    for(var i = 0; sessionArray.length > i; i++){
      if(sessionArray[i].toString() == companyIdFormated.toString()){
        var findEquals = true;
      }
    }

    if(findEquals != true) {
      sessionArray.push(companyIdFormated);
      Session.set('SELECTED_COMPANY', sessionArray);
    } else {
      return;
    }
  },

  'click .company-remove-button': function(event){
    var idToRemove = this._id;
    var companyArray = Session.get('SELECTED_COMPANY');
    for(var i = 0; companyArray.length > i; i++){
      if(companyArray[i].toString() == idToRemove.toString()){
        var index = i;
      }
    }
    var removeFromOpArray = companyArray.splice(index,1);
    Session.set('SELECTED_COMPANY', companyArray);
  },


  /*Tab Profile*/
  'click #add-profile-button': function(event, template){
    event.preventDefault();

    var newProfile = {
      description : template.find('#profile-description').value,
      unit        : template.find('#profile-unit').value,
      limit       : template.find('#profile-limit').value,
    }

    if(Session.get('PROFILE_ARRAY') == undefined){
      Session.set('PROFILE_ARRAY', []);
    }
    var sessionArray = Session.get('PROFILE_ARRAY');
    var arrayToAdd = [ newProfile.description, newProfile.unit, newProfile.limit];
    sessionArray.push(arrayToAdd);
    Session.set('PROFILE_ARRAY', sessionArray);

    template.find('#profile-description').value = null;
    template.find('#profile-unit').value = null;
    template.find('#profile-limit').value = null;
  },

  'click .remove-profile-button': function(event){
    var idToRemove = this;
    var sessionArray = Session.get('PROFILE_ARRAY');
    var index = null;
    for(var i = 0; sessionArray.length > i; i++){
      if(sessionArray[i].toString() == idToRemove.toString()){
        index = i;
      }
    }
    var removeFromOpArray = sessionArray.splice(index,1);
    Session.set('PROFILE_ARRAY', sessionArray);
  },


  /*Tab Goal*/
  'click #add-goal-button': function(event, template){
    event.preventDefault();

    var newGoal = {
      description : template.find('#goal-description').value,
      unit        : template.find('#goal-unit').value,
    }

    if(Session.get('GOAL_ARRAY') == undefined){
      Session.set('GOAL_ARRAY', []);
    }
    var sessionArray = Session.get('GOAL_ARRAY');
    var arrayToAdd = [ newGoal.description, newGoal.unit];
    sessionArray.push(arrayToAdd);
    Session.set('GOAL_ARRAY', sessionArray);

    template.find('#goal-description').value = null;
    template.find('#goal-unit').value = null;
  },

  'click .remove-goal-button': function(event){
    var idToRemove = this;
    var sessionArray = Session.get('GOAL_ARRAY');
    var index = null;
    for(var i = 0; sessionArray.length > i; i++){
      if(sessionArray[i].toString() == idToRemove.toString()){
        index = i;
      }
    }
    var removeFromOpArray = sessionArray.splice(index,1);
    Session.set('GOAL_ARRAY', sessionArray);
  },


  /* Tab Operator */
  'change #select-operator-type': function(event, template) {
    var selectOperatorType = template.find('#select-operator-type').value;

    if (Session.get('OPERATOR_ARRAY') == undefined){
      var sessionArray = [];
    }else{
      var sessionArray = Session.get('OPERATOR_ARRAY');
    }

    var findToArray = sessionArray.indexOf(selectOperatorType);

    if(findToArray === -1){
      sessionArray.push(selectOperatorType);
      Session.set('OPERATOR_ARRAY', sessionArray);
    }else {
      return;
    }
  },

  'click .remove-operator-button': function(event){
    var idToRemove = this;
    var sessionArray = Session.get('OPERATOR_ARRAY');
    var index = null;
    for(var i = 0; sessionArray.length > i; i++){
      if(sessionArray[i].toString() == idToRemove.toString()){
        index = i;
      }
    }
    var removeFromOpArray = sessionArray.splice(index,1);
    Session.set('OPERATOR_ARRAY', sessionArray);
  },


  /*SUBMIT FORM*/
  'submit #insert-typemachine-form':function(event, template){
    event.preventDefault();

    var machineTypeData = {
      description : template.find('#description').value,
      info        : template.find('#info').value,
      company     : Session.get('SELECTED_COMPANY'),
      profile     : Session.get('PROFILE_ARRAY'),
      goal        : Session.get('GOAL_ARRAY'),
      operators   : Session.get('OPERATOR_ARRAY'),
    }

    var validationObject = Shower.insertTypeMachineForm.validate(machineTypeData);

    if(validationObject.errors == 0){
      Meteor.call('insertMachineTypeMtd', machineTypeData, function(error, result){
        if(result == true){
          Materialize.toast('Tipo de Máquina inserido com sucesso!', 3000);
          template.find('#insert-typemachine-form').reset();
          Router.go('typeMachine');
        }else{
          Materialize.toast('Erro ao inserir tipo de máquina! Tente novamente!', 3000);
        }
      });
    }else{
      return false;
    }
  }
});


Template.formUpdateTypeMachine.events({

  /* Tab Company */
  'change #select-company-machine': function(event) {
    var selectedCompanyId = event.currentTarget.value;
    var selectedCompanyIdString = removeObject(selectedCompanyId);
    var companyIdFormated = new Mongo.ObjectID(selectedCompanyIdString);
    if (Session.get('SELECTED_COMPANY') == undefined){
      var sessionArray = [];
    }else{
      sessionArray = Session.get('SELECTED_COMPANY');
    }
    sessionArray.push(companyIdFormated);
    Session.set('SELECTED_COMPANY', sessionArray);
  },

  'click .company-remove-button': function(event){
    var idToRemove = this._id;

    /*verificar se esta compania não tem máquinas com este tipo associado*/
    var objMasterCompany = MasterCompany.findOne({_id: idToRemove});
    var arrayCompanyObj = Company.find({_idMasterCompany: objMasterCompany._id}).fetch();

    if(arrayCompanyObj.length != 0){
      for(i=0; arrayCompanyObj.length >= i; i++){
        if(arrayCompanyObj[i] != undefined){
          var arrayMachinesObj = Machines.find({_idCompany: arrayCompanyObj[i]._id}).fetch();
          if(arrayMachinesObj.length != 0){
            for(j=0; arrayMachinesObj.length >= j; j++){
              if(arrayMachinesObj[j] != undefined){
                var thisMachineObj = arrayMachinesObj[j];
                var thisTypeMachineObj = MachineType.findOne({_id: Session.get('SELECTED_UPDATE_TYPEMACHINE')});
                if(thisMachineObj._idMachineType != null){
                  if(thisMachineObj._idMachineType.valueOf() == thisTypeMachineObj._id.valueOf()){
                    var findMachine = 0 + j;
                  } else{
                    var notFindMachine = 0 + j;
                  }
                }else{
                }
              }else{
              }
            }
          }else {
          }
        }else {
          if((findMachine === undefined)&&((notFindMachine != 0)||(notFindMachine != undefined))){
            var companyArray = Session.get('SELECTED_COMPANY');
            for(var i = 0; companyArray.length > i; i++){
              if(companyArray[i].toString() == idToRemove.toString()){
                var index = i;
              }
            }
            var removeFromOpArray = companyArray.splice(index,1);
            Session.set('SELECTED_COMPANY', companyArray);
          }else {
            Materialize.toast('NÃO PODE APAGAR!!!', 6000);
            Materialize.toast('Esta Compania tem Máquinas com este Tipo associado!', 6000);
            return;
          }
          return;
        }
      }
    }else {
      var companyArray = Session.get('SELECTED_COMPANY');
      for(var i = 0; companyArray.length > i; i++){
        if(companyArray[i].toString() == idToRemove.toString()){
          var index = i;
        }
      }
      var removeFromOpArray = companyArray.splice(index,1);
      Session.set('SELECTED_COMPANY', companyArray);
    }
  },

  /*Tab Profile*/
  'click #add-profile-button': function(event, template){
    event.preventDefault();

    var newProfile = {
      description : template.find('#profile-description').value,
      unit        : template.find('#profile-unit').value,
      limit       : template.find('#profile-limit').value,
    }

    if(Session.get('PROFILE_ARRAY') == undefined){
      Session.set('PROFILE_ARRAY', []);
    }
    var sessionArray = Session.get('PROFILE_ARRAY');
    var arrayToAdd = [ newProfile.description, newProfile.unit, newProfile.limit];
    sessionArray.push(arrayToAdd);
    Session.set('PROFILE_ARRAY', sessionArray);

    template.find('#profile-description').value = null;
    template.find('#profile-unit').value = null;
    template.find('#profile-limit').value = null;
  },

  'click .remove-profile-button': function(event){
    var idToRemove = this;
    var sessionArray = Session.get('PROFILE_ARRAY');
    var index = null;
    for(var i = 0; sessionArray.length > i; i++){
      if(sessionArray[i].toString() == idToRemove.toString()){
        index = i;
      }
    }
    var removeFromOpArray = sessionArray.splice(index,1);
    Session.set('PROFILE_ARRAY', sessionArray);
  },


  /*Tab Goal*/
  'click #add-goal-button': function(event, template){
    event.preventDefault();

    var newGoal = {
      description : template.find('#goal-description').value,
      unit        : template.find('#goal-unit').value,
    }

    if(Session.get('GOAL_ARRAY') == undefined){
      Session.set('GOAL_ARRAY', []);
    }
    var sessionArray = Session.get('GOAL_ARRAY');
    var arrayToAdd = [ newGoal.description, newGoal.unit];
    sessionArray.push(arrayToAdd);
    Session.set('GOAL_ARRAY', sessionArray);

    template.find('#goal-description').value = null;
    template.find('#goal-unit').value = null;
  },

  'click .remove-goal-button': function(event){
    var idToRemove = this;
    var sessionArray = Session.get('GOAL_ARRAY');
    var index = null;
    for(var i = 0; sessionArray.length > i; i++){
      if(sessionArray[i].toString() == idToRemove.toString()){
        index = i;
      }
    }
    var removeFromOpArray = sessionArray.splice(index,1);
    Session.set('GOAL_ARRAY', sessionArray);
  },


  /* Tab Operator */
  'change #select-operator-type': function(event, template) {
    var selectOperatorType = template.find('#select-operator-type').value;

    if (Session.get('OPERATOR_ARRAY') == undefined){
      var sessionArray = [];
    }else{
      var sessionArray = Session.get('OPERATOR_ARRAY');
    }

    var findToArray = sessionArray.indexOf(selectOperatorType);

    if(findToArray === -1){
      sessionArray.push(selectOperatorType);
      Session.set('OPERATOR_ARRAY', sessionArray);
    }else {
      return;
    }
  },

  'click .remove-operator-button': function(event){
    var idToRemove = this;
    var sessionArray = Session.get('OPERATOR_ARRAY');
    var index = null;
    for(var i = 0; sessionArray.length > i; i++){
      if(sessionArray[i].toString() == idToRemove.toString()){
        index = i;
      }
    }
    var removeFromOpArray = sessionArray.splice(index,1);
    Session.set('OPERATOR_ARRAY', sessionArray);
  },


  /*SUBMIT FORM*/
  'submit #update-typemachine-form':function(event, template){
    event.preventDefault();

    var machineTypeData = {
      _id         : Session.get('SELECTED_UPDATE_TYPEMACHINE'),
      description : template.find('#description').value,
      info        : template.find('#info').value,
      company     : Session.get('SELECTED_COMPANY'),
      profile     : Session.get('PROFILE_ARRAY'),
      goal        : Session.get('GOAL_ARRAY'),
      operators   : Session.get('OPERATOR_ARRAY'),
    }

    var validationObject = Shower.updateTypeMachineForm.validate(machineTypeData);

    if(validationObject.errors == 0){
      Meteor.call('updateTypeMachineMtd', machineTypeData, function(error, result){
        if(result == true){
          Materialize.toast('Tipo de Máquina atualizado com sucesso!', 3000);
          template.find('#update-typemachine-form').reset();
          Router.go('typeMachine');
        }else{
          Materialize.toast('Erro ao editar tipo de máquina! Tente novamente!', 3000);
        }
      });
    }else{
      return false;
    }
  },
});


Template.deleteTypeMachineModal.events({
  'click #confirm-delete-machinetype-button':function(event, template){
    var thisTypeMachine = Session.get('SELECTED_TYPEMACHINE');

    /*validar se não tem máquina associada*/
    var machineTypeObj = MachineType.findOne({_id: thisTypeMachine});
    var machineUseType = Machines.findOne({_idMachineType: machineTypeObj._id});

    if(machineUseType != undefined){
      Session.set('MACHINE_TYPE_ASSOCIATED', true);
    }else{
      //Envia ao método
      if (Meteor.call('deleteTypeMachineMtd', thisTypeMachine)) {
        Materialize.toast('Erro ao excluir! Tente novamente.', 3000);
      } else {
        Materialize.toast('Tipo de Máquina excluído com sucesso!', 3000);
        document.getElementById('cancel-delete-machinetype-button').click();
      }
    };
  },
});



//********************************************************************************
// Lifecycle Hook
//********************************************************************************
Template.typeMachine.onRendered( function() {
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
  $('#typemachine').addClass('active');
  $('#registermachine').removeClass('active');
  $('#profilemachine').removeClass('active');
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
  $('#typemachinecell').addClass('active');
  $('#registermachinecell').removeClass('active');
  $('#profilemachinecell').removeClass('active');
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

  $('#data-table-typemachine').DataTable( {
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


Template.formInsertTypeMachine.onRendered( function() {
  /*controle da cor de fundo do template*/
  $('body').removeClass('grey darken-4');

  /*controle do layout da tela*/
  $('#main').addClass('main-administration');
  $('#footer').addClass('main-administration');

  /*inicialização de pluguins*/
  $('.tooltipped').tooltip({delay: 50});
  $('select').select2();
  $('ul.tabs').tabs();
});


Template.formUpdateTypeMachine.onRendered( function() {
  /*controle da cor de fundo do template*/
  $('body').removeClass('grey darken-4');

  /*controle do layout da tela*/
  $('#main').addClass('main-administration');
  $('#footer').addClass('main-administration');

  /*inicialização de pluguins*/
  $('.tooltipped').tooltip({delay: 50});
  $('select').select2();
  $('ul.tabs').tabs();
});


Template.formInsertTypeMachine.onDestroyed( function() {
  delete Session.keys['SELECTED_COMPANY'];
  delete Session.keys['PROFILE_ARRAY'];
  delete Session.keys['GOAL_ARRAY'];
  delete Session.keys['OPERATOR_ARRAY'];
});


Template.formUpdateTypeMachine.onDestroyed( function() {
  delete Session.keys['SELECTED_UPDATE_TYPEMACHINE'];
  delete Session.keys['SELECTED_COMPANY'];
  delete Session.keys['PROFILE_ARRAY'];
  delete Session.keys['GOAL_ARRAY'];
  delete Session.keys['OPERATOR_ARRAY'];
});



}