//================================================================================
//  @file         coUsers.js
//  @version      0.0.1
//  @path         client/_controllers/
//  @description  CONTROLLER para Users.
//  @author       MateusDeveloper
//  @contact      mateus.developer@gmail.com
//  @copyright    Copyright Mateus Cardoso Nunes
//================================================================================
if (Meteor.isClient) {

//********************************************************************************
// Helpers
//********************************************************************************
Template.user.helpers({
  'getUsers': function(){
    var userObj = Meteor.user();
    if(Roles.userIsInRole(userObj, 'God')){
      return Meteor.users.find({}, {sort: {name: 1}});
    }
    if(Roles.userIsInRole(userObj, 'SysAdm')){
      return Meteor.users.find({roles: {$in: ['SysAdm', 'Adm', 'Supervisor', 'Operator']}}, {sort: {name: 1}});
    }
    if(Roles.userIsInRole(userObj, 'Adm')){
      return Meteor.users.find({roles: {$in: ['Adm', 'Supervisor', 'Operator']}}, {sort: {name: 1}});
    }
    if(Roles.userIsInRole(userObj, 'Supervisor')){
      return Meteor.users.find({roles: {$in: ['Supervisor', 'Operator']}}, {sort: {name: 1}});
    }
  },


  'getCompanyName': function(userObj){
    if(userObj._idMasterCompany == undefined){
      return Company.findOne({_id: userObj._idCompany}).name;
    }else{
      return MasterCompany.findOne({_id: userObj._idMasterCompany}).name;
    }
  },

  'notOwnUser': function(lineUser){
    var userObj = Meteor.user();
    if(lineUser._id == userObj._id){
      return false;
    }else{
      return true;
    }
  },

});


Template.formInsertUser.helpers({
  'showHideMaster': function(){
    var selectedMaster = Session.get('selectedMasterSysadm');
    if(selectedMaster == "SysAdm"){
      return "";
    }else {
      return "hide";
    }
  },

  'showHideCompany': function(){
    var selectedMaster = Session.get('selectedMasterSysadm');
    if(selectedMaster == "SysAdm"){
      return "hide";
    }else {
      return "";
    }
  },

  'getCompany': function(){
    var companyList = Company.find().fetch();
    return companyList;
  },

  'getMasterCompany': function(){
    var masterList = MasterCompany.find().fetch();
    return masterList;
  }
});


Template.formUpdateUser.helpers({
  'getUser': function(){
    var thisUser = Session.get('selectedUser');
    return Meteor.users.findOne(thisUser);
  },

  'getCompany': function(){
    var companyList = Company.find().fetch();
    return companyList;
  },

  'selectedForUser': function(_idCompany){
    var thisUser = Session.get('selectedUser');
    var userObj = Meteor.users.findOne({_id:thisUser});

    if(Roles.userIsInRole(userObj, 'SysAdm')){
      return '';
    }else{
      if(userObj._idCompany.toString() == _idCompany.toString()){
        return 'selected';
      }else {
        return '';
      }
    }
  },

  'selectedForMaster': function(_idMaster){
    var thisUser = Session.get('selectedUser');
    var userObj = Meteor.users.findOne({_id:thisUser});

    if(Roles.userIsInRole(userObj, 'SysAdm')){
      if(userObj._idMasterCompany.toString() == _idMaster.toString()){
        return 'selected';
      }else {
        return '';
      }
    }else{
      return '';
    }

  },

  'showHideMaster': function(){
    var selectedMaster = Session.get('selectedMasterSysadm');
    if(selectedMaster == "SysAdm"){
      return "";
    }else {
      return "hide";
    }
  },

  'showHideCompany': function(){
    var selectedMaster = Session.get('selectedMasterSysadm');
    if(selectedMaster == "SysAdm"){
      return "hide";
    }else {
      return "";
    }
  },

  'getMasterCompany': function(){
    var masterList = MasterCompany.find().fetch();
    return masterList;
  }
});


Template.deleteUserModal.helpers({
  'getUser': function(){
    var thisUser = Session.get('selectedUser');
    return Meteor.users.findOne(thisUser);
  },
});



//********************************************************************************
// Events
//********************************************************************************
Template.user.events({
  'click .update-user-button': function(){
    var userId = this._id;
    Session.set('selectedUser', userId);
    var userObj = Meteor.users.findOne({_id: userId});

    if(Roles.userIsInRole(userObj, 'SysAdm')){
      Session.set('selectedMasterSysadm', 'SysAdm');
    }
    Router.go('/formUpdateUser');
  },

  'click .user-delete-button': function(){
    var userId = this._id;
    Session.set('selectedUser', userId);
  },

});


Template.formInsertUser.events({
  'change #rolepicker' :function(event, template){
    Session.set('selectedMasterSysadm', template.find('#rolepicker').value);
  },

  'submit #insert-user-form':function(event, template){
    event.preventDefault();
    var userObj = Meteor.user();

    //Testa se é SysAdm
    if(Roles.userIsInRole(userObj, 'God')){
      if(template.find('#select-master-company').value == ""){
        var company = template.find('#select-company').value;
        company = removeObject(company);

        var userData = {
          name    : template.find('#newName').value,
          email   : template.find('#newEmail').value,
          password: template.find('#newPassword').value,
          passwordagain: template.find('#newPasswordAgain').value,
          role    : template.find('#rolepicker').value,
          company : company,
        }
      }else{
        var masterCompany = template.find('#select-master-company').value;
        masterCompany = removeObject(masterCompany);

        var userData = {
          name    : template.find('#newName').value,
          email   : template.find('#newEmail').value,
          password: template.find('#newPassword').value,
          passwordagain: template.find('#newPasswordAgain').value,
          role    : template.find('#rolepicker').value,
          mastercompany : masterCompany,
        }
      }

    //Se não é SysAdm
  }else{
      //Testa se escolheu SysAdm
      if(Session.get('selectedMasterSysadm') == "SysAdm"){
        var masterCompany = userObj._idMasterCompany._str;

        //Cria o objeto com a referencie de MasterCompany do Usuario logado
        var userData = {
          name    : template.find('#newName').value,
          email   : template.find('#newEmail').value,
          password: template.find('#newPassword').value,
          passwordagain: template.find('#newPasswordAgain').value,
          role    : template.find('#rolepicker').value,
          mastercompany : masterCompany,
        }

      }else{
        var company = template.find('#select-company').value;
        company = removeObject(company);
        //Cria usuario normalmente, com a company selecionada
        var userData = {
          name    : template.find('#newName').value,
          email   : template.find('#newEmail').value,
          password: template.find('#newPassword').value,
          passwordagain: template.find('#newPasswordAgain').value,
          role    : template.find('#rolepicker').value,
          company : company,
        }
      }
    }
    var validationObject = Shower.insertUserForm.validate(userData);

    if(validationObject.errors == 0){
      Meteor.call('insertUserMtd', userData, function(error, result){
        if(result == true){
          Materialize.toast('Usuário ' + '(' + userData.name + ')' + ' inserido com sucesso!', 3000);
          template.find('#insert-user-form').reset();
          Router.go('user');
        }else{
          Materialize.toast('Erro ao inserir novo usuário! Tente novamente!', 3000);
        }
      });

    }else{
      return false;
    }
  }
});


Template.formUpdateUser.events({
  'change #rolepicker' :function(event, template){
    Session.set('selectedMasterSysadm', template.find('#rolepicker').value);
  },

  'submit #update-user-form':function(event, template){
    event.preventDefault();
    var userObj = Meteor.user();

    //Teste se é SysAdm
    if(Roles.userIsInRole(userObj, 'SysAdm')){
      //Teste se o usuário a ser editado é Sysadm
      if(Session.get('selectedMasterSysadm') == "SysAdm"){
        var masterCompany = userObj._idMasterCompany._str;
        //Se sim, usa como referencia de masterCompany o usuário logado

        var userData = {
          _idUser : Session.get('selectedUser'),
          name    : template.find('#newName').value,
          email   : template.find('#newEmail').value,
          role    : template.find('#rolepicker').value,
          mastercompany : masterCompany,
        }

      }else{
        var company = template.find('#select-company').value;
        company = removeObject(company);
        //Se não, cria usuário normalmente

        var userData = {
          _idUser : Session.get('selectedUser'),
          name    : template.find('#newName').value,
          email   : template.find('#newEmail').value,
          role    : template.find('#rolepicker').value,
          company : company,
        }
      }

    }else{
      if(template.find('#select-master-company').value == ""){
        var company = template.find('#select-company').value;
        company = removeObject(company);

        var userData = {
          _idUser : Session.get('selectedUser'),
          name    : template.find('#newName').value,
          email   : template.find('#newEmail').value,
          role    : template.find('#rolepicker').value,
          company : company,
        }
      }else{
        var masterCompany = template.find('#select-master-company').value;
        masterCompany = removeObject(masterCompany);

        var userData = {
          _idUser : Session.get('selectedUser'),
          name    : template.find('#newName').value,
          email   : template.find('#newEmail').value,
          role    : template.find('#rolepicker').value,
          mastercompany : masterCompany,
        }
      }
    }

    var validationObject = Shower.updateUserForm.validate(userData);

    if(validationObject.errors == 0){
      Meteor.call('updateUserMtd', userData, function(error, result){
        if(result == true){
          Materialize.toast('Usuário ' + '(' + userData.name + ')' + ' atualizado com sucesso!', 3000);
          template.find('#update-user-form').reset();
          Router.go('user');
        }else{
          Materialize.toast('Erro ao editar usuário! Tente novamente!', 3000);
        }
      });

    }else{
      return false;
    }
  }
});


Template.deleteUserModal.events({
  'click #confirmDelete':function(event, template){
    var thisUserId = Session.get('selectedUser');

     //Envia ao método
     if (Meteor.call('deleteUserMtd', thisUserId)) {
      Materialize.toast('Erro ao excluir! Tente novamente.', 3000);
    } else {
      Materialize.toast('Usuário excluído com sucesso!', 3000);
    }
  },
});


Template.sysInfoModal.events({
  'submit #update-password-form':function(event, template){
    event.preventDefault();

    var passwordObject = {
      actualPassword      : template.find('#actualPassword').value,
      newPassword         : template.find('#newPassword').value,
      newPasswordAgain    : template.find('#newPasswordAgain').value,
    }

    //Envia ao método
    var validationObject = Shower.updatePasswordForm.validate(passwordObject);

    if(validationObject.errors == 0){
      if(passwordObject.newPassword == passwordObject.newPasswordAgain){
        Accounts.changePassword(passwordObject.actualPassword, passwordObject.newPassword)
        Materialize.toast('Senha alterada com sucesso!', 3000);
        template.find('#update-password-form').reset();
        document.getElementById('close-modal').click();
      }else{
        Materialize.toast('Erro ao alterar senha! Tente novamente!', 3000);
      }
    }else{
      Materialize.toast('Erro ao alterar senha! Tente novamente!', 3000);
      return false;
    }
  },

});



//********************************************************************************
// Lifecycle Hook
//********************************************************************************
Template.user.onRendered( function() {
  /*controle dos menús*/
  $('#home').removeClass('active');
  $('#notifications').removeClass('active');
  $('#administration').addClass('active');
  $('#report').removeClass('active');

  $('#mastercompany').removeClass('active');
  $('#company').removeClass('active');
  $('#users').addClass('active');
  $('#dropdownmachine').removeClass('active');
  $('#admmachine').removeClass('active');
  $('#machine').removeClass('active');
  $('#typemachine').removeClass('active');
  $('#registermachine').removeClass('active');
  $('#eventsmachine').removeClass('active');
  $('#device').removeClass('active');

  $('#homecell').removeClass('active');
  $('#notificationscell').removeClass('active');
  $('#reportcell').removeClass('active');
  $('#dropdownmachinecell').removeClass('active');
  $('#administrationcell').addClass('active');
  $('#mastercompanycell').removeClass('active');
  $('#companycell').removeClass('active');
  $('#userscell').addClass('active');
  $('#admmachinecell').removeClass('active');
  $('#machinecell').removeClass('active');
  $('#typemachinecell').removeClass('active');
  $('#registermachinecell').removeClass('active');
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
    dismissible: true
  });
  $('ul.tabs').tabs();

  $('#data-table-users').DataTable( {
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

  var table = $('#data-table-row-grouping').DataTable({
    "columnDefs": [
    { "visible": false, "targets": 2 }
    ],
    "order": [[ 2, 'asc' ]],
    "displayLength": 25,
    "drawCallback": function ( settings ) {
      var api = this.api();
      var rows = api.rows( {page:'current'} ).nodes();
      var last=null;

      api.column(2, {page:'current'} ).data().each( function ( group, i ) {
        if ( last !== group ) {
          $(rows).eq( i ).before(
            '<tr class="group"><td colspan="5">'+group+'</td></tr>'
            );

          last = group;
        }
      } );
    }
  });

  $('#data-table-row-grouping tbody').on( 'click', 'tr.group', function () {
    var currentOrder = table.order()[0];
    if ( currentOrder[0] === 2 && currentOrder[1] === 'asc' ) {
      table.order( [ 2, 'desc' ] ).draw();
    }
    else {
      table.order( [ 2, 'asc' ] ).draw();
    }
  } );

  $('select').material_select();

});


Template.formInsertUser.onRendered( function() {
  /*inicialização de pluguins*/
  $('.tooltipped').tooltip({delay: 50});
  $('select').select2();
});


Template.formUpdateUser.onRendered( function() {
  /*inicialização de pluguins*/
  $('.tooltipped').tooltip({delay: 50});
  $('select').select2();
});

Template.formInsertUser.onDestroyed( function() {
  delete Session.keys['selectedMasterSysadm']
});

Template.formUpdateUser.onDestroyed( function() {
  delete Session.keys['selectedMasterSysadm']
});


}