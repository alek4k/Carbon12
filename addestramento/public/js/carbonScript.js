let result;
$(document).ready(function() {
    $('select').formSelect();

    $(document).on('change', '#trainFile', function(){
        let form_data = new FormData();
        let name = document.getElementById('trainFile').files[0].name;
        let ext = name.split('.').pop().toLowerCase();
        if (jQuery.inArray(ext, ['csv']) !== -1) {
            form_data.append('trainFile', document.getElementById('trainFile').files[0]);

            $.ajax({
                url: '/loadColumns',
                method: 'POST',
                data: form_data,
                contentType: false,
                cache: false,
                processData: false,
                success: function(response) {
                    if (document.getElementById('configChart')) {
                        $('#configChart').remove();
                    }
                    if (document.getElementById('chart')) {
                        $('#chart').remove();
                    }
                    if (document.getElementById('columnPara')) {
                        $('#columnPara').remove();
                    }
                    if (document.getElementById('columnNames')) {
                        $('#columnNames').remove();
                    }
                    result = JSON.parse(response);
                    if (result.length < 3) {
                        alert('Il file deve avere almeno due sorgenti di dati');
                        $("#trainFile").replaceWith($("#trainFile").val('').clone(true));
                    } else {
                        selectLabels(result);
                    }
                },
            });
        }
    });

    $(document).on('change', '#columnNames', function() {
        let form_data = new FormData();
        let name = $(this).val();
        form_data.append('columnName', document.getElementById('columnNames').value);
        $.ajax({
            url: "/loadCsv",
            method: "POST",
            data: form_data,
            contentType: false,
            cache: false,
            processData: false,
            success: function (response) {
                if (document.getElementById('configChart')) {
                    $('#configChart').remove();
                }
                if (document.getElementById('chart')) {
                    $('#chart').remove();
                }
                result = JSON.parse(response);
                drawChart(result);
                M.Toast.dismissAll();
                var toastHTML = '<span>Grafico aggiornato</span><a href="#mychart"><button class="btn-flat toast-action">VAI</button></a>';
                M.toast({ html: toastHTML, classes: 'carbonColor' });
            },
        });
    });

    $(document).on('change', '#selectX', function() {
        let assex = $(this).val();
        let assey = $('#selectY').val();
        configChart(result, assex, assey);
    });
    $(document).on('change', '#selectY', function() {
        let assex = $('#selectX').val();
        let assey = $(this).val();
        configChart(result, assex, assey);
    });
});

let selectLabels = function(result) {
    $("#titleBlockLabelCsv").removeClass("hidden");
    let myParagrah = document.createElement('p');
    myParagrah.id = 'columnPara';
    myParagrah.appendChild(document.createTextNode
    ('Seleziona l\'etichetta corrispondente alla colonna contenente i valori attesi per l\'addestramento'));
    let train = document.getElementById('titleBlockLabelCsv');
    let trainSelection = document.getElementById('blockLabelCsv');
    if (trainSelection.hasChildNodes()) {
        trainSelection.removeChild(trainSelection.firstChild);
    }
    let select = document.createElement('select');
    select.name = 'columnNames';
    select.id = 'columnNames';
    myParagrah.className = 'fieldTitle';
    for (let i = 0; i < result.length; i++) {
        let option = document.createElement('option');
        option.text = result[i];
        option.value = i;
        select.options.add(option);
    }
    train.parentNode.insertBefore(myParagrah, train.previousSibling);
    trainSelection.appendChild(select);
    $('select').formSelect();
};

let drawChart = function(result) {
    let sorgenti = result[2];
    let myDiv = document.createElement('div');
    myDiv.id = 'configChart';
    let divRowX = document.createElement('div');
    divRowX.classList.add("row", "no-margin");
    let divRowY = document.createElement('div');
    divRowY.classList.add("row", "no-margin");
    let divInputX = document.createElement('div');
    divInputX.classList.add("input-field", "col", "s6", "m4", "l3", "xl2", "no-margin");
    let divInputY = document.createElement('div');
    divInputY.classList.add("input-field", "col", "s6", "m4", "l3", "xl2", "no-margin");
    let div = document.getElementById('mychart');
    let chart = document.getElementById('chart');
    div.insertBefore(myDiv, chart);
    let myParagrah = document.createElement('p');
    myParagrah.classList.add("fieldTitle");
    myParagrah.appendChild(document.createTextNode('Visualizza la disposizione dei tuoi dati'));
    myDiv.appendChild(myParagrah);
    let asseX = document.createElement('p');
    asseX.appendChild(document.createTextNode('Seleziona la sorgente da visualizzare sull\'asse x'));
    asseX.classList.add('chartP');
    myDiv.appendChild(divRowX);
    divRowX.appendChild(asseX);
    divRowX.appendChild(divInputX);

    let selectX = document.createElement('select');
    selectX.name = 'assex';
    selectX.id = 'selectX';
    for (let i = 0; i < sorgenti.length; i++){
        let option = document.createElement('option');
        option.text = sorgenti[i];
        option.value = i;
        selectX.options.add(option);
    }
    divInputX.appendChild(selectX);

    let asseY = document.createElement('p');
    asseY.appendChild(document.createTextNode('Seleziona la sorgente da visualizzare sull\'asse y'));
    asseY.classList.add('chartP');
    myDiv.appendChild(divRowY)
    divRowY.appendChild(asseY);

    let selectY = document.createElement('select');
    selectY.name = 'assey';
    selectY.id = 'selectY';
    for (let i = 0; i < sorgenti.length; i++) {
        let option = document.createElement('option');
        option.text = sorgenti[i];
        option.value = i;
        selectY.options.add(option);
    }
    divRowY.appendChild(divInputY);
    divInputY.appendChild(selectY);

    document.getElementById('selectY').value = 1;
    $('select').formSelect();
    configChart(result, 0, 1);
};

