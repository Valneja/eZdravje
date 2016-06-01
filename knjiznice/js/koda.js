
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


/**
 * Generator podatkov za novega pacienta, ki bo uporabljal aplikacijo. Pri
 * generiranju podatkov je potrebno najprej kreirati novega pacienta z
 * določenimi osebnimi podatki (ime, priimek in datum rojstva) ter za njega
 * shraniti nekaj podatkov o vitalnih znakih.
 * @param stPacienta zaporedna številka pacienta (1, 2 ali 3)
 * @return ehrId generiranega pacienta
 */
function generirajPodatke(stPacienta) {
  ehrId = "";

  // TODO: Potrebno implementirati

  return ehrId;
}


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

});


function kreirajEHRzaBolnika() {
 dodajOsebe(1);
 dodajOsebe(2);
 dodajOsebe(3);
 var select = document.getElementById("preberiPredlogoBolnika");
 var length = select.options.length;



}
function dodajOsebe(stevilka){
        var oseba;
        var podatki;
        
        if(stevilka == 1){
            oseba=["Regina","Phalange","1983-10-26T15:38"];
            podatki=[["2015-11-11T11:44Z",170,60,36,122,66],["2015-11-12T11:44Z",170,59,36,120,60],["2015-11-13T11:44Z",170,61,36,130,70]];
        }
        else if(stevilka == 2){
            oseba=["Ken","Adams","1982-2-6T11:10"];
            podatki=[["2015-11-11T11:44Z",183,90,37,140,80],["2015-11-12T11:44Z",183,88,37,138,84],["2015-11-13T11:44Z",183,87,37,133,77]];
        }
        else if(stevilka == 3){
            oseba=["Chanandler","Bong","1981-11-21T16:44"];
            podatki=[["2015-11-11T11:44Z",187,86,36,111,71],["2015-11-12T11:44Z",187,85,36,110,68],["2015-11-13T11:44Z",187,83,37,114,67]];
        }
  
        
    	sessionId = getSessionId();
    
    	var ime = oseba[0];
    	var priimek = oseba[1];
    	var datumRojstva = oseba[2];
    
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
