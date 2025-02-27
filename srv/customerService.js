const cds = require('@sap/cds');

module.exports = async (srv) => 
{        
    // Using CDS API      
    const GMSVENDOR_DATA_NAV_CDS = await cds.connect.to("GMSVENDOR_DATA_NAV_CDS"); 
      srv.on('READ', 'xGMSxVendor_Data', req => GMSVENDOR_DATA_NAV_CDS.run(req.query)); 
      srv.on('READ', 'xGMSxVendor_Data_Nav', req => GMSVENDOR_DATA_NAV_CDS.run(req.query)); 
      const GMSCONTAPPROVAL_SRV = await cds.connect.to("GMSCONTAPPROVAL_SRV"); 
      srv.on('READ', 'CreateSPSet', req => GMSCONTAPPROVAL_SRV.run(req.query));
      const ZGMSDOCFLOW7_CDS = await cds.connect.to("ZGMSDOCFLOW7_CDS"); 
      srv.on('READ', 'ZGMSDOCFLOW7', req => ZGMSDOCFLOW7_CDS.run(req.query));
      const GMSCONTRACTS_SRV = await cds.connect.to("GMSCONTRACTS_SRV"); 
      srv.on('READ', 'HeaderTableSet', req => GMSCONTRACTS_SRV.run(req.query)); 
      srv.on('READ', 'OrgDetailSet', req => GMSCONTRACTS_SRV.run(req.query)); 
      srv.on('READ', 'clauseCodeSet', req => GMSCONTRACTS_SRV.run(req.query)); 
      srv.on('READ', 'createContractSet', req => GMSCONTRACTS_SRV.run(req.query)); 
      srv.on('READ', 'customFldSet', req => GMSCONTRACTS_SRV.run(req.query)); 
      srv.on('READ', 'serviceProfileSet', req => GMSCONTRACTS_SRV.run(req.query));
      const GMSTICKET_API_SRV = await cds.connect.to("GMSTICKET_API_SRV"); 
      srv.on('READ', 'xGMSxTKTDETAILS03', req => GMSTICKET_API_SRV.run(req.query));
      srv.on('READ', 'CreateTicket', req => GMSTICKET_API_SRV.run(req.query)); 
      srv.on('READ', 'TicketHeaderSet', req => GMSTICKET_API_SRV.run(req.query)); 
      srv.on('READ', 'TicketItemsSet', req => GMSTICKET_API_SRV.run(req.query)); 
      srv.on('READ', 'returnSet', req => GMSTICKET_API_SRV.run(req.query)); 
      srv.on('READ', 'xGMSxTKTDETAILS02', req => GMSTICKET_API_SRV.run(req.query));

      srv.on("CREATE", "CreateTicket", (req) => GMSTICKET_API_SRV.run(req.query));
    srv.on("CREATE", "TicketHeaderSet", (req) =>
        GMSTICKET_API_SRV.run(req.query)
    );
    // srv.on('CREATE', 'xGMSxTKTDETAILS02', req => GMSTICKET_API_SRV.run(req.query)); 
    // srv.on('CREATE', 'xGMSxTKTDETAILS03', req => GMSTICKET_API_SRV.run(req.query));
    srv.on("CREATE", "TicketItemsSet", (req) => GMSTICKET_API_SRV.run(req.query));
    srv.on("CREATE", "returnSet", (req) => GMSTICKET_API_SRV.run(req.query));

      const GMSNOMCONTRACT_CDS = await cds.connect.to("GMSNOMCONTRACT_CDS"); 
      srv.on('READ', 'xGMSxCONHEAD', req => GMSNOMCONTRACT_CDS.run(req.query));
      const ZNOM_CREATE_SRV = await cds.connect.to("ZNOM_CREATE_SRV");
      srv.on('READ', 'znom_headSet', req => ZNOM_CREATE_SRV.run(req.query));
      srv.on('CREATE', 'znom_headSet', async(req) =>{
        console.log("Payload", req.data);
        return await ZNOM_CREATE_SRV.run(req.query)
      });
      srv.on('CREATE', 'nomi_SaveSet', req => ZNOM_CREATE_SRV.run(req.query));
      srv.on('READ', 'ZNOMCPDATA', req => ZNOM_CREATE_SRV.run(req.query));
      srv.on('UPDATE', 'ZNOMCPDATA', req => ZNOM_CREATE_SRV.run(req.query));
 
      srv.on('READ', 'ZNOMCPDATA', async(req) =>{
 
        let query = SELECT.from('ZNOMCPDATA');
 
        return await ZNOM_CREATE_SRV.run(req.query);
    });
    srv.on('READ', 'znom_headSet', async (req) => {
        try {
            const result = await ZNOM_CREATE_SRV.run(SELECT.from('znom_headSet'));
            return result;
        } catch (error) {
            req.error(500, "Error fetching data: " + error.message);
        }
    });
     
 
    srv.on('READ', 'nomi_SaveSet', async (req) => {
        console.log("Datataa", req.data);
       
        let query = SELECT.from('nomi_SaveSet').where({})
        return await ZNOM_CREATE_SRV.run(req.query)
    });
      const ZSALES_CONTRACT_CDS = await cds.connect.to("ZSALES_CONTRACT_CDS"); 
      srv.on('READ', 'ZSales_Contract', req => ZSALES_CONTRACT_CDS.run(req.query));
      const GMSNOMCP_GMS_SRV = await cds.connect.to("GMSNOMCP_GMS_SRV"); 
      srv.on('READ', 'ZNOMMASTER7', req => GMSNOMCP_GMS_SRV.run(req.query)); 
      srv.on('READ', 'ZNOMMASTER6', req => GMSNOMCP_GMS_SRV.run(req.query)); 
      srv.on('READ', 'ZNOMMASTER10', req => GMSNOMCP_GMS_SRV.run(req.query));
      srv.on('READ', 'ZNOMMASTER8', req => GMSNOMCP_GMS_SRV.run(req.query)); 
      srv.on('READ', 'xGMSxPast_Nom', req => GMSNOMCP_GMS_SRV.run(req.query));
      srv.on('READ', 'ZNOMMASTER5', req => GMSNOMCP_GMS_SRV.run(req.query));
      srv.on('READ', 'xGMSxGMS_nom', req => GMSNOMCP_GMS_SRV.run(req.query)); 
      srv.on('READ', 'znompudelivery', req => GMSNOMCP_GMS_SRV.run(req.query));
      srv.on('getNominationsByCustomer', async (req) => {
        const {
            DocType,
            Customer,
            $skip = 0,
            $top = 100
        } = req.data;
        // Validate the input parameters
        if (!DocType || !Customer) {
            req.error(400, 'Invalid request. Both DocType and Customer parameters are required.');
            return;
        }
 
        console.log("[INFO] Request received for getNominationsByCustomer", {
            DocType,
            Customer,
            $skip,
            $top
        });
        console.log(req.data)
        try {
            // Build query to fetch nominations with pagination
            const query = SELECT.from('ZNOMMASTER5', ['Vbeln', 'Auart', 'ContractDescription' ])
                .where({
                    DocType,
                    Customer 
                })
                .limit({
                    rows: $top,
                    offset: $skip
                });
 
            console.log("[INFO] Executing query to fetch nominations", {
                query: query.toString()
            });
 
            // Execute the query using the CAP CDS service
            const resultRes = await GMSNOMCP_GMS_SRV.run(query);
 
            if (!resultRes || resultRes.length === 0) {
                console.log("[INFO] No nominations found for the given criteria.");
                return []; // Return an empty array if no results
            }
 
 
            console.log("[INFO] Query successful. Returning nominations", {
                count: resultRes.length
            });
 
            return resultRes;
 
        } catch (error) {
            console.error("[ERROR] Error fetching nominations", {
                errorMessage: error.message,
                stack: error.stack,
            });
 
            // Return an appropriate error response
            req.error(500, 'An unexpected error occurred while fetching nominations. Please try again later.');
            return [];
        }
    });
    //******************* getContractDetailsAndPastNom *****************************/

    srv.on('getContractDetailsAndPastNom', async (req) => {
        const { Vbeln: rawVbeln, $skip = 0, $top = 100 } = req.data;
    
        // Validate Vbeln
        const Vbeln = rawVbeln?.split('?')[0];
        if (!Vbeln) {
            req.error(400, 'Invalid request. Vbeln parameter is required.');
            return;
        }
    
        console.log("[INFO] Fetching data for Vbeln:", Vbeln);
    
        try {
            // Fetch data concurrently
            const queryPromises = [
                GMSNOMCP_GMS_SRV.run(SELECT.from('ZNOMMASTER5').where({ Vbeln })),
                GMSNOMCP_GMS_SRV.run(SELECT.from('ZNOMMASTER10').where({ Vbeln })),
                GMSNOMCP_GMS_SRV.run(SELECT.from('ZNOMMASTER7').where({ Vbeln })),
                GMSNOMCP_GMS_SRV.run(SELECT.from('xGMSxPast_Nom').where({ Vbeln })),
                GMSNOMCP_GMS_SRV.run(SELECT.from('ZNOMMASTER6').where({ Vbeln }))
            ];
    
            const [
                resultContractDetails,
                resultMinMax,
                resultDelOrRedlv,
                resultPastNom,
                resultContractMat
            ] = await Promise.all(queryPromises);
    
            // Validate Contract Details
            if (!resultContractDetails.length) {
                req.error(404, 'No contract details found for the provided Vbeln.');
                return;
            }
    
            const contractDetails = resultContractDetails[0];
    
            // Prepare lookup maps
            const minMaxMap = resultMinMax.reduce((map, { ItemNo, Material, ClauseCode, CalculatedValue }) => {
                const key = `${ItemNo}_${Material}`;
                if (!map[key]) map[key] = [];
                map[key].push({ label: ClauseCode.trim(), value: CalculatedValue });
                return map;
            }, {});
    
            const delOrRedlvMap = resultDelOrRedlv.reduce((map, item) => {
                const key = `${item.ItemNo}_${item.Material}`;
                map[key] = { RedeliveryPt: item.RedeliveryPt, DeliveryPt: item.DeliveryPt };
                return map;
            }, {});
    
            const pastNomMap = resultPastNom.reduce((map, item) => {
                const key = `${item.Vbeln}_${item.Material}`;
                if (!map[key]) map[key] = [];
                map[key].push(item);
                return map;
            }, {});
    
            // Construct Response
            const customResponse = resultContractMat.map(({ ItemNo, Material, DCQ, UOM }) => {
                const key = `${ItemNo}_${Material}`;
                const dynamicFields = [
                    ...minMaxMap[key] || [],
                    { label: "DCQ", value: DCQ } // Add DCQ field dynamically
                ];
    
                return {
                    Vbeln: contractDetails.Vbeln,
                    Auart: contractDetails.Auart,
                    DocType: contractDetails.DocType,
                    ValidFrom: contractDetails.ValidFrom,
                    ValidTo: contractDetails.ValidTo,
                    ContractDescription: contractDetails.ContractDescription,
                    ItemNo,
                    Material,
                    DCQ,
                    UOM,
                    RedeliveryPt: delOrRedlvMap[key]?.RedeliveryPt || '',
                    DeliveryPt: delOrRedlvMap[key]?.DeliveryPt || '',
                    PastNominations: pastNomMap[`${contractDetails.Vbeln}_${Material}`] || [],
                    dynamicFields
                };
            });
    
            console.log("[INFO] Query successful. Returning response", { count: customResponse.length });
            return customResponse;
        } catch (error) {
            console.error("[ERROR] Error processing getContractDetailsAndPastNom", {
                message: error.message,
                stack: error.stack
            });
            req.error(500, 'An unexpected error occurred while fetching contract details and nominations. Please try again later.');
            return [];
        };

        
    });

    //******************* getNominationDetailsByGasDay *****************************/
    srv.on('getNominationDetailsByGasDay', async (req) => {
        const { Gasday, Vbeln, $skip = 0, $top = 100 } = req.data;
        console.log(req, Gasday, Vbeln);
        try {
            // Fetch data concurrently
            const queryResults = await Promise.all([
                GMSNOMCP_GMS_SRV.run(SELECT.from('ZNOMMASTER5').where({
                    Vbeln
                })),
                GMSNOMCP_GMS_SRV.run(SELECT.from('ZNOMMASTER10').where({
                    Vbeln
                })),
                GMSNOMCP_GMS_SRV.run(SELECT.from('ZNOMMASTER7').where({
                    Vbeln
                })),
                GMSNOMCP_GMS_SRV.run(SELECT.from('xGMSxPast_Nom').where({
                    Vbeln
                })),
                GMSNOMCP_GMS_SRV.run(SELECT.from('ZNOMMASTER6').where({
                    Vbeln
                })),
                GMSNOMCP_GMS_SRV.run(SELECT.from('xGMSxGMS_nom').where({
                    Vbeln,
                    Gasday
                }))
            ]);

            const [
                resultContractDetails,
                resultMinMax,
                resultDelOrRedlv,
                resultPastNom,
                resultContractMat,
                resultSubmittedDNQ
            ] = queryResults;

            if (!resultContractDetails.length) {
                req.error(404, 'No contract details found for the provided Vbeln.');
                return;
            }

            const contractDetails = resultContractDetails[0];

            // Prepare lookup maps
            const minMaxMap = Object.fromEntries(
                resultMinMax.map(({
                    ItemNo,
                    Material,
                    ClauseCode,
                    CalculatedValue
                }) => [
                    `${ItemNo}_${Material}`,
                    [{
                        label: ClauseCode.trim(),
                        value: CalculatedValue
                    }]
                ])
            );

            const delOrRedlvMap = Object.fromEntries(
                resultDelOrRedlv.map(({
                    ItemNo,
                    Material,
                    RedeliveryPt,
                    DeliveryPt
                }) => [
                    `${ItemNo}_${Material}`,
                    {
                        RedeliveryPt,
                        DeliveryPt
                    }
                ])
            );

            const pastNomMap = resultPastNom.reduce((map, item) => {
                const key = `${item.Vbeln}_${item.Material}`;
                if (!map[key]) map[key] = [];
                map[key].push(item);
                return map;
            }, {});

            const pdnqMap = new Map();
            resultSubmittedDNQ.forEach(({
                Vbeln,
                Material,
                Redelivery,
                deliveryPoint,
                PDnq
            }) => {
                const key = `${Vbeln}-${Material}-${Redelivery || deliveryPoint}`;
                pdnqMap.set(key, PDnq);
            });

            // Construct response
            const customResponse = resultContractMat.map(({
                ItemNo,
                Material,
                DCQ,
                UOM
            }) => {
                const key = `${ItemNo}_${Material}`;
                const pdnqKey = `${contractDetails.Vbeln}-${Material}-${delOrRedlvMap[key]?.RedeliveryPt || delOrRedlvMap[key]?.DeliveryPt}`;
                return {
                    Vbeln: contractDetails.Vbeln,
                    Auart: contractDetails.Auart,
                    DocType: contractDetails.DocType,
                    ValidFrom: contractDetails.ValidFrom,
                    ValidTo: contractDetails.ValidTo,
                    ContractDescription: contractDetails.ContractDescription,
                    ItemNo,
                    Material,
                    DCQ,
                    UOM,
                    RedeliveryPt: delOrRedlvMap[key] ?.RedeliveryPt || '',
                    DeliveryPt: delOrRedlvMap[key] ?.DeliveryPt || '',
                    PDnq: pdnqMap.get(pdnqKey) || '',
                    PastNominations: pastNomMap[`${contractDetails.Vbeln}_${Material}`] || [],
                    dynamicFields: [
                        ...(minMaxMap[key] || []),
                        {
                            label: 'DCQ',
                            value: DCQ
                        }
                    ]
                };
            });

            console.log('[INFO] Query successful. Returning response', {
                count: customResponse.length
            });
            return customResponse;
        } catch (error) {
            console.error('[ERROR] Error processing getContractDetailsAndPastNom', {
                message: error.message,
                stack: error.stack
            });
            req.error(500, 'An unexpected error occurred while fetching contract details and nominations. Please try again later.');
            return [];
        }
        
    });
    srv.on('getNominationDetails', async (req) => {
        const { Vbeln, Gasday } = req.data;
    
        console.log(`[INFO] Fetching nomination details for Vbeln: ${Vbeln}, Gasday: ${Gasday}`);
    
        try {
            const query = SELECT.from('nomi_SaveSet').where({
                Vbeln,
                Gasday:"2024-02-28T00:00:00Z"   // Ensure correct datetime format
            });
    
            const results = await ZNOM_CREATE_SRV.run(query);
    
            if (!results.length) {
                req.error(404, `No nominations found for Vbeln: ${Vbeln} and Gasday: ${Gasday}`);
                return;
            }
    
            return results;
    
        } catch (error) {
            console.error("[ERROR] Error fetching nomination details:", error.message);
            req.error(500, `Failed to fetch nomination details: ${error.message}`);
        }
    });



}