// api/get-inventory/route.js

import { TableClient, AzureNamedKeyCredential } from "@azure/data-tables";

export async function GET(req) {
  console.log("API Endpoint Hit: /api/get-inventory");

  const url = new URL(req.url);
  const timestamp = url.searchParams.get("timestamp");

  if (!timestamp) {
    console.error("Missing timestamp parameter.");
    return new Response(
      JSON.stringify({ error: "Missing timestamp parameter." }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          "Pragma": "no-cache",
          "Expires": "0",
        },
      }
    );
  }

  const TABLE_ACCOUNT_NAME = "vipernest";
  const TABLE_ACCOUNT_KEY = process.env.TABLE_ACCOUNT_KEY; // Account Key only
  const TABLE_NAME = "azureAscendantsMeltyMagicInventory";

  if (!TABLE_ACCOUNT_KEY) {
    console.error("Azure Table Storage account key is not configured.");
    return new Response(
      JSON.stringify({ error: "Azure Table Storage account key is not configured." }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          "Pragma": "no-cache",
          "Expires": "0",
        },
      }
    );
  }

  try {
    // Initialize Azure Table Storage Client
    const credential = new AzureNamedKeyCredential(TABLE_ACCOUNT_NAME, TABLE_ACCOUNT_KEY);
    const tableClient = new TableClient(
      `https://${TABLE_ACCOUNT_NAME}.table.core.windows.net`,
      TABLE_NAME,
      credential
    );

    const inventory = [];

    // Fetch all entities from the table
    for await (const entity of tableClient.listEntities()) {
      inventory.push(entity);
    }

    const headers = new Headers();
    headers.set("Content-Type", "application/json");
    headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    headers.set("Pragma", "no-cache");
    headers.set("Expires", "0");

    console.log(`Inventory data fetched at timestamp: ${timestamp}`);
    return new Response(JSON.stringify({ inventory }), { status: 200, headers });
  } catch (error) {
    console.error("Error fetching inventory data:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch inventory data" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          "Pragma": "no-cache",
          "Expires": "0",
        },
      }
    );
  }
}


// // api/get-inventory/route.js

// import { TableClient, AzureNamedKeyCredential } from "@azure/data-tables";

// export async function GET(req) {
//   const TABLE_ACCOUNT_NAME = "vipernest";
//   const TABLE_ACCOUNT_KEY = process.env.TABLE_ACCOUNT_KEY; // Account Key only
//   const TABLE_NAME = "azureAscendantsMeltyMagicInventory";

//   try {
//     // Initialize Azure Table Storage Client
//     const credential = new AzureNamedKeyCredential(TABLE_ACCOUNT_NAME, TABLE_ACCOUNT_KEY);
//     const tableClient = new TableClient(
//       `https://${TABLE_ACCOUNT_NAME}.table.core.windows.net`,
//       TABLE_NAME,
//       credential
//     );

//     const inventory = [];

//     // Fetch all entities from the table
//     for await (const entity of tableClient.listEntities()) {
//       inventory.push(entity);
//     }

//     // Return the inventory as JSON
//     return new Response(JSON.stringify({ inventory }), { status: 200 });
//   } catch (error) {
//     console.error("Error fetching inventory data:", error);
//     return new Response(JSON.stringify({ error: "Failed to fetch inventory data" }), { status: 500 });
//   }
// }
