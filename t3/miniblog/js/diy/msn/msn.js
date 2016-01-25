/**
 * @author yuwei
 * @fileoverview web msn for miniblog
 */
$import("sina/sina.js");
$import("sina/app.js");
$import('sina/core/events/addEvent.js');
$import("sina/core/dom/getXY.js");

(function(ns){
    ns.msn = function(/*Object*/option){
        this.clientid = option['clientid'];
        this.channelurl = option['channelurl'];
        this.callbackurl = option['callbackurl'];
        this.scope = option['scope']; 
    };
    ns.msn.prototype = {
        init:function(){
            
        },
        _loadScript:function(){
            
        },
        login:function(){
            
        },
        logout:function(){
            
        },
        getContactList:function(){
            
        },
        sendMessage:function(){
            
        },
        onReceiveMessage:function(){
            
        }
    };
})(App);