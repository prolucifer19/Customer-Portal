/* checksum : 9fbb1b31761fbfe68146a99f60d358d1 */
@cds.external : true
@m.IsDefaultEntityContainer : 'true'
@sap.message.scope.supported : 'true'
@sap.supported.formats : 'atom json xlsx'
service ZGMSDOCFLOW7_CDS {};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.content.version : '1'
@sap.label : 'DOCFLOW'
entity ZGMSDOCFLOW7_CDS.ZGMSDOCFLOW7 {
  @sap.display.format : 'UpperCase'
  @sap.label : 'DocumentNo'
  @sap.quickinfo : 'Document Number'
  key Vbeln : String(10) not null;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Subsequent Document'
  @sap.quickinfo : 'Subsequent Sales and Distribution Document'
  OrderNumber : String(10);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Subsequent Document'
  @sap.quickinfo : 'Subsequent Sales and Distribution Document'
  DeliveryNumber : String(10);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Ticket key'
  @sap.quickinfo : 'OIL-TSW: Ticket key'
  TicketKey : String(20);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Subsequent Document'
  @sap.quickinfo : 'Subsequent Sales and Distribution Document'
  GMNumber : String(10);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Billing Document'
  BillingNumber : String(10);
  @sap.display.format : 'Date'
  @sap.label : 'Billing Date'
  BillingDate : Date;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Sold-To Party'
  Customer : String(10);
  @sap.label : 'Name of Customer'
  CustomerName : String(80);
  @sap.unit : 'UOM'
  @sap.label : 'Billed Quantity'
  @sap.quickinfo : 'Actual billed quantity'
  Quantity : Decimal(13, 3);
  @sap.label : 'Sales unit'
  @sap.semantics : 'unit-of-measure'
  UOM : String(3);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Material'
  @sap.quickinfo : 'Material Number'
  Material : String(40);
  @sap.label : 'Material description'
  MaterialName : String(40);
  @sap.label : 'Net weight'
  price : Decimal(15, 3);
  @sap.display.format : 'Date'
  @sap.label : 'Pricing Date'
  @sap.quickinfo : 'Date for Pricing and Exchange Rate'
  pricing_dt : Date;
  @sap.display.format : 'Date'
  BillDueDate : Date;
};

