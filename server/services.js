//================================================================================
//  @file         services.js
//  @version      0.0.1
//  @path         server/
//  @description  Serviços de suporte e aplicações.
//  @contact      mateus.developer@gmail.com
//  @copyright    Copyright HydrBytes Technologies Corporation Ltda.
//================================================================================

if (Meteor.isServer) {
  Kadira.connect('foQ5uk6Hro2GCHL2o', '86187dde-f8ac-4b27-8566-3c685d47d4a5');

  /** guardian()
	*
	* @description Método 'Guardian' para cuidar de alguns processos no sistema.
	*              ele é chamado a cada Xs. Ex.: popular uma tabela de acordo com
	*              outra tabela.
 	*
 	*/
  guardian = function () {
    console.log("Call ---------> guardian()");
    keepAlive();
    hourCounter();
    Meteor.setTimeout(guardian, 10000); //1000 = 1s => Executado a cada 10s
  }

  /** getRandomNum()
  *
  * @description Função para gerar número aleatório.
  *
  */
  getRandomNum = function(min, max) {
    var num = Math.random() * (max - min) + min;
    num = num.toFixed(1);
    return num;
  };


  /** getRandomInt()
  *
  * @description Função para gerar número inteiro aleatório.
  *
  */
  getRandomInt = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }


  /** initializeCollections()
	*
	* @description Método para iniciaização das collections se assim for necessário.
 	*
 	*/
  initializeCollections = function() {
   console.log("Call ---------> initializeCollections()")

   if (MasterCompany.find().count() === 0){
    MasterCompany.insert({
      "name": "MateusDeveloper Technologies Corporation",
      "cnpj": "88.888.888/0001-88",
      "Contact": {
        "street": "Rua Aristides da Silva, 37",
        "city":  "Florianópolis",
        "state": "Santa Catarina",
        "zipcode": "88070-400",
        "contact": "MateusDeveloper Development Team",
        "phone": "(48) 8888-8888",
        "email": "god@system.com",
      }
    });

    MasterCompany.insert({
      "name": "Empresa Alpha",
      "cnpj": "88.888.888/0001-88",
      "Contact": {
        "street": "Rua Aristides da Silva, 37",
        "city":  "Florianópolis",
        "state": "Santa Catarina",
        "zipcode": "88070-400",
        "contact": "Alpha System Administrator",
        "phone": "(48) 8888-8888",
        "email": "sysadm@alpha.com",
      }
    });

    MasterCompany.insert({
      "name": "Empresa Betha",
      "cnpj": "99.999.999/0001-99",
      "Contact": {
        "street": "Rua Bom Jesus, 570",
        "city":  "São José",
        "state": "Santa Catarina",
        "zipcode": "88070-400",
        "contact": "Betha System Administrator",
        "phone": "(48) 4444-8899",
        "email": "sysadm@betha.com",
      }
    });

    console.log('--------------> Populate collection "MasterCompany".');
  }

  if (Company.find().count() === 0){

    var masterCompanyOne = MasterCompany.findOne({name: "Empresa Alpha"});
    var masterCompanyTwo = MasterCompany.findOne({name: "Empresa Betha"});

    Company.insert({
      "_idMasterCompany": masterCompanyOne._id,
      "_companyCode": 15,
      "name": "Empresa 01 A",
      "cnpj": "88.888.888/0001-88",
      "Contact": {
        "street": "Rua XX",
        "city":  "Florianópolis",
        "state": "Santa Catarina",
        "zipcode": "88070-400",
        "contact": "Administrador Empresa 01 A",
        "phone": "(48) 8888-8888",
        "email": "adm@empresa01A.com",
      }
    });

    Company.insert({
      "_idMasterCompany": masterCompanyOne._id,
      "_companyCode": 16,
      "name": "Empresa 02 A",
      "cnpj": "88.888.888/0001-88",
      "Contact": {
        "street": "Rua XX",
        "city":  "Florianópolis",
        "state": "Santa Catarina",
        "zipcode": "88070-400",
        "contact": "Administrador Empresa 02 A",
        "phone": "(48) 8888-8888",
        "email": "adm@empresa02A.com",
      }
    });

    Company.insert({
      "_idMasterCompany": masterCompanyTwo._id,
      "_companyCode": 25,
      "name": "Empresa 01 B",
      "cnpj": "88.888.888/0001-88",
      "Contact": {
        "street": "Rua XX",
        "city":  "Florianópolis",
        "state": "Santa Catarina",
        "zipcode": "88070-400",
        "contact": "Administrador Empresa 01 B",
        "phone": "(48) 8888-8888",
        "email": "adm@empresa01B.com",
      }
    });

    Company.insert({
      "_idMasterCompany": masterCompanyTwo._id,
      "_companyCode": 26,
      "name": "Empresa 02 B",
      "cnpj": "88.888.888/0001-88",
      "Contact": {
        "street": "Rua XX",
        "city":  "Florianópolis",
        "state": "Santa Catarina",
        "zipcode": "88070-400",
        "contact": "Administrador Empresa 02 B",
        "phone": "(48) 8888-8888",
        "email": "adm@empresa02B.com",
      }
    });

    console.log('--------------> Populate collection "Company".');
  }

  if (Meteor.roles.find().count() === 0){
    Meteor.roles.insert({
      "name": "God",
      "description": "Deus do sistema", //blasfémia
    });
    Meteor.roles.insert({
      "name": "SysAdm",
      "description": "Administrador do sistema",
    });
    Meteor.roles.insert({
      "name": "Adm",
      "description": "Administrador da empresa",
    });
    Meteor.roles.insert({
      "name": "Supervisor",
      "description": "Supervisor da empresa",
    });
    Meteor.roles.insert({
      "name": "Operator",
      "description": "Operador de Máquina",
    });
    console.log('--------------> Populate collection "roles".');
  }


  if (Meteor.users.find().count() === 0){

    var company = MasterCompany.findOne({name: "MateusDeveloper Technologies Corporation"});
    var mCompanyA = MasterCompany.findOne({name: "Empresa Alpha"});
    var mCompanyB = MasterCompany.findOne({name: "Empresa Betha"});
    var company01A = Company.findOne({name: "Empresa 01 A"});
    var company02A = Company.findOne({name: "Empresa 02 A"});
    var company01B = Company.findOne({name: "Empresa 01 B"});
    var company02B = Company.findOne({name: "Empresa 02 B"});

      //Cria o usuário SYS GOD
      Accounts.createUser({
        "email": "god@system.com",
        "password": "gorki",
        "profile": {
          "name": "System God",
        }
      });

      //Salva em currentUser para terminar a criação
      var currentUser = Meteor.users.findOne({"profile.name": "System God"});

      //Adiciona a role
      Roles.addUsersToRoles(currentUser, ["God","SysAdm"]);
      //Termina de setar os campos
      Meteor.users.update({_id:currentUser._id},{
        $set: {
          "_idMasterCompany": company._id,
        }
      });

      //Cria o usuário SYSADM para empresa Alpha
      Accounts.createUser({
        "email": "sysadm@alpha.com",
        "password": "102030",
        "profile": {
          "name": "System Administrator",
        }
      });

      //Salva em currentUser para terminar a criação
      var currentUser = Meteor.users.findOne({"emails.0.address": "sysadm@alpha.com"});
      //Adiciona a role
      Roles.addUsersToRoles(currentUser, "SysAdm");
      //Termina de setar os campos
      Meteor.users.update({_id:currentUser._id},{
        $set: {
          "_idMasterCompany": mCompanyA._id,
        }
      });

      //Cria o usuário ADM para empresa Empresa 01 A
      Accounts.createUser({
        "email": "adm@empresa01A.com",
        "password": "102030",
        "profile": {
          "name": "Administrator",
        }
      });

      //Salva em currentUser para terminar a criação
      var currentUser = Meteor.users.findOne({"emails.0.address": "adm@empresa01A.com"});
      //Adiciona a role
      Roles.addUsersToRoles(currentUser, "Adm");
      //Termina de setar os campos
      Meteor.users.update({_id:currentUser._id},{
        $set: {
          "_idCompany": company01A._id,
        }
      });

      //Cria o usuário ADM para empresa Empresa 02 A
      Accounts.createUser({
        "email": "adm@empresa02A.com",
        "password": "102030",
        "profile": {
          "name": "Administrator",
        }
      });

      //Salva em currentUser para terminar a criação
      var currentUser = Meteor.users.findOne({"emails.0.address": "adm@empresa02A.com"});
      //Adiciona a role
      Roles.addUsersToRoles(currentUser, "Adm");
      //Termina de setar os campos
      Meteor.users.update({_id:currentUser._id},{
        $set: {
          "_idCompany": company02A._id,
        }
      });


      //Cria o usuário SUPERVISOR para empresa Empresa 01 A
      Accounts.createUser({
        "email": "supervisor@empresa01A.com",
        "password": "102030",
        "profile": {
          "name": "Supervisor",
        }
      });

      //Salva em currentUser para terminar a criação
      var currentUser = Meteor.users.findOne({"emails.0.address": "supervisor@empresa01A.com"});
      //Adiciona a role
      Roles.addUsersToRoles(currentUser, "Supervisor");
      //Termina de setar os campos
      Meteor.users.update({_id:currentUser._id},{
        $set: {
          "_idCompany": company01A._id,
        }
      });


      //Cria o usuário SUPERVISOR para empresa Empresa 02 A
      Accounts.createUser({
        "email": "supervisor@empresa02A.com",
        "password": "102030",
        "profile": {
          "name": "Supervisor",
        }
      });

      //Salva em currentUser para terminar a criação
      var currentUser = Meteor.users.findOne({"emails.0.address": "supervisor@empresa02A.com"});
      //Adiciona a role
      Roles.addUsersToRoles(currentUser, "Supervisor");
      //Termina de setar os campos
      Meteor.users.update({_id:currentUser._id},{
        $set: {
          "_idCompany": company02A._id,
        }
      });


      //Cria o usuário OPERATOR para empresa Empresa 01 A
      Accounts.createUser({
        "email": "operator@empresa01A.com",
        "password": "102030",
        "profile": {
          "name": "Operator John E01A",
        }
      });

      //Salva em currentUser para terminar a criação
      var currentUser = Meteor.users.findOne({"emails.0.address": "operator@empresa01A.com"});
      //Adiciona a role
      Roles.addUsersToRoles(currentUser, "Operator");
      //Termina de setar os campos
      Meteor.users.update({_id:currentUser._id},{
        $set: {
          "_idCompany": company01A._id,
        }
      });


      //Cria o usuário OPERATOR para empresa Empresa 02 A
      Accounts.createUser({
        "email": "operator@empresa02A.com",
        "password": "102030",
        "profile": {
          "name": "Operator John E02A",
        }
      });

      //Salva em currentUser para terminar a criação
      var currentUser = Meteor.users.findOne({"emails.0.address": "operator@empresa02A.com"});
      //Adiciona a role
      Roles.addUsersToRoles(currentUser, "Operator");
      //Termina de setar os campos
      Meteor.users.update({_id:currentUser._id},{
        $set: {
          "_idCompany": company02A._id,
        }
      });


      //Cria o usuário SYSADM para empresa Betha
      Accounts.createUser({
        "email": "sysadm@betha.com",
        "password": "102030",
        "profile": {
          "name": "System Administrator",
        }
      });

      //Salva em currentUser para terminar a criação
      var currentUser = Meteor.users.findOne({"emails.0.address": "sysadm@betha.com"});
      //Adiciona a role
      Roles.addUsersToRoles(currentUser, "SysAdm");
      //Termina de setar os campos
      Meteor.users.update({_id:currentUser._id},{
        $set: {
          "_idMasterCompany": mCompanyB._id,
        }
      });

      //Cria o usuário ADM para empresa Empresa 01 B
      Accounts.createUser({
        "email": "adm@empresa01B.com",
        "password": "102030",
        "profile": {
          "name": "Administrator",
        }
      });

      //Salva em currentUser para terminar a criação
      var currentUser = Meteor.users.findOne({"emails.0.address": "adm@empresa01B.com"});
      //Adiciona a role
      Roles.addUsersToRoles(currentUser, "Adm");
      //Termina de setar os campos
      Meteor.users.update({_id:currentUser._id},{
        $set: {
          "_idCompany": company01B._id,
        }
      });

      //Cria o usuário ADM para empresa Empresa 02 B
      Accounts.createUser({
        "email": "adm@empresa02B.com",
        "password": "102030",
        "profile": {
          "name": "Administrator",
        }
      });

      //Salva em currentUser para terminar a criação
      var currentUser = Meteor.users.findOne({"emails.0.address": "adm@empresa02B.com"});
      //Adiciona a role
      Roles.addUsersToRoles(currentUser, "Adm");
      //Termina de setar os campos
      Meteor.users.update({_id:currentUser._id},{
        $set: {
          "_idCompany": company02B._id,
        }
      });


      //Cria o usuário SUPERVISOR para empresa Empresa 01 B
      Accounts.createUser({
        "email": "supervisor@empresa01B.com",
        "password": "102030",
        "profile": {
          "name": "Supervisor",
        }
      });

      //Salva em currentUser para terminar a criação
      var currentUser = Meteor.users.findOne({"emails.0.address": "supervisor@empresa01B.com"});
      //Adiciona a role
      Roles.addUsersToRoles(currentUser, "Supervisor");
      //Termina de setar os campos
      Meteor.users.update({_id:currentUser._id},{
        $set: {
          "_idCompany": company01B._id,
        }
      });


      //Cria o usuário SUPERVISOR para empresa Empresa 02 B
      Accounts.createUser({
        "email": "supervisor@empresa02B.com",
        "password": "102030",
        "profile": {
          "name": "Supervisor",
        }
      });

      //Salva em currentUser para terminar a criação
      var currentUser = Meteor.users.findOne({"emails.0.address": "supervisor@empresa02B.com"});
      //Adiciona a role
      Roles.addUsersToRoles(currentUser, "Supervisor");
      //Termina de setar os campos
      Meteor.users.update({_id:currentUser._id},{
        $set: {
          "_idCompany": company02B._id,
        }
      });


      //Cria o usuário OPERATOR para empresa Empresa 01 B
      Accounts.createUser({
        "email": "operator@empresa01B.com",
        "password": "102030",
        "profile": {
          "name": "Operator John E01B",
        }
      });

      //Salva em currentUser para terminar a criação
      var currentUser = Meteor.users.findOne({"emails.0.address": "operator@empresa01B.com"});
      //Adiciona a role
      Roles.addUsersToRoles(currentUser, "Operator");
      //Termina de setar os campos
      Meteor.users.update({_id:currentUser._id},{
        $set: {
          "_idCompany": company01B._id,
        }
      });


      //Cria o usuário OPERATOR para empresa Empresa 02 B
      Accounts.createUser({
        "email": "operator@empresa02B.com",
        "password": "102030",
        "profile": {
          "name": "Operator John E02B",
        }
      });

      //Salva em currentUser para terminar a criação
      var currentUser = Meteor.users.findOne({"emails.0.address": "operator@empresa02B.com"});
      //Adiciona a role
      Roles.addUsersToRoles(currentUser, "Operator");
      //Termina de setar os campos
      Meteor.users.update({_id:currentUser._id},{
        $set: {
          "_idCompany": company02B._id,
        }
      });

      console.log('--------------> Populate collection "Users".');
    }


    /*Inicializa os Tipos de Máquinas*/
    if (MachineType.find().count() === 0){
      var mCompanyA = MasterCompany.findOne({name: "Empresa Alpha"});
      var mCompanyB = MasterCompany.findOne({name: "Empresa Betha"});

      MachineType.insert({
        "description" : "Compressores de Parafuso",
        "info"        : "Utilizado pela Empresa Alpha",
        "dashcode"    : 0,
        "MasterCompany": [mCompanyA._id],
        "Definitions": {
          "Profile": {
            "value" : ["Temperatura", "Pressão"],
            "unit"  : ["°C", "Bar"],
            "limit" : ["100", "80"],
          },
          "Goals": {
            "description": ["Temperatura"],
            "value"      : ["100º"],
          },
          "Operators": {
            "roles": ["Operator"],
          }
        },
      });

      MachineType.insert({
        "description" : "Contadores de Produção",
        "info"        : "Utilizado pela Empresa Betha",
        "dashcode"    : 1,
        "MasterCompany": [mCompanyB._id],
        "Definitions": {
          "Profile": {
            "value" : ["Velocidade", "Produção"],
            "unit"  : ["p/h", "und"],
            "limit" : ["1000", "1000"],
          },
          "Goals": {
            "description": ["Produtividade"],
            "value"      : ["500"],
          },
          "Operators": {
            "roles": ["Operator"],
          }
        },
      });

      console.log('--------------> Populate collection "MachineType".');
    }

    // /*Inicializa as Máquinas*/
    if (Machines.find().count() === 0){
      var machineType0 = MachineType.findOne({dashcode: 0});
      var machineType1 = MachineType.findOne({dashcode: 1});

      var company01A = Company.findOne({name: "Empresa 01 A"});
      var company02A = Company.findOne({name: "Empresa 02 A"});
      var company01B = Company.findOne({name: "Empresa 01 B"});
      var company02B = Company.findOne({name: "Empresa 02 B"});

      // Insere um Compressor para a Empresa 01 A
      Machines.insert({
        "_idCompany": company01A._id,
        "_idMachineType": machineType0._id,
        "name": "Compressor Empresa 01 A",
        "hourcount" : [moment.utc().unix(), 0],
        "serialnumber": 123123123,
        "info": "Compressor de Parafuso",
        "status": 0,
        "sysstatus": 1,
        "dashcode": 0,
        "Profile": {
          "value" : ["Temperatura", "Pressão"],
          "unit"  : ["°C", "Bar"],
          "limit" : ["100", "80"],
        },
        "Goals": {
          "description": ["Temperatura"],
          "value"      : ["100º"],
        },
        "Operators": [],
        "Inputs": {
          "extLock"   : 0,
          "intLock"   : 0,
          "lights"    : 0,
          "emergency" : 0,
        },
      });


      // Insere um Compressor para a Empresa 02 A
      Machines.insert({
        "_idCompany": company02A._id,
        "_idMachineType": machineType0._id,
        "name": "Compressor Empresa 02 A",
        "hourcount" : [moment.utc().unix(), 0],
        "serialnumber": 123123123,
        "info": "Compressor de Parafuso",
        "status": 0,
        "sysstatus": 1,
        "dashcode": 0,
        "Profile": {
          "value" : ["Temperatura", "Pressão"],
          "unit"  : ["°C", "Bar"],
          "limit" : ["100", "80"],
        },
        "Goals": {
          "description": ["Temperatura"],
          "value"      : ["100º"],
        },
        "Operators": [],
        "Inputs": {
          "extLock"   : 0,
          "intLock"   : 0,
          "lights"    : 0,
          "emergency" : 0,
        },
      });


      // Insere um Contador de Produção para a Empresa 01 B
      Machines.insert({
        "_idCompany": company01B._id,
        "_idMachineType": machineType1._id,
        "name": "Contador de Produção Empresa 01 B",
        "hourcount" : [moment.utc().unix(), 0],
        "serialnumber": 123123123,
        "info": "Compressor de Parafuso",
        "status": 0,
        "sysstatus": 1,
        "dashcode": 1,
        "Profile": {
          "value" : ["Velocidade", "Produção"],
          "unit"  : ["p/h", "und"],
          "limit" : ["1000", "1000"],
        },
        "Goals": {
          "description": ["Produtividade"],
          "value"      : ["500"],
        },
        "Operators": [],
        "Inputs": {
          "extLock"   : 0,
          "intLock"   : 0,
          "lights"    : 0,
          "emergency" : 0,
        },
      });


      // Insere um Contador de Produção para a Empresa 02 B
      Machines.insert({
        "_idCompany": company02B._id,
        "_idMachineType": machineType1._id,
        "name": "Contador de Produção Empresa 02 B",
        "hourcount" : [moment.utc().unix(), 0],
        "serialnumber": 123123123,
        "info": "Compressor de Parafuso",
        "status": 0,
        "sysstatus": 1,
        "dashcode": 1,
        "Profile": {
          "value" : ["Velocidade", "Produção"],
          "unit"  : ["p/h", "und"],
          "limit" : ["1000", "1000"],
        },
        "Goals": {
          "description": ["Produtividade"],
          "value"      : ["500"],
        },
        "Operators": [],
        "Inputs": {
          "extLock"   : 0,
          "intLock"   : 0,
          "lights"    : 0,
          "emergency" : 0,
        },
      });

      console.log('--------------> Populate collection "Machines".');
    }


    if (Devices.find().count() === 0){
      var machine01A = Machines.findOne({name: "Compressor Empresa 01 A"});
      var machine02A = Machines.findOne({name: "Compressor Empresa 02 A"});
      var machine01B = Machines.findOne({name: "Contador de Produção Empresa 01 B"});
      var machine02B = Machines.findOne({name: "Contador de Produção Empresa 02 B"});

      // Inserindo Devices para Empresa 01 A
      Devices.insert({
        "_idMachine": machine01A._id,
        "_idHardware": 1972,
        "_companyCode": 15,
        "name": "D.A. - Empresa 01 A",
        "serialnumber": 123123123,
        "operatingsince": moment.utc().unix(),
        "KeepAlive": {
          "timer" : moment.utc().unix(),
          "flag" : 0,
        },
        "info": "D.A. de dados Darphyum",
        "status": 0,
        "sysstatus": 1,
      });

      Devices.insert({
        "_idMachine": null,
        "_idHardware": 1973,
        "_companyCode": 15,
        "name": "D.A. - Protótipo E01A",
        "serialnumber": 124124124,
        "operatingsince": moment.utc().unix(),
        "KeepAlive": {
          "timer" : moment.utc().unix(),
          "flag" : 0,
        },
        "info": "D.A. de dados Darphyum",
        "status": 0,
        "sysstatus": 3,
      });


      // Inserindo Devices para Empresa 02 A
      Devices.insert({
        "_idMachine": machine02A._id,
        "_idHardware": 1974,
        "_companyCode": 16,
        "name": "D.A. - Empresa 02 A",
        "serialnumber": 123123123,
        "operatingsince": moment.utc().unix(),
        "KeepAlive": {
          "timer" : moment.utc().unix(),
          "flag" : 0,
        },
        "info": "D.A. de dados Darphyum",
        "status": 0,
        "sysstatus": 1,
      });

      Devices.insert({
        "_idMachine": null,
        "_idHardware": 1975,
        "_companyCode": 16,
        "name": "D.A. - Protótipo E02A",
        "serialnumber": 124124124,
        "operatingsince": moment.utc().unix(),
        "KeepAlive": {
          "timer" : moment.utc().unix(),
          "flag" : 0,
        },
        "info": "D.A. de dados Darphyum",
        "status": 0,
        "sysstatus": 3,
      });


      // Inserindo Devices para Empresa 01 B
      Devices.insert({
        "_idMachine": machine01B._id,
        "_idHardware": 2972,
        "_companyCode": 25,
        "name": "D.A. - Empresa 01 B",
        "serialnumber": 123123123,
        "operatingsince": moment.utc().unix(),
        "KeepAlive": {
          "timer" : moment.utc().unix(),
          "flag" : 0,
        },
        "info": "D.A. de dados Darphyum",
        "status": 0,
        "sysstatus": 1,
      });

      Devices.insert({
        "_idMachine": null,
        "_idHardware": 2973,
        "_companyCode": 25,
        "name": "D.A. - Protótipo E01B",
        "serialnumber": 124124124,
        "operatingsince": moment.utc().unix(),
        "KeepAlive": {
          "timer" : moment.utc().unix(),
          "flag" : 0,
        },
        "info": "D.A. de dados Darphyum",
        "status": 0,
        "sysstatus": 3,
      });


      // Inserindo Devices para Empresa 02 B
      Devices.insert({
        "_idMachine": machine02B._id,
        "_idHardware": 2974,
        "_companyCode": 26,
        "name": "D.A. - Empresa 02 B",
        "serialnumber": 123123123,
        "operatingsince": moment.utc().unix(),
        "KeepAlive": {
          "timer" : moment.utc().unix(),
          "flag" : 0,
        },
        "info": "D.A. de dados Darphyum",
        "status": 0,
        "sysstatus": 1,
      });

      Devices.insert({
        "_idMachine": null,
        "_idHardware": 2975,
        "_companyCode": 26,
        "name": "D.A. - Protótipo E02B",
        "serialnumber": 124124124,
        "operatingsince": moment.utc().unix(),
        "KeepAlive": {
          "timer" : moment.utc().unix(),
          "flag" : 0,
        },
        "info": "D.A. de dados Darphyum",
        "status": 0,
        "sysstatus": 3,
      });


      console.log('--------------> Populate collection "Devices".');
    }


    if (System.find().count() === 0){
      System.insert({
        "version": "SystemMonitorMachine v2.5.1 BETA",
        "daterelease": moment.utc().unix(),
        "license": "Licença de TESTES",
      });
      console.log('--------------> Populate collection "System".');
    }

    if (LogSystem.find().count() === 0){
      LogSystem.insert({
      });
      console.log('--------------> Populate collection "LogSystem".');
    }

    if (EventType.find().count() === 0){
      EventType.insert({
        "type": "Start",
        "color": "cd-success",
        "icon": "info_outline",
        "visible": 1,
      });
      EventType.insert({
        "type": "Stop",
        "color": "cd-warning",
        "icon": "pause_circle_filled",
        "visible": 1,
      });
      EventType.insert({
        "type": "StopDevice",
        "color": "cd-warning",
        "icon": "power_settings_new",
        "visible": 0,
      });
      EventType.insert({
        "type": "ConnectDevice",
        "color": "cd-success",
        "icon": "loop",
        "visible": 0,
      });
      EventType.insert({
        "type": "DailyReport",
        "color": "cd-success",
        "icon": "query_builder",
        "visible": 0,
      });
      console.log('--------------> Populate collection "EventType".');
    }

    if (EventList.find().count() === 0){
      var types = EventType.find().fetch();
      var count = Machines.find().count();
      var machines = Machines.find().fetch();

      EventList.insert({
        "name": "Lista Padrão",
        "Events":[
        {
          "_idEventType": types[0]._id,
          "description": "Início de Expediente",
        },
        {
          "_idEventType": types[0]._id,
          "description": "Fim de Intervalo",
        },
        {
          "_idEventType": types[0]._id,
          "description": "Fim de Manutenção",
        },
        {
          "_idEventType": types[1]._id,
          "description": "Fim de Expediente",
        },
        {
          "_idEventType": types[1]._id,
          "description": "Início de Intervalo",
        },
        {
          "_idEventType": types[1]._id,
          "description": "Início de Manutenção",
        },
        {
          "_idEventType": types[2]._id,
          "description": "Não há dados recebidos do Dispositvo!",
        },
        {
          "_idEventType": types[3]._id,
          "description": "Dispositivo reconectado!",
        },
        {
          "_idEventType": types[4]._id,
          "description": "Relatório Diário:",
        },
        ]
      });

var thisList = EventList.findOne();

for(i = 0; i < count; i++){
  EventList.update(
   { _id: thisList._id },
   { $addToSet: { Machines: machines[i]._id } }
   )
}

console.log('--------------> Populate collection "EventList".');
}

}

};