
var baseUrl = 'https://rest.ehrscape.com/rest/v1';
var queryUrl = baseUrl + '/query';

var username = "ois.seminar";
var password = "ois4fri";


/**
 * Prijava v sistem z privzetim uporabnikom za predmet OIS in pridobitev
 * enolične ID številke za dostop do funkcionalnosti
 * @return enolični identifikator seje za dostop do funkcionalnosti
 */
function getSessionId() {
    var response = $.ajax({
        type: "POST",
        url: baseUrl + "/session?username=" + encodeURIComponent(username) +
                "&password=" + encodeURIComponent(password),
        async: false
    });
    return response.responseJSON.sessionId;
}

//ko pristisneš na gumb "preberi meritve teže" se napolnijo datumi
function gumbTezaEhr(){
    sessionId = getSessionId();
    $("#preberiMeritveTezeSporocilo").html("");
    var ehrId = $("#casMeritveEhr").val();
    document.getElementById("preberiCasMeritve").innerHTML = "";
    if (!ehrId || ehrId.trim().length == 0) {
		$("#preberiMeritveTezeSporocilo").html("<span class='obvestilo " +
      "label label-warning fade-in'>Prosim vnesite zahtevan podatek!");
	} else {
		$.ajax({
			url: baseUrl + "/demographics/ehr/" + ehrId + "/party",
	    	type: 'GET',
	    	headers: {"Ehr-Session": sessionId},
	    	success: function (data) {
				var party = data.party;
				$.ajax({
					    url: baseUrl + "/view/" + ehrId + "/" + "weight",
					    type: 'GET',
					    headers: {"Ehr-Session": sessionId},
					    success: function (res) {
					    	//izberi datum in prikaži ostale podatke
					    	if (res.length > 0) {
						 
						        for (var i in res) {
					             //   $("#tezaCas").html("<span>" +res[i].weight+"</span>");
                                    $("#preberiCasMeritve").append('<option value="'+res[i].time+'">'+res[i].time+'</option>');
						        }
						        
					    	} else {
					    		$("#preberiMeritveTezeSporocilo").html(
                    "<span class='obvestilo label label-warning fade-in'>" +
                    "Ni podatkov!</span>");
					    	}
					    },
					    error: function() {
					    	$("#preberiMeritveVitalnihZnakovSporocilo").html(
                  "<span class='obvestilo label label-danger fade-in'>Napaka '" +
                  JSON.parse(err.responseText).userMessage + "'!");
					    }
					});
	    	},
	    	error: function(err) {
	    		$("#preberiMeritveVitalnihZnakovSporocilo").html(
            "<span class='obvestilo label label-danger fade-in'>Napaka '" +
            JSON.parse(err.responseText).userMessage + "'!");
	    	}
		});
    }
}

function preberiEHRodBolnika() {
	sessionId = getSessionId();

	var ehrId = $("#preberiEHRid").val();

	if (!ehrId || ehrId.trim().length == 0) {
		$("#preberiSporocilo").html("<span class='obvestilo label label-warning " +
      "fade-in'>Prosim vnesite zahtevan podatek!");
	} else {
		$.ajax({
			url: baseUrl + "/demographics/ehr/" + ehrId + "/party",
			type: 'GET',
			headers: {"Ehr-Session": sessionId},
	    	success: function (data) {
	    		var party = data.party;
	    		$('#kreirajIme').val(party.firstNames);
	    		$('#kreirajPriimek').val(party.lastNames);
	    		$('#kreirajDatumRojstva').val(party.dateOfBirth);
				var party = data.party;
				
			},
			error: function(err) {
				$("#preberiSporocilo").html("<span class='obvestilo label " +
          "label-danger fade-in'>Napaka '" +
          JSON.parse(err.responseText).userMessage + "'!");
			}
		});
	}
}


