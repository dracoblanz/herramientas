if(window.top!==window.self)document.documentElement.style.display="none";
const ZONES=[{"z":"Pallet Town","es":"Pueblo Paleta","r":[["tentacool","Surf",1,2,100],["magikarp","Pesca",5,10,33],["shellder","Pesca",15,25,11],["krabby","Pesca",5,25,11],["horsea","Pesca",5,25,11],["staryu","Pesca",15,25,8],["gyarados","Pesca",15,25,8],["kingler","Pesca",25,35,1],["seadra","Pesca",25,35,1],["psyduck","Pesca",25,35,0],["slowpoke","Pesca",25,35,0]]},{"z":"Route 1","es":"Ruta 1","r":[["pidgey","Hierba",2,5,50],["rattata","Hierba",2,5,50]]},{"z":"Viridian City","es":"Ciudad Verde","r":[["psyduck","Surf",2,5,50],["slowpoke","Surf",2,5,50],["magikarp","Pesca",5,15,33],["poliwag","Pesca",5,25,20],["poliwhirl","Pesca",20,30,13],["goldeen","Pesca",5,15,7],["gyarados","Pesca",15,25,5],["psyduck","Pesca",15,35,2],["slowpoke","Pesca",15,35,2]]},{"z":"Route 22","es":"Ruta 22","r":[["rattata","Hierba",2,5,45],["mankey","Hierba",2,5,45],["spearow","Hierba",2,5,10],["psyduck","Surf",2,5,50],["slowpoke","Surf",2,5,50],["magikarp","Pesca",5,15,33],["poliwag","Pesca",5,25,20],["poliwhirl","Pesca",20,30,13],["goldeen","Pesca",5,15,7],["gyarados","Pesca",15,25,5],["psyduck","Pesca",15,35,2],["slowpoke","Pesca",15,35,2]]},{"z":"Route 2","es":"Ruta 2","r":[["pidgey","Hierba",2,5,45],["rattata","Hierba",2,5,45],["caterpie","Hierba",3,5,38],["weedle","Hierba",3,5,38],["metapod","Hierba",4,6,9],["kakuna","Hierba",4,6,9],["pikachu","Hierba",3,5,5],["bulbasaur","Hierba",4,5,1]]},{"z":"Viridian Forest","es":"Bosque Verde","r":[["caterpie","Hierba",3,5,38],["weedle","Hierba",3,5,38],["metapod","Hierba",4,6,9],["kakuna","Hierba",4,6,9],["pikachu","Hierba",3,5,5],["bulbasaur","Hierba",4,5,1]]},{"z":"Route 3","es":"Ruta 3","r":[["spearow","Hierba",6,8,29],["pidgey","Hierba",6,7,25],["nidoranf","Hierba",6,7,12],["nidoranm","Hierba",6,7,12],["jigglypuff","Hierba",3,7,12],["mankey","Hierba",7,7,8],["charmander","Hierba",6,8,1]]},{"z":"Mt. Moon","es":"Monte Moon","r":[["paras","Cueva/Suelo",5,12,100],["zubat","Cueva/Suelo",7,11,69],["geodude","Cueva/Suelo",7,10,30],["clefairy","Cueva/Suelo",8,12,6]]},{"z":"Route 4","es":"Ruta 4","r":[["rattata","Hierba",8,12,32],["spearow","Hierba",8,12,32],["ekans","Hierba",6,12,12],["sandshrew","Hierba",6,12,12],["mankey","Hierba",10,12,12],["charmander","Hierba",8,12,1],["tentacool","Surf",8,12,100],["magikarp","Pesca",5,15,36],["krabby","Pesca",5,25,15],["horsea","Pesca",5,25,15],["gyarados","Pesca",15,25,5],["psyduck","Pesca",25,35,0],["slowpoke","Pesca",25,35,0]]},{"z":"Cerulean City","es":"Ciudad Celeste","r":[["tentacool","Surf",8,12,100],["magikarp","Pesca",5,15,18],["poliwag","Pesca",5,25,11],["krabby","Pesca",5,25,7],["horsea","Pesca",5,25,7],["poliwhirl","Pesca",20,30,7],["goldeen","Pesca",5,15,4],["gyarados","Pesca",15,25,3],["psyduck","Pesca",25,35,0],["slowpoke","Pesca",25,35,0]]},{"z":"Route 24","es":"Ruta 24","r":[["caterpie","Hierba",7,7,19],["weedle","Hierba",7,7,19],["pidgey","Hierba",11,13,14],["abra","Hierba",8,12,14],["oddish","Hierba",12,14,12],["bellsprout","Hierba",12,14,12],["metapod","Hierba",8,8,4],["kakuna","Hierba",8,8,4],["squirtle","Hierba",7,14,1],["tentacool","Surf",7,14,100],["magikarp","Pesca",5,15,36],["krabby","Pesca",5,25,15],["horsea","Pesca",5,25,15],["gyarados","Pesca",15,25,5],["psyduck","Pesca",25,35,0],["slowpoke","Pesca",25,35,0]]},{"z":"Route 25","es":"Ruta 25","r":[["caterpie","Hierba",8,8,19],["weedle","Hierba",8,8,19],["pidgey","Hierba",11,13,14],["abra","Hierba",9,13,14],["oddish","Hierba",12,14,12],["bellsprout","Hierba",12,14,12],["metapod","Hierba",9,9,4],["kakuna","Hierba",9,9,4],["squirtle","Hierba",8,14,1],["psyduck","Surf",8,14,50],["slowpoke","Surf",8,14,50],["magikarp","Pesca",5,15,33],["poliwag","Pesca",5,25,20],["poliwhirl","Pesca",20,30,13],["goldeen","Pesca",5,15,7],["gyarados","Pesca",15,25,5],["psyduck","Pesca",15,35,2],["slowpoke","Pesca",15,35,2]]},{"z":"Route 5","es":"Ruta 5","r":[["pidgey","Hierba",13,16,40],["meowth","Hierba",10,16,35],["oddish","Hierba",13,16,13],["bellsprout","Hierba",13,16,13]]},{"z":"Route 6","es":"Ruta 6","r":[["pidgey","Hierba",13,16,40],["meowth","Hierba",10,16,35],["oddish","Hierba",13,16,13],["bellsprout","Hierba",13,16,13],["psyduck","Surf",13,16,50],["slowpoke","Surf",13,16,50],["magikarp","Pesca",5,15,33],["poliwag","Pesca",5,25,20],["poliwhirl","Pesca",20,30,13],["goldeen","Pesca",5,15,7],["gyarados","Pesca",15,25,5],["psyduck","Pesca",15,35,2],["slowpoke","Pesca",15,35,2]]},{"z":"Underground Path","es":"Túnel Subterráneo","r":[["meowth","Hierba",17,20,34],["pidgey","Hierba",19,22,26],["oddish","Hierba",19,22,11],["bellsprout","Hierba",19,22,11],["vulpix","Hierba",18,20,9],["growlithe","Hierba",18,20,9]]},{"z":"Vermilion City","es":"Ciudad Carmín","r":[["tentacool","Surf",13,16,100],["magikarp","Pesca",5,15,36],["krabby","Pesca",5,25,11],["horsea","Pesca",5,25,11],["shellder","Pesca",15,25,7],["staryu","Pesca",15,25,7],["gyarados","Pesca",15,25,5],["psyduck","Pesca",15,35,0],["slowpoke","Pesca",15,35,0]]},{"z":"Route 11","es":"Ruta 11","r":[["spearow","Hierba",13,17,35],["drowzee","Hierba",11,15,25],["ekans","Hierba",12,15,20],["sandshrew","Hierba",12,15,20],["mew","Hierba",11,17,1],["tentacool","Surf",11,17,100],["magikarp","Pesca",5,15,18],["krabby","Pesca",5,25,7],["horsea","Pesca",5,25,7],["gyarados","Pesca",15,25,3],["psyduck","Pesca",15,35,0],["slowpoke","Pesca",15,35,0]]},{"z":"Diglett's Cave","es":"Cueva Diglett","r":[["diglett","Cueva/Suelo",15,19,95],["dugtrio","Cueva/Suelo",19,29,5]]},{"z":"Route 9","es":"Ruta 9","r":[["rattata","Hierba",14,17,40],["spearow","Hierba",13,17,35],["ekans","Hierba",11,17,13],["sandshrew","Hierba",11,17,13]]},{"z":"Route 10","es":"Ruta 10","r":[["voltorb","Hierba",14,17,40],["spearow","Hierba",13,17,35],["ekans","Hierba",11,17,13],["sandshrew","Hierba",11,17,13],["tentacool","Surf",11,17,100],["magikarp","Pesca",5,15,36],["krabby","Pesca",5,25,15],["horsea","Pesca",5,25,15],["gyarados","Pesca",15,25,5],["psyduck","Pesca",15,35,0],["slowpoke","Pesca",15,35,0]]},{"z":"Rock Tunnel","es":"Túnel Roca","r":[["geodude","Cueva/Suelo",15,17,38],["zubat","Cueva/Suelo",15,16,33],["mankey","Cueva/Suelo",16,17,16],["machop","Cueva/Suelo",16,17,14],["onix","Cueva/Suelo",13,17,11],["charmander","Cueva/Suelo",15,17,1]]},{"z":"Power Plant","es":"Central Eléctrica","r":[["magnemite","Cueva/Suelo",22,25,29],["voltorb","Cueva/Suelo",22,25,29],["pikachu","Cueva/Suelo",22,26,24],["magneton","Cueva/Suelo",31,34,14],["electabuzz","Cueva/Suelo",32,35,5]]},{"z":"Pokémon Tower","es":"Torre Pokémon","r":[["gastly","Cueva/Suelo",13,19,90],["haunter","Cueva/Suelo",20,25,15],["cubone","Cueva/Suelo",15,19,10]]},{"z":"Route 8","es":"Ruta 8","r":[["meowth","Hierba",18,20,33],["pidgey","Hierba",18,20,29],["ekans","Hierba",17,19,10],["sandshrew","Hierba",17,19,10],["vulpix","Hierba",15,18,10],["growlithe","Hierba",15,18,10]]},{"z":"Route 7","es":"Ruta 7","r":[["meowth","Hierba",17,20,34],["pidgey","Hierba",19,22,26],["oddish","Hierba",19,22,11],["bellsprout","Hierba",19,22,11],["vulpix","Hierba",18,20,9],["growlithe","Hierba",18,20,9]]},{"z":"Celadon City","es":"Ciudad Azulona","r":[["psyduck","Surf",11,17,49],["slowpoke","Surf",11,17,49],["koffing","Surf",11,17,2],["magikarp","Pesca",5,35,33],["grimer","Pesca",30,40,2]]},{"z":"Route 16","es":"Ruta 16","r":[["doduo","Hierba",18,22,35],["rattata","Hierba",18,22,30],["spearow","Hierba",20,22,30],["raticate","Hierba",23,25,5]]},{"z":"Route 17","es":"Ruta 17","r":[["doduo","Hierba",24,28,30],["spearow","Hierba",20,22,26],["raticate","Hierba",25,29,22],["eevee","Hierba",24,28,13],["rattata","Hierba",22,22,4],["fearow","Hierba",25,27,4]]},{"z":"Route 18","es":"Ruta 18","r":[["doduo","Hierba",24,28,35],["spearow","Hierba",20,22,30],["raticate","Hierba",25,29,15],["fearow","Hierba",25,27,15],["rattata","Hierba",22,22,5]]},{"z":"Route 12","es":"Ruta 12","r":[["pidgey","Hierba",23,27,28],["venonat","Hierba",24,26,28],["oddish","Hierba",22,26,17],["bellsprout","Hierba",22,26,17],["gloom","Hierba",28,30,5],["weepinbell","Hierba",28,30,5],["tentacool","Surf",22,30,100],["magikarp","Pesca",5,15,38],["krabby","Pesca",5,25,16],["horsea","Pesca",5,25,16],["psyduck","Pesca",15,35,0],["slowpoke","Pesca",15,35,0]]},{"z":"Route 13","es":"Ruta 13","r":[["venonat","Hierba",24,26,28],["pidgey","Hierba",25,27,19],["oddish","Hierba",22,26,17],["bellsprout","Hierba",22,26,17],["pidgeotto","Hierba",29,29,5],["gloom","Hierba",30,30,5],["weepinbell","Hierba",28,30,5],["ditto","Hierba",25,25,5],["tentacool","Surf",11,17,100],["magikarp","Pesca",5,15,36],["krabby","Pesca",5,25,15],["horsea","Pesca",5,25,15],["gyarados","Pesca",15,25,5],["psyduck","Pesca",15,35,0],["slowpoke","Pesca",15,35,0]]},{"z":"Route 14","es":"Ruta 14","r":[["venonat","Hierba",24,26,28],["oddish","Hierba",22,26,17],["bellsprout","Hierba",22,26,17],["ditto","Hierba",23,23,14],["pidgey","Hierba",27,27,9],["pidgeotto","Hierba",29,29,5],["gloom","Hierba",30,30,5],["weepinbell","Hierba",30,30,5]]},{"z":"Route 15","es":"Ruta 15","r":[["venonat","Hierba",24,26,28],["pidgey","Hierba",25,27,19],["oddish","Hierba",22,26,17],["bellsprout","Hierba",22,26,17],["pidgeotto","Hierba",29,29,5],["gloom","Hierba",28,30,5],["weepinbell","Hierba",28,30,5],["ditto","Hierba",25,25,5]]},{"z":"Fuchsia City","es":"Ciudad Fucsia","r":[["psyduck","Surf",20,29,33],["slowpoke","Surf",15,35,33],["magikarp","Pesca",5,15,33],["poliwag","Pesca",5,15,20],["goldeen","Pesca",5,25,13],["seaking","Pesca",20,30,13],["gyarados","Pesca",15,25,5],["psyduck","Pesca",15,35,2]]},{"z":"Safari Zone","es":"Zona Safari","r":[["exeggcute","Hierba",23,27,20],["rhyhorn","Hierba",25,26,20],["doduo","Hierba",26,26,19],["venonat","Hierba",22,23,15],["paras","Hierba",22,23,14],["nidoranf","Hierba",22,30,10],["nidoranm","Hierba",22,30,10],["nidorina","Hierba",30,33,10],["nidorino","Hierba",30,33,10],["parasect","Hierba",25,30,5],["venomoth","Hierba",32,32,5],["scyther","Hierba",23,28,4],["pinsir","Hierba",23,28,4],["chansey","Hierba",23,26,4],["tauros","Hierba",28,28,4],["kangaskhan","Hierba",25,28,4],["psyduck","Surf",22,31,50],["slowpoke","Surf",22,31,50],["magikarp","Pesca",5,15,33],["goldeen","Pesca",5,25,20],["seaking","Pesca",20,30,13],["poliwag","Pesca",5,15,7],["dratini","Pesca",15,25,5],["psyduck","Pesca",15,35,2],["slowpoke","Pesca",15,35,1],["dragonair","Pesca",25,35,0]]},{"z":"Route 19","es":"Ruta 19","r":[["tentacool","Surf",22,30,100],["magikarp","Pesca",5,15,35],["krabby","Pesca",5,25,14],["horsea","Pesca",5,25,14],["gyarados","Pesca",15,25,5],["kingler","Pesca",25,35,1],["seadra","Pesca",25,35,1],["psyduck","Pesca",15,35,0],["slowpoke","Pesca",15,35,0]]},{"z":"Route 20","es":"Ruta 20","r":[["tentacool","Surf",22,30,100],["magikarp","Pesca",5,15,35],["krabby","Pesca",5,25,14],["horsea","Pesca",5,25,14],["gyarados","Pesca",15,25,5],["kingler","Pesca",25,35,1],["seadra","Pesca",25,35,1],["psyduck","Pesca",15,35,0],["slowpoke","Pesca",15,35,0]]},{"z":"Seafoam Islands","es":"Islas Espuma","r":[["squirtle","Cueva/Suelo",22,33,100],["seel","Cueva/Suelo",28,34,46],["zubat","Cueva/Suelo",22,26,34],["psyduck","Cueva/Suelo",26,33,28],["slowpoke","Cueva/Suelo",26,33,28],["golbat","Cueva/Suelo",26,30,14],["dewgong","Cueva/Suelo",32,36,9],["golduck","Cueva/Suelo",32,35,9],["slowbro","Cueva/Suelo",32,35,9],["seel","Surf",25,35,57],["krabby","Surf",25,30,14],["horsea","Surf",25,30,14],["dewgong","Surf",35,40,5],["psyduck","Surf",30,40,4],["slowpoke","Surf",30,40,4],["golduck","Surf",35,40,1],["slowbro","Surf",35,40,1],["magikarp","Pesca",5,15,35],["krabby","Pesca",5,25,14],["horsea","Pesca",5,25,14],["gyarados","Pesca",15,25,6],["psyduck","Pesca",15,35,1],["slowpoke","Pesca",15,35,1]]},{"z":"Cinnabar Island","es":"Isla Canela","r":[["tentacool","Surf",22,30,100],["magikarp","Pesca",5,15,35],["krabby","Pesca",5,25,11],["horsea","Pesca",5,25,11],["shellder","Pesca",15,25,7],["staryu","Pesca",15,25,7],["gyarados","Pesca",15,25,5],["slowbro","Pesca",25,35,1],["seadra","Pesca",25,35,1],["psyduck","Pesca",15,35,0],["slowpoke","Pesca",15,35,0]]},{"z":"Pokémon Mansion","es":"Mansión Pokémon","r":[["raticate","Cueva/Suelo",32,38,26],["rattata","Cueva/Suelo",26,28,13],["vulpix","Cueva/Suelo",30,32,13],["growlithe","Cueva/Suelo",30,32,13],["grimer","Cueva/Suelo",28,30,13],["koffing","Cueva/Suelo",28,30,13],["ditto","Cueva/Suelo",34,34,9],["muk","Cueva/Suelo",32,34,4],["weezing","Cueva/Suelo",32,34,4]]},{"z":"Route 21","es":"Ruta 21","r":[["tangela","Hierba",17,28,100],["tentacool","Surf",17,28,100],["magikarp","Pesca",5,15,35],["krabby","Pesca",5,25,14],["horsea","Pesca",5,25,14],["gyarados","Pesca",15,25,5],["kingler","Pesca",25,35,1],["seadra","Pesca",25,35,1],["psyduck","Pesca",15,35,0],["slowpoke","Pesca",15,35,0]]},{"z":"Route 23","es":"Ruta 23","r":[["mankey","Hierba",32,34,32],["spearow","Hierba",32,34,16],["fearow","Hierba",40,44,16],["ekans","Hierba",32,34,11],["sandshrew","Hierba",32,34,11],["arbok","Hierba",44,44,5],["primeape","Hierba",42,42,5],["sandslash","Hierba",44,44,4],["psyduck","Surf",20,40,50],["slowpoke","Surf",20,40,50],["magikarp","Pesca",5,15,33],["poliwag","Pesca",5,25,20],["poliwhirl","Pesca",20,30,13],["goldeen","Pesca",5,15,7],["gyarados","Pesca",15,25,5],["psyduck","Pesca",15,35,2],["slowpoke","Pesca",15,35,2]]},{"z":"Victory Road","es":"Calle Victoria","r":[["onix","Cueva/Suelo",40,48,100],["machop","Cueva/Suelo",32,34,27],["geodude","Cueva/Suelo",32,34,27],["primeape","Cueva/Suelo",42,42,20],["zubat","Cueva/Suelo",32,34,13],["arbok","Cueva/Suelo",44,44,7],["sandslash","Cueva/Suelo",44,44,7],["golbat","Cueva/Suelo",44,46,7],["machoke","Cueva/Suelo",44,48,7],["marowak","Cueva/Suelo",44,48,7]]},{"z":"Cerulean Cave","es":"Cueva Celeste","r":[["kadabra","Cueva/Suelo",55,67,29],["golbat","Cueva/Suelo",46,61,25],["parasect","Cueva/Suelo",49,64,25],["machoke","Cueva/Suelo",46,52,20],["magneton","Cueva/Suelo",49,55,20],["ditto","Cueva/Suelo",52,67,12],["primeape","Cueva/Suelo",52,61,11],["electrode","Cueva/Suelo",58,64,5],["wobbuffet","Cueva/Suelo",55,61,5],["golduck","Surf",30,65,50],["slowbro","Surf",30,65,50],["psyduck","Surf",30,65,25],["slowpoke","Surf",30,65,16],["gyarados","Pesca",15,25,100],["psyduck","Pesca",15,35,16],["slowpoke","Pesca",15,35,12]]},{"z":"One Island","es":"Isla Prima","r":[["psyduck","Hierba",31,31,50],["slowpoke","Hierba",31,31,50],["tentacool","Surf",5,40,95],["tentacruel","Surf",35,40,5],["magikarp","Pesca",5,15,35],["krabby","Pesca",5,25,11],["horsea","Pesca",5,25,11],["shellder","Pesca",15,25,7],["staryu","Pesca",15,25,7],["gyarados","Pesca",15,25,5],["kingler","Pesca",25,35,1],["seadra","Pesca",25,35,1],["psyduck","Pesca",15,35,0],["slowpoke","Pesca",15,35,0]]},{"z":"Kindle Road","es":"Senda Ascuas","r":[["ponyta","Hierba",31,34,29],["spearow","Hierba",30,32,24],["fearow","Hierba",36,36,10],["meowth","Hierba",31,31,10],["geodude","Hierba",31,31,10],["persian","Hierba",37,40,5],["psyduck","Hierba",34,34,5],["rapidash","Hierba",37,40,5],["slowpoke","Hierba",34,34,5],["tentacool","Surf",5,40,95],["tentacruel","Surf",35,40,5],["magikarp","Pesca",5,15,33],["krabby","Pesca",5,25,13],["horsea","Pesca",5,25,13],["gyarados","Pesca",15,25,5],["kingler","Pesca",25,35,1],["seadra","Pesca",25,35,1],["psyduck","Pesca",15,35,0],["slowpoke","Pesca",15,35,0]]},{"z":"Treasure Beach","es":"Playa Tesoro","r":[["spearow","Hierba",31,32,32],["tangela","Hierba",33,35,32],["fearow","Hierba",36,40,21],["meowth","Hierba",31,31,11],["persian","Hierba",37,40,5],["tentacool","Surf",5,40,95],["tentacruel","Surf",35,40,5],["magikarp","Pesca",5,15,33],["krabby","Pesca",5,25,13],["horsea","Pesca",5,25,13],["gyarados","Pesca",15,25,5],["kingler","Pesca",25,35,1],["seadra","Pesca",25,35,1],["psyduck","Pesca",15,35,0],["slowpoke","Pesca",15,35,0]]},{"z":"Mt. Ember","es":"Monte Ascuas","r":[["ponyta","Hierba",30,36,33],["fearow","Hierba",38,40,24],["spearow","Hierba",30,32,14],["machop","Hierba",35,35,10],["geodude","Hierba",33,33,10],["rapidash","Hierba",39,42,5],["magmar","Hierba",38,40,5],["slugma","Cueva/Suelo",18,36,100],["geodude","Cueva/Suelo",29,44,68],["machop","Cueva/Suelo",31,39,50],["machoke","Cueva/Suelo",38,42,20]]},{"z":"Cape Brink","es":"Cabo Lejano","r":[["spearow","Hierba",31,31,18],["oddish","Hierba",30,32,14],["bellsprout","Hierba",30,32,14],["fearow","Hierba",36,36,9],["meowth","Hierba",31,31,9],["gloom","Hierba",36,38,6],["weepinbell","Hierba",36,38,6],["persian","Hierba",37,40,5],["psyduck","Hierba",31,31,5],["golduck","Hierba",31,31,5],["slowpoke","Hierba",31,31,5],["slowbro","Hierba",37,40,5],["psyduck","Surf",5,40,45],["slowpoke","Surf",5,40,45],["golduck","Surf",35,40,5],["slowbro","Surf",35,40,5],["magikarp","Pesca",5,15,38],["poliwag","Pesca",5,25,15],["poliwhirl","Pesca",20,30,15],["goldeen","Pesca",5,15,8],["gyarados","Pesca",15,25,6],["psyduck","Pesca",15,35,2],["slowpoke","Pesca",15,35,2]]},{"z":"Bond Bridge","es":"Puente Unión","r":[["pidgey","Hierba",29,32,24],["pidgeotto","Hierba",34,40,12],["oddish","Hierba",30,31,8],["gloom","Hierba",36,36,8],["meowth","Hierba",31,31,8],["bellsprout","Hierba",31,31,8],["weepinbell","Hierba",36,36,8],["venonat","Hierba",34,34,4],["persian","Hierba",37,40,4],["psyduck","Hierba",31,31,4],["slowpoke","Hierba",31,31,4],["tentacool","Surf",5,40,95],["tentacruel","Surf",35,40,5],["magikarp","Pesca",5,15,33],["krabby","Pesca",5,25,13],["horsea","Pesca",5,25,13],["gyarados","Pesca",15,25,5],["kingler","Pesca",25,35,1],["seadra","Pesca",25,35,1],["psyduck","Pesca",15,35,0],["slowpoke","Pesca",15,35,0]]},{"z":"Three Isle Port","es":"Puerto Tera","r":[["dunsparce","Hierba",5,35,100]]},{"z":"Berry Forest","es":"Bosque Baya","r":[["pidgeotto","Hierba",37,37,19],["pidgey","Hierba",32,32,10],["gloom","Hierba",35,35,10],["venonat","Hierba",34,34,10],["bellsprout","Hierba",30,30,10],["weepinbell","Hierba",35,35,10],["drowzee","Hierba",34,34,10],["venomoth","Hierba",37,40,5],["psyduck","Hierba",31,31,5],["slowpoke","Hierba",31,31,5],["hypno","Hierba",37,40,5],["exeggcute","Hierba",35,35,5],["psyduck","Surf",5,40,43],["slowpoke","Surf",5,40,43],["golduck","Surf",35,40,5],["slowbro","Surf",5,40,5],["magikarp","Pesca",5,15,33],["goldeen","Pesca",5,25,20],["seaking","Pesca",20,30,13],["poliwag","Pesca",5,15,7],["gyarados","Pesca",15,25,5],["slowpoke","Pesca",15,35,2]]},{"z":"Four Island","es":"Isla Cuarta","r":[["marill","Surf",5,25,35],["wooper","Surf",5,25,35],["psyduck","Surf",5,35,15],["slowpoke","Surf",5,35,15],["magikarp","Pesca",5,15,29],["poliwag","Pesca",5,25,18],["goldeen","Pesca",5,15,18],["poliwhirl","Pesca",20,30,12],["gyarados","Pesca",15,25,4],["slowpoke","Pesca",15,35,1],["psyduck","Pesca",15,35,0]]},{"z":"Icefall Cave","es":"Cueva Cascada","r":[["swinub","Cueva/Suelo",23,31,48],["seel","Cueva/Suelo",43,47,40],["golbat","Cueva/Suelo",45,48,25],["dewgong","Cueva/Suelo",49,53,20],["zubat","Cueva/Suelo",40,40,10],["psyduck","Cueva/Suelo",41,41,5],["sneasel","Cueva/Suelo",30,30,5],["delibird","Cueva/Suelo",30,30,5],["slowpoke","Cueva/Suelo",41,41,5],["tentacool","Surf",5,40,92],["seel","Surf",5,35,46],["psyduck","Surf",5,35,12],["slowpoke","Surf",5,35,12],["dewgong","Surf",35,40,12],["tentacruel","Surf",35,40,4],["lapras","Surf",30,45,4],["marill","Surf",5,15,4],["wooper","Surf",5,15,4],["magikarp","Pesca",5,15,33],["poliwag","Pesca",5,25,17],["goldeen","Pesca",5,15,17],["krabby","Pesca",5,25,13],["horsea","Pesca",5,25,13],["poliwhirl","Pesca",20,30,12],["shellder","Pesca",15,25,7],["staryu","Pesca",15,25,7],["gyarados","Pesca",15,25,5],["psyduck","Pesca",15,35,1],["slowpoke","Pesca",15,35,1],["kingler","Pesca",25,35,1],["seadra","Pesca",25,35,1]]},{"z":"Five Island","es":"Isla Quinta","r":[["tentacool","Surf",5,40,65],["hoppip","Surf",5,15,30],["tentacruel","Surf",35,40,5],["magikarp","Pesca",5,15,33],["krabby","Pesca",5,25,13],["horsea","Pesca",5,25,13],["shellder","Pesca",15,25,7],["staryu","Pesca",15,25,7],["gyarados","Pesca",15,25,5],["kingler","Pesca",25,35,1],["seadra","Pesca",25,35,1],["psyduck","Pesca",15,35,0],["slowpoke","Pesca",15,35,0]]},{"z":"Five Isle Meadow","es":"Pradera Quinta","r":[["sentret","Hierba",10,15,29],["pidgey","Hierba",44,44,19],["pidgeotto","Hierba",48,50,14],["hoppip","Hierba",10,15,14],["meowth","Hierba",41,41,10],["persian","Hierba",47,50,5],["psyduck","Hierba",41,41,5],["slowpoke","Hierba",41,41,5],["tentacool","Surf",5,40,65],["hoppip","Surf",5,15,30],["tentacruel","Surf",35,40,5],["magikarp","Pesca",5,15,33],["krabby","Pesca",5,25,13],["horsea","Pesca",5,25,13],["qwilfish","Pesca",15,25,7],["remoraid","Pesca",15,25,7],["gyarados","Pesca",15,25,5],["kingler","Pesca",25,35,1],["seadra","Pesca",25,35,1],["psyduck","Pesca",15,35,0],["slowpoke","Pesca",15,35,0]]},{"z":"Memorial Pillar","es":"Pilar Memorial","r":[["hoppip","Hierba",6,16,100],["tentacool","Surf",5,40,65],["hoppip","Surf",5,15,30],["tentacruel","Surf",35,40,5],["magikarp","Pesca",5,15,24],["krabby","Pesca",5,25,11],["horsea","Pesca",5,25,11],["qwilfish","Pesca",15,25,11],["remoraid","Pesca",15,25,11],["gyarados","Pesca",15,25,8],["kingler","Pesca",25,35,2],["seadra","Pesca",25,35,2],["psyduck","Pesca",15,35,1],["slowpoke","Pesca",15,35,1]]},{"z":"Water Labyrinth","es":"Laberinto Acuático","r":[["tentacool","Surf",5,40,65],["hoppip","Surf",5,15,30],["tentacruel","Surf",35,40,5],["magikarp","Pesca",5,15,33],["krabby","Pesca",5,25,13],["horsea","Pesca",5,25,13],["qwilfish","Pesca",15,25,7],["remoraid","Pesca",15,25,7],["gyarados","Pesca",15,25,5],["kingler","Pesca",25,35,1],["seadra","Pesca",25,35,1],["psyduck","Pesca",15,35,0],["slowpoke","Pesca",15,35,0]]},{"z":"Resort Gorgeous","es":"Resort Lujoso","r":[["tentacool","Surf",5,40,65],["hoppip","Surf",5,15,30],["tentacruel","Surf",35,40,5],["magikarp","Pesca",5,15,33],["krabby","Pesca",5,25,13],["horsea","Pesca",5,25,13],["qwilfish","Pesca",15,25,7],["remoraid","Pesca",15,25,7],["gyarados","Pesca",15,25,5],["kingler","Pesca",25,35,1],["seadra","Pesca",25,35,1],["psyduck","Pesca",15,35,0],["slowpoke","Pesca",15,35,0]]},{"z":"Lost Cave","es":"Cueva Perdida","r":[["haunter","Cueva/Suelo",44,52,29],["gastly","Cueva/Suelo",38,40,24],["zubat","Cueva/Suelo",37,37,19],["golbat","Cueva/Suelo",41,43,19],["murkrow","Cueva/Suelo",22,22,5],["misdreavus","Cueva/Suelo",22,22,5]]},{"z":"Water Path","es":"Senda Acuática","r":[["sentret","Hierba",10,15,25],["spearow","Hierba",44,44,17],["fearow","Hierba",48,50,12],["oddish","Hierba",44,44,8],["meowth","Hierba",41,41,8],["bellsprout","Hierba",44,44,8],["gloom","Hierba",48,48,4],["persian","Hierba",47,50,4],["psyduck","Hierba",41,41,4],["weepinbell","Hierba",48,48,4],["slowpoke","Hierba",41,41,4]]},{"z":"Ruin Valley","es":"Valle Ruinas","r":[["natu","Hierba",15,20,22],["spearow","Hierba",44,44,17],["fearow","Hierba",49,49,9],["meowth","Hierba",43,43,9],["marill","Hierba",15,15,9],["yanma","Hierba",18,18,9],["wooper","Hierba",15,15,9],["persian","Hierba",49,52,4],["psyduck","Hierba",41,41,4],["slowpoke","Hierba",41,41,4],["wobbuffet","Hierba",25,25,4],["marill","Surf",5,25,50],["wooper","Surf",5,25,50],["magikarp","Pesca",5,15,35],["poliwag","Pesca",5,25,21],["poliwhirl","Pesca",20,30,14],["gyarados","Pesca",15,25,5],["psyduck","Pesca",15,35,2],["slowpoke","Pesca",15,35,2]]},{"z":"Green Path","es":"Senda Verde","r":[["ledyba","Hierba",9,14,20],["spinarak","Hierba",9,14,20],["heracross","Hierba",15,30,20],["caterpie","Hierba",6,6,10],["metapod","Hierba",9,9,10],["weedle","Hierba",6,6,10],["kakuna","Hierba",9,9,10]]},{"z":"Pattern Bush","es":"Matorral Dibujo","r":[["ledyba","Hierba",9,14,20],["spinarak","Hierba",9,14,20],["heracross","Hierba",15,30,20],["caterpie","Hierba",6,6,10],["metapod","Hierba",9,9,10],["weedle","Hierba",6,6,10],["kakuna","Hierba",9,9,10],["tentacool","Surf",5,40,95],["tentacruel","Surf",35,40,5],["magikarp","Pesca",5,15,33],["krabby","Pesca",5,25,13],["horsea","Pesca",5,25,13],["qwilfish","Pesca",15,25,7],["remoraid","Pesca",15,25,7],["gyarados","Pesca",15,25,5],["kingler","Pesca",25,35,1],["seadra","Pesca",25,35,1],["psyduck","Pesca",15,35,0],["slowpoke","Pesca",15,35,0]]},{"z":"Altering Cave","es":"Cueva Mutante","r":[["zubat","Cueva/Suelo",6,16,11],["mareep","Cueva/Suelo",3,13,11],["aipom","Cueva/Suelo",18,28,11],["pineco","Cueva/Suelo",19,29,11],["shuckle","Cueva/Suelo",18,28,11],["teddiursa","Cueva/Suelo",18,28,11],["houndour","Cueva/Suelo",12,20,11],["stantler","Cueva/Suelo",18,28,11],["smeargle","Cueva/Suelo",18,28,11]]},{"z":"Three Isle Path","es":"Senda Tera","r":[["dunsparce","Hierba",5,35,100]]},{"z":"Sevault Canyon","es":"Cañón Sete","r":[["geodude","Hierba",46,46,19],["phanpy","Hierba",15,15,19],["fearow","Hierba",50,50,14],["meowth","Hierba",43,43,10],["cubone","Hierba",46,46,10],["marowak","Hierba",52,52,10],["persian","Hierba",47,50,5],["onix","Hierba",54,54,5],["skarmory","Hierba",30,30,5],["larvitar","Hierba",15,20,5],["tentacool","Surf",5,40,90],["tentacruel","Surf",35,40,5],["mantine","Surf",35,40,5],["magikarp","Pesca",5,15,33],["krabby","Pesca",5,25,13],["horsea","Pesca",5,25,13],["qwilfish","Pesca",15,25,7],["remoraid","Pesca",15,25,7],["gyarados","Pesca",15,25,5],["kingler","Pesca",25,35,1],["seadra","Pesca",25,35,1],["psyduck","Pesca",15,35,0],["slowpoke","Pesca",15,35,0]]},{"z":"Canyon Entrance","es":"Entrada Cañón","r":[["sentret","Hierba",10,15,29],["spearow","Hierba",44,44,19],["fearow","Hierba",48,50,14],["phanpy","Hierba",10,15,14],["meowth","Hierba",41,41,10],["persian","Hierba",47,50,5],["psyduck","Hierba",41,41,5],["slowpoke","Hierba",41,41,5]]},{"z":"Tanoby Ruins","es":"Ruinas Sete","r":[["unown character=a","Cueva/Suelo",25,25,99],["unown character=z","Cueva/Suelo",25,25,99],["unown character=n","Cueva/Suelo",25,25,60],["unown character=c","Cueva/Suelo",25,25,50],["unown character=v","Cueva/Suelo",25,25,50],["unown character=p","Cueva/Suelo",25,25,40],["unown character=y","Cueva/Suelo",25,25,40],["unown character=d","Cueva/Suelo",25,25,30],["unown character=s","Cueva/Suelo",25,25,30],["unown character=w","Cueva/Suelo",25,25,30],["unown character=g","Cueva/Suelo",25,25,25],["unown character=j","Cueva/Suelo",25,25,20],["unown character=l","Cueva/Suelo",25,25,20],["unown character=t","Cueva/Suelo",25,25,20],["unown character=h","Cueva/Suelo",25,25,14],["unown character=r","Cueva/Suelo",25,25,14],["unown character=f","Cueva/Suelo",25,25,13],["unown character=x","Cueva/Suelo",25,25,10],["unown character=i","Cueva/Suelo",25,25,8],["unown character=m","Cueva/Suelo",25,25,8],["unown character=q","Cueva/Suelo",25,25,6],["unown character=u","Cueva/Suelo",25,25,5],["unown character=e","Cueva/Suelo",25,25,2],["unown character=k","Cueva/Suelo",25,25,2],["unown character=b","Cueva/Suelo",25,25,2],["unown character=?","Cueva/Suelo",25,25,1],["unown character=o","Cueva/Suelo",25,25,1],["unown character=!","Cueva/Suelo",25,25,1]]},{"z":"Tanoby Chambers","es":"Cámaras Sete","r":[["unown character=a","Cueva/Suelo",25,25,99],["unown character=z","Cueva/Suelo",25,25,99],["unown character=n","Cueva/Suelo",25,25,60],["unown character=c","Cueva/Suelo",25,25,50],["unown character=v","Cueva/Suelo",25,25,50],["unown character=p","Cueva/Suelo",25,25,40],["unown character=y","Cueva/Suelo",25,25,40],["unown character=d","Cueva/Suelo",25,25,30],["unown character=s","Cueva/Suelo",25,25,30],["unown character=w","Cueva/Suelo",25,25,30],["unown character=g","Cueva/Suelo",25,25,25],["unown character=j","Cueva/Suelo",25,25,20],["unown character=l","Cueva/Suelo",25,25,20],["unown character=t","Cueva/Suelo",25,25,20],["unown character=h","Cueva/Suelo",25,25,14],["unown character=r","Cueva/Suelo",25,25,14],["unown character=f","Cueva/Suelo",25,25,13],["unown character=x","Cueva/Suelo",25,25,10],["unown character=i","Cueva/Suelo",25,25,8],["unown character=m","Cueva/Suelo",25,25,8],["unown character=q","Cueva/Suelo",25,25,6],["unown character=u","Cueva/Suelo",25,25,5],["unown character=e","Cueva/Suelo",25,25,2],["unown character=k","Cueva/Suelo",25,25,2],["unown character=b","Cueva/Suelo",25,25,2],["unown character=?","Cueva/Suelo",25,25,1],["unown character=o","Cueva/Suelo",25,25,1],["unown character=!","Cueva/Suelo",25,25,1]]}];
const NAMES={nidoranf:"Nidoran♀",nidoranm:"Nidoran♂",mrmime:"Mr. Mime",farfetchd:"Farfetch'd",hooh:"Ho-Oh",porygon2:"Porygon2",mimejr:"Mime Jr."};
const nm=p=>{if(NAMES[p])return NAMES[p];const u=/^unown character=(.)$/.exec(p);if(u)return"Unown "+u[1].toUpperCase();return p.charAt(0).toUpperCase()+p.slice(1)};
const SPR="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/";
const spr=p=>{const id=(window.DEX||{})[String(p).split(" ")[0]];return id?SPR+(id<=386?"versions/generation-iii/firered-leafgreen/":"")+id+".png":""};
const img=(p,s)=>{const u=spr(p);return u?`<img src="${u}" width="${s}" height="${s}" alt="" decoding="async">`:`<span style="width:${s}px;height:${s}px;flex:none"></span>`};
const MLAB={"Hierba":"Hierba","Cueva/Suelo":"Cueva","Surf":"Surf","Pesca":"Pesca"};
const $=id=>document.getElementById(id);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const norm=s=>s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"");

