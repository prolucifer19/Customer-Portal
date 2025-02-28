sap.ui.define([
    'sap/ui/Device',
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
    
], (Device, Controller, JSONModel) => {
    "use strict";
 
    return Controller.extend("customerportal.controller.contractDetails", {
        onInit() {
            this.oModel = new JSONModel();
            this.oModel.loadData(sap.ui.require.toUrl("customerportal/model/model.json"), null, false);
            this.getView().setModel(this.oModel);
        },
 
        onMenuButtonPress: function () {
            var toolPage = this.byId("toolPage");
            toolPage.setSideExpanded(!toolPage.getSideExpanded());
        },
 
        onItemSelect: function (oEvent) {
            // Get the selected key
            var sKey = oEvent.getParameter("item").getKey();
 
            // Access the NavContainer by its ID
            var oNavContainer = this.byId("pageContainer");
 
            // Navigate based on the selected key
            if (sKey === "root1") {
                oNavContainer.to(this.byId("root1"));
            } else if (sKey === "root6") {
                this._navigateToPage(oNavContainer, "root6", "customerportal.view.contractAmendment");
            } 
            else if (sKey === "root2") {
                this._navigateToPage(oNavContainer, "root2", "customerportal.view.customerNomination"); // Replace with the actual view name 
            }
            else if (sKey === "root7") {
                this._navigateToPage(oNavContainer, "root7", "customerportal.view.contractRequest"); // Replace with the actual view name 
            }
            else if (sKey === "root3") {
                this._navigateToPage(oNavContainer, "root3", "customerportal.view.allocatedQuantity"); // Replace with the actual view name 
            }
            else if (sKey === "root4") {
                this._navigateToPage(oNavContainer, "root4", "customerportal.view.penaltyReport"); // Replace with the actual view name 
            }
            else if (sKey === "root5") {
                this._navigateToPage(oNavContainer, "root5", "customerportal.view.customerInvoices"); // Replace with the actual view name 
            }
            else if (sKey === "support_contract") {
                this._navigateToPage(oNavContainer, "support_contract", "customerportal.view.SuppContractDetails"); // Replace with the actual view name 
            }
            else if (sKey === "support_nomination") {
                this._navigateToPage(oNavContainer, "support_nomination", "customerportal.view.SuppNomination"); // Replace with the actual view name
            }
            else if (sKey === "support_allocatedQuantity") {
                this._navigateToPage(oNavContainer, "support_allocatedQuantity", "customerportal.view.SuppAllocatedQuantity"); // Replace with the actual view name
            }
            else if (sKey === "support_Invoice") {
                this._navigateToPage(oNavContainer, "support_Invoice", "customerportal.view.SuppInvoices"); // Replace with the actual view name
            }
        },
 
        _navigateToPage: function (oNavContainer, pageId, viewName) {
            // Check if the page already exists in the NavContainer
            var oExistingPage = this.byId(pageId);
            if (!oExistingPage) {
                // Lazy load the view if not already created
                var oView = sap.ui.view({
                    id: this.createId(pageId), // Ensure unique ID
                    viewName: viewName,
                    type: "XML"
                });
                oNavContainer.addPage(oView);
            }
            oNavContainer.to(this.byId(pageId));
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



    });
});