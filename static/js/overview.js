

function mainPlot(items) {
	let expenses = [], income = [];
	items.forEach(row => {
	        if (row.type === 'Expenses') {
				expenses.push({x: row.date, y: row.amount});
			} else if (row.type === 'Income') {
				income.push({x: row.date, y: row.amount});
			}
	});

    const series = [
        {name: 'Expenses', points: expenses},
        {name: 'Income', points: income}];

    JSC.Chart('idMainPlot', { series: series })
}

function piePlot(items, type='Expenses') {
    let categories = {}
	items.forEach(row => {
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


export function plot(type='month') {
        fetch("http://127.0.0.1:8000" + '/overview' + '/get_fake_data')
            .then(response => {
                response.json()
                    .then(obj => {
                        let items = obj.items
                        if (type === 'week') {
                            items = items.slice(0, 14)
                        }

                        mainPlot(items)
                        piePlot(items, 'Expenses')
                        piePlot(items, 'Income')
                    })
            })
}

export function initOverview() {
    const barSelect = document.getElementById("idBarSelect")
    console.log(barSelect)

    barSelect.addEventListener('change', () => {
        const value = barSelect.value
        console.log(value)
        plot(value)
    })

    barSelect.value = 'month'
    barSelect.selectedIndex = 1
    plot(barSelect.value)
}

