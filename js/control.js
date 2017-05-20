/**
 * Kontroler vytvoreny pouze z JS funkci (neco malo  z knihovny JQuery)
 * AngularJS knihovnu jsem vubec nepouzil
 */

// vytvoreni testovacich dat
function setTestData(){
    var testData = [
        {ID: 1, Jmeno: "Adam", Prijmeni:"Zelený", Telefon:"758897421", Email:"adam@seznam.cz", Vek:"25"},
        {ID: 2, Jmeno: "Ivan", Prijmeni:"Malak", Telefon:"690458712", Email:"ivan@seznam.cz", Vek:"20"},
        {ID: 3, Jmeno: "Jana", Prijmeni:"Hloubavá", Telefon:"607457311", Email:"jana@seznam.cz", Vek:"40"},
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
            },
        },

        pageSize: 10,
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
                title: "Upravit záznam o osobě",           // Localization for Edit in the popup window
            }
        },

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

        var rows = e.sender.tbody.children();
        for(var j=0; j<rows.length; j++){
            var row = $(rows[j]);
            var dataItem = e.sender.dataItem(row);
            setrideneRadky.push(dataItem);
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

