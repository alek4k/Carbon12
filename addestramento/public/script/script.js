
// data deve essere un array bidimensionale con i valori delle due sorgenti nelle due colonne ottenuto dal csv 
function drawChart(){
  const ctx = document.getElementById('chart').getContext('2d');
      const scatterChart = new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: [{
                label: 'Scatter Dataset',
                data:  [
                  <% for (var i =0; i <60;  i++ ) { %>
                    {
                    x: <%= data[i][0] %>,
                    y: <%= data[i][1] %>
                    },
                  <% } %>
                  ],
                pointBackgroundColor: 'rgba(223, 43, 43, 1)',
                backgroundColor: 'rgba(223, 43, 43, 1)',
                borderColor:  'rgba(223, 43, 43, 1)',
                pointBorderColor: 'rgba(223, 43, 43, 1)'
            }]
        },
        options: {
          scales: {
              yAxes: [{
                display: true,
                scaleLabel: {
                  display: true,
                  labelString: 'CPU'
                }
              }],
              xAxes: [{
                display: true,
                scaleLabel: {
                  display: true,
                  labelString: 'RAM'
                }
              }]
        }
      }
  });