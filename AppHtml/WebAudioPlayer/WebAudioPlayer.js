// Namespace Object
if (!dfcc) {
    var dfcc = {};
}

// Constructor
dfcc.WebAudioPlayer = function WebAudioPlayer(sName, oPrnt) {
    // Configure Superclass
    dfcc.WebAudioPlayer.base.constructor.apply(this, arguments);

    // Define property
    this.prop(df.tString, "psAudioStream", "");

    // Private property
    this._psAudioStream = "";
    //this._eElem = null;
    this._eResult = null;

};

df.defineClass("dfcc.WebAudioPlayer", "df.WebObject", {
    // Control functions and logic go here

    openHtml: function(aHtml) {
        // forward send
        dfcc.WebAudioPlayer.base.openHtml.call(this, aHtml);

//        aHtml.push('<div class="WebAudioPlayer-wrp">');
//        aHtml.push('REC');
//        aHtml.push('</div>');
    },

    closeHtml: function(aHtml) {
        // forward send
        dfcc.WebAudioPlayer.base.closeHtml.call(this, aHtml);

    },

    
    /*
    dfcc.tAudioStruct = {
        psAudioStream: df.tString
    },
    */
    deserializeAudioVT: df.sys.vt.generateDeserializer(df.tString),

    doPlayAudio: function(audio) {
        //console.log(audio);
        //var tAudio = this.deserializeAudioVT(audio);

        //const audioBlob = new Blob(audio);
        //const audioUrl = URL.createObjectURL(audio);
        //const audioOut = new Audio(audioUrl);
        //audioOut.play();


        const audioOut = new Audio();
        audioOut.src = 'data:audio/mpeg-3;base64,' + audio; //btoa(unescape(encodeURIComponent(audio)));
        audioOut.load();
        audioOut.play();
    },


    set_psAudioStream: function(bVal) {
        //if (this._)
    },

    get_psValue : function() {
        var psAudioStream = this._psAudioStream;
        return psAudioStream;
    }

});