var visina;
//izračunaj BMI in dodaj zunanji link
function izracunajBMI() {
	sessionId = getSessionId();
    $("#BMISporocilo").html("");
	var ehrId = $("#meritveBMIEHRid").val();
	//$("#rezultatBMI").html("<br/><span>"+ehrId+"</span><br/><br/>");
	if (!ehrId || ehrId.trim().length == 0) {
		$("#BMISporocilo").html("<span class='obvestilo " +
      "label label-warning fade-in'>Prosim vnesite zahtevan podatek!");
	} else {
		$.ajax({
			url: baseUrl + "/demographics/ehr/" + ehrId + "/party",
	    	type: 'GET',
	    	headers: {"Ehr-Session": sessionId},
	    	success: function (data) {
				var party = data.party;
				

					$.ajax({
  					    url: baseUrl + "/view/" + ehrId + "/" + "height",
					    type: 'GET',
					    headers: {"Ehr-Session": sessionId},
					    success: function (res) {
					    	if (res.length > 0) {
					    	
						    	visina = res[0].height;
					    	} else {
					    		$("#BMISporocilo").html(
                    "<span class='obvestilo label label-warning fade-in'>" +
                    "Ni podatkov!</span>");
					    	}
					    },
					    error: function() {
					    	$("#BMISporocilo").html(
                  "<span class='obvestilo label label-danger fade-in'>Napaka '" +
                  JSON.parse(err.responseText).userMessage + "'!");
					    }
					});
				
	    	},
	    	error: function(err) {
	    		$("#BMISporocilo").html(
            "<span class='obvestilo label label-danger fade-in'>Napaka '" +
            JSON.parse(err.responseText).userMessage + "'!");
	    	}
		});
		$.ajax({
			url: baseUrl + "/demographics/ehr/" + ehrId + "/party",
	    	type: 'GET',
	    	headers: {"Ehr-Session": sessionId},
	    	success: function (data) {
				var party = data.party;
				

					$.ajax({
  					    url: baseUrl + "/view/" + ehrId + "/" + "weight",
					    type: 'GET',
					    headers: {"Ehr-Session": sessionId},
					    success: function (res) {
					    	if (res.length > 0) {
					    		var bmi = res[0].weight/(visina*0.01*visina*0.01);
					    		bmi = Math.round(bmi*100)/100;
					    		if(bmi>18.5 && bmi<25){
						    		$('#rezultatBMI').html('<br/><span><b>Vaš BMI je </b>'+bmi+'</span><br/><br/><br/><span>Vaš BMI je <b>normalen.</b></span><br/><span>Primer kosila, s katerim boste vzdrževali vašo telesno maso.</span><br/><br/><a href="http://okusno.je/recept/tunine-polpete"><img src="61475879.jpg" style="max-width:100%; max-height:100%; margin-top:10px;"></img></a>');
					    		}
					    		else if(bmi < 18.5){
					    				$('#rezultatBMI').html('<br/><span><b>Vaš BMI je </b>'+bmi+'</span><br/><br/><br/><span>Vaš BMI je <b>prenizek!</b></span><br/><span>Primer kosila, s katerim boste povečali vašo telesno maso.</span><br/><br/><a href="http://okusno.je/recept/rizota-z-gobami"><img src="61649198.jpg" style="max-width:100%; max-height:100%; margin-top:10px;"></img></a>');
					    		}
					    		else if(bmi > 25){
					    				$('#rezultatBMI').html('<br/><span><b>Vaš BMI je </b>'+bmi+'</span><br/><br/><br/><span>Vaš BMI je <b>previsok!</b></span><br/><span>Primer kosila, s katerim boste znižali vašo telesno maso.</span><br/><br/><a href="http://okusno.je/recept/solata-s-prekajenim-lososom"><img src="60686036.jpg" style="max-width:100%; max-height:100%; margin-top:10px;"></img></a>');
					    		}
					    			
					    		} else {
					    		$("#BMISporocilo").html(
                    "<span class='obvestilo label label-warning fade-in'>" +
                    "Ni podatkov!</span>");
					    	}
					    },
					    error: function() {
					    	$("#BMISporocilo").html(
                  "<span class='obvestilo label label-danger fade-in'>Napaka '" +
                  JSON.parse(err.responseText).userMessage + "'!");
					    }
					});
				
	    	},
	    	error: function(err) {
	    		$("#BMISporocilo").html(
            "<span class='obvestilo label label-danger fade-in'>Napaka '" +
            JSON.parse(err.responseText).userMessage + "'!");
	    	}
		});
	}
}
/*
function izracunajBMI(){

	sessionId = getSessionId();
    $("#BMISporocilo").html("");
	var ehrId = $("#meritveBMIEHRid").val();

	if (!ehrId || ehrId.trim().length == 0 || !tip || tip.trim().length == 0) {
		$("#BMISporocilo").html("<span class='obvestilo " +
      "label label-warning fade-in'>Prosim vnesite zahtevan podatek!");
	} else {
		$.ajax({
			url: baseUrl + "/demographics/ehr/" + ehrId + "/party",
	    	type: 'GET',
	    	headers: {"Ehr-Session": sessionId},
	    	success: function (data) {
				var party = data.party;
					$.ajax({
					    url: baseUrl + "/view/" + ehrId + "/" + "weight",
					    type: 'GET',
					    headers: {"Ehr-Session": sessionId},
					    success: function (res) {
					    	if (res.length > 0) {
						    	var zadnjaTeza = res[0].weight;
						        $('#rezultatBMI').html("<br/><span>Vaša teža je "+zadnjaTeza+"kg</span><br/><br/>");
						        $("#BMISporocilo").html("<span class='obvestilo label label-warning fade-in'>" +"Uspešno!</span>");
					    	} else {
					    		$("#BMISporocilo").html(
                    "<span class='obvestilo label label-warning fade-in'>" +
                    "Ni podatkov!</span>");
					    	}
					    },
					    error: function() {
					    	$("#BMISporocilo").html(
                  "<span class='obvestilo label label-danger fade-in'>Napaka '" +
                  JSON.parse(err.responseText).userMessage + "'!");
					    }
					});
				
	    	},
	    	error: function(err) {
	    		$("#BMISporocilo").html(
            "<span class='obvestilo label label-danger fade-in'>Napaka '" +
            JSON.parse(err.responseText).userMessage + "'!");
	    	}
		});
	}
}*/


