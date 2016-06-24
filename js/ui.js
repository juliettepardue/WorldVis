// ui.js
// main UI components, including timeline slider and country pop-up


//functions
var updateUIForYearNum, playFunction, resetFunction, pauseFunction,nextFunction,previousFunction;

//var subtypes = [];
//var currentSubtypeSet = null;
var subtypeChangeCounter = 0;
var currentYearIndex =-1;
function GenerateGraph(dialogJQ,svg,width,height,countryCode,dataset_index) {
	// Set the ranges
    var x = d3.scale.linear().range([0, width]);//.format("04d");
	var y = d3.scale.linear().range([height, 0]);

	// Define the axes
	var xAxis = d3.svg.axis().scale(x)
    .orient("bottom").ticks(10).tickFormat(d3.format("4d"));
    
	var yAxis = d3.svg.axis().scale(y)
    	.orient("left")
        .ticks(6)
        .tickFormat(d3.format(".2s"));
        //.tickFormat(d3.format(".2f"));

	// Define the line
	var valueline = d3.svg.line()
    	.x(function(d) { return x((d.year)); })
	    .y(function(d) { return y((d.value));})
    	.interpolate("linear");

	var country_plotdata  = [];
	var continent_plotdata  = [];
	var global_plotdata  = [];
	var continent = list_Continent[countryCode];
    //console.log(continent);
	var datapoint;
    //collect corresponding datapoint
    //collect corresponding datapoints
	for (var yearindex = 0;yearindex< years_by_index[dataset_index].length;yearindex++)
	{
    	datapoint =  {value:-1,year:1888};
   		datapoint.value = dataset[dataset_index].where(function(row){return (row.country == countryCode) && (row.yearindex == yearindex);})
			                               .select(function(row){return row.value});
    
	    

	    if(datapoint.value.length != 0)
	    {
       		datapoint.value=datapoint.value[0];
	        datapoint.year = years_by_index[dataset_index][yearindex].year;
	        country_plotdata.push(datapoint);
	    }

	    datapoint =  {value:-1,year:1888};
	    datapoint.value = dataset_Continent[dataset_index].where(function(row){return (row.continent == continent) 
                                                                                   && (row.yearindex == yearindex) 
                                                                                   &&(row.valid==1);})
       							                          .select(function(row){return row.value});
    

    
	    if(datapoint.value.length != 0)
	    {
       		datapoint.value=datapoint.value[0];
	        datapoint.year = years_by_index[dataset_index][yearindex].year;
	        continent_plotdata.push(datapoint);
   		} 
	    
	    datapoint =  {value:-1,year:1888};
        datapoint.value = global_mean[dataset_index][yearindex];
        datapoint.year = years_by_index[dataset_index][yearindex].year;
        global_plotdata.push(datapoint);
	}
    // Scale the range of the data
    maxYear = -1*Number.MAX_VALUE;
    minYear =    Number.MAX_VALUE;
    for(var i=0;i<number_of_loaded_datasets;i++)
    {
        if(years_by_index[i][0].year<minYear)
        {
            minYear = years_by_index[i][0].year;
        }
   
        if(years_by_index[i].slice(-1)[0].year>maxYear)
        {
            maxYear = years_by_index[i].slice(-1)[0].year;
        }
    }

	
    x.domain([ minYear -1,maxYear+1]); 

    var country_ymin   =  d3.min(country_plotdata,function(d) {return d.value;});
    var country_ymax   =  d3.max(country_plotdata,function(d) {return d.value;});
    var continent_ymin =  d3.min(continent_plotdata,function(d) { return d.value;});
    var continent_ymax =  d3.max(continent_plotdata,function(d) { return d.value;});
    var global_ymin =  d3.min(global_plotdata,function(d) { return d.value;});
    var global_ymax =  d3.max(global_plotdata,function(d) { return d.value;});
    
    
    //by default continent  & global buttons are OFF
    var continentIsON =0;
    var globalIsON =0;
    var ymin,ymax,padding;
    
    var UpdateGraphOnClick =function() {
	if(continentIsON== 0 && globalIsON ==0) {	
        ymin = country_ymin;
        ymax = country_ymax;
        padding  = (ymax - ymin)*0.05; 
        ymin-=padding;ymin=+ymin.toFixed(2);  //avoid  too many decimal digits
        ymax+=padding;ymax=+ymax.toFixed(2);
    	y.domain([ ymin,ymax]);
        svg.selectAll(".y.axis").transition().duration(300).call(yAxis);
        svg.selectAll(".dot").transition().duration(300).attr("cy", function(d) { return y(d.value); })
		svg.selectAll(".line").transition().duration(300).attr("d", valueline(country_plotdata));
		
        svg.selectAll(".dot2").transition().duration(300).attr("r", 0);
		svg.selectAll(".line2").transition().duration(300).attr("stroke-width", 0);
		
        svg.selectAll(".dot3").transition().duration(300).attr("r", 0);
		svg.selectAll(".line3").transition().duration(300).attr("stroke-width", 0);
    }
    else if (continentIsON ==1  && globalIsON==0) {
        ymin = d3.min([country_ymin,continent_ymin]);
        ymax = d3.max([country_ymax,continent_ymax]);
        padding  = (ymax - ymin)*0.05; 
        ymin-=padding;ymin=+ymin.toFixed(2);
        ymax+=padding;ymax=+ymax.toFixed(2);
    	y.domain([ ymin,ymax]);
        svg.selectAll(".y.axis").transition().duration(300).call(yAxis);
        svg.selectAll(".dot").transition().duration(300).attr("cy", function(d) { return y(d.value); });
		svg.selectAll(".line").transition().duration(300).attr("d", valueline(country_plotdata));
		
        svg.selectAll(".dot2").transition().duration(300)
                              .attr("cy", function(d) { return y(d.value); })
		                      .attr("r", 3.5);
        svg.selectAll(".line2").transition().duration(300)
                               .attr("d", valueline(continent_plotdata))
		                       .attr("stroke-width", 2);
		
        svg.selectAll(".dot3").transition().duration(300).attr("r", 0);
		svg.selectAll(".line3").transition().duration(300).attr("stroke-width", 0);
        
        
    }
    else if( continentIsON == 0 && globalIsON==1) {
        ymin = d3.min([country_ymin,global_ymin]);
        ymax = d3.max([country_ymax,global_ymax]);
        padding  = (ymax - ymin)*0.05; 
        ymin-=padding;ymin=+ymin.toFixed(2);
        ymax+=padding;ymax=+ymax.toFixed(2);
    	y.domain([ ymin,ymax]);
        svg.selectAll(".y.axis").transition().duration(300).call(yAxis);
        svg.selectAll(".dot").transition().duration(300).attr("cy", function(d) { return y(d.value); });
		svg.selectAll(".line").transition().duration(300).attr("d", valueline(country_plotdata));
		
        svg.selectAll(".dot2").transition().duration(300).attr("r", 0);
		svg.selectAll(".line2").transition().duration(300).attr("stroke-width", 0);
		
        svg.selectAll(".dot3").transition().duration(300)
                              .attr("cy", function(d) { return y(d.value); })
		                      .attr("r", 3.5);

        svg.selectAll(".line3").transition().duration(300)
                               .attr("d", valueline(global_plotdata))
                               .attr("stroke-width", 2);
    }
    else {
        ymin = d3.min([country_ymin,global_ymin,continent_ymin]);
        ymax = d3.max([country_ymax,global_ymax,continent_ymax]);
        padding  = (ymax - ymin) *0.05;  
        ymin-=padding;ymin=+ymin.toFixed(2);
        ymax+=padding;ymax=+ymax.toFixed(2);
    	y.domain([ ymin,ymax]);
        svg.selectAll(".y.axis").transition().duration(300).call(yAxis);
        svg.selectAll(".dot").transition().duration(300).attr("cy", function(d) { return y(d.value); });
		svg.selectAll(".line").transition().duration(300).attr("d", valueline(country_plotdata));
		
        svg.selectAll(".line2").transition().duration(300)
                               .attr("d", valueline(continent_plotdata))
		                       .attr("stroke-width", 2);
        svg.selectAll(".dot2").transition().duration(300)
                              .attr("cy", function(d) { return y(d.value); })
		                      .attr("r", 3.5);
                              
        svg.selectAll(".line3").transition().duration(300)
                               .attr("d", valueline(global_plotdata))
		                       .attr("stroke-width", 2);
        svg.selectAll(".dot3").transition().duration(300)
                              .attr("cy", function(d) { return y(d.value); })
		                      .attr("r", 3.5);
		
    }
 };

     UpdateGraphOnClick() ;

dialogJQ.find("#global_checkbox").button();
dialogJQ.find("#global_checkbox").on("change", function() { 
     if(this.checked) {	
         globalIsON =1;
     }
     else {
        globalIsON=0;
     }
     UpdateGraphOnClick() ;
});



dialogJQ.find("#continent_checkbox").button();
dialogJQ.find("#continent_checkbox").on("change", function() {
     if(this.checked) {	
         continentIsON =1;
     }
     else {
        continentIsON=0;
     }
     UpdateGraphOnClick() ;
});
	
    // Add the paths.
    svg.append("path")
       .attr("d", valueline(country_plotdata))
	   .attr("class", "line")
       .attr("stroke",  data_colors.range()[dataset_index])
       .attr("stroke-width", 2)
       .attr("fill", "none");
      

    svg.append("path")
       .attr("d", valueline(continent_plotdata))
	   .attr("class", "line2")
       .attr("stroke",  data_colors.range()[dataset_index])
       .attr("stroke-width", 0)
       .attr("fill", "none")
       .style("stroke-dasharray", ("3, 3"));   
    
    svg.append("path")
       .attr("d", valueline(global_plotdata))
	   .attr("class", "line3")
       .attr("stroke",  "black")
       .attr("stroke-width", 0)
       .attr("fill", "none")
       .style("stroke-dasharray", ("5, 5"));   

    
    // Add the scatterplots
    svg.selectAll("dot")
        .data(country_plotdata)
        .enter().append("circle")
		.attr("class", "dot")
        .attr("r", 3.5)
        .attr("cx", function(d) { return x(d.year); })
        .attr("cy", function(d) { return y(d.value); })
        .on("mouseover",function(d){
             svg.append("rect")
                .attr("id","tooltip2")
                .style("position", "absolute")
                .attr("x", function() { 
                                         if (x(d.year)<350)
                                         {  
                                               return x(d.year) -12
                                         }
                                         else{
                                               return x(d.year) -170
                                         }
                                       })
                .attr("y", y(d.value) + 10)
                .attr("rx", 10)
                .attr("ry", 10)
                .attr("width", 200)
                .attr("height", 25)
                .style("fill","#999999")  
         
            svg.append("text")
               .attr("id","tooltip")
               .style("position", "absolute")
                .attr("x", function() { 
                                         if (x(d.year)<350)
                                         {  
                                               return x(d.year) -5
                                         }
                                         else{
                                               return x(d.year) -160
                                         }
                                       })
               .attr("y", y(d.value) +25)
               .text("["+ "Value:"+ (d.value).toFixed(2)  +","+"Year:"+d.year+ "]")
        })
        .on("mouseout", function() {d3.select("#tooltip").remove(), d3.select("#tooltip2").remove()}) ;  
    

    svg.selectAll("dot2")
        .data(continent_plotdata)
        .enter().append("circle")
		.attr("class", "dot2")
		.attr("fill", "grey")
		.attr("stroke", "grey")
        .attr("r", 0)
        .attr("cx", function(d) { return x(d.year); })
        //.attr("cy", function(d) { return y(d.value); })
        .on("mouseover",function(d){
             svg.append("rect")
                .attr("id","tooltip2")
                .style("position", "absolute")
                .attr("x", function() { 
                                         if (x(d.year)<350)
                                         {  
                                               return x(d.year) -12
                                         }
                                         else{
                                               return x(d.year) -170
                                         }
                                       })
                .attr("y", y(d.value) + 10)
                .attr("rx", 10)
                .attr("ry", 10)
                .attr("width", 200)
                .attr("height", 25)
                .attr("font-size", 14)
                .style("fill","#999999")  
         
            svg.append("text")
               .attr("id","tooltip")
               .style("position", "absolute")
                .attr("x", function() { 
                                         if (x(d.year)<350)
                                         {  
                                               return x(d.year) -5
                                         }
                                         else{
                                               return x(d.year) -160
                                         }
                                       })
               .attr("y", y(d.value) +25)
               .text("["+ "Value:"+ (d.value).toFixed(2)  +","+"Year:"+d.year+ "]")
        })
        .on("mouseout", function() {d3.select("#tooltip").remove(), d3.select("#tooltip2").remove()}) ;  
    
    svg.selectAll("dot3")
        .data(global_plotdata)
        .enter().append("circle")
		.attr("class", "dot3")
		.attr("fill", "black")
		.attr("stroke", "black")
        .attr("r", 0)
        .attr("cx", function(d) { return x(d.year); })
        //.attr("cy", function(d) { return y(d.value); })
        .on("mouseover",function(d){
             svg.append("rect")
                .attr("id","tooltip2")
                .style("position", "absolute")
                .attr("x", function() { 
                                         if (x(d.year)<350)
                                         {  
                                               return x(d.year) -12
                                         }
                                         else{
                                               return x(d.year) -170
                                         }
                                       })
                .attr("y", y(d.value) + 10)
                .attr("rx", 10)
                .attr("ry", 10)
                .attr("width", 200)
                .attr("height", 25)
                .attr("font-size", 14)
                .style("fill","#999999")  
         
            svg.append("text")
               .attr("id","tooltip")
               .style("position", "absolute")
                .attr("x", function() { 
                                         if (x(d.year)<350)
                                         {  
                                               return x(d.year) -5
                                         }
                                         else{
                                               return x(d.year) -160
                                         }
                                       })
               .attr("y", y(d.value) +25)
               .text("["+ "Value:"+ (d.value).toFixed(2)  +","+"Year:"+d.year+ "]")
        })
        .on("mouseout", function() {d3.select("#tooltip").remove(), d3.select("#tooltip2").remove()}) ;  
  // x-axis
	svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);
    /*.append("text")
      .attr("class", "label")
      .attr("x", width/2)
      .attr("y", 40)
      .style("text-anchor", "middle")
	  .style("font-weight","bold")
	  .style("font-size","12px")
      .text("Year");*/

  // y-axis
  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
	  .attr("y", -60)
	  .attr("x", -height/2)
      .attr("dy", "-.11em")
      .style("text-anchor", "middle")
	  .style("font-size","10px")
      .text(subtypes[dataset_index].prettyname);
	  

};




