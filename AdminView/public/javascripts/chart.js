if(document.getElementById("barChartDay")!= null){
    var ctx1 = document.getElementById("barChartDay").getContext('2d');
    var myChart1 = new Chart(ctx1, { 
        type: 'bar',    
        options: {
            scales: {
                xAxes: [{
                    display: true,
                    gridLines: {
                        color: '#eee'
                    }
                }],
                yAxes: [{
                    display: true,
                    gridLines: {
                        color: '#eee'
                    },
                    ticks: {
                        suggestedMin: 0,    // minimum will be 0, unless there is a lower value.
                        // OR //
                        beginAtZero: true   // minimum value will be 0.
                    }
                }]
            },
        },
        data: {
            labels: ["01/04/2019", "02/04/2019", "03/04/2019", "04/04/2019", "05/04/2019", "06/04/2019", "07/04/2019"],
            datasets: [
                {
                    label: "Doanh thu (triệu)",
                    backgroundColor: [
                        '#3eb579',
                        '#3eb579',
                        '#3eb579',
                        '#3eb579',
                        '#3eb579',
                        '#3eb579',
                        '#3eb579'
                    ],
                    hoverBackgroundColor: [
                        '#3eb579',
                        '#3eb579',
                        '#3eb579',
                        '#3eb579',
                        '#3eb579',
                        '#3eb579',
                        '#3eb579'
                    ],
                    borderColor: [
                        '#3eb579',
                        '#3eb579',
                        '#3eb579',
                        '#3eb579',
                        '#3eb579',
                        '#3eb579',
                        '#3eb579'
                    ],
                    borderWidth: 1,
                    data: [2, 6, 8, 4, 2, 7, 4]
                }
            ]
        }
    });
}
else if (document.getElementById("barChartWeek")!= null){
    var ctx1 = document.getElementById("barChartWeek").getContext('2d');
    var myChart1 = new Chart(ctx1, { 
        type: 'bar',    
        options: {
            scales: {
                xAxes: [{
                    display: true,
                    gridLines: {
                        color: '#eee'
                    }
                }],
                yAxes: [{
                    display: true,
                    gridLines: {
                        color: '#eee'
                    },
                    ticks: {
                        suggestedMin: 0,    // minimum will be 0, unless there is a lower value.
                        // OR //
                        beginAtZero: true   // minimum value will be 0.
                    }
                }]
            },
        },
        data: {
            labels: ["Tuần 1", "Tuần 2", "Tuần 3", "Tuần 4"],
            datasets: [
                {
                    label: "Doanh thu (triệu)",
                    backgroundColor: [
                        "#54e69d",
                        "#54e69d",
                        "#54e69d",
                        "#54e69d"
                    ],
                    hoverBackgroundColor: [
                        "#54e69d",
                        "#54e69d",
                        "#54e69d",
                        "#54e69d"
                    ],
                    borderColor: [
                        "#54e69d",
                        "#54e69d",
                        "#54e69d",
                        "#54e69d"
                    ],
                    borderWidth: 1,
                    data: [10, 15, 28, 20]
                }
            ]
        }
    });
}
else if (document.getElementById("barChartQuarter")!= null){
    var ctx1 = document.getElementById("barChartQuarter").getContext('2d');
    var myChart1 = new Chart(ctx1, { 
        type: 'bar',    
        options: {
            scales: {
                xAxes: [{
                    display: true,
                    gridLines: {
                        color: '#eee'
                    }
                }],
                yAxes: [{
                    display: true,
                    gridLines: {
                        color: '#eee'
                    },
                    ticks: {
                        suggestedMin: 0,    // minimum will be 0, unless there is a lower value.
                        // OR //
                        beginAtZero: true   // minimum value will be 0.
                    }
                }]
            },
        },
        data: {
            labels: ["Quý 1", "Quý 2", "Quý 3", "Quý 4"],
            datasets: [
                {
                    label: "Doanh thu (triệu)",
                    backgroundColor: [
                        '#3eb579',
                        '#3eb579',
                        '#3eb579',
                        '#3eb579'
                    ],
                    hoverBackgroundColor: [
                        '#3eb579',
                        '#3eb579',
                        '#3eb579',
                        '#3eb579'
                    ],
                    borderColor: [
                        '#3eb579',
                        '#3eb579',
                        '#3eb579',
                        '#3eb579'
                    ],
                    borderWidth: 1,
                    data: [200, 354, 276, 600]
                }
            ]
        }
    });
}
else if (document.getElementById("barChartYear")!= null){
    var ctx1 = document.getElementById("barChartYear").getContext('2d');
    var myChart1 = new Chart(ctx1, { 
        type: 'bar',    
        options: {
            scales: {
                xAxes: [{
                    display: true,
                    gridLines: {
                        color: '#eee'
                    }
                }],
                yAxes: [{
                    display: true,
                    gridLines: {
                        color: '#eee'
                    },
                    ticks: {
                        suggestedMin: 0,    // minimum will be 0, unless there is a lower value.
                        // OR //
                        beginAtZero: true   // minimum value will be 0.
                    }
                }]
            },
        },
        data: {
            labels: ["2017", "2018", "2019"],
            datasets: [
                {
                    label: "Doanh thu (triệu)",
                    backgroundColor: [
                        "#71e9ad",
                        "#71e9ad",
                        "#71e9ad"
                    ],
                    hoverBackgroundColor: [
                        "#71e9ad",
                        "#71e9ad",
                        "#71e9ad"
                    ],
                    borderColor: [
                        "#71e9ad",
                        "#71e9ad",
                        "#71e9ad"
                    ],
                    borderWidth: 1,
                    data: [856, 987, 250]
                }
            ]
        }
    });
}
