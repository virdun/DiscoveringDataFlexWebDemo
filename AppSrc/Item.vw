// C:\DataFlex Projects\DiscoveringDataFlexWebDemo\AppSrc\Item.vw
// Item
//

Use DFClient.pkg
Use DFEntry.pkg
Use cDbTextEdit.pkg
Use cUtils.pkg

Use clocationDataDictionary.dd
Use cDefaultLocationDataDictionary.dd
Use citemDataDictionary.dd
Use dfBitmap.pkg
Use cWebView2Browser.pkg
Use Windows.pkg
Use File_dlg.pkg

ACTIVATE_VIEW Activate_oItem FOR oItem
Object oItem is a dbView
    Set Location to 5 5
    Set Size to 274 662
    Set Label To "Item"
    Set Border_Style to Border_Thick


    Object olocation_DD is a clocationDataDictionary
    End_Object 

    Object oDefaultLocation_DD is a cDefaultLocationDataDictionary
    End_Object 

    Object oitem_DD is a citemDataDictionary
        Set DDO_Server to olocation_DD
        Set DDO_Server to oDefaultLocation_DD
        
        Procedure OnPostFind Integer eMessage Boolean bFound
            Send RefreshImage of oWebView2Browser1
        End_Procedure
    End_Object 

    Set Main_DD To oitem_DD
    Set Server  To oitem_DD



    Object oitemName is a dbForm
        Entry_Item item.Name
        Set Size to 12 457
        Set Location to 5 43
        Set peAnchors to anTopLeftRight
        Set Label to "Name"
        Set Label_Justification_mode to jMode_Left
        Set Label_Col_Offset to 38
        Set Label_row_Offset to 0
    End_Object 

    Object oitemDescription is a cDbTextEdit
        Entry_Item item.Description
        Set Size to 80 407
        Set Location to 19 43
        Set peAnchors to anTopLeftRight
        Set Label to "Description"
        Set Label_Justification_mode to jMode_Left
        Set Label_Col_Offset to 38
        Set Label_row_Offset to 0
    End_Object 

    Object oitemCategory is a dbForm
        Entry_Item item.Category
        Set Size to 12 333
        Set Location to 101 43
        Set peAnchors to anTopLeftRight
        Set Label to "Category"
        Set Label_Justification_mode to jMode_Left
        Set Label_Col_Offset to 38
        Set Label_row_Offset to 0
    End_Object 

    Object oitemExpirationDate is a dbForm
        Entry_Item item.ExpirationDate
        Set Size to 12 66
        Set Location to 101 429
        Set peAnchors to anTopRight
        Set Label to "ExpirationDate"
        Set Label_Justification_mode to jMode_Left
        Set Label_Col_Offset to 48
        Set Label_row_Offset to 0
    End_Object 

    Object oitemCreated is a dbForm
        Entry_Item item.Created
        Set Size to 12 369
        Set Location to 115 43
        Set peAnchors to anTopLeftRight
        Set Label to "Created"
        Set Label_Justification_mode to jMode_Left
        Set Label_Col_Offset to 38
        Set Label_row_Offset to 0
    End_Object 

    Object oDefaultLocationName is a dbForm
        Entry_Item DefaultLocation.Name
        Set Size to 12 186
        Set Location to 115 471
        Set peAnchors to anTopRight
        Set Label to "Default Location"
        Set Label_Justification_mode to jMode_Left
        Set Label_Col_Offset to 54
        Set Label_row_Offset to 0
    End_Object 

    Object oOpenDialog1 is a OpenDialog
    
        // Call up the Open Dialog via:
    //    Get Show_Dialog {of object} to BooleanVariable
    
    End_Object

    Object oWebView2Browser1 is a cWebView2Browser
        Set Size to 85 307
        Set Location to 157 43
        Set psLocationURL to "C:\DataFlex Projects\DiscoveringDataFlexWebDemo\Data\Uploads\2\805e34e5f8a317c8_800x800ar.jpg"
        
        Procedure RefreshImage
            String sPath sFileName sValue
            Boolean bFileExists
            
            If (Item.ID > 0) Begin
                Get psDataPath of (phoWorkspace(ghoApplication)) to sPath
                File_Exist (sPath + "\Uploads") bFileExists
                If (not(bFileExists)) Make_Directory (sPath + "\Uploads")
                Move (sPath + "\Uploads") to sPath
                
                File_Exist (sPath + "\" + String(Item.ID)) bFileExists
                If (not(bFileExists)) Make_Directory (sPath + "\" + String(Item.ID))
                Move (sPath + "\" + String(Item.ID)) to sPath
                
//                Send RegisterDownloadFolder of ghoWebResourceManager sPath
                
                Move False to bFileExists
                Direct_Input ("dir: " + sPath)
                Repeat
                    Readln sFileName
                    If (sFileName <> "" and sFileName <> "[.]" and sFileName <> "[..]") Begin
                      Move (sPath + "\" + sFileName) to sValue
                        Move True to bFileExists
                        //Get DownloadURL of ghoWebResourceManager (sPath + "\" + sFileName) to sValue
                    End
                Until (SeqEof)
                Close_Input ("dir: " + sPath)
                
                If (not(bFileExists)) Move ('https://source.unsplash.com/random/800x800/?img=' + String(Item.ID)) to sValue
                Set psLocationURL of oWebView2Browser1 to sValue
            End

        End_Procedure
    End_Object

    Object oButton1 is a Button
        Set Location to 141 43
        Set Label to 'File'
    
        // fires when the button is clicked
        Procedure OnClick
            Boolean bOpen bReadOnly
            String sFileTitle sFileName
            String[] sSelectedFiles
         
            Get Show_Dialog of oOpenDialog1 to bOpen
            If bOpen Begin
                Get TickReadOnly_State of oOpenDialog1 to bReadOnly
                Get File_Title of oOpenDialog1 to sFileTitle
                Get Selected_Files of oOpenDialog1 to sSelectedFiles
                Move sSelectedFiles[0] to sFileName
                
                
                String sPath
                Boolean bFileExists
                Integer iItemID
                
                Get Field_Current_Value of oitem_DD Field Item.ID to iItemID
                // Determine local path based on workspace setting
                Get psDataPath of (phoWorkspace(ghoApplication)) to sPath
                File_Exist (sPath + "\Uploads") bFileExists
                If (not(bFileExists)) Make_Directory (sPath + "\Uploads")
                Move (sPath + "\Uploads") to sPath
                
                File_Exist (sPath + "\" + String(iItemID)) bFileExists
                If (not(bFileExists)) Make_Directory (sPath + "\" + String(iItemID))
                Move (sPath + "\" + String(iItemID)) to sPath
                
//                Send RegisterDownloadFolder of oItemResourceManager sPath
                
                EraseFile (sPath + "\*.*")
                
                //Move (sPath + "\" + sFileName) to sPath
                
                CopyFile sFileName to sPath
                
                Send RefreshImage of oWebView2Browser1
                
//                If (bReadOnly) ;
//                    Move (sFileName + ' (Read-Only)') to sFileName
//                Send Info_Box ;
//                    ("File Title=" + sFileTitle + "\nFile Name=" + sFileName)
            End
            Else ;
                Send Info_Box "You did NOT choose a file"
        End_Procedure
    
    End_Object

End_Object 
