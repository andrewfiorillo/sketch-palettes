
function test(context) {
	
	var doc = context.document;
	var plugin = context.plugin;
	
	var fileManager = NSFileManager.defaultManager();
	var openPanel = [NSOpenPanel openPanel]
	
	[openPanel setCanChooseDirectories:true]
	[openPanel setCanChooseFiles:true]
	[openPanel setCanCreateDirectories:true]

	[openPanel setDirectoryURL: [NSURL URLWithString:"~/Documents"]]

	[openPanel setTitle:"Choose a file"]
	[openPanel setPrompt:"Choose"]
	[openPanel runModal]

	var filePath = openPanel.URLs().firstObject().path();

	log(filePath);

	var fileContents = NSString.stringWithContentsOfFile(filePath);

	// log(fileContents);
	
	var palette = fileContents.componentsSeparatedByString(",");
	
	log(palette.count());
	
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

	
}


// ------------------------------------------------------------------------------------------------------------------------


function loadPalette(context) {
	
	var doc = context.document;
	var plugin = context.plugin;
	
	
	// var paletteContents = NSData.dataWithContentsOfFile(NSURL.URLWithString("~/Documents/test.sketchpalette"));
	
	// var pathString = NSString.stringWithUTF8String("~/Documents/test.sketchpalette");
	
	
	// var content = [NSString stringWithContentsOfFile:"~/Documents/test.sketchpalette"];
	

	// var palette = ["#FF5757","#FFFFFF","#23D5D6"];


	// log(sketch.scriptPath.stringByDeletingLastPathComponent());
	// var dir = sketch.scriptPath.stringByDeletingLastPathComponent();


	var openPanel = NSOpenPanel.openPanel();

	openPanel.setCanChooseDirectories(true);
	openPanel.setCanChooseFiles(true);
	openPanel.setCanCreateDirectories(true);
	
	openPanel.setDirectoryURL(NSURL.URLWithString("~/Documents/"));
	openPanel.setTitle("Choose a file");
	openPanel.setPrompt("Choose")
	
	openPanel.runModal();
	
	var fileURLs = openPanel.URLs();
	
	if (fileURLs.count() > 0) {
		var filePath = fileURLs.firstObject().path();
		log(filePath);
	}
	
	// var filePath = openPanel.URLs().firstObject().path();
	
	// log(filePath);
	
	// [openPanel setDirectoryURL:pluginDir]

	// [openPanel setDirectoryURL: [NSURL URLWithString:pluginDir]]
	// openPanel.setDirectoryURL(NSURL.fileURLWithPath("~/Documents/"));


	// var filePath = openPanel.URLs().firstObject().path();

	// log(filePath)

	// var fileContents = NSString.stringWithContentsOfFile(filePath);
	// var fileContents = NSDictionary.dictionaryWithContentsOfFile(filePath)

	// var txtFileContents = [NSString stringWithContentsOfFile:txtFilePath encoding:NSUTF8StringEncoding error:NULL];
	// var fileContents = NSString.stringWithContentsOfFile(filePath);

	// var fileData = fileContents.dataUsingEncoding(NSUTF8StringEncoding);

	// var fileArray = MSArray.dataArrayWithArray(fileContents);




	// var jSonData = NSData.dataWithContentsOfURL(NSURL.URLWithString(filePath));
	// var jSonData = NSData.dataWithContentsOfURL(filePath);

	// var palette = fileContents.split(",");

	
	return;



	var palette = [
		'#000000',
		'#ffffff'
	];

	var mspalette = [];

	for (var i = 0; i < palette.length; i++) {
		mspalette.push(MSColor.colorWithSVGString(palette[i]));
	};

	doc.documentData().assets().setPrimitiveColors(MSArray.dataArrayWithArray(mspalette));


}


// ------------------------------------------------------------------------------------------------------------------------


function fillPalette(context, palette) {
	var doc = context.document;
	// var palette = [];
	var mspalette = [];

	for (var i = 0; i < palette.length; i++) {
		mspalette.push(MSColor.colorWithSVGString(palette[i]));
	};

	doc.documentData().assets().setPrimitiveColors(MSArray.dataArrayWithArray(mspalette));
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
	
	// fillPalette(context,[]);
	
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
