/*
Class:
    df.WebDatePickerMosaic
Extends:
    df.WebDatePicker

This is the client-side representation of the WebDatePickerMosaic class.
It adds the option to style each day separately

Revision:
    2023/01/27  (JB, FRONT-IOT) 
        Initial version.
*/
df.WebDatePickerMosaic = function WebDatePickerMosaic(sName, oParent){
    df.WebDatePickerMosaic.base.constructor.call(this, sName, oParent);
    this.prop(df.tString, "psJsonDateColors", "{}"); // {"2023-01-24": "green", "2023-01-19": "red"}
    this.prop(df.tString, "psSelectedMonth", ""); // '2023-01-01'
    this.event("OnMonthChanged", df.cCallModeWait);

    this._sControlClass = "WebDatePickerMosaic WebDatePicker"; // Adding WebDatePicker here gives us the styling
    this.addSync("psSelectedMonth");
};
df.defineClass("df.WebDatePickerMosaic", "df.WebDatePicker",{

// - - - Control API - - -



/*
This method forwards the after rendering call to the date picker object. It gets references to DOM
elements and attach event handlers.


/*
This method renders the actual calendar. It will generate the HTML of the calendar table using the 
JavaScript Date object to determine the dates. If the month has changed it will add the new table to 
the DOM and set the CSS classes so that the change can be animated using CSS3 transitions. If the 
newly generated month is the same as the previous month it simply replaces the content of the body 
element to display the newly generated month.

@private
*/
displayCalendar : function(){
    var iDay, iDayPointer, aHtml = [], sCSS, dToday, dEnd, dDate, iRows, iYear, iMonth, eNew, eOld;
    
    if(!this._eBody){
        return;
    }
    
    aHtml.push('<div><table>');
    
    //  Generate dates
    iYear = this._iDisplayYear;
    iMonth = this._iDisplayMonth;
    var currentMonth=('0'+(iMonth+1)).slice(-2);
    this.psSelectedMonth = (iYear + '-' + currentMonth + '-01');
    
    dToday = new Date();
    dDate = new Date(iYear, iMonth, 1, 1, 1, 1);
    dEnd = new Date(iYear, (iMonth + 1), 1, 1, 1, 1);
    
    //  Header
    aHtml.push('<tr class="WebDP_BodyHead">');
    if(this.pbShowWeekNr){
        aHtml.push('<th class="WebDP_WeekNr">', this.getWebApp().getTrans("wk"), '</th>');
    }
    for(iDay = 0; iDay < 7; iDay++){
        sCSS = "";
        
        iDayPointer = (iDay + this.piStartWeekAt > 6 ? iDay + this.piStartWeekAt - 7 : iDay + this.piStartWeekAt);
        if(iDayPointer === 0 || iDayPointer === 6){
            sCSS = "WebDP_Weekend";
        }
        
        aHtml.push('<th class="', sCSS, '">', this.getDay(iDay, true), '</th>');
    }
    aHtml.push('</tr>');
    
    //  Calculate start date
    iDayPointer = dDate.getDay() - this.piStartWeekAt;
    if(iDayPointer < 0){
        iDayPointer = 7 + iDayPointer;
    }
    dDate.setDate(dDate.getDate() - iDayPointer);
    iDayPointer = 0;
    iRows = 0;
    
    
    //  Loop through the days
    aHtml.push('<tr>');
    
    while(dDate < dEnd || (iDayPointer < 7 && iDayPointer !== 0) || iRows < 6){
        
    
        //  Add weeknr & correct daypointer if needed
        if(iDayPointer === 0 || iDayPointer > 6){
            if(iRows > 0){
                aHtml.push('</tr><tr>');
            }
        
            iRows++;
            if(this.pbShowWeekNr){
                aHtml.push('<td class="WebDP_WeekNr">', df.sys.data.dateToWeek(dDate), '</td>');
            }
            iDayPointer = 0;
        }
        
        //  Determine styles
        sCSS = "WebDP_Day";
        if(dDate.getMonth() !== iMonth){
            sCSS += (sCSS !== "" ? " " : "") + "WebDP_Overflow";
        }
        if(dDate.getDay() === 0|| dDate.getDay() === 6){
            sCSS += (sCSS !== "" ? " " : "") + "WebDP_Weekend";
        }
        if(dDate.getDate() === this._dSelected.getDate() && dDate.getMonth() === this._dSelected.getMonth() && dDate.getFullYear() === this._dSelected.getFullYear()){
            sCSS += (sCSS !== "" ? " " : "") + "WebDP_Selected" + (this.bHasFocus ? " focussed" : "");
        }
        if(dDate.getDate() === dToday.getDate() && dDate.getMonth() === dToday.getMonth() && dDate.getFullYear() === dToday.getFullYear()){
            sCSS += (sCSS !== "" ? " " : "") + "WebDP_Today";
        }
        
        if (this.psJsonDateColors !== '{}') {
            const day = dDate.getDate();
            const month = dDate.getMonth() + 1; // Return Value is 0 indexed
            const year = dDate.getFullYear();

            //var sDate = dDate.toISOString();
            //var asDate = sDate.split('T');
            var sDatePart = year + '-' + ('0' + month).slice(-2) + '-' + ('0' + day).slice(-2);
            if (JSON.parse(this.psJsonDateColors)[sDatePart]) {
                sCSS += (sCSS !== "" ? " " : "") + JSON.parse(this.psJsonDateColors)[sDatePart];
            }
        }

        //  Generate day cell
        aHtml.push('<td class="', sCSS, '" data-date="', dDate.getDate(), '" data-month="', dDate.getMonth(), '" data-year="', dDate.getFullYear(), '">', dDate.getDate(), '</td>');
        
        //  Move to the next day
        dDate.setDate(dDate.getDate() + 1);
        iDayPointer++;
    }
        
    aHtml.push('</table></div>');
    
    //  Only use animation when moving to different month
    if(this._iLastDisplayYear === this._iDisplayYear && this._iLastDisplayMonth === this._iDisplayMonth){
        this._eBody.innerHTML = aHtml.join('');
    }else{
        
        //  Clean old month
        eOld = df.dom.query(this._eBody, ".WebDP_Old");
        if(eOld){
            this._eBody.removeChild(eOld);
        }
        
        //  Create new month
        eNew = df.dom.create(aHtml.join(''));
        eOld = this._eBody.firstChild;
        
        if(eOld){
            //  Fix dimensions for animation
            eOld.firstChild.style.width = eOld.firstChild.clientWidth + "px";
            eOld.firstChild.style.height = eOld.firstChild.clientHeight + "px";
            
            //  Set animation initial class
            df.dom.addClass(eOld, "WebDP_Old");
        }
        //  Add new month
        this._eBody.appendChild(eNew);
        //  Set animation target class
        if(eOld){
            df.dom.addClass(eOld, ((this._iLastDisplayYear < this._iDisplayYear ||  (this._iLastDisplayYear === this._iDisplayYear && this._iLastDisplayMonth < this._iDisplayMonth)) ? "WebDP_HideNext" : "WebDP_HidePrev"));
            this.fireMonthChanged();
        }
    }
    
    this._iLastDisplayYear = this._iDisplayYear;
    this._iLastDisplayMonth = this._iDisplayMonth;
},

/* 
Fires the onMonthChanged event.

@private
*/
fireMonthChanged : function(){
    this.fire("OnMonthChanged", [ this.get('psValue') ]);
},


/*
This setter updates the current value of the component. It will first update the internal typed 
values and then update the displayed value according to the proper masking rules.

@param sVal The new value.
*/
set_psJsonDateColors : function(sVal){
    this.psJsonDateColors = sVal;
    this.displayCalendar();
    
    //  If a new value is set we assume that errors don't apply any more
    if(!this._bRendering){
        this.hideAllControlErrors();
    }
},

currentMonth : function() {
    //  Generate dates
    iYear = this._iDisplayYear;
    iMonth = this._iDisplayMonth;

    var currentMonth=('0'+(iMonth+1)).slice(-2);
    return (iYear + '-' + currentMonth + '-01');
}

});