//"izpiši za ta datum" prikaže podatke za ta datum
function izpisiGledeNaCas(){
    sessionId = getSessionId();
    $("#preberiMeritveTezeSporocilo").html("");
    var ehrId = $("#casMeritveEhr").val();
    
    if (!ehrId || ehrId.trim().length == 0) {
		$("#preberiMeritveTezeSporocilo").html("<span class='obvestilo " +
      "label label-warning fade-in'>Prosim vnesite zahtevan podatek!");
	} else {
		$.ajax({
			url: baseUrl + "/demographics/ehr/" + ehrId + "/party",
	    	type: 'GET',
	    	headers: {"Ehr-Session": sessionId},
	    	success: function (data) {
				var party = data.party;
				$.ajax({
					    url: baseUrl + "/view/" + ehrId + "/" + "weight",
					    type: 'GET',
					    headers: {"Ehr-Session": sessionId},
					    success: function (res) {
					    	//izberi datum in prikaži ostale podatke
					    	if (res.length > 0) {
						 
						        for (var i in res) {
					             //   $("#tezaCas").html("<span>" +res[i].weight+"</span>");
                                    if(res[i].time == $('#preberiCasMeritve').val()){
                                        $("#tezaCas").html("<span>" +res[i].weight+"</span>");
                                    }
						        }
						        
					    	} else {
					    		$("#preberiMeritveTezeSporocilo").html(
                    "<span class='obvestilo label label-warning fade-in'>" +
                    "Ni podatkov!</span>");
					    	}
					    },
					    error: function() {
					    	$("#preberiMeritveVitalnihZnakovSporocilo").html(
                  "<span class='obvestilo label label-danger fade-in'>Napaka '" +
                  JSON.parse(err.responseText).userMessage + "'!");
					    }
					});
	    	},
	    	error: function(err) {
	    		$("#preberiMeritveVitalnihZnakovSporocilo").html(
            "<span class='obvestilo label label-danger fade-in'>Napaka '" +
            JSON.parse(err.responseText).userMessage + "'!");
	    	}
		});
		$.ajax({
			url: baseUrl + "/demographics/ehr/" + ehrId + "/party",
	    	type: 'GET',
	    	headers: {"Ehr-Session": sessionId},
	    	success: function (data) {
				var party = data.party;
				$.ajax({
					    url: baseUrl + "/view/" + ehrId + "/" + "height",
					    type: 'GET',
					    headers: {"Ehr-Session": sessionId},
					    success: function (res) {
					    	//izberi datum in prikaži ostale podatke
					    	if (res.length > 0) {
						 
						        for (var i in res) {
					             //   $("#tezaCas").html("<span>" +res[i].weight+"</span>");
                                    if(res[i].time == $('#preberiCasMeritve').val()){
                                        $("#visinaCas").html("<span>" +res[i].height+"</span>");
                                    }
						        }
						        
					    	} else {
					    		$("#preberiMeritveTezeSporocilo").html(
                    "<span class='obvestilo label label-warning fade-in'>" +
                    "Ni podatkov!</span>");
					    	}
					    },
					    error: function() {
					    	$("#preberiMeritveVitalnihZnakovSporocilo").html(
                  "<span class='obvestilo label label-danger fade-in'>Napaka '" +
                  JSON.parse(err.responseText).userMessage + "'!");
					    }
					});
	    	},
	    	error: function(err) {
	    		$("#preberiMeritveVitalnihZnakovSporocilo").html(
            "<span class='obvestilo label label-danger fade-in'>Napaka '" +
            JSON.parse(err.responseText).userMessage + "'!");
	    	}
		});
		$.ajax({
			url: baseUrl + "/demographics/ehr/" + ehrId + "/party",
	    	type: 'GET',
	    	headers: {"Ehr-Session": sessionId},
	    	success: function (data) {
				var party = data.party;
				$.ajax({
					    url: baseUrl + "/view/" + ehrId + "/" + "blood_pressure",
					    type: 'GET',
					    headers: {"Ehr-Session": sessionId},
					    success: function (res) {
					    	//izberi datum in prikaži ostale podatke
					    	if (res.length > 0) {
						 
						        for (var i in res) {
					             //   $("#tezaCas").html("<span>" +res[i].weight+"</span>");
                                    if(res[i].time == $('#preberiCasMeritve').val()){
                                        $("#sistolicniCas").html("<span>" +res[i].systolic+"</span>");
                                        var procent = res[i].systolic/210*100;
                                        $("#sistolicniGraf").css("width", procent + "%");
                                        if(res[i].systolic <= 90){
                                             $("#sistolicniGraf").attr("class", "progress-bar progress-bar-success");
                                        }
                                        else if(res[i].systolic <= 130){
                                             $("#sistolicniGraf").attr("class", "progress-bar progress-bar-warning");
                                        }
                                        else if(res[i].systolic > 130){
                                             $("#sistolicniGraf").attr("class", "progress-bar progress-bar-danger");
                                        }
                                    }
						        }
						        
					    	} else {
					    		$("#preberiMeritveTezeSporocilo").html(
                    "<span class='obvestilo label label-warning fade-in'>" +
                    "Ni podatkov!</span>");
					    	}
					    },
					    error: function() {
					    	$("#preberiMeritveVitalnihZnakovSporocilo").html(
                  "<span class='obvestilo label label-danger fade-in'>Napaka '" +
                  JSON.parse(err.responseText).userMessage + "'!");
					    }
					});
	    	},
	    	error: function(err) {
	    		$("#preberiMeritveVitalnihZnakovSporocilo").html(
            "<span class='obvestilo label label-danger fade-in'>Napaka '" +
            JSON.parse(err.responseText).userMessage + "'!");
	    	}
		});
		$.ajax({
			url: baseUrl + "/demographics/ehr/" + ehrId + "/party",
	    	type: 'GET',
	    	headers: {"Ehr-Session": sessionId},
	    	success: function (data) {
				var party = data.party;
				$.ajax({
					    url: baseUrl + "/view/" + ehrId + "/" + "blood_pressure",
					    type: 'GET',
					    headers: {"Ehr-Session": sessionId},
					    success: function (res) {
					    	//izberi datum in prikaži ostale podatke
					    	if (res.length > 0) {
						 
						        for (var i in res) {
					             //   $("#tezaCas").html("<span>" +res[i].weight+"</span>");
                                    if(res[i].time == $('#preberiCasMeritve').val()){
                                        $("#diastolicniCas").html("<span>" +res[i].diastolic+"</span>");
                                        var procent = res[i].diastolic/210*100;
                                        $("#diastolicniGraf").css("width", procent + "%");
                                        if(res[i].diastolic <= 60){
                                             $("#diastolicniGraf").attr("class", "progress-bar progress-bar-success");
                                        }
                                        else if(res[i].diastolic <= 85){
                                             $("#diastolicniGraf").attr("class", "progress-bar progress-bar-warning");
                                        }
                                        else if(res[i].systolic > 85){
                                             $("#diastolicniGraf").attr("class", "progress-bar progress-bar-danger");
                                        }
                                    }
						        }
						        
					    	} else {
					    		$("#preberiMeritveTezeSporocilo").html(
                    "<span class='obvestilo label label-warning fade-in'>" +
                    "Ni podatkov!</span>");
					    	}
					    },
					    error: function() {
					    	$("#preberiMeritveVitalnihZnakovSporocilo").html(
                  "<span class='obvestilo label label-danger fade-in'>Napaka '" +
                  JSON.parse(err.responseText).userMessage + "'!");
					    }
					});
	    	},
	    	error: function(err) {
	    		$("#preberiMeritveVitalnihZnakovSporocilo").html(
            "<span class='obvestilo label label-danger fade-in'>Napaka '" +
            JSON.parse(err.responseText).userMessage + "'!");
	    	}
		});
    }
}

