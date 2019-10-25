//////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////
//
//
//
//                           openHarmony Library v0.07
//
//
//         Developped by Mathieu Chaptel, ...
//
//
//   This library is an open source implementation of a Document Object Model
//   for Toonboom Harmony. It also implements patterns similar to JQuery
//   for traversing this DOM.
//
//   Its intended purpose is to simplify and streamline toonboom scripting to
//   empower users and be easy on newcomers, with default parameters values,
//   and by hiding the heavy lifting required by the official API.
//
//   This library is provided as is and is a work in progress. As such, not every
//   function has been implemented or is garanteed to work. Feel free to contribute
//   improvements to its official github. If you do make sure you follow the provided
//   template and naming conventions and document your new methods properly.
//
//   This library doesn't overwrite any of the objects and classes of the official
//   Toonboom API which must remains available.
//
//
//   To use, add the line 'include("openHarmony.js")' at the start of your script
//   and include this file in the same folder.
//
//
//   This library is made available under the MIT license.
//   https://opensource.org/licenses/mit
//
//   The repository for this library is available at the address:
//   https://github.com/cfourney/OpenHarmony/
//
//
//   For any requests feel free to contact m.chaptel@gmail.com
//
//
//
//
//////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////
 
 
/*
// Class template
 
//////////////////////////////////////
//////////////////////////////////////
//                                  //
//                                  //
//          oTemplate class         //
//                                  //
//                                  //
//////////////////////////////////////
//////////////////////////////////////
 
// Constructor
//
// oTemplate (prop1, prop2)
//
// Properties
//
// double prop1
// double prop2
//
// Methods
//
// double getSum(double num)
 
 
// oTemplate constructor
 
function oTemplate (prop1, prop2){
    this.prop1 = prop1;
    this.prop2 = prop2;
    var _privateVar = 'hello'
}
 
// oTemplate Object Properties
 
Object.defineProperty(oTemplate.prototype, 'prop3', {
    get : function(){
         return this.prop2+this.prop1
    },
 
    set : function(value){
        this.prop1 = value-this.prop2
    }
})
 
// oTemplate Class methods
 
// double getSum(double num)
 
oTemplate.prototype.getSum = function (num){
    debug.log(this.prop3)
    return this.prop3+num
}
 
*/
 
// include node view sorting library
include(specialFolders.resource+"/scripts/TB_orderNetworkUp.js")
 
 
//////////////////////////////////////
//////////////////////////////////////
//                                  //
//                                  //
//          oSearch class           //
//                                  //
//                                  //
//////////////////////////////////////
//////////////////////////////////////
 
// Properties
 
oSearch = function(){
}
 
oSearch.prototype.$ = function(search){
    // This will handle the searching logic within the class. This function can be implemented for a generic class and added to any subClass as a mixin.
 
    // Search synthax
    // Normal string will search the names
    // Prefix # will filter by type
    // Prefix . will search properties
    // Wildcard (*) should be implemented as incomplete search
    // Prefix > To return only the first result
 
}
 
 
 
//////////////////////////////////////
//////////////////////////////////////
//                                  //
//                                  //
//          oScene class            //
//                                  //
//                                  //
//////////////////////////////////////
//////////////////////////////////////
 
// Properties
//
// {[oNodes]}   nodes
// {[oColumns]} columns
// {[oPalettes]}palettes
// {int}        length
//
// Methods
//
// {oNode}      getNodeByName(string fullPath)
// {[oNode]}    getSelectedNodes(bool recurse)
// {oNode}      addNode(string type, string name, oPoint nodePosition, string group)
// {oColumn}    addColumn(string type, string name, element)
// {oElement}   addElement(string name, string imageFormat, string fieldGuide, string scanType)
// {oDrawingNode} addDrawingNode(name, group, nodePosition, element, drawingColumn)
// {oGroupNode} addGroup(string name, [oNode] includeNodes, string group, oPoint nodePosition, bool addComposite, bool addPeg)
// {oPalette}   importPalette(string filename, string name, string destination)
// {oTimeline}  getTimeline(string display)
// {[oNodes]}   importPSD(string filename, string group, oPoint nodePosition, bool separateLayers, bool addPeg, bool addComposite, string alignment)
// {oNode}      importQT (string filename, string group, oPoint nodePosition, bool extendScene, string alignment)
// {oNode}      mergeNodes ([oNode] nodes, string resultName, bool deleteMerged)
// {oNode}      $node(string fullPath)
 
 
function oScene(){
    // oScene.nodes property is a class property shared by all instances, so it can be passed by reference and always contain all nodes in the scene
 
    //var _topNode = new oNode("Top");
    //this.__proto__.nodes = _topNode.subNodes(true);
}
 
function getSceneDOM(){
    return new oScene();
}
 
 
// oScene Objects Properties
 
// Array oScene.nodes
// Contains the list of nodes present in the scene
 
Object.defineProperty(oScene.prototype, 'nodes', {
    get : function(){
        var _topNode = this.$node("Top");
        return _topNode.subNodes(true);
    }
})
 
 
// Array oScene.columns
// Contains the list of columns present in the scene
 
Object.defineProperty(oScene.prototype, 'columns', {
    get : function(){
        var _columns = [];
        for (var i=0; i<columns.numberOf(); i++){
            _columns.push(new oColumn(column.getName(i)));
        }
        return _columns;
    }
})
 
 
// Array oScene.palettes
// Contains the list of scene palettes present in the scene
 
Object.defineProperty(oScene.prototype, 'palettes', {
    get : function(){
        var _paletteList = PaletteObjectManager.getScenePaletteList();
        var _palettes = [];
        for (var i=0; i<_paletteList.numPalettes; i++){
            _palettes.push( new oPalette(_paletteList.getPaletteByIndex(i), this, _paletteList));
        }
        return _palettes;
    }
})
 
// NEW
// int length
// returns the length of the scene
 
Object.defineProperty(oScene.prototype, 'length', {
    get : function(){
        return frame.numberOf()
    },
   
    set : function (newLength){
        var _length = frame.numberOf();
        var _toAdd = newLength-_length;
        if (_toAdd>0){
            frame.insert(_length-1, _toAdd)
        }else{
            frame.remove(_length-1, _toAdd)
        }
    }
})
 
// oScene class methods
 
//NEW
// getNodeByPath(string fullPath)
 
oScene.prototype.getNodeByPath = function(fullPath){
    if (node.type(fullPath) == "") return null // TODO: remove this if we implement a .exists property for oNode
    if (node.type(fullPath) == "READ") return new oDrawingNode(fullPath, this)
    if (node.type(fullPath) == "PEG") return new oPegNode(fullPath, this)
    if (node.type(fullPath) == "GROUP") return new oGroupNode(fullPath, this)
    return new oNode(fullPath, this);
}
 
 
// NEW
// getSelectedNodes(bool recurse)
 
oScene.prototype.getSelectedNodes = function(recurse){
    if (typeof recurse === 'undefined') var recurse = false;
 
    var _selection = selection.selectedNodes();
 
    var _selectedNodes = [];
    for (var i = 0; i<_selection.length; i++){
 
        var _oNodeObject = this.$node(_selection[i])
       
        _selectedNodes.push(_oNodeObject)
        if (recurse && node.isGroup(_selection[i])){
            _selectedNodes = _selectedNodes.concat(_oNodeObject.subNodes(recurse))
        }
    }
   
    // sorting by timeline index
    var _timeline = this.getTimeline();
   
    _selectedNodes = _selectedNodes.sort(function(a, b){return a.timelineIndex(_timeline)-b.timelineIndex(_timeline)})
    return _selectedNodes;
}
 
 
// oNode addNode(string type, string name, string group, oPoint nodePosition)
 
oScene.prototype.addNode = function(type, name, group, nodePosition){
    // Defaults for optional parameters
    if (typeof group === 'undefined') var group = "Top"
    if (typeof nodePosition === 'undefined') var nodePosition = new oPoint(0,0,0);
    if (typeof name === 'undefined') var name = type[0]+type.slice(1).toLowerCase();
 
    var _nodePath = node.add(group, name, type, nodePosition.x, nodePosition.y, nodePosition.z)
    var _node = this.$node(_nodePath)
 
    return _node;
}
 
// NEW
// oColumn addColumn(string type, string name, element)
 
oScene.prototype.addColumn = function(type, name, oElementObject){
    // Defaults for optional parameters
    if (typeof name === 'undefined') var name = column.generateAnonymousName();
   
    var _increment = 1;
    var _columnName = name;
   
    // increment name if a column with that name already exists
    while (column.type(_columnName) != ""){
        _columnName = name+"_"+_increment;
        _increment++;
    }
   
    column.add(_columnName, type);
               
    var _column = new oColumn(_columnName)
 
    if (type == "DRAWING" && typeof oElementObject !== 'undefined'){
        oElementObject.column = this;// TODO: fix: this doesn't seem to actually work for some reason?
        MessageLog.trace("set element "+oElementObject.id+" to column "+_column.uniqueName)
        column.setElementIdOfDrawing(_column.uniqueName, oElementObject.id);
    }
 
    column.update();
    return _column;
}
 
// NEW
// oElement addElement(name, imageFormat, fieldGuide, scanType)
 
oScene.prototype.addElement = function(name, imageFormat, fieldGuide, scanType){
    // Defaults for optional parameters
    if (typeof scanType === 'undefined') var scanType = "COLOR";
    if (typeof fieldGuide === 'undefined') var fieldGuide = 12;
    if (typeof imageFormat === 'undefined') var imageFormat = "TVG";
 
    var _fileFormat = (imageFormat == "TVG")?"SCAN":imageFormat;
    var _vectorFormat = (imageFormat == "TVG")?imageFormat:"None";
 
    var _id = element.add(name, scanType, fieldGuide, _fileFormat, _vectorFormat);
    var _element = new oElement(_id)
 
    return _element;
}
 
 
// NEW
// oNode addDrawingNode(name, group, nodePosition, element, drawingColumn)
 
oScene.prototype.addDrawingNode = function(name, group, nodePosition, oElementObject, drawingColumn){
    // add drawing column and element if not passed as parameters
    if (typeof oElementObject === 'undefined') var oElementObject = this.addElement(name)
    if (typeof drawingColumn === 'undefined') var drawingColumn = this.addColumn("DRAWING", name, oElementObject)
       
    // Defaults for optional parameters
    if (typeof group === 'undefined') var group = "Top"
    if (typeof nodePosition === 'undefined') var nodePosition = new oPoint(0,0,0);
    if (typeof name === 'undefined') var name = type[0]+type.slice(1).toLowerCase();
   
    var _node = this.addNode("READ", name, group, nodePosition)
   
    // setup the node
    // setup animate mode/separate based on preferences?  
   
    _node.attributes.drawing.element.column = drawingColumn;
   
    return _node;
}
 
 
//NEW
// oNode addGroup(name, includeNodes, addComposite, addPeg, group, nodePosition))
 
