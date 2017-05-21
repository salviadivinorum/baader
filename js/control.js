/**
 * Kontroler vytvoreny pouze z JS funkci (neco malo  z knihovny JQuery)
 * AngularJS knihovnu jsem vubec nepouzil
 */

// vytvoreni testovacich dat
function setTestData(){
    var testData = [
        {ID: 1, Jmeno: "Adam", Prijmeni:"Koumák", Telefon:"758897421", Email:"adam@seznam.cz", Vek:"11"},
        {ID: 2, Jmeno: "Ivan", Prijmeni:"Hendler", Telefon:"690458712", Email:"ivan@seznam.cz", Vek:"20"},
        {ID: 3, Jmeno: "Viktorie", Prijmeni:"Prvněsvětská", Telefon:"21458769", Email:"mrtvola@seznam.cz", Vek:"90"},
        {ID: 4, Jmeno: "Ivana", Prijmeni:"Novotná", Telefon:"608975124", Email: "ivana@gmail.com", Vek:"14"},
        {ID: 5, Jmeno: "Petra", Prijmeni:"Cikýrková", Telefon:"721487255", Email:"petra@centrum.cz", Vek:"49"},
        {ID: 6, Jmeno: "Karel", Prijmeni:"Labour", Telefon:"585785621", Email:"jkarel@stranka.cz", Vek:"40"},
        {ID: 7, Jmeno: "Tomáš", Prijmeni:"HNejedlý", Telefon:"658742150", Email:"tomá@seznam.cz", Vek:"15"},
        {ID: 8, Jmeno: "Stařec", Prijmeni:"Amoře", Telefon:"61", Email:"stary@kmet.com", Vek:"88"},
        {ID: 9, Jmeno: "Jana", Prijmeni:"Hloubavá", Telefon:"607457311", Email:"jana@seznam.cz", Vek:"40"},
        {ID: 10, Jmeno: "Benjamín", Prijmeni:"Nevímek", Telefon:"6601601602", Email:"ahojda@seznam.cz", Vek:"11"},

        {ID: 11, Jmeno: "Tosnad", Prijmeni:"Nemyslíšvážně", Telefon:"578612587", Email: "neblazni@gmail.com", Vek:"20"},
        {ID: 12, Jmeno: "Jiří", Prijmeni:"Hlubač", Telefon:"607457587", Email:"jhlubac@omyl.cz", Vek:"18"},
        {ID: 13, Jmeno: "Filip", Prijmeni:"Tovíjakdál", Telefon:"785655874", Email:"nebavi@seznam.cz", Vek:"14"},
        {ID: 14, Jmeno: "Dita", Prijmeni:"Nakepová", Telefon:"698744521", Email:"nafoukana14@seznam.cz", Vek:"17"},
        {ID: 15, Jmeno: "Jan", Prijmeni:"Posedlý", Telefon:"6547896321", Email:"jan.posedly@seznam.cz", Vek:"55"},
        {ID: 16, Jmeno: "Simona", Prijmeni:"Královecká", Telefon:"607458741", Email:"simonecka@koukejte.us", Vek:"90"},
        {ID: 17, Jmeno: "Jaroslav", Prijmeni:"Úlehla", Telefon:"777457311", Email:"juleh.la@seznam.cz", Vek:"43"},
        {ID: 18, Jmeno: "Komár", Prijmeni:"Pichlavý", Telefon:"779457311", Email:"kmar.picha@houlen.com", Vek:"25"},
        {ID: 19, Jmeno: "Ctibor", Prijmeni:"Veleba", Telefon:"756157311", Email:"ctiborlk@veleba.cz", Vek:"11"},
        {ID: 20, Jmeno: "Tereza", Prijmeni:"Horskénová", Telefon:"751457311", Email:"terezka@koupaliste-ureky.cz", Vek:"71"}

    ];
    localStorage["grid_data"] = JSON.stringify(testData);
}

// nove tlacitko pro moznost resetu prace do init stavu
function reset(){
    setTestData();
    $("#grid").data("kendoGrid").dataSource.read();
}

