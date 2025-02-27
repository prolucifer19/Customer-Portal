/* checksum : a86c9775d6363c1226d680d07c8e113b */
@cds.external : true
@m.IsDefaultEntityContainer : 'true'
@sap.message.scope.supported : 'true'
@sap.supported.formats : 'atom json xlsx'
service ZSERVICE_NOMI_CDS {};

@cds.external : true
@cds.persistence.skip : true
@sap.deletable : 'false'
@sap.content.version : '1'
@sap.label : 'Service Nomination'
entity ZSERVICE_NOMI_CDS.ZSERVICE_NOMI {
  @sap.display.format : 'UpperCase'
  @sap.label : 'Nomination Key'
  key NominationKey : String(20) not null;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Service Type'
  ServiceType : String(20);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Path'
  Path : String(20);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Rank'
  Rank : String(20);
  @sap.display.format : 'UpperCase'
  @sap.label : 'DCQ'
  Dcq : String(20);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Max DCQ'
  MaxDcq : String(20);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Min DCQ'
  MinDcq : String(20);
  @sap.display.format : 'UpperCase'
  @sap.label : 'DIQ'
  Diq : String(20);
  @sap.display.format : 'UpperCase'
  @sap.label : 'DWQ'
  Dwq : String(20);
  @sap.display.format : 'UpperCase'
  @sap.label : ''
  @sap.quickinfo : 'Rate Class'
  RateClass : String(20);
};

