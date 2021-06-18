// Namespace Object
if (!dfcc) {
    var dfcc = {};
}

// Constructor
dfcc.WebAudioRecorder = function WebAudioRecorder(sName, oPrnt) {
    // Configure Superclass
    dfcc.WebAudioRecorder.base.constructor.apply(this, arguments);

    // Define property
    this.prop(df.tString, "psAudioStream", "");
    this.prop(df.iInteger, "piRecordingTime", 3000);

    // Private property
    this._psAudioStream = "";
    //this._eElem = null;
    this._eResult = null;

};

df.defineClass("dfcc.WebAudioRecorder", "df.WebButton", {
    // Control functions and logic go here

    openHtml: function(aHtml) {
        // forward send
        dfcc.WebAudioRecorder.base.openHtml.call(this, aHtml);

//        aHtml.push('<div class="WebAudioRecorder-wrp">');
//        aHtml.push('REC');
//        aHtml.push('</div>');
    },

    closeHtml: function(aHtml) {
        // forward send
        dfcc.WebAudioRecorder.base.closeHtml.call(this, aHtml);

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
                if (!oEvent.bCanceled) {
                
                
                try {
                  var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
                  var recognition = new SpeechRecognition();
                }
                catch(e) {
                  console.error(e);
                  //$('.no-browser-support').show();
                  //$('.app').hide();
                }
                
//                recognition.onstart = function() { 
//                  instructions.text('Voice recognition activated. Try speaking into the microphone.');
//                }
//                
//                recognition.onspeechend = function() {
//                  instructions.text('You were quiet for a while so voice recognition turned itself off.');
//                }
//                
//                recognition.onerror = function(event) {
//                  if(event.error == 'no-speech') {
//                    instructions.text('No speech was detected. Try again.');  
//                  };
//                }
                
                
                
                recognition.onresult = function(event) {

                  // event is a SpeechRecognitionEvent object.
                  // It holds all the lines we have captured so far. 
                  // We only need the current one.
                  var current = event.resultIndex;
                
                  // Get a transcript of what was said.
                  var transcript = event.results[current][0].transcript;
                
                  // Add the current transcript to the contents of our Note.
                  noteContent += transcript;
                  noteTextarea.val(noteContent);
                }
                
                
//                    navigator.mediaDevices.getUserMedia({ audio: true })
//                    .then(stream => {
//                        const mediaRecorder = new MediaRecorder(stream);
//                        mediaRecorder.start();
//                    
//                        const audioChunks = [];
//                    
//                        mediaRecorder.addEventListener("dataavailable", event => {
//                            audioChunks.push(event.data);
//                        });
//                        
//                        mediaRecorder.addEventListener("stop", () => {
//                            console.log(typeof(audioChunks));
//                            console.log(audioChunks);
//                            const audioBlob = new Blob(audioChunks, {type:'audio/mpeg-3'});
//                            console.log(typeof(audioBlob));
//                            console.log(audioBlob);
//                            const audioUrl = URL.createObjectURL(audioBlob);
//                            console.log(typeof(audioUrl));
//                            console.log(audioUrl);
//                            //const audioBuffer = await blob.arrayBuffer();
//                            //const audioString = new Uint8Array(audioBuffer);
//                            //console.log(chars);
//                            const audio = new Audio(audioUrl);
//                            console.log(typeof(audio));
//                            console.log(audio);
//                            //audio.play();
//                            //self.doAddRecordedValue(audioString);
//                            
//                            
//                            let fileReader = new FileReader();
//                            fileReader.readAsArrayBuffer(audioBlob);
//                            //fileReader.readAsText(audioBlob);
//                            fileReader.onload = function(event) {
//                                let audioBuffer = fileReader.result;
//                                console.log(typeof(audioBuffer));
//                                console.log(audioBuffer);
//                                //let audioString = fileReader.result;
//                                //const audioString = new Uint8Array(audioBuffer);
//                                //self.doAddRecordedValue(audioString);
//                                
//                                
//                                //------------------
//                                
//                                    //console.log(audio);
//                                    //var tAudio = this.deserializeAudioVT(audio);
//                            
//                                    const audioBlob = new Blob(audioBuffer);
//                                    console.log(typeof(audioBlob));
//                                    console.log(audioBlob);
//                                    const audioUrl = URL.createObjectURL(audioBlob);
//                                    console.log(typeof(audioUrl));
//                                    console.log(audioUrl);
//                                    //const audioUrl = URL.createObjectURL(audioString);
//                                    const audio1 = new Audio(audioUrl);
//                                    console.log(typeof(audio1));
//                                    console.log(audio1);
//                                    audio1.play();
//                            
//                            
//                                    const audioOut = new Audio();
//                                    audioOut.src = 'data:audio/mpeg-3;base64,' + audioString; //btoa(unescape(encodeURIComponent(audio)));
//                                    audioOut.load();
//                                    audioOut.play();
//                                    
//        
//                            };
//                            
//                        });
//                        
//                        setTimeout(() => {
//                            mediaRecorder.stop();
//                        }, self.piRecordingTime);
//                    });
                    recognition.start();
                    setTimeout(recognition.stop(), self.piRecordingTime);
                }
    
                if (!tTimer) {
                    df.dom.removeClass(eElem, df.CssHit);
                }
                bDone = true;
            });
            oEvent.stop();
        }
    },
    
    /*
    dfcc.tAudioStruct = {
        psAudioStream: df.tString
    },
    */
    serializeAudioVT: df.sys.vt.generateSerializer(df.tString),

    doAddRecordedValue: function(audio) {
        //console.log(audio);
        var tAudio = this.serializeAudioVT(audio);
        this.serverAction("AddRecordedValue", ['test'], tAudio, function() {
            // Optional
        });
    },


    set_psAudioStream: function(bVal) {
        //if (this._)
    },

    get_psValue : function() {
        var psAudioStream = this._psAudioStream;
        return psAudioStream;
    }

});