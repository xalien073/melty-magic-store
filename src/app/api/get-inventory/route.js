// api/get-get-inventory/route.js

import { TableClient, AzureNamedKeyCredential } from "@azure/data-tables";

export async function GET(req) {
  const TABLE_ACCOUNT_NAME = "vipernest";
  const TABLE_ACCOUNT_KEY = process.env.TABLE_ACCOUNT_KEY; // Account Key only
  const TABLE_NAME = "azureAscendantsMeltyMagicInventory";

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

    // Return the inventory as JSON
    return new Response(JSON.stringify({ inventory }), { status: 200 });
  } catch (error) {
    console.error("Error fetching inventory data:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch inventory data" }), { status: 500 });
  }
}
