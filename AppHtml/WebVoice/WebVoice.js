// Namespace Object
if (!dfcc) {
    var dfcc = {};
}

// Constructor
dfcc.WebVoice = function WebVoice(sName, oPrnt) {
    // Configure Superclass
    dfcc.WebVoice.base.constructor.apply(this, arguments);
    
    // Define properties
    this.prop(df.tString, "psText", "");
    
    // Private properties
    this._eResult = null;
};

df.defineClass("dfcc.WebVoice", "df.WebButton", {
    // Control functions and logic go here

    openHtml: function(aHtml) {
        // forward send
        dfcc.WebVoice.base.openHtml.call(this, aHtml);

    },

    closeHtml: function(aHtml) {
        // forward send
        dfcc.WebVoice.base.closeHtml.call(this, aHtml);

    },


    /*
    Event handler for the OnClick event of the button. It fires the OnClick event of the framework which 
    is usually handled on the server.
    
    @param  oEvent  Event object (df.events.DOMEvent).
    @private
    */
    onBtnClick : function(oEvent){
        var tTimer = null, bDone = false, eElem = this._eElem;
        var self = this;
        
        if(this.isEnabled()){
            df.dom.addClass(eElem, df.CssHit);
            tTimer = setTimeout(function(){
                if(bDone){
                    df.dom.removeClass(eElem, df.CssHit);
                }
                tTimer = null;
            }, df.hitTimeout);
    
            this.fire('OnClick', [], function(oEvent){
                //  Determine if a view needs to be loaded
                if(!oEvent.bCanceled){
                    try {
                        var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
                        var recognition = new SpeechRecognition();
                    } catch(e) {
                        console.error(e);
                    }
                    
                    recognition.onresult = function(event) {
                        var current = event.resultIndex;
                        var transcript = event.results[current][0].transcript;
                        
                        console.log(transcript);
                        self.onResponse(transcript)
                    };
                    
                    recognition.start();
                    setTimeout(function() {
                        recognition.stop();
                    }, 3000);
                
                
                    if(this.psLoadViewOnClick){
                        this.getWebApp().showView(this.psLoadViewOnClick, false);
                    }
                }
    
                if(!tTimer){
                    df.dom.removeClass(eElem, df.CssHit);
                }
                bDone = true;
            });
            oEvent.stop();
        }
    },
    
    onResponse: function(text) {
        this.serverAction("OnResponse", [text]);

    },
    
    speak: function(utterance) {
        let synth = window.speechSynthesis;
        speech = new SpeechSynthesisUtterance(utterance);
        synth.speak(speech);
    }

});