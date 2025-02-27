/* checksum : 4892a8ddbb33c71f6bd77612d8c440f3 */
@cds.external : true
@m.IsDefaultEntityContainer : 'true'
@sap.message.scope.supported : 'true'
@sap.supported.formats : 'atom json xlsx'
service GMSNOMCONTRACT_CDS {};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.content.version : '1'
@sap.label : 'Contract Header for GMS Contracts'
entity GMSNOMCONTRACT_CDS.xGMSxCONHEAD {
  @sap.display.format : 'UpperCase'
  @sap.label : 'DocumentNo'
  @sap.quickinfo : 'Document Number'
  key Vbeln : String(10) not null;
  @sap.display.format : 'NonNegative'
  @sap.label : 'Sales Document Item'
  key ItemNo : String(6) not null;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Material'
  @sap.quickinfo : 'Material Number'
  key Material : String(40) not null;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Delivery Point'
  key DeliveryPt : String(10) not null;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Redelivery Point'
  key RedeliveryPt : String(10) not null;
  @sap.label : 'Daily ContractQty'
  @sap.quickinfo : 'DCQ'
  Dcq : Decimal(13, 3);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Path'
  Path : String(50);
  @sap.label : 'Fuel%'
  FuelPercentage : Decimal(5, 2);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Document Type'
  DocType : String(1);
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.content.version : '1'
@sap.label : 'Nomination contract'
entity GMSNOMCONTRACT_CDS.xGMSxnomcontract {
  @sap.display.format : 'UpperCase'
  @sap.label : 'DocumentNo'
  @sap.quickinfo : 'Document Number'
  key Vbeln : String(10) not null;
  @sap.display.format : 'NonNegative'
  @sap.label : 'Sales Document Item'
  key Posnr : String(6) not null;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Sales Contract Descr'
  @sap.quickinfo : 'Sales Contract Description'
  salesDesc : String(20);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Sold-To Party'
  kunnr : String(10);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Document Type'
  DocType : String(1);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Material'
  @sap.quickinfo : 'Material Number'
  Material : String(40);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Delivery Point'
  DeliveryPt : String(10);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Redelivery Point'
  RedeliveryPt : String(10);
  to_Contract : Association to many GMSNOMCONTRACT_CDS.xGMSxNOMIFETCH {  };
  to_ContrHeader : Association to many GMSNOMCONTRACT_CDS.xGMSxCONHEAD {  };
  to_Event : Association to many GMSNOMCONTRACT_CDS.xGMSxNom_Event {  };
  to_Material : Association to GMSNOMCONTRACT_CDS.I_MaterialText {  };
  to_PastNom : Association to many GMSNOMCONTRACT_CDS.xGMSxPast_Nom {  };
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.content.version : '1'
@sap.label : 'Nomination Fetch'
entity GMSNOMCONTRACT_CDS.xGMSxNOMIFETCH {
  @sap.display.format : 'UpperCase'
  @sap.label : 'DocumentNo'
  @sap.quickinfo : 'Document Number'
  key Vbeln : String(10) not null;
  @sap.display.format : 'NonNegative'
  @sap.label : 'Sales Document Item'
  key ItemNo : String(6) not null;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Path'
  key Path : String(50) not null;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Service Profile'
  key ServProfile : String(40) not null;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Parameter Type'
  key ParamType : String(20) not null;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Service Parameter'
  key ServiceParam : String(20) not null;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Service Parameter'
  key clause_code : String(20) not null;
  @sap.display.format : 'NonNegative'
  @sap.label : 'Sales Document Item'
  key Posnr : String(6) not null;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Document Type'
  key DocType : String(1) not null;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Calculated Value'
  calculated_value : String(20);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Parameter Value'
  @sap.quickinfo : 'Service Parameter Value'
  ParamValue : String(50);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Delivery Point'
  DeliveryPt : String(10);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Redelivery Point'
  RedeliveryPt : String(10);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Sales Contract Descr'
  @sap.quickinfo : 'Sales Contract Description'
  SalesDesc : String(20);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Material'
  @sap.quickinfo : 'Material Number'
  Material : String(40);
  @sap.label : 'Order Unit'
  @sap.quickinfo : 'Purchase Order Unit of Measure'
  @sap.semantics : 'unit-of-measure'
  UoM : String(3);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Customer'
  @sap.quickinfo : 'Customer Number'
  Kunnr : String(10);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Material'
  @sap.quickinfo : 'Material Number'
  Matnr : String(40);
  @sap.label : 'Short Text'
  Arktx : String(40);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Purchasing Doc. Type'
  @sap.quickinfo : 'Purchasing Document Type'
  auart : String(4);
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.content.version : '1'
@sap.label : 'Event and gasday from nom'
entity GMSNOMCONTRACT_CDS.xGMSxNom_Event {
  @sap.display.format : 'Date'
  @sap.label : 'Gas Day'
  @sap.quickinfo : 'Gas Day Date'
  key Gasday : Date not null;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Sales document'
  @sap.quickinfo : 'Sales Document'
  key Vbeln : String(10) not null;
  @odata.Type : 'Edm.DateTimeOffset'
  @sap.label : 'Short Time Stamp'
  @sap.quickinfo : 'UTC Time Stamp in Short Form (YYYYMMDDhhmmss)'
  Timestamp : DateTime;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Event Type'
  @sap.quickinfo : 'Nomination Event'
  Event : String(40);
  @sap.label : 'Approved DNQ'
  Adnq : Decimal(13, 3);
  @sap.label : 'Daily ContractQty'
  @sap.quickinfo : 'DCQ'
  Dcq : Decimal(13, 3);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Long comment'
  @sap.quickinfo : 'iSeries: Long comment of a table, view or table field'
  Remarks : String(255);
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.content.version : '1'
@sap.label : 'Past Nomination'
entity GMSNOMCONTRACT_CDS.xGMSxPast_Nom {
  @sap.display.format : 'Date'
  @sap.label : 'Gas Day'
  @sap.quickinfo : 'Gas Day Date'
  key Gasday : Date not null;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Sales document'
  @sap.quickinfo : 'Sales Document'
  key Vbeln : String(10) not null;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Version'
  key Versn : String(3) not null;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Nomination key'
  @sap.quickinfo : 'Nomination (technical) Key'
  Nomtk : String(20);
  @sap.display.format : 'UpperCase'
  @sap.text : 'Material_Description'
  @sap.label : 'Material'
  @sap.quickinfo : 'Material Number'
  Material : String(40);
  @sap.label : 'Material description'
  Material_Description : String(40);
  @sap.unit : 'PC7CC09063064497903FE229433F7C278'
  @sap.label : 'Approved DNQ'
  Adnq : Decimal(13, 3);
  @sap.unit : 'PC7CC09063064497903FE229433F7C278'
  @sap.label : 'RePublish DNQ'
  @sap.quickinfo : 'Re-Publish DNQ'
  Rpdnq : Decimal(13, 3);
  Uom4 : String(3);
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.content.version : '1'
@sap.label : 'Material Text'
entity GMSNOMCONTRACT_CDS.I_MaterialText {
  @sap.display.format : 'UpperCase'
  @sap.label : 'Material'
  @sap.quickinfo : 'Material Number'
  key Material : String(40) not null;
  @sap.label : 'Language Key'
  key Language : String(2) not null;
  @sap.label : 'Material description'
  MaterialName : String(40);
};