function prikaziGrafe(){
	
	
	
	sessionId = getSessionId();
    $("#grafSporocilo").html("");
	var ehrId = $('#preberiEHRid').val();

		if (!ehrId || ehrId.trim().length == 0) {
		$("#grafSporocilo").html("<span class='obvestilo " +
      "label label-warning fade-in'>Prosim vnesite zahtevan podatek!");
	} else {
		$.ajax({
			url: baseUrl + "/demographics/ehr/" + ehrId + "/party",
	    	type: 'GET',
	    	headers: {"Ehr-Session": sessionId},
	    	success: function (data) {
				var party = data.party;

					$.ajax({
  					    url: baseUrl + "/view/" + ehrId + "/" + "weight",
					    type: 'GET',
					    headers: {"Ehr-Session": sessionId},
					    success: function (res) {
					    	if (res.length > 0) {
								//var tabelaTez =['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun','Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
						        var tabelaTez=[];
						        var tabelaCasov=[];
						        var tabelaCasov2=[];
						        for (var i in res) {
						        	tabelaTez[i]=res[i].weight;
						        	tabelaCasov[i]=res[i].time.substring(0,10);
						        	
						        }
						      
						        $(function () {
							    $('#graff').highcharts({
							        title: {
							            text: 'teza',
							            x: -20 //center
							        },
							        subtitle: {
							            text: 'cas',
							            x: -20
							        },
							        xAxis: {
							            categories: tabelaCasov
							        },
							        yAxis: {
							            title: {
							                text: 'Teza(kg)'
							            },
							            plotLines: [{
							                value: 0,
							                width: 1,
							                color: '#808080'
							            }]
							        },
							        tooltip: {
							            valueSuffix: 'kg'
							        },
							        legend: {
							            layout: 'vertical',
							            align: 'right',
							            verticalAlign: 'middle',
							            borderWidth: 0
							        },
							        series: [{
							           
							            name: 'teza',
							            data: tabelaTez
							      
							        }]
							    });
							});
								
					    	} else {
					    		$("#grafSporocilo").html(
                    "<span class='obvestilo label label-warning fade-in'>" +
                    "Ni podatkov!</span>");
					    	}
					    },
					    error: function() {
					    	$("#grafSporocilo").html(
                  "<span class='obvestilo label label-danger fade-in'>Napaka '" +
                  JSON.parse(err.responseText).userMessage + "'!");
					    }
					});
			
	    	},
	    	error: function(err) {
	    		$("#grafSporocilo").html(
            "<span class='obvestilo label label-danger fade-in'>Napaka '" +
            JSON.parse(err.responseText).userMessage + "'!");
	    	}
		});
	}
}

