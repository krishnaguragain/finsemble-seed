import React from 'react';
import { ReactComponent as DragHandleIcon } from '../../../../assets/img/toolbar/drag-handle.svg'


const DragHandle = () => {
	const handleMouseDown = (event) => {
		FSBL.Clients.WindowClient.startMovingWindow(event);
		console.log("Called WindowClient.startMovingWindow");
	};
	const handleMouseUp = () => {
		FSBL.Clients.WindowClient.stopMovingWindow();
		console.log("Called WindowClient.stopMovingWindow");
	};

	return (
		<span className="cq-drag finsemble-toolbar-drag-handle"
			onMouseDown={handleMouseDown}
			onMouseUp={handleMouseUp}
		>
			<DragHandleIcon />
		</span>
	)
};

export default DragHandle;