oScene.prototype.addGroup = function(name, includeNodes, addComposite, addPeg, group, nodePosition){
    // Defaults for optional parameters
    if (typeof addPeg === 'undefined') var addPeg = false;
    if (typeof addComposite === 'undefined') var addComposite = false;
    if (typeof group === 'undefined') var group = "Top";
    if (typeof nodePosition === 'undefined') var nodePosition = new oPoint(0,0,0);
    if (typeof includeNodes === 'undefined') var includeNodes = [];
   
    var _group = this.addNode("GROUP", name, group, nodePosition)
   
    var _MPI = _group.multiportIn
    var _MPO = _group.multiportOut
 
    if (addComposite){
        var _composite = this.addNode("COMPOSITE", name+"_Composite", _group.fullPath)
        _composite.composite_mode = "Pass Through" //
        _composite.linkOutNode(_MPO);
    }
    if (addPeg){
        var _peg = this.addNode("PEG", name+"-P", _group.fullPath)
        _peg.linkInNode(_MPI)
    }
   
    if (includeNodes.length > 0){
        var _timeline = this.getTimeline()
        includeNodes.sort(function(a, b){return a.timelineIndex(_timeline)-b.timelineIndex(_timeline)})
       
        for (var i in includeNodes){
            var _node = includeNodes[i];
            var _nodeName = _node.name;
            node.moveToGroup(_node.fullPath, _group.fullPath)
           
           // updating the fullPath of the oNode objects passed by reference
            _node.fullPath = _group.fullPath+'/'+_nodeName;          
           
            if (addPeg){
                _node.unlinkInNode(_MPI)
                _node.linkInNode(_peg)
            }
        }
       
        // TODO: restore links that existed outside of the group
    }
   
    return _group;
}
 
// NEW
// oTimeline getTimeline(display)
 
oScene.prototype.getTimeline = function(display){
    if (typeof display === 'undefined') var display = '';
    return new oTimeline(display, this)
}


//NEW
// getPaletteByName(string name)
 
oScene.prototype.getPaletteByName = function(name){
    var _paletteList = PaletteObjectManager.getScenePaletteList();
    for (var i=0; i<_paletteList.numPalettes; i++){
        if (_paletteList.getPaletteByIndex(i).getName() == name)
        return new oPalette(_paletteList.getPaletteByIndex(i), this, _paletteList);
    }
    return null;
}
 
 
// NEW
// getSelectedNodes(bool recurse)
 
oScene.prototype.getSelectedPalette = function(){
    var _paletteList = PaletteManager.getScenePaletteList();
    var _id = PaletteManager.getCurrentPaletteId()
    var _palette = new oPalette(_paletteList.getPaletteById(_id), this, _paletteList);
    return _palette;
}

 
// NEW
// oPalette importPalette(filename, name, paletteStorage)
oScene.prototype.importPalette = function(filename, name, index, paletteStorage, storeInElement){
    if (typeof paletteStorage === 'undefined') var destination = "scene";
    if (typeof index === 'undefined') var index = 0;
   
    var _paletteFile = new oFile(filename)
    if (typeof name === 'undefined') var name = _paletteFile.name;
    if (typeof storeInElement === 'undefined'){
        if (paletteStorage == "element") throw "Element parameter cannot be omitted if palette destination is Element"
        var _element = 1;
    }
   
    var _list = PaletteObjectManager.getScenePaletteList();
    var _destination = ""
   
    switch (paletteStorage) {
        case "environnement" :
            _destination = PaletteObjectManager.Constants.Location.ENVIRONMENT;
            break;
        case "job" :
            _destination = PaletteObjectManager.Constants.Location.JOB;
            break;
        case "scene" :
            _destination = PaletteObjectManager.Constants.Location.SCENE;
            break;
        case "element" :
            _destination = PaletteObjectManager.Constants.Location.ELEMENT;
            var _element = storeInElement.id;
            break;
        case "external" :
            _destination = PaletteObjectManager.Constants.Location.EXTERNAL;
            break;
        default :
            break;
    }
   
    var _newPalette = list.insertPaletteAtLocation(_destination, _element, name, index)
   
    return new oPalette(_newPalette);
}
 
 
// NEW
// {[oNodes]} importPSD(filename, group, nodePosition, separateLayers, addPeg, addComposite, alignment)
 
oScene.prototype.importPSD = function(filename, group, nodePosition, separateLayers, addPeg, addComposite, alignment){
    if (typeof alignment === 'undefined') var alignment = "ASIS" // create an enum for alignments?
    if (typeof addComposite === 'undefined') var addComposite = true;
    if (typeof addPeg === 'undefined') var addPeg = true;
    if (typeof separateLayers === 'undefined') var separateLayers = true;
    if (typeof nodePosition === 'undefined') var nodePosition = new oPoint(0,0,0)
    if (typeof group === 'undefined') var group = "Top"
 
    var _psdFile = new oFile(filename)
    var _elementName = _psdFile.name
 
    var _xSpacing = 45
    var _ySpacing = 30  
   
    var _element = this.addElement(_elementName, "PSD")
    var _column = this.addColumn(_elementName, "DRAWING", _element)
   
    // save scene otherwise PSD is copied correctly into the element
    // but the TGA for each layer are not generated
    // TODO: how to go around this to avoid saving?
    scene.saveAll();
    var _drawing = _element.addDrawing(1);
   
    var _nodes = []
   
    if (addPeg) var _peg = this.addNode("PEG", _elementName+"-P", group, nodePosition)
    if (addComposite) var _comp = this.addNode("COMPOSITE", _elementName+"-Composite", group, nodePosition)
   
    // Import the PSD in the element
    CELIO.pasteImageFile({ src : filename, dst : { elementId : _element.id, exposure : _drawing.name}})
    var _layers = CELIO.getLayerInformation(filename);
   
    // create the nodes for each layer
    if (separateLayers){
       
        var _x = nodePosition.x - _layers.length/2*_xSpacing
        var _y = nodePosition.y - _layers.length/2*_ySpacing
       
        // TODO: discover and generate the groups present in the PSD
       
        for (var i in _layers){
            // generate nodes and set them to show the element for each layer
            var _layer = _layers[i].layer
            var _layerName = _layers[i].layerName.split(" ").join("_")
            var _nodePosition = new oPoint(_x+=_xSpacing, _y +=_ySpacing, 0)
           
            //TODO: set into right group according to PSD organisation
           
            var _group = group //"Top/"+_layers[i].layerPathComponents.join("/");
 
            var _node = this.addDrawingNode(_layerName, _group, _nodePosition, _element)
 
            _node.enabled = _layers[i].visible
            _node.can_animate = false // use general pref?
            _node.apply_matte_to_color = "Straight"
            _node.alignment_rule = alignment
           
            _node.attributes.drawing.element.setValue(_layer != ""?"1:"+_layer:1, 1)
            _node.attributes.drawing.element.column.extendExposures();
 
            if (addPeg) _node.linkInNode(_peg)
            if (addComposite) _node.linkOutNode(_comp)
 
            _nodes.push(_node)
        }
    }
   
    if (addPeg){
        _peg.centerAbove(_nodes, 0, -_ySpacing )
        _nodes.push(_peg)
    }
     
    if (addComposite){
        _comp.centerBelow(_nodes, 0, _ySpacing )
        _nodes.push(_comp)
    }
    // TODO how to display only one node with the whole file
   
    return _nodes
}
 
// NEW
// {oNode} importQT (filename, group, nodePosition, extendScene, alignment)
 
oScene.prototype.importQT = function(filename, group, nodePosition, extendScene, alignment){
    if (typeof alignment === 'undefined') var alignment = "ASIS";
    if (typeof extendScene === 'undefined') var extendScene = true;
    if (typeof nodePosition === 'undefined') var nodePosition = new oPoint(0,0,0);
    if (typeof group === 'undefined') var group = "Top";
    // MessageLog.trace("importing QT file :"+filename)
 
    var _QTFile = new oFile(filename);
    var _elementName = _QTFile.name;
   
    var _element = this.addElement(_elementName, "PNG");
    var _qtNode = this.addDrawingNode(_elementName, group, nodePosition, _element);
    var _column = _qtNode.attributes.drawing.element.column;
    _element.column = _column;
   
    // setup the node
    _qtNode.can_animate = false;
    _qtNode.alignment_rule = alignment;
   
    //MessageLog.trace("node: "+_qtNode.name+" element: "+_element.name+" column: "+_column.uniqueName)
   
    var _tempFolder = scene.tempProjectPathRemapped () + "/movImport/" + _elementName
    var _audioPath = _tempFolder + "/" + _elementName + ".wav"
 
    // setup import
    MovieImport.setMovieFilename(_QTFile.path);
    MovieImport.setImageFolder(_tempFolder);
    MovieImport.setImagePrefix(_elementName);
    MovieImport.setAudioFile(_audioPath);
    MovieImport.doImport();
   
    if (extendScene && this.length < MovieImport.numberOfImages()) this.length = MovieImport.numberOfImages();
   
    // create expositions on the node
    for (var i = 1; i <= MovieImport.numberOfImages(); i++ ) {
        // move the frame into the drawing
        var _framePath = _tempFolder + '/'+_elementName+'-' + i + '.png';
        var _drawing = _element.addDrawing(i, i, _framePath)
    }
   
    // creating an audio column for the sound
    if ( MovieImport.isAudioFileCreated() ){
        var _soundName = _elementName + "_sound";
        var _soundColumn = this.addColumn("SOUND", _soundName);
        column.importSound( _soundColumn.name, 1, _audioPath);
    }
 
    return _qtNode;
}
 
// NEW
// oNode mergeNodes (nodes, resultName, deleteMerged)
 
oScene.prototype.mergeNodes = function (nodes, resultName, deleteMerged){
    // TODO: is there a way to do this without Action.perform?
    // pass a oNode object as argument for destination node instead of name/group?
   
    if (typeof resultName === 'undefined') var resultName = nodes[0].name+"_merged"
    if (typeof group === 'undefined') var group = nodes[0].path;
    if (typeof deleteMerged === 'undefined') var deleteMerged = true;
   
    // only merge READ nodes so we filter out other nodes from parameters
    nodes = nodes.filter(function(x){return x.type == "READ"})
   
    var _timeline = this.getTimeline()
    nodes = nodes.sort(function(a, b){return a.timelineIndex(_timeline) - b.timelineIndex(_timeline)})
       
    // create a new destination node for the merged result
    var _mergedNode = this.addDrawingNode(resultName);
    
    // connect the node to the scene base composite, TODO: handle better placement
    // also TODO: check that the composite is connected to the display currently active
    // also TODO: disable pegs that affect the nodes but that we don't want to merge
    var _composite = this.nodes.filter(function(x){return x.type == "COMPOSITE"})[0]
   
    _mergedNode.linkOutNode(_composite);
   
    // get  the individual keys of all nodes
    var _keys = []
    for (var i in nodes){
        var _timings = nodes[i].timings;
        var _frameNumbers = _keys.map(function (x){return x.frameNumber})
        for (var j in _timings){
            if (_frameNumbers.indexOf(_timings[j].frameNumber) == -1) _keys.push(_timings[j])
        }
    }
    
   
    // sort frame objects by frameNumber
    _keys = _keys.sort(function(a, b){return a.frameNumber - b.frameNumber})
   
    // create an empty drawing for each exposure of the nodes to be merged
    for (var i in _keys){
        var _frame = _keys[i].frameNumber
        _mergedNode.element.addDrawing(_frame)
 
        // copy paste the content of each of the nodes onto the mergedNode
        // code inspired by Bake_Parent_to_Drawings v1.2 from Yu Ueda (raindropmoment.com)
        frame.setCurrent( _frame );
 
        Action.perform("onActionChooseSelectTool()", "cameraView");
        for (var j=nodes.length-1; j>=0; j--){
            //if (nodes[j].attributes.drawing.element.frames[_frame].isBlank) continue;
           
            DrawingTools.setCurrentDrawingFromNodeName( nodes[j].fullPath, _frame );
            Action.perform("selectAll()", "cameraView");
           
            // select all and check. If empty, operation ends for the current frame
            if (Action.validate("copy()", "cameraView").enabled){
                Action.perform("copy()", "cameraView");
                DrawingTools.setCurrentDrawingFromNodeName( _mergedNode.fullPath, _frame );
                Action.perform("paste()", "cameraView");
            }
        }
    }
   
    _mergedNode.attributes.drawing.element.column.extendExposures();
    _mergedNode.placeAtCenter(nodes)
    
    // connect to the same composite as the first node, at the same place
    // delete nodes that were merged if parameter is specified
    if (deleteMerged){
        for (var i in nodes){
            nodes[i].remove();
        }

    }
    return _mergedNode
}
 
 
//oScene short notation methods
 
