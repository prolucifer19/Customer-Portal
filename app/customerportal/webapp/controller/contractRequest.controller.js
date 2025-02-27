sap.ui.define([
    'sap/ui/Device',
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
  ], (Device, Controller, JSONModel) => {
    "use strict";
  
    return Controller.extend("customerportal.controller.contractRequest", {
        onInit() {
          this.onRendering();
        },

        onRendering: function(){
          var oRadioGroup = this.getView().byId("conReqFuelConsumptionGroup");
          if (oRadioGroup) {
            oRadioGroup.setSelectedIndex(-1);
          }
          this.getView().byId("conReqDPAccDCQ").setVisible(false);
          this.getView().byId("conReqLabelDPAccDCQ").setVisible(false);
          this.getView().byId("conReqLabelDPTargetQuantity").setVisible(false);
          this.getView().byId("conReqDPTargetQuantity").setVisible(false);
          this.getView().byId("conReqLabelFuelConsumption").setVisible(false);
          this.getView().byId("conReqFuelConsumptionGroup").setVisible(false);
          var oTable = this.getView().byId("conReqRDPTable");
          var aColumns = oTable.getColumns();
          aColumns.forEach(function (oColumn) {
            var oHeader = oColumn.getHeader();
            if (oHeader && oHeader.getText) {
              var sHeaderText = oHeader.getText();
              if (
                sHeaderText === "Delivery Point" ||
                sHeaderText === "DP DCQ" ||
                sHeaderText === "Fuel Percentage" // Hide Fuel Percentage as well
              ) {
                oColumn.setVisible(false); // Hide specified columns
              }
            }
          });
        },

        onSelectDropdown: function (oEvent) {
          var sSelectedKey = oEvent.getSource().getSelectedKey();
          this.updateTableForSelection(sSelectedKey);
          if (sSelectedKey === "ZGTA") {
            console.log("enter the selected key condition");
            // Make specific fields invisible
            this.getView().byId("conReqDPAccDCQ").setVisible(true);
            this.getView().byId("conReqLabelDPAccDCQ").setVisible(true);
            this.getView().byId("conReqLabelDPTargetQuantity").setVisible(true);
            this.getView().byId("conReqDPTargetQuantity").setVisible(true);
            this.getView().byId("conReqLabelFuelConsumption").setVisible(true);
            this.getView().byId("conReqFuelConsumptionGroup").setVisible(true);
          } else {
            this.getView().byId("conReqDPAccDCQ").setVisible(false);
            this.getView().byId("conReqLabelDPAccDCQ").setVisible(false);
            this.getView().byId("conReqLabelDPTargetQuantity").setVisible(false);
            this.getView().byId("conReqDPTargetQuantity").setVisible(false);
            this.getView().byId("conReqLabelFuelConsumption").setVisible(false);
            this.getView().byId("conReqFuelConsumptionGroup").setVisible(false);
          }
        },
        //this function is for the table changes based on the GSA and GTA selection

        updateTableForSelection: function (sSelectedKey) {
          // Get the table instance
          var oTable = this.getView().byId("conReqRDPTable");
          // Get all columns in the table
          var aColumns = oTable.getColumns();
        
          // Handle visibility logic for ZGSA or ZGTA selection
          if (sSelectedKey === "ZGSA") {
            // ZGSA: Remove Delivery Point & Delivery DCQ fields
            aColumns.forEach(function (oColumn) {
              var oHeader = oColumn.getHeader();
              if (oHeader && oHeader.getText) {
                var sHeaderText = oHeader.getText();
                if (
                  sHeaderText === "Delivery Point" ||
                  sHeaderText === "DP DCQ" ||
                  sHeaderText === "Fuel Percentage" // Hide Fuel Percentage as well
                ) {
                  oColumn.setVisible(false); // Hide specified columns
                }
                // else {
    
                // 	oColumn.setVisible(true); // Show other columns
                // }
              }
            });
          } else if (sSelectedKey === "ZGTA") {
            // ZGTA: Make all table columns and form fields visible
            aColumns.forEach(function (oColumn) {
              var oHeader = oColumn.getHeader();
              if (oHeader && oHeader.getText) {
                var sHeaderText = oHeader.getText();
                if (
                  sHeaderText === "Delivery Point" ||
                  sHeaderText === "DP DCQ"  
                ) {
                  oColumn.setVisible(true); // Hide specified columns
                }
                //else {
                // 	oColumn.setVisible(true); // Show other columns
                // }
              }
            });
            
          }
         },
        onFuelConsumptionChange: function (oEvent) {
          // Get the selected index of the RadioButtonGroup
          var oRadioGroup = oEvent.getSource();
          var iSelectedIndex = oRadioGroup.getSelectedIndex();
        
          // Get the table and column instances
          var oFuelColumn = this.getView().byId("conReqFuelPercentageColumn");
          var oFuelInput = this.getView().byId("conReqFuelPercentageInput");
          var oModel = this.getView().getModel();
        
          // if (!oFuelColumn || !oFuelInput) {
          //   console.error("Fuel column or input not found.");
          //   return;
          // }
        
          // If "Yes" is selected (index 0), make the column and input visible
          if (iSelectedIndex === 0) {
            oFuelColumn.setVisible(true);
            oFuelInput.setVisible(true);
            oModel.setProperty("/fuelConsumptionEnabled", true);
          } else if (iSelectedIndex === 1) {
            // If "No" is selected (index 1), hide the column and input
            oFuelColumn.setVisible(false);
            oFuelInput.setVisible(false);
            oModel.setProperty("/fuelConsumptionEnabled", false);
          } else {
            // If no selection, ensure the column and input are hidden
            oFuelColumn.setVisible(false);
            oFuelInput.setVisible(false);
            oModel.setProperty("/fuelConsumptionEnabled", false);
          }
       },

       onSoldToParty: function () {
        var oView = this.getView();
        if (!this._oInfoDialogSTP) {
          this._oInfoDialogSTP = sap.ui.xmlfragment(
            oView.getId(),
            "customerportal.fragment.soldToParty",
            this
          );
          oView.addDependent(this._oInfoDialogSTP);
        }
        this._oInfoDialogSTP.open();
      },

      onShipToParty: function () {
        var oView = this.getView();
        if (!this._oInfoDialogShTP) {
          this._oInfoDialogShTP = sap.ui.xmlfragment(
            oView.getId(),
            "customerportal.fragment.ShiptoParty",
            this
          );
          oView.addDependent(this._oInfoDialogShTP);
        }
        this._oInfoDialogShTP.open();
      },

      onMaterial: function () {
        var oView = this.getView();
        if (!this._oInfoDialogMat) {
          this._oInfoDialogMat = sap.ui.xmlfragment(
            oView.getId(),
            "customerportal.fragment.Material",
            this
          );
          oView.addDependent(this._oInfoDialogMat);
        }
        this._oInfoDialogMat.open();
      },

      onPlant: function () {
        var oView = this.getView();
        if (!this._oInfoDialogPl) {
          this._oInfoDialogPl = sap.ui.xmlfragment(
            oView.getId(),
            "customerportal.fragment.Plant",
            this
          );
          oView.addDependent(this._oInfoDialogPl);
        }
        this._oInfoDialogPl.open();
      },



      onUOM: function () {
        var oView = this.getView();
        if (!this._oDialogUOM) {
          this._oDialogUOM = sap.ui.xmlfragment(
            oView.getId(),
            "customerportal.fragment.UOM",
            this
          );
          oView.addDependent(this._oDialogUOM);
        }
        this._oDialogUOM.open();
      },

    });
  });