/* checksum : 3eacef12332230b66ead1915c3816822 */
@cds.external : true
@m.IsDefaultEntityContainer : 'true'
@sap.message.scope.supported : 'true'
@sap.supported.formats : 'atom json xlsx'
service ZSALES_CONTRACT_CDS {};

@cds.external : true
@cds.persistence.skip : true
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.content.version : '1'
@sap.label : 'Sales Contract'
entity ZSALES_CONTRACT_CDS.ZSales_Contract {
  @sap.display.format : 'UpperCase'
  @sap.label : 'Sales document'
  @sap.quickinfo : 'Sales Document'
  key Sales_Document : String(10) not null;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Sales Document Type'
  Doc_Type : String(4);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Customer'
  @sap.quickinfo : 'Customer Number'
  Sold_to_Party : String(10);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Customer'
  @sap.quickinfo : 'Customer Number'
  Ship_to_Party : String(10);
  @sap.display.format : 'Date'
  @sap.label : 'Valid-From Date'
  @sap.quickinfo : 'Valid-From Date (Outline Agreements, Product Proposals)'
  Valid_as : Date;
  @sap.display.format : 'Date'
  @sap.label : 'Valid-To Date'
  @sap.quickinfo : 'Valid-To Date (Outline Agreements, Product Proposals)'
  Valid_to : Date;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Sales Organization'
  Sales_Org : String(4);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Distribution Channel'
  Distribution_Channel : String(2);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Division'
  Division : String(2);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Material'
  @sap.quickinfo : 'Material Number'
  Material : String(40);
  @sap.unit : 'UOM'
  @sap.label : 'Target Quantity'
  @sap.quickinfo : 'Target Quantity in Sales Units'
  Target_Quantity : Decimal(13, 3);
  @sap.label : 'Target Quantity UoM'
  @sap.semantics : 'unit-of-measure'
  UOM : String(3);
  @sap.label : 'Item Description'
  @sap.quickinfo : 'Short text for sales order item'
  Item_Description : String(40);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Plant'
  @sap.quickinfo : 'Plant (Own or External)'
  Plant : String(4);
};

