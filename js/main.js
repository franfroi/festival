var app= new App();


//Changement de l'image 
var current = 0; 
// function change(value) 
function change(value) 
{ 
//document.getElementById("show").src = "img/"+value; 
document.getElementById("show").src = value; 

} 

app.$form_festival.submit(function(event){ //On soumet/envoi le formulaire
  
         event.preventDefault(); //Empeche le rechargement de la page !
      
         app.cleanErrors();
         if( app.checkError()==false){
            //recup title
            var title=app.$name.val();
            //recup position
            pos=app.pos;
            var position={
              lat:parseFloat(pos.lat),
              lng:parseFloat(pos.lng)
              }
             
            //recup des checbox
           
            $('input:checked[name=type_music]').each(function() {
              var valeurs=app.valeurs.push($(this).val());});
            var music=app.valeurs
            console.log(music);
            //recup image
            var $url=app.$select1.val();
            var image =app.addimg ($url);
              
            //recup date
            var date_deb=app.$date_deb.datepicker({ dateFormat: 'dd-mm-yy' }).val();
            var date_fin=app.$date_fin.datepicker({ dateFormat: 'dd-mm-yy' }).val();

           
            //-1---------------creation marqueur
            marker=app.addMarker(pos,title,image);
             //-2----------------creation contenu
            var content=app.content(title,date_deb,date_fin);
            app.addinfos(content,marker);
          
              app.addFestival(title,position.lat,position.lng,$url,music,date_deb,date_fin);
              app.saveFestival();
             // app.readFestival();
             app.reinit();
       } 
});
//map

  app.main=function(){
    app.CenterOnGeolocation();
      
     var marker=null;
    //sur clic du map
    app.map.addListener('click', function(e) {
        // recup des positions
        var posfull=e.latLng;

        var pos={
          lat:parseFloat(posfull.lat()),
          lng:parseFloat(posfull.lng())
          }

          //decimmale
          var numposlat = new Number(pos.lat);
          var poslat = numposlat.toPrecision(5);
          var numposlng = new Number(pos.lng);
          var poslong= numposlng.toPrecision(5);

          var title="Position : "+ poslat+" , "+poslong;
      
      
        //-1---------------creation marqueur
       
         if(marker){ //on vérifie si le marqueur existe
          marker.setPosition(pos); //on change sa position
          
          }
        else{
        marker=app.addMarker2(pos,title);//on créé le marqueur
        }
      app.pos=pos;
     
     
      }); 
      
  
} 
   window.onbeforeunload=function(){ //quand le user quitte la page
    app.saveFestival();
    
    
 }
  window.onload = function() {
    var marker=null;
   
    var Festival=app.readFestival();
    for(var festivals of Festival){
      
    
      var title=festivals.title;
      var positionlat=festivals.positionlat;
      var positionlng=festivals.positionlng;
      var url=festivals.url;
      var music=festivals.music;
      var date_deb=festivals.debut;
      var date_fin=festivals.fin;

      var pos={
          lat:parseFloat(positionlat),
          lng:parseFloat(positionlng)
          }
         
          var image =app.addimg(url);
          
          //-1---------------creation marqueur
           marker=app.addMarker(pos,title,image,music,date_deb);
            //-2----------------creation contenu
           var content=app.content2(title,date_deb,date_fin,music);
           app.addinfos(content,marker);

           app.pushMarkers(marker);

           
   }
  
  }
     
     
  
 $('input[type=checkbox][name=music]').click(function(){
  
 var checked=$('input[type=checkbox][name=music]:checked');

 
    for (var marker of app.markers){
      if (checked[0]==null){
        marker.setVisible(true);
       }
       else marker.setVisible(false);
       
        for (var $el of checked){
         
       
         for (var i=0;i<app.markers.length;i++){
         
            if (marker.music[i]==$($el).val() ){
            
             marker.setVisible(true);
            } 
          }
        }
      }
      
});
     //initpickers user
      //recup date

      app.$Userdate_deb.change(function(){
        
        var checked=app.$Userdate_deb.datepicker({ dateFormat: 'dd-mm-yy' }).val();
        
        for (var marker of app.markers){
          marker.setVisible(false);
         
              if (marker.date_deb==checked){
              console.log(marker);
              marker.setVisible(true);
                    
                }
              }
           
      });
     