(function(){
	var _yearnum = null;
	updateUIForYearNum = function(yearnum) {
		_yearnum = yearnum;
		currentYearIndex = yearnum-1;
		$("#slider").slider("value", yearnum);
		$(document).trigger("update");
	};
	$(document).on("update", function(){
		var year = yearForYearNum(_yearnum);
		$("#timelabel").text(year);
		updateMapStylesForYear(year);
        UpdateStats();
        UpdateLegend();
	});

	$(document).on("remove", function() {
		$("#slider").hide();
		$("#saturationlegend").hide();
		clearCountryColors();
	});

	$(document).on("slider_update", function() {
		console.log("slide update " + selected);

		$("#slider").show();
		$("#slider").slider("option", "max", maxYearNum()+1);
    	$("#slider").children(".ui-slider-handle").css("width", (975/points_per_year[selected].length - 1)+"px");
		$("#slider").slider("value", 0);
		
		var svg = d3.select("#chartsvg");
		var width = 975;
		var height = 100;
		var barPadding = 3;
		var yScale = d3.scale.linear()
					.domain([0, 200])
					.range([0, height-5]);
		
		svg.selectAll("rect")
			.data(points_per_year[selected])
			.exit()
			.remove();
		
		svg.selectAll("rect")
			.data(points_per_year[selected])
			.enter()
			.append("rect")
			.attr("x", function(d, i) {
			  return i * (width / (points_per_year[selected].length));
			})
			.attr("y", function(d) {
			  return height-yScale(d);
			})
			.attr("width", width / (points_per_year[selected].length) - barPadding)
			.attr("height", function(d) {
			  return yScale(d);
			})
			.attr("fill", function(d) {
				return data_colors(selected);
			});
		
		svg.selectAll("rect")
			.data(points_per_year[selected])
			.transition()
			//.append("rect")
			.attr("x", function(d, i) {
			  return i * (width / (points_per_year[selected].length));
			})
			.attr("y", function(d) {
			  return height-yScale(d);
			})
			.attr("width", width / (points_per_year[selected].length) - barPadding)
			.attr("height", function(d) {
			  return yScale(d);
			})
			.attr("fill", function(d) {
				return data_colors(selected);
			});
	});

	var _playTimeout = null;
	playFunction = function() {
		if (_playTimeout == null) {
			$("#play").button("option", {
				label: "pause",
				icons: {
					primary: "ui-icon-pause"
				}
			});
		}
		_playTimeout = setTimeout(playFunction, 500);
		
		updateUIForYearNum(_yearnum < years_by_index[selected].length-1 ? _yearnum+1 : 0);
	};
	pauseFunction = function() {
		if (_playTimeout != null) {
			clearTimeout(_playTimeout);
			_playTimeout = null;
			
			};
            $("#play").button("option", {
				label: "play",
				icons: {
					primary: "ui-icon-play"
				} });
		}
	
    resetFunction = function(){

        if (_playTimeout != null) {
			clearTimeout(_playTimeout);
			_playTimeout = null;
            $("#play").button("option", {
				label: "play",
				icons: {
					primary: "ui-icon-play"
				}
			});
        }     
               updateUIForYearNum(0);
        };
    nextFunction = function(){

        if (_playTimeout != null) {
			clearTimeout(_playTimeout);
			_playTimeout = null;
            $("#play").button("option", {
				label: "play",
				icons: {
					primary: "ui-icon-play"
				}
			});
        }      
                
               updateUIForYearNum(_yearnum +1 < years_by_index[selected].length ? _yearnum+1 : 0);
        };
        
    previousFunction = function(){

        if (_playTimeout != null) {
			clearTimeout(_playTimeout);
			_playTimeout = null;
            $("#play").button("option", {
				label: "play",
				icons: {
					primary: "ui-icon-play"
				}
			});
        }      
        updateUIForYearNum(_yearnum -1 >=0? _yearnum-1 :years_by_index[selected].length-1);
         
               
        };
})();

Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};

