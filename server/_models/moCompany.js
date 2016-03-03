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
    'insertCompanyMtd' : function(newCompany){
      try{
        if((newCompany.name != '')){
          var currentUser = this.userId

          if(newCompany.master == ""){
            var thisMaster = null;
          }else if(Roles.userIsInRole(currentUser, 'God')){
            var newMaster = new Mongo.ObjectID(newCompany.master);
          }else{
            var newMaster = newCompany.master;
          }

          var newcode = Company.findOne({},{sort: {_companyCode: -1}})._companyCode;
          console.log(newcode);
          if(newcode == undefined){
           newcode = 0;
         }

         Company.insert({
          "_idMasterCompany": newMaster,
          "_companyCode": newcode+1,
          "name": newCompany.name,
          "cnpj": newCompany.cnpj,
          "Contact": {
            "street":  newCompany.street,
            "city":    newCompany.city,
            "state":   newCompany.state,
            "zipcode": newCompany.zipcode,
            "contact": newCompany.contact,
            "phone":   newCompany.phone,
            "email":   newCompany.email,
          },
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
    'updateCompanyMtd' : function(companyData){
      try{
        if((companyData.name != '')){
          if(companyData._idMasterCompany == null){
            var thisMaster = null;
          }else{
            var thisMaster = new Mongo.ObjectID(companyData._idMasterCompany);
          }
          Company.update({_id: companyData._idCompany},{
            $set: {
              "_idMasterCompany": thisMaster,
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
    'deleteCompanyMtd' : function(thisCompany, masterCompanyId){
      try{
          Company.remove({_id: thisCompany});
          Meteor.users.remove({_idCompany: thisCompany});
          //Meteor.users.remove({_idMasterCompany: masterCompanyId});
      }catch(e){
        console.log(e);
      }
    },

  })

}