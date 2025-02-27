sap.ui.define([
    "sap/ui/core/mvc/Controller"
  ], (BaseController) => {
    "use strict";
  
    return BaseController.extend("customerportal.controller.contractAmendment", {
        onInit() {
        this.onRendering();
        },
        onRendering: function(){
          var oRadioGroup = this.getView().byId("conAmdFuelConsumptionGroup");
          if (oRadioGroup) {
            oRadioGroup.setSelectedIndex(-1);
          }
          this.getView().byId("conAmdDPAccDCQ").setVisible(false);
          this.getView().byId("conAmdLabelDPAccDCQ").setVisible(false);
          this.getView().byId("conAmdLabelDPTargetQuantity").setVisible(false);
          this.getView().byId("conAmdDPTargetQuantity").setVisible(false);
          this.getView().byId("conAmdLabelFuelConsumption").setVisible(false);
          this.getView().byId("conAmdFuelConsumptionGroup").setVisible(false);
          var oTable = this.getView().byId("conAmdRDPTable");
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



        // onSelectDropdown1: function (oEvent) {
        //   // Get the selected key from the dropdown
        //   var sSelectedKey = oEvent.getSource().getSelectedKey();
        //   var myDropdown23VBox = this.getView().byId("conAmdInputContractNumber").getParent();
        
        //   // Check if "Existing Contract" is selected
        //   if (sSelectedKey === "existingContract") {
        //     console.log("enter the selected key condition");
        //     // Make specific fields uneditable
        //     this.getView().byId("conAmdSoldTP_id").setEditable(false);
        //     this.getView().byId("conAmdShipTP_id").setEditable(false);
        //     this.getView().byId("conAmdSalesORgSelect").setEditable(false);
        //     this.getView().byId("conAmdContractDescForm1").setEditable(false);
        //     myDropdown23VBox.setVisible(true);
    
        
        //     // Assuming Contract Description has no specific ID, select it directly
        //     // var oForm = this.getView().byId("conAmdFormOption1");
        //     // var oContractDescription = oForm.getContent().find(function (control) {
        //     //   return control.isA("sap.m.Input") && control.getParent().getItems().some(function (label) {
        //     //     return label.isA("sap.m.Label") && label.getText() === "Contract Description";
        //     //   });
        //     // });
            
        //     // if (oContractDescription) {
        //     //   oContractDescription.setEditable(false);
        //     // }
        //   } else {
        //     // Reset fields to editable=true for "New Contract"
        //     myDropdown23VBox.setVisible(false);
        //     this.getView().byId("conAmdSoldTP_id").setEditable(true);
        //     this.getView().byId("conAmdShipTP_id").setEditable(true);
        //     this.getView().byId("conAmdSalesORgSelect").setEditable(true);
        //     this.getView().byId("conAmdContractDescForm1").setEditable(true);
    
        
        //     // if (oContractDescription) {
        //     //   oContractDescription.setEditable(true);
        //     // }
        //   }
        // }	,

        //This is for the ZGSA and ZGTA dropdown
        
        
        onSelectDropdown2: function (oEvent) {
          var sSelectedKey = oEvent.getSource().getSelectedKey();
          this.updateTableForSelection(sSelectedKey);
          if (sSelectedKey === "ZGTA") {
            console.log("enter the selected key condition");
            // Make specific fields invisible
            this.getView().byId("conAmdDPAccDCQ").setVisible(true);
            this.getView().byId("conAmdLabelDPAccDCQ").setVisible(true);
            this.getView().byId("conAmdLabelDPTargetQuantity").setVisible(true);
            this.getView().byId("conAmdDPTargetQuantity").setVisible(true);
            this.getView().byId("conAmdLabelFuelConsumption").setVisible(true);
            this.getView().byId("conAmdFuelConsumptionGroup").setVisible(true);
          } else {
            this.getView().byId("conAmdDPAccDCQ").setVisible(false);
            this.getView().byId("conAmdLabelDPAccDCQ").setVisible(false);
            this.getView().byId("conAmdLabelDPTargetQuantity").setVisible(false);
            this.getView().byId("conAmdDPTargetQuantity").setVisible(false);
            this.getView().byId("conAmdLabelFuelConsumption").setVisible(false);
            this.getView().byId("conAmdFuelConsumptionGroup").setVisible(false);
          }
        },
        //this function is for the table changes based on the GSA and GTA selection

        updateTableForSelection: function (sSelectedKey) {
          // Get the table instance
          var oTable = this.getView().byId("conAmdRDPTable");
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
          var oFuelColumn = this.getView().byId("conAmdFuelPercentageColumn");
          var oFuelInput = this.getView().byId("conAmdFuelPercentageInput");
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

        onContractValueHelp: function () {
          var oView = this.getView();
          if (!this._oDialogContNo) {
            this._oDialogContNo = sap.ui.xmlfragment(
              oView.getId(),
              "customerportal.fragment.contractValueHelp",
              this
            );
            oView.addDependent(this._oDialogContNo);
          }
          this._oDialogContNo.open();
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