import Component from '@ember/component';
import Chart from 'chart.js'
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { A } from '@ember/array';
import { later } from '@ember/runloop'

let temperatureChart = null;

export default Component.extend({
  api: service(),

  trackingTemperature: false,
  mashTemp: 150,
  temperatureList: A(),
  temperatureListTruncated: computed('temperatureList.[]', function() {
    return this.temperatureList.slice(this.temperatureList.length - 10, this.temperatureList.length);
  }),
  temperatureListSorted: computed('temperatureListTruncated.[]', function() {
    return this.get('temperatureListTruncated').toArray().reverse();
  }),

    init(...args) {
      this._super(...args);
      this.temperatureList.pushObject(0);
    },

    didInsertElement(...args) {
        this._super(...args);
        this.renderTemperatureGraph();
    },

    renderTemperatureGraph() {
        const ctx = this.$('#myChart');
        temperatureChart = new Chart(ctx, {
          type: 'line',
          data: {
            labels: ['initial'],
            datasets: [{
              data: [50],
              lineTension: 0,
              backgroundColor: 'transparent',
              borderColor: '#007bff',
              borderWidth: 4,
              pointBackgroundColor: '#007bff'
            }]
          },
          options: {
            scales: {
              yAxes: [{
                ticks: {
                  beginAtZero: false
                }
              }]
            },
            legend: {
              display: false,
            },
            annotation: {
              annotations: [{
                drawTime: "afterDatasetsDraw",
                id: "hline",
                type: "line",
                mode: "horizontal",
                scaleID: "y-axis-1",
                value: 50,
                borderColor: "black",
                borderWidth: 5,
                label: {
                  backgroundColor: "red",
                  content: "Test Label",
                  enabled: true
                },
              },]
            }
          }
        });

        this.getTemperature();
    },

    async getTemperature() {
      if (this.trackingTemperature) {
        const temperatureResult = await this.get('api').get('http://localhost:8080/api/temperature');
        const { temperature } = temperatureResult.data
        this.temperatureList.pushObject(temperature);
        this.addData(temperatureChart, `${temperature}`, temperature, 0);
        later(() => this.getTemperature(), 1000);
      }
    },

    addData(chart, label, data, line) {
      if (line === 0) {
        chart.data.labels.push(label);
      }

      const dataset = chart.data.datasets[line];

      // set line color based on mashTemp
      if (data < this.get('mashTemp') - 2) {
        dataset.pointBackgroundColor = '#007bff';
        dataset.borderColor = '#007bff';
      } else if (this.get('mashTemp') - 2 < data && data < this.get('mashTemp') + 2) {
        dataset.pointBackgroundColor = '#008000';
        dataset.borderColor = '	#008000';
      } else if (data > this.get('mashTemp') + 2) {
        dataset.pointBackgroundColor = '#FF0000';
        dataset.borderColor = '	#FF0000';
      }
       
      // set value
      dataset.data.push(data); 

      chart.update();
    },

    actions: {
      setMashTemp(selectedTemperature) {
        this.set('mashTemp', selectedTemperature);
      },

      toggleTempTracking() {
        this.toggleProperty('trackingTemperature');
        if (this.trackingTemperature) {
          this.getTemperature();
        }
      }


    }
});
