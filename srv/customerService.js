const cds = require('@sap/cds');

module.exports = async (srv) => 
{        
    // Using CDS API      
    const GMSVENDOR_DATA_NAV_CDS = await cds.connect.to("GMSVENDOR_DATA_NAV_CDS"); 
      srv.on('READ', 'xGMSxVendor_Data', req => GMSVENDOR_DATA_NAV_CDS.run(req.query)); 
      srv.on('READ', 'xGMSxVendor_Data_Nav', async (req) => {
        const GMSVENDOR_DATA_NAV_CDS = await cds.connect.to("GMSVENDOR_DATA_NAV_CDS");

        const result = await GMSVENDOR_DATA_NAV_CDS.run(req.query);

        // Remove duplicates based on 'Sold_Party'
        const uniqueResults = [];
        const soldPartySet = new Set();

        result.forEach(item => {
            if (!soldPartySet.has(item.Sold_Party)) {
                soldPartySet.add(item.Sold_Party);
                uniqueResults.push(item);
            }
        });

        return uniqueResults;  // Return only unique Sold_Party entries
    });
 
      const GMSTICKET_API_SRV = await cds.connect.to("GMSTICKET_API_SRV"); 
      srv.on('READ', 'xGMSxTKTDETAILS03', req => GMSTICKET_API_SRV.run(req.query));
      srv.on('READ', 'CreateTicket', req => GMSTICKET_API_SRV.run(req.query)); 
      srv.on('READ', 'TicketHeaderSet', req => GMSTICKET_API_SRV.run(req.query)); 
      srv.on('READ', 'TicketItemsSet', req => GMSTICKET_API_SRV.run(req.query)); 
      srv.on('READ', 'returnSet', req => GMSTICKET_API_SRV.run(req.query)); 
      srv.on('READ', 'xGMSxTKTDETAILS02', req => GMSTICKET_API_SRV.run(req.query));

      const GMSVALUEHELP_SRV = await cds.connect.to("GMSVALUEHELP_SRV");
      srv.on('READ', 'xGMSxUOM_value', req => GMSVALUEHELP_SRV.run(req.query));
      srv.on('READ', 'xGMSxLocPoint_DP', req => GMSVALUEHELP_SRV.run(req.query));
      srv.on('READ', 'xGMSxLocPoint_RDP', req => GMSVALUEHELP_SRV.run(req.query));

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

    srv.on("getServiceProfile", async (req) => {
        const { documentNo } = req.data;

        if (!documentNo) {
            return req.error(400, "DocumentNo is required");
        }

        try {
            const results = await igmsConfigMetaData.run(
                SELECT.from("DocumentNoProfileMapping")
                    .columns(["serviceProfileName", "serviceProfileDesc"])
                    .where({ DocumentNo: documentNo })
            );

            return results;
        } catch (error) {
            console.error("Error fetching service profiles:", error);
            req.error(500, "Internal Server Error");
        }
    });
     
    srv.on('getSoldtoPartyData', async (req) => {
        const { Sold_Party } = req.data;  // Extract the BillingDate from the request data

        try {
            // Connect to the required service (e.g., ZGMSDOCFLOW7_CDS or your specific CDS model)
            const GMSVENDOR_DATA_NAV_CDS = await cds.connect.to("GMSVENDOR_DATA_NAV_CDS");

            // Fetch invoice data based on the BillingDate
            const result = await GMSVENDOR_DATA_NAV_CDS.run(
                SELECT.from('xGMSxVendor_Data')  // Replace with the actual entity name
                    .where({ Sold_Party: { '=': Sold_Party } })
            );

            return result;  // Return the result to the client
        } catch (error) {
            console.error('Error fetching invoice data:', error);
            throw new Error('Failed to fetch invoice data');
        }
    });

    srv.on('FetchPlantsByMaterial', async (req) => {
        const { Material } = req.data; // Extract Material from request

        console.log("Fetching plants for Material:", Material); // Debugging

        if (!Material) {
            return req.reject(400, "Material is required");
        }

        // Fetch relevant records from the database
        const materialData = await GMSMATERIAL_DATA_CDS.run(
            SELECT.from('xGMSxMaterial_Data').where({ Material })
        );

        console.log("Fetched Data:", materialData); // Debugging output

        if (!materialData.length) {
            console.log(`No data found for Material: ${Material}`);
            return []; // Return empty array if no matching material is found
        }

        // Extract unique Plants
        const uniquePlants = [];
        const plantSet = new Set();

        materialData.forEach(item => {
            const plantKey = `${item.Plant}-${item.PlantDesc}`;
            if (!plantSet.has(plantKey)) {
                plantSet.add(plantKey);
                uniquePlants.push({
                    Plant: item.Plant,
                    PlantDesc: item.PlantDesc
                });
            }
        });

        console.log("Returning Plants:", uniquePlants); // Debugging output

        return uniquePlants; // Return the array of plants
    });

     const GMSMATERIAL_DATA_CDS = await cds.connect.to("GMSMATERIAL_DATA_CDS"); 
    srv.on('READ', 'xGMSxMaterial_Data', async (req) => {
        const materialData = await GMSMATERIAL_DATA_CDS.run(req.query);

        // Group data by Material
        const uniqueMaterials = {};
        materialData.forEach((item) => {
            const key = item.Material;

            if (!uniqueMaterials[key]) {
                uniqueMaterials[key] = {
                    Material: item.Material,
                    Description: item.Description || item.Des, // Handle alias for Description
                    Plants: [{ Plant: item.Plant, PlantDesc: item.PlantDesc }],
                    UOMs: [item.UOM]
                };
            } else {
                // Add unique Plant
                const plantExists = uniqueMaterials[key].Plants.some(
                    (plant) => plant.Plant === item.Plant
                );
                if (!plantExists) {
                    uniqueMaterials[key].Plants.push({
                        Plant: item.Plant,
                        PlantDesc: item.PlantDesc
                    });
                }

                // Add unique UOM
                if (!uniqueMaterials[key].UOMs.includes(item.UOM)) {
                    uniqueMaterials[key].UOMs.push(item.UOM);
                }
            }
        });

        return Object.values(uniqueMaterials);
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