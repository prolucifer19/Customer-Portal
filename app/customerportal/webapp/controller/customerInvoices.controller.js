sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/model/json/JSONModel",
  "sap/m/MessageBox",
  "sap/m/MessageToast"

], (Controller, JSONModel, MessageBox, MessageToast) => {
  "use strict";

  return Controller.extend("customerportal.controller.customerInvoices", {
    onInit() {
      var oModel = new sap.ui.model.odata.v4.ODataModel({
        serviceUrl: "/odata/v4/customerportalservice/",
        synchronizationMode: "None",
        operationMode: "Server"
    });
    this.getView().setModel(oModel);

    // Initialize JSON model for invoice data
    var invoiceModel = new sap.ui.model.json.JSONModel({
        data: []
    });
    this.getView().setModel(invoiceModel, "invoiceDataModel");
    },

    onSearch: async function () {
      // Get the selected gas day from DatePicker
      const sSelectedBillingDate = this.getView().byId("cusInDatePickerBillingDate").getValue();

      if (!sSelectedBillingDate) {
        MessageToast.show("Please select a Billing Date");
        return;
      }
      var oVbx = this.byId("cusInVBoxBilling")
      oVbx.setVisible(true);
      // Open the dialog and bind the data to the table
      await this.getInvoiceData(sSelectedBillingDate)

    },

		// getInvoiceData: function (selectedDate) {
    //   let payload = {
    //     "Gasday": selectedDate
    //   }
    //   let oModel = this.getView().getModel();
    //   let oBindList = oModel.bindList("/getInvoiceData");
    //   oBindList.create(payload, true);
    //   oBindList.attachCreateCompleted((oEvent) => {
    //     let params = oEvent.getParameters();
    //     if (params.success) {
    //       let response = params.context.getObject();
    //       let receivedData = response.value.invoiceData
    //       console.log("received data", receivedData)
    //       if (receivedData.length === 0) {
    //         sap.m.MessageBox.error("No Data Found for the Selected Transport System");
    //         return;
    //       }
    //       var invoiceModel = new sap.ui.model.json.JSONModel(receivedData);
    //       this.getView().setModel(invoiceModel, "invoiceDataModel");


    //     } else {
    //       console.error("Failed to create entry in gasLocation", params);
    //     }
    //   })
    // },

    
    getInvoiceData: async function (selectedDate) {
      let oModel = this.getView().getModel();
      
      if (!(oModel instanceof sap.ui.model.odata.v4.ODataModel)) {
          console.error("Error: Model is not an OData V4 Model.");
          return;
      }
  
      let sPath = "/getInvoiceData";//(cant find this entity or api or function)
      let oListBinding = oModel.bindList(sPath);
  
      try {
          let aContexts = await oListBinding.requestContexts(0, Infinity);
  
          if (!Array.isArray(aContexts) || aContexts.length === 0) {
              sap.m.MessageBox.error("No Data Found for the Selected Transport System");
              return;
          }
  
          let receivedData = aContexts.map(oContext => oContext.getObject());
  
          var invoiceModel = new sap.ui.model.json.JSONModel(receivedData);
          this.getView().setModel(invoiceModel, "invoiceDataModel");
  
          console.log("Received Data", receivedData);
      } catch (error) {
          console.error("Failed to fetch invoice data", error);
      }
  },
    
    onBillingUpdateStarted: function (oEvent) {
      this.oBusyDialog = this.setBusyDialog(
        "Loading..",
        `..Billing Data..`
      );
      this.oBusyDialog.open()
    },
    onBillingUpdateFinished: function (oEvent) {
      if (this.oBusyDialog) {
        this.oBusyDialog.close();
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