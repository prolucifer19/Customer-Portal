sap.ui.define([
    'sap/ui/Device',
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
  ], (Device, Controller, JSONModel) => {
    "use strict";
  
    return Controller.extend("customerportal.controller.allocatedQuantity", {
        onInit() {
			this.oModel = new JSONModel();
			this.oModel.loadData(sap.ui.require.toUrl("app/customerportal/model/model.json"), null, false);
			this.getView().setModel(this.oModel);
			//----------------------------------------------
			var oTicketModel = new JSONModel({
				data: []
			});
			this.getView().setModel(oTicketModel, "ticketModel");

        },

     // *************************Allocated Quantity ******************************

		loadTicketData: function (sSelectedDate) {
			let that = this;
			this.oBusyDialog = this.setBusyDialog(
				"Loading..",
				`Fetching Data of - ${sSelectedDate}..`
			);
			this.oBusyDialog.open();
			var oModelTicketData = this.getOwnerComponent().getModel();
			var oTicketModel = this.getView().getModel("ticketModel");

			var sPath = "/xGMSxTKTDETAILS03";

			var oListBinding = oModelTicketData.bindList(sPath, undefined, undefined, undefined, {
				$expand: "to_flow"
			});

			oListBinding.requestContexts(0, Infinity).then(function (aContexts) {
				if (!Array.isArray(aContexts) || aContexts.length === 0) {
					console.error("Expected a non-empty array of contexts, but got:", aContexts);
					return;
				}

				let TicketdataModel = aContexts.map(function (oContext) {
					let oData = oContext.getObject();
					let flowData = oData.to_flow || [];

					// Initialize columns for Sales Order, Delivery, and Good Issues
					oData.SalesOrder = "";
					oData.Delivery = "";
					oData.GoodIssues = "";

					flowData.forEach(function (flowItem) {
						switch (flowItem.DocumentCategory) {
							case 'C': // Sales Order
								oData.SalesOrder = flowItem.DocumentNumber;
								break;
							case 'J': // Delivery
								oData.Delivery = flowItem.DocumentNumber;
								break;
							case 'h': // Good Issues
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
			}).catch(function (oError) {
				console.error("Error fetching data", oError);
			}).finally(function () {
				that.oBusyDialog.close();
			});
		},




		setBusyDialog: function (dialogTitle, dialogText) {
			let oBusyDialog = new sap.m.BusyDialog({
				title: dialogTitle,
				text: dialogText,
			});
			return oBusyDialog;
		},

		onSearchAllocationQtyCust: function () {
			// Get the selected gas day from DatePicker
			const sSelectedDate = this.getView().byId("alloQDatePickerPostingDate").getValue();

			if (!sSelectedDate) {
				MessageToast.show("Please select a Post Date");
				return;
			}
			this.loadTicketData(sSelectedDate);
			var oVbx = this.byId("alloQVBoxTab")
			oVbx.setVisible(true);

		},

    });
  });