yellINeedToLoad();

$(function(){
	$("#filename").button();
	$("#filename").change(function(e) {
		var ext = $("input#filename").val().split(".").pop().toLowerCase();
		var filename = $("input#filename").val().split(".")[0].split("\\").pop();

        if(availableIndex() == -1) {
            alert('Up to 10 datasets allowed');
			this.value = null;
			return false;
        }

		if($.inArray(ext, ["json"]) == -1) {
			alert('Only JSON files are accepted');
			this.value = null;
			return false;
		}
	
		if(e.target.files != undefined) {
			var reader = new FileReader();
			reader.onload = function(e) {
				selected = availableIndex();
				index_available[selected] = false;
				var data = $.parseJSON(e.target.result);
				
				dataset[selected] = data.sort(function(a, b){
					if(a.year != b.year) {
						return a.year - b.year;
					}
				});
						
				for(var i=0; i<dataset[selected].length; i++) {
					if(iso_code_to_name(dataset[selected][i].country) == "") {
						dataset[selected].remove(i);
						i--;
					}
				}
						
				var firstyear = dataset[selected][0].year;
				years_by_index[selected] = [];
				points_per_year[selected] = [];
		
				for(var i=0; i<dataset[selected].length; i++) {
					var row = dataset[selected][i];

					row.yearnum = years_by_index[selected].length;
					var lastyear = (years_by_index[selected].length > 0 ? years_by_index[selected][maxYearIndex()] : null);
					if(lastyear == null || row.year != lastyear.year) {
						years_by_index[selected].push({year: row.year, yearnum: row.yearnum});
						points_per_year[selected].push(1);
					} else {
						points_per_year[selected][points_per_year[selected].length-1]++;
					}
					row.yearindex = maxYearIndex();
					row.scalefactors = {};
				}				
				//console.log(JSON.stringify(years_by_index[selected]));
				
				subtypes.push({name: "value", prettyname: filename, color: data_colors(selected), id: selected});
				currentSubtypeSet = subtypes[selected];
				for(var i=0; i<subtypes.length; i++) {
					if(i != selected) {
						$('label[for="'+ i +'"]').css("color", data_colors(i));
						$('label[for="'+ i +'"]').css("background-color", "#eee");
					}
				}
				//Initialize dataset for continents
				dataset_Continent[selected] = [];
				for( var i=0; i<=maxYearIndex(); i++){
				   for(var j=0; j<continents.length; j++){
					   var row = dataset_Continent[selected].push({continent: continents[j], value: -1, scalefactors:-1, year: yearForYearIndex(i).year,yearindex: i, yearnum: i+1, valid:0 })
					}
				}
				//console.log(dataset_Continent);
				renormalizeData(currentSubtypeSet);
				
				var r = $('<input type="checkbox" class="datasets" id="' + selected + '" checked="checked"><label for="' + selected + '" style="margin-bottom:5px;margin-right:5px;padding-right:5px;background-color:' + data_colors(selected) + ';">' + filename + '</label>');	
        		$("#input_data").append(r);
				$("#" + selected).button({
				  icons: {
					secondary: "ui-icon-circle-close"
				  }
				});
				
				$(".ui-button-icon-secondary").click(function(event) {
					var index = $(this).parent().attr("for");
					if(!(index === undefined)) {
						dataset[index] = [];
						years_by_index[index] = [];
						index_available[index] = true;
						console.log("closed " + index);
						$(this).parent().remove();
						$("#"+index).remove();
						number_of_loaded_datasets--;
						if(index == selected)
							$(document).trigger("remove");
					}
					event.stopPropagation();
					return false;
				});
				
				$(".datasets").click(function() {
					if(selected == this.id) {
						$("#"+this.id).prop("checked", true);
						return;
					}
					
					selected = this.id;
					$('label[for="'+ selected +'"]').css("color", "white");
					$('label[for="'+ selected +'"]').css("background-color", data_colors(selected));
					
					for(var i=0; i<subtypes.length; i++) {
						if(i != selected) {
							$('label[for="'+ i +'"]').css("color", data_colors(i));
							$('label[for="'+ i +'"]').css("background-color", "#eee");
							$("#"+i).prop("checked", false);
						}
					}
					
					currentSubtypeSet = subtypes[selected];
					scheduleSubtypeChangeEvent();
				});
        		
				scheduleSubtypeChangeEvent();
			};
			
			reader.readAsText(e.target.files.item(0));
	
    		number_of_loaded_datasets++;
		}

		this.value = null;
	});

	$("#continent_radio").buttonset();
	$("#country").click(function() {
		
		  continent_selected=0;
          
          //console.log(yearForYearIndex(currentYearIndex+1).year)
		  updateMapStylesForYear(yearForYearIndex(currentYearIndex+1).year);
		
		  // $("#globecontainer").fadeOut(1000, function() {
				   //setGlobeVelocity([0, 0, 0]);
		   //});
		   //$("#mapcontainer").fadeIn(1000);
	});
	$("#continent").click(function() {
		
		 continent_selected=1;
         //         console.log(yearForYearIndex(currentYearIndex+1).year)
		 updateMapStylesForYear(yearForYearIndex(currentYearIndex+1).year);

		   //if (!($("#globec7ontainer").is(":visible"))) setGlobeAngle([0, -30, 0]);
		  // setGlobeVelocity([0.01, 0, 0]);
		  // $("#mapcontainer").fadeOut(1000);
		  // $("#globecontainer").fadeIn(1000);
	});
	//$("#mapcontainer").fadeIn(1000);
	
	// Activate tooltips
	$(".country").tooltip({
		position: {
			my: "left+15 center",
			at: "right center"
		}
	});
	
	// Set up map selectors
	$("#mapradio").buttonset();
	$("#mapradio_2d").click(function() {
		   $("#globecontainer").fadeOut(1000, function() {
				   setGlobeVelocity([0, 0, 0]);
		   });
		   $("#mapcontainer").fadeIn(1000);
		   $("#uicontainer").css("top", "0px");
	});
	$("#mapradio_globe").click(function() {
		   if (!($("#globec7ontainer").is(":visible"))) setGlobeAngle([0, -30, 0]);
		   setGlobeVelocity([0.01, 0, 0]);
		   $("#mapcontainer").fadeOut(1000);
		   $("#globecontainer").fadeIn(1000);
		   $("#uicontainer").css("top", "120px");
	});
	$("#mapcontainer").fadeIn(1000);
	
	// Set up play/pause button
	$("#play").button({
		text: false,
		icons: {
			primary: "ui-icon-play"
		}
	}).click(function() {
		if ($(this).text() == "play") {
			playFunction();
		} else {
			pauseFunction();
		}
    });
	$("#reset").button({
		text: false,
		icons: {
			primary: "ui-icon-radio-off"
		}
	}).click(function() {
        resetFunction();
    });
    $("#previous").button({
		text: false,
		icons: {
			primary: "ui-icon-carat-1-w"
		}
	}).click(function() {
        previousFunction();
    });
    
    $("#next").button({
		text: false,
		icons: {
			primary: "ui-icon-carat-1-e"
		}
	}).click(function() {
        nextFunction();
    });
    
    $("#clear").button()
    	.click(function() {
    		for(var i=0; i<10; i++) {
    			if(!index_available[i]) {
    				dataset[i] = [];
					years_by_index[i] = [];
					index_available[i] = true;
					console.log("closed " + i);
					number_of_loaded_datasets--;
    			}
    		}
    		$("#input_data").empty();
    		$(document).trigger("remove");
    	});
	// Set up toolbox buttons
	$("#summarybox").dialog({
		dialogClass: "summary_dialog",
		modal: false,
		autoOpen: true,
		resizable: true,
		draggable: true,
		show: true,
		height: 340,
		width: 450,
		title: "Summary",
        position:"right,top"
        //remove x button
        //http://stackoverflow.com/a/7920871
        //open: function(event, ui) { $(".ui-dialog-titlebar-close").hide(); }
	});
	$(".summary_dialog").children(".ui-dialog-titlebar").append("<span id='summary_toggle' class='ui-icon ui-icon-circle-minus' style='display:inline-block;float:right;cursor:pointer;'></span>");
	$("#summary_toggle").click(function() {
		if($(this).hasClass("ui-icon-circle-minus")) {
			$("#summarybox").hide();
			$(".summary_dialog").height(32);
			$(this).removeClass("ui-icon-circle-minus").addClass("ui-icon-circle-plus");
		} else {
			$("#summarybox").show();
			$(".summary_dialog").height($("#summarybox").height() +50);
			$(this).removeClass("ui-icon-circle-plus").addClass("ui-icon-circle-minus");
		}
	});
	$("#aboutbox").dialog({
		modal: true,
		autoOpen: false,
		resizable: false,
		draggable: false,
		show: true,
		height: 600,
		width: 855,
		position: "center",
		title: "About This Program"
	});
	$("#about").button({
		text:true
	}).click(function(event,ui){
		$("#aboutbox").dialog("open");
	});
	
	$("#subtypecontainer").dialog({
		dialogClass: "input_dialog",
		modal: false,
		autoOpen: true,
		resizable: true,
		draggable: true,
		show: true,
		height: 200,
		width: 400,
		position: "top,left",
		title: "Datasets",
		open: function(event, ui) {
			$(".input_dialog").children(".ui-dialog-titlebar").append("<div id='continent_radio' style='display:inline-block;margin-left:45px;'><input type='radio' id='country' name='continent_radio' checked='checked'><label for='country'>country</label><input type='radio' id='continent' name='continent_radio'><label for='continent'>continent</label></div>");
		
		}
	});
	$(".input_dialog").children(".ui-dialog-titlebar").append("<span id='input_toggle' class='ui-icon ui-icon-circle-minus' style='margin-top:8px;inline-block;float:right;cursor:pointer;'></span>");
	$("#input_toggle").click(function() {
		if($(this).hasClass("ui-icon-circle-minus")) {
			$("#subtypecontainer").hide();
			$(".input_dialog").height(45);
			$(this).removeClass("ui-icon-circle-minus").addClass("ui-icon-circle-plus");
		} else {
			$("#subtypecontainer").show();
			$(".input_dialog").height($("#subtypecontainer").height() + 60);
			$(this).removeClass("ui-icon-circle-plus").addClass("ui-icon-circle-minus");
		}
	});
	
	$("#continent_radio").buttonset();
	$("#country").click(function() {
		
		  continent_selected=0;
          
          console.log(yearForYearIndex(currentYearIndex+1).year)
		  updateMapStylesForYear(yearForYearIndex(currentYearIndex+1).year);
		
		  // $("#globecontainer").fadeOut(1000, function() {
				   //setGlobeVelocity([0, 0, 0]);
		   //});
		   //$("#mapcontainer").fadeIn(1000);
	});
	$("#continent").click(function() {
		
		 continent_selected=1;
                  console.log(yearForYearIndex(currentYearIndex+1).year)
		 updateMapStylesForYear(yearForYearIndex(currentYearIndex+1).year);

		   //if (!($("#globec7ontainer").is(":visible"))) setGlobeAngle([0, -30, 0]);
		  // setGlobeVelocity([0.01, 0, 0]);
		  // $("#mapcontainer").fadeOut(1000);
		  // $("#globecontainer").fadeIn(1000);
	});
	
	selected = 0;
	filename="Military Expenditure (% of GDP)";
	UpdateStats();
	
	var r = $('<input type="checkbox" class="datasets" id="' + selected + '" checked="checked"><label for="' + selected + '" style="margin-bottom:5px;margin-right:5px;padding-right:5px;background-color:' + data_colors(selected) + ';">' + filename + '</label>');	
	$("#input_data").append(r);
	$("#" + selected).button({
      icons: {
        secondary: "ui-icon-circle-close"
      }
    });
    
    selected = 1;
    filename = "Pump price for gasoine (US$ per liter)";
    UpdateStats();
    
    var r2 = $('<input type="checkbox" class="datasets" id="1"><label for="1" style="margin-bottom:5px;margin-right:5px;padding-right:5px;background-color:' + data_colors(1) + ';">' + filename + '</label>');	
	$("#input_data").append(r2);
	$("#1").button({
      icons: {
        secondary: "ui-icon-circle-close"
      }
    });
	
	selected = 2;
	filename = "Research and developement expenditure (% of GDP)";
	UpdateStats();
	
	var r3 = $('<input type="checkbox" class="datasets" id="2"><label for="2" style="margin-bottom:5px;margin-right:5px;padding-right:5px;background-color:' + data_colors(2) + ';">' + filename + '</label>');	
	$("#input_data").append(r3);
	$("#2").button({
      icons: {
        secondary: "ui-icon-circle-close"
      }
    });
	
	selected = 0;
	currentSubtypeSet = subtypes[selected];
	
	for(var i=0; i<subtypes.length; i++) {
		if(i != selected) {
			$('label[for="'+ i +'"]').css("color", data_colors(i));
			$('label[for="'+ i +'"]').css("background-color", "#eee");
		}
	}
	
	$(".ui-button-icon-secondary").click(function(event) {
		var index = $(this).parent().attr("for");
		if(!(index === undefined)) {
			dataset[index] = [];
			years_by_index[index] = [];
			index_available[index] = true;
			console.log("closed " + index);
			$(this).parent().remove();
			$("#"+index).remove();
			number_of_loaded_datasets--;
			if(index == selected)
				$(document).trigger("remove");
		}
		event.stopPropagation();
		return false;
	});
	
	$(".datasets").click(function() {
		if(selected == this.id) {
			$("#"+this.id).prop("checked", true);
			return;
		}
		
		selected = this.id;
		$('label[for="'+ selected +'"]').css("color", "white");
		$('label[for="'+ selected +'"]').css("background-color", data_colors(selected));
		
		for(var i=0; i<subtypes.length; i++) {
			if(i != selected) {
				$('label[for="'+ i +'"]').css("color", data_colors(i));
				$('label[for="'+ i +'"]').css("background-color", "#eee");
				$("#"+i).prop("checked", false);
			}
		}
		
		currentSubtypeSet = subtypes[selected];
		scheduleSubtypeChangeEvent();
	});
	
	// Set up slider
	$("#slider").slider({
		min: 0,
		max: maxYearNum()+1,
		step: 1,
		slide: function( event, ui ) {
			console.log(ui.value);
			console.log("Max = " + $("#slider").slider("option", "max"));
			if(ui.value == $("#slider").slider("option", "max")) {
				$("#slider").children(".ui-slider-handle").blur();
				//$("#next").click();
				//updateUIForYearNum(0);
				resetFunction();
			} else {
				updateUIForYearNum(ui.value);
			}
			pauseFunction();
		}
	}).slider("value", 0);
	
	$("#slider").children(".ui-slider-handle").css("width", (975/points_per_year[selected].length - 1)+"px");
	
	/*console.log("slider svg");
	var slider_svg = d3.select("#slider")
		.append("svg")
		.attr("width", 1100)
		.attr("height", 100)
		.attr("z-index", 500);*/
	
	//console.log(slider_svg);
	
	
	
	var svg = d3.select("#chartsvg");
	var width = 975;
	var height = 100;
	var barPadding = 3;
	var yScale = d3.scale.linear()
				.domain([0, 200])
				.range([0, height-5]);
	
	svg.append("text")
		.style("position", "absolute")
		.attr("x", 980)
		.attr("y", 50)
		.text("Countries with");
	
	svg.append("text")
		.style("position", "absolute")
		.attr("x", 980)
		.attr("y", 65)
		.text("reported data");
		
	svg.append("text")
		.style("position", "absolute")
		.attr("x", 980)
		.attr("y", 15)
		.text("100%");
		
	svg.append("text")
		.style("position", "absolute")
		.attr("x", 980)
		.attr("y", 95)
		.text("0%");
		
	svg.selectAll("rect")
		.data(points_per_year[selected])
		.enter()
		.append("rect")
		.attr("x", function(d, i) {
		  return i * (width / (points_per_year[selected].length));
		})
		.attr("y", function(d) {
		  return height-yScale(d);
		})
		.attr("width", width / (points_per_year[selected].length) - barPadding)
		.attr("height", function(d) {
		  return yScale(d);
		})
		.attr("fill", function(d) {
			return data_colors(selected);
		});
	
	$(".data_dialog").click(function() {
		console.log(this);
		var index = $(this).children(".ui-dialog-content").attr('id').slice(-1);
		console.log("Dialog click " + index);
		$(this).children(".ui-dialog-titlebar").css("background", "#eee");
		$(this).children(".ui-dialog-titlebar").children("span").css("color", data_colors(index));
	});
	
	var dialogJQ = null;
	$(".country").click(function(){
		if (dialogJQ != null) dialogJQ.dialog("close");
		pauseFunction();
		
		var countryCode = d3.select(this).attr("countryCode");
		var updateChartFunction;
		dialogJQ = $("<div class='countryPopoutDialog' id='graphdialog'></div>");
		//dialogJQ.append($("<div class='xLabel'>Years</div>"));
        //dialogJQ.append($("<div class='yLabel'>"+currentSubtypeSet.prettyname+"</div>"));
		

        //set up svg for graph
        var margin = {top: 10, right: 20, bottom: 20, left: 70},
                    width = 750 - margin.left - margin.right,
                    height = ($(window).height() - 200 - margin.top - margin.bottom)/number_of_loaded_datasets;
      
        //Create a svg array 
        var svgs = new Array(number_of_loaded_datasets);
		
        var solidLine = $("<div class = 'LINE1' id = 'NEWLINE1' style='display:inline-block;'><svg width='87' height='24'><line x1='40' y1='20' x2='80' y2='20' style='stroke:black; stroke-width:1px;'></svg><label for='solidLine'>Country Line(solid)</label></div>");
		dialogJQ.append(solidLine);
		var dashedLine = $("<div class = 'LINE2' id = 'NEWLINE2' style='display:inline-block;'><svg width='85' height='24'><line x1='40' y1='20' x2='80' y2='20' style='stroke:black; stroke-width:1px;stroke-dasharray: 3,3;'></svg><label for='dashedLine'> Continent Average </label></div>");
		dialogJQ.prepend(dashedLine);
		var globalLine = $("<div class = ' LINE3' id = 'NEWLINE3' style='display:inline-block;'><svg width='96' height='24'><line x1='40' y1='20' x2='80' y2='20' style='stroke:black; stroke-width:1px;stroke-dasharray: 7,7;'></svg><label for='globalLine'> Global Average </label></div>");
		dialogJQ.prepend(globalLine);
		
	    var continent_checkbox = $("<input type='checkbox' id='continent_checkbox'><label for='continent_checkbox'> Show continent average</label>");
	    var global_checkbox = $("<input type='checkbox' id='global_checkbox' ><label for='global_checkbox'> Show global average</label>");
		
		var avg_div = $("<div id='avg_div' style='display:block;'></div>");
		avg_div.prepend(global_checkbox);
		avg_div.prepend(continent_checkbox);
		dialogJQ.prepend(avg_div);
		
		//var continent_checkbox = $("<input type='checkbox' id='continent_checkbox' checked><label for='continent_checkbox'> Show continent average</label>");
		//dialogJQ.prepend(continent_checkbox);
       //set up continent checkbox only once.
        //Generate first the graph for the selected datasets.
        svgs[0] = d3.select(dialogJQ.get()[0])
                    .append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform", 
                    "translate(" + margin.left + "," + margin.top + ")");
         
        GenerateGraph(dialogJQ,svgs[0],width,height,countryCode,selected);
        for(var j=0;j<number_of_loaded_datasets;j++)
        {
            if(j==selected)
                continue;


            svgs[j] = d3.select(dialogJQ.get()[0])
                    .append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform", 
                    "translate(" + margin.left + "," + margin.top + ")");
            GenerateGraph(dialogJQ,svgs[j],width,height,countryCode,j);
       } 

		dialogJQ.dialog({
		    resizable: false,
            draggable: true,
            modal:true,
			title: iso_code_to_name(countryCode),
			minWidth: 850,
			minHeight: 415,
           maxWidth: 850,
			width: 850,
			height: $(window).height(),
			close: function(event, ui) {
				//$(document).unbind("update", updateChartFunction);
                dialogJQ.find("#continent_checkbox").removeAttr("id");
                dialogJQ.find("#global_checkbox").removeAttr("id");
				dialogJQ = null;
			}
		});
      
	});
		
	selected = 0;
	currentSubtypeSet = subtypes[selected];
    $("#mapradio_2d").trigger("click");
	scheduleSubtypeChangeEvent();
	yellImDoneLoading();
});