//prebere temperaturo ali težo za določen EHR

function preberiMeritveVitalnihZnakov() {
	sessionId = getSessionId();
    $("#preberiMeritveVitalnihZnakovSporocilo").html("");
	var ehrId = $("#meritveVitalnihZnakovEHRid").val();
	var tip = $("#preberiTipZaVitalneZnake").val();

	if (!ehrId || ehrId.trim().length == 0 || !tip || tip.trim().length == 0) {
		$("#preberiMeritveVitalnihZnakovSporocilo").html("<span class='obvestilo " +
      "label label-warning fade-in'>Prosim vnesite zahtevan podatek!");
	} else {
		$.ajax({
			url: baseUrl + "/demographics/ehr/" + ehrId + "/party",
	    	type: 'GET',
	    	headers: {"Ehr-Session": sessionId},
	    	success: function (data) {
				var party = data.party;
				$("#rezultatMeritveVitalnihZnakov").html("<br/><span>Pridobivanje " +
          "podatkov za <b>'" + tip + "'</b> bolnika <b>'" + party.firstNames +
          " " + party.lastNames + "'</b>.</span><br/><br/>");
          
                document.getElementById("preberiCasMeritve").innerHTML = "";
               // $("#preberiCasMeritve").append('<option value="'+" "+'">'+" "+'</option>');
                
				if (tip == "telesna temperatura") {
					$.ajax({
  					    url: baseUrl + "/view/" + ehrId + "/" + "body_temperature",
					    type: 'GET',
					    headers: {"Ehr-Session": sessionId},
					    success: function (res) {
					    	if (res.length > 0) {
						    	var results = "<table class='table table-striped " +
                    "table-hover'><tr><th>Datum in ura</th>" +
                    "<th class='text-right'>Telesna temperatura</th></tr>";
						        for (var i in res) {
						            results += "<tr><td>" + res[i].time +
                          "</td><td class='text-right'>" + res[i].temperature +
                          " " + res[i].unit + "</td>";
                                     //$("#preberiCasMeritve").append('<option value="'+res[i].time+'">'+res[i].time+'</option>');
						        }
						        results += "</table>";
						        $("#rezultatMeritveVitalnihZnakov").append(results);
					    	} else {
					    		$("#preberiMeritveVitalnihZnakovSporocilo").html(
                    "<span class='obvestilo label label-warning fade-in'>" +
                    "Ni podatkov!</span>");
					    	}
					    },
					    error: function() {
					    	$("#preberiMeritveVitalnihZnakovSporocilo").html(
                  "<span class='obvestilo label label-danger fade-in'>Napaka '" +
                  JSON.parse(err.responseText).userMessage + "'!");
					    }
					});
				} else if (tip == "telesna teža") {
					$.ajax({
					    url: baseUrl + "/view/" + ehrId + "/" + "weight",
					    type: 'GET',
					    headers: {"Ehr-Session": sessionId},
					    success: function (res) {
					    	if (res.length > 0) {
						    	var results = "<table class='table table-striped " +
                    "table-hover'><tr><th>Datum in ura</th>" +
                    "<th class='text-right'>Telesna teža</th></tr>";
						        for (var i in res) {
						            results += "<tr><td>" + res[i].time +
                          "</td><td class='text-right'>" + res[i].weight + " " 	+
                          res[i].unit + "</td>";
                                    //$("#preberiCasMeritve").append('<option value="'+res[i].time+'">'+res[i].time+'</option>');
						        }
						        results += "</table>";
						        $("#rezultatMeritveVitalnihZnakov").append(results);
						        
					    	} else {
					    		$("#preberiMeritveVitalnihZnakovSporocilo").html(
                    "<span class='obvestilo label label-warning fade-in'>" +
                    "Ni podatkov!</span>");
					    	}
					    },
					    error: function() {
					    	$("#preberiMeritveVitalnihZnakovSporocilo").html(
                  "<span class='obvestilo label label-danger fade-in'>Napaka '" +
                  JSON.parse(err.responseText).userMessage + "'!");
					    }
					});
				}
	    	},
	    	error: function(err) {
	    		$("#preberiMeritveVitalnihZnakovSporocilo").html(
            "<span class='obvestilo label label-danger fade-in'>Napaka '" +
            JSON.parse(err.responseText).userMessage + "'!");
	    	}
		});
	}
}

