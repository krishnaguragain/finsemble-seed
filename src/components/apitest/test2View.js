function renderPage() {
	/* Linker client button */
	const linkerSub = $("<p class='instruct'>Subscribe before doing any linker publish</p></br><linkerSub class='functionBtn'>Linker Subscribe</linkerSub></br>");
	linkerSub.click(function () {
		triggerLinkerSub();
	});
	$("#functionBtns").append(linkerSub);
	const linkerUnsub = $("<linkerUnsub class='functionBtn'>Linker Unsubscribe</linkerUnsub></br>");
	linkerUnsub.click(function () {
		triggerLinkerUnsub();
	});
	$("#functionBtns").append(linkerUnsub);

	/* Router client buttons */
	const routerSub = $("<p class='instruct'>Add Pub sub Responder in 'API Testing 1' before subscribe</p></br><routerSub class='functionBtn'>Router Subscribe</routerSub><br/>");
	routerSub.click(function () {
		triggerRouterSub();
	});
	$("#functionBtns").append(routerSub);
	const routerUnsub = $("<routerUnsub class='functionBtn'>Router Unsubscribe</routerUnsub></br>");
	routerUnsub.click(function () {
		triggerRouterUnsub();
	});
	$("#functionBtns").append(routerUnsub);
	const routerAddResponder = $("<routerAddResponder class='functionBtn'>Router Add Responder</routerAddResponder></br>");
	routerAddResponder.click(function () {
		triggerRouterAddResponder();
	});
	$("#functionBtns").append(routerAddResponder);
	const routerRemoveResponder = $("<routerRemoveResponder class='functionBtn'>Router Remove Responder</routerRemoveResponder></br>");
	routerRemoveResponder.click(function () {
		triggerRouterRemoveResponder();
	});
	$("#functionBtns").append(routerRemoveResponder);
	const routerAddListener = $("<routerAddListener class='functionBtn'>Router Add Listener</routerAddListener></br>");
	routerAddListener.click(function () {
		triggerRouterAddListener();
	});
	$("#functionBtns").append(routerAddListener);
	const routerRemoveListener = $("<routerRemoveListener class='functionBtn'>Router Remove Listener</routerRemoveListener></br>");
	routerRemoveListener.click(function () {
		triggerRouterRemoveListener();
	});
	$("#functionBtns").append(routerRemoveListener);
	const routerDisconnectAll = $("<routerDisconnectAll class='functionBtn'>Router Disconnect All</routerDisconnectAll></br>");
	routerDisconnectAll.click(function () {
		triggerRouterDisconnectAll();
	});
	$("#functionBtns").append(routerDisconnectAll);

	/* DistributedStore Client buttons */
	const addStoreListener = $("<addStoreListener class='functionBtn'>Add Store Listeners</addStoreListener></br>");
	addStoreListener.click(function () {
		triggerAddStoreListener();
	});
	$("#functionBtns").append(addStoreListener);
	const removeStoreListener = $("<removeStoreListener class='functionBtn'>Remove Store Listeners</removeStoreListener></br>");
	removeStoreListener.click(function () {
		triggerRemoveStoreListener();
	});
	$("#functionBtns").append(removeStoreListener);
}