oScene.prototype.$node = function(fullPath){
    return this.getNodeByPath(fullPath)
}
 
 
//////////////////////////////////////
//////////////////////////////////////
//                                  //
//                                  //
//         oTimeline class          //
//                                  //
//                                  //
//////////////////////////////////////
//////////////////////////////////////
 
// Constructor
//
// oTimeline(string display)
//
// Properties
//
// array layers
//
// Methods
//
 
// oTimeline constructor
 
function oTimeline(display, oSceneObject){
    this.display = display
    this.composition = ''
    this.scene = oSceneObject;
   
    if (node.type(this.display) == '') {
        this.composition = compositionOrder.buildDefaultCompositionOrder()
    }else{
        this.composition = compositionOrder.buildCompositionOrderForDisplay(display)
    }
   
}
 
// Properties
 
 
// array layers
 
Object.defineProperty(oTimeline.prototype, 'layers', {
    get : function(){
        var _timeline = this.layersList;
        var _scene = this.scene;
       
        _timeline = _timeline.map(function(x){return _scene.$node(x)})
       
        return _timeline;
    }
})
 
//NEW
 
// array layersList
 
Object.defineProperty(oTimeline.prototype, 'layersList', {
    get : function(){
        var _composition = this.composition
        var _timeline = [];
       
        for (var i in _composition){
            _timeline.push(_composition[i].node)
        }
       
        return _timeline;
    }
})
 
 
 
//////////////////////////////////////
//////////////////////////////////////
//                                  //
//                                  //
//           oNode class            //
//                                  //
//                                  //
//////////////////////////////////////
//////////////////////////////////////
 
// Constructor
//
// oNode(string path)
//
// Properties
//
// string fullPath
// string name
// string path
// bool enabled
// bool locked
// array attributes
// point nodePosition
// int x
// int y
// int z
// int width
// int height
// array inNodes
// array outNodes
//
// Methods
//
// void linkInNode(oNode oNodeObject, int inPort, int outPort)
// void linkOutNode(oNode oNodeObject, int outPort, int inPort)
// array subNodes(bool recurse)
// oBox getBounds()
// void centerAbove(array oNodeArray, int offset)
 
// NEW
// oNode constructor
 
function oNode(path, oSceneObject){
    this.fullPath = path;
    this.type = node.type(this.fullPath)
    this.scene = oSceneObject;
    
    // generate properties from node attributes to allow for dot notation access
     var _attributes = this.attributes
     
    // for each attribute, create a getter setter as a property of the node object 
    // that handles the animated/not animated duality
    
    for (var i in _attributes){
        var _attr = _attributes[i]
        
         // create getter setters only for attributes without subattributes, 
         // otherwise create an object to host the subattributes getter setters
        if (_attr.subAttributes.length ==  0){
            this.setAttrGetterSetter(_attr)
        }else{
            var _keyword = _attr.keyword.toLowerCase()
            var _dest = this[_keyword] = {};
            for (var j in _attr.subAttributes){
                this.setAttrGetterSetter(_attr.subAttributes[j], _dest)
            }
        }
    }
   
}
 
//NEW
// setAttrGetterSetter      private function to create attributes setters and getters as properties of the node

oNode.prototype.setAttrGetterSetter = function (attr, context){
    if (typeof context === 'undefined') context = this; 
    //MessageLog.trace("Setting getter setters for attribute: "+attr.keyword+" of node: "+this.name)

    var _keyword = attr.shortKeyword.toLowerCase();
    // hard coding a fix for 3DPath attribute name which starts with a number
    if (_keyword == "3dpath") _keyword = "path3d"

    Object.defineProperty(context, _keyword, {
        get : function(){
            //MessageLog.trace("getting attribute "+attr.keyword+". animated: "+(attr.column != null))
            // if attribute has animation, return the frames
            if (attr.column != null) return attr.frames
            // otherwise return the value
            return attr.getValue()
        },
       
        set : function(newValue){
            //MessageLog.trace("setting attribute "+attr.keyword+" to value: ")
            // if attribute has animation, passed value must be a frame object
            if (attr.column != null) {
                if (!newValue instanceof oFrame) throw "must pass an oFrame object to set an animated attribute"
                attr.setValue(newValue.value, newValue.frameNumber)
            }else{          
                return attr.setValue(newValue)
            }
        }
    })
}
 
 
// oNode Object Properties
 
// String name
 
Object.defineProperty(oNode.prototype, 'name', {
    get : function(){
         return node.getName(this.fullPath)
    },
 
    set : function(newName){
        var _parent = node.parentNode(this.fullPath)
        var _node = node.rename(this.fullPath, newName)
        this.fullPath = _parent+'/'+newName;
    }
 
})
 
 
// String path
 
Object.defineProperty(oNode.prototype, 'path', {
    get : function(){
         return node.parentNode(this.fullPath)
    },
 
    set : function(newPath){
        // TODO: make moveNode() method?
        var _name = this.name
        node.moveToGroup(this.fullPath, newPath)
        this.fullPath = newPath + '/' + _name;
    }
 
})
 
 
// bool enabled
 
Object.defineProperty(oNode.prototype, 'enabled', {
    get : function(){
         return node.getEnable(this.fullPath)
    },
 
    set : function(enabled){
         node.setEnable(this.fullPath, enabled)
    }
})
 
 
// bool locked
 
Object.defineProperty(oNode.prototype, 'locked', {
    get : function(){
         return node.getLocked(this.fullPath)
    },
 
    set : function(locked){
         node.setLocked(this.fullPath, locked)
    }
})
 
 
// NEW
// bool root
 
Object.defineProperty(oNode.prototype, 'isRoot', {
    get : function(){
         return this.fullPath == "Top"
    }
})


// NEW
// point nodePosition
 
Object.defineProperty(oNode.prototype, 'nodePosition', {
    get : function(){
        //MessageLog.trace("getting node position of node "+this.name)
         return new oPoint(node.coordX(this.fullPath), node.coordY(this.fullPath), node.coordZ(this.fullPath))
    },
 
    set : function(newPosition){
        //MessageLog.trace("setting node position of node "+this.name+" to "+JSON.stringify(newPosition))
        node.setCoord(this.fullPath, newPosition.x, newPosition.y, newPosition.y)
    }
})
 
 
// NEW
// int x
 
Object.defineProperty(oNode.prototype, 'x', {
    get : function(){
         return node.coordX(this.fullPath)
    },
 
    set : function(x){
        var _pos = this.nodePosition;
        node.setCoord(this.fullPath, x, _pos.y, _pos.z)
    }
})
 
 
// NEW
// int y
 
Object.defineProperty(oNode.prototype, 'y', {
    get : function(){
         return node.coordY(this.fullPath)
    },
 
    set : function(y){
        var _pos = this.nodePosition;
        node.setCoord(this.fullPath, _pos.x, y, _pos.z)
    }
})

 
// NEW
// int z
 
Object.defineProperty(oNode.prototype, 'z', {
    get : function(){
         return node.coordZ(this.fullPath)
    },
 
    set : function(z){
        var _pos = this.nodePosition;
        node.setCoord(this.fullPath, _pos.x, _pos.y, z)
    }
})
 
 
// int width
 
Object.defineProperty(oNode.prototype, 'width', {
    get : function(){
         return node.width(this.fullPath)
    }
})
 
 
// int height
 
Object.defineProperty(oNode.prototype, 'height', {
    get : function(){
         return node.height(this.fullPath)
    }
})
 
 
// Array inNodes
 
Object.defineProperty(oNode.prototype, 'inNodes', {
    get : function(){
        var _inNodes = [];
        // TODO: ignore/traverse groups
        for (var i = 0; i < node.numberOfInputPorts(this.fullPath); i++){
            var _node = node.srcNode(this.fullPath, i);
            _inNodes.push(this.scene.$node(_node));
        }
        return _inNodes;
    }
})

 
// Array outNodes
 
Object.defineProperty(oNode.prototype, 'outNodes', {
    get : function(){
        var _outNodes = [];
        for (var i = 0; i < node.numberOfOutputPorts(this.fullPath); i++){
            var _outLinks = [];
            for (var j = 0; j < node.numberOfOutputLinks(this.fullPath, i); j++){
                // TODO: ignore/traverse groups
                var _node = node.dstNode(this.fullPath, i, j);
                _outLinks.push(this.scene.$node(_node));
            }
            if (_outLinks.length > 1){
                _outNodes.push(_outLinks);
            }else{
                _outNodes = _outNodes.concat(_outLinks);
            }
        }
        return _outNodes;
    }
})
 

// NEW
// {attributes} attributes
 
Object.defineProperty(oNode.prototype, 'attributes', {
    get : function(){
        //MessageLog.trace(this.fullPath)
        var _attributesList = node.getAttrList(this.fullPath, 1);
        var _attributes = {};
     
        for (var i in _attributesList){
     
            var _attribute = new oAttribute(this, _attributesList[i]);
            var _keyword = _attribute.keyword.toLowerCase();
     
            _attributes[_keyword] = _attribute;
     
        }
     
        return _attributes;
    }
 
})
 
 
//NEW
// {[oColumn]} linkedColumns
 
Object.defineProperty(oNode.prototype, 'linkedColumns', {
    get : function(){
        var _attributes = this.attributes;
        var _columns = [];
        
        for (var i in _attributes){
            var _column = _attributes[i].column;
            if (_column != null) _columns.push(_column);
            
            // look also at subAttributes
            var _subAttributes = _attributes[i].subAttributes;
            if (_subAttributes.length > 0) {
                for (var j in _subAttributes){
                    _column = _subAttributes[j].column;
                    if (_column != null) _columns.push(_column);
                }
            }   
        }
        return _columns;
    }
})
 
 
// oNode Class methods

