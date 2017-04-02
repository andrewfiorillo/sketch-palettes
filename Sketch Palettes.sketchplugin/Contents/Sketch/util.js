
function rect(x,y,w,h) {
	var rect = NSMakeRect(x,y,w,h)
	return rect;
}

function createLabel(frame, size, bold, text) {
	var label = NSTextField.alloc().initWithFrame(frame);	
	label.setStringValue(text);
	label.setBezeled(false);
	label.setDrawsBackground(false);
	label.setEditable(false);
	label.setSelectable(false);	
	if (bold) {
		label.setFont(NSFont.boldSystemFontOfSize(size));
	}
	else {
		label.setFont(NSFont.systemFontOfSize(size));
	}
	return label;
}


function createSelect(frame, items) {
	var select = NSPopUpButton.alloc().initWithFrame(frame);
	select.addItemsWithTitles(items);
	return select;
}