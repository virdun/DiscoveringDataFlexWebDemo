/*
Class:
    df.WebDatePicker
Extends:
    df.WebBaseDEO

This is the client-side representation of the cWebDatePicker class. It renders a datepicker control 
directly into the form. This datepicker will behave like a data entry object and display its value 
by highlighting the date it in the datepicker. The datepicker is rendered by the df.DatePicker 
class which is instantiated as sub object (_oPicker).

Revision:
    2012/04/02  (HW, DAW) 
        Initial version.
*/
df.WebDatePicker = function WebDatePicker(sName, oParent){
    df.WebDatePicker.base.constructor.call(this, sName, oParent);

    this._sControlClass = "WebDatePicker";
};
df.defineClass("df.WebDatePicker", "df.WebBaseDEO",{



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
        }
    }
    
    this._iLastDisplayYear = this._iDisplayYear;
    this._iLastDisplayMonth = this._iDisplayMonth;
}



});




