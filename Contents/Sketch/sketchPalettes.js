


function loadPalette(context) {
	
	var doc = context.document;
	var mspalette = [];
	var openPanel = NSOpenPanel.openPanel();
	
	openPanel.setCanChooseDirectories(true);
	openPanel.setCanChooseFiles(true);
	openPanel.setCanCreateDirectories(true);
	openPanel.setTitle("Choose a file");
	openPanel.setPrompt("Choose");
	// openPanel.setDirectoryURL(NSURL.URLWithString("~/Documents"))
	
	openPanel.runModal();
	
	// Gte filepath to file selected
	var filePath = openPanel.URLs().firstObject().path();
	
	// Read contents of file into NSString
	var fileContents = NSString.stringWithContentsOfFile(filePath);
	
	// Get NSArray of colors
	var palette = fileContents.componentsSeparatedByString(",");
	

	for (var i = 0; i < palette.count(); i++) {
		
		// Get hex string from NSString
		var simpleColor = palette[i].toString();
		
		// Convert hex string to MSColor
		var mscolor = MSColor.colorWithSVGString(palette[i]);
		
		// Add MSColor to palette array
		mspalette.push(mscolor);
		
	};
	
	// Convert array into MSArray
	var documentColors = MSArray.dataArrayWithArray(mspalette);
	
	// Load colors into Sketch Document Colors
	doc.documentData().assets().setPrimitiveColors(documentColors);
}


// ------------------------------------------------------------------------------------------------------------------------


function clearPalette(context) {
	
	var doc = context.document;
	var palette = [];	
	var mspalette = [];

	for (var i = 0; i < palette.length; i++) {
		mspalette.push(MSColor.colorWithSVGString(palette[i]));
	};

	doc.documentData().assets().setPrimitiveColors(MSArray.dataArrayWithArray(mspalette));
	
}


// ------------------------------------------------------------------------------------------------------------------------


function okcupidPalette(context) {
	
	var doc = context.document;
	
	var palette = [
		'#000000',
		'#ffffff',
		// gray
		'#474d59',
		'#5e6573',
		'#949aa6',
		'#aeb4bf',
		'#ccd0d9',
		'#ebedf2',
		'#f3f5f9',
		'#fafbfd',
		'#2a2f35',
		'#1e1e1e',
		// blue
		'#104da1',
		'#3260c7',
		'#4c7bd9',
		'#9dbaf2',
		'#d5e0f8',
		'#e4edfd',
		'#07408d',
		// teal
		'#30b7c4',
		'#4fc5d0',
		'#76dadd',
		'#d5f7f7',
		'#9ee8e8',
		// green
		'#1fc174',
		'#00d280',
		'#48e588',
		'#bcf1cd',
		'#d6f4df',
		'#76ee9d',
		// red
		'#f95133',
		'#fb674e',
		'#ffc0bb',
		'#fa8575',
		'#e84832',
		// pink
		'#ea1c53',
		'#f93b66',
		'#ff597e',
		'#ff8aa4',
		'#fedbe3',
		'#fcecf2',
		// yellow
		'#e8a610',
		'#f8c637',
		'#ffd939',
		'#f9eaac',
		'#f9f3dc',
		'#ffe36c'
	];

	var mspalette = [];

	for (var i = 0; i < palette.length; i++) {
		mspalette.push(MSColor.colorWithSVGString(palette[i]));
	};

	doc.documentData().assets().setPrimitiveColors(MSArray.dataArrayWithArray(mspalette));
}


// ------------------------------------------------------------------------------------------------------------------------


function test(context) {
	
	
	
	
	var myJson = '{ "fuck": "shit" }';
	var myObject = JSON.parse(myJson);
	log(myObject);
	log(myObject.fuck);
	log(typeof(myObject.fuck));
	var dataToSave = JSON.stringify(myObject);
	
	
	
	
	
	return;
	
	var doc = context.document;
	var plugin = context.plugin;
	
	var fileManager = NSFileManager.defaultManager();
	var openPanel = [NSOpenPanel openPanel]
	
	[openPanel setCanChooseDirectories:true]
	[openPanel setCanChooseFiles:true]
	[openPanel setCanCreateDirectories:true]

	// [openPanel setDirectoryURL: [NSURL URLWithString:"~/Documents"]]

	[openPanel setTitle:"Choose a file"]
	[openPanel setPrompt:"Choose"]
	[openPanel runModal]
	
	if(openPanel.URLs()) {
		
		var filePath = openPanel.URLs().firstObject().path();

		log(filePath);

		var fileContents = NSString.stringWithContentsOfFile(filePath);

		log(fileContents);
		
		var palette = fileContents.componentsSeparatedByString(",");
		
		log(palette.count());
		
	}
	
	
	return;
	
	
	
	
	
	var mspalette = [];

	for (var i = 0; i < palette.count(); i++) {
		// log(palette[i].UTF8String())
		mspalette.push(MSColor.colorWithSVGString(palette[i]));
	};

	doc.documentData().assets().setPrimitiveColors(MSArray.dataArrayWithArray(mspalette));
	
	
	// var fileData = fileContents.dataUsingEncoding(NSUTF8StringEncoding);
	
	// log(fileData);
	
	// var fileJson = [NSJSONSerialization JSONObjectWithData:fileData options:0 error:nil];
	
	// log(fileJson);
	
	
	
	// For manifest.json
	//
	// {
	// 	"name": "Test",
	// 	"identifier": "test",
	// 	"shortcut": "",
	// 	"script": "sketchPalettes.js",
	// 	"handler": "test"
	// }
	
	
}