UpdateLegend = function () {
   BinColors=[];
   for(i=0;i<4;++i) {
        var value_normalized = SelectBin(i/4);
        var fillcolor = $.Color("#FFFFFF");
        var subtype = currentSubtypeSet;
    
        
        var tintcolor = $.Color("transparent").transition($.Color(subtype.color), value_normalized);
        var color = Color_mixer.mix(tintcolor,fillcolor);
        BinColors.push(color.toHexString());
    }

    table ="<table  class=\"legend\" >"

	for(var i=0; i<3; i++) {
		console.log(i);
	    table +="<td style=\"padding:5px 5px 5px 5px;\" bgcolor="+ BinColors[i]+ "> [" + BinBoundaries(i)[0].toFixed(2) + " - " + BinBoundaries(i)[1].toFixed(2)  +") </td>" 
    }
    //table +="<td style=\"padding:5px 5px 5px 5px;\" bgcolor="+ BinColors[1]+"> [" + BinBoundaries(1)[0].toFixed(2) + " - " + BinBoundaries(1)[1].toFixed(2)  +") </td>" 
    table +="<td style=\"padding:5px 5px 5px 5px;\" bgcolor="+ BinColors[3]+"> [" + BinBoundaries(3)[0].toFixed(2) + " - " + BinBoundaries(3)[1].toFixed(2)  +"] </td>" 
    
    
    table+="</table>"
    document.getElementById('saturationlegend').innerHTML = table;   
	$("#saturationlegend").show();
}
