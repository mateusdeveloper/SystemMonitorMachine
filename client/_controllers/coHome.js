//================================================================================
//  @file         coHome.js
//  @version      0.0.1
//  @path         client/_controllers/
//  @description  CONTROLLER para Home.
//  @author       MateusDeveloper
//  @contact      mateus.developer@gmail.com
//  @copyright    Copyright Mateus Cardoso Nunes
//================================================================================

if (Meteor.isClient) {

//********************************************************************************
// Helpers
//********************************************************************************
Template.home.helpers({
  'getMachine': function(){
    var userObj = Meteor.user();
    if(Roles.userIsInRole(userObj, 'Operator')){
        return Machines.find({status: {$not: 4}, Operators: userObj._id}, {sort: {name: 1}});
    }else{
        if(Roles.userIsInRole(userObj, ['God', 'SysAdm'])){
            return Machines.find({_idCompany: Session.get('selectedCompany')}, {sort: {name: 1}});
        }else{
            return Machines.find({status: {$not: 4}}, {sort: {name: 1}});
        }
    }
},

'getDeviceKeepAlive': function(IdMachine){
    var DeviceObj = Devices.findOne({_idMachine: IdMachine});
    if(DeviceObj == undefined){
        return "Não Associado";
    }else{
        var keepalive = DeviceObj.KeepAlive.timer;
        var resultFormat = moment(keepalive, 'X').format('DD/MM/YYYY HH:mm:ss');
    }
    return resultFormat;
},

'getCompanyName': function(IdCompany){
    var CompanyObj = Company.findOne(IdCompany);
    var result = CompanyObj.name;
    return result;
},

'printHours': function(){
    var MachineObj = Machines.findOne(this);
    var hours = MachineObj.hourcount;
    if(hours > 3600){
        hours = moment.duration(hours, 'seconds').as('hours');
        hours = hours.toFixed(1).split('.');
        hours[0] = hours[0] + " h";
    }else{
        hours = moment.duration(hours, 'seconds').as('minutes');
        hours = hours.toFixed(1).split('.');
        hours[0] = hours[0] + " min";
    }

    return hours[0];
}
});

Template.home2.helpers({
  'getMasterCompanies': function(){
    var userObj = Meteor.user();
    return MasterCompany.find({ "Contact.email": { $not: "god@system.com"}}).fetch();
},

'countCompanies': function(){
    var thisMasterCompany = this._id;
    return Company.find({_idMasterCompany: thisMasterCompany}).count();
}
});

Template.home3.helpers({
  'getCompanies': function(){
    var userObj = Meteor.user();
    if(Roles.userIsInRole(userObj, 'God')){
        var selectedMasterCompany = Session.get('selectedMasterCompany');
        return Company.find({_idMasterCompany: selectedMasterCompany}).fetch();
    }else{
        return Company.find({_idMasterCompany: userObj._idMasterCompany}).fetch();
    }
},

'countMachines': function(){
    var thisCompany = this._id;
    return Machines.find({_idCompany: thisCompany}).count();
}
});


//********************************************************************************
// Events
//********************************************************************************
Template.home.events({
    'click .gotodash':function(event){
        var thisMachine = this._id;
        var thisDevice = Devices.findOne({_idMachine:thisMachine});
        var machineObj = Machines.findOne({_id : thisMachine});
        var dashcode = machineObj.dashcode;

        //Testa se existe dispositivo associado a Maquina
        if(thisDevice == undefined){
            Materialize.toast('Máquina sem dispositivo associado!', 4000);
        }else{
            Session.set('selectedMachine', thisMachine);
            if(dashcode == 0){
                Router.go('dashboard0');
            }else if(dashcode == 1){
                Router.go('dashboard1');
            }else if(dashcode == 2){
                Router.go('dashboard2');
            }else{
                Materialize.toast('Não existe Dashboard para essa máquina!', 4000);
            }
        }
    },

    'click .gotooperator':function(event){
        var thisMachine = this._id;
        Session.set('selectedMachine', thisMachine);
        Router.go('operator');
    },
});

Template.home2.events({
    'click .gotodash':function(event){
        var thisMasterCompany = this._id;
        //Conta quantas Empresas estão associadas a esta MasterCompany
        var thisCompanies = Company.find({_idMasterCompany:thisMasterCompany}).count();
        //Se vazio, impede o avanço
        if(thisCompanies == 0){
            Materialize.toast('Compania não possui empresas!', 4000);
        }else{
            Session.set('selectedMasterCompany', thisMasterCompany);
            Router.go('home3');
        }
    },
});

Template.home3.events({
    'click .gotodash':function(event){
        var thisCompany = this._id;

        //Conta quantas Máquinas estão associadas a esta Empresa
        var thisMachines = Machines.find({_idCompany:thisCompany}).count();
        //Se vazio, impede o avanço
        if(thisMachines == 0){
            Materialize.toast('Empresa não possui máquinas!', 4000);
        }else{
            Session.set('selectedCompany', thisCompany);
            Router.go('home');
        }
    },
});


//********************************************************************************
// Lifecycle Hook
//********************************************************************************
Template.home.onCreated( function() {});

Template.home.onRendered( function() {

    /*controle dos menús*/
    $('#home').addClass('active');
    $('#notifications').removeClass('active');
    $('#administration').removeClass('active');
    $('#report').removeClass('active');

    $('#homecell').addClass('active');
    $('#notificationscell').removeClass('active');
    $('#reportcell').removeClass('active');
    $('#administrationcell').removeClass('active');
    $('#mastercompanycell').removeClass('active');
    $('#companycell').removeClass('active');
    $('#userscell').removeClass('active');
    $('#machinecell').removeClass('active');
    $('#registermachinecell').removeClass('active');
    $('#eventsmachinecell').removeClass('active');
    $('#devicecell').removeClass('active');

    /*controle da cor de fundo do template*/
    $('body').removeClass('grey darken-4');

    /*inicialização de pluguins*/
    $('.tooltipped').tooltip({delay: 50});

    $('#data-table-home').DataTable( {
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
    } );

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

    // Order by the grouping
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

Template.home2.onRendered( function() {

    /*controle dos menús*/
    $('#home').addClass('active');
    $('#notifications').removeClass('active');
    $('#administration').removeClass('active');
    $('#report').removeClass('active');

    $('#homecell').addClass('active');
    $('#notificationscell').removeClass('active');
    $('#administrationcell').removeClass('active');
    $('#mastercompanycell').removeClass('active');
    $('#companycell').removeClass('active');
    $('#userscell').removeClass('active');
    $('#machinecell').removeClass('active');
    $('#devicecell').removeClass('active');
    $('#reportcell').removeClass('active');

    /*controle da cor de fundo do template*/
    $('body').removeClass('grey darken-4');

    /*inicialização de pluguins*/
    $('.tooltipped').tooltip({delay: 50});

    $('#data-table-home').DataTable( {
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
    } );

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

    // Order by the grouping
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

Template.home3.onRendered( function() {

    /*controle dos menús*/
    $('#home').addClass('active');
    $('#notifications').removeClass('active');
    $('#administration').removeClass('active');
    $('#report').removeClass('active');

    $('#homecell').addClass('active');
    $('#notificationscell').removeClass('active');
    $('#administrationcell').removeClass('active');
    $('#mastercompanycell').removeClass('active');
    $('#companycell').removeClass('active');
    $('#userscell').removeClass('active');
    $('#machinecell').removeClass('active');
    $('#devicecell').removeClass('active');
    $('#reportcell').removeClass('active');

    /*controle da cor de fundo do template*/
    $('body').removeClass('grey darken-4');

    /*inicialização de pluguins*/
    $('.tooltipped').tooltip({delay: 50});

    $('#data-table-home').DataTable( {
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
    } );

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

    // Order by the grouping
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


Template.home.onDestroyed( function() {});

}