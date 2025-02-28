/* checksum : aeaf3bfaec70995f83184353948c0501 */
@cds.external : true
@m.IsDefaultEntityContainer : 'true'
@sap.message.scope.supported : 'true'
@sap.supported.formats : 'atom json xlsx'
service GMSVENDOR_DATA_NAV_CDS {};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.content.version : '1'
@sap.label : 'Vendor Data from KNVV and KNA1'
entity GMSVENDOR_DATA_NAV_CDS.xGMSxVendor_Data {
  @sap.display.format : 'UpperCase'
  @sap.label : 'Sold To Party'
  @sap.quickinfo : 'Customer Number'
  key Sold_Party : String(10) not null;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Sales Organization'
  key Sales_org : String(4) not null;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Distribution Channel'
  key Chnl_Dis : String(2) not null;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Division'
  key Division : String(2) not null;
  @sap.label : 'Sold To Party Text'
  Sold_Party_Text : String(70);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Partner Function'
  Patnr_Fn : String(2);
  @sap.label : 'Partner Function Text'
  @sap.quickinfo : 'Name'
  Partnr_Fn_Text : String(20);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Ship To Party'
  @sap.quickinfo : 'Customer number of business partner'
  Ship_Party : String(10);
  @sap.label : 'Ship To Party Text'
  Ship_Party_Text : String(70);
  @sap.label : 'Sales Organization Text'
  @sap.quickinfo : 'Name'
  Sales_org_Text : String(20);
  @sap.label : 'Distribution Channel Text'
  @sap.quickinfo : 'Name'
  Chnl_Dis_Text : String(20);
  @sap.label : 'Division Text'
  @sap.quickinfo : 'Name'
  Division_Text : String(20);
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.content.version : '1'
@sap.label : 'Vendor Data Nevigation'
entity GMSVENDOR_DATA_NAV_CDS.xGMSxVendor_Data_Nav {
  @sap.display.format : 'UpperCase'
  @sap.label : 'Sold To Party'
  @sap.quickinfo : 'Customer Number'
  key Sold_Party : String(10) not null;
  @sap.label : 'Sold To Party Text'
  Sold_Party_Text : String(70);
  tovendor_data : Association to many GMSVENDOR_DATA_NAV_CDS.xGMSxVendor_Data {  };
};