//dodajanje dodatnih vitalnih znakov
function dodajMeritveVitalnihZnakov() {
	sessionId = getSessionId();

	var ehrId = $("#dodajVitalnoEHR").val();
	var datumInUra = $("#dodajVitalnoDatumInUra").val();
	var telesnaVisina = $("#dodajVitalnoTelesnaVisina").val();
	var telesnaTeza = $("#dodajVitalnoTelesnaTeza").val();
	var telesnaTemperatura = $("#dodajVitalnoTelesnaTemperatura").val();
	var sistolicniKrvniTlak = $("#dodajVitalnoKrvniTlakSistolicni").val();
	var diastolicniKrvniTlak = $("#dodajVitalnoKrvniTlakDiastolicni").val();


	if (!ehrId || ehrId.trim().length == 0) {
		$("#dodajMeritveVitalnihZnakovSporocilo").html("<span class='obvestilo " +
      "label label-warning fade-in'>Prosim vnesite zahtevane podatke!</span>");
	} else {
		$.ajaxSetup({
		    headers: {"Ehr-Session": sessionId}
		});
		var podatki = {
			// Struktura predloge je na voljo na naslednjem spletnem naslovu:
      // https://rest.ehrscape.com/rest/v1/template/Vital%20Signs/example
		    "ctx/language": "en",
		    "ctx/territory": "SI",
		    "ctx/time": datumInUra,
		    "vital_signs/height_length/any_event/body_height_length": telesnaVisina,
		    "vital_signs/body_weight/any_event/body_weight": telesnaTeza,
		   	"vital_signs/body_temperature/any_event/temperature|magnitude": telesnaTemperatura,
		    "vital_signs/body_temperature/any_event/temperature|unit": "°C",
		    "vital_signs/blood_pressure/any_event/systolic": sistolicniKrvniTlak,
		    "vital_signs/blood_pressure/any_event/diastolic": diastolicniKrvniTlak,
	
		};
		var parametriZahteve = {
		    ehrId: ehrId,
		    templateId: 'Vital Signs',
		    format: 'FLAT',
	
		};
		$.ajax({
		    url: baseUrl + "/composition?" + $.param(parametriZahteve),
		    type: 'POST',
		    contentType: 'application/json',
		    data: JSON.stringify(podatki),
		    success: function (res) {
		        $("#dodajMeritveVitalnihZnakovSporocilo").html(
              "<span class='obvestilo label label-success fade-in'>" +
              res.meta.href + ".</span>");
		    },
		    error: function(err) {
		    	$("#dodajMeritveVitalnihZnakovSporocilo").html(
            "<span class='obvestilo label label-danger fade-in'>Napaka '" +
            JSON.parse(err.responseText).userMessage + "'!");
		    }
		});
	}
}


