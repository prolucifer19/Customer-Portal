/* checksum : 6a3bfe1320d7e467180ec2e84ed55b09 */
@cds.external : true
@m.IsDefaultEntityContainer : 'true'
@sap.message.scope.supported : 'true'
@sap.supported.formats : 'atom json xlsx'
service GMSMATERIAL_DATA_CDS {};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.content.version : '1'
@sap.label : 'Material Data MARA_MAKT'
entity GMSMATERIAL_DATA_CDS.xGMSxMaterial_Data {
  @sap.display.format : 'UpperCase'
  @sap.label : 'Material'
  @sap.quickinfo : 'Material Number'
  key Material : String(40) not null;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Plant'
  key Plant : String(4) not null;
  @sap.label : 'Base UOM'
  @sap.quickinfo : 'Alternative Unit of Measure for Stockkeeping Unit'
  @sap.semantics : 'unit-of-measure'
  key UOM : String(3) not null;
  @sap.label : 'Description'
  @sap.quickinfo : 'Material description'
  Des : String(40);
  @sap.label : 'Plant Description'
  @sap.quickinfo : 'Name'
  PlantDesc : String(30);
  to_sloc : Association to many GMSMATERIAL_DATA_CDS.xgmsxmatplntsloc {  };
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.content.version : '1'
@sap.label : 'MARD View'
entity GMSMATERIAL_DATA_CDS.xgmsxmatplntsloc {
  @sap.display.format : 'UpperCase'
  @sap.label : 'Material'
  @sap.quickinfo : 'Material Number'
  key Material : String(40) not null;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Plant'
  key Plant : String(4) not null;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Storage location'
  key StorageLocation : String(4) not null;
  @sap.label : 'Storage Loc. Name'
  @sap.quickinfo : 'Storage Location Name'
  StorageLocationName : String(16);
};

