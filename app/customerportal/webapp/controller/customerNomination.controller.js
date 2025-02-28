

sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/model/json/JSONModel",
  "sap/m/MessageBox",
  "sap/m/MessageToast"

], (Controller, JSONModel, MessageBox, MessageToast) => {
  "use strict";

  return Controller.extend("customerportal.controller.customerNomination", {
    onInit: function () {

      // Create OData v4 model dynamically
      let oModel = new sap.ui.model.odata.v4.ODataModel({
        serviceUrl: "/odata/v4/customerportalservice/"
      });

      // Set the OData model to the view
      this.getView().setModel(oModel, "odataModel");

      // Wait until the model is ready
      this.getView().attachModelContextChange(() => {
        if (!this._dataLoaded) {  // Prevent multiple calls
          this._dataLoaded = true;
          this.getNominations();
        }
      });

      const initialDelvData = {
        DeliveryPoints: [{
          DeliveryPt: "",
          DNQ: "",
          UOM: "",
          From: "",
          To: "",
          Event: ""
        }]
      };

      const initialRelDelvData = {
        RedeliveryPoints: [{
          RedeliveryPt: "",
          DNQ: "",
          UOM: "",
          From: "",
          To: "",
          Event: ""
        }]
      };

      const oModelDel = new sap.ui.model.json.JSONModel(initialDelvData);
      const oModelReDel = new sap.ui.model.json.JSONModel(initialRelDelvData);
      this.getView().setModel(oModelDel, "DelvModelData");
      this.getView().setModel(oModelReDel, "RedlvModelData");

    },
    // onContDesc: function () {
    //   var oView = this.getView();
    //   if (!this._oDialogContDesc) {
    //     this._oDialogContDesc = sap.ui.xmlfragment(
    //       oView.getId(),
    //       "customerportal.fragment.contDesc",
    //       this
    //     );
    //     oView.addDependent(this._oDialogContDesc);
    //   }
    //   this._oDialogContDesc.open();
    // },



    getNominations: async function () {
      let oView = this.getView();
      let oModel = oView.getModel("odataModel");
      let oBindList = oModel.bindList("/getNominationsByCustomer?DocType='S'&Customer=1100000003");

      try {
        let aContexts = await oBindList.requestContexts();
        let aData = aContexts.map(oContext => oContext.getObject());
        console.log(aData, "adata"); // Debugging log

        // Create a JSONModel and set the data
        let newModelForContact = new sap.ui.model.json.JSONModel({ data: aData });
        oView.setModel(newModelForContact, "newModelForContact");
        console.log(oView.getModel("newModelForContact").getData(), "newModelForContact data");
        console.log(this.getView().getModel("newModelForContact").getData());

      } catch (error) {
        console.error("Error fetching nominations:", error);
        sap.m.MessageBox.error("Failed to fetch nominations.");
      }
    },

    onContDesc: function () {
      var oView = this.getView();

      // Ensure the model is set
      if (!oView.getModel("newModelForContact")) {
        sap.m.MessageBox.error("No contract data available.");
        return;
      }
      else {
        console.log("model found");
      }
      console.log("Model Data:", this.getView().getModel("newModelForContact").getData());

      // Create dialog if it doesn't exist
      if (!this._oDialogContDesc) {
        this._oDialogContDesc = sap.ui.xmlfragment(
          oView.getId(),
          "customerportal.fragment.contDesc",
          this
        );
        oView.addDependent(this._oDialogContDesc);
      }


      this._oDialogContDesc.open();
    },







    onBackMat: function () {
      var OvboxC = this.byId("cusNomVBoxContracts")
      OvboxC.setVisible(true)
      var OvboxM = this.byId("cusNomVBoxMaterials")
      OvboxM.setVisible(false)
    },




    // ON SELECT ITEM FROM LIST
    onSelectContract: async function (oEvent) {
      // Set the busy indicator for the Contracts control
      const oView = this.getView();
      const oContractsControl = oView.byId("cusNomPageContracts");
      const oVboxCon = oView.byId("cusNomVBoxContracts");
      const oVboxMat = oView.byId("cusNomVBoxMaterials");
      const oModel = this.getView().getModel("odataModel");

      oContractsControl.setBusy(true);
      oVboxCon.setVisible(false);
      oVboxMat.setVisible(true);
      try {
        const sContract = oEvent.getSource().getBindingContext("newModelForContact").getObject();
        const sPath = `/getContractDetailsAndPastNom?Vbeln='${encodeURIComponent(sContract.Vbeln)}'`;

        const oBindList = oModel.bindList(sPath);
        const aContexts = await oBindList.requestContexts(0, Infinity);
        const aContracts = aContexts.map(oContext => oContext.getObject());

        if (!aContracts || aContracts.length === 0) {
          sap.m.MessageToast.show("No nominations found for the selected contract.");
          return;
        }

        let oMaterialModel = oView.getModel("materialModel");
        if (!oMaterialModel) {
          oMaterialModel = new sap.ui.model.json.JSONModel();
          oView.setModel(oMaterialModel, "materialModel");
        }
        oMaterialModel.setProperty("/selectedMaterials", aContracts);
      } catch (oError) {
        console.error("Error fetching contract details:", oError.message || oError);
        sap.m.MessageBox.error("Failed to fetch contract details. Please try again later.");
      } finally {
        oContractsControl.setBusy(false);
      }

    },


    onSelectMaterial: function (oEvent) {
      const oView = this.getView();
      const oPage = oView.byId("root2");
      const oTableRedelivery = oView.byId("cusNomRedPointTable"); // Redelivery Table
      const oTableDelivery = oView.byId("cusNomDelPointTable"); // Delivery Table
      oPage.setBusy(true);

      try {
        // 🔹 Get selected material from the event binding context
        const oBindingContext = oEvent.getSource().getBindingContext("materialModel");
        if (!oBindingContext) {
          console.error("No binding context found for materialModel.");
          sap.m.MessageBox.warning("No data found for the selected material.");
          return;
        }

        const oSelectedMaterial = oBindingContext.getObject();
        console.log("Selected Material:", oSelectedMaterial);

        // 🔹 Ensure modelData exists in the view
        let oModelData = oView.getModel("modelData");
        if (!oModelData) {
          oModelData = new sap.ui.model.json.JSONModel();
          oView.setModel(oModelData, "modelData");
        }

        // 🔹 Set data for the model
        oModelData.setData(oSelectedMaterial);
        console.log("Model Data Set:", oModelData.getData());

        // 🔹 Set Redelivery Model Data
        const oModelDataRedlv = oView.getModel("RedlvModelData");
        const oModelDatadlv = oView.getModel("DelvModelData");

        if (oModelDataRedlv) {
          oModelDataRedlv.setProperty("/RedeliveryPoints/0/RedeliveryPt", oSelectedMaterial.RedeliveryPt);
          oModelDataRedlv.setProperty("/RedeliveryPoints/0/UOM", oSelectedMaterial.UOM);
        }

        if (oModelDatadlv) {
          oModelDatadlv.setProperty("/DeliveryPoints/0/DeliveryPt", oSelectedMaterial.DeliveryPt);
          oModelDatadlv.setProperty("/DeliveryPoints/0/UOM", oSelectedMaterial.UOM);
        }

        // 🔹 Set visibility of tables
        oTableRedelivery.setVisible(true); // Redelivery Table should always be visible
        oTableDelivery.setVisible(!!oSelectedMaterial.DeliveryPt); // Show Delivery Table only if DeliveryPt exists

      } catch (oError) {
        console.error("Error during material selection:", oError.message || oError);
        sap.m.MessageBox.error("An error occurred while processing the material selection. Please try again.");
      } finally {
        oPage.setBusy(false);
      }
    },

    Onsimulate: function () {
      if (!this._simulateDialog) {
        this._simulateDialog = sap.ui.xmlfragment("customerportal.fragment.simulatePopup", this);
        this.getView().addDependent(this._simulateDialog);
      }
      this._simulateDialog.open();
      const dnqValue = this.getView().byId("dnqGSA").getValue();
      const gasDay = this.getView().byId("selectedDate").getDateValue();
      this._addDNQPointToChart(dnqValue, gasDay)
    },


    onAddPress: function () {
      const oModel = this.getView().getModel("RedlvModelData");
      const aRedeliveryPoints = oModel.getProperty("/RedeliveryPoints");
      console.log("aRedeliveryPoints ", aRedeliveryPoints);


      // Add a new blank entry
      aRedeliveryPoints.push({
        RedeliveryPt: aRedeliveryPoints[0].RedeliveryPt,
        DNQ: "",
        UOM: aRedeliveryPoints[0].UOM,
        From: "",
        To: "",
        Event: ""
      });

      oModel.setProperty("/RedeliveryPoints", aRedeliveryPoints);
    },


    onDeletePress: function () {
      var oTable = this.byId("cusNomRedPointTable");
      var oModel = this.getView().getModel("RedlvModelData");
      var aRedeliveryPoints = oModel.getProperty("/RedeliveryPoints");

      // Get the selected item
      var aSelectedItems = oTable.getSelectedItems();
      if (aSelectedItems.length > 0) {
        var oSelectedItem = aSelectedItems[0];
        var iSelectedIndex = oTable.indexOfItem(oSelectedItem);

        // Ensure that the original row is not deleted
        if (iSelectedIndex > 0) {
          aRedeliveryPoints.splice(iSelectedIndex, 1); // Remove the selected element
        }
      } else if (aRedeliveryPoints.length > 1) {
        aRedeliveryPoints.pop(); // Remove the last element if no selection
      }

      oModel.setProperty("/RedeliveryPoints", aRedeliveryPoints);
    },


    onAddPressDel: function () {
      const oModel = this.getView().getModel("DelvModelData");
      const aDeliveryPoints = oModel.getProperty("/DeliveryPoints");
      console.log("aDeliveryPoints ", aDeliveryPoints);


      // Add a new blank entry
      aDeliveryPoints.push({
        DeliveryPt: aDeliveryPoints[0].DeliveryPt,
        DNQ: "",
        UOM: aDeliveryPoints[0].UOM,
        From: "",
        To: "",
        Event: ""
      });

      oModel.setProperty("/DeliveryPoints", aDeliveryPoints);

    },



    onDeletePressDel: function () {
      var oTable = this.byId("cusNomDelPointTable");
      var oModel = this.getView().getModel("DelvModelData");
      var aDeliveryPoints = oModel.getProperty("/DeliveryPoints");

      // Get the selected item
      var aSelectedItems = oTable.getSelectedItems();
      if (aSelectedItems.length > 0) {
        var oSelectedItem = aSelectedItems[0];
        var iSelectedIndex = oTable.indexOfItem(oSelectedItem);

        // Ensure that the original row is not deleted
        if (iSelectedIndex > 0) {
          aDeliveryPoints.splice(iSelectedIndex, 1); // Remove the selected element
        }
      } else if (aDeliveryPoints.length > 1) {
        aDeliveryPoints.pop(); // Remove the last element if no selection
      }

      oModel.setProperty("/DeliveryPoints", aDeliveryPoints);
    },





    //this the submit button function it is named as createNomination function

  //   createNomination: async function () {
  //     // Fetch Contract Details
  //     let selectedMaterialData = this._getContractDetails();
  //     let Gasday = this._getGasDay();
  //     let dynamicFields = this._getDynamicFields();

  //     if (!Gasday) {
  //       sap.m.MessageBox.error("Please select a Gas Day!");
  //       return;
  //     }
  //     console.log("Selected Material Data:", selectedMaterialData);
  //     // Extract Redelivery Points Data
  //     let nomi_toitem = this._getRedeliveryPoints(Gasday, selectedMaterialData);

  //     if (nomi_toitem.length === 0) {
  //       sap.m.MessageBox.error("No redelivery points found.");
  //       return;
  //     }

  //     // Check for duplicate From-To time entries
  //     if (this._hasDuplicateTimeEntries(nomi_toitem)) {
  //       sap.m.MessageBox.error("Duplicate 'From' and 'To' time entries found. Please check and correct them before submission.");
  //       return;
  //     }

  //     let totalDNQ = nomi_toitem.reduce((sum, item) => sum + parseFloat(item.Pdnq || 0), 0);
  //     let uom = selectedMaterialData.UOM || 'N/A';

  //     if (!this._validateSingleLineDNQ(nomi_toitem, selectedMaterialData, dynamicFields)) {
  //       return; // Stop execution if validation fails
  //   }
  //   if (!this._validateTotalDNQ(nomi_toitem, selectedMaterialData)) {
  //     return; // Stop execution
  // }


  //     // Confirmation Dialog
  //     let oDialog = new sap.m.Dialog({
  //       title: "Confirm Submission",
  //       type: sap.m.DialogType.Message,
  //       content: new sap.m.FormattedText({
  //         htmlText: `Proposed DNQ for Gas Day ${Gasday}: <br><br>
  //           <span style="font-size: 16px; font-weight: bold; color: blue;">${totalDNQ.toFixed(3)} ${uom}</span> <br><br>
  //           Do you want to proceed?`
  //       }),
  //       beginButton: new sap.m.Button({
  //         text: "Confirm",
  //         type: sap.m.ButtonType.Accept,
  //         press: async () => {
  //           oDialog.close();
  //           await this._submitNomination(Gasday, selectedMaterialData, nomi_toitem);
  //         }
  //       }),
  //       endButton: new sap.m.Button({
  //         text: "Cancel",
  //         type: sap.m.ButtonType.Reject,
  //         press: function () {
  //           oDialog.close();
  //         }
  //       })
  //     });

  //     oDialog.open();
  //   },





  createNomination: async function () {
    // Fetch Contract Details
    let selectedMaterialData = this._getContractDetails();
    let Gasday = this._getGasDay();
    let dynamicFields = this._getDynamicFields();

    if (!Gasday) {
      sap.m.MessageBox.error("Please select a Gas Day!");
      return;
    }
    console.log("Selected Material Data:", selectedMaterialData);

    // Extract Redelivery and Delivery Points Data
    let nomi_toitem = [
      ...this._getRedeliveryPoints(Gasday, selectedMaterialData),
      ...this._getDeliveryPoints(Gasday, selectedMaterialData) // Added Delivery Points
    ];

    if (nomi_toitem.length === 0) {
      sap.m.MessageBox.error("No redelivery or delivery points found.");
      return;
    }

    // Check for duplicate From-To time entries
    if (this._hasDuplicateTimeEntries(nomi_toitem)) {
      sap.m.MessageBox.error("Duplicate 'From' and 'To' time entries found. Please check and correct them before submission.");
      return;
    }

    let totalDNQ = nomi_toitem.reduce((sum, item) => sum + parseFloat(item.Pdnq || 0), 0);
    let uom = selectedMaterialData.UOM || 'N/A';

    if (!this._validateSingleLineDNQ(nomi_toitem, selectedMaterialData, dynamicFields)) {
      return; // Stop execution if validation fails
  }
  if (!this._validateTotalDNQ(nomi_toitem, selectedMaterialData)) {
    return; // Stop execution
}

    // Confirmation Dialog
    let oDialog = new sap.m.Dialog({
      title: "Confirm Submission",
      type: sap.m.DialogType.Message,
      content: new sap.m.FormattedText({
        htmlText: `Proposed DNQ for Gas Day ${Gasday}: <br><br>
          <span style="font-size: 16px; font-weight: bold; color: blue;">${totalDNQ.toFixed(3)} ${uom}</span> <br><br>
          Do you want to proceed?`
      }),
      beginButton: new sap.m.Button({
        text: "Confirm",
        type: sap.m.ButtonType.Accept,
        press: async () => {
          oDialog.close();
          await this._submitNomination(Gasday, selectedMaterialData, nomi_toitem);
        }
      }),
      endButton: new sap.m.Button({
        text: "Cancel",
        type: sap.m.ButtonType.Reject,
        press: function () {
          oDialog.close();
        }
      })
    });

    oDialog.open();
  },






    // Fetch Contract Details
    _getContractDetails: function () {
      return {
        Vbeln: this.byId("cusNomDisplayListItemContractID").getValue() || "",
        Material: this.byId("cusNomDisplayListItemMaterialID").getValue() || "",
        //Auart: this.byId("cusNomDisplayListItemDocTypeID").getValue() || ""
      };
    },

    // Fetch Gas Day Value
    _getGasDay: function () {
      let oGasDayPicker = this.byId("cusNomDatePickerGasDay");
      return oGasDayPicker ? oGasDayPicker.getValue() : "";
    },

    // Fetch Dynamic Fields
    _getDynamicFields: function () {
      let dynamicFields = [];
      let oDynamicFieldList = this.byId("dynamicFieldLists");
      if (oDynamicFieldList) {
        let aFieldItems = oDynamicFieldList.getItems();
        aFieldItems.forEach(oItem => {
          dynamicFields.push({
            label: oItem.getLabel() || "",
            value: oItem.getValue() || ""
          });
        });
      }
      return dynamicFields;
    },

    // Fetch Redelivery Points
    _getRedeliveryPoints: function (Gasday, selectedMaterialData) {
      let nomi_toitem = [];
      let oTable = this.byId("cusNomRedPointTable");
      let aItems = oTable ? oTable.getItems() : [];

      aItems.forEach((oItem, index) => {
        let oContext = oItem.getBindingContext("RedlvModelData");
        if (oContext) {
          let oData = oContext.getObject();
          nomi_toitem.push({
            "Gasday": Gasday,
            "Vbeln": selectedMaterialData.Vbeln,
            "ItemNo": "10",
            "NomItem": (10 + index).toString(),
            "RedelivryPoint": oData.RedeliveryPt || "",
            "ValidTo": oItem.getCells()[4].getValue() || "",
            "ValidFrom": oItem.getCells()[3].getValue() || "",
            "Material": selectedMaterialData.Material,
            "Auart": selectedMaterialData.Auart,
            "Uom1": oData.UOM || "",
            "Pdnq": oItem.getCells()[1].getItems()[1].getValue() || "",
            "Event": oItem.getCells()[5].getSelectedKey() || "",
            "DeliveryPoint": "",
            "Ddcq": "0.000",
            "Rdcq": "0.000",
            "Adnq": "0.000",
            "Rpdnq": "0.000",
            "Remarks": "",
            "Action": ""
          });
        }
        console.log("Auart Value:", selectedMaterialData.Auart);
      });

      return nomi_toitem;
    },








    // Fetch Delivery Points
_getDeliveryPoints: function (Gasday, selectedMaterialData) {
  let nomi_toitem = [];
  let oTable = this.byId("cusNomDelPointTable"); // Change table ID for Delivery Points
  let aItems = oTable ? oTable.getItems() : [];

  aItems.forEach((oItem, index) => {
    let oContext = oItem.getBindingContext("DelvModelData"); // Change model for Delivery Points
    if (oContext) {
      let oData = oContext.getObject();
      nomi_toitem.push({
        "Gasday": Gasday,
        "Vbeln": selectedMaterialData.Vbeln,
        "ItemNo": "20", // Different ItemNo for Delivery Points
        "NomItem": (20 + index).toString(),
        "RedelivryPoint": "", // Empty for Delivery Points
        "DeliveryPoint": oData.DeliveryPt || "", // Add Delivery Point
        "ValidTo": oItem.getCells()[4].getValue() || "",
        "ValidFrom": oItem.getCells()[3].getValue() || "",
        "Material": selectedMaterialData.Material,
        "Auart": selectedMaterialData.Auart,
        "Uom1": oData.UOM || "",
        "Pdnq": oItem.getCells()[1].getItems()[1].getValue() || "",
        "Event": oItem.getCells()[5].getSelectedKey() || "",
        "Ddcq": "0.000",
        "Rdcq": "0.000",
        "Adnq": "0.000",
        "Rpdnq": "0.000",
        "Remarks": "",
        "Action": ""
      });
    }
    console.log("Auart Value:", selectedMaterialData.Auart);
  });

  return nomi_toitem;
},










    // _getDeliveryPoints: function (Gasday, selectedMaterialData) {
    //   let oModelDataDel = this.getView().getModel("DelvModelData").getData();
    //   let deliveryItems = [];

    //   if (oModelDataDel.DeliveryPoints) {
    //       let validDeliveryPoints = oModelDataDel.DeliveryPoints.filter(item => item.DeliveryPt && item.UOM);
    //       for (let j = 0; j < validDeliveryPoints.length; j++) {
    //           deliveryItems.push({
    //               "Gasday": Gasday,
    //               "Vbeln": selectedMaterialData.Vbeln,
    //               "ItemNo": selectedMaterialData.ItemNo,
    //               "NomItem": (20 + j).toString(),
    //               "DeliveryPoint": validDeliveryPoints[j].DeliveryPt,
    //               "ValidTo": validDeliveryPoints[j].To,
    //               "ValidFrom": validDeliveryPoints[j].From,
    //               "Material": selectedMaterialData.Material,
    //               "Auart": selectedMaterialData.Auart,
    //               "Uom1": validDeliveryPoints[j].UOM,
    //               "Pdnq": validDeliveryPoints[j].DNQ,
    //               "Event": validDeliveryPoints[j].Event,
    //               "RedelivryPoint": "",
    //               "Ddcq": "0.000",
    //               "Rdcq": "0.000",
    //               "Adnq": "0.000",
    //               "Rpdnq": "0.000",
    //               "Remarks": "",
    //               "Action": ""
    //           });
    //       }
    //   }

    //   return deliveryItems;
    // },





    // Check for Duplicate Time Entries
    _hasDuplicateTimeEntries: function (nomi_toitem) {
      let timeEntries = nomi_toitem.map(item => `${item.ValidFrom}-${item.ValidTo}`);
      return timeEntries.some((val, index, arr) => arr.indexOf(val) !== index);
    },



    _validateSingleLineDNQ: function (nomi_toitem, selectedMaterialData, dynamicFields) {
      // Ensure there is only one line item
      if (nomi_toitem.length !== 1) {
          return true; // No validation needed for multiple items
      }
  
      // Use dynamicFields passed as a parameter instead of selectedMaterialData.dynamicFields
      console.log("Dynamic Fields:", dynamicFields); // Debugging log
  
      // Find the MAX DCQ object
      const maxDCQObject = dynamicFields.find(field => field.label === "Max DCQ");
  
      // Validate if MAX DCQ exists
      if (!maxDCQObject) {
          MessageToast.show("maxDCQ value is missing!");
          return false; // Validation failed
      }
  
      const maxDCQ = parseFloat(maxDCQObject.value);
  
      // Extract DNQ value from the single item
      let singleItemDNQ = parseFloat(nomi_toitem[0].Pdnq || 0);
  
      // Check if DNQ exceeds MAX DCQ
      if (singleItemDNQ > maxDCQ) {
          sap.m.MessageBox.error(`The DNQ value ${singleItemDNQ} cannot exceed the max DCQ value ${maxDCQ}.`);
          return false; // Validation failed
      }
  
      return true; // Validation passed
  },
  







    // Submit Nomination - Fix for OData V2 and V4
    _submitNomination: async function (Gasday, selectedMaterialData, nomi_toitem) {
      let oModel = this.getView().getModel("odataModel");

      if (!oModel) {
        sap.m.MessageBox.error("Error: Model is not properly initialized.");
        return;
      }

      // 🔍 Debugging: Check the model type
      console.log("Retrieved Model:", oModel);
      console.log("Model Metadata Name:", oModel.getMetadata().getName()); // Logs the model class name

      if (!(oModel instanceof sap.ui.model.odata.v4.ODataModel)) {
        sap.m.MessageBox.error("Error: Retrieved model is not an OData V4 Model.");
        return;
      }



      let oPayload = {
        Gasday: Gasday,
        Vbeln: selectedMaterialData.Vbeln,
        nomi_toitem: nomi_toitem
      };

      var busyDialog = new sap.m.BusyDialog();
      busyDialog.open();


      try {
        // Directly call create() to send data to backend
        console.log("oModel", oModel)
        let oBindList = oModel.bindList("/znom_headSet");
        console.log("obindlist", oBindList)
        await oBindList.create(oPayload, true);


        sap.m.MessageBox.success("Nomination Successfully Submitted", {
          onClose: () => {
            const materialWiseContractData = this.getView().getModel("materialModel");
            const materialWiseModelData = this.getView().getModel("modelData");
            const RedelvNomDCQTableData = this.getView().getModel("RedlvModelData");

            if (materialWiseContractData) {
              materialWiseModelData.setData({});
              materialWiseContractData.setData({});
              materialWiseContractData.refresh();
              materialWiseModelData.refresh();
            }

            if (RedelvNomDCQTableData) {
              RedelvNomDCQTableData.setProperty("/RedeliveryPoints", [{
                RedeliveryPt: "",
                DNQ: "",
                UOM: "",
                From: "",
                To: "",
                Event: ""
              }]);
            }

            this.byId("cusNomDatePickerGasDay").setValue("");
            //this.byId("totalReDNQValue").setValue("0.000");(input box needed)
            this.byId("cusNomVBoxContracts").setVisible(true);
            this.byId("cusNomVBoxMaterials").setVisible(false);
          }
        });

      } catch (error) {
        console.error("Error during create operation:", error);
        sap.m.MessageBox.error("An error occurred while submitting the nomination. Please try again.");
      } finally {
        busyDialog.close();
      }
    },


    onTimeChange: function (oEvent) {
      var sNewValue = oEvent.getParameter("value");
      var oModel = this.getView().getModel("RedlvModelData");

      var oSource = oEvent.getSource();
      var sBindingPath = oSource.getBinding("value") ? oSource.getBinding("value").getPath() : null;

      if (sBindingPath) {
        oModel.setProperty(sBindingPath, sNewValue);
      }

      let oTable = this.getView().byId("cusNomRedPointTable");
      if (!oTable) {
        console.warn("Table with ID 'RedelPointTable' not found.");
        return;
      }

      let aItems = oTable.getItems();
      let hasError = false;

      aItems.forEach(function (oItem) {
        let aCells = oItem.getCells();
        if (aCells.length > 4) {
          let oValidFromInput = aCells[3];
          let oValidToInput = aCells[4];

          if (oValidFromInput && oValidToInput) {
            let validFrom = oValidFromInput.getValue().trim();
            let validTo = oValidToInput.getValue().trim();

            if (validFrom && validTo && validFrom === validTo) {
              hasError = true;
              oValidFromInput.setValueState("Error");
              oValidToInput.setValueState("Error");
              oValidFromInput.setValueStateText("From and To times cannot be the same.");
              oValidToInput.setValueStateText("From and To times cannot be the same.");
            } else {
              oValidFromInput.setValueState("None");
              oValidToInput.setValueState("None");
            }
          }
        }
      });

      // Store the error status in the model
      oModel.setProperty("/hasValidationError", hasError);

      if (hasError) {
        sap.m.MessageToast.show("From and To times cannot be the same.");
      }
    },




    DnqValidation: function () {
      var oView = this.getView();
      var oTable = oView.byId("cusNomRedPointTable");
      var aItems = oTable.getItems();
      var totalDNQ = 0.000;

      aItems.forEach(function (oItem) {
        var oDNQInput = oItem.getCells()[1].getItems()[1]; // Get the Input field inside VBox
        var dnqValue = parseFloat(oDNQInput.getValue()) || 0;
        totalDNQ += dnqValue;
      });

      var oTotalText = this.getView().byId("totalReDNQValue");

      // Dynamically set HTML content
      if (totalDNQ > 0) {
        oTotalText.setHtmlText('<span style="color:rgb(6, 183, 6); font-weight: bold;">' + totalDNQ.toFixed(3) + '</span>');
      } else {
        oTotalText.setHtmlText('<span style="color: red; font-weight: bold;">' + totalDNQ.toFixed(3) + '</span>');
      }
    },




    _validateTotalDNQ: function (nomi_toitem, selectedMaterialData) {
      // Retrieve dynamic fields
      let dynamicFields = this._getDynamicFields();
  
      // Find MAX DCQ value
      const maxDCQObject = dynamicFields.find(field => field.label === "Max DCQ");
      if (!maxDCQObject) {
          sap.m.MessageToast.show("MAX DCQ value is missing!");
          return false;
      }
  
      const maxDCQ = parseFloat(maxDCQObject.value);
      console.log("MAX DCQ:", maxDCQ);
  
      if (isNaN(maxDCQ)) {
          sap.m.MessageToast.show("Invalid MAX DCQ value!");
          return false;
      }
  
      // Calculate total DNQ from table line items
      let totalDNQ = nomi_toitem.reduce((sum, item) => sum + parseFloat(item.Pdnq || 0), 0);
      console.log("Total DNQ Entered:", totalDNQ);
  
      // Validation: Check if total DNQ exceeds MAX DCQ
      if (totalDNQ > maxDCQ) {
          sap.m.MessageBox.error(`Total DNQ (${totalDNQ}) cannot exceed MAX DCQ (${maxDCQ}).`);
          return false;
      }
  
      return true;
  },
  




  });
});