let state={players:[{id:"p1",name:"Jugador 1",team:[],routes:{}}],cur:"p1",weighted:false};
let ui={region:"kanto",zone:"Route 1",method:null,spinning:false,angle:0,last:null,confirmReset:false,confirmDel:null};

const player=()=>state.players.find(p=>p.id===state.cur)||state.players[0];
const zoneObj=z=>ZONES.find(x=>x.z===z);

function save(){
  if(!canEdit()){restoreRemote();$("sync").textContent=VIEW_MSG;return}
  $("sync").textContent=ToolStore.save("nuzlocke",state)?"Guardado":"No se pudo guardar";
  pushLive();
}

const METHODS=["Hierba","Cueva/Suelo","Surf","Pesca"];
const GEAR={Surf:"surf",Pesca:"fish"};
const gearOk=(pl,m)=>!GEAR[m]||!!(pl.gear&&pl.gear[GEAR[m]]);
function zoneMethods(z,pl){const has=new Set(z.r.map(r=>r[1]));return METHODS.map(m=>({m,has:has.has(m),ok:has.has(m)&&gearOk(pl,m)}))}
function curMethod(){
  const z=zoneObj(ui.zone),ms=zoneMethods(z,player());
  if(ui.method&&ms.some(x=>x.m===ui.method&&x.ok))return ui.method;
  const f=ms.find(x=>x.ok);return f?f.m:null;
}
function candidates(){
  const z=zoneObj(ui.zone),own=new Set(player().team.map(t=>t.p)),cm=curMethod();
  const m=new Map();
  for(const r of z.r){
    if(r[1]!==cm)continue;
    const e=m.get(r[0]);
    if(e){e.w=Math.max(e.w,r[4]);e.min=Math.min(e.min,r[2]);e.max=Math.max(e.max,r[3])}
    else m.set(r[0],{p:r[0],w:r[4],min:r[2],max:r[3]});
  }
  const all=[...m.values()];
  return{all,pick:all.filter(c=>!own.has(c.p))};
}

