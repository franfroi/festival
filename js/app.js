class App{
    
        constructor(){
    
            //dom elements
            this.$form_festival=$("#form_festival");
            this.$name=$("#name");
            this.$date_deb=$("#date_deb");
            this.$date_fin=$("#date_fin");

            this.$Userdate_deb=$("#Userdate_deb");
           
            
            this.$type_music=$("#type_music");
            this.$flex_checkbox=$("#flex_checkbox");
            this.$music=$('#music');
            this.pos=null;
            this.mark=null;


           
            this.$clicmap=$("#clicmap");
            this.$errorname = $("#errorname");
            this.$errorlatlong = $("#errorlatlong");
            this.$errordate_deb = $("#errordate_deb");
            this.$errordate_fin = $("#errordate_fin");
            this.$errortype_music = $("#errortype_music");
           
            this.thereWasError = false;

            this.valeurs = [];
            this.clic=null;
            this.showError();
           // this.date();
            this.tabmarqueurs=[];

            this.initPickers();
            this.initPickers2();
            //-----------map
            this.$map=$('#map');
            this.map=null;
            this.markers=[];


          


            this.check=null;

            
            this.$select1=$("#select1");

             //function
            this.main=null;
           
            //this.readFestival();

           
        }

        //----------------------error
       
        checkError(){
            this.check=false;

                     //check name festival
                     if (this.pos==null){
                        var msg =  "Cliquer à l'endroit ou vous voulez creer le marqueur";
                        this.showError(msg, this.$clicmap);
                        this.check=true;
                    }
           
                     //check name festival
                    if (this.$name.val().length < 3){
                        var msg = "Nom du festival obligatoire (3 min)";
                        this.showError(msg, this.$name);
                        this.check=true;
                    }
                  

                     //Check date

                     if (!this.$date_deb.datepicker("getDate"))
                       {
                            var msg = "Date de debut obligatoire ";
                                    this.showError(msg, this.$date_deb);
                                    this.check=true;
                        }

                     if (this.$date_fin.datepicker("getDate")<this.$date_deb.datepicker("getDate"))
                     
                        {
                            var msg = "Date de fin ne peut etre inférieure à date de debut ";
                                    this.showError(msg, this.$date_fin);
                                    this.check=true;
                        }
                       
                       
                        if  (!$('input[name=type_music]').is(':checked') )
                        
                          {
                               var msg = "Type de music obligatoire";
                                      this.showError(msg, this.$flex_checkbox);
                                       this.check=true;
                           }
                                    
                     return this.check;                     
               


        }

        showError(errorMsg, $target){
            switch ( $target)
            {
                case this.$clicmap:
                this.$clicmap.append("<p>"+errorMsg+"</p>"); //Ajouter du texte/html a la suite
                $target.addClass("redborder");
               
                this.thereWasError = true;
                break;  

                case this.$name:
                this.$errorname.append("<p>"+errorMsg+"</p>"); //Ajouter du texte/html a la suite
                $target.addClass("redborder");
               
                this.thereWasError = true;
                break;  
                case this.$flex_checkbox:
                this.$errortype_music.append("<p>"+errorMsg+"</p>"); //Ajouter du texte/html a la suite
               
                $target.addClass("redborder");
               
                this.thereWasError = true;
                break; 

                case this.$date_deb:
                this.$errordate_deb.append("<p>"+errorMsg+"</p>"); //Ajouter du texte/html a la suite
                $target.addClass("redborder");
               
                this.thereWasError = true;
                break; 

                case this.$date_fin:
                this.$errordate_fin.append("<p>"+errorMsg+"</p>"); //Ajouter du texte/html a la suite
                $target.addClass("redborder");
               
                this.thereWasError = true;
                break; 
                
                        
            }
             
        }

       
        cleanErrors(){
            this.$errorname.html(""); //Vide le html
            this.$errorlatlong.html(""); //Vide le html
            this.$errordate_deb.html(""); //Vide le html
            this.$errordate_fin.html(""); //Vide le html
            this.$errortype_music.html(""); //Vide le html
            this.$clicmap.html(""); //Vide le html
            this.$form_festival.find("input, select").removeClass("redborder"); //Retire la classe d'erreur
            this.thereWasError = false;
        }



       
    
    
//-----------------------------------
//date pickers

//fonction init date picker
initPickers(){
    
            var Langue_fr=
            {
              dayNames:["Dimanche","Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi"],
              dayNamesMin:["Di","Lu","Ma","Me","Je","Ve","Sa"],
              monthNamesShort:["Jan","Fév","Mar","Avr","Mai","Jui","Jui","Aou","Sep","Oct","Nov","Déc"],
              monthNames:["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Aout","Septembre","Octobre","Novembre","Décembre"],
              firstDay:1, //depart calendrier
              minDate : new Date (),
              maxDate : new Date (2018,11,31),
             // beforeShowDay : $.datepicker.noWeekends, // fonction interne no weekends
              //beforeShowDay : this.closeDay,
              beforeShowDay :$.proxy(this.closeDay,this),// pour ne pas perdre le this
              dateFormat: "dd/mm/yy",
             //showWeek: true
            };
            this.$date_deb.datepicker(Langue_fr);
            this.$date_fin.datepicker(Langue_fr);
    

    }

    

//---------------------------------map

    initMap() {
            this.map = new google.maps.Map(this.$map[0], {
            center: {lat: -34.397, lng: 150.644},
            zoom:7, mapTypeId: 'hybrid'
            
        });
        
       
            
     
    this.main();//utiliser en fonction de script principale une fois que map est charge
  
  }

    CenterOnGeolocation(){
    
            var that=this;
            // recuperer le gps et appel un call back qui contient la position
                navigator.geolocation.getCurrentPosition(function(position){
                    var pos ={
                        lat: position.coords.latitude  ,
                        lng: position.coords.longitude 
                    };
    
                    that.map.setCenter(pos);
                    

    
                });
    }

    addimg($url){
      
       var image = {
        url:$url,
        
        size: new google.maps.Size(50, 50),
        origin: new google.maps.Point(0,0),
        anchor: new google.maps.Point(30,40),
       
    };

    return image;
    }

    content(title,date_deb,date_fin){
        var content="<div>";
        content+= "<h2>"+title+"</h2>";
        content+= "<h4>Du "+date_deb+" au "+date_fin+"</h4>";
         for(var valeur of this.valeurs){
         content+= "<h4>"+valeur+"</h4>";}
        content+= "</div>";
        return content;
    }
    content2(title,date_deb,date_fin,music){
        var content="<div>";
        content+= "<h2>"+title+"</h2>";
        content+= "<h4>Du "+date_deb+" au "+date_fin+"</h4>";
         for(var valeur of music){
         content+= "<h4>"+valeur+"</h4>";}
        content+= "</div>";
        return content;
    }

    addMarker(pos,title,image,music,date_deb){
        
        var marker = new google.maps.Marker({
            position: pos,
            map: this.map,
            title: title,
            icon: image,
          
          });
    
          marker.music=music;
          marker.date_deb=date_deb;
          return marker;
    }
   
    addMarker2(pos,title){
        
        var marker = new google.maps.Marker({
            position: pos,
            map: this.map,
            title: title,
            
          
          });
    
         
          return marker;
    }

    addinfos(content,marker){
        var info=new google.maps.InfoWindow({
            content:content
        });
        var that=this;
        marker.addListener('click', function() {
                 info.open(that.map, marker);
              });
    }

    reinit(){
        this.$name.val("");
        this.$date_deb.val("");
        this.$date_fin.val("");
        $('input[name=type_music]').each(function() {
            $(this).prop('checked', false);
     
        });
        
       
    }
    
    addFestival(title,positionlat,positionlng,$url,music,date_deb,date_fin){

        this.tabmarqueurs.push({
            title:title,
            positionlat:positionlat,
            positionlng:positionlng,
            url:$url,
            music:music,
            debut:date_deb,
           fin: date_fin
         } )
       
    }
    saveFestival(){
        
                //le localStorage ne peut qu'enregistrer des chaines de caracteres
               // d'ou JsonJSON.stringify
                var FestivalString= JSON.stringify(this.tabmarqueurs);
                localStorage.setItem("Festival",FestivalString);
            }
    
            readFestival(){
                var FestivalString=localStorage.getItem("Festival");
        
                //verifie si le localstorage est vide
                if (FestivalString==null){
                    return;
                }
                var marker=null;
                var arrayFestival=JSON.parse(FestivalString);
                
                for(var festivals of arrayFestival){
                    
                  
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
                    this.addFestival(title,pos.lat,pos.lng,url,music,date_deb,date_fin);
                   
                    
                        
                   }
                   return arrayFestival;
                 
                   
                   
                
            }
            pushMarkers(marker){
                this.markers.push(marker);
              // console.log( this.markers)
             }
//----------2eme exo

//fonction init date picker
initPickers2(){
    
            var Langue_fr=
            {
              dayNames:["Dimanche","Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi"],
              dayNamesMin:["Di","Lu","Ma","Me","Je","Ve","Sa"],
              monthNamesShort:["Jan","Fév","Mar","Avr","Mai","Jui","Jui","Aou","Sep","Oct","Nov","Déc"],
              monthNames:["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Aout","Septembre","Octobre","Novembre","Décembre"],
              firstDay:1, //depart calendrier
              minDate : new Date (),
              maxDate : new Date (2018,11,31),
             // beforeShowDay : $.datepicker.noWeekends, // fonction interne no weekends
              //beforeShowDay : this.closeDay,
              beforeShowDay :$.proxy(this.closeDay,this),// pour ne pas perdre le this
              dateFormat: "dd/mm/yy",
             //showWeek: true
            };
            this.$Userdate_deb.datepicker(Langue_fr);
           
    

    }
}