/**
 * Generator podatkov za novega pacienta, ki bo uporabljal aplikacijo. Pri
 * generiranju podatkov je potrebno najprej kreirati novega pacienta z
 * določenimi osebnimi podatki (ime, priimek in datum rojstva) ter za njega
 * shraniti nekaj podatkov o vitalnih znakih.
 * @param stPacienta zaporedna številka pacienta (1, 2 ali 3)
 * @return ehrId generiranega pacienta
 */



// TODO: Tukaj implementirate funkcionalnost, ki jo podpira vaša aplikacija
$(document).ready(function() {

  /**
   * Napolni testne vrednosti (ime, priimek in datum rojstva) pri kreiranju
   * EHR zapisa za novega bolnika, ko uporabnik izbere vrednost iz
   * padajočega menuja (npr. Regina Phalange).
   */
  $('#preberiPredlogoBolnika').change(function() {
    $("#kreirajSporocilo").html("");
    var podatki = $(this).val().split(",");
    $("#kreirajIme").val(podatki[0]);
    $("#kreirajPriimek").val(podatki[1]);
    $("#kreirajDatumRojstva").val(podatki[2]);
    $("#preberiEHRid").val(podatki[3]);
  });
  
  $('#preberiObstojeciEHR').change(function() {
		$("#preberiSporocilo").html("");
		$("#preberiEHRid").val($(this).val());
	});
	
    $('#preberiObstojeciVitalniZnak').change(function() {
		$("#dodajMeritveVitalnihZnakovSporocilo").html("");
		var info=["2015-11-11T11:44Z",170,60,36,122,66];

		$("#dodajVitalnoDatumInUra").val(info[0]);
		$("#dodajVitalnoTelesnaVisina").val(info[1]);
		$("#dodajVitalnoTelesnaTeza").val(info[2]);
		$("#dodajVitalnoTelesnaTemperatura").val(info[3]);
		$("#dodajVitalnoKrvniTlakSistolicni").val(info[4]);
		$("#dodajVitalnoKrvniTlakDiastolicni").val(info[5]);

	});

});

//generiranje podatkov


