using GMSVENDOR_DATA_NAV_CDS from './external/GMSVENDOR_DATA_NAV_CDS.cds';
using GMSNOMCONTRACT_CDS from './external/GMSNOMCONTRACT_CDS.cds';
using GMSNOMCP_GMS_SRV from './external/GMSNOMCP_GMS_SRV.cds';
using ZNOM_CREATE_SRV from './external/ZNOM_CREATE_SRV.cds';
using ZSALES_CONTRACT_CDS from './external/ZSALES_CONTRACT_CDS.cds';
using GMSTICKET_API_SRV from './external/GMSTICKET_API_SRV.cds';
using GMSMATERIAL_DATA_CDS from './external/GMSMATERIAL_DATA_CDS.cds';
using GMSVALUEHELP_SRV from './external/GMSVALUEHELP_SRV.cds';


service customerportalservice {
    function getNominationsByCustomer(DocType : String, Customer : String) returns array of String;
    function getContractDetailsAndPastNom(Vbeln : String)                  returns array of String;
    function getNominationDetailsByGasDay(Gasday : Date, Vbeln : String)   returns array of String;
    function getNominationDetails(Gasday : Date, Vbeln : String)           returns array of String;

    function getSoldtoPartyData(Sold_Party : String)                                                                                  returns array of {
        Sold_Party : String;
        Sales_org : String;
        Chnl_Dis : String;
        Division : String;
        Sold_Party_Text : String;
        Patnr_Fn : String;
        Partnr_Fn_Text : String;
        Ship_Party : String;
        Ship_Party_Text : String;
        Sales_org_Text : String;
        Chnl_Dis_Text : String;
        Division_Text : String;
    };

    function FetchPlantsByMaterial(Material : String)                                                                                 returns array of {
        Plant : String;
        PlantDesc : String;

    };

    function getServiceProfile(documentNo : String)                                                                                   returns array of {
        serviceProfileName : String;
        serviceProfileDesc : String;
    };

    

    entity xGMSxVendor_Data     as
        projection on GMSVENDOR_DATA_NAV_CDS.xGMSxVendor_Data {
            key Sold_Party,
            key Sales_org,
            key Chnl_Dis,
            key Division,
                Sold_Party_Text,
                Patnr_Fn,
                Partnr_Fn_Text,
                Ship_Party,
                Ship_Party_Text,
                Sales_org_Text,
                Chnl_Dis_Text,
                Division_Text
        };

    entity xGMSxVendor_Data_Nav as
        projection on GMSVENDOR_DATA_NAV_CDS.xGMSxVendor_Data_Nav {
            key Sold_Party,
                Sold_Party_Text
        };

    entity xGMSxCONHEAD         as
        projection on GMSNOMCONTRACT_CDS.xGMSxCONHEAD {
            key Vbeln,
            key ItemNo,
            key Material,
            key DeliveryPt,
            key RedeliveryPt,
                Dcq,
                Path,
                FuelPercentage,
                DocType
        };

    entity ZNOMMASTER5          as
        projection on GMSNOMCP_GMS_SRV.ZNOMMASTER5 {
            key Vbeln,
            key Customer,
                Vbeln_p,
                Vbeln_s,
                CustomerName,
                Auart,
                ValidFrom,
                ValidTo,
                ContractDescription,
                DocType
        };

    entity xGMSxPast_Nom        as
        projection on GMSNOMCP_GMS_SRV.xGMSxPast_Nom {
            key Gasday,
            key Vbeln,
            key Versn,
                Nomtk,
                Material,
                Material_Description,
                Adnq,
                Rpdnq,
                Uom4
        };

    entity ZNOMCPDATA           as
        projection on ZNOM_CREATE_SRV.ZNOMCPDATA {
            key Gasday,
            key Vbeln,
            key ItemNo,
            key NomItem,
            key Versn,
            key DeliveryPoint,
            key RedelivryPoint,
            key ValidTo,
            key ValidFrom,
                Material,
                Timestamp,
                Nomtk,
                Kunnr,
                Auart,
                Ddcq,
                Rdcq,
                Uom1,
                Pdnq,
                Event,
                Adnq,
                Rpdnq,
                Znomtk,
                Src,
                Remarks,
                Flag,
                Action,
                Path,
                CustGrp,
                SrvProfile,
                Time2
        };

    entity ZNOMMASTER7          as
        projection on GMSNOMCP_GMS_SRV.ZNOMMASTER7 {
            key Vbeln,
            key Material,
            key ItemNo,
            key RedeliveryPt,
            key DeliveryPt
        };

    entity ZNOMMASTER6          as
        projection on GMSNOMCP_GMS_SRV.ZNOMMASTER6 {
            key Vbeln,
            key ItemNo,
            key Material,
            key ServProfile,
                MaterialName,
                DCQ,
                UOM
        };

    entity ZNOMMASTER10         as
        projection on GMSNOMCP_GMS_SRV.ZNOMMASTER10 {
            key Vbeln,
            key ItemNo,
            key Material,
            key ClauseCode,
            key Path,
                ValidFrom,
                ValidTo,
                ThresholdP,
                ThreshRef,
                Remark,
                CalculatedValue,
                DocType
        };

 entity xGMSxUOM_value                as
        projection on GMSVALUEHELP_SRV.xGMSxUOM_value {
            key Msehi,
                Dimid,
                Mseht,
                Msehl
        };

    entity xGMSxLocPoint_DP              as
        projection on GMSVALUEHELP_SRV.xGMSxLocPoint_DP {
            key Locid,
                Locnam,
                Loctyp,
                LoctypText,
                LoctypLongText
        };

    entity xGMSxLocPoint_RDP             as
        projection on GMSVALUEHELP_SRV.xGMSxLocPoint_RDP {
            key Locid,
                Locnam,
                Loctyp,
                LoctypText,
                LoctypLongText
        };


    entity xGMSxGMS_nom         as
        projection on GMSNOMCP_GMS_SRV.xGMSxGMS_nom {
            key Gasday,
            key deliveryPoint,
            key Redelivery,
            key Vbeln,
            key Posnr,
            key Versn,
                Timestamp,
                Nomtk,
                Kunnr,
                Auart,
                Rank,
                Time2,
                Dcq,
                Uom1,
                PDnq,
                Uom2,
                Event,
                Adnq,
                Rpdnq,
                Uom4,
                Znomtk,
                Zstat,
                Dtolp,
                Dtolq,
                ZpotentialSf,
                Src,
                Remarks,
                Flag,
                Action,
                Srvparam1,
                Srvparam2,
                Path,
                CustGrp,
                SrvProfile,
                Material,
                Transys
        };

    entity znompudelivery       as
        projection on GMSNOMCP_GMS_SRV.znompudelivery {
            key Vbeln,
            key ItemNo,
            key Material,
                DeliveryPt,
                RedeliveryPt
        };

    entity ZNOMMASTER8          as
        projection on GMSNOMCP_GMS_SRV.ZNOMMASTER8 {
            key Customer,
                CustomerName,
                Supplier,
                SupplierName
        };

    entity ZSales_Contract      as
        projection on ZSALES_CONTRACT_CDS.ZSales_Contract {
            key Sales_Document,
                Doc_Type,
                Sold_to_Party,
                Ship_to_Party,
                Valid_as,
                Valid_to,
                Sales_Org,
                Distribution_Channel,
                Division,
                Material,
                Target_Quantity,
                UOM,
                Item_Description,
                Plant
        };

    entity nomi_SaveSet         as
        projection on ZNOM_CREATE_SRV.nomi_SaveSet {
            key Gasday,
            key Vbeln,
                ItemNo,
                NomItem,
                Versn,
                DeliveryPoint,
                RedelivryPoint,
                ValidTo,
                ValidFrom,
                Material,
                Timestamp,
                Nomtk,
                Kunnr,
                Auart,
                Ddcq,
                Rdcq,
                Uom1,
                Pdnq,
                Event,
                Adnq,
                Rpdnq,
                Znomtk,
                Src,
                Remarks,
                Flag,
                Action,
                Path,
                CustGrp,
                SrvProfile,
                Time2
        };

    entity znom_headSet         as
        projection on ZNOM_CREATE_SRV.znom_headSet {
                Gasday,
            key Vbeln,
                nomi_toitem
        };

    entity xGMSxTKTDETAILS03    as
        projection on GMSTICKET_API_SRV.xGMSxTKTDETAILS03 {
            key TicketKey,
            key TicketItem,
            key TicketVersion,
            key TicketPurpose,
                TicketPurposeDescription,
                NominationNumber,
                NominationKey,
                NominationItem,
                LocationId,
                LocationName,
                Quantity,
                UOM,
                Material,
                MaterialName,
                CreatedDate,
                CreatedTime,
                CreatedBy,
                ChangedDate,
                ChangedTime,
                ChangedBy,
                BlockingIndicator,
                DeletionIndicator,
                DocumentDate,
                Adnq
        };

    entity CreateTicket         as
        projection on GMSTICKET_API_SRV.CreateTicket {
            key Save
        };

         

    entity TicketHeaderSet      as
        projection on GMSTICKET_API_SRV.TicketHeaderSet {
            key TicketItem,
            key TicketKey,
                TicketVersion,
                TicketPurpose,
                EventNr,
                Type,
                DocType,
                EvSeq,
                DocNumber,
                Shitem,
                Status,
                Actualstartfrom,
                Actualstartto,
                Actualendfrom,
                Actualendto,
                CreName,
                Creation,
                ChaName,
                Modification,
                VehNr,
                Tsrfo,
                Delind,
                Updkz
        };

    entity TicketItemsSet       as
        projection on GMSTICKET_API_SRV.TicketItemsSet {
            key TicketKey,
            key TicketItem,
                TicketVersion,
                TicketPurpose,
                ExtPosnr,
                Status,
                Substatus,
                Sityp,
                Tktsubrc,
                Mvscenario,
                Nomnr,
                Nomtk,
                Nomit,
                Receiver,
                Locid,
                Tanknr,
                Vehicle,
                Menge,
                Grosquan,
                Meins,
                Matnr,
                Tankage,
                Supplier,
                Consigne,
                AgreedQty,
                AgreedQtyUom,
                ShipQty,
                ShipQtyUom,
                Mttmp,
                Mtteh,
                OApiGrav,
                ApiGrtD,
                Tstmp,
                Tsteh,
                Tdich,
                Erdat,
                Erzeit,
                Ernam,
                Aedat,
                Aezeit,
                Aenam,
                Bloind,
                Delind,
                Tktselect,
                Budat,
                CloseNomit,
                Eventtype,
                EventDate,
                Gmmnr,
                OItmstm,
                OMetev,
                CItmstm,
                CMetev,
                Stoprdg,
                StmQuantity,
                StmUom,
                Socnr,
                ODipRead,
                ODipReadUom,
                OEtmstm,
                OSocev,
                CDipRead,
                CDipReadUom,
                CEtmstm,
                CSocev,
                Stopdip,
                StopdipUom,
                StpGauQuan,
                StpGauUom,
                GauQuantity,
                GauUom,
                Shtype,
                Vstel,
                ChargO,
                WerksO,
                LgortO,
                ChargD,
                WerksD,
                LgortD,
                TimeStLoadSta,
                TimeStLoadEnd,
                TimeStLedOt,
                ChargDCreate,
                OibBltime,
                ChargL,
                ChargLCreate,
                Shtyp,
                MengePar,
                UnitIPar,
                Railcarqty,
                DummyTktitmInclEewPs,
                Ldplt,
                Itplt,
                Itstlc,
                Itbtch,
                Updkz
        };

    entity returnSet            as
        projection on GMSTICKET_API_SRV.returnSet {
            key Type,
            key Id,
            key Number,
                Message,
                LogNo,
                LogMsgNo,
                MessageV1,
                MessageV2,
                MessageV3,
                MessageV4,
                Parameter,
                Row,
                Field,
                System
        };
         entity xGMSxMaterial_Data as projection on GMSMATERIAL_DATA_CDS.xGMSxMaterial_Data
    {        key Material, key Plant, key UOM, Des as Description, PlantDesc     }    
;

    entity xGMSxTKTDETAILS02    as
        projection on GMSTICKET_API_SRV.xGMSxTKTDETAILS02 {
            key TicketKey,
            key TicketItem,
            key TicketVersion,
            key TicketPurpose,
            key SeqNmbr,
                TransactionCode,
                Returncode,
                DocumentNumber,
                DocumentYear,
                ItemNo,
                DocumentCategory,
                ReversalDocumentIndicator
        };
        
}
