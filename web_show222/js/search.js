
var database_length=0;
var amorphous="";

function Page(time,name,address,content) { 
	var array = new Array();
	while ((time.length > 0) && (time.charAt(0) == " ")) { 
		time = time.substring(1,time.length); 
	} 
	array[0] = time; 
	while ((name.length > 0) && (name.charAt(0) == " ")) { 
		name = name.substring(1,name.length); 
	} 
	array[1] = name; 
	array[2] = address; 
	array[3] = content; 
	return array; 
} 

function Database() {   
	var arr = new Array();
	var pos = 0; 
	while ((pos1 = amorphous.indexOf("~",pos)) != -1) { 
		pos2 = amorphous.indexOf("|",pos1+1);      //或
		pos3 = amorphous.indexOf("^",pos2+1);     //匹配字符串的开始  this[database_length++]
		pos4 = amorphous.indexOf("*",pos3+1);     //重复零次或更多次
		if ((pos2 != -1) && (pos2 < pos3) && (pos3 < pos4) && (pos4 <= amorphous.indexOf("*",pos))) { 
			//alert(amorphous.substring(pos,pos1)+" "+amorphous.substring(pos1+1,pos2)+" "+amorphous.substring(pos2+1,pos3)+" "+amorphous.substring(pos3+1,pos4));
			
			arr[database_length++] = new Page(amorphous.substring(pos,pos1),
			amorphous.substring(pos1+1,pos2), 
			amorphous.substring(pos2+1,pos3), 
			amorphous.substring(pos3+1,pos4)); 
			pos = pos4+1; 
		} else { // error reading amorphous database 
			if (pos+30 <= amorphous.length) 
			alert('Error reading in amorphous database around "'+ amorphous.substring(pos,pos+30) + '"'); 
			pos = amorphous.indexOf("*",pos) + 1; 
		} 
	} 
	return arr; 
} 

function searchKeywords(keywords,database){ 
	
	var temp = new Array();
	var temp_length = 0; 
	
	for(var i=0;i<database.length;i++){
		var tempItemString="";
		for(var j=0;j<database[i].length;j++){
			tempItemString += database[i][j]+" ";
		}
		if(tempItemString.toLowerCase().indexOf(keywords.toLowerCase()) != -1){
			for(var j=0;j<database[i].length;j++){
				temp[temp_length] = database[i][j];
				temp_length++;
			} 
		} 
		
	}
	return temp;
} 


function redWord(str) { 

	for(r=0; r<words_length; r++) { 
		pos = -3; 
		word = words[r].toLowerCase(); 
		while ((pos = str.toLowerCase().indexOf(word,pos+3)) != -1) { 
			val = pos+word.length; 
			str = str.substring(0,pos) + "*" + str.substring(pos,val) + "|" + str.substring(val,str.length); 
		} 
	} 
	pos = -16; 
	while ((pos = str.toLowerCase().indexOf("*",pos+16)) != -1) 
	str = str.substring(0,pos) + "<font color=red>" + str.substring(pos+1,str.length); 
	pos = -7; 
	while ((pos = str.toLowerCase().indexOf("|",pos+7)) != -1) 
	str = str.substring(0,pos) + "</font>" + str.substring(pos+1,str.length); 
	return str; 
} 

function searchAllString(keywords){
	var aa =jiyu.array;
	for(var i = 0;i < aa.length;i++)
	{
		amorphous += aa[i].time+"~"+aa[i].content+"|"+aa[i].name+"^"+aa[i].address+"*";
	}
	var temp_str = amorphous.substring(amorphous.length-2,amorphous.length); //取到该字符串最后两个字符
	if (temp_str.indexOf("*") == -1){     //如果该字符串中从未出现过*
		amorphous += "* ";             //那么在该字符串拼装*
	}
	else {
		amorphous += " "; // amorphous database must have characters after last asterisk 
	}
	var database = new Database(); // read in from amorphous database 
	var result = searchKeywords(keywords,database);
	
	if (result.length == 0) {
		result[0] = '对不起:你查询的关键字“'+keywords+'"没有发现!'; 
	}
	return result;
}