function generiraj() {
 generirajPodatke(1);
 generirajPodatke(2);
 generirajPodatke(3);
 var select = document.getElementById("preberiPredlogoBolnika");
 var length = select.options.length;
}
function generirajPodatke(stPacienta) {
        var oseba;
        var podatki=[["2015-11-11T11:44Z",170,60,36,140,66],["2015-11-12T11:44Z",170,59,36,120,50],["2015-11-13T11:44Z",170,61,36,130,70]];;
        
        if(stPacienta == 1){
            oseba=["Regina","Phalange","1983-10-26T15:38"];
            podatki=[["2015-11-11T11:44Z",170,52,36,180,110],["2015-11-12T11:44Z",170,52,36,110,75],["2015-11-13T11:44Z",170,52,36,90,40]];
           
        }
        else if(stPacienta == 2){
            oseba=["Ken","Adams","1982-2-6T11:10"];
            podatki=[["2015-11-11T11:44Z",183,90,37,120,80],["2015-11-12T11:44Z",183,88,37,60,40],["2015-11-13T11:44Z",183,87,37,150,100]];
        }
        else if(stPacienta == 3){
            oseba=["Chanandler","Bong","1981-11-21T16:44"];
            podatki=[["2015-11-11T11:44Z",187,86,36,80,60],["2015-11-12T11:44Z",187,85,36,130,80],["2015-11-13T11:44Z",187,83,37,190,110]];
        }
         
  
        
    	sessionId = getSessionId();
    
    	var ime = oseba[0];
    	var priimek = oseba[1];
    	var datumRojstva = oseba[2];
    	
    	var info = podatki;
        
    	if (!ime || !priimek || !datumRojstva || ime.trim().length == 0 ||
          priimek.trim().length == 0 || datumRojstva.trim().length == 0) {
    		$("#kreirajSporocilo").html("<span class='obvestilo label " +
          "label-warning fade-in'>Prosim vnesite zahtevane podatke!</span>");
    	} else {
    		$.ajaxSetup({
    		    headers: {"Ehr-Session": sessionId}
    		});
    		$.ajax({
    		    url: baseUrl + "/ehr",
    		    type: 'POST',
    		    success: function (data) {
    		        var ehrId = data.ehrId;
    		        var partyData = {
    		            firstNames: ime,
    		            lastNames: priimek,
    		            dateOfBirth: datumRojstva,
    		            partyAdditionalInfo: [{key: "ehrId", value: ehrId}]
    		        };
    		        $.ajax({
    		            url: baseUrl + "/demographics/party",
    		            type: 'POST',
    		            contentType: 'application/json',
    		            data: JSON.stringify(partyData),
    		            success: function (party) {
    		                if (party.action == 'CREATE') {
    		                    $('#preberiPredlogoBolnika').append('<option value="'+oseba[0]+","+oseba[1]+","+oseba[2] +","+ehrId+'">'+oseba[0]+" "+oseba[1]+'</option>');
    		                    
    		                }
    		                
    		                for (var i in info){
    		                    
                            //dodaj začetne vitalne znake
                                sessionId = getSessionId();
                            
                            	var datumInUra = info[i][0];
                            	var telesnaVisina = info[i][1];
                            	var telesnaTeza = info[i][2];
                            	var telesnaTemperatura =  info[i][3];
                            	var sistolicniKrvniTlak =  info[i][4];
                            	var diastolicniKrvniTlak =  info[i][5];
                                var merilec = "ana";
                               
                            	if (!ehrId || ehrId.trim().length == 0) {
                            		$("#dodajMeritveVitalnihZnakovSporocilo").html("<span class='obvestilo " +
                                  "label label-warning fade-in'>Prosim vnesite zahtevane podatke!</span>");
                            	} else {
                            		$.ajaxSetup({
                            		    headers: {"Ehr-Session": sessionId}
                            		});
                            		var podatki = {
                            			// Struktura predloge je na voljo na naslednjem spletnem naslovu:
                                  // https://rest.ehrscape.com/rest/v1/template/Vital%20Signs/example
                            		    "ctx/language": "en",
                            		    "ctx/territory": "SI",
                            		    "ctx/time": datumInUra,
                            		    "vital_signs/height_length/any_event/body_height_length": telesnaVisina,
                            		    "vital_signs/body_weight/any_event/body_weight": telesnaTeza,
                            		   	"vital_signs/body_temperature/any_event/temperature|magnitude": telesnaTemperatura,
                            		    "vital_signs/body_temperature/any_event/temperature|unit": "°C",
                            		    "vital_signs/blood_pressure/any_event/systolic": sistolicniKrvniTlak,
                            		    "vital_signs/blood_pressure/any_event/diastolic": diastolicniKrvniTlak,
                            	
                            		};
                            		var parametriZahteve = {
                            		    ehrId: ehrId,
                            		    templateId: 'Vital Signs',
                            		    format: 'FLAT',
                            		    committer: merilec
                            	
                            		};
                            		$.ajax({
                            		    url: baseUrl + "/composition?" + $.param(parametriZahteve),
                            		    type: 'POST',
                            		    contentType: 'application/json',
                            		    data: JSON.stringify(podatki),
                            		    success: function (res) {
                            		        $("#dodajMeritveVitalnihZnakovSporocilo").html(
                                          "<span class='obvestilo label label-success fade-in'>" +
                                          res.meta.href + ".</span>");
                                         // $('#preberiCasMeritve').append('<option value="'+datumInUra+","+telesnaVisina+","+telesnaTeza+","+ehrId+'">'+datumInUra+'</option>')
                            		    },
                            		    error: function(err) {
                            		    	$("#dodajMeritveVitalnihZnakovSporocilo").html(
                                        "<span class='obvestilo label label-danger fade-in'>Napaka '" +
                                        JSON.parse(err.responseText).userMessage + "'!");
                            		    }
                            		});
                            	}
    		                }
    		            },
    		            error: function(err) {
    		            	$("#kreirajSporocilo").html("<span class='obvestilo label " +
                        "label-danger fade-in'>Napaka '" +
                        JSON.parse(err.responseText).userMessage + "'!");
    		            }
    		        });
    		    }
    		});
    	}
}
