/**
 * @author Robin Young
 */

App.addfavorite = function(url,text){
   if ('v' == '\v'){
      window.external.addFavorite(url,text);
   }
   else if(window.sidebar){
      window.sidebar.addPanel(text, url, "");
   }
   return false;
};