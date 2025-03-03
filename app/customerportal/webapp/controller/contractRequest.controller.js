sap.ui.define([
    'sap/ui/Device',
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
  ], (Device, Controller, JSONModel) => {
    "use strict";
    let sMaterial;
    return Controller.extend("customerportal.controller.contractRequest", {
        onInit() {
          this.onRendering();
         var oModel = new sap.ui.model.odata.v4.ODataModel({
          serviceUrl: "/odata/v4/customerportalservice/",
          synchronizationMode: "None",
          operationMode: "Server"
      });
      this.getView().setModel(oModel);
      console.log("Model Metadata Name:", oModel.getMetadata().getName());        
           var oModel = new JSONModel({ customerData: [] });
            this.getView().setModel(oModel, "customerDataModel");
            console.log(oModel);

            var oHeaderModel = new sap.ui.model.json.JSONModel({
              items: [{
                  Item: "1",
                  Material: "",
                  Plant: "",
                  uom: "",
                  Profile: "",
                  DPTargetQry: "",
                  RPTargetQty: "",
                  DeliveryPoint: "",
                  DeliveryText : "",
                  RedeliveryPoint: "",
                  RedeliveryText : "",
                  DeliveryDcq: "",
                  RedeliveryDcq: "",
                  ValidForm: "",
                  ValidTo: "",
                  FuelLocation : "",
                  Path:"",
                  FuelPercentage:""
              }],
              selectedItem: "1" // Default selected item
          });
          this.getView().setModel(oHeaderModel, "headerModel");

          
      let salesModel = new JSONModel();
      let standardData = {
        SalesContract: "",
        SalesContractValidityStartDate: "",
        SalesContractValidityEndDate: "",
        to_Item: [{}],
        to_Partner: [{ PartnerFunction: "SH" }],
      };
      salesModel.setData(standardData);
      this.getView().setModel(salesModel, "sales");
        },

        onRendering: function(){
          var oRadioGroup = this.getView().byId("conReqFuelConsumptionGroup");
          if (oRadioGroup) {
            oRadioGroup.setSelectedIndex(-1);
          }
          var oView = this.getView();
          this.getView().byId("conReqDPAccDCQ").setVisible(false);
          this.getView().byId("conReqLabelDPAccDCQ").setVisible(false);
          this.getView().byId("conReqLabelDPTargetQuantity").setVisible(false);
          this.getView().byId("conReqDPTargetQuantity").setVisible(false);
          this.getView().byId("conReqLabelFuelConsumption").setVisible(false);
          this.getView().byId("conReqFuelConsumptionGroup").setVisible(false);
          var oTable = this.getView().byId("conReqRDPTable");
          var aColumns = oTable.getColumns();
          var oSelect = oView.byId("conReqSelectContractType2");
            oSelect.bindItems({
                path: "/DocumentNoProfileMapping",
                template: new sap.ui.core.Item({
                    key: "{DocumentNo}-{industryType}",
                    text: {
                        parts: ["DocumentNo", "description","industryType"],
                        formatter: function (sDocumentNo, sDescription,industryType ) {  
                            return sDocumentNo + " - " + sDescription +"("+industryType+")";
                        }
                    }
                })
            });
            console.log("oSelect");
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

        onSearchMaterial: function (oEvent) {
          const sValue = oEvent.getParameter("value");
          const oBinding = oEvent.getSource().getBinding("items");
          if (oBinding) {
              const aFilters = [
                  new sap.ui.model.Filter("Material", sap.ui.model.FilterOperator.Contains, sValue),
                  new sap.ui.model.Filter("Description", sap.ui.model.FilterOperator.Contains, sValue)
              ];
              oBinding.filter(new sap.ui.model.Filter(aFilters, false)); // OR condition
          }
      },

        onSelectDropdown: async function (oEvent) {
          var sSelectedKey = oEvent.getSource().getSelectedKey();
          let [sDocumentType, sIndustryType] = sSelectedKey.split("-");
 
            this.sDocumentType = sDocumentType;
            this.sIndustryType = sIndustryType;
           // var bVisibleindustry =  (this.sIndustryType === "CGD" && this.sDocumentType !== "ZGTA" );
          this.updateTableForSelection(sDocumentType);
          if (sDocumentType === "ZGTA") {
            console.log("enter the selected key condition");
            // Make specific fields invisible
            this.getView().byId("conReqDPAccDCQ").setVisible(true);
            this.getView().byId("conReqLabelDPAccDCQ").setVisible(true);
            this.getView().byId("conReqLabelDPTargetQuantity").setVisible(true);
            this.getView().byId("conReqDPTargetQuantity").setVisible(true);
            this.getView().byId("conReqLabelFuelConsumption").setVisible(true);
            this.getView().byId("conReqFuelConsumptionGroup").setVisible(true);
            this.getView().byId("conReqLabelFuelLocation").setVisible(true);
            this.getView().byId("fuelRadio").setVisible(true);
          } else {
            this.getView().byId("conReqDPAccDCQ").setVisible(false);
            this.getView().byId("conReqLabelDPAccDCQ").setVisible(false);
            this.getView().byId("conReqLabelDPTargetQuantity").setVisible(false);
            this.getView().byId("conReqDPTargetQuantity").setVisible(false);
            this.getView().byId("conReqLabelFuelConsumption").setVisible(false);
            this.getView().byId("conReqFuelConsumptionGroup").setVisible(false);
            this.getView().byId("conReqLabelFuelLocation").setVisible(false);
            this.getView().byId("fuelRadio").setVisible(false);
          }
          await this.getServiceProfile(this.sDocumentType);
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
       

       onOpenDelivery: function () {
        var oView = this.getView();
        // Create fragment only if it doesn’t exist
        if (!this.onDeliveryFrag) {
            this.onDeliveryFrag = sap.ui.xmlfragment(
                oView.getId(),
                "customerportal.fragment.deliveryPoint",
                this
            );
            oView.addDependent(this.onDeliveryFrag);
        }
        this.onDeliveryFrag.open();
    },

    onOpenRDP: function () {
      var oView = this.getView();
      // Create fragment only if it doesn’t exist
      if (!this.onRDPFrag) {
          this.onRDPFrag = sap.ui.xmlfragment(
              oView.getId(),
              "customerportal.fragment.reDeliveryPoint",
              this
          );
          oView.addDependent(this.onRDPFrag);
      }
      this.onRDPFrag.open();
  },

  onConfirmDelivery: function (oEvent) {
    const oSelectedItem = oEvent.getParameter("selectedItem");
    if (oSelectedItem) {
        const sDelivery = oSelectedItem.getTitle();
        const sDeliveryDesc = oSelectedItem.getDescription();
        // Set selected plant to input field (Adjust ID as needed)
        const oInput = this.getView().byId("conReqDelivery_id");
        oInput.setValue(sDelivery);
        this.getView().byId("conReqDPDescInput").setValue(sDeliveryDesc);

        const oRDPDescInput = this.getView().byId("conReqColdpDESC");
        oRDPDescInput.setVisible(true);
  
        // Manually trigger field change event
        this.onFieldSave({
            getSource: () => oInput // Create a mock event object
        });
    }
},

onConfirmRDP: function (oEvent) {
  const oSelectedItem = oEvent.getParameter("selectedItem");
  if (oSelectedItem) {
      const sRDP = oSelectedItem.getTitle();
      const sRDPDesc = oSelectedItem.getDescription();
      const oInput = this.getView().byId("conReqRedelivery_id");
      oInput.setValue(sRDP);        
      this.getView().byId("conReqRdpdescInput").setValue(sRDPDesc);

      const oRDPDescInput = this.getView().byId("conReqColrdpDESC");
      oRDPDescInput.setVisible(true);

      // Manually trigger field change event
      this.onFieldSave({
          getSource: () => oInput // Create a mock event object
      });
  }
  const sDocumentType = this.sDocumentType;
  if (sDocumentType === "ZGTA") {
      this.getPathandfuellocation()
  }
},

getPathandfuellocation: async function () {
  const sDocumentType = this.sDocumentType;
  const oView = this.getView();
  const oDeliveryInput = oView.byId("conReqDelivery_id");
  const oRDPInput = oView.byId("conReqRedelivery_id");

  const sDeliveryPoint = oDeliveryInput ? oDeliveryInput.getValue() : "";
  const sReDeliveryPoint = oRDPInput ? oRDPInput.getValue() : "";

  if (!sDeliveryPoint || !sReDeliveryPoint) {
      sap.m.MessageToast.show("Please select both Delivery and Redelivery Points.");
      return;
  }

  // Ensure only execute for ZGTA document type
  if (sDocumentType === "ZGTA") {
      const sPathfuelData = `/getPathandfuellocation(DeliveryPoint='${encodeURIComponent(sDeliveryPoint)}',ReDeliveryPoint='${encodeURIComponent(sReDeliveryPoint)}')`;
      const oModel = oView.getModel();

      try {
          const aContexts = await oModel.bindList(sPathfuelData).requestContexts();
          const aPathFuelData = aContexts.map(context => context.getObject());

          console.log("Fetched Data:", aPathFuelData);

          if (aPathFuelData.length > 0) {
              // Extract path and fuel percentage
              const sPath = aPathFuelData[0].path || "";
              const sFuelPercentage = aPathFuelData[0].FuelPercentage || "";

              // Set values in the table
              oView.byId("conReqPathInput").setValue(sPath);
              oView.byId("conReqFuelPercentageInput").setValue(sFuelPercentage);
          } else {
              // Show message if no data found
              sap.m.MessageBox.warning("No path exists for the selected Delivery and Redelivery Points.", {
                  onClose: function () {
                      // Clear fields if data doesn't exist
                      oView.byId("conReqDelivery_id").setValue("");
                      oView.byId("conReqRedelivery_id").setValue("");
                  }
              });
          }
      } catch (error) {
          console.error("Error fetching Path and Fuel Location data:", error);
          sap.m.MessageToast.show("Error fetching data. Please try again.");
      }
  }
},


       onSoldToParty: function () {
        var oView = this.getView();
        if (!this.oInfoDialogSTP) {
          this.oInfoDialogSTP = sap.ui.xmlfragment(
            oView.getId(),
            "customerportal.fragment.SoldToParty",
            this
          );
          oView.addDependent(this.oInfoDialogSTP);
        }
        this.oInfoDialogSTP.open();
      },

      onConfirmSoldtoParty: function (oEvent) {
        var oSelectedItem = oEvent.getParameter("selectedItem");
        if (oSelectedItem) {
            var sSoldToParty = oSelectedItem.getTitle(); // Assuming the key is in the title
            // Set the selected value into the input field
            this.getView().byId("conReqSoldTP_id").setValue(sSoldToParty);
            this.getView().byId("soldTPDescID").setVisible(true);
            this.getView().byId("distChanDescID").setVisible(true);
            this.getView().byId("salesOrgDescID").setVisible(true);
            this.getView().byId("divisionDescID").setVisible(true);
            this.getView().byId("ShipTPDescID").setVisible(true);
        }
        this.getSoldtoPartyData(sSoldToParty)
    },
    getSoldtoPartyData: async function (sSoldToParty) {
      try {
          const sPath = `/getSoldtoPartyData(Sold_Party='${sSoldToParty}')`;
          const oModel = this.getView().getModel();
          const oBindList = oModel.bindList(sPath);
          const aContexts = await oBindList.requestContexts();
          const aCustomerData = aContexts.map(context => context.getObject());
          console.log("Fetched Data:", aCustomerData); // Debug log
  
          // Create customerDataModel if not already present
          if (!this.getView().getModel("customerDataModel")) {
              this.getView().setModel(new sap.ui.model.json.JSONModel({
                  SalesOrgs: [],
                  CustomerList: [],
                  customerData: {}
              }), "customerDataModel");
          }
  
          // 🔄 Extract SalesOrgs from fetched data
          const aSalesOrgs = aCustomerData.map(item => ({
              SalesOrgID: item.Sales_org,
              SalesOrgText: item.Sales_org_Text
          }));
  
          console.log("Sales Orgs Data:", aSalesOrgs); // Debug log
  
          // Update model properties
          const oCustomerData = aCustomerData[0] || {};
          const oSalesOrg = aSalesOrgs.find(org => org.SalesOrgID === oCustomerData.Sales_org);
  
          if (oSalesOrg) {
              oCustomerData.SalesOrgText = oSalesOrg.SalesOrgText; // Add SalesOrgText to customer data
          }
  
          this.getView().getModel("customerDataModel").setProperty("/SalesOrgs", aSalesOrgs);      // Sales Orgs list
          this.getView().getModel("customerDataModel").setProperty("/CustomerList", aCustomerData); // Customer list
          this.getView().getModel("customerDataModel").setProperty("/customerData", oCustomerData); // Selected customer
  
      } catch (oError) {
          console.error("Error fetching customer data:", oError);
      }
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

        // Create fragment only if it doesn’t exist
        if (!this.onMaterialFrag) {
            this.onMaterialFrag = sap.ui.xmlfragment(
                oView.getId(),
                "customerportal.fragment.OnSelectMaterial",
                this
            );
            oView.addDependent(this.onMaterialFrag);
        }
        this.onMaterialFrag.open();
      },

      onConfirmMaterial: function (oEvent) {
        const oSelectedItem = oEvent.getParameter("selectedItem");
        if (oSelectedItem) {
            sMaterial = oSelectedItem.getTitle();
            const sDescription = oSelectedItem.getDescription();
            // Update model or input field
            this.getView().byId("conReqMaterialID67").setValue(sMaterial);
            this.getView().byId("conReqMaterialDesc").setValue(sDescription);

            // Optional: Set selected material to the model
            const oModel = this.getView().getModel("selectedMaterialModel");
            if (oModel) {
                oModel.setProperty("/selectedMaterial", {
                    Material: sMaterial,
                    Description: sDescription
                });
            }
            const oMaterialDescInput = this.getView().byId("conReqMaterialDesc");
            oMaterialDescInput.setVisible(true);

            this.onFieldSave({
                getSource: () => oInput // Create a mock event object
            });
            this.FetchPlantsByMaterial(sMaterial);
        }
    },

    FetchPlantsByMaterial: async function (sMaterial) {
      try {
          const sPath = `/FetchPlantsByMaterial(Material='${sMaterial}')`;
          const oModel = this.getView().getModel();
          const oBindList = oModel.bindList(sPath);
          const aContexts = await oBindList.requestContexts();
          const aPlantData = aContexts.map(context => context.getObject());
  
          console.log("Fetched Plant Data:", aPlantData); // Debug
  
          const oPlantModel = new sap.ui.model.json.JSONModel({
              Plants: aPlantData,
              selectedPlant: {} // Store selected plant here
          });
  
          this.getView().setModel(oPlantModel, "plantModel");
          console.log("plantModel", oPlantModel);
          this.onPlant(); // Open plant selection fragment
      } catch (oError) {
          console.error("Error fetching plant data:", oError);
      }
  },

 
getServiceProfile: async function (sDocumentType) {
    const sServiceProfile = `/getServiceProfile(documentNo='${sDocumentType}')`;
    const oModel = this.getView().getModel();
    try {
        const aContexts = await oModel.bindList(sServiceProfile).requestContexts();
        const aCustomerData = aContexts.map(context => context.getObject());
        console.log("Fetched Data:", aCustomerData);
        // Bind the fetched data to the select box model
        var oServiceProfileModel = new sap.ui.model.json.JSONModel({ serviceProfiles: aCustomerData });
        this.getView().setModel(oServiceProfileModel, "serviceProfileModel");
        console.log("oServiceProfileModel",oServiceProfileModel);
    } catch (error) {
        console.error("Error fetching service profiles:", error);
    }
},
  

    onFieldSave: function (oEvent) {
      var oView = this.getView();
      var oModel = oView.getModel("headerModel");
      var aItems = oModel.getProperty("/items");
      var sSelectedItem = oModel.getProperty("/selectedItem");
      function formatDate(inputDate) {
          if (!inputDate) return ""; // Handle empty or invalid input
          var date = new Date(inputDate);
          if (isNaN(date.getTime())) return ""; // Invalid date check
          return date.toISOString().split("T")[0]; // Convert to "YYYY-MM-DD"
      }
      // Get input field values
      var sMaterial = oView.byId("conReqMaterialID67").getValue();
      var sUOM = oView.byId("conReqCUSPoUOM").getValue();
      var Plant = oView.byId("conReqCUSPoPlantID").getValue();
      var Profile = this.getView().byId("conReqServiceProfileid").getSelectedItem()?.getText() || '';
      var DPtargetQty = oView.byId("conReqDPTargetQuantity").getValue();
      var RDPtargetQty = oView.byId("conReqRDPTargetQuantity").getValue();
      var delivery = oView.byId("conReqDelivery_id").getValue();
   var deliveryPointDesc = oView.byId("conReqDPDescInput").getValue();
      var DPDCQ = oView.byId("conReqDPDCQInput").getValue();
      var redelivery = oView.byId("conReqRedelivery_id").getValue();
     var rdpDescription = oView.byId("conReqRdpdescInput").getValue();
      var RDPDCQ = oView.byId("conReqRDPDCQInput").getValue();
      var dcqValidFrom = formatDate(oView.byId("conReqValidFromDatePicker").getValue());
      var dcqValidTo = formatDate(oView.byId("conReqValidToDatePicker").getValue());
    var fuelLocation =  oView.byId("fuelRadio").getSelectedItem()?.getText() || '';
     var path = oView.byId("conReqPathInput").getValue();
     var FuelPercent= oView.byId("conReqFuelPercentageInput").getValue();
      // Find the current item in the array and update its values
      var oCurrentItem = aItems.find(item => item.Item === sSelectedItem);
      if (oCurrentItem) {
          oCurrentItem.Material = sMaterial;
          oCurrentItem.uom = sUOM;
          oCurrentItem.Plant = Plant;
          oCurrentItem.Profile = Profile;
          oCurrentItem.DPTargetQry = DPtargetQty;
          oCurrentItem.RPTargetQty = RDPtargetQty;
          oCurrentItem.DeliveryPoint = delivery;
          oCurrentItem.DeliveryText = deliveryPointDesc;
          oCurrentItem.DeliveryDcq = DPDCQ;
          oCurrentItem.RedeliveryPoint = redelivery;
          oCurrentItem.RedeliveryText = rdpDescription;
          oCurrentItem.RedeliveryDcq = RDPDCQ;
          oCurrentItem.ValidForm = dcqValidFrom;
          oCurrentItem.ValidTo = dcqValidTo;
          oCurrentItem.FuelLocation = fuelLocation;
          oCurrentItem.Path = path;
          oCurrentItem.FuelPercentage = FuelPercent;
      }
      // Update model with updated item data
      oModel.setProperty("/items", aItems);
      console.log("aItems",aItems);
      
      // Now calculate the sum of all RDPDCQ values in the line items
      
      var fTotalRDPDCQ = 0;
      aItems.forEach(function (item) {
          var fRDPDCQ = parseFloat(item.RedeliveryDcq) || 0; // Handle empty fields
          fTotalRDPDCQ += fRDPDCQ;
      });
      // Update the sum in the model
      oModel.setProperty("/accuRDPDCQ", fTotalRDPDCQ);
      // Optionally, set the calculated sum directly to the front-end field
      oView.byId("conReqRDPAccDCQ").setValue(fTotalRDPDCQ);
      // Now calculate the sum of all RDPDCQ values in the line items
      var fTotalDPDCQ = 0;
      aItems.forEach(function (item) {
          var fDPDCQ = parseFloat(item.DeliveryDcq) || 0; // Handle empty fields
          fTotalDPDCQ += fDPDCQ;
      });
      // Update the sum in the model
      oModel.setProperty("/accuDPDCQ", fTotalDPDCQ);
      // Optionally, set the calculated sum directly to the front-end field
      oView.byId("conReqDPAccDCQ").setValue(fTotalDPDCQ);
      this.onNextPress();
      this.onSelectDate();
      this.onGetProfile();

  },

  onSearchDelivery: function (oEvent) {
    var sValue = oEvent.getParameter("value");
    var oFilter = new sap.ui.model.Filter("Locid", sap.ui.model.FilterOperator.Contains, sValue);

    var oBinding = oEvent.getSource().getBinding("items");
    oBinding.filter([oFilter]);
},

onSearchRDP: function (oEvent) {
  var sValue = oEvent.getParameter("value");
  var oFilter = new sap.ui.model.Filter("Locid", sap.ui.model.FilterOperator.Contains, sValue);
  var oBinding = oEvent.getSource().getBinding("items");
  oBinding.filter([oFilter]);
},

  onGetProfile: function (oEvent) {
    var oView = this.getView();
    var oHeaderModel = oView.getModel("headerModel");
    var sSelectedItem = oHeaderModel.getProperty("/selectedItem");
    var aItems = oHeaderModel.getProperty("/items");

    // Find selected item
    var oSelectedItem = aItems.find(item => item.Item === sSelectedItem);
    if (!oSelectedItem) {
        console.warn("Selected item not found in the model.");
        return;
    }

    var sSelectedProfile = oSelectedItem.Profile;
    if (!sSelectedProfile) {
        console.warn("No profile associated with the selected item.");
        return;
    }

    // Get Saved Data Model
    var oSavedModel = oView.getModel("SavedLineItemsModel");
    if (!oSavedModel) {
        oSavedModel = new sap.ui.model.json.JSONModel({});
        oView.setModel(oSavedModel, "SavedLineItemsModel");
    }

    var oSavedData = oSavedModel.getProperty("/" + sSelectedItem) || {};

    // Retrieve current data before switching
    var oValueParamModel = oView.getModel("ValueParameterModel");
    var oDropdownModel = oView.getModel("DropdownModel");
    var oAllocParamModel = oView.getModel("AllocationParameterModel");

    var oCurrentData = {
        valueParams: oValueParamModel ? oValueParamModel.getData().valueParams : [],
        clauseRows: oDropdownModel ? oDropdownModel.getData().rows : [],
        allocParams: oAllocParamModel ? oAllocParamModel.getData().allocParams : []
    };

    // Save the previous item's data before switching
    if (oHeaderModel.getProperty("/previousItem")) {
        oSavedModel.setProperty("/" + oHeaderModel.getProperty("/previousItem"), oCurrentData);
    }

    // Restore or Fetch Data
    if (oSavedData.valueParams) {
        // Restore Value Parameters and Allocation Parameters
        oValueParamModel.setData({ valueParams: oSavedData.valueParams });
        oAllocParamModel.setData({ allocParams: oSavedData.allocParams });
    console.log("ValueParameterModel",oValueParamModel);
        // Preserve clauseCodes and thresholdRefs while restoring rows
        const oDropdownData = oDropdownModel ? oDropdownModel.getData() : {};
        oDropdownModel.setData({
            clauseCodes: oDropdownData.clauseCodes || [],
            thresholdRefs: oDropdownData.thresholdRefs || [],
            rows: oSavedData.clauseRows || [{ clauseCode: "", validFrom: "", validTo: "", threshold: "", thresholdReference: "", remark: "" }]
        });
    
    } else {
        this.fetchServiceCatalogueData(sSelectedProfile);
    }
    

    // Update previous selected item
    oHeaderModel.setProperty("/previousItem", sSelectedItem);
}, 
onSearchUOM: function (oEvent) {
  var sValue = oEvent.getParameter("value");
  var oFilter = new sap.ui.model.Filter("Msehi", sap.ui.model.FilterOperator.Contains, sValue);

  var oBinding = oEvent.getSource().getBinding("items");
  oBinding.filter([oFilter]);
},

onClausePress: function () {
  const oDropdownModel = this.getView().getModel("DropdownModel");
  const aRows = oDropdownModel.getProperty("/rows");

  // Add a new empty row
  aRows.push({
      clauseCode: "",           // Default empty values
      validFrom: "",
      validTo: "",
      threshold: "",
      thresholdReference: "",
      remark: ""
  });

  // Update the model with the new rows array
  oDropdownModel.setProperty("/rows", aRows);
},

onDeletePress: function (oEvent) {
  const oDropdownModel = this.getView().getModel("DropdownModel");
  const aRows = oDropdownModel.getProperty("/rows");

  // Get the index of the row to be deleted
  const oItem = oEvent.getSource().getParent();  // ColumnListItem
  const iIndex = oItem.getBindingContext("DropdownModel").getPath().split("/").pop();

  // Remove the row from the array
  aRows.splice(iIndex, 1);

  // Update the model with the new rows array
  oDropdownModel.setProperty("/rows", aRows);
},

deriveProDesc: function (oEvent) {
  var selectedServiceProfile = oEvent.getSource().getSelectedKey();
  var oModel = this.getView().getModel("serviceProfileModel");
  console.log("oServiceProfileModel",oModel);
  var aServiceProfiles = oModel.getProperty("/serviceProfiles");
  const serviceProfDescHbox = this.byId("serviceProfDesc_HboxID");
  
  serviceProfDescHbox.setVisible(true);

  // Find the selected service profile
  var oSelectedProfile = aServiceProfiles.find(profile => profile.serviceProfileName === selectedServiceProfile);
  var servProDescInput = this.byId("servProDesc_ID");
  
  if (oSelectedProfile) {
      // Update the selected profile in the model
      oModel.setProperty("/selectedServiceProfile", oSelectedProfile);
      servProDescInput.setValue(oSelectedProfile.serviceProfileDesc);
      
      // Explicitly set the serviceProfileDesc property
     
  } else {
      //oModel.setProperty("/selectedServiceProfile", null);
      oModel.setProperty("/selectedServiceProfile/serviceProfileDesc", "");
  }

  this.onFieldSave();
  //this.fetchServiceCatalogueData(selectedServiceProfile);
},

fetchServiceCatalogueData: async function (selectedServiceProfile) {
  const sServiceCatData = `/fetchServiceCatalogueData(serviceProfileName='${selectedServiceProfile}')`;
  const oModel = this.getView().getModel();

  try {
      const aContexts = await oModel.bindList(sServiceCatData).requestContexts();
      const aServiceProfData = aContexts.map(context => context.getObject());

      console.log("Fetched Data:", aServiceProfData);

      // Value Parameter Table Data
      const aValueParams = aServiceProfData.filter(item => item.Value_Parameter === true);
      this.getView().setModel(new sap.ui.model.json.JSONModel({ valueParams: aValueParams }), "ValueParameterModel");

      // Allocation Parameters
      let aAllocParams = aServiceProfData.filter(item => item.Allocation_Relevant === true);
      aAllocParams.sort((a, b) => a.Level - b.Level);

      let groupedAllocParams = {};
      aAllocParams.forEach(item => {
          if (!groupedAllocParams[item.Level]) {
              groupedAllocParams[item.Level] = {
                  Level: item.Level,
                  serviceParameters: []
              };
          }
          if (!groupedAllocParams[item.Level].serviceParameters.some(param => param.key === item.serviceParameter)) {
              groupedAllocParams[item.Level].serviceParameters.push({
                  key: item.serviceParameter,
                  text: item.serviceParameter
              });
          }
      });

      let finalAllocParams = Object.values(groupedAllocParams);
      this.getView().setModel(new sap.ui.model.json.JSONModel({ allocParams: finalAllocParams }), "AllocationParameterModel");

      // Clause Code & Threshold Reference Dropdown Data
      const aClauseCodeParams = aServiceProfData
          .filter(item => item.Threshold_Relevance === true)
          .map(item => ({ key: item.serviceParameter, text: item.serviceParameter }));

      const aThresholdRefParams = aServiceProfData
          .filter(item => item.Referrence_Relevant === true)
          .map(item => ({ key: item.serviceParameter, text: item.serviceParameter }));

      this.getView().setModel(new sap.ui.model.json.JSONModel({
          clauseCodes: aClauseCodeParams,
          thresholdRefs: aThresholdRefParams,
          rows: [{ clauseCode: "", validFrom: "", validTo: "", threshold: "", thresholdReference: "", remark: "" }]
      }), "DropdownModel");

  } catch (error) {
      console.error("Error fetching service profiles:", error);
  }
  this.onGetProfile();
},

  onSelectDate: function () {
    var oView = this.getView();
    var oModel = oView.getModel("headerModel");

    // Get the date pickers
    var oDP1 = oView.byId("conReqDatepickerValidFrom");
    var oDP2 = oView.byId("conReqDatepickerValidTo");

    // Get the values of the date pickers
    var sDate1 = oDP1.getDateValue(); // Date object
    var sDate2 = oDP2.getDateValue(); // Date object

    // Ensure both dates are selected
    if (!sDate1 || !sDate2) {
        return;
    }

    // Calculate the difference in days
    var iDaysDiff = Math.ceil((sDate2 - sDate1) / (1000 * 60 * 60 * 24)); // Convert ms to days

    if (iDaysDiff <= 0) {
        sap.m.MessageToast.show("Invalid date range: 'Valid To' must be after 'Valid From'.");
        return;
    }

    // Get the accumulated RDP value
    var iAccuRDP = oModel.getProperty("/accuRDPDCQ") || 0; // Ensure it's a number

    // Get the currently selected material
    var sSelectedItem = oModel.getProperty("/selectedItem");
    var aItems = oModel.getProperty("/items");
    var oSelectedItem = aItems.find(item => item.Item === sSelectedItem);

    if (!oSelectedItem) {
        sap.m.MessageToast.show("Selected item not found.");
        return;
    }

    var sSelectedMaterial = oSelectedItem.Material;

    // Calculate RDP Target Quantity
    var iRDPTargetQty = iAccuRDP * iDaysDiff;

    // Loop through all items and update RDP Target Quantity where material matches
    aItems.forEach(function (item) {
        if (item.Material === sSelectedMaterial) {
            item.RPTargetQty = iRDPTargetQty;
        }
    });

    // Update the model so all relevant line items update in UI
    oModel.setProperty("/items", aItems);

    // Optionally update the input field directly if necessary
    oView.byId("conReqRDPAccDCQ").setValue(iRDPTargetQty);
},

  onNextPress: function () { 
    var oView = this.getView();
    var oModel = oView.getModel("orgDetailModel");

    if (!oModel) {
        oModel = new sap.ui.model.json.JSONModel();
        oView.setModel(oModel, "orgDetailModel");
    }

    function formatDate(inputDate) {
        if (!inputDate) return ""; // Handle empty or invalid input
        var date = new Date(inputDate);
        if (isNaN(date.getTime())) return ""; // Invalid date check
        return date.toISOString().split("T")[0]; // Convert to "YYYY-MM-DD"
    }

    var oData = {
        SoldToParty: oView.byId("conReqSoldTP_id").getValue(),
        SoldToPartyDesc: oView.byId("soldTPDescID").getValue(),
        SalesOrganization: oView.byId("SalesOrg_id").getSelectedKey(),
        SalesOrganizationDesc: oView.byId("salesOrgDescID").getValue(),
        DistributionChannel: oView.byId("conReqInputDistributionChannel").getValue(),
        DistributionChannelDesc: oView.byId("distChanDescID").getValue(),
        Division: oView.byId("conReqInputDivision").getValue(),
        DivisionDesc: oView.byId("divisionDescID").getValue(),
        ShipToParty: oView.byId("conReqShipTP_id").getValue(),
        ShipToPartyDesc: oView.byId("ShipTPDescID").getValue(),
        ContractDescription: oView.byId("conReqContractDescForm1").getValue(),
        ValidFrom: formatDate(oView.byId("conReqDatepickerValidFrom").getValue()), // ✅ Format to "YYYY-MM-DD"
        ValidTo: formatDate(oView.byId("conReqDatepickerValidTo").getValue())    // ✅ Format to "YYYY-MM-DD"
    };

    oModel.setData(oData);
    console.log("Org Details saved successfully!", JSON.stringify(oData, null, 2));
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

      onConfirmPlant: function (oEvent) {
        const oSelectedItem = oEvent.getParameter("selectedItem");
    
        if (oSelectedItem) {
            const sPlant = oSelectedItem.getTitle();           // Plant code
            const sPlantDesc = oSelectedItem.getDescription(); // Plant description
    
            // Set plant code in the input field
            const oInput = this.getView().byId("conReqCUSPoPlantID");
            oInput.setValue(sPlant);

    
            // Set Plant Description in the model (plantModel > selectedPlant)
            const oPlantModel = this.getView().getModel("plantModel");
            oPlantModel.setProperty("/selectedPlant", {
                Plant: sPlant,
                PlantDesc: sPlantDesc
            });
    
            // Make the Plant Description input visible
            const oPlantDescInput = this.getView().byId("conReqPlantDESC");
            oPlantDescInput.setVisible(true);
    
            // Trigger field save logic (if needed)
            this.onFieldSave({
                getSource: () => oInput // Mock event object for onFieldSave
            });
        }
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

      onConfirmUOM: function (oEvent) {
        const oSelectedItem = oEvent.getParameter("selectedItem");
        if (oSelectedItem) {
            const sUOM = oSelectedItem.getTitle();
            const sUOMDesc = oSelectedItem.getDescription();
            const oInput = this.getView().byId("conReqCUSPoUOM");
            oInput.setValue(sUOM);
            // Manually trigger field change event
            this.onFieldSave({
                getSource: () => oInput // Create a mock event object
            });
        }
    },

    });
  });