// NEW
// bool linkInNode(oNode oNodeObject, int inPort, int outPort)
 
oNode.prototype.linkInNode = function(oNodeObject, inPort, outPort){
    var _node = oNodeObject.fullPath;
 
    // Default values for optional parameters
    if (typeof inPort === 'undefined') inPort = 0;
    if (typeof outPort === 'undefined') outPort = 0;//node.numberOfOutputPorts(_node);
 
    return node.link(_node, outPort, this.fullPath, inPort, true, true);
 
}
 
 
//NEW
// bool unlinkInNode(oNode oNodeObject)
 
oNode.prototype.unlinkInNode = function(oNodeObject){
    var _node = oNodeObject.fullPath;
   
    // MessageLog.trace("unlinking "+this.name+" from "+oNodeObject.name)
    var _inNodes = this.inNodes;
    // MessageLog.trace(_inNodes.length)
   
    for (var i in _inNodes){
       
        // MessageLog.trace(_inNodes[i].fullPath+" "+_node)
       
        if (_inNodes[i].fullPath == _node){
            return node.unlink(this.fullPath, i);
        }
    }
    return false;
}
 
 
//NEW
// bool unlinkOutNode(oNode oNodeObject)
 
oNode.prototype.unlinkOutNode = function(oNodeObject){
    var _node = oNodeObject.fullPath;
   
    var _inNodes = oNodeObject.inNodes;
   
    for (var i in _inNodes){
        if (_inNodes[i].fullPath == this.fullPath){
            return node.unlink(_node, i);
        }
    }
    return false;
}
 
 
// bool linkOutNode(oNode oNodeObject, int outPort, int inPort)
 
oNode.prototype.linkOutNode = function(oNodeObject, outPort, inPort){
    var _node = oNodeObject.fullPath;
 
    // Default values for optional parameters
    // TODO: careful since now READ nodes have two ports but one only accepts drawing link
    if (typeof inPort === 'undefined') inPort = node.numberOfInputPorts(_node);
    if (typeof outPort === 'undefined') outPort = 0//node.numberOfOutputPorts(this.fullPath);
 
    MessageLog.trace("linking "+this.fullPath+" to "+_node+" "+inPort+" "+outPort);
    return node.link(this.fullPath, outPort, _node, inPort, true, true);
}
 
 
// NEW
// int timelineIndex
 
oNode.prototype.timelineIndex = function(timeline){
    var _timeline = timeline.layersList;
    return _timeline.indexOf(this.fullPath);
}
 
 
// oBox getBounds()
// Returns an oBox object with the dimensions of the node
 
oNode.prototype.getBounds = function(){
    return new oBox(this.x, this.y, this.x+this.width, this.y+this.height);
}
 
// NEW
// nodePosition centerAbove(array oNodeArray, int offset)
// Place a node above one or more nodes with an offset
 
oNode.prototype.centerAbove = function(oNodeArray, xOffset, yOffset){
    // Defaults for optional parameters
    if (typeof xOffset === 'undefined') var xOffset = 0;
    if (typeof yOffset === 'undefined') var yOffset = 0;
 
    // Works with nodes and nodes array
    if (!Array.isArray(oNodeArray)) oNodeArray = [oNodeArray];
 
    MessageLog.trace(oNodeArray);
    var _box = new oBox();
    _box.includeNodes(oNodeArray);
    
    this.x = _box.center.x - this.width/2 + xOffset;
    this.y = _box.top - this.height + yOffset;
   
    return new oPoint(this.x, this.y, this.z);
}
 
// NEW
// void centerAbove(array oNodeArray, int offset)
// Place a node above one or more nodes with an offset
 
oNode.prototype.centerBelow = function(oNodeArray, xOffset, yOffset){
    // Defaults for optional parameters
    if (typeof xOffset === 'undefined') var xOffset = 0;
    if (typeof yOffset === 'undefined') var yOffset = 0;
 
    // Works with nodes and nodes array
    if (!Array.isArray(oNodeArray)) oNodeArray = [oNodeArray];
    
    var _box = new oBox();
    _box.includeNodes(oNodeArray);
 
    this.x = _box.center.x - this.width/2 + xOffset;
    this.y = _box.bottom - this.height + yOffset;
   
    return new oPoint(this.x, this.y, this.z);
}


// NEW
// void placeAtCenter(array oNodeArray, xOffset, yOffset)
// Place a node above one or more nodes with an offset
 
oNode.prototype.placeAtCenter = function(oNodeArray, xOffset, yOffset){
    // Defaults for optional parameters
    if (typeof xOffset === 'undefined') var xOffset = 0;
    if (typeof yOffset === 'undefined') var yOffset = 0;
 
    // Works with nodes and nodes array
    if (!Array.isArray(oNodeArray)) oNodeArray = [oNodeArray];
 
    var _box = new oBox();
    _box.includeNodes(oNodeArray);
 
    this.x = _box.center.x - this.width/2 + xOffset;
    this.y = _box.center.y - this.height/2 + yOffset;
   
    return new oPoint(this.x, this.y, this.z);
}
 
 
// clone(oNodeObject(, newName(, newPosition, newGroup))){
 
oNode.prototype.clone = function(oNodeObject, newName, newPosition, newGroup){
    // Defaults for optional parameters
    if (typeof newGroup === 'undefined') var newGroup = oNodeObject.path;
 
    // TODO implement cloning through column linking as opposed to copy paste logic
 
    var _node = oNodeObject.fullPath;
    var _copyOptions = copyPaste.getCurrentCreateOptions();
    var _copy = copyPaste.copy([_node], 1, frame.numberOf(), _copyOptions);
    var _pasteOptions = copyPaste.getCurrentPasteOptions();
    copyPaste.pasteNewNodes(_copy, newGroup, _pasteOptions);
 
}
 
 
// duplicate(oNodeObject(, newName(, newPosition)))
 
oNode.prototype.duplicate = function(oNodeObject, newName, newPosition){
    // TODO
   
}


// NEW
// remove()
 
oNode.prototype.remove = function(deleteColumns, deleteElements){
    if (typeof deleteFrames === 'undefined') var deleteColumns = true;
    if (typeof deleteElements === 'undefined') var deleteElements = true;
   
    // restore links for special types
    if (this.type == "PEG"){
        var inNodes = this.inNodes; //Pegs can only have one inNode but we'll implement the general case for other types
        var outNodes = this.outNodes;
        for (var i in inNodes){
            for (var j in outNodes){
                inNodes[i].linkOutNode(outNodes[j]);
            }
        }
    }
   
    node.deleteNode(this.fullPath, deleteColumns, deleteElements);
}
 

// NEW
// getAttributeByName(keyword)
// allows to get an attribute object by name that tolerates a dot in the name

oNode.prototype.getAttributeByName = function(keyword){
    if (keyword.indexOf(".")){
        keyword = keyword.toLowerCase();
        keyword = keyword.split(".");
        var _attribute = keyword[0];
        var _subAttribute = keyword[1];
        
        if (_subAttribute == "3dpath") _subAttribute = "path3d";
        
        if (!this.attributes.hasOwnProperty(_attribute)) return null;
        if (!this.attributes[_attribute].hasOwnProperty(_subAttribute)) return this.attributes[_attribute];
        
        return this.attributes[_attribute][_subAttribute];
    }else{
        if (!this.hasOwnProperty(keyword)) return null;
        return this.attributes[keyword];
    }
}
 
// oAttribute $attributes(keyword){
// Deprecated
/*oNode.prototype.$attributes = function(keyword){
    var _attributes = this.attributes;
    var _keywords = _attributes.map(function(x){return x.keyword});
 
    var _index = _keywords.indexOf(keyword);
 
    return (_index == -1)?null:_attributes[index];
}*/
 
 
//////////////////////////////////////
//////////////////////////////////////
//                                  //
//                                  //
//          oPegNode class          //
//                                  //
//                                  //
//////////////////////////////////////
//////////////////////////////////////
 
// Constructor
//
// oPegNode(path)
//
// Properties
//
 
function oPegNode(path, oSceneObject) {
    // oDrawingNode can only represent a node of type 'READ'
    if (node.type(path) != 'PEG') throw "'path' parameter must point to a 'PEG' type node";
    oNode.call(this, path, oSceneObject);
}
 
// extends oNode and can use its methods
oPegNode.prototype = Object.create(oNode.prototype);
 
// NEW
Object.defineProperty(oPegNode.prototype, "useSeparate", {
    get : function(){
       
    },
   
    set : function( _value ){
        // TODO: when swapping from one to the other, copy key values and link new columns if missing
    }
})
 
 
//////////////////////////////////////
//////////////////////////////////////
//                                  //
//                                  //
//        oDrawingNode class        //
//                                  //
//                                  //
//////////////////////////////////////
//////////////////////////////////////
 
// Constructor
//
// oDrawingNode(path)
//
// Properties
//
// oElement element
// [frames] timings
 
 
// NEW
// Inherits from oNode class
 
function oDrawingNode(path, oSceneObject) {
    // oDrawingNode can only represent a node of type 'READ'
    if (node.type(path) != 'READ') throw "'path' parameter must point to a 'READ' type node";
    oNode.call(this, path, oSceneObject);
}
 
// extends oNode and can use its methods
oDrawingNode.prototype = Object.create(oNode.prototype);
 
 
// NEW
// oElement element    allows to get and define the element used by a drawing node
 
Object.defineProperty(oDrawingNode.prototype, "element", {
    get : function(){
        var _column = this.attributes.drawing.element.column;
        return (new oElement(node.getElementId(this.fullPath), _column))
    },
   
    set : function( oElementObject ){
        var _column = this.attributes.drawing.element.column;
        column.setElementIdOfDrawing(_column.uniqueName, oElementObject.id)
    }
})
 
 
// NEW
// {[frames]} timings      returns the drawing.element keyframes
 
Object.defineProperty(oDrawingNode.prototype, "timings", {
    get : function(){
        return this.attributes.drawing.element.getKeyFrames()
    }
})

 
// Class Methods
 
// NEW
// oPegNode extractPeg()    creates a peg node containing the transformation
oDrawingNode.prototype.extractPeg = function(){
    var _drawingNode = this;
    var _peg = this.scene.addNode("PEG", this.name+"-P");
    var _columns = _drawingNode.linkedColumns;
    
    _peg.position.separate = _drawingNode.offset.separate;
    _peg.scale.separate = _drawingNode.scale.separate;
    
    // link each column that can be to the peg instead and reset the drawing node
    for (var i in _columns){
        var _attribute = _columns[i].attributeObject;
        var _keyword = _attribute.keyword;

        var _nodeAttribute = _drawingNode.getAttributeByName(_keyword);
        
        if (_keyword.indexOf("OFFSET") != -1) _keyword = _keyword.replace("OFFSET", "POSITION");
        
        var _pegAttribute = _peg.getAttributeByName(_keyword);
        
        if (_pegAttribute !== null){
            _pegAttribute.column = _columns[i];
            _nodeAttribute.column = null;
            _drawingNode[_keyword] = _attribute.defaultValue;
        }
    }
    
    _drawingNode.offset.separate = false; // doesn't work?
    _drawingNode.can_animate = false;
    
    _peg.centerAbove(_drawingNode, -1, -30)
    _drawingNode.linkInNode(_peg)
    
    return _peg;
}
 
