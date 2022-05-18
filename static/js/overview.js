

function mainPlot(json) {
    json = json.items

	let expenses = [], income = [];
	json.forEach(row => {
	        if (row.type === 'Expenses') {
				expenses.push({x: row.date, y: row.amount});
			} else if (row.type === 'Income') {
				income.push({x: row.date, y: row.amount});
			}
	});
    console.log([expenses, income]);

    const series = [
        {name: 'Expenses', points: expenses},
        {name: 'Income', points: income}];

    JSC.Chart('idMainPlot', { series: series })
}

function piePlot(json, type='Expenses') {
    json = json.items
    let categories = {}
	json.forEach(row => {
	    if ((type === 'Expenses' && row.amount > 0)
            || (type === 'Income' && row.amount < 0)) {
        }
	    else if (!(row.category in categories)) {
	        categories[row.category] = row.amount
        } else {
	        categories[row.category] += row.amount
        }
	})
    console.log(categories)

    let result = []
    for (const [key, value] of Object.entries(categories)) {
        result.push({
            name: key,
            y: value
        })
    }

    JSC.chart('id' + type + 'Pie', {
      legend_visible: false,
      title_position: 'center',
      defaultSeries: {
        type: 'pie',
        pointSelection: false,
        shape_padding: 0.15
      },
      defaultPoint_label_text:
        '%name<br><b>%yValue</b>',
      yAxis: { formatString: 'n', label_text: 'Amount' },
      series: [
        {
            points: result,
          name: 'of all ' + type.toLowerCase()
        }
      ],
      title_label_text: type
    });

}


export function plot() {
        fetch("http://127.0.0.1:8000" + '/overview' + '/get_fake_data')
            .then(response => {
                response.json()
                    .then(obj => {
                        mainPlot(obj)
                        piePlot(obj, 'Expenses')
                        piePlot(obj, 'Income')
                    })
            })
}
