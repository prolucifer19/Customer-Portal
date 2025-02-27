sap.ui.define([
	'sap/ui/Device',
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel"
], (Device, Controller, JSONModel) => {
	"use strict";

	return Controller.extend("customerportal.controller.allocatedQuantity", {
		onInit() {
			var oModel = new sap.ui.model.odata.v4.ODataModel({
				serviceUrl: "/odata/v4/customerportalservice/",
				synchronizationMode: "None",
				operationMode: "Server"
			});
			this.getView().setModel(oModel);
			console.log("Model Metadata Name:", oModel.getMetadata().getName());
			var oTicketModel = new JSONModel({
				data: []
			});
			this.getView().setModel(oTicketModel, "ticketModel");
			
		},

		//Gasday is being selected
		onSearchAllocationQtyCust: function () {
			// Get the selected gas day from DatePicker
			const sSelectedDate = this.getView().byId("alloQDatePickerPostingDate").getValue();

			if (!sSelectedDate) {
				MessageToast.show("Please select a Post Date");
				return;
			}
			console.log("Selected Date:", sSelectedDate);
			this.loadTicketData(sSelectedDate);
			var oVbx = this.byId("alloQVBoxTab")
			oVbx.setVisible(true);

		},


		loadTicketData: async function (sSelectedDate) {
			let that = this;
			this.oBusyDialog = this.setBusyDialog(
				"Loading..",
				`Fetching Data of - ${sSelectedDate}..`
			);
			this.oBusyDialog.open();
		
			var oModelTicketData = this.getView().getModel();
			var oTicketModel = this.getView().getModel("ticketModel");
		
			if (!(oModelTicketData instanceof sap.ui.model.odata.v4.ODataModel)) {
				console.error("Error: Model is not an OData V4 Model.");
				this.oBusyDialog.close();
				return;
			}
		
			var sPath = "/xGMSxTKTDETAILS03";
		
			try {
				// var oListBinding = oModelTicketData.bindList(sPath, undefined, undefined, undefined, {
				// 	$expand: "to_flow"
				// });
		
				// let aContexts = await oListBinding.requestContexts(0, Infinity);
				var oListBinding = oModelTicketData.bindList(sPath);
				let aContexts = await oListBinding.requestContexts(0, Infinity);
		
				if (!Array.isArray(aContexts) || aContexts.length === 0) {
					console.error("Expected a non-empty array of contexts, but got:", aContexts);
					this.oBusyDialog.close();
					return;
				}
		
				let TicketdataModel = aContexts.map(function (oContext) {
					let oData = oContext.getObject();
					let flowData = oData.to_flow || [];
		
					oData.SalesOrder = "";
					oData.Delivery = "";
					oData.GoodIssues = "";
		
					flowData.forEach(function (flowItem) {
						switch (flowItem.DocumentCategory) {
							case 'C':
								oData.SalesOrder = flowItem.DocumentNumber;
								break;
							case 'J':
								oData.Delivery = flowItem.DocumentNumber;
								break;
							case 'h':
								oData.GoodIssues = flowItem.DocumentNumber;
								break;
						}
					});
		
					return oData;
				});
		
				if (sSelectedDate) {
					TicketdataModel = TicketdataModel.filter(function (oItem) {
						return oItem.CreatedDate === sSelectedDate;
					});
				}
		
				oTicketModel.setProperty("/data", TicketdataModel);
				console.log("Filtered Data", TicketdataModel);
			} catch (oError) {
				console.error("Error fetching data", oError);
			} finally {
				that.oBusyDialog.close();
			}
		},
		

		setBusyDialog: function (dialogTitle, dialogText) {
			let oBusyDialog = new sap.m.BusyDialog({
				title: dialogTitle,
				text: dialogText,
			});
			return oBusyDialog;
		},

	});
});