// NEW
 
//////////////////////////////////////
//////////////////////////////////////
//                                  //
//                                  //
//         oGroupNode class         //
//                                  //
//                                  //
//////////////////////////////////////
//////////////////////////////////////
 
// Constructor
//
// oGroupNode(path)
//
// Properties
//
// oNode MultiportIn    fetches the groups MultiPort-In node
// oNode MultiportOut    fetches the groups MultiPort-Out node
//
// Methods
//
// {[oNode]} subNodes (bool recurse)
// void orderNodeView (bool recurse)
 
// NEW
// Inherits from oNode class
 
function oGroupNode(path, oSceneObject) {
    // oDrawingNode can only represent a node of type 'READ'
    if (node.type(path) != 'GROUP') throw "'path' parameter must point to a 'GROUP' type node";
    oNode.call(this, path, oSceneObject);
}
 
// extends oNode and can use its methods
oGroupNode.prototype = Object.create(oNode.prototype);
 
 
// NEW
// oNode MultiportIn    fetches the groups MultiPort-In node
 
Object.defineProperty(oGroupNode.prototype, "multiportIn", {
    get : function(){
        if (this.isRoot) return null
        var _MPI = this.scene.$node(node.getGroupInputModule(this.fullPath, "Multiport-In", 0,-100,0),this.scene)
        return (_MPI)
    }
})
 
 
// NEW
// oNode MultiportOut    fetches the groups MultiPort-Out node
 
Object.defineProperty(oGroupNode.prototype, "multiportOut", {
    get : function(){
        if (this.isRoot) return null
        var _MPO = this.scene.$node(node.getGroupOutputModule(this.fullPath, "Multiport-Out", 0, 100,0),this.scene)
        return (_MPO)
    }
})


// NEW
// Array subNodes(boolean recurse)
// obtains the nodes contained in the group, allows recursive search
 
oGroupNode.prototype.subNodes = function(recurse){
    if (typeof recurse === 'undefined') recurse = false;
   
    var _nodes = node.subNodes(this.fullPath);
    var _subNodes = [];
   
    for (var i in _nodes){
        var _oNodeObject = this.scene.$node(_nodes[i]);
        _subNodes.push(_oNodeObject);
        if (recurse && node.isGroup(_nodes[i])) _subNodes = _subNodes.concat(_oNodeObject.subNodes(recurse));
    }
 
    return _subNodes;
}

 
// NEW
// void orderNodeView()         sorts out the node view inside the group
 
oGroupNode.prototype.orderNodeView = function(recurse){
    if (typeof recurse === 'undefined') var recurse = false;
   
    TB_orderNetworkUpBatchFromList(node.subNodes(this.fullPath))
   
    if (!this.isRoot){
        var _MPO = this.multiportOut;
        var _MPI = this.multiportIn;
   
        _MPI.x = _MPO.x
    }
   
    if (recurse){
        var _subNodes = this.subNodes().filter(function(x){return x.type == "GROUP"});
        for (var i in _subNodes){
            _subNodes[i].orderNodeView(recurse);
        }
    }
}
 
 
//////////////////////////////////////
//////////////////////////////////////
//                                  //
//                                  //
//          oColumn class           //
//                                  //
//                                  //
//////////////////////////////////////
//////////////////////////////////////
 
// Constructor
//
// oColumn(uniqueName)
//
// Properties
//
// string uniqueName
// oAttribute attributeObject
// String name
// String type
// Array frames
// Array subColumns
//
// oColumn Class methods
//
// extendExposures( {[oFrame]} exposures)

 
// NEW

function oColumn(uniqueName, oAttributeObject){
    this.uniqueName = uniqueName;
    this.attributeObject = oAttributeObject
}
 
 
// oColumn Object Properties
 
// String oColumn.name
 
Object.defineProperty(oColumn.prototype, 'name', {
    get : function(){
         return column.getDisplayName(this.uniqueName)
    },
 
    set : function(newName){
        var _success = column.rename(this.uniqueName, newName)
        if (_success) this.uniqueName = newName;
        return _success
    }
})
 
 
// String type
 
Object.defineProperty(oColumn.prototype, 'type', {
    get : function(){
        return column.type(this.uniqueName)
    }
})
 
 
// Array frames
 
Object.defineProperty(oColumn.prototype, 'frames', {
    get : function(){
        var _frames = new Array(frame.numberOf()+1);
        for (var i=1; i<_frames.length; i++){
            _frames[i] = new oFrame(i, this)
        }
        return _frames;
    }
})
 
 
// NEW
// Object subColumns
 
Object.defineProperty(oColumn.prototype, 'subColumns', {
    get : function(){
        if (this.type == "3DPATH"){
            return { x : 1,
                     y : 2,
                     z : 3,
                     velocity : 4}
        }
        return null;
    }
})
 
 
// oColumn Class methods
 
// NEW
// extendExposures( {[oFrame]} exposures)
   
oColumn.prototype.extendExposures = function( exposures, amount, replace){
    if (this.type != "DRAWING") return false;
    // if amount is undefined, extend function below will automatically fill empty frames
   
    if (typeof exposures === 'undefined') var exposures = this.getKeyFrames();
 
    for (var i in exposures) {
        if (!exposures[i].isBlank) exposures[i].extend(amount, replace);
    }
}


// NEW
// removeDuplicateKeys()

oColumn.prototype.removeDuplicateKeys = function(){
    var _keys = this.getKeyFrames();
    
    //MessageLog.trace(this.attributeObject.keyword+" keys: "+_keys.map(function (x){return x.frameNumber}))
    if (_keys.length < 2) return
    
    var _pointsToRemove = [];
    var _pointC;
    
    // check the extremities
    var _pointA = _keys[0].value
    var _pointB = _keys[1].value
    if (JSON.stringify(_pointA) == JSON.stringify(_pointB)) _pointsToRemove.push(_keys[0].frameNumber)
    //MessageLog.trace(this.attributeObject.keyword+" pointA: "+JSON.stringify(_pointA)+" pointB: "+JSON.stringify(_pointB)) 
    
    for (var k=1; k<_keys.length-1; k++){
        _pointA = _keys[k-1].value
        _pointB = _keys[k].value
        _pointC = _keys[k+1].value
        
        //MessageLog.trace(_keys[k].frameNumber+" - "+this.attributeObject.keyword+" pointA: "+JSON.stringify(_pointA)+" pointB: "+JSON.stringify(_pointB)+" pointC: "+JSON.stringify(_pointC))
        
        if (JSON.stringify(_pointA) == JSON.stringify(_pointB) && JSON.stringify(_pointB) == JSON.stringify(_pointC)){
            _pointsToRemove.push(_keys[k].frameNumber)
        }
    }
    
    if (_keys.length > 2){
        _pointA = _keys[_keys.length-2].value
        _pointB = _keys[_keys.length-1].value
        if (JSON.stringify(_pointA) == JSON.stringify(_pointB)) _pointsToRemove.push(_keys[_keys.length-1].frameNumber)
        //MessageLog.trace(this.attributeObject.keyword+" pointA: "+JSON.stringify(_pointA)+" pointB: "+JSON.stringify(_pointB)) 
    }
    
    var _frames = this.frames;

    for (var i=_pointsToRemove.length-1; i>=0; i--){
        //MessageLog.trace("removing key "+_pointsToRemove[i]+" of column "+this.attributeObject.keyword)
        
        // we don't remove the last key remaining when it isn't the default value
        
        var _value = JSON.stringify(_frames[_pointsToRemove[i]].value)
        var _default = JSON.stringify(this.attributeObject.defaultValue)
        
        if (i==0 && this.getKeyFrames().length == 1 && _value != _default) continue
        
        
        _frames[_pointsToRemove[i]].isKeyFrame = false;
    }
    
}


// oColumn duplicate ()

oColumn.prototype.duplicate = function() {
    // TODO
}


// NEW
// {[oFrame]} getKeyFrames()

oColumn.prototype.getKeyFrames = function(){
    var _frames = this.frames;
    _frames = _frames.filter(function(x){return x.isKeyFrame});
    return _frames;
}
 
 
//////////////////////////////////////
//////////////////////////////////////
//                                  //
//                                  //
//          oElement class          //
//                                  //
//                                  //
//////////////////////////////////////
//////////////////////////////////////
 
// Constructor
//
// oElement (id, columnObject)
//
// Properties
//
// string id
// oColumn column
// string name
// string path
// {[oDrawings]} drawings
//
// Methods
//
// oDrawing addDrawing(int atFrame, string name, string filename)
// oDrawing getDrawingByName(string name)
// linkPalette (oPalette paletteFile)


// NEW
// oElement constructor
 
function oElement (id, oColumnObject){
    this.id = id;
    this.column = oColumnObject;
}


// oElement Object Properties

// NEW
// string name
 
Object.defineProperty(oElement.prototype, 'name', {
    get : function(){
         return element.getNameById(this.id)
    },
 
    set : function(newName){
         element.renameById(this.id, newName);
    }
})


//NEW
// string path
 
Object.defineProperty(oElement.prototype, 'path', {
    get : function(){
         return fileMapper.toNativePath(element.completeFolder(this.id))
    }
})
 
 
// NEW
// {[oDrawings]} drawings
 
Object.defineProperty(oElement.prototype, 'drawings', {
    get : function(){
        var _drawingsNumber = Drawings.numberOf(this.id)
        var _drawings = [];
        for (var i=0; i<_drawingsNumber; i++){
            _drawings.push(new oDrawing(Drawing.name(this.id, i), this))
        }
        return _drawings;
    }
})
 
 
// NEW
// oElement Class methods
 
oElement.prototype.addDrawing = function(atFrame, name, filename){
    if (typeof filename === 'undefined') var filename = false;
    if (typeof name === 'undefined') var name = atFrame+''
   
    var fileExists = filename?true:false;
    // TODO deal with fileExists and storeInProjectFolder
    Drawing.create (this.id, name, fileExists, true);
   
    if (filename){
        //copy the imported file at the newly created drawing place
        var _file = Drawing.filename(this.id, name)
        //MessageLog.trace(_file)
       
        var _frameFile = new oFile(filename)
        _frameFile.move(_file, true)
       
    }
   
    // place drawing on the column at the provided frame
    if (this.column != null || this.column != undefined)
        column.setEntry(this.column.uniqueName, 1, atFrame, name)
   
    return new oDrawing(name, this);
}
 

// NEW
// getDrawingByName(string name)
 
oElement.prototype.getDrawingByName = function (name){
    return new oDrawing(name, this)
}
 

// NEW
// linkPalette
 
oElement.prototype.linkPalette = function (paletteFile){
    // TODO
}
 

// NEW
 
//////////////////////////////////////
//////////////////////////////////////
//                                  //
//                                  //
//          oDrawing class          //
//                                  //
//                                  //
//////////////////////////////////////
//////////////////////////////////////
 
