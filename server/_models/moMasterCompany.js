//================================================================================
//  @file         moCompany.js
//  @version      0.0.1
//  @path         server/_models
//  @description  Métodos para Company/Empresas
//  @author       MateusCardoso / MateusCardoso
//  @contact      mateus.developer@gmail.com
//  @copyright    Copyright HydrBytes Technologies Corporation Ltda.
//================================================================================

if (Meteor.isServer) {
	Meteor.methods({

    /** insertCompanyMtd()
    *
    * @description Método para incluir novo usuário.
    * @param       n/d
    * @return      n/d
    *
    */
    'insertMasterCompanyMtd' : function(newMasterCompany){
      try{
        if((newMasterCompany.name != '')){
          var newMaster = MasterCompany.insert({
            "name": newMasterCompany.name,
            "cnpj": newMasterCompany.cnpj,
            "Contact": {
              "street":  newMasterCompany.street,
              "city":    newMasterCompany.city,
              "state":   newMasterCompany.state,
              "zipcode": newMasterCompany.zipcode,
              "contact": newMasterCompany.contact,
              "phone":   newMasterCompany.phone,
              "email":   newMasterCompany.email,
            },
          });
          //Cria o SysAdm da MasterCompany anterior
          var newUser = Accounts.createUser({
            profile:{
              name: newMasterCompany.contact,
            },
            email: newMasterCompany.email,
            password: '102030',
          });
          Roles.addUsersToRoles(newUser, 'SysAdm');
          Meteor.users.update(newUser,{
            $set: {
              "_idMasterCompany": new Mongo.ObjectID(newMaster._str),
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


    /** updateCompanyMtd()
    *
    * @description Método para update em usuário.
    * @param       n/d
    * @return      n/d
    *
    */
    'updateMasterCompanyMtd' : function(companyData){
      try{
        if((companyData.name != '')){
          MasterCompany.update({_id: companyData._idCompany},{
            $set: {
              "name": companyData.name,
              "cnpj": companyData.cnpj,
              "Contact": {
                "street":  companyData.street,
                "city":    companyData.city,
                "state":   companyData.state,
                "zipcode": companyData.zipcode,
                "contact": companyData.contact,
                "phone":   companyData.phone,
                "email":   companyData.email,
              }
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


    /** deleteCompanyMtd()
    *
    * @description Função para deletar uma usuário pelo '_id'.
    * @param       n/d
    * @return      mensagem de sucesso/erro
    *
    */
    'deleteMasterCompanyMtd' : function(thisCompany, userCompanyId){
      try{
          MasterCompany.remove({_id: thisCompany});
          Company.remove({_idMasterCompany: thisCompany});
          Meteor.users.remove({_idCompany: userCompanyId});
          Meteor.users.remove({_idMasterCompany: thisCompany});
      }catch(e){
        console.log(e);
      }
    },

  })

}