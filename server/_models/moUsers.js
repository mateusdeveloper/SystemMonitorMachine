//================================================================================
//  @file         moUsers.js
//  @version      0.0.1
//  @path         server/_models
//  @description  Métodos para Usuários
//  @author       MateusCardoso / MateusCardoso
//  @contact      mateus.developer@gmail.com
//  @copyright    Copyright Mateus Cardoso Nunes
//================================================================================

if (Meteor.isServer) {
	Meteor.methods({


    /** insertUserMtd()
    *
    * @description Método para incluir novo usuário.
    * @param       n/d
    * @return      n/d
    *
    */
    'insertUserMtd' : function(userData){
      try{
        var newUser = Accounts.createUser({
          profile:{
            name: userData.name,
          },
          email: userData.email,
          password: userData.password,
        });
        Roles.addUsersToRoles(newUser, userData.role);

        if(userData.mastercompany == undefined){
          Meteor.users.update(newUser,{
            $set: {
              "_idCompany": new Mongo.ObjectID(userData.company),
            }
          });
        }else{
          Meteor.users.update(newUser,{
            $set: {
              "_idMasterCompany": new Mongo.ObjectID(userData.mastercompany),
            }
          });
        }

        result = true;

      }catch(e){
        console.log(e);
      }

      return result;
    },


    /** updateUserMtd
    *
    * @description Método para update em usuário.
    * @param       n/d
    * @return      n/d
    *
    */
    'updateUserMtd' : function(userData){
      try{
        Meteor.users.update({_id: userData._idUser},{
          $set: {
            'profile.name'    : userData.name,
            'emails.0.address': userData.email,
          },
        });

        Roles.setUserRoles(userData._idUser, [userData.role]);

        if(userData.mastercompany == undefined){

          Meteor.users.update(userData._idUser,{
            $set: {
              "_idCompany": new Mongo.ObjectID(userData.company),
              "_idMasterCompany": undefined,
            }
          });
        }else{
          Meteor.users.update(userData._idUser,{
            $set: {
              "_idCompany": undefined,
              "_idMasterCompany": new Mongo.ObjectID(userData.mastercompany),
            }
          });
        }
        result = true;

      }catch(e){
        console.log(e);
      }

      return result;
    },


    /** deleteUserMtd
    *
    * @description Função para deletar uma usuário pelo '_id'.
    * @param       n/d
    * @return      mensagem de sucesso/erro
    *
    */
    'deleteUserMtd' : function(thisUserId){
      try{
        /*Função que deleta o operador da lista de máquina, assim quando o método é chamado ele deleta o operator, caso
        não seja 'operator' ele executa direto o método de deleção Meteor.users.remove.... */
        if(Roles.userIsInRole(thisUserId, 'Operator')){
          var machineList = Machines.find({Operators : thisUserId}, {fields : {Operators : 1, _id : 1}}).fetch();
          for(i = 0; i < machineList.length; i++){
            var index = machineList[i].Operators.indexOf(thisUserId);
            var newArrayMachine = machineList[i].Operators.splice(index,1);
            Machines.update({_id: machineList[i]._id},{
              $set: {
                "Operators" : machineList[i].Operators,
              },
            });
          }
        }
        Meteor.users.remove({_id: thisUserId});
      }catch(e){
        console.log(e);
      }
  },


    /** sendEmail
    *
    * @description Descrever o que função faz aqui.
    * @param       n/d
    * @return      n/d
    *
    */
    'sendEmail': function(to, from, subject, text) {
      check([to, from, subject, text], [String]);

      // Let other method calls from the same client start running,
      // without waiting for the email sending to complete.
      this.unblock();

      Email.send({
        to: to,
        from: from,
        subject: subject,
        text: text
      });
    },


  })

}