// Constructor
//
// oDrawing (name, element)
//
// Properties
//
// string name
// oElement element
// string path
//
// Methods
//
 
 
// NEW
// oDrawing constructor
 
function oDrawing (name, oElementObject){
    this.name = name;
    this.element = oElementObject;
}
 

// oDrawing Object Properties

// NEW
// string path

Object.defineProperty(oDrawing.prototype, 'path', {
    get : function(){
         return fileMapper.toNativePath(Drawing.filename(this.element.id, this.name))
    }
})


// oDrawing Class methods
 
 
 
//////////////////////////////////////
//////////////////////////////////////
//                                  //
//                                  //
//        oAttribute class          //
//                                  //
//                                  //
//////////////////////////////////////
//////////////////////////////////////
 
 
// Constructor
//
// oAttribute(oNodeObject, attributeObject)
//
// Properties
//
// oNode oNodeObject
// Attribute attributeObject
// String keyword
// string type
// oColumn column
// array frames
// {[oAttribute]} subAttributes
//
// Methods
//
// oColumn getLinkedColumn()
// array getKeyFrames()
// bool setValue(value, double frame)
// various getValue(frame)
 
// oAttribute constructor
 
function oAttribute(oNodeObject, attributeObject, parentAttribute){
    this.oNodeObject = oNodeObject;
    this.attributeObject = attributeObject;
    this.keyword = attributeObject.fullKeyword()
    this.shortKeyword = attributeObject.keyword()
    this.parentAttribute = parentAttribute; // only for subAttributes
 
    var _subAttributes = [];
    
    if (attributeObject.hasSubAttributes()){
        var _subAttributesList = attributeObject.getSubAttributes();
        
        for (var i in _subAttributesList){
            var _keyword = _subAttributesList[i].keyword().toLowerCase();
            // hard coding a fix for 3DPath attribute name which starts with a numberOf
            if (_keyword == "3dpath") _keyword = "path3d"
            
            var _subAttribute = new oAttribute(this.oNodeObject, _subAttributesList[i], this)
                        
            // creating a property on the attribute object with the subattribute name to access it
            this[_keyword] = _subAttribute
            _subAttributes.push(_subAttribute)
        }
    }
 
    // subAttributes is made available as an array for more formal access
    this.subAttributes = _subAttributes;
}
 
// oAttribute Object Properties
 
// string type
 
Object.defineProperty(oAttribute.prototype, 'type', {
    get : function(){
        return this.attributeObject.typeName();
    }
})
 
 
// NEW
// oColumn column
 
Object.defineProperty(oAttribute.prototype, 'column', {
    get : function(){
        var _column = node.linkedColumn (this.oNodeObject.fullPath, this.keyword)
        //MessageLog.trace("column for attribute: "+this.keyword+" of node: "+this.oNodeObject.fullPath+" = "+_column)
        return (_column!="")?new oColumn(_column, this):null
    },
 
    set : function(columnObject){
        //MessageLog.trace((columnObject == null)?"unlinking column":"setting column")
        // unlink if provided with null value or empty string
        if (columnObject == "" || columnObject == null){
            //MessageLog.trace("unlinking column from attribute "+this.keyword+" of node "+this.oNodeObject.name)
            node.unlinkAttr(this.oNodeObject.fullPath, this.keyword)
        }else{
            //MessageLog.trace("linking column "+ columnObject.uniqueName+" to attribute "+this.keyword+" of node "+this.oNodeObject.name)
            node.linkAttr(this.oNodeObject.fullPath, this.keyword, columnObject.uniqueName)
        }
    }
})
 
 
// Array frames
 
Object.defineProperty(oAttribute.prototype, 'frames', {
    get : function(){
         var _column = this.column
         if (_column != null){
            return _column.frames;
         }else{
            return [];
         }
    }
})

// NEW
// bool useSeparate

// Used to be a oPegNode attribute but many attributes can use separate so this will be used to easily swap them.
Object.defineProperty(oAttribute.prototype, "useSeparate", {
    get : function(){
        
    },
   
    set : function( _value ){
        // TODO: when swapping from one to the other, copy key values and link new columns if missing
    }
})


// NEW
// various defaultValue
// used to return the default "rest state" or unmodified value of an attribute. Not available for all attributes as some don't have default values

Object.defineProperty(oAttribute.prototype, "defaultValue", {
    get : function(){
        // TODO: we could use this to reset bones/deformers to their rest states
        var _keyword = this.keyword;
        
        switch (_keyword){
            case "OFFSET.X" :
            case "OFFSET.Y" :
            case "OFFSET.Z" :
            
            case "POSITION.X" :
            case "POSITION.Y" :
            case "POSITION.Z" :
            
            case "PIVOT.X":
            case "PIVOT.Y":
            case "PIVOT.Z":
            
            case "ROTATION.ANGLEX":
            case "ROTATION.ANGLEY":
            case "ROTATION.ANGLEZ":
            
            case "ANGLE":
            case "SKEW":
            
            case "SPLINE_OFFSET.X":
            case "SPLINE_OFFSET.Y":
            case "SPLINE_OFFSET.Z":
            
                return 0;
                
            case "SCALE.X" :
            case "SCALE.Y" :
            case "SCALE.Z" :
                return 1;
                
            case "OPACITY" :
                return 100;
                
            case "OFFSET.3DPATH":
                return new Point3d(0,0,0);
                
            default: 
                return null; // for attributes that don't have a default value, we return null
        }
    }
})
 
// oAttribute Class methods

// array getKeyFrames()
 
oAttribute.prototype.getKeyFrames = function(){
    var _frames = this.frames;
    _frames = _frames.filter(function(x){return x.isKeyFrame})
    return _frames
}
 

// NEW
// void setValue(value, double frame)
 
oAttribute.prototype.setValue = function (value, frame) {
    if (typeof frame === 'undefined') var frame = 1;
    //MessageLog.trace('setting frame :'+frame+' to value: '+value+' of attribute: '+this.keyword)
 
    var _attr = this.attributeObject;
    var _type = this.type;
 
    if (frame != 1 && this.column == null){
        // generate a new column to be able to animate
        var _doc = new oScene();
        var _column = _doc.addColumn()
        this.column = _column;
    }
    
    // TODO deal with subattributes ? for ex pass a oPoint object to an attribute with x, y, z properties?
    switch (_type){
        // TODO: sanitize input
        case "GENERIC_ENUM" :
            node.setTextAttr(this.oNodeObject.fullPath, this.keyword, frame, value)
            break;
            
        case "PATH_3D" :
            // TODO include velocity
            _attr.attributeObject.setValueAt(value, frame)
            break;
            
        case "ELEMENT" :
            column.setEntry(this.column.uniqueName, 1, frame, value)
            break;
            
        default : 
            _attr.setValueAt(value, frame);
    }

}
 
 
// various getValue(frame)
 
oAttribute.prototype.getValue = function (frame) {
    if (typeof frame === 'undefined') var frame = 1;
 
    var _attr = this.attributeObject;
    var _type = this.type;
    var _value;
           
    //MessageLog.trace("getting "+this.keyword+" "+_type+" "+frame)
    switch (_type){
        case 'BOOL':
            _value = _attr.boolValueAt(frame)
            break;
           
        case 'INT':
            _value = _attr.intValueAt(frame)
            break;
           
        case 'DOUBLE':
        case 'DOUBLEVB':
            _value = _attr.doubleValueAt(frame)
            break;
           
        case 'STRING':
            _value = _attr.textValueAt(frame)
            break;
           
        case 'COLOR':
            _value = _attr.colorValueAt(frame)
            break;

        case 'POSITION_2D':
            _value = _attr.pos2dValueAt(frame)
            break;
           
        case 'POSITION_3D':
            _value = _attr.pos3dValueAt(frame)
            break;
            
        case 'PATH_3D':
            _attr = this.parentAttribute.attributeObject
            _value = _attr.pos3dValueAt(frame)
            // get the velocity in any other way than getting the subcolumn?
            //_value = new oPoint (_value.x, _value.y, _value.z)
            break;
            
        case 'ELEMENT':
            // an element always has a column, so we'll fetch it from there
            _value = column.getEntry(this.column.uniqueName, 1, frame)
            //MessageLog.trace(_value)
            break;
        
        // TODO: How does QUATERNION_PATH work? subcolumns I imagine
        // TODO: How to get types SCALE_3D, ROTATION_3D, DRAWING, GENERIC_ENUM? -> maybe we don't need to, they don't have intrinsic values
           
        default:
            // enums, etc
            _value = _attr.textValueAt(frame)
    }
       
    return _value;

}
 
 
 
//////////////////////////////////////
//////////////////////////////////////
//                                  //
//                                  //
//          oFrame class            //
//                                  //
//                                  //
//////////////////////////////////////
//////////////////////////////////////
 
 
// Constructor
//
// oFrame(frameNumber, oColumnObject, subColumns)
//
// Properties
//
// int frameNumber
// oColumn column
// int subColumns
// various value
// bool isKeyFrame
// int duration
// int startFrame
 
// oFrame constructor
 
function oFrame(frameNumber, oColumnObject, subColumns){
    if (typeof subColumns === 'undefined') var subColumns = 0;
 
    this.frameNumber = frameNumber;
    this.column = oColumnObject;
    this.attributeObject = this.column.attributeObject;
    this.subColumns = subColumns;
}
 
 
// oFrame Object Properties
 
// NEW
// various value
 
Object.defineProperty(oFrame.prototype, 'value', {
    get : function(){
        return this.attributeObject.getValue(this.frameNumber)   
    },
 
    set : function(newValue){
        /*var subColumns = this.column.subColumns;
        
        if (subColumns == null) {
            column.setEntry (this.column.uniqueName, 1, this.frameNumber, newValue)
        }else{
            for (var i in subColumns){
                column.setEntry (this.column.uniqueName, subColumns[i], this.frameNumber, _key[i])
            }
        }*/
        this.attributeObject.setValue(newValue, this.frameNumber)   
    }
})
 
// NEW
// bool isKeyFrame
 
Object.defineProperty(oFrame.prototype, 'isKeyFrame', {
    get : function(){
        var _column = this.column.uniqueName
        if (this.column.type == 'DRAWING' || this.column.type == 'TIMING'){
            return !column.getTimesheetEntry(_column, 1, this.frameNumber).heldFrame
        }else if (['BEZIER', '3DPATH', 'EASE', 'QUATERNION'].indexOf(this.column.type) != -1){
            return column.isKeyFrame(_column, 1, this.frameNumber)
        }
        return false
    },
 
    set : function(keyFrame){
        var _column = this.column.uniqueName
            
        if (keyFrame){
            column.setKeyFrame(_column, this.frameNumber)
        }else{
            column.clearKeyFrame(_column, this.frameNumber)
        }
    }
})
 
 
// NEW
// int duration
 
