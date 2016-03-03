//================================================================================
//  @file         moTimeLine.js
//  @version      0.0.1
//  @path         server/_models
//  @description  Métodos para Usuários
//  @author       MateusCardoso
//  @contact      mateus.developer@gmail.com
//  @copyright    Copyright HydrBytes Technologies Corporation Ltda.
//================================================================================

if (Meteor.isServer) {
	Meteor.methods({


    /** insertTimeLineMtd()
    *
    * @description Método para incluir novo evento em timeline.
    * @param       n/d
    * @return      n/d
    *
    */
  //   'insertTimeLineMtd' : function(thisMachine, checkSwitchEvents, valuesRoles, addEventsTextArea){

  //     if((valuesRoles !== null) && (addEventsTextArea !== null)){
  //       TimeLineEvents.insert({_idMachine: thisMachine},{
  //       $set: {
  //         "name" : valuesRoles,
  //         "description" : addEventsTextArea,
  //         "status" : checkSwitchEvents,
  //       }
  //     })
  //      result = true;
  //    }else{
  //     result = false;
  //   }
  //   return result;

  // },


  'insertTimeLineMtd' : function(newEvent){
    try{
      if((newEvent.name !== null) && (newEvent.description !== null)){
        var idType = EventType.findOne({type: newEvent.type});
        TimelineEvents.insert({
          "_idMachine"    : newEvent._idMachine,
          "_idOperator"   : this.userId,
          "_idEventType"  : idType._id,
          "name"          : newEvent.name,
          "datetimeevent" : moment.utc().unix(),
          "description"   : newEvent.description,
        });
        result = true;
      }else{
        result = false;
      }
    }catch(e){
      console.log(e);
    }
    return result;

  },


    /** updateTimeLineMtd
    *
    * @description Método para update em TimeLine.
    * @param       n/d
    * @return      n/d
    *
    */
    'updateTimeLineMtd' : function(){

    },


  })

}