let genericChart = function (data, label, x, y) {
    const xAxesName = result[2][x];
    const yAxesName = result[2][y];
    let buildData = [];
    for (let i = 0; i < data.length; i++) {
        buildData.push({ x: data[i][x], y: data[i][y] });
    }
    let config = [];
    config.push('scatter');
    let dataSet = {
        datasets: [{
            label: 'data',
            data: buildData,
            backgroundColor: 'rgba(189, 232, 255, 0.5)',
            borderColor: 'rgba(22, 117, 170, 1)',
        }],
    };
    config.push(dataSet);
    let scales = {
        xAxes: [{
            display: true,
            scaleLabel: {
                display: true,
                labelString: xAxesName,
            },
        }],
        yAxes: [{
            display: true,
            scaleLabel: {
                display: true,
                labelString: yAxesName,
            },
        }],
    };
    config.push(scales);
    return config;
};

let SVM_Chart = function (data, label, x, y) {
    let greenData = [];
    let redData = [];
    const xAxesName = result[2][x];
    const yAxesName = result[2][y];
    for (let i = 0; i < data.length; i++) {
        if (label[i] === 1) {
            greenData.push({ x: data[i][x], y: data[i][y] });
        } else {
            redData.push({ x: data[i][x], y: data[i][y] });
        }
    }
    let config = [];
    config.push('scatter');
    let dataSet = {
        datasets: [{
            label: 'Green Data',
            data: greenData,
            backgroundColor: 'rgba(80, 220, 108, 0.5)',
            borderColor: 'rgba(27, 115, 45, 1)',
        }, {
            label: 'Red Data',
            data: redData,
            backgroundColor: 'rgba(222, 83, 83, 0.5)',
            borderColor: 'rgba(216, 18, 18, 1)',
        }],
    };
    config.push(dataSet);

    let scales = {
        xAxes: [{
            display: true,
            scaleLabel: {
                display: true,
                labelString: xAxesName,
            },
        }],
        yAxes: [{
            display: true,
            scaleLabel: {
                display: true,
                labelString: yAxesName,
            },
        }],
    };
    config.push(scales);
    return config;
};

let RL_Chart = function (data, label, x, y) {
    let pointData = [];
    const xAxesName = result[2][x];
    const yAxesName = result[2][y];
    for (let i = 0; i < data.length; i++) {
        pointData.push({x: data[i][x], y: data[i][y]});
    }
    let lineData = [];
    lineData.push({ x: data[0][x], y: label[0] });
    lineData.push({ x: data[data.length - 1][x], y: label[data.length - 1] });

    let config = [];
    config.push('line');
    let dataSet = {
        datasets: [{
            type: 'scatter',
            label: 'Data',
            data: pointData,
            backgroundColor: 'rgba(189, 232, 255, 0.5)',
            borderColor: 'rgba(22, 117, 170, 1)',
            xAxisID: 'x-axis-1'
        },{
            type: 'line',
            label: 'Linear Regression',
            data: lineData,
            backgroundColor: 'rgba(222, 83, 83, 0.5)',
            borderColor: 'rgba(216, 18, 18, 1)',
            fill: false,
            pointRadius: 0,
        }],
    };
    config.push(dataSet);

    const xValues = data.map(x => x[0]);
    const minValue = Math.min.apply(null, xValues);
    const maxValue = Math.max.apply(null, xValues);
    let scales = {
        xAxes: [{
            display: false,
        }, {
            id: 'x-axis-1',
            type: 'linear',
            display: true,
            ticks: {
                min: minValue,
                max: maxValue,
                stepSize: 5,
            },
            scaleLabel: {
                display: true,
                labelString: xAxesName,
            },
        }],
        yAxes: [{
            display: true,
            scaleLabel: {
                display: true,
                labelString: yAxesName,
            },
        }],
    };
    config.push(scales);
    return config;
};

let configChart = function(result, x, y){
    const data = result[0];
    const label = result[1];
    const xAxesName = result[2][x];
    const yAxesName = result[2][y];
    const title = 'correlazione ' + xAxesName + '-' + yAxesName;

    const isNull = (currentValue) => currentValue === 0;
    let nomodel = label.every(isNull);
    let chartConfiguration = [];
    if(nomodel){
        chartConfiguration = genericChart(data, label, x, y);
    }
    else{
        const isClass = (currentValue) => currentValue === -1 || currentValue === 1;
        let SVM = label.every(isClass);
        if(SVM)
            chartConfiguration = SVM_Chart(data, label, x, y);

        else
            chartConfiguration = RL_Chart(data, label, x, y);
    }
    let myDiv = document.getElementById('mychart');
    let chart = document.createElement('canvas');
    chart.id = 'chart';
    chart.width = '100';
    chart.height = '100';
    myDiv.appendChild(chart);
    const ctx = document.getElementById('chart').getContext('2d');
    const scatterChart = new Chart(ctx, {
        type: chartConfiguration[0],
        data: chartConfiguration[1],
        options: {
            title: {
                display: true,
                text: title,
            },
            scales: chartConfiguration[2],
        },
    });
};