function colors(){const cs=getComputedStyle(document.documentElement);return["--s1","--s2","--s3","--s4","--s5","--s6"].map(v=>cs.getPropertyValue(v).trim())}

function slices(){
  const {pick}=candidates();
  const ws=pick.map(c=>state.weighted?Math.max(c.w,0.5):1),tot=ws.reduce((a,b)=>a+b,0);
  let a=0;return pick.map((c,i)=>{const s={c,start:a,end:a+ws[i]/tot*Math.PI*2};a=s.end;return s});
}

function lum(h){const m=/^#?([0-9a-f]{6})$/i.exec(String(h).trim());if(!m)return 0;const n=parseInt(m[1],16),c=[n>>16,n>>8&255,n&255].map(v=>{v/=255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4)});return .2126*c[0]+.7152*c[1]+.0722*c[2]}

function drawWheel(){
  const cv=$("wheel"),ctx=cv.getContext("2d"),W=cv.width,R=W/2-8,cx=W/2,cy=W/2;
  const cs=getComputedStyle(document.documentElement);
  ctx.clearRect(0,0,W,W);
  const sl=ui.frozen||slices(),col=colors();
  if(!sl.length){
    ctx.beginPath();ctx.arc(cx,cy,R,0,Math.PI*2);ctx.fillStyle=cs.getPropertyValue("--line").trim();ctx.fill();
    ctx.fillStyle=cs.getPropertyValue("--muted").trim();ctx.font="700 34px "+cs.getPropertyValue("--body");ctx.textAlign="center";ctx.textBaseline="middle";
    ctx.fillText("Sin Pokémon nuevos",cx,cy);return;
  }
  ctx.save();ctx.translate(cx,cy);ctx.rotate(ui.angle);
  sl.forEach((s,i)=>{
    ctx.beginPath();ctx.moveTo(0,0);ctx.arc(0,0,R,s.start-Math.PI/2,s.end-Math.PI/2);ctx.closePath();
    ctx.fillStyle=col[(i+(sl.length%6===1&&i===sl.length-1?1:0))%6];ctx.fill();
    ctx.strokeStyle=cs.getPropertyValue("--line-strong").trim();ctx.lineWidth=4;ctx.stroke();
    const mid=(s.start+s.end)/2-Math.PI/2,span=s.end-s.start;
    const fill=col[(i+(sl.length%6===1&&i===sl.length-1?1:0))%6];
    ctx.save();ctx.rotate(mid);ctx.fillStyle=lum(fill)>.3?"#0a0a0a":"#f5f5f5";
    const fs=Math.max(16,Math.min(36,span*R*0.42));ctx.font="700 "+fs+"px "+cs.getPropertyValue("--display");
    ctx.textBaseline="middle";
    const flip=Math.cos(ui.angle+mid)<0;
    if(flip)ctx.rotate(Math.PI);
    ctx.textAlign=flip?"left":"right";
    if(span>0.06)ctx.fillText(nm(s.c.p),flip?-(R-18):R-18,0);
    ctx.restore();
  });
  ctx.restore();
  ctx.beginPath();ctx.arc(cx,cy,34,0,Math.PI*2);ctx.fillStyle=cs.getPropertyValue("--panel").trim();ctx.fill();
  ctx.lineWidth=6;ctx.strokeStyle=cs.getPropertyValue("--line-strong").trim();ctx.stroke();
}

function spin(){
  const sl=slices();if(!sl.length||ui.spinning||!canEdit())return;
  const r=Math.random()*Math.PI*2;
  const hit=sl.find(s=>r>=s.start&&r<s.end)||sl[sl.length-1];
  const mid=hit.start+(hit.end-hit.start)*(0.2+Math.random()*0.6);
  const c=hit.c,lv=c.min===c.max?c.min:c.min+Math.floor(Math.random()*(c.max-c.min+1)),pid=player().id;
  ui.last=null;ui.frozen=sl;
  const dur=broadcastSpin(sl,mid,c.p,lv);
  animate(mid,dur,()=>{state.cur=pid;catchMon(c,lv)});
}

function animate(mid,dur,done){
  const reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;
  const target=-mid,start=ui.angle;
  let end=target+Math.PI*2*Math.ceil((start-target)/(Math.PI*2));
  if(!reduce)end+=Math.PI*12;
  dur=reduce?300:dur;
  const t0=performance.now();
  ui.spinning=true;renderControls();
  let over=false;
  const finish=()=>{if(over)return;over=true;ui.angle=end%(Math.PI*2);ui.spinning=false;flushLive();done()};
  setTimeout(finish,dur+250);
  (function step(t){
    if(over)return;
    const k=Math.min(1,(t-t0)/dur),e=1-Math.pow(1-k,4);
    ui.angle=start+(end-start)*e;drawWheel();
    if(k<1)requestAnimationFrame(step);else finish();
  })(performance.now());
}

function catchMon(c,lv){
  const pl=player();
  pl.team.push({p:c.p,route:ui.zone,lv,alive:true});
  pl.routes[ui.zone]={r:"caught",p:c.p};
  ui.last={p:c.p,zone:ui.zone,lv};
  save();renderAll();
}
function undo(){
  const pl=player(),l=ui.last;if(!l)return;
  const i=pl.team.findIndex(t=>t.p===l.p&&t.route===l.zone);if(i>=0)pl.team.splice(i,1);
  delete pl.routes[l.zone];ui.last=null;save();renderAll();
}
function markFail(){player().routes[ui.zone]={r:"fail"};ui.last=null;save();renderAll()}
function reopen(){
  const pl=player(),rt=pl.routes[ui.zone];if(!rt)return;
  if(rt.r==="caught"){const i=pl.team.findIndex(t=>t.p===rt.p&&t.route===ui.zone);if(i>=0)pl.team.splice(i,1)}
  delete pl.routes[ui.zone];ui.last=null;save();renderAll();
}

function renderPlayers(){
  const el=$("players"),pl=player();
  let tools="";
  if(ui.renaming){tools=`<form class="addp" id="ren"><input type="text" id="renName" name="nombre" maxlength="24" value="${esc(pl.name)}" autocomplete="off" aria-label="Nuevo nombre"><button class="btn sm primary" type="submit">Guardar</button><button class="btn sm" type="button" id="renNo">Cancelar</button></form>`}
  else if(ui.confirmDel){tools=`<span class="confirm">¿Eliminar a ${esc(pl.name)} con su equipo y rutas?<button class="btn sm primary" id="delYes">Sí, eliminar</button><button class="btn sm" id="delNo">Cancelar</button></span>`}
  else{tools=`<button class="btn sm" id="renBtn">Renombrar</button><button class="btn sm" id="delBtn">Eliminar</button>`}
  el.innerHTML=state.players.map(p=>`<button class="chip" data-p="${esc(p.id)}" aria-pressed="${p.id===state.cur}">${esc(p.name)} · ${p.team.length}</button>`).join("")+tools+
   `<form class="addp" id="addp"><input type="text" id="newPlayer" name="jugador" placeholder="Nuevo jugador…" maxlength="24" autocomplete="off" aria-label="Nuevo jugador"><button class="btn sm" type="submit">Agregar</button></form>`;
  el.querySelectorAll("[data-p]").forEach(b=>b.onclick=()=>{if(ui.spinning)return;state.cur=b.dataset.p;ui.last=null;ui.confirmReset=false;ui.confirmDel=false;ui.renaming=false;if(canEdit())save();renderAll()});
  $("addp").onsubmit=e=>{e.preventDefault();const n=$("newPlayer").value.trim();if(!n)return;const id="p"+Date.now().toString(36);state.players.push({id,name:n,team:[],routes:{},gear:{surf:false,fish:false}});state.cur=id;save();renderAll()};
  $("renBtn")&&($("renBtn").onclick=()=>{ui.renaming=true;ui.confirmDel=false;renderPlayers();$("renName").focus();$("renName").select()});
  $("delBtn")&&($("delBtn").onclick=()=>{ui.confirmDel=true;ui.renaming=false;renderPlayers()});
  $("renNo")&&($("renNo").onclick=()=>{ui.renaming=false;renderPlayers()});
  $("ren")&&($("ren").onsubmit=e=>{e.preventDefault();const n=$("renName").value.trim();if(n)pl.name=n;ui.renaming=false;save();renderAll()});
  $("delNo")&&($("delNo").onclick=()=>{ui.confirmDel=false;renderPlayers()});
  $("delYes")&&($("delYes").onclick=()=>{state.players=state.players.filter(p=>p.id!==pl.id);if(!state.players.length)state.players.push({id:"p"+Date.now().toString(36),name:"Jugador 1",team:[],routes:{}});state.cur=state.players[0].id;ui.confirmDel=false;ui.last=null;save();renderAll()});
}

function newCount(z,own,pl){let n=0;const seen=new Set();for(const r of z.r){if(!gearOk(pl,r[1]))continue;if(!seen.has(r[0])){seen.add(r[0]);if(!own.has(r[0]))n++}}return n}

function renderRoutes(){
  const pl=player(),term=norm($("routeSearch").value.trim()),own=new Set(pl.team.map(t=>t.p));
  const done=Object.keys(pl.routes).length;
  $("progress").textContent=`${done} de ${ZONES.length} rutas usadas`;
  $("routes").innerHTML=ZONES.filter(z=>!term||norm(z.es).includes(term)||norm(z.z).includes(term)||z.r.some(r=>norm(nm(r[0])).includes(term))).map(z=>{
    const r=pl.routes[z.z],cls=r?(r.r==="caught"?"done":"done fail"):"";
    const tag=r?`<span class="tag">${esc(r.r==="caught"?nm(r.p):"Sin captura")}</span>`:`<span class="tag left" title="Pokémon nuevos para ${esc(pl.name)}">${newCount(z,own,pl)}</span>`;
    return `<button class="route ${cls}" type="button" data-z="${esc(z.z)}" aria-current="${z.z===ui.zone}"><span class="rn">${esc(z.es)}</span>${tag}</button>`;
  }).join("")||`<p class="empty">No hay rutas ni Pokémon con ese nombre.</p>`;
  $("routes").querySelectorAll("[data-z]").forEach(b=>b.onclick=()=>pickZone(b.dataset.z));
}

function pickZone(z){
  if(ui.spinning||!zoneObj(z))return;
  ui.zone=z;ui.method=null;ui.last=null;
  const m=window.KANTO_MAP;
  if(m&&m.sete.zones.some(x=>x.z===z))ui.region="sete";else if(m&&m.kanto.zones.some(x=>x.z===z))ui.region="kanto";
  renderAll();
}

function renderMap(){
  const M=window.KANTO_MAP;if(!M)return;
  const reg=M[ui.region],pl=player(),own=new Set(pl.team.map(t=>t.p));
  $("mapTabs").innerHTML=["kanto","sete"].map(k=>`<button class="chip" type="button" data-reg="${k}" aria-pressed="${ui.region===k}">${M[k].name}</button>`).join("");
  $("mapTabs").querySelectorAll("[data-reg]").forEach(b=>b.onclick=()=>{ui.region=b.dataset.reg;renderMap()});
  const S=(n,a)=>`<${n} ${Object.entries(a).map(([k,v])=>`${k}="${v}"`).join(" ")}/>`;
  const SPOT={cave:"var(--cave)",forest:"var(--forest)",bldg:"var(--bldg)",beach:"var(--beach)",ruins:"var(--ruins)",water:"var(--sea-deep)"};
  let g=`<rect x="0" y="0" width="${reg.w}" height="${reg.h}" fill="var(--sea)"/>`;
  g+=reg.land.map(l=>S("rect",{x:l[0],y:l[1],width:l[2],height:l[3],rx:.35,fill:"var(--land)",stroke:"var(--land-edge)","stroke-width":.14})).join("");
  const order=[...reg.zones].sort((a,b)=>(a.pts?0:1)-(b.pts?0:1));
  let cur="";
  for(const z of order){
    const r=pl.routes[z.z],cls="z"+(r?" done":""),here=z.z===ui.zone;
    const name=(zoneObj(z.z)||{es:z.z}).es;
    let body="";
    if(z.pts){
      const pts=z.pts.map(p=>p.join(",")).join(" ");
      if(z.t==="sea")body=S("polyline",{points:pts,fill:"none",stroke:"var(--muted)","stroke-width":.22,"stroke-dasharray":".45 .3","stroke-linecap":"round",opacity:.9});
      else if(z.t==="tunnel")body=S("polyline",{points:pts,fill:"none",stroke:"var(--path-edge)","stroke-width":.3,"stroke-dasharray":".5 .35"});
      else body=S("polyline",{points:pts,fill:"none",stroke:"var(--path-edge)","stroke-width":.82,"stroke-linecap":"square","stroke-linejoin":"miter"})+S("polyline",{points:pts,fill:"none",stroke:r?"var(--done)":"var(--path)","stroke-width":.52,"stroke-linecap":"square","stroke-linejoin":"miter"});
      body+=S("polyline",{class:"hit",points:pts,fill:"none",stroke:"transparent","stroke-width":1.2,"stroke-linecap":"round"});
      if(here){const xs=z.pts.map(p=>p[0]),ys=z.pts.map(p=>p[1]),x0=Math.min(...xs)-.55,y0=Math.min(...ys)-.55;cur=S("rect",{class:"cursor",x:x0,y:y0,width:Math.max(...xs)-x0+.55,height:Math.max(...ys)-y0+.55})}
    }else{
      const [x,y]=z.at,s=z.t==="town"?1.1:.8,fill=r?"var(--done)":z.t==="town"?"var(--town)":SPOT[z.t]||"var(--path)";
      body=z.t==="town"||z.t==="bldg"?S("rect",{x:x-s/2,y:y-s/2,width:s,height:s,fill,stroke:"var(--line-strong)","stroke-width":.12}):
        z.t==="cave"||z.t==="ruins"?S("polygon",{points:`${x},${y-s/1.6} ${x+s/1.6},${y} ${x},${y+s/1.6} ${x-s/1.6},${y}`,fill,stroke:"var(--line-strong)","stroke-width":.12}):
        S("circle",{cx:x,cy:y,r:s/2,fill,stroke:"var(--line-strong)","stroke-width":.12});
      body+=S("circle",{class:"hit",cx:x,cy:y,r:.85,fill:"transparent",stroke:"transparent","stroke-width":.1});
      if(here)cur=S("rect",{class:"cursor",x:x-.95,y:y-.95,width:1.9,height:1.9});
    }
    g+=`<g class="${cls}" data-z="${esc(z.z)}"><title>${esc(name)}</title>${body}</g>`;
  }
  g+=reg.deco.map(d=>S("rect",{x:d.at[0]-.42,y:d.at[1]-.42,width:.84,height:.84,fill:"var(--panel)",stroke:"var(--muted)","stroke-width":.14})).join("");
  g+=reg.marks.map(m=>`<text x="${m.at[0]}" y="${m.at[1]}" font-family="Pixelify Sans, sans-serif" font-weight="700" font-size=".9" fill="var(--muted)">${m.n}</text>`).join("");
  $("map").innerHTML=`<svg viewBox="0 0 ${reg.w} ${reg.h}" role="img" aria-label="Mapa de ${reg.name}. Para elegir con el teclado usa la lista de rutas.">${g}${cur}</svg>`;
  $("map").querySelectorAll("[data-z]").forEach(e=>e.addEventListener("click",()=>pickZone(e.dataset.z)));
  const z=zoneObj(ui.zone),inReg=reg.zones.some(x=>x.z===ui.zone),rt=pl.routes[ui.zone];
  $("here").hidden=!inReg;
  $("here").innerHTML=`${esc(z.es)}<small>${rt?(rt.r==="caught"?"usada":"sin captura"):newCount(z,own,pl)+" nuevos"}</small>`;
}

function renderZone(){
  const z=zoneObj(ui.zone);
  $("zname").textContent=z.es;$("zsub").textContent=z.es!==z.z?z.z:"";
  const ms=[...new Set(z.r.map(r=>r[1]))];
  const pl0=player(),zm=zoneMethods(z,pl0),cm=curMethod();
  $("methods").innerHTML=zm.map(x=>{const why=!x.has?"No hay en esta zona":!x.ok?(x.m==="Surf"?"Necesitas Surf":"Necesitas una caña"):"";return`<button class="chip" type="button" data-m="${x.m}" aria-pressed="${x.m===cm}" ${x.ok?"":"disabled"} title="${why}">${MLAB[x.m]}${x.has&&!x.ok?" · bloqueado":""}</button>`}).join("");
  $("methods").querySelectorAll("[data-m]:not([disabled])").forEach(b=>b.onclick=()=>{if(ui.spinning)return;ui.method=b.dataset.m;ui.frozen=null;renderZone();drawWheel();renderControls()});
  $("gSurf").checked=!!(pl0.gear&&pl0.gear.surf);$("gFish").checked=!!(pl0.gear&&pl0.gear.fish);
  const {all}=candidates(),own=new Set(player().team.map(t=>t.p));
  $("pool").innerHTML=all.map(c=>`<button type="button" class="pk ${own.has(c.p)?"dupe":""}" data-pk="${esc(c.p)}" data-lv="${c.min}" title="${own.has(c.p)?"Ya lo tienes":"Cargar para agregar a mano"}">${img(c.p,36,true)}${esc(nm(c.p))}<small>Nv. ${c.min===c.max?c.min:c.min+"–"+c.max}${state.weighted?" · "+(c.w<1?"<1":c.w)+"%":""}</small></button>`).join("")||`<span class="empty">Ningún Pokémon con este método.</span>`;
}

function renderControls(){
  const pl=player(),rt=pl.routes[ui.zone],{pick}=candidates();
  let res="",act="";
  if(ui.spinning){res=`<p>Girando…</p>`}
  else if(ui.last&&ui.last.zone===ui.zone){res=`${spr(ui.last.p)?`<img class="rimg" src="${spr(ui.last.p)}" width="96" height="96" alt="">`:""}<div><b>¡${esc(nm(ui.last.p))}!</b><p>Nv. ${ui.last.lv} · agregado al equipo de ${esc(pl.name)}</p></div>`;act=`<button class="btn" id="undo">Deshacer</button>`}
  else if(rt){res=rt.r==="caught"?`<p>Ruta usada: capturaste a <strong>${esc(nm(rt.p))}</strong>.</p>`:`<p>Ruta usada sin captura.</p>`;act=`<button class="btn" id="reopen">Reabrir ruta</button>`}
  else if(!curMethod()){res=`<p>Esta zona solo tiene encuentros de ${zoneObj(ui.zone).r.some(r=>r[1]==="Surf")?"surf o pesca":"pesca"}. Marca abajo cuando los desbloquees; la zona sigue disponible.</p>`}
  else if(!pick.length){res=`<p>Ya tienes todos los Pokémon de esta ruta.</p>`;act=`<button class="btn" id="fail">Marcar sin captura</button>`}
  else{res=`<p>${pick.length} Pokémon posibles</p>`;act=`<button class="btn primary" id="spin">Tirar ruleta</button><button class="btn" id="fail">Falló la captura</button>`}
  $("result").innerHTML=res;$("actions").innerHTML=act;
  $("spin")&&($("spin").onclick=spin);$("undo")&&($("undo").onclick=undo);$("fail")&&($("fail").onclick=markFail);$("reopen")&&($("reopen").onclick=reopen);
}

function renderTeam(){
  const pl=player();
  $("teamTitle").textContent=`Equipo de ${pl.name}`;
  $("team").innerHTML=pl.team.length?pl.team.map((t,i)=>`<div class="mon ${t.alive?"":"dead"}">${img(t.p,56,true)}<span class="mn"><span>${esc(nm(t.p))}</span><small>Nv. ${t.lv}</small></span><span class="mr">${esc(t.route?(zoneObj(t.route)||{es:t.route}).es:"Inicial / regalo")}${t.alive?"":" · debilitado"}</span><span class="mb"><button class="btn sm" data-k="${i}">${t.alive?"Murió":"Revivir"}</button><button class="btn sm" data-x="${i}" aria-label="Quitar a ${esc(nm(t.p))}">Quitar</button></span></div>`).join(""):`<p class="empty">Todavía no capturaste nada. Elige una ruta y tira la ruleta.</p>`;
  $("team").querySelectorAll("[data-k]").forEach(b=>b.onclick=()=>{const t=pl.team[+b.dataset.k];t.alive=!t.alive;save();renderTeam()});
  $("team").querySelectorAll("[data-x]").forEach(b=>b.onclick=()=>{const t=pl.team[+b.dataset.x];const r=pl.routes[t.route];if(r&&r.r==="caught"&&r.p===t.p)delete pl.routes[t.route];pl.team.splice(+b.dataset.x,1);ui.last=null;save();renderAll()});
  const d=$("danger");
  if(ui.confirmReset){d.innerHTML=`<div class="confirm">¿Borrar el equipo y las rutas de ${esc(pl.name)}?<button class="btn sm primary" id="yes">Sí, reiniciar</button><button class="btn sm" id="no">Cancelar</button></div>`;
    $("yes").onclick=()=>{pl.team=[];pl.routes={};ui.confirmReset=false;ui.last=null;save();renderAll()};
    $("no").onclick=()=>{ui.confirmReset=false;renderTeam()};
    $("delp")&&($("delp").onclick=()=>{state.players=state.players.filter(p=>p.id!==pl.id);state.cur=state.players[0].id;ui.confirmReset=false;save();renderAll()});
  }else{d.innerHTML=`<button class="btn sm" id="reset">Reiniciar partida…</button>`;$("reset").onclick=()=>{ui.confirmReset=true;renderTeam()}}
}

function renderAll(){if(!ui.spinning&&!(ui.last&&ui.last.zone===ui.zone))ui.frozen=null;$("weighted").checked=!!state.weighted;renderPlayers();renderRoutes();renderMap();renderZone();renderControls();renderTeam();drawWheel();pushSel()}
function pushSel(){
  if(!live||!live.room||!canEdit())return;
  const pl=player(),k=pl.id+"|"+ui.zone;if(live.sel===k)return;live.sel=k;
  live.room.set("sel",{player:pl.id,pn:pl.name,zone:ui.zone,zn:zoneObj(ui.zone).es}).catch(()=>{live.sel=""});
}

$("routeSearch").addEventListener("input",renderRoutes);
const ALL=[...new Set(ZONES.flatMap(z=>z.r.map(r=>r[0])))].sort();
$("allMons").innerHTML=ALL.map(p=>`<option value="${esc(nm(p))}"></option>`).join("");
const toId=n=>{const k=norm(n).replace(/♀/g,"f").replace(/♂/g,"m").replace(/[^a-z0-9]/g,"");return ALL.find(p=>p===k||norm(nm(p)).replace(/[^a-z0-9]/g,"")===k)||k};
$("pool").addEventListener("click",e=>{const b=e.target.closest("[data-pk]");if(!b)return;$("mName").value=nm(b.dataset.pk);$("mLv").value=b.dataset.lv;$("mMsg").textContent="";$("mName").focus()});
$("manual").addEventListener("submit",e=>{
  e.preventDefault();const pl=player(),raw=$("mName").value.trim(),msg=$("mMsg");
  if(!raw){msg.textContent="Escribe el nombre del Pokémon.";return}
  const id=toId(raw),lv=Math.min(100,Math.max(1,parseInt($("mLv").value,10)||1)),free=$("mNoRoute").checked;
  if(!free&&pl.routes[ui.zone]){msg.textContent="Esta ruta ya está usada. Reábrela o marca “No gasta la ruta”.";return}
  pl.team.push({p:id,route:free?"":ui.zone,lv,alive:true});
  if(!free)pl.routes[ui.zone]={r:"caught",p:id};
  msg.textContent="";$("mName").value="";$("mNoRoute").checked=false;ui.last=null;save();renderAll();
});
$("gSurf").addEventListener("change",e=>{const pl=player();pl.gear={...(pl.gear||{}),surf:e.target.checked};ui.method=null;ui.frozen=null;save();renderAll()});
$("gFish").addEventListener("change",e=>{const pl=player();pl.gear={...(pl.gear||{}),fish:e.target.checked};ui.method=null;ui.frozen=null;save();renderAll()});
$("weighted").addEventListener("change",e=>{state.weighted=e.target.checked;ui.frozen=null;save();renderZone();drawWheel()});
matchMedia("(prefers-color-scheme: dark)").addEventListener("change",drawWheel);
new MutationObserver(drawWheel).observe(document.documentElement,{attributes:true,attributeFilter:["data-theme"]});

const MON_RE=/^[a-z0-9][a-z0-9 =?!]{0,29}$/,PID_RE=/^p[a-z0-9]{1,24}$/;
const clampLv=v=>Math.min(100,Math.max(1,parseInt(v,10)||1));
function cleanPlayer(p,id){
  if(!p||typeof p!=="object"||p.id!==id||!PID_RE.test(String(id)))return null;
  const team=(Array.isArray(p.team)?p.team:[]).slice(0,300).filter(t=>t&&MON_RE.test(t.p)).map(t=>({p:t.p,route:typeof t.route==="string"&&zoneObj(t.route)?t.route:"",lv:clampLv(t.lv),alive:t.alive!==false}));
  const routes={};
  for(const [z,r] of Object.entries(p.routes&&typeof p.routes==="object"?p.routes:{})){
    if(!zoneObj(z)||!r)continue;
    if(r.r==="fail")routes[z]={r:"fail"};else if(r.r==="caught"&&MON_RE.test(r.p))routes[z]={r:"caught",p:r.p};
  }
  return{id,name:String(p.name||"").trim().slice(0,24)||"Jugador",team,routes,gear:{surf:!!(p.gear&&p.gear.surf),fish:!!(p.gear&&p.gear.fish)}};
}
function cleanState(s){
  if(!s||!Array.isArray(s.players))return null;
  const players=s.players.slice(0,40).map(p=>cleanPlayer(p,p&&p.id)).filter(Boolean);
  if(!players.length)return null;
  return{players,cur:players.some(p=>p.id===s.cur)?s.cur:players[0].id,weighted:!!s.weighted};
}

(function(){
  let s=ToolStore.load("nuzlocke",null);
  if(!s){try{s=JSON.parse(localStorage.getItem("nuzlocke-kanto")||"null")}catch(e){}}
  s=cleanState(s);if(s)state=s;
})();
renderAll();
$("sync").textContent=ToolStore.has("nuzlocke")?"Partida cargada":"Partida nueva";
$("exportBtn").onclick=()=>{save();ToolStore.exportFile("nuzlocke")};
$("importBtn").onclick=()=>$("importFile").click();
$("importFile").onchange=async e=>{
  const f=e.target.files[0];if(!f)return;
  if(!canEdit()){$("sync").textContent=VIEW_MSG;e.target.value="";return}
  const prev=state;
  try{const d=cleanState(await ToolStore.importFile("nuzlocke",f));if(!d)throw 0;state=d;ui.last=null;save();renderAll();$("sync").textContent="Partida importada"}
  catch(err){state=prev;ToolStore.save("nuzlocke",state);$("sync").textContent="Ese archivo no es una partida válida"}
  e.target.value="";
};


var live={room:null,remote:{},weighted:undefined,spinId:null,pending:null,online:true,open:false,busy:false,err:"",copied:"",user:null,editor:false,authBusy:false};
const LIVE_KEY="nuzlocke-sala",VIEW_MSG="Solo el dueño y los editores pueden cambiar la sala";

function canEdit(){return!live||!live.room||!!live.editor}

function syncMode(){document.body.classList.toggle("viewer",!canEdit())}

function remotePlayers(){
  return Object.entries(live.remote).map(([id,r])=>{try{return[r.order,cleanPlayer(JSON.parse(r.data),id)]}catch(e){return[0,null]}}).filter(x=>x[1]).sort((a,b)=>a[0]-b[0]).map(x=>x[1]);
}

function restoreRemote(){
  const next=remotePlayers();
  if(next.length){state.players=next;if(!state.players.some(p=>p.id===state.cur))state.cur=state.players[0].id}
  state.weighted=!!live.weighted;ui.last=null;ui.confirmReset=false;ui.confirmDel=false;ui.renaming=false;
  renderAll();
}

function denied(){$("sync").textContent="La sala rechazó el cambio. Inicia sesión con una cuenta que pueda editar."}

function pushLive(){
  if(!live.room||!canEdit())return;
  const seen=new Set();
  state.players.forEach((p,i)=>{
    seen.add(p.id);
    const v={order:i,data:JSON.stringify(p)},r=live.remote[p.id];
    if(!r||r.order!==i||r.data!==v.data){live.remote[p.id]=v;live.room.set("players/"+p.id,v).catch(()=>{if(live.remote[p.id]===v)delete live.remote[p.id];denied()})}
  });
  Object.keys(live.remote).forEach(id=>{if(!seen.has(id)){delete live.remote[id];live.room.remove("players/"+id).catch(denied)}});
  if(live.weighted!==!!state.weighted){live.weighted=!!state.weighted;live.room.set("settings/weighted",live.weighted).catch(()=>{live.weighted=undefined;denied()})}
}

function applyPlayers(v){
  const list=[],remote={};
  for(const [id,r] of Object.entries(v&&typeof v==="object"?v:{})){
    if(!r||typeof r.data!=="string")continue;
    try{const p=cleanPlayer(JSON.parse(r.data),id);if(p){remote[id]={order:+r.order||0,data:r.data};list.push([+r.order||0,p])}}catch(e){}
  }
  live.remote=remote;
  if(!list.length)return;
  const next=list.sort((a,b)=>a[0]-b[0]).map(x=>x[1]);
  if(JSON.stringify(next)===JSON.stringify(state.players))return;
  if(ui.spinning){live.pending=next;return}
  setPlayers(next);
}

function setPlayers(next){
  state.players=next;
  if(!state.players.some(p=>p.id===state.cur))state.cur=state.players[0].id;
  ToolStore.save("nuzlocke",state);
  renderAll();
}

function flushLive(){if(live.pending){const n=live.pending;live.pending=null;state.players=n;if(!state.players.some(p=>p.id===state.cur))state.cur=state.players[0].id;ToolStore.save("nuzlocke",state)}}

function broadcastSpin(sl,mid,p,lv){
  const dur=4200;
  if(!live.room)return dur;
  const z=zoneObj(ui.zone),pl=player();
  live.spinId=Date.now().toString(36)+Math.random().toString(36).slice(2,7);
  live.room.set("spin",{id:live.spinId,player:pl.id,pn:pl.name,zone:ui.zone,zn:z.es,m:curMethod()||"",slices:sl.map(s=>({p:s.c.p,start:s.start,end:s.end})),mid,dur,p,lv}).catch(denied);
  return dur;
}

function cleanSpin(v){
  if(!v||typeof v!=="object"||typeof v.id!=="string"||!Array.isArray(v.slices)||!zoneObj(v.zone)||!MON_RE.test(v.p))return null;
  const slices=v.slices.slice(0,80).filter(s=>s&&MON_RE.test(s.p)&&isFinite(s.start)&&isFinite(s.end)).map(s=>({p:s.p,start:+s.start,end:+s.end}));
  if(!slices.length||!isFinite(v.mid))return null;
  return{id:v.id.slice(0,40),player:String(v.player||""),zone:v.zone,m:METHODS.includes(v.m)?v.m:null,mid:+v.mid,dur:Math.min(10000,Math.max(100,+v.dur||4200)),p:v.p,lv:clampLv(v.lv),slices};
}

function onSpin(raw){
  const v=cleanSpin(raw);
  if(!v||v.id===live.spinId)return;
  live.spinId=v.id;
  if(ui.spinning)return;
  if(state.players.some(p=>p.id===v.player))state.cur=v.player;
  ui.zone=v.zone;ui.method=v.m||null;ui.last=null;
  ui.frozen=v.slices.map(s=>({c:{p:s.p},start:s.start,end:s.end}));
  renderAll();
  animate(v.mid,v.dur,()=>{ui.last={p:v.p,zone:v.zone,lv:v.lv};renderAll()});
}

async function joinRoom(name){
  live.busy=true;live.err="";renderLive();
  try{
    const room=await ToolSync.join(name,"nuzlocke");
    const [cur,sp,set]=await Promise.all([room.once("players"),room.once("spin"),room.once("settings")]);
    live.room=room;live.remote={};live.sel="";live.weighted=set&&typeof set.weighted==="boolean"?set.weighted:undefined;live.spinId=sp&&sp.id;
    const has=!!(cur&&typeof cur==="object"&&Object.keys(cur).length);
    if(has){
      ToolStore.save("nuzlocke-respaldo",state);
      if(typeof live.weighted==="boolean")state.weighted=live.weighted;
      applyPlayers(cur);
    }else if(canEdit())pushLive();
    room.on("players",applyPlayers);
    room.on("settings",v=>{if(v&&typeof v.weighted==="boolean"){live.weighted=v.weighted;if(v.weighted!==!!state.weighted){state.weighted=v.weighted;ui.frozen=null;ToolStore.save("nuzlocke",state);renderAll()}}});
    room.on("spin",onSpin);
    room.connected(c=>{live.online=c;renderLive()});
    try{localStorage.setItem(LIVE_KEY,room.name)}catch(e){}
    const u=new URL(location.href);u.searchParams.set("sala",room.name);history.replaceState(null,"",u);
    live.open=false;
    $("sync").textContent=canEdit()?"Conectado a la sala":has?"Mirando la sala":"Sala vacía, espera a que el dueño la abra";
  }catch(e){live.err=e&&e.message?e.message:"No se pudo conectar. Vuelve a intentar."}
  live.busy=false;syncMode();renderLive();renderAll();
}

function leaveRoom(){
  if(live.room)live.room.leave();
  live.room=null;live.remote={};live.pending=null;
  const u=new URL(location.href);u.searchParams.delete("sala");history.replaceState(null,"",u);
  $("sync").textContent="Fuera de la sala, la partida sigue en este navegador";
  syncMode();renderLive();renderAll();
  window.Gate&&Gate.check();
}

async function copyLink(kind){
  const ov=kind.startsWith("ov"),u=new URL(ov?"overlay.html":"./",location.href);
  u.search="";u.searchParams.set("sala",live.room.name);
  if(kind==="ovRuleta")u.searchParams.set("vista","ruleta");else if(kind==="ovMapa")u.searchParams.set("vista","mapa");else if(ov){u.searchParams.set("vista","equipo");if(kind==="ovTodos")u.searchParams.set("ultimos","todos")}
  try{await navigator.clipboard.writeText(u.href);live.copied=kind}catch(e){prompt("Copia este link:",u.href)}
  renderLive();
  setTimeout(()=>{live.copied="";renderLive()},1800);
}

async function signIn(){
  live.authBusy=true;live.err="";renderLive();
  try{await ToolSync.signIn()}
  catch(e){const c=e&&e.code||"";live.err=c==="auth/popup-blocked"?"El navegador bloqueó la ventana. Permite ventanas emergentes y vuelve a intentar.":c==="auth/popup-closed-by-user"||c==="auth/cancelled-popup-request"?"":"No se pudo iniciar sesión. Vuelve a intentar."}
  live.authBusy=false;renderLive();
}

function renderLive(){
  const el=$("live");
  if(!ToolSync.ready()){el.hidden=true;return}
  el.hidden=false;
  let last="";try{last=localStorage.getItem(LIVE_KEY)||""}catch(e){}
  const owner=!!live.editor;
  const acct=live.user?`<button class="btn sm" type="button" id="lvOut" title="${esc(live.user.name)}">Cerrar sesión</button>`:`<button class="btn sm" type="button" id="lvIn" ${live.authBusy?"disabled":""}>${live.authBusy?"Abriendo…":"Iniciar sesión"}</button>`;
  const err=live.err?`<p class="err" role="alert">${esc(live.err)}</p>`:"";
  const warn=live.user&&!owner?`<p class="err" role="status">Esta cuenta no puede editar salas: solo puedes mirar.</p>`:"";
  if(live.room){
    el.innerHTML=`<span class="onair ${live.online?"":"off"}"><i></i>${live.online?"En vivo":"Reconectando"} · ${esc(live.room.name)}${owner?"":" · solo mirar"}</span>${owner?`<button class="btn sm" type="button" id="lvInvite">${live.copied==="invite"?"Link copiado":"Copiar invitación"}</button><details class="ovmenu"><summary class="btn sm">${live.copied.startsWith("ov")?"Link copiado":"Overlay"}</summary><div class="ovlist">${[["ovRuleta","Ruleta"],["ovMapa","Mapa"],["ovEquipo","Últimos 3"],["ovTodos","Todos"]].map(([k,l])=>`<button class="btn sm" type="button" data-ov="${k}">${l}</button>`).join("")}</div></details>`:""}<button class="btn sm" type="button" id="lvLeave">Salir</button>${acct}${warn}${err}`;
    $("lvInvite")&&($("lvInvite").onclick=()=>copyLink("invite"));el.querySelectorAll("[data-ov]").forEach(x=>x.onclick=()=>copyLink(x.dataset.ov));const om=el.querySelector(".ovmenu");om&&om.addEventListener("keydown",e=>{if(e.key==="Escape"){om.open=false;om.querySelector("summary").focus()}});$("lvLeave").onclick=leaveRoom;
  }else if(live.open||live.busy){
    el.innerHTML=`<form id="lvForm"><input type="text" id="lvName" name="sala" maxlength="32" placeholder="Nombre de la sala…" aria-label="Nombre de la sala" value="${esc(last)}" autocomplete="off" spellcheck="false" ${live.busy?"disabled":""}><button class="btn sm primary" type="submit" ${live.busy?"disabled":""}>${live.busy?"Conectando…":owner?"Abrir sala":"Mirar sala"}</button><button class="btn sm" type="button" id="lvNo" ${live.busy?"disabled":""}>Cancelar</button></form>${acct}${warn}${err}`;
    $("lvForm").onsubmit=e=>{e.preventDefault();const n=ToolSync.clean($("lvName").value);if(!n){live.err="Usa letras, números o guiones.";renderLive();return}joinRoom(n)};
    $("lvNo").onclick=()=>{live.open=false;live.err="";renderLive()};
    if(!live.busy&&matchMedia("(pointer:fine)").matches)$("lvName").focus();
  }else{
    el.innerHTML=`<button class="btn sm" type="button" id="lvOpen">Sala en vivo</button>${err}`;
    $("lvOpen").onclick=()=>{live.open=true;live.err="";renderLive()};
  }
  $("lvIn")&&($("lvIn").onclick=signIn);
  $("lvOut")&&($("lvOut").onclick=()=>ToolSync.signOut());
}

renderLive();
$("captchaNote").hidden=!(ToolSync.ready()&&(window.FIREBASE_CONFIG||{}).appCheckKey);
if(ToolSync.ready()){
  let ur=0;
  ToolSync.onUser(async u=>{
    const n=++ur,ed=await ToolSync.canEditRooms(u,"nuzlocke");if(n!==ur)return;
    const was=canEdit();live.user=u;live.editor=ed;syncMode();renderLive();
    if(live.room&&!was&&canEdit()){$("sync").textContent="Conectado a la sala";if(Object.keys(live.remote).length)restoreRemote();else pushLive()}
    if(live.room&&was&&!canEdit())restoreRemote();
  }).catch(()=>{});
  const s=new URLSearchParams(location.search).get("sala");
  if(s)joinRoom(s);
}
document.addEventListener("click",e=>{const om=document.querySelector(".ovmenu[open]");if(om&&!om.contains(e.target))om.open=false});