Object.defineProperty(oFrame.prototype, 'duration', {
    get : function(){
        var _startFrame = this.startFrame;
        var _sceneLength = frame.numberOf()
       
        // walk up the frames of the scene to the next keyFrame to determin duration
        var _frames = this.column.frames
        for (var i=this.frameNumber+1; i<_sceneLength; i++){
            if (_frames[i].isKeyFrame) return _frames[i].frameNumber - _startFrame;
        }
        return _sceneLength - _startFrame;
    }
})
 
 
// NEW
// bool isBlank
 
Object.defineProperty(oFrame.prototype, 'isBlank', {
    get : function(){
        return column.getTimesheetEntry(this.column.uniqueName, 1, this.frameNumber).emptyCell
    }
})
 
// NEW
// int startFrame
 
Object.defineProperty(oFrame.prototype, 'startFrame', {
    get : function(){
        if (this.isKeyFrame) return this.frameNumber
        if (this.isBlank) return -1;
       
        var _frames = this.column.frames
        for (var i=this.frameNumber-1; i>=1; i--){
            if (_frames[i].isKeyFrame) return _frames[i].frameNumber;
        }
        return -1;
    }
})
 
 
// NEW
// string marker
 
Object.defineProperty(oFrame.prototype, 'marker', {
    get : function(){
        var _column = this.column;
        if (_column.type != "DRAWING") return "";
        return column.getDrawingType(_column.uniqueName, this.frameNumber);
    },
   
    set: function(marker){
        var _column = this.column;
        if (_column.type != "DRAWING") throw "can't set 'marker' property on columns that are not 'DRAWING' type"
        column.setDrawingType(_column.uniqueName, this.frameNumber, marker);
    }
})
 
 
// NEW
// bool extend
 
oFrame.prototype.extend = function( duration, replace){
    if (typeof replace === 'undefined') var replace = true;
    // setting this to false will insert frames as opposed to overwrite existing ones
 
    var _frames = this.column.frames;
 
    if (typeof duration === 'undefined'){
        // extend to next non blank keyframe if not set
        var duration = 0;
        var curFrameEnd = this.startFrame + this.duration;
        var sceneLength = frame.numberOf();
       
        // find next non blank keyframe
        while (_frames[ curFrameEnd + duration].isBlank && (curFrameEnd + duration) < sceneLength){
            duration += _frames[curFrameEnd+duration].duration;
        }
       
        // set to sceneEnd if sceneEnd is reached
        if (curFrameEnd+duration >= sceneLength) duration = sceneLength-curFrameEnd+1;
    }
 
    var _value = this.value;
    var startExtending = this.startFrame+this.duration;
   
    for (var i = 0; i<duration; i++){
        if (!replace){
            // TODO : push all other frames back
        }
        _frames[startExtending+i].value = _value;
    }  
}

// NEW

//////////////////////////////////////
//////////////////////////////////////
//                                  //
//                                  //
//         oNodeLink class          //
//                                  //
//                                  //
//////////////////////////////////////
//////////////////////////////////////
 
// Constructor
//
// oNodeLink (srcNode, dstNode)
//
// Properties
//
//
// Methods
//
 
 
// NEW
// oNodeLink constructor
 
function oNodeLink (srcNode, dstNode, outPort, outLink, inPort){
    this.srcNode = srcNode;
    this.dstNode = dstNode;
    this._cacheOutPort = outPort;
    this._cacheOutLink = outLink;
    this._cacheInPort = inPort;
}

 
// oNodeLink Object Properties
 
// NEW
// string outPort

Object.defineProperty(oNodeLink.prototype, 'outPort', {
    get : function(){
        // Check against the cache before computing again
        var _port = this._cacheOutPort;
        var _link = this._cacheOutLink;

        if (node.dstNode(this.srcNode.fullPath, _port, _link) != this.dstNode.fullPath){
            // First look amongst direct dstNodes
            var _outNodes = this.srcNode.outNodes;

            for (var i in _outNodes){
                for (var j in _outNodes[i]){
                    if(_outNodes[i][j].fullPath == this.dstNode.fullPath) {
                        _port = this._cacheOutPort = i;
                        _link = this._cacheOutLink = j;
                        return {port: _port, link: _link}
                    }
                }
            }

            // if not found check in groups amongst outNodes


        }

        return {port: _port, link: _link}
    }

})

// NEW
// string inPort

Object.defineProperty(oNodeLink.prototype, 'inPort', {
    get : function(){
    }
})

 
// oNodeLink Class methods



//////////////////////////////////////
//////////////////////////////////////
//                                  //
//                                  //
//          oPalette class          //
//                                  //
//                                  //
//////////////////////////////////////
//////////////////////////////////////
 
 
// Constructor
//
// oPalette(paletteObject)
//
// Properties
//
// string id
// string name
// string path
// bool selected
// {[oColor]} colors
//
// Methods
//
// addColor (name, type, colorData)

 
// oPalette constructor
 
function oPalette(paletteObject, oSceneObject, paletteListObject){
    this.paletteObject = paletteObject;
    this._paletteList = paletteListObject;
    this.scene = oSceneObject;
}
 
 
// oPalette Object Properties


// NEW
// string id
 
Object.defineProperty(oPalette.prototype, 'id', {
    get : function(){
         return this.paletteObject.id;
    },
 
    set : function(newId){
        // TODO: same as rename maybe?
    }

})


// String name
 
Object.defineProperty(oPalette.prototype, 'name', {
    get : function(){
         return this.paletteObject.getName();
    },
 
    set : function(newName){
        // TODO: Rename palette file then unlink and relink the palette
 
    }
})
 
 
// String path
 
Object.defineProperty(oPalette.prototype, 'path', {
    get : function(){
         var _path = this.paletteObject.getPath()
         _path = fileMapper.toNativePath(_path)
         return _path+this.name+".plt"
    },
 
    set : function(newPath){
        // TODO: move palette file then unlink and relink the palette ? Or provide a move() method
    }
})


// NEW
// bool selected
 
Object.defineProperty(oPalette.prototype, 'selected', {
    get : function(){
        var _currentId = PaletteManager.getCurrentPaletteId()
        return this.id == _currentId;
    },
 
    set : function(isSelected){
        // TODO: find a way to work with index as more than one color can have the same id, also, can there be no selected color when removing selection?
        if (isSelected){
            var _id = this.id;
            PaletteManager.setCurrentPaletteById(_id);
        }
    }
})


// NEW
// {[oColor]} colors

Object.defineProperty(oPalette.prototype, 'colors', {
    get : function(){
        var _palette = this.paletteObject
        var _colors = []
        for (var i = 0; i<_palette.nColors; i++){
            _colors.push (new oColor (this, i))
        }
        return _colors
    }
})


// oPalette Class methods

// NEW
// addColor (name, type, colorData)

oPalette.prototype.addColor = function (name, type, colorData){
    // TODO
}

//NEW
// remove()

oPalette.prototype.remove = function (removeFile){
    if (typeof removeFile === 'undefined') var removeFile = false;
    
    this._paletteList.removePaletteById(this.id)
    
    if (removeFile){
        var _paletteFile = new oFile(this.path)
        _paletteFile.remove();
    }
}

// NEW

//////////////////////////////////////
//////////////////////////////////////
//                                  //
//                                  //
//           oColor class           //
//                                  //
//                                  //
//////////////////////////////////////
//////////////////////////////////////
 
 
// Constructor
//
// oColor(oPaletteObject, index)
//
// Properties
//
// {oPalette} palette
// {Color} colorObject
// string name
// string id
// int index
// string type       can be "solid", "texture", "gradient" or "radial gradient"
// bool selected
// string value      use hex strings "#rrggbbaa" and arrays of {color, position} objects for gradients
//
// Methods
//
// void moveToPalette(oPaletteObject, index)
// bool remove ()
// string rgbaToHex(rgbaObject)
// Object hexToRgba(hexString)


// oColor constructor
 
function oColor(oPaletteObject, index){
    // We don't use id in the constructor as multiple colors with the same id can exist in the same palette.
    this.palette = oPaletteObject;
    this._index = index;
}
 
 
// oColor Object Properties

// NEW
// color colorObject

Object.defineProperty(oColor.prototype, 'colorObject', {
    get : function(){
        return this.palette.paletteObject.getColorByIndex(this._index);
    }
})


// NEW
// String name

Object.defineProperty(oColor.prototype, 'name', {
    get : function(){
        var _color = this.colorObject;
        return _color.name;
    },
 
    set : function(newName){
        var _color = this.colorObject;
        _color.setName(newName);
    }
})


// NEW
// string id

Object.defineProperty(oColor.prototype, 'id', {
    get : function(){
        var _color = this.colorObject;
        return _color.id
    },
 
    set : function(newId){
        // TODO: figure out a way to change id? Create a new color with specific id in the palette?
    }
})


// NEW
// int index

Object.defineProperty(oColor.prototype, 'index', {
    get : function(){
        return this._index;
    },
 
    set : function(newIndex){
        var _color = this.palette.paletteObject.moveColor(this._index, newIndex);
        this._index = newIndex;
    }
})


// NEW
// string type

Object.defineProperty(oColor.prototype, 'type', {
    get : function(){
        var _color = this.colorObject;
        if (_color.isTexture()) return "texture";

        switch (_color.colorType) { 
            case PaletteObjectManager.Constants.ColorType.SOLID_COLOR: 
                return "solid";
            case PaletteObjectManager.Constants.ColorType.LINEAR_GRADIENT :
                return "gradient";
            case PaletteObjectManager.Constants.ColorType.RADIAL_GRADIENT:
                return "radial gradient";
            default:
        }
    }
})


// NEW
// bool selected

Object.defineProperty(oColor.prototype, 'selected', {
    get : function(){
        var _currentId = PaletteManager.getCurrentColorId()
        var _colors = this.palette.colors;
        var _ids = _colors.map(function(x){return x.id})
        return this._index == _ids.indexOf(_currentId);
    },
 
    set : function(isSelected){
        // TODO: find a way to work with index as more than one color can have the same id, also, can there be no selected color when removing selection?
        if (isSelected){
            var _id = this.id;
            PaletteManager.setCurrentColorById(_id);
        }
    }
})


// NEW
// string value
// Takes a string or array of strings for gradients and filename for textures. Instead of passing rgba objects, it accepts "#rrggbbaa" hex strings for convenience.
// To set gradients, provide an array of {string color, double position} objects that define a gradient scale.

Object.defineProperty(oColor.prototype, 'value', {
    get : function(){
        var _color = this.colorObject;
        switch(this.type){
            case "solid":
                return this.rgbaToHex(_color.colorData)
            case "texture":
                // TODO: no way to return the texture file name?
            case "gradient":
            case "radial gradient":
                var _gradientArray = _color.colorData;
                var _value = [];
                for (var i = 0; i<_gradientArray.length; i++){
                    var _tack = {}
                    _tack.color = this.rgbaToHex(_gradientArray[i])
                    _tack.position = _gradientArray[i].t
                    _value.push(_tack)
                }
                return _value;
            default:
        }
    },
 
    set : function(newValue){
        var _color = this.colorObject;
        switch(this.type){
            case "solid":
                _color.setColorData(this.hexToRgba(newValue));
                break;
            case "texture":
                // TODO: need to copy the file into the folder first?
                _color.setTextureFile(newValue);
                break;
            case "gradient":
            case "radial gradient":
                var _gradientArray = newValue;
                var _value = [];
                for (var i = 0; i<_gradientArray.length; i++){
                    var _tack = this.hexToRgba(_gradientArray[i].color)
                    _tack.t = _gradientArray[i]. position
                    _value.push()
                }
                _color.setColorData(_value);
                break;
            default:
        };
    }
})