// obsluha Kendo Gridu v teto funkci
$(document).ready(function () {

    // nacte poprve do localStorage predefinovana testovaci data
    if(localStorage["grid_data"] === undefined){
        setTestData();
    }

    // CRUD definice pro localStorage - zdroj dat pro Kendo Grid
    var dataSource = new kendo.data.DataSource({
        transport: {
            create: function(options){
                var localData = JSON.parse(localStorage["grid_data"]);
                options.data.ID = localData[localData.length-1].ID + 1;
                localData.push(options.data);
                localStorage["grid_data"] = JSON.stringify(localData);
                options.success(options.data);
            },
            read: function(options){
                var localData = JSON.parse(localStorage["grid_data"]);
                options.success(localData);
            },
            update: function(options){
                var localData = JSON.parse(localStorage["grid_data"]);

                for(var i=0; i<localData.length; i++){
                    if(localData[i].ID === options.data.ID){
                        localData[i].Jmeno = options.data.Jmeno;
                        localData[i].Prijmeni = options.data.Prijmeni;
                        localData[i].Telefon = options.data.Telefon;
                        localData[i].Email = options.data.Email;
                        localData[i].Vek = options.data.Vek;
                    }
                }
                localStorage["grid_data"] = JSON.stringify(localData);
                options.success(options.data);
            },
            destroy: function(options){
                var localData = JSON.parse(localStorage["grid_data"]);
                for(var i=0; i<localData.length; i++){
                    if(localData[i].ID === options.data.ID){
                        localData.splice(i,1);
                        break;
                    }
                }
                localStorage["grid_data"] = JSON.stringify(localData);
                options.success(localData);
            }
        },

        pageSize: 25,
        schema: {
            model: {
                id: "ID",
                fields: {
                    ID: { type:"number",  editable: false },
                    Jmeno: { type: "string", validation: { required: true } },
                    Prijmeni: {type: "string" },
                    Telefon: {type: "string"},
                    Email: {type: "string"},
                    Vek: {type: "number", validation: { min: 1, required: true } }
                }}
        }

    });


    // Vzhled Kendo Gridu
    var grid = $("#grid").kendoGrid({
        dataSource: dataSource,
        dataBound: onDataBound,



        //pageable: true,
        height: 550,
        //groupable: true,
        sortable: true,

        pageable: {
            refresh: true,
            pageSizes: true,
            buttonCount: 5
        },


        toolbar: [{name: "create", text:"Nový záznam"} ],
        //toolbar: ["create", "save", "cancel"],
        columns: [
            { field: "ID", title:"ID", width:"80px"},
            { field: "Jmeno", title:"Jméno"},
            { field: "Prijmeni", title:"Příjmení"},
            { field: "Telefon", title:"Telefon"},
            { field: "Email", title:"E-mail"},
            { field: "Vek", title:"Věk", width:"80px"},
            {command: [
                {
                    name: "edit",
                    text: {
                        edit: "Upravit",
                        update: "Save",
                        cancel: "Cancel changes"
                    }
                },
                {
                    name: "destroy",
                    text: "Smazat"
                }
            ]}
        ],
        editable  : {
            mode : "popup",
            window : {
                title: "Upravit záznam o osobě"
            }
        }

    }).data("kendoGrid");

    // skryje 1. sloupec s ID sloupcem (pro testovaci ucely)
    grid.hideColumn("ID");
});


// *****************************************************************
// (JavaScript + JQuery) obsluha udalosti "onDataBound" na Kendo Gridu
// ******************************************************************

function onDataBound(e) {
    var grid = $("#grid").data("kendoGrid");
    var data = grid.dataSource.data();

    // pomocne pole pro setrideni  a druhe pro obarveni radku
    var setrideneRadky = new Array();
    var radkyKobarveni = new Array();

    //hodnota Veku pro 1. a 2. a posledniho zaznam v poli
    var prvni = 0;
    var druhy = 0;
    var posledni = 0;




    // seradi radky do pomocneho pole
    function SeradRadkyVzestupne() {

        for (var i = 0; i < grid.dataSource.data().length; i++) {
            var item = grid.dataSource.data()[i];
            setrideneRadky.push(item);
        }

        // tridici metoda
        setrideneRadky.sort(function (a,b) {
            return(a.Vek - b.Vek)});

        // vybere 1. nejmladsi zaznam + 2. nejmladsi ze setrideneho pole
        NastavPrvniDva();

        // kolik je vlastne prvku v poli
        posledni = setrideneRadky.length-1;

    }


    // z pomocneho pole mi vybere 1. nejmladsi a 2. nejmldsi zaznam
    // a ulozi do promenne prvni, druhy
    function NastavPrvniDva()
    {
        prvni = setrideneRadky[0].Vek;

        for(var j=1; j<setrideneRadky.length; j++){
            if(setrideneRadky[j].Vek > prvni)
            {
                druhy = setrideneRadky[j].Vek;
                break;
            }
        }
    }


    // na zaver pridam tridni selektor k elementu, v CSS stylesheetu mam nastaveno pozadi stylu radku
    function ObarviElementy(ele, barva){

        for (k in ele){
            $(ele[k]).removeClass(); // po kazde uprave v Gridu je potreba smazat puvodni selektor
            $(ele[k]).addClass(barva);
        }
        radkyKobarveni=[]; // reset pomocneho poole
    }


    //***** START BAREVNOSTI BLUE + YELLOW + BLUE  ************************************************

    // NEJPRVE - najdu 1., 2. a posledni zaznam dle hodnoty Vek
    SeradRadkyVzestupne();


    // NEJSTARSI = CERVENE
    $.each(data, function (i, row) {
        if (row.Vek === setrideneRadky[posledni].Vek)
        {
            radkyKobarveni.push( $('tr[data-uid="' + row.uid + '"] '));
        }
    });
    ObarviElementy(radkyKobarveni, "change-background-red");


    // 1. NEJMLADSI = MODRE
    $.each(data, function (i, row) {
        if(row.Vek === prvni)
        {
            radkyKobarveni.push( $('tr[data-uid="' + row.uid + '"] '));
        }
    });
    ObarviElementy(radkyKobarveni, "change-background-blue");


    // 2. NEJMLADSI = ZLUTE
    $.each(data, function (i, row) {
        if (row.Vek === druhy)
        {
            radkyKobarveni.push( $('tr[data-uid="' + row.uid + '"] '));
        }
    });
    ObarviElementy(radkyKobarveni, "change-background-yellow");

}

