if (!dfcc) {
   var dfcc = {};
}

var chart = {};

dfcc.WebAmChartsPie = function WebAmChartsPie(sName, oPrnt) {
    dfcc.WebAmChartsPie.base.constructor.apply(this, arguments);
    
}

df.defineClass("dfcc.WebAmChartsPie", "df.WebBaseControl", {
    openHtml: function(aHtml) {
        dfcc.WebAmChartsPie.base.openHtml.call(this, aHtml);
        
        aHtml.push('<div id="' + this._sName + '"></div>');
    },

    closeHtml: function(aHtml) {
        // Forward Send
        dfcc.WebAmChartsPie.base.closeHtml.call(this, aHtml);
    },
    
    afterRender: function() {
        // Themes begin
        am4core.useTheme(am4themes_animated);
        // Themes end
        
        // Create chart instance
        chart = am4core.create(this._sName, am4charts.PieChart);
        
        // Add data
        chart.data = [];
        /* {
          "country": "Lithuania",
          "litres": 501.9
        }, {
          "country": "Czechia",
          "litres": 301.9
        }, {
          "country": "Ireland",
          "litres": 201.1
        }, {
          "country": "Germany",
          "litres": 2000
        }, {
          "country": "Australia",
          "litres": 10
        }, {
          "country": "Austria",
          "litres": 128.3
        }, {
          "country": "UK",
          "litres": 99
        }, {
          "country": "Belgium",
          "litres": 60
        }, {
          "country": "The Netherlands",
          "litres": 50
        } ];*/
        
        // Add and configure Series
        var pieSeries = chart.series.push(new am4charts.PieSeries());
        pieSeries.dataFields.value = "count";
        pieSeries.dataFields.category = "category";
        pieSeries.slices.template.stroke = am4core.color("#fff");
        pieSeries.slices.template.strokeWidth = 2;
        pieSeries.slices.template.strokeOpacity = 1;
        
        // This creates initial animation
        pieSeries.hiddenState.properties.opacity = 1;
        pieSeries.hiddenState.properties.endAngle = -90;
        pieSeries.hiddenState.properties.startAngle = -90;
        
        pieSeries.slices.template.events.on("hit", function(ev) {
            //console.log(ev);
            var count = ev.target.dataItem.dataContext.count;
            
            var slice = ev.target.slice;
            if (slice.isActive === undefined) { slice.isActive = false; }
            slice.isActive = !slice.isActive;
            if (!slice.isActive) { count = -count; }
            this.sliceClick(count);
        }, this);
    },
    
    doUpdateGraph: function() {
        var bOk = this.updateGraph();
    },
    
    updateGraph: function(sJsonData) {
    
        var jsonObj = JSON.parse(sJsonData);
        
        //console.log('JSON DATA: ', jsonObj);
        
        chart.data = jsonObj;
        return true;
    },
    
    sliceClick: function(count) {
        //console.log(count);
        this.serverAction("SliceClick", [count.toString()]);
    }
});