// Methods

// NEW
// oColor moveToPalette (oPaletteObject, index)

oColor.prototype.moveToPalette = function (oPaletteObject, index){
    var _color = this.colorObject;
    
    oPaletteObject.paletteObject.cloneColor(_color)
    this.palette.paletteObject.removeColor(_color.id)

    var _colors = oPaletteObject.colors
    var _duplicate = _colors.pop()
    
    if (typeof index !== 'undefined') _duplicate.index = index;

    return _duplicate;
}


// NEW
// oColor remove ()

oColor.prototype.remove = function (){
    // TODO: find a way to work with index as more than one color can have the same id
    this.palette.paletteObject.removeColor(this.id);
}


// NEW
// oColor rgbaToHex (rgbaObject)

oColor.prototype.rgbaToHex = function (rgbaObject){
    var _hex = "#";
    _hex += rvbObject.r.toString(16)
    _hex += rvbObject.g.toString(16)
    _hex += rvbObject.b.toString(16)
    _hex += rvbObject.a.toString(16)

    return _hex;
}


// NEW
// oColor hexToRgba (hexString)

oColor.prototype.hexToRgba = function (hexString){
    var _rgba = {};
    _rgba.r = parseInt(hexString.slice(1,3), 16)
    _rgba.g = parseInt(hexString.slice(3,5), 16)
    _rgba.b = parseInt(hexString.slice(5,7), 16)
    _rgba.a = parseInt(hexString.slice(7,9), 16)

    return _rgba;
}


//////////////////////////////////////
//////////////////////////////////////
//                                  //
//                                  //
//          oPoint class            //
//                                  //
//                                  //
//////////////////////////////////////
//////////////////////////////////////
 
 
// oPoint constructor
 
function oPoint (x, y, z){
    if (typeof z === 'undefined') var z = 0;
 
    this.x = x;
    this.y = y;
    this.z = z;
}
 
 
//////////////////////////////////////
//////////////////////////////////////
//                                  //
//                                  //
//            oBox class            //
//                                  //
//                                  //
//////////////////////////////////////
//////////////////////////////////////
 
 
// Constructor
//
// oBox (left, top, right, bottom)
//
// Properties
//
// int top
// int left
// int right
// int bottom
// int width
// int height
// oPoint center
//
// Methods
//
// void include(oBox box)
//
 
 
// oBox constructor
 
 
// NEW
function oBox (left, top, right, bottom){
    // default box is one of -Infinity surface to easily call .include
    if (typeof top === 'undefined') var top = Infinity
    if (typeof left === 'undefined') var left = Infinity
    if (typeof right === 'undefined') var right = -Infinity
    if (typeof bottom === 'undefined') var bottom = -Infinity
   
    this.top = top;
    this.left = left;
    this.right = right;
    this.bottom = bottom;
}
 
 
// oBox Object Properties
 
// int width
 
Object.defineProperty(oBox.prototype, 'width', {
    get : function(){
         return this.right - this.left;
    }
})
 
 
// int height
 
Object.defineProperty(oBox.prototype, 'height', {
    get : function(){
         return this.bottom - this.top;
    }
})
 
 
// oPoint center
 
Object.defineProperty(oBox.prototype, 'center', {
    get : function(){
         return new oPoint(this.left+this.width/2, this.top+this.height/2)
    }
})
 
 
// oBox Class methods
 
// include(oBox box)
// Extend a box object to encompass another
 
oBox.prototype.include = function(box){
    if (box.left < this.left) this.left = box.left
    if (box.top < this.top) this.top = box.top
    if (box.right > this.right) this.right = box.right
    if (box.bottom > this.bottom) this.bottom = box.bottom
}

// includeNodes(oBox box)
// Extend a box object to encompass a set of nodes
 
oBox.prototype.includeNodes = function(oNodeArray){
    for (var i in oNodeArray){
         var _node = oNodeArray[i];
         var _nodeBox = _node.getBounds();
         this.include(_nodeBox);
    }
}
//////////////////////////////////////
//////////////////////////////////////
//                                  //
//                                  //
//          oFolder class           //
//                                  //
//                                  //
//////////////////////////////////////
//////////////////////////////////////
 
 
// Constructor:
//
// oFolder(string path)
//
// Properties:
//
// string path
//
// Methods:
//
// array getFiles()
 
function oFolder(path){
    this.path = fileMapper.toNativePath(path).split("\\").join("/")
}
 
 
Object.defineProperty(oFolder.prototype, 'name', {
    get: function(){
        var _name = this.path.slice(this.path.lastIndexOf("/")+1)
        return _name;
    }
})
 
 
// NEW
// {[oFile]} getFiles(filter)
 
oFolder.prototype.getFiles = function(filter){
    if (typeof filter === 'undefined') var filter = "*"
    // returns the list of oFile in a directory that match a filter
    var _path = this.path
    var _files = this.listFiles(filter).map(function(x){return new oFile(_path+"/"+x)});
   
    return _files;
}
 
// NEW
// {[string]} listFiles(filter)
 
oFolder.prototype.listFiles = function(filter){
   
    if (typeof filter === 'undefined') var filter = "*"
   
    var _dir = new QDir;
    _dir.setPath(this.path);
    _dir.setNameFilters([filter]);
    _dir.setFilter( QDir.Files);
    var _files = _dir.entryList()
   
    return _files;
}
 

// NEW
// {[oFolder]} getFolders(filter)
 
oFolder.prototype.getFolders = function(filter){
   
    if (typeof filter === 'undefined') var filter = "*"
    // returns the list of oFolder objects in a directory that match a filter
    var _path = this.path
    var _folders = this.listFolders(filter).map(function(x){return new oFolder(_path+"/"+x)});
 
    return _folders;
}
 
 
// NEW
// {[string]} listFolders(filter)
 
oFolder.prototype.listFolders = function(filter){
   
    if (typeof filter === 'undefined') var filter = "*"
   
    var _dir = new QDir;
    _dir.setPath(this.path);
    _dir.setNameFilters([filter]);
    _dir.setFilter(QDir.Dirs); //QDir.NoDotAndDotDot not supported?
    var _folders = _dir.entryList()
   
    for (var i = _folders.length-1; i>=0; i--){
        if (_folders[i] == "." || _folders[i] == "..") _folders.splice(i,1);
    }
   
    return _folders
}
 
 
//////////////////////////////////////
//////////////////////////////////////
//                                  //
//                                  //
//           oFile class            //
//                                  //
//                                  //
//////////////////////////////////////
//////////////////////////////////////
 
 
// Constructor:
//
// oFile(string path)
//
// Properties:
//
// string path
//
// Methods:
//
// string readFile()
// bool writeFile(string content(, bool append))
 
function oFile(path){
    this.path = fileMapper.toNativePath(path).split('\\').join('/')
}


// string name
 
Object.defineProperty(oFile.prototype, 'name', {
    get: function(){
        var _name = this.path.slice(this.path.lastIndexOf("/")+1, this.path.lastIndexOf("."))
        return _name;
    }
})


// string extension
 
Object.defineProperty(oFile.prototype, 'extension', {
    get: function(){
        var _extension = this.path.slice(this.path.lastIndexOf(".")+1)
        return _extension;
    }
})
 
 
//NEW
// oFolder folder
 
Object.defineProperty(oFile.prototype, 'folder', {
    get: function(){
        var _folder = this.path.slice(0,this.path.lastIndexOf("/")-1)
        return new oFolder(_folder);
    }
})
 
 
//NEW
// bool exists
Object.defineProperty(oFile.prototype, 'exists', {
    get: function(){
        var _file = new File (this.path)
        return _file.exists;
    }
})
 
 
oFile.prototype.readFile = function() {
    var file = new File(this.path);
 
    try {
        if (file.exists) {
            file.open(FileAccess.ReadOnly);
            var string = file.read();
            file.close();
            return string;
        }
    } catch (err) {
        return null
    }
}
 
 
// NEW
// writeFile(string content, bool append)
 
oFile.prototype.writeFile = function(content, append){
    if (typeof append === 'undefined') var append = false
   
    var file = new File(this.path);
    try {
        if (append){
            file.open(FileAccess.Append);
        }else{
            file.open(FileAccess.WriteOnly);
        }
        file.write(content);
        file.close();
        return true
    } catch (err) {return false;}
}
 
 
// NEW
// move(string destPath, bool overwrite)
 
oFile.prototype.move = function(destPath, overwrite){
    if (typeof overwrite === 'undefined') var overwrite = false;
   
    var _file = new PermanentFile(this.path)
    var _dest = new PermanentFile(destPath)
   
    if (_dest.exists){
        if (!overwrite) throw "destination file "+destPath+" exists and will not be overwritten. Can't move file."
    }
 
    return _file.move(_dest);
}
 
 
// NEW
// bool copy(string destPath, bool overwrite)
 
oFile.prototype.copy = function(destPath, overwrite){
    if (typeof overwrite === 'undefined') var overwrite = false;
   
    var _file = new PermanentFile(this.path)
    var _dest = new PermanentFile(destPath)
   
    if (_dest.exists){
        if (!overwrite) throw "destination file "+destPath+" exists and will not be overwritten. Can't copy file."
    }
    
    return _file.copy(_dest);
}


// NEW
// bool remove()
 
oFile.prototype.remove = function(){
    var _file = new PermanentFile(this.path)
    if (_file.exists) return _file.remove()
}
 
 
//////////////////////////////////////
//////////////////////////////////////
//                                  //
//                                  //
//          oDebug class            //
//                                  //
//                                  //
//////////////////////////////////////
//////////////////////////////////////
 
// Properties
// string debugLevel
//
// Methods
// log(message (, debugLevel))
// logObj(object (, debugLevel))
 
 
// oDebug constructor
 
function oDebug(debugLevel) {
    this.debugLevel = debugLevel;
}
 
 
// oDebug Object Properties
 
// oDebug Class methods
 
// log(message (, debugLevel))
// outputs the given message to the MessageLog. Allows the user to specify a debug level required for output.
 
oDebug.prototype.log = function(message, debugLevel){
    if (typeof debugLevel === 'undefined') var debugLevel = 'general'
 
    if (debugLevel == this.debugLevel){
        MessageLog.trace(message)
    }
}
 
 
// logObj(object (, debugLevel))
 
oDebug.prototype.logObj = function(object, debugLevel){
    if (typeof debugLevel === 'undefined') var debugLevel = 'general'
 
    if (debugLevel == this.debugLevel){
        for (var i in object){
            try {
                this.log(i+' : '+object[i])
                if (typeof object[i] == "Object"){
                    this.log(' -> ')
                    this.logObj(object[i])
                    this.log(' ----- ')
                }
            }
            catch(error